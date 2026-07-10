-- Vector Layer 3: Knowledge Base
-- Run this in Supabase SQL editor (Dashboard → SQL Editor → New query)

-- 1. Enable pgvector extension (for future semantic search upgrade)
create extension if not exists vector;

-- 2. Create knowledge table
create table if not exists knowledge (
  id           text primary key,           -- stable seed ID (e.g. "k-p01-pos")
  type         text not null,              -- positioning | offers | case_study | referral_script | methodology
  content      text not null,             -- the retrievable text injected into prompts
  metadata     jsonb not null default '{}', -- track, industry, firm_size, market_state, motion, etc.
  outcome_signal text,                    -- null | converted | no-response | rejected
  source       text not null default 'synthetic-seed', -- synthetic-seed | britt-curated | client-generated
  practice_id  text,                      -- which practice archetype this came from
  embedding    vector(1024),              -- Voyage AI voyage-3-lite embeddings (populated later)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 3. Indexes for fast metadata filtering (used by retrieveKnowledge())
create index if not exists knowledge_type_idx
  on knowledge(type);

create index if not exists knowledge_track_idx
  on knowledge((metadata->>'track'));

create index if not exists knowledge_industry_idx
  on knowledge((metadata->>'industry'));

create index if not exists knowledge_source_idx
  on knowledge(source);

-- 4. Vector similarity index (used when embeddings are populated)
-- Uncomment after running the embedding seed step:
-- create index if not exists knowledge_embedding_idx
--   on knowledge using ivfflat (embedding vector_cosine_ops)
--   with (lists = 10);

-- 5. Row-level security
alter table knowledge enable row level security;

-- All authenticated users can read (knowledge is shared across all clients)
create policy "authenticated users can read knowledge"
  on knowledge for select
  to authenticated
  using (true);

-- Only service role can write (seeding done server-side, never from browser)
create policy "service role manages knowledge"
  on knowledge for all
  to service_role
  using (true);

-- 6. Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger knowledge_updated_at
  before update on knowledge
  for each row execute function update_updated_at();
