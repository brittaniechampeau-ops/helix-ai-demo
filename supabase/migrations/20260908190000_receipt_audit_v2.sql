-- The first receipt audit was one of the checks it was supposed to replace.
--
-- It compared pg_cron's successes against EVERY funnel-sweep receipt, including the
-- ones written by hand-invoked runs. Over the 48-hour window that produced
-- "examined 199, matched 203, silent_runs 0, every scheduled success left a receipt"
-- while the reconciliation, comparing like with like, found 192 successes and 191
-- receipts. Extra manual receipts masked a missing scheduled one.
--
-- A check whose surplus can hide a deficit cannot genuinely fail. Fixed by comparing
-- scheduled runs only against receipts attributed to the scheduler, and by refusing
-- to answer at all when the window contains receipts that predate attribution.

CREATE OR REPLACE FUNCTION public.drive_receipt_audit(p_since timestamptz DEFAULT now() - interval '24 hours')
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  cron_ok        int := 0;
  cron_fail      int := 0;
  r_scheduled    int := 0;
  r_manual       int := 0;
  r_unattributed int := 0;
  r_no_evidence  int := 0;
  readable       boolean := true;
  decidable      boolean;
  silent         int;
BEGIN
  BEGIN
    SELECT count(*) FILTER (WHERE d.status = 'succeeded'),
           count(*) FILTER (WHERE d.status <> 'succeeded')
      INTO cron_ok, cron_fail
      FROM cron.job_run_details d JOIN cron.job j ON j.jobid = d.jobid
     WHERE j.jobname = 'drive-hub-cloud-sweep' AND d.start_time >= p_since;
  EXCEPTION WHEN OTHERS THEN readable := false; END;

  -- Like against like. A manual run's receipt is not evidence a scheduled run wrote one.
  SELECT count(*) FILTER (WHERE source = 'cloud/pg_cron'),
         count(*) FILTER (WHERE source = 'cloud/manual'),
         count(*) FILTER (WHERE source IS NULL),
         count(*) FILTER (WHERE evidence IS NULL)
    INTO r_scheduled, r_manual, r_unattributed, r_no_evidence
    FROM public.drive_hub_auto_log
   WHERE agent = 'cloud/funnel-sweep' AND at >= p_since;

  -- Receipts written before attribution existed cannot be assigned to either side, so
  -- the comparison is not decidable in a window that contains them. Say so rather
  -- than producing a number that looks clean.
  decidable := readable AND r_unattributed = 0;
  silent := greatest(0, coalesce(cron_ok, 0) - r_scheduled);

  RETURN jsonb_build_object(
    'examined', coalesce(cron_ok, 0) + coalesce(cron_fail, 0),
    'matched', r_scheduled,
    'changed', 0,
    'remaining', CASE WHEN decidable THEN silent ELSE NULL END,
    'errors', (CASE WHEN readable THEN '[]'::jsonb ELSE '["cron.job_run_details unreadable"]'::jsonb END)
              || (CASE WHEN r_unattributed > 0
                       THEN jsonb_build_array(r_unattributed::text || ' receipt(s) predate source attribution and cannot be assigned to a scheduled or manual run')
                       ELSE '[]'::jsonb END),
    'source_population', jsonb_build_object(
      'cron_successes', cron_ok, 'cron_failures', cron_fail,
      'receipts_scheduled', r_scheduled, 'receipts_manual', r_manual,
      'receipts_unattributed', r_unattributed, 'receipts_without_evidence', r_no_evidence,
      'since', p_since),
    'complete', decidable,
    'silent_runs', CASE WHEN decidable THEN silent ELSE NULL END,
    'verdict', CASE
      WHEN NOT readable THEN 'unknown: could not read the scheduler'
      WHEN r_unattributed > 0 THEN 'unknown: ' || r_unattributed::text || ' unattributed receipt(s) in this window make the comparison undecidable'
      WHEN coalesce(cron_ok, 0) = 0 THEN 'unknown: no scheduled runs in the window to audit'
      WHEN silent = 0 THEN 'every scheduled success left an attributed receipt'
      ELSE 'SILENT RUNS: ' || silent::text || ' scheduled success(es) with no receipt' END);
END;
$$;

GRANT EXECUTE ON FUNCTION public.drive_receipt_audit(timestamptz) TO authenticated, service_role;
