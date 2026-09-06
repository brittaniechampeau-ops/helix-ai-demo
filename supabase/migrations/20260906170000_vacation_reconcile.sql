-- Read-only reconciliation for the 48-hour window. Added at 13:25Z, three minutes
-- after the test began and BEFORE the freeze takes effect, because the freeze forbids
-- changing production during the test and this is the instrument that reads it.
--
-- It touches nothing the test is testing: no schedule, no funnel-sweep, no snapshot
-- table, no approval. It only counts.
--
-- INTERVAL CONVENTION, stated once and used everywhere:
--   A WINDOW is one scheduled minute of '7,22,37,52 * * * *'.
--   The counted set is every such minute strictly after started_at and at or before
--   ends_at. The 13:22:00Z run that triggered the test is the trigger, not a window.
--   A window is OBSERVED when cron.job_run_details holds a row for this job whose
--   start_time falls within that minute (a 60-second bucket).
--   A window is MISSED when it has elapsed and no such row exists.
--   DELAY is start_time minus the scheduled minute, in seconds.
--   A window is DUPLICATED when two or more rows fall in the same bucket, or when
--   drive_funnel_snapshots holds two rows for one window_start.

CREATE OR REPLACE FUNCTION public.drive_vacation_reconcile()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  t            record;
  horizon      timestamptz;
  expected     int := 0;
  observed     int := 0;
  succeeded    int := 0;
  failed       int := 0;
  dup_buckets  int := 0;
  dup_windows  int := 0;
  max_delay    numeric := 0;
  receipts_ok  int := 0;
  snapshots    int := 0;
  missed_list  jsonb := '[]'::jsonb;
BEGIN
  SELECT * INTO t FROM public.drive_vacation_test ORDER BY started_at DESC LIMIT 1;
  IF t.id IS NULL THEN RETURN jsonb_build_object('exists', false); END IF;

  -- Only reconcile time that has actually passed.
  horizon := least(now(), t.ends_at);

  -- Every scheduled minute in the window, generated rather than assumed.
  WITH minutes AS (
    SELECT g AS at FROM generate_series(
      date_trunc('minute', t.started_at), t.ends_at, interval '1 minute') g
    WHERE extract(minute FROM g)::int IN (7, 22, 37, 52)
      AND g > t.started_at AND g <= t.ends_at
  ),
  elapsed AS (SELECT at FROM minutes WHERE at <= horizon),
  runs AS (
    SELECT date_trunc('minute', d.start_time) AS bucket, d.status, d.start_time,
           extract(epoch FROM (d.start_time - date_trunc('minute', d.start_time))) AS delay_s
    FROM cron.job_run_details d JOIN cron.job j ON j.jobid = d.jobid
    WHERE j.jobname = 'drive-hub-cloud-sweep' AND d.start_time > t.started_at AND d.start_time <= horizon
  ),
  joined AS (
    SELECT e.at, count(r.*) AS n,
           count(*) FILTER (WHERE r.status = 'succeeded') AS ok,
           count(*) FILTER (WHERE r.status IS NOT NULL AND r.status <> 'succeeded') AS bad,
           coalesce(max(r.delay_s), 0) AS delay
    FROM elapsed e LEFT JOIN runs r ON r.bucket = e.at GROUP BY e.at
  )
  SELECT (SELECT count(*) FROM minutes),
         (SELECT count(*) FROM joined WHERE n > 0),
         (SELECT coalesce(sum(ok), 0) FROM joined),
         (SELECT coalesce(sum(bad), 0) FROM joined),
         (SELECT count(*) FROM joined WHERE n > 1),
         (SELECT coalesce(max(delay), 0) FROM joined),
         (SELECT coalesce(jsonb_agg(at ORDER BY at), '[]'::jsonb) FROM joined WHERE n = 0)
    INTO expected, observed, succeeded, failed, dup_buckets, max_delay, missed_list;

  -- Two writers for one window would appear here. It cannot happen through the
  -- unique index, and this is where it would surface if it ever did.
  SELECT count(*) INTO snapshots FROM public.drive_funnel_snapshots
   WHERE window_start > t.started_at AND window_start <= horizon;
  SELECT count(*) INTO dup_windows FROM (
    SELECT window_start FROM public.drive_funnel_snapshots
     WHERE window_start > t.started_at AND window_start <= horizon
     GROUP BY window_start, kind HAVING count(*) > 1) x;

  -- A receipt is an auto_log row written by the cloud sweep itself.
  SELECT count(*) INTO receipts_ok FROM public.drive_hub_auto_log
   WHERE agent = 'cloud/funnel-sweep' AND at > t.started_at AND at <= horizon;

  RETURN jsonb_build_object(
    'exists', true,
    'interval_convention', 'a window is one scheduled minute of 7,22,37,52 * * * *, strictly after started_at and at or before ends_at; observed when a cron run starts within that 60-second bucket',
    'started_at', t.started_at, 'ends_at', t.ends_at, 'reconciled_to', horizon,
    'complete', now() >= t.ends_at,
    'elapsed_hours', round(extract(epoch FROM (horizon - t.started_at)) / 3600.0, 2),
    'expected_runs_full_window', expected,
    'expected_runs_elapsed', (SELECT count(*) FROM generate_series(date_trunc('minute', t.started_at), horizon, interval '1 minute') g
                              WHERE extract(minute FROM g)::int IN (7,22,37,52) AND g > t.started_at AND g <= horizon),
    'observed_runs', observed,
    'successful_runs', succeeded,
    'failed_or_partial_runs', failed,
    'missed_windows', missed_list,
    'duplicate_run_buckets', dup_buckets,
    'duplicate_snapshot_windows', dup_windows,
    'distinct_snapshot_windows', snapshots,
    'successful_receipts', receipts_ok,
    'max_execution_delay_seconds', round(max_delay, 2),
    'verdict', CASE
      WHEN now() < t.ends_at THEN 'in progress, no verdict before 48 hours have elapsed'
      WHEN failed = 0 AND dup_buckets = 0 AND dup_windows = 0
           AND succeeded >= (expected * 0.9)::int THEN 'PASS'
      ELSE 'FAIL' END);
END;
$$;

GRANT EXECUTE ON FUNCTION public.drive_vacation_reconcile() TO authenticated, service_role;
