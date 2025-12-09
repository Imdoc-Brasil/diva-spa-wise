
// ============================================
// SAAS / MASTER BACKOFFICE TYPES
// ============================================

export enum SaaSLeadStage {
    NEW = 'New',
    QUALIFIED = 'Qualified',
    DEMO_SCHEDULED = 'Demo Scheduled',
    TRIAL_STARTED = 'Trial Started',
    CLOSED_WON = 'Closed Won',
    CLOSED_LOST = 'Closed Lost'
}

export enum SaaSPlan {
    START = 'Start',
    GROWTH = 'Growth',
    EMPIRE = 'Empire'
}

export interface SaaSLead {
    id: string;
    name: string; // Nome do lead (pessoa)
    clinicName: string; // Nome da clínica (empresa)
    legalName?: string; // Razão Social
    email: string;
    phone: string;
    stage: SaaSLeadStage;
    planInterest: SaaSPlan; // Qual plano demonstrou interesse
    source: 'landing_page' | 'referral' | 'outbound' | 'other';
    status: 'active' | 'archived'; // Se já foi processado ou não
    notes?: string;
    estimatedValue?: number; // Preço do plano estimado
    nextAction?: string; // "Ligar amanhã", "Enviar contrato"
    cnpj?: string; // For invoice
    address?: string; // Logradouro
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    paymentMethod?: 'boleto' | 'pix' | 'credit_card';
    recurrence?: 'monthly' | 'annual';
    trialStartDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SaaSSubscriber {
    id: string; // org_id
    clinicName: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    plan: SaaSPlan;
    status: 'active' | 'delinquent' | 'cancelled' | 'trial';
    mrr: number; // Monthly Recurring Revenue
    joinedAt: string; // Data de início
    nextBillingDate: string;
    usersCount: number; // Quantos usuários cadastrados
    smsBalance: number; // Saldo de mensagens
}
