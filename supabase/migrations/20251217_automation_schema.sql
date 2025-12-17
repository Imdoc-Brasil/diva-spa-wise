
-- Tabela de Campanhas de Marketing (Automation Flows)
create table if not exists marketing_campaigns (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  status text check (status in ('active', 'paused', 'draft')) default 'draft',
  trigger_type text not null, -- 'LEAD_CREATED', 'TAG_ADDED', etc
  trigger_config jsonb default '{}'::jsonb, -- Configurações específicas do gatilho
  steps jsonb default '[]'::jsonb, -- Array com todas as ações (steps) do fluxo
  stats jsonb default '{"enrolled": 0, "completed": 0, "converted": 0}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Templates de Mensagem (Email/WhatsApp)
create table if not exists marketing_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  channel text check (channel in ('email', 'whatsapp')) not null,
  subject text, -- Apenas para email
  content text not null, -- O corpo da mensagem ou prompt
  is_ai_powered boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS) - Opcional mas recomendado
alter table marketing_campaigns enable row level security;
alter table marketing_templates enable row level security;

-- Política simples: permitir tudo para usuários autenticados (ajuste conforme necessário)
create policy "Allow all access to authenticated users" on marketing_campaigns for all using (auth.role() = 'authenticated');
create policy "Allow all access to authenticated users" on marketing_templates for all using (auth.role() = 'authenticated');
