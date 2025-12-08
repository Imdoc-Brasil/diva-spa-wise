import React, { useState } from 'react';
import {
    DollarSign, CreditCard, Download, Search, Filter,
    MoreVertical, CheckCircle, AlertCircle, Clock,
    Settings, Edit3, Plus
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const SaaSFinanceModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'invoices' | 'plans' | 'gateway'>('invoices');
    const { saasSubscribers } = useData();

    // Mock Invoices Data based on Subscribers
    const invoices = [
        { id: 'INV-2024-001', client: 'Diva Spa Demo', amount: 797, status: 'paid', date: '2023-12-05', plan: 'Growth' },
        { id: 'INV-2024-002', client: 'Clínica Estética Avançada', amount: 397, status: 'pending', date: '2023-12-08', plan: 'Start' },
        { id: 'INV-2024-003', client: 'Dr. Roberto Dermatologia', amount: 2500, status: 'overdue', date: '2023-11-28', plan: 'Empire' },
        { id: 'INV-2024-004', client: 'Beleza Renovada', amount: 797, status: 'paid', date: '2023-12-01', plan: 'Growth' },
        { id: 'INV-2024-005', client: 'Centro de Laser', amount: 397, status: 'paid', date: '2023-11-30', plan: 'Start' },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'overdue': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-700 text-slate-400';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white mb-1">Financeiro SaaS</h2>
                    <p className="text-slate-400">Gestão de receita, faturas e configuração de cobrança.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-white/5 flex items-center gap-2 text-sm font-medium transition-colors">
                        <Download size={16} /> Exportar Relatório
                    </button>
                    <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-bold flex items-center gap-2 text-sm transition-colors shadow-lg shadow-yellow-500/20">
                        <Plus size={16} /> Nova Cobrança Avulsa
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-white/10 flex gap-6">
                <button
                    onClick={() => setActiveTab('invoices')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'invoices' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} /> Faturas & Recebíveis
                    </div>
                    {activeTab === 'invoices' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('plans')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'plans' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <CreditCard size={16} /> Planos & Preços
                    </div>
                    {activeTab === 'plans' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('gateway')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'gateway' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <Settings size={16} /> Gateway de Pagamento
                    </div>
                    {activeTab === 'gateway' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>}
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'invoices' && (
                <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                    {/* Filters */}
                    <div className="p-4 border-b border-white/10 bg-slate-900/50 flex gap-4 items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar fatura, cliente ou ID..."
                                className="w-full bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-yellow-500/50"
                            />
                        </div>
                        <button className="px-3 py-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium">
                            <Filter size={16} /> Status
                        </button>
                        <button className="px-3 py-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium">
                            <Clock size={16} /> Período
                        </button>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">ID Fatura</th>
                                <th className="p-4 font-medium">Cliente</th>
                                <th className="p-4 font-medium">Plano</th>
                                <th className="p-4 font-medium">Data</th>
                                <th className="p-4 font-medium text-right">Valor</th>
                                <th className="p-4 font-medium w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(inv.status)}`}>
                                            {inv.status === 'paid' && <CheckCircle size={10} className="mr-1" />}
                                            {inv.status === 'pending' && <Clock size={10} className="mr-1" />}
                                            {inv.status === 'overdue' && <AlertCircle size={10} className="mr-1" />}
                                            {inv.status === 'paid' ? 'Pago' : inv.status === 'pending' ? 'Pendente' : 'Atrasado'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-slate-500 group-hover:text-yellow-400/80">{inv.id}</td>
                                    <td className="p-4 font-medium text-white">{inv.client}</td>
                                    <td className="p-4 text-slate-400 text-sm">{inv.plan}</td>
                                    <td className="p-4 text-slate-400 text-sm">{new Date(inv.date).toLocaleDateString()}</td>
                                    <td className="p-4 text-right font-bold text-white">
                                        R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4">
                                        <button className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Start', price: 397, clients: 12, features: ['1 Usuário', '500 Pacientes', 'Agenda Básica'] },
                        { name: 'Growth', price: 797, clients: 45, features: ['3 Usuários', 'Ilim. Pacientes', 'Financeiro + CRM', 'Mkt Básico'], popular: true },
                        { name: 'Empire', price: 1497, clients: 8, features: ['Ilim. Usuários', 'Multi-unidade', 'API Access', 'Gerente de Conta'] }
                    ].map((plan, idx) => (
                        <div key={idx} className={`bg-slate-800 border ${plan.popular ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/10'} rounded-2xl p-6 relative overflow-hidden group`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                                    Mais Vendido
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm">{plan.clients} assinantes ativos</p>
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-yellow-500/20 group-hover:text-yellow-400 transition-colors">
                                    <Edit3 size={18} />
                                </div>
                            </div>

                            <div className="mb-6">
                                <span className="text-3xl font-black text-white">R$ {plan.price}</span>
                                <span className="text-slate-500">/mês</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-center text-sm text-slate-300">
                                        <CheckCircle size={14} className="mr-2 text-green-500" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white transition-all text-sm">
                                Editar Detalhes
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'gateway' && (
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                            S
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Configuração Stripe</h3>
                            <p className="text-slate-400 text-sm">Gerencie as chaves de API para processamento de pagamentos.</p>
                        </div>
                        <div className="ml-auto px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Conectado (Live)
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Publishable Key</label>
                            <input
                                type="text"
                                value={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_..."}
                                readOnly
                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-slate-300 font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Secret Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={import.meta.env.VITE_STRIPE_SECRET_KEY || "sk_test_..."}
                                    readOnly
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-slate-300 font-mono text-sm"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">
                                    Revelar
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-colors">
                                Testar Conexão
                            </button>
                            <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl font-bold text-sm transition-colors shadow-lg shadow-yellow-500/20">
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaaSFinanceModule;
