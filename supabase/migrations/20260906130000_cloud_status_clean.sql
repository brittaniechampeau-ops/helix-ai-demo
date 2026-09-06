-- Rewrites drive_hub_cloud_status cleanly. The previous version declared variables
-- mid-expression, which plpgsql does not allow.
--
-- The distinction this function exists to make: a hand-invoked success is NOT
-- running. Only a scheduled run that pg_cron completed counts.

CREATE OR REPLACE FUNCTION public.drive_hub_cloud_status()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  job_name      text;
  job_sched     text;
  job_active    boolean;
  last_snap     record;
  last_run      record;
  has_secret    boolean := false;
  sched_ok      int := 0;
  sched_fail    int := 0;
  last_sched    timestamptz;
  state         text;
BEGIN
  BEGIN has_secret := (public.drive_hub_sweep_secret() IS NOT NULL);
  EXCEPTION WHEN OTHERS THEN has_secret := false; END;

  BEGIN
    SELECT jobname, schedule, active INTO job_name, job_sched, job_active
    FROM cron.job WHERE jobname = 'drive-hub-cloud-sweep' LIMIT 1;
  EXCEPTION WHEN OTHERS THEN job_name := NULL; END;

  BEGIN
    SELECT count(*) FILTER (WHERE d.status = 'succeeded'),
           count(*) FILTER (WHERE d.status <> 'succeeded'),
           max(d.end_time) FILTER (WHERE d.status = 'succeeded')
      INTO sched_ok, sched_fail, last_sched
      FROM cron.job_run_details d
      JOIN cron.job j ON j.jobid = d.jobid
     WHERE j.jobname = 'drive-hub-cloud-sweep';
  EXCEPTION WHEN OTHERS THEN sched_ok := 0; sched_fail := 0; END;

  SELECT window_start, writer, reading, errors, finished_at
    INTO last_snap FROM public.drive_funnel_snapshots ORDER BY window_start DESC LIMIT 1;

  SELECT agent, summary, detail, at
    INTO last_run FROM public.drive_hub_auto_log
   WHERE agent = 'cloud/funnel-sweep' ORDER BY at DESC LIMIT 1;

  state := CASE
    WHEN coalesce(sched_ok, 0) > 0 THEN 'running'
    WHEN job_name IS NOT NULL AND coalesce(job_active, false) AND has_secret THEN 'armed'
    WHEN job_name IS NOT NULL THEN 'deployed'
    ELSE 'absent' END;

  RETURN jsonb_build_object(
    'operational_state', state,
    'scheduled_successes', coalesce(sched_ok, 0),
    'scheduled_failures', coalesce(sched_fail, 0),
    'last_scheduled_success', last_sched,
    'schedule', jsonb_build_object(
      'exists', job_name IS NOT NULL, 'name', job_name, 'cron', job_sched, 'active', job_active,
      'secret_present', has_secret,
      'armed', (job_name IS NOT NULL AND coalesce(job_active, false) AND has_secret)),
    'last_snapshot', CASE WHEN last_snap.window_start IS NULL THEN NULL ELSE jsonb_build_object(
      'window_start', last_snap.window_start, 'writer', last_snap.writer,
      'reading', last_snap.reading, 'errors', last_snap.errors,
      'age_minutes', round(extract(epoch FROM (now() - last_snap.window_start)) / 60)) END,
    'last_cloud_run', CASE WHEN last_run.at IS NULL THEN NULL ELSE jsonb_build_object(
      'summary', last_run.summary, 'at', last_run.at,
      'age_minutes', round(extract(epoch FROM (now() - last_run.at)) / 60)) END);
END;
$$;

REVOKE ALL ON FUNCTION public.drive_hub_cloud_status() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.drive_hub_cloud_status() TO authenticated, service_role;
