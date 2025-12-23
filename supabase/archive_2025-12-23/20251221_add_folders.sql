-- Add folder support for organization
alter table marketing_campaigns add column if not exists folder text default 'Geral';

-- Add folder to templates too for consistency
alter table marketing_templates add column if not exists folder text default 'Geral';
