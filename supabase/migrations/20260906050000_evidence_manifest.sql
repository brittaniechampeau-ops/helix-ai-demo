-- A draft that cannot show its work does not reach Britt.
--
-- Two corpora govern authored content. content-strategy decides what a piece is
-- doing and how it should be shaped. voice-corpus decides how Britt sounds saying
-- it. Neither may stand in for the other: strategy alone produces on-message copy
-- in someone else's voice, and voice alone produces her cadence attached to
-- nothing. This makes that structural rather than a convention a job can forget.

ALTER TABLE public.drive_hub_approvals
  ADD COLUMN IF NOT EXISTS evidence_manifest jsonb;

COMMENT ON COLUMN public.drive_hub_approvals.evidence_manifest IS
  'What the drafting job retrieved: {channel, classification, strategy:[{id,authority,sources}], voice:[{id,channel,quality}]}. Internal provenance. Never rendered on an approval card.';

CREATE OR REPLACE FUNCTION public.drive_hub_require_evidence()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  ch text;
  n_strategy int;
  n_voice int;
BEGIN
  IF NEW.approval_type NOT IN ('content_publish', 'kleo_create_draft', 'newsletter_send') THEN
    RETURN NEW;
  END IF;

  IF NEW.evidence_manifest IS NULL THEN
    RAISE EXCEPTION 'approval % must carry an evidence_manifest: the strategy rules it applied and the same-channel voice samples it sounded like', NEW.approval_type;
  END IF;

  ch := NEW.evidence_manifest ->> 'channel';
  IF coalesce(ch, '') = '' THEN
    RAISE EXCEPTION 'evidence_manifest.channel is required';
  END IF;

  SELECT count(*) INTO n_strategy
  FROM jsonb_array_elements(coalesce(NEW.evidence_manifest -> 'strategy', '[]'::jsonb));
  IF n_strategy = 0 THEN
    RAISE EXCEPTION 'evidence_manifest.strategy is empty: no retrieved strategy rule supports this draft';
  END IF;

  -- Voice evidence must come from the same channel. A LinkedIn post may not be
  -- written from newsletter samples, and a comment may not borrow post voice.
  SELECT count(*) INTO n_voice
  FROM jsonb_array_elements(coalesce(NEW.evidence_manifest -> 'voice', '[]'::jsonb)) v
  WHERE v ->> 'channel' = ch
    AND v ->> 'quality' IN ('published_authoritative', 'sent_authoritative', 'britt_edited_final');
  IF n_voice = 0 THEN
    RAISE EXCEPTION 'evidence_manifest.voice has no published or Britt-final % sample: a draft may not borrow another channel''s voice, and approved-only evidence is too weak to anchor one', ch;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS drive_hub_approvals_evidence ON public.drive_hub_approvals;
CREATE TRIGGER drive_hub_approvals_evidence
  BEFORE INSERT OR UPDATE ON public.drive_hub_approvals
  FOR EACH ROW EXECUTE FUNCTION public.drive_hub_require_evidence();
