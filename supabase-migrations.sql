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
