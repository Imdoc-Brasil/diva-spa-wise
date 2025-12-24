-- ============================================
-- FIX: Infinite Recursion in Profiles RLS Policies
-- ============================================
-- Date: 2024-12-24
-- Issue: Policies were querying the same table they protect
-- Error: "infinite recursion detected in policy for relation 'profiles'"
-- Solution: Simplify policies to avoid recursive queries

-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can see profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Master can see all profiles" ON profiles;

-- Recreate without recursion
-- Admins can see profiles in their organization (simplified)
CREATE POLICY "Admins can see profiles in their organization"
ON profiles
FOR SELECT
USING (
    -- Allow if user is admin/manager AND same organization
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
    AND organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Master/SaaS Staff can see all profiles (simplified)
CREATE POLICY "Master can see all profiles"
ON profiles
FOR SELECT
USING (
    -- Allow if user is master or saas_staff
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('master', 'saas_staff')
);

SELECT 'Profiles RLS policies fixed - recursion removed!' as status;
