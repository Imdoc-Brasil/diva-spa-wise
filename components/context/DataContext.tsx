import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Client, SalesLead, ServiceAppointment, AppointmentStatus, LeadStage, Transaction, WaitlistItem, StaffMember, ServiceRoom, DataContextType, ServiceDefinition, BusinessConfig, NotificationConfig, Product, BusinessUnit, YieldRule, FormTemplate, FormResponse, AppointmentRecord, ClinicEvent, EventGuest, Partner, WebsiteConfig, User, UserRole, AppNotification, OpenVial, VialUsageLog, MarketingCampaign, AutomationRule, CustomerSegment, MembershipPlan, Subscription, ChatConversation, ChatMessage } from '../../types';
import { useToast } from '../ui/ToastContext';

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
  { clientId: '1', userId: 'u1', name: 'Ana Silva', email: 'ana@example.com', phone: '(11) 99999-9999', rfmScore: 85, behaviorTags: ['VIP', 'Laser Perna'], lifetimeValue: 3500, lastContact: '2023-10-25', referralPoints: 150, loyaltyPoints: 300, unitId: 'u1' },
  { clientId: '2', userId: 'u2', name: 'Beatriz Costa', email: 'bia@example.com', phone: '(11) 98888-8888', rfmScore: 40, behaviorTags: ['Novo Paciente'], lifetimeValue: 200, lastContact: '2023-10-20', referralPoints: 0, loyaltyPoints: 0, unitId: 'u2' },
  { clientId: '3', userId: 'u3', name: 'Carla Dias', email: 'carla@example.com', phone: '(11) 97777-7777', rfmScore: 65, behaviorTags: ['Botox', 'Frequente'], lifetimeValue: 1200, lastContact: '2023-10-15', referralPoints: 50, loyaltyPoints: 100, unitId: 'u1' },
];

const initialLeads: SalesLead[] = [
  { leadId: 'l1', name: 'Juliana Paes', contact: '(21) 9999-0000', stage: LeadStage.NEW, channelSource: 'instagram', lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), notes: 'Interessada em pacote corporal' },
  { leadId: 'l2', name: 'Fernanda Lima', contact: 'fernanda@mail.com', stage: LeadStage.CONTACTED, channelSource: 'whatsapp', lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), notes: 'Agendou avaliação, falta confirmar' },
  { leadId: 'l3', name: 'Mariana Ximenes', contact: 'mari@mail.com', stage: LeadStage.SCHEDULED, channelSource: 'referral', lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Avaliação confirmada' },
  { leadId: 'l4', name: 'Cláudia Raia', contact: 'claudia@mail.com', stage: LeadStage.CONVERTED, channelSource: 'website', lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Fechou pacote 10 sessões' },
  { leadId: 'l5', name: 'Patricia Pillar', contact: 'pat@mail.com', stage: LeadStage.NEW, channelSource: 'instagram', lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(), notes: 'Dúvida sobre Botox' },
  { leadId: 'l8', name: 'João Oliveira', contact: '(11) 98888-7777', stage: LeadStage.NEW, channelSource: 'instagram', lastActivity: new Date().toISOString(), notes: 'Paciente com interesse em pacotes corporais' },
];

const initialAppointments: ServiceAppointment[] = [
  { appointmentId: '1', clientId: '1', clientName: 'Ana Silva', staffId: 's1', staffName: 'Dra. Julia', roomId: 'Sala 01 - Laser', startTime: '2023-10-27T09:00:00', endTime: '2023-10-27T10:00:00', status: AppointmentStatus.CONFIRMED, serviceName: 'Depilação a Laser - Perna Inteira', price: 250, unitId: 'u1' },
  { appointmentId: '2', clientId: '2', clientName: 'Beatriz Costa', staffId: 's2', staffName: 'Est. Carla', roomId: 'Sala 02 - Facial', startTime: '2023-10-27T10:30:00', endTime: '2023-10-27T11:30:00', status: AppointmentStatus.SCHEDULED, serviceName: 'Limpeza de Pele Profunda', price: 150, unitId: 'u2' },
  { appointmentId: '3', clientId: '3', clientName: 'Carla Dias', staffId: 's1', staffName: 'Dra. Julia', roomId: 'Sala 01 - Laser', startTime: '2023-10-27T11:00:00', endTime: '2023-10-27T11:30:00', status: AppointmentStatus.COMPLETED, serviceName: 'Botox (3 Regiões)', price: 0, unitId: 'u1' },
  { appointmentId: '4', clientId: '4', clientName: 'Diana Prince', staffId: 's3', staffName: 'Dra. Julia', roomId: 'Sala 03 - Corporal', startTime: '2023-10-27T14:00:00', endTime: '2023-10-27T15:30:00', status: AppointmentStatus.IN_PROGRESS, serviceName: 'Massagem Relaxante', price: 200, unitId: 'u3' },
  { appointmentId: '5', clientId: '5', clientName: 'Fernanda Souza', staffId: 's1', staffName: 'Dra. Julia', roomId: 'Online (Tele)', startTime: '2023-10-27T16:00:00', endTime: '2023-10-27T16:30:00', status: AppointmentStatus.CONFIRMED, serviceName: 'Avaliação Facial Online', price: 100, unitId: 'u1' },
];

const initialTransactions: Transaction[] = [
  { id: 't1', description: 'Pacote Laser - 10 Sessões', category: 'Serviços', amount: 2500, type: 'income', status: 'paid', date: '2023-10-26', unitId: 'u1' },
  { id: 't2', description: 'Reposição de Estoque (Dermocosméticos)', category: 'Material', amount: 850, type: 'expense', status: 'paid', date: '2023-10-25', unitId: 'u2' },
  { id: 't3', description: 'Manutenção Ar Condicionado', category: 'Manutenção', amount: 300, type: 'expense', status: 'pending', date: '2023-10-27', unitId: 'u2' },
  { id: 't4', description: 'Venda Produto Home Care', category: 'Produtos', amount: 450, type: 'income', status: 'paid', date: '2023-10-26', unitId: 'u1' },
  { id: 't5', description: 'Comissão Staff (Dra. Julia)', category: 'Comissão', amount: 1200, type: 'expense', status: 'pending', date: '2023-10-30', unitId: 'u1' },
  { id: 't6', description: 'Botox Full Face', category: 'Serviços', amount: 1800, type: 'income', status: 'overdue', date: '2023-10-20', unitId: 'u1' },
];

const initialWaitlist: WaitlistItem[] = [
  { id: 'w1', clientName: 'Fernanda Souza', service: 'Laser Full Body', preference: 'Qualquer horário tarde', priority: 'high' },
  { id: 'w2', clientName: 'Mariana Ximenes', service: 'Botox', preference: 'Preferência Sala 01', priority: 'medium' },
];

const initialStaff: StaffMember[] = [
  {
    id: 's1',
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
    name: 'Consultório A',
    type: 'consultation',
    status: 'maintenance',
    equipments: [],
    ambience: { temperature: 23, lighting: 100 }
  },
  {
    id: 'r5',
    name: 'Consultório B',
    type: 'consultation',
    status: 'available',
    equipments: [],
    ambience: { temperature: 23, lighting: 100 }
  },
  {
    id: 'r6',
    name: 'Online (Tele)',
    type: 'virtual',
    status: 'available',
    equipments: [],
    ambience: { temperature: 0, lighting: 0 },
    meetingUrl: 'https://meet.divaspa.com.br'
  }
];

const initialServices: ServiceDefinition[] = [
  { id: '1', name: 'Depilação a Laser - Perna Inteira', category: 'laser', duration: 45, price: 250.00, active: true, loyaltyPoints: 50 },
  { id: '2', name: 'Limpeza de Pele Profunda', category: 'esthetics', duration: 60, price: 180.00, active: true, loyaltyPoints: 30 },
  { id: '3', name: 'Botox (3 Regiões)', category: 'injectables', duration: 30, price: 1200.00, active: true, loyaltyPoints: 200 },
  { id: '4', name: 'Massagem Relaxante', category: 'spa', duration: 50, price: 150.00, active: true, loyaltyPoints: 20 },
];

const initialPartners: Partner[] = [
  { id: 'p1', name: 'Bella Fitness', type: 'business', contact: '(11) 99999-1111', code: 'BELLA10', commissionRate: 10, clientDiscountRate: 5, active: true, totalReferred: 0, totalRevenue: 0, pendingPayout: 0, totalPaid: 0, pixKey: 'cnpj@bella.fit' },
  { id: 'p2', name: 'Influencer Gabi', type: 'influencer', contact: '@gabistyle', code: 'GABI20', commissionRate: 15, clientDiscountRate: 10, active: true, totalReferred: 0, totalRevenue: 0, pendingPayout: 0, totalPaid: 0, pixKey: 'gabi@mail.com' },
];

const initialConversations: ChatConversation[] = [
  {
    id: 'c1',
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
  { id: 'yr1', name: 'Horário de Pico', type: 'surge_time', description: 'Aumento de 15% em horários nobres (18h-21h)', adjustmentPercentage: 15, condition: 'time_range:18:00-21:00', active: true },
  { id: 'yr2', name: 'Última Hora', type: 'last_minute', description: 'Desconto de 20% para agendamentos no mesmo dia', adjustmentPercentage: -20, condition: 'booking_window:<24h', active: true },
];

const initialFormTemplates: FormTemplate[] = [
  {
    id: 'f1',
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

const initialProducts: Product[] = [
  { id: 'p1', name: 'Kit Pós-Laser Calmante', description: 'Loção hidratante e gel refrescante.', price: 189.90, costPrice: 85.00, category: 'homecare', stock: 15, stockByUnit: { 'u1': 10, 'u2': 5 }, minStockLevel: 20, loyaltyPoints: 20 },
  { id: 'p2', name: 'Pacote 10 Sessões - Axila', description: 'Tratamento completo.', price: 890.00, category: 'treatment_package', loyaltyPoints: 100 },
  { id: 'p3', name: 'Sérum Vitamina C 20%', description: 'Antioxidante potente.', price: 245.00, costPrice: 110.00, category: 'homecare', stock: 8, stockByUnit: { 'u1': 3, 'u2': 5 }, minStockLevel: 10, loyaltyPoints: 25 },
];

const initialUnits: BusinessUnit[] = [
  {
    id: 'u1',
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
  { id: 'v1', productId: 'prod_botox', productName: 'Toxina Botulínica A (Botox)', batchNumber: 'L-8892', openedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), expiresAfterOpen: 72, initialUnits: 100, remainingUnits: 60, openedBy: 'Dra. Julia' },
  { id: 'v2', productId: 'prod_dysport', productName: 'Dysport 300U', batchNumber: 'D-5521', openedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), expiresAfterOpen: 72, initialUnits: 300, remainingUnits: 120, openedBy: 'Dra. Julia' },
];

const initialVialUsageLogs: VialUsageLog[] = [
  { id: 'u1', vialId: 'v1', productName: 'Botox', unitsUsed: 40, patientName: 'Ana Silva', procedure: 'Terço Superior', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), staffName: 'Dra. Julia' },
];

const initialCampaigns: MarketingCampaign[] = [
  {
    id: 'c1',
    name: 'Promoção Relâmpago: Botox Week',
    channel: 'whatsapp',
    segmentId: 's1',
    status: 'active',
    stats: { sent: 1500, opened: 1200, converted: 85, revenue: 25500 }
  },
  {
    id: 'c2',
    name: 'Lançamento: Protocolo Verão',
    channel: 'email',
    segmentId: 's1',
    status: 'scheduled',
    scheduledFor: '2023-11-01T10:00:00',
    stats: { sent: 0, opened: 0, converted: 0, revenue: 0 }
  },
];

const initialAutomations: AutomationRule[] = [
  { id: 'a1', name: 'Mensagem de Aniversário', trigger: 'birthday', action: 'send_message', active: true },
  { id: 'a2', name: 'Reativação Pós-60 dias', trigger: 'inactive_30d', action: 'send_message', active: true },
  { id: 'a3', name: 'Lembrete de Retoque Botox', trigger: 'post_service', action: 'create_task', active: false },
  { id: 'a4', name: 'Alerta: Leads Novos sem Contato (24h)', trigger: 'lead_stale_24h', action: 'notify_team', active: true },
];

const initialSegments: CustomerSegment[] = [
  { id: 's1', name: 'Clientes VIP (LTV > 5k)', count: 120, description: 'Clientes com alto gasto vitalício.' },
  { id: 's2', name: 'Novos Clientes (30 dias)', count: 45, description: 'Clientes que vieram no último mês.' },
  { id: 's3', name: 'Clientes Inativos - Último Contato há 6 Meses', count: 89, description: 'Última Visita > 180 dias' },
];

const initialMembershipPlans: MembershipPlan[] = [
  { id: 'p1', name: 'Diva Silver', price: 99.90, billingCycle: 'monthly', benefits: ['1 Limpeza de Pele/mês', '5% OFF em Produtos'], activeMembers: 145, colorHex: '#94a3b8' },
  { id: 'p2', name: 'Diva Gold', price: 249.90, billingCycle: 'monthly', benefits: ['1 Laser Área P/mês', '10% OFF em Produtos', 'Gift Card Aniversário'], activeMembers: 89, colorHex: '#BF784E' },
  { id: 'p3', name: 'Diva Diamond', price: 499.90, billingCycle: 'monthly', benefits: ['Laser Full Body', '20% OFF em Produtos', 'Agendamento Prioritário'], activeMembers: 32, colorHex: '#14808C' },
];

const initialSubscriptions: Subscription[] = [
  { id: 'sub1', clientId: 'c1', clientName: 'Ana Silva', planId: 'p2', status: 'active', nextBillingDate: '2023-11-15', paymentMethod: 'Mastercard •••• 4242' },
  { id: 'sub2', clientId: 'c2', clientName: 'Beatriz Costa', planId: 'p1', status: 'overdue', nextBillingDate: '2023-10-10', paymentMethod: 'Visa •••• 8899' },
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
  const [services, setServices] = useState<ServiceDefinition[]>(() => loadState('services', initialServices));
  const [partners, setPartners] = useState<Partner[]>(() => loadState('partners', initialPartners));
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => loadState('businessConfig', initialBusinessConfig));
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>(() => loadState('notificationConfig', initialNotificationConfig));
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(() => loadState('websiteConfig', initialWebsiteConfig));
  const [products, setProducts] = useState<Product[]>(() => loadState('products', initialProducts));
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

  const { addToast } = useToast();

  // Persistence Effects
  useEffect(() => localStorage.setItem('clients', JSON.stringify(clients)), [clients]);
  useEffect(() => localStorage.setItem('leads', JSON.stringify(leads)), [leads]);
  useEffect(() => localStorage.setItem('appointments', JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem('transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('waitlist', JSON.stringify(waitlist)), [waitlist]);
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
    setConversations(prev => [...prev, conversation]);
  };

  const addClient = (client: Client) => {
    setClients(prev => [client, ...prev]);
    addToast(`Paciente ${client.name} cadastrado com sucesso!`, 'success');
  };

  const updateClient = (clientId: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => c.clientId === clientId ? { ...c, ...data } : c));
  };

  const addLead = (lead: SalesLead) => {
    setLeads(prev => [lead, ...prev]);
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

  const addAppointment = (appt: ServiceAppointment) => {
    setAppointments(prev => [...prev, appt]);
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
              description: `${appt.serviceName} - ${appt.clientName}`,
              category: 'Serviços',
              amount: appt.price,
              type: 'income',
              status: 'paid',
              date: new Date().toISOString().split('T')[0],
              unitId: appt.unitId,
              relatedAppointmentId: appt.appointmentId
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

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    addToast('Transação registrada com sucesso!', 'success');
  };

  const addToWaitlist = (item: WaitlistItem) => {
    setWaitlist(prev => [item, ...prev]);
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

  const addRoom = (room: ServiceRoom) => {
    setRooms(prev => [...prev, room]);
    addToast('Nova sala adicionada ao mapa.', 'success');
  };

  const removeRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    addToast('Sala removida.', 'warning');
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

  const addStaff = (newStaff: StaffMember) => {
    setStaff(prev => [...prev, newStaff]);
    addToast('Colaborador adicionado!', 'success');
  };

  const updateStaff = (id: string, data: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    addToast('Dados do colaborador atualizados.', 'success');
  };

  const removeStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    addToast('Colaborador removido.', 'info');
  };

  // Services Logic
  const addService = (service: ServiceDefinition) => {
    setServices(prev => [...prev, service]);
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
  const addPartner = (partner: Partner) => {
    setPartners(prev => [...prev, partner]);
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

  const updateWebsiteConfig = (config: WebsiteConfig) => {
    setWebsiteConfig(config);
    addToast('Site publicado com sucesso!', 'success');
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
  const addYieldRule = (rule: YieldRule) => {
    setYieldRules(prev => [...prev, rule]);
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
  const addFormTemplate = (template: FormTemplate) => {
    setFormTemplates(prev => [...prev, template]);
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
  const addFormResponse = (response: FormResponse) => {
    setFormResponses(prev => [response, ...prev]);
    addToast('Formulário preenchido com sucesso.', 'success');
  };

  const getClientFormResponses = (clientId: string): FormResponse[] => {
    return formResponses.filter(r => r.clientId === clientId);
  };

  // Appointment Records Logic
  const addAppointmentRecord = (record: AppointmentRecord) => {
    setAppointmentRecords(prev => [...prev, record]);
  };

  const updateAppointmentRecord = (id: string, data: Partial<AppointmentRecord>) => {
    setAppointmentRecords(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    addToast('Prontuário atualizado.', 'success');
  };

  const getAppointmentRecord = (appointmentId: string): AppointmentRecord | undefined => {
    return appointmentRecords.find(r => r.appointmentId === appointmentId);
  };

  const addEvent = (event: ClinicEvent) => {
    setEvents(prev => [event, ...prev]);
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
  const addVial = (vial: OpenVial) => {
    setVials(prev => [vial, ...prev]);
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
  const addCampaign = (campaign: MarketingCampaign) => {
    setCampaigns(prev => [...prev, campaign]);
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

  const addAutomation = (automation: AutomationRule) => {
    setAutomations(prev => [...prev, automation]);
    addToast('Automação criada!', 'success');
  };
  const updateAutomation = (id: string, data: Partial<AutomationRule>) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    addToast('Automação atualizada.', 'success');
  };
  const removeAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    addToast('Automação removida.', 'info');
  };

  const addSegment = (segment: CustomerSegment) => {
    setSegments(prev => [...prev, segment]);
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
  const addMembershipPlan = (plan: MembershipPlan) => {
    setMembershipPlans(prev => [...prev, plan]);
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

  const addSubscription = (sub: Subscription) => {
    setSubscriptions(prev => [...prev, sub]);
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

  return (
    <DataContext.Provider value={{
      clients,
      leads,
      appointments,
      transactions,
      waitlist,
      staff,
      rooms,
      taskCategories,
      services,
      businessConfig,
      notificationConfig,
      products,
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
      addToWaitlist,
      removeFromWaitlist,
      updateRoomStatus,
      updateRoomEquipments,
      addRoom,
      removeRoom,
      addTaskCategory,
      removeTaskCategory,
      addStaff,
      updateStaff,
      removeStaff,
      addService,
      toggleService,
      deleteService,
      updateService,
      partners,
      addPartner,
      updatePartner,
      updateBusinessConfig,
      updateNotificationConfig,
      websiteConfig,
      updateWebsiteConfig,
      currentUser,
      login,
      logout,
      updateUser,
      yieldRules,
      addYieldRule,
      updateYieldRule,
      deleteYieldRule,
      formTemplates,
      addFormTemplate,
      updateFormTemplate,
      deleteFormTemplate,
      formResponses,
      addFormResponse,
      getClientFormResponses,
      appointmentRecords,
      addAppointmentRecord,
      updateAppointmentRecord,
      getAppointmentRecord,
      units,
      addUnit,
      updateUnit,
      removeUnit,
      selectedUnitId,
      setSelectedUnitId,
      events,
      addEvent,
      updateEvent,
      guests,
      addGuest,
      updateGuest,
      vials,
      addVial,
      updateVial,
      removeVial,
      vialUsageLogs,
      addVialUsageLog,
      campaigns,
      addCampaign,
      updateCampaign,
      removeCampaign,
      automations,
      addAutomation,
      updateAutomation,
      removeAutomation,
      segments,
      addSegment,
      updateSegment,
      removeSegment,
      membershipPlans,
      addMembershipPlan,
      updateMembershipPlan,
      removeMembershipPlan,
      subscriptions,
      addSubscription,
      updateSubscription,
      cancelSubscription,
      conversations,
      addMessage,
      markConversationAsRead,
      createConversation,
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      updateProductStock
    }}>
      {children}
    </DataContext.Provider>
  );
};
