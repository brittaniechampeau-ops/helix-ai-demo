-- DRIVE newsletter candidate source of truth.
-- Post records are entered from static internal evidence only. This schema does
-- not fetch, refresh, or connect to LinkedIn.

CREATE TABLE IF NOT EXISTS public.drive_content_posts (
  post_id                 text PRIMARY KEY,
  source_url              text UNIQUE NOT NULL,
  published_at            timestamptz NOT NULL,
  title                   text NOT NULL,
  source_text             text NOT NULL,
  source_text_complete    boolean NOT NULL DEFAULT false,
  topic                   text,
  pillar                  text,
  spine_problem           text CHECK (spine_problem IS NULL OR spine_problem IN (
    'revenue leakage', 'AI readiness', 'forecast trust',
    'GTM plateau', 'founder bottleneck', 'pilot adoption'
  )),
  icp_relevance           smallint CHECK (icp_relevance BETWEEN 0 AND 5),
  operating_insight       smallint CHECK (operating_insight BETWEEN 0 AND 5),
  conversation_potential  smallint CHECK (conversation_potential BETWEEN 0 AND 5),
  impressions             integer CHECK (impressions IS NULL OR impressions >= 0),
  members_reached         integer CHECK (members_reached IS NULL OR members_reached >= 0),
  reactions               integer CHECK (reactions IS NULL OR reactions >= 0),
  comments                integer CHECK (comments IS NULL OR comments >= 0),
  reposts                 integer CHECK (reposts IS NULL OR reposts >= 0),
  saves                   integer CHECK (saves IS NULL OR saves >= 0),
  sends                   integer CHECK (sends IS NULL OR sends >= 0),
  profile_viewers         integer CHECK (profile_viewers IS NULL OR profile_viewers >= 0),
  followers_gained        integer CHECK (followers_gained IS NULL OR followers_gained >= 0),
  out_network_pct         numeric CHECK (out_network_pct IS NULL OR out_network_pct BETWEEN 0 AND 100),
  observed_at             timestamptz,
  evidence_source         text NOT NULL DEFAULT 'static_internal_evidence',
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.drive_newsletter_queue (
  newsletter_date   date PRIMARY KEY,
  status            text NOT NULL CHECK (status IN ('draft', 'approved', 'scheduled', 'published', 'skipped')),
  subject            text,
  source_post_id     text REFERENCES public.drive_content_posts(post_id) ON DELETE RESTRICT,
  notes              text,
  verified_source    text NOT NULL DEFAULT 'Britt supplied',
  verified_at        timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS drive_newsletter_queue_source_post_unique
  ON public.drive_newsletter_queue (source_post_id)
  WHERE source_post_id IS NOT NULL AND status IN ('approved', 'scheduled', 'published');

CREATE INDEX IF NOT EXISTS drive_content_posts_published_idx
  ON public.drive_content_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS drive_newsletter_queue_date_idx
  ON public.drive_newsletter_queue (newsletter_date);

ALTER TABLE public.drive_content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_newsletter_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter_admin_select_posts" ON public.drive_content_posts;
DROP POLICY IF EXISTS "newsletter_admin_insert_posts" ON public.drive_content_posts;
DROP POLICY IF EXISTS "newsletter_admin_update_posts" ON public.drive_content_posts;
DROP POLICY IF EXISTS "newsletter_admin_delete_posts" ON public.drive_content_posts;
CREATE POLICY "newsletter_admin_select_posts" ON public.drive_content_posts
  FOR SELECT USING (public.is_admin());
CREATE POLICY "newsletter_admin_insert_posts" ON public.drive_content_posts
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "newsletter_admin_update_posts" ON public.drive_content_posts
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "newsletter_admin_delete_posts" ON public.drive_content_posts
  FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "newsletter_admin_select_queue" ON public.drive_newsletter_queue;
DROP POLICY IF EXISTS "newsletter_admin_insert_queue" ON public.drive_newsletter_queue;
DROP POLICY IF EXISTS "newsletter_admin_update_queue" ON public.drive_newsletter_queue;
DROP POLICY IF EXISTS "newsletter_admin_delete_queue" ON public.drive_newsletter_queue;
CREATE POLICY "newsletter_admin_select_queue" ON public.drive_newsletter_queue
  FOR SELECT USING (public.is_admin());
CREATE POLICY "newsletter_admin_insert_queue" ON public.drive_newsletter_queue
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "newsletter_admin_update_queue" ON public.drive_newsletter_queue
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "newsletter_admin_delete_queue" ON public.drive_newsletter_queue
  FOR DELETE USING (public.is_admin());

-- Seed the queue dates Britt explicitly confirmed. No copy or source mapping is
-- inferred, and these rows must not be overwritten by the automation.
INSERT INTO public.drive_newsletter_queue
  (newsletter_date, status, notes, verified_source, verified_at)
VALUES
  ('2026-08-04', 'scheduled', 'Existing scheduled newsletter. Copy not stored in DRIVE.', 'Britt supplied', '2026-07-31T13:42:38-04:00'),
  ('2026-08-11', 'scheduled', 'Existing scheduled newsletter. Copy not stored in DRIVE.', 'Britt supplied', '2026-07-31T13:42:38-04:00'),
  ('2026-08-18', 'scheduled', 'Existing scheduled newsletter. Copy not stored in DRIVE.', 'Britt supplied', '2026-07-31T13:42:38-04:00'),
  ('2026-08-25', 'scheduled', 'Existing scheduled newsletter. Copy not stored in DRIVE.', 'Britt supplied', '2026-07-31T13:42:38-04:00')
ON CONFLICT (newsletter_date) DO NOTHING;

-- Static owner-visible snapshots recorded on 2026-07-18. source_text contains
-- only the stored excerpt/hook, so source_text_complete remains false.
INSERT INTO public.drive_content_posts (
  post_id, source_url, published_at, title, source_text, source_text_complete,
  topic, pillar, spine_problem, icp_relevance, operating_insight,
  conversation_potential, impressions, members_reached, reactions, comments,
  reposts, saves, sends, profile_viewers, followers_gained, out_network_pct,
  observed_at, evidence_source
)
VALUES
  ('urn:li:activity:7484272379649675265', 'https://www.linkedin.com/feed/update/urn:li:activity:7484272379649675265/', '2026-07-18T09:00:00-04:00', 'The discount nobody asked for', 'I gave someone a discount they never asked for.', false, 'Pricing and self-valuation', 'Founder journey', 'revenue leakage', 4, 4, 5, 338, 174, 3, 12, 1, 0, 0, 3, 0, 16, '2026-07-18T12:25:00-04:00', 'static_internal_evidence'),
  ('urn:li:activity:7483915210085437441', 'https://www.linkedin.com/feed/update/urn:li:activity:7483915210085437441/', '2026-07-17T10:00:00-04:00', 'Three IPAs after the layoff', 'My entrepreneurial journey started with me housing 3 IPAs at 3 PM on a Wednesday, immediately after being laid off.', false, 'Career transition and entrepreneurship', 'Founder journey', 'founder bottleneck', 2, 2, 3, 5563, 3634, 104, 19, 0, 3, 0, 111, 0, 71, '2026-07-18T12:25:00-04:00', 'static_internal_evidence'),
  ('urn:li:activity:7483563628118528000', 'https://www.linkedin.com/feed/update/urn:li:activity:7483563628118528000/', '2026-07-16T10:00:00-04:00', 'The partner who challenged me', 'The best partners challenge you to think bigger rather than simply validating your thinking.', false, 'Relationships and career reinvention', 'Founder journey', 'founder bottleneck', 2, 3, 3, 1650, 976, 26, 18, 1, 3, 0, 11, 0, 38, '2026-07-18T12:25:00-04:00', 'static_internal_evidence'),
  ('urn:li:activity:7483165792763613184', 'https://www.linkedin.com/feed/update/urn:li:activity:7483165792763613184/', '2026-07-15T10:00:00-04:00', 'Why I invested in Graphio', 'I''m an investor and advisor for Graphio.ai, and I''m not just deeply humbled or excited to announce it.', false, 'AI operating models and advisory proof', 'Commercial authority', 'AI readiness', 4, 4, 4, 3953, 2643, 90, 28, 1, 2, 0, 35, 0, 61, '2026-07-18T12:25:00-04:00', 'static_internal_evidence'),
  ('urn:li:activity:7482803093798182912', 'https://www.linkedin.com/feed/update/urn:li:activity:7482803093798182912/', '2026-07-14T10:00:00-04:00', 'Being right early is exhausting', 'Being right early is exhausting.', false, 'Transformation leadership and Cassandra', 'Commercial authority', 'pilot adoption', 4, 5, 4, 1091, 710, 18, 15, 0, 1, 1, 8, 3, 47, '2026-07-18T12:25:00-04:00', 'static_internal_evidence'),
  ('urn:li:activity:7482446258041884672', 'https://www.linkedin.com/feed/update/urn:li:activity:7482446258041884672/', '2026-07-13T14:50:05.046Z', 'Necessity is the mother of invention', 'Necessity is the mother of invention. Nobody mentions it shows up exactly when you have the least brain space to build anything.', false, 'Career transition and founder journey', 'Founder journey', 'founder bottleneck', 2, 3, 3, 521, null, 20, 14, 0, null, null, null, null, null, '2026-07-18T20:00:00Z', 'static_internal_evidence'),
  ('urn:li:activity:7482124711703961600', 'https://www.linkedin.com/feed/update/urn:li:activity:7482124711703961600/', '2026-07-12T17:32:22.425Z', 'I''ve never once been burned out by something hard', 'I''ve never once been burned out by something hard. Only by something hollow.', false, 'Career transition and founder journey', 'Founder journey', 'founder bottleneck', 2, 3, 4, 1024, null, 25, 26, 0, null, null, null, null, null, '2026-07-18T20:00:00Z', 'static_internal_evidence'),
  ('urn:li:activity:7481717835187142656', 'https://www.linkedin.com/feed/update/urn:li:activity:7481717835187142656/', '2026-07-11T14:35:35.504Z', 'The company that laid you off isn''t watching', 'The company that laid you off isn''t watching you succeed. They stopped thinking about you the day you left.', false, 'Career transition and founder journey', 'Founder journey', 'founder bottleneck', 1, 2, 3, 7208, null, 64, 24, 0, null, null, null, null, null, '2026-07-18T20:00:00Z', 'static_internal_evidence'),
  ('urn:li:activity:7481351974861492225', 'https://www.linkedin.com/feed/update/urn:li:activity:7481351974861492225/', '2026-07-10T14:21:47.605Z', 'This week was garbage', 'I''m known for almost toxic levels of positivity. But this week? Garbage. This week effin'' sucked.', false, 'Career transition and founder journey', 'Founder journey', 'founder bottleneck', 1, 2, 3, 4815, null, 27, 24, 1, null, null, null, null, null, '2026-07-18T20:00:00Z', 'static_internal_evidence')
ON CONFLICT (post_id) DO NOTHING;
