/**
 * Core Types - User, Organization, Authentication
 * @module types/core
 */

// ============================================
// USER & AUTHENTICATION
// ============================================

export enum UserRole {
    MASTER = 'master',           // God mode - SaaS admin
    SAAS_STAFF = 'saas_staff',  // SaaS team member
    ADMIN = 'admin',             // Clinic owner
    MANAGER = 'manager',         // Clinic manager
    STAFF = 'staff',             // Clinic staff
    FINANCE = 'finance',         // Finance team
    CLIENT = 'client'            // End customer
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    organizationId?: string;
    avatar?: string;
    phone?: string;
    cpf?: string;
    createdAt: string;
    lastLogin?: string;
}

// ============================================
// ADDRESS
// ============================================

export interface Address {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

// ============================================
// ORGANIZATION (Multi-tenant)
// ============================================

export type OrganizationType = 'individual' | 'clinic' | 'group' | 'franchise';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'suspended' | 'cancelled';
export type BillingCycle = 'monthly' | 'yearly';

export interface OrganizationOwner {
    userId: string;
    name: string;
    email: string;
    phone: string;
    cpf?: string;
    cnpj?: string;
}

export interface OrganizationBilling {
    email: string;
    address?: Address;
    taxId?: string;
    paymentMethodId?: string;
    nextBillingDate?: string;
    lastPaymentDate?: string;
    lastPaymentAmount?: number;
}

export interface OrganizationLimits {
    maxUnits: number;
    maxUsers: number;
    maxClients: number;
    maxStorage: number; // GB
    features: string[];
}

export interface OrganizationUsage {
    units: number;
    users: number;
    clients: number;
    storage: number;
    appointmentsThisMonth: number;
}

export interface OrganizationSettings {
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    allowMultiUnit: boolean;
    shareClientsAcrossUnits: boolean;
    requireTwoFactor: boolean;
    allowStaffDataAccess: boolean;
    enableWhatsAppIntegration: boolean;
    enableEmailMarketing: boolean;
    enableMarketplace: boolean;
    marketplaceName?: string;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    type: OrganizationType;
    owner: OrganizationOwner;
    subscriptionStatus: SubscriptionStatus;
    subscriptionPlanId: string;
    billingCycle: BillingCycle;
    billing: OrganizationBilling;
    limits: OrganizationLimits;
    usage: OrganizationUsage;
    settings: OrganizationSettings;
    createdAt: string;
    updatedAt: string;
    trialEndsAt?: string;
    customDomain?: string;
    logoUrl?: string;
    primaryColor?: string;
}
