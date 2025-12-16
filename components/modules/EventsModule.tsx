
import React, { useState, useMemo } from 'react';
import { ClinicEvent, EventGuest, EventChecklistItem } from '../../types';
import { Calendar, Users, DollarSign, MapPin, Plus, CheckCircle, XCircle, Clock, MoreHorizontal, Search, Share2, Filter } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import NewEventModal from '../modals/NewEventModal';
import { useToast } from '../ui/ToastContext';

import { useData } from '../context/DataContext';

const EventsModule: React.FC = () => {
    const { events, addEvent, updateEvent, guests, addGuest, updateGuest, addTransaction, selectedUnitId } = useData();
    const [selectedEvent, setSelectedEvent] = useState<ClinicEvent | undefined>(events[0]);
    const [view, setView] = useState<'overview' | 'guests' | 'feed'>('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newGuestName, setNewGuestName] = useState('');
    const [newGuestPhone, setNewGuestPhone] = useState('');
    const { addToast } = useToast();

    // Initialize selectedEvent
    React.useEffect(() => {
        if (!selectedEvent && events.length > 0) {
            setSelectedEvent(events[0]);
        }
    }, [events, selectedEvent]);

    // Update selectedEvent when events change
    React.useEffect(() => {
        if (selectedEvent) {
            const updated = events.find(e => e.id === selectedEvent.id);
            if (updated && updated !== selectedEvent) {
                setSelectedEvent(updated);
            }
        }
    }, [events]);

    // Filter guests for the selected event
    const eventGuests = useMemo(() => selectedEvent ? guests.filter(g => g.eventId === selectedEvent.id) : [], [guests, selectedEvent]);

    // Calculate Dynamic Metrics
    const metrics = useMemo(() => {
        if (!selectedEvent) return { occupancy: 0, revenue: 0, profit: 0, pending: 0 };

        const confirmed = eventGuests.filter(g => ['confirmed', 'checked_in', 'paid'].includes(g.status)).length;
        // Occupancy based on Confirmed humans
        const occupancy = selectedEvent.capacity > 0 ? Math.round((confirmed / selectedEvent.capacity) * 100) : 0;

        // Revenue: Sum of (confirmed/paid guests * ticket price) OR specific payments if we tracked them. 
        // For simplicity: If paymentStatus is 'paid', add event price.
        const paidGuests = eventGuests.filter(g => g.paymentStatus === 'paid').length;
        const realRevenue = paidGuests * (selectedEvent.price || 0);

        // Potential Revenue (all invited)
        // const potentialRevenue = eventGuests.length * (selectedEvent.price || 0);

        return {
            occupancy,
            confirmedCount: confirmed,
            revenue: realRevenue,
            profit: realRevenue - (selectedEvent.cost || 0),
            pending: eventGuests.length - confirmed
        };
    }, [eventGuests, selectedEvent]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-700';
            case 'ongoing': return 'bg-green-100 text-green-700 animate-pulse';
            case 'completed': return 'bg-gray-100 text-gray-600';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100';
        }
    };

    const getGuestStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">Confirmado</span>;
            case 'invited': return <span className="px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-600">Convidado</span>;
            case 'checked_in': return <span className="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700">Presente</span>;
            case 'no_show': return <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">Faltou</span>;
            default: return null;
        }
    };

    const getPaymentStatusBadge = (status?: string) => {
        switch (status) {
            case 'paid': return <span className="px-2 py-1 rounded text-xs font-bold bg-green-50 text-green-600 border border-green-100">Pago</span>;
            case 'pending': return <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-50 text-yellow-600 border border-yellow-100">Pendente</span>;
            case 'free': return <span className="px-2 py-1 rounded text-xs font-bold bg-gray-50 text-gray-500 border border-gray-100">Cortesia</span>;
            case 'refunded': return <span className="px-2 py-1 rounded text-xs font-bold bg-red-50 text-red-500 border border-red-100">Reembolsado</span>;
            default: return <span className="text-gray-300">-</span>;
        }
    };

    const handlePostToFeed = () => {
        if (!newPostContent.trim()) return;

        const newPost: any = {
            id: `p_${Date.now()}`,
            eventId: selectedEvent.id,
            authorName: 'Admin',
            authorRole: 'admin',
            content: newPostContent,
            timestamp: new Date().toISOString(),
            likes: 0
        };

        const updatedEvent = { ...selectedEvent, feed: [newPost, ...(selectedEvent.feed || [])] };
        updateEvent(updatedEvent); // Use updateEvent from useData
        setSelectedEvent(updatedEvent);
        setNewPostContent('');
        addToast('Post publicado no feed!', 'success');
    };

    const handleCreateEvent = (newEvent: ClinicEvent) => {
        addEvent(newEvent);
        setSelectedEvent(newEvent);
        addToast('Evento criado com sucesso!', 'success');
    };

    const handleAddGuest = () => {
        if (!newGuestName.trim() || !newGuestPhone.trim()) {
            addToast('Preencha nome e telefone do convidado', 'error');
            return;
        }

        const newGuest: EventGuest = {
            id: `g_${Date.now()}`,
            eventId: selectedEvent.id,
            clientName: newGuestName,
            phone: newGuestPhone,
            status: 'invited',
            vip: false,
            paymentStatus: 'pending',
            ticketType: 'standard'
        };

        addGuest(newGuest);
        setNewGuestName('');
        setNewGuestPhone('');
        // Toast handled by addGuest
    };

    // Initialize Checklist if missing
    React.useEffect(() => {
        if (selectedEvent && !selectedEvent.checklist) {
            const defaultChecklist: EventChecklistItem[] = [
                { id: 'ck_1', task: 'Confirmar Catering (Coffee Break)', completed: false },
                { id: 'ck_2', task: 'Disparar Save the Date (WhatsApp)', completed: false },
                { id: 'ck_3', task: 'Preparar Brindes / Gift Bags', completed: false },
                { id: 'ck_4', task: 'Imprimir Lista de Presença', completed: false }
            ];
            updateEvent({ ...selectedEvent, checklist: defaultChecklist });
        }
    }, [selectedEvent]);

    const toggleChecklist = (itemId: string) => {
        if (!selectedEvent || !selectedEvent.checklist) return;

        const updatedChecklist = selectedEvent.checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        updateEvent({ ...selectedEvent, checklist: updatedChecklist });
    };

    const data = [
        { name: 'Confirmados', value: metrics.confirmedCount, color: '#14808C' },
        { name: 'Vagas', value: (selectedEvent?.capacity || 0) - metrics.confirmedCount, color: '#e2e8f0' }
    ];

    const toggleGuestCheckIn = (guest: EventGuest) => {
        if (guest.status === 'checked_in') {
            updateGuest(guest.id, { status: 'confirmed' });
        } else {
            updateGuest(guest.id, { status: 'checked_in' });
            addToast(`${guest.clientName} fez check-in!`, 'success');
        }
    };

    const confirmGuest = (guest: EventGuest) => {
        updateGuest(guest.id, { status: 'confirmed' });
        addToast(`${guest.clientName} confirmado!`, 'success');
    };

    const markAsPaid = (guest: EventGuest) => {
        updateGuest(guest.id, { paymentStatus: 'paid' });

        // Create Transaction
        if (selectedEvent && (selectedEvent.price || 0) > 0) {
            addTransaction({
                id: `txn_evt_${Date.now()}_${guest.id}`,
                description: `Ingresso: ${selectedEvent.title} - ${guest.clientName}`,
                category: 'Eventos',
                amount: selectedEvent.price,
                type: 'income',
                status: 'paid',
                date: new Date().toISOString().split('T')[0],
                unitId: 'unit_default', // Should use selectedUnitId if available
                revenueType: 'service'
            });
        }

        addToast(`Pagamento de ${guest.clientName} registrado e lançado no financeiro!`, 'success');
    };

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
                            ${selectedEvent?.id === evt.id ? 'border-diva-primary ring-2 ring-diva-primary/20' : 'border-gray-200 hover:border-diva-light'}`}
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

                    {selectedEvent ? (
                        <>
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
                                            <p className="text-xs text-gray-500 uppercase font-bold">Receita (Realizada)</p>
                                            <p className="text-xl font-bold text-diva-dark">{formatCurrency(metrics.revenue)}</p>
                                        </div>
                                        <div className="bg-white p-2 rounded-full text-green-600 shadow-sm"><DollarSign size={20} /></div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Custo do Evento</p>
                                            <p className="text-xl font-bold text-red-500">{formatCurrency(selectedEvent.cost || 0)}</p>
                                        </div>
                                        <div className="bg-white p-2 rounded-full text-red-500 shadow-sm"><DollarSign size={20} /></div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Lucro Líquido</p>
                                            <p className={`text-xl font-bold ${metrics.profit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                                                {formatCurrency(metrics.profit)}
                                            </p>
                                        </div>
                                        <div className={`bg-white p-2 rounded-full ${metrics.profit >= 0 ? 'text-green-700' : 'text-red-700'} shadow-sm`}><DollarSign size={20} /></div>
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
                                    Lista de Convidados ({eventGuests.length})
                                </button>
                                <button
                                    onClick={() => setView('feed')}
                                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${view === 'feed' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                                >
                                    Feed do Evento
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
                                                    <span className="text-2xl font-bold text-diva-dark">{metrics.occupancy}%</span>
                                                    <span className="text-[10px] text-gray-400 uppercase">Ocupado</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-4">
                                                Restam <strong>{(selectedEvent.capacity || 0) - metrics.confirmedCount}</strong> vagas para atingir a meta.
                                            </p>
                                        </div>

                                        <div className="flex-1 bg-white p-6 rounded-xl border border-diva-light/20 shadow-sm">
                                            <h4 className="text-sm font-bold text-diva-dark mb-4">Checklist de Preparação</h4>
                                            <div className="space-y-3">
                                                {selectedEvent.checklist && selectedEvent.checklist.map(item => (
                                                    <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.completed}
                                                            onChange={() => toggleChecklist(item.id)}
                                                            className="w-5 h-5 text-diva-primary rounded focus:ring-diva-primary"
                                                        />
                                                        <span className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                                                            {item.task}
                                                        </span>
                                                    </label>
                                                ))}
                                                {(!selectedEvent.checklist || selectedEvent.checklist.length === 0) && (
                                                    <p className="text-xs text-gray-400 italic p-2">Carregando checklist...</p>
                                                )}
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
                                            <button
                                                onClick={() => setIsAddGuestModalOpen(true)}
                                                className="flex items-center px-3 py-2 bg-diva-primary text-white rounded-lg text-xs font-bold hover:bg-diva-dark"
                                            >
                                                <Plus size={14} className="mr-1" /> Adicionar
                                            </button>
                                        </div>

                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                                <tr>
                                                    <th className="px-6 py-4">Nome</th>
                                                    <th className="px-6 py-4">Contato</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4">Pagamento</th>
                                                    <th className="px-6 py-4">VIP</th>
                                                    <th className="px-6 py-4 text-right">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-sm">
                                                {eventGuests.map(guest => (
                                                    <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-diva-dark">{guest.clientName}</td>
                                                        <td className="px-6 py-4 text-gray-500 text-xs">{guest.phone}</td>
                                                        <td className="px-6 py-4">
                                                            {getGuestStatusBadge(guest.status)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getPaymentStatusBadge(guest.paymentStatus)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {guest.vip && <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">VIP</span>}
                                                        </td>
                                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                            {guest.status !== 'confirmed' && guest.status !== 'checked_in' && (
                                                                <button
                                                                    onClick={() => confirmGuest(guest)}
                                                                    className="text-xs font-bold text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-50"
                                                                >
                                                                    Confirmar
                                                                </button>
                                                            )}
                                                            {guest.paymentStatus !== 'paid' && (
                                                                <button
                                                                    onClick={() => markAsPaid(guest)}
                                                                    className="text-xs font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                                                                >
                                                                    Pagar
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => toggleGuestCheckIn(guest)}
                                                                className={`text-xs font-bold px-2 py-1 rounded border ${guest.status === 'checked_in' ? 'bg-purple-600 text-white border-purple-600' : 'text-diva-primary border-diva-primary hover:bg-diva-light/20'}`}
                                                            >
                                                                {guest.status === 'checked_in' ? 'Check-in OK' : 'Check-in'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {view === 'feed' && (
                                    <div className="max-w-2xl mx-auto">
                                        {/* Create Post */}
                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                                            <textarea
                                                className="w-full p-3 border border-gray-100 rounded-lg resize-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none text-sm"
                                                placeholder="Publique uma novidade ou aviso para os participantes..."
                                                rows={3}
                                                value={newPostContent}
                                                onChange={(e) => setNewPostContent(e.target.value)}
                                            ></textarea>
                                            <div className="flex justify-between items-center mt-3">
                                                <button className="text-gray-400 hover:text-diva-primary transition-colors">
                                                    <MapPin size={18} />
                                                </button>
                                                <button
                                                    onClick={handlePostToFeed}
                                                    disabled={!newPostContent.trim()}
                                                    className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-diva-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    Publicar
                                                </button>
                                            </div>
                                        </div>

                                        {/* Feed List */}
                                        <div className="space-y-4">
                                            {selectedEvent.feed && selectedEvent.feed.length > 0 ? (
                                                selectedEvent.feed.map(post => (
                                                    <div key={post.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-10 h-10 rounded-full bg-diva-light/30 flex items-center justify-center text-diva-primary font-bold">
                                                                {post.authorName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-diva-dark">{post.authorName}</h4>
                                                                <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString()}</p>
                                                            </div>
                                                            {post.authorRole === 'admin' && (
                                                                <span className="ml-auto bg-diva-primary/10 text-diva-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                                                    Organizador
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                                            {post.content}
                                                        </p>
                                                        {post.imageUrl && (
                                                            <img src={post.imageUrl} alt="Post" className="w-full h-48 object-cover rounded-lg mb-4" />
                                                        )}
                                                        <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                                                            <button className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors">
                                                                <CheckCircle size={14} /> {post.likes} Curtidas
                                                            </button>
                                                            <button className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-diva-primary transition-colors">
                                                                <Share2 size={14} /> Compartilhar
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-10 text-gray-400">
                                                    <p>Nenhuma publicação ainda.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12">
                            <Calendar size={48} className="mb-4 opacity-30" />
                            <p className="font-bold">Nenhum evento selecionado</p>
                            <p className="text-sm mt-2">Selecione um evento à esquerda ou crie um novo.</p>
                        </div>
                    )}
                </div>
            </div >
            <NewEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreateEvent} />

            {/* Add Guest Modal */}
            {
                isAddGuestModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-xl font-bold text-diva-dark mb-4">Adicionar Convidado</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={newGuestName}
                                        onChange={(e) => setNewGuestName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none"
                                        placeholder="Ex: Maria Silva"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
                                    <input
                                        type="tel"
                                        value={newGuestPhone}
                                        onChange={(e) => setNewGuestPhone(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setIsAddGuestModalOpen(false);
                                        setNewGuestName('');
                                        setNewGuestPhone('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddGuest}
                                    className="flex-1 px-4 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors shadow-md"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default EventsModule;
