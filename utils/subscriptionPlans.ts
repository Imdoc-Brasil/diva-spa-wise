import { SubscriptionPlan, Organization, SubscriptionStatus, OrganizationType } from '../types';

// ============================================
// PLANOS DE ASSINATURA
// ============================================

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'starter',
        name: 'Starter',
        tier: 'starter',
        description: 'Ideal para médicos e profissionais individuais',
        pricing: {
            monthly: 297, // R$ 297/mês
            yearly: 2970, // R$ 247,50/mês (17% desconto)
            currency: 'BRL'
        },
        limits: {
            maxUnits: 1,
            maxUsers: 5,
            maxClients: 500,
            maxStorage: 10, // GB
            maxAppointmentsPerMonth: 200
        },
        features: [
            'Agenda e Agendamentos',
            'CRM de Clientes',
            'Prontuário Eletrônico',
            'Controle Financeiro Básico',
            'Relatórios Básicos',
            'Suporte por Email',
            '1 Unidade',
            'Até 5 Usuários',
            'Até 500 Clientes',
            '10GB de Armazenamento'
        ]
    },
    {
        id: 'professional',
        name: 'Professional',
        tier: 'professional',
        description: 'Perfeito para clínicas e consultórios com múltiplos profissionais',
        pricing: {
            monthly: 597, // R$ 597/mês
            yearly: 5970, // R$ 497,50/mês (17% desconto)
            currency: 'BRL'
        },
        limits: {
            maxUnits: 3,
            maxUsers: 20,
            maxClients: 2000,
            maxStorage: 50, // GB
            maxAppointmentsPerMonth: 1000
        },
        features: [
            'Tudo do Starter +',
            'Até 3 Unidades',
            'Até 20 Usuários',
            'Até 2.000 Clientes',
            '50GB de Armazenamento',
            'Marketing e Campanhas',
            'Automações Avançadas',
            'Relatórios Avançados',
            'Integração WhatsApp',
            'Portal do Paciente',
            'Suporte Prioritário',
            'Treinamento Online'
        ],
        popular: true
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        tier: 'enterprise',
        description: 'Para grupos, franquias e redes com múltiplas unidades',
        pricing: {
            monthly: 1497, // R$ 1.497/mês
            yearly: 14970, // R$ 1.247,50/mês (17% desconto)
            currency: 'BRL'
        },
        limits: {
            maxUnits: 999, // Ilimitado
            maxUsers: 999, // Ilimitado
            maxClients: 999999, // Ilimitado
            maxStorage: 500, // GB
            maxAppointmentsPerMonth: 999999
        },
        features: [
            'Tudo do Professional +',
            'Unidades Ilimitadas',
            'Usuários Ilimitados',
            'Clientes Ilimitados',
            '500GB de Armazenamento',
            'White Label (Marca Própria)',
            'Domínio Personalizado',
            'API Personalizada',
            'Integrações Customizadas',
            'Treinamento Dedicado',
            'Gerente de Conta',
            'SLA 99.9%',
            'Suporte 24/7',
            'Consultoria Estratégica'
        ]
    },
    {
        id: 'custom',
        name: 'Custom',
        tier: 'custom',
        description: 'Solução personalizada para grandes redes e necessidades específicas',
        pricing: {
            monthly: 0, // Sob consulta
            yearly: 0,
            currency: 'BRL'
        },
        limits: {
            maxUnits: 999999,
            maxUsers: 999999,
            maxClients: 999999,
            maxStorage: 999999
        },
        features: [
            'Tudo do Enterprise +',
            'Desenvolvimento Customizado',
            'Integrações Específicas',
            'Infraestrutura Dedicada',
            'Consultoria Estratégica',
            'Migração de Dados',
            'Treinamento Presencial',
            'Suporte Dedicado',
            'Contrato Personalizado'
        ]
    }
];

// ============================================
// ORGANIZAÇÕES MOCKADAS (PARA DESENVOLVIMENTO)
// ============================================

export const MOCK_ORGANIZATIONS: Organization[] = [
    {
        id: 'org_demo',
        slug: 'demo',
        name: 'Diva Spa Demo',
        displayName: 'Diva Spa - Demonstração',
        logo: undefined,
        primaryColor: '#8B5CF6',
        type: 'clinic',
        subscriptionPlanId: 'professional',
        subscriptionStatus: 'trial',
        subscriptionStartedAt: new Date().toISOString(),
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 dias
        billingCycle: 'monthly',
        limits: {
            maxUnits: 3,
            maxUsers: 20,
            maxClients: 2000,
            maxStorage: 50,
            features: SUBSCRIPTION_PLANS[1].features
        },
        usage: {
            units: 1,
            users: 5,
            clients: 127,
            storage: 2.5,
            appointmentsThisMonth: 45
        },
        owner: {
            userId: 'user_admin',
            name: 'Admin Demo',
            email: 'admin@divaspa.com',
            phone: '+55 71 99999-9999'
        },
        billing: {
            email: 'financeiro@divaspa.com'
        },
        settings: {
            timezone: 'America/Sao_Paulo',
            language: 'pt-BR',
            currency: 'BRL',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            allowMultiUnit: true,
            shareClientsAcrossUnits: true,
            requireTwoFactor: false,
            allowStaffDataAccess: true,
            enableWhatsAppIntegration: true,
            enableEmailMarketing: true
        },
        createdAt: new Date().toISOString(),
        activatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString()
    },
    {
        id: 'org_dr_silva',
        slug: 'dr-silva-dermatologia',
        name: 'Dr. Silva Dermatologia',
        displayName: 'Dr. João Silva - Dermatologia',
        logo: undefined,
        primaryColor: '#3B82F6',
        type: 'individual',
        subscriptionPlanId: 'starter',
        subscriptionStatus: 'active',
        subscriptionStartedAt: '2025-01-01T00:00:00Z',
        billingCycle: 'monthly',
        limits: {
            maxUnits: 1,
            maxUsers: 5,
            maxClients: 500,
            maxStorage: 10,
            features: SUBSCRIPTION_PLANS[0].features
        },
        usage: {
            units: 1,
            users: 3,
            clients: 87,
            storage: 1.2,
            appointmentsThisMonth: 32
        },
        owner: {
            userId: 'user_dr_silva',
            name: 'Dr. João Silva',
            email: 'joao.silva@gmail.com',
            phone: '+55 11 98765-4321',
            cpf: '123.456.789-00'
        },
        billing: {
            email: 'joao.silva@gmail.com',
            taxId: '123.456.789-00',
            nextBillingDate: '2025-02-01T00:00:00Z'
        },
        settings: {
            timezone: 'America/Sao_Paulo',
            language: 'pt-BR',
            currency: 'BRL',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            allowMultiUnit: false,
            shareClientsAcrossUnits: false,
            requireTwoFactor: false,
            allowStaffDataAccess: true,
            enableWhatsAppIntegration: true,
            enableEmailMarketing: false
        },
        createdAt: '2025-01-01T00:00:00Z',
        activatedAt: '2025-01-01T00:00:00Z',
        lastActivityAt: new Date().toISOString()
    },
    {
        id: 'org_grupo_beauty',
        slug: 'grupo-beauty',
        name: 'Grupo Beauty',
        displayName: 'Grupo Beauty - Estética Avançada',
        logo: undefined,
        primaryColor: '#EC4899',
        type: 'group',
        subscriptionPlanId: 'enterprise',
        subscriptionStatus: 'active',
        subscriptionStartedAt: '2024-06-01T00:00:00Z',
        billingCycle: 'yearly',
        limits: {
            maxUnits: 999,
            maxUsers: 999,
            maxClients: 999999,
            maxStorage: 500,
            features: SUBSCRIPTION_PLANS[2].features
        },
        usage: {
            units: 5,
            users: 47,
            clients: 1523,
            storage: 45.8,
            appointmentsThisMonth: 387
        },
        owner: {
            userId: 'user_grupo_beauty',
            name: 'Maria Santos',
            email: 'maria@grupobeauty.com.br',
            phone: '+55 21 99876-5432',
            cnpj: '12.345.678/0001-90'
        },
        billing: {
            email: 'financeiro@grupobeauty.com.br',
            taxId: '12.345.678/0001-90',
            nextBillingDate: '2025-06-01T00:00:00Z',
            lastPaymentDate: '2024-06-01T00:00:00Z',
            lastPaymentAmount: 14970
        },
        settings: {
            timezone: 'America/Sao_Paulo',
            language: 'pt-BR',
            currency: 'BRL',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            allowMultiUnit: true,
            shareClientsAcrossUnits: true,
            requireTwoFactor: true,
            allowStaffDataAccess: false,
            enableWhatsAppIntegration: true,
            enableEmailMarketing: true
        },
        createdAt: '2024-06-01T00:00:00Z',
        activatedAt: '2024-06-01T00:00:00Z',
        lastActivityAt: new Date().toISOString(),
        features: {
            whiteLabel: true,
            customDomain: true,
            apiAccess: true,
            advancedReports: true,
            multiLanguage: false
        }
    }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getOrganizationById = (orgId: string): Organization | undefined => {
    return MOCK_ORGANIZATIONS.find(org => org.id === orgId);
};

export const getOrganizationBySlug = (slug: string): Organization | undefined => {
    return MOCK_ORGANIZATIONS.find(org => org.slug === slug);
};

export const getPlanById = (planId: string): SubscriptionPlan | undefined => {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
};

export const calculateMonthlyBill = (org: Organization): number => {
    const plan = getPlanById(org.subscriptionPlanId);
    if (!plan) return 0;

    const basePrice = org.billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.yearly / 12;

    // Adicionar cobranças por uso excedente
    let total = basePrice;

    // Unidades extras (R$ 150/unidade)
    const extraUnits = Math.max(0, org.usage.units - plan.limits.maxUnits);
    total += extraUnits * 150;

    // Usuários extras (R$ 30/usuário)
    const extraUsers = Math.max(0, org.usage.users - plan.limits.maxUsers);
    total += extraUsers * 30;

    // Storage extra (R$ 10/GB)
    const extraStorage = Math.max(0, org.usage.storage - plan.limits.maxStorage);
    total += extraStorage * 10;

    return total;
};

export const isTrialActive = (org: Organization): boolean => {
    if (org.subscriptionStatus !== 'trial') return false;
    if (!org.trialEndsAt) return false;
    return new Date(org.trialEndsAt) > new Date();
};

export const getDaysUntilTrialEnd = (org: Organization): number => {
    if (!org.trialEndsAt) return 0;
    const now = new Date();
    const trialEnd = new Date(org.trialEndsAt);
    const diff = trialEnd.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const canAddUnit = (org: Organization): boolean => {
    return org.usage.units < org.limits.maxUnits;
};

export const canAddUser = (org: Organization): boolean => {
    return org.usage.users < org.limits.maxUsers;
};

export const canAddClient = (org: Organization): boolean => {
    return org.usage.clients < org.limits.maxClients;
};

export const hasFeature = (org: Organization, feature: string): boolean => {
    return org.limits.features.includes(feature);
};
