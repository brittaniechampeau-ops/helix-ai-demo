-- Schedule the deterministic sweep in the database, so it runs with the laptop shut.
--
-- The secret is NOT in this file and must never be. pg_cron reads it from Vault by
-- name at call time. If the Vault secret is absent the scheduled call arrives without
-- a header, funnel-sweep answers 401, and nothing happens: it fails closed rather
-- than running unauthenticated.

CREATE EXTENSION IF NOT EXISTS pg_cron  WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net   WITH SCHEMA extensions;

-- Reads the secret by name. Returns NULL when it has not been created yet, which is
-- what makes the unconfigured state safe instead of open.
CREATE OR REPLACE FUNCTION public.drive_hub_sweep_secret()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v text;
BEGIN
  SELECT decrypted_secret INTO v
  FROM vault.decrypted_secrets WHERE name = 'hub_integration_secret' LIMIT 1;
  RETURN v;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.drive_hub_run_cloud_sweep()
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  secret text := public.drive_hub_sweep_secret();
  req_id bigint;
BEGIN
  IF secret IS NULL OR secret = '' THEN
    -- Say so once per run rather than calling an endpoint that will refuse us.
    RAISE NOTICE 'hub_integration_secret is not in Vault; cloud sweep not dispatched';
    RETURN NULL;
  END IF;
  SELECT net.http_post(
    url := 'https://ilhljjkiijmjpwinovzj.supabase.co/functions/v1/funnel-sweep',
    headers := jsonb_build_object('content-type', 'application/json', 'x-hub-secret', secret),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  ) INTO req_id;
  RETURN req_id;
END;
$$;

REVOKE ALL ON FUNCTION public.drive_hub_sweep_secret() FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.drive_hub_run_cloud_sweep() FROM public, anon, authenticated;

-- Hourly. The sweep is idempotent per window, so a missed hour self-heals on the
-- next one and a doubled hour is a no-op.
SELECT cron.unschedule('drive-hub-cloud-sweep')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'drive-hub-cloud-sweep');

SELECT cron.schedule(
  'drive-hub-cloud-sweep',
  '7 * * * *',
  $$SELECT public.drive_hub_run_cloud_sweep();$$
);
