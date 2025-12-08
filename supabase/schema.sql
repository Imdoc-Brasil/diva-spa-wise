-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Create Connect/Contacts Table (SaaS Leads)
create table if not exists saas_leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  phone text,
  clinic_name text,
  plan_interest text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Config Storage (CMS)
create table if not exists app_configs (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS (Security)
alter table saas_leads enable row level security;
alter table app_configs enable row level security;

-- 5. Policies
-- Allow anyone (public) to insert leads (Landing Page form)
create policy "Public Insert Leads" on saas_leads for insert with check (true);

-- Allow admins to view leads (We will refine this later with Auth)
create policy "Public Read Leads for Dev" on saas_leads for select using (true);

-- Allow public to read configs (Landing Page needs to read content)
create policy "Public Read Configs" on app_configs for select using (true);

-- Allow public update configs (For the CMS during Dev mode)
-- WARNING: In production, lock this down to authenticated admins only
create policy "Public Update Configs" on app_configs for update using (true);
create policy "Public Insert Configs" on app_configs for insert with check (true);


-- 6. Seed Initial Data (SaaS Landing Page Defaults)
insert into app_configs (key, value)
values ('saas_landing_config', '{
    "heroTitle": "Não é apenas gestão. É o Futuro da Sua Clínica.",
    "heroSubtitle": "Abandone planilhas e softwares do passado. O I''mdoc usa Inteligência Artificial para lotar sua agenda, fidelizar pacientes e automatizar seu financeiro enquanto você dorme.",
    "heroImage": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    "primaryColor": "#9333ea",
    "showCalculator": true,
    "showFeatures": true,
    "showComparison": true,
    "showPricing": true,
    "contactPhone": "(11) 99999-9999"
}')
on conflict (key) do nothing;
