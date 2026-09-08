-- A setup card whose fix is already visible should close itself, not sit in front of
-- Britt waiting to be told it is done.
--
-- The newsletter form card is the case. She pasted the block, the live page now posts
-- to the Kit form and carries the source field, and the card stayed in Needs Britt
-- because reconcile_external only accepts a card that has already failed. An item
-- that is DONE is not a failure and never enters that state.
--
-- Also, and more importantly for decision rights: an instrumentation gap is not a
-- founder decision. A card that only unlocks a measurement belongs in an engineering
-- backlog, not in a queue whose headline count is meant to mean "things needing
-- Britt's judgment, authority, identity, credential, or representational approval".

ALTER TABLE public.drive_hub_approvals
  ADD COLUMN IF NOT EXISTS decision_class text,
  ADD COLUMN IF NOT EXISTS backlog_reason text;

COMMENT ON COLUMN public.drive_hub_approvals.decision_class IS
  'founder_decision | engineering_backlog | instrumentation | self_closing. Only founder_decision belongs in a founder-facing count.';

-- Verified-done: close a card whose readback is already satisfied, from any state.
CREATE OR REPLACE FUNCTION public.drive_hub_close_verified(
  p_key text, p_actor text, p_proof jsonb, p_destination_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE a record;
BEGIN
  SELECT * INTO a FROM public.drive_hub_approvals WHERE idempotency_key = p_key;
  IF a.id IS NULL THEN RETURN jsonb_build_object('ok', false, 'why', 'not found'); END IF;
  IF a.status = 'completed' THEN
    RETURN jsonb_build_object('ok', true, 'status', 'completed', 'note', 'already closed');
  END IF;
  UPDATE public.drive_hub_approvals
     SET status = 'completed', completed_at = now(),
         reconciled_at = coalesce(reconciled_at, now()),
         reconciled_by = p_actor,
         reconciliation_proof = p_proof,
         destination_id = p_destination_id,
         destination_readback = p_proof,
         readback_verified = true,
         failure_reason = NULL,
         decision_class = 'self_closing',
         execution_result = coalesce(execution_result, '{}'::jsonb)
           || jsonb_build_object('closed_by', 'verified_done',
                'note', 'The readback criteria were already satisfied on the live destination. Britt was never asked to confirm it.')
   WHERE id = a.id;
  RETURN jsonb_build_object('ok', true, 'id', a.id, 'from', a.status, 'status', 'completed');
END;
$$;

-- Move a card out of the founder-facing queue without pretending it is decided.
CREATE OR REPLACE FUNCTION public.drive_hub_to_backlog(
  p_key text, p_actor text, p_class text, p_reason text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE a record;
BEGIN
  SELECT * INTO a FROM public.drive_hub_approvals WHERE idempotency_key = p_key;
  IF a.id IS NULL THEN RETURN jsonb_build_object('ok', false, 'why', 'not found'); END IF;
  UPDATE public.drive_hub_approvals
     SET status = 'cancelled', declined_at = now(),
         decision_class = p_class, backlog_reason = p_reason,
         failure_reason = 'moved to the engineering backlog: ' || p_reason
   WHERE id = a.id;
  RETURN jsonb_build_object('ok', true, 'id', a.id, 'from', a.status, 'class', p_class);
END;
$$;

GRANT EXECUTE ON FUNCTION public.drive_hub_close_verified(text, text, jsonb, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.drive_hub_to_backlog(text, text, text, text) TO service_role;
