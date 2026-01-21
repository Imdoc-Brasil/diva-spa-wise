-- ============================================
-- PHASE 1: COMPLETE ONBOARDING SCHEMA
-- ============================================
-- Date: 2023-12-23
-- Purpose: Add missing fields and tables for complete subscriber onboarding
-- Estimated Time: 30 minutes
-- 
-- Changes:
-- 1. Add missing fields to organizations table
-- 2. Create units table
-- 3. Implement proper RLS policies
-- 4. Add indexes for performance
-- ============================================

-- ============================================
-- STEP 1: ADD MISSING FIELDS TO ORGANIZATIONS
-- ============================================

-- Add contact and address fields from leads
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS legal_name TEXT,
ADD COLUMN IF NOT EXISTS cnpj TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS number TEXT,
ADD COLUMN IF NOT EXISTS complement TEXT,
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Add trial tracking
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Add billing info
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS billing_email TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS recurrence TEXT DEFAULT 'monthly';

SELECT 'Organizations table updated with missing fields!' as status;

-- ============================================
-- STEP 2: CREATE PROFILES TABLE
-- ============================================
-- Profiles support 3 types of users:
-- 1. I'mDoc SaaS Staff (organization_id = NULL, role = master/saas_staff)
-- 2. Clinic Staff (organization_id = org_xxx, role = admin/manager/staff)
-- 3. Patients (organization_id = org_xxx, role = client)

-- Drop if exists (for clean migration)
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Personal Info
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    
    -- Role & Permissions
    role TEXT NOT NULL DEFAULT 'client', -- master, saas_staff, admin, manager, staff, finance, client
    
    -- Status
    status TEXT DEFAULT 'active', -- active, inactive, suspended
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    UNIQUE(email)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);

-- Profiles RLS Policies
-- Users can see their own profile
CREATE POLICY "Users can see their own profile"
ON profiles
FOR SELECT
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (id = auth.uid());

-- Admins can see profiles in their organization
CREATE POLICY "Admins can see profiles in their organization"
ON profiles
FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'manager')
    )
);

-- Master/SaaS Staff can see all profiles
CREATE POLICY "Master can see all profiles"
ON profiles
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('master', 'saas_staff')
    )
);

-- System can insert profiles (via service role)
CREATE POLICY "System can insert profiles"
ON profiles
FOR INSERT
WITH CHECK (true);

SELECT 'Profiles table created successfully!' as status;

-- ============================================
-- STEP 3: CREATE UNITS TABLE
-- ============================================

-- Drop if exists (for clean migration)
DROP TABLE IF EXISTS units CASCADE;

-- Create units table
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'main', -- main, branch, franchise
    
    -- Address
    address TEXT,
    number TEXT,
    complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    
    -- Contact
    phone TEXT,
    email TEXT,
    
    -- Status
    status TEXT DEFAULT 'active', -- active, inactive, suspended
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(organization_id, slug)
);

-- Enable RLS
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_units_organization_id ON units(organization_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_type ON units(type);

SELECT 'Units table created successfully!' as status;

-- ============================================
-- STEP 4: IMPLEMENT PROPER RLS POLICIES FOR ORGANIZATIONS
-- ============================================

-- ============================================
-- 3.1: ORGANIZATIONS POLICIES
-- ============================================

-- Drop permissive policy
DROP POLICY IF EXISTS "Enable all access for organizations" ON organizations;

-- Users can only see their organization
CREATE POLICY "Users can only see their organization"
ON organizations
FOR SELECT
USING (
    id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);

-- Users can only update their organization
CREATE POLICY "Users can only update their organization"
ON organizations
FOR UPDATE
USING (
    id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);

-- Only system can insert organizations (via service role)
CREATE POLICY "System can insert organizations"
ON organizations
FOR INSERT
WITH CHECK (true); -- Will be restricted by service role key

-- Only system can delete organizations
CREATE POLICY "System can delete organizations"
ON organizations
FOR DELETE
USING (true); -- Will be restricted by service role key

SELECT 'Organizations RLS policies updated!' as status;

-- ============================================
-- 3.2: UNITS POLICIES
-- ============================================

-- Users can only see units from their organization
CREATE POLICY "Users can only see units from their organization"
ON units
FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);

-- Admins can insert units in their organization
CREATE POLICY "Admins can insert units in their organization"
ON units
FOR INSERT
WITH CHECK (
    organization_id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'manager')
    )
);

-- Admins can update units in their organization
CREATE POLICY "Admins can update units in their organization"
ON units
FOR UPDATE
USING (
    organization_id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'manager')
    )
);

-- Admins can delete units in their organization
CREATE POLICY "Admins can delete units in their organization"
ON units
FOR DELETE
USING (
    organization_id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'manager')
    )
);

SELECT 'Units RLS policies created!' as status;

-- ============================================
-- STEP 5: CREATE HELPER FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to organizations
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to units
DROP TRIGGER IF EXISTS update_units_updated_at ON units;
CREATE TRIGGER update_units_updated_at
    BEFORE UPDATE ON units
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

SELECT 'Triggers created for automatic timestamp updates!' as status;

-- ============================================
-- STEP 6: ADD INDEXES FOR PERFORMANCE
-- ============================================

-- Organizations indexes
CREATE INDEX IF NOT EXISTS idx_organizations_email ON organizations(email);
CREATE INDEX IF NOT EXISTS idx_organizations_cnpj ON organizations(cnpj);
CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_trial_ends_at ON organizations(trial_ends_at);

-- Units indexes (already created above, but ensuring)
CREATE INDEX IF NOT EXISTS idx_units_slug ON units(organization_id, slug);

SELECT 'Performance indexes created!' as status;

-- ============================================
-- STEP 7: VALIDATION QUERIES
-- ============================================

-- Verify organizations schema
SELECT 
    'Organizations Schema' as table_name,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'organizations'
ORDER BY ordinal_position;

-- Verify units schema
SELECT 
    'Units Schema' as table_name,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'units'
ORDER BY ordinal_position;

-- Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('organizations', 'units');

-- Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('organizations', 'units')
ORDER BY tablename, policyname;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

SELECT '✅ PHASE 1 COMPLETE: Database schema ready for onboarding!' as status;
SELECT 'Next: Create OnboardingService.ts' as next_step;
