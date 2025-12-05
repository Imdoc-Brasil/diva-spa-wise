
export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    STAFF = 'staff',
    FINANCE = 'finance',
    CLIENT = 'client'
}

export interface User {
    uid: string;
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
    unitId?: string;        // Novo: ID da unidade
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

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'package' | 'split';

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
        name: string;
        sessionsTotal: number;
        sessionsUsed: number;
        expiryDate: string;
    }[];
}

export interface Transaction {
    id: string;
    description: string;
    category: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    date: string;
    paymentMethod?: PaymentMethod | 'split';
    unitId?: string; // Novo: ID da unidade
    relatedAppointmentId?: string; // Novo: ID do agendamento relacionado
}

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'paid' | 'pending' | 'overdue';

export interface StaffMember {
    id: string;
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
    name: string;
    description?: string;
    price: number;
    costPrice?: number;
    category: ProductCategory;
    stock?: number; // Estoque Global (Legado ou Consolidado)
    stockByUnit?: { [unitId: string]: number }; // Novo: Estoque por Unidade
    minStockLevel?: number;
    batchNumber?: string;
    expirationDate?: string;
    supplier?: string;
    isPromotion?: boolean;
    loyaltyPoints?: number;
    unitId?: string; // Se o produto for exclusivo de uma unidade
}

export type ProductCategory = 'homecare' | 'treatment_package' | 'giftcard' | 'professional_use';

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
    name: string;
    contact: string;
    email: string;
    rating: number;
    categories: string[];
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
}

export interface SessionRecord {
    appointmentId: string;
    safetyCheck: any;
    laserParams: any;
    bodyMarkers: any[];
    evolution: string;
}

export interface ServiceDefinition {
    id: string;
    name: string;
    category: 'laser' | 'esthetics' | 'spa' | 'injectables';
    duration: number; // minutes
    price: number;
    active: boolean;
    description?: string;
    loyaltyPoints?: number; // Pontos ganhos ao realizar o serviço
    protocol?: ProtocolItem[]; // Insumos consumidos neste serviço
}

export interface ProtocolItem {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    unitCost: number;
}

export interface FormTemplate {
    id: string;
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
    name: string;
    type: 'surge_time' | 'last_minute' | 'seasonality';
    description: string;
    adjustmentPercentage: number;
    condition: string;
    active: boolean;
}

export interface CustomerSegment {
    id: string;
    name: string;
    description: string;
    count: number;
    criteria?: any;
}

export type CampaignChannel = 'email' | 'whatsapp' | 'sms' | 'instagram';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed';

export interface MarketingCampaign {
    id: string;
    name: string;
    channel: CampaignChannel;
    segmentId: string;
    scheduledFor?: string;
    status: CampaignStatus;
    stats: {
        sent: number;
        opened: number;
        converted: number;
        revenue: number;
    };
}

export interface AutomationRule {
    id: string;
    name: string;
    trigger: 'birthday' | 'post_service' | 'abandoned_cart' | 'inactive_30d' | 'lead_stale_24h';
    action: 'send_message' | 'create_task' | 'notify_team';
    active: boolean;
}

export type ChannelType = 'whatsapp' | 'instagram' | 'email';

export interface ChatConversation {
    id: string;
    clientId: string;
    clientName: string;
    channel: ChannelType;
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
    name: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    benefits: string[];
    activeMembers: number;
    colorHex: string;
}

export interface Subscription {
    id: string;
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
}

export interface Partner {
    id: string;
    name: string;
    type: PartnerType;
    contact: string;
    code: string;
    commissionRate: number;
    clientDiscountRate: number;
    active: boolean;
    totalReferred: number;
    totalRevenue: number;
    pendingPayout: number;
    totalPaid: number;
    pixKey: string;
}

export type PartnerType = 'business' | 'influencer' | 'client';

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
    title: string;
    date: string;
    time: string;
    description: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    capacity: number;
    confirmedCount: number;
    checkInCount: number;
    revenue: number;
    cost: number;
    bannerUrl: string;
    price?: number; // Preço do ingresso
    location?: string;
    feed?: EventFeedPost[];
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

export interface SupportTicket {
    id: string;
    subject: string;
    status: 'open' | 'closed' | 'pending';
    priority: 'high' | 'medium' | 'low';
    createdAt: string;
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

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'text' | 'quiz';
    completed: boolean;
}

export interface WaitlistItem {
    id: string;
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
    rooms: ServiceRoom[];
    taskCategories: string[];
    services: ServiceDefinition[];
    businessConfig: BusinessConfig;
    notificationConfig: NotificationConfig;
    products: Product[];
    addClient: (client: Client) => void;
    updateClient: (clientId: string, data: Partial<Client>) => void;
    addLead: (lead: SalesLead) => void;
    updateLeadStage: (id: string, stage: LeadStage) => void;
    updateLead: (id: string, data: Partial<SalesLead>) => void;
    removeLead: (id: string) => void;
    addAppointment: (appt: ServiceAppointment) => void;
    updateAppointment: (appt: ServiceAppointment) => void;
    updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
    deleteAppointment: (id: string) => void;
    addTransaction: (transaction: Transaction) => void;
    addToWaitlist: (item: WaitlistItem) => void;
    removeFromWaitlist: (id: string) => void;
    updateRoomStatus: (id: string, status: string) => void;
    updateRoomEquipments: (roomId: string, equipments: any[]) => void;
    addRoom: (room: ServiceRoom) => void;
    removeRoom: (id: string) => void;
    addTaskCategory: (category: string) => void;
    removeTaskCategory: (category: string) => void;
    addStaff: (staff: StaffMember) => void;
    updateStaff: (id: string, data: Partial<StaffMember>) => void;
    removeStaff: (id: string) => void;
    addService: (service: ServiceDefinition) => void;
    toggleService: (id: string) => void;
    deleteService: (id: string) => void;
    updateService: (id: string, data: Partial<ServiceDefinition>) => void;
    partners: Partner[];
    addPartner: (partner: Partner) => void;
    updatePartner: (id: string, data: Partial<Partner>) => void;
    updateBusinessConfig: (config: BusinessConfig) => void;
    updateNotificationConfig: (config: NotificationConfig) => void;
    websiteConfig: WebsiteConfig;
    updateWebsiteConfig: (config: WebsiteConfig) => void;
    updateProductStock: (productId: string, qty: number, type: 'add' | 'remove', unitId?: string) => void;
    yieldRules: YieldRule[];
    addYieldRule: (rule: YieldRule) => void;
    updateYieldRule: (id: string, data: Partial<YieldRule>) => void;
    deleteYieldRule: (id: string) => void;
    updateUser: (data: Partial<User>) => void;
    currentUser: User | null;
    login: (role: UserRole) => void;
    logout: () => void;
    formTemplates: FormTemplate[];
    addFormTemplate: (template: FormTemplate) => void;
    updateFormTemplate: (id: string, data: Partial<FormTemplate>) => void;
    deleteFormTemplate: (id: string) => void;
    formResponses: FormResponse[];
    addFormResponse: (response: FormResponse) => void;
    getClientFormResponses: (clientId: string) => FormResponse[];
    appointmentRecords: AppointmentRecord[];
    addAppointmentRecord: (record: AppointmentRecord) => void;
    updateAppointmentRecord: (id: string, data: Partial<AppointmentRecord>) => void;
    getAppointmentRecord: (appointmentId: string) => AppointmentRecord | undefined;
    units: BusinessUnit[];
    addUnit: (unit: BusinessUnit) => void;
    updateUnit: (id: string, data: Partial<BusinessUnit>) => void;
    removeUnit: (id: string) => void;
    selectedUnitId: string | 'all';
    setSelectedUnitId: (id: string | 'all') => void;
    events: ClinicEvent[];
    addEvent: (event: ClinicEvent) => void;
    updateEvent: (event: ClinicEvent) => void;
    guests: EventGuest[];
    addGuest: (guest: EventGuest) => void;
    updateGuest: (id: string, data: Partial<EventGuest>) => void;

    // Pharmacy
    vials: OpenVial[];
    addVial: (vial: OpenVial) => void;
    updateVial: (id: string, updates: Partial<OpenVial>) => void;
    removeVial: (id: string) => void;
    vialUsageLogs: VialUsageLog[];
    addVialUsageLog: (log: VialUsageLog) => void;

    // Marketing
    campaigns: MarketingCampaign[];
    addCampaign: (campaign: MarketingCampaign) => void;
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

