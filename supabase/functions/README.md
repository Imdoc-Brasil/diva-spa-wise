# Supabase Edge Functions - Deployment Guide

## 📋 Overview

This directory contains Supabase Edge Functions for the I'mDoc SaaS application.

### Available Functions:

1. **create-user** - Securely creates users in Supabase Auth and app_users table

## 🚀 Deployment Instructions

### Prerequisites

1. Install Supabase CLI:
```bash
brew install supabase/tap/supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

You can find your project ref in the Supabase dashboard URL:
`https://app.supabase.com/project/YOUR_PROJECT_REF`

### Deploy Edge Functions

#### Deploy all functions:
```bash
supabase functions deploy
```

#### Deploy a specific function:
```bash
supabase functions deploy create-user
```

### Set Environment Variables

The Edge Functions need access to Supabase environment variables. These are automatically available:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)

These are set automatically by Supabase when you deploy the functions.

## 🧪 Testing Edge Functions

### Test locally:

1. Start Supabase locally:
```bash
supabase start
```

2. Serve the function locally:
```bash
supabase functions serve create-user
```

3. Test with curl:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/create-user' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"test@example.com","password":"password123","fullName":"Test User","role":"staff","organizationId":"org_test"}'
```

### Test in production:

Use the frontend service (`services/userService.ts`) or test with curl:

```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-user' \
  --header 'Authorization: Bearer YOUR_USER_ACCESS_TOKEN' \
  --header 'apikey: YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"newuser@example.com","password":"securepassword","fullName":"New User","role":"staff","organizationId":"org_xxx","unitId":"unit_xxx"}'
```

## 📝 Function Details

### create-user

**Purpose:** Creates a new user in both Supabase Auth and the app_users table.

**Authorization:** Requires authenticated user with `owner` or `admin` role.

**Request Body:**
```typescript
{
  email: string;          // User's email (required)
  password: string;       // User's password (required)
  fullName: string;       // User's full name (required)
  role: string;           // User role: 'owner' | 'admin' | 'staff' | 'professional' (required)
  organizationId: string; // Organization ID (required)
  unitId?: string;        // Unit ID (optional)
  phone?: string;         // Phone number (optional)
}
```

**Response (Success - 201):**
```typescript
{
  success: true;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    organizationId: string;
    unitId?: string;
  };
  message: string;
}
```

**Response (Error - 400):**
```typescript
{
  success: false;
  error: string;
}
```

**Security Features:**
- Validates requesting user is authenticated
- Verifies requesting user has `owner` or `admin` role
- Ensures requesting user belongs to the same organization
- Auto-confirms email for created users
- Implements rollback if app_user creation fails after auth user creation

## 🔒 Security Considerations

1. **Service Role Key**: The Edge Function uses the service role key to bypass RLS. This is necessary for creating users in auth.users table.

2. **Authorization Checks**: The function verifies:
   - User is authenticated
   - User has owner/admin role
   - User belongs to the target organization

3. **Rollback**: If app_user creation fails, the auth user is automatically deleted to maintain data consistency.

## 🐛 Troubleshooting

### Function not found (404)
- Ensure the function is deployed: `supabase functions list`
- Check the function URL is correct

### Unauthorized (401)
- Verify the Authorization header includes a valid access token
- Check the apikey header is set correctly

### Permission denied (403)
- Ensure the requesting user has owner or admin role
- Verify the user belongs to the organization

### Internal server error (500)
- Check function logs: `supabase functions logs create-user`
- Verify environment variables are set correctly

## 📚 Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
- [Deno Deploy Documentation](https://deno.com/deploy/docs)
