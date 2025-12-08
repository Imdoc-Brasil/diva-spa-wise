
// ============================================
// FINANCIAL & PAYMENT CONFIGURATION
// ============================================

export interface PaymentGateway {
    id: string; // Ex: "pagseguro", "asaas", "stone_pos_1"
    name: string; // Ex: "InfinitePay - Recepção", "Asaas API"
    type: 'physical_pos' | 'online_api' | 'manual';
    provider: 'stone' | 'cielo' | 'rede' | 'pagseguro' | 'mercadopago' | 'infinitepay' | 'asaas' | 'stripe' | 'other';

    // Configurações de Taxas (MDR)
    fees: {
        debit: number; // % Ex: 1.99
        credit_1x: number; // % Ex: 3.50
        credit_2x_6x: number; // % Ex: 4.50
        credit_7x_12x: number; // % Ex: 5.50
        pix: number; // % ou Valor Fixo (depende do gateway)
        pix_type: 'percentage' | 'fixed'; // Tipo da taxa PIX
        anticipation?: number; // % a.m. se houver antecipação
    };

    // Prazos de Recebimento (Dias)
    settlementDays: {
        debit: number; // Ex: 1
        credit: number; // Ex: 30 (ou 1 se antecipado)
        pix: number; // Ex: 0
    };

    destinationAccountId?: string; // ID da conta bancária interna onde o $ cai
    active: boolean;
}

export interface BankAccount {
    id: string;
    organizationId: string;
    name: string; // "Conta Principal Itaú"
    bankName: string;
    accountNumber: string;
    agency: string;
    pixKeys: string[];
    initialBalance: number;
    currentBalance: number; // Calculado
}

export interface InstallmentOption {
    installments: number; // 1, 2, 3...
    feePercentage: number; // Taxa total para esse parcelamento
    netAmount: number; // (Simulação) Quanto cairá líquido
}
