
import React, { useState } from 'react';
import { WorkShift, Kudo, StaffMember } from '../../types';
import { UserCheck, Star, Award, TrendingUp, Clock, MoreVertical, Shield, Calendar, Briefcase, Coffee, Sun, AlertCircle, Heart, Smile, Trophy, Medal, Edit } from 'lucide-react';
import { useData } from '../context/DataContext';
import NewStaffModal from '../modals/NewStaffModal';

// Mock Shifts for the current week (Mon-Sat)
const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const mockShifts: Record<string, Record<string, WorkShift>> = {
    's1': {
        'Segunda': { id: 'sh1', staffId: 's1', date: '2023-10-23', type: 'work', startTime: '09:00', endTime: '18:00' },
        'Terça': { id: 'sh2', staffId: 's1', date: '2023-10-24', type: 'work', startTime: '09:00', endTime: '18:00' },
        'Quarta': { id: 'sh3', staffId: 's1', date: '2023-10-25', type: 'off' },
        'Quinta': { id: 'sh4', staffId: 's1', date: '2023-10-26', type: 'work', startTime: '13:00', endTime: '20:00' },
        'Sexta': { id: 'sh5', staffId: 's1', date: '2023-10-27', type: 'work', startTime: '09:00', endTime: '18:00' },
        'Sábado': { id: 'sh6', staffId: 's1', date: '2023-10-28', type: 'work', startTime: '09:00', endTime: '14:00' },
    },
    's2': {
        'Segunda': { id: 'sh7', staffId: 's2', date: '2023-10-23', type: 'vacation' },
        'Terça': { id: 'sh8', staffId: 's2', date: '2023-10-24', type: 'vacation' },
        'Quarta': { id: 'sh9', staffId: 's2', date: '2023-10-25', type: 'vacation' },
        'Quinta': { id: 'sh10', staffId: 's2', date: '2023-10-26', type: 'vacation' },
        'Sexta': { id: 'sh11', staffId: 's2', date: '2023-10-27', type: 'vacation' },
        'Sábado': { id: 'sh12', staffId: 's2', date: '2023-10-28', type: 'off' },
    },
    's3': {
        'Segunda': { id: 'sh13', staffId: 's3', date: '2023-10-23', type: 'work', startTime: '08:00', endTime: '17:00' },
        'Terça': { id: 'sh14', staffId: 's3', date: '2023-10-24', type: 'work', startTime: '08:00', endTime: '17:00' },
        'Quarta': { id: 'sh15', staffId: 's3', date: '2023-10-25', type: 'work', startTime: '08:00', endTime: '17:00' },
        'Quinta': { id: 'sh16', staffId: 's3', date: '2023-10-26', type: 'work', startTime: '08:00', endTime: '17:00' },
        'Sexta': { id: 'sh17', staffId: 's3', date: '2023-10-27', type: 'work', startTime: '08:00', endTime: '17:00' },
        'Sábado': { id: 'sh18', staffId: 's3', date: '2023-10-28', type: 'work', startTime: '08:00', endTime: '13:00' },
    }
};

const mockKudos: Kudo[] = [
    { id: 'k1', fromStaffId: 's1', fromStaffName: 'Dra. Julia', toStaffId: 's3', toStaffName: 'Fernanda', message: 'Obrigada por encaixar a paciente de emergência hoje! Salvou o dia.', date: '2h atrás', type: 'help' },
    { id: 'k2', fromStaffId: 's3', fromStaffName: 'Fernanda', toStaffId: 's2', toStaffName: 'Carla', message: 'Parabéns pelo elogio que recebeu no Google! Merecido.', date: '1d atrás', type: 'excellence' },
];

const StaffModule: React.FC = () => {
    const { staff } = useData();
    const [activeTab, setActiveTab] = useState<'team' | 'roster' | 'culture'>('team');
    const [shifts, setShifts] = useState(mockShifts);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-500';
            case 'busy': return 'bg-diva-alert';
            case 'break': return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'available': return 'Disponível';
            case 'busy': return 'Em Atendimento';
            case 'break': return 'Intervalo';
            default: return 'Offline';
        }
    };

    // Roster Logic
    const handleToggleShift = (staffId: string, day: string) => {
        const current = shifts[staffId]?.[day];
        if (!current) return;

        let nextShift: WorkShift;

        if (current.type === 'work') nextShift = { ...current, type: 'off', startTime: undefined, endTime: undefined };
        else if (current.type === 'off') nextShift = { ...current, type: 'vacation' };
        else nextShift = { ...current, type: 'work', startTime: '09:00', endTime: '18:00' };

        setShifts({
            ...shifts,
            [staffId]: {
                ...shifts[staffId],
                [day]: nextShift
            }
        });
    };

    const getShiftColor = (type: string) => {
        switch (type) {
            case 'work': return 'bg-green-100 border-green-300 text-green-800';
            case 'off': return 'bg-gray-100 border-gray-200 text-gray-400';
            case 'vacation': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'sick': return 'bg-red-100 border-red-300 text-red-800';
            default: return 'bg-white';
        }
    };

    const getShiftLabel = (shift: WorkShift) => {
        if (shift.type === 'work') return `${shift.startTime} - ${shift.endTime}`;
        if (shift.type === 'off') return 'Folga';
        if (shift.type === 'vacation') return 'Férias';
        if (shift.type === 'sick') return 'Atestado';
        return '-';
    };

    return (
        <div className="space-y-6">
            {/* Header Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif text-diva-dark">Gestão de Pessoas</h2>
                    <p className="text-gray-500 text-sm">Equipe, Escalas e Cultura Organizacional.</p>
                </div>

                {/* Tab Toggle */}
                <div className="bg-gray-100 p-1 rounded-lg flex gap-2">
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center ${activeTab === 'team' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500'}`}
                    >
                        <UserCheck size={16} className="mr-2" /> Time & Metas
                    </button>
                    <button
                        onClick={() => setActiveTab('roster')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center ${activeTab === 'roster' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500'}`}
                    >
                        <Calendar size={16} className="mr-2" /> Escala
                    </button>
                    <button
                        onClick={() => setActiveTab('culture')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center ${activeTab === 'culture' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500'}`}
                    >
                        <Heart size={16} className="mr-2" /> Cultura
                    </button>
                </div>
            </div>

            {/* TAB: TEAM & METRICS */}
            {activeTab === 'team' && (
                <div className="space-y-8 animate-in fade-in">
                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg border border-diva-light/30 shadow-sm flex items-center">
                            <UserCheck size={20} className="text-diva-primary mr-3" />
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Ativos Hoje</p>
                                <p className="text-lg font-bold text-diva-dark">{staff.filter(s => s.status !== 'off').length}/{staff.length}</p>
                            </div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-diva-light/30 shadow-sm flex items-center">
                            <Award size={20} className="text-diva-accent mr-3" />
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Top Performance</p>
                                <p className="text-lg font-bold text-diva-dark">Dra. Julia</p>
                            </div>
                        </div>
                    </div>

                    {/* Staff Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {staff.map((member) => (
                            <div key={member.id} className="bg-white rounded-xl shadow-sm border border-diva-light/30 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Card Header */}
                                <div className="p-6 border-b border-diva-light/20 flex justify-between items-start">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-full bg-diva-light/30 flex items-center justify-center text-diva-dark text-xl font-bold border-2 border-white shadow-sm">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} title={getStatusLabel(member.status)}></div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-diva-dark">{member.name}</h3>
                                            <p className="text-xs text-diva-primary font-medium bg-diva-primary/10 px-2 py-0.5 rounded-full w-max mt-1">{member.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingStaff(member);
                                            setIsStaffModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Editar Profissional"
                                    >
                                        <Edit size={18} className="text-diva-primary" />
                                    </button>
                                </div>

                                {/* Metrics Row */}
                                <div className="grid grid-cols-3 divide-x divide-diva-light/20 bg-gray-50/50">
                                    <div className="p-4 text-center">
                                        <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Receita</p>
                                        <p className="text-sm font-bold text-diva-dark">{formatCurrency(member.performanceMetrics.monthlyRevenue)}</p>
                                    </div>
                                    <div className="p-4 text-center">
                                        <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Atendimentos</p>
                                        <p className="text-sm font-bold text-diva-dark">{member.performanceMetrics.appointmentsCount}</p>
                                    </div>
                                    <div className="p-4 text-center">
                                        <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">NPS</p>
                                        <div className="flex items-center justify-center text-sm font-bold text-diva-accent">
                                            <Star size={12} className="fill-current mr-1" />
                                            {member.performanceMetrics.npsScore}
                                        </div>
                                    </div>
                                </div>

                                {/* Goals / OKRs Section */}
                                <div className="p-6 space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                                        <TrendingUp size={14} className="mr-2" /> Metas do Mês
                                    </h4>

                                    {member.activeGoals.map(goal => {
                                        const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
                                        return (
                                            <div key={goal.id}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-600">{goal.title}</span>
                                                    <span className="font-bold text-diva-dark">
                                                        {goal.unit === 'currency' ? formatCurrency(goal.current) : goal.current}
                                                        <span className="text-gray-400 font-normal"> / {goal.unit === 'currency' ? formatCurrency(goal.target) : goal.target}</span>
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-green-500' : 'bg-diva-accent'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Footer Actions */}
                                <div className="p-4 bg-gray-50 border-t border-diva-light/20 grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center text-xs font-medium text-diva-dark bg-white border border-diva-light/50 py-2 rounded hover:bg-diva-light/20 transition-colors">
                                        <Clock size={14} className="mr-2" />
                                        Ver Agenda
                                    </button>
                                    <button className="flex items-center justify-center text-xs font-medium text-white bg-diva-dark py-2 rounded hover:bg-opacity-90 transition-colors">
                                        <Shield size={14} className="mr-2" />
                                        Detalhes
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add New Staff Card */}
                        <div
                            onClick={() => {
                                setEditingStaff(null);
                                setIsStaffModalOpen(true);
                            }}
                            className="border-2 border-dashed border-diva-light/40 rounded-xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-diva-primary hover:text-diva-primary hover:bg-diva-primary/5 transition-all cursor-pointer min-h-[300px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-diva-light/20 flex items-center justify-center mb-4">
                                <UserCheck size={32} />
                            </div>
                            <h3 className="font-bold text-lg">Adicionar Staff</h3>
                            <p className="text-sm text-center mt-2 max-w-[200px]">Cadastre um novo profissional e defina suas metas.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: ROSTER & SHIFTS */}
            {activeTab === 'roster' && (
                <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col animate-in fade-in">
                    <div className="p-6 border-b border-diva-light/20 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-diva-dark text-lg flex items-center">
                                <Calendar className="mr-2 text-diva-primary" /> Escala Semanal
                            </h3>
                            <p className="text-sm text-gray-500">Clique nos horários para alterar (Trabalho / Folga / Férias).</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center text-xs text-gray-500 gap-2">
                                <span className="flex items-center"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-1"></div> Trabalho</span>
                                <span className="flex items-center"><div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-1"></div> Folga</span>
                                <span className="flex items-center"><div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-1"></div> Férias</span>
                            </div>
                            <button className="text-xs font-bold border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
                                Próxima Semana &gt;
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase w-48">Profissional</th>
                                    {weekDays.map(day => (
                                        <th key={day} className="p-4 text-center text-xs font-bold text-gray-500 uppercase">{day}</th>
                                    ))}
                                    <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase w-24">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {staff.map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-diva-light/30 flex items-center justify-center text-xs font-bold text-diva-dark">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-diva-dark">{member.name}</p>
                                                    <p className="text-[10px] text-gray-500">{member.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {weekDays.map(day => {
                                            const shift = shifts[member.id]?.[day];
                                            return (
                                                <td key={day} className="p-2 text-center">
                                                    <button
                                                        onClick={() => handleToggleShift(member.id, day)}
                                                        className={`w-full py-2 px-1 rounded-lg border text-xs font-bold transition-all hover:scale-105 hover:shadow-sm ${shift ? getShiftColor(shift.type) : 'bg-gray-50 text-gray-300 border-transparent'}`}
                                                    >
                                                        {shift ? getShiftLabel(shift) : '-'}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                        <td className="p-4 text-center">
                                            <span className="text-xs font-mono font-bold text-diva-primary bg-diva-primary/10 px-2 py-1 rounded">
                                                {/* Mock calc */}
                                                {shifts[member.id] ? Object.values(shifts[member.id]).filter((s: WorkShift) => s.type === 'work').length * 8 : 0}h
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Alert Footer */}
                    <div className="p-4 bg-orange-50 border-t border-orange-100 text-xs text-orange-800 flex items-center">
                        <AlertCircle size={14} className="mr-2" />
                        Atenção: Dra. Julia está próxima do limite de horas extras semanais.
                    </div>
                </div>
            )}

            {/* TAB: CULTURE & GAMIFICATION */}
            {activeTab === 'culture' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">

                    {/* Gamification Arena */}
                    <div className="bg-gradient-to-br from-indigo-900 to-diva-dark p-6 rounded-xl text-white shadow-lg flex flex-col relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg flex items-center">
                                <Trophy className="text-yellow-400 mr-2" /> Arena de Campeões
                            </h3>
                            <p className="text-white/60 text-sm mb-8">Ranking de Vendas - Outubro</p>

                            <div className="flex justify-center items-end gap-4 h-64 pb-4">
                                {/* 2nd Place */}
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-300 border-4 border-white mb-2 flex items-center justify-center text-gray-700 font-bold text-xl">C</div>
                                    <div className="w-20 bg-white/10 rounded-t-lg h-32 flex items-end justify-center pb-2 backdrop-blur-md border border-white/10">
                                        <span className="font-bold text-2xl">2</span>
                                    </div>
                                    <p className="font-bold mt-2 text-sm">Carla</p>
                                    <p className="text-xs opacity-70">R$ 12k</p>
                                </div>

                                {/* 1st Place */}
                                <div className="flex flex-col items-center">
                                    <Medal className="text-yellow-400 mb-1 animate-bounce" size={32} />
                                    <div className="w-20 h-20 rounded-full bg-yellow-400 border-4 border-white mb-2 flex items-center justify-center text-yellow-800 font-bold text-2xl shadow-lg">J</div>
                                    <div className="w-24 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg h-48 flex items-end justify-center pb-2 shadow-lg">
                                        <span className="font-bold text-3xl text-yellow-900">1</span>
                                    </div>
                                    <p className="font-bold mt-2 text-lg">Dra. Julia</p>
                                    <p className="text-sm font-bold text-yellow-300">R$ 28k</p>
                                </div>

                                {/* 3rd Place */}
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-orange-400 border-4 border-white mb-2 flex items-center justify-center text-orange-900 font-bold text-xl">F</div>
                                    <div className="w-20 bg-white/10 rounded-t-lg h-24 flex items-end justify-center pb-2 backdrop-blur-md border border-white/10">
                                        <span className="font-bold text-2xl">3</span>
                                    </div>
                                    <p className="font-bold mt-2 text-sm">Fernanda</p>
                                    <p className="text-xs opacity-70">R$ 5k</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    </div>

                    {/* Team Pulse & Kudos */}
                    <div className="flex flex-col gap-6">

                        {/* Pulse */}
                        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm">
                            <h3 className="font-bold text-diva-dark text-sm mb-4">Clima da Equipe (Hoje)</h3>
                            <div className="flex justify-between items-center px-4">
                                <div className="text-center">
                                    <span className="text-3xl grayscale hover:grayscale-0 transition-all cursor-default">😁</span>
                                    <div className="h-16 w-2 bg-green-100 rounded-full mt-2 mx-auto relative">
                                        <div className="absolute bottom-0 w-full bg-green-500 rounded-full" style={{ height: '60%' }}></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="text-3xl grayscale hover:grayscale-0 transition-all cursor-default">🙂</span>
                                    <div className="h-16 w-2 bg-yellow-100 rounded-full mt-2 mx-auto relative">
                                        <div className="absolute bottom-0 w-full bg-yellow-500 rounded-full" style={{ height: '30%' }}></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="text-3xl grayscale hover:grayscale-0 transition-all cursor-default">😴</span>
                                    <div className="h-16 w-2 bg-blue-100 rounded-full mt-2 mx-auto relative">
                                        <div className="absolute bottom-0 w-full bg-blue-500 rounded-full" style={{ height: '10%' }}></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="text-3xl grayscale hover:grayscale-0 transition-all cursor-default">🤯</span>
                                    <div className="h-16 w-2 bg-red-100 rounded-full mt-2 mx-auto relative">
                                        <div className="absolute bottom-0 w-full bg-red-500 rounded-full" style={{ height: '0%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-4">Baseado em 3 check-ins hoje.</p>
                        </div>

                        {/* Kudos Wall */}
                        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex-1 overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-diva-dark text-sm flex items-center">
                                    <Heart className="text-pink-500 mr-2" size={16} fill="currentColor" /> Mural de Elogios
                                </h3>
                                <button className="text-xs text-diva-primary font-bold hover:underline">Ver Todos</button>
                            </div>

                            <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                                {mockKudos.map(kudo => (
                                    <div key={kudo.id} className="bg-pink-50/50 p-3 rounded-lg border border-pink-100">
                                        <p className="text-xs text-gray-500 mb-1 flex justify-between">
                                            <span>De <strong>{kudo.fromStaffName}</strong> para <strong>{kudo.toStaffName}</strong></span>
                                            <span>{kudo.date}</span>
                                        </p>
                                        <p className="text-sm text-diva-dark italic">"{kudo.message}"</p>
                                        <div className="mt-2 flex gap-1">
                                            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-pink-200 text-pink-600 font-bold uppercase">{kudo.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* New Staff Modal */}
            <NewStaffModal
                isOpen={isStaffModalOpen}
                onClose={() => {
                    setIsStaffModalOpen(false);
                    setEditingStaff(null);
                }}
                editingStaff={editingStaff}
            />
        </div>
    );
};

export default StaffModule;
