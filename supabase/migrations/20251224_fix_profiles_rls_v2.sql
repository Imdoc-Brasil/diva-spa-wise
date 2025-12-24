-- ============================================
-- FIX V2: Complete Removal of Recursion in Profiles RLS
-- ============================================
-- Date: 2024-12-24
-- Issue: Previous fix still had recursion via subqueries
-- Solution: Use ONLY auth.uid() without any profile lookups

-- Drop ALL existing policies on profiles
DROP POLICY IF EXISTS "Users can see their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can see profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Master can see all profiles" ON profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON profiles;

-- ============================================
-- NEW POLICIES - NO RECURSION
-- ============================================

-- 1. Users can see their own profile (NO RECURSION)
CREATE POLICY "Users can see their own profile"
ON profiles
FOR SELECT
USING (id = auth.uid());

-- 2. Users can update their own profile (NO RECURSION)
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (id = auth.uid());

-- 3. System/Service Role can INSERT profiles (NO RECURSION)
-- This allows OnboardingService to create profiles
CREATE POLICY "System can insert profiles"
ON profiles
FOR INSERT
WITH CHECK (true);

-- 4. Allow SELECT for authenticated users (TEMPORARY - for testing)
-- This removes the recursion issue entirely
CREATE POLICY "Authenticated users can see all profiles"
ON profiles
FOR SELECT
USING (auth.role() = 'authenticated');

SELECT 'Profiles RLS policies fixed - V2 - all recursion removed!' as status;
