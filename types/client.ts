// ============================================
// CLIENT MANAGEMENT
// ============================================

export interface ClientWallet {
    balance: number;
    activePackages: {
        id: string;
        name: string;
        serviceId?: string;
        sessionsTotal: number;
        sessionsUsed: number;
        expiryDate: string;
    }[];
}

export interface Client {
    clientId: string;
    organizationId: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    rfmScore: number;
    behaviorTags: string[];
    lifetimeValue: number;
    fitzpatrickSkinType?: string;
    lastContact?: string;
    referralPoints?: number;
    loyaltyPoints?: number;
    channelSource?: string;
    referredBy?: string;
    cpf?: string;
    rg?: string;
    birthDate?: string;
    gender?: 'female' | 'male' | 'other';
    profession?: string;
    address?: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    notes?: string;
    unitId?: string;
    wallet?: ClientWallet;
}

export enum LeadStage {
    NEW = 'New',
    CONTACTED = 'Contacted',
    SCHEDULED = 'Scheduled',
    CONVERTED = 'Converted',
    LOST = 'Lost'
}

export interface SalesLead {
    leadId: string;
    organizationId: string;
    name: string;
    contact: string;
    stage: LeadStage;
    channelSource: string;
    lastActivity: string;
    notes?: string;
    referredByClientId?: string;
    referrerName?: string;
    referrerPhone?: string;
    unitId?: string;
}

export interface ClientDocument {
    id: string;
    title: string;
    type: 'consent_term' | 'image_rights' | 'anamnesis' | 'treatment_plan' | 'other';
    content?: string;
    clientId?: string;
    templateId?: string;
    signedAt: string;
    status: 'signed' | 'pending' | 'expired';
    url: string;
    signatureId?: string;
    requiresSignature: boolean;
    createdAt?: string;
    expiresAt?: string;
}

export interface ClientPhoto {
    id: string;
    date: string;
    type: 'before' | 'after';
    area: string;
    url: string;
    notes?: string;
}

export type FeedbackSentiment = 'positive' | 'neutral' | 'negative';

export interface ClientFeedback {
    id: string;
    clientId: string;
    clientName: string;
    npsScore: number;
    comment: string;
    sentiment: FeedbackSentiment;
    tags: string[];
    date: string;
    status: 'new' | 'resolved' | 'addressed';
    staffMentioned?: string;
}

export interface DocumentTemplate {
    id: string;
    title: string;
    type: 'consent_term' | 'image_rights' | 'anamnesis' | 'treatment_plan' | 'other';
    content: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface WaitlistItem {
    id: string;
    organizationId: string;
    clientName: string;
    service: string;
    preference: string;
    priority: 'high' | 'medium' | 'low';
}
