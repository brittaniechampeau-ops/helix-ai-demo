-- The activation view, and the 48-hour observation window.
--
-- One row per capability, answering the only questions that matter: is it deployed,
-- can it authenticate, is it armed, has a SCHEDULED run ever succeeded, when is the
-- next one, and if it is stuck, is that on Britt or on us.
--
-- "running" means a scheduled execution completed. A hand-invoked success does not
-- count, because conflating the two is what produced a vacation claim the evidence
-- did not support.

CREATE TABLE IF NOT EXISTS public.drive_activation (
  id                  text PRIMARY KEY,
  label               text NOT NULL,
  deployed            boolean NOT NULL DEFAULT false,
  authenticated       boolean NOT NULL DEFAULT false,
  armed               boolean NOT NULL DEFAULT false,
  schedule_cron       text,
  blocked_by_britt    text,
  blocked_technically text,
  external_readback   text,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.drive_activation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS drive_activation_admin_read ON public.drive_activation;
CREATE POLICY drive_activation_admin_read ON public.drive_activation FOR SELECT USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.drive_vacation_test (
  id                bigserial PRIMARY KEY,
  started_at        timestamptz NOT NULL,
  ends_at           timestamptz NOT NULL,
  start_conditions  jsonb NOT NULL,
  expected_runs     int NOT NULL,
  status            text NOT NULL DEFAULT 'running',
  verdict           jsonb,
  created_at        timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.drive_vacation_test ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS drive_vacation_test_admin_read ON public.drive_vacation_test;
CREATE POLICY drive_vacation_test_admin_read ON public.drive_vacation_test FOR SELECT USING (public.is_admin());

-- Starts itself the first time everything it depends on is genuinely armed. Britt
-- does not start it, and it cannot be started early by wishing.
CREATE OR REPLACE FUNCTION public.drive_start_vacation_test()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  st       jsonb := public.drive_hub_cloud_status();
  existing record;
  per_hour numeric := 4;      -- the schedule fires at :07 :22 :37 :52
  hours    int := 48;
  new_id   bigint;
BEGIN
  SELECT * INTO existing FROM public.drive_vacation_test WHERE status = 'running' ORDER BY started_at DESC LIMIT 1;
  IF existing.id IS NOT NULL THEN
    RETURN jsonb_build_object('already_running', true, 'started_at', existing.started_at, 'ends_at', existing.ends_at);
  END IF;

  -- A scheduled success is the start condition. Armed is not enough: an armed
  -- schedule that has never fired proves nothing about the next 48 hours.
  IF coalesce((st->>'scheduled_successes')::int, 0) < 1 THEN
    RETURN jsonb_build_object('started', false,
      'why', 'no scheduled execution has succeeded yet, so there is nothing to observe',
      'operational_state', st->>'operational_state');
  END IF;

  INSERT INTO public.drive_vacation_test (started_at, ends_at, start_conditions, expected_runs)
  VALUES (now(), now() + make_interval(hours => hours),
          jsonb_build_object(
            'schedule_armed', st->'schedule'->>'armed',
            'first_scheduled_success', st->>'last_scheduled_success',
            'cron', st->'schedule'->>'cron',
            'note', 'The laptop is not required for any run counted here.'),
          (per_hour * hours)::int)
  RETURNING id INTO new_id;

  RETURN jsonb_build_object('started', true, 'id', new_id, 'started_at', now(), 'ends_at', now() + make_interval(hours => hours), 'expected_runs', (per_hour * hours)::int);
END;
$$;

-- Verdict, computed from what actually happened. Never returns "passed" early.
CREATE OR REPLACE FUNCTION public.drive_vacation_test_status()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  t          record;
  ok_runs    int := 0;
  bad_runs   int := 0;
  windows    int := 0;
  elapsed_h  numeric;
BEGIN
  SELECT * INTO t FROM public.drive_vacation_test ORDER BY started_at DESC LIMIT 1;
  IF t.id IS NULL THEN RETURN jsonb_build_object('exists', false, 'why', 'not started; it starts itself on the first scheduled success'); END IF;

  BEGIN
    SELECT count(*) FILTER (WHERE d.status = 'succeeded'), count(*) FILTER (WHERE d.status <> 'succeeded')
      INTO ok_runs, bad_runs
      FROM cron.job_run_details d JOIN cron.job j ON j.jobid = d.jobid
     WHERE j.jobname = 'drive-hub-cloud-sweep' AND d.start_time >= t.started_at;
  EXCEPTION WHEN OTHERS THEN ok_runs := 0; END;

  -- A duplicate writer would show as two snapshots for one window. It cannot happen
  -- by construction, and this is where it would surface if it ever did.
  SELECT count(*) INTO windows FROM public.drive_funnel_snapshots WHERE window_start >= t.started_at;
  elapsed_h := round(extract(epoch FROM (now() - t.started_at)) / 3600.0, 1);

  RETURN jsonb_build_object(
    'exists', true, 'started_at', t.started_at, 'ends_at', t.ends_at,
    'elapsed_hours', elapsed_h, 'complete', now() >= t.ends_at,
    'expected_runs', t.expected_runs, 'successful_runs', ok_runs, 'failed_runs', bad_runs,
    'missed_runs', greatest(0, floor(elapsed_h * 4)::int - ok_runs),
    'distinct_windows', windows,
    -- No verdict before the time has actually passed.
    'verdict', CASE
      WHEN now() < t.ends_at THEN 'in progress, no verdict before 48 hours have elapsed'
      WHEN ok_runs >= (t.expected_runs * 0.9)::int AND bad_runs = 0 THEN 'passed'
      ELSE 'failed' END);
END;
$$;

REVOKE ALL ON FUNCTION public.drive_start_vacation_test() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.drive_start_vacation_test() TO service_role;
GRANT EXECUTE ON FUNCTION public.drive_vacation_test_status() TO authenticated, service_role;
