#!/bin/bash

# Quick diagnostic script to check Supabase data for login issue

echo "🔍 Checking Supabase data for login issue..."
echo ""
echo "Please run these queries in your Supabase SQL Editor:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Check if user exists in auth.users"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat << 'EOF'
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'admin@imdoc.com.br';
EOF
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Check if profile exists"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat << 'EOF'
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.organization_id,
  o.name as org_name,
  o.slug as org_slug
FROM profiles p
LEFT JOIN organizations o ON p.organization_id = o.id
WHERE p.email = 'admin@imdoc.com.br';
EOF
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Check organization details"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat << 'EOF'
SELECT 
  id,
  name,
  slug,
  subscription_status,
  subscription_plan,
  created_at
FROM organizations
WHERE slug = 'teste-2412';
EOF
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Check app_users table"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat << 'EOF'
SELECT 
  id,
  email,
  full_name,
  role,
  organization_id,
  unit_id,
  created_at
FROM app_users
WHERE email = 'admin@imdoc.com.br';
EOF
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  If profile is missing, create it:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat << 'EOF'
-- First, get the user ID and org ID
WITH user_info AS (
  SELECT id FROM auth.users WHERE email = 'admin@imdoc.com.br'
),
org_info AS (
  SELECT id FROM organizations WHERE slug = 'teste-2412'
)
INSERT INTO profiles (id, email, full_name, role, organization_id)
SELECT 
  u.id,
  'admin@imdoc.com.br',
  'Admin User',
  'owner',
  o.id
FROM user_info u, org_info o
ON CONFLICT (id) DO UPDATE
SET 
  organization_id = EXCLUDED.organization_id,
  role = EXCLUDED.role,
  email = EXCLUDED.email;
EOF
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  Ensure organization has active subscription:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat << 'EOF'
UPDATE organizations
SET 
  subscription_status = 'active',
  subscription_plan = 'professional'
WHERE slug = 'teste-2412';
EOF
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "After running these queries, try logging in again and check the browser console for detailed logs."
echo ""
