-- Evidence-derived GTM SCALER diagnostic state.
-- Raw files and full extracted source text are intentionally not stored here.

create table if not exists public.org_scaler (
  org_id text primary key,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.org_scaler enable row level security;

drop policy if exists "scaler_engagement_access" on public.org_scaler;
create policy "scaler_engagement_access" on public.org_scaler
  for all using (
    public.is_admin()
    or exists (
      select 1 from public.drive_engagements e
      where e.id::text = org_scaler.org_id
        and e.owner_email = auth.jwt() ->> 'email'
    )
    or exists (
      select 1 from public.drive_engagement_members m
      where m.engagement_id::text = org_scaler.org_id
        and (m.user_id = auth.uid() or m.email = auth.jwt() ->> 'email')
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.drive_engagements e
      where e.id::text = org_scaler.org_id
        and e.owner_email = auth.jwt() ->> 'email'
    )
    or exists (
      select 1 from public.drive_engagement_members m
      where m.engagement_id::text = org_scaler.org_id
        and (m.user_id = auth.uid() or m.email = auth.jwt() ->> 'email')
    )
  );

