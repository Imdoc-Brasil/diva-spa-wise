import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { SaaSLead, SaaSLeadStage, SaaSPlan } from '../../../types';
import { TrendingUp, Users, DollarSign, Target, ArrowRight, Zap, Filter, Award, BarChart3 } from 'lucide-react';

const SaaSGrowthDashboardModule: React.FC = () => {
    const { saasLeads, saasSubscribers } = useData();

    // --- 1. FUNNEL HACKING METRICS ---
    const metrics = useMemo(() => {
        const leads = saasLeads || [];
        const subscribers = saasSubscribers || [];

        const totalLeads = leads.length;
        const totalSubscribers = subscribers.length;
        const activeTrials = leads.filter(l => l.stage === SaaSLeadStage.TRIAL_STARTED).length;
        const qualifiedLeads = leads.filter(l => l.stage === SaaSLeadStage.QUALIFIED).length;

        const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

        // Calculate Potential (Hidden) Revenue from Calculator Metadata
        const hiddenRevenuePotencial = leads.reduce((acc, curr) => {
            const pot = curr.metadata?.calculator?.results?.potentialRevenue || 0;
            return acc + pot;
        }, 0);

        return {
            totalLeads,
            totalSubscribers,
            activeTrials,
            qualifiedLeads,
            totalPipelineValue,
            hiddenRevenuePotencial,
            conversionRate: totalLeads > 0 ? ((totalSubscribers / totalLeads) * 100).toFixed(1) : '0.0'
        };
    }, [saasLeads, saasSubscribers]);

    // --- 2. VALUE LADDER (High Ticket Focus) ---
    const dream100 = useMemo(() => {
        return (saasLeads || [])
            .filter(l => l.planInterest === SaaSPlan.EMPIRE || (l.metadata?.calculator?.results?.potentialRevenue || 0) > 50000)
            .sort((a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0))
            .slice(0, 10); // Top 10 Whales
    }, [saasLeads]);

    // --- 3. SOURCE PERFORMANCE (Hooks) ---
    const sourceStats = useMemo(() => {
        const stats: Record<string, { count: number, value: number }> = {};
        (saasLeads || []).forEach(lead => {
            const source = lead.metadata?.calculator ? 'Calculadora de Receita' : (lead.source || 'Outros');
            if (!stats[source]) stats[source] = { count: 0, value: 0 };
            stats[source].count++;
            stats[source].value += (lead.estimatedValue || 0);
        });
        return Object.entries(stats).sort((a, b) => b[1].value - a[1].value);
    }, [saasLeads]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="h-full overflow-y-auto p-2 space-y-8 pb-20">
            {/* HERDER */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter">
                        GROWTH<span className="text-yellow-500">HACKING</span> DASHBOARD
                    </h2>
                    <p className="text-slate-400 font-medium">Visão estratégica do funil e oportunidades de alta conversão.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold">Valor em Pipeline</p>
                        <p className="text-2xl font-black text-emerald-400">{formatCurrency(metrics.totalPipelineValue)}</p>
                    </div>
                </div>
            </div>

            {/* KPI CARDS - FUNNEL STEPS */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} className="text-blue-500" />
                    </div>
                    <p className="text-blue-400 font-bold text-sm mb-2 uppercase tracking-wider">01. Leads Capturados</p>
                    <h3 className="text-4xl font-black text-white mb-2">{metrics.totalLeads}</h3>
                    <p className="text-slate-500 text-xs">Novos contatos no topo do funil.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-500 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target size={64} className="text-yellow-500" />
                    </div>
                    <p className="text-yellow-400 font-bold text-sm mb-2 uppercase tracking-wider">02. Qualificados</p>
                    <h3 className="text-4xl font-black text-white mb-2">{metrics.qualifiedLeads}</h3>
                    <p className="text-slate-500 text-xs">Leads com perfil ideal de compra.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={64} className="text-purple-500" />
                    </div>
                    <p className="text-purple-400 font-bold text-sm mb-2 uppercase tracking-wider">03. Em Trial Ativo</p>
                    <h3 className="text-4xl font-black text-white mb-2">{metrics.activeTrials}</h3>
                    <p className="text-slate-500 text-xs">Testando a plataforma agora.</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/30 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={64} className="text-emerald-500" />
                    </div>
                    <p className="text-emerald-400 font-bold text-sm mb-2 uppercase tracking-wider">04. Vendas (MRR)</p>
                    <h3 className="text-4xl font-black text-white mb-2">{metrics.totalSubscribers}</h3>
                    <p className="text-emerald-200/50 text-xs font-bold">Taxa de Conversão: {metrics.conversionRate}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* DREAM 100 LIST */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                <Award className="text-yellow-500" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-white">Dream 100 List</h3>
                                <p className="text-xs text-slate-400">Suas maiores oportunidades de faturamento ("Whales")</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition-colors uppercase tracking-wide">
                            Ver Todos
                        </button>
                    </div>

                    <div className="divide-y divide-slate-800">
                        {dream100.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 italic">
                                Sincronize leads ou aguarde novas conversões de alto valor.
                            </div>
                        ) : (
                            dream100.map((lead, idx) => (
                                <div key={lead.id} className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="font-black text-3xl text-slate-700 w-8">#{idx + 1}</div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{lead.clinicName}</h4>
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <span>{lead.name}</span>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                <span className={lead.metadata?.calculator ? 'text-purple-400' : 'text-slate-400'}>
                                                    {lead.metadata?.calculator ? 'Via Calculadora' : (lead.source || 'Outros')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Potencial Identificado</p>
                                            <p className="text-lg font-bold text-purple-400">{formatCurrency(lead.metadata?.calculator?.results?.potentialRevenue || 0)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Valor do Contrato</p>
                                            <p className="text-xl font-bold text-emerald-400">{formatCurrency(lead.estimatedValue || 0)}</p>
                                        </div>
                                        <button className="p-3 bg-slate-800 hover:bg-white hover:text-black rounded-xl text-slate-400 transition-all transform hover:scale-110 shadow-lg">
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* HOOKS PERFORMANCE */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <BarChart3 className="text-purple-500" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-white">Performance de Origem</h3>
                                <p className="text-xs text-slate-400">De onde vem o dinheiro?</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {sourceStats.map(([source, stats], idx) => (
                                <div key={source} className="relative">
                                    <div className="flex justify-between items-end mb-1 z-10 relative">
                                        <span className="font-bold text-sm text-white">{source}</span>
                                        <span className="font-mono text-xs text-emerald-400 font-bold">{formatCurrency(stats.value)}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${idx === 0 ? 'bg-purple-500' : 'bg-slate-600'}`}
                                            style={{ width: `${(stats.value / metrics.totalPipelineValue) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-right text-[10px] text-slate-500 mt-1">{stats.count} leads</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTION CARD */}
                    <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-6 rounded-3xl text-white shadow-lg shadow-yellow-900/20">
                        <h3 className="font-black text-2xl italic mb-2">PRECISA ESCALAR?</h3>
                        <p className="opacity-90 mb-6 text-sm">Você tem R$ {formatCurrency(metrics.hiddenRevenuePotencial)} de potencial inexplorado na sua base de leads atual.</p>
                        <button className="w-full bg-white text-orange-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
                            Criar Nova Campanha
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaaSGrowthDashboardModule;
