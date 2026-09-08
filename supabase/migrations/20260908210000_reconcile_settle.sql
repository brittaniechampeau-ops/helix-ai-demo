-- Report the same window's receipts with and without the settle allowance, so the
-- boundary artifact is visible rather than inferred. Fable can then see both numbers
-- and decide which one the criteria meant.
CREATE OR REPLACE FUNCTION public.drive_vacation_boundary_check()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  t                record;
  strict_count     int;
  settled_count    int;
  last_run_start   timestamptz;
  last_receipt_at  timestamptz;
BEGIN
  SELECT * INTO t FROM public.drive_vacation_test ORDER BY started_at DESC LIMIT 1;
  IF t.id IS NULL THEN RETURN jsonb_build_object('exists', false); END IF;

  strict_count  := public.drive_receipt_count_for_window(t.started_at, t.ends_at, 0);
  settled_count := public.drive_receipt_count_for_window(t.started_at, t.ends_at, 120);

  BEGIN
    SELECT max(d.start_time) INTO last_run_start
      FROM cron.job_run_details d JOIN cron.job j ON j.jobid = d.jobid
     WHERE j.jobname = 'drive-hub-cloud-sweep'
       AND d.status = 'succeeded' AND d.start_time > t.started_at AND d.start_time <= t.ends_at;
  EXCEPTION WHEN OTHERS THEN last_run_start := NULL; END;

  SELECT min(at) INTO last_receipt_at FROM public.drive_hub_auto_log
   WHERE agent = 'cloud/funnel-sweep' AND at > t.ends_at
     AND at <= t.ends_at + interval '120 seconds';

  RETURN jsonb_build_object(
    'started_at', t.started_at, 'ends_at', t.ends_at,
    'receipts_strict_to_ends_at', strict_count,
    'receipts_with_120s_settle', settled_count,
    'difference', settled_count - strict_count,
    'last_scheduled_run_started', last_run_start,
    'first_receipt_after_ends_at', last_receipt_at,
    'lag_seconds', CASE WHEN last_receipt_at IS NULL THEN NULL
                        ELSE round(extract(epoch FROM (last_receipt_at - t.ends_at))::numeric, 3) END,
    'interpretation', CASE
      WHEN settled_count - strict_count = 1 AND last_receipt_at IS NOT NULL
        THEN 'boundary artifact: one receipt landed just after ends_at, so the run was not silent'
      WHEN settled_count - strict_count = 0
        THEN 'not a boundary artifact: no receipt landed in the settle window after ends_at'
      ELSE 'inconclusive' END);
END;
$$;
GRANT EXECUTE ON FUNCTION public.drive_vacation_boundary_check() TO authenticated, service_role;
