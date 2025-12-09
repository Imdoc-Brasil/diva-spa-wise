-- Add SaaS fields to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS saas_plan text DEFAULT 'start',
ADD COLUMN IF NOT EXISTS saas_status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS mrr numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);

-- Create a view or function to fetch subscribers data with owner info
-- Since profiles doesn't have email/phone, we might need to rely on what we have or grab from auth keys if possible (unlikely directly).
-- For now, let's fetch from profiles where role='owner' for that org.

CREATE OR REPLACE FUNCTION get_saas_subscribers()
RETURNS TABLE (
  org_id uuid,
  clinic_name text,
  saas_plan text,
  saas_status text,
  mrr numeric,
  joined_at timestamptz,
  owner_name text,
  users_count bigint
) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    o.saas_plan,
    o.saas_status,
    o.mrr,
    o.created_at,
    (SELECT full_name FROM profiles WHERE organization_id = o.id AND role = 'owner' LIMIT 1),
    (SELECT count(*) FROM profiles WHERE organization_id = o.id)
  FROM organizations o
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql;
