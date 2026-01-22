// ============================================
// DATA CONTEXT TYPE
// ============================================

import type {
    Client,
    SalesLead,
    LeadStage,
    ServiceAppointment,
    AppointmentStatus,
    Transaction,
    WaitlistItem,
    StaffMember,
    OrganizationMember,
    ServiceRoom,
    ServiceCategory,
    ServiceDefinition,
    Product,
    Course,
    BusinessConfig,
    NotificationConfig,
    Partner,
    WebsiteConfig,
    SaaSAppConfig,
    YieldRule,
    User,
    UserRole,
    FormTemplate,
    FormResponse,
    AppointmentRecord,
    BusinessUnit,
    ClinicEvent,
    EventGuest,
    BankAccount,
    FiscalRecord,
    FiscalAccount,
    OpenVial,
    VialUsageLog,
    MarketingCampaign,
    AutomationRule,
    CustomerSegment,
    MembershipPlan,
    Subscription,
    Supplier,
    ChatConversation,
    ChatMessage,
    AppNotification,
    TreatmentPlan,
    TreatmentPlanTemplate,
    SaaSLead,
    SaaSTask,
    SaaSSubscriber,
    ImplementationProject,
    SupportTicket,
    FeatureRequest
} from './index';

export interface DataContextType {
    // Loading States
    isLoading: boolean;
    isSaaSLoading: boolean;

    // Clients & Leads
    clients: Client[];
    leads: SalesLead[];
    addClient: (client: Omit<Client, 'organizationId'>) => void;
    updateClient: (clientId: string, data: Partial<Client>) => void;
    addLead: (lead: Omit<SalesLead, 'organizationId'>) => void;
    updateLeadStage: (id: string, stage: LeadStage) => void;
    updateLead: (id: string, data: Partial<SalesLead>) => void;
    removeLead: (id: string) => void;

    // Appointments
    appointments: ServiceAppointment[];
    addAppointment: (appt: Omit<ServiceAppointment, 'organizationId'>) => void;
    updateAppointment: (appt: ServiceAppointment) => void;
    updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
    deleteAppointment: (id: string) => void;

    // Transactions
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'organizationId'>) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;

    // Waitlist
    waitlist: WaitlistItem[];
    addToWaitlist: (item: Omit<WaitlistItem, 'organizationId'>) => void;
    removeFromWaitlist: (id: string) => void;

    // Staff
    staff: StaffMember[];
    addStaff: (staff: Omit<StaffMember, 'organizationId'>) => void;
    updateStaff: (id: string, updates: Partial<StaffMember>) => void;
    removeStaff: (id: string) => void;

    // Team Members
    members: OrganizationMember[];
    inviteMember: (email: string, role: string, name: string) => void;
    updateMemberRole: (memberId: string, role: string) => void;
    removeMember: (memberId: string) => void;

    // Rooms
    rooms: ServiceRoom[];
    updateRoomStatus: (id: string, status: string) => void;
    updateRoomEquipments: (roomId: string, equipments: any[]) => void;
    addRoom: (room: Omit<ServiceRoom, 'organizationId'>) => void;
    removeRoom: (id: string) => void;
    toggleRoom: (roomId: string) => void;

    // Services
    taskCategories: string[];
    serviceCategories: ServiceCategory[];
    services: ServiceDefinition[];
    addServiceCategory: (category: ServiceCategory) => void;
    removeServiceCategory: (id: string) => void;
    addTaskCategory: (category: string) => void;
    removeTaskCategory: (category: string) => void;
    addService: (service: Omit<ServiceDefinition, 'organizationId'>) => void;
    toggleService: (id: string) => void;
    deleteService: (id: string) => void;
    updateService: (id: string, data: Partial<ServiceDefinition>) => void;

    // Products
    products: Product[];
    addProduct: (product: Omit<Product, 'organizationId'>) => void;
    updateProduct: (id: string, data: Partial<Product>) => void;
    updateProductStock: (productId: string, qty: number, type: 'add' | 'remove', unitId?: string) => void;

    // Courses
    courses: Course[];
    addCourse: (course: Course) => void;
    updateCourse: (id: string, data: Partial<Course>) => void;

    // Partners
    partners: Partner[];
    addPartner: (partner: Omit<Partner, 'organizationId'>) => void;
    updatePartner: (id: string, data: Partial<Partner>) => void;

    // Configuration
    businessConfig: BusinessConfig;
    notificationConfig: NotificationConfig;
    websiteConfig: WebsiteConfig;
    saasAppConfig: SaaSAppConfig;
    updateBusinessConfig: (config: BusinessConfig) => void;
    updateNotificationConfig: (config: NotificationConfig) => void;
    updateWebsiteConfig: (config: WebsiteConfig) => void;
    updateSaaSAppConfig: (config: SaaSAppConfig) => void;

    // Yield Management
    yieldRules: YieldRule[];
    addYieldRule: (rule: Omit<YieldRule, 'organizationId'>) => void;
    updateYieldRule: (id: string, data: Partial<YieldRule>) => void;
    deleteYieldRule: (id: string) => void;

    // Auth & User
    currentUser: User | null;
    user: User | null;
    login: (role: UserRole, realUser?: User) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;

    // Forms
    formTemplates: FormTemplate[];
    addFormTemplate: (template: Omit<FormTemplate, 'organizationId'>) => void;
    updateFormTemplate: (id: string, data: Partial<FormTemplate>) => void;
    deleteFormTemplate: (id: string) => void;
    formResponses: FormResponse[];
    addFormResponse: (response: Omit<FormResponse, 'organizationId'>) => void;
    getClientFormResponses: (clientId: string) => FormResponse[];

    // Appointment Records
    appointmentRecords: AppointmentRecord[];
    addAppointmentRecord: (record: AppointmentRecord) => void;
    updateAppointmentRecord: (id: string, data: Partial<AppointmentRecord>) => void;
    getAppointmentRecord: (appointmentId: string) => AppointmentRecord | undefined;

    // Units
    units: BusinessUnit[];
    addUnit: (unit: Omit<BusinessUnit, 'organizationId'>) => void;
    updateUnit: (id: string, data: Partial<BusinessUnit>) => void;
    removeUnit: (id: string) => void;
    selectedUnitId: string | 'all';
    setSelectedUnitId: (id: string | 'all') => void;

    // Events
    events: ClinicEvent[];
    addEvent: (event: Omit<ClinicEvent, 'organizationId'>) => void;
    updateEvent: (event: ClinicEvent) => void;
    guests: EventGuest[];
    addGuest: (guest: EventGuest) => void;
    updateGuest: (id: string, data: Partial<EventGuest>) => void;

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

    // Suppliers
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

    // SaaS Operations
    saasLeads: SaaSLead[];
    addSaaSLead: (lead: SaaSLead) => Promise<boolean>;
    updateSaaSLead: (id: string, data: Partial<SaaSLead>) => Promise<void>;
    addSaaSTask: (task: Omit<SaaSTask, 'id'>) => Promise<void>;
    toggleSaaSTask: (taskId: string, leadId: string, currentStatus: boolean) => Promise<void>;
    deleteSaaSTask: (taskId: string, leadId: string) => Promise<void>;
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
}
