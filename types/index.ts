/**
 * Barrel Export - Central Types Index
 * @module types
 * 
 * Import all types from a single location:
 * import { User, SaaSLead, Transaction } from '@/types';
 */

// ============================================
// CORE TYPES
// ============================================
export * from './core';

// ============================================
// SAAS TYPES
// ============================================
export * from './saas';

// ============================================
// FINANCIAL TYPES (Legacy - to be migrated)
// ============================================
export * from '../types_financial';

// ============================================
// TYPE GUARDS & UTILITIES
// ============================================

import { UserRole } from './core';
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

export const BRAZIL_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type BrazilState = typeof BRAZIL_STATES[number];

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
