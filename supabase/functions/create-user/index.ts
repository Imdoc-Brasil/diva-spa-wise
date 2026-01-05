// Supabase Edge Function: create-user
// This function creates a new user in Supabase Auth and the app_users table
// It should be called from the frontend when registering a new user

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateUserRequest {
    email: string
    password: string
    fullName: string
    role: 'owner' | 'admin' | 'staff' | 'professional'
    organizationId: string
    unitId?: string
    phone?: string
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get the authorization header to verify the request is authenticated
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing authorization header')
        }

        // Create Supabase client with service role key for admin operations
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Verify the requesting user is authenticated
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: authHeader }
                }
            }
        )

        const { data: { user: requestingUser }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !requestingUser) {
            throw new Error('Unauthorized: Invalid or missing authentication')
        }

        // Parse request body
        const requestBody: CreateUserRequest = await req.json()
        const { email, password, fullName, role, organizationId, unitId, phone } = requestBody

        // Validate required fields
        if (!email || !password || !fullName || !role || !organizationId) {
            throw new Error('Missing required fields: email, password, fullName, role, organizationId')
        }

        // Verify the requesting user has permission to create users in this organization
        const { data: requestingUserData, error: userCheckError } = await supabaseAdmin
            .from('app_users')
            .select('organization_id, role')
            .eq('id', requestingUser.id)
            .single()

        if (userCheckError || !requestingUserData) {
            throw new Error('Failed to verify requesting user permissions')
        }

        // Only owners and admins can create users
        if (!['owner', 'admin'].includes(requestingUserData.role)) {
            throw new Error('Unauthorized: Only owners and admins can create users')
        }

        // Verify the requesting user belongs to the same organization
        if (requestingUserData.organization_id !== organizationId) {
            throw new Error('Unauthorized: Cannot create users for a different organization')
        }

        // Create the user in Supabase Auth
        const { data: authData, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                full_name: fullName,
                organization_id: organizationId,
            }
        })

        if (createAuthError || !authData.user) {
            console.error('Error creating auth user:', createAuthError)
            throw new Error(`Failed to create user in Auth: ${createAuthError?.message || 'Unknown error'}`)
        }

        // Create the user in app_users table
        const { data: appUserData, error: createAppUserError } = await supabaseAdmin
            .from('app_users')
            .insert({
                id: authData.user.id,
                email,
                full_name: fullName,
                role,
                organization_id: organizationId,
                unit_id: unitId || null,
                phone: phone || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (createAppUserError) {
            console.error('Error creating app user:', createAppUserError)

            // Rollback: Delete the auth user if app_user creation failed
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id)

            throw new Error(`Failed to create user in database: ${createAppUserError.message}`)
        }

        // Return success response
        return new Response(
            JSON.stringify({
                success: true,
                user: {
                    id: appUserData.id,
                    email: appUserData.email,
                    fullName: appUserData.full_name,
                    role: appUserData.role,
                    organizationId: appUserData.organization_id,
                    unitId: appUserData.unit_id,
                },
                message: 'User created successfully'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 201,
            }
        )

    } catch (error) {
        console.error('Error in create-user function:', error)

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'An unexpected error occurred',
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
