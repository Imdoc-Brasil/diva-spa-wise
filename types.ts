
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
  serviceName: string;
  price: number;
  referralSource?: string;
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
  status: 'paid' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    type: 'service' | 'product';
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'package';

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
    signedAt: string;
    status: 'signed' | 'pending';
    url: string;
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
}

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'paid' | 'pending' | 'overdue';

export interface StaffMember {
    id: string;
    userId: string;
    name: string;
    role: string;
    specialties: string[];
    status: 'available' | 'busy' | 'break' | 'off';
    commissionRate: number;
    performanceMetrics: {
      monthlyRevenue: number;
      appointmentsCount: number;
      averageTicket: number;
      npsScore: number;
    };
    activeGoals: StaffGoal[];
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
    stock?: number;
    minStockLevel?: number;
    batchNumber?: string;
    expirationDate?: string;
    supplier?: string;
    isPromotion?: boolean;
}

export type ProductCategory = 'homecare' | 'treatment_package' | 'giftcard' | 'professional_use';

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
    type: 'treatment' | 'spa' | 'consultation';
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    currentAppointment?: ServiceAppointment;
    nextAppointmentTime?: string;
    equipments: { id: string; name: string; status: 'operational' | 'maintenance' }[];
    ambience: { temperature: number; lighting: number; music?: string };
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

export interface YieldRule {
    id: string;
    name: string;
    type: 'surge_time' | 'last_minute' | 'seasonality';
    description: string;
    adjustmentPercentage: number;
    condition: string;
    active: boolean;
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
    location: string;
    managerName: string;
    revenue: number;
    revenueMoM: number;
    activeClients: number;
    nps: number;
    status: 'operational' | 'alert';
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
    path: {id: string; name: string}[];
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
}

export interface EventGuest {
    id: string;
    eventId: string;
    clientName: string;
    phone: string;
    status: 'confirmed' | 'invited' | 'no_show' | 'checked_in';
    vip: boolean;
    notes?: string;
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
    vaccines: {name: string; valid: boolean}[];
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
  addAppointment: (appt: ServiceAppointment) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
  addToWaitlist: (item: WaitlistItem) => void;
  removeFromWaitlist: (id: string) => void;
  updateRoomStatus: (id: string, status: string) => void;
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
  updateBusinessConfig: (config: BusinessConfig) => void;
  updateNotificationConfig: (config: NotificationConfig) => void;
  updateProductStock: (productId: string, qty: number, type: 'add' | 'remove') => void;
}
