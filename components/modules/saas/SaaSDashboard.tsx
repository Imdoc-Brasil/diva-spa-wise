import React from 'react';
import { useData } from '../../context/DataContext';
import {
    TrendingUp, Users, DollarSign, Activity,
    ArrowUpRight, ArrowDownRight, CreditCard, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const SaaSDashboard: React.FC = () => {
    const { saasSubscribers, saasLeads } = useData();

    // Calculate Real Metrics
    const totalMRR = saasSubscribers.reduce((acc, sub) => acc + (sub.status === 'active' ? sub.mrr : 0), 0);
    const activeSubscribers = saasSubscribers.filter(s => s.status === 'active').length;
    const trialSubscribers = saasSubscribers.filter(s => s.status === 'trial').length;

    // Avg Ticket
    const avgTicket = activeSubscribers > 0 ? Math.round(totalMRR / activeSubscribers) : 0;

    // Conversion Rate (Sold / Total Leads)
    const closedLeads = saasLeads.filter(l => l.stage === 'Closed Won').length;
    const conversionRate = saasLeads.length > 0 ? Math.round((closedLeads / saasLeads.length) * 100) : 0;

    // Mock Chart Data
    const data = [
        { name: 'Jan', mrr: 12000 },
        { name: 'Fev', mrr: 15400 },
        { name: 'Mar', mrr: 18900 },
        { name: 'Abr', mrr: 23500 },
        { name: 'Mai', mrr: 28100 },
        { name: 'Jun', mrr: totalMRR > 35000 ? totalMRR : 35200 }, // Dynamic anchor
    ];

    const pipelineData = [
        { name: 'Novos', value: saasLeads.filter(l => l.stage === 'New').length, color: '#3B82F6' },
        { name: 'Qualificados', value: saasLeads.filter(l => l.stage === 'Qualified').length, color: '#EAB308' },
        { name: 'Trial', value: saasLeads.filter(l => l.stage === 'Trial Started').length, color: '#EC4899' },
        { name: 'Fechados', value: closedLeads, color: '#22C55E' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white mb-1">Visão Geral</h2>
                    <p className="text-slate-400">Monitoramento estratégico do ecossistema I'mDoc.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Sistema Operacional: Online
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* KPI 1: MRR */}
                <div className="bg-slate-800 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/30 transition-all shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                            +12% <ArrowUpRight size={12} className="ml-1" />
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">MRR Atual</p>
                    <h3 className="text-3xl font-black text-white mt-1">
                        {totalMRR.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                </div>

                {/* KPI 2: Active Clients */}
                <div className="bg-slate-800 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <Users size={24} />
                        </div>
                        <span className="text-xs text-slate-500">Total</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Assinantes Ativos</p>
                    <h3 className="text-3xl font-black text-white mt-1">{activeSubscribers}</h3>
                    <p className="text-xs text-slate-500 mt-2">+ {trialSubscribers} em Trial Grátis</p>
                </div>

                {/* KPI 3: Avg Ticket */}
                <div className="bg-slate-800 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                            <CreditCard size={24} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-400">Estável</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Ticket Médio</p>
                    <h3 className="text-3xl font-black text-white mt-1">R$ {avgTicket}</h3>
                </div>

                {/* KPI 4: Churn/Issues */}
                <div className="bg-slate-800 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/30 transition-all shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                            <AlertCircle size={24} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                            2 Alertas
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Pagamentos Pendentes</p>
                    <h3 className="text-3xl font-black text-white mt-1">R$ 1.194</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Curve Chart */}
                <div className="lg:col-span-2 bg-slate-800 border border-white/5 p-6 rounded-2xl shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            <TrendingUp size={20} className="text-green-500" />
                            Crescimento MRR
                        </h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-white/5 text-white text-xs rounded hover:bg-white/10">6 Meses</button>
                            <button className="px-3 py-1 bg-transparent text-slate-500 text-xs hover:text-white">1 Ano</button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    formatter={(value: number) => [`R$ ${value}`, 'MRR']}
                                />
                                <Area type="monotone" dataKey="mrr" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pipeline Stats */}
                <div className="bg-slate-800 border border-white/5 p-6 rounded-2xl shadow-xl">
                    <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-blue-500" />
                        Saúde do Pipeline
                    </h3>
                    <div className="h-[200px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pipelineData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {pipelineData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Conversão</p>
                            <p className="text-2xl font-bold text-white">{conversionRate}%</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Perda</p>
                            <p className="text-2xl font-bold text-white">12%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Atividade Recente</h3>
                <div className="space-y-4">
                    {saasLeads.slice(0, 3).map((lead, i) => (
                        <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 p-2 rounded-lg transition-colors">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">Novo lead capturado: <span className="text-blue-400">{lead.clinicName}</span></p>
                                <p className="text-xs text-slate-500">{new Date(lead.createdAt).toLocaleString()} • Origem: {lead.source}</p>
                            </div>
                            <div className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-800 rounded uppercase">
                                {lead.stage}
                            </div>
                        </div>
                    ))}
                    {saasSubscribers.slice(0, 2).map((sub, i) => (
                        <div key={`sub-${i}`} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 p-2 rounded-lg transition-colors">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">Pagamento confirmado: <span className="text-green-400">{sub.clinicName}</span></p>
                                <p className="text-xs text-slate-500">Há 2 horas • R$ {sub.mrr},00 (Plano {sub.plan})</p>
                            </div>
                            <div className="text-xs font-bold text-green-400 px-2 py-1 bg-green-500/10 rounded uppercase">
                                Receita
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SaaSDashboard;
