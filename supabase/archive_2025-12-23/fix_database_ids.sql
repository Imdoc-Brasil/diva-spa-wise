-- 1. Drop existing tables to reset schema
drop table if exists saas_tasks;
drop table if exists saas_leads;
-- organizations we keep or careful drop if needed. Let's drop to ensure schema match.
drop table if exists organizations;

-- 2. Re-create SaaS Leads with ID as TEXT (Universal compatibility)
create table saas_leads (
    id text primary key, -- Changed from UUID to TEXT to support 'temp_' IDs
    name text not null,
    clinic_name text,
    legal_name text,
    email text,
    phone text,
    stage text default 'New', 
    status text default 'New',
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
    zip_code text, -- Ensure snake_case matches DataContext mapping
    payment_method text, -- Ensure snake_case
    recurrence text,
    trial_start_date timestamp with time zone,
    legal_name_text text, -- Extra field if needed
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Re-create SaaS Tasks
create table saas_tasks (
    id text primary key, -- Changed to TEXT
    lead_id text references saas_leads(id) on delete cascade,
    title text not null,
    type text,
    due_date timestamp with time zone,
    is_completed boolean default false,
    created_at timestamp with time zone default now()
);

-- 4. Re-create Organizations
create table organizations (
    id text primary key,
    name text not null,
    slug text unique,
    subscription_status text default 'trial',
    saas_status text, 
    plan text,
    owner_id uuid,
    asaas_customer_id text,
    asaas_subscription_id text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 5. Restore Security Policies
alter table saas_leads enable row level security;
alter table saas_tasks enable row level security;
alter table organizations enable row level security;

create policy "Enable all access for all users" on saas_leads for all using (true) with check (true);
create policy "Enable all access for all users" on saas_tasks for all using (true) with check (true);
create policy "Enable all access for all users" on organizations for all using (true) with check (true);
