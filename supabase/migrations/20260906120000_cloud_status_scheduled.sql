-- Corrects the previous definition, which selected columns drive_hub_auto_log does
-- not have (result, created_at) instead of the ones it does (detail, at).

-- One place to answer "is the machine running without her".
--
-- Worker health, the last cloud sweep, and whether the schedule is armed. Read-only
-- and it never reveals a secret value: the Vault check reports presence, not content.

CREATE OR REPLACE FUNCTION public.drive_hub_cloud_status()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  job          record;
  last_snap    record;
  last_run     record;
  has_secret   boolean := false;
BEGIN
  BEGIN
    has_secret := (public.drive_hub_sweep_secret() IS NOT NULL);
  EXCEPTION WHEN OTHERS THEN has_secret := false;
  END;

  BEGIN
    SELECT jobname, schedule, active INTO job FROM cron.job WHERE jobname = 'drive-hub-cloud-sweep' LIMIT 1;
  EXCEPTION WHEN OTHERS THEN job := NULL;
  END;

  SELECT window_start, writer, reading, errors, finished_at
    INTO last_snap FROM public.drive_funnel_snapshots ORDER BY window_start DESC LIMIT 1;

  SELECT agent, summary, detail, at
    INTO last_run FROM public.drive_hub_auto_log
   WHERE agent = 'cloud/funnel-sweep' ORDER BY at DESC LIMIT 1;

  -- A scheduled run is the only thing that proves "running". Count the ones pg_cron
  -- actually completed, separately from hand-invoked successes.
  DECLARE scheduled_runs int := 0; last_scheduled timestamptz;
  BEGIN
    SELECT count(*), max(end_time) INTO scheduled_runs, last_scheduled
    FROM cron.job_run_details d JOIN cron.job j ON j.jobid = d.jobid
    WHERE j.jobname = 'drive-hub-cloud-sweep' AND d.status = 'succeeded';
  EXCEPTION WHEN OTHERS THEN scheduled_runs := 0;
  END;

  RETURN jsonb_build_object(
    'operational_state', CASE
      WHEN scheduled_runs > 0 THEN 'running'
      WHEN job.jobname IS NOT NULL AND coalesce(job.active,false) AND has_secret THEN 'armed'
      WHEN job.jobname IS NOT NULL THEN 'deployed'
      ELSE 'absent' END,
    'scheduled_successes', scheduled_runs,
    'last_scheduled_success', last_scheduled,
    'schedule', jsonb_build_object(
      'exists', job.jobname IS NOT NULL,
      'name', job.jobname, 'cron', job.schedule, 'active', job.active,
      -- Presence only. The value never leaves Vault.
      'secret_present', has_secret,
      'armed', (job.jobname IS NOT NULL AND coalesce(job.active, false) AND has_secret)
    ),
    'last_snapshot', CASE WHEN last_snap.window_start IS NULL THEN NULL ELSE jsonb_build_object(
      'window_start', last_snap.window_start, 'writer', last_snap.writer,
      'reading', last_snap.reading, 'errors', last_snap.errors,
      'age_minutes', round(extract(epoch FROM (now() - last_snap.window_start)) / 60)
    ) END,
    'last_cloud_run', CASE WHEN last_run.at IS NULL THEN NULL ELSE jsonb_build_object(
      'summary', last_run.summary, 'at', last_run.at,
      'age_minutes', round(extract(epoch FROM (now() - last_run.at)) / 60)
    ) END
  );
END;
$$;

REVOKE ALL ON FUNCTION public.drive_hub_cloud_status() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.drive_hub_cloud_status() TO authenticated, service_role;
