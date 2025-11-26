
import React, { useState } from 'react';
import { ClinicEvent, EventGuest } from '../../types';
import { Calendar, Users, DollarSign, MapPin, Plus, CheckCircle, XCircle, Clock, MoreHorizontal, Search, Share2, Filter } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import NewEventModal from '../modals/NewEventModal';
import { useToast } from '../ui/ToastContext';

const mockEvents: ClinicEvent[] = [
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
        bannerUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop'
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
        bannerUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop'
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
        bannerUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop'
    }
];

const mockGuests: EventGuest[] = [
    { id: 'g1', eventId: 'ev1', clientName: 'Ana Silva', phone: '(11) 99999-9999', status: 'confirmed', vip: true, notes: 'Interesse em Full Body' },
    { id: 'g2', eventId: 'ev1', clientName: 'Beatriz Costa', phone: '(11) 98888-8888', status: 'invited', vip: false },
    { id: 'g3', eventId: 'ev1', clientName: 'Carla Dias', phone: '(11) 97777-7777', status: 'no_show', vip: false },
    { id: 'g4', eventId: 'ev1', clientName: 'Fernanda Lima', phone: '(11) 96666-6666', status: 'checked_in', vip: true },
];

const EventsModule: React.FC = () => {
  const [events, setEvents] = useState<ClinicEvent[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<ClinicEvent>(mockEvents[0]);
  const [view, setView] = useState<'overview' | 'guests'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'upcoming': return 'bg-blue-100 text-blue-700';
          case 'ongoing': return 'bg-green-100 text-green-700 animate-pulse';
          case 'completed': return 'bg-gray-100 text-gray-600';
          case 'cancelled': return 'bg-red-100 text-red-700';
          default: return 'bg-gray-100';
      }
  };

  const getGuestStatusBadge = (status: string) => {
      switch(status) {
          case 'confirmed': return <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">Confirmado</span>;
          case 'invited': return <span className="px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-600">Convidado</span>;
          case 'checked_in': return <span className="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700">Presente</span>;
          case 'no_show': return <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">Faltou</span>;
          default: return null;
      }
  };

  const handleCreateEvent = (newEvent: ClinicEvent) => {
      setEvents([newEvent, ...events]);
      setSelectedEvent(newEvent);
      addToast('Evento criado com sucesso!', 'success');
  };

  const data = [
      { name: 'Confirmados', value: selectedEvent.confirmedCount, color: '#14808C' },
      { name: 'Vagas', value: selectedEvent.capacity - selectedEvent.confirmedCount, color: '#e2e8f0' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Event Selector / Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm shrink-0">
            <div>
                <h2 className="text-xl font-serif font-bold text-diva-dark">Diva Events</h2>
                <p className="text-sm text-gray-500">Gestão de Eventos, Workshops e Dias Especiais</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark shadow-md transition-colors"
            >
                <Plus size={16} className="mr-2" /> Criar Novo Evento
            </button>
        </div>

        <div className="flex flex-1 gap-6 overflow-hidden">
            
            {/* Events List (Left Sidebar) */}
            <div className="w-80 flex flex-col gap-4 overflow-y-auto pb-2">
                {events.map(evt => (
                    <div 
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`bg-white rounded-xl overflow-hidden border cursor-pointer transition-all hover:shadow-md group
                            ${selectedEvent.id === evt.id ? 'border-diva-primary ring-2 ring-diva-primary/20' : 'border-gray-200 hover:border-diva-light'}`}
                    >
                        <div className="h-32 bg-gray-200 relative">
                            <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                            <span className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] uppercase font-bold ${getStatusColor(evt.status)}`}>
                                {evt.status}
                            </span>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-diva-dark mb-1">{evt.title}</h4>
                            <div className="flex items-center text-xs text-gray-500 mb-3">
                                <Calendar size={12} className="mr-1" /> {new Date(evt.date).toLocaleDateString()} 
                                <span className="mx-2">•</span> 
                                <Clock size={12} className="mr-1" /> {evt.time.split('-')[0]}
                            </div>
                            
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-diva-primary h-full rounded-full" 
                                    style={{ width: `${(evt.confirmedCount / evt.capacity) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-bold">
                                <span>{evt.confirmedCount} Confirmados</span>
                                <span>{evt.capacity} Vagas</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail View (Right) */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
                
                {/* Detail Header */}
                <div className="p-6 border-b border-diva-light/20">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-diva-dark">{selectedEvent.title}</h2>
                            <p className="text-gray-600 mt-1 max-w-2xl">{selectedEvent.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
                                <Share2 size={16} className="mr-2" /> Convite Digital
                            </button>
                            <button className="p-2 text-gray-400 hover:text-diva-dark rounded-lg hover:bg-gray-100">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex-1 bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Receita Estimada</p>
                                <p className="text-xl font-bold text-diva-dark">{formatCurrency(selectedEvent.revenue)}</p>
                            </div>
                            <div className="bg-white p-2 rounded-full text-green-600 shadow-sm"><DollarSign size={20} /></div>
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Custo do Evento</p>
                                <p className="text-xl font-bold text-red-500">{formatCurrency(selectedEvent.cost)}</p>
                            </div>
                            <div className="bg-white p-2 rounded-full text-red-500 shadow-sm"><DollarSign size={20} /></div>
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Lucro Líquido</p>
                                <p className="text-xl font-bold text-green-700">{formatCurrency(selectedEvent.revenue - selectedEvent.cost)}</p>
                            </div>
                            <div className="bg-white p-2 rounded-full text-green-700 shadow-sm"><DollarSign size={20} /></div>
                        </div>
                    </div>
                </div>

                {/* Detail Tabs */}
                <div className="px-6 pt-2 border-b border-gray-100 flex gap-6">
                    <button 
                        onClick={() => setView('overview')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${view === 'overview' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                    >
                        Visão Geral
                    </button>
                    <button 
                        onClick={() => setView('guests')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${view === 'guests' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                    >
                        Lista de Convidados ({mockGuests.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    
                    {view === 'overview' && (
                        <div className="flex gap-8 items-start">
                            <div className="w-64 bg-white p-6 rounded-xl border border-diva-light/20 shadow-sm flex flex-col items-center text-center">
                                <h4 className="text-sm font-bold text-diva-dark mb-4">Taxa de Ocupação</h4>
                                <div className="w-40 h-40 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={data} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                        <span className="text-2xl font-bold text-diva-dark">{Math.round((selectedEvent.confirmedCount / selectedEvent.capacity) * 100)}%</span>
                                        <span className="text-[10px] text-gray-400 uppercase">Ocupado</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-4">
                                    Restam <strong>{selectedEvent.capacity - selectedEvent.confirmedCount}</strong> vagas para atingir a meta.
                                </p>
                            </div>

                            <div className="flex-1 bg-white p-6 rounded-xl border border-diva-light/20 shadow-sm">
                                <h4 className="text-sm font-bold text-diva-dark mb-4">Checklist de Preparação</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100">
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-diva-primary rounded focus:ring-diva-primary" />
                                        <span className="text-sm text-gray-700 line-through opacity-50">Confirmar Catering (Coffee Break)</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100">
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-diva-primary rounded focus:ring-diva-primary" />
                                        <span className="text-sm text-gray-700 line-through opacity-50">Disparar Save the Date (WhatsApp)</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100">
                                        <input type="checkbox" className="w-5 h-5 text-diva-primary rounded focus:ring-diva-primary" />
                                        <span className="text-sm text-gray-700">Preparar Brindes / Gift Bags</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100">
                                        <input type="checkbox" className="w-5 h-5 text-diva-primary rounded focus:ring-diva-primary" />
                                        <span className="text-sm text-gray-700">Imprimir Lista de Presença</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'guests' && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-gray-100 flex gap-4 items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="text" placeholder="Buscar convidado..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-diva-primary" />
                                </div>
                                <button className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-xs font-bold hover:bg-gray-100">
                                    <Filter size={14} className="mr-1" /> Filtrar
                                </button>
                                <button className="flex items-center px-3 py-2 bg-diva-primary text-white rounded-lg text-xs font-bold hover:bg-diva-dark">
                                    <Plus size={14} className="mr-1" /> Adicionar
                                </button>
                            </div>
                            
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4">Contato</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">VIP</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {mockGuests.map(guest => (
                                        <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-diva-dark">{guest.clientName}</td>
                                            <td className="px-6 py-4 text-gray-500 text-xs">{guest.phone}</td>
                                            <td className="px-6 py-4">
                                                {getGuestStatusBadge(guest.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {guest.vip && <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">VIP</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button className="text-xs font-bold text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-50">Confirmar</button>
                                                <button className="text-xs font-bold text-diva-primary border border-diva-primary px-2 py-1 rounded hover:bg-diva-light/20">Check-in</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
        <NewEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreateEvent} />
    </div>
  );
};

export default EventsModule;
