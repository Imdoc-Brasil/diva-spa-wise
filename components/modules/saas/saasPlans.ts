
import { SaaSPlan } from '@/types';

/**
 * Configuração Oficial dos Planos SaaS
 * Última atualização: 2025-12-22
 */
export const SAAS_PLANS_CONFIG = {
    [SaaSPlan.START]: {
        name: 'Start',
        displayName: 'Plano Start',
        monthlyPrice: 197.00,
        yearlyPrice: 1985.00, // ~15% desconto
        description: 'Gestão essencial para consultórios e clínicas individuais.',
        features: [
            'Até 2 profissionais',
            'Agenda digital',
            'CRM básico',
            'Financeiro simplificado'
        ]
    },
    [SaaSPlan.GROWTH]: {
        name: 'Growth',
        displayName: 'Plano Growth',
        monthlyPrice: 497.00,
        yearlyPrice: 4970.00, // ~17% desconto
        description: 'Ideal para clínicas em expansão com múltiplos profissionais.',
        features: [
            'Até 10 profissionais',
            'Marketing automation',
            'Relatórios avançados',
            'Integrações ilimitadas'
        ]
    },
    [SaaSPlan.EXPERTS]: {
        name: 'Experts',
        displayName: 'Plano Experts',
        monthlyPrice: 897.00,
        yearlyPrice: 8970.00, // ~17% desconto
        description: 'Para especialistas que buscam alta performance e gestão avançada.',
        features: [
            'Profissionais ilimitados',
            'IA avançada',
            'White label',
            'Suporte prioritário'
        ]
    },
    [SaaSPlan.EMPIRE]: {
        name: 'Empire',
        displayName: 'Plano Empire',
        monthlyPrice: 0, // Sob consulta
        yearlyPrice: 0,
        description: 'Solução personalizada para grandes redes e franquias.',
        features: [
            'Multi-unidades ilimitadas',
            'Customização total',
            'Gerente de conta dedicado',
            'SLA garantido'
        ]
    }
};

/**
 * Helper para obter informações de um plano
 */
export const getPlanInfo = (plan: SaaSPlan) => {
    return SAAS_PLANS_CONFIG[plan] || SAAS_PLANS_CONFIG[SaaSPlan.GROWTH];
};

/**
 * Lista de todos os planos disponíveis
 */
export const AVAILABLE_PLANS = [
    SaaSPlan.START,
    SaaSPlan.GROWTH,
    SaaSPlan.EXPERTS,
    SaaSPlan.EMPIRE
] as const;
