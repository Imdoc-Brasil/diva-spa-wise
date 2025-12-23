-- SaaS Plans Schema and Seed Data

create table if not exists saas_plans (
    id uuid primary key default uuid_generate_v4(),
    key text unique not null,
    name text not null,
    description text,
    monthly_price numeric,
    yearly_price numeric,
    features jsonb,
    active boolean default true,
    created_at timestamp with time zone default now()
);

alter table saas_plans enable row level security;
create policy "Enable public read" on saas_plans for select using (true);

-- Seed Data
insert into saas_plans (key, name, description, monthly_price, yearly_price) values
('start', 'Start', 'Gestão essencial para consultórios.', 97, 970),
('growth', 'Growth', 'Para clínicas em crescimento.', 297, 2970),
('experts', 'Experts', 'Gestão avançada e completa.', 497, 4970),
('empire', 'Empire', 'Para redes e franquias.', 0, 0)
on conflict (key) do nothing;
