-- Private read contract for the local Codex automation. This function is not
-- executable by anon or authenticated API clients; it is called only through
-- the linked Supabase management connection used by the local project.

CREATE OR REPLACE FUNCTION public.newsletter_automation_feed(
  p_as_of date DEFAULT current_date,
  p_days integer DEFAULT 21
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bounded_days integer := LEAST(45, GREATEST(1, COALESCE(p_days, 21)));
  window_start date := p_as_of - bounded_days;
  queue_end date := p_as_of + 120;
  queue_json jsonb;
  candidate_json jsonb;
BEGIN
  SELECT COALESCE(jsonb_agg(to_jsonb(item) ORDER BY item.newsletter_date), '[]'::jsonb)
  INTO queue_json
  FROM (
    SELECT newsletter_date, status, subject, source_post_id, notes,
           verified_source, verified_at
    FROM public.drive_newsletter_queue
    WHERE newsletter_date >= window_start
      AND newsletter_date <= queue_end
  ) item;

  SELECT COALESCE(jsonb_agg(to_jsonb(item) ORDER BY item.published_at DESC), '[]'::jsonb)
  INTO candidate_json
  FROM (
    SELECT
      post.post_id,
      post.source_url,
      post.published_at,
      post.title,
      post.source_text,
      post.source_text_complete,
      post.topic,
      post.pillar,
      post.spine_problem,
      post.icp_relevance,
      post.operating_insight,
      post.conversation_potential,
      post.impressions,
      post.members_reached,
      post.reactions,
      post.comments,
      post.reposts,
      post.saves,
      post.sends,
      post.profile_viewers,
      post.followers_gained,
      post.out_network_pct,
      post.observed_at,
      post.evidence_source,
      CASE WHEN post.observed_at IS NULL THEN NULL ELSE
        round((extract(epoch FROM (post.observed_at - post.published_at)) / 3600.0)::numeric, 1)
      END AS performance_window_hours,
      CASE WHEN post.observed_at IS NULL OR post.impressions IS NULL THEN NULL ELSE
        round((post.impressions / GREATEST(1.0, extract(epoch FROM (post.observed_at - post.published_at)) / 3600.0))::numeric, 2)
      END AS impressions_per_hour,
      CASE WHEN COALESCE(post.impressions, 0) = 0 THEN NULL ELSE
        round((100.0 * (COALESCE(post.reactions, 0) + COALESCE(post.comments, 0) + COALESCE(post.reposts, 0)) / post.impressions)::numeric, 3)
      END AS conversation_rate
    FROM public.drive_content_posts post
    WHERE post.published_at >= window_start::timestamptz
      AND post.published_at < (p_as_of + 1)::timestamptz
      AND NOT EXISTS (
        SELECT 1
        FROM public.drive_newsletter_queue used
        WHERE used.source_post_id = post.post_id
          AND used.status IN ('approved', 'scheduled', 'published')
      )
  ) item;

  RETURN jsonb_build_object(
    'source', 'DRIVE',
    'generated_at', now(),
    'as_of', p_as_of,
    'window', jsonb_build_object('days', bounded_days, 'start', window_start, 'end', p_as_of),
    'limitations', jsonb_build_array(
      'This feed contains only evidence already recorded in DRIVE and never refreshes LinkedIn.',
      'Posts with source_text_complete=false contain a stored excerpt, not complete source copy.',
      'Queue rows without source_post_id confirm coverage but cannot exclude the unknown source post from reuse.'
    ),
    'queue', queue_json,
    'candidates', candidate_json
  );
END;
$$;

REVOKE ALL ON FUNCTION public.newsletter_automation_feed(date, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.newsletter_automation_feed(date, integer) FROM anon;
REVOKE ALL ON FUNCTION public.newsletter_automation_feed(date, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_automation_feed(date, integer) TO postgres;
GRANT EXECUTE ON FUNCTION public.newsletter_automation_feed(date, integer) TO service_role;
