import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import {
    Calendar, Star, Tag, Clock, Package, CheckCircle, ChevronDown, ChevronUp,
    Sparkles, Camera, Image, Lock, FileText, QrCode, CreditCard, Wallet, AlertCircle
} from 'lucide-react';
import BookingWizard from '../modals/BookingWizard';
import { useData } from '../context/DataContext';
import { useDataIsolation } from '../../hooks/useDataIsolation';
import { useToast } from '../ui/ToastContext';

interface ClientPortalProps {
    user: User;
}

const ClientPortalModule: React.FC<ClientPortalProps> = ({ user }) => {
    const { clients, appointments, treatmentPlans, appointmentRecords, conversations } = useData();
    const { addToast } = useToast();
    const { filterClients, filterAppointments } = useDataIsolation(user);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
    const [showQrCheckin, setShowQrCheckin] = useState(false);

    // Filter data for this specific client
    const myClients = filterClients(clients, appointments);
    const myAppointments = filterAppointments(appointments);

    // Get client profile
    const client = myClients[0] || {
        name: user.displayName,
        loyaltyPoints: 0,
        clientId: user.clientId || ''
    };

    // Filter Treatment Plans (Active/Closed/Completed)
    const myPlans = useMemo(() => {
        if (!user.clientId) return [];
        return treatmentPlans.filter(p =>
            p.clientId === user.clientId &&
            (p.status === 'closed' || p.status === 'partially_paid' || p.status === 'completed' || p.status === 'prescribed')
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [treatmentPlans, user.clientId]);

    // Get My Records (Skincare & Photos)
    const myRecords = useMemo(() => {
        if (!user.clientId) return [];
        return appointmentRecords
            .filter(r => r.clientId === user.clientId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [appointmentRecords, user.clientId]);

    const latestSkincare = myRecords.find(r => r.skincarePlan);
    const latestPhotos = myRecords.find(r => r.beforePhotos?.length || r.afterPhotos?.length);

    // Get next appointment
    const nextAppointment = useMemo(() => {
        const upcoming = myAppointments
            .filter(a => new Date(a.startTime) > new Date() && a.status !== 'Cancelled')
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        return upcoming[0];
    }, [myAppointments]);

    // Get recent history
    const recentHistory = useMemo(() => {
        return myAppointments
            .filter(a => a.status === 'Completed')
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
            .slice(0, 5);
    }, [myAppointments]);

    // Pending Actions (Docs to sign, etc.)
    const pendingDocuments = 1; // Mocked pending doc

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const togglePlanExpansion = (planId: string) => {
        setExpandedPlanId(expandedPlanId === planId ? null : planId);
    };

    const handleCheckIn = () => {
        setShowQrCheckin(true);
        // Simulate scanning after 2s
        setTimeout(() => {
            setShowQrCheckin(false);
            addToast('Check-in realizado com sucesso! Aguarde na recepção.', 'success');
        }, 3000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-24 relative">
            {/* Header / Welcome */}
            <div className="bg-gradient-to-r from-diva-dark to-diva-primary rounded-2xl p-8 text-white mb-8 shadow-lg animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-serif mb-2">Olá, {client.name.split(' ')[0]}</h1>
                    <p className="text-diva-light opacity-90">Bem-vinda de volta ao seu momento de cuidado.</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-8"></div>

                {/* Floating Check-in Button */}
                <button
                    onClick={handleCheckIn}
                    className="absolute top-8 right-8 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all border border-white/30 shadow-lg"
                >
                    <QrCode size={16} />
                    Check-in Rápido
                </button>
            </div>

            {/* Pending Alerts */}
            {pendingDocuments > 0 && (
                <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-pulse-slow">
                    <div className="flex items-center gap-3 text-orange-700">
                        <AlertCircle size={20} />
                        <div>
                            <p className="font-bold text-sm">Ação Necessária</p>
                            <p className="text-xs">Você tem {pendingDocuments} termo de consentimento pendente de assinatura.</p>
                        </div>
                    </div>
                    <button className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-200 transition-colors">
                        Assinar Agora
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Next Appointment Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-diva-primary">
                                <Calendar className="mr-2" size={24} />
                                <h2 className="text-lg font-bold text-diva-dark">Próximo Agendamento</h2>
                            </div>
                            {nextAppointment && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase">Confirmado</span>
                            )}
                        </div>

                        {nextAppointment ? (
                            <div className="p-4 bg-diva-light/10 rounded-xl border border-diva-light/30 text-center hover:shadow-md transition-shadow cursor-pointer">
                                <p className="text-diva-dark font-medium mb-1">{nextAppointment.serviceName}</p>
                                <p className="text-3xl font-bold text-diva-primary my-2 font-serif">
                                    {new Date(nextAppointment.startTime).getDate()}
                                    <span className="text-sm font-sans ml-1 uppercase text-diva-dark/60">
                                        {new Date(nextAppointment.startTime).toLocaleDateString('pt-BR', { month: 'short' })}
                                    </span>
                                </p>
                                <p className="text-gray-500 font-medium">
                                    {formatTime(nextAppointment.startTime)}
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${nextAppointment.staffName}&background=random`} alt="Staff" />
                                    </div>
                                    Com {nextAppointment.staffName}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center flex flex-col items-center justify-center h-48">
                                <Calendar size={32} className="text-gray-300 mb-2" />
                                <p className="text-gray-500 text-sm">Nenhum agendamento futuro</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="w-full mt-6 bg-diva-primary text-white py-3 rounded-xl hover:bg-diva-dark transition-colors font-bold shadow-lg shadow-diva-primary/20 flex items-center justify-center gap-2"
                    >
                        <PlusIcon /> Novo Agendamento
                    </button>
                </div>

                {/* Wallet & Loyalty Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center text-diva-accent">
                            <Wallet className="mr-2" size={24} />
                            <h2 className="text-lg font-bold text-diva-dark">Minha Carteira</h2>
                        </div>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Nível Gold</span>
                    </div>

                    {/* Virtual Card Visual */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden mb-6 group transition-transform hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="relative z-10 flex justify-between items-start mb-8">
                            <Sparkles className="text-yellow-400" size={24} />
                            <span className="text-xs font-mono opacity-50">**** 8829</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs text-gray-400 uppercase mb-1">Saldo em Cashback</p>
                            <h3 className="text-3xl font-bold tracking-tight">{formatCurrency((client.loyaltyPoints || 0) * 0.10)}</h3>
                            <p className="text-[10px] text-gray-500 mt-1">Equivalente a {client.loyaltyPoints} pontos</p>
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Recompensas Disponíveis</h3>
                        {client.loyaltyPoints && client.loyaltyPoints >= 1000 ? (
                            <div className="flex items-center p-3 bg-white border border-diva-light/40 rounded-lg shadow-sm hover:border-diva-accent cursor-pointer transition-colors">
                                <div className="h-10 w-10 bg-diva-light/20 rounded-md mr-3 flex items-center justify-center text-diva-primary">
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-diva-dark">Peeling de Diamante</p>
                                    <p className="text-xs text-diva-accent font-bold">1.000 pts</p>
                                </div>
                                <button className="text-xs bg-diva-dark text-white px-3 py-1.5 rounded-md font-bold hover:bg-diva-primary shadow-sm">
                                    Resgatar
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-2">
                                <p className="text-xs text-gray-400">Acumule mais 250 pts para sua próxima recompensa.</p>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-diva-accent h-full w-3/4 rounded-full"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Skincare & Photos (Visual Evolution) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Skincare Routine */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30 flex flex-col">
                    <div className="flex items-center mb-4 text-purple-600">
                        <Sparkles className="mr-2" size={24} />
                        <h2 className="text-lg font-bold text-diva-dark">Meu Plano de Skincare</h2>
                    </div>

                    {latestSkincare ? (
                        <div className="flex-1 flex flex-col">
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-4 flex-1">
                                <p className="text-xs text-purple-600 font-bold mb-2 uppercase flex items-center">
                                    <Clock size={12} className="mr-1" /> Atualizado em {formatDate(latestSkincare.date)}
                                </p>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap font-medium leading-relaxed max-h-[150px] overflow-y-auto custom-scrollbar">
                                    {latestSkincare.skincarePlan}
                                </div>
                            </div>
                            <button className="w-full py-2 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-bold flex items-center justify-center">
                                <FileText size={16} className="mr-2" /> Ver Rotina Completa
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Sparkles size={40} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">Sua pele merece um plano único</p>
                            <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                                Agende uma avaliação facial para receber sua rotina personalizada.
                            </p>
                        </div>
                    )}
                </div>

                {/* Photo Gallery Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30 flex flex-col">
                    <div className="flex items-center mb-4 text-diva-primary">
                        <Camera className="mr-2" size={24} />
                        <h2 className="text-lg font-bold text-diva-dark">Diário de Evolução</h2>
                        <Lock size={14} className="ml-2 text-gray-400" />
                    </div>

                    {latestPhotos ? (
                        <div className="flex-1 flex flex-col">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative group shadow-inner">
                                    {latestPhotos.beforePhotos && latestPhotos.beforePhotos[0] ? (
                                        <img src={latestPhotos.beforePhotos[0]} alt="Antes" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">Sem foto</div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase backdrop-blur-sm">Antes</div>
                                </div>
                                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative group shadow-inner">
                                    {latestPhotos.afterPhotos && latestPhotos.afterPhotos[0] ? (
                                        <img src={latestPhotos.afterPhotos[0]} alt="Depois" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">Em breve</div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-diva-primary/90 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase backdrop-blur-sm shadow-lg">Depois</div>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-diva-dark text-white rounded-lg hover:bg-diva-primary transition-colors text-sm font-bold flex items-center justify-center shadow-lg shadow-diva-dark/10">
                                <Image size={16} className="mr-2" /> Ver Minha Galeria
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Camera size={40} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">Registre sua transformação</p>
                            <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                                As fotos de "Antes e Depois" dos seus tratamentos aparecerão aqui com total privacidade.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Treatments List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30 mb-8">
                <div className="flex items-center mb-6 text-diva-primary">
                    <Package className="mr-2" size={24} />
                    <h2 className="text-lg font-bold text-diva-dark">Meus Pacotes Ativos</h2>
                </div>

                {myPlans.length > 0 ? (
                    <div className="space-y-4">
                        {myPlans.map(plan => (
                            <div key={plan.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <div
                                    className="p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center cursor-pointer select-none"
                                    onClick={() => togglePlanExpansion(plan.id)}
                                >
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center justify-between md:justify-start gap-3 mb-2 md:mb-0">
                                            <h3 className="font-bold text-gray-800">{plan.name}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${plan.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    plan.status === 'closed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {plan.status === 'closed' ? 'Em Progresso' : plan.status === 'completed' ? 'Concluído' : 'Processando'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
                                        {/* Progress Bar */}
                                        <div className="text-right">
                                            {(() => {
                                                const totalSessions = plan.items.reduce((acc, i) => acc + i.quantity, 0);
                                                const usedSessions = plan.items.reduce((acc, i) => acc + i.sessionsUsed, 0);
                                                const percent = totalSessions > 0 ? Math.round((usedSessions / totalSessions) * 100) : 0;
                                                return (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Progresso</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-600 w-8 text-right">{percent}%</span>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        {expandedPlanId === plan.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                    </div>
                                </div>

                                {expandedPlanId === plan.id && (
                                    <div className="p-4 bg-white border-t border-gray-100 animate-in slide-in-from-top-2">
                                        <div className="grid grid-cols-1 gap-3">
                                            {plan.items.map((item, idx) => (
                                                <div key={idx} className="flex flex-wrap justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${item.sessionsUsed >= item.quantity ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                                                            {item.sessionsUsed >= item.quantity ? <CheckCircle size={16} /> : <Clock size={16} />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-gray-700">{item.serviceName}</p>
                                                            <p className="text-xs text-gray-400">
                                                                Saldo: <span className="font-bold text-gray-600">{item.quantity - item.sessionsUsed}</span> de {item.quantity} sessões
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mt-2 pt-2 border-t border-gray-50 text-right">
                                                <button
                                                    onClick={() => setIsBookingOpen(true)}
                                                    className="text-xs bg-diva-primary/10 text-diva-primary px-3 py-1.5 rounded-lg font-bold hover:bg-diva-primary/20 transition-colors"
                                                >
                                                    Agendar Sessão
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Package size={48} className="mx-auto mb-3 text-gray-300" />
                        <h3 className="text-diva-dark font-medium">Nenhum plano ativo</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Aproveite pacotes com descontos exclusivos.</p>
                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="bg-white border border-gray-200 text-diva-primary px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50"
                        >
                            Explorar Tratamentos
                        </button>
                    </div>
                )}
            </div>

            {/* Floating Booking Modal */}
            <BookingWizard
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                user={user}
            />

            {/* QR Code Overlay (Simulation) */}
            {showQrCheckin && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-diva-accent animate-pulse"></div>
                        <h3 className="text-xl font-bold text-diva-dark mb-4">Apontar para o QR Code</h3>
                        <p className="text-sm text-gray-500 mb-6">Localize o código no totem da recepção para confirmar sua chegada.</p>

                        <div className="relative mx-auto w-64 h-64 bg-black rounded-lg overflow-hidden border-2 border-diva-accent flex items-center justify-center mb-6">
                            <Camera className="text-white/50 animate-pulse" size={48} />
                            <div className="absolute inset-0 border-2 border-white/30 m-4 rounded"></div>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500/80 shadow-[0_0_8px_rgba(255,0,0,0.8)] animate-scan"></div>
                        </div>

                        <button
                            onClick={() => setShowQrCheckin(false)}
                            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default ClientPortalModule;
