-- Garante que a tabela existe
create table if not exists marketing_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  channel text check (channel in ('email', 'whatsapp')) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Adiciona colunas que podem estar faltando (se a tabela foi criada parcialmente)
alter table marketing_templates add column if not exists subject text;
alter table marketing_templates add column if not exists is_ai_powered boolean default false;
alter table marketing_templates add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Configurações de Segurança (Row Level Security)
alter table marketing_templates enable row level security;

-- Política de Acesso (Recria para garantir)
drop policy if exists "Allow all access to authenticated users" on marketing_templates;
create policy "Allow all access to authenticated users" on marketing_templates for all using (auth.role() = 'authenticated');

-- Repetir para Campanhas (Garantia extra)
create table if not exists marketing_campaigns (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  status text check (status in ('active', 'paused', 'draft')) default 'draft',
  trigger_type text not null,
  trigger_config jsonb default '{}'::jsonb,
  steps jsonb default '[]'::jsonb,
  stats jsonb default '{"enrolled": 0, "completed": 0, "converted": 0}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table marketing_campaigns enable row level security;
drop policy if exists "Allow all access to authenticated users" on marketing_campaigns;
create policy "Allow all access to authenticated users" on marketing_campaigns for all using (auth.role() = 'authenticated');
