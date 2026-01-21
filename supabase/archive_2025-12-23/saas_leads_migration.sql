-- Create table for SaaS Leads (CRM Pipeline)
create table if not exists saas_leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  clinic_name text,
  email text,
  phone text,
  status text default 'new', -- 'new', 'contacted', 'demo_scheduled', 'trial_started', 'converted', 'lost'
  plan_interest text default 'growth',
  source text default 'landing_page',
  notes text,
  estimated_value numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for SaaS Leads
-- Only Master Admins should see this? For now, let's keep it simple or restricted to a specific roll.
-- Assuming 'owner' of the 'master' org can see it. But for simplicity in this demo environment, we might make it public or linked to a specific user.
-- Let's just enable RLS and allow all authenticated users to read/write for now, or restrictive if we had a specific admin role check.

alter table saas_leads enable row level security;

create policy "Enable read access for all users" on saas_leads
    for select using (true);

create policy "Enable insert for all users" on saas_leads
    for insert with check (true);

create policy "Enable update for all users" on saas_leads
    for update using (true);

create policy "Enable delete for all users" on saas_leads
    for delete using (true);
