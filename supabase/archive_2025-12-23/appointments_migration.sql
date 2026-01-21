-- ==============================================================================
-- PART 3: APPOINTMENTS MODULE (Real Scheduling)
-- ==============================================================================

-- 1. Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  client_id uuid REFERENCES clients(id), -- Optional constraint to force valid clients
  client_name text NOT NULL, -- Denormalized for easier display/search
  staff_id uuid, -- Link to profiles potentially, or just a string if external
  staff_name text,
  room_id text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'Scheduled', -- 'Confirmed', 'Scheduled', 'Completed', etc.
  service_id text,
  service_name text,
  price numeric(10, 2) DEFAULT 0,
  unit_id text, -- For multi-unit support
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can view appointments from their organization
DROP POLICY IF EXISTS "Users can view org appointments" ON appointments;
CREATE POLICY "Users can view org appointments" ON appointments
  FOR SELECT USING (organization_id = get_auth_org_id());

-- Users can insert appointments for their organization
DROP POLICY IF EXISTS "Users can insert org appointments" ON appointments;
CREATE POLICY "Users can insert org appointments" ON appointments
  FOR INSERT WITH CHECK (organization_id = get_auth_org_id());

-- Users can update appointments for their organization
DROP POLICY IF EXISTS "Users can update org appointments" ON appointments;
CREATE POLICY "Users can update org appointments" ON appointments
  FOR UPDATE USING (organization_id = get_auth_org_id());

-- Users can delete appointments for their organization
DROP POLICY IF EXISTS "Users can delete org appointments" ON appointments;
CREATE POLICY "Users can delete org appointments" ON appointments
  FOR DELETE USING (organization_id = get_auth_org_id());

-- Confirmação
SELECT 'Tabela de Agendamentos Criada com Sucesso' as status;
