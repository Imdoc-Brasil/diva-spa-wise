// Service to interact with the create-user Edge Function
import { supabase } from './supabase';
import type { UserRole } from '../types';

export interface CreateUserParams {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    organizationId: string;
    unitId?: string;
    phone?: string;
}

export interface CreateUserResponse {
    success: boolean;
    user?: {
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
        organizationId: string;
        unitId?: string;
    };
    error?: string;
    message?: string;
}

/**
 * Creates a new user in Supabase Auth and app_users table
 * This function calls the Supabase Edge Function to securely create users
 * 
 * @param params - User creation parameters
 * @returns Promise with the created user data or error
 */
export async function createUser(params: CreateUserParams): Promise<CreateUserResponse> {
    try {
        // Get the current session to include auth token
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return {
                success: false,
                error: 'You must be logged in to create users'
            };
        }

        // Get the Edge Function URL
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const functionUrl = `${supabaseUrl}/functions/v1/create-user`;

        // Call the Edge Function
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Failed to create user'
            };
        }

        return data;

    } catch (error) {
        console.error('Error calling create-user function:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Validates if the current user has permission to create users
 * Only owners and admins can create users
 * 
 * @param currentUserRole - The role of the current user
 * @returns boolean indicating if the user can create users
 */
export function canCreateUsers(currentUserRole: UserRole): boolean {
    return ['owner', 'admin'].includes(currentUserRole);
}
