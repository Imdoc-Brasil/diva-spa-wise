
import React, { useState, useMemo } from 'react';
import {
    Layout, Plus, FileText, ClipboardList, TrendingUp, CheckCircle,
    AlertCircle, Search, Filter, MoreHorizontal, User, Calendar,
    Share2, Download, DollarSign, Clock, GripVertical, PieChart as PieChartIcon, Activity
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    TreatmentPlan, TreatmentPlanTemplate, PlanStatus
} from '../../types';
import { MOCK_TREATMENT_PLANS, MOCK_TREATMENT_TEMPLATES } from '../../utils/mockTreatmentPlans';
import { useToast } from '../ui/ToastContext';
import { useData } from '../context/DataContext';
import { generateTreatmentPlanPDF } from '../../utils/pdfGenerator';

// Components
import PrescribePlanModal from '../modals/PrescribePlanModal';
import PlanDetailsModal from '../modals/PlanDetailsModal';

const TreatmentPlansModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'pipeline' | 'prescriptions' | 'templates'>('dashboard');
    const { treatmentPlans: plans, treatmentTemplates: templates, addTreatmentPlan, updateTreatmentPlan } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    // Modal States
    const [isPrescribeModalOpen, setIsPrescribeModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);

    // Drag & Drop State
    const [draggedPlanId, setDraggedPlanId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    // Dashboard Filters
    const [period, setPeriod] = useState<'this_month' | 'last_month' | 'quarter'>('this_month');

    // --- Dynamic Data Calculation ---

    // 1. Filter Plans by Period & Search
    const getFilteredPlans = () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const startOfQuarter = new Date(now.getFullYear(), now.getMonth() - 3, 1);

        return plans.filter(p => {
            const pDate = new Date(p.createdAt);
            const matchesSearch = p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.name.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (activeTab === 'dashboard') {
                if (period === 'this_month') return pDate >= startOfMonth;
                if (period === 'last_month') return pDate >= startOfLastMonth && pDate <= endOfLastMonth;
                if (period === 'quarter') return pDate >= startOfQuarter;
            }
            return true;
        });
    };

    const displayPlans = useMemo(() => getFilteredPlans(), [plans, period, searchTerm, activeTab]);

    // 2. Stats Calculations (Based on displayPlans)
    const totalPotential = displayPlans.reduce((acc, p) => p.status !== 'lost' && p.status !== 'completed' ? acc + p.total : acc, 0);
    const activeNegotiations = displayPlans.filter(p => p.status === 'prescribed' || p.status === 'negotiating').length;

    // 3. Funnel Stats
    const funnelStats = [
        { name: 'Novo', value: displayPlans.filter(p => p.pipelineStage === 'Novo' || !p.pipelineStage).length, fill: '#9CA3AF' },
        { name: 'Apresentado', value: displayPlans.filter(p => p.pipelineStage === 'Apresentado').length, fill: '#60A5FA' },
        { name: 'Negociação', value: displayPlans.filter(p => p.pipelineStage === 'Em Negociação').length, fill: '#FBBF24' },
        { name: 'Fechado', value: displayPlans.filter(p => p.status === 'closed' || p.status === 'completed').length, fill: '#34D399' },
    ];

    // 4. Professional Performance
    const profPerf = useMemo(() => {
        return displayPlans.reduce((acc, plan) => {
            const prof = plan.professionalName || 'Sem Profissional';
            if (!acc[prof]) acc[prof] = { name: prof, total: 0, count: 0, closed: 0, conversion: 0 };
            acc[prof].total += plan.total;
            acc[prof].count += 1;
            if (plan.status === 'closed' || plan.status === 'completed' || plan.status === 'partially_paid') {
                acc[prof].closed += 1;
            }
            acc[prof].conversion = acc[prof].count > 0 ? (acc[prof].closed / acc[prof].count) * 100 : 0;
            return acc;
        }, {} as Record<string, any>);
    }, [displayPlans]);

    const professionalData = Object.values(profPerf);

    // 5. Top Services (Dynamic Aggregation)
    const serviceStats = useMemo(() => {
        const counts: Record<string, number> = {};
        displayPlans.forEach(plan => {
            plan.items.forEach(item => {
                const name = item.serviceName;
                counts[name] = (counts[name] || 0) + (item.quantity || 1);
            });
        });

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5
    }, [displayPlans]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const getStatusColor = (status: PlanStatus) => {
        switch (status) {
            case 'prescribed': return 'bg-blue-100 text-blue-800';
            case 'negotiating': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-green-100 text-green-800';
            case 'partially_paid': return 'bg-purple-100 text-purple-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'lost': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: PlanStatus) => {
        switch (status) {
            case 'prescribed': return 'Prescrito';
            case 'negotiating': return 'Em Negociação';
            case 'closed': return 'Fechado';
            case 'partially_paid': return 'Parc. Pago';
            case 'completed': return 'Concluído';
            case 'lost': return 'Perdido';
            default: return status;
        }
    };

    // --- Actions ---
    const handleDownloadPDF = (e: React.MouseEvent, plan: TreatmentPlan) => {
        e.stopPropagation();
        try {
            generateTreatmentPlanPDF(plan);
            addToast('PDF gerado com sucesso!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Erro ao gerar PDF.', 'error');
        }
    };

    const handleSendWhatsApp = (e: React.MouseEvent, plan: TreatmentPlan) => {
        e.stopPropagation();
        const message = `Olá ${plan.clientName}, segue seu orçamento *${plan.name}*. Total: ${formatCurrency(plan.total)}.`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        addToast('WhatsApp aberto! Por favor, anexe o PDF baixado.', 'info');
    };

    // --- Drag & Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, planId: string) => {
        setDraggedPlanId(planId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, stage: string) => {
        e.preventDefault();
        if (dragOverColumn !== stage) {
            setDragOverColumn(stage);
        }
    };

    const handleDrop = (e: React.DragEvent, stage: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        if (draggedPlanId) {
            const plan = plans.find(p => p.id === draggedPlanId);
            if (plan && plan.pipelineStage !== stage) {
                // Determine new status based on stage
                let newStatus = plan.status;
                if (stage === 'Fechado') newStatus = 'closed';
                else if (stage === 'Em Negociação') newStatus = 'negotiating';
                else if (stage === 'Novo') newStatus = 'prescribed';

                updateTreatmentPlan({
                    ...plan,
                    pipelineStage: stage,
                    status: newStatus
                });
                addToast(`Plano movido para ${stage}`, 'success');
            }
        }
        setDraggedPlanId(null);
    };

    const PIPELINE_STAGES = ['Novo', 'Apresentado', 'Em Negociação', 'Fechado'];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">

            {/* Header Stats */}
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-diva-primary/10 rounded-xl text-diva-primary">
                        <ClipboardList size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-diva-dark">Planos de Tratamento</h1>
                        <p className="text-sm text-gray-500">Gestão de orçamentos, pipeline visual e indicadores de performance.</p>
                    </div>
                </div>
                <div className="flex gap-6 text-right">
                    <div>
                        <p className="text-xs uppercase font-bold text-gray-400">Em Negociação</p>
                        <p className="text-2xl font-bold text-diva-dark">{activeNegotiations}</p>
                    </div>
                    <div className="border-l border-gray-200 pl-6">
                        <p className="text-xs uppercase font-bold text-gray-400">Pipeline Total</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPotential)}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">

                {/* Tabs & Actions */}
                <div className="border-b border-diva-light/20 px-6 pt-4 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 shrink-0">
                    <div className="flex space-x-6 w-full md:w-auto overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center whitespace-nowrap ${activeTab === 'dashboard' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                        >
                            <Activity size={16} className="mr-2" /> Indicadores
                        </button>
                        <button
                            onClick={() => setActiveTab('pipeline')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center whitespace-nowrap ${activeTab === 'pipeline' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                        >
                            <GripVertical size={16} className="mr-2" /> Pipeline (Kanban)
                        </button>
                        <button
                            onClick={() => setActiveTab('prescriptions')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center whitespace-nowrap ${activeTab === 'prescriptions' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                        >
                            <FileText size={16} className="mr-2" /> Todas Prescrições
                        </button>
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center whitespace-nowrap ${activeTab === 'templates' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                        >
                            <Layout size={16} className="mr-2" /> Modelos
                        </button>
                    </div>

                    <div className="flex gap-3 py-3 md:py-0 w-full md:w-auto justify-end">
                        {activeTab !== 'dashboard' && (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-diva-primary w-full md:w-56"
                                />
                            </div>
                        )}
                        <button
                            onClick={() => setIsPrescribeModalOpen(true)}
                            className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-diva-dark transition-colors shadow-md flex items-center whitespace-nowrap shadow-diva-primary/20"
                        >
                            <Plus size={16} className="mr-2" /> Nova Prescrição
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden p-6 bg-gray-50/50">

                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-4 custom-scrollbar">
                            {/* Filter Bar */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-700 text-lg">Visão Geral de Performance</h3>
                                <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                                    <button
                                        onClick={() => setPeriod('this_month')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${period === 'this_month' ? 'bg-diva-primary/10 text-diva-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Este Mês
                                    </button>
                                    <button
                                        onClick={() => setPeriod('last_month')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${period === 'last_month' ? 'bg-diva-primary/10 text-diva-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Mês Passado
                                    </button>
                                    <button
                                        onClick={() => setPeriod('quarter')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${period === 'quarter' ? 'bg-diva-primary/10 text-diva-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Trimestre
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={18} /></div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Prescrições</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{displayPlans.length}</p>
                                    <p className="text-xs text-green-500 font-bold mt-1 flex items-center"><TrendingUp size={10} className="mr-1" /> +12% vs mês anterior</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={18} /></div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Planos Fechados</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{displayPlans.filter(p => p.status === 'closed').length}</p>
                                    <p className="text-xs text-gray-400 mt-1">Total acumulado</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={18} /></div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Taxa de Conversão</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {displayPlans.length > 0 ? ((displayPlans.filter(p => p.status === 'closed').length / displayPlans.length) * 100).toFixed(1) : 0}%
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Global</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><DollarSign size={18} /></div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Ticket Médio</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {displayPlans.length > 0 ? formatCurrency(displayPlans.reduce((acc, p) => acc + p.total, 0) / displayPlans.length) : 'R$ 0,00'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Por plano</p>
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Funnel Chart */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80 flex flex-col">
                                    <h4 className="font-bold text-gray-700 mb-4 text-sm">Funil de Vendas (Quantidade)</h4>
                                    <div className="flex-1 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={funnelStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                                                    {funnelStats.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Professional Performance */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80 flex flex-col">
                                    <h4 className="font-bold text-gray-700 mb-4 text-sm">Performance por Profissional (Valor Total Prescrito)</h4>
                                    <div className="flex-1 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={professionalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `R$${val / 1000}k`} />
                                                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                                                <Bar dataKey="total" fill="#DDA0DD" radius={[4, 4, 0, 0]} barSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Top Services */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
                                <h4 className="font-bold text-gray-700 mb-4 text-sm">Serviços Mais Prescritos (Top 5)</h4>
                                <div className="space-y-4">
                                    {serviceStats.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-4">Nenhum serviço prescrito no período.</p>
                                    ) : (
                                        serviceStats.map((svc, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-8 text-xs font-bold text-gray-400 text-center">#{idx + 1}</div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm font-medium text-gray-700">{svc.name}</span>
                                                        <span className="text-xs font-bold text-gray-500">{svc.value} un.</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-diva-blue to-diva-purple"
                                                            style={{ width: `${(svc.value / Math.max(serviceStats[0]?.value, 1)) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* PIPELINE TAB (KANBAN) */}
                    {activeTab === 'pipeline' && (
                        <div className="flex h-full gap-4 overflow-x-auto pb-2">
                            {PIPELINE_STAGES.map((stage, idx) => {
                                // Filter logic for columns
                                const stagePlans = displayPlans.filter(p => {
                                    if (stage === 'Novo') return (p.pipelineStage === 'Novo' || !p.pipelineStage) && p.status !== 'closed' && p.status !== 'completed';
                                    if (stage === 'Fechado') return p.pipelineStage === 'Fechado' || p.status === 'closed' || p.status === 'partially_paid' || p.status === 'completed';
                                    return p.pipelineStage === stage;
                                });

                                const stageTotal = stagePlans.reduce((acc, p) => acc + p.total, 0);

                                return (
                                    <div
                                        key={idx}
                                        className={`flex-none w-80 flex flex-col h-full rounded-xl border transition-all ${dragOverColumn === stage ? 'bg-diva-primary/5 border-diva-primary shadow-inner' : 'bg-gray-100/50 border-gray-200'}`}
                                        onDragOver={(e) => handleDragOver(e, stage)}
                                        onDrop={(e) => handleDrop(e, stage)}
                                    >
                                        <div className="p-3 border-b border-gray-200/50 flex justify-between items-center bg-white/50 rounded-t-xl backdrop-blur-sm">
                                            <div>
                                                <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wide">{stage}</h3>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{formatCurrency(stageTotal)}</p>
                                            </div>
                                            <span className="bg-white px-2 py-1 rounded-md text-xs font-bold text-diva-dark shadow-sm border border-gray-100">
                                                {stagePlans.length}
                                            </span>
                                        </div>

                                        <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                                            {stagePlans.map(plan => (
                                                <div
                                                    key={plan.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, plan.id)}
                                                    onClick={() => { setSelectedPlan(plan); }}
                                                    className={`
                                                        bg-white p-4 rounded-xl shadow-sm border cursor-grab active:cursor-grabbing transition-all hover:shadow-md group relative
                                                        ${draggedPlanId === plan.id ? 'opacity-50 rotate-3 scale-95' : 'border-gray-100 hover:border-diva-primary/50'}
                                                    `}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getStatusColor(plan.status)}`}>
                                                            {getStatusLabel(plan.status)}
                                                        </span>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-diva-primary transition-colors"></div>
                                                    </div>
                                                    <h4 className="font-bold text-diva-dark text-sm mb-1 leading-tight">{plan.name}</h4>
                                                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                                        <User size={12} /> {plan.clientName}
                                                    </p>

                                                    {/* Items Preview */}
                                                    {plan.items && plan.items.length > 0 && (
                                                        <div className="mb-3 space-y-1">
                                                            {plan.items.slice(0, 2).map((item, i) => (
                                                                <div key={i} className="text-[10px] text-gray-400 flex items-center gap-1">
                                                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                                    {item.serviceName}
                                                                </div>
                                                            ))}
                                                            {plan.items.length > 2 && <p className="text-[9px] text-gray-300 pl-2">+{plan.items.length - 2} outros</p>}
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-end border-t border-gray-50 pt-2 mt-2">
                                                        <p className="font-bold text-diva-primary text-sm">{formatCurrency(plan.total)}</p>
                                                        <p className="text-[10px] text-gray-400">{new Date(plan.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {stagePlans.length === 0 && (
                                                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl m-2 opacity-50 min-h-[100px]">
                                                    <p className="text-xs text-gray-400">Arraste para cá</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* PRESCRIPTIONS LIST TAB */}
                    {activeTab === 'prescriptions' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                            <div className="overflow-y-auto flex-1">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                        <tr>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Paciente</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Plano</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Data</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Valor</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {displayPlans.map(plan => (
                                            <tr key={plan.id} className="hover:bg-gray-50 font-medium text-sm text-gray-700 transition-colors">
                                                <td className="p-4">{plan.clientName}</td>
                                                <td className="p-4 font-bold text-diva-dark">{plan.name}</td>
                                                <td className="p-4 text-gray-500">{new Date(plan.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(plan.status)}`}>
                                                        {getStatusLabel(plan.status)}
                                                    </span>
                                                    <span className="ml-2 text-[10px] text-gray-400 border border-gray-200 px-1 rounded bg-white">
                                                        {plan.pipelineStage || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-bold text-diva-dark">{formatCurrency(plan.total)}</td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={(e) => handleSendWhatsApp(e, plan)}
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Enviar WhatsApp"
                                                        >
                                                            <Share2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDownloadPDF(e, plan)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Baixar PDF"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedPlan(plan)}
                                                            className="p-2 text-gray-400 hover:text-diva-primary hover:bg-purple-50 rounded-lg transition-colors" title="Gerenciar"
                                                        >
                                                            <DollarSign size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TEMPLATES TAB */}
                    {activeTab === 'templates' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-10">
                            {templates.map(tpl => (
                                <div key={tpl.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-diva-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <h3 className="text-lg font-bold text-diva-dark mb-1">{tpl.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">{tpl.description}</p>
                                    <div className="space-y-2 mb-6 flex-1">
                                        {tpl.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex items-center text-sm text-gray-600">
                                                <CheckCircle size={14} className="text-green-500 mr-2 shrink-0" />
                                                <span className="truncate">{item.quantity}x {item.serviceName}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-2 border border-diva-primary text-diva-primary font-bold rounded-lg hover:bg-diva-primary hover:text-white transition-colors text-sm">
                                        Usar Modelo
                                    </button>
                                </div>
                            ))}

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-diva-primary hover:text-diva-primary transition-colors cursor-pointer min-h-[200px]">
                                <Plus size={32} className="mb-2" />
                                <span className="font-bold">Criar Novo Modelo</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Modals */}
            {isPrescribeModalOpen && (
                <PrescribePlanModal
                    onClose={() => setIsPrescribeModalOpen(false)}
                    onSave={(newPlan) => {
                        const plan: TreatmentPlan = {
                            id: `plan_${Date.now()}`,
                            organizationId: 'org_demo',
                            clientId: newPlan.clientId || 'client_demo',
                            clientName: newPlan.clientName || 'Paciente Demo',
                            professionalId: 'prof_demo',
                            professionalName: 'Dr(a). Atual',
                            name: newPlan.name || 'Novo Plano',
                            items: newPlan.items as any[] || [],
                            status: 'prescribed',
                            pipelineStage: 'Novo', // Default stage
                            discount: 0,
                            subtotal: newPlan.total || 0,
                            total: newPlan.total || 0,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        addTreatmentPlan(plan);
                        addToast('Plano criado com sucesso!', 'success');
                    }}
                />
            )}

            {selectedPlan && (
                <PlanDetailsModal
                    plan={selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                    onUpdate={(updatedPlan) => {
                        updateTreatmentPlan(updatedPlan);
                        setSelectedPlan(updatedPlan);
                    }}
                />
            )}
        </div>
    );
};

export default TreatmentPlansModule;
