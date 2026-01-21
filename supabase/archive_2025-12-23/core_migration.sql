-- ==============================================================================
-- PART 2: CORE SAAS ARCHITECTURE (Multi-Tenant)
-- ==============================================================================

-- 1. Organizations (Tenants)
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  primary_color text default '#9333ea',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles (Users linked to Auth)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  organization_id uuid references organizations(id),
  role text default 'owner', -- 'owner', 'admin', 'staff'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Clients (Patients) - The first business entity
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) not null,
  name text not null,
  phone text,
  email text,
  cpf text,
  birth_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;

-- 5. Helper Function for RLS (Get current user's org)
create or replace function get_auth_org_id()
returns uuid
language sql stable
as $$
  select organization_id from profiles where id = auth.uid();
$$;

-- 6. RLS Policies

-- PROFILES: Users can see their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- ORGANIZATIONS: Users can view their own organization
create policy "Users can view own organization" on organizations
  for select using (id = get_auth_org_id());

create policy "Users can update own organization" on organizations
  for update using (id = get_auth_org_id());

-- CLIENTS: Users can view clients from their organization
create policy "Users can view org clients" on clients
  for select using (organization_id = get_auth_org_id());

create policy "Users can insert org clients" on clients
  for insert with check (organization_id = get_auth_org_id());

create policy "Users can update org clients" on clients
  for update using (organization_id = get_auth_org_id());

create policy "Users can delete org clients" on clients
  for delete using (organization_id = get_auth_org_id());

-- 7. Trigger to handle New User Sign Up (Automatic Profile Creation)
-- This assumes the frontend will assign organization_id later, or we create a null one first
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
