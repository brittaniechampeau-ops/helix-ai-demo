-- ============================================================
-- DRIVE Platform — Supabase Org Layer Migration
-- Run this once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ilhljjkiijmjpwinovzj/sql
-- ============================================================

-- Shared taxonomy (Resolve → all tools)
CREATE TABLE IF NOT EXISTS public.org_taxonomy (
  org_id   text PRIMARY KEY,
  data     jsonb        NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

-- Shared VEC state (Vector)
CREATE TABLE IF NOT EXISTS public.org_vec_state (
  org_id   text PRIMARY KEY,
  data     jsonb        NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

-- Shared intelligence signals (Intelligence)
CREATE TABLE IF NOT EXISTS public.org_intelligence (
  org_id   text PRIMARY KEY,
  data     jsonb        NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

-- Shared engine assets (Engine)
CREATE TABLE IF NOT EXISTS public.org_engine_assets (
  org_id   text PRIMARY KEY,
  data     jsonb        NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

-- Shared discover assessments (Discover)
CREATE TABLE IF NOT EXISTS public.org_discover (
  org_id   text PRIMARY KEY,
  data     jsonb        NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

-- RLS: authenticated users can read/write rows where org_id matches their email domain
ALTER TABLE public.org_taxonomy       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_vec_state      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_intelligence   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_engine_assets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_discover       ENABLE ROW LEVEL SECURITY;

-- Policy helper: org_id must match the domain of the authenticated user's email
CREATE OR REPLACE FUNCTION public.user_org_id()
RETURNS text LANGUAGE sql STABLE
AS $$ SELECT split_part(auth.jwt() ->> 'email', '@', 2) $$;

CREATE POLICY "org_members_only" ON public.org_taxonomy
  FOR ALL USING (org_id = public.user_org_id());

CREATE POLICY "org_members_only" ON public.org_vec_state
  FOR ALL USING (org_id = public.user_org_id());

CREATE POLICY "org_members_only" ON public.org_intelligence
  FOR ALL USING (org_id = public.user_org_id());

CREATE POLICY "org_members_only" ON public.org_engine_assets
  FOR ALL USING (org_id = public.user_org_id());

CREATE POLICY "org_members_only" ON public.org_discover
  FOR ALL USING (org_id = public.user_org_id());

-- ============================================================
-- Discover assessment records (per email, saved after auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.practices (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  readiness   jsonb NOT NULL DEFAULT '{}',
  modules_unlocked jsonb,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own row
CREATE POLICY "own_row_only" ON public.practices
  FOR ALL USING (email = auth.jwt() ->> 'email');

-- Admin bypass: service role can read all (used by admin dashboard + edge functions)
-- (service role bypasses RLS automatically — no policy needed)

-- ============================================================
-- Leads — captured when visitor hits the result gate
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL,
  org_name    text,
  org_industry text,
  org_team    text,
  org_rev     text,
  anon_scores jsonb,
  gate_hit_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Only service role can read (admin dashboard uses service key via edge function)
-- Anon inserts allowed so gate can write before auth
CREATE POLICY "anon_insert" ON public.leads
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Subscriptions — managed by Stripe webhook
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                  text UNIQUE NOT NULL,
  stripe_customer_id     text,
  stripe_subscription_id text,
  status                 text NOT NULL DEFAULT 'inactive',
  plan                   text,
  activated_at           timestamptz,
  updated_at             timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription status
CREATE POLICY "own_sub_only" ON public.subscriptions
  FOR SELECT USING (email = auth.jwt() ->> 'email');
-- Only service role can write (Stripe webhook uses service key)

-- ============================================================
-- practices — add team_emails column + updated RLS
-- Run this as a NEW query in Supabase SQL Editor
-- ============================================================
ALTER TABLE public.practices
  ADD COLUMN IF NOT EXISTS team_emails jsonb NOT NULL DEFAULT '[]';

-- Drop old single-owner policy and replace with owner-or-teammate
DROP POLICY IF EXISTS "own_row_only" ON public.practices;

CREATE POLICY "own_row_or_team" ON public.practices
  FOR ALL USING (
    email = auth.jwt() ->> 'email'
    OR team_emails @> to_jsonb(auth.jwt() ->> 'email')
  );

-- ============================================================
-- drive_engagements — multi-client workspace
-- Run this as a NEW query in Supabase SQL Editor
-- ============================================================
CREATE TABLE IF NOT EXISTS public.drive_engagements (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_email  text        NOT NULL,
  client_name  text        NOT NULL,
  org_name     text        NOT NULL DEFAULT '',
  industry     text        NOT NULL DEFAULT '',
  size_tier    text        NOT NULL DEFAULT 'smb'
               CHECK (size_tier IN ('smb', 'mid', 'enterprise')),
  contact_name  text       NOT NULL DEFAULT '',
  contact_email text       NOT NULL DEFAULT '',
  notes        text        NOT NULL DEFAULT '',
  status       text        NOT NULL DEFAULT 'active'
               CHECK (status IN ('active', 'archived')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS drive_engagements_owner_idx
  ON public.drive_engagements (owner_email);

-- NOTE: The org_id column in org_discover, org_resolve, org_intelligence,
-- org_vec_state, and org_engine_assets now accepts engagement UUIDs
-- (from drive_engagement_id in localStorage) in addition to email domains.
-- No schema change needed — the column is already text PRIMARY KEY.

-- ============================================================
-- Multi-tenant access control
-- Replaces all previous RLS policies with a proper admin/member model.
--
-- Roles:
--   Admin   — consultant (you + future hires). Sees and writes everything.
--   Member  — client user invited to one engagement. Reads only their org.
--
-- Run this entire block in Supabase SQL Editor.
-- After it runs, add yourself as admin with the INSERT at the bottom.
-- ============================================================

-- ── drive_admins ────────────────────────────────────────────
-- Global admin list. Add rows here to grant full access.
-- Only writable via SQL Editor / service role — never from the client.
CREATE TABLE IF NOT EXISTS public.drive_admins (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.drive_admins ENABLE ROW LEVEL SECURITY;
-- Admins can confirm their own status; no client writes.
CREATE POLICY "admin_read_own"
  ON public.drive_admins FOR SELECT
  USING (user_id = auth.uid());

-- ── is_admin() helper ───────────────────────────────────────
-- SECURITY DEFINER so it can read drive_admins without RLS recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.drive_admins WHERE user_id = auth.uid()) $$;

-- ── drive_engagement_members ────────────────────────────────
-- Maps client users to the one engagement they belong to.
-- Admins add rows here when onboarding a client's team.
CREATE TABLE IF NOT EXISTS public.drive_engagement_members (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid        NOT NULL REFERENCES public.drive_engagements(id) ON DELETE CASCADE,
  user_id       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  email         text        NOT NULL,
  invited_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (engagement_id, email)
);
ALTER TABLE public.drive_engagement_members ENABLE ROW LEVEL SECURITY;
-- Members can see their own membership record.
CREATE POLICY "members_select"
  ON public.drive_engagement_members FOR SELECT
  USING (public.is_admin() OR user_id = auth.uid());
-- Only admins can add / remove members.
CREATE POLICY "members_insert"
  ON public.drive_engagement_members FOR INSERT
  WITH CHECK (public.is_admin());
CREATE POLICY "members_update"
  ON public.drive_engagement_members FOR UPDATE
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "members_delete"
  ON public.drive_engagement_members FOR DELETE
  USING (public.is_admin());

-- ── drive_engagements RLS ───────────────────────────────────
ALTER TABLE public.drive_engagements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_users_manage_engagements" ON public.drive_engagements;
DROP POLICY IF EXISTS "owner_manages_own_engagements"          ON public.drive_engagements;
DROP POLICY IF EXISTS "owner_can_manage_own_engagements"       ON public.drive_engagements;
-- Admins see/write all. Members read only their engagement.
CREATE POLICY "engagement_access"
  ON public.drive_engagements FOR ALL
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id = drive_engagements.id AND user_id = auth.uid()
    )
  )
  WITH CHECK (public.is_admin());

-- ── org_* data tables RLS ───────────────────────────────────
-- org_id stores the engagement UUID. Admins see all rows; members
-- see only rows whose org_id matches their engagement.
DROP POLICY IF EXISTS "org_members_only" ON public.org_taxonomy;
DROP POLICY IF EXISTS "org_members_only" ON public.org_vec_state;
DROP POLICY IF EXISTS "org_members_only" ON public.org_intelligence;
DROP POLICY IF EXISTS "org_members_only" ON public.org_engine_assets;
DROP POLICY IF EXISTS "org_members_only" ON public.org_discover;

CREATE POLICY "org_data_access" ON public.org_taxonomy FOR ALL
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "org_data_access" ON public.org_vec_state FOR ALL
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "org_data_access" ON public.org_intelligence FOR ALL
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "org_data_access" ON public.org_engine_assets FOR ALL
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "org_data_access" ON public.org_discover FOR ALL
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = org_id AND user_id = auth.uid()
    )
  );

-- ============================================================
-- drive_approvals — stakeholder approval loop
-- Run this as a NEW query in Supabase SQL Editor
-- ============================================================
CREATE TABLE IF NOT EXISTS public.drive_approvals (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id text        NOT NULL,
  owner_email   text        NOT NULL,
  client_name   text        NOT NULL DEFAULT '',
  contact_email text        NOT NULL,
  contact_name  text        NOT NULL DEFAULT '',
  approval_type text        NOT NULL DEFAULT 'taxonomy',
  summary_json  jsonb       NOT NULL DEFAULT '{}',
  status        text        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','approved','changes_requested')),
  notes         text        NOT NULL DEFAULT '',
  token         text        UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  sent_at       timestamptz NOT NULL DEFAULT now(),
  responded_at  timestamptz
);

CREATE INDEX IF NOT EXISTS drive_approvals_engagement_idx
  ON public.drive_approvals (engagement_id);

CREATE INDEX IF NOT EXISTS drive_approvals_owner_idx
  ON public.drive_approvals (owner_email);

ALTER TABLE public.drive_approvals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_reads_own_approvals" ON public.drive_approvals;

-- Admins see/write all approvals. Members read their engagement's approvals.
CREATE POLICY "approval_access"
  ON public.drive_approvals FOR ALL
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drive_engagement_members
      WHERE engagement_id::text = drive_approvals.engagement_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (public.is_admin());

-- handle-approval edge function uses service role key to update status
-- No additional policy needed for UPDATE — service role bypasses RLS

-- ============================================================
-- Bootstrap: add yourself as admin
-- Run this AFTER the migration above. Replace the email if needed.
-- ============================================================
-- INSERT INTO public.drive_admins (user_id, email)
-- SELECT id, email FROM auth.users
-- WHERE email IN ('britt@brittbowman.ai', 'brittanie.champeau@gmail.com')
-- ON CONFLICT DO NOTHING;
