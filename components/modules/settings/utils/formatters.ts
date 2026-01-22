/**
 * Formatting utilities for Settings module
 */

/**
 * Format number as Brazilian currency
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

/**
 * Format phone number
 */
export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
};

/**
 * Format CPF
 */
export const formatCPF = (cpf: string): string => {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }

    return cpf;
};

/**
 * Format CNPJ
 */
export const formatCNPJ = (cnpj: string): string => {
    const cleaned = cnpj.replace(/\D/g, '');

    if (cleaned.length === 14) {
        return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
    }

    return cnpj;
};

/**
 * Format date to Brazilian format
 */
export const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat('pt-BR').format(d);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
};
