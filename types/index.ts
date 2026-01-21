/**
 * Barrel Export - Central Types Index
 * @module types
 * 
 * Import all types from a single location:
 * import { User, Client, ServiceAppointment } from '@/types';
 */

// ============================================
// CORE & COMMON TYPES
// ============================================
export * from './core';
export * from './common';

// ============================================
// SAAS & MULTI-TENANT
// ============================================
export * from './saas';

// ============================================
// MIGRATION
// ============================================
export * from './migration';

// ============================================
// DOMAIN-SPECIFIC TYPES
// ============================================

// Authentication & Users
export * from './auth';

// Clients & Leads
export * from './client';

// Appointments & Services
export * from './appointment';

// Finance & Payments
export * from './finance';

// Staff & Team
export * from './staff';

// Inventory & Products
export * from './inventory';

// Marketing & Campaigns
export * from './marketing';

// Communication & Forms
export * from './communication';

// UI & Configuration
export * from './ui';

// Events & Operations
export * from './operations';

// Treatment Plans
export * from './treatment';

// Business Units
export * from './unit';

// Context Types
export * from './context';

// ============================================
// TYPE GUARDS & UTILITIES
// ============================================

import { UserRole } from './auth';
import { SaaSLeadStage, SaaSPlan } from './saas';

/**
 * Check if user has admin privileges
 */
export const isAdmin = (role: UserRole): boolean => {
    return [UserRole.MASTER, UserRole.ADMIN, UserRole.MANAGER].includes(role);
};

/**
 * Check if user is SaaS staff
 */
export const isSaaSStaff = (role: UserRole): boolean => {
    return [UserRole.MASTER, UserRole.SAAS_STAFF].includes(role);
};

/**
 * Check if lead is in closing stages
 */
export const isLeadClosing = (stage: SaaSLeadStage): boolean => {
    return [
        SaaSLeadStage.TRIAL_STARTED,
        SaaSLeadStage.CLOSED_WON
    ].includes(stage);
};

/**
 * Check if plan is premium
 */
export const isPremiumPlan = (plan: SaaSPlan): boolean => {
    return [SaaSPlan.EXPERTS, SaaSPlan.EMPIRE].includes(plan);
};

// ============================================
// CONSTANTS
// ============================================

/**
 * Lead stage progression order
 */
export const LEAD_STAGE_ORDER = [
    SaaSLeadStage.NEW,
    SaaSLeadStage.QUALIFIED,
    SaaSLeadStage.DEMO_SCHEDULED,
    SaaSLeadStage.TRIAL_STARTED,
    SaaSLeadStage.CLOSED_WON,
    SaaSLeadStage.CLOSED_LOST
] as const;

/**
 * Get stage index for comparison
 */
export const getStageIndex = (stage: SaaSLeadStage): number => {
    return LEAD_STAGE_ORDER.indexOf(stage);
};

/**
 * Check if stage A is more advanced than stage B
 */
export const isStageAdvanced = (stageA: SaaSLeadStage, stageB: SaaSLeadStage): boolean => {
    return getStageIndex(stageA) > getStageIndex(stageB);
};
