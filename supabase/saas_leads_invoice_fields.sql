-- Add invoice fields to saas_leads
ALTER TABLE saas_leads 
ADD COLUMN IF NOT EXISTS cnpj text,
ADD COLUMN IF NOT EXISTS address text;
