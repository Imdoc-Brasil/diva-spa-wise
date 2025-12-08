import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Organization } from '../../types';
import { MOCK_ORGANIZATIONS } from '../../utils/subscriptionPlans';

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
    // Initialize User Organizations (Mock + LocalStorage Persistence)
    const [userOrganizations, setUserOrganizations] = useState<Organization[]>(() => {
        const stored = localStorage.getItem('userOrganizations');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse stored organizations", e);
                return MOCK_ORGANIZATIONS;
            }
        }
        return MOCK_ORGANIZATIONS;
    });

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Persist User Organizations whenever they change
    useEffect(() => {
        localStorage.setItem('userOrganizations', JSON.stringify(userOrganizations));
    }, [userOrganizations]);

    useEffect(() => {
        // Detect organization based on URL or Storage
        const detectOrganization = () => {
            // Helper to find in our state list
            const findOrgBySlug = (slug: string) => userOrganizations.find(o => o.slug === slug);
            const findOrgById = (id: string) => userOrganizations.find(o => o.id === id);

            // Method 1: Subdomain
            const hostname = window.location.hostname;
            const parts = hostname.split('.');

            if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'app') {
                const slug = parts[0];
                const org = findOrgBySlug(slug);
                if (org) {
                    setOrganization(org);
                    setIsLoading(false);
                    return;
                }
            }

            // Method 2: Path-based
            const pathParts = window.location.pathname.split('/').filter(p => p);
            if (pathParts.length > 0) {
                const slug = pathParts[0];
                const org = findOrgBySlug(slug);
                if (org) {
                    setOrganization(org);
                    setIsLoading(false);
                    return;
                }
            }

            // Method 3: LocalStorage
            const storedOrgId = localStorage.getItem('currentOrganizationId');
            if (storedOrgId) {
                const org = findOrgById(storedOrgId);
                if (org) {
                    setOrganization(org);
                    setIsLoading(false);
                    return;
                }
            }

            // Fallback: Use first available org
            const defaultOrg = userOrganizations[0];
            setOrganization(defaultOrg);
            if (defaultOrg) {
                localStorage.setItem('currentOrganizationId', defaultOrg.id);
            }
            setIsLoading(false);
        };

        detectOrganization();
    }, [userOrganizations]); // Re-run if list changes? careful with loops. Actually detecting is usually once.
    // If I add a new org, I probably explicitly switch to it, so I don't need to re-run detect.
    // But if I delete one, I might need to.

    // Actually, 'detectOrganization' should principally run on mount. 
    // If userOrganizations change, we don't necessarily want to switch unless current is invalid.
    // I'll keep it simple: run mainly on mount, but I need access to correct 'userOrganizations'.
    // Since 'userOrganizations' is state, I can access it in the effect. 'eslint' might complain about dep array.
    // I'll leave it in dependency array for correctness.

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
        // Auto-switch to new org
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
    if (!context) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
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
