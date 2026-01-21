/**
 * SaaS Types - CRM, Leads, Subscribers, Pipelines
 * @module types/saas
 */

// ============================================
// SAAS PLANS
// ============================================

export enum SaaSPlan {
    START = 'Start',
    GROWTH = 'Growth',
    EXPERTS = 'Experts',
    EMPIRE = 'Empire'
}

// ============================================
// LEAD MANAGEMENT
// ============================================

export enum SaaSLeadStage {
    NEW = 'New',
    QUALIFIED = 'Qualified',
    DEMO_SCHEDULED = 'Demo Scheduled',
    TRIAL_STARTED = 'Trial Started',
    CLOSED_WON = 'Closed Won',
    CLOSED_LOST = 'Closed Lost'
}

export type SaaSLeadSource = 'landing_page' | 'referral' | 'outbound' | 'calculator' | 'ebook' | 'other';
export type SaaSLeadStatus = 'active' | 'archived';
export type SaaSPaymentMethod = 'boleto' | 'pix' | 'credit_card';
export type Recurrence = 'monthly' | 'annual';

export interface SaaSLead {
    id: string;
    name: string;
    clinicName: string;
    legalName?: string;
    email: string;
    phone: string;
    stage: SaaSLeadStage;
    planInterest: SaaSPlan;
    source: SaaSLeadSource;
    status: SaaSLeadStatus;
    notes?: string;
    estimatedValue?: number;
    nextAction?: string;

    // Address
    cnpj?: string;
    zipCode?: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;

    // Payment
    paymentMethod?: SaaSPaymentMethod;
    recurrence?: Recurrence;
    trialStartDate?: string;

    // Enrichment
    tasks?: SaaSTask[];
    tags?: string[];
    metadata?: Record<string, any>;
    attachments?: string[];

    createdAt: string;
    updatedAt: string;
}

// ============================================
// TASKS
// ============================================

export type SaaSTaskType = 'call' | 'meeting' | 'email' | 'reminder' | 'demo';

export interface SaaSTask {
    id: string;
    leadId: string;
    title: string;
    type: SaaSTaskType;
    dueDate: string;
    isCompleted: boolean;
    completedAt?: string;
    createdAt?: string;
}

// ============================================
// SUBSCRIBERS
// ============================================

export type SubscriberStatus = 'active' | 'delinquent' | 'cancelled' | 'trial';
export type FinancialStatus = 'paid' | 'overdue' | 'pending';

export interface SaaSSubscriber {
    id: string;
    slug?: string;
    clinicName: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    plan: SaaSPlan;
    status: SubscriberStatus;
    financialStatus?: FinancialStatus;
    mrr: number;
    joinedAt: string;
    nextBillingDate: string;
    usersCount: number;
    smsBalance: number;
    recurrence?: Recurrence;

    // Asaas Integration
    asaasCustomerId?: string;
    asaasSubscriptionId?: string;
}

// ============================================
// IMPLEMENTATION PIPELINE
// ============================================

export enum ImplementationStage {
    NEW_SUBSCRIBER = 'New Subscriber',
    DEMO_SCHEDULED = 'Demo Scheduled',
    IN_TRAINING = 'In Training',
    FINISHED = 'Finished'
}

export type ProjectStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed';

export interface ImplementationProject {
    id: string;
    subscriberId: string;
    clinicName: string;
    stage: ImplementationStage;
    status: ProjectStatus;
    startDate: string;
    deadlineDate: string;
    modulesChecked?: string[];
    notes?: string;
    tasks?: any[];
    createdAt?: string;
}

// ============================================
// SUPPORT TICKETS
// ============================================

export enum SupportTicketStatus {
    OPEN = 'Open',
    IN_PROGRESS = 'In Progress',
    WAITING_CLIENT = 'Waiting Client',
    RESOLVED = 'Resolved',
    CLOSED = 'Closed'
}

export enum SupportTicketPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    URGENT = 'Urgent',
    CRITICAL = 'Critical'  // Alias for URGENT
}

export type TicketCategory = 'bug' | 'question' | 'feature' | 'billing' | 'technical' | 'access' | 'other';

export interface SupportTicket {
    id: string;
    ticketNumber: string;
    subscriberId: string;
    clinicName: string;
    title: string;
    description: string;
    category: TicketCategory;
    priority: SupportTicketPriority;
    status: SupportTicketStatus;
    aiSummary?: string;
    messages?: any[];
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
}

// ============================================
// FEATURE REQUESTS
// ============================================

export enum FeatureRequestStatus {
    NEW = 'New',
    UNDER_REVIEW = 'Under Review',
    PLANNED = 'Planned',
    IN_DEVELOPMENT = 'In Development',
    SHIPPED = 'Shipped',
    RELEASED = 'Shipped',  // Alias for SHIPPED
    REJECTED = 'Rejected'
}

export enum FeatureRequestImpact {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    CRITICAL = 'Critical'
}

export type FeatureModule = 'crm' | 'financeiro' | 'agenda' | 'marketing' | 'relatorios' | 'geral';

export interface FeatureRequest {
    id: string;
    subscriberId: string;
    clinicName: string;
    module: FeatureModule;
    title: string;
    description: string;
    impact: FeatureRequestImpact;
    status: FeatureRequestStatus;
    votes: number;
    createdAt: string;
    updatedAt?: string;
    shippedAt?: string;
}

// ============================================
// BLOG & CONTENT
// ============================================

export type PostStatus = 'draft' | 'published' | 'archived';
export type PostCategory = 'tutorial' | 'news' | 'case-study' | 'announcement';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    author: string;
    category: PostCategory;
    status: PostStatus;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    views?: number;
}
