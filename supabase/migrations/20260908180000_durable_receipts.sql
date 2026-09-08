-- Durable per-run receipts.
--
-- The 48-hour window recorded 192 successful scheduled runs and 191 receipts. One run
-- succeeded and left no evidence it had ever happened.
--
-- The cause was line 99 of funnel-sweep: the auto_log insert's error was never read.
-- A failed receipt was swallowed, the function still returned 200, and pg_cron
-- recorded a success. Which is the same failure shape as the claim-limits gate that
-- loaded zero rules and printed PASS, and the purge that retired zero and left 96
-- cards live: an operation that did nothing was indistinguishable from one that
-- worked.
--
-- Two changes make a silent run impossible rather than merely unlikely:
--   1. every run carries a run_id, unique, so a receipt belongs to exactly one run
--   2. a run whose receipt does not land is a FAILED run, and says so

ALTER TABLE public.drive_hub_auto_log
  ADD COLUMN IF NOT EXISTS run_id     text,
  ADD COLUMN IF NOT EXISTS source     text,
  ADD COLUMN IF NOT EXISTS evidence   jsonb;

COMMENT ON COLUMN public.drive_hub_auto_log.run_id IS
  'Stable id for the execution that produced this receipt. Unique, so a retry cannot create a second receipt for one run and a missing receipt is detectable by absence.';
COMMENT ON COLUMN public.drive_hub_auto_log.source IS
  'Which runtime produced this: cloud/pg_cron, cloud/manual, local/worker. Attribution, not decoration.';
COMMENT ON COLUMN public.drive_hub_auto_log.evidence IS
  'The evidence tuple: examined, matched, changed, remaining, errors, source_population, complete. A count without it is not evidence.';

CREATE UNIQUE INDEX IF NOT EXISTS drive_hub_auto_log_run_id
  ON public.drive_hub_auto_log (run_id) WHERE run_id IS NOT NULL;

-- Reconciles receipts against pg_cron's own record of what ran. This is the check
-- that would have caught the silent run while it was happening rather than 48 hours
-- later, and it CAN fail: it compares two independent sources.
CREATE OR REPLACE FUNCTION public.drive_receipt_audit(p_since timestamptz DEFAULT now() - interval '24 hours')
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  cron_ok      int := 0;
  cron_fail    int := 0;
  receipts     int := 0;
  with_run_id  int := 0;
  with_evidence int := 0;
  readable     boolean := true;
BEGIN
  BEGIN
    SELECT count(*) FILTER (WHERE d.status = 'succeeded'),
           count(*) FILTER (WHERE d.status <> 'succeeded')
      INTO cron_ok, cron_fail
      FROM cron.job_run_details d JOIN cron.job j ON j.jobid = d.jobid
     WHERE j.jobname = 'drive-hub-cloud-sweep' AND d.start_time >= p_since;
  EXCEPTION WHEN OTHERS THEN readable := false; END;

  SELECT count(*), count(*) FILTER (WHERE run_id IS NOT NULL), count(*) FILTER (WHERE evidence IS NOT NULL)
    INTO receipts, with_run_id, with_evidence
    FROM public.drive_hub_auto_log
   WHERE agent = 'cloud/funnel-sweep' AND at >= p_since;

  RETURN jsonb_build_object(
    -- The evidence tuple, applied to the audit itself.
    'examined', coalesce(cron_ok, 0) + coalesce(cron_fail, 0),
    'matched', receipts,
    'changed', 0,
    'remaining', greatest(0, coalesce(cron_ok, 0) - receipts),
    'errors', CASE WHEN readable THEN '[]'::jsonb ELSE '["cron.job_run_details unreadable"]'::jsonb END,
    'source_population', jsonb_build_object('cron_successes', cron_ok, 'cron_failures', cron_fail, 'since', p_since),
    -- A zero result only means something if the population was actually read.
    'complete', readable,
    'silent_runs', greatest(0, coalesce(cron_ok, 0) - receipts),
    'receipts_with_run_id', with_run_id,
    'receipts_with_evidence', with_evidence,
    'verdict', CASE
      WHEN NOT readable THEN 'unknown: could not read the scheduler'
      WHEN coalesce(cron_ok, 0) = 0 THEN 'unknown: no scheduled runs in the window to audit'
      WHEN receipts >= coalesce(cron_ok, 0) THEN 'every scheduled success left a receipt'
      ELSE 'SILENT RUNS: ' || (coalesce(cron_ok, 0) - receipts)::text || ' scheduled success(es) with no receipt' END);
END;
$$;

GRANT EXECUTE ON FUNCTION public.drive_receipt_audit(timestamptz) TO authenticated, service_role;
