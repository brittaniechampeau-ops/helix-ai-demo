// The deterministic sweep, running where the laptop is not.
//
// Everything here is HTTP against credentials Supabase already holds. It reads the
// funnel counts, reads Kit, records what it saw, and parks anything whose dispatch
// deadline has passed. It drafts nothing and decides nothing.
//
// Scheduled by pg_cron. The laptop can be shut.
//
// CONCURRENCY: a local collector run and this can both be alive. They must not both
// claim to be the writer for one window. A unique index on (window_start, kind)
// makes the second writer a no-op rather than a conflicting truth, and the row
// records which writer won.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const SUPA_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const BRIDGE_SYNC_KEY = Deno.env.get('BRIDGE_SYNC_KEY') ?? ''
const BRIDGE_BASE = Deno.env.get('BRIDGE_BASE_URL') ?? 'https://assessment.brittbowman.ai'
const SWEEP_SECRET = Deno.env.get('HUB_INTEGRATION_SECRET') ?? ''

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, x-hub-secret' }
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'content-type': 'application/json' } })

/** The hour this run belongs to. Two writers in the same hour are the same window. */
const windowStart = () => { const d = new Date(); d.setUTCMinutes(0, 0, 0); return d.toISOString() }

async function bridge(path: string) {
  if (!BRIDGE_SYNC_KEY) return { error: 'BRIDGE_SYNC_KEY is not set on this function' }
  try {
    const res = await fetch(`${BRIDGE_BASE}${path}`, {
      headers: { 'x-sync-key': BRIDGE_SYNC_KEY }, signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return { error: `${path} -> HTTP ${res.status}` }
    return await res.json()
  } catch (e) { return { error: String(e instanceof Error ? e.message : e) } }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const supa = createClient(SUPA_URL, SERVICE_KEY, { auth: { persistSession: false } })

  // The sweep has its own credential, generated in-database and stored in Vault. No
  // human or agent has ever seen it, and it is deliberately NOT the integration
  // secret: that one creates approvals, this one only reads and parks.
  const supplied = req.headers.get('x-sweep-secret') ?? req.headers.get('x-hub-secret') ?? ''
  const { data: valid, error: verr } = await supa.rpc('drive_hub_verify_sweep_secret', { supplied })
  if (verr || valid !== true) {
    // Fall back to the integration secret only for a hand-invoked run from a session
    // that legitimately holds it. A scheduled run never takes this path.
    if (!SWEEP_SECRET || supplied !== SWEEP_SECRET) return json({ error: 'Unauthorized' }, 401)
  }
  const started = new Date().toISOString()
  const errors: string[] = []

  const [counts, kit] = await Promise.all([
    bridge('/api/sync?counts=funnel'),
    bridge('/api/sync?kit=stats'),
  ])
  if (counts.error) errors.push(`counts: ${counts.error}`)
  if (kit.error) errors.push(`kit: ${kit.error}`)
  for (const e of counts.errors ?? []) errors.push(`counts: ${e}`)

  // Absolute counts only, and an unread value stays null. Never zero.
  const c = counts.counts ?? {}
  const k = kit.stats ?? {}
  const reading = {
    assessment_completions: c.assessment_completions_total ?? null,
    purchases: c.purchases_total ?? null,
    revenue_cents: c.revenue_cents_total ?? null,
    high_fit_leads: (c.fit_bands ?? []).find((b: Record<string, unknown>) => b.band === 'high')?.n ?? null,
    low_fit_leads: (c.fit_bands ?? []).find((b: Record<string, unknown>) => b.band === 'low')?.n ?? null,
    people_rows: c.people_rows ?? null,
    newsletter_subscribers_active: k.subscriber_count ?? null,
    kit_tags: k.tags ?? null,
    kit_sequences: k.sequences ?? null,
  }

  // Park anything past its deadline. Already idempotent in the gateway.
  let parked: unknown[] = []
  try {
    const { data } = await supa.rpc('drive_hub_park_overdue')
    parked = Array.isArray(data) ? data : []
  } catch (e) { errors.push(`park: ${String(e instanceof Error ? e.message : e)}`) }

  // One row per window. A second writer in the same hour loses harmlessly and the
  // row says who wrote it, so two runtimes can never disagree about one window.
  const win = windowStart()
  const { data: snap, error: snapErr } = await supa.from('drive_funnel_snapshots')
    .upsert({
      window_start: win, kind: 'funnel', writer: 'cloud/funnel-sweep',
      reading, errors, started_at: started, finished_at: new Date().toISOString(),
    }, { onConflict: 'window_start,kind', ignoreDuplicates: true })
    .select('id, writer').maybeSingle()
  if (snapErr) errors.push(`snapshot: ${snapErr.message}`)

  // A receipt every run, including a run that changed nothing.
  await supa.from('drive_hub_auto_log').insert({
    agent: 'cloud/funnel-sweep',
    action_type: 'collection',
    summary: errors.length
      ? `Cloud sweep completed with ${errors.length} unreadable source(s). Counts that could not be read are null, not zero.`
      : `Cloud sweep read the funnel and parked ${parked.length} overdue item(s).`,
    detail: { reading, parked: parked.length, errors, window_start: win, wrote_snapshot: !!snap },
  })

  // The 48-hour observation window starts itself on the first SCHEDULED success.
  // Nobody has to remember to begin it, and it cannot be begun early.
  let vacation: unknown = null
  try { const { data } = await supa.rpc('drive_start_vacation_test'); vacation = data } catch { /* not fatal */ }

  return json({
    ok: errors.length === 0, window_start: win, wrote_snapshot: !!snap, vacation_test: vacation,
    writer: snap?.writer ?? 'another writer already owned this window',
    reading, parked: parked.length, errors,
  })
})
