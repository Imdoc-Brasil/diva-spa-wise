
import React, { useState } from 'react';
import { MembershipPlan, Subscription, LeadStage } from '../../types';
import { Crown, TrendingUp, Users, DollarSign, CheckCircle, AlertCircle, RefreshCw, Trophy, Plus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { useData } from '../context/DataContext';
import NewLoyaltyPlanModal from '../modals/NewLoyaltyPlanModal';
import { useToast } from '../ui/ToastContext';



const mrrData = [
    { month: 'Jun', value: 12000 },
    { month: 'Jul', value: 13500 },
    { month: 'Ago', value: 14200 },
    { month: 'Set', value: 15800 },
    { month: 'Out', value: 18500 },
];

const LoyaltyModule: React.FC = () => {
    const { clients, membershipPlans, addMembershipPlan, subscriptions, leads } = useData(); // Added leads
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'club' | 'referrals'>('club');
    const [referralSettings, setReferralSettings] = useState({
        pointsPerLead: 50,
        pointsPerSale: 500,
        minPurchaseValue: 100
    });

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const totalMembers = membershipPlans.reduce((acc, p) => acc + p.activeMembers, 0);
    const totalMRR = membershipPlans.reduce((acc, p) => acc + (p.price * p.activeMembers), 0);

    const topRankedClients = [...clients]
        .sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0))
        .slice(0, 5);

    const handleCreatePlan = (newPlan: MembershipPlan) => {
        addMembershipPlan(newPlan);
        setIsModalOpen(false);
    };

    // Referral Calculations
    const referralLeads = leads ? leads.filter(l => l.channelSource === 'referral') : [];
    const referralConversions = referralLeads.filter(l => l.stage === LeadStage.CONVERTED).length;
    const referralRevenue = referralConversions * 1500; // Mock avg ticket

    // Top Referrers Calculation (Mock based on leads referrerName)
    const topReferrersMap = new Map<string, number>();
    referralLeads.forEach(l => {
        if (l.referrerName) {
            topReferrersMap.set(l.referrerName, (topReferrersMap.get(l.referrerName) || 0) + 1);
        }
    });
    const topReferrers = Array.from(topReferrersMap.entries())
        .map(([name, count]) => ({ name, count, points: count * referralSettings.pointsPerLead }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Tabs Header */}
            <div className="bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-diva-dark font-serif">Fidelização & Indicações</h2>
                    <p className="text-sm text-gray-500">Gestão do Clube Diva e Programa de Indicações</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('club')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'club' ? 'bg-white text-diva-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Clube Diva (Assinaturas)
                    </button>
                    <button
                        onClick={() => setActiveTab('referrals')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'referrals' ? 'bg-white text-diva-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Programa de Indicações
                    </button>
                </div>
            </div>

            {activeTab === 'club' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                    {/* Header Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-diva-primary to-diva-dark rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown size={20} className="text-diva-accent" />
                                    <p className="text-xs uppercase font-bold opacity-80">MRR (Receita Recorrente)</p>
                                </div>
                                <h3 className="text-3xl font-mono font-bold">{formatCurrency(totalMRR)}</h3>
                                <p className="text-xs mt-2 bg-white/20 w-max px-2 py-1 rounded">+15% vs mês anterior</p>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-20 transform translate-y-4">
                                <Crown size={120} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-diva-light/30 shadow-sm flex flex-col justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Membros Ativos</p>
                                <div className="flex items-end gap-2">
                                    <h3 className="text-3xl font-bold text-diva-dark">{totalMembers}</h3>
                                    <span className="text-xs text-green-600 font-bold mb-1 flex items-center">
                                        <TrendingUp size={14} className="mr-1" /> +12
                                    </span>
                                </div>
                            </div>
                            <div className="h-10 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={mrrData}>
                                        <Area type="monotone" dataKey="value" stroke="#14808C" fill="#14808C" fillOpacity={0.1} />
                                        <Tooltip cursor={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-diva-light/30 shadow-sm flex flex-col justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Churn Rate (Cancelamentos)</p>
                                <h3 className="text-3xl font-bold text-diva-alert">1.2%</h3>
                                <p className="text-xs text-gray-400 mt-2">Dentro da meta saudável ({"<"} 2%)</p>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4">
                                <div className="bg-diva-alert h-1.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Plans Configuration */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-diva-dark">Níveis de Assinatura</h3>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-sm font-bold text-diva-primary border border-diva-primary px-4 py-2 rounded-lg hover:bg-diva-primary hover:text-white transition-colors flex items-center"
                            >
                                <Plus size={16} className="mr-1" /> Configurar Planos
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {membershipPlans.map(plan => (
                                <div key={plan.id} className="bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
                                    <div className="h-1.5 w-full" style={{ backgroundColor: plan.colorHex }}></div>
                                    <div className="p-6">
                                        <h4 className="font-bold text-lg text-diva-dark flex justify-between items-center">
                                            {plan.name}
                                            <Crown size={16} style={{ color: plan.colorHex }} />
                                        </h4>
                                        <p className="text-2xl font-bold text-diva-dark mt-2">
                                            {formatCurrency(plan.price)}
                                            <span className="text-xs text-gray-400 font-normal"> /mês</span>
                                        </p>

                                        <div className="my-6 space-y-2">
                                            {plan.benefits.map((benefit, idx) => (
                                                <div key={idx} className="flex items-start text-sm text-gray-600">
                                                    <CheckCircle size={14} className="mr-2 mt-0.5 text-green-500 shrink-0" />
                                                    {benefit}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Assinantes Ativos</span>
                                            <span className="font-bold text-diva-dark bg-gray-100 px-2 py-1 rounded">{plan.activeMembers}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Leaderboard */}
                        <div className="lg:col-span-1 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-diva-light/20 bg-diva-primary/5">
                                <h3 className="font-bold text-diva-dark flex items-center">
                                    <Trophy size={18} className="mr-2 text-yellow-500" /> Ranking de Milhagem
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Pacientes com maior pontuação.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {topRankedClients.map((client, idx) => (
                                    <div key={client.clientId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm
                                        ${idx === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                    idx === 1 ? 'bg-gray-100 text-gray-600 border border-gray-300' :
                                                        idx === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-white border border-gray-100 text-gray-400'}`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-diva-dark text-sm">{client.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono font-bold text-diva-primary">{client.loyaltyPoints || 0}</span>
                                            <p className="text-[9px] text-gray-400 uppercase">pts</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subscribers List */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-diva-light/20 flex justify-between items-center">
                                <h3 className="font-bold text-diva-dark">Últimas Assinaturas</h3>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Cliente</th>
                                        <th className="px-6 py-4">Plano</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Renovação</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {subscriptions.map(sub => {
                                        const plan = membershipPlans.find(p => p.id === sub.planId);
                                        return (
                                            <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-diva-dark">{sub.clientName}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded text-xs font-bold text-white shadow-sm" style={{ backgroundColor: plan?.colorHex || '#ccc' }}>
                                                        {plan?.name || 'Plano'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {sub.status === 'active' ? (
                                                        <span className="flex items-center text-green-600 font-bold text-xs uppercase">
                                                            <CheckCircle size={14} className="mr-1" /> Ativo
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-diva-alert font-bold text-xs uppercase">
                                                            <AlertCircle size={14} className="mr-1" /> Atrasado
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                                    {new Date(sub.nextBillingDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-gray-400 hover:text-diva-primary p-1">
                                                        <RefreshCw size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'referrals' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Config & Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Configuration Card */}
                        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <Users size={20} />
                                </div>
                                <h3 className="font-bold text-diva-dark">Regras de Indicação</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Pontos por Lead (Cadastro)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={referralSettings.pointsPerLead}
                                            onChange={(e) => setReferralSettings({ ...referralSettings, pointsPerLead: Number(e.target.value) })}
                                            className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg font-bold text-diva-dark"
                                        />
                                        <span className="text-xs text-gray-400">pts</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Pontos na 1ª Compra</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={referralSettings.pointsPerSale}
                                            onChange={(e) => setReferralSettings({ ...referralSettings, pointsPerSale: Number(e.target.value) })}
                                            className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg font-bold text-diva-dark"
                                        />
                                        <span className="text-xs text-gray-400">pts</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs bg-diva-primary text-white px-2 py-1 rounded">Salvar</button>
                            </div>
                        </div>

                        {/* Funnel Stats */}
                        <div className="md:col-span-2 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">Desempenho do Indique e Ganhe</h3>
                                    <p className="text-white/70 text-sm">Resumo mensal</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <TrendingUp size={24} className="text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 relative z-10 mt-6">
                                <div>
                                    <p className="text-xs uppercase font-bold opacity-70 mb-1">Leads Indicados</p>
                                    <p className="text-3xl font-mono font-bold">{referralLeads.length}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold opacity-70 mb-1">Vendas (Conversão)</p>
                                    <p className="text-3xl font-mono font-bold">{referralConversions}</p>
                                    <p className="text-[10px] text-green-300">{(referralConversions / (referralLeads.length || 1) * 100).toFixed(0)}% conversão</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold opacity-70 mb-1">Receita Gerada</p>
                                    <p className="text-3xl font-mono font-bold">R$ {(referralRevenue / 1000).toFixed(1)}k</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-8 -right-8 opacity-10">
                                <Users size={200} />
                            </div>
                        </div>
                    </div>

                    {/* Top Referrers */}
                    <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-diva-light/20 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-diva-dark text-lg">Ranking de Melhores Indicadores</h3>
                                <p className="text-xs text-gray-500">Clientes que mais trazem novos negócios.</p>
                            </div>
                            <button className="text-diva-primary text-sm font-bold flex items-center hover:bg-diva-light/10 px-3 py-1.5 rounded transition-colors">
                                <Trophy size={16} className="mr-2" /> Ver Todos
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white text-xs text-gray-500 uppercase font-bold border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">Posição</th>
                                        <th className="px-6 py-4">Cliente Indicador</th>
                                        <th className="px-6 py-4 text-center">Leads Trazidos</th>
                                        <th className="px-6 py-4 text-center">Pontos Gerados</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm">
                                    {topReferrers.length > 0 ? topReferrers.map((ref, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs
                                                    ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        idx === 1 ? 'bg-gray-100 text-gray-600' :
                                                            idx === 2 ? 'bg-orange-100 text-orange-700' : 'text-gray-400'}`}>
                                                    {idx + 1}º
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-diva-dark">{ref.name}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded font-bold">{ref.count}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono text-gray-600">
                                                +{ref.points}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-diva-primary hover:underline text-xs font-bold">Enviar Recompensa</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                                                Nenhuma indicação registrada ainda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <NewLoyaltyPlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreatePlan} />
        </div>
    );
};


export default LoyaltyModule;
