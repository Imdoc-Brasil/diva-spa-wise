/**
 * Custom API Error
 * Extends Error with additional API-specific information
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public data?: any,
        public endpoint?: string
    ) {
        super(message);
        this.name = 'ApiError';

        // Maintains proper stack trace for where error was thrown (V8 only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    /**
     * Check if error is a specific HTTP status code
     */
    is(statusCode: number): boolean {
        return this.statusCode === statusCode;
    }

    /**
     * Check if error is a client error (4xx)
     */
    isClientError(): boolean {
        return this.statusCode >= 400 && this.statusCode < 500;
    }

    /**
     * Check if error is a server error (5xx)
     */
    isServerError(): boolean {
        return this.statusCode >= 500 && this.statusCode < 600;
    }

    /**
     * Get user-friendly error message
     */
    getUserMessage(): string {
        if (this.statusCode === 401) {
            return 'Sessão expirada. Por favor, faça login novamente.';
        }
        if (this.statusCode === 403) {
            return 'Você não tem permissão para realizar esta ação.';
        }
        if (this.statusCode === 404) {
            return 'Recurso não encontrado.';
        }
        if (this.statusCode === 429) {
            return 'Muitas requisições. Por favor, aguarde um momento.';
        }
        if (this.isServerError()) {
            return 'Erro no servidor. Por favor, tente novamente mais tarde.';
        }
        return this.message || 'Ocorreu um erro. Por favor, tente novamente.';
    }
}
