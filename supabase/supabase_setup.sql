-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. SaaS Leads Table
create table if not exists saas_leads (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    clinic_name text,
    legal_name text,
    email text,
    phone text,
    stage text default 'New', 
    status text default 'New', -- Used by DataContext mapping
    plan_interest text,
    source text,
    notes text,
    estimated_value numeric,
    cnpj text,
    address text,
    number text,
    complement text,
    neighborhood text,
    city text,
    state text,
    zip_code text,
    payment_method text,
    recurrence text,
    trial_start_date timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. SaaS Tasks Table
create table if not exists saas_tasks (
    id uuid primary key default uuid_generate_v4(),
    lead_id uuid references saas_leads(id) on delete cascade,
    title text not null,
    type text,
    due_date timestamp with time zone,
    is_completed boolean default false,
    created_at timestamp with time zone default now()
);

-- 3. Organizations Table (Subscribers)
-- This table might already exist in some Supabase templates, check carefully.
create table if not exists organizations (
    id text primary key, -- e.g., 'org_xyz'
    name text not null,
    slug text unique,
    subscription_status text default 'trial',
    saas_status text, 
    plan text,
    owner_id uuid, -- Link to auth.users if possible
    asaas_customer_id text,
    asaas_subscription_id text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 4. Enable Row Level Security (RLS)
alter table saas_leads enable row level security;
alter table saas_tasks enable row level security;
alter table organizations enable row level security;

-- 5. Helper Policies (Development / Public Access)
-- WARNING: These policies are permissive for development. Restrict in production.

-- Leads Policies
create policy "Enable read access for all users" on saas_leads for select using (true);
create policy "Enable insert access for all users" on saas_leads for insert with check (true);
create policy "Enable update access for all users" on saas_leads for update using (true);
create policy "Enable delete access for all users" on saas_leads for delete using (true);

-- Tasks Policies
create policy "Enable read access for all users" on saas_tasks for select using (true);
create policy "Enable insert access for all users" on saas_tasks for insert with check (true);
create policy "Enable update access for all users" on saas_tasks for update using (true);
create policy "Enable delete access for all users" on saas_tasks for delete using (true);

-- Organizations Policies
create policy "Enable read access for all users" on organizations for select using (true);
create policy "Enable insert access for all users" on organizations for insert with check (true);
create policy "Enable update access for all users" on organizations for update using (true);
