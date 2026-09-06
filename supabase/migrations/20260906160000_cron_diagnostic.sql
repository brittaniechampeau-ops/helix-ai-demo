-- The schedule is armed but has never fired. Find out why rather than guessing.
CREATE OR REPLACE FUNCTION public.drive_cron_diagnostic()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE j jsonb; r jsonb; n jsonb; dbname text;
BEGIN
  SELECT current_database() INTO dbname;
  BEGIN
    SELECT jsonb_agg(to_jsonb(x)) INTO j FROM (
      SELECT jobid, jobname, schedule, active, database, username, nodename, command
      FROM cron.job) x;
  EXCEPTION WHEN OTHERS THEN j := to_jsonb(SQLERRM); END;
  BEGIN
    SELECT jsonb_agg(to_jsonb(x)) INTO r FROM (
      SELECT jobid, status, return_message, start_time, end_time
      FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10) x;
  EXCEPTION WHEN OTHERS THEN r := to_jsonb(SQLERRM); END;
  BEGIN
    SELECT jsonb_agg(to_jsonb(x)) INTO n FROM (
      SELECT id, status_code, error_msg, created
      FROM net._http_response ORDER BY created DESC LIMIT 6) x;
  EXCEPTION WHEN OTHERS THEN n := to_jsonb(SQLERRM); END;
  RETURN jsonb_build_object('database', dbname, 'jobs', j, 'runs', r, 'http_responses', n, 'now', now());
END;
$$;
GRANT EXECUTE ON FUNCTION public.drive_cron_diagnostic() TO service_role;
