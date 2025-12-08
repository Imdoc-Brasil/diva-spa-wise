import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Organization } from '../../types';
import { MOCK_ORGANIZATIONS } from '../../utils/subscriptionPlans';
import { supabase } from '../../services/supabase';

interface OrganizationContextType {
    organization: Organization | null;
    setOrganization: (org: Organization | null) => void;
    switchOrganization: (orgId: string) => void;
    createOrganization: (org: Organization) => void;
    userOrganizations: Organization[];
    isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
    children: ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
    // Initialize User Organizations (LocalStorage + Supabase Sync)
    const [userOrganizations, setUserOrganizations] = useState<Organization[]>(() => {
        const stored = localStorage.getItem('userOrganizations');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) { return MOCK_ORGANIZATIONS; }
        }
        return MOCK_ORGANIZATIONS;
    });

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Sync with Supabase on Auth Change
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const user = session.user;
                // Fetch Profile to get Org ID
                const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
                const p = profile as any;

                if (p?.organization_id) {
                    const { data: orgs } = await supabase.from('organizations').select('*').eq('id', p.organization_id);
                    const os = orgs as any[];

                    if (os && os.length > 0) {
                        // Map Supabase Org to App Type
                        const realOrgs: Organization[] = os.map(o => ({
                            id: o.id,
                            name: o.name,
                            slug: o.slug,
                            displayName: o.name,
                            type: 'clinic',
                            subscriptionPlanId: 'professional',
                            subscriptionPlan: { id: 'professional', name: 'Professional', tier: 'professional', pricing: { monthly: 597, yearly: 5970, currency: 'BRL' }, limits: { maxUnits: 3, maxUsers: 20, maxClients: 2000, maxStorage: 50 }, features: ['all'] },
                            subscriptionStatus: 'active',
                            billingCycle: 'monthly',
                            limits: { maxUnits: 3, maxUsers: 20, maxClients: 2000, maxStorage: 50, features: ['all'] },
                            usage: { units: 1, users: 1, clients: 0, storage: 0 },
                            owner: { userId: user.id, name: user.email || 'Admin', email: user.email || '', phone: '' },
                            billing: { email: user.email || '' },
                            settings: { timezone: 'America/Sao_Paulo', language: 'pt-BR', currency: 'BRL', dateFormat: 'DD/MM/YYYY', allowMultiUnit: false, shareClientsAcrossUnits: true, requireTwoFactor: false },
                            createdAt: o.created_at
                        }));

                        console.log('☁️ Organizations loaded from Supabase:', realOrgs);
                        setUserOrganizations(prev => {
                            const newOrgs = realOrgs.filter(ro => !prev.some(po => po.id === ro.id));
                            return [...prev, ...newOrgs];
                        });

                        setOrganization(prev => prev || realOrgs[0]);
                    }
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 2. Persist User Organizations
    useEffect(() => {
        localStorage.setItem('userOrganizations', JSON.stringify(userOrganizations));
    }, [userOrganizations]);

    // 3. Detect Organization
    useEffect(() => {
        const detectOrganization = () => {
            const findOrgBySlug = (slug: string) => userOrganizations.find(o => o.slug === slug);
            const findOrgById = (id: string) => userOrganizations.find(o => o.id === id);

            // Method 1: Subdomain
            const hostname = window.location.hostname;
            const parts = hostname.split('.');
            if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'app') {
                const org = findOrgBySlug(parts[0]);
                if (org) { setOrganization(org); setIsLoading(false); return; }
            }

            // Method 3: LocalStorage
            const storedOrgId = localStorage.getItem('currentOrganizationId');
            if (storedOrgId) {
                const org = findOrgById(storedOrgId);
                if (org) { setOrganization(org); setIsLoading(false); return; }
            }

            // Fallback
            const defaultOrg = userOrganizations[0];
            setOrganization(defaultOrg);
            setIsLoading(false);
        };

        detectOrganization();
    }, [userOrganizations]);

    const switchOrganization = (orgId: string) => {
        const org = userOrganizations.find(o => o.id === orgId);
        if (org) {
            setOrganization(org);
            localStorage.setItem('currentOrganizationId', orgId);
            window.location.reload();
        }
    };

    const createOrganization = (newOrg: Organization) => {
        setUserOrganizations(prev => [...prev, newOrg]);
        setOrganization(newOrg);
        localStorage.setItem('currentOrganizationId', newOrg.id);
        window.location.reload();
    };

    return (
        <OrganizationContext.Provider
            value={{
                organization,
                setOrganization,
                switchOrganization,
                createOrganization,
                userOrganizations,
                isLoading
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
};

export const useOrganization = (): OrganizationContextType => {
    const context = useContext(OrganizationContext);
    if (!context) throw new Error('useOrganization must be used within an OrganizationProvider');
    return context;
};

// Hook to check feature
export const useHasFeature = (feature: string): boolean => {
    const { organization } = useOrganization();
    if (!organization) return false;

    // Check if feature is in limits features array
    if (organization.limits.features.includes(feature)) return true;

    // Check feature flags
    if (organization.features && (organization.features as any)[feature]) return true;

    return false;
};
