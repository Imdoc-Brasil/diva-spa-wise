
import React, { useState } from 'react';
import { MarketingCampaign, AutomationRule, CampaignChannel, CampaignStatus } from '../../types';
import { Megaphone, Mail, MessageCircle, Instagram, Play, Pause, Plus, Target, BarChart, Zap, Settings, User, Filter, CheckCircle, AlertTriangle, Users, X, Bell, DollarSign, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import NewMarketingModal from '../modals/NewMarketingModal';
import ClientProfileModal from '../modals/ClientProfileModal';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';
import { calculateRFM, RFMSegment, getRFMDisplay } from '../../utils/rfmUtils';
import { ServiceAppointment } from '../../types';
import { useMemo } from 'react';

const MarketingModule: React.FC = () => {
    const {
        campaigns, addCampaign, updateCampaign,
        automations, addAutomation, updateAutomation,
        segments, addSegment, updateSegment,
        clients, appointments // Import clients and appointments
    } = useData();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'automations' | 'segments'>('dashboard');

    // Calculate RFM Stats
    const rfmStats = useMemo(() => {
        const stats: Record<string, number> = {};
        if (clients && appointments) {
            clients.forEach(client => {
                const { segment } = calculateRFM(client, appointments as ServiceAppointment[], client.lifetimeValue);
                stats[segment] = (stats[segment] || 0) + 1;
            });
        }
        return stats;
    }, [clients, appointments]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'campaign' | 'automation' | 'segment'>('campaign');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [selectedSegment, setSelectedSegment] = useState<RFMSegment | null>(null);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    const segmentClients = useMemo(() => {
        if (!selectedSegment) return [];
        return clients.filter(c => {
            const { segment } = calculateRFM(c, appointments as ServiceAppointment[], c.lifetimeValue);
            return segment === selectedSegment;
        });
    }, [selectedSegment, clients, appointments]);
    const { addToast } = useToast();

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const openModal = (type: 'campaign' | 'automation' | 'segment', item?: any) => {
        setModalType(type);
        setEditingItem(item || null);
        setIsModalOpen(true);
    };

    const handleSave = (data: any) => {
        if (modalType === 'campaign') {
            if (editingItem) {
                updateCampaign(editingItem.id, { ...data, status: data.scheduledDate ? 'scheduled' : 'draft' });
            } else {
                const newCampaign: MarketingCampaign = {
                    id: `c_${Date.now()}`,
                    organizationId: 'org_demo', // Default
                    name: data.name,
                    channel: data.channel,
                    segmentId: 's1', // Default for demo
                    linkedEventId: data.linkedEventId,
                    targetAudience: data.targetAudience, // Store target audience
                    status: data.scheduledDate ? 'scheduled' : 'draft',
                    scheduledFor: data.scheduledDate,
                    stats: { sent: 0, opened: 0, converted: 0, revenue: 0 }
                };
                addCampaign(newCampaign);
            }
        }
        else if (modalType === 'automation') {
            if (editingItem) {
                updateAutomation(editingItem.id, data);
            } else {
                const newAuto: AutomationRule = {
                    id: `a_${Date.now()}`,
                    organizationId: 'org_demo',
                    name: data.name,
                    trigger: data.trigger,
                    action: data.action,
                    active: true
                };
                addAutomation(newAuto);
            }
        }
        else if (modalType === 'segment') {
            if (editingItem) {
                updateSegment(editingItem.id, data);
            } else {
                const newSeg = {
                    id: `s_${Date.now()}`,
                    organizationId: 'org_demo',
                    name: data.name,
                    description: data.description,
                    count: 0
                };
                addSegment(newSeg);
            }
        }
        setIsModalOpen(false);
    };

    const toggleAutomation = (id: string) => {
        const auto = automations.find(a => a.id === id);
        if (auto) {
            updateAutomation(id, { active: !auto.active });
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Header */}
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-50 rounded-xl text-pink-600 border border-pink-100">
                        <Megaphone size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif font-bold text-diva-dark">Marketing & Automação</h2>
                        <p className="text-sm text-gray-500">Campanhas, CRM e Régua de Relacionamento</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('campaigns')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'campaigns' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Campanhas
                    </button>
                    <button
                        onClick={() => setActiveTab('automations')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'automations' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Automações
                    </button>
                    <button
                        onClick={() => setActiveTab('segments')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'segments' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Segmentos
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 flex-1 overflow-y-auto bg-gray-50">

                    {activeTab === 'dashboard' && (
                        <div className="p-6 space-y-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-bold text-gray-400 uppercase">Receita Gerada</p>
                                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-diva-dark">
                                        {formatCurrency(campaigns.reduce((acc, c) => acc + (c.stats.revenue || 0), 0))}
                                    </h3>
                                    <p className="text-xs text-green-600 mt-1 flex items-center font-bold">
                                        <TrendingUp size={12} className="mr-1" /> +15.3% vs mês anterior
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-bold text-gray-400 uppercase">Taxa de Conversão</p>
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Target size={20} /></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-diva-dark">
                                        {((campaigns.reduce((acc, c) => acc + c.stats.converted, 0) / Math.max(campaigns.reduce((acc, c) => acc + c.stats.sent, 0), 1)) * 100).toFixed(1)}%
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Média Global</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-bold text-gray-400 uppercase">Campanhas Ativas</p>
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Megaphone size={20} /></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-diva-dark">
                                        {campaigns.filter(c => c.status === 'active').length}
                                    </h3>
                                    <p className="text-xs text-purple-600 mt-1 font-bold">Em execução agora</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-bold text-gray-400 uppercase">ROI Estimado</p>
                                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Zap size={20} /></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-diva-dark">12x</h3>
                                    <p className="text-xs text-gray-500 mt-1">Retorno sobre Investimento</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Chart: Performance by Channel */}
                                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="font-bold text-diva-dark mb-6">Desempenho por Canal</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ReBarChart data={[
                                                { name: 'WhatsApp', sent: 1500, opened: 1400, converted: 120 },
                                                { name: 'Email', sent: 3000, opened: 1200, converted: 80 },
                                                { name: 'SMS', sent: 1000, opened: 900, converted: 40 },
                                                { name: 'In-App', sent: 500, opened: 450, converted: 60 },
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="sent" name="Enviados" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="opened" name="Abertos" fill="#14808C" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="converted" name="Convertidos" fill="#D4145A" radius={[4, 4, 0, 0]} />
                                            </ReBarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Recurring Revenue Breakdown */}
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                                    <h3 className="font-bold text-diva-dark mb-2">Impacto na Receita</h3>
                                    <p className="text-xs text-gray-500 mb-6">Contribuição de campanhas no faturamento total.</p>
                                    <div className="flex-1 flex items-center justify-center relative">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Campanhas', value: 35, color: '#14808C' },
                                                        { name: 'Orgânico', value: 45, color: '#E2E8F0' },
                                                        { name: 'Indicação', value: 20, color: '#F59E0B' },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    <Cell key="cell-0" fill="#14808C" />
                                                    <Cell key="cell-1" fill="#E2E8F0" />
                                                    <Cell key="cell-2" fill="#F59E0B" />
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                            <span className="text-3xl font-bold text-diva-dark">35%</span>
                                            <span className="text-xs text-gray-500 uppercase font-bold">Marketing</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-diva-primary mr-2"></div> Campanhas</span>
                                            <span className="font-bold">R$ 45.200</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div> Orgânico</span>
                                            <span className="font-bold">R$ 58.000</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div> Indicação</span>
                                            <span className="font-bold">R$ 22.500</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'campaigns' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {campaigns.map(campaign => (
                                <div key={campaign.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal('campaign', campaign)} className="text-gray-400 hover:text-diva-primary"><Settings size={16} /></button>
                                    </div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-diva-dark text-lg">{campaign.name}</h4>
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            {campaign.channel === 'whatsapp' && <MessageCircle size={20} className="text-green-500" />}
                                            {campaign.channel === 'email' && <Mail size={20} className="text-blue-500" />}
                                            {campaign.channel === 'instagram' && <Instagram size={20} className="text-pink-500" />}
                                            {campaign.channel === 'in_app' && <Bell size={20} className="text-diva-primary" />}
                                            {campaign.channel === 'sms' && <MessageCircle size={20} className="text-yellow-500" />}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Canal</p>
                                            <p className="font-medium text-gray-700 capitalize">{campaign.channel}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                        {campaign.status === 'active' && (
                                            <div className="col-span-2 border-t border-gray-100 pt-2 mt-2">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>Taxa de Abertura</span>
                                                    <span className="font-bold">80%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 h-1.5 rounded-full">
                                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                                                </div>
                                                <p className="mt-2 text-xs text-gray-500">Receita Gerada: <strong className="text-green-600">{formatCurrency(campaign.stats.revenue)}</strong></p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div
                                onClick={() => openModal('campaign')}
                                className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-400 hover:border-diva-primary hover:text-diva-primary cursor-pointer transition-colors bg-white min-h-[200px]"
                            >
                                <div className="text-center">
                                    <Plus size={32} className="mx-auto mb-2" />
                                    <p className="font-bold">Criar Nova Campanha</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'automations' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-diva-dark">Régua de Relacionamento</h3>
                                <button
                                    onClick={() => openModal('automation')}
                                    className="text-xs font-bold text-diva-primary border border-diva-primary px-3 py-1.5 rounded hover:bg-diva-light/10 flex items-center"
                                >
                                    <Plus size={14} className="mr-1" /> Nova Regra
                                </button>
                            </div>
                            {automations.map(auto => (
                                <div key={auto.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${auto.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-diva-dark">{auto.name}</h4>
                                            <p className="text-xs text-gray-500">Gatilho: <span className="font-mono bg-gray-50 px-1 rounded">{auto.trigger}</span> → Ação: <span className="font-mono bg-gray-50 px-1 rounded">{auto.action}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => toggleAutomation(auto.id)}
                                            className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-all ${auto.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                                        >
                                            {auto.active ? 'Ativo' : 'Pausado'}
                                        </button>
                                        <button
                                            onClick={() => openModal('automation', auto)}
                                            className="text-gray-400 hover:text-diva-dark p-1 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            <Settings size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'segments' && (
                        <div className="space-y-6">

                            {/* RFM Matrix Visualization */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-bold text-diva-dark text-lg">Matriz RFM Inteligente</h3>
                                        <p className="text-sm text-gray-500">Distribuição automática de clientes por comportamento (Recência x Frequência/Valor)</p>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Alto Valor</div>
                                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Médio Valor</div>
                                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> Risco/Perda</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 grid-rows-4 gap-2 h-[400px] w-full relative">
                                    <style>{`
                                        .rfm-card { @apply rounded-lg p-3 flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer shadow-sm border border-black/5 relative overflow-hidden; }
                                        .rfm-label { @apply font-bold text-sm leading-tight text-white mb-1 z-10 relative; }
                                        .rfm-count { @apply text-2xl font-bold text-white z-10 relative; }
                                        .rfm-desc { @apply text-[10px] text-white/80 z-10 relative hidden md:block; }
                                        .rfm-bg-icon { @apply absolute right-[-10px] bottom-[-10px] opacity-20 text-white w-16 h-16; }
                                    `}</style>

                                    {/* Row 1 */}
                                    {/* 9. Não pode perdê-los (Top Left) */}
                                    <div onClick={() => setSelectedSegment('CantLose')} className="bg-yellow-400 col-span-1 row-span-1 rounded-lg p-3 relative group hover:ring-2 hover:ring-yellow-500 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-yellow-900 text-xs uppercase">Não Pode Perder</span>
                                        <div className="text-3xl font-bold text-yellow-950">{rfmStats['CantLose'] || 0}</div>
                                        <div className="absolute right-2 top-2 opacity-20"><AlertTriangle size={24} className="text-yellow-900" /></div>
                                    </div>

                                    {/* 2. Clientes Leais (Top Mid) -> Pacientes Leais */}
                                    <div onClick={() => setSelectedSegment('Loyal')} className="bg-blue-300 col-span-2 row-span-1 rounded-lg p-3 relative group hover:ring-2 hover:ring-blue-400 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-blue-900 text-xs uppercase">Pacientes Leais</span>
                                        <div className="text-3xl font-bold text-blue-950">{rfmStats['Loyal'] || 0}</div>
                                        <div className="absolute right-2 top-2 opacity-20"><CheckCircle size={32} className="text-blue-900" /></div>
                                    </div>

                                    {/* 1. Campeões (Top Right) -> Premium */}
                                    <div onClick={() => setSelectedSegment('Champions')} className="bg-purple-600 col-span-1 row-span-1 rounded-lg p-3 relative group hover:ring-2 hover:ring-purple-500 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-white text-xs uppercase">Premium</span>
                                        <div className="text-3xl font-bold text-white">{rfmStats['Champions'] || 0}</div>
                                        <div className="absolute right-2 top-2 opacity-20"><Target size={32} className="text-white" /></div>
                                    </div>

                                    {/* Row 2 */}
                                    {/* 8. Em Risco (Mid Left - Tall) */}
                                    <div onClick={() => setSelectedSegment('AtRisk')} className="bg-cyan-500 col-span-1 row-span-2 rounded-lg p-3 relative group hover:ring-2 hover:ring-cyan-600 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-white text-xs uppercase">Em Risco</span>
                                        <div className="text-3xl font-bold text-white">{rfmStats['AtRisk'] || 0}</div>
                                        <div className="absolute right-2 top-2 opacity-20"><AlertTriangle size={32} className="text-white" /></div>
                                    </div>

                                    {/* 6. Precisam de Atenção (Center) */}
                                    <div onClick={() => setSelectedSegment('NeedsAttention')} className="bg-green-500 col-span-1 row-span-1 rounded-lg p-3 relative group hover:ring-2 hover:ring-green-600 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-white text-[10px] uppercase leading-tight">Precisam de Atenção</span>
                                        <div className="text-2xl font-bold text-white">{rfmStats['NeedsAttention'] || 0}</div>
                                    </div>

                                    {/* 3. Potenciais Leais (Mid Right - Wide) */}
                                    <div onClick={() => setSelectedSegment('PotentialLoyalist')} className="bg-blue-200 col-span-2 row-span-2 rounded-lg p-3 relative group hover:ring-2 hover:ring-blue-300 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-blue-800 text-xs uppercase">Potenciais Leais</span>
                                        <div className="text-3xl font-bold text-blue-900">{rfmStats['PotentialLoyalist'] || 0}</div>
                                    </div>

                                    {/* Row 3 (Partial due to spans) */}
                                    {/* 10. Hibernando (Nested in blank space? No, Row 3 Col 2) */}
                                    {/* Wait, R2C1 (Risk) takes 2 rows? So R3C1 is occupied.
                                        R2C2 (Attn) takes 1 row. So R3C2 is FREE. 
                                        R2C3-4 (Potential) takes 2 rows. So R3C3-4 is occupied.
                                    */}
                                    {/* So at Row 3, we only have Col 2 free? 
                                        That fits "7. Prestes a dormir".
                                    */}
                                    <div onClick={() => setSelectedSegment('AboutToSleep')} className="bg-blue-300 col-span-1 row-span-1 rounded-lg p-3 relative group hover:ring-2 hover:ring-blue-400 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-blue-900 text-[10px] uppercase leading-tight">Prestes a Dormir</span>
                                        <div className="text-2xl font-bold text-blue-950">{rfmStats['AboutToSleep'] || 0}</div>
                                    </div>

                                    {/* Row 4 */}
                                    {/* 11. Perdidos (Left Big) */}
                                    <div onClick={() => setSelectedSegment('Lost')} className="bg-red-400 col-span-1 row-span-1 rounded-lg p-3 relative group hover:ring-2 hover:ring-red-500 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-white text-xs uppercase">Perdidos</span>
                                        <div className="text-3xl font-bold text-white">{rfmStats['Lost'] || 0}</div>
                                    </div>

                                    {/* 10. Hibernando (Col 2) */}
                                    <div onClick={() => setSelectedSegment('Hibernating')} className="bg-indigo-900 col-span-1 row-span-1 rounded-lg p-3 relative group hover:ring-2 hover:ring-indigo-700 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-indigo-100 text-xs uppercase">Hibernando</span>
                                        <div className="text-3xl font-bold text-white">{rfmStats['Hibernating'] || 0}</div>
                                    </div>

                                    {/* 5. Promissores (Col 3) */}
                                    <div onClick={() => setSelectedSegment('Promising')} className="bg-cyan-600 col-span-1 row-span-1 rounded-lg p-3 relative group hover:ring-2 hover:ring-cyan-500 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-white text-xs uppercase">Promissores</span>
                                        <div className="text-3xl font-bold text-white">{rfmStats['Promising'] || 0}</div>
                                    </div>

                                    {/* 4. Clientes Recentes (Col 4) */}
                                    <div onClick={() => setSelectedSegment('NewCustomers')} className="bg-yellow-300 col-span-1 row-span-1 rounded-lg p-3 relative group hover:ring-2 hover:ring-yellow-400 cursor-pointer flex flex-col justify-between">
                                        <span className="font-bold text-yellow-900 text-xs uppercase">Novos</span>
                                        <div className="text-3xl font-bold text-yellow-950">{rfmStats['NewCustomers'] || 0}</div>
                                        <div className="absolute right-2 top-2 opacity-20"><Users size={24} className="text-yellow-900" /></div>
                                    </div>

                                </div>

                                <div className="mt-4 flex justify-between text-xs text-gray-400 px-2">
                                    <span>Menor Recência (Mais antigo)</span>
                                    <span>Maior Recência (Mais recente) ➔</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-8 mb-4">
                                <h3 className="font-bold text-diva-dark">Segmentos Personalizados</h3>
                                <button
                                    onClick={() => openModal('segment')}
                                    className="bg-diva-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-primary transition-colors"
                                >
                                    <Plus size={16} className="mr-2" /> Novo Segmento
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {segments.map(seg => (
                                    <div
                                        key={seg.id}
                                        onClick={() => openModal('segment', seg)}
                                        className="bg-white p-5 rounded-xl border border-gray-200 hover:border-diva-primary transition-colors cursor-pointer shadow-sm hover:shadow-md group relative"
                                    >
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Settings size={16} className="text-gray-400" />
                                        </div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                <Users size={20} />
                                            </div>
                                            <span className="text-lg font-bold text-diva-dark">{seg.count}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-sm mb-1">{seg.name}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2">{seg.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {selectedSegment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-diva-primary/5">
                            <div>
                                <h3 className="text-xl font-bold text-diva-dark">
                                    {getRFMDisplay(selectedSegment).label}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {segmentClients.length} clientes neste segmento
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedSegment(null)}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="p-0 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3">Nome</th>
                                        <th className="px-6 py-3">Frequência</th>
                                        <th className="px-6 py-3">Valor Gasto</th>
                                        <th className="px-6 py-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-sm text-gray-700">
                                    {segmentClients.map(client => (
                                        <tr key={client.clientId} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-3 text-diva-dark font-bold">{client.name}</td>
                                            <td className="px-6 py-3">{client.behaviorTags?.length || 1} visitas</td>
                                            <td className="px-6 py-3 font-mono">{formatCurrency(client.lifetimeValue)}</td>
                                            <td className="px-6 py-3 text-right">
                                                <button
                                                    onClick={() => setSelectedClient(client)}
                                                    className="text-diva-primary hover:text-diva-dark text-xs font-bold border border-diva-primary/30 px-2 py-1 rounded hover:bg-diva-primary/10 transition-colors"
                                                >
                                                    Ver Perfil
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between">
                            <button
                                onClick={() => {
                                    const segId = selectedSegment;
                                    setSelectedSegment(null);
                                    openModal('campaign', {
                                        name: `Campanha - ${getRFMDisplay(segId).label}`,
                                        targetAudience: `rfm_${segId}`,
                                        templateId: (segId === 'AtRisk' || segId === 'Lost' || segId === 'Hibernating') ? 't4' : 'custom'
                                    });
                                }}
                                className="px-4 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-diva-dark flex items-center transition-colors"
                            >
                                <Megaphone size={16} className="mr-2" /> Criar Campanha
                            </button>
                            <button
                                onClick={() => setSelectedSegment(null)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedClient && (
                <ClientProfileModal
                    isOpen={!!selectedClient}
                    onClose={() => setSelectedClient(null)}
                    client={selectedClient}
                />
            )}

            <NewMarketingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
                onSave={handleSave}
                initialData={editingItem}
            />
        </div>
    );
};

export default MarketingModule;
