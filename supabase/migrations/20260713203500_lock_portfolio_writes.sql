-- Client members may read the executive portfolio but may not alter it.
-- Admins and the engagement owner retain write access.

drop policy if exists "engagement_portfolio_access" on public.org_gtm_portfolio;

create or replace function public.can_manage_engagement(target_engagement_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.drive_engagements e
      where e.id = target_engagement_id
        and e.owner_email = auth.jwt() ->> 'email'
    );
$$;

revoke all on function public.can_manage_engagement(uuid) from public;
grant execute on function public.can_manage_engagement(uuid) to authenticated;

create policy "portfolio_select" on public.org_gtm_portfolio
  for select using (
    public.can_manage_engagement(org_id)
    or exists (
      select 1
      from public.drive_engagement_members m
      where m.engagement_id = org_gtm_portfolio.org_id
        and (m.user_id = auth.uid() or m.email = auth.jwt() ->> 'email')
    )
  );

create policy "portfolio_insert" on public.org_gtm_portfolio
  for insert with check (public.can_manage_engagement(org_id));

create policy "portfolio_update" on public.org_gtm_portfolio
  for update
  using (public.can_manage_engagement(org_id))
  with check (public.can_manage_engagement(org_id));

create policy "portfolio_delete" on public.org_gtm_portfolio
  for delete using (public.can_manage_engagement(org_id));
