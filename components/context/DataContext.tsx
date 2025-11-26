
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Client, SalesLead, ServiceAppointment, AppointmentStatus, LeadStage, Transaction, WaitlistItem, StaffMember, ServiceRoom, DataContextType, ServiceDefinition, BusinessConfig, NotificationConfig, Product } from '../../types';
import { useToast } from '../ui/ToastContext';

// --- INITIAL MOCK DATA (Centralized) ---

const initialClients: Client[] = [
  { clientId: '1', userId: 'u1', name: 'Ana Silva', email: 'ana@example.com', phone: '(11) 99999-9999', rfmScore: 85, behaviorTags: ['VIP', 'Laser Perna'], lifetimeValue: 3500, lastContact: '2023-10-25', referralPoints: 150, loyaltyPoints: 300 },
  { clientId: '2', userId: 'u2', name: 'Beatriz Costa', email: 'bia@example.com', phone: '(11) 98888-8888', rfmScore: 40, behaviorTags: ['Novo Cliente'], lifetimeValue: 200, lastContact: '2023-10-20', referralPoints: 0, loyaltyPoints: 0 },
  { clientId: '3', userId: 'u3', name: 'Carla Dias', email: 'carla@example.com', phone: '(11) 97777-7777', rfmScore: 65, behaviorTags: ['Botox', 'Frequente'], lifetimeValue: 1200, lastContact: '2023-10-15', referralPoints: 50, loyaltyPoints: 100 },
];

const initialLeads: SalesLead[] = [
  { leadId: 'l1', name: 'Juliana Paes', contact: '(21) 9999-0000', stage: LeadStage.NEW, channelSource: 'instagram', lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), notes: 'Interessada em pacote corporal' },
  { leadId: 'l2', name: 'Fernanda Lima', contact: 'fernanda@mail.com', stage: LeadStage.CONTACTED, channelSource: 'whatsapp', lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), notes: 'Agendou avaliação, falta confirmar' },
  { leadId: 'l3', name: 'Mariana Ximenes', contact: 'mari@mail.com', stage: LeadStage.SCHEDULED, channelSource: 'referral', lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Avaliação confirmada' },
  { leadId: 'l4', name: 'Cláudia Raia', contact: 'claudia@mail.com', stage: LeadStage.CONVERTED, channelSource: 'website', lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Fechou pacote 10 sessões' },
  { leadId: 'l5', name: 'Patricia Pillar', contact: 'pat@mail.com', stage: LeadStage.NEW, channelSource: 'instagram', lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(), notes: 'Dúvida sobre Botox' },
  { leadId: 'l8', name: 'João Oliveira', contact: '(11) 98888-7777', stage: LeadStage.NEW, channelSource: 'instagram', lastActivity: new Date().toISOString(), notes: 'Cliente com interesse em pacotes corporais' },
];

const initialAppointments: ServiceAppointment[] = [
  { appointmentId: '1', clientId: '1', clientName: 'Ana Silva', staffId: 's1', staffName: 'Dra. Julia', roomId: 'Sala 01 - Laser', startTime: '2023-10-27T09:00:00', endTime: '2023-10-27T10:00:00', status: AppointmentStatus.CONFIRMED, serviceName: 'Depilação a Laser - Perna Inteira', price: 250 },
  { appointmentId: '2', clientId: '2', clientName: 'Beatriz Costa', staffId: 's2', staffName: 'Est. Carla', roomId: 'Sala 02 - Facial', startTime: '2023-10-27T10:30:00', endTime: '2023-10-27T11:30:00', status: AppointmentStatus.SCHEDULED, serviceName: 'Limpeza de Pele Profunda', price: 150 },
  { appointmentId: '3', clientId: '3', clientName: 'Carla Dias', staffId: 's1', staffName: 'Dra. Julia', roomId: 'Sala 01 - Laser', startTime: '2023-10-27T11:00:00', endTime: '2023-10-27T11:30:00', status: AppointmentStatus.COMPLETED, serviceName: 'Botox (3 Regiões)', price: 0 },
  { appointmentId: '4', clientId: '4', clientName: 'Diana Prince', staffId: 's3', staffName: 'Dra. Julia', roomId: 'Sala 03 - Corporal', startTime: '2023-10-27T14:00:00', endTime: '2023-10-27T15:30:00', status: AppointmentStatus.IN_PROGRESS, serviceName: 'Massagem Relaxante', price: 200 },
  { appointmentId: '5', clientId: '5', clientName: 'Fernanda Souza', staffId: 's1', staffName: 'Dra. Julia', roomId: 'Online (Tele)', startTime: '2023-10-27T16:00:00', endTime: '2023-10-27T16:30:00', status: AppointmentStatus.CONFIRMED, serviceName: 'Avaliação Facial Online', price: 100 },
];

const initialTransactions: Transaction[] = [
  { id: 't1', description: 'Pacote Laser - 10 Sessões', category: 'Serviços', amount: 2500, type: 'income', status: 'paid', date: '2023-10-26' },
  { id: 't2', description: 'Reposição de Estoque (Dermocosméticos)', category: 'Material', amount: 850, type: 'expense', status: 'paid', date: '2023-10-25' },
  { id: 't3', description: 'Manutenção Ar Condicionado', category: 'Manutenção', amount: 300, type: 'expense', status: 'pending', date: '2023-10-27' },
  { id: 't4', description: 'Venda Produto Home Care', category: 'Produtos', amount: 450, type: 'income', status: 'paid', date: '2023-10-26' },
  { id: 't5', description: 'Comissão Staff (Dra. Julia)', category: 'Comissão', amount: 1200, type: 'expense', status: 'pending', date: '2023-10-30' },
  { id: 't6', description: 'Botox Full Face', category: 'Serviços', amount: 1800, type: 'income', status: 'overdue', date: '2023-10-20' },
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
  }
];

const initialServices: ServiceDefinition[] = [
  { id: '1', name: 'Depilação a Laser - Perna Inteira', category: 'laser', duration: 45, price: 250.00, active: true, loyaltyPoints: 50 },
  { id: '2', name: 'Limpeza de Pele Profunda', category: 'esthetics', duration: 60, price: 180.00, active: true, loyaltyPoints: 30 },
  { id: '3', name: 'Botox (3 Regiões)', category: 'injectables', duration: 30, price: 1200.00, active: true, loyaltyPoints: 200 },
  { id: '4', name: 'Massagem Relaxante', category: 'spa', duration: 50, price: 150.00, active: true, loyaltyPoints: 20 },
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

const initialNotificationConfig: NotificationConfig = {
    appointmentConfirmation: "Olá {nome_cliente}! Seu agendamento na Diva Spa está confirmado para {data} às {horario}. Procedimento: {servico}. Estamos ansiosos para te ver!",
    appointmentReminder: "Oi {nome_cliente}, passando para lembrar do seu momento Diva amanhã às {horario}. Caso precise remarcar, avise com antecedência! 💆‍♀️"
};

const initialProducts: Product[] = [
  { id: 'p1', name: 'Kit Pós-Laser Calmante', description: 'Loção hidratante e gel refrescante.', price: 189.90, costPrice: 85.00, category: 'homecare', stock: 15, minStockLevel: 20 },
  { id: 'p2', name: 'Pacote 10 Sessões - Axila', description: 'Tratamento completo.', price: 890.00, category: 'treatment_package' },
  { id: 'p3', name: 'Sérum Vitamina C 20%', description: 'Antioxidante potente.', price: 245.00, costPrice: 110.00, category: 'homecare', stock: 8, minStockLevel: 10 },
];

const initialTaskCategories = ['Admin', 'Manutenção', 'Limpeza', 'Compras', 'Contato'];

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
  const [services, setServices] = useState<ServiceDefinition[]>(() => loadState('services', initialServices));
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => loadState('businessConfig', initialBusinessConfig));
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>(() => loadState('notificationConfig', initialNotificationConfig));
  const [products, setProducts] = useState<Product[]>(() => loadState('products', initialProducts));
  
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
  useEffect(() => localStorage.setItem('services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('businessConfig', JSON.stringify(businessConfig)), [businessConfig]);
  useEffect(() => localStorage.setItem('notificationConfig', JSON.stringify(notificationConfig)), [notificationConfig]);
  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);

  const addClient = (client: Client) => {
    setClients(prev => [client, ...prev]);
    addToast(`Cliente ${client.name} cadastrado com sucesso!`, 'success');
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

  const addAppointment = (appt: ServiceAppointment) => {
    setAppointments(prev => [...prev, appt]);
    addToast('Agendamento criado com sucesso!', 'success');
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => {
        const appt = prev.find(a => a.appointmentId === id);
        if (status === AppointmentStatus.COMPLETED && appt) {
            // Logic to award Loyalty Points
            const service = services.find(s => s.name === appt.serviceName);
            if (service && service.loyaltyPoints) {
                const client = clients.find(c => c.clientId === appt.clientId);
                if (client) {
                    const newLoyalty = (client.loyaltyPoints || 0) + service.loyaltyPoints;
                    updateClient(client.clientId, { loyaltyPoints: newLoyalty });
                    addToast(`Cliente ganhou ${service.loyaltyPoints} pontos de fidelidade!`, 'success');
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

  // Config Logic
  const updateBusinessConfig = (config: BusinessConfig) => {
      setBusinessConfig(config);
      addToast('Dados da unidade salvos.', 'success');
  };

  const updateNotificationConfig = (config: NotificationConfig) => {
      setNotificationConfig(config);
      addToast('Templates de notificação atualizados.', 'success');
  };

  const updateProductStock = (productId: string, qty: number, type: 'add' | 'remove') => {
      setProducts(prev => prev.map(p => {
          if (p.id === productId) {
              const newStock = type === 'add' ? (p.stock || 0) + qty : (p.stock || 0) - qty;
              return { ...p, stock: Math.max(0, newStock) };
          }
          return p;
      }));
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
      addAppointment,
      updateAppointmentStatus,
      deleteAppointment,
      addTransaction,
      addToWaitlist,
      removeFromWaitlist,
      updateRoomStatus,
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
      updateBusinessConfig,
      updateNotificationConfig,
      updateProductStock
    }}>
      {children}
    </DataContext.Provider>
  );
};
