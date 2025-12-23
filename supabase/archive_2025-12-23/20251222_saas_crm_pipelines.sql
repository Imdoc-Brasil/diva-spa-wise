
-- SaaS CRM Pipelines Schema

-- 1. Implementation Projects
create table if not exists saas_implementation_projects (
    id text primary key,
    subscriber_id text,
    clinic_name text,
    stage text,
    start_date timestamp with time zone,
    deadline_date timestamp with time zone,
    modules_checked jsonb default '[]'::jsonb,
    status text,
    notes text,
    tasks jsonb default '[]'::jsonb,
    created_at timestamp with time zone default now()
);

alter table saas_implementation_projects enable row level security;
create policy "Enable all access" on saas_implementation_projects for all using (true);


-- 2. Support Tickets
create table if not exists saas_support_tickets (
    id text primary key,
    ticket_number text,
    subscriber_id text,
    clinic_name text,
    title text,
    description text,
    category text,
    priority text,
    status text,
    ai_summary text,
    messages jsonb default '[]'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table saas_support_tickets enable row level security;
create policy "Enable all access" on saas_support_tickets for all using (true);


-- 3. Feature Requests
create table if not exists saas_feature_requests (
    id text primary key,
    subscriber_id text,
    clinic_name text,
    module text,
    title text,
    description text,
    impact text,
    status text,
    votes integer default 0,
    created_at timestamp with time zone default now()
);

alter table saas_feature_requests enable row level security;
create policy "Enable all access" on saas_feature_requests for all using (true);
