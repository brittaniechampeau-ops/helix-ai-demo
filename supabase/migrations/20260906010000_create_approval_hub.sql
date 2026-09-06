-- DRIVE Approval Hub.
--
-- The control surface for the autonomous marketing department. Agents work under
-- standing policy and log what they did; only decisions needing Britt's judgment or
-- authority land here.
--
-- Naming note: public.drive_approvals already exists and is the CLIENT-facing
-- deliverable sign-off by token link. That is a different concept and is untouched.
-- Everything here uses the drive_hub_ prefix.

-- ── Standing authority ────────────────────────────────────────────────────────
-- Policy is data, enforced in the gateway. An agent's prose can never override it.
CREATE TABLE IF NOT EXISTS public.drive_hub_policies (
  id                text PRIMARY KEY,
  action_type       text NOT NULL,
  disposition       text NOT NULL CHECK (disposition IN (
                      'auto_execute', 'execute_after_approval', 'manual_final_action', 'prohibited')),
  scope             jsonb NOT NULL DEFAULT '{}'::jsonb,
  audience          text,
  content_constraints text,
  starts_at         timestamptz,
  ends_at           timestamptz,
  rate_limit_per_day integer CHECK (rate_limit_per_day IS NULL OR rate_limit_per_day > 0),
  stop_conditions   text[] NOT NULL DEFAULT '{}',
  escalate_when     text[] NOT NULL DEFAULT '{}',
  revoked_at        timestamptz,
  revoked_reason    text,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS drive_hub_policies_active_action_idx
  ON public.drive_hub_policies (action_type) WHERE revoked_at IS NULL;

-- ── Approvals ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.drive_hub_approvals (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- identity and dedupe. idempotency_key is what stops a repeated source request
  -- creating a second approval, and what stops a repeated approval double-firing.
  idempotency_key     text NOT NULL UNIQUE,
  approval_type       text NOT NULL,
  source_system       text NOT NULL,
  source_record_id    text,
  source_fingerprint  text,

  -- what Britt reads
  title               text NOT NULL,
  decision_summary    text NOT NULL,
  why_escalated       text NOT NULL,
  evidence            jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommendation      text,
  proposed_action     text NOT NULL,
  action_payload      jsonb NOT NULL DEFAULT '{}'::jsonb,
  affects             text,
  source_links        jsonb NOT NULL DEFAULT '[]'::jsonb,

  risk                text NOT NULL DEFAULT 'low' CHECK (risk IN ('low', 'medium', 'high')),
  requires_confirm    boolean NOT NULL DEFAULT false,
  policy_id           text REFERENCES public.drive_hub_policies(id),
  disposition         text NOT NULL DEFAULT 'execute_after_approval' CHECK (disposition IN (
                        'auto_execute', 'execute_after_approval', 'manual_final_action', 'prohibited')),

  status              text NOT NULL DEFAULT 'awaiting_approval' CHECK (status IN (
                        'awaiting_approval', 'approved', 'executing', 'completed', 'failed',
                        'declined', 'snoozed', 'expired', 'cancelled',
                        'manual_action_ready', 'awaiting_confirmation')),
  priority            integer NOT NULL DEFAULT 50 CHECK (priority BETWEEN 0 AND 100),
  due_at              timestamptz,
  expires_at          timestamptz,
  assigned_to         text NOT NULL DEFAULT 'britt@brittbowman.ai',

  -- lifecycle timestamps, each written once by the gateway
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  approved_at         timestamptz,
  declined_at         timestamptz,
  snoozed_until       timestamptz,
  execution_started_at timestamptz,
  completed_at        timestamptz,

  -- execution and verification
  execution_result    jsonb,
  destination_system  text,
  destination_id      text,
  destination_readback jsonb,
  readback_verified   boolean NOT NULL DEFAULT false,
  failure_reason      text,
  retry_count         integer NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  superseded_by       uuid REFERENCES public.drive_hub_approvals(id),

  -- concurrency: a claim must be held to execute, and it expires so a crashed run
  -- cannot wedge an item forever.
  claimed_by          text,
  claim_expires_at    timestamptz,

  audit               jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS drive_hub_approvals_active_idx
  ON public.drive_hub_approvals (status, priority DESC, created_at)
  WHERE status IN ('awaiting_approval', 'manual_action_ready', 'awaiting_confirmation', 'failed', 'snoozed');
CREATE INDEX IF NOT EXISTS drive_hub_approvals_source_idx
  ON public.drive_hub_approvals (source_system, source_record_id);
CREATE INDEX IF NOT EXISTS drive_hub_approvals_completed_idx
  ON public.drive_hub_approvals (completed_at DESC) WHERE completed_at IS NOT NULL;

-- ── Append-only audit ─────────────────────────────────────────────────────────
-- Every transition, edit, execution and readback. Never updated, never deleted.
CREATE TABLE IF NOT EXISTS public.drive_hub_events (
  id            bigserial PRIMARY KEY,
  approval_id   uuid REFERENCES public.drive_hub_approvals(id) ON DELETE RESTRICT,
  at            timestamptz NOT NULL DEFAULT now(),
  actor         text NOT NULL,
  actor_kind    text NOT NULL CHECK (actor_kind IN ('human', 'agent', 'system')),
  event         text NOT NULL,
  from_status   text,
  to_status     text,
  detail        jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS drive_hub_events_approval_idx ON public.drive_hub_events (approval_id, at);

-- ── Autonomous work log ───────────────────────────────────────────────────────
-- Routine work agents completed under standing policy. Recorded, never queued.
CREATE TABLE IF NOT EXISTS public.drive_hub_auto_log (
  id            bigserial PRIMARY KEY,
  at            timestamptz NOT NULL DEFAULT now(),
  agent         text NOT NULL,
  action_type   text NOT NULL,
  policy_id     text REFERENCES public.drive_hub_policies(id),
  summary       text NOT NULL,
  source_system text,
  source_record_id text,
  destination_id text,
  detail        jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS drive_hub_auto_log_at_idx ON public.drive_hub_auto_log (at DESC);

-- ── Guards ────────────────────────────────────────────────────────────────────

-- An append-only audit trail that can be rewritten is not an audit trail.
CREATE OR REPLACE FUNCTION public.drive_hub_events_immutable()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'drive_hub_events is append-only';
END;
$$;
DROP TRIGGER IF EXISTS drive_hub_events_no_update ON public.drive_hub_events;
CREATE TRIGGER drive_hub_events_no_update BEFORE UPDATE OR DELETE ON public.drive_hub_events
  FOR EACH ROW EXECUTE FUNCTION public.drive_hub_events_immutable();

-- Only the gateway sets terminal state. This blocks a direct client write from
-- marking something completed without ever executing or reading back.
CREATE OR REPLACE FUNCTION public.drive_hub_guard_completion()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.readback_verified IS NOT TRUE THEN
    RAISE EXCEPTION 'an approval cannot be completed until destination readback is verified';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS drive_hub_approvals_guard ON public.drive_hub_approvals;
CREATE TRIGGER drive_hub_approvals_guard BEFORE INSERT OR UPDATE ON public.drive_hub_approvals
  FOR EACH ROW EXECUTE FUNCTION public.drive_hub_guard_completion();

-- ── RLS ───────────────────────────────────────────────────────────────────────
-- Britt and explicit admins read and act through the browser. Everything that
-- causes an external effect goes through the gateway with the service role, so the
-- browser never needs write access to execution fields.
ALTER TABLE public.drive_hub_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_hub_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_hub_policies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_hub_auto_log  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hub_admin_select_approvals" ON public.drive_hub_approvals;
CREATE POLICY "hub_admin_select_approvals" ON public.drive_hub_approvals
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "hub_admin_select_events" ON public.drive_hub_events;
CREATE POLICY "hub_admin_select_events" ON public.drive_hub_events
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "hub_admin_select_policies" ON public.drive_hub_policies;
CREATE POLICY "hub_admin_select_policies" ON public.drive_hub_policies
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "hub_admin_select_auto_log" ON public.drive_hub_auto_log;
CREATE POLICY "hub_admin_select_auto_log" ON public.drive_hub_auto_log
  FOR SELECT USING (public.is_admin());

-- No INSERT, UPDATE or DELETE policy for authenticated users anywhere in this
-- schema. Writes happen only through the approval-gateway Edge Function, which
-- authenticates the caller, revalidates policy, and records the audit event.

-- ── Seed the standing policy set ──────────────────────────────────────────────
-- These encode decisions already recorded in britt-marketing-os. Nothing here
-- grants new authority.
INSERT INTO public.drive_hub_policies (id, action_type, disposition, notes, stop_conditions, escalate_when) VALUES
  ('kleo_draft_v1', 'kleo_create_draft', 'auto_execute',
   'Private Kleo drafts are pre-approved. Reversible, visible only to Britt.',
   '{}', '{}'),
  ('bridge_content_ready_v1', 'bridge_content_sync', 'auto_execute',
   'Idempotent content_queue row at status Ready. Never Posted or Performance.',
   '{}', '{}'),
  ('kleo_schedule_v1', 'kleo_schedule_post', 'prohibited',
   'Scheduling a public post is not approved for any job.', '{}', '{}'),
  ('newsletter_send_v1', 'newsletter_send', 'execute_after_approval',
   'A newsletter candidate is drafted automatically and sent only after Britt approves.',
   '{"reply","unsubscribe","bounce"}', '{"substantive business problem in a reply"}'),
  ('content_publish_v1', 'content_publish', 'execute_after_approval',
   'Public content requires approval. Auto-draft, human publish.', '{}', '{}'),
  ('linkedin_engagement_v1', 'linkedin_manual_engagement', 'manual_final_action',
   'LinkedIn and Sales Navigator comments, reactions, connections and messages are prepared here and sent by Britt. No browser automation, ever.',
   '{}', '{}'),
  ('offer_change_v1', 'offer_or_cta_change', 'execute_after_approval',
   'Offers, prices, commercial terms, CTA rules and positioning need Britt.', '{}', '{}'),
  ('qualified_handoff_v1', 'qualified_conversation', 'execute_after_approval',
   'A person ready to discuss their situation is handed to Britt with context and a recommended next move.',
   '{}', '{}'),
  ('spend_change_v1', 'spend_change', 'execute_after_approval',
   'Any spend or campaign budget change needs explicit approval.', '{}', '{}'),
  ('apollo_enrollment_v1', 'apollo_enrollment', 'prohibited',
   'No contact is enrolled and no sequence is changed until a safe authenticated adapter exists and Britt approves it.',
   '{}', '{}'),
  ('setup_exception_v1', 'setup_exception', 'execute_after_approval',
   'A missing credential or adapter. Acknowledging it records the decision; it never exposes the value.',
   '{}', '{}'),
  ('routing_change_v1', 'internal_routing_change', 'execute_after_approval',
   'Internal routing below a defined risk threshold may move to auto_execute later. It starts gated.',
   '{}', '{}')
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.drive_hub_approvals IS
  'DRIVE Approval Hub. Decisions requiring Britt. Writes happen only through the approval-gateway Edge Function.';
