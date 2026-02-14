-- Core tables for LMS progress + conversion signals.
-- Run this in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  source text not null default 'free' check (source in ('free', 'paid')),
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_id text not null,
  route text not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  score numeric(5,2),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug, lesson_id)
);

create table if not exists public.course_progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  percent integer not null default 0 check (percent >= 0 and percent <= 100),
  completed_count integer not null default 0,
  total_count integer not null default 0,
  last_route text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  event_name text not null,
  course_slug text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_course_enrollments_user_course
  on public.course_enrollments (user_id, course_slug);

create index if not exists idx_lesson_progress_user_course
  on public.lesson_progress (user_id, course_slug);

create index if not exists idx_lead_events_course
  on public.lead_events (course_slug, created_at desc);

alter table public.course_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.course_progress_snapshots enable row level security;
alter table public.lead_events enable row level security;

drop policy if exists "users_select_own_enrollments" on public.course_enrollments;
create policy "users_select_own_enrollments"
  on public.course_enrollments
  for select
  using (auth.uid() = user_id);

drop policy if exists "users_upsert_own_enrollments" on public.course_enrollments;
create policy "users_upsert_own_enrollments"
  on public.course_enrollments
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users_select_own_lesson_progress" on public.lesson_progress;
create policy "users_select_own_lesson_progress"
  on public.lesson_progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "users_upsert_own_lesson_progress" on public.lesson_progress;
create policy "users_upsert_own_lesson_progress"
  on public.lesson_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users_select_own_snapshots" on public.course_progress_snapshots;
create policy "users_select_own_snapshots"
  on public.course_progress_snapshots
  for select
  using (auth.uid() = user_id);

drop policy if exists "users_upsert_own_snapshots" on public.course_progress_snapshots;
create policy "users_upsert_own_snapshots"
  on public.course_progress_snapshots
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users_insert_own_lead_events" on public.lead_events;
create policy "users_insert_own_lead_events"
  on public.lead_events
  for insert
  with check (auth.uid() = user_id or user_id is null);

-- Tool-level progress (JSONB blobs per tool per user).
create table if not exists public.tool_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  tool_key text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug, tool_key)
);

create index if not exists idx_tool_progress_user_course
  on public.tool_progress (user_id, course_slug);

alter table public.tool_progress enable row level security;

drop policy if exists "users_select_own_tool_progress" on public.tool_progress;
create policy "users_select_own_tool_progress"
  on public.tool_progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "users_upsert_own_tool_progress" on public.tool_progress;
create policy "users_upsert_own_tool_progress"
  on public.tool_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
