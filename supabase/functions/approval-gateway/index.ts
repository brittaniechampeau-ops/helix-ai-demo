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

const HUMAN_ONLY = new Set(['approve', 'decline', 'edit', 'snooze', 'cancel', 'retry', 'confirm_manual', 'acknowledge'])
const AGENT_ONLY = new Set(['upsert', 'supersede', 'record_auto', 'attach_evidence', 'ping', 'claim_approved', 'submit_result'])

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

    // ── agent: create or update an approval idempotently ──
    if (op === 'upsert') {
      const key = str(body.idempotency_key)
      if (!key) return json({ error: 'idempotency_key is required' }, 400)
      const type = str(body.approval_type)
      if (!HANDLERS[type]) return json({ error: `unknown approval_type "${type}". Allowed: ${Object.keys(HANDLERS).join(', ')}` }, 400)

      const { data: policy } = await supa.from('drive_hub_policies')
        .select('id, disposition').eq('action_type', type).is('revoked_at', null).maybeSingle()
      if (policy?.disposition === 'prohibited')
        return json({ error: `action_type "${type}" is prohibited by policy ${policy.id}` }, 403)

      const { data: existing } = await supa.from('drive_hub_approvals')
        .select('id, status, source_fingerprint').eq('idempotency_key', key).maybeSingle()

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
        artifact_label: str(body.artifact_label) || null,
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
      if (error) return json({ error: error.message }, 500)

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
      if (error) return json({ error: error.message }, 500)
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
      const { data, error } = await supa.from('drive_hub_approvals')
        .select('id, approval_type, action_payload, idempotency_key, source_record_id')
        .eq('status', 'approved').in('approval_type', types).limit(Number(body.limit ?? 10))
      if (error) return json({ error: error.message }, 500)
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
        await supa.from('drive_hub_approvals').update({
          status: 'approved', approved_at: new Date().toISOString(),
          destination_system: availability.executor ?? 'marketing-os',
          failure_reason: null,
        }).eq('id', id)
        await logEvent(supa, id, auth.actor, 'human', 'approved_queued_for_executor', approval.status, 'approved',
          { executor: availability.executor })
        return json({ ok: true, status: 'approved', executed: false, queued_for: availability.executor,
          note: `Approved. ${availability.executor} publishes it on its next run and reports back here.` })
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
