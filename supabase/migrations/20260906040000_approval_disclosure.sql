-- Britt cannot judge an action whose shape is hidden. Every approval states where
-- it goes, when, whether it speaks publicly, and what counts as verified.

ALTER TABLE public.drive_hub_approvals
  ADD COLUMN IF NOT EXISTS is_public          boolean,
  ADD COLUMN IF NOT EXISTS readback_criteria  text;

COMMENT ON COLUMN public.drive_hub_approvals.is_public IS
  'True when approving speaks publicly as Britt. Drives the confirmation step and the public warning on the card.';
COMMENT ON COLUMN public.drive_hub_approvals.readback_criteria IS
  'What must be true at the destination before this item may close. Shown before approval, not after.';

-- A public action must disclose all four. An internal one still needs a destination
-- and a readback rule, because "we recorded it" is also a claim that can be wrong.
CREATE OR REPLACE FUNCTION public.drive_hub_require_disclosure()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.approval_type NOT IN ('test_echo')
     AND (coalesce(NEW.destination, '') = '' OR coalesce(NEW.readback_criteria, '') = '' OR NEW.is_public IS NULL)
  THEN
    RAISE EXCEPTION 'approval % must state destination, requested_timing, is_public and readback_criteria before Britt sees it', NEW.approval_type;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS drive_hub_approvals_disclosure ON public.drive_hub_approvals;
CREATE TRIGGER drive_hub_approvals_disclosure
  BEFORE INSERT OR UPDATE ON public.drive_hub_approvals
  FOR EACH ROW EXECUTE FUNCTION public.drive_hub_require_disclosure();
