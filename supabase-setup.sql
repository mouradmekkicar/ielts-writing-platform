-- ============================================================================
-- IELTSwithMOURAD — Improvement Lab  ·  Supabase setup
-- Run this ONCE in your Supabase project:  Dashboard → SQL Editor → New query
-- → paste → Run.  It creates three tables, turns on Realtime, and adds simple
-- access policies. Only a display name + class code are ever stored (no email,
-- no school data), in keeping with the platform's privacy-first design.
-- ============================================================================

-- 1) Tables ------------------------------------------------------------------
create table if not exists public.mmwa_clinic_assignments (
  id            text primary key,
  room          text not null,          -- class code (e.g. "mmwa-main")
  student_key   text not null,          -- "*" = whole class, else normalised name
  student_name  text,
  clinic_index  int  not null,          -- 0..14 (which of the 15 activities)
  unlock_code   text,
  deadline      text,
  instructions  text,
  by_name       text,
  created_at    timestamptz default now()
);

create table if not exists public.mmwa_clinic_work (
  room          text not null,
  student_key   text not null,
  student_name  text,
  clinic_index  int  not null,
  attempt       text,
  status        text,                   -- 'typing' | 'submitted'
  revealed      boolean default false,
  unlocked      boolean default false,
  updated_at    timestamptz default now(),
  primary key (room, student_key, clinic_index)
);

create table if not exists public.mmwa_clinic_roster (
  room          text not null,
  student_key   text not null,
  student_name  text,
  seen_at       timestamptz default now(),
  primary key (room, student_key)
);

-- 2) Realtime ----------------------------------------------------------------
-- Idempotent: safe to run more than once.
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='mmwa_clinic_assignments')
    then alter publication supabase_realtime add table public.mmwa_clinic_assignments; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='mmwa_clinic_work')
    then alter publication supabase_realtime add table public.mmwa_clinic_work; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='mmwa_clinic_roster')
    then alter publication supabase_realtime add table public.mmwa_clinic_roster; end if;
end $$;

-- 3) Row-Level Security ------------------------------------------------------
-- Prototype policies: the public anon key may read/write these three tables.
-- This matches the current "display name only" trust model. To tighten later,
-- scope writes by room or add a shared write secret.
alter table public.mmwa_clinic_assignments enable row level security;
alter table public.mmwa_clinic_work        enable row level security;
alter table public.mmwa_clinic_roster      enable row level security;

drop policy if exists "anon all" on public.mmwa_clinic_assignments;
drop policy if exists "anon all" on public.mmwa_clinic_work;
drop policy if exists "anon all" on public.mmwa_clinic_roster;

create policy "anon all" on public.mmwa_clinic_assignments for all to anon using (true) with check (true);
create policy "anon all" on public.mmwa_clinic_work        for all to anon using (true) with check (true);
create policy "anon all" on public.mmwa_clinic_roster      for all to anon using (true) with check (true);


-- ============================================================================
-- PHASE 1 · ACCOUNTS  (email + password login + secure roles)
-- ============================================================================

-- A) Who is allowed to be a teacher/admin. Students are never in this list, so
--    they can never become teachers. Your email is already filled in below.
create table if not exists public.mmwa_teacher_emails ( email text primary key );

-- Lock the allow-list to clients. No policy on purpose: browsers can't read it.
-- The sign-up trigger below is SECURITY DEFINER, so it still reads this table.
alter table public.mmwa_teacher_emails enable row level security;

insert into public.mmwa_teacher_emails (email) values ('mourad.mekki.car@gmail.com')
  on conflict (email) do nothing;

-- If you already created your account before running this, promote it now.
-- (Harmless if the account doesn't exist yet.)
update public.profiles set role = 'teacher'
  where lower(email) = lower('mourad.mekki.car@gmail.com');

-- B) Profiles: one row per account, holding display name + role.
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text,
  display_name  text,
  role          text not null default 'student',
  created_at    timestamptz default now()
);

-- C) On sign-up, create the profile and set the role from the allow-list.
--    SECURITY DEFINER means the role is decided on the server — a user cannot
--    grant themselves 'teacher' from the browser.
create or replace function public.mmwa_handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1)),
    case when exists (select 1 from public.mmwa_teacher_emails t where lower(t.email)=lower(new.email))
         then 'teacher' else 'student' end
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists mmwa_on_auth_user_created on auth.users;
create trigger mmwa_on_auth_user_created
  after insert on auth.users
  for each row execute function public.mmwa_handle_new_user();

-- D) Profiles RLS: you can read your own row; teachers can read everyone
--    (so the Improvement Lab roster shows student names). No one can change a
--    role from the client. The teacher check uses a SECURITY DEFINER helper so
--    the policy never queries `profiles` recursively (which Postgres rejects).
create or replace function public.mmwa_is_teacher() returns boolean
  language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher');
$$;

alter table public.profiles enable row level security;
drop policy if exists "read own or teacher reads all" on public.profiles;
create policy "read own or teacher reads all" on public.profiles for select to authenticated
  using ( id = auth.uid() or public.mmwa_is_teacher() );

-- E) Switch the Improvement Lab tables from anon to logged-in users.
drop policy if exists "anon all" on public.mmwa_clinic_assignments;
drop policy if exists "anon all" on public.mmwa_clinic_work;
drop policy if exists "anon all" on public.mmwa_clinic_roster;
drop policy if exists "auth all" on public.mmwa_clinic_assignments;
drop policy if exists "auth all" on public.mmwa_clinic_work;
drop policy if exists "auth all" on public.mmwa_clinic_roster;

create policy "auth all" on public.mmwa_clinic_assignments for all to authenticated using (true) with check (true);
create policy "auth all" on public.mmwa_clinic_work        for all to authenticated using (true) with check (true);
create policy "auth all" on public.mmwa_clinic_roster      for all to authenticated using (true) with check (true);


-- ============================================================================
-- PHASE 2 · CLASS DATA ACROSS DEVICES
-- Submissions (+reviews), drafts, exam tokens, certificates and homework, so
-- the Students / Submissions / Reports views show your whole class anywhere.
-- Each row stores the app object as `data` (jsonb) to keep shapes identical.
-- ============================================================================

create or replace function public.mmwa_is_teacher() returns boolean
  language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher');
$$;

create table if not exists public.mmwa_submissions (
  id text primary key, user_id uuid not null, student_name text,
  data jsonb, submitted_at timestamptz, updated_at timestamptz default now()
);
create table if not exists public.mmwa_drafts (
  id text primary key, user_id uuid not null, data jsonb, updated_at timestamptz default now()
);
create table if not exists public.mmwa_tokens (
  user_id uuid primary key, data jsonb, updated_at timestamptz default now()
);
create table if not exists public.mmwa_certificates (
  id text primary key, user_id uuid not null, data jsonb, created_at timestamptz default now()
);
create table if not exists public.mmwa_homework (
  id text primary key, student_id text not null, data jsonb, created_at timestamptz default now()
);

-- Realtime (idempotent)
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='mmwa_submissions')  then alter publication supabase_realtime add table public.mmwa_submissions;  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='mmwa_drafts')       then alter publication supabase_realtime add table public.mmwa_drafts;       end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='mmwa_tokens')       then alter publication supabase_realtime add table public.mmwa_tokens;       end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='mmwa_certificates') then alter publication supabase_realtime add table public.mmwa_certificates; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='mmwa_homework')     then alter publication supabase_realtime add table public.mmwa_homework;     end if;
end $$;

-- RLS
alter table public.mmwa_submissions  enable row level security;
alter table public.mmwa_drafts        enable row level security;
alter table public.mmwa_tokens        enable row level security;
alter table public.mmwa_certificates  enable row level security;
alter table public.mmwa_homework      enable row level security;

-- Submissions: student owns theirs; teacher can read + review everyone's.
drop policy if exists sub_sel on public.mmwa_submissions;
drop policy if exists sub_ins on public.mmwa_submissions;
drop policy if exists sub_upd on public.mmwa_submissions;
drop policy if exists sub_del on public.mmwa_submissions;
create policy sub_sel on public.mmwa_submissions for select to authenticated using (user_id = auth.uid() or public.mmwa_is_teacher());
create policy sub_ins on public.mmwa_submissions for insert to authenticated with check (user_id = auth.uid());
create policy sub_upd on public.mmwa_submissions for update to authenticated using (user_id = auth.uid() or public.mmwa_is_teacher()) with check (user_id = auth.uid() or public.mmwa_is_teacher());
create policy sub_del on public.mmwa_submissions for delete to authenticated using (user_id = auth.uid() or public.mmwa_is_teacher());

-- Drafts: private to the student.
drop policy if exists draft_all on public.mmwa_drafts;
create policy draft_all on public.mmwa_drafts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Tokens: student reads own; teacher reads/writes all; student may write own
-- (used count). Soft exam gate — not tamper-proof, same as the offline version.
drop policy if exists tok_all on public.mmwa_tokens;
create policy tok_all on public.mmwa_tokens for all to authenticated using (user_id = auth.uid() or public.mmwa_is_teacher()) with check (user_id = auth.uid() or public.mmwa_is_teacher());

-- Certificates: teacher issues; student reads own.
drop policy if exists cert_sel on public.mmwa_certificates;
drop policy if exists cert_wr  on public.mmwa_certificates;
create policy cert_sel on public.mmwa_certificates for select to authenticated using (user_id = auth.uid() or public.mmwa_is_teacher());
create policy cert_wr  on public.mmwa_certificates for all    to authenticated using (public.mmwa_is_teacher()) with check (public.mmwa_is_teacher());

-- Homework: any signed-in user (teacher creates, students read theirs).
drop policy if exists hw_all on public.mmwa_homework;
create policy hw_all on public.mmwa_homework for all to authenticated using (true) with check (true);
