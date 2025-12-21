export * from './types_financial';
export * from './types_financial';
import {
    SaaSLead, SaaSSubscriber, SaaSTask, SaaSPlan,
    ImplementationProject, SupportTicket, FeatureRequest, ImplementationStage
} from './types_saas';
export * from './types_saas';
// ============================================
// MULTI-TENANT SAAS - ORGANIZATION & SUBSCRIPTION
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

export type OrganizationType = 'individual' | 'clinic' | 'group' | 'franchise';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'suspended' | 'cancelled';
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise' | 'custom';
export type BillingCycle = 'monthly' | 'yearly';

export interface SubscriptionPlan {
    id: string;
    name: string;
    tier: SubscriptionTier;
    pricing: {
        monthly: number; // R$ por mês
        yearly: number; // R$ por ano (com desconto)
        currency: 'BRL' | 'USD';
    };
    limits: {
        maxUnits: number;
        maxUsers: number;
        maxClients: number;
        maxStorage: number; // GB
        maxAppointmentsPerMonth?: number;
    };
    features: string[];
    popular?: boolean;
    description?: string;
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
    storage: number; // GB usado
    appointmentsThisMonth: number;
}

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
    taxId?: string; // CNPJ ou CPF
    paymentMethodId?: string; // ID do método de pagamento no gateway
    nextBillingDate?: string;
    lastPaymentDate?: string;
    lastPaymentAmount?: number;
}

export interface OrganizationSettings {
    timezone: string; // "America/Sao_Paulo"
    language: string; // "pt-BR"
    currency: string; // "BRL"
    dateFormat: string; // "DD/MM/YYYY"
    timeFormat: '12h' | '24h';
    allowMultiUnit: boolean;
    shareClientsAcrossUnits: boolean;
    requireTwoFactor: boolean;
    allowStaffDataAccess: boolean;
    enableWhatsAppIntegration: boolean;

    enableEmailMarketing: boolean;
    enableMarketplace: boolean; // Controla visibilidade
    marketplaceName?: string; // White label "Boutique" name
}

export interface Organization {
    // Identificação
    id: string; // org_abc123
    slug: string; // dr-silva-dermatologia (URL: app.divaspa.com/dr-silva-dermatologia)
    domain?: string; // customdomain.com

    // Informações Básicas
    name: string; // "Dr. Silva Dermatologia"
    displayName: string; // Nome exibido no sistema
    logo?: string; // URL do logo
    favicon?: string; // URL do favicon
    primaryColor?: string; // Cor primária da marca (#8B5CF6)
    secondaryColor?: string; // Cor secundária

    // Tipo de Organização
    type: OrganizationType;

    // Plano e Assinatura
    subscriptionPlanId: string; // ID do plano atual
    subscriptionStatus: SubscriptionStatus;
    subscriptionStartedAt?: string;
    trialEndsAt?: string;
    billingCycle: BillingCycle;

    // Limites do Plano
    limits: OrganizationLimits;

    // Uso Atual
    usage: OrganizationUsage;

    // Contato e Proprietário
    owner: OrganizationOwner;

    // Cobrança
    billing: OrganizationBilling;

    // Configurações
    settings: OrganizationSettings;

    // Integrações Externas / IDs
    asaasCustomerId?: string; // ID do cliente no Asaas (cus_...)

    // Metadata
    createdAt: string;
    activatedAt?: string;
    suspendedAt?: string;
    cancelledAt?: string;
    lastActivityAt?: string;

    // Features Flags
    features?: {
        whiteLabel?: boolean; // Marca própria
        customDomain?: boolean; // Domínio personalizado
        apiAccess?: boolean; // Acesso à API
        advancedReports?: boolean; // Relatórios avançados
        multiLanguage?: boolean; // Multi-idioma
    };
}

export type MemberStatus = 'active' | 'invited' | 'pending' | 'disabled';

export interface OrganizationMember {
    id: string;
    organizationId: string;
    userId?: string;
    email: string;
    name: string;
    role: string; // UserRole cast
    status: MemberStatus;
    invitedAt: string;
    joinedAt?: string;
    lastActiveAt?: string;
    avatarUrl?: string;
}

export interface SubscriptionInvoice {
    id: string;
    organizationId: string;
    amount: number;
    currency: 'BRL' | 'USD';
    status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
    dueDate: string;
    paidAt?: string;
    periodStart: string;
    periodEnd: string;
    items: SubscriptionInvoiceItem[];
    subtotal: number;
    tax?: number;
    discount?: number;
    total: number;
    paymentMethod?: string;
    paymentUrl?: string; // Link para pagamento
    invoiceUrl?: string; // Link para visualizar fatura
    createdAt: string;
}

export interface SubscriptionInvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    type: 'subscription' | 'addon' | 'overage';
}

export interface PaymentMethodInfo {
    id: string;
    type: 'credit_card' | 'boleto' | 'pix' | 'debit_card';
    default: boolean;

    // Cartão de Crédito
    cardBrand?: string; // visa, mastercard, etc
    cardLast4?: string;
    cardExpMonth?: number;
    cardExpYear?: number;
    cardHolderName?: string;

    // Boleto/PIX
    autoRenew?: boolean;

    createdAt: string;
}

// ============================================
// USER & AUTHENTICATION
// ============================================

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    STAFF = 'staff',
    FINANCE = 'finance',
    CLIENT = 'client'
}

export interface User {
    uid: string;
    organizationId: string; // ← NOVO: ID da organização do usuário
    email: string;
    displayName: string;
    role: UserRole;
    photoURL?: string;
    staffId?: string;  // ID do profissional (se role === STAFF) - usado para isolamento de dados
    clientId?: string; // ID do cliente (se role === CLIENT) - usado para isolamento de dados
    profileData?: {
        phoneNumber?: string;
        bio?: string;
        preferences?: UserPreferences;
    };
}

export interface UserPreferences {
    notifications: { email: boolean; push: boolean; whatsapp: boolean };
    theme: 'light' | 'dark';
    language: string;
    twoFactorEnabled: boolean;
}

export interface Client {
    clientId: string;
    organizationId: string; // ← NOVO: ID da organização
    userId: string;
    name: string;
    email: string;
    phone: string;
    rfmScore: number;
    behaviorTags: string[];
    lifetimeValue: number;
    fitzpatrickSkinType?: string;
    lastContact?: string;
    referralPoints?: number; // Pontos acumulados por indicações
    loyaltyPoints?: number;  // Novo: Pontos acumulados por serviços (Milhagem)
    channelSource?: string; // Novo: Origem do cliente
    referredBy?: string;    // Novo: ID ou Nome de quem indicou
    cpf?: string;           // Novo: Documento CPF
    rg?: string;            // Novo: RG
    birthDate?: string;     // Novo: Data de Nascimento (ISO)
    gender?: 'female' | 'male' | 'other'; // Novo: Gênero
    profession?: string;    // Novo: Profissão
    address?: {             // Novo: Endereço completo
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    notes?: string;         // Novo: Observações Gerais
    unitId?: string;        // Novo: ID da unidade
    wallet?: ClientWallet;  // Novo: Carteira de Pacotes e Créditos
}

export enum LeadStage {
    NEW = 'New',
    CONTACTED = 'Contacted',
    SCHEDULED = 'Scheduled',
    CONVERTED = 'Converted',
    LOST = 'Lost'
}

export interface SalesLead {
    leadId: string;
    organizationId: string; // ← NOVO: ID da organização
    name: string;
    contact: string;
    stage: LeadStage;
    channelSource: string;
    lastActivity: string;
    notes?: string;
    // Referral Data
    referredByClientId?: string; // ID se for cliente existente
    referrerName?: string;       // Nome se for indicação externa
    referrerPhone?: string;      // Telefone para automação
    unitId?: string;             // Novo: ID da unidade
}

export enum AppointmentStatus {
    CONFIRMED = 'Confirmed',
    SCHEDULED = 'Scheduled',
    COMPLETED = 'Completed',
    IN_PROGRESS = 'In Progress',
    CANCELLED = 'Cancelled'
}

export interface ServiceAppointment {
    appointmentId: string;
    organizationId: string; // ← NOVO: ID da organização
    clientId: string;
    clientName: string;
    staffId: string;
    staffName: string;
    roomId: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    serviceId?: string;
    serviceName: string;
    price: number;
    referralSource?: string;
    unitId?: string; // Novo: ID da unidade
}

export interface Invoice {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
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
    unitId?: string; // Novo: ID da unidade
}

export interface InvoiceItem {
    id: string;
    productId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    type: 'service' | 'product';
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'package' | 'split' | 'boleto' | 'bank_transfer' | 'invoice_30d';

export interface Promotion {
    id: string;
    code: string;
    description: string;
    type: PromotionType;
    value: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usageCount: number;
    active: boolean;
    minSpend?: number;
}

export type PromotionType = 'percentage' | 'fixed_amount';

export interface ClientDocument {
    id: string;
    title: string;
    type: 'consent_term' | 'image_rights' | 'anamnesis' | 'treatment_plan' | 'other';
    content?: string; // HTML ou Markdown do documento
    clientId?: string; // Cliente específico
    templateId?: string; // Template usado
    signedAt: string;
    status: 'signed' | 'pending' | 'expired';
    url: string;
    signatureId?: string; // ID da assinatura digital
    requiresSignature: boolean;
    createdAt?: string;
    expiresAt?: string;
}

export interface ClientPhoto {
    id: string;
    date: string;
    type: 'before' | 'after';
    area: string;
    url: string;
    notes?: string;
}

export interface ClientWallet {
    balance: number;
    activePackages: {
        id: string;          // Unique ID for the package instance
        name: string;
        serviceId?: string;  // Linked Service ID
        sessionsTotal: number;
        sessionsUsed: number;
        expiryDate: string;
    }[];
}

export type RevenueType = 'service' | 'product' | 'mixed';

export interface Transaction {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    description: string;
    category: string;
    revenueType?: RevenueType; // Novo: Classificação Fiscal
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    date: string;
    paymentMethod?: PaymentMethod | 'split';
    unitId?: string; // Novo: ID da unidade
    relatedAppointmentId?: string; // Novo: ID do agendamento relacionado
    payerName?: string; // Novo: Nome do pagador (se não houver agendamento)
    fiscalAccountId?: string; // Conta Fiscal (CNPJ/CPF) vinculada

    // Financial Gateway Info
    gatewayId?: string;
    installments?: number;
    netAmount?: number;
    mdrFee?: number;
    settlementDate?: string;

    // Accounts Payable Info (Expenses)
    supplierId?: string;
    dueDate?: string; // Vencimento
    recurrence?: {
        rule: 'monthly' | 'weekly' | 'yearly';
        currentInstallment: number;
        totalInstallments: number;
        groupId: string; // ID comum para todas as parcelas
    };

    // Fiscal & Payment Info
    sourceAccountId?: string; // Conta de onde saiu/entrou o dinheiro
    fiscalRecordId?: string; // Link para a Nota Fiscal/Recibo
    attachmentUrl?: string; // URL do cupom/nota uploadado
}

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'paid' | 'pending' | 'overdue';

export interface BankAccount {
    id: string;
    organizationId: string;
    name: string; // "Itaú", "Caixa Físico"
    type: 'bank' | 'cash' | 'card_machine';
    balance: number;
    color?: string;
    icon?: string;
}

export interface FiscalAccount {
    id: string;
    organizationId: string;
    name: string; // Razão Social ou Nome Completo
    alias: string; // Nome de Identificação (ex: "CNPJ Serviços", "Dra. Julia")
    document: string; // CNPJ ou CPF
    type: 'clinic_service' | 'marketplace' | 'professional';
    address?: string;
    digitalCertificateInfo?: { // Simulação de certificado
        validTo: string;
        hasPassword?: boolean;
    };
    receivingConfig?: { // Dados de Recebimento
        pixKey?: string;
        pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
        cardMachineLabel?: string; // Identificação da maquininha
    };
    paymentMethods?: string[]; // IDs dos métodos de pagamento vinculados (ex: 'gw_stone_rec')
    isDefault?: boolean;
}

export interface FiscalRecord {
    id: string;
    organizationId: string;
    transactionId: string;
    fiscalAccountId?: string; // Novo: Conta Fiscal emissora
    type: 'NFS-e' | 'NF-e' | 'Recibo';
    status: 'pending' | 'emitted' | 'cancelled' | 'error';
    number?: string; // Número da nota
    series?: string;
    emissionDate?: string;
    amount: number;
    issuerName: string; // Quem emitiu (CPF do profissional ou CNPJ da empresa)
    issuerDocument: string;
    recipientName: string;
    recipientDocument: string;
    verificationCode?: string; // Novo: Código de verificação da nota
    pdfUrl?: string;
    xmlUrl?: string;
}

export interface StaffMember {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    userId: string;
    name: string;
    email?: string;
    phone?: string;
    cpf?: string;
    address?: string;
    photoUrl?: string;
    signature?: string; // Professional signature for documents (e.g., "Dra Carla Dias - CRM 21452-BA|RQE 15461")
    role: string;
    specialties: string[];
    services?: string[]; // IDs of services this staff can perform
    rooms?: string[]; // IDs or names of rooms this staff can use
    status: 'available' | 'busy' | 'break' | 'off';
    commissionRate: number; // Default commission rate
    customCommissionRates?: { [serviceId: string]: number }; // Custom rates per service
    // Banking information for commission payments
    bankingInfo?: {
        bank?: string;
        agency?: string;
        account?: string;
        accountType?: 'checking' | 'savings';
        pixKey?: string;
        pixKeyType?: 'cpf' | 'email' | 'phone' | 'random';
    };
    workSchedule?: {
        monday?: { start: string; end: string };
        tuesday?: { start: string; end: string };
        wednesday?: { start: string; end: string };
        thursday?: { start: string; end: string };
        friday?: { start: string; end: string };
        saturday?: { start: string; end: string };
        sunday?: { start: string; end: string };
    };
    performanceMetrics: {
        monthlyRevenue: number;
        appointmentsCount: number;
        averageTicket: number;
        npsScore: number;
    };
    activeGoals: StaffGoal[];
    unitId?: string; // Novo: ID da unidade principal
    allowedUnits?: string[]; // Novo: IDs das unidades que pode acessar
}

export interface StaffGoal {
    id: string;
    title: string;
    current: number;
    target: number;
    unit: 'currency' | 'count' | 'percentage';
    deadline: string;
}

export interface WorkShift {
    id: string;
    staffId: string;
    date: string;
    type: 'work' | 'off' | 'vacation' | 'sick';
    startTime?: string;
    endTime?: string;
}

export interface Kudo {
    id: string;
    fromStaffId: string;
    fromStaffName: string;
    toStaffId: string;
    toStaffName: string;
    message: string;
    date: string;
    type: 'help' | 'excellence' | 'teamwork';
}

export interface Product {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    name: string; // "Nome Comercial"
    activeIngredients?: string; // "Princípios Ativos"
    presentation?: string; // "Apresentação" (Frasco, Ampola, Caixa)
    contentQuantity?: number; // "Contendo" (ex: 5, 100)
    contentUnit?: string; // "Unidade" (ex: ml, ui, g, un)

    description?: string;
    price: number; // Preço Base de Venda
    costPrice?: number; // Custo Médio
    category: ProductCategory;
    stock?: number; // Estoque Global
    stockByUnit?: { [unitId: string]: number }; // Novo: Estoque por Unidade
    minStockLevel?: number;
    batchNumber?: string; // Lote Atual (informativo)
    expirationDate?: string; // Validade Atual (informativa)
    lastInvoice?: string; // Última NF (informativa)
    supplier?: string;
    isPromotion?: boolean;
    loyaltyPoints?: number;
    unitId?: string; // Se o produto for exclusivo de uma unidade
    serviceReferenceId?: string; // Para pacotes: ID do serviço que este pacote dá direito
    packageSessionCount?: number; // Para pacotes: Número de sessões
}

export type ProductCategory = 'homecare' | 'treatment_package' | 'giftcard' | 'professional_use' | 'medical_material';

// --- MARKETING & CAMPAIGNS ---

export interface CampaignSegment {
    tags?: string[];
    rfmScoreMin?: number;
    rfmScoreMax?: number;
    lastVisitDaysMin?: number; // Clientes que não vêm há X dias
    lastVisitDaysMax?: number;
    serviceCategory?: string; // Já fez 'laser', 'botox', etc
    isBirthday?: boolean; // Aniversariantes do mês
}

export interface CampaignStats {
    sent: number;
    opened: number; // Simulado
    clicked: number; // Simulado
    converted: number; // Agendamentos gerados
}

export interface Campaign {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    name: string;
    type: 'whatsapp' | 'email' | 'sms';
    status: 'draft' | 'scheduled' | 'sent' | 'active';
    segment: CampaignSegment;
    targetCount: number; // Quantos clientes serão atingidos
    content: {
        subject?: string; // Para email
        message: string; // Corpo da mensagem (suporta variáveis {nome_cliente})
    };
    stats: CampaignStats;
    scheduledFor?: string; // ISO date
    sentAt?: string; // ISO date
    createdAt: string;
    createdBy: string; // Staff ID
}

export interface Supplier {
    id: string;
    organizationId: string; // ← Novo: ID da organização
    name: string;
    contact: string; // Generic contact name
    email?: string;
    phone?: string;
    document?: string; // CNPJ or CPF
    rating?: number;
    categories: string[];
    active: boolean;
}

export interface PurchaseOrder {
    id: string;
    supplierId: string;
    supplierName: string;
    status: 'draft' | 'ordered' | 'received';
    date: string;
    itemsCount: number;
    totalCost: number;
    expectedDelivery?: string;
    items: { productId: string; productName: string; quantity: number; unitCost: number }[];
}

export interface StockAudit {
    id: string;
    date: string;
    status: 'in_progress' | 'completed';
    performedBy: string;
    items: StockAuditItem[];
    totalDiscrepancyValue: number;
}

export interface StockAuditItem {
    productId: string;
    productName: string;
    systemQty: number;
    costPrice: number;
    discrepancy: number;
    countedQty?: number;
}

export interface ServiceRoom {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    name: string;
    type: 'treatment' | 'spa' | 'consultation' | 'virtual';
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    currentAppointment?: ServiceAppointment;
    nextAppointmentTime?: string;
    equipments: {
        id: string;
        name: string;
        status: 'operational' | 'maintenance';
        lastMaintenance?: string;
        nextMaintenance?: string;
    }[];
    ambience: { temperature: number; lighting: number; music?: string };
    meetingUrl?: string; // For virtual rooms
    unitId?: string; // Novo: ID da unidade
}

export interface SessionRecord {
    appointmentId: string;
    safetyCheck: any;
    laserParams: any;
    bodyMarkers: any[];
    evolution: string;
}



export interface ServiceCategory {
    id: string;
    name: string;
    color: string;
}

export interface ServiceDefinition {
    id: string;
    organizationId: string;
    name: string;
    category: string;
    duration: number; // minutes
    price: number;
    active: boolean;
    description?: string;
    loyaltyPoints?: number; // Pontos ganhos ao realizar o serviço
    protocol?: ProtocolItem[]; // Insumos consumidos neste serviço
    allowedStaffIds?: string[]; // IDs dos profissionais habilitados
    allowedRoomIds?: string[]; // IDs das salas onde pode ser realizado
}

export interface ProtocolItem {
    productId: string;
    productName: string;
    quantity: number;
    unit?: string;
    unitCost: number;
    optional?: boolean; // If true, excluded from estimated cost calculation
}

export interface FormTemplate {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    title: string;
    type: 'anamnesis' | 'consent' | 'evolution';
    active: boolean;
    createdAt: string;
    fields: FormField[];
}

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    width: 'full' | 'half';
    options?: string[];
    placeholder?: string;
}

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'section_header' | 'signature';

export interface FormResponse {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    formTemplateId: string;
    formTitle: string;
    appointmentId?: string;
    clientId: string;
    clientName: string;
    filledBy: string; // userId do profissional que preencheu
    filledAt: string;
    responses: FieldResponse[];
    signature?: string; // Base64 da assinatura, se houver
}

export interface FieldResponse {
    fieldId: string;
    fieldLabel: string;
    fieldType: FieldType;
    value: string | boolean | string[]; // Suporta diferentes tipos de resposta
}

export interface AppointmentRecord {
    id: string;
    organizationId: string;
    appointmentId: string;
    clientId: string;
    clientName: string;
    serviceId: string;
    serviceName: string;
    professionalId: string;
    professionalName: string;
    date: string;
    duration: number;
    status: AppointmentStatus;

    // Dados clínicos
    clinicalNotes?: string;
    observations?: string;
    reactions?: string;
    parameters?: Record<string, string>; // Ex: { "Potência": "50W", "Tempo": "10min" }
    transcription?: string; // Transcrição da consulta (IA)
    skincarePlan?: string; // Plano de Skincare gerado (IA)

    // Formulários preenchidos nesta sessão
    formResponseIds?: string[]; // IDs dos FormResponse

    // Fotos antes/depois
    beforePhotos?: string[]; // URLs ou base64
    afterPhotos?: string[];

    // Produtos utilizados (já registrado via protocol)
    productsUsed?: { productId: string; productName: string; quantity: number }[];

    // Próxima sessão
    nextSessionDate?: string;
    nextSessionNotes?: string;

    // Metadata
    createdAt: string;
    updatedAt?: string;
}

export interface YieldRule {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    name: string;
    type: 'surge_time' | 'last_minute' | 'seasonality';
    description: string;
    adjustmentPercentage: number;
    condition: string;
    active: boolean;
}

export interface CustomerSegment {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    count: number;
    criteria?: any;
}

export type CampaignChannel = 'email' | 'whatsapp' | 'sms' | 'instagram' | 'in_app';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed';

export interface MarketingCampaign {
    id: string;
    organizationId: string;
    name: string;
    channel: CampaignChannel;
    segmentId: string;
    linkedEventId?: string;
    targetAudience?: string;
    scheduledFor?: string;
    status: CampaignStatus;
    messageContent?: string;
    templateId?: string;
    useWhatsappFlow?: boolean;
    flowId?: string;
    stats: {
        sent: number;
        opened: number;
        converted: number;
        revenue: number;
    };
}

export interface AutomationRule {
    id: string;
    organizationId: string;
    name: string;
    trigger: 'birthday' | 'post_service' | 'abandoned_cart' | 'inactive_30d' | 'lead_stale_24h' | 'new_event';
    action: 'send_message' | 'create_task' | 'notify_team';
    active: boolean;
}

export type ChannelType = 'whatsapp' | 'instagram' | 'email';

export interface ChatConversation {
    id: string;
    organizationId: string; // ← NOVO
    clientId: string;
    clientName: string;
    channel: 'whatsapp' | 'instagram' | 'email';
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    status: 'open' | 'resolved';
    messages: ChatMessage[];
}

export interface ChatMessage {
    id: string;
    content: string;
    sender: 'client' | 'staff' | 'system';
    timestamp: string;
    read: boolean;
}

export type BookingStep = 'service' | 'professional' | 'time' | 'confirm';

export interface TimeSlot {
    time: string;
    available: boolean;
}

export interface MembershipPlan {
    id: string;
    organizationId: string;
    name: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    benefits: string[];
    activeMembers: number;
    colorHex: string;
}

export interface Subscription {
    id: string;
    organizationId: string;
    clientId: string;
    clientName: string;
    planId: string;
    status: 'active' | 'overdue' | 'cancelled';
    nextBillingDate: string;
    paymentMethod: string;
}

export interface AIMessage {
    id: string;
    sender: 'user' | 'ai';
    type: 'text' | 'widget_revenue' | 'widget_client' | 'widget_content' | 'widget_protocol';
    content: string;
    timestamp: Date;
    data?: any;
}

export type MoodType = 'happy' | 'neutral' | 'tired' | 'stressed';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: 'alert' | 'info' | 'success';
    category: 'system' | 'inventory' | 'schedule';
    timestamp: string;
    read: boolean;
    actionLabel?: string;
    actionLink?: string;
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

export interface Asset {
    id: string;
    name: string;
    serialNumber: string;
    purchaseDate: string;
    warrantyExpires: string;
    supplierId: string;
    status: AssetStatus;
    totalShots: number;
    maxShots: number;
    lastMaintenance: string;
    nextMaintenance: string;
    location: string;
}

export type AssetStatus = 'operational' | 'warning' | 'critical' | 'maintenance';

export interface MaintenanceRecord {
    id: string;
    assetId: string;
    assetName: string;
    date: string;
    type: 'preventive' | 'corrective';
    technician: string;
    cost: number;
    notes: string;
    status: 'scheduled' | 'completed';
}

export interface OpsTask {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    category: TaskCategory;
    assignedTo?: string;
    dueDate?: string;
    tags?: string[];
    followers?: string[];
    createdAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = string;

export interface BusinessUnit {
    id: string;
    organizationId: string; // ← NOVO: ID da organização (unidade pertence a uma org)
    name: string;
    location: string; // Formato: "Cidade, Estado" (ex: "Salvador, BA")
    address?: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    contact?: {
        phone: string;
        email: string;
        whatsapp?: string;
    };
    legal?: {
        cnpj: string;
        stateRegistration?: string;
        municipalRegistration?: string;
        cnaePrimary?: string;
        cnaeSecondary?: string; // Comma separated or JSON string
        legalRepresentative?: {
            name: string;
            cpf: string;
            birthDate: string;
        };
    };
    managerName: string;
    managerId?: string; // ID do usuário gerente (para futuro)
    type?: 'own' | 'franchise' | 'partner';
    status: 'operational' | 'implementation' | 'inactive' | 'alert';
    settings?: {
        shareClients: boolean;
        allowTransfers: boolean;
        syncInventory: boolean;
        useGlobalPricing: boolean;
    };
    metrics?: {
        revenue: number;
        revenueMoM: number;
        activeClients: number;
        nps: number;
    };
    // Legacy fields (mantidos para compatibilidade)
    revenue: number;
    revenueMoM: number;
    activeClients: number;
    nps: number;
    createdAt?: Date;
    activatedAt?: Date;
}

export interface Integration {
    id: string;
    name: string;
    category: 'communication' | 'utility' | 'finance' | 'marketing';
    description: string;
    connected: boolean;
    icon: string;
    configRequired: boolean;
}

export interface Webhook {
    id: string;
    event: string;
    url: string;
    status: 'active' | 'inactive';
    lastFired: string;
}

export interface AuditLogEntry {
    id: string;
    action: string;
    module: string;
    performedBy: string;
    role: UserRole;
    timestamp: string;
    details: string;
    ipAddress: string;
}

export interface ClientFeedback {
    id: string;
    clientId: string;
    clientName: string;
    npsScore: number;
    comment: string;
    sentiment: FeedbackSentiment;
    tags: string[];
    date: string;
    status: 'new' | 'resolved' | 'addressed';
    staffMentioned?: string;
}

export type FeedbackSentiment = 'positive' | 'neutral' | 'negative';

export interface OpenVial {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    productId: string;
    productName: string;
    batchNumber: string;
    openedAt: string;
    expiresAfterOpen: number; // hours
    initialUnits: number;
    remainingUnits: number;
    openedBy: string;
}

export interface VialUsageLog {
    id: string;
    vialId: string;
    productName: string;
    unitsUsed: number;
    patientName: string;
    procedure: string;
    timestamp: string;
    staffName: string;
}

export interface PatientFlowEntry {
    id: string;
    clientId: string;
    clientName: string;
    stage: PatientFlowStage;
    enteredStageAt: string;
    serviceName: string;
    staffName: string;
    tags?: string[];
    notes?: string;
}

export type PatientFlowStage = 'reception' | 'prep' | 'procedure' | 'recovery' | 'checkout';

export interface DriveItem {
    id: string;
    name: string;
    type: DriveFileType;
    updatedAt: string;
    owner: string;
    starred: boolean;
    path: { id: string; name: string }[];
    size?: string;
    thumbnailUrl?: string;
}

export type DriveFileType = 'folder' | 'pdf' | 'image' | 'sheet' | 'doc';

export interface WebsiteConfig {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    primaryColor: string;
    showServices: boolean;
    showTeam: boolean;
    showTestimonials: boolean;
    contactPhone: string;
    instagramUrl: string;
    // SEO & Analytics
    googleAnalyticsId?: string;
    metaPixelId?: string;
    seoTitle?: string;
    seoDescription?: string;
}

export interface SaaSAppConfig {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    primaryColor: string;
    // Toggles
    showCalculator: boolean;
    showFeatures: boolean;
    showComparison: boolean;
    showPricing: boolean;
    // SEO
    googleAnalyticsId?: string;
    metaPixelId?: string;
    seoTitle?: string;
    seoDescription?: string;
    contactPhone?: string;

    // Visual Customization
    fontFamily?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    enableThemeToggle?: boolean;
    defaultTheme?: 'dark' | 'light';

    // Section Content
    featuresTitle?: string;
    featuresSubtitle?: string;
    pricingTitle?: string;
    pricingSubtitle?: string;
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaButtonText?: string;
}

export interface Partner {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    name: string;
    type: 'business' | 'influencer';
    contact: string;
    // Referral Program
    code: string;
    commissionRate: number; // % que o parceiro ganha
    clientDiscountRate: number; // % que o cliente ganha
    // Stats
    active: boolean;
    totalReferred: number;
    totalRevenue: number;
    pendingPayout: number;
    totalPaid: number;
    pixKey?: string;
}

export type PartnerType = 'business' | 'influencer';

export interface CallLog {
    id: string;
    caller: string;
    duration: string;
    status: 'booked' | 'question' | 'transfer' | 'missed';
    timestamp: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    transcript: string;
}

export interface ClinicEvent {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    title: string;
    date: string;
    time: string;
    description: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

    // Capacity & Attendance
    capacity: number;
    confirmedCount: number;
    checkInCount: number;

    // Financials
    revenue: number;
    cost: number;

    // Marketing
    bannerUrl?: string;
    price: number; // Ingresso (0 se gratuito)
    location: string; // Sala ou Endereço

    // Social
    feed: EventFeedPost[];

    // Preparation
    checklist?: EventChecklistItem[];
}

export interface EventChecklistItem {
    id: string;
    task: string;
    completed: boolean;
}

export interface EventFeedPost {
    id: string;
    eventId: string;
    authorName: string;
    authorRole: 'staff' | 'admin' | 'system';
    content: string;
    imageUrl?: string;
    timestamp: string;
    likes: number;
}

export interface EventGuest {
    id: string;
    eventId: string;
    clientName: string;
    phone: string;
    status: 'confirmed' | 'invited' | 'no_show' | 'checked_in';
    vip: boolean;
    notes?: string;
    paymentStatus?: 'paid' | 'pending' | 'free' | 'refunded';
    ticketType?: 'standard' | 'vip';
}

export interface ClinicLicense {
    id: string;
    name: string;
    issuer: string;
    expiryDate: string;
    status: 'valid' | 'warning' | 'expired';
}

export interface WasteLog {
    id: string;
    date: string;
    type: 'infectious' | 'sharps' | 'common';
    weight: number;
    collectedBy: string;
    manifestId: string;
    staffSignature: string;
}

export interface StaffHealthRecord {
    staffId: string;
    staffName: string;
    asoExpiry: string;
    vaccines: { name: string; valid: boolean }[];
    status: 'compliant' | 'non_compliant';
}

export interface HelpArticle {
    id: string;
    title: string;
    category: 'finance' | 'clinical' | 'system' | 'getting_started';
    content: string;
    views: number;
}



export interface LinenItem {
    id: string;
    name: string;
    totalQuantity: number;
    statusCounts: {
        clean: number;
        inUse: number;
        dirty: number;
        laundry: number;
    };
    costPerWash: number;
    lifespanWashes: number;
    currentWashes: number;
}

export interface LaundryTransaction {
    id: string;
    date: string;
    type: 'send' | 'receive';
    laundryName: string;
    items: { itemName: string; quantity: number }[];
    totalWeight?: number;
    cost?: number;
}

export interface JobOpening {
    id: string;
    title: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    department: string;
    location: string;
    status: 'open' | 'closed';
    applicantsCount: number;
    createdAt: string;
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    roleApplied: string;
    jobId: string;
    stage: CandidateStage;
    resumeUrl: string;
    appliedDate: string;
    rating?: number;
    notes?: string;
}

export type CandidateStage = 'new' | 'screening' | 'interview' | 'practical_test' | 'offer' | 'hired' | 'rejected';

export interface Course {
    id: string;
    title: string;
    description: string;
    category: CourseCategory;
    thumbnail: string;
    instructor: string;
    totalLessons: number;
    completedLessons: number;
    duration: string;
    tags: string[];
    lessons: Lesson[];
}

export type CourseCategory = 'onboarding' | 'technical' | 'sales' | 'service';

export interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
    correctOptionIndex: number;
}

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'text' | 'quiz';
    completed: boolean;
    questions?: QuizQuestion[];
    minScore?: number; // Minimum correct answers to pass
}

export interface WaitlistItem {
    id: string;
    organizationId: string; // ← NOVO: ID da organização
    clientName: string;
    service: string;
    preference: string;
    priority: 'high' | 'medium' | 'low';
}

export interface BusinessConfig {
    name: string;
    phone: string;
    address: string;
    workingHours: Record<string, { open: string; close: string; active: boolean }>;
}

export interface NotificationConfig {
    appointmentConfirmation: string;
    appointmentReminder: string;
}

export interface DataContextType {
    clients: Client[];
    leads: SalesLead[];
    appointments: ServiceAppointment[];
    transactions: Transaction[];
    waitlist: WaitlistItem[];
    staff: StaffMember[];
    members: OrganizationMember[]; // New: Team Members
    rooms: ServiceRoom[];
    taskCategories: string[];
    serviceCategories: ServiceCategory[]; // New: Service Categories
    addServiceCategory: (category: ServiceCategory) => void;
    removeServiceCategory: (id: string) => void;
    services: ServiceDefinition[];
    businessConfig: BusinessConfig;
    notificationConfig: NotificationConfig;
    products: Product[];
    courses: Course[];
    addCourse: (course: Course) => void;
    updateCourse: (id: string, data: Partial<Course>) => void;
    addProduct: (product: Omit<Product, 'organizationId'>) => void;
    updateProduct: (id: string, data: Partial<Product>) => void;
    addClient: (client: Omit<Client, 'organizationId'>) => void;
    updateClient: (clientId: string, data: Partial<Client>) => void;
    addLead: (lead: Omit<SalesLead, 'organizationId'>) => void;
    updateLeadStage: (id: string, stage: LeadStage) => void;
    updateLead: (id: string, data: Partial<SalesLead>) => void;
    removeLead: (id: string) => void;
    addAppointment: (appt: Omit<ServiceAppointment, 'organizationId'>) => void;
    updateAppointment: (appt: ServiceAppointment) => void;
    updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
    deleteAppointment: (id: string) => void;
    addTransaction: (transaction: Omit<Transaction, 'organizationId'>) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    addToWaitlist: (item: Omit<WaitlistItem, 'organizationId'>) => void;
    removeFromWaitlist: (id: string) => void;
    updateRoomStatus: (id: string, status: string) => void;
    updateRoomEquipments: (roomId: string, equipments: any[]) => void;
    addRoom: (room: Omit<ServiceRoom, 'organizationId'>) => void;
    removeRoom: (id: string) => void;
    addTaskCategory: (category: string) => void;
    removeTaskCategory: (category: string) => void;
    addStaff: (staff: Omit<StaffMember, 'organizationId'>) => void;
    updateStaff: (id: string, updates: Partial<StaffMember>) => void;
    removeStaff: (id: string) => void;

    // Team Management
    inviteMember: (email: string, role: string, name: string) => void;
    updateMemberRole: (memberId: string, role: string) => void;
    removeMember: (memberId: string) => void;

    toggleRoom: (roomId: string) => void;
    addService: (service: Omit<ServiceDefinition, 'organizationId'>) => void;
    toggleService: (id: string) => void;
    deleteService: (id: string) => void;
    updateService: (id: string, data: Partial<ServiceDefinition>) => void;
    partners: Partner[];
    addPartner: (partner: Omit<Partner, 'organizationId'>) => void;
    updatePartner: (id: string, data: Partial<Partner>) => void;
    updateBusinessConfig: (config: BusinessConfig) => void;
    updateNotificationConfig: (config: NotificationConfig) => void;
    websiteConfig: WebsiteConfig;
    updateWebsiteConfig: (config: WebsiteConfig) => void;
    saasAppConfig: SaaSAppConfig;
    updateSaaSAppConfig: (config: SaaSAppConfig) => void;
    updateProductStock: (productId: string, qty: number, type: 'add' | 'remove', unitId?: string) => void;
    yieldRules: YieldRule[];
    addYieldRule: (rule: Omit<YieldRule, 'organizationId'>) => void;
    updateYieldRule: (id: string, data: Partial<YieldRule>) => void;
    deleteYieldRule: (id: string) => void;
    updateUser: (data: Partial<User>) => void;
    currentUser: User | null;
    login: (role: UserRole, realUser?: User) => void;
    logout: () => void;
    formTemplates: FormTemplate[];
    addFormTemplate: (template: Omit<FormTemplate, 'organizationId'>) => void;
    updateFormTemplate: (id: string, data: Partial<FormTemplate>) => void;
    deleteFormTemplate: (id: string) => void;
    formResponses: FormResponse[];
    addFormResponse: (response: Omit<FormResponse, 'organizationId'>) => void;
    getClientFormResponses: (clientId: string) => FormResponse[];
    appointmentRecords: AppointmentRecord[];
    addAppointmentRecord: (record: AppointmentRecord) => void;
    updateAppointmentRecord: (id: string, data: Partial<AppointmentRecord>) => void;
    getAppointmentRecord: (appointmentId: string) => AppointmentRecord | undefined;
    units: BusinessUnit[];
    addUnit: (unit: Omit<BusinessUnit, 'organizationId'>) => void;
    updateUnit: (id: string, data: Partial<BusinessUnit>) => void;
    removeUnit: (id: string) => void;
    selectedUnitId: string | 'all';
    setSelectedUnitId: (id: string | 'all') => void;
    events: ClinicEvent[];
    addEvent: (event: Omit<ClinicEvent, 'organizationId'>) => void;
    updateEvent: (event: ClinicEvent) => void;
    guests: EventGuest[];
    addGuest: (guest: EventGuest) => void;
    updateGuest: (id: string, data: Partial<EventGuest>) => void;

    // Accounts & Fiscal
    saasLeads: SaaSLead[];
    addSaaSLead: (lead: SaaSLead) => Promise<void>;
    updateSaaSLead: (id: string, data: Partial<SaaSLead>) => Promise<void>;

    addSaaSTask: (task: Omit<SaaSTask, 'id'>) => Promise<void>;
    toggleSaaSTask: (taskId: string, leadId: string, currentStatus: boolean) => Promise<void>;
    deleteSaaSTask: (taskId: string, leadId: string) => Promise<void>;

    // SaaS Operations (Implementation, Support, Features)
    implementationProjects: ImplementationProject[];
    addImplementationProject: (project: ImplementationProject) => Promise<void>;
    updateImplementationProject: (id: string, data: Partial<ImplementationProject>) => Promise<void>;

    supportTickets: SupportTicket[];
    addSupportTicket: (ticket: SupportTicket) => Promise<void>;
    updateSupportTicket: (id: string, data: Partial<SupportTicket>) => Promise<void>;

    featureRequests: FeatureRequest[];
    addFeatureRequest: (request: FeatureRequest) => Promise<void>;
    updateFeatureRequest: (id: string, data: Partial<FeatureRequest>) => Promise<void>;

    saasSubscribers: SaaSSubscriber[];
    updateSaaSSubscriber: (id: string, data: Partial<SaaSSubscriber>) => Promise<void>;




    // Auth & User
    user: User | null;

    // Accounts & Fiscal
    accounts: BankAccount[];
    addAccount: (account: BankAccount) => void;
    updateAccount: (id: string, data: Partial<BankAccount>) => void;

    fiscalRecords: FiscalRecord[];
    addFiscalRecord: (record: FiscalRecord) => void;
    updateFiscalRecord: (id: string, data: Partial<FiscalRecord>) => void;

    fiscalAccounts: FiscalAccount[];
    addFiscalAccount: (account: FiscalAccount) => void;
    updateFiscalAccount: (id: string, data: Partial<FiscalAccount>) => void;

    // Pharmacy
    vials: OpenVial[];
    addVial: (vial: Omit<OpenVial, 'organizationId'>) => void;
    updateVial: (id: string, updates: Partial<OpenVial>) => void;
    removeVial: (id: string) => void;
    vialUsageLogs: VialUsageLog[];
    addVialUsageLog: (log: VialUsageLog) => void;

    // Marketing
    campaigns: MarketingCampaign[];
    addCampaign: (campaign: Omit<MarketingCampaign, 'organizationId'>) => void;
    updateCampaign: (id: string, data: Partial<MarketingCampaign>) => void;
    removeCampaign: (id: string) => void;
    automations: AutomationRule[];
    addAutomation: (automation: AutomationRule) => void;
    updateAutomation: (id: string, data: Partial<AutomationRule>) => void;
    removeAutomation: (id: string) => void;
    segments: CustomerSegment[];
    addSegment: (segment: CustomerSegment) => void;
    updateSegment: (id: string, data: Partial<CustomerSegment>) => void;
    removeSegment: (id: string) => void;

    // Loyalty
    membershipPlans: MembershipPlan[];
    addMembershipPlan: (plan: MembershipPlan) => void;
    updateMembershipPlan: (id: string, data: Partial<MembershipPlan>) => void;
    removeMembershipPlan: (id: string) => void;
    subscriptions: Subscription[];
    addSubscription: (subscription: Subscription) => void;
    updateSubscription: (id: string, data: Partial<Subscription>) => void;
    cancelSubscription: (id: string) => void;

    // Suppliers (Inventory & Finance)
    suppliers: Supplier[];
    addSupplier: (supplier: Omit<Supplier, 'organizationId'>) => void;
    updateSupplier: (id: string, data: Partial<Supplier>) => void;
    removeSupplier: (id: string) => void;

    // Communication
    conversations: ChatConversation[];
    addMessage: (conversationId: string, message: ChatMessage) => void;
    markConversationAsRead: (conversationId: string) => void;
    createConversation: (conversation: ChatConversation) => void;

    // Notifications
    notifications: AppNotification[];
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;

    // Treatment Plans
    treatmentPlans: TreatmentPlan[];
    treatmentTemplates: TreatmentPlanTemplate[];
    addTreatmentPlan: (plan: TreatmentPlan) => void;
    updateTreatmentPlan: (plan: TreatmentPlan) => void;
    addTreatmentTemplate: (template: TreatmentPlanTemplate) => void;
}

// ============================================
// PORTAL DO PACIENTE & ASSINATURA DIGITAL
// ============================================

export interface ClientAccessToken {
    id: string;
    clientId: string;
    token: string; // UUID único
    expiresAt: string;
    createdAt: string;
    usedAt?: string;
    purpose: 'document_signature' | 'portal_access';
    documentIds?: string[]; // IDs dos documentos que podem ser assinados com este token
}

export interface DocumentSignature {
    id: string;
    documentId: string;
    clientId: string;
    signatureData: string; // Base64 da assinatura desenhada
    signedAt: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface DocumentTemplate {
    id: string;
    title: string;
    type: 'consent_term' | 'image_rights' | 'anamnesis' | 'treatment_plan' | 'other';
    content: string; // HTML template com variáveis {{clientName}}, {{date}}, etc.
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// TREATMENT PLANS & SALES PIPELINE (Module Vendas)
// ============================================

export type TreatmentPriority = 'high' | 'medium' | 'low';
export type TreatmentItemStatus = 'pending' | 'paid' | 'scheduled' | 'completed';
export type PlanStatus = 'prescribed' | 'negotiating' | 'closed' | 'partially_paid' | 'completed' | 'lost';

export interface TreatmentPlanItem {
    id: string; // ID único do item no plano
    serviceId: string; // ID do serviço (ServiceDefinition)
    serviceName: string; // Nome cacheado
    quantity: number; // Quantas sessões
    sessionsUsed: number; // Controle de consumo
    priority: TreatmentPriority;
    periodicity?: string; // Ex: "A cada 4 meses"
    unitPrice: number; // Preço unitário no momento da criação
    totalPrice: number; // unitPrice * quantity
    status: TreatmentItemStatus;
}

export interface TreatmentPlan {
    id: string;
    organizationId: string;
    clientId: string; // Paciente
    clientName: string;
    professionalId: string; // Médico que prescreveu
    professionalName: string;

    name: string; // "Plano Anual da Beleza"
    description?: string;

    items: TreatmentPlanItem[];

    // Valores
    subtotal: number;
    discount: number;
    total: number;

    // CRM
    status: PlanStatus; // Status geral do plano
    pipelineStage: string; // "Novo", "Apresentado", "Negociação", "Fechado"

    createdAt: string;
    updatedAt: string;
    validDh?: string; // Validade da proposta
}

export interface TreatmentPlanTemplate {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    items: {
        serviceId: string; // Referência se existir, ou apenas nome/categoria
        serviceName: string; // Fallback
        quantity: number;
        priority: TreatmentPriority;
        periodicity?: string;
    }[];
}


// ============================================
// ASAAS INTEGRATION TYPES
// ============================================

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
