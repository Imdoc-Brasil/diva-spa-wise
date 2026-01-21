// ============================================
// BUSINESS UNITS & MULTI-UNIT
// ============================================

export interface BusinessUnit {
    id: string;
    organizationId: string;
    name: string;
    location: string;
    address?: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    contact?: {
        phone: string;
        email: string;
        whatsapp?: string;
    };
    legal?: {
        cnpj: string;
        stateRegistration?: string;
        municipalRegistration?: string;
        cnaePrimary?: string;
        cnaeSecondary?: string;
        legalRepresentative?: {
            name: string;
            cpf: string;
            birthDate: string;
        };
    };
    managerName: string;
    managerId?: string;
    type?: 'own' | 'franchise' | 'partner';
    status: 'operational' | 'implementation' | 'inactive' | 'alert';
    settings?: {
        shareClients: boolean;
        allowTransfers: boolean;
        syncInventory: boolean;
        useGlobalPricing: boolean;
    };
    metrics?: {
        revenue: number;
        revenueMoM: number;
        activeClients: number;
        nps: number;
    };
    // Legacy fields
    revenue: number;
    revenueMoM: number;
    activeClients: number;
    nps: number;
    createdAt?: Date;
    activatedAt?: Date;
}
