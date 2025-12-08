
import { TreatmentPlan, TreatmentPlanTemplate } from '../types';

export const MOCK_TREATMENT_TEMPLATES: TreatmentPlanTemplate[] = [
    {
        id: 'tpl_beauty_annual',
        organizationId: 'org_demo',
        name: 'Plano Anual da Beleza',
        description: 'Plano anual de prevenção do envelhecimento e estímulo de colágeno.',
        items: [
            {
                serviceId: 'srv_botox_full',
                serviceName: 'Toxina Botulínica (Full Face)',
                quantity: 3,
                priority: 'high',
                periodicity: 'A cada 4 meses'
            },
            {
                serviceId: 'srv_sculptra',
                serviceName: 'Sculptra Facial (Bioestimulador)',
                quantity: 4,
                priority: 'high',
                periodicity: '2 a cada 6 meses'
            },
            {
                serviceId: 'srv_radiesse',
                serviceName: 'Radiesse Corporal',
                quantity: 2,
                priority: 'medium',
                periodicity: '1 a cada 12 meses'
            }
        ]
    },
    {
        id: 'tpl_firm_lift',
        organizationId: 'org_demo',
        name: 'Firm Lift',
        description: 'Estímulo de colágeno, hidratação profunda e firmeza da pele.',
        items: [
            {
                serviceId: 'srv_sculptra',
                serviceName: 'Sculptra Facial',
                quantity: 2,
                priority: 'high'
            },
            {
                serviceId: 'srv_ultraformer',
                serviceName: 'Ultraformer MPT (Full Face)',
                quantity: 1,
                priority: 'medium'
            }
        ]
    },
    {
        id: 'tpl_acne_control',
        organizationId: 'org_demo',
        name: 'Acne Control',
        description: 'Protocolo completo para controle de oleosidade e acne ativa.',
        items: [
            {
                serviceId: 'srv_peeling',
                serviceName: 'Peeling Químico',
                quantity: 4,
                priority: 'high',
                periodicity: 'Mensal'
            },
            {
                serviceId: 'srv_limpeza',
                serviceName: 'Limpeza de Pele Profunda',
                quantity: 4,
                priority: 'medium',
                periodicity: 'Mensal'
            },
            {
                serviceId: 'srv_led',
                serviceName: 'Terapia LED Azul',
                quantity: 8,
                priority: 'low',
                periodicity: 'Quinzenal'
            }
        ]
    }
];

export const MOCK_TREATMENT_PLANS: TreatmentPlan[] = [
    {
        id: 'plan_001',
        organizationId: 'org_demo',
        clientId: 'c1',
        clientName: 'Ana Silva',
        professionalId: 's1',
        professionalName: 'Dra. Julia Martins',
        name: 'Plano Anual da Beleza',
        description: 'Personalizado para correção de assimetria.',
        status: 'prescribed',
        pipelineStage: 'Novo',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        items: [
            {
                id: 'item_1',
                serviceId: 'srv_botox_full',
                serviceName: 'Toxina Botulínica (Full Face)',
                quantity: 3,
                sessionsUsed: 0,
                priority: 'high',
                periodicity: 'A cada 4 meses',
                unitPrice: 1200,
                totalPrice: 3600,
                status: 'pending'
            },
            {
                id: 'item_2',
                serviceId: 'srv_sculptra',
                serviceName: 'Sculptra Facial',
                quantity: 4,
                sessionsUsed: 0,
                priority: 'high',
                periodicity: '2 a cada 6 meses',
                unitPrice: 2500,
                totalPrice: 10000,
                status: 'pending'
            }
        ],
        subtotal: 13600,
        discount: 0,
        total: 13600
    },
    {
        id: 'plan_002',
        organizationId: 'org_demo',
        clientId: 'c2',
        clientName: 'Fernanda Lima',
        professionalId: 's1',
        professionalName: 'Dra. Julia Martins',
        name: 'Firm Lift',
        status: 'partially_paid',
        pipelineStage: 'Fechado',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now()).toISOString(),
        items: [
            {
                id: 'item_3',
                serviceId: 'srv_sculptra',
                serviceName: 'Sculptra Facial',
                quantity: 2,
                sessionsUsed: 1, // 1 used
                priority: 'high',
                unitPrice: 2500,
                totalPrice: 5000,
                status: 'paid' // Paid
            },
            {
                id: 'item_4',
                serviceId: 'srv_ultraformer',
                serviceName: 'Ultraformer MPT',
                quantity: 1,
                sessionsUsed: 0,
                priority: 'medium',
                unitPrice: 3500,
                totalPrice: 3500,
                status: 'pending' // Not paid yet
            }
        ],
        subtotal: 8500,
        discount: 500,
        total: 8000
    }
];
