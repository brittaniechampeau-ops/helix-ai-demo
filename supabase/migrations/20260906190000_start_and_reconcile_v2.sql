-- Starting, and reconciling, under the corrected protocol.

-- Only a genuinely SCHEDULED execution may start the test, and only when every
-- precondition is recorded as met. A hand-invoked run can never open the window.
CREATE OR REPLACE FUNCTION public.drive_start_vacation_test(p_trigger_kind text DEFAULT 'manual')
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  existing  record;
  unmet     text[];
  new_id    bigint;
  now_ts    timestamptz := now();
BEGIN
  SELECT * INTO existing FROM public.drive_vacation_test
   WHERE status = 'running' ORDER BY started_at DESC LIMIT 1;
  IF existing.id IS NOT NULL THEN
    RETURN jsonb_build_object('already_running', true, 'started_at', existing.started_at, 'ends_at', existing.ends_at);
  END IF;

  IF p_trigger_kind <> 'scheduled' THEN
    RETURN jsonb_build_object('started', false,
      'why', 'only a scheduled execution may open the window; this call was ' || p_trigger_kind);
  END IF;

  SELECT array_agg(id) INTO unmet FROM public.drive_test_preconditions WHERE met = false;
  IF unmet IS NOT NULL THEN
    RETURN jsonb_build_object('started', false, 'why', 'preconditions unmet', 'unmet', unmet);
  END IF;

  INSERT INTO public.drive_vacation_test
    (started_at, ends_at, start_conditions, expected_runs, status, spec_id, trigger_kind)
  VALUES (now_ts, now_ts + interval '48 hours',
    jsonb_build_object(
      'trigger', 'first scheduled successful cloud-sweep execution after all preconditions',
      'trigger_not_evaluated_as_a_window', true,
      'preconditions', (SELECT jsonb_object_agg(id, jsonb_build_object('met_at', met_at, 'evidence', evidence))
                        FROM public.drive_test_preconditions),
      'baseline_id', (SELECT max(id) FROM public.drive_test_baseline)),
    192, 'running', 'vacation-48h-v2', 'scheduled')
  RETURNING id INTO new_id;

  RETURN jsonb_build_object('started', true, 'id', new_id, 'started_at', now_ts,
                            'ends_at', now_ts + interval '48 hours', 'expected_runs', 192);
END;
$$;

-- Reconciliation. Records raw scheduled time, actual start and delay per window, and
-- never widens a bucket to rescue a late run.
CREATE OR REPLACE FUNCTION public.drive_vacation_reconcile()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  t             record;
  spec          jsonb;
  tol           int;
  horizon       timestamptz;
  expected_all  int := 0;
  expected_el   int := 0;
  observed      int := 0;
  succeeded     int := 0;
  failed        int := 0;
  late_outside  int := 0;
  dup_buckets   int := 0;
  dup_windows   int := 0;
  max_delay     numeric := 0;
  receipts      int := 0;
  snapshots     int := 0;
  missed        jsonb := '[]'::jsonb;
  consec        boolean := false;
  detail        jsonb := '[]'::jsonb;
  ext_unknown   int := 0;
  ext_system    int := 0;
  verdict       text;
BEGIN
  SELECT * INTO t FROM public.drive_vacation_test WHERE status = 'running' ORDER BY started_at DESC LIMIT 1;
  IF t.id IS NULL THEN
    SELECT * INTO t FROM public.drive_vacation_test ORDER BY started_at DESC LIMIT 1;
    IF t.id IS NULL THEN RETURN jsonb_build_object('exists', false); END IF;
  END IF;

  SELECT s.spec INTO spec FROM public.drive_test_spec s WHERE s.id = coalesce(t.spec_id, 'vacation-48h-v2');
  tol := coalesce((spec->'interval_convention'->>'tolerance_seconds')::int, 90);
  horizon := least(now(), t.ends_at);

  WITH minutes AS (
    SELECT g AS scheduled_at FROM generate_series(date_trunc('minute', t.started_at), t.ends_at, interval '1 minute') g
    WHERE extract(minute FROM g)::int IN (7,22,37,52) AND g > t.started_at AND g <= t.ends_at
  ),
  elapsed AS (SELECT scheduled_at FROM minutes WHERE scheduled_at <= horizon),
  runs AS (
    SELECT d.start_time, d.status,
           date_trunc('minute', d.start_time) AS bucket,
           extract(epoch FROM (d.start_time - date_trunc('minute', d.start_time))) AS delay_s
      FROM cron.job_run_details d JOIN cron.job j ON j.jobid = d.jobid
     WHERE j.jobname = 'drive-hub-cloud-sweep' AND d.start_time > t.started_at AND d.start_time <= horizon
  ),
  matched AS (
    SELECT e.scheduled_at,
           (SELECT count(*) FROM runs r WHERE r.bucket = e.scheduled_at AND r.delay_s <= tol) AS n_in_tol,
           (SELECT count(*) FROM runs r WHERE r.bucket = e.scheduled_at) AS n_any,
           (SELECT count(*) FROM runs r WHERE r.bucket = e.scheduled_at AND r.status = 'succeeded' AND r.delay_s <= tol) AS n_ok,
           (SELECT count(*) FROM runs r WHERE r.bucket = e.scheduled_at AND r.status <> 'succeeded') AS n_bad,
           (SELECT min(r.start_time) FROM runs r WHERE r.bucket = e.scheduled_at) AS actual_start,
           (SELECT max(r.delay_s) FROM runs r WHERE r.bucket = e.scheduled_at) AS delay_s
      FROM elapsed e
  )
  SELECT (SELECT count(*) FROM minutes),
         (SELECT count(*) FROM elapsed),
         (SELECT count(*) FROM matched WHERE n_in_tol > 0),
         (SELECT coalesce(sum(n_ok),0) FROM matched),
         (SELECT coalesce(sum(n_bad),0) FROM matched),
         (SELECT count(*) FROM matched WHERE n_any > 0 AND n_in_tol = 0),
         (SELECT count(*) FROM matched WHERE n_any > 1),
         (SELECT coalesce(max(delay_s),0) FROM matched),
         (SELECT coalesce(jsonb_agg(scheduled_at ORDER BY scheduled_at), '[]'::jsonb) FROM matched WHERE n_in_tol = 0),
         (SELECT coalesce(jsonb_agg(jsonb_build_object(
             'scheduled_at', scheduled_at, 'actual_start', actual_start,
             'delay_seconds', round(coalesce(delay_s,0)::numeric,2),
             'within_tolerance', coalesce(n_in_tol,0) > 0) ORDER BY scheduled_at), '[]'::jsonb)
          FROM matched WHERE n_in_tol = 0 OR coalesce(delay_s,0) > tol/2.0)
    INTO expected_all, expected_el, observed, succeeded, failed, late_outside, dup_buckets, max_delay, missed, detail;

  -- Two consecutive missed windows: 15 minutes apart on this schedule.
  SELECT EXISTS (
    SELECT 1 FROM (SELECT (value::text)::timestamptz AS m FROM jsonb_array_elements_text(missed) value) a
    JOIN (SELECT (value::text)::timestamptz AS m FROM jsonb_array_elements_text(missed) value) b
      ON b.m > a.m AND b.m <= a.m + interval '16 minutes'
  ) INTO consec;

  SELECT count(*) INTO snapshots FROM public.drive_funnel_snapshots
   WHERE window_start > t.started_at AND window_start <= horizon;
  SELECT count(*) INTO dup_windows FROM (
    SELECT window_start FROM public.drive_funnel_snapshots
     WHERE window_start > t.started_at AND window_start <= horizon
     GROUP BY window_start, kind HAVING count(*) > 1) x;
  SELECT count(*) INTO receipts FROM public.drive_hub_auto_log
   WHERE agent = 'cloud/funnel-sweep' AND at > t.started_at AND at <= horizon;

  SELECT count(*) FILTER (WHERE attribution = 'unknown' AND NOT reconciled),
         count(*) FILTER (WHERE attribution = 'system_caused' AND NOT reconciled)
    INTO ext_unknown, ext_system
    FROM public.drive_test_external WHERE observed_at > t.started_at;

  verdict := CASE
    WHEN now() < t.ends_at THEN 'in progress, no verdict before 48 hours have elapsed'
    WHEN observed < 190 OR consec OR failed > 0 OR dup_buckets > 0 OR dup_windows > 0
         OR ext_system > 0 OR (succeeded - receipts) > 0 THEN 'FAIL'
    WHEN observed = 192 AND ext_unknown = 0 THEN 'PASS'
    ELSE 'CONDITIONAL PASS' END;

  RETURN jsonb_build_object(
    'exists', true, 'spec_id', coalesce(t.spec_id, 'vacation-48h-v2'), 'status', t.status,
    'tolerance_seconds', tol,
    'interval_convention', spec->'interval_convention',
    'started_at', t.started_at, 'ends_at', t.ends_at, 'reconciled_to', horizon,
    'trigger_kind', t.trigger_kind, 'trigger_counted_as_window', false,
    'complete', now() >= t.ends_at,
    'elapsed_hours', round(extract(epoch FROM (horizon - t.started_at)) / 3600.0, 2),
    'expected_runs_full_window', expected_all,
    'expected_runs_elapsed', expected_el,
    'observed_runs', observed,
    'successful_runs', succeeded,
    'failed_or_partial_runs', failed,
    'ran_but_outside_tolerance', late_outside,
    'missed_windows', missed,
    'two_consecutive_missed', consec,
    'duplicate_cron_buckets', dup_buckets,
    'duplicate_snapshot_windows', dup_windows,
    'distinct_snapshot_windows', snapshots,
    'successful_receipts', receipts,
    'silent_or_missing_receipts', greatest(0, succeeded - receipts),
    'max_execution_delay_seconds', round(max_delay, 2),
    'window_detail_of_interest', detail,
    'external_unknown_unreconciled', ext_unknown,
    'external_system_caused', ext_system,
    'verdict', verdict);
END;
$$;

GRANT EXECUTE ON FUNCTION public.drive_vacation_reconcile() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.drive_start_vacation_test(text) TO service_role;
