import { ApiError } from './ApiError';

/**
 * Common API types
 */

export interface ApiResponse<T> {
    data: T;
    error?: ApiError | null;
    status: number;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export interface ApiRequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    timeout?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    onError?: (error: ApiError) => void;
    onSuccess?: <T>(response: ApiResponse<T>) => void;
}
