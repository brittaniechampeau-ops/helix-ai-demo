-- Fable's repairs 1, 2, 5 and 11. Repair 3 and 10 are in application code.
--
-- Fable issued FAIL on 2026-09-08 at 12:55 pm ET. It is final and is not re-litigated
-- here. What follows fixes the machinery that produced it, which is a different thing
-- from disputing it.

-- ── REPAIR 11: close the window ──────────────────────────────────────────────
-- status still read 'running' at audit time, which blocks any successor window and
-- was itself one of the missing closing artifacts Fable looked for and did not find.
ALTER TABLE public.drive_vacation_test
  ADD COLUMN IF NOT EXISTS verdict_text      text,
  ADD COLUMN IF NOT EXISTS verdict_issued_by text,
  ADD COLUMN IF NOT EXISTS verdict_issued_at timestamptz,
  ADD COLUMN IF NOT EXISTS closing_artifact  text;

UPDATE public.drive_vacation_test
   SET status = 'closed_fail',
       verdict = jsonb_build_object(
         'verdict', 'FAIL',
         'issued_by', 'Fable, independent audit',
         'issued_at', '2026-09-08T16:55:00Z',
         'final', true,
         'not_re_litigated', 'This window is closed. The boundary finding about the 192nd receipt is a defect in the reconciliation, not a route to a pass.',
         'causes', jsonb_build_array(
           'one scheduled run left no receipt when counted strictly to ends_at',
           'one external change (active_subscribers 14 to 15) was unreconciled at audit time'),
         'closing_artifact_absent_at_audit_time', true,
         'report', 'review/FABLE-ACCEPTANCE-AUDIT-2026-09-08.md'),
       verdict_text = 'FAIL',
       verdict_issued_by = 'Fable',
       verdict_issued_at = '2026-09-08T16:55:00Z',
       closing_artifact = 'review/CLOSING-RECONCILIATION-2026-09-08.md, written after the audit had already run'
 WHERE status = 'running';

-- ── REPAIR 1: the unknown-external guard was inert ───────────────────────────
-- drive_test_external was created and never written to, so
-- external_unknown_unreconciled was always 0. Had the last receipt landed three
-- seconds earlier this window would have PASSED with an unattributed subscriber in
-- the record. The FAIL was caught by a timing accident, not by the safeguard.
--
-- A counter that reads zero because nothing populates its table is worse than no
-- counter: it looks like a cleared check. This makes the emptiness visible.
CREATE OR REPLACE FUNCTION public.drive_external_attribution_state(p_test_id bigint DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  t         record;
  rows_n    int := 0;
  base      jsonb;
  unknown_n int := 0;
  system_n  int := 0;
BEGIN
  IF p_test_id IS NULL THEN
    SELECT * INTO t FROM public.drive_vacation_test ORDER BY started_at DESC LIMIT 1;
  ELSE
    SELECT * INTO t FROM public.drive_vacation_test WHERE id = p_test_id;
  END IF;
  IF t.id IS NULL THEN RETURN jsonb_build_object('exists', false); END IF;

  SELECT count(*), count(*) FILTER (WHERE attribution = 'unknown' AND NOT reconciled),
         count(*) FILTER (WHERE attribution = 'system_caused' AND NOT reconciled)
    INTO rows_n, unknown_n, system_n
    FROM public.drive_test_external WHERE observed_at > t.started_at;

  SELECT counts INTO base FROM public.drive_test_baseline ORDER BY id DESC LIMIT 1;

  RETURN jsonb_build_object(
    -- The evidence tuple, so a zero here can never be mistaken for a cleared check.
    'examined', rows_n,
    'matched', rows_n,
    'changed', 0,
    'remaining', unknown_n,
    'errors', CASE WHEN rows_n = 0
                   THEN '["drive_test_external holds no rows for this window, so every attribution counter derived from it is vacuous, not clear"]'::jsonb
                   ELSE '[]'::jsonb END,
    'source_population', jsonb_build_object(
      'table', 'drive_test_external', 'rows_for_window', rows_n,
      'baseline_metrics', CASE WHEN base IS NULL THEN 0 ELSE (SELECT count(*) FROM jsonb_object_keys(base)) END),
    -- The whole point: unattributed-zero is not complete.
    'complete', rows_n > 0,
    'unknown_unreconciled', unknown_n,
    'system_caused_unreconciled', system_n,
    'verdict', CASE
      WHEN rows_n = 0 THEN 'VACUOUS: nothing has been attributed, so this guard cannot block a pass'
      WHEN unknown_n > 0 THEN 'BLOCKS PASS: ' || unknown_n::text || ' unattributed change(s)'
      WHEN system_n > 0 THEN 'FAILS: ' || system_n::text || ' unreconciled system-caused effect(s)'
      ELSE 'every observed change is attributed and reconciled' END);
END;
$$;

-- ── REPAIR 2: match receipts per window, with a grace period ─────────────────
-- The old comparison was aggregate: successes minus receipts across the whole window,
-- which cannot say WHICH window lacked one and judged the final run before it could
-- have written anything.
CREATE OR REPLACE FUNCTION public.drive_receipts_per_window(
  p_settle_seconds int DEFAULT 120)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  t          record;
  total      int := 0;
  matched    int := 0;
  unmatched  jsonb := '[]'::jsonb;
  readable   boolean := true;
BEGIN
  SELECT * INTO t FROM public.drive_vacation_test ORDER BY started_at DESC LIMIT 1;
  IF t.id IS NULL THEN RETURN jsonb_build_object('exists', false); END IF;

  BEGIN
    WITH runs AS (
      SELECT d.start_time
        FROM cron.job_run_details d JOIN cron.job j ON j.jobid = d.jobid
       WHERE j.jobname = 'drive-hub-cloud-sweep' AND d.status = 'succeeded'
         AND d.start_time > t.started_at AND d.start_time <= t.ends_at
    ),
    paired AS (
      SELECT r.start_time,
             -- A receipt belongs to the run it followed, within the grace period.
             (SELECT min(a.at) FROM public.drive_hub_auto_log a
               WHERE a.agent = 'cloud/funnel-sweep'
                 AND a.at >= r.start_time
                 AND a.at <= r.start_time + make_interval(secs => p_settle_seconds)) AS receipt_at
        FROM runs r
    )
    SELECT count(*), count(*) FILTER (WHERE receipt_at IS NOT NULL),
           coalesce(jsonb_agg(jsonb_build_object('run_started', start_time) ORDER BY start_time)
                    FILTER (WHERE receipt_at IS NULL), '[]'::jsonb)
      INTO total, matched, unmatched
      FROM paired;
  EXCEPTION WHEN OTHERS THEN readable := false; END;

  RETURN jsonb_build_object(
    'examined', total, 'matched', matched, 'changed', 0,
    'remaining', total - matched,
    'errors', CASE WHEN readable THEN '[]'::jsonb ELSE '["cron.job_run_details unreadable"]'::jsonb END,
    'source_population', jsonb_build_object('scheduled_successes_in_window', total,
                                            'settle_seconds', p_settle_seconds),
    'complete', readable,
    'runs_without_a_receipt', unmatched,
    'note', 'Per-run pairing with a grace period. Supersedes the aggregate subtraction that could not name which window was short.');
END;
$$;

-- ── REPAIR 5: counters that cannot fire are labelled, not reported as clear ──
CREATE OR REPLACE FUNCTION public.drive_structural_counters()
RETURNS jsonb LANGUAGE sql AS $$
  SELECT jsonb_build_array(
    jsonb_build_object('counter', 'duplicate_snapshot_windows',
      'status', 'STRUCTURAL ZERO',
      'why', 'a unique index on (window_start, kind) makes a duplicate unexpressible. The zero is a property of the schema, not an observation.',
      'reads_as_coverage', true),
    jsonb_build_object('counter', 'ran_but_outside_tolerance',
      'status', 'CANNOT FIRE',
      'why', 'delay is start_time minus date_trunc(minute, start_time), so it is bounded by 60 seconds and compared against a 90-second tolerance. It can never exceed the threshold.',
      'reads_as_coverage', true),
    jsonb_build_object('counter', 'external_unknown_unreconciled',
      'status', 'VACUOUS UNLESS POPULATED',
      'why', 'derived from drive_test_external, which nothing wrote to. See drive_external_attribution_state for the honest state.',
      'reads_as_coverage', true));
$$;

GRANT EXECUTE ON FUNCTION public.drive_external_attribution_state(bigint) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.drive_receipts_per_window(int) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.drive_structural_counters() TO authenticated, service_role;
