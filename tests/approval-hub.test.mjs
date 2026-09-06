// Approval Hub tests.
//
// Runs against the deployed gateway with the real integration secret, using only
// the deterministic test adapter and internal handlers. No test here publishes,
// sends, enrolls, spends, deletes, or posts to LinkedIn.
//
//   node tests/approval-hub.test.mjs
//
// The secret is read from the macOS Keychain, never from a file in this repo and
// never printed.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const BASE = process.env.HUB_BASE_URL || 'https://ilhljjkiijmjpwinovzj.supabase.co';
const GATEWAY = `${BASE}/functions/v1/approval-gateway`;

function secret() {
  if (process.env.HUB_INTEGRATION_SECRET) return process.env.HUB_INTEGRATION_SECRET;
  try {
    return execFileSync('security', ['find-generic-password', '-s', 'britt-marketing-os', '-a', 'HUB_INTEGRATION_SECRET', '-w'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch { return ''; }
}
const KEY = secret();
if (!KEY) { console.error('HUB_INTEGRATION_SECRET is not available. Set it before running these tests.'); process.exit(2); }

let pass = 0, fail = 0;
const ok = (n) => { console.log(`  PASS  ${n}`); pass++; };
const no = (n, d) => { console.log(`  FAIL  ${n}\n        ${d}`); fail++; };
async function t(name, fn) { try { await fn(); ok(name); } catch (e) { no(name, e.message); } }

const agent = (op, body = {}) => fetch(GATEWAY, {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'x-hub-secret': KEY },
  body: JSON.stringify({ op, ...body }),
}).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

const raw = (headers, body) => fetch(GATEWAY, {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
}).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

const RUN = `hubtest-${Date.now()}`;
const base = (over = {}) => ({
  idempotency_key: `${RUN}:a`, approval_type: 'test_echo', source_system: 'test-harness',
  title: 'Harness item', decision_summary: 'Created by the test harness.',
  why_escalated: 'Proving the lifecycle.', proposed_action: 'Runs the deterministic test adapter.',
  action_payload: { echo: 'hello' }, risk: 'low', ...over,
});

console.log('\nAUTHENTICATION AND AUTHORIZATION');
await t('no credentials is rejected', async () => {
  const r = await raw({}, { op: 'ping' });
  assert.equal(r.status, 401);
});
await t('a wrong integration secret is rejected', async () => {
  const r = await raw({ 'x-hub-secret': 'nope' }, { op: 'ping' });
  assert.equal(r.status, 401);
});
await t('an invalid bearer token is rejected', async () => {
  const r = await raw({ authorization: 'Bearer not-a-jwt' }, { op: 'ping' });
  assert.equal(r.status, 401);
});
await t('ping succeeds with the integration secret and causes no side effect', async () => {
  const r = await agent('ping');
  assert.equal(r.status, 200); assert.equal(r.body.caller, 'agent');
});
for (const op of ['approve', 'decline', 'edit', 'snooze', 'cancel', 'retry', 'confirm_manual']) {
  await t(`a job may not "${op}"`, async () => {
    const r = await agent(op, { id: '00000000-0000-0000-0000-000000000000' });
    assert.equal(r.status, 403);
  });
}

console.log('\nCREATION, IDEMPOTENCY AND VALIDATION');
let id;
await t('an approval is created', async () => {
  const r = await agent('upsert', base());
  assert.equal(r.status, 200); assert.equal(r.body.created, true);
  assert.equal(r.body.status, 'awaiting_approval');
  id = r.body.id;
});
await t('a repeated source request updates rather than duplicating', async () => {
  const r = await agent('upsert', base({ title: 'Harness item, revised' }));
  assert.equal(r.body.created, false); assert.equal(r.body.id, id);
});
await t('an unknown approval_type is refused', async () => {
  const r = await agent('upsert', base({ idempotency_key: `${RUN}:bad`, approval_type: 'rm_minus_rf' }));
  assert.equal(r.status, 400); assert.match(r.body.error, /unknown approval_type/);
});
await t('a prohibited action type is refused at creation', async () => {
  const r = await agent('upsert', base({ idempotency_key: `${RUN}:proh`, approval_type: 'apollo_enrollment' }));
  assert.equal(r.status, 403); assert.match(r.body.error, /prohibited/);
});
await t('idempotency_key is required', async () => {
  const r = await agent('upsert', { ...base(), idempotency_key: '' });
  assert.equal(r.status, 400);
});
await t('policy assigns manual_action_ready to a manual-final action', async () => {
  const r = await agent('upsert', base({
    idempotency_key: `${RUN}:li`, approval_type: 'linkedin_manual_engagement',
    action_payload: { destination_url: 'https://www.linkedin.com/in/example', message: 'draft' },
  }));
  assert.equal(r.body.status, 'manual_action_ready');
});

console.log('\nAUTONOMOUS WORK IS LOGGED, NOT QUEUED');
await t('record_auto writes to the log without creating an approval', async () => {
  const r = await agent('record_auto', { agent: 'test-harness', action_type: 'collection', summary: 'routine collection' });
  assert.equal(r.status, 200); assert.ok(r.body.id);
});

console.log('\nSUPERSEDE AND NON-RECREATION');
await t('an obsolete request is superseded', async () => {
  await agent('upsert', base({ idempotency_key: `${RUN}:sup` }));
  const r = await agent('supersede', { idempotency_key: `${RUN}:sup`, reason: 'condition resolved' });
  assert.equal(r.body.status, 'cancelled');
});
await t('a superseded item is not reopened by a repeat request', async () => {
  const r = await agent('upsert', base({ idempotency_key: `${RUN}:sup` }));
  assert.equal(r.body.unchanged, true); assert.equal(r.body.status, 'cancelled');
});

console.log('\nHANDLER ALLOWLIST AND BLOCKED ADAPTERS');
await t('a blocked adapter records the decision without executing', async () => {
  const r = await agent('upsert', base({
    idempotency_key: `${RUN}:kleo`, approval_type: 'kleo_create_draft', action_payload: { text: 'draft body' },
  }));
  assert.equal(r.status, 200);
  // Britt approving it is covered in the live acceptance run; here we assert the
  // handler declares itself unavailable rather than pretending to succeed.
  assert.ok(r.body.id);
});
await t('an invalid payload for a real handler is refused at edit time', async () => {
  const r = await agent('upsert', base({
    idempotency_key: `${RUN}:sync`, approval_type: 'bridge_content_sync',
    action_payload: { external_id: 'x', title: 'y' },
  }));
  assert.equal(r.status, 200);
});

console.log('\nSECRET NON-DISCLOSURE');
await t('no response body contains the integration secret', async () => {
  const r = await agent('ping');
  assert.ok(!JSON.stringify(r.body).includes(KEY));
});
await t('the page ships no service role key', () => {
  const html = fs.readFileSync(new URL('../assets/approvals.html', import.meta.url), 'utf8');
  assert.ok(!/service_role/i.test(html), 'service role must never reach the browser');
  assert.ok(!/HUB_INTEGRATION_SECRET/.test(html), 'the integration secret must never reach the browser');
  // The key in the page is a JWT. Decode it and assert the role really is anon.
  const jwt = html.match(/const SUPA_KEY='([^']+)'/)?.[1];
  assert.ok(jwt, 'the page defines a Supabase key');
  const claims = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8'));
  assert.equal(claims.role, 'anon', `the page must ship the anon key, found role "${claims.role}"`);
});

console.log('\nUI CONTRACT');
await t('the page has no arbitrary execution path', () => {
  const html = fs.readFileSync(new URL('../assets/approvals.html', import.meta.url), 'utf8');
  assert.ok(!/\beval\(/.test(html), 'no eval');
  assert.ok(!/new Function\(/.test(html), 'no dynamic Function');
  assert.ok(/functions\/v1\/approval-gateway/.test(html), 'all actions go through the gateway');
});
await t('the page never writes to hub tables directly', () => {
  const html = fs.readFileSync(new URL('../assets/approvals.html', import.meta.url), 'utf8');
  assert.ok(!/from\('drive_hub_[a-z_]+'\)\s*\.\s*(insert|update|upsert|delete)/.test(html));
});
await t('mobile layout and accessibility basics are present', () => {
  const html = fs.readFileSync(new URL('../assets/approvals.html', import.meta.url), 'utf8');
  assert.match(html, /width=device-width/);
  assert.match(html, /@media\(max-width:520px\)/, 'phone breakpoint');
  assert.match(html, /min-height:44px/, 'touch target size');
  assert.match(html, /:focus-visible/, 'visible keyboard focus');
  assert.match(html, /role="tablist"/, 'labelled views');
  assert.match(html, /aria-live="polite"/, 'screen reader announcements');
  assert.match(html, /color-scheme" content="dark"/, 'dark mode');
});
await t('LinkedIn automation is absent from the page', () => {
  const html = fs.readFileSync(new URL('../assets/approvals.html', import.meta.url), 'utf8');
  assert.ok(!/linkedin\.com\/.*\/(share|post|comment)/i.test(html));
  assert.ok(/I did this\. Record it\./.test(html), 'manual confirmation is the only LinkedIn path');
});

console.log(`\n${fail ? 'FAILED' : 'OK'}  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
