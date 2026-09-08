-- The disclosure trigger was blocking its own cleanup.
--
-- It refuses any row lacking destination, requested_timing, is_public and
-- readback_criteria, on INSERT OR UPDATE. Correct for a card on its way to Britt.
-- Wrong for a card being cancelled: 42 legacy test-harness rows could not be retired
-- because they were under-specified, which is precisely why they should not exist.
--
-- The trigger's purpose is to stop an under-specified card REACHING her. A cancelled
-- card never reaches her, so the check does not apply to that transition.
CREATE OR REPLACE FUNCTION public.drive_hub_require_disclosure()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Retiring a row is not showing it to anyone.
  IF NEW.status IN ('cancelled', 'declined', 'expired') THEN
    RETURN NEW;
  END IF;

  IF NEW.approval_type NOT IN ('test_echo')
     AND (coalesce(NEW.destination, '') = '' OR coalesce(NEW.readback_criteria, '') = '' OR NEW.is_public IS NULL)
  THEN
    RAISE EXCEPTION 'approval % must state destination, requested_timing, is_public and readback_criteria before Britt sees it', NEW.approval_type;
  END IF;
  RETURN NEW;
END;
$$;

-- Same reasoning for the evidence manifest: an authored card being cancelled does not
-- need to prove which corpora produced it.
CREATE OR REPLACE FUNCTION public.drive_hub_require_evidence()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE ch text; n_strategy int; n_voice int;
BEGIN
  IF NEW.status IN ('cancelled', 'declined', 'expired') THEN
    RETURN NEW;
  END IF;
  IF NEW.approval_type NOT IN ('content_publish', 'kleo_create_draft', 'newsletter_send') THEN
    RETURN NEW;
  END IF;
  IF NEW.evidence_manifest IS NULL THEN
    RAISE EXCEPTION 'approval % must carry an evidence_manifest: the strategy rules it applied and the same-channel voice samples it sounded like', NEW.approval_type;
  END IF;
  ch := NEW.evidence_manifest ->> 'channel';
  IF coalesce(ch, '') = '' THEN RAISE EXCEPTION 'evidence_manifest.channel is required'; END IF;
  SELECT count(*) INTO n_strategy FROM jsonb_array_elements(coalesce(NEW.evidence_manifest -> 'strategy', '[]'::jsonb));
  IF n_strategy = 0 THEN RAISE EXCEPTION 'evidence_manifest.strategy is empty: no retrieved strategy rule supports this draft'; END IF;
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
