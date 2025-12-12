
import { SaaSPlan } from '@/types_saas';

export const SAAS_PLANS_CONFIG = {
    [SaaSPlan.START]: {
        name: 'Plano Start',
        monthlyPrice: 197.00,
        yearlyPrice: 1985.00,
        description: 'Gestão essencial para consultórios e clínicas individuais.'
    },
    [SaaSPlan.GROWTH]: {
        name: 'Plano Growth',
        monthlyPrice: 497.00,
        yearlyPrice: 4950.00,
        description: 'Ideal para clínicas em expansão com múltiplos profissionais.'
    },
    [SaaSPlan.EXPERTS]: {
        name: 'Plano Experts',
        monthlyPrice: 897.00,
        yearlyPrice: 9687.00,
        description: 'Para especialistas que buscam alta performance e gestão avançada.'
    },
    [SaaSPlan.EMPIRE]: {
        name: 'Plano Empire',
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: 'Solução personalizada para grandes redes e franquias.'
    }
};
