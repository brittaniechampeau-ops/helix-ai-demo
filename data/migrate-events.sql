-- Vector Layer 7: Observability
-- Run this in Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  client_email text,                        -- the practice being worked on
  admin_email  text,                        -- who triggered the event (Britt or the client)
  type         text not null,               -- see event types below
  payload      jsonb not null default '{}', -- event-specific data
  created_at   timestamptz not null default now()
);

-- Index for admin analytics queries
create index if not exists events_type_idx        on events(type);
create index if not exists events_client_idx      on events(client_email);
create index if not exists events_created_at_idx  on events(created_at desc);

-- RLS
alter table events enable row level security;

-- Any authenticated user can insert events
create policy "authenticated users can insert events"
  on events for insert
  to authenticated
  with check (true);

-- Only admins can read all events (enforced in app by isAdmin() check)
-- Clients can read their own events
create policy "users can read own events"
  on events for select
  to authenticated
  using (client_email = auth.jwt() ->> 'email' OR admin_email = auth.jwt() ->> 'email');

-- Service role has full access
create policy "service role manages events"
  on events for all
  to service_role
  using (true);

-- Event types logged by Vector:
-- transcript_parsed    — after validation modal confirm; includes track, offers, edits
-- artifact_downloaded  — type: positioning|offer1|offer2|offer3|referral|casestudies|placement|plan|bundle|etc
-- contact_status_changed — contact moved from one status to another
-- step_visited         — which step number was visited
-- positioning_generated — runPositioning() completed
-- referral_scripts_generated — runReferralEngine() completed
-- credibility_run      — runCredibility() completed
