-- Add payment and subscription fields to saas_leads
ALTER TABLE saas_leads 
ADD COLUMN IF NOT EXISTS payment_method text, -- 'boleto', 'pix', 'credit_card'
ADD COLUMN IF NOT EXISTS recurrence text, -- 'monthly', 'annual'
ADD COLUMN IF NOT EXISTS trial_start_date timestamp with time zone;
