-- Approving dispatches work now. The scheduled jobs become fallback reconcilers
-- for anything missed, stalled, or failed, not the thing that makes approval happen.

ALTER TABLE public.drive_hub_approvals
  ADD COLUMN IF NOT EXISTS content_hash        text,
  ADD COLUMN IF NOT EXISTS approved_content    text,
  ADD COLUMN IF NOT EXISTS destination         text,
  ADD COLUMN IF NOT EXISTS requested_timing    text,
  ADD COLUMN IF NOT EXISTS dispatched_at       timestamptz,
  ADD COLUMN IF NOT EXISTS dispatch_deadline   timestamptz,
  ADD COLUMN IF NOT EXISTS worker              text,
  ADD COLUMN IF NOT EXISTS invalidated_reason  text,
  ADD COLUMN IF NOT EXISTS parked_at           timestamptz;

COMMENT ON COLUMN public.drive_hub_approvals.approved_content IS
  'Immutable snapshot of the exact words Britt approved. Execution publishes this, never whatever the source file says later.';
COMMENT ON COLUMN public.drive_hub_approvals.content_hash IS
  'Hash of approved_content. If the upstream content changes after approval the hashes diverge, the approval is invalidated, and it returns for review.';
COMMENT ON COLUMN public.drive_hub_approvals.dispatch_deadline IS
  'A dispatched item that is not verified by this time is parked as an exception. Silence is never success.';

CREATE INDEX IF NOT EXISTS drive_hub_approvals_dispatch_idx
  ON public.drive_hub_approvals (status, dispatch_deadline)
  WHERE status IN ('approved', 'executing');

-- Once approved, the content is frozen. Changing the words of an approved item is
-- how modified copy gets published under someone's name without them seeing it.
CREATE OR REPLACE FUNCTION public.drive_hub_freeze_approved_content()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND OLD.approved_content IS NOT NULL
     AND NEW.approved_content IS DISTINCT FROM OLD.approved_content
     AND OLD.status IN ('approved', 'executing', 'completed')
  THEN
    RAISE EXCEPTION 'approved content is immutable. Invalidate the approval and let Britt review the change instead.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS drive_hub_approvals_freeze ON public.drive_hub_approvals;
CREATE TRIGGER drive_hub_approvals_freeze
  BEFORE UPDATE ON public.drive_hub_approvals
  FOR EACH ROW EXECUTE FUNCTION public.drive_hub_freeze_approved_content();

-- Anything dispatched and past its deadline without verification is parked.
-- Called by the gateway on every read and by the fallback reconciler.
CREATE OR REPLACE FUNCTION public.drive_hub_park_overdue()
RETURNS TABLE (id uuid, title text, reason text) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  UPDATE public.drive_hub_approvals a
  SET status = 'failed',
      parked_at = now(),
      failure_reason = coalesce(a.failure_reason,
        'dispatched ' || to_char(a.dispatched_at, 'YYYY-MM-DD HH24:MI') ||
        ' and never verified by its deadline. No worker claimed it, or it died mid-run.')
  WHERE a.status IN ('approved', 'executing')
    AND a.dispatch_deadline IS NOT NULL
    AND a.dispatch_deadline < now()
  RETURNING a.id, a.title, a.failure_reason;
END;
$$;
