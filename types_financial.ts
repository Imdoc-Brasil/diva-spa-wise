
// ============================================
// FINANCIAL & PAYMENT CONFIGURATION
// ============================================

export interface InstallmentRule {
    maxInstallments: number; // Ex: 12
    maxFreeInstallments: number; // Ex: 6 (Até 6x sem juros)
    interestRate: number; // Ex: 1.99 (% a.m. para parcelas com juros)
    buyerPaysInterest: boolean; // Se true, o valor total da venda aumenta (Juros ao portador)
}

export interface PaymentGateway {
    id: string; // Ex: "pagseguro", "asaas", "stone_pos_1"
    name: string; // Ex: "InfinitePay - Recepção", "Asaas API"
    type: 'physical_pos' | 'online_api' | 'manual';
    integrationType: 'manual' | 'api'; // NOVO: Define se é cadastrado via API ou só registro manual
    provider: 'stone' | 'cielo' | 'rede' | 'pagseguro' | 'mercadopago' | 'infinitepay' | 'asaas' | 'stripe' | 'other';

    // Dados Bancários/Identificação
    pixKey?: string; // Ex: "12.345.678/0001-99"
    bankLabel?: string; // Ex: "Conta Itau Principal" ou "Caixa Gaveta"

    // Controle de Acesso e Integração
    apiKey?: string; // Para integrações API
    webhookSecret?: string;
    scope: 'all' | 'pos_only' | 'online_only'; // Onde este gateway aparece

    // Configurações de Taxas (MDR - Custo para a Loja)
    fees: {
        debit: number; // % Ex: 1.99
        credit_1x: number; // % Ex: 3.50
        credit_2x_6x: number; // % Ex: 4.50
        credit_7x_12x: number; // % Ex: 5.50
        pix: number; // % ou Valor Fixo
        pix_type: 'percentage' | 'fixed';
        anticipation?: number; // % a.m.
    };

    // Regras de Venda (Parcelamento ao Cliente)
    installmentRule: InstallmentRule;

    // Prazos de Recebimento (Dias)
    settlementDays: {
        debit: number;
        credit: number;
        pix: number;
    };

    destinationAccountId?: string;
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
