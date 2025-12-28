import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export interface Organization {
    id: string;
    name: string;
    slug: string;
    type: string;
    subscription_status: string;
    subscription_plan_id: string;
    trial_ends_at?: string;
    // Add other fields as needed
}

/**
 * Hook to detect and load organization from URL slug
 * 
 * SAFE VERSION: Does not depend on React Router context
 * Uses window.location directly to avoid context issues
 * 
 * URL format: https://www.imdoc.com.br/{slug}#/login
 * 
 * Example:
 * - URL: https://www.imdoc.com.br/teste-2412#/login
 * - Slug: teste-2412
 * - Loads organization with slug "teste-2412"
 */
export function useOrganizationSlug() {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(false); // Start as false to not block rendering
    const [error, setError] = useState<string | null>(null);
    const [slug, setSlug] = useState<string | null>(null);

    useEffect(() => {
        async function detectAndLoadOrganization() {
            try {
                // Extract slug from pathname using window.location (safe, no React Router dependency)
                // URL: https://www.imdoc.com.br/teste-2412#/login
                // pathname: /teste-2412
                const pathname = window.location.pathname;
                const detectedSlug = pathname.split('/').filter(Boolean)[0]; // Get first segment

                console.log('🔍 [OrganizationSlug] Pathname:', pathname);
                console.log('🔍 [OrganizationSlug] Detected slug:', detectedSlug);

                // If no slug, this is master/main app
                if (!detectedSlug || detectedSlug === '') {
                    console.log('ℹ️ [OrganizationSlug] No slug detected - master mode');
                    setSlug(null);
                    setOrganization(null);
                    setLoading(false);
                    setError(null);
                    return;
                }

                // Set slug immediately
                setSlug(detectedSlug);
                setLoading(true);
                setError(null);

                // Load organization from database
                console.log('📡 [OrganizationSlug] Loading organization:', detectedSlug);

                const { data, error: dbError } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('slug', detectedSlug)
                    .single();

                if (dbError) {
                    console.error('❌ [OrganizationSlug] Error loading organization:', dbError);
                    setError(`Organization not found: ${detectedSlug}`);
                    setOrganization(null);
                    setLoading(false);
                    return;
                }

                if (!data) {
                    console.warn('⚠️ [OrganizationSlug] Organization not found:', detectedSlug);
                    setError(`Organization not found: ${detectedSlug}`);
                    setOrganization(null);
                    setLoading(false);
                    return;
                }

                console.log('✅ [OrganizationSlug] Organization loaded:', data);
                setOrganization(data as Organization);
                setLoading(false);

            } catch (err: any) {
                console.error('❌ [OrganizationSlug] Exception:', err);
                setError(err.message || 'Failed to load organization');
                setOrganization(null);
                setLoading(false);
            }
        }

        detectAndLoadOrganization();
    }, []); // Run only once on mount

    return {
        organization,
        loading,
        error,
        slug,
        isMultiTenant: !!organization, // true if organization detected
    };
}
