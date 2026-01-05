-- ============================================
-- EMERGENCY FIX: Disable RLS on profiles temporarily
-- ============================================
-- This will allow testing while we fix the policies properly

-- Disable RLS on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

SELECT 'RLS disabled on profiles - testing mode!' as status;

-- NOTE: This is TEMPORARY for testing only
-- We will re-enable RLS with proper policies later
