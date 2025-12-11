import React, { useState, useEffect } from 'react';
import {
    DollarSign, CreditCard, Download, Search, Filter,
    MoreVertical, CheckCircle, AlertCircle, Clock,
    Settings, Edit3, Plus, Calendar, QrCode, FileText,
    RefreshCw, Wifi, WifiOff
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AsaasPayment, AsaasSubscription } from '../../../types';
import QuickPaymentLinkModal from '../../modals/QuickPaymentLinkModal';
import { asaasService } from '../../../services/asaasService';
import { useToast } from '../../ui/ToastContext';

const SaaSFinanceModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'payments' | 'subscriptions' | 'settings'>('payments');
    const { saasSubscribers } = useData();
    const { addToast } = useToast();

    const [payments, setPayments] = useState<AsaasPayment[]>([]);
    const [subscriptions, setSubscriptions] = useState<AsaasSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState<'idle' | 'online' | 'offline'>('idle');
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    // Fetch Real Data from Asaas
    const fetchAsaasData = async () => {
        setIsLoading(true);
        try {
            const [paymentsRes, subsRes] = await Promise.all([
                asaasService.listPayments(),
                asaasService.listSubscriptions()
            ]);

            if (paymentsRes && paymentsRes.data) setPayments(paymentsRes.data);
            if (subsRes && subsRes.data) setSubscriptions(subsRes.data);

            setApiStatus('online');
            // addToast('Dados do Asaas atualizados!', 'success'); // Optional verification toast
        } catch (error) {
            console.error("Asaas Connect Error:", error);
            setApiStatus('offline');
            addToast('Erro ao conectar com Asaas. Verifique a API Key.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAsaasData();
    }, []);

    const handleTestConnection = async () => {
        addToast('Testando conexão...', 'info');
        await fetchAsaasData();
        if (apiStatus === 'online' || (await asaasService.listPayments())) {
            addToast('Conexão bem sucedida com Asaas!', 'success');
        }
    };

    const handleCloseModal = () => {
        setIsCheckoutModalOpen(false);
        fetchAsaasData();
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'RECEIVED':
            case 'CONFIRMED':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'PENDING': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'OVERDUE': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'ACTIVE': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-700 text-slate-400';
        }
    };

    const getBillingIcon = (type: string) => {
        switch (type) {
            case 'BOLETO': return <FileText size={14} />;
            case 'PIX': return <QrCode size={14} />;
            case 'CREDIT_CARD': return <CreditCard size={14} />;
            default: return <DollarSign size={14} />;
        }
    };

    const getBillingName = (type: string) => {
        switch (type) {
            case 'BOLETO': return 'Boleto';
            case 'PIX': return 'Pix';
            case 'CREDIT_CARD': return 'Cartão';
            default: return type;
        }
    };

    const getStatusName = (status: string) => {
        const map: Record<string, string> = {
            'RECEIVED': 'Recebida',
            'PENDING': 'Pendente',
            'OVERDUE': 'Vencida',
            'CONFIRMED': 'Confirmada',
            'ACTIVE': 'Ativa',
            'INACTIVE': 'Inativa',
            'EXPIRED': 'Expirada'
        };
        return map[status] || status;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white mb-1 flex items-center gap-3">
                        Financeiro SaaS (Asaas)
                        {apiStatus === 'online' && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1"><Wifi size={12} /> Online</span>}
                        {apiStatus === 'offline' && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30 flex items-center gap-1"><WifiOff size={12} /> Offline</span>}
                    </h2>
                    <p className="text-slate-400">Gestão de receita, assinaturas e fluxo de caixa.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchAsaasData} className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-white/5 flex items-center gap-2 text-sm transition-colors" title="Recarregar Dados">
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-white/5 flex items-center gap-2 text-sm font-medium transition-colors">
                        <Download size={16} /> Exportar Relatório
                    </button>
                    <button
                        onClick={() => setIsCheckoutModalOpen(true)}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-bold flex items-center gap-2 text-sm transition-colors shadow-lg shadow-yellow-500/20"
                    >
                        <Plus size={16} /> Nova Cobrança
                    </button>
                </div>
            </div>

            {/* KPI Cards (Placeholder Logic for now - ideally computed from real data) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-white/10 p-4 rounded-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={48} />
                    </div>
                    <p className="text-slate-400 text-xs uppercase font-bold mb-1">Receita Total (Mês)</p>
                    <h3 className="text-2xl font-black text-white">
                        {isLoading ? '...' : `R$ ${payments.reduce((acc, p) => p.status === 'RECEIVED' ? acc + p.value : acc, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </h3>
                    <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                        <CheckCircle size={10} /> Real Data
                    </span>
                </div>
                <div className="bg-slate-900 border border-white/10 p-4 rounded-xl relative overflow-hidden group">
                    {/* Similar logic for other cards or keep static for layout demo */}
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard size={48} />
                    </div>
                    <p className="text-slate-400 text-xs uppercase font-bold mb-1">Assinaturas Ativas</p>
                    <h3 className="text-2xl font-black text-white">
                        {isLoading ? '...' : subscriptions.filter(s => s.status === 'ACTIVE').length}
                    </h3>
                    <span className="text-blue-500 text-xs font-bold flex items-center gap-1">
                        <CheckCircle size={10} /> Ativos
                    </span>
                </div>
                <div className="bg-slate-900 border border-white/10 p-4 rounded-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle size={48} />
                    </div>
                    <p className="text-slate-400 text-xs uppercase font-bold mb-1">Inadimplência</p>
                    <h3 className="text-2xl font-black text-white">
                        {isLoading ? '...' : `R$ ${payments.reduce((acc, p) => p.status === 'OVERDUE' ? acc + p.value : acc, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </h3>
                    <span className="text-red-500 text-xs font-bold flex items-center gap-1">
                        <AlertCircle size={10} /> Vencidos
                    </span>
                </div>
                <div className="bg-slate-900 border border-white/10 p-4 rounded-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={48} />
                    </div>
                    <p className="text-slate-400 text-xs uppercase font-bold mb-1">Pendente</p>
                    <h3 className="text-2xl font-black text-white">
                        {isLoading ? '...' : `R$ ${payments.reduce((acc, p) => p.status === 'PENDING' ? acc + p.value : acc, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </h3>
                    <span className="text-slate-500 text-xs font-bold flex items-center gap-1">
                        A receber
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-white/10 flex gap-6">
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'payments' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} /> Cobranças (Payments)
                    </div>
                    {activeTab === 'payments' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('subscriptions')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'subscriptions' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <Calendar size={16} /> Assinaturas (Subscriptions)
                    </div>
                    {activeTab === 'subscriptions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'settings' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <Settings size={16} /> Integração API
                    </div>
                    {activeTab === 'settings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>}
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'payments' && (
                <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                    {/* Filters */}
                    <div className="p-4 border-b border-white/10 bg-slate-900/50 flex gap-4 items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por ID, Cliente..."
                                className="w-full bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-yellow-500/50"
                            />
                        </div>
                        <button className="px-3 py-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium">
                            <Filter size={16} /> Status
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="p-12 flex justify-center text-slate-500 animate-pulse">Carregando pagamentos...</div>
                    ) : payments.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                            <p>Nenhum pagamento encontrado.</p>
                            <p className="text-xs mt-2">Se conectou agora, a conta pode estar vazia.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                                    <th className="p-4 font-medium">Status / Método</th>
                                    <th className="p-4 font-medium">ID Venda</th>
                                    <th className="p-4 font-medium">Descrição</th>
                                    <th className="p-4 font-medium">Vencimento</th>
                                    <th className="p-4 font-medium text-right">Valor</th>
                                    <th className="p-4 font-medium w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.map((pay) => (
                                    <tr key={pay.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(pay.status)}`}>
                                                    {getStatusName(pay.status)}
                                                </span>
                                                <span className="text-slate-400 text-xs flex items-center gap-1">
                                                    {getBillingIcon(pay.billingType)} {getBillingName(pay.billingType)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-500 group-hover:text-yellow-400/80">{pay.id}</td>
                                        <td className="p-4">
                                            <div className="text-white font-medium text-sm">{pay.description}</div>
                                            <div className="text-slate-500 text-xs">{pay.customer}</div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">{new Date(pay.dueDate).toLocaleDateString()}</td>
                                        <td className="p-4 text-right font-bold text-white">
                                            R$ {pay.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                    )}
                </div>
            )}

            {activeTab === 'subscriptions' && (
                <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 flex justify-center text-slate-500 animate-pulse">Carregando assinaturas...</div>
                    ) : subscriptions.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                            <p>Nenhuma assinatura encontrada.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">ID Assinatura</th>
                                    <th className="p-4 font-medium">Descrição</th>
                                    <th className="p-4 font-medium">Ciclo / Método</th>
                                    <th className="p-4 font-medium">Próx. Cobrança</th>
                                    <th className="p-4 font-medium text-right">Valor</th>
                                    <th className="p-4 font-medium w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {subscriptions.map((sub) => (
                                    <tr key={sub.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(sub.status)}`}>
                                                {getStatusName(sub.status)}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-500 group-hover:text-yellow-400/80">{sub.id}</td>
                                        <td className="p-4">
                                            <div className="text-white font-medium text-sm">{sub.description}</div>
                                            <div className="text-slate-500 text-xs">{sub.customer}</div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="capitalize">{sub.cycle.toLowerCase()}</span>
                                                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                                                <span className="flex items-center gap-1">{getBillingIcon(sub.billingType)} {getBillingName(sub.billingType)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">{sub.nextDueDate ? new Date(sub.nextDueDate).toLocaleDateString() : '-'}</td>
                                        <td className="p-4 text-right font-bold text-white">
                                            R$ {sub.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                    )}
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-600/50 rotate-45 transform scale-150 translate-x-4"></div>
                            A
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Integração Asaas</h3>
                            <p className="text-slate-400 text-sm">Gerencie sua chave de API para emissão automática de boletos e Pix.</p>
                        </div>
                        <div className="ml-auto px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Sandbox Ativo
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                            <h4 className="flex items-center gap-2 text-yellow-500 font-bold text-sm mb-1">
                                <AlertCircle size={14} /> Ambiente de Sandbox
                            </h4>
                            <p className="text-slate-400 text-xs">
                                Use a URL <code>{import.meta.env.VITE_ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3'}</code> para testes.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Asaas API Key (Sandbox)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={import.meta.env.VITE_ASAAS_API_KEY ? "************************" + import.meta.env.VITE_ASAAS_API_KEY.slice(-4) : "Não configurada"}
                                    readOnly
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-slate-300 font-mono text-sm"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">
                                    Configurado em .env
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                            <button
                                onClick={handleTestConnection}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-colors"
                            >
                                Testar Conexão
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <QuickPaymentLinkModal
                isOpen={isCheckoutModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchAsaasData}
            />
        </div>
    );
};

export default SaaSFinanceModule;
