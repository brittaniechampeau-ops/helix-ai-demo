-- Reconciling an action that really happened after its card had already failed.
--
-- The BRIDGE content row was accepted by production while the approval that asked
-- for it was already terminal, having exhausted its retry ceiling during credential
-- diagnosis. The row exists. The card says failed. Both are true.
--
-- The wrong fixes are: reset retry_count, raise the ceiling, or file a duplicate
-- approval. Each one launders a policy breach into a clean record. The right fix is
-- a separate, evidenced, append-only path that closes the ORIGINAL card on proof
-- from the destination, and leaves the failure history exactly as it was.

ALTER TABLE public.drive_hub_approvals
  ADD COLUMN IF NOT EXISTS reconciled_at        timestamptz,
  ADD COLUMN IF NOT EXISTS reconciled_by        text,
  ADD COLUMN IF NOT EXISTS reconciliation_proof jsonb;

COMMENT ON COLUMN public.drive_hub_approvals.reconciled_at IS
  'When an externally-verified completion closed this card after it had already failed. Never set by an executor run.';
COMMENT ON COLUMN public.drive_hub_approvals.reconciled_by IS
  'Who supplied the evidence. An actor, not a system default.';
COMMENT ON COLUMN public.drive_hub_approvals.reconciliation_proof IS
  'The machine readback that justified closing a terminal card: what was fetched, from where, and when.';

-- retry_count is history. Reconciliation may not touch it, and neither may anything
-- else once a row has retried: the ceiling only means something if the count cannot
-- go backwards.
CREATE OR REPLACE FUNCTION public.drive_hub_retry_count_is_monotonic()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.retry_count < OLD.retry_count THEN
    RAISE EXCEPTION 'retry_count may not decrease (% -> %): the retry ceiling is only a ceiling if its history is immutable',
      OLD.retry_count, NEW.retry_count;
  END IF;
  IF NEW.reconciled_at IS NOT NULL AND OLD.reconciled_at IS NOT NULL
     AND NEW.reconciled_at IS DISTINCT FROM OLD.reconciled_at THEN
    RAISE EXCEPTION 'reconciled_at is write-once';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS drive_hub_approvals_retry_monotonic ON public.drive_hub_approvals;
CREATE TRIGGER drive_hub_approvals_retry_monotonic
  BEFORE UPDATE ON public.drive_hub_approvals
  FOR EACH ROW EXECUTE FUNCTION public.drive_hub_retry_count_is_monotonic();

-- A reconciled close must carry its proof. Closing a previously-failed card with an
-- empty proof would be indistinguishable from pretending an execution occurred.
CREATE OR REPLACE FUNCTION public.drive_hub_reconciliation_needs_proof()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.reconciled_at IS NOT NULL THEN
    IF NEW.reconciled_by IS NULL OR NEW.reconciled_by = '' THEN
      RAISE EXCEPTION 'a reconciliation must record who supplied the evidence';
    END IF;
    IF NEW.reconciliation_proof IS NULL THEN
      RAISE EXCEPTION 'a reconciliation must record the machine readback that justified it';
    END IF;
    IF coalesce(NEW.destination_id, '') = '' THEN
      RAISE EXCEPTION 'a reconciliation must record the destination id it verified';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS drive_hub_approvals_reconciliation_proof ON public.drive_hub_approvals;
CREATE TRIGGER drive_hub_approvals_reconciliation_proof
  BEFORE INSERT OR UPDATE ON public.drive_hub_approvals
  FOR EACH ROW EXECUTE FUNCTION public.drive_hub_reconciliation_needs_proof();
