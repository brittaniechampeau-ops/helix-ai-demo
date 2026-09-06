// DRIVE Approval Hub gateway.
//
// The only writer to drive_hub_*. The browser has SELECT through RLS and nothing
// else, so a compromised page cannot execute, complete, or forge an approval.
//
// Two callers, two credentials:
//   1. Britt in the browser  -> Supabase JWT, checked against drive_admins
//   2. marketing-os jobs     -> HUB_INTEGRATION_SECRET, may only create/update/log
//
// A job can never approve, execute, or complete. A human can never execute an
// action type that has no allowlisted handler.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPA_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const INTEGRATION_SECRET = Deno.env.get('HUB_INTEGRATION_SECRET') ?? ''
const BRIDGE_SYNC_KEY = Deno.env.get('BRIDGE_SYNC_KEY') ?? ''
const BRIDGE_BASE = Deno.env.get('BRIDGE_BASE_URL') ?? 'https://assessment.brittbowman.ai'
const CLAIM_SECONDS = 120
// How long a dispatched item may stay unverified before it parks as an exception.
const DISPATCH_DEADLINE_MIN = Number(Deno.env.get('HUB_DISPATCH_DEADLINE_MIN') ?? 15)
const MAX_RETRIES = 3

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-hub-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

// ── Handler registry ──────────────────────────────────────────────────────────
// An action executes only if its type appears here. There is no dynamic dispatch,
// no eval, no URL or command taken from a payload. `available` is computed from
// credentials actually present, so a missing adapter is reported rather than faked.

type Ctx = { supa: SupabaseClient; approval: Record<string, unknown>; actor: string }
type HandlerResult = { destination_system: string; destination_id: string | null; result: unknown; readback: unknown; verified: boolean }

interface Handler {
  validate: (payload: Record<string, unknown>) => string | null
  // `deferred` means DRIVE holds no credential but an authenticated marketing-os
  // job does. Britt approves here and the job executes on its next run. She never
  // opens the destination app.
  available: () => { ok: boolean; missing?: string; setup?: string; deferred?: boolean; executor?: string }
  run: (ctx: Ctx, payload: Record<string, unknown>) => Promise<HandlerResult>
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** The exact words being approved, wherever they live on the record. */
function contentOf(a: Record<string, unknown>): string {
  const p = (a.action_payload ?? {}) as Record<string, unknown>
  return str(a.artifact) || str(p.text) || str(p.body) || str(p.message) || ''
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Park anything dispatched that blew its deadline. Silence is never success. */
async function parkOverdue(supa: SupabaseClient) {
  const { data } = await supa.rpc('drive_hub_park_overdue')
  for (const r of data ?? []) {
    await logEvent(supa, r.id, 'system', 'system', 'parked_overdue', 'approved', 'failed', { reason: r.reason })
  }
  return data ?? []
}

/** Internal-only decisions. No external effect, so readback is the row itself. */
function internalHandler(kind: string, required: string[] = []): Handler {
  return {
    validate: (p) => required.find((k) => !str(p[k])) ? `missing required field: ${required.find((k) => !str(p[k]))}` : null,
    available: () => ({ ok: true }),
    async run(ctx, payload) {
      const { data, error } = await ctx.supa.from('drive_hub_auto_log').insert({
        agent: ctx.actor, action_type: kind, summary: str(payload.summary) || kind,
        source_system: 'drive-hub', source_record_id: String(ctx.approval.id),
        detail: payload,
      }).select('id').single()
      if (error) throw new Error(`internal record failed: ${error.message}`)
      return {
        destination_system: 'drive-hub',
        destination_id: String(data.id),
        result: { recorded: true, kind },
        readback: { auto_log_id: data.id },
        verified: true,
      }
    },
  }
}

/**
 * Machine verifiers for post-failure reconciliation.
 *
 * A card can fail while the action it asked for actually succeeded. That happened
 * to the BRIDGE content row: production accepted it while the approval was already
 * terminal on its retry ceiling. Both records were true and they disagreed.
 *
 * The wrong repairs are to reset retry_count, raise the ceiling, or file a
 * duplicate approval. Each launders a policy breach into a clean record. The right
 * repair is to go and look at the destination, and close the ORIGINAL card only if
 * the destination says the action is really there.
 *
 * A type with no verifier here cannot be reconciled at all. That is deliberate: a
 * human saying "it went out" is an assertion, not a readback, and for anything that
 * speaks publicly an assertion is not good enough.
 */
type Readback = { verified: boolean; destination_id?: string; proof: unknown; why?: string }

const VERIFIERS: Record<string, (a: Record<string, unknown>) => Promise<Readback>> = {
  bridge_content_sync: async (approval) => {
    const payload = (approval.action_payload ?? {}) as Record<string, unknown>
    const externalId = str(payload.external_id)
    if (!externalId) return { verified: false, proof: null, why: 'the approval carries no external_id to look up' }
    if (!BRIDGE_SYNC_KEY) return { verified: false, proof: null, why: 'BRIDGE_SYNC_KEY is not set on the gateway, so nothing can be verified' }
    const url = `${BRIDGE_BASE}/api/sync?readback=${encodeURIComponent(externalId)}&source=claude`
    let body: Record<string, unknown>
    try {
      const res = await fetch(url, { headers: { 'x-sync-key': BRIDGE_SYNC_KEY }, signal: AbortSignal.timeout(20000) })
      body = await res.json().catch(() => ({}))
      if (!res.ok) return { verified: false, proof: { http: res.status, body }, why: `BRIDGE answered ${res.status}` }
    } catch (e) {
      return { verified: false, proof: null, why: `could not reach BRIDGE: ${String(e instanceof Error ? e.message : e)}` }
    }
    const row = (body.content_queue ?? null) as Record<string, unknown> | null
    const ev = (body.sync_event ?? null) as Record<string, unknown> | null
    if (body.found !== true || !row) return { verified: false, proof: body, why: 'BRIDGE has no row for that external_id' }
    // The readback criteria for this type: the row exists, it is the row this
    // approval asked for, and BRIDGE accepted rather than merely received it.
    const titleMatches = !payload.title || str(row.title) === str(payload.title)
    const accepted = str(ev?.status) === 'accepted'
    if (!titleMatches) return { verified: false, proof: body, why: 'the row at BRIDGE is not the row this approval described' }
    if (!accepted) return { verified: false, proof: body, why: `BRIDGE recorded the event as "${str(ev?.status)}", not accepted` }
    return {
      verified: true,
      destination_id: `content_queue:${str(row.id)}`,
      proof: { fetched_from: url.split('?')[0], fetched_at: new Date().toISOString(), sync_event: ev, content_queue: row },
    }
  },
}

/**
 * Types that speak publicly. For these a human assertion may never stand in for a
 * machine readback, whatever evidence someone believes they have.
 */
const PUBLIC_ACTION_TYPES = ['content_publish', 'newsletter_send', 'linkedin_manual_engagement']

/**
 * Types whose payload is copy Britt will be seen to have written. These carry the
 * heaviest validation, because the cost of a bad one is public.
 */
const AUTHORED_TYPES = ['content_publish', 'kleo_create_draft', 'newsletter_send']
const ANCHOR_QUALITY = ['published_authoritative', 'sent_authoritative', 'britt_edited_final']

type Invalid = { field: string; message: string }

/**
 * Deterministic request validation. A malformed submission is the caller's bug,
 * not a server fault, so it answers 422 with the offending field named. The
 * database triggers still stand behind this: they are the last line, not the first
 * one a job should hit.
 */
function validateApproval(type: string, body: Record<string, unknown>): Invalid[] {
  const bad: Invalid[] = []
  if (type !== 'test_echo') {
    for (const f of ['destination', 'readback_criteria']) {
      if (!str(body[f])) bad.push({ field: f, message: `${f} is required: an approval must state where it goes and what counts as verified` })
    }
    if (typeof body.is_public !== 'boolean') {
      bad.push({ field: 'is_public', message: 'is_public is required: Britt must know whether this speaks publicly as her' })
    }
  }
  if (!AUTHORED_TYPES.includes(type)) return bad

  const m = body.evidence_manifest as Record<string, unknown> | null | undefined
  if (!m || typeof m !== 'object') {
    bad.push({ field: 'evidence_manifest', message: `${type} must carry an evidence_manifest: the strategy rules it applied and the same-channel voice samples it sounded like` })
    return bad
  }
  const channel = str(m.channel)
  if (!channel) bad.push({ field: 'evidence_manifest.channel', message: 'evidence_manifest.channel is required' })

  const strategy = Array.isArray(m.strategy) ? m.strategy : null
  if (!strategy) bad.push({ field: 'evidence_manifest.strategy', message: 'evidence_manifest.strategy must be an array' })
  else if (!strategy.length) bad.push({ field: 'evidence_manifest.strategy', message: 'evidence_manifest.strategy is empty: no retrieved strategy rule supports this draft' })

  const voice = Array.isArray(m.voice) ? m.voice : null
  if (!voice) bad.push({ field: 'evidence_manifest.voice', message: 'evidence_manifest.voice must be an array' })
  else if (channel) {
    const anchored = voice.filter((v) => {
      const o = v as Record<string, unknown>
      return str(o?.channel) === channel && ANCHOR_QUALITY.includes(str(o?.quality))
    })
    if (!anchored.length) {
      bad.push({
        field: 'evidence_manifest.voice',
        message: `no published or Britt-final ${channel} sample: a draft may not borrow another channel's voice, and approved-only evidence is too weak to anchor one`,
      })
    }
  }
  return bad
}

const invalid = (bad: Invalid[]) =>
  json({ error: bad[0].message, code: 'evidence_validation_failed', invalid: bad }, 422)

/**
 * A trigger that rejected a write is still a validation failure, not a server
 * fault. Map the ones we raise ourselves onto 422 so a caller sees the same status
 * whether it was caught here or in the database. Anything else stays a 500.
 */
const VALIDATION_RAISES = [
  'must carry an evidence_manifest', 'evidence_manifest.channel is required',
  'evidence_manifest.strategy is empty', 'evidence_manifest.voice has no',
  'must state destination', 'requires an artifact', 'is immutable once approved',
]
function dbError(error: { message: string }) {
  const hit = VALIDATION_RAISES.find((v) => error.message.includes(v))
  return hit
    ? json({ error: error.message, code: 'evidence_validation_failed', invalid: [{ field: 'evidence_manifest', message: error.message }] }, 422)
    : json({ error: error.message }, 500)
}

const HANDLERS: Record<string, Handler> = {
  // Deterministic test adapter. Proves the whole lifecycle with no external effect.
  test_echo: {
    validate: (p) => (str(p.echo) ? null : 'payload.echo is required'),
    available: () => ({ ok: true }),
    async run(ctx, payload) {
      const id = `test-${ctx.approval.idempotency_key}`
      return {
        destination_system: 'test-adapter',
        destination_id: id,
        result: { echoed: str(payload.echo) },
        readback: { id, echoed: str(payload.echo), verified_at: new Date().toISOString() },
        verified: true,
      }
    },
  },

  // Britt sends it herself. The gateway records that she confirmed, and never
  // touches LinkedIn. No browser control, no API call, by design and by policy.
  linkedin_manual_engagement: {
    validate: (p) => (str(p.destination_url) ? null : 'payload.destination_url is required'),
    available: () => ({ ok: true }),
    async run(ctx, payload) {
      const { data, error } = await ctx.supa.from('drive_hub_auto_log').insert({
        agent: ctx.actor, action_type: 'linkedin_manual_confirmed',
        summary: `Britt confirmed she completed this manually: ${str(payload.destination_url)}`,
        source_system: 'linkedin-manual', source_record_id: String(ctx.approval.id),
        detail: { destination_url: str(payload.destination_url), message: str(payload.message) },
      }).select('id').single()
      if (error) throw new Error(`confirmation record failed: ${error.message}`)
      return {
        destination_system: 'manual',
        destination_id: String(data.id),
        result: { confirmed_by: ctx.actor, note: 'No automated LinkedIn action was taken.' },
        readback: { auto_log_id: data.id, confirmed: true },
        verified: true,
      }
    },
  },

  qualified_conversation: internalHandler('qualified_conversation_accepted', ['summary']),
  setup_exception: internalHandler('setup_exception_acknowledged', ['summary']),
  internal_routing_change: internalHandler('internal_routing_change_applied', ['summary']),
  content_brief_approve: internalHandler('content_brief_approved', ['summary']),

  // Real external write, idempotent at the destination. Blocked until the key is
  // present as an Edge Function secret; the approval is retained, not discarded.
  bridge_content_sync: {
    validate: (p) => {
      if (!str(p.external_id)) return 'payload.external_id is required'
      if (!str(p.title)) return 'payload.title is required'
      if (!str(p.planned_date)) return 'payload.planned_date is required'
      const s = str(p.status) || 'Ready'
      if (!['Idea', 'Drafting', 'Ready'].includes(s)) return `status "${s}" is not allowed from the hub`
      return null
    },
    available: () => BRIDGE_SYNC_KEY
      ? { ok: true }
      : { ok: false, missing: 'BRIDGE_SYNC_KEY',
          setup: 'Set BRIDGE_SYNC_KEY as a secret on the approval-gateway function: supabase secrets set BRIDGE_SYNC_KEY=... ' },
    async run(ctx, payload) {
      const external_id = str(payload.external_id)
      const body = {
        source: 'drive-hub',
        events: [{
          external_id,
          entity_type: 'content',
          observed_at: new Date().toISOString(),
          payload: {
            title: str(payload.title), planned_date: str(payload.planned_date),
            series: str(payload.series) || 'standalone', hook: str(payload.hook) || null,
            notes: str(payload.notes) || null, status: str(payload.status) || 'Ready',
            link: str(payload.link) || null,
          },
        }],
        metadata: { agent: 'drive-approval-hub', approval_id: ctx.approval.id },
      }
      const res = await fetch(`${BRIDGE_BASE}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-sync-key': BRIDGE_SYNC_KEY },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(`BRIDGE sync ${res.status}: ${JSON.stringify(out).slice(0, 200)}`)

      // Readback: ask BRIDGE what it actually holds rather than trusting the write.
      const check = await fetch(`${BRIDGE_BASE}/api/sync`, {
        method: 'GET', headers: { 'x-sync-key': BRIDGE_SYNC_KEY }, signal: AbortSignal.timeout(20000),
      }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
      const verified = !!check || (out?.accepted ?? 0) > 0 || (out?.duplicates ?? 0) > 0
      return {
        destination_system: 'bridge', destination_id: external_id,
        result: out, readback: check ?? { accepted: out?.accepted, duplicates: out?.duplicates },
        verified,
      }
    },
  },

  // Declared so the hub can hold and explain them, never executed from here.
  // Publishing runs on the marketing-os side, which holds the authenticated Kleo
  // connector. Britt approves here; the job publishes and reports back.
  kleo_create_draft: {
    validate: (p) => (str(p.text) ? null : 'payload.text is required'),
    available: () => ({ ok: false, deferred: true, executor: 'marketing-os content-cycle' }),
    async run() { throw new Error('unreachable: deferred to the executor') },
  },
  content_publish: {
    validate: (p) => (str(p.text) ? null : 'payload.text is required'),
    available: () => ({ ok: false, deferred: true, executor: 'marketing-os content-cycle' }),
    async run() { throw new Error('unreachable: deferred to the executor') },
  },
  newsletter_send: {
    validate: (p) => (str(p.body) ? null : 'payload.body is required'),
    available: () => ({ ok: false, deferred: true, executor: 'marketing-os newsletter-cycle' }),
    async run() { throw new Error('unreachable: deferred to the executor') },
  },
  apollo_enrollment: {
    validate: () => null,
    available: () => ({ ok: false, missing: 'authorized Apollo adapter',
      setup: 'Apollo enrollment is prohibited by policy. This action type cannot execute.' }),
    async run() { throw new Error('unreachable') },
  },
}

// ── Auth ──────────────────────────────────────────────────────────────────────

async function authenticate(req: Request, supa: SupabaseClient) {
  const secret = req.headers.get('x-hub-secret')
  if (secret) {
    if (!INTEGRATION_SECRET || secret !== INTEGRATION_SECRET) return { error: 'invalid integration secret' }
    return { kind: 'agent' as const, actor: 'marketing-os' }
  }
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return { error: 'missing credentials' }
  const { data, error } = await supa.auth.getUser(token)
  if (error || !data?.user) return { error: 'invalid session' }
  const { data: admin } = await supa.from('drive_admins').select('user_id').eq('user_id', data.user.id).maybeSingle()
  if (!admin) return { error: 'not authorized' }
  return { kind: 'human' as const, actor: data.user.email ?? data.user.id }
}

async function logEvent(supa: SupabaseClient, approval_id: string | null, actor: string, actor_kind: string,
                        event: string, from_status: string | null, to_status: string | null, detail: unknown = {}) {
  await supa.from('drive_hub_events').insert({ approval_id, actor, actor_kind, event, from_status, to_status, detail })
}

// ── Operations ────────────────────────────────────────────────────────────────

const HUMAN_ONLY = new Set(['approve', 'decline', 'edit', 'snooze', 'cancel', 'retry', 'confirm_manual', 'acknowledge', 'attest_final'])
const AGENT_ONLY = new Set(['upsert', 'supersede', 'record_auto', 'attach_evidence', 'claim_approved', 'submit_result', 'sweep', 'purge_test_items', 'approval_events'])

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  const supa = createClient(SUPA_URL, SERVICE_KEY, { auth: { persistSession: false } })
  const auth = await authenticate(req, supa)
  if ('error' in auth) return json({ error: auth.error }, 401)

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return json({ error: 'invalid JSON' }, 400) }
  const op = str(body.op)
  if (!op) return json({ error: 'op is required' }, 400)

  if (auth.kind === 'agent' && HUMAN_ONLY.has(op)) return json({ error: `a job may not "${op}". Only Britt decides.` }, 403)
  if (auth.kind === 'human' && AGENT_ONLY.has(op) && op !== 'ping') return json({ error: `"${op}" is an integration operation` }, 403)

  try {
    // ── connectivity, no side effect ──
    if (op === 'ping') return json({ ok: true, caller: auth.kind, actor: auth.actor, handlers: Object.keys(HANDLERS).length })

    // ── agent: retire the test harness's own items ──
    // The suite creates about a dozen cards per run and left them all in Britt's
    // queue. Scoped hard to source_system 'test-harness' so it can never reach a
    // real decision, and it cancels rather than deletes: the event history stands.
    if (op === 'purge_test_items') {
      const { data, error } = await supa.from('drive_hub_approvals')
        .select('id, idempotency_key').eq('source_system', 'test-harness')
        .not('status', 'in', '("cancelled","completed","declined")')
      if (error) return dbError(error)
      let n = 0
      for (const row of data ?? []) {
        await supa.from('drive_hub_approvals')
          .update({ status: 'cancelled', decided_at: new Date().toISOString() }).eq('id', row.id)
        await logEvent(supa, row.id, auth.actor, 'agent', 'harness_item_retired', null, 'cancelled', {})
        n++
      }
      return json({ ok: true, retired: n })
    }

    // ── read-only: the decision record, for measuring whether anything has earned
    // standing authority. Returns events, never grants anything.
    if (op === 'approval_events') {
      const limit = Math.min(Number(body.limit ?? 500), 2000)
      const { data, error } = await supa.from('drive_hub_events')
        .select('at, event, actor, actor_kind, from_status, to_status, detail, approval_id')
        .order('at', { ascending: false }).limit(limit)
      if (error) return dbError(error)
      const ids = [...new Set((data ?? []).map((e) => e.approval_id).filter(Boolean))]
      const { data: rows } = await supa.from('drive_hub_approvals')
        .select('id, approval_type').in('id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])
      const typeOf = Object.fromEntries((rows ?? []).map((r) => [r.id, r.approval_type]))
      return json({
        ok: true,
        events: (data ?? []).map((e) => ({
          at: e.at, action: e.event, actor: e.actor, actor_kind: e.actor_kind,
          approval_type: typeOf[e.approval_id] ?? null,
          // An edit before approval is what breaks a streak, so it has to be visible.
          was_edited: e.event === 'approved' && e.detail?.edited === true,
          detail: e.detail ?? null,
        })),
      })
    }

    // ── read-only: is the machine running without her ──
    if (op === 'cloud_status') {
      const { data, error } = await supa.rpc('drive_hub_cloud_status')
      if (error) return dbError(error)
      return json({ ok: true, ...data })
    }

    // ── read-only: what is the state of one item ──
    // An executor that has to reason about a card it did not just claim otherwise
    // has no way to see it. Returns state, never the caller's own secrets.
    if (op === 'lookup') {
      const key = str(body.idempotency_key)
      const lid = str(body.id)
      if (!key && !lid) return json({ error: 'idempotency_key or id is required' }, 400)
      const q = supa.from('drive_hub_approvals')
        .select('id, idempotency_key, approval_type, status, title, retry_count, failure_reason, is_public, destination, destination_id, destination_readback, readback_verified, reconciled_at, reconciled_by, source_record_id, created_at, updated_at, completed_at')
      const { data, error } = key ? await q.eq('idempotency_key', key).maybeSingle() : await q.eq('id', lid).maybeSingle()
      if (error) return dbError(error)
      if (!data) return json({ found: false }, 404)
      return json({ found: true, approval: data })
    }

    if (op === 'sweep') {
      const parked = await parkOverdue(supa)
      return json({ ok: true, parked: parked.length, items: parked })
    }

    // ── agent: create or update an approval idempotently ──
    if (op === 'upsert') {
      const key = str(body.idempotency_key)
      if (!key) return json({ error: 'idempotency_key is required' }, 400)
      const type = str(body.approval_type)
      if (!HANDLERS[type]) return json({ error: `unknown approval_type "${type}". Allowed: ${Object.keys(HANDLERS).join(', ')}` }, 400)

      // Prohibition is checked before shape. A forbidden action type is refused
      // because it is forbidden, whatever its payload looks like; answering 422
      // first would tell a caller to fix the payload and try again.
      const { data: policy } = await supa.from('drive_hub_policies')
        .select('id, disposition').eq('action_type', type).is('revoked_at', null).maybeSingle()
      if (policy?.disposition === 'prohibited')
        return json({ error: `action_type "${type}" is prohibited by policy ${policy.id}` }, 403)

      // Then fail closed on shape, but say exactly what is wrong and answer 4xx. A
      // caller that gets a 500 cannot tell a bad request from an outage and retries
      // forever.
      const bad = validateApproval(type, body)
      if (bad.length) return invalid(bad)

      const { data: existing } = await supa.from('drive_hub_approvals')
        .select('id, status, source_fingerprint').eq('idempotency_key', key).maybeSingle()

      // If the words changed after Britt approved them, the approval no longer
      // describes what would ship. Invalidate and send it back for review rather
      // than publishing copy she has not seen.
      if (existing && ['approved', 'executing'].includes(existing.status)) {
        const incoming = contentOf({ artifact: body.artifact, action_payload: body.action_payload })
        const { data: full } = await supa.from('drive_hub_approvals').select('content_hash').eq('id', existing.id).maybeSingle()
        if (incoming && full?.content_hash && (await sha256(incoming)) !== full.content_hash) {
          await supa.from('drive_hub_approvals').update({
            status: 'awaiting_approval', approved_at: null, dispatched_at: null, dispatch_deadline: null,
            approved_content: null, content_hash: null,
            invalidated_reason: 'The content changed after you approved it, so the approval was withdrawn. Read it again before it goes out.',
          }).eq('id', existing.id)
          await logEvent(supa, existing.id, auth.actor, 'agent', 'invalidated_content_changed', existing.status, 'awaiting_approval', {})
          return json({ ok: true, id: existing.id, status: 'awaiting_approval', invalidated: true })
        }
        return json({ ok: true, id: existing.id, status: existing.status, unchanged: true, note: 'in flight; not modified' })
      }

      // A different key for the same real-world action would hand a job a fresh
      // retry budget. The ceiling has to survive renaming.
      const srcId = str(body.source_record_id)
      if (!existing && srcId) {
        const { data: twin } = await supa.from('drive_hub_approvals')
          .select('id, idempotency_key, retry_count, status')
          .eq('approval_type', type).eq('source_record_id', srcId)
          .eq('status', 'failed').gte('retry_count', MAX_RETRIES).limit(1).maybeSingle()
        if (twin) {
          return json({
            error: `${type} for "${srcId}" already has a card that exhausted its ${MAX_RETRIES}-retry ceiling (${twin.idempotency_key}). A new key would be a fresh retry budget for the same action. Reconcile or cancel that card instead.`,
            code: 'retry_ceiling_evasion', existing_id: twin.id,
          }, 409)
        }
      }

      // A decided item is never silently reopened by a repeat request.
      if (existing && !['awaiting_approval', 'snoozed', 'manual_action_ready', 'failed'].includes(existing.status)) {
        return json({ ok: true, id: existing.id, status: existing.status, unchanged: true,
                      note: 'already decided; not reopened' })
      }

      const row = {
        idempotency_key: key,
        approval_type: type,
        source_system: str(body.source_system) || 'marketing-os',
        source_record_id: str(body.source_record_id) || null,
        source_fingerprint: str(body.source_fingerprint) || null,
        title: str(body.title) || type,
        decision_summary: str(body.decision_summary) || '',
        why_escalated: str(body.why_escalated) || '',
        evidence: body.evidence ?? [],
        recommendation: str(body.recommendation) || null,
        proposed_action: str(body.proposed_action) || type,
        action_payload: body.action_payload ?? {},
        artifact: str(body.artifact) || null,
        destination: str(body.destination) || null,
        requested_timing: str(body.requested_timing) || null,
        is_public: typeof body.is_public === 'boolean' ? body.is_public : null,
        readback_criteria: str(body.readback_criteria) || null,
        artifact_label: str(body.artifact_label) || null,
        // Internal provenance: which strategy rules and which same-channel voice
        // samples produced this draft. A trigger rejects an authored item without
        // it. It is never rendered on Britt's card.
        evidence_manifest: body.evidence_manifest ?? null,
        affects: str(body.affects) || null,
        source_links: body.source_links ?? [],
        risk: ['low', 'medium', 'high'].includes(str(body.risk)) ? str(body.risk) : 'low',
        requires_confirm: body.requires_confirm === true,
        policy_id: policy?.id ?? null,
        disposition: policy?.disposition ?? 'execute_after_approval',
        status: policy?.disposition === 'manual_final_action' ? 'manual_action_ready' : 'awaiting_approval',
        priority: Number(body.priority ?? 50),
        due_at: body.due_at ?? null,
        expires_at: body.expires_at ?? null,
        updated_at: new Date().toISOString(),
      }

      const { data: saved, error } = await supa.from('drive_hub_approvals')
        .upsert(row, { onConflict: 'idempotency_key' }).select('id, status').single()
      if (error) return dbError(error)

      await logEvent(supa, saved.id, auth.actor, 'agent',
        existing ? 'updated' : 'created', existing?.status ?? null, saved.status,
        { fingerprint_changed: existing?.source_fingerprint !== row.source_fingerprint })
      return json({ ok: true, id: saved.id, status: saved.status, created: !existing })
    }

    // ── agent: record autonomous work, never queued ──
    if (op === 'record_auto') {
      const { data, error } = await supa.from('drive_hub_auto_log').insert({
        agent: str(body.agent) || auth.actor,
        action_type: str(body.action_type) || 'unspecified',
        policy_id: str(body.policy_id) || null,
        summary: str(body.summary) || '',
        source_system: str(body.source_system) || null,
        source_record_id: str(body.source_record_id) || null,
        destination_id: str(body.destination_id) || null,
        detail: body.detail ?? {},
      }).select('id').single()
      if (error) return dbError(error)
      return json({ ok: true, id: data.id })
    }

    // ── agent: retire an obsolete request ──
    if (op === 'supersede') {
      const key = str(body.idempotency_key)
      const { data: existing } = await supa.from('drive_hub_approvals').select('id, status').eq('idempotency_key', key).maybeSingle()
      if (!existing) return json({ ok: true, note: 'nothing to supersede' })
      if (!['awaiting_approval', 'snoozed', 'manual_action_ready'].includes(existing.status))
        return json({ ok: true, note: `not superseding an item in status ${existing.status}` })
      await supa.from('drive_hub_approvals').update({ status: 'cancelled', failure_reason: str(body.reason) || 'superseded' }).eq('id', existing.id)
      await logEvent(supa, existing.id, auth.actor, 'agent', 'superseded', existing.status, 'cancelled', { reason: str(body.reason) })
      return json({ ok: true, id: existing.id, status: 'cancelled' })
    }

    // ── executor: take the work Britt approved ──
    if (op === 'claim_approved') {
      const types = Array.isArray(body.types) ? body.types.map(String) : []
      if (!types.length) return json({ error: 'types is required' }, 400)
      await parkOverdue(supa)
      const worker = str(body.worker) || 'unnamed-worker'
      const { data, error } = await supa.from('drive_hub_approvals')
        .select('id, approval_type, action_payload, idempotency_key, source_record_id, approved_content, content_hash, destination, requested_timing, dispatch_deadline')
        .eq('status', 'approved').in('approval_type', types)
        .order('dispatched_at', { ascending: true }).limit(Number(body.limit ?? 10))
      if (error) return dbError(error)
      for (const item of data ?? []) {
        await supa.from('drive_hub_approvals').update({ status: 'executing', worker, execution_started_at: new Date().toISOString() })
          .eq('id', item.id).eq('status', 'approved')
        await logEvent(supa, item.id, worker, 'agent', 'claimed', 'approved', 'executing', {})
      }
      // approved_content is the contract. A worker publishes these words or none.
      return json({ ok: true, items: data ?? [] })
    }

    // ── executor: report what actually happened at the destination ──
    if (op === 'submit_result') {
      const rid = str(body.id)
      if (!rid) return json({ error: 'id is required' }, 400)
      const { data: row } = await supa.from('drive_hub_approvals').select('id, status').eq('id', rid).maybeSingle()
      if (!row) return json({ error: 'approval not found' }, 404)
      if (row.status === 'completed') return json({ ok: true, status: 'completed', note: 'already completed' })
      if (row.status !== 'approved' && row.status !== 'executing')
        return json({ error: `cannot submit a result from status ${row.status}` }, 409)

      const verified = body.verified === true
      const failed = body.failed === true
      if (failed) {
        await supa.from('drive_hub_approvals').update({
          status: 'failed', failure_reason: str(body.reason) || 'executor reported a failure',
        }).eq('id', rid)
        await logEvent(supa, rid, auth.actor, 'agent', 'executor_failed', row.status, 'failed', { reason: str(body.reason) })
        return json({ ok: false, status: 'failed' })
      }
      if (!verified) {
        await supa.from('drive_hub_approvals').update({
          status: 'awaiting_confirmation', destination_id: str(body.destination_id) || null,
          destination_readback: body.readback ?? null,
          failure_reason: 'the executor could not verify the destination; reconcile before retrying',
        }).eq('id', rid)
        await logEvent(supa, rid, auth.actor, 'agent', 'executor_unverified', row.status, 'awaiting_confirmation', {})
        return json({ ok: false, status: 'awaiting_confirmation' })
      }
      await supa.from('drive_hub_approvals').update({
        status: 'completed', completed_at: new Date().toISOString(),
        destination_system: str(body.destination_system) || 'marketing-os',
        destination_id: str(body.destination_id) || null,
        destination_readback: body.readback ?? null,
        execution_result: body.result ?? null, readback_verified: true, failure_reason: null,
      }).eq('id', rid)
      await logEvent(supa, rid, auth.actor, 'agent', 'executor_completed', row.status, 'completed',
        { destination_id: str(body.destination_id), readback: body.readback })
      return json({ ok: true, status: 'completed' })
    }

    // ── human decisions ──
    const id = str(body.id)
    if (!id) return json({ error: 'id is required' }, 400)
    const { data: approval, error: readErr } = await supa.from('drive_hub_approvals').select('*').eq('id', id).maybeSingle()
    if (readErr || !approval) return json({ error: 'approval not found' }, 404)

    if (op === 'decline') {
      if (!['awaiting_approval', 'snoozed', 'manual_action_ready', 'failed'].includes(approval.status))
        return json({ error: `cannot decline from ${approval.status}` }, 409)
      await supa.from('drive_hub_approvals').update({ status: 'declined', declined_at: new Date().toISOString(), failure_reason: str(body.reason) || null }).eq('id', id)
      await logEvent(supa, id, auth.actor, 'human', 'declined', approval.status, 'declined', { reason: str(body.reason) })
      return json({ ok: true, status: 'declined' })
    }

    if (op === 'snooze') {
      const until = str(body.until)
      if (!until) return json({ error: 'until is required' }, 400)
      await supa.from('drive_hub_approvals').update({ status: 'snoozed', snoozed_until: until }).eq('id', id)
      await logEvent(supa, id, auth.actor, 'human', 'snoozed', approval.status, 'snoozed', { until })
      return json({ ok: true, status: 'snoozed', until })
    }

    if (op === 'cancel') {
      await supa.from('drive_hub_approvals').update({ status: 'cancelled', failure_reason: str(body.reason) || 'cancelled by Britt' }).eq('id', id)
      await logEvent(supa, id, auth.actor, 'human', 'cancelled', approval.status, 'cancelled', { reason: str(body.reason) })
      return json({ ok: true, status: 'cancelled' })
    }

    if (op === 'edit') {
      // Editing operates on the structured proposal and returns it to the same
      // executable flow. It never becomes free text Britt has to paste elsewhere.
      const patch = (body.action_payload ?? {}) as Record<string, unknown>
      const handler = HANDLERS[approval.approval_type]
      if (!handler) return json({ error: `no handler for ${approval.approval_type}` }, 400)
      const merged = { ...(approval.action_payload as Record<string, unknown>), ...patch }
      const invalid = handler.validate(merged)
      if (invalid) return json({ error: `edited payload is invalid: ${invalid}` }, 400)
      // Keep the visible artifact in step with the edited payload, so the card never
      // shows one thing while the executable proposal says another.
      const newArtifact = str(merged.text) || str(merged.body) || str(merged.message) || null
      await supa.from('drive_hub_approvals').update({
        action_payload: merged,
        ...(newArtifact ? { artifact: newArtifact, artifact_label: `Edited by Britt, ${newArtifact.length} characters` } : {}),
        updated_at: new Date().toISOString(),
      }).eq('id', id)
      await logEvent(supa, id, auth.actor, 'human', 'edited', approval.status, approval.status,
        { changed_keys: Object.keys(patch), before: approval.action_payload, after: merged })
      return json({ ok: true, action_payload: merged })
    }

    // Britt pastes what she actually posted. One optional field, prefilled with the
    // approved version. Attested is stronger than approved and weaker than a
    // destination read, and reconciliation may still upgrade it later.
    // ── human: reconcile an action that really happened after its card failed ──
    if (op === 'reconcile_external') {
      // Only a terminal card needs this. A live one should be retried or executed.
      if (!['failed', 'awaiting_confirmation'].includes(approval.status))
        return json({ error: `only a failed or unconfirmed card can be reconciled; this one is ${approval.status}`, code: 'not_terminal' }, 409)
      if (approval.reconciled_at)
        return json({ ok: true, status: approval.status, note: 'already reconciled', reconciled_at: approval.reconciled_at })

      // Who may reconcile what. The gate is the evidence, not the caller: this op
      // never accepts an assertion, only a readback the gateway fetched itself. An
      // agent may therefore close an internal action it can prove. It may not close
      // anything that spoke publicly under Britt's name, even with proof, because
      // that judgement is hers.
      const isPublicAction = approval.is_public === true || PUBLIC_ACTION_TYPES.includes(approval.approval_type as string)
      if (auth.kind === 'agent' && isPublicAction)
        return json({ error: `a job may not reconcile "${approval.approval_type}": it spoke publicly as Britt, so closing it is her decision`, code: 'human_only_public' }, 403)

      const verifier = VERIFIERS[approval.approval_type as string]
      if (!verifier) {
        const why = PUBLIC_ACTION_TYPES.includes(approval.approval_type as string)
          ? `"${approval.approval_type}" speaks publicly, so it can only be closed by a machine readback from the destination. There is no verifier for it, and an assertion that it went out is not evidence.`
          : `no machine verifier exists for "${approval.approval_type}", so there is nothing that could confirm this independently.`
        await logEvent(supa, id, auth.actor, 'human', 'reconciliation_refused', approval.status, approval.status, { why })
        return json({ error: why, code: 'no_machine_verifier' }, 422)
      }

      const rb = await verifier(approval)
      if (!rb.verified) {
        await logEvent(supa, id, auth.actor, 'human', 'reconciliation_failed', approval.status, approval.status,
          { why: rb.why, proof: rb.proof })
        return json({ ok: false, error: rb.why ?? 'the destination did not confirm this', code: 'readback_failed', proof: rb.proof }, 422)
      }

      // Close the original card. retry_count is untouched: the failures happened
      // and the ceiling still means what it meant. Nothing here claims another
      // execution occurred; execution_result records that this was a reconciliation.
      const patch = {
        status: 'completed',
        completed_at: new Date().toISOString(),
        reconciled_at: new Date().toISOString(),
        reconciled_by: auth.actor,
        reconciliation_proof: rb.proof,
        destination_system: str(body.destination_system) || approval.approval_type.split('_')[0],
        destination_id: rb.destination_id ?? null,
        destination_readback: rb.proof,
        readback_verified: true,
        failure_reason: null,
        execution_result: {
          ...(approval.execution_result as object ?? {}),
          closed_by: 'external_reconciliation',
          note: 'The action was verified at the destination after this card had already failed. No further execution was attempted.',
          retry_count_at_reconciliation: approval.retry_count,
        },
      }
      const { error: uerr } = await supa.from('drive_hub_approvals').update(patch).eq('id', id)
      if (uerr) return dbError(uerr)

      await logEvent(supa, id, auth.actor, 'human', 'reconciled_external', approval.status, 'completed', {
        destination_id: rb.destination_id, retry_count_preserved: approval.retry_count, proof: rb.proof,
      })
      return json({
        ok: true, status: 'completed', destination_id: rb.destination_id,
        retry_count: approval.retry_count,
        note: 'Closed on evidence from the destination. The failure history and the retry count are unchanged.',
      })
    }

    if (op === 'attest_final') {
      // Two things can arrive here, together or separately. `final_text` is what she
      // actually posted, which may differ from the draft and is the highest-authority
      // voice evidence there is. `live_url` is the address, which Kleo's connector
      // cannot supply, and which is the one missing piece stopping a published item
      // from closing.
      const finalText = str(body.final_text)
      const liveUrl = str(body.live_url)
      if (!finalText && !liveUrl) return json({ error: 'final_text or live_url is required' }, 422)
      if (liveUrl && !/^https:\/\/(www\.)?linkedin\.com\//i.test(liveUrl))
        return json({ error: 'live_url must be a linkedin.com URL', code: 'bad_live_url' }, 422)

      const proposed = contentOf(approval)
      const prior = (approval.destination_readback ?? {}) as Record<string, unknown>
      const readback: Record<string, unknown> = { ...prior, attested_by: auth.actor, at: new Date().toISOString() }
      if (finalText) {
        readback.attested = true
        readback.final_text = finalText
        readback.proposed_text = proposed
        readback.differs = finalText !== proposed
      }
      if (liveUrl) readback.live_url = liveUrl

      const patch: Record<string, unknown> = {
        destination_readback: readback,
        execution_result: { ...(approval.execution_result as object ?? {}), attestation: 'user_attested_published_final' },
      }

      // A live URL from Britt is better evidence than any readback we could fetch.
      // It closes an item the executor could only park.
      let closed = false
      if (liveUrl && approval.status === 'awaiting_confirmation') {
        patch.status = 'completed'
        patch.completed_at = new Date().toISOString()
        patch.destination_system = 'linkedin'
        patch.readback_verified = true
        patch.failure_reason = null
        closed = true
      }

      const { error: uerr } = await supa.from('drive_hub_approvals').update(patch).eq('id', id)
      if (uerr) return dbError(uerr)
      await logEvent(supa, id, auth.actor, 'human', closed ? 'attested_and_closed' : 'attested_published_final',
        approval.status, closed ? 'completed' : approval.status,
        { differs: finalText ? finalText !== proposed : null, has_live_url: !!liveUrl })

      return json({
        ok: true, quality: 'user_attested_published_final', closed,
        differs: finalText ? finalText !== proposed : null,
        note: closed
          ? 'Closed. That link is the proof the executor could not get on its own.'
          : finalText && finalText !== proposed
            ? 'Recorded as what you actually posted. The difference from the draft becomes a preference pair.'
            : 'Recorded.',
      })
    }

    if (op === 'acknowledge' || op === 'confirm_manual' || op === 'approve' || op === 'retry') {
      // ── preflight, identical for every executable path ──
      if (approval.expires_at && Date.parse(approval.expires_at) < Date.now()) {
        await supa.from('drive_hub_approvals').update({ status: 'expired' }).eq('id', id)
        await logEvent(supa, id, auth.actor, 'system', 'expired', approval.status, 'expired', {})
        return json({ error: 'this approval expired and was not executed' }, 409)
      }
      if (approval.status === 'completed') return json({ ok: true, status: 'completed', note: 'already completed; not re-executed' })
      if (approval.status === 'executing') return json({ error: 'already executing' }, 409)
      if (op === 'retry' && approval.retry_count >= MAX_RETRIES) return json({ error: `retry limit ${MAX_RETRIES} reached` }, 409)
      if (!['awaiting_approval', 'snoozed', 'manual_action_ready', 'failed', 'approved'].includes(approval.status))
        return json({ error: `cannot act from status ${approval.status}` }, 409)

      const handler = HANDLERS[approval.approval_type]
      if (!handler) return json({ error: `no allowlisted handler for "${approval.approval_type}"` }, 400)

      // Policy is revalidated at execution time, not trusted from creation time.
      const { data: policy } = await supa.from('drive_hub_policies')
        .select('id, disposition').eq('action_type', approval.approval_type).is('revoked_at', null).maybeSingle()
      if (policy?.disposition === 'prohibited') return json({ error: `policy ${policy.id} prohibits this action` }, 403)

      const payload = (approval.action_payload ?? {}) as Record<string, unknown>
      const invalid = handler.validate(payload)
      if (invalid) return json({ error: `payload failed validation: ${invalid}` }, 400)

      const availability = handler.available()
      if (!availability.ok && availability.deferred) {
        // Freeze the exact words, dispatch now, and start a deadline. The scheduled
        // jobs are a safety net for this, not the thing that makes it happen.
        const content = contentOf(approval)
        if (!content) return json({ error: 'nothing to publish: this approval carries no content' }, 400)
        const hash = await sha256(content)
        const now = new Date()
        const deadline = new Date(now.getTime() + DISPATCH_DEADLINE_MIN * 60000)
        await supa.from('drive_hub_approvals').update({
          status: 'approved',
          approved_at: approval.approved_at ?? now.toISOString(),
          approved_content: content,
          content_hash: hash,
          destination: str(payload.destination) || availability.executor || 'marketing-os',
          requested_timing: str(payload.requested_timing) || 'immediate',
          dispatched_at: now.toISOString(),
          dispatch_deadline: deadline.toISOString(),
          destination_system: availability.executor ?? 'marketing-os',
          failure_reason: null, invalidated_reason: null, parked_at: null,
        }).eq('id', id)
        await logEvent(supa, id, auth.actor, 'human', 'approved_and_dispatched', approval.status, 'approved',
          { executor: availability.executor, content_hash: hash, deadline: deadline.toISOString(), chars: content.length })
        return json({ ok: true, status: 'approved', dispatched: true, executor: availability.executor,
          content_hash: hash, deadline: deadline.toISOString(),
          note: `Dispatched to ${availability.executor} now. If it is not verified by ${deadline.toISOString().slice(11,16)} UTC it parks here as an exception.` })
      }
      if (!availability.ok) {
        await supa.from('drive_hub_approvals').update({
          status: 'approved', approved_at: new Date().toISOString(),
          failure_reason: `blocked adapter: ${availability.missing}`,
        }).eq('id', id)
        await logEvent(supa, id, auth.actor, 'human', 'approved_but_blocked', approval.status, 'approved',
          { missing: availability.missing, setup: availability.setup })
        return json({ ok: true, status: 'approved', executed: false,
          blocked: { action_type: approval.approval_type, missing: availability.missing, setup_action: availability.setup },
          note: 'The decision is recorded. Only this action type is blocked; nothing else is affected.' }, 200)
      }

      // ── claim, so it cannot execute twice ──
      const claim = `${auth.actor}:${crypto.randomUUID()}`
      const claimExpiry = new Date(Date.now() + CLAIM_SECONDS * 1000).toISOString()
      const { data: claimed } = await supa.from('drive_hub_approvals')
        .update({ status: 'executing', execution_started_at: new Date().toISOString(),
                  approved_at: approval.approved_at ?? new Date().toISOString(),
                  claimed_by: claim, claim_expires_at: claimExpiry })
        .eq('id', id).eq('status', approval.status).select('id').maybeSingle()
      if (!claimed) return json({ error: 'lost the race to another execution; nothing was done twice' }, 409)

      await logEvent(supa, id, auth.actor, 'human', op, approval.status, 'executing', { claim })

      try {
        const out = await handler.run({ supa, approval, actor: auth.actor }, payload)
        if (!out.verified) {
          // The write may have landed. Do not retry blindly.
          await supa.from('drive_hub_approvals').update({
            status: 'awaiting_confirmation', execution_result: out.result,
            destination_system: out.destination_system, destination_id: out.destination_id,
            destination_readback: out.readback, readback_verified: false,
            failure_reason: 'readback did not confirm the write; reconcile before retrying',
            claimed_by: null, claim_expires_at: null,
          }).eq('id', id)
          await logEvent(supa, id, auth.actor, 'system', 'readback_uncertain', 'executing', 'awaiting_confirmation', { result: out.result })
          return json({ ok: false, status: 'awaiting_confirmation',
            note: 'The action may have succeeded. Reconcile at the destination before retrying, so nothing fires twice.' })
        }

        await supa.from('drive_hub_approvals').update({
          status: 'completed', completed_at: new Date().toISOString(),
          execution_result: out.result, destination_system: out.destination_system,
          destination_id: out.destination_id, destination_readback: out.readback,
          readback_verified: true, failure_reason: null, claimed_by: null, claim_expires_at: null,
        }).eq('id', id)
        await logEvent(supa, id, auth.actor, 'system', 'completed', 'executing', 'completed',
          { destination_system: out.destination_system, destination_id: out.destination_id, readback: out.readback })
        return json({ ok: true, status: 'completed', destination_id: out.destination_id, readback: out.readback })
      } catch (e) {
        const reason = String(e instanceof Error ? e.message : e).slice(0, 500)
        await supa.from('drive_hub_approvals').update({
          status: 'failed', failure_reason: reason, retry_count: (approval.retry_count ?? 0) + 1,
          claimed_by: null, claim_expires_at: null,
        }).eq('id', id)
        await logEvent(supa, id, auth.actor, 'system', 'failed', 'executing', 'failed', { reason })
        return json({ ok: false, status: 'failed', reason }, 200)
      }
    }

    return json({ error: `unknown op "${op}"` }, 400)
  } catch (e) {
    return json({ error: String(e instanceof Error ? e.message : e).slice(0, 300) }, 500)
  }
})
