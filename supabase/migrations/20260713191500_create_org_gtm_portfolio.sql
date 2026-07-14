-- DRIVE GTM enhancement portfolio and decision register.

create table if not exists public.org_gtm_portfolio (
  org_id uuid primary key references public.drive_engagements(id) on delete cascade,
  data jsonb not null default '{"enhancements":[],"events":[]}',
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.org_gtm_portfolio enable row level security;

create policy "engagement_portfolio_access" on public.org_gtm_portfolio
  for all using (
    exists (
      select 1 from public.drive_engagements e
      where e.id = org_gtm_portfolio.org_id
        and e.owner_email = auth.jwt() ->> 'email'
    )
    or exists (
      select 1 from public.drive_engagement_members m
      where m.engagement_id = org_gtm_portfolio.org_id
        and (m.user_id = auth.uid() or m.email = auth.jwt() ->> 'email')
    )
  )
  with check (
    exists (
      select 1 from public.drive_engagements e
      where e.id = org_gtm_portfolio.org_id
        and e.owner_email = auth.jwt() ->> 'email'
    )
    or exists (
      select 1 from public.drive_engagement_members m
      where m.engagement_id = org_gtm_portfolio.org_id
        and (m.user_id = auth.uid() or m.email = auth.jwt() ->> 'email')
    )
  );
