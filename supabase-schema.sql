create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.student_requests (
  id text primary key,
  name text not null,
  struggle text not null,
  support_type text not null,
  connection_preference text not null,
  matched_mentor text not null,
  matched_role text not null,
  status text not null default 'Matched',
  first_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentor_applications (
  id text primary key,
  name text not null,
  age integer,
  city text not null,
  current_role text not null,
  story text not null,
  support_areas text[] not null default '{}',
  available_days text[] not null default '{}',
  available_times text[] not null default '{}',
  hours_per_week text,
  connection_styles text[] not null default '{}',
  message text not null,
  status text not null default 'Pending review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.waitlist_events (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  role text not null,
  source text not null,
  status text not null default 'Interested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.waitlist_events add column if not exists name text;
alter table public.waitlist_events add column if not exists email text;
alter table public.waitlist_events add column if not exists phone text;
alter table public.waitlist_events add column if not exists role text;
alter table public.waitlist_events add column if not exists source text;
alter table public.waitlist_events add column if not exists status text;
alter table public.waitlist_events alter column source set default 'page-interest';
alter table public.waitlist_events alter column status set default 'Interested';

drop trigger if exists set_student_requests_updated_at on public.student_requests;
create trigger set_student_requests_updated_at
before update on public.student_requests
for each row execute procedure public.set_updated_at();

drop trigger if exists set_mentor_applications_updated_at on public.mentor_applications;
create trigger set_mentor_applications_updated_at
before update on public.mentor_applications
for each row execute procedure public.set_updated_at();

drop trigger if exists set_waitlist_events_updated_at on public.waitlist_events;
create trigger set_waitlist_events_updated_at
before update on public.waitlist_events
for each row execute procedure public.set_updated_at();

alter table public.student_requests enable row level security;
alter table public.mentor_applications enable row level security;
alter table public.waitlist_events enable row level security;

drop policy if exists "Public can create student requests" on public.student_requests;
create policy "Public can create student requests"
on public.student_requests
for insert
to anon
with check (true);

drop policy if exists "Public can update student requests" on public.student_requests;
create policy "Public can update student requests"
on public.student_requests
for update
to anon
using (true)
with check (true);

drop policy if exists "Admin can read student requests" on public.student_requests;
create policy "Admin can read student requests"
on public.student_requests
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'deepdive9999@gmail.com');

drop policy if exists "Public can create mentor applications" on public.mentor_applications;
create policy "Public can create mentor applications"
on public.mentor_applications
for insert
to anon
with check (true);

drop policy if exists "Public can update mentor applications" on public.mentor_applications;
create policy "Public can update mentor applications"
on public.mentor_applications
for update
to anon
using (true)
with check (true);

drop policy if exists "Admin can read mentor applications" on public.mentor_applications;
create policy "Admin can read mentor applications"
on public.mentor_applications
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'deepdive9999@gmail.com');

drop policy if exists "Public can create waitlist events" on public.waitlist_events;
create policy "Public can create waitlist events"
on public.waitlist_events
for insert
to anon
with check (true);

drop policy if exists "Admin can read waitlist events" on public.waitlist_events;
create policy "Admin can read waitlist events"
on public.waitlist_events
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'deepdive9999@gmail.com');
