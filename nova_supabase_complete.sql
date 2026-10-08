create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  username text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  plan text not null default 'Free',
  daily_credits_total integer not null default 100,
  daily_credits_remaining integer not null default 100,
  is_approved boolean not null default false,
  avatar_url text,
  company text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'dm' check (type in ('dm', 'group')),
  name text,
  avatar_url text,
  wallpaper_url text,
  created_by uuid references auth.users(id) on delete set null,
  is_request boolean not null default false,
  request_status text not null default 'pending' check (request_status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint conversation_participants_unique unique (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  content text,
  media_type text not null default 'text',
  media_url text,
  media_metadata jsonb not null default '{}'::jsonb,
  reply_to_id uuid references public.messages(id) on delete set null,
  view_limit integer not null default 0,
  view_count integer not null default 0,
  viewer_ids text[] not null default '{}'::text[],
  is_pinned boolean not null default false,
  is_edited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.message_reactions (
  id text primary key default ('rx_' || replace(gen_random_uuid()::text, '-', '')),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  constraint message_reactions_unique unique (message_id, user_id, emoji)
);

create table if not exists public.message_reads (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  constraint message_reads_unique unique (message_id, user_id)
);

create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  caller_id uuid references auth.users(id) on delete set null,
  callee_id uuid references auth.users(id) on delete set null,
  type text not null default 'audio',
  call_type text not null default 'audio',
  status text not null default 'ringing',
  duration_seconds integer not null default 0,
  started_at timestamptz not null default now(),
  answered_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  blocked_user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint user_blocks_unique unique (blocker_id, blocked_id)
);

create table if not exists public.typing_indicators (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  updated_at timestamptz not null default now(),
  constraint typing_indicators_unique unique (conversation_id, user_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  type text not null default 'chat_message',
  content text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.nova_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  invoice_no text,
  receipt_no text,
  user_email text not null,
  user_name text,
  user_phone text,
  user_company text,
  plan_name text,
  plan_display text,
  billing_cycle text not null default 'monthly',
  amount numeric not null default 0,
  base_amount numeric not null default 0,
  cgst numeric not null default 0,
  sgst numeric not null default 0,
  igst numeric not null default 0,
  currency text not null default 'INR',
  payment_gateway text not null default 'Razorpay',
  payment_method text not null default 'UPI / NetBanking / Cards',
  transaction_id text,
  payment_status text not null default 'PAID',
  payment_date timestamptz not null default now(),
  status text not null default 'PAID',
  receipt_data jsonb not null default '{}'::jsonb,
  is_wizard boolean not null default false,
  license_key text,
  expiry_date timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ansys_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  job_id_display text,
  name text,
  type text,
  status text not null default 'Pending',
  price numeric not null default 0,
  json_payload jsonb not null default '{}'::jsonb,
  geometry_data jsonb not null default '{}'::jsonb,
  report_url text,
  excel_file_url text,
  result_url text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nova_community_posts (
  id text primary key default ('post_' || replace(gen_random_uuid()::text, '-', '')),
  type text not null default 'discussion' check (type in ('discussion', 'question')),
  title text not null,
  content text not null,
  category text not null,
  tags text[] not null default '{}'::text[],
  user_name text,
  user_email text,
  user_avatar text,
  user_initial text,
  user_role text,
  views_count integer not null default 0,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  is_solved boolean not null default false,
  image_url text,
  code_snippet text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nova_community_comments (
  id text primary key default ('cmt_' || replace(gen_random_uuid()::text, '-', '')),
  post_id text not null references public.nova_community_posts(id) on delete cascade,
  comment text not null,
  user_name text,
  user_email text,
  user_avatar text,
  user_initial text,
  user_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nova_messages (
  id uuid primary key default gen_random_uuid(),
  sender_email text not null,
  sender_name text,
  sender_avatar text,
  recipient_email text not null,
  recipient_name text,
  recipient_avatar text,
  content text,
  message_type text not null default 'text',
  attachment_url text,
  attachment_name text,
  attachment_size numeric,
  reactions jsonb not null default '[]'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_user_profiles_email on public.user_profiles(email);
create index if not exists idx_conversations_created_by on public.conversations(created_by);
create index if not exists idx_conv_parts_conv_id on public.conversation_participants(conversation_id);
create index if not exists idx_conv_parts_user_id on public.conversation_participants(user_id);
create index if not exists idx_messages_conv_id on public.messages(conversation_id);
create index if not exists idx_messages_user_id on public.messages(user_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_reactions_message_id on public.message_reactions(message_id);
create index if not exists idx_reads_message_id on public.message_reads(message_id);
create index if not exists idx_calls_conv_id on public.calls(conversation_id);
create index if not exists idx_calls_caller on public.calls(caller_id);
create index if not exists idx_calls_callee on public.calls(callee_id);
create index if not exists idx_user_blocks_blocker on public.user_blocks(blocker_id);
create index if not exists idx_user_blocks_blocked on public.user_blocks(blocked_id);
create index if not exists idx_typing_conv on public.typing_indicators(conversation_id);
create index if not exists idx_notifications_recipient on public.notifications(recipient_id);
create index if not exists idx_nova_orders_user_email on public.nova_orders(user_email);
create index if not exists idx_nova_orders_order_id on public.nova_orders(order_id);
create index if not exists idx_ansys_jobs_user_id on public.ansys_jobs(user_id);
create index if not exists idx_ansys_jobs_created_at on public.ansys_jobs(created_at desc);
create index if not exists idx_posts_user_email on public.nova_community_posts(user_email);
create index if not exists idx_posts_created_at on public.nova_community_posts(created_at desc);
create index if not exists idx_comments_post_id on public.nova_community_comments(post_id);
create index if not exists idx_comments_user_email on public.nova_community_comments(user_email);
create index if not exists idx_nova_msgs_sender on public.nova_messages(sender_email);
create index if not exists idx_nova_msgs_recipient on public.nova_messages(recipient_email);

create or replace function public.update_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_timestamp on public.profiles;
create trigger set_profiles_timestamp
  before update on public.profiles
  for each row execute function public.update_timestamp();

drop trigger if exists set_user_profiles_timestamp on public.user_profiles;
create trigger set_user_profiles_timestamp
  before update on public.user_profiles
  for each row execute function public.update_timestamp();

drop trigger if exists set_conversations_timestamp on public.conversations;
create trigger set_conversations_timestamp
  before update on public.conversations
  for each row execute function public.update_timestamp();

drop trigger if exists set_messages_timestamp on public.messages;
create trigger set_messages_timestamp
  before update on public.messages
  for each row execute function public.update_timestamp();

drop trigger if exists set_ansys_jobs_timestamp on public.ansys_jobs;
create trigger set_ansys_jobs_timestamp
  before update on public.ansys_jobs
  for each row execute function public.update_timestamp();

drop trigger if exists set_posts_timestamp on public.nova_community_posts;
create trigger set_posts_timestamp
  before update on public.nova_community_posts
  for each row execute function public.update_timestamp();

drop trigger if exists set_comments_timestamp on public.nova_community_comments;
create trigger set_comments_timestamp
  before update on public.nova_community_comments
  for each row execute function public.update_timestamp();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, username, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (user_id) do update set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();

  insert into public.user_profiles (
    id, email, full_name, plan, daily_credits_total, daily_credits_remaining, is_approved, avatar_url, company, phone
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case when new.email in ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') then 'Max' else 'Free' end,
    case when new.email in ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') then 3000 else 100 end,
    case when new.email in ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') then 3000 else 100 end,
    case when new.email in ('analysis.ai.nova@gmail.com', 'dineshkumar2729304@gmail.com') or coalesce((new.raw_user_meta_data->>'is_approved')::boolean, false) then true else false end,
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'company',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (email) do update set
    id = excluded.id,
    full_name = coalesce(excluded.full_name, user_profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, user_profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_conversation_participant(_conv_id uuid, _user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.conversation_participants
    where conversation_id = _conv_id and user_id = _user_id
  );
$$;

create or replace function public.get_or_create_dm(
  _other_user uuid,
  _sender_user uuid default auth.uid()
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conv_id uuid;
begin
  if _sender_user is null then
    _sender_user := auth.uid();
  end if;

  select cp1.conversation_id into v_conv_id
  from public.conversation_participants cp1
  join public.conversation_participants cp2 on cp1.conversation_id = cp2.conversation_id
  join public.conversations c on c.id = cp1.conversation_id
  where c.type = 'dm'
    and cp1.user_id = _sender_user
    and cp2.user_id = _other_user
  limit 1;

  if v_conv_id is not null then
    return v_conv_id;
  end if;

  insert into public.conversations (type, created_by, is_request, request_status)
  values ('dm', _sender_user, false, 'accepted')
  returning id into v_conv_id;

  insert into public.conversation_participants (conversation_id, user_id)
  values (v_conv_id, _sender_user), (v_conv_id, _other_user);

  return v_conv_id;
end;
$$;

create or replace function public.send_conversation_request(
  _sender_id uuid,
  _recipient_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conv_id uuid;
begin
  select cp1.conversation_id into v_conv_id
  from public.conversation_participants cp1
  join public.conversation_participants cp2 on cp1.conversation_id = cp2.conversation_id
  join public.conversations c on c.id = cp1.conversation_id
  where c.type = 'dm'
    and cp1.user_id = _sender_id
    and cp2.user_id = _recipient_id
  limit 1;

  if v_conv_id is not null then
    update public.conversations
    set is_request = true, request_status = 'pending', updated_at = now()
    where id = v_conv_id;
    return v_conv_id;
  end if;

  insert into public.conversations (type, created_by, is_request, request_status)
  values ('dm', _sender_id, true, 'pending')
  returning id into v_conv_id;

  insert into public.conversation_participants (conversation_id, user_id)
  values (v_conv_id, _sender_id), (v_conv_id, _recipient_id);

  return v_conv_id;
end;
$$;

create or replace function public.accept_conversation_request(_conv_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set is_request = false, request_status = 'accepted', updated_at = now()
  where id = _conv_id;
  return true;
end;
$$;

create or replace function public.decline_conversation_request(_conv_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set is_request = false, request_status = 'declined', updated_at = now()
  where id = _conv_id;
  return true;
end;
$$;

create or replace function public.mark_message_viewed(p_message_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_msg record;
  v_uid text;
  v_new_viewers text[];
  v_new_count integer;
  v_deleted boolean := false;
  v_content text;
begin
  v_uid := auth.uid()::text;
  if v_uid is null then
    v_uid := 'anonymous';
  end if;

  select * into v_msg from public.messages where id = p_message_id for update;
  if not found then
    return jsonb_build_object('error', 'Message not found');
  end if;

  if v_msg.view_limit > 0 and v_msg.viewer_ids @> array[v_uid] then
    return jsonb_build_object(
      'already_viewed', true,
      'view_count', v_msg.view_count,
      'viewer_ids', v_msg.viewer_ids,
      'deleted', (v_msg.view_count >= v_msg.view_limit),
      'content', v_msg.content
    );
  end if;

  v_new_count := coalesce(v_msg.view_count, 0) + 1;
  v_new_viewers := array_append(coalesce(v_msg.viewer_ids, '{}'::text[]), v_uid);
  v_content := v_msg.content;

  if v_msg.view_limit > 0 and v_new_count >= v_msg.view_limit then
    v_deleted := true;
    v_content := 'Photo expired';
    update public.messages
    set view_count = v_new_count,
        viewer_ids = v_new_viewers,
        media_url = null,
        content = v_content,
        updated_at = now()
    where id = p_message_id;
  else
    update public.messages
    set view_count = v_new_count,
        viewer_ids = v_new_viewers,
        updated_at = now()
    where id = p_message_id;
  end if;

  return jsonb_build_object(
    'already_viewed', false,
    'view_count', v_new_count,
    'viewer_ids', v_new_viewers,
    'deleted', v_deleted,
    'content', v_content
  );
end;
$$;

alter table public.profiles enable row level security;
alter table public.user_profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.message_reactions enable row level security;
alter table public.message_reads enable row level security;
alter table public.calls enable row level security;
alter table public.user_blocks enable row level security;
alter table public.typing_indicators enable row level security;
alter table public.notifications enable row level security;
alter table public.nova_orders enable row level security;
alter table public.ansys_jobs enable row level security;
alter table public.nova_community_posts enable row level security;
alter table public.nova_community_comments enable row level security;
alter table public.nova_messages enable row level security;

create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id or auth.uid() is not null);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = user_id);

create policy "user_profiles_select_all" on public.user_profiles
  for select using (true);

create policy "user_profiles_insert_all" on public.user_profiles
  for insert with check (true);

create policy "user_profiles_update_all" on public.user_profiles
  for update using (auth.uid() = id or email = (auth.jwt()->>'email') or auth.uid() is not null)
  with check (auth.uid() = id or email = (auth.jwt()->>'email') or auth.uid() is not null);

create policy "user_profiles_delete_own" on public.user_profiles
  for delete using (auth.uid() = id);

create policy "conversations_select_participant" on public.conversations
  for select using (
    public.is_conversation_participant(id, auth.uid())
    or created_by = auth.uid()
    or auth.uid() is not null
  );

create policy "conversations_insert_auth" on public.conversations
  for insert with check (auth.uid() is not null);

create policy "conversations_update_participant" on public.conversations
  for update using (
    public.is_conversation_participant(id, auth.uid())
    or created_by = auth.uid()
  );

create policy "conversations_delete_participant" on public.conversations
  for delete using (
    created_by = auth.uid()
    or public.is_conversation_participant(id, auth.uid())
  );

create policy "conv_participants_select" on public.conversation_participants
  for select using (true);

create policy "conv_participants_insert" on public.conversation_participants
  for insert with check (auth.uid() is not null);

create policy "conv_participants_update" on public.conversation_participants
  for update using (user_id = auth.uid() or auth.uid() is not null);

create policy "conv_participants_delete" on public.conversation_participants
  for delete using (user_id = auth.uid() or auth.uid() is not null);

create policy "messages_select_participant" on public.messages
  for select using (
    public.is_conversation_participant(conversation_id, auth.uid())
    or auth.uid() is not null
  );

create policy "messages_insert_participant" on public.messages
  for insert with check (
    user_id = auth.uid()
    or auth.uid() is not null
  );

create policy "messages_update_owner" on public.messages
  for update using (
    user_id = auth.uid()
    or public.is_conversation_participant(conversation_id, auth.uid())
  );

create policy "messages_delete_owner" on public.messages
  for delete using (
    user_id = auth.uid()
    or public.is_conversation_participant(conversation_id, auth.uid())
  );

create policy "reactions_select" on public.message_reactions
  for select using (true);

create policy "reactions_insert" on public.message_reactions
  for insert with check (auth.uid() = user_id or auth.uid() is not null);

create policy "reactions_delete" on public.message_reactions
  for delete using (auth.uid() = user_id or auth.uid() is not null);

create policy "reads_select" on public.message_reads
  for select using (true);

create policy "reads_insert" on public.message_reads
  for insert with check (auth.uid() = user_id or auth.uid() is not null);

create policy "reads_update" on public.message_reads
  for update using (auth.uid() = user_id or auth.uid() is not null);

create policy "calls_select" on public.calls
  for select using (
    caller_id = auth.uid()
    or callee_id = auth.uid()
    or public.is_conversation_participant(conversation_id, auth.uid())
    or auth.uid() is not null
  );

create policy "calls_insert" on public.calls
  for insert with check (auth.uid() is not null);

create policy "calls_update" on public.calls
  for update using (
    caller_id = auth.uid()
    or callee_id = auth.uid()
    or public.is_conversation_participant(conversation_id, auth.uid())
    or auth.uid() is not null
  );

create policy "calls_delete" on public.calls
  for delete using (caller_id = auth.uid() or callee_id = auth.uid());

create policy "blocks_select" on public.user_blocks
  for select using (
    blocker_id = auth.uid()
    or blocked_id = auth.uid()
    or user_id = auth.uid()
    or blocked_user_id = auth.uid()
  );

create policy "blocks_insert" on public.user_blocks
  for insert with check (
    blocker_id = auth.uid()
    or user_id = auth.uid()
    or auth.uid() is not null
  );

create policy "blocks_delete" on public.user_blocks
  for delete using (
    blocker_id = auth.uid()
    or user_id = auth.uid()
  );

create policy "typing_select" on public.typing_indicators
  for select using (true);

create policy "typing_insert" on public.typing_indicators
  for insert with check (auth.uid() = user_id or auth.uid() is not null);

create policy "typing_update" on public.typing_indicators
  for update using (auth.uid() = user_id or auth.uid() is not null);

create policy "typing_delete" on public.typing_indicators
  for delete using (auth.uid() = user_id or auth.uid() is not null);

create policy "notifications_select" on public.notifications
  for select using (recipient_id = auth.uid());

create policy "notifications_insert" on public.notifications
  for insert with check (auth.uid() is not null or sender_id = auth.uid());

create policy "notifications_update" on public.notifications
  for update using (recipient_id = auth.uid());

create policy "notifications_delete" on public.notifications
  for delete using (recipient_id = auth.uid());

create policy "nova_orders_select" on public.nova_orders
  for select using (
    user_email = (auth.jwt()->>'email')
    or auth.uid() is not null
    or true
  );

create policy "nova_orders_insert" on public.nova_orders
  for insert with check (true);

create policy "nova_orders_update" on public.nova_orders
  for update using (true);

create policy "ansys_jobs_select" on public.ansys_jobs
  for select using (
    user_id = auth.uid()
    or (auth.jwt()->>'email') in ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com')
    or auth.uid() is not null
  );

create policy "ansys_jobs_insert" on public.ansys_jobs
  for insert with check (auth.uid() is not null);

create policy "ansys_jobs_update" on public.ansys_jobs
  for update using (
    user_id = auth.uid()
    or (auth.jwt()->>'email') in ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com')
  );

create policy "ansys_jobs_delete" on public.ansys_jobs
  for delete using (
    user_id = auth.uid()
    or (auth.jwt()->>'email') in ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com')
  );

create policy "posts_select" on public.nova_community_posts
  for select using (true);

create policy "posts_insert" on public.nova_community_posts
  for insert with check (true);

create policy "posts_update" on public.nova_community_posts
  for update using (true);

create policy "posts_delete" on public.nova_community_posts
  for delete using (
    user_email = (auth.jwt()->>'email')
    or (auth.jwt()->>'email') in ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com')
    or true
  );

create policy "comments_select" on public.nova_community_comments
  for select using (true);

create policy "comments_insert" on public.nova_community_comments
  for insert with check (true);

create policy "comments_update" on public.nova_community_comments
  for update using (true);

create policy "comments_delete" on public.nova_community_comments
  for delete using (
    user_email = (auth.jwt()->>'email')
    or (auth.jwt()->>'email') in ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com')
    or true
  );

create policy "nova_messages_select" on public.nova_messages
  for select using (
    sender_email = (auth.jwt()->>'email')
    or recipient_email = (auth.jwt()->>'email')
    or auth.uid() is not null
  );

create policy "nova_messages_insert" on public.nova_messages
  for insert with check (true);

create policy "nova_messages_update" on public.nova_messages
  for update using (
    sender_email = (auth.jwt()->>'email')
    or recipient_email = (auth.jwt()->>'email')
    or auth.uid() is not null
  );

create policy "nova_messages_delete" on public.nova_messages
  for delete using (
    sender_email = (auth.jwt()->>'email')
    or recipient_email = (auth.jwt()->>'email')
    or auth.uid() is not null
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('chat-media', 'chat-media', true, 52428800, null),
  ('avatars', 'avatars', true, 10485760, null)
on conflict (id) do update set public = true;

create policy "storage_public_select" on storage.objects
  for select using (bucket_id in ('chat-media', 'avatars'));

create policy "storage_public_insert" on storage.objects
  for insert with check (bucket_id in ('chat-media', 'avatars'));

create policy "storage_public_update" on storage.objects
  for update using (bucket_id in ('chat-media', 'avatars'));

create policy "storage_public_delete" on storage.objects
  for delete using (bucket_id in ('chat-media', 'avatars'));

do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'ansys_jobs'
  ) then
    alter publication supabase_realtime add table public.ansys_jobs;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'nova_community_posts'
  ) then
    alter publication supabase_realtime add table public.nova_community_posts;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'nova_community_comments'
  ) then
    alter publication supabase_realtime add table public.nova_community_comments;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'message_reactions'
  ) then
    alter publication supabase_realtime add table public.message_reactions;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'message_reads'
  ) then
    alter publication supabase_realtime add table public.message_reads;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'conversations'
  ) then
    alter publication supabase_realtime add table public.conversations;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'conversation_participants'
  ) then
    alter publication supabase_realtime add table public.conversation_participants;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'calls'
  ) then
    alter publication supabase_realtime add table public.calls;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_blocks'
  ) then
    alter publication supabase_realtime add table public.user_blocks;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'typing_indicators'
  ) then
    alter publication supabase_realtime add table public.typing_indicators;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'nova_messages'
  ) then
    alter publication supabase_realtime add table public.nova_messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'nova_community_messages'
  ) then
    alter publication supabase_realtime add table public.nova_community_messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'nova_user_activity_logs'
  ) then
    alter publication supabase_realtime add table public.nova_user_activity_logs;
  end if;
end;
$$;

-- ==============================================================================
-- NOVA COMMUNITY ENHANCEMENTS: DEDUPLICATED POST VIEWS, ACTIVITY LOGS, MESSAGES
-- ==============================================================================

create table if not exists public.nova_community_post_views (
  id uuid primary key default gen_random_uuid(),
  post_id text not null,
  user_email text not null,
  viewed_at timestamptz not null default now(),
  constraint nova_community_post_views_unique unique (post_id, user_email)
);

create index if not exists idx_post_views_post_id on public.nova_community_post_views(post_id);
create index if not exists idx_post_views_user_email on public.nova_community_post_views(user_email);

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

alter table public.nova_community_posts
  add column if not exists post_type text default 'Discussion',
  add column if not exists post_status text default 'Unanswered',
  add column if not exists last_active_at timestamptz default now();

alter table public.user_profiles
  add column if not exists role text default 'Member',
  add column if not exists last_seen timestamptz default now();

update public.user_profiles
set role = 'Admin'
where lower(email) = 'dineshkumar2729304@gmail.com';

grant select, insert, update on public.nova_community_post_views to anon, authenticated;
grant select, insert, update on public.nova_user_activity_logs to anon, authenticated;
grant select, insert, update on public.nova_community_messages to anon, authenticated;


