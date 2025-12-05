
import React, { useState } from 'react';
import { ServiceAppointment, AppointmentStatus, Client, Invoice, Transaction, WaitlistItem } from '../../types';
import { Clock, MapPin, User, CheckCircle, PlayCircle, DollarSign, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Grid, List, Plus, AlertCircle, Search, Video, LayoutGrid, XCircle, FileText, ArrowRightLeft } from 'lucide-react';
import ServiceModal from '../modals/ServiceModal';
import CheckoutModal from '../modals/CheckoutModal';
import TelemedicineModal from '../modals/TelemedicineModal';
import NewAppointmentModal from '../modals/NewAppointmentModal';
import ClientProfileModal from '../modals/ClientProfileModal';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';

// --- MOCK RESOURCES ---
const RESOURCES = ['Sala 01 - Laser', 'Sala 02 - Facial', 'Sala 03 - Corporal', 'Consultório A', 'Online (Tele)'];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

const SchedulingModule: React.FC = () => {
    const { appointments, addTransaction, updateAppointmentStatus, deleteAppointment, clients, waitlist, addToWaitlist, removeFromWaitlist } = useData();
    const { addToast } = useToast();
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'week'>('grid');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState<ServiceAppointment | null>(null);

    // Modals State
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isTelemedOpen, setIsTelemedOpen] = useState(false);
    const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);

    // Client Profile State
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileClient, setProfileClient] = useState<Client | null>(null);

    // --- Handlers ---
    const handleAppointmentClick = (appt: ServiceAppointment, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedAppointment(appt);

        if (appt.roomId.includes('Online')) {
            setIsTelemedOpen(true);
        } else {
            setIsServiceModalOpen(true);
        }
    };

    const handleCheckoutClick = (e: React.MouseEvent, appt: ServiceAppointment) => {
        e.stopPropagation();
        setSelectedAppointment(appt);
        setIsCheckoutModalOpen(true);
    };

    // --- Action Handlers ---

    const handleViewProfile = (e: React.MouseEvent, clientId: string) => {
        e.stopPropagation();
        const client = clients.find(c => c.clientId === clientId);
        if (client) {
            setProfileClient(client);
            setIsProfileOpen(true);
        } else {
            addToast('Perfil do cliente não encontrado.', 'error');
        }
    };

    const handleCancelAppointment = (e: React.MouseEvent, apptId: string) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            updateAppointmentStatus(apptId, AppointmentStatus.CANCELLED);
        }
    };

    const handleMoveToWaitlist = (e: React.MouseEvent, appt: ServiceAppointment) => {
        e.stopPropagation();
        if (confirm('Mover agendamento para a Lista de Espera e liberar o horário?')) {
            // Add to waitlist
            const newItem: WaitlistItem = {
                id: `w_${Date.now()}`,
                clientName: appt.clientName,
                service: appt.serviceName,
                preference: 'Reagendamento (Veio da Agenda)',
                priority: 'medium'
            };
            addToWaitlist(newItem);

            // Cancel or Delete original appointment? Currently Updating to Cancelled.
            // You could use deleteAppointment(appt.appointmentId) if you want to remove it completely from the grid.
            updateAppointmentStatus(appt.appointmentId, AppointmentStatus.CANCELLED);
        }
    };

    const handleRemoveFromWaitlist = (id: string) => {
        if (confirm('Remover da lista de espera?')) {
            removeFromWaitlist(id);
            addToast('Item removido da lista de espera.', 'info');
        }
    };

    const handleSaveRecord = (record: any) => {
        console.log("Record saved:", record);
    };

    const handlePaymentComplete = (invoice: Invoice) => {
        // Create transaction in Finance
        const today = new Date();
        const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const transaction: Transaction = {
            id: `t_${Date.now()}`,
            description: `Pagamento: ${invoice.clientName} - ${invoice.items[0].description}`,
            amount: invoice.total,
            type: 'income',
            category: 'Serviços',
            status: 'paid',
            date: localDate // Use local date instead of UTC
        };
        addTransaction(transaction);

        // Update Appointment Status
        if (invoice.appointmentId) {
            updateAppointmentStatus(invoice.appointmentId, AppointmentStatus.COMPLETED);
        }
    };

    const handleDateChange = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        if (viewMode === 'week') {
            newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
        } else {
            newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
        }
        setSelectedDate(newDate);
    };

    // --- Helpers for Grid ---
    const getAppointmentStyle = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
        const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
        const duration = endMinutes - startMinutes;

        // Grid starts at 8:00 (480 minutes)
        const dayStartMinutes = 8 * 60;
        const topOffset = startMinutes - dayStartMinutes;

        // Scale: 1 minute = 2px (approx)
        return {
            top: `${topOffset * 2}px`,
            height: `${Math.max(duration * 2, 40)}px` // Minimum height
        };
    };

    const getStatusColorClass = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.CONFIRMED: return 'bg-green-100 border-green-300 text-green-800';
            case AppointmentStatus.COMPLETED: return 'bg-gray-200 border-gray-300 text-gray-600 opacity-75';
            case AppointmentStatus.IN_PROGRESS: return 'bg-purple-100 border-purple-300 text-purple-800 animate-pulse';
            case AppointmentStatus.CANCELLED: return 'bg-red-100 border-red-300 text-red-800 opacity-50';
            default: return 'bg-blue-100 border-blue-300 text-blue-800';
        }
    };

    // Helper to get week days based on selected date
    const getWeekDays = (date: Date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        start.setDate(diff);

        const days = [];
        for (let i = 0; i < 6; i++) { // Mon-Sat
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    // Get Client for Service Modal
    const selectedClient = selectedAppointment ? clients.find(c => c.clientId === selectedAppointment.clientId) : null;

    const mockFallbackClient: Client = {
        clientId: '0',
        userId: '0',
        name: selectedAppointment?.clientName || 'Cliente',
        email: '',
        phone: '',
        rfmScore: 0,
        behaviorTags: [],
        lifetimeValue: 0
    };

    const weekDays = getWeekDays(selectedDate);

    // Filter appointments based on current view
    const filteredAppointments = appointments.filter(appt => {
        const apptDate = new Date(appt.startTime);
        if (viewMode === 'week') {
            const startOfWeek = weekDays[0];
            const endOfWeek = new Date(weekDays[5]);
            endOfWeek.setHours(23, 59, 59, 999);
            startOfWeek.setHours(0, 0, 0, 0);
            return apptDate >= startOfWeek && apptDate <= endOfWeek;
        } else {
            return isSameDay(apptDate, selectedDate);
        }
    });

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* HEADER: Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm shrink-0 gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button onClick={() => handleDateChange('prev')} className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronLeft size={18} /></button>
                        <div className="px-4 font-bold text-diva-dark flex items-center gap-2 min-w-[200px] justify-center">
                            <CalendarIcon size={16} className="text-diva-primary" />
                            {viewMode === 'week' ? (
                                <span className="text-sm">
                                    {weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {weekDays[5].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </span>
                            ) : (
                                selectedDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'long' })
                            )}
                        </div>
                        <button onClick={() => handleDateChange('next')} className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronRight size={18} /></button>
                    </div>
                    <button onClick={() => setSelectedDate(new Date())} className="text-sm text-diva-primary font-bold hover:underline">Hoje</button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-gray-100 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Lista"
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Dia"
                        >
                            <Grid size={16} /> Dia
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={`p-2 rounded flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'week' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Semana"
                        >
                            <LayoutGrid size={16} /> Semana
                        </button>
                    </div>

                    <button
                        onClick={() => setIsNewAppointmentModalOpen(true)}
                        className="bg-diva-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark shadow-md transition-colors"
                    >
                        <Plus size={18} className="mr-2" /> Novo Agendamento
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">

                {/* MAIN CALENDAR AREA */}
                <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden flex flex-col relative">

                    {viewMode === 'list' ? (
                        /* LIST VIEW */
                        <div className="overflow-y-auto p-4 space-y-3">
                            {filteredAppointments.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <p>Nenhum agendamento encontrado para este período.</p>
                                </div>
                            ) : (
                                filteredAppointments.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map(appt => (
                                    <div
                                        key={appt.appointmentId}
                                        onClick={() => handleAppointmentClick(appt)}
                                        className="flex flex-col bg-white border border-gray-100 rounded-xl hover:border-diva-primary hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-lg text-diva-dark font-bold border border-gray-200">
                                                    <span>{new Date(appt.startTime).getHours()}:{new Date(appt.startTime).getMinutes().toString().padStart(2, '0')}</span>
                                                    <span className="text-[10px] text-gray-400 font-normal">{new Date(appt.startTime).toLocaleDateString()}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-diva-dark">{appt.clientName}</h4>
                                                    <p className="text-sm text-gray-500">{appt.serviceName}</p>
                                                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                                        <span className="flex items-center"><User size={12} className="mr-1" /> {appt.staffName}</span>
                                                        <span className="flex items-center"><MapPin size={12} className="mr-1" /> {appt.roomId}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColorClass(appt.status)}`}>
                                                    {appt.status}
                                                </span>
                                                {appt.roomId.includes('Online') && (
                                                    <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-500 hover:text-white transition-colors" title="Iniciar Videochamada">
                                                        <Video size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleCheckoutClick(e, appt)}
                                                    className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-500 hover:text-white transition-colors"
                                                    title="Realizar Checkout"
                                                >
                                                    <DollarSign size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Footer */}
                                        <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex justify-between items-center rounded-b-xl">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => handleViewProfile(e, appt.clientId)}
                                                    className="text-xs flex items-center text-gray-500 hover:text-diva-dark px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                                                >
                                                    <FileText size={12} className="mr-1" /> Ver Detalhes do Cliente
                                                </button>
                                                <button
                                                    onClick={(e) => handleMoveToWaitlist(e, appt)}
                                                    className="text-xs flex items-center text-orange-600 hover:text-orange-700 px-2 py-1 rounded hover:bg-orange-50 transition-colors"
                                                >
                                                    <ArrowRightLeft size={12} className="mr-1" /> Adicionar à Lista de Espera
                                                </button>
                                            </div>
                                            <button
                                                onClick={(e) => handleCancelAppointment(e, appt.appointmentId)}
                                                className="text-xs flex items-center text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors font-bold"
                                            >
                                                <XCircle size={12} className="mr-1" /> Cancelar Agendamento
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : viewMode === 'grid' ? (
                        /* GRID VIEW (DAILY) */
                        <div className="flex-1 overflow-auto relative flex flex-col">
                            {/* Grid Header (Rooms) */}
                            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-20">
                                <div className="w-16 shrink-0 border-r border-gray-100 bg-gray-50"></div> {/* Time Gutter */}
                                {RESOURCES.map(room => (
                                    <div key={room} className={`flex-1 min-w-[180px] p-3 text-center border-r border-gray-100 font-bold text-sm bg-gray-50 ${room.includes('Online') ? 'text-blue-600 bg-blue-50/50' : 'text-diva-dark'}`}>
                                        {room.includes('Online') ? <span className="flex items-center justify-center gap-1"><Video size={14} /> {room}</span> : room}
                                    </div>
                                ))}
                            </div>

                            {/* Grid Body */}
                            <div className="flex relative min-h-[1440px]">
                                {/* Time Gutter */}
                                <div className="w-16 shrink-0 border-r border-gray-100 bg-white z-10">
                                    {HOURS.map(hour => (
                                        <div key={hour} className="h-[120px] border-b border-gray-100 text-xs text-gray-400 text-right pr-2 pt-2 relative">
                                            {hour}:00
                                            <div className="absolute top-0 right-0 w-2 h-[1px] bg-gray-200"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Room Columns */}
                                {RESOURCES.map(room => (
                                    <div key={room} className="flex-1 min-w-[180px] border-r border-gray-100 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCA2MGgxMDAlIiBzdHJva2U9IiNmMyIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiAvPjwvc3ZnPg==')]">
                                        {/* Render Appointments for this Room */}
                                        {appointments
                                            .filter(appt => isSameDay(new Date(appt.startTime), selectedDate) && appt.roomId === room)
                                            .map(appt => (
                                                <div
                                                    key={appt.appointmentId}
                                                    onClick={(e) => handleAppointmentClick(appt, e)}
                                                    className={`absolute left-1 right-1 rounded-lg border-l-4 p-2 shadow-sm cursor-pointer hover:shadow-md hover:z-10 transition-all flex flex-col justify-between overflow-hidden
                                              ${getStatusColorClass(appt.status)}`}
                                                    style={getAppointmentStyle(appt.startTime, appt.endTime)}
                                                >
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <span className="font-bold text-xs truncate">{appt.clientName}</span>
                                                            {appt.status === AppointmentStatus.IN_PROGRESS && <PlayCircle size={12} className="animate-pulse" />}
                                                            {room.includes('Online') && <Video size={12} />}
                                                        </div>
                                                        <p className="text-[10px] opacity-80 truncate">{appt.serviceName}</p>
                                                    </div>
                                                    <div className="flex justify-between items-end mt-1">
                                                        <span className="text-[10px] font-mono flex items-center">
                                                            <User size={10} className="mr-0.5" /> {appt.staffName.split(' ')[1] || appt.staffName}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleCheckoutClick(e, appt)}
                                                            className="bg-white/50 hover:bg-white p-1 rounded text-current transition-colors"
                                                        >
                                                            <DollarSign size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* WEEK VIEW */
                        <div className="flex-1 overflow-auto relative flex flex-col">
                            {/* Week Header */}
                            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-20">
                                <div className="w-16 shrink-0 border-r border-gray-100 bg-gray-50"></div>
                                {weekDays.map(day => {
                                    const isToday = isSameDay(day, new Date());
                                    return (
                                        <div key={day.toString()} className={`flex-1 min-w-[150px] p-3 text-center border-r border-gray-100 font-bold text-sm bg-gray-50 ${isToday ? 'bg-blue-50 text-blue-700' : 'text-diva-dark'}`}>
                                            <div className="text-xs uppercase text-gray-500">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                                            <div className="text-lg leading-none">{day.getDate()}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Week Body */}
                            <div className="flex relative min-h-[1440px]">
                                {/* Time Gutter */}
                                <div className="w-16 shrink-0 border-r border-gray-100 bg-white z-10">
                                    {HOURS.map(hour => (
                                        <div key={hour} className="h-[120px] border-b border-gray-100 text-xs text-gray-400 text-right pr-2 pt-2 relative">
                                            {hour}:00
                                            <div className="absolute top-0 right-0 w-2 h-[1px] bg-gray-200"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Day Columns */}
                                {weekDays.map(day => (
                                    <div key={day.toString()} className="flex-1 min-w-[150px] border-r border-gray-100 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCA2MGgxMDAlIiBzdHJva2U9IiNmMyIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiAvPjwvc3ZnPg==')]">
                                        {appointments
                                            .filter(appt => isSameDay(new Date(appt.startTime), day))
                                            .map(appt => (
                                                <div
                                                    key={appt.appointmentId}
                                                    onClick={(e) => handleAppointmentClick(appt, e)}
                                                    className={`absolute left-1 right-1 rounded-lg border-l-4 p-1.5 shadow-sm cursor-pointer hover:shadow-md hover:z-10 transition-all flex flex-col overflow-hidden group
                                              ${getStatusColorClass(appt.status)}`}
                                                    style={getAppointmentStyle(appt.startTime, appt.endTime)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-bold text-[10px] truncate">{appt.clientName}</span>
                                                    </div>
                                                    <div className="flex items-center text-[9px] opacity-90 truncate mt-0.5">
                                                        <MapPin size={8} className="mr-0.5" /> {appt.roomId.split('-')[0].trim()}
                                                    </div>
                                                    {/* Only show more detail on taller blocks or hover */}
                                                    <div className="mt-auto hidden group-hover:flex justify-between items-end pt-1">
                                                        <span className="text-[9px]">{appt.staffName.split(' ')[0]}</span>
                                                        <DollarSign size={10} />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SIDEBAR: WAITLIST & ALERTS */}
                <div className="w-80 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden shrink-0 hidden xl:flex">
                    <div className="p-4 border-b border-diva-light/20 bg-gray-50">
                        <h3 className="font-bold text-diva-dark flex items-center">
                            <Clock size={18} className="mr-2 text-diva-primary" /> Lista de Espera
                            <span className="ml-auto bg-diva-primary text-white text-xs px-2 py-0.5 rounded-full">{waitlist.length}</span>
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {waitlist.map(wait => (
                            <div key={wait.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-diva-primary cursor-pointer group relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveFromWaitlist(wait.id); }}
                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XCircle size={14} />
                                </button>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-sm text-diva-dark">{wait.clientName}</h4>
                                    {wait.priority === 'high' && <AlertCircle size={14} className="text-diva-alert" />}
                                </div>
                                <p className="text-xs text-gray-500 font-medium">{wait.service}</p>
                                <p className="text-xs text-gray-400 mt-2 bg-gray-50 p-1.5 rounded flex items-center">
                                    <Clock size={10} className="mr-1" /> {wait.preference}
                                </p>
                                <button
                                    onClick={() => setIsNewAppointmentModalOpen(true)}
                                    className="w-full mt-2 text-xs font-bold text-diva-primary border border-diva-primary rounded py-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-diva-primary hover:text-white"
                                >
                                    Encaixar na Agenda
                                </button>
                            </div>
                        ))}

                        {waitlist.length === 0 && (
                            <div className="text-center text-gray-400 text-xs py-4">Lista vazia.</div>
                        )}

                        <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm font-bold hover:border-diva-primary hover:text-diva-primary transition-colors flex items-center justify-center">
                            <Plus size={16} className="mr-2" /> Adicionar à Espera
                        </button>
                    </div>

                    <div className="p-4 bg-yellow-50 border-t border-yellow-100">
                        <h4 className="text-xs font-bold text-yellow-800 uppercase mb-2 flex items-center">
                            <AlertCircle size={12} className="mr-1" /> Lembretes do Dia
                        </h4>
                        <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
                            <li>Dra. Julia sai às 16:00.</li>
                            <li>Sala 03 precisa de higienização extra.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {selectedAppointment && (
                <ServiceModal
                    isOpen={isServiceModalOpen}
                    onClose={() => setIsServiceModalOpen(false)}
                    onSave={handleSaveRecord}
                    appointment={selectedAppointment}
                    client={selectedClient || mockFallbackClient}
                />
            )}

            {selectedAppointment && (
                <CheckoutModal
                    isOpen={isCheckoutModalOpen}
                    onClose={() => setIsCheckoutModalOpen(false)}
                    onPaymentComplete={handlePaymentComplete}
                    appointment={selectedAppointment}
                />
            )}

            {selectedAppointment && (
                <TelemedicineModal
                    isOpen={isTelemedOpen}
                    onClose={() => setIsTelemedOpen(false)}
                    clientName={selectedAppointment.clientName}
                    appointmentId={selectedAppointment.appointmentId}
                />
            )}

            {profileClient && (
                <ClientProfileModal
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    client={profileClient}
                />
            )}

            <NewAppointmentModal
                isOpen={isNewAppointmentModalOpen}
                onClose={() => setIsNewAppointmentModalOpen(false)}
            />
        </div>
    );
};

export default SchedulingModule;
