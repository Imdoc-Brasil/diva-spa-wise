
import React, { useState, useMemo } from 'react';
import {
    TrendingUp,
    DollarSign,
    Activity,
    Users,
    AlertCircle,
    MapPin,
    Clock,
    Sun
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import DailyBriefingModal from './modals/DailyBriefingModal';
import { User, UserRole, AppointmentStatus, LeadStage } from '../types';
import { useUnitData } from './hooks/useUnitData';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { transactions, appointments, leads, clients, selectedUnitId, units } = useUnitData();
    const [isBriefingOpen, setIsBriefingOpen] = useState(false);

    // Mock User for Briefing (In real app, this comes from Auth Context)
    const mockUser: User = {
        uid: 'admin',
        organizationId: 'org_demo',
        email: 'admin@diva.com',
        displayName: 'Ana Gerente',
        role: UserRole.MANAGER
    };

    // --- 1. REAL-TIME METRICS CALCULATION ---

    // Date Helpers
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Faturamento Hoje
    const revenueToday = transactions
        .filter(t => t.type === 'income' && t.date === todayStr)
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Comparativo (Mockado para demo, mas lógica seria comparar com yesterday)
    const revenueYesterday = 6500;
    const revenueGrowth = revenueYesterday > 0 ? ((revenueToday - revenueYesterday) / revenueYesterday) * 100 : 0;

    // Salas Ocupadas (Agendamentos 'Em Progresso' ou no horário atual)
    const now = new Date();
    const occupiedRooms = appointments.filter(a => {
        const start = new Date(a.startTime);
        const end = new Date(a.endTime);
        return (a.status === AppointmentStatus.IN_PROGRESS) || (a.status === AppointmentStatus.CONFIRMED && now >= start && now <= end);
    }).length;
    const totalRooms = 6; // Hardcoded capacity

    // Novos Leads
    const newLeadsCount = leads.filter(l => l.stage === LeadStage.NEW).length;

    // NPS (Mockado por enquanto, poderia vir de feedbacks)
    const currentNPS = 92;

    // --- 2. DYNAMIC CHARTS DATA ---

    // Revenue Chart Data (Last 7 days from transactions)
    const revenueChartData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            const dayRevenue = transactions
                .filter(t => t.type === 'income' && t.date === date)
                .reduce((acc, t) => acc + t.amount, 0);

            // Meta fictícia para o gráfico ficar bonito
            const dailyTarget = 5000;

            return {
                day: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
                real: dayRevenue,
                meta: dailyTarget
            };
        });
    }, [transactions]);

    // Room Status for Pie Chart
    const roomStatusData = [
        { name: 'Livre', value: totalRooms - occupiedRooms, color: '#10B981' }, // Emerald 500
        { name: 'Ocupada', value: occupiedRooms, color: '#0F4C5C' }, // Diva Primary
    ];

    // Upcoming Appointments
    const upcomingAppointments = appointments
        .filter(a => new Date(a.startTime) > now && a.status !== AppointmentStatus.CANCELLED)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 3);

    // --- Comparative Data (Only if selectedUnitId === 'all') ---
    const comparativeData = useMemo(() => {
        if (selectedUnitId !== 'all') return null;

        return units.map(unit => {
            const unitRevenue = transactions
                .filter(t => t.unitId === unit.id && t.type === 'income')
                .reduce((acc, t) => acc + t.amount, 0);

            const unitAppointments = appointments
                .filter(a => a.unitId === unit.id)
                .length;

            return {
                name: unit.name.split(' ')[1] || unit.name, // Short name (e.g. "Jardins")
                revenue: unitRevenue,
                appointments: unitAppointments
            };
        });
    }, [selectedUnitId, units, transactions, appointments]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-serif font-bold text-diva-dark">Cockpit Executivo</h1>
                    <p className="text-gray-500 text-xs md:text-sm">Visão geral em tempo real da operação Diva Spa.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/master')}
                        className="bg-black text-yellow-400 border border-yellow-500/50 px-4 py-2 rounded-full text-xs font-bold flex items-center justify-center shadow-lg hover:shadow-yellow-500/20 transition-all hover:scale-105 animate-pulse-slow"
                    >
                        <TrendingUp size={14} className="mr-2" /> SaaS Master
                    </button>
                    <button
                        onClick={() => setIsBriefingOpen(true)}
                        className="bg-gradient-to-r from-diva-accent to-yellow-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                        <Sun size={14} className="mr-2" /> Briefing Matinal
                    </button>
                    <span className="bg-white border border-diva-light/30 text-gray-500 px-3 py-2 rounded-full text-xs font-medium flex items-center justify-center">
                        <Clock size={12} className="mr-1" /> Atualizado: {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* TOP ROW: Vital Signs (Live Metrics) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Metric 1: Revenue Today */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-diva-light/30 relative overflow-hidden group hover:border-diva-primary transition-colors cursor-pointer" onClick={() => navigate('/finance')}>
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Faturamento Hoje</p>
                            <h3 className="text-2xl font-bold text-diva-dark mt-1">{formatCurrency(revenueToday)}</h3>
                        </div>
                        <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs">
                        <span className={`font-bold flex items-center mr-2 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            <TrendingUp size={12} className="mr-1" /> {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                        </span>
                        <span className="text-gray-400">vs. ontem</span>
                    </div>
                    {/* Mini Chart Background */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 opacity-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueChartData}>
                                <Area type="monotone" dataKey="real" stroke="#0F4C5C" fill="#0F4C5C" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Metric 2: Occupancy */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-diva-light/30 hover:border-diva-primary transition-colors cursor-pointer" onClick={() => navigate('/rooms')}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Salas Ocupadas</p>
                            <h3 className="text-2xl font-bold text-diva-dark mt-1">{occupiedRooms} <span className="text-sm text-gray-400 font-normal">/ {totalRooms}</span></h3>
                        </div>
                        <div className="bg-diva-light/20 text-diva-dark p-2 rounded-lg">
                            <MapPin size={20} />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 w-full">
                        {Array.from({ length: totalRooms }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full ${i < occupiedRooms ? 'bg-diva-primary' : 'bg-gray-200'}`}
                            ></div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{Math.round((occupiedRooms / totalRooms) * 100)}% de Ocupação atual</p>
                </div>

                {/* Metric 3: Active Leads */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-diva-light/30 hover:border-diva-primary transition-colors cursor-pointer" onClick={() => navigate('/funnel')}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Novos Leads</p>
                            <h3 className="text-2xl font-bold text-diva-dark mt-1">{newLeadsCount}</h3>
                        </div>
                        <div className="bg-pink-50 text-pink-500 p-2 rounded-lg">
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className="mt-3 flex -space-x-2">
                        {leads.slice(0, 4).map((lead, i) => (
                            <div key={lead.leadId} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500" title={lead.name}>
                                {lead.name.charAt(0)}
                            </div>
                        ))}
                        {leads.length > 4 && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">+{leads.length - 4}</div>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Aguardando contato</p>
                </div>

                {/* Metric 4: NPS */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-diva-light/30 hover:border-diva-primary transition-colors cursor-pointer" onClick={() => navigate('/reputation')}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">NPS do Mês</p>
                            <h3 className="text-2xl font-bold text-diva-accent mt-1">{currentNPS}</h3>
                        </div>
                        <div className="bg-orange-50 text-diva-accent p-2 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs">
                        <span className="text-green-600 font-bold flex items-center mr-2">
                            <TrendingUp size={12} className="mr-1" /> +2pts
                        </span>
                        <span className="text-gray-400">Zona de Excelência</span>
                    </div>
                </div>
            </div>

            {/* Comparative View (Consolidated Only) */}
            {selectedUnitId === 'all' && comparativeData && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-diva-dark text-lg">Performance por Unidade</h3>
                            <p className="text-xs text-gray-500">Comparativo de Faturamento e Volume de Agendamentos</p>
                        </div>
                    </div>
                    <div className="h-56 md:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparativeData} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#0F4C5C', fontSize: 12 }} tickFormatter={(val) => `R$${val / 1000}k`} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#BF784E', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number, name: string) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Faturamento' : 'Agendamentos']}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar yAxisId="left" dataKey="revenue" name="Faturamento" fill="#0F4C5C" radius={[4, 4, 0, 0]} barSize={40} />
                                <Bar yAxisId="right" dataKey="appointments" name="Agendamentos" fill="#BF784E" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* MIDDLE ROW: Operational Control & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart: Performance vs Goal */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-diva-dark">Performance Semanal</h3>
                            <p className="text-xs text-gray-500">Receita Realizada vs Meta</p>
                        </div>
                        <div className="text-xs font-bold text-diva-primary bg-diva-light/20 px-2 py-1 rounded">
                            Total Semana: {formatCurrency(revenueChartData.reduce((a, b) => a + b.real, 0))}
                        </div>
                    </div>
                    <div className="h-48 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueChartData} barGap={0}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                    formatter={(value: number) => [formatCurrency(value), '']}
                                />
                                <Bar dataKey="real" fill="#0F4C5C" radius={[4, 4, 0, 0]} name="Realizado" />
                                <Bar dataKey="meta" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Meta" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Action Center (Alerts) */}
                <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 flex flex-col">
                    <div className="p-5 border-b border-diva-light/20 flex justify-between items-center">
                        <h3 className="font-bold text-diva-dark flex items-center">
                            <AlertCircle size={18} className="mr-2 text-diva-alert" /> Central de Ação
                        </h3>
                        <span className="bg-diva-alert text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-3">
                        {/* Alert 1 */}
                        <div className="flex gap-3 items-start p-3 rounded-lg bg-red-50 border border-red-100 cursor-pointer hover:bg-red-100 transition-colors">
                            <div className="mt-1">
                                <AlertCircle size={16} className="text-diva-alert" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-diva-alert">Conta em Atraso</p>
                                <p className="text-xs text-diva-dark">Fatura de Energia venceu ontem (R$ 1.200)</p>
                                <button onClick={() => navigate('/finance')} className="text-[10px] font-bold text-diva-alert underline mt-1">Resolver no Financeiro</button>
                            </div>
                        </div>

                        {/* Alert 2 */}
                        <div className="flex gap-3 items-start p-3 rounded-lg bg-yellow-50 border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors">
                            <div className="mt-1">
                                <Clock size={16} className="text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-yellow-700">Atenção Estoque</p>
                                <p className="text-xs text-diva-dark">Botox abaixo do nível mínimo.</p>
                                <button onClick={() => navigate('/marketplace')} className="text-[10px] font-bold text-yellow-700 underline mt-1">Ver Estoque</button>
                            </div>
                        </div>

                        {/* Alert 3 */}
                        <div className="flex gap-3 items-start p-3 rounded-lg bg-blue-50 border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                            <div className="mt-1">
                                <Activity size={16} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-blue-700">Leads Recentes</p>
                                <p className="text-xs text-diva-dark">{newLeadsCount} novos contatos sem resposta.</p>
                                <button onClick={() => navigate('/funnel')} className="text-[10px] font-bold text-blue-700 underline mt-1">Responder</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: Operational Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Room Status Mini-Map */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-diva-light/30">
                    <h3 className="font-bold text-diva-dark text-sm mb-4">Status das Salas</h3>
                    <div className="flex items-center justify-between">
                        <div className="w-32 h-32 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roomStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={25}
                                        outerRadius={40}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {roomStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="text-sm font-bold text-diva-dark">{occupiedRooms}/{totalRooms}</span>
                            </div>
                        </div>
                        <div className="flex-1 ml-4 space-y-2">
                            {roomStatusData.map((status, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: status.color }}></div>
                                        <span className="text-gray-600">{status.name}</span>
                                    </div>
                                    <span className="font-bold">{status.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Agenda */}
                <div className="md:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-diva-light/30">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-diva-dark text-sm">Próximos Agendamentos</h3>
                        <button onClick={() => navigate('/schedule')} className="text-xs text-diva-primary font-medium hover:underline">Ver Agenda Completa</button>
                    </div>
                    <div className="space-y-3">
                        {upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map(appt => (
                                <div key={appt.appointmentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:border-diva-primary cursor-pointer" onClick={() => navigate('/schedule')}>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-diva-light/30 text-diva-dark w-12 h-12 rounded-lg flex flex-col items-center justify-center border border-diva-light/50">
                                            <span className="text-xs font-bold">{new Date(appt.startTime).getHours()}:{new Date(appt.startTime).getMinutes().toString().padStart(2, '0')}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-diva-dark">{appt.clientName}</p>
                                            <p className="text-xs text-gray-500">{appt.serviceName} • {appt.roomId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase border ${appt.status === AppointmentStatus.CONFIRMED ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                Nenhum agendamento próximo encontrado.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DailyBriefingModal
                isOpen={isBriefingOpen}
                onClose={() => setIsBriefingOpen(false)}
                user={mockUser}
            />
        </div>
    );
};

export default Dashboard;
