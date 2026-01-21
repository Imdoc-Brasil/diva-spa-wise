// ============================================
// TREATMENT PLANS & CLINICAL
// ============================================

export type TreatmentPriority = 'high' | 'medium' | 'low';
export type TreatmentItemStatus = 'pending' | 'paid' | 'scheduled' | 'completed';
export type PlanStatus = 'prescribed' | 'negotiating' | 'closed' | 'partially_paid' | 'completed' | 'lost';

export interface TreatmentPlanItem {
    id: string;
    serviceId: string;
    serviceName: string;
    quantity: number;
    sessionsUsed: number;
    priority: TreatmentPriority;
    periodicity?: string;
    unitPrice: number;
    totalPrice: number;
    status: TreatmentItemStatus;
}

export interface TreatmentPlan {
    id: string;
    organizationId: string;
    clientId: string;
    clientName: string;
    professionalId: string;
    professionalName: string;
    name: string;
    description?: string;
    items: TreatmentPlanItem[];
    subtotal: number;
    discount: number;
    total: number;
    status: PlanStatus;
    pipelineStage: string;
    createdAt: string;
    updatedAt: string;
    validUntil?: string;
}

export interface TreatmentPlanTemplate {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    items: {
        serviceId: string;
        serviceName: string;
        quantity: number;
        priority: TreatmentPriority;
        periodicity?: string;
    }[];
}
