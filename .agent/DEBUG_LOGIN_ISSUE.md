# 🐛 Debug Guide: Blank Screen on Login

## Problem
When attempting to log in at `https://www.imdoc.com.br/teste-2412#/login` with `admin@imdoc.com.br` / `102030`, the screen goes blank.

## Potential Root Causes

### 1. **Login Function Failing Silently**
The `login` function in `DataContext.tsx` (line 1605) performs a subscription status check that might be failing:

```typescript
const login = async (role: UserRole, realUser?: User) => {
  if (realUser) {
    // SECURITY CHECK: Verify if organization is locked/suspended
    if (realUser.organizationId && realUser.organizationId !== 'org_demo' && supabase) {
      const { data: orgData, error } = await supabase
        .from('organizations')
        .select('subscription_status')
        .eq('id', realUser.organizationId)
        .single();

      if (orgData) {
        const status = (orgData as any).subscription_status;
        if (status === 'suspended' || status === 'cancelled' || status === 'delinquent') {
          addToast(`Acesso Bloqueado. Status da conta: ${status.toUpperCase()}`, 'error');
          return; // STOP LOGIN - THIS COULD CAUSE BLANK SCREEN
        }
      }
    }

    setCurrentUser(realUser);
    addToast(`Bem-vindo de volta!`, 'success');
  }
};
```

**Issue**: If the subscription status query fails or returns an unexpected value, the login might not complete.

### 2. **Profile Fetch Failing**
The `LoginPage.tsx` fetches the user profile from the `profiles` table (line 107-114):

```typescript
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', data.user.id)
  .single();
```

**Issue**: If the profile doesn't exist or the query fails, the user object might be incomplete.

### 3. **Organization ID Mismatch**
The `appUser` object is constructed with a fallback chain (line 130):

```typescript
organizationId: p?.organization_id || organization?.id || 'org_demo',
```

**Issue**: If all three values are undefined/null, this could cause issues downstream.

### 4. **Navigation After Login**
After `onLogin` is called, the app should navigate to the dashboard. If the routing logic fails, you might see a blank screen.

## 🔍 Diagnostic Steps

### Step 1: Check Browser Console
1. Open `https://www.imdoc.com.br/teste-2412#/login` in your browser
2. Open Developer Tools (F12 or Cmd+Option+I)
3. Go to the **Console** tab
4. Attempt to log in with `admin@imdoc.com.br` / `102030`
5. Look for:
   - ✅ `🔄 Attempting Supabase Login...`
   - ✅ `✅ Auth Success. User: [user-id]`
   - ✅ `🔄 Fetching Profile...`
   - ✅ `✅ Profile Result: [profile-data]`
   - ✅ `🚀 Final App User Object: [user-object]`
   - ✅ `👉 Calling onLogin()...`
   - ❌ Any errors or warnings

### Step 2: Check Network Tab
1. In Developer Tools, go to the **Network** tab
2. Attempt to log in
3. Look for:
   - `POST /auth/v1/token` - Should return 200 with access_token
   - `GET /rest/v1/profiles` - Should return 200 with profile data
   - `GET /rest/v1/organizations` - Should return 200 with organization data

### Step 3: Check Supabase Data
1. Go to Supabase Dashboard → Table Editor
2. Check the `profiles` table:
   - Does a record exist for `admin@imdoc.com.br`?
   - What is the `organization_id` value?
   - What is the `role` value?
3. Check the `organizations` table:
   - Does the organization with slug `teste-2412` exist?
   - What is its `subscription_status`?

### Step 4: Check Application State
1. In Developer Tools Console, after attempting login, run:
   ```javascript
   // Check if user is logged in
   localStorage.getItem('supabase.auth.token')
   
   // Check React state (if you have React DevTools)
   // Look for DataContext → currentUser
   ```

## 🛠️ Quick Fixes to Try

### Fix 1: Bypass Subscription Check (Temporary)
Edit `DataContext.tsx` line 1605-1631 to add more logging:

```typescript
const login = async (role: UserRole, realUser?: User) => {
  console.log('🔵 [LOGIN] Starting login process', { role, realUser });
  
  if (realUser) {
    // SECURITY CHECK: Verify if organization is locked/suspended
    if (realUser.organizationId && realUser.organizationId !== 'org_demo' && supabase) {
      console.log('🔵 [LOGIN] Checking subscription status for org:', realUser.organizationId);
      
      try {
        const { data: orgData, error } = await supabase
          .from('organizations')
          .select('subscription_status')
          .eq('id', realUser.organizationId)
          .single();

        console.log('🔵 [LOGIN] Subscription check result:', { orgData, error });

        if (error) {
          console.warn('⚠️ [LOGIN] Subscription check failed, continuing anyway:', error);
          // Don't block login if check fails
        } else if (orgData) {
          const status = (orgData as any).subscription_status;
          if (status === 'suspended' || status === 'cancelled' || status === 'delinquent') {
            addToast(`Acesso Bloqueado. Status da conta: ${status.toUpperCase()}`, 'error');
            console.error('❌ [LOGIN] Login blocked due to subscription status:', status);
            return; // STOP LOGIN
          }
        }
      } catch (err) {
        console.error('❌ [LOGIN] Exception during subscription check:', err);
        // Don't block login on exception
      }
    }

    console.log('🔵 [LOGIN] Setting current user:', realUser);
    setCurrentUser(realUser);
    addToast(`Bem-vindo de volta!`, 'success');
    console.log('✅ [LOGIN] Login complete');
  } else {
    const newUser = createUser(role);
    console.log('🔵 [LOGIN] Creating demo user:', newUser);
    setCurrentUser(newUser);
    addToast(`Bem-vindo(a), ${newUser.displayName}!`, 'success');
  }
};
```

### Fix 2: Ensure Profile Exists
Check if the user `admin@imdoc.com.br` has a profile in the `profiles` table. If not, create one:

```sql
-- Run in Supabase SQL Editor
INSERT INTO profiles (id, email, full_name, role, organization_id)
SELECT 
  id,
  email,
  'Admin User',
  'owner',
  (SELECT id FROM organizations WHERE slug = 'teste-2412' LIMIT 1)
FROM auth.users
WHERE email = 'admin@imdoc.com.br'
ON CONFLICT (id) DO UPDATE
SET 
  organization_id = EXCLUDED.organization_id,
  role = EXCLUDED.role;
```

### Fix 3: Check Organization Subscription Status
Ensure the organization has a valid subscription status:

```sql
-- Run in Supabase SQL Editor
UPDATE organizations
SET subscription_status = 'active'
WHERE slug = 'teste-2412';
```

## 📋 What to Report Back

After trying the diagnostic steps, please provide:

1. **Console output** - Copy all console logs from the login attempt
2. **Network errors** - Any failed requests in the Network tab
3. **Profile data** - The profile record for `admin@imdoc.com.br`
4. **Organization data** - The organization record for `teste-2412`
5. **Any error messages** - Screenshots of any errors

## 🎯 Next Steps

Once we identify the root cause, we can:
1. Fix the underlying data issue (missing profile, wrong org ID, etc.)
2. Add better error handling to prevent blank screens
3. Add user-friendly error messages
4. Proceed with testing the user creation flow
