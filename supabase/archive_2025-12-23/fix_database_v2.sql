-- SAFE FIX V2: Only reset CRM tables, preserve core Organizations
-- 1. Drop only SaaS CRM tables (Use CASCADE to remove foreign keys from tasks)
drop table if exists saas_tasks cascade;
drop table if exists saas_leads cascade;

-- 2. Re-create SaaS Leads with ID as TEXT (Universal compatibility)
create table saas_leads (
    id text primary key, -- Changed to TEXT to accept 'temp_123'
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
    zip_code text, 
    payment_method text, 
    recurrence text,
    trial_start_date timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Re-create SaaS Tasks
create table saas_tasks (
    id text primary key, -- Text ID
    lead_id text references saas_leads(id) on delete cascade,
    title text not null,
    type text,
    due_date timestamp with time zone,
    is_completed boolean default false,
    created_at timestamp with time zone default now()
);

-- 4. Restore Security Policies
alter table saas_leads enable row level security;
alter table saas_tasks enable row level security;

create policy "Enable all access" on saas_leads for all using (true) with check (true);
create policy "Enable all access" on saas_tasks for all using (true) with check (true);
