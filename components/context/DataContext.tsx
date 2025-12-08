import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Client, SalesLead, ServiceAppointment, AppointmentStatus, LeadStage, Transaction, WaitlistItem, StaffMember, OrganizationMember, ServiceRoom, DataContextType, ServiceDefinition, BusinessConfig, NotificationConfig, Product, BusinessUnit, YieldRule, FormTemplate, FormResponse, AppointmentRecord, ClinicEvent, EventGuest, Partner, WebsiteConfig, SaaSAppConfig, User, UserRole, AppNotification, OpenVial, VialUsageLog, MarketingCampaign, AutomationRule, CustomerSegment, MembershipPlan, Subscription, ChatConversation, ChatMessage, TreatmentPlan, TreatmentPlanTemplate, Supplier, BankAccount, FiscalRecord, SaaSLead, SaaSSubscriber, SaaSLeadStage, SaaSPlan } from '../../types';
import { MOCK_TREATMENT_PLANS, MOCK_TREATMENT_TEMPLATES } from '../../utils/mockTreatmentPlans';
import { useToast } from '../ui/ToastContext';
import { useOrganization } from './OrganizationContext';

const initialSuppliers: Supplier[] = [
  { id: 'sup1', organizationId: 'org_demo', name: 'DermoTech Labs', contact: '(11) 4444-5555', email: 'pedidos@dermotech.com', rating: 4.8, categories: ['Dermocosméticos'], active: true },
  { id: 'sup2', organizationId: 'org_demo', name: 'MedHospitalar', contact: '(11) 3333-2222', email: 'vendas@med.com.br', rating: 4.2, categories: ['Descartáveis', 'Profissional'], active: true },
  { id: 'sup3', organizationId: 'org_demo', name: 'VitaSkin Pro', contact: '(21) 9999-8888', email: 'comercial@vitaskin.com', rating: 5.0, categories: ['Home Care', 'Luxo'], active: true },
];

// --- HELPER FUNCTIONS ---
const createUser = (role: UserRole): User => {
  let name = 'Admin User';
  let staffId: string | undefined = undefined;
  let clientId: string | undefined = undefined;

  if (role === UserRole.CLIENT) {
    name = 'Julia Cliente';
    clientId = 'c1';
  }
  if (role === UserRole.STAFF) {
    name = 'Dra. Julia Martins';
    staffId = 's1';
  }
  if (role === UserRole.FINANCE) {
    name = 'Carlos Financeiro';
  }

  return {
    uid: `mock-${role}-id`,
    organizationId: 'org_demo',
    email: `${role}@divaspa.com`,
    displayName: name,
    role: role,
    staffId: staffId,
    clientId: clientId,
    photoURL: '',
    profileData: {
      phoneNumber: '(11) 99999-9999',
      bio: 'Profissional Diva Spa',
      preferences: {
        notifications: { email: true, push: true, whatsapp: false },
        theme: 'light',
        language: 'pt-BR',
        twoFactorEnabled: false
      }
    }
  };
};

// --- INITIAL MOCK DATA (Centralized) ---

const initialClients: Client[] = [
  {
    clientId: '1',
    organizationId: 'org_demo',
    userId: 'u1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    phone: '(11) 99999-9999',
    rfmScore: 85,
    behaviorTags: ['VIP', 'Laser Perna'],
    lifetimeValue: 3500,
    lastContact: '2023-10-25',
    referralPoints: 150,
    loyaltyPoints: 300,
    unitId: 'u1',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    birthDate: '1990-05-15',
    gender: 'female',
    profession: 'Advogada',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 101',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    notes: 'Cliente prefere horários pela manhã.'
  },
  {
    clientId: '2',
    organizationId: 'org_demo',
    userId: 'u2',
    name: 'Beatriz Costa',
    email: 'bia@example.com',
    phone: '(11) 98888-8888',
    rfmScore: 40,
    behaviorTags: ['Novo Paciente'],
    lifetimeValue: 200,
    lastContact: '2023-10-20',
    referralPoints: 0,
    loyaltyPoints: 0,
    unitId: 'u2',
    cpf: '987.654.321-00',
    birthDate: '1995-10-20',
    gender: 'female',
    notes: 'Primeira vez fazendo laser.'
  },
  {
    clientId: '3',
    organizationId: 'org_demo',
    userId: 'u3',
    name: 'Carla Dias',
    email: 'carla@example.com',
    phone: '(11) 97777-7777',
    rfmScore: 65,
    behaviorTags: ['Botox', 'Frequente'],
    lifetimeValue: 1200,
    lastContact: '2023-10-15',
    referralPoints: 50,
    loyaltyPoints: 100,
    unitId: 'u1'
  },
];

const initialLeads: SalesLead[] = [
  { leadId: 'l1', organizationId: 'org_demo', name: 'Juliana Paes', contact: '(21) 9999-0000', stage: LeadStage.NEW, channelSource: 'instagram', lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), notes: 'Interessada em pacote corporal' },
  { leadId: 'l2', organizationId: 'org_demo', name: 'Fernanda Lima', contact: 'fernanda@mail.com', stage: LeadStage.CONTACTED, channelSource: 'whatsapp', lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), notes: 'Agendou avaliação, falta confirmar' },
  { leadId: 'l3', organizationId: 'org_demo', name: 'Mariana Ximenes', contact: 'mari@mail.com', stage: LeadStage.SCHEDULED, channelSource: 'referral', lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Avaliação confirmada' },
  { leadId: 'l4', organizationId: 'org_demo', name: 'Cláudia Raia', contact: 'claudia@mail.com', stage: LeadStage.CONVERTED, channelSource: 'website', lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Fechou pacote 10 sessões' },
  { leadId: 'l5', organizationId: 'org_demo', name: 'Patricia Pillar', contact: 'pat@mail.com', stage: LeadStage.NEW, channelSource: 'instagram', lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(), notes: 'Dúvida sobre Botox' },
  { leadId: 'l8', organizationId: 'org_demo', name: 'João Oliveira', contact: '(11) 98888-7777', stage: LeadStage.NEW, channelSource: 'instagram', lastActivity: new Date().toISOString(), notes: 'Paciente com interesse em pacotes corporais' },
];

const initialAppointments: ServiceAppointment[] = [
  { appointmentId: '1', organizationId: 'org_demo', clientId: '1', clientName: 'Ana Silva', staffId: 's1', staffName: 'Dra. Julia', roomId: 'Sala 01 - Laser', startTime: '2023-10-27T09:00:00', endTime: '2023-10-27T10:00:00', status: AppointmentStatus.CONFIRMED, serviceName: 'Depilação a Laser - Perna Inteira', price: 250, unitId: 'u1' },
  { appointmentId: '2', organizationId: 'org_demo', clientId: '2', clientName: 'Beatriz Costa', staffId: 's2', staffName: 'Est. Carla', roomId: 'Sala 02 - Facial', startTime: '2023-10-27T10:30:00', endTime: '2023-10-27T11:30:00', status: AppointmentStatus.SCHEDULED, serviceName: 'Limpeza de Pele Profunda', price: 150, unitId: 'u2' },
  { appointmentId: '3', organizationId: 'org_demo', clientId: '3', clientName: 'Carla Dias', staffId: 's1', staffName: 'Dra. Julia', roomId: 'Sala 01 - Laser', startTime: '2023-10-27T11:00:00', endTime: '2023-10-27T11:30:00', status: AppointmentStatus.COMPLETED, serviceName: 'Botox (3 Regiões)', price: 0, unitId: 'u1' },
  { appointmentId: '4', organizationId: 'org_demo', clientId: '4', clientName: 'Diana Prince', staffId: 's3', staffName: 'Dra. Julia', roomId: 'Sala 03 - Corporal', startTime: '2023-10-27T14:00:00', endTime: '2023-10-27T15:30:00', status: AppointmentStatus.IN_PROGRESS, serviceName: 'Massagem Relaxante', price: 200, unitId: 'u3' },
  { appointmentId: '5', organizationId: 'org_demo', clientId: '5', clientName: 'Fernanda Souza', staffId: 's1', staffName: 'Dra. Julia', roomId: 'Online (Tele)', startTime: '2023-10-27T16:00:00', endTime: '2023-10-27T16:30:00', status: AppointmentStatus.CONFIRMED, serviceName: 'Avaliação Facial Online', price: 100, unitId: 'u1' },
];

const initialTransactions: Transaction[] = [
  { id: 't1', organizationId: 'org_demo', description: 'Pacote Laser - 10 Sessões', category: 'Serviços', amount: 2500, type: 'income', status: 'paid', date: '2023-10-26', unitId: 'u1', revenueType: 'service' },
  { id: 't2', organizationId: 'org_demo', description: 'Reposição de Estoque (Dermocosméticos)', category: 'Material', amount: 850, type: 'expense', status: 'paid', date: '2023-10-25', unitId: 'u2' },
  { id: 't3', organizationId: 'org_demo', description: 'Manutenção Ar Condicionado', category: 'Manutenção', amount: 300, type: 'expense', status: 'pending', date: '2023-10-27', unitId: 'u2' },
  { id: 't4', organizationId: 'org_demo', description: 'Venda Produto Home Care', category: 'Produtos', amount: 450, type: 'income', status: 'paid', date: '2023-10-26', unitId: 'u1', revenueType: 'product' },
  { id: 't5', organizationId: 'org_demo', description: 'Comissão Staff (Dra. Julia)', category: 'Comissão', amount: 1200, type: 'expense', status: 'pending', date: '2023-10-30', unitId: 'u1' },
  { id: 't6', organizationId: 'org_demo', description: 'Botox Full Face', category: 'Serviços', amount: 1800, type: 'income', status: 'overdue', date: '2023-10-20', unitId: 'u1', revenueType: 'service' },
];

const initialWaitlist: WaitlistItem[] = [
  { id: 'w1', organizationId: 'org_demo', clientName: 'Fernanda Souza', service: 'Laser Full Body', preference: 'Qualquer horário tarde', priority: 'high' },
  { id: 'w2', organizationId: 'org_demo', clientName: 'Mariana Ximenes', service: 'Botox', preference: 'Preferência Sala 01', priority: 'medium' },
];

const initialMembers: OrganizationMember[] = [
  {
    id: 'mem_1',
    organizationId: 'org_demo',
    userId: 'user_admin',
    name: 'Admin Demo',
    email: 'admin@divaspa.com',
    role: 'admin',
    status: 'active',
    invitedAt: '2023-01-01T00:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin'
  },
  {
    id: 'mem_2',
    organizationId: 'org_demo',
    userId: 'u_staff1',
    name: 'Dra. Julia Martins',
    email: 'julia@divaspa.com',
    role: 'staff',
    status: 'active',
    invitedAt: '2023-02-01T00:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=julia'
  }
];

const initialStaff: StaffMember[] = [
  {
    id: 's1',
    organizationId: 'org_demo',
    userId: 'u_staff1',
    name: 'Dra. Julia Martins',
    role: 'Biomédica',
    specialties: ['Laser', 'Botox', 'Preenchimento'],
    status: 'busy',
    commissionRate: 0.15,
    performanceMetrics: {
      monthlyRevenue: 28500,
      appointmentsCount: 42,
      averageTicket: 678,
      npsScore: 92
    },
    activeGoals: [
      { id: 'g1', title: 'Faturamento Mensal', current: 28500, target: 35000, unit: 'currency', deadline: '2023-10-31' },
      { id: 'g2', title: 'Venda de Home Care', current: 8, target: 15, unit: 'count', deadline: '2023-10-31' }
    ]
  },
  {
    id: 's2',
    organizationId: 'org_demo',
    userId: 'u_staff2',
    name: 'Carla Dias',
    role: 'Esteticista',
    specialties: ['Limpeza de Pele', 'Drenagem', 'Massagem'],
    status: 'available',
    commissionRate: 0.10,
    performanceMetrics: {
      monthlyRevenue: 12400,
      appointmentsCount: 56,
      averageTicket: 220,
      npsScore: 88
    },
    activeGoals: [
      { id: 'g3', title: 'Faturamento Mensal', current: 12400, target: 15000, unit: 'currency', deadline: '2023-10-31' },
      { id: 'g4', title: 'Avaliações Google', current: 4, target: 10, unit: 'count', deadline: '2023-10-31' }
    ]
  },
  {
    id: 's3',
    organizationId: 'org_demo',
    userId: 'u_staff3',
    name: 'Fernanda Souza',
    role: 'Recepcionista',
    specialties: ['Atendimento', 'Vendas'],
    status: 'available',
    commissionRate: 0.02, // Sobre vendas gerais
    performanceMetrics: {
      monthlyRevenue: 5400, // Indireta
      appointmentsCount: 0,
      averageTicket: 0,
      npsScore: 95
    },
    activeGoals: [
      { id: 'g5', title: 'Taxa de Conversão de Leads', current: 65, target: 80, unit: 'percentage', deadline: '2023-10-31' }
    ]
  }
];

const initialRooms: ServiceRoom[] = [
  {
    id: 'r1',
    organizationId: 'org_demo',
    name: 'Sala 01 - Laser Master',
    type: 'treatment',
    status: 'occupied',
    nextAppointmentTime: '15:30',
    equipments: [
      { id: 'eq1', name: 'Laser Galaxy 808', status: 'operational' },
      { id: 'eq2', name: 'Resfriador Cryo', status: 'operational' }
    ],
    ambience: { temperature: 22, lighting: 80, music: 'Nature Sounds' }
  },
  {
    id: 'r2',
    organizationId: 'org_demo',
    name: 'Sala 02 - Facial',
    type: 'treatment',
    status: 'available',
    nextAppointmentTime: '14:00',
    equipments: [
      { id: 'eq3', name: 'Vapor de Ozônio', status: 'operational' },
      { id: 'eq4', name: 'Alta Frequência', status: 'maintenance' }
    ],
    ambience: { temperature: 24, lighting: 50, music: 'Jazz Lounge' }
  },
  {
    id: 'r3',
    organizationId: 'org_demo',
    name: 'Sala 03 - Corporal',
    type: 'spa',
    status: 'cleaning',
    nextAppointmentTime: '14:15',
    equipments: [
      { id: 'eq5', name: 'Manta Térmica', status: 'operational' }
    ],
    ambience: { temperature: 25, lighting: 30 }
  },
  {
    id: 'r4',
    organizationId: 'org_demo',
    name: 'Consultório A',
    type: 'consultation',
    status: 'maintenance',
    equipments: [],
    ambience: { temperature: 23, lighting: 100 }
  },
  {
    id: 'r5',
    organizationId: 'org_demo',
    name: 'Consultório B',
    type: 'consultation',
    status: 'available',
    equipments: [],
    ambience: { temperature: 23, lighting: 100 }
  },
  {
    id: 'r6',
    organizationId: 'org_demo',
    name: 'Online (Tele)',
    type: 'virtual',
    status: 'available',
    equipments: [],
    ambience: { temperature: 0, lighting: 0 },
    meetingUrl: 'https://meet.divaspa.com.br'
  }
];

const initialServices: ServiceDefinition[] = [
  { id: '1', organizationId: 'org_demo', name: 'Depilação a Laser - Perna Inteira', category: 'laser', duration: 45, price: 250.00, active: true, loyaltyPoints: 50 },
  { id: '2', organizationId: 'org_demo', name: 'Limpeza de Pele Profunda', category: 'esthetics', duration: 60, price: 180.00, active: true, loyaltyPoints: 30 },
  { id: '3', organizationId: 'org_demo', name: 'Botox (3 Regiões)', category: 'injectables', duration: 30, price: 1200.00, active: true, loyaltyPoints: 200 },
  { id: '4', organizationId: 'org_demo', name: 'Massagem Relaxante', category: 'spa', duration: 50, price: 150.00, active: true, loyaltyPoints: 20 },
];

const initialPartners: Partner[] = [
  { id: 'p1', organizationId: 'org_demo', name: 'Bella Fitness', type: 'business', contact: '(11) 99999-1111', code: 'BELLA10', commissionRate: 10, clientDiscountRate: 5, active: true, totalReferred: 0, totalRevenue: 0, pendingPayout: 0, totalPaid: 0, pixKey: 'cnpj@bella.fit' },
  { id: 'p2', organizationId: 'org_demo', name: 'Influencer Gabi', type: 'influencer', contact: '@gabistyle', code: 'GABI20', commissionRate: 15, clientDiscountRate: 10, active: true, totalReferred: 0, totalRevenue: 0, pendingPayout: 0, totalPaid: 0, pixKey: 'gabi@mail.com' },
];

const initialConversations: ChatConversation[] = [
  {
    id: 'c1',
    organizationId: 'org_demo',
    clientId: 'cl1',
    clientName: 'Ana Silva',
    channel: 'whatsapp',
    lastMessage: 'Gostaria de agendar uma avaliação para Laser.',
    lastMessageTime: '10:30',
    unreadCount: 2,
    status: 'open',
    messages: [
      { id: 'm1', content: 'Olá, bom dia! Gostaria de saber valores do Laser.', sender: 'client', timestamp: '10:25', read: true },
      { id: 'm2', content: 'Olá Ana! Temos pacotes a partir de R$ 89,90. Qual área te interessa?', sender: 'system', timestamp: '10:26', read: true },
      { id: 'm3', content: 'Gostaria de agendar uma avaliação para Laser.', sender: 'client', timestamp: '10:30', read: false },
    ]
  },
  {
    id: 'c2',
    organizationId: 'org_demo',
    clientId: 'cl2',
    clientName: 'Beatriz Costa',
    channel: 'instagram',
    lastMessage: 'Obrigada!',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
    status: 'resolved',
    messages: [
      { id: 'm4', content: 'Vocês têm horário para hoje?', sender: 'client', timestamp: '14:00', read: true },
      { id: 'm5', content: 'Oi Beatriz! Temos às 16h com a Dra. Julia.', sender: 'staff', timestamp: '14:10', read: true },
      { id: 'm6', content: 'Perfeito, vou querer.', sender: 'client', timestamp: '14:12', read: true },
      { id: 'm7', content: 'Agendado! Te esperamos.', sender: 'staff', timestamp: '14:15', read: true },
      { id: 'm8', content: 'Obrigada!', sender: 'client', timestamp: '14:16', read: true },
    ]
  }
];

const initialYieldRules: YieldRule[] = [
  { id: 'yr1', organizationId: 'org_demo', name: 'Horário de Pico', type: 'surge_time', description: 'Aumento de 15% em horários nobres (18h-21h)', adjustmentPercentage: 15, condition: 'time_range:18:00-21:00', active: true },
  { id: 'yr2', organizationId: 'org_demo', name: 'Última Hora', type: 'last_minute', description: 'Desconto de 20% para agendamentos no mesmo dia', adjustmentPercentage: -20, condition: 'booking_window:<24h', active: true },
];

const initialFormTemplates: FormTemplate[] = [
  {
    id: 'f1',
    organizationId: 'org_demo',
    title: 'Anamnese Facial Padrão',
    type: 'anamnesis',
    active: true,
    createdAt: '2023-09-01',
    fields: [
      { id: 'field1', type: 'section_header', label: 'Dados Pessoais', required: false, width: 'full' },
      { id: 'field2', type: 'text', label: 'Profissão', required: false, width: 'full' },
      { id: 'field3', type: 'select', label: 'Fototipo (Fitzpatrick)', required: true, options: ['I', 'II', 'III', 'IV', 'V', 'VI'], width: 'half' },
    ]
  }
];

const initialBusinessConfig: BusinessConfig = {
  name: 'Diva Spa - Unidade Jardins',
  phone: '(11) 99999-9999',
  address: 'Rua Oscar Freire, 1234',
  workingHours: {
    'Segunda': { open: '09:00', close: '19:00', active: true },
    'Terça': { open: '09:00', close: '19:00', active: true },
    'Quarta': { open: '09:00', close: '19:00', active: true },
    'Quinta': { open: '09:00', close: '19:00', active: true },
    'Sexta': { open: '09:00', close: '19:00', active: true },
    'Sábado': { open: '09:00', close: '14:00', active: true },
  }
};

const initialNotifications: AppNotification[] = [
  {
    id: 'n0',
    title: 'Atenção: Leads Estagnados',
    message: '3 Leads no estágio "Novos" não receberam contato nas últimas 24 horas.',
    type: 'alert',
    category: 'system',
    timestamp: 'Agora',
    read: false,
    actionLabel: 'Ver Funil',
    actionLink: '/funnel'
  },
  {
    id: 'n1',
    title: 'Estoque Baixo',
    message: 'Toxina Botulínica (Botox) atingiu o nível mínimo (2 un).',
    type: 'alert',
    category: 'inventory',
    timestamp: '5 min atrás',
    read: false,
    actionLabel: 'Repor',
    actionLink: '/marketplace'
  },
  {
    id: 'n2',
    title: 'Agendamento Confirmado',
    message: 'Ana Silva confirmou presença para amanhã às 14h.',
    type: 'success',
    category: 'schedule',
    timestamp: '1 hora atrás',
    read: true
  }
];

const initialNotificationConfig: NotificationConfig = {
  appointmentConfirmation: "Olá {nome_paciente}! Seu agendamento na Diva Spa está confirmado para {data} às {horario}. Procedimento: {servico}. Estamos ansiosos para te ver!",
  appointmentReminder: "Oi {nome_paciente}, passando para lembrar do seu momento Diva amanhã às {horario}. Caso precise remarcar, avise com antecedência! 💆‍♀️"
};

const initialWebsiteConfig: WebsiteConfig = {
  heroTitle: 'Realce Sua Beleza Natural',
  heroSubtitle: 'Tecnologia avançada em estética e depilação a laser para você se sentir única.',
  heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
  primaryColor: '#14808C',
  showServices: true,
  showTeam: true,
  showTestimonials: true,
  contactPhone: '(11) 99999-9999',
  instagramUrl: '@divaspa'
};

const initialSaaSAppConfig: SaaSAppConfig = {
  heroTitle: "Não é apenas gestão. É o Futuro da Sua Clínica.",
  heroSubtitle: "Abandone planilhas e softwares do passado. O I'mdoc usa Inteligência Artificial para lotar sua agenda, fidelizar pacientes e automatizar seu financeiro enquanto você dorme.",
  heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  primaryColor: "#9333ea", // Purple-600
  showCalculator: true,
  showFeatures: true,
  showComparison: true,
  showPricing: true,
  googleAnalyticsId: "",
  metaPixelId: "",
  contactPhone: "(11) 99999-9999"
};

const initialProducts: Product[] = [
  { id: 'p1', organizationId: 'org_demo', name: 'Kit Pós-Laser Calmante', description: 'Loção hidratante e gel refrescante.', price: 189.90, costPrice: 85.00, category: 'homecare', stock: 15, stockByUnit: { 'u1': 10, 'u2': 5 }, minStockLevel: 20, loyaltyPoints: 20 },
  { id: 'p2', organizationId: 'org_demo', name: 'Pacote 10 Sessões - Axila', description: 'Tratamento completo.', price: 890.00, category: 'treatment_package', loyaltyPoints: 100 },
  { id: 'p3', organizationId: 'org_demo', name: 'Sérum Vitamina C 20%', description: 'Antioxidante potente.', price: 245.00, costPrice: 110.00, category: 'homecare', stock: 8, stockByUnit: { 'u1': 3, 'u2': 5 }, minStockLevel: 10, loyaltyPoints: 25 },
];

const initialUnits: BusinessUnit[] = [
  {
    id: 'u1',
    organizationId: 'org_demo',
    name: 'Diva Jardins (Matriz)',
    location: 'São Paulo, SP',
    managerName: 'Ana G.',
    revenue: 145000,
    revenueMoM: 12,
    activeClients: 1200,
    nps: 92,
    status: 'operational',
    type: 'own'
  },
  {
    id: 'u2',
    organizationId: 'org_demo',
    name: 'Diva Moema',
    location: 'São Paulo, SP',
    managerName: 'Carlos R.',
    revenue: 98000,
    revenueMoM: -5,
    activeClients: 850,
    nps: 88,
    status: 'alert',
    type: 'own'
  },
  {
    id: 'u3',
    organizationId: 'org_demo',
    name: 'Diva Leblon',
    location: 'Rio de Janeiro, RJ',
    managerName: 'Mariana X.',
    revenue: 112000,
    revenueMoM: 8,
    activeClients: 940,
    nps: 95,
    status: 'operational',
    type: 'franchise'
  },
  {
    id: 'u4',
    organizationId: 'org_demo',
    name: 'Diva Savassi',
    location: 'Belo Horizonte, MG',
    managerName: 'Fernanda S.',
    revenue: 45000,
    revenueMoM: 20,
    activeClients: 300,
    nps: 90,
    status: 'operational',
    type: 'franchise'
  },
];

const initialEvents: ClinicEvent[] = [
  {
    id: 'ev1',
    organizationId: 'org_demo',
    title: 'Laser Day - Novembro',
    date: '2023-11-15',
    time: '09:00 - 19:00',
    description: 'Dia exclusivo para depilação a laser com condições especiais e coquetel.',
    status: 'upcoming',
    capacity: 50,
    confirmedCount: 32,
    checkInCount: 0,
    revenue: 15000,
    cost: 2000,
    bannerUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop',
    price: 150,
    location: 'Diva Spa Jardins - Auditório',
    feed: [
      { id: 'p1', eventId: 'ev1', authorName: 'Dra. Julia', authorRole: 'staff', content: 'Ansiosa para nosso encontro! Teremos novidades exclusivas.', timestamp: '2023-11-10T10:00:00', likes: 12 },
      { id: 'p2', eventId: 'ev1', authorName: 'Sistema', authorRole: 'system', content: 'Cronograma atualizado: Coffee break às 10h30.', timestamp: '2023-11-12T14:00:00', likes: 5 }
    ]
  },
  {
    id: 'ev2',
    organizationId: 'org_demo',
    title: 'Workshop Skincare & Glow',
    date: '2023-11-20',
    time: '14:00 - 17:00',
    description: 'Aula prática de cuidados com a pele com a Dra. Julia.',
    status: 'upcoming',
    capacity: 15,
    confirmedCount: 15,
    checkInCount: 0,
    revenue: 4500,
    cost: 500,
    bannerUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop',
    price: 300,
    location: 'Sala de Treinamento',
    feed: []
  },
  {
    id: 'ev3',
    organizationId: 'org_demo',
    title: 'Botox Day Outubro',
    date: '2023-10-10',
    time: '09:00 - 18:00',
    description: 'Maratona de Toxina Botulínica.',
    status: 'completed',
    capacity: 40,
    confirmedCount: 38,
    checkInCount: 36,
    revenue: 45000,
    cost: 12000,
    bannerUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop',
    price: 1200,
    location: 'Consultórios 1, 2 e 3',
    feed: []
  }
];

const initialGuests: EventGuest[] = [
  { id: 'g1', eventId: 'ev1', clientName: 'Ana Silva', phone: '(11) 99999-9999', status: 'confirmed', vip: true, notes: 'Interesse em Full Body', paymentStatus: 'paid', ticketType: 'vip' },
  { id: 'g2', eventId: 'ev1', clientName: 'Beatriz Costa', phone: '(11) 98888-8888', status: 'invited', vip: false, paymentStatus: 'pending', ticketType: 'standard' },
  { id: 'g3', eventId: 'ev1', clientName: 'Carla Dias', phone: '(11) 97777-7777', status: 'no_show', vip: false, paymentStatus: 'paid', ticketType: 'standard' },
  { id: 'g4', eventId: 'ev1', clientName: 'Fernanda Lima', phone: '(11) 96666-6666', status: 'checked_in', vip: true, paymentStatus: 'free', ticketType: 'vip' },
];

const initialTaskCategories = ['Admin', 'Manutenção', 'Limpeza', 'Compras', 'Contato'];

const initialVials: OpenVial[] = [
  { id: 'v1', organizationId: 'org_demo', productId: 'prod_botox', productName: 'Toxina Botulínica A (Botox)', batchNumber: 'L-8892', openedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), expiresAfterOpen: 72, initialUnits: 100, remainingUnits: 60, openedBy: 'Dra. Julia' },
  { id: 'v2', organizationId: 'org_demo', productId: 'prod_dysport', productName: 'Dysport 300U', batchNumber: 'D-5521', openedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), expiresAfterOpen: 72, initialUnits: 300, remainingUnits: 120, openedBy: 'Dra. Julia' },
];

const initialVialUsageLogs: VialUsageLog[] = [
  { id: 'u1', vialId: 'v1', productName: 'Botox', unitsUsed: 40, patientName: 'Ana Silva', procedure: 'Terço Superior', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), staffName: 'Dra. Julia' },
];

const initialCampaigns: MarketingCampaign[] = [
  {
    id: 'c1',
    organizationId: 'org_demo',
    name: 'Promoção Relâmpago: Botox Week',
    channel: 'whatsapp',
    segmentId: 's1',
    status: 'active',
    stats: { sent: 1500, opened: 1200, converted: 85, revenue: 25500 }
  },
  {
    id: 'c2',
    organizationId: 'org_demo',
    name: 'Lançamento: Protocolo Verão',
    channel: 'email',
    segmentId: 's1',
    status: 'scheduled',
    scheduledFor: '2023-11-01T10:00:00',
    stats: { sent: 0, opened: 0, converted: 0, revenue: 0 }
  },
];

const initialSaaSLeads: SaaSLead[] = [
  {
    id: 'sl1',
    name: 'Dra. Mariana Costa',
    clinicName: 'Clínica Dermato Costa',
    email: 'mariana.costa@clinic.com',
    phone: '(11) 98765-4321',
    stage: SaaSLeadStage.NEW,
    planInterest: SaaSPlan.GROWTH,
    source: 'landing_page',
    status: 'active',
    notes: 'Interessada em automação de WhatsApp.',
    estimatedValue: 597,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sl2',
    name: 'Dr. Fernando Silva',
    clinicName: 'Silva Estética',
    email: 'dr.fernando@silva.com',
    phone: '(21) 91234-5678',
    stage: SaaSLeadStage.DEMO_SCHEDULED,
    planInterest: SaaSPlan.EMPIRE,
    source: 'referral',
    status: 'active',
    notes: 'Agendado demo para próxima terça. Possui 3 unidades.',
    estimatedValue: 997,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sl3',
    name: 'Carla Perez',
    clinicName: 'Spa da Carla',
    email: 'carla@spa.com',
    phone: '(71) 99999-0000',
    stage: SaaSLeadStage.TRIAL_STARTED,
    planInterest: SaaSPlan.START,
    source: 'landing_page',
    status: 'active',
    notes: 'Trial iniciado ontem.',
    estimatedValue: 297,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialSaaSSubscribers: SaaSSubscriber[] = [
  {
    id: 'org_demo',
    clinicName: 'Diva Spa Demonstração',
    adminName: 'Admin Demo',
    adminEmail: 'admin@divaspa.com',
    adminPhone: '(11) 99999-9999',
    plan: SaaSPlan.EMPIRE,
    status: 'active',
    mrr: 997,
    joinedAt: '2023-01-01T00:00:00Z',
    nextBillingDate: '2023-12-01T00:00:00Z',
    usersCount: 5,
    smsBalance: 500
  },
  {
    id: 'sub_2',
    clinicName: 'Royal Face Jardins',
    adminName: 'Dra. Ana Vilela',
    adminEmail: 'ana@royalface.com',
    adminPhone: '(11) 98888-7777',
    plan: SaaSPlan.GROWTH,
    status: 'active',
    mrr: 597,
    joinedAt: '2023-06-15T00:00:00Z',
    nextBillingDate: '2023-11-15T00:00:00Z',
    usersCount: 3,
    smsBalance: 120
  }
];


const initialAutomations: AutomationRule[] = [
  { id: 'auto1', organizationId: 'org_demo', name: 'Feliz Aniversário', trigger: 'birthday', action: 'send_message', active: true },
  { id: 'auto2', organizationId: 'org_demo', name: 'Reativação 30d', trigger: 'inactive_30d', action: 'send_message', active: true },
  { id: 'auto3', organizationId: 'org_demo', name: 'Pós-Venda Laser', trigger: 'post_service', action: 'create_task', active: false },
  { id: 'auto4', organizationId: 'org_demo', name: 'Alerta Lead Frio', trigger: 'lead_stale_24h', action: 'notify_team', active: true },
];

const initialSegments: CustomerSegment[] = [
  { id: 's1', organizationId: 'org_demo', name: 'VIPs (Gasto > 5k)', count: 45, description: 'Clientes com alto ticket médio' },
  { id: 's2', organizationId: 'org_demo', name: 'Aniversariantes Mês', count: 12, description: 'Aniversário em Novembro' },
  { id: 's3', organizationId: 'org_demo', name: 'Inativos (60d)', count: 89, description: 'Sem visitas há 60 dias' },
];

const initialMembershipPlans: MembershipPlan[] = [
  { id: 'mp1', organizationId: 'org_demo', name: 'Diva Prime', price: 99.90, billingCycle: 'monthly', benefits: ['10% OFF em Laser', 'Agendamento Prioritário'], activeMembers: 15, colorHex: '#D4AF37' },
  { id: 'mp2', organizationId: 'org_demo', name: 'Diva Elite', price: 199.90, billingCycle: 'monthly', benefits: ['20% OFF em Tudo', 'Consultas Grátis'], activeMembers: 5, colorHex: '#000000' },
  { id: 'mp3', organizationId: 'org_demo', name: 'Club Botox', price: 990.00, billingCycle: 'yearly', benefits: ['3 Aplicações/ano', 'Retoque Incluso'], activeMembers: 20, colorHex: '#7C3AED' },
];

const initialSubscriptions: Subscription[] = [
  { id: 'sub1', organizationId: 'org_demo', clientId: 'c1', clientName: 'Fernanda Lima', planId: 'mp1', status: 'active', nextBillingDate: '2023-11-25', paymentMethod: 'Credit Card' },
  { id: 'sub2', organizationId: 'org_demo', clientId: 'c2', clientName: 'Juliana Paes', planId: 'mp2', status: 'overdue', nextBillingDate: '2023-11-20', paymentMethod: 'Credit Card' },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { organization } = useOrganization();
  const currentOrgId = organization?.id || 'org_demo';

  // Helper for Persistence
  const loadState = <T,>(key: string, fallback: T): T => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  };

  const [clients, setClients] = useState<Client[]>(() => loadState('clients', initialClients));
  const [leads, setLeads] = useState<SalesLead[]>(() => loadState('leads', initialLeads));
  const [appointments, setAppointments] = useState<ServiceAppointment[]>(() => loadState('appointments', initialAppointments));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('transactions', initialTransactions));
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>(() => loadState('waitlist', initialWaitlist));
  const [members, setMembers] = useState<OrganizationMember[]>(() => loadState('members', initialMembers));
  const [staff, setStaff] = useState<StaffMember[]>(() => loadState('staff', initialStaff));
  const [rooms, setRooms] = useState<ServiceRoom[]>(() => loadState('rooms', initialRooms));
  const [taskCategories, setTaskCategories] = useState<string[]>(() => loadState('taskCategories', initialTaskCategories));
  const [vials, setVials] = useState<OpenVial[]>(() => loadState('vials', initialVials));
  const [vialUsageLogs, setVialUsageLogs] = useState<VialUsageLog[]>(() => loadState('vialUsageLogs', initialVialUsageLogs));
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => loadState('campaigns', initialCampaigns));
  const [automations, setAutomations] = useState<AutomationRule[]>(() => loadState('automations', initialAutomations));
  const [segments, setSegments] = useState<CustomerSegment[]>(() => loadState('segments', initialSegments));
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(() => loadState('membershipPlans', initialMembershipPlans));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadState('subscriptions', initialSubscriptions));
  // Treatment Plans
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(() => loadState('treatmentPlans', MOCK_TREATMENT_PLANS));
  const [treatmentTemplates, setTreatmentTemplates] = useState<TreatmentPlanTemplate[]>(() => loadState('treatmentTemplates', MOCK_TREATMENT_TEMPLATES));
  const [services, setServices] = useState<ServiceDefinition[]>(() => loadState('services', initialServices));
  const [partners, setPartners] = useState<Partner[]>(() => loadState('partners', initialPartners));
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => loadState('businessConfig', initialBusinessConfig));
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>(() => loadState('notificationConfig', initialNotificationConfig));
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(() => loadState('websiteConfig', initialWebsiteConfig));
  const [saasAppConfig, setSaaSAppConfig] = useState<SaaSAppConfig>(() => loadState('saasAppConfig', initialSaaSAppConfig));
  const [products, setProducts] = useState<Product[]>(() => loadState('products', initialProducts));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadState('suppliers', initialSuppliers));
  const [yieldRules, setYieldRules] = useState<YieldRule[]>(() => loadState('yieldRules', initialYieldRules));
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>(() => loadState('formTemplates', initialFormTemplates));
  const [formResponses, setFormResponses] = useState<FormResponse[]>(() => loadState('formResponses', []));
  const [appointmentRecords, setAppointmentRecords] = useState<AppointmentRecord[]>(() => loadState('appointmentRecords', []));
  const [units, setUnits] = useState<BusinessUnit[]>(() => loadState('units', initialUnits));
  const [selectedUnitId, setSelectedUnitId] = useState<string | 'all'>(() => loadState('selectedUnitId', 'all'));
  const [events, setEvents] = useState<ClinicEvent[]>(() => loadState('events', initialEvents));
  const [guests, setGuests] = useState<EventGuest[]>(() => loadState('guests', initialGuests));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadState('notifications', initialNotifications));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('currentUser', null));

  // Accounts & Fiscal
  const initialAccounts: BankAccount[] = [
    { id: 'acc1', organizationId: 'org_demo', name: 'Caixa Físico / Gaveta', type: 'cash', balance: 0, color: '#10B981', icon: 'wallet' },
    { id: 'acc2', organizationId: 'org_demo', name: 'Banco Itaú - PJ', type: 'bank', balance: 0, color: '#f59e0b', icon: 'building' },
    { id: 'acc3', organizationId: 'org_demo', name: 'Maquininha Stone', type: 'card_machine', balance: 0, color: '#14b8a6', icon: 'credit-card' }
  ];
  const [accounts, setAccounts] = useState<BankAccount[]>(() => loadState('accounts', initialAccounts));
  const [fiscalRecords, setFiscalRecords] = useState<FiscalRecord[]>(() => loadState('fiscalRecords', []));

  const { addToast } = useToast();

  // Persistence Effects
  useEffect(() => localStorage.setItem('clients', JSON.stringify(clients)), [clients]);
  useEffect(() => localStorage.setItem('leads', JSON.stringify(leads)), [leads]);
  useEffect(() => localStorage.setItem('appointments', JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem('transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('waitlist', JSON.stringify(waitlist)), [waitlist]);
  useEffect(() => localStorage.setItem('members', JSON.stringify(members)), [members]);
  useEffect(() => localStorage.setItem('staff', JSON.stringify(staff)), [staff]);
  useEffect(() => localStorage.setItem('rooms', JSON.stringify(rooms)), [rooms]);
  useEffect(() => localStorage.setItem('taskCategories', JSON.stringify(taskCategories)), [taskCategories]);
  useEffect(() => localStorage.setItem('vials', JSON.stringify(vials)), [vials]);
  useEffect(() => localStorage.setItem('vialUsageLogs', JSON.stringify(vialUsageLogs)), [vialUsageLogs]);
  useEffect(() => localStorage.setItem('campaigns', JSON.stringify(campaigns)), [campaigns]);
  useEffect(() => localStorage.setItem('automations', JSON.stringify(automations)), [automations]);
  useEffect(() => localStorage.setItem('segments', JSON.stringify(segments)), [segments]);
  useEffect(() => localStorage.setItem('services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('businessConfig', JSON.stringify(businessConfig)), [businessConfig]);
  useEffect(() => localStorage.setItem('notificationConfig', JSON.stringify(notificationConfig)), [notificationConfig]);
  useEffect(() => localStorage.setItem('websiteConfig', JSON.stringify(websiteConfig)), [websiteConfig]);
  useEffect(() => localStorage.setItem('saasAppConfig', JSON.stringify(saasAppConfig)), [saasAppConfig]);
  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('yieldRules', JSON.stringify(yieldRules)), [yieldRules]);
  useEffect(() => localStorage.setItem('formTemplates', JSON.stringify(formTemplates)), [formTemplates]);
  useEffect(() => localStorage.setItem('formResponses', JSON.stringify(formResponses)), [formResponses]);
  useEffect(() => localStorage.setItem('appointmentRecords', JSON.stringify(appointmentRecords)), [appointmentRecords]);
  useEffect(() => localStorage.setItem('units', JSON.stringify(units)), [units]);
  useEffect(() => localStorage.setItem('selectedUnitId', JSON.stringify(selectedUnitId)), [selectedUnitId]);
  useEffect(() => localStorage.setItem('events', JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem('guests', JSON.stringify(guests)), [guests]);
  useEffect(() => localStorage.setItem('membershipPlans', JSON.stringify(membershipPlans)), [membershipPlans]);
  useEffect(() => {
    localStorage.setItem('diva_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);
  useEffect(() => localStorage.setItem('treatmentPlans', JSON.stringify(treatmentPlans)), [treatmentPlans]);
  useEffect(() => localStorage.setItem('treatmentTemplates', JSON.stringify(treatmentTemplates)), [treatmentTemplates]);
  useEffect(() => localStorage.setItem('suppliers', JSON.stringify(suppliers)), [suppliers]);
  useEffect(() => localStorage.setItem('accounts', JSON.stringify(accounts)), [accounts]);
  useEffect(() => localStorage.setItem('fiscalRecords', JSON.stringify(fiscalRecords)), [fiscalRecords]);

  // Communication State
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('diva_conversations');
    return saved ? JSON.parse(saved) : initialConversations;
  });

  useEffect(() => {
    localStorage.setItem('diva_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const addMessage = (conversationId: string, message: ChatMessage) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
          unreadCount: message.sender === 'client' ? conv.unreadCount + 1 : conv.unreadCount
        };
      }
      return conv;
    }));
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(m => ({ ...m, read: true }))
        };
      }
      return conv;
    }));
  };

  const createConversation = (conversation: ChatConversation) => {
    const newConv: ChatConversation = { ...conversation, organizationId: currentOrgId };
    setConversations(prev => [...prev, newConv]);
  };

  const addClient = (client: Omit<Client, 'organizationId'>) => {
    const newClient: Client = { ...client, organizationId: currentOrgId };
    setClients(prev => [newClient, ...prev]);
    addToast(`Paciente ${client.name} cadastrado com sucesso!`, 'success');
  };

  const updateClient = (clientId: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => c.clientId === clientId ? { ...c, ...data } : c));
  };

  const addLead = (lead: Omit<SalesLead, 'organizationId'>) => {
    const newLead: SalesLead = { ...lead, organizationId: currentOrgId };
    setLeads(prev => [newLead, ...prev]);
    addToast(`Lead ${lead.name} adicionado ao funil!`, 'success');
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => l.leadId === id ? { ...l, stage, lastActivity: new Date().toISOString() } : l));
    if (stage === LeadStage.CONVERTED) {
      addToast('Lead convertido em Venda! Parabéns.', 'success');
    }
  };

  const updateLead = (id: string, data: Partial<SalesLead>) => {
    setLeads(prev => prev.map(l => l.leadId === id ? { ...l, ...data } : l));
    addToast('Lead atualizado com sucesso.', 'success');
  };

  const removeLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.leadId !== id));
    addToast('Lead removido.', 'info');
  };

  const addAppointment = (appt: Omit<ServiceAppointment, 'organizationId'>) => {
    const newAppt: ServiceAppointment = { ...appt, organizationId: currentOrgId };
    setAppointments(prev => [...prev, newAppt]);
    addToast('Agendamento criado com sucesso!', 'success');
  };

  const updateAppointment = (updatedAppt: ServiceAppointment) => {
    setAppointments(prev => prev.map(a =>
      a.appointmentId === updatedAppt.appointmentId ? updatedAppt : a
    ));
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => {
      const appt = prev.find(a => a.appointmentId === id);
      if (status === AppointmentStatus.COMPLETED && appt) {
        // Logic to award Loyalty Points
        const service = services.find(s => s.name === appt.serviceName);
        if (service) {
          // 1. Loyalty Points
          if (service.loyaltyPoints) {
            const client = clients.find(c => c.clientId === appt.clientId);
            if (client) {
              const newLoyalty = (client.loyaltyPoints || 0) + service.loyaltyPoints;
              updateClient(client.clientId, { loyaltyPoints: newLoyalty });
              addToast(`Paciente ganhou ${service.loyaltyPoints} pontos de fidelidade!`, 'success');
            }
          }

          // 2. Stock Deduction (Protocol)
          if (service.protocol && service.protocol.length > 0) {
            service.protocol.forEach(item => {
              updateProductStock(item.productId, item.quantity, 'remove', appt.unitId);
            });
            addToast(`Estoque atualizado conforme protocolo do serviço.`, 'info');
          }

          // 3. Create Transaction (NEW!)
          if (appt.price > 0) {
            const transaction: Transaction = {
              id: `t_${Date.now()}_${appt.appointmentId}`,
              organizationId: currentOrgId,
              description: `${appt.serviceName} - ${appt.clientName}`,
              category: 'Serviços',
              amount: appt.price,
              type: 'income',
              status: 'paid',
              date: new Date().toISOString().split('T')[0],
              unitId: appt.unitId,
              relatedAppointmentId: appt.appointmentId,
              revenueType: 'service'
            };
            setTransactions(prev => [transaction, ...prev]);
            addToast(`Receita de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(appt.price)} registrada!`, 'success');
          }
        }
      }
      return prev.map(a => a.appointmentId === id ? { ...a, status } : a);
    });
    addToast(`Status do agendamento atualizado para: ${status}`, 'info');
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.appointmentId !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, 'organizationId'>) => {
    const newTransaction: Transaction = { ...transaction, organizationId: currentOrgId };
    setTransactions(prev => [newTransaction, ...prev]);
    addToast('Transação adicionada!', 'success');
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    addToast('Transação atualizada!', 'success');
  };

  const addToWaitlist = (item: Omit<WaitlistItem, 'organizationId'>) => {
    const newItem: WaitlistItem = { ...item, organizationId: currentOrgId };
    setWaitlist(prev => [...prev, newItem]);
    addToast(`${item.clientName} adicionado à lista de espera.`, 'info');
  };

  const removeFromWaitlist = (id: string) => {
    setWaitlist(prev => prev.filter(i => i.id !== id));
  };

  const updateRoomStatus = (id: string, status: string) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
    addToast('Status da sala atualizado.', 'info');
  };

  const updateRoomEquipments = (roomId: string, equipments: any[]) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, equipments } : r));
    addToast('Equipamentos da sala atualizados com sucesso!', 'success');
  };

  const addRoom = (room: Omit<ServiceRoom, 'organizationId'>) => {
    const newRoom: ServiceRoom = { ...room, organizationId: currentOrgId };
    setRooms(prev => [...prev, newRoom]);
    addToast('Sala adicionada!', 'success');
  };

  const removeRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    addToast('Sala removida.', 'info');
  };

  const toggleRoom = (roomId: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        // Toggle logic: If maintenance -> available, else -> maintenance
        return {
          ...r,
          status: r.status === 'maintenance' ? 'available' : 'maintenance'
        };
      }
      return r;
    }));
    addToast('Status da sala alterado.', 'info');
  };

  const addTaskCategory = (category: string) => {
    if (taskCategories.includes(category)) {
      addToast('Categoria já existe.', 'warning');
      return;
    }
    setTaskCategories(prev => [...prev, category]);
    addToast(`Categoria '${category}' adicionada.`, 'success');
  };

  const removeTaskCategory = (category: string) => {
    setTaskCategories(prev => prev.filter(c => c !== category));
    addToast(`Categoria '${category}' removida.`, 'info');
  };

  const addStaff = (newStaff: Omit<StaffMember, 'organizationId'>) => {
    const staffWithOrg: StaffMember = { ...newStaff, organizationId: currentOrgId };
    setStaff(prev => [...prev, staffWithOrg]);
    addToast('Colaborador adicionado!', 'success');
  };

  const updateStaff = (id: string, data: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    addToast('Dados do colaborador atualizados.', 'success');
  };

  const removeStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    addToast('Profissional removido.', 'info');
  };

  // Team Logic
  const inviteMember = (email: string, role: string, name: string) => {
    const newMember: OrganizationMember = {
      id: `mem_${Date.now()}`,
      organizationId: currentOrgId,
      email,
      name,
      role: role as UserRole, // Cast for now
      status: 'invited',
      invitedAt: new Date().toISOString(),
      avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`
    };
    setMembers(prev => [...prev, newMember]);
    addToast(`Convite enviado para ${email}`, 'success');
  };

  const updateMemberRole = (memberId: string, role: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: role as UserRole } : m));
    addToast('Permissões atualizadas.', 'success');
  };

  const removeMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
    addToast('Membro removido da equipe.', 'info');
  };

  // Services Logic
  const addService = (service: Omit<ServiceDefinition, 'organizationId'>) => {
    const newService: ServiceDefinition = { ...service, organizationId: currentOrgId };
    setServices(prev => [...prev, newService]);
    addToast('Serviço adicionado ao catálogo.', 'success');
  };

  const toggleService = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    addToast('Serviço removido.', 'info');
  };

  const updateService = (id: string, data: Partial<ServiceDefinition>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    addToast('Serviço atualizado.', 'success');
  };

  // Partners Logic
  const addPartner = (partner: Omit<Partner, 'organizationId'>) => {
    const newPartner: Partner = { ...partner, organizationId: currentOrgId };
    setPartners(prev => [...prev, newPartner]);
    addToast('Novo parceiro cadastrado com sucesso!', 'success');
  };

  const updatePartner = (id: string, data: Partial<Partner>) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    addToast('Parceiro atualizado.', 'success');
  };

  // Config Logic
  const updateBusinessConfig = (config: BusinessConfig) => {
    setBusinessConfig(config);
    addToast('Dados da unidade salvos.', 'success');
  };

  const updateNotificationConfig = (config: NotificationConfig) => {
    setNotificationConfig(config);
    addToast('Templates de notificação atualizados.', 'success');
  };

  const updateWebsiteConfig = (newConfig: WebsiteConfig) => {
    setWebsiteConfig(newConfig);
    addToast('Site publicado com sucesso!', 'success');
  };

  const updateSaaSAppConfig = (newConfig: SaaSAppConfig) => {
    setSaaSAppConfig(newConfig);
  };

  const login = (role: UserRole) => {
    const newUser = createUser(role);
    setCurrentUser(newUser);
    addToast(`Bem-vindo(a), ${newUser.displayName}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Você saiu do sistema.', 'info');
  };

  const updateUser = (data: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...data });
      addToast('Perfil atualizado com sucesso!', 'success');
    }
  };

  const updateProductStock = (productId: string, qty: number, type: 'add' | 'remove', unitId?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        if (unitId && unitId !== 'all') {
          const currentUnitStock = (p.stockByUnit && p.stockByUnit[unitId]) || 0;
          const newUnitStock = type === 'add' ? currentUnitStock + qty : currentUnitStock - qty;

          return {
            ...p,
            stockByUnit: {
              ...(p.stockByUnit || {}),
              [unitId]: Math.max(0, newUnitStock)
            }
          };
        }

        const newStock = type === 'add' ? (p.stock || 0) + qty : (p.stock || 0) - qty;
        return { ...p, stock: Math.max(0, newStock) };
      }
      return p;
    }));
  };

  const addUnit = (unit: BusinessUnit) => {
    setUnits(prev => [...prev, unit]);
  };

  const updateUnit = (id: string, data: Partial<BusinessUnit>) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const removeUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
  };

  // Yield Rules Logic
  const addYieldRule = (rule: Omit<YieldRule, 'organizationId'>) => {
    const newRule: YieldRule = { ...rule, organizationId: currentOrgId };
    setYieldRules(prev => [...prev, newRule]);
    addToast('Regra de preço criada.', 'success');
  };

  const updateYieldRule = (id: string, data: Partial<YieldRule>) => {
    setYieldRules(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    addToast('Regra de preço atualizada.', 'success');
  };

  const deleteYieldRule = (id: string) => {
    setYieldRules(prev => prev.filter(r => r.id !== id));
    addToast('Regra de preço removida.', 'info');
  };

  // Form Templates Logic
  const addFormTemplate = (template: Omit<FormTemplate, 'organizationId'>) => {
    const newTemplate: FormTemplate = { ...template, organizationId: currentOrgId };
    setFormTemplates(prev => [...prev, newTemplate]);
    addToast('Formulário criado.', 'success');
  };

  const updateFormTemplate = (id: string, data: Partial<FormTemplate>) => {
    setFormTemplates(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
    addToast('Formulário atualizado.', 'success');
  };

  const deleteFormTemplate = (id: string) => {
    setFormTemplates(prev => prev.filter(f => f.id !== id));
    addToast('Formulário removido.', 'info');
  };

  // Form Responses Logic
  const addFormResponse = (response: Omit<FormResponse, 'organizationId'>) => {
    const newResponse: FormResponse = { ...response, organizationId: currentOrgId };
    setFormResponses(prev => [newResponse, ...prev]);
    addToast('Formulário preenchido com sucesso.', 'success');
  };

  const getClientFormResponses = (clientId: string): FormResponse[] => {
    return formResponses.filter(r => r.clientId === clientId);
  };

  // Appointment Records Logic
  const addAppointmentRecord = (record: AppointmentRecord) => {
    const newRecord: AppointmentRecord = { ...record, organizationId: currentOrgId };
    setAppointmentRecords(prev => [...prev, newRecord]);
  };

  const updateAppointmentRecord = (id: string, data: Partial<AppointmentRecord>) => {
    setAppointmentRecords(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    addToast('Prontuário atualizado.', 'success');
  };

  const getAppointmentRecord = (appointmentId: string): AppointmentRecord | undefined => {
    return appointmentRecords.find(r => r.appointmentId === appointmentId);
  };

  const addEvent = (event: Omit<ClinicEvent, 'organizationId'>) => {
    const newEvent: ClinicEvent = { ...event, organizationId: currentOrgId };
    setEvents(prev => [...prev, newEvent]);
    addToast('Evento criado com sucesso!', 'success');
  };

  const updateEvent = (event: ClinicEvent) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    addToast('Evento atualizado!', 'success');
  };

  const addGuest = (guest: EventGuest) => {
    setGuests(prev => [...prev, guest]);
    // Optionally update event confirmed count
    if (guest.status === 'confirmed') {
      setEvents(prev => prev.map(e => e.id === guest.eventId ? { ...e, confirmedCount: (e.confirmedCount || 0) + 1 } : e));
    }
    addToast('Convidado adicionado!', 'success');
  };

  const updateGuest = (id: string, data: Partial<EventGuest>) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
    addToast('Status do convidado atualizado.', 'success');
  };

  // Notifications Logic
  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `n${Date.now()}`,
      timestamp: 'Agora',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Pharmacy Logic
  const addVial = (vial: Omit<OpenVial, 'organizationId'>) => {
    const newVial: OpenVial = { ...vial, organizationId: currentOrgId };
    setVials(prev => [...prev, newVial]);
    addToast('Frasco aberto registrado!', 'success');
  };

  const updateVial = (id: string, updates: Partial<OpenVial>) => {
    setVials(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const removeVial = (id: string) => {
    setVials(prev => prev.filter(v => v.id !== id));
    addToast('Frasco removido/descartado.', 'info');
  };

  const addVialUsageLog = (log: VialUsageLog) => {
    setVialUsageLogs(prev => [log, ...prev]);
    // Automatically update vial remaining units
    const vial = vials.find(v => v.id === log.vialId);
    if (vial) {
      const newRemaining = Math.max(0, vial.remainingUnits - log.unitsUsed);
      updateVial(vial.id, { remainingUnits: newRemaining });
      if (newRemaining === 0) {
        addToast('Frasco vazio! Lembre-se de descartar.', 'warning');
      }
    }
  };

  // Marketing Logic
  const addCampaign = (campaign: Omit<MarketingCampaign, 'organizationId'>) => {
    const newCampaign: MarketingCampaign = { ...campaign, organizationId: currentOrgId };
    setCampaigns(prev => [...prev, newCampaign]);
    addToast('Campanha criada!', 'success');
  };
  const updateCampaign = (id: string, data: Partial<MarketingCampaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    addToast('Campanha atualizada.', 'success');
  };
  const removeCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    addToast('Campanha removida.', 'info');
  };

  const addAutomation = (automation: Omit<AutomationRule, 'organizationId'>) => {
    const newAuto: AutomationRule = { ...automation, organizationId: currentOrgId };
    setAutomations(prev => [...prev, newAuto]);
    addToast('Automação criada!', 'success');
  };

  // Treatment Plans Logic
  const addTreatmentPlan = (plan: TreatmentPlan) => {
    setTreatmentPlans(prev => [plan, ...prev]);
    addToast('Plano de tratamento criado!', 'success');
  };
  const updateTreatmentPlan = (plan: TreatmentPlan) => {
    setTreatmentPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
  };
  const addTreatmentTemplate = (template: TreatmentPlanTemplate) => {
    setTreatmentTemplates(prev => [template, ...prev]);
    addToast('Modelo de plano salvo!', 'success');
  };
  const updateAutomation = (id: string, data: Partial<AutomationRule>) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    addToast('Automação atualizada.', 'success');
  };
  const removeAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    addToast('Automação removida.', 'info');
  };

  const addSegment = (segment: Omit<CustomerSegment, 'organizationId'>) => {
    const newSegment: CustomerSegment = { ...segment, organizationId: currentOrgId };
    setSegments(prev => [...prev, newSegment]);
    addToast('Segmento criado!', 'success');
  };
  const updateSegment = (id: string, data: Partial<CustomerSegment>) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    addToast('Segmento atualizado.', 'success');
  };
  const removeSegment = (id: string) => {
    setSegments(prev => prev.filter(s => s.id !== id));
    addToast('Segmento removido.', 'info');
  };

  // Loyalty Logic
  const addMembershipPlan = (plan: Omit<MembershipPlan, 'organizationId'>) => {
    const newPlan: MembershipPlan = { ...plan, organizationId: currentOrgId };
    setMembershipPlans(prev => [...prev, newPlan]);
    addToast('Plano de assinatura criado!', 'success');
  };
  const updateMembershipPlan = (id: string, data: Partial<MembershipPlan>) => {
    setMembershipPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    addToast('Plano atualizado!', 'success');
  };
  const removeMembershipPlan = (id: string) => {
    setMembershipPlans(prev => prev.filter(p => p.id !== id));
    addToast('Plano removido.', 'info');
  };

  const addSubscription = (sub: Omit<Subscription, 'organizationId'>) => {
    const newSub: Subscription = { ...sub, organizationId: currentOrgId };
    setSubscriptions(prev => [...prev, newSub]);
    addToast('Assinatura criada!', 'success');
  };
  const updateSubscription = (id: string, data: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    addToast('Assinatura atualizada!', 'success');
  };
  const cancelSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
    addToast('Assinatura cancelada.', 'info');
  };

  const addSupplier = (supplier: Omit<Supplier, 'organizationId'>) => {
    const newSupplier: Supplier = { ...supplier, organizationId: currentOrgId };
    setSuppliers(prev => [...prev, newSupplier]);
    addToast('Fornecedor cadastrado com sucesso!', 'success');
  };

  const updateSupplier = (id: string, data: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    addToast('Fornecedor atualizado.', 'success');
  };

  const removeSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    addToast('Fornecedor removido.', 'info');
  };

  // Accounts & Fiscal Logic
  const addAccount = (account: BankAccount) => {
    setAccounts(prev => [...prev, account]);
  };
  const updateAccount = (id: string, data: Partial<BankAccount>) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  // SaaS Master Backoffice Logic
  const [saasLeads, setSaaSLeads] = useState<SaaSLead[]>(initialSaaSLeads);
  const [saasSubscribers, setSaaSSubscribers] = useState<SaaSSubscriber[]>(initialSaaSSubscribers);

  useEffect(() => {
    localStorage.setItem('diva_saas_leads', JSON.stringify(saasLeads));
  }, [saasLeads]);

  useEffect(() => {
    localStorage.setItem('diva_saas_subscribers', JSON.stringify(saasSubscribers));
  }, [saasSubscribers]);

  const addSaaSLead = (lead: SaaSLead) => {
    setSaaSLeads(prev => [...prev, lead]);
    addToast('Lead SaaS registrado com sucesso!', 'success');
  };

  const updateSaaSLead = (id: string, data: Partial<SaaSLead>) => {
    setSaaSLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const addSaaSSubscriber = (sub: SaaSSubscriber) => {
    setSaaSSubscribers(prev => [...prev, sub]);
    addToast('Assinante SaaS adicionado!', 'success');
  };

  const updateSaaSSubscriber = (id: string, data: Partial<SaaSSubscriber>) => {
    setSaaSSubscribers(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const addFiscalRecord = (record: FiscalRecord) => {
    setFiscalRecords(prev => [...prev, record]);
    // Link to transaction? It's already linked by ID usually
  };
  const updateFiscalRecord = (id: string, data: Partial<FiscalRecord>) => {
    setFiscalRecords(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };

  // Filter Data by Organization
  const filteredClients = clients.filter(c => c.organizationId === currentOrgId);
  const filteredLeads = leads.filter(l => l.organizationId === currentOrgId);
  const filteredAppointments = appointments.filter(a => a.organizationId === currentOrgId);
  const filteredTransactions = transactions.filter(t => t.organizationId === currentOrgId);
  const filteredWaitlist = waitlist.filter(w => w.organizationId === currentOrgId);
  const filteredStaff = staff.filter(s => s.organizationId === currentOrgId);
  const filteredRooms = rooms.filter(r => r.organizationId === currentOrgId);
  const filteredServices = services.filter(s => s.organizationId === currentOrgId);
  const filteredProducts = products.filter(p => p.organizationId === currentOrgId);
  const filteredPartners = partners.filter(p => p.organizationId === currentOrgId);
  const filteredYieldRules = yieldRules.filter(y => y.organizationId === currentOrgId);
  const filteredMembers = members.filter(m => m.organizationId === currentOrgId);
  const filteredFormTemplates = formTemplates.filter(f => f.organizationId === currentOrgId);
  const filteredFormResponses = formResponses.filter(f => f.organizationId === currentOrgId);
  const filteredAppointmentRecords = appointmentRecords.filter(r => r.organizationId === currentOrgId);
  const filteredUnits = units.filter(u => u.organizationId === currentOrgId);
  const filteredEvents = events.filter(e => e.organizationId === currentOrgId);
  const filteredVials = vials.filter(v => v.organizationId === currentOrgId);
  const filteredCampaigns = campaigns.filter(c => c.organizationId === currentOrgId);
  const filteredAutomations = automations.filter(a => a.organizationId === currentOrgId);
  const filteredSegments = segments.filter(s => s.organizationId === currentOrgId);
  const filteredMembershipPlans = membershipPlans.filter(m => m.organizationId === currentOrgId);
  const filteredSubscriptions = subscriptions.filter(s => s.organizationId === currentOrgId);
  const filteredSuppliers = suppliers.filter(s => s.organizationId === currentOrgId);
  const filteredAccounts = accounts.filter(a => a.organizationId === currentOrgId);
  const filteredFiscalRecords = fiscalRecords.filter(f => f.organizationId === currentOrgId);
  const filteredConversations = conversations.filter(c => c.organizationId === currentOrgId);
  const filteredVialUsageLogs = vialUsageLogs.filter(log => filteredVials.some(v => v.id === log.vialId));

  return (
    <DataContext.Provider value={{
      clients: filteredClients,
      leads: filteredLeads,
      appointments: filteredAppointments,
      transactions: filteredTransactions,
      waitlist: filteredWaitlist,
      staff: filteredStaff,
      rooms: filteredRooms,
      taskCategories,
      services: filteredServices,
      businessConfig,
      notificationConfig,
      products: filteredProducts,
      addClient,
      updateClient,
      addLead,
      updateLeadStage,
      updateLead,
      removeLead,
      addAppointment,
      updateAppointment,
      updateAppointmentStatus,
      deleteAppointment,
      addTransaction,
      updateTransaction,
      addToWaitlist,
      removeFromWaitlist,
      updateRoomStatus,
      updateRoomEquipments,
      addRoom,
      removeRoom,
      toggleRoom,
      addTaskCategory,
      removeTaskCategory,
      addStaff,
      updateStaff,
      removeStaff,

      // Members
      members: filteredMembers,
      inviteMember,
      updateMemberRole,
      removeMember,

      addService,
      toggleService,
      deleteService,
      updateService,
      partners: filteredPartners,
      addPartner,
      updatePartner,
      updateBusinessConfig,
      updateNotificationConfig,
      websiteConfig,
      updateWebsiteConfig,
      saasAppConfig,
      updateSaaSAppConfig,
      currentUser,
      login,
      logout,
      updateUser,
      yieldRules: filteredYieldRules,
      addYieldRule,
      updateYieldRule,
      deleteYieldRule,
      formTemplates: filteredFormTemplates,
      addFormTemplate,
      updateFormTemplate,
      deleteFormTemplate,
      formResponses: filteredFormResponses,
      addFormResponse,
      getClientFormResponses,
      appointmentRecords: filteredAppointmentRecords,
      addAppointmentRecord,
      updateAppointmentRecord,
      getAppointmentRecord,
      units: filteredUnits,
      addUnit,
      updateUnit,
      removeUnit,
      selectedUnitId,
      setSelectedUnitId,
      events: filteredEvents,
      addEvent,
      updateEvent,
      guests,
      addGuest,
      updateGuest,

      // Accounts & Fiscal
      accounts: filteredAccounts,
      addAccount,
      updateAccount,

      fiscalRecords: filteredFiscalRecords,
      addFiscalRecord,
      updateFiscalRecord,

      vials: filteredVials,
      addVial,
      updateVial,
      removeVial,
      vialUsageLogs: filteredVialUsageLogs,
      addVialUsageLog,
      campaigns: filteredCampaigns,
      addCampaign,
      updateCampaign,
      removeCampaign,
      automations: filteredAutomations,
      addAutomation,
      updateAutomation,
      removeAutomation,
      segments: filteredSegments,
      addSegment,
      updateSegment,
      removeSegment,
      membershipPlans: filteredMembershipPlans,
      addMembershipPlan,
      updateMembershipPlan,
      removeMembershipPlan,
      subscriptions: filteredSubscriptions,
      addSubscription,
      updateSubscription,
      cancelSubscription,
      suppliers: filteredSuppliers,
      addSupplier,
      updateSupplier,
      removeSupplier,

      // SaaS Master Backoffice
      saasLeads,
      addSaaSLead,
      updateSaaSLead,
      saasSubscribers,
      addSaaSSubscriber,
      updateSaaSSubscriber,

      conversations: filteredConversations,
      addMessage,
      markConversationAsRead,
      createConversation,
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      updateProductStock,

      // Treatment Plans Export
      treatmentPlans,
      treatmentTemplates,
      addTreatmentPlan,
      updateTreatmentPlan,
      addTreatmentTemplate
    }}>
      {children}
    </DataContext.Provider>
  );
};
