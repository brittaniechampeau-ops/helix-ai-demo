-- Corrected test protocol. The 13:22Z test is void.
--
-- WHY IT IS VOID, recorded rather than quietly replaced:
--   The declared start was 13:22:02Z. The reconciliation function was created at
--   13:25Z and the production hashes were not taken until 13:32Z. So for the first
--   ten minutes the system under test was neither frozen nor fully instrumented, and
--   a window that begins before its own subject is fixed is not a measurement.
--   Two criteria were also wrong: an all-deltas-zero rule fails on a real person
--   subscribing, and a 90% run threshold tolerates nearly five hours of silence.
--
-- Everything below is stored BEFORE the new test can start, so the criteria cannot
-- be adjusted to fit whatever happens.

-- ── the acceptance specification, durable and versioned ──────────────────────
CREATE TABLE IF NOT EXISTS public.drive_test_spec (
  id            text PRIMARY KEY,
  stored_at     timestamptz NOT NULL DEFAULT now(),
  spec          jsonb NOT NULL,
  superseded_by text
);
ALTER TABLE public.drive_test_spec ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS drive_test_spec_read ON public.drive_test_spec;
CREATE POLICY drive_test_spec_read ON public.drive_test_spec FOR SELECT USING (public.is_admin());

-- ── preconditions, each recorded as met with its evidence ────────────────────
CREATE TABLE IF NOT EXISTS public.drive_test_preconditions (
  id         text PRIMARY KEY,
  met        boolean NOT NULL DEFAULT false,
  evidence   jsonb,
  met_at     timestamptz
);
ALTER TABLE public.drive_test_preconditions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS drive_test_precond_read ON public.drive_test_preconditions;
CREATE POLICY drive_test_precond_read ON public.drive_test_preconditions FOR SELECT USING (public.is_admin());

-- ── the baseline, in Postgres so it outlives any session ─────────────────────
CREATE TABLE IF NOT EXISTS public.drive_test_baseline (
  id            bigserial PRIMARY KEY,
  captured_at   timestamptz NOT NULL DEFAULT now(),
  counts        jsonb NOT NULL,
  note          text
);
ALTER TABLE public.drive_test_baseline ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS drive_test_baseline_read ON public.drive_test_baseline;
CREATE POLICY drive_test_baseline_read ON public.drive_test_baseline FOR SELECT USING (public.is_admin());

-- ── external changes, attributed rather than assumed hostile ─────────────────
CREATE TABLE IF NOT EXISTS public.drive_test_external (
  id           bigserial PRIMARY KEY,
  observed_at  timestamptz NOT NULL DEFAULT now(),
  metric       text NOT NULL,
  delta        numeric NOT NULL,
  attribution  text NOT NULL CHECK (attribution IN
    ('system_caused', 'organic', 'britt_initiated', 'test_fixture', 'unknown')),
  rationale    text,
  reconciled   boolean NOT NULL DEFAULT false
);
ALTER TABLE public.drive_test_external ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS drive_test_external_read ON public.drive_test_external;
CREATE POLICY drive_test_external_read ON public.drive_test_external FOR SELECT USING (public.is_admin());

-- ── void the old run, with its reasons ───────────────────────────────────────
ALTER TABLE public.drive_vacation_test
  ADD COLUMN IF NOT EXISTS void_reason text,
  ADD COLUMN IF NOT EXISTS spec_id     text,
  ADD COLUMN IF NOT EXISTS trigger_kind text;

UPDATE public.drive_vacation_test
   SET status = 'void',
       void_reason = 'Protocol correction, not a safety repair. The declared start (13:22:02Z) preceded the reconciliation instrument (13:25Z) and the production freeze hashes (13:32Z), so the system under test was neither frozen nor fully instrumented when the window opened. Two criteria were also wrong: an all-deltas-zero external rule fails on a real person subscribing, and a 90 percent run threshold tolerates nearly five hours of missing execution.'
 WHERE status = 'running';

-- ── the corrected specification ──────────────────────────────────────────────
INSERT INTO public.drive_test_spec (id, spec) VALUES ('vacation-48h-v2', jsonb_build_object(
  'window_hours', 48,
  'schedule', '7,22,37,52 * * * *',
  'expected_windows', 192,
  'trigger', jsonb_build_object(
    'rule', 'the first genuinely SCHEDULED successful cloud-sweep execution after every precondition is met',
    'scheduled_means', 'invoked by pg_cron and authenticated with the Vault-held cloud_sweep_secret, not by hand with the integration secret',
    'counted_as_a_window', false,
    'why', 'the trigger proves the schedule is alive; evaluating it would score the act of starting'),
  'interval_convention', jsonb_build_object(
    'window', 'one scheduled minute of the cron expression, strictly after started_at and at or before ends_at',
    'tolerance_seconds', 90,
    'observed', 'the intended cron job began within tolerance_seconds of the scheduled minute',
    'recorded_per_window', jsonb_build_array('scheduled_at', 'actual_start', 'delay_seconds'),
    'no_bucket_widening', 'a late execution outside tolerance is late. The bucket is never expanded to make it count.'),
  'pass', jsonb_build_object(
    'windows_observed', 192,
    'failed_or_partial_receipts', 0, 'duplicate_cron_buckets', 0, 'duplicate_snapshot_windows', 0,
    'silent_or_missing_receipts', 0, 'freeze_drift', 0,
    'unintended_system_caused_external_effects', 0,
    'laptop_or_agent_session_required', false,
    'backlog_and_overdue_parking', 'healthy'),
  'conditional_pass', jsonb_build_object(
    'windows_observed_min', 190, 'windows_observed_max', 191,
    'no_two_consecutive_missed', true,
    'every_miss_attributable_to', 'the scheduler platform, not application failure',
    'next_run_reconciles', 'without duplicate effects or lost state',
    'all_other_pass_conditions', true),
  'fail', jsonb_build_array(
    'fewer than 190 windows', 'two consecutive missed windows',
    'any application failure or partial receipt', 'any silent execution',
    'any duplicate writer', 'any freeze drift',
    'any unintended public action, send, enrollment, outreach, charge, deletion or pipeline write',
    'any dependence on the laptop or an open agent session',
    'any attempt to repair evidence invisibly'),
  'external_activity', jsonb_build_object(
    'rule', 'attribute, do not assume hostile',
    'metrics', jsonb_build_array('purchases','revenue','broadcasts_created_scheduled_or_sent','active_subscribers','assessment_completions','booked_calls'),
    'classes', jsonb_build_array('system_caused','organic','britt_initiated','test_fixture','unknown'),
    'organic_does_not_fail', true,
    'system_caused_publication_send_enrollment_outreach_charge_deletion_or_pipeline_write_fails', true,
    'unknown', 'does not automatically fail, but prevents PASS until reconciled; if still unknown at the end the verdict is CONDITIONAL PASS or FAIL according to risk'),
  'watcher', jsonb_build_object(
    'role', 'optional convenience',
    'is_evidence', false,
    'required_for_pass', false,
    'may_repair', false, 'may_alter_verdict', false,
    'authoritative_evidence', 'Postgres, independently queryable after any session ends')
))
ON CONFLICT (id) DO UPDATE SET spec = EXCLUDED.spec, stored_at = now();

UPDATE public.drive_test_spec SET superseded_by = 'vacation-48h-v2' WHERE id <> 'vacation-48h-v2';

INSERT INTO public.drive_test_preconditions (id, met) VALUES
  ('instrumentation_complete', false),
  ('production_and_git_agree', false),
  ('freeze_hashes_captured', false),
  ('baseline_captured', false),
  ('acceptance_criteria_stored', true)
ON CONFLICT (id) DO NOTHING;

UPDATE public.drive_test_preconditions
   SET met = true, met_at = now(),
       evidence = jsonb_build_object('spec_id','vacation-48h-v2','stored_before_any_start',true)
 WHERE id = 'acceptance_criteria_stored';
