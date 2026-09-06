-- The thing being approved has to be visible.
--
-- The first cut described the decision ("a draft is written and waiting") without
-- ever showing the draft. You cannot approve a LinkedIn post you have not read, or
-- a newsletter whose body is in a file on a laptop. The artifact is the card.

ALTER TABLE public.drive_hub_approvals
  ADD COLUMN IF NOT EXISTS artifact       text,
  ADD COLUMN IF NOT EXISTS artifact_label text;

COMMENT ON COLUMN public.drive_hub_approvals.artifact IS
  'The exact content being approved, verbatim: the post body, the newsletter issue, the message. Rendered in full on the card, never summarised.';
COMMENT ON COLUMN public.drive_hub_approvals.artifact_label IS
  'What the artifact is and how long it runs, so length is visible before reading.';

-- An approval that publishes or sends as Britt must carry the words that go out.
-- This is a data-quality guard, not a security boundary: it stops a job creating a
-- content decision she cannot actually evaluate.
CREATE OR REPLACE FUNCTION public.drive_hub_require_artifact()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.approval_type IN ('content_brief_approve', 'newsletter_send', 'linkedin_manual_engagement')
     AND coalesce(NEW.artifact, '') = ''
     AND coalesce(NEW.action_payload->>'text', NEW.action_payload->>'body', NEW.action_payload->>'message', '') = ''
  THEN
    RAISE EXCEPTION 'approval_type % must carry the content being approved. A decision card without the words is not reviewable.', NEW.approval_type;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS drive_hub_approvals_require_artifact ON public.drive_hub_approvals;
CREATE TRIGGER drive_hub_approvals_require_artifact
  BEFORE INSERT OR UPDATE ON public.drive_hub_approvals
  FOR EACH ROW EXECUTE FUNCTION public.drive_hub_require_artifact();
