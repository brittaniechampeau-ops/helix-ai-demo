-- Both the receipt audit and the window reconciliation had a timing defect.
--
-- pg_cron records a run as succeeded the instant drive_hub_run_cloud_sweep() returns,
-- which is when net.http_post has QUEUED the request. Measured today: cron success at
-- 18:22:00.14, and the receipt written at 18:22:02.97 — 2.8 seconds later.
--
-- Consequence 1: the audit, called in that gap, sees a success with no receipt and
-- reports a silent run. It did exactly that at 18:22 today. A check that cries wolf on
-- work still in flight is alarm, not evidence.
--
-- Consequence 2, and it matters more: the 48-hour reconciliation counted receipts only
-- up to ends_at. The final scheduled run began at 16:22:00 and would have written its
-- receipt around 16:22:03, AFTER the window closed. That is almost certainly the
-- "1 silent or missing receipt" the closing reconciliation reported, and it is a
-- boundary artifact rather than a lost receipt.
--
-- Fixed by giving both a settle window. A run is only expected to have a receipt once
-- enough time has passed for it to write one; before that it is IN FLIGHT, which is a
-- third state and not a failure.

CREATE OR REPLACE FUNCTION public.drive_receipt_audit(
  p_since timestamptz DEFAULT now() - interval '24 hours',
  p_settle_seconds int DEFAULT 120)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  cron_ok        int := 0;
  cron_fail      int := 0;
  in_flight      int := 0;
  r_scheduled    int := 0;
  r_manual       int := 0;
  r_unattributed int := 0;
  readable       boolean := true;
  decidable      boolean;
  silent         int;
  cutoff         timestamptz := now() - make_interval(secs => p_settle_seconds);
BEGIN
  BEGIN
    SELECT count(*) FILTER (WHERE d.status = 'succeeded' AND d.start_time <= cutoff),
           count(*) FILTER (WHERE d.status <> 'succeeded'),
           count(*) FILTER (WHERE d.status = 'succeeded' AND d.start_time > cutoff)
      INTO cron_ok, cron_fail, in_flight
      FROM cron.job_run_details d JOIN cron.job j ON j.jobid = d.jobid
     WHERE j.jobname = 'drive-hub-cloud-sweep' AND d.start_time >= p_since;
  EXCEPTION WHEN OTHERS THEN readable := false; END;

  -- Receipts are counted to now(), not to the cutoff: a settled run's receipt may
  -- have landed at any point after it started.
  SELECT count(*) FILTER (WHERE source = 'cloud/pg_cron'),
         count(*) FILTER (WHERE source = 'cloud/manual'),
         count(*) FILTER (WHERE source IS NULL)
    INTO r_scheduled, r_manual, r_unattributed
    FROM public.drive_hub_auto_log
   WHERE agent = 'cloud/funnel-sweep' AND at >= p_since;

  decidable := readable AND r_unattributed = 0;
  silent := greatest(0, coalesce(cron_ok, 0) - r_scheduled);

  RETURN jsonb_build_object(
    'examined', coalesce(cron_ok, 0) + coalesce(cron_fail, 0),
    'matched', r_scheduled,
    'changed', 0,
    'remaining', CASE WHEN decidable THEN silent ELSE NULL END,
    'errors', (CASE WHEN readable THEN '[]'::jsonb ELSE '["cron.job_run_details unreadable"]'::jsonb END)
              || (CASE WHEN r_unattributed > 0
                       THEN jsonb_build_array(r_unattributed::text || ' receipt(s) predate source attribution and cannot be assigned')
                       ELSE '[]'::jsonb END),
    'source_population', jsonb_build_object(
      'cron_successes_settled', cron_ok, 'cron_failures', cron_fail,
      'cron_successes_in_flight', in_flight, 'settle_seconds', p_settle_seconds,
      'receipts_scheduled', r_scheduled, 'receipts_manual', r_manual,
      'receipts_unattributed', r_unattributed, 'since', p_since),
    'complete', decidable,
    'in_flight', in_flight,
    'silent_runs', CASE WHEN decidable THEN silent ELSE NULL END,
    'verdict', CASE
      WHEN NOT readable THEN 'unknown: could not read the scheduler'
      WHEN r_unattributed > 0 THEN 'unknown: ' || r_unattributed::text || ' unattributed receipt(s) make the comparison undecidable'
      WHEN coalesce(cron_ok, 0) = 0 AND in_flight > 0 THEN 'unknown: the only run(s) in this window are still in flight'
      WHEN coalesce(cron_ok, 0) = 0 THEN 'unknown: no settled scheduled runs in the window to audit'
      WHEN silent = 0 THEN 'every settled scheduled success left an attributed receipt'
      ELSE 'SILENT RUNS: ' || silent::text || ' settled scheduled success(es) with no receipt' END);
END;
$$;

-- The reconciliation gets the same settle window, so the final run of a window is not
-- judged before it could have written its receipt.
CREATE OR REPLACE FUNCTION public.drive_receipt_count_for_window(
  p_start timestamptz, p_end timestamptz, p_settle_seconds int DEFAULT 120)
RETURNS int LANGUAGE sql SECURITY DEFINER AS $$
  SELECT count(*)::int FROM public.drive_hub_auto_log
   WHERE agent = 'cloud/funnel-sweep'
     AND at > p_start
     AND at <= p_end + make_interval(secs => p_settle_seconds);
$$;

GRANT EXECUTE ON FUNCTION public.drive_receipt_audit(timestamptz, int) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.drive_receipt_count_for_window(timestamptz, timestamptz, int) TO authenticated, service_role;
