-- Add legal_name field to saas_leads
ALTER TABLE saas_leads 
ADD COLUMN IF NOT EXISTS legal_name text;
