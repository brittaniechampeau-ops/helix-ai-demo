-- Internal BRIDGE staging at status Ready becomes automatic, on Britt's instruction.
--
-- Her words: "The BRIDGE Ready-row staging item is a reversible internal write already
-- inside the approved autonomy boundary. It should execute automatically and appear
-- only in the activity log unless it fails." Asking her to approve it was asking
-- permission for something already permitted.
--
-- The boundary is unchanged and narrow: content rows at status Ready or below, in an
-- internal queue, idempotent on (source, external_id). Nothing here publishes, sends,
-- charges, enrolls, or writes to the pipeline sheet.

UPDATE public.drive_hub_policies
   SET disposition = 'auto_execute',
       rate_limit_per_day = 20,
       notes = coalesce(notes, '') ||
         ' | 2026-09-08: promoted to auto_execute on Britt''s instruction. A reversible internal ' ||
         'content_queue write at status Ready, idempotent on (source, external_id), with no external ' ||
         'or public effect. It appears in drive_hub_auto_log and reaches her only on failure. ' ||
         'Revoke by setting disposition back to execute_after_approval; the next item then queues.'
 WHERE action_type = 'bridge_content_sync' AND revoked_at IS NULL;

-- An auto_execute type must never surface as a decision while it is working. Only a
-- failure earns her attention.
CREATE OR REPLACE FUNCTION public.drive_hub_auto_execute_types()
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'action_type', action_type, 'rate_limit_per_day', rate_limit_per_day,
    'surfaces_to_britt', 'only on failure')), '[]'::jsonb)
  FROM public.drive_hub_policies
  WHERE disposition = 'auto_execute' AND revoked_at IS NULL;
$$;
GRANT EXECUTE ON FUNCTION public.drive_hub_auto_execute_types() TO authenticated, service_role;
