/**
 * Services
 * Centralized export for all services
 */

// Base
export { ApiError } from './base/ApiError';
export type {
    ApiResponse,
    PaginatedResponse,
    ApiRequestConfig,
    HttpMethod,
    ApiClientConfig
} from './base/types';

// API Clients
export { supabase } from './supabase';

// Services
export * from './userService';
export * from './asaasService';
export * from './documentServices';
export * from './migrationService';

// SaaS Services
export * from './saas/AutomationService';
export * from './saas/OnboardingService';
export * from './saas/PlansService';
export * from './saas/SaaSLeadsService';
