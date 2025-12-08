
import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { Calendar, Star, Tag, Clock, Package, CheckCircle, ChevronDown, ChevronUp, Sparkles, Camera, Image, Lock, FileText } from 'lucide-react';
import BookingWizard from '../modals/BookingWizard';
import { useData } from '../context/DataContext';
import { useDataIsolation } from '../../hooks/useDataIsolation';

interface ClientPortalProps {
    user: User;
}

const ClientPortalModule: React.FC<ClientPortalProps> = ({ user }) => {
    const { clients, appointments, treatmentPlans, appointmentRecords } = useData();
    const { filterClients, filterAppointments } = useDataIsolation(user);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

    // Filter data for this specific client
    const myClients = filterClients(clients, appointments);
    const myAppointments = filterAppointments(appointments);

    // Filter Treatment Plans (Active/Closed/Completed)
    // In a real scenario, we might want to filter by clientId properly if isolation hook doesn't cover it or if user.clientId is set.
    // Assuming treatmentPlans in context are all plans, we filter by user.clientId
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

    // Get client profile
    const client = myClients[0] || {
        name: user.displayName,
        loyaltyPoints: 0,
        clientId: user.clientId || ''
    };

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
        if (expandedPlanId === planId) {
            setExpandedPlanId(null);
        } else {
            setExpandedPlanId(planId);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="bg-gradient-to-r from-diva-dark to-diva-primary rounded-2xl p-8 text-white mb-8 shadow-lg animate-in fade-in slide-in-from-top-4">
                <h1 className="text-3xl font-serif mb-2">Olá, {client.name.split(' ')[0]}</h1>
                <p className="text-diva-light opacity-90">Bem-vinda de volta ao seu momento de cuidado.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Next Appointment */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30">
                    <div className="flex items-center mb-4 text-diva-primary">
                        <Calendar className="mr-2" size={24} />
                        <h2 className="text-lg font-bold text-diva-dark">Próximo Agendamento</h2>
                    </div>

                    {nextAppointment ? (
                        <div className="p-4 bg-diva-light/10 rounded-xl border border-diva-light/30 text-center">
                            <p className="text-diva-dark font-medium mb-1">{nextAppointment.serviceName}</p>
                            <p className="text-2xl font-bold text-diva-primary my-2">
                                {new Date(nextAppointment.startTime).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()}
                            </p>
                            <p className="text-gray-500">
                                {formatTime(nextAppointment.startTime)} - {nextAppointment.roomId}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Com {nextAppointment.staffName}</p>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                            <p className="text-gray-500 text-sm">Nenhum agendamento futuro</p>
                        </div>
                    )}

                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="w-full mt-4 bg-diva-primary text-white py-3 rounded-xl hover:bg-diva-dark transition-colors font-medium shadow-md"
                    >
                        Novo Agendamento
                    </button>
                </div>

                {/* Loyalty / Promotions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30">
                    <div className="flex items-center mb-4 text-diva-accent">
                        <Star className="mr-2" size={24} />
                        <h2 className="text-lg font-bold text-diva-dark">Diva Club</h2>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Pontos Acumulados</p>
                            <p className="text-3xl font-bold text-diva-dark">{client.loyaltyPoints || 0}</p>
                        </div>
                        <div className="h-12 w-12 bg-diva-accent/10 rounded-full flex items-center justify-center text-diva-accent">
                            <Tag size={20} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Resgate Disponível</h3>
                        {client.loyaltyPoints && client.loyaltyPoints >= 1000 ? (
                            <div className="flex items-center p-3 border border-diva-light/40 rounded-lg hover:border-diva-accent cursor-pointer transition-colors">
                                <div className="h-10 w-10 bg-gray-100 rounded-md mr-3 flex items-center justify-center text-xs font-bold text-gray-400">IMG</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-diva-dark">Peeling de Diamante</p>
                                    <p className="text-xs text-diva-accent font-bold">1.000 pts</p>
                                </div>
                                <button className="text-xs bg-diva-dark text-white px-2 py-1 rounded hover:bg-diva-primary">Resgatar</button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">Acumule mais pontos para desbloquear recompensas!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* SKINCARE & EVOLUTION SECTION - NEW! */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Skincare Plan */}
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
                                <div className="text-sm text-gray-700 whitespace-pre-wrap font-medium leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {latestSkincare.skincarePlan}
                                </div>
                            </div>
                            <button className="w-full py-2 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-bold flex items-center justify-center">
                                <FileText size={16} className="mr-2" /> Ver Histórico Completo
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Sparkles size={40} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">Ainda sem plano personalizado</p>
                            <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                                Agende uma consulta para receber sua rotina ideal de cuidados com a pele.
                            </p>
                        </div>
                    )}
                </div>

                {/* Photo Evolution (Secure) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30 flex flex-col">
                    <div className="flex items-center mb-4 text-diva-primary">
                        <Camera className="mr-2" size={24} />
                        <h2 className="text-lg font-bold text-diva-dark">Minha Evolução</h2>
                        <Lock size={14} className="ml-2 text-gray-400" />
                    </div>

                    {latestPhotos ? (
                        <div className="flex-1 flex flex-col">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative group">
                                    {latestPhotos.beforePhotos && latestPhotos.beforePhotos[0] ? (
                                        <img src={latestPhotos.beforePhotos[0]} alt="Antes" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">Sem foto</div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Antes</div>
                                </div>
                                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative group">
                                    {latestPhotos.afterPhotos && latestPhotos.afterPhotos[0] ? (
                                        <img src={latestPhotos.afterPhotos[0]} alt="Depois" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">Em breve</div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-diva-primary/90 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Depois</div>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gray-400 mb-4">
                                Registro de {formatDate(latestPhotos.date)} - {latestPhotos.serviceName}
                            </p>
                            <button className="w-full py-2 bg-diva-dark text-white rounded-lg hover:bg-diva-primary transition-colors text-sm font-bold flex items-center justify-center">
                                <Image size={16} className="mr-2" /> Acessar Galeria Privada
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Camera size={40} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">Nenhum registro fotográfico</p>
                            <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                                Suas fotos de 'Antes e Depois' aparecerão aqui após seus procedimentos.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* MY TREATMENTS / PLANS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30 mb-8">
                <div className="flex items-center mb-6 text-diva-primary">
                    <Package className="mr-2" size={24} />
                    <h2 className="text-lg font-bold text-diva-dark">Meus Tratamentos e Pacotes</h2>
                </div>

                {myPlans.length > 0 ? (
                    <div className="space-y-4">
                        {myPlans.map(plan => (
                            <div key={plan.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <div
                                    className="p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center cursor-pointer"
                                    onClick={() => togglePlanExpansion(plan.id)}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-gray-800">{plan.name}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${plan.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                plan.status === 'closed' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {plan.status === 'closed' ? 'Ativo' : plan.status === 'completed' ? 'Concluído' : 'Processando'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Adquirido em {formatDate(plan.createdAt)} • Profissional: {plan.professionalName}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 md:mt-0">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">Progresso Geral</p>
                                            {/* Calculate total progress */}
                                            {(() => {
                                                const totalSessions = plan.items.reduce((acc, i) => acc + i.quantity, 0);
                                                const usedSessions = plan.items.reduce((acc, i) => acc + i.sessionsUsed, 0);
                                                const percent = totalSessions > 0 ? Math.round((usedSessions / totalSessions) * 100) : 0;
                                                return (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-600">{percent}%</span>
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
                                                <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${item.sessionsUsed >= item.quantity ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                                                            {item.sessionsUsed >= item.quantity ? <CheckCircle size={16} /> : <Clock size={16} />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-gray-700">{item.serviceName}</p>
                                                            <p className="text-xs text-gray-400">
                                                                {item.sessionsUsed} de {item.quantity} sessões realizadas
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/3 max-w-[150px]">
                                                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                                            <span>Uso</span>
                                                            <span>{Math.round((item.sessionsUsed / item.quantity) * 100)}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${item.sessionsUsed >= item.quantity ? 'bg-green-500' : 'bg-diva-primary'}`}
                                                                style={{ width: `${(item.sessionsUsed / item.quantity) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mt-2 text-right">
                                                <button className="text-xs text-diva-primary font-bold hover:underline">
                                                    Ver detalhes financeiros
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Package size={40} className="mx-auto mb-3 text-gray-300" />
                        <h3 className="text-diva-dark font-medium">Nenhum plano ativo</h3>
                        <p className="text-sm text-gray-500 mt-1">Seus tratamentos adquiridos aparecerão aqui.</p>
                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="mt-4 text-sm text-diva-primary font-bold hover:underline"
                        >
                            Ver catálogo de serviços
                        </button>
                    </div>
                )}
            </div>

            {/* History */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-diva-light/30">
                <h2 className="text-lg font-bold text-diva-dark mb-4">Histórico Recente</h2>
                {recentHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase">
                                    <th className="pb-3 pl-2">Data</th>
                                    <th className="pb-3">Procedimento</th>
                                    <th className="pb-3">Profissional</th>
                                    <th className="pb-3">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentHistory.map(appt => (
                                    <tr key={appt.appointmentId} className="border-b border-gray-50">
                                        <td className="py-3 pl-2 text-gray-500">{formatDate(appt.startTime)}</td>
                                        <td className="py-3 font-medium text-diva-dark">{appt.serviceName}</td>
                                        <td className="py-3 text-gray-500">{appt.staffName}</td>
                                        <td className="py-3 text-gray-500">{formatCurrency(appt.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Clock size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Nenhum histórico de procedimentos ainda.</p>
                    </div>
                )}
            </div>

            {/* Booking Wizard Modal */}
            <BookingWizard
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                user={user}
            />
        </div>
    );
};

export default ClientPortalModule;
