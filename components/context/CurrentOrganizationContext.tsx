import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useOrganizationSlug } from '../../hooks/useOrganizationSlug';

export interface CurrentOrganization {
    id: string;
    name: string;
    slug: string;
    type: string;
    subscription_status: string;
    subscription_plan_id: string;
    trial_ends_at?: string;
}

interface CurrentOrganizationContextType {
    currentOrganization: CurrentOrganization | null;
    loading: boolean;
    error: string | null;
    isMultiTenant: boolean;
    setCurrentOrganization: (org: CurrentOrganization | null) => void;
}

const CurrentOrganizationContext = createContext<CurrentOrganizationContextType | undefined>(undefined);

export const CurrentOrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { organization, loading, error, isMultiTenant } = useOrganizationSlug();
    const [currentOrganization, setCurrentOrganization] = useState<CurrentOrganization | null>(null);

    useEffect(() => {
        if (organization) {
            setCurrentOrganization(organization as CurrentOrganization);
            console.log('🏢 [CurrentOrganizationContext] Organization set:', organization.name);
        } else {
            setCurrentOrganization(null);
            console.log('🏢 [CurrentOrganizationContext] No organization (master mode)');
        }
    }, [organization]);

    return (
        <CurrentOrganizationContext.Provider
            value={{
                currentOrganization,
                loading,
                error,
                isMultiTenant,
                setCurrentOrganization,
            }}
        >
            {children}
        </CurrentOrganizationContext.Provider>
    );
};

export const useCurrentOrganization = () => {
    const context = useContext(CurrentOrganizationContext);
    if (context === undefined) {
        throw new Error('useCurrentOrganization must be used within a CurrentOrganizationProvider');
    }
    return context;
};
