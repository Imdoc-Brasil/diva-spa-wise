
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, TransactionStatus, User as UserType, UserRole } from '../../types';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Download, Filter, FileText, Lock, Award, Settings, Calendar, RefreshCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import CashClosingModal from '../modals/CashClosingModal';
import DREReportModal from '../modals/DREReportModal';
import NewTransactionModal from '../modals/NewTransactionModal';
import PaymentSettingsModal from '../modals/PaymentSettingsModal';
import ReceiptPreviewModal from '../modals/ReceiptPreviewModal';
import { useUnitData } from '../hooks/useUnitData';
import PermissionGate from '../ui/PermissionGate';

interface FinanceModuleProps {
    user: UserType;
}

// Mock Gateways Reference (Should match PaymentSettingsModal)
// In a real app, this comes from useData() context
const MOCK_GATEWAYS_REF = [
    { id: 'gw_stone_rec', name: 'Stone - Recepção', provider: 'stone', bankLabel: 'Conta Itaú - Principal' },
    { id: 'gw_infinitepay', name: 'InfinitePay - Dra. Julia', provider: 'infinitepay', bankLabel: 'Conta Digital InfinitePay' },
    { id: 'gw_stripe', name: 'Stripe Online', provider: 'stripe', bankLabel: 'Conta Inter - PJ' },
    { id: 'gw_manual', name: 'Dinheiro / Manual', provider: 'other', bankLabel: 'Gaveta Recepção' }
];

const FinanceModule: React.FC<FinanceModuleProps> = ({ user }) => {
    const { transactions, staff, appointments, suppliers, fiscalRecords, updateTransaction, addFiscalRecord, addTransaction } = useUnitData();
    const [activeTab, setActiveTab] = useState<'overview' | 'commissions' | 'payables' | 'fiscal'>('overview');
    const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
    const [isDREModalOpen, setIsDREModalOpen] = useState(false);
    const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
    const [isPaymentSettingsModalOpen, setIsPaymentSettingsModalOpen] = useState(false);

    // Receipt Modal State
    const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<Transaction | null>(null);

    // Toggle between "Regime de Caixa" (Settlement Date) and "Regime de Competência" (Transaction Date)
    const [viewMode, setViewMode] = useState<'settlement' | 'competence'>('competence');
    const [dateRange, setDateRange] = useState<'30_days' | 'current_month' | 'next_30'>('30_days');

    // --- Commission Logic ---
    const commissionData = useMemo(() => {
        const commissions: any[] = [];
        const getCommissionRate = (staffId: string, serviceId?: string) => {
            const member = staff.find(s => s.id === staffId);
            if (!member) return 0;
            if (serviceId && member.customCommissionRates?.[serviceId]) {
                const rate = member.customCommissionRates[serviceId];
                return rate > 1 ? rate / 100 : rate;
            }
            return member.commissionRate;
        };

        transactions.forEach(t => {
            if (t.type === 'income' && t.status === 'paid' && t.relatedAppointmentId && !(t as any).commissionPaid) {
                const appt = appointments.find(a => a.appointmentId === t.relatedAppointmentId);
                if (appt && appt.staffId) {
                    const rate = getCommissionRate(appt.staffId, appt.serviceId);
                    const commissionAmount = t.amount * rate;
                    if (commissionAmount > 0) {
                        commissions.push({
                            id: `comm_${t.id}`,
                            date: t.date,
                            staffId: appt.staffId,
                            staffName: appt.staffName,
                            serviceName: appt.serviceName,
                            transactionAmount: t.amount,
                            rate: rate,
                            value: commissionAmount,
                            status: 'pending_payment',
                            transactionId: t.id
                        });
                    }
                }
            }
        });
        return commissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, appointments, staff]);

    const commissionsByStaff = useMemo(() => {
        const grouped: Record<string, { name: string, total: number, count: number, details: any[] }> = {};
        commissionData.forEach(c => {
            if (!grouped[c.staffId]) grouped[c.staffId] = { name: c.staffName, total: 0, count: 0, details: [] };
            grouped[c.staffId].total += c.value;
            grouped[c.staffId].count += 1;
            grouped[c.staffId].details.push(c);
        });
        return Object.values(grouped).sort((a, b) => b.total - a.total);
    }, [commissionData]);

    const myCommissions = useMemo(() => {
        if (user.role !== UserRole.STAFF || !user.staffId) return [];
        return commissionData.filter(c => c.staffId === user.staffId);
    }, [commissionData, user]);

    const currentStaff = user.role === UserRole.STAFF ? staff.find(s => s.id === user.staffId) : null;
    const totalMyCommissions = myCommissions.reduce((acc, c) => acc + c.value, 0);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // --- Dynamic Stats ---
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

    // Future Receivables (Floating)
    const futureReceivables = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return transactions
            .filter(t => t.type === 'income' && t.settlementDate && t.settlementDate > today)
            .reduce((acc, curr) => acc + (curr.netAmount || curr.amount), 0);
    }, [transactions]);

    // Payables Logic (Contas a Pagar)
    const payablesData = useMemo(() => {
        return transactions.filter(t => t.type === 'expense' && t.status !== 'paid').sort((a, b) => {
            const dateA = a.dueDate || a.date;
            const dateB = b.dueDate || b.date;
            return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
    }, [transactions]);

    // Aggregates for Payables
    const totalPendingPayables = payablesData.reduce((acc, t) => acc + t.amount, 0);
    const today = new Date().toISOString().split('T')[0];
    const overduePayables = payablesData.filter(t => (t.dueDate || t.date) < today);
    const totalOverdue = overduePayables.reduce((acc, t) => acc + t.amount, 0);

    // Fiscal Data Logic
    const fiscalPendingData = useMemo(() => {
        return transactions.filter(t =>
            t.type === 'income' &&
            t.status === 'paid' &&
            !t.fiscalRecordId
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);

    // Account Balances Logic (Dashboard de Caixas)
    const balancesByAccount = useMemo(() => {
        const balances: Record<string, { name: string, bank: string, provider: string, available: number, future: number }> = {};

        // Initialize with Mock Gateways
        MOCK_GATEWAYS_REF.forEach(gw => {
            balances[gw.id] = {
                name: gw.name,
                bank: gw.bankLabel || 'Conta Padrão',
                provider: gw.provider,
                available: 0,
                future: 0
            };
        });

        const todaySim = new Date().toISOString().split('T')[0];

        transactions.forEach(t => {
            if (t.type === 'income' && t.status === 'paid') {
                let gwId = t.gatewayId;
                if (!gwId) {
                    if (t.paymentMethod === 'cash') gwId = 'gw_manual';
                    else return;
                }

                if (!balances[gwId]) {
                    balances[gwId] = { name: 'Outros Canais', bank: 'Não classificado', provider: 'other', available: 0, future: 0 };
                }

                const amount = t.netAmount || t.amount;
                const isFuture = t.settlementDate && t.settlementDate > todaySim;

                if (isFuture) {
                    balances[gwId].future += amount;
                } else {
                    balances[gwId].available += amount;
                }
            }
        });
        return Object.values(balances);
    }, [transactions]);

    const handleEmitFiscal = (t: Transaction, type: 'NFS-e' | 'NF-e') => {
        const newRecord: any = {
            id: `fr_${Date.now()}`,
            organizationId: t.organizationId,
            transactionId: t.id,
            type: type,
            status: 'emitted',
            number: String(Math.floor(Math.random() * 10000) + 1000),
            emissionDate: new Date().toISOString(),
            amount: t.amount,
            issuerName: 'Minha Clínica',
            issuerDocument: '00.000.000/0001-00',
            recipientName: t.relatedAppointmentId ? 'Cliente Registrado' : 'Consumidor Final',
            recipientDocument: '___.___.___-__',
            pdfUrl: '#'
        };
        addFiscalRecord(newRecord);
        updateTransaction(t.id, { fiscalRecordId: newRecord.id });
        alert(`Nota Fiscal (${type}) emitida com sucesso!`);
    };

    const handlePayCommissions = (staffId: string, staffName: string, amount: number, transactionIds: string[]) => {
        if (!confirm(`Confirma o pagamento de ${formatCurrency(amount)} para ${staffName}?`)) return;

        const expense: any = {
            id: `comm_pay_${Date.now()}`,
            organizationId: 'org_default',
            description: `Pagamento de Comissões - ${staffName}`,
            type: 'expense',
            category: 'Comissão',
            amount: amount,
            status: 'paid',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'pix',
            supplierId: staffId
        };
        addTransaction(expense);

        let updatedCount = 0;
        transactionIds.forEach(id => {
            updateTransaction(id, { commissionPaid: true } as any);
            updatedCount++;
        });

        alert(`Pagamento registrado! ${updatedCount} comissões foram baixadas.`);
    };

    const netProfit = totalIncome - totalExpense;

    const chartData = useMemo(() => {
        const grouped = transactions.reduce((acc: any, curr) => {
            let dateKey = curr.date;
            let displayAmount = curr.amount;

            if (viewMode === 'settlement' && curr.type === 'income') {
                if (curr.settlementDate) {
                    dateKey = curr.settlementDate;
                    displayAmount = curr.netAmount || curr.amount;
                }
            }

            if (!acc[dateKey]) {
                acc[dateKey] = {
                    name: new Date(dateKey).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                    rawDate: dateKey,
                    entradas: 0,
                    saidas: 0,
                    previsto: 0
                };
            }

            const today = new Date().toISOString().split('T')[0];
            const isFuture = dateKey > today;

            if (curr.type === 'income') {
                if (isFuture) {
                    acc[dateKey].previsto += displayAmount;
                } else {
                    acc[dateKey].entradas += displayAmount;
                }
            } else {
                acc[dateKey].saidas += curr.amount;
            }
            return acc;
        }, {});

        const sortedEntries = Object.entries(grouped).sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
        return sortedEntries.map((e: any) => e[1]);
    }, [transactions, viewMode]);

    const revenueBreakdown = useMemo(() => {
        let service = 0;
        let product = 0;
        let event = 0;

        transactions.filter(t => t.type === 'income').forEach(t => {
            if (t.category === 'Eventos' || t.description.includes('Ingresso')) {
                event += t.amount;
            } else if (t.revenueType === 'product') {
                product += t.amount;
            } else {
                service += t.amount;
            }
        });

        return [
            { name: 'Serviços', value: service, color: '#14808C' },
            { name: 'Produtos', value: product, color: '#F59E0B' },
            { name: 'Eventos', value: event, color: '#EC4899' }
        ].filter(i => i.value > 0);
    }, [transactions]);

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header com Tabs */}
            {(user.role === UserRole.ADMIN || user.role === UserRole.MANAGER || user.role === UserRole.FINANCE) && (
                <div className="flex justify-between items-end border-b border-diva-light/20 pb-1 mb-6">
                    <div className="flex space-x-6">
                        <button onClick={() => setActiveTab('overview')} className={`text-sm font-bold pb-3 border-b-2 transition-colors flex items-center ${activeTab === 'overview' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                            <TrendingUp size={16} className="mr-2" /> Visão Geral
                        </button>
                        <button onClick={() => setActiveTab('payables')} className={`text-sm font-bold pb-3 border-b-2 transition-colors flex items-center ${activeTab === 'payables' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                            <FileText size={16} className="mr-2" /> Contas a Pagar
                        </button>
                        <button onClick={() => setActiveTab('commissions')} className={`text-sm font-bold pb-3 border-b-2 transition-colors flex items-center ${activeTab === 'commissions' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                            <Award size={16} className="mr-2" /> Gestão de Comissões
                        </button>
                        <button onClick={() => setActiveTab('fiscal')} className={`text-sm font-bold pb-3 border-b-2 transition-colors flex items-center ${activeTab === 'fiscal' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                            <FileText size={16} className="mr-2" /> Fiscal (NFS-e/Recibos)
                        </button>
                    </div>
                    <button onClick={() => setIsPaymentSettingsModalOpen(true)} className="text-gray-400 hover:text-diva-primary hover:bg-gray-100 p-2 rounded-lg transition-colors mb-1" title="Configurar Gateways e Taxas">
                        <Settings size={20} />
                    </button>
                </div>
            )}

            {/* Staff View */}
            {user.role === UserRole.STAFF && (
                <>
                    <div className="bg-diva-dark text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <Award size={24} />
                                <div><h2 className="text-2xl font-serif font-bold">{currentStaff?.name || user.displayName}</h2></div>
                            </div>
                            <p className="text-sm text-white/80">Minhas Comissões</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Gerado</p>
                            <h3 className="text-2xl font-bold text-diva-primary">{formatCurrency(totalMyCommissions)}</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 overflow-hidden">
                        <div className="p-6 border-b border-diva-light/30"><h3 className="text-lg font-bold text-diva-dark">Extrato</h3></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                    <tr><th className="px-6 py-4">Data</th><th className="px-6 py-4">Serviço</th><th className="px-6 py-4 text-right">Comissão</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {myCommissions.map((commission, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4">{new Date(commission.date).toLocaleDateString('pt-BR')}</td>
                                            <td className="px-6 py-4">{commission.serviceName}</td>
                                            <td className="px-6 py-4 text-right font-bold text-green-600">{formatCurrency(commission.value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ADMIN OVERVIEW */}
            {(user.role !== UserRole.STAFF) && activeTab === 'overview' && (
                <PermissionGate allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE]} userRole={user.role} fallbackMessage="Acesso restrito.">
                    {/* Header Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Entradas (Total)</p>
                                <h3 className="text-2xl font-bold text-diva-primary">{formatCurrency(totalIncome)}</h3>
                            </div>
                            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-600"><TrendingUp size={24} /></div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Saídas (Total)</p>
                                <h3 className="text-2xl font-bold text-diva-alert">{formatCurrency(totalExpense)}</h3>
                            </div>
                            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center text-diva-alert"><TrendingDown size={24} /></div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30 flex items-center justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm font-medium text-gray-500 mb-1">A Receber (Futuro)</p>
                                <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(futureReceivables)}</h3>
                                <p className="text-[10px] text-gray-400 mt-1">Valores a liquidar (Cartão/Outros)</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 relative z-10">
                                <Calendar size={24} />
                            </div>
                        </div>
                    </div>

                    {/* DASHBOARD: Saldos por Conta / Caixa */}
                    <div className="mb-6 mt-6">
                        <h3 className="text-lg font-bold text-diva-dark mb-3 flex items-center">
                            <DollarSign size={18} className="mr-2 text-diva-primary" /> Saldos por Conta / Caixa
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {balancesByAccount.map((acc, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-diva-light/30 flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div className="mb-3">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800 text-sm truncate pr-2" title={acc.name}>{acc.name}</h4>
                                            {acc.provider === 'stone' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                                            {acc.provider === 'infinitepay' && <span className="w-2 h-2 rounded-full bg-black"></span>}
                                            {acc.provider === 'stripe' && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
                                            {acc.provider === 'other' && <span className="w-2 h-2 rounded-full bg-gray-400"></span>}
                                        </div>
                                        <p className="text-[10px] text-gray-400 truncate">{acc.bank}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-end border-b border-gray-50 pb-1">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">Disponível</span>
                                            <span className="text-sm font-bold text-green-600 font-mono">{formatCurrency(acc.available)}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] text-gray-400 uppercase">A Receber</span>
                                            <span className="text-xs font-medium text-blue-500 font-mono">{formatCurrency(acc.future)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <h3 className="text-lg font-bold text-diva-dark">Fluxo Financeiro</h3>

                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('competence')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'competence' ? 'bg-white shadow text-diva-dark' : 'text-gray-500'}`}
                                    >
                                        Competência (Venda)
                                    </button>
                                    <button
                                        onClick={() => setViewMode('settlement')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'settlement' ? 'bg-white shadow text-diva-dark' : 'text-gray-500'}`}
                                    >
                                        Caixa (Recebimento)
                                    </button>
                                </div>
                            </div>

                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#14808C" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#14808C" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#BF784E" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#BF784E" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorFuture" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Legend iconType="circle" />

                                        <Area type="monotone" dataKey="entradas" stroke="#14808C" fillOpacity={1} fill="url(#colorIncome)" name="Realizado" />
                                        <Area type="monotone" dataKey="previsto" stroke="#3B82F6" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorFuture)" name="Previsto (Futuro)" />
                                        <Area type="monotone" dataKey="saidas" stroke="#BF784E" fillOpacity={1} fill="url(#colorExpense)" name="Saídas" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart: Revenue Breakdown */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30 flex flex-col">
                            <h3 className="text-lg font-bold text-diva-dark mb-4">Fontes de Receita</h3>
                            <div className="flex-1 min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={revenueBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {revenueBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-diva-light/10 p-6 rounded-xl border border-diva-light/20">
                        <div className="flex items-center gap-4">
                            <div className="bg-diva-primary/10 p-3 rounded-full text-diva-primary"><Lock size={24} /></div>
                            <div>
                                <h4 className="font-bold text-diva-dark">Fechamento de Caixa</h4>
                                <p className="text-xs text-gray-500">Conferência diária de valores.</p>
                            </div>
                            <button onClick={() => setIsClosingModalOpen(true)} className="ml-auto bg-white border border-gray-200 text-diva-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Iniciar</button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-diva-primary/10 p-3 rounded-full text-diva-primary"><FileText size={24} /></div>
                            <div>
                                <h4 className="font-bold text-diva-dark">Relatórios Contábeis</h4>
                                <p className="text-xs text-gray-500">DRE, Balancete e Extratos.</p>
                            </div>
                            <button onClick={() => setIsDREModalOpen(true)} className="ml-auto bg-white border border-gray-200 text-diva-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Visualizar</button>
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 overflow-hidden mt-6">
                        <div className="p-6 border-b border-diva-light/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-lg font-bold text-diva-dark">Transações Recentes</h3>
                            <div className="flex space-x-2">
                                <button className="flex items-center space-x-1 px-3 py-1.5 border border-diva-light/50 rounded text-sm text-gray-600 hover:bg-gray-50"><Filter size={14} /><span>Filtrar</span></button>
                                <button onClick={() => setIsNewTransactionModalOpen(true)} className="flex items-center space-x-1 px-3 py-1.5 bg-diva-primary text-white rounded text-sm hover:bg-diva-dark"><FileText size={14} /><span>Nova Transação</span></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Descrição</th>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Prev. Recebim.</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {transactions.slice(0, 10).map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-diva-dark flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-2 ${t.type === 'income' ? 'bg-green-500' : 'bg-diva-alert'}`}></div>
                                                {t.description}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {t.settlementDate ? (
                                                    <span className="flex items-center text-blue-600">
                                                        <Calendar size={12} className="mr-1" />
                                                        {new Date(t.settlementDate).toLocaleDateString()}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${t.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : t.status === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                    {t.status === 'paid' ? 'Pago' : t.status === 'pending' ? 'Pendente' : 'Atrasado'}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-mono font-medium ${t.type === 'income' ? 'text-green-600' : 'text-diva-alert'}`}>
                                                {t.type === 'expense' ? '-' : '+'} {formatCurrency(t.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </PermissionGate>
            )}

            {(user.role !== UserRole.STAFF) && activeTab === 'commissions' && (
                <PermissionGate allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE]} userRole={user.role}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-2 bg-gradient-to-r from-diva-primary/10 to-transparent border border-diva-primary/20 rounded-xl p-8 flex flex-col md:flex-row justify-between items-center text-diva-dark shadow-sm">
                            <div>
                                <h3 className="text-2xl font-bold font-serif mb-2 flex items-center gap-2">
                                    <Award className="text-diva-primary" /> Central de Comissões
                                </h3>
                                <p className="text-sm opacity-80 max-w-md">
                                    Gerencie e pague as comissões da sua equipe. Os valores são calculados automaticamente com base apenas em serviços <b>pagos</b>.
                                </p>
                            </div>
                            <div className="mt-6 md:mt-0 text-right bg-white p-4 rounded-xl shadow-sm border border-diva-primary/10">
                                <p className="text-xs uppercase font-bold tracking-wide text-gray-400 mb-1">Total Pendente</p>
                                <p className="text-4xl font-bold text-diva-primary">{formatCurrency(commissionsByStaff.reduce((acc, c) => acc + c.total, 0))}</p>
                            </div>
                        </div>

                        {commissionsByStaff.length === 0 ? (
                            <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                                <Award size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold">Nenhuma comissão pendente no momento.</p>
                            </div>
                        ) : (
                            commissionsByStaff.map((staffComm, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                                    <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-diva-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-diva-primary/20">
                                                {staffComm.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-diva-dark text-lg">{staffComm.name}</h4>
                                                <p className="text-xs text-gray-500 font-medium bg-gray-200 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    {staffComm.count} serviços pendentes
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-diva-primary">{formatCurrency(staffComm.total)}</p>
                                        </div>
                                    </div>

                                    <div className="p-0 max-h-60 overflow-y-auto custom-scrollbar bg-white">
                                        <table className="w-full text-xs">
                                            <thead className="text-gray-400 bg-gray-50 sticky top-0 z-10">
                                                <tr>
                                                    <th className="text-left py-2 px-5 font-semibold uppercase">Data</th>
                                                    <th className="text-left py-2 px-2 font-semibold uppercase">Serviço</th>
                                                    <th className="text-right py-2 px-5 font-semibold uppercase">Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600 divide-y divide-gray-50">
                                                {staffComm.details.map((detail, dIdx) => (
                                                    <tr key={dIdx} className="hover:bg-blue-50/30 transition-colors">
                                                        <td className="py-3 px-5 text-gray-400">{new Date(detail.date).toLocaleDateString()}</td>
                                                        <td className="py-3 px-2 font-medium text-diva-dark">{detail.serviceName}</td>
                                                        <td className="py-3 px-5 text-right font-bold text-green-600 bg-green-50/30">{formatCurrency(detail.value)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                        <button
                                            onClick={() => alert('Feature: Visualizar histórico de pagamentos deste profissional')}
                                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-100 transition-colors"
                                        >
                                            Histórico
                                        </button>
                                        <button
                                            onClick={() => handlePayCommissions(
                                                staffComm.details[0].staffId,
                                                staffComm.name,
                                                staffComm.total,
                                                staffComm.details.map(d => d.transactionId)
                                            )}
                                            className="px-6 py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors shadow-md shadow-green-600/20 flex items-center"
                                        >
                                            <DollarSign size={14} className="mr-1" /> Pagar Comissões
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </PermissionGate>
            )}

            {(user.role !== UserRole.STAFF) && activeTab === 'fiscal' && (
                <PermissionGate allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE]} userRole={user.role}>
                    <div className="grid grid-cols-1 gap-6">

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                                <p className="text-sm font-medium text-gray-500 mb-1">Pendente de Emissão</p>
                                <h3 className="text-2xl font-bold text-orange-500">{fiscalPendingData.length} transações</h3>
                                <p className="text-xs text-gray-400">Aguardando nota ou recibo</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                                <p className="text-sm font-medium text-gray-500 mb-1">Notas Emitidas (Mês)</p>
                                <h3 className="text-2xl font-bold text-diva-primary">{fiscalRecords.filter(f => f.type === 'NFS-e' || f.type === 'NF-e').length}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                                <p className="text-sm font-medium text-gray-500 mb-1">Recibos Gerados</p>
                                <h3 className="text-2xl font-bold text-gray-700">{fiscalRecords.filter(f => f.type === 'Recibo').length}</h3>
                            </div>
                        </div>

                        {/* Pending Emission Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 overflow-hidden">
                            <div className="p-6 border-b border-diva-light/30 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-diva-dark">Pendentes de Emissão</h3>
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">Ação Necessária</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Data</th>
                                            <th className="px-6 py-4">Cliente/Descrição</th>
                                            <th className="px-6 py-4">Valor</th>
                                            <th className="px-6 py-4">Tipo Rec.</th>
                                            <th className="px-6 py-4 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {fiscalPendingData.length === 0 ? (
                                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">Nenhuma pendência fiscal encontrada.</td></tr>
                                        ) : (
                                            fiscalPendingData.map(t => (
                                                <tr key={t.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-diva-dark">{t.description}</p>
                                                        {t.relatedAppointmentId && <span className="text-xs text-blue-500">Agendamento</span>}
                                                    </td>
                                                    <td className="px-6 py-4 font-mono">{formatCurrency(t.amount)}</td>
                                                    <td className="px-6 py-4">
                                                        {t.revenueType === 'product' ? (
                                                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">Produto (ICMS)</span>
                                                        ) : (
                                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Serviço (ISS)</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                        {t.revenueType === 'product' ? (
                                                            <button
                                                                onClick={() => handleEmitFiscal(t, 'NF-e')}
                                                                className="px-3 py-1.5 bg-diva-primary text-white text-xs font-bold rounded hover:bg-diva-dark transition-colors"
                                                            >
                                                                Emitir NF-e
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => setSelectedTransactionForReceipt(t)}
                                                                    className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-50 transition-colors"
                                                                >
                                                                    Recibo Simples
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEmitFiscal(t, 'NFS-e')}
                                                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors"
                                                                >
                                                                    Emitir NFS-e
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Fiscal Records (List) */}
                        <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 overflow-hidden">
                            <div className="p-6 border-b border-diva-light/30 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-diva-dark">Histórico de Emissões</h3>
                                <button
                                    onClick={() => alert('Relatório exportado com sucesso para: Diva Drive > Financeiro > 2024')}
                                    className="flex items-center space-x-1 px-3 py-1.5 border border-diva-light/50 rounded text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    <Download size={14} /><span>Exportar p/ GED</span>
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Emissão</th>
                                            <th className="px-6 py-4">Número</th>
                                            <th className="px-6 py-4">Tomador</th>
                                            <th className="px-6 py-4">Tipo</th>
                                            <th className="px-6 py-4">Valor</th>
                                            <th className="px-6 py-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {fiscalRecords.length === 0 ? (
                                            <tr><td colSpan={6} className="p-8 text-center text-gray-400">Nenhum documento emitido.</td></tr>
                                        ) : (
                                            fiscalRecords.map(rec => (
                                                <tr key={rec.id}>
                                                    <td className="px-6 py-4">{rec.emissionDate ? new Date(rec.emissionDate).toLocaleDateString() : '-'}</td>
                                                    <td className="px-6 py-4 font-mono">{rec.number}</td>
                                                    <td className="px-6 py-4">{rec.recipientName}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 border border-gray-200">{rec.type}</span>
                                                    </td>
                                                    <td className="px-6 py-4">{formatCurrency(rec.amount)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${rec.status === 'emitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {rec.status === 'emitted' ? 'Emitido' : rec.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </PermissionGate>
            )}

            <CashClosingModal isOpen={isClosingModalOpen} onClose={() => setIsClosingModalOpen(false)} />
            <DREReportModal isOpen={isDREModalOpen} onClose={() => setIsDREModalOpen(false)} transactions={transactions} />
            <NewTransactionModal isOpen={isNewTransactionModalOpen} onClose={() => setIsNewTransactionModalOpen(false)} />
            <PaymentSettingsModal isOpen={isPaymentSettingsModalOpen} onClose={() => setIsPaymentSettingsModalOpen(false)} />

            {/* Receipt Modal */}
            {
                selectedTransactionForReceipt && (
                    <ReceiptPreviewModal
                        isOpen={!!selectedTransactionForReceipt}
                        onClose={() => setSelectedTransactionForReceipt(null)}
                        transaction={selectedTransactionForReceipt}
                    />
                )
            }
        </div >
    );
};

export default FinanceModule;
