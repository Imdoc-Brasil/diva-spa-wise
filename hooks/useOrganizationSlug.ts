import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
 * URL format: https://www.imdoc.com.br/{slug}#/login
 * 
 * Example:
 * - URL: https://www.imdoc.com.br/teste-2412#/login
 * - Slug: teste-2412
 * - Loads organization with slug "teste-2412"
 */
export function useOrganizationSlug() {
    const location = useLocation();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function detectAndLoadOrganization() {
            try {
                setLoading(true);
                setError(null);

                // Extract slug from pathname
                // URL: https://www.imdoc.com.br/teste-2412#/login
                // pathname: /teste-2412
                const pathname = window.location.pathname;
                const slug = pathname.split('/').filter(Boolean)[0]; // Get first segment

                console.log('🔍 [OrganizationSlug] Pathname:', pathname);
                console.log('🔍 [OrganizationSlug] Detected slug:', slug);

                // If no slug, this is master/main app
                if (!slug || slug === '') {
                    console.log('ℹ️ [OrganizationSlug] No slug detected - master mode');
                    setOrganization(null);
                    setLoading(false);
                    return;
                }

                // Load organization from database
                console.log('📡 [OrganizationSlug] Loading organization:', slug);

                const { data, error: dbError } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (dbError) {
                    console.error('❌ [OrganizationSlug] Error loading organization:', dbError);
                    setError(`Organization not found: ${slug}`);
                    setOrganization(null);
                    setLoading(false);
                    return;
                }

                if (!data) {
                    console.warn('⚠️ [OrganizationSlug] Organization not found:', slug);
                    setError(`Organization not found: ${slug}`);
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
    }, [location.pathname]);

    return {
        organization,
        loading,
        error,
        slug: organization?.slug || null,
        isMultiTenant: !!organization, // true if organization detected
    };
}
