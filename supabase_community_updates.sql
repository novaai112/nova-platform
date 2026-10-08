-- ==============================================================================
-- NOVA COMMUNITY SYSTEM UPDATES & DEDUPLICATED VIEWS MIGRATION
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/oszozycwjqvsdnulmhrc/sql
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. DEDUPLICATED POST VIEWS TABLE (1 VIEW PER POST PER USER)
-- Prevents repeated view counts: a user viewing the same post multiple times only counts once!
create table if not exists public.nova_community_post_views (
  id uuid primary key default gen_random_uuid(),
  post_id text not null,
  user_email text not null,
  viewed_at timestamptz not null default now(),
  constraint nova_community_post_views_unique unique (post_id, user_email)
);

create index if not exists idx_post_views_post_id on public.nova_community_post_views(post_id);
create index if not exists idx_post_views_user_email on public.nova_community_post_views(user_email);

-- Enable RLS for post views
alter table public.nova_community_post_views enable row level security;

drop policy if exists "post_views_select_all" on public.nova_community_post_views;
create policy "post_views_select_all" on public.nova_community_post_views
  for select using (true);

drop policy if exists "post_views_insert_all" on public.nova_community_post_views;
create policy "post_views_insert_all" on public.nova_community_post_views
  for insert with check (true);

-- 3. PERMANENT USER ACTIVITY & ALERTS LOG
-- Real-time alerts, transactions, and community events saved permanently per user
create table if not exists public.nova_user_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  user_name text,
  event_type text not null check (event_type in ('alert', 'transaction', 'community', 'security', 'login')),
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_activity_email on public.nova_user_activity_logs(user_email);
create index if not exists idx_user_activity_type on public.nova_user_activity_logs(event_type);
create index if not exists idx_user_activity_created_at on public.nova_user_activity_logs(created_at desc);

-- Enable RLS for activity logs
alter table public.nova_user_activity_logs enable row level security;

drop policy if exists "activity_logs_select_all" on public.nova_user_activity_logs;
create policy "activity_logs_select_all" on public.nova_user_activity_logs
  for select using (true);

drop policy if exists "activity_logs_insert_all" on public.nova_user_activity_logs;
create policy "activity_logs_insert_all" on public.nova_user_activity_logs
  for insert with check (true);

-- 4. PRIVATE INBOX & MESSAGES (MATCHING IMAGE 1 COMPOSER)
-- Direct messaging between users with dedicated inboxes (no live chat widget)
create table if not exists public.nova_community_messages (
  id uuid primary key default gen_random_uuid(),
  sender_email text not null,
  sender_name text not null,
  sender_avatar text,
  recipient_email text not null,
  recipient_name text not null,
  recipient_avatar text,
  subject text,
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_comm_messages_sender on public.nova_community_messages(sender_email);
create index if not exists idx_comm_messages_recipient on public.nova_community_messages(recipient_email);
create index if not exists idx_comm_messages_created on public.nova_community_messages(created_at desc);

-- Enable RLS for community messages
alter table public.nova_community_messages enable row level security;

drop policy if exists "comm_messages_select" on public.nova_community_messages;
create policy "comm_messages_select" on public.nova_community_messages
  for select using (true);

drop policy if exists "comm_messages_insert" on public.nova_community_messages;
create policy "comm_messages_insert" on public.nova_community_messages
  for insert with check (true);

drop policy if exists "comm_messages_update" on public.nova_community_messages;
create policy "comm_messages_update" on public.nova_community_messages
  for update using (true);

-- 5. ENSURE POST COLUMNS (POST TYPE, STATUS, TAGS, VIEWS)
alter table public.nova_community_posts
  add column if not exists post_type text default 'Discussion',
  add column if not exists post_status text default 'Unanswered',
  add column if not exists last_active_at timestamptz default now();

-- 6. ENSURE USER PROFILES ROLE & LAST SEEN
alter table public.user_profiles
  add column if not exists role text default 'Member',
  add column if not exists last_seen timestamptz default now();

-- Set Admin role for dineshkumar2729304@gmail.com
update public.user_profiles
set role = 'Admin'
where lower(email) = 'dineshkumar2729304@gmail.com';

-- 7. REALTIME REPLICATION (IF ENABLED)
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'nova_community_messages') then
      alter publication supabase_realtime add table public.nova_community_messages;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'nova_user_activity_logs') then
      alter publication supabase_realtime add table public.nova_user_activity_logs;
    end if;
  end if;
end;
$$;

-- Grant permissions to public/anon/authenticated roles
grant select, insert, update on public.nova_community_post_views to anon, authenticated;
grant select, insert, update on public.nova_user_activity_logs to anon, authenticated;
grant select, insert, update on public.nova_community_messages to anon, authenticated;
