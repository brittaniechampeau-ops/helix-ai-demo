-- Arm the schedule now that the secret exists and is readable only by the database.

CREATE OR REPLACE FUNCTION public.drive_hub_run_cloud_sweep()
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  secret text := public.drive_hub_sweep_secret();
  req_id bigint;
BEGIN
  IF secret IS NULL OR secret = '' THEN
    RAISE NOTICE 'cloud_sweep_secret is not in Vault; cloud sweep not dispatched';
    RETURN NULL;
  END IF;
  SELECT net.http_post(
    url := 'https://ilhljjkiijmjpwinovzj.supabase.co/functions/v1/funnel-sweep',
    headers := jsonb_build_object('content-type', 'application/json', 'x-sweep-secret', secret),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  ) INTO req_id;
  RETURN req_id;
END;
$$;

REVOKE ALL ON FUNCTION public.drive_hub_run_cloud_sweep() FROM public, anon, authenticated;

-- Every 15 minutes rather than hourly, so a 48-hour observation window produces
-- enough scheduled receipts to tell a healthy run from a lucky one.
SELECT cron.unschedule('drive-hub-cloud-sweep')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'drive-hub-cloud-sweep');

SELECT cron.schedule('drive-hub-cloud-sweep', '7,22,37,52 * * * *',
  $$SELECT public.drive_hub_run_cloud_sweep();$$);
