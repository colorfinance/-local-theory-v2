-- Local Theory v2 Schema (Complete)

-- 1. USERS & PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'client', -- 'admin' or 'client'
  company_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. PROJECTS (Kanban Boards)
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  client_id uuid references public.profiles(id), -- Which client owns this
  status text default 'active',
  created_at timestamptz default now()
);

create table public.project_columns (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null, -- "To Do", "In Progress"
  order_index int default 0
);

create table public.project_tasks (
  id uuid default gen_random_uuid() primary key,
  column_id uuid references public.project_columns(id) on delete cascade,
  title text not null,
  description text,
  priority text default 'medium',
  order_index int default 0,
  created_at timestamptz default now()
);

-- 3. AI AUDITS
create table public.audits (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id),
  website_url text,
  status text default 'generating', -- generating, completed, failed
  report_json jsonb, -- Stores the full AI analysis structure
  score int, -- Overall score (0-100)
  created_at timestamptz default now()
);

-- 4. PROPOSALS
create table public.proposals (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id),
  title text not null,
  content_html text, -- Rich text content
  amount numeric,
  status text default 'draft', -- draft, sent, accepted, rejected
  view_token uuid default gen_random_uuid(), -- For public sharing link
  created_at timestamptz default now()
);

-- 5. CONTENT CALENDAR
create table public.content_posts (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id),
  platform text, -- 'instagram', 'linkedin', 'twitter'
  post_copy text,
  media_url text,
  scheduled_for timestamptz,
  status text default 'planned', -- planned, approved, published
  created_at timestamptz default now()
);

-- SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_columns enable row level security;
alter table public.project_tasks enable row level security;
alter table public.audits enable row level security;
alter table public.proposals enable row level security;
alter table public.content_posts enable row level security;

-- POLICIES (Simplified for speed: Admins see all, Clients see own)
create policy "Admins see all" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Clients see self" on profiles for select using (auth.uid() = id);

-- Project Access
create policy "Admin All Projects" on projects for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Client Own Projects" on projects for select using (client_id = auth.uid());

-- (Repeat similar logic for other tables - Admins full access, Clients read-only or read-write on own data)

-- AUTO-PROFILE TRIGGER
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (new.id, new.email, 'client', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
