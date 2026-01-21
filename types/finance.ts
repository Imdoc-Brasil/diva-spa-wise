// ============================================
// FINANCE & TRANSACTIONS
// ============================================

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'package' | 'split' | 'boleto' | 'bank_transfer' | 'invoice_30d';
export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'paid' | 'pending' | 'overdue';
export type RevenueType = 'service' | 'product' | 'mixed';

export interface InvoiceItem {
    id: string;
    productId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    type: 'service' | 'product';
}

export interface Invoice {
    id: string;
    organizationId: string;
    appointmentId?: string;
    clientId: string;
    clientName: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: PaymentMethod | 'split';
    splitDetails?: { method: PaymentMethod, amount: number }[];
    status: 'paid' | 'pending' | 'cancelled';
    createdAt: string;
    unitId?: string;
}

export interface Transaction {
    id: string;
    organizationId: string;
    description: string;
    category: string;
    revenueType?: RevenueType;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    date: string;
    paymentMethod?: PaymentMethod | 'split';
    unitId?: string;
    relatedAppointmentId?: string;
    payerName?: string;
    fiscalAccountId?: string;
    gatewayId?: string;
    installments?: number;
    netAmount?: number;
    mdrFee?: number;
    settlementDate?: string;
    supplierId?: string;
    dueDate?: string;
    recurrence?: {
        rule: 'monthly' | 'weekly' | 'yearly';
        currentInstallment: number;
        totalInstallments: number;
        groupId: string;
    };
    sourceAccountId?: string;
    fiscalRecordId?: string;
    attachmentUrl?: string;
}

export interface BankAccount {
    id: string;
    organizationId: string;
    name: string;
    type: 'bank' | 'cash' | 'card_machine';
    balance: number;
    color?: string;
    icon?: string;
}

export interface FiscalAccount {
    id: string;
    organizationId: string;
    name: string;
    alias: string;
    document: string;
    type: 'clinic_service' | 'marketplace' | 'professional';
    address?: string;
    digitalCertificateInfo?: {
        validTo: string;
        hasPassword?: boolean;
    };
    receivingConfig?: {
        pixKey?: string;
        pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
        cardMachineLabel?: string;
    };
    paymentMethods?: string[];
    isDefault?: boolean;
}

export interface FiscalRecord {
    id: string;
    organizationId: string;
    transactionId: string;
    fiscalAccountId?: string;
    type: 'NFS-e' | 'NF-e' | 'Recibo';
    status: 'pending' | 'emitted' | 'cancelled' | 'error';
    number?: string;
    series?: string;
    emissionDate?: string;
    amount: number;
    issuerName: string;
    issuerDocument: string;
    recipientName: string;
    recipientDocument: string;
    verificationCode?: string;
    pdfUrl?: string;
    xmlUrl?: string;
}

export interface Receivable {
    id: string;
    date: string;
    amount: number;
    origin: 'credit_card' | 'debit_card' | 'pix';
    installment?: string;
    status: 'scheduled' | 'paid' | 'anticipated';
    fees: number;
}

export interface PaymentLink {
    id: string;
    description: string;
    amount: number;
    status: 'active' | 'paid' | 'expired';
    createdAt: string;
    url: string;
    clientName?: string;
}

export interface SplitRule {
    id: string;
    staffId: string;
    staffName: string;
    percentage: number;
    serviceCategory: string;
    active: boolean;
}

// Payment Gateway Configuration
export interface InstallmentRule {
    maxInstallments: number;
    maxFreeInstallments: number;
    interestRate: number;
    buyerPaysInterest: boolean;
}

export interface PaymentGateway {
    id: string;
    name: string;
    type: 'physical_pos' | 'online_api' | 'manual';
    integrationType: 'manual' | 'api';
    provider: 'stone' | 'cielo' | 'rede' | 'pagseguro' | 'mercadopago' | 'infinitepay' | 'asaas' | 'stripe' | 'other';
    pixKey?: string;
    bankLabel?: string;
    apiKey?: string;
    webhookSecret?: string;
    scope: 'all' | 'pos_only' | 'online_only';
    fees: {
        debit: number;
        credit_1x: number;
        credit_2x_6x: number;
        credit_7x_12x: number;
        pix: number;
        pix_type: 'percentage' | 'fixed';
        anticipation?: number;
    };
    installmentRule: InstallmentRule;
    settlementDays: {
        debit: number;
        credit: number;
        pix: number;
    };
    destinationAccountId?: string;
    active: boolean;
}

export interface InstallmentOption {
    installments: number;
    feePercentage: number;
    netAmount: number;
}

// Asaas Integration
export interface AsaasCustomer {
    id: string;
    name: string;
    email: string;
    cpfCnpj: string;
}

export interface AsaasPayment {
    id: string;
    customer: string;
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
    value: number;
    netValue?: number;
    dueDate: string;
    status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
    description?: string;
    externalReference?: string;
    bankSlipUrl?: string;
    invoiceUrl?: string;
    pixQrCodeId?: string;
}

export interface AsaasSubscription {
    id: string;
    customer: string;
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX';
    value: number;
    nextDueDate: string;
    cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
    description?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}
