
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, TransactionStatus, User as UserType, UserRole } from '../../types';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Download, Filter, FileText, Lock, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import CashClosingModal from '../modals/CashClosingModal';
import NewTransactionModal from '../modals/NewTransactionModal';
import { useUnitData } from '../hooks/useUnitData';
import PermissionGate from '../ui/PermissionGate';

interface FinanceModuleProps {
    user: UserType;
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ user }) => {
    const { transactions, staff } = useUnitData();
    const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
    const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

    // Buscar dados do profissional logado (se STAFF)
    const currentStaff = user.role === UserRole.STAFF ? staff.find(s => s.id === user.staffId) : null;

    // Mock de comissões do profissional (em produção, viria do backend)
    const mockStaffCommissions = [
        { date: '2023-10-27', service: 'Botox Full Face', value: 450.00, status: 'paid' },
        { date: '2023-10-26', service: 'Preenchimento Labial', value: 300.00, status: 'paid' },
        { date: '2023-10-25', service: 'Limpeza de Pele', value: 120.00, status: 'paid' },
        { date: '2023-10-24', service: 'Peeling Químico', value: 180.00, status: 'pending' },
    ];

    const totalCommissions = mockStaffCommissions.reduce((acc, c) => acc + c.value, 0);
    const paidCommissions = mockStaffCommissions.filter(c => c.status === 'paid').reduce((acc, c) => acc + c.value, 0);
    const pendingCommissions = mockStaffCommissions.filter(c => c.status === 'pending').reduce((acc, c) => acc + c.value, 0);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // --- Dynamic Stats ---
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalIncome - totalExpense;

    // --- Dynamic Chart Data Aggregation ---
    const chartData = useMemo(() => {
        const grouped = transactions.reduce((acc: any, curr) => {
            const date = curr.date;
            if (!acc[date]) {
                acc[date] = { name: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), entradas: 0, saidas: 0 };
            }
            if (curr.type === 'income') acc[date].entradas += curr.amount;
            else acc[date].saidas += curr.amount;
            return acc;
        }, {});

        const data = Object.values(grouped).sort((a: any, b: any) => 0);

        if (data.length === 0) {
            return [
                { name: 'Sem 1', entradas: 0, saidas: 0 },
                { name: 'Sem 2', entradas: 0, saidas: 0 },
            ];
        }
        return data;
    }, [transactions]);

    return (
        <div className="space-y-6">

            {/* VIEW PARA STAFF - Apenas Comissões */}
            {user.role === UserRole.STAFF && (
                <>
                    {/* Header com Nome do Profissional */}
                    <div className="bg-diva-dark text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-white/70 uppercase font-bold">Minhas Comissões</p>
                                    <h2 className="text-2xl font-serif font-bold">{currentStaff?.name || user.displayName}</h2>
                                </div>
                            </div>
                            <p className="text-sm text-white/80">Acompanhe seus ganhos e metas pessoais</p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                            <DollarSign size={150} />
                        </div>
                    </div>

                    {/* Stats de Comissões */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                            <p className="text-sm font-medium text-gray-500 mb-1">Total do Mês</p>
                            <h3 className="text-2xl font-bold text-diva-primary">{formatCurrency(totalCommissions)}</h3>
                            <p className="text-xs text-gray-400 mt-1">Outubro 2023</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                            <p className="text-sm font-medium text-gray-500 mb-1">Recebido</p>
                            <h3 className="text-2xl font-bold text-green-600">{formatCurrency(paidCommissions)}</h3>
                            <p className="text-xs text-green-500 mt-1">✓ Pago</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                            <p className="text-sm font-medium text-gray-500 mb-1">Pendente</p>
                            <h3 className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingCommissions)}</h3>
                            <p className="text-xs text-yellow-500 mt-1">⏳ A receber</p>
                        </div>
                    </div>

                    {/* Meta do Profissional */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-diva-dark">Meta Mensal</h3>
                                <p className="text-xs text-gray-500">Objetivo: R$ 5.000,00</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-diva-primary">
                                    {Math.round((totalCommissions / 5000) * 100)}%
                                </p>
                                <p className="text-xs text-gray-500">Atingido</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-diva-primary h-3 rounded-full transition-all"
                                style={{ width: `${Math.min((totalCommissions / 5000) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Faltam {formatCurrency(Math.max(5000 - totalCommissions, 0))} para atingir sua meta
                        </p>
                    </div>

                    {/* Histórico de Comissões */}
                    <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 overflow-hidden">
                        <div className="p-6 border-b border-diva-light/30">
                            <h3 className="text-lg font-bold text-diva-dark">Histórico de Comissões</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Serviço</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Comissão</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {mockStaffCommissions.map((commission, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(commission.date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-diva-dark">
                                                {commission.service}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${commission.status === 'paid'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    }`}>
                                                    {commission.status === 'paid' ? 'Pago' : 'Pendente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-medium text-green-600">
                                                {formatCurrency(commission.value)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* VIEW COMPLETA - Apenas para Admin/Manager/Finance */}
            <PermissionGate
                allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE]}
                userRole={user.role}
                fallbackMessage={user.role === UserRole.STAFF ? undefined : "Apenas gestores e financeiro podem visualizar o faturamento total."}
            >
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Entradas (Total)</p>
                            <h3 className="text-2xl font-bold text-diva-primary">{formatCurrency(totalIncome)}</h3>
                        </div>
                        <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Saídas (Total)</p>
                            <h3 className="text-2xl font-bold text-diva-alert">{formatCurrency(totalExpense)}</h3>
                        </div>
                        <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center text-diva-alert">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30 flex items-center justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 mb-1">Lucro Líquido</p>
                            <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-diva-dark' : 'text-red-600'}`}>{formatCurrency(netProfit)}</h3>
                        </div>
                        <div className="h-12 w-12 bg-diva-primary/10 rounded-full flex items-center justify-center text-diva-primary relative z-10">
                            <DollarSign size={24} />
                        </div>
                        {/* Background decoration */}
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                            <DollarSign size={100} />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-diva-dark">Fluxo de Caixa (Diário)</h3>
                            <select className="text-xs border border-diva-light/50 rounded px-2 py-1 text-gray-600 outline-none">
                                <option>Outubro 2023</option>
                                <option>Setembro 2023</option>
                            </select>
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
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend iconType="circle" />
                                    <Area type="monotone" dataKey="entradas" stroke="#14808C" fillOpacity={1} fill="url(#colorIncome)" name="Entradas" />
                                    <Area type="monotone" dataKey="saidas" stroke="#BF784E" fillOpacity={1} fill="url(#colorExpense)" name="Saídas" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions / Alerts */}
                    <div className="space-y-6">
                        {/* CASH CLOSING CTA */}
                        <div className="bg-diva-dark text-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Lock size={24} />
                                </div>
                                <h3 className="font-bold text-lg">Fechamento de Caixa</h3>
                                <p className="text-xs text-white/70 mb-4">Realize a conferência diária de valores.</p>
                                <button
                                    onClick={() => setIsClosingModalOpen(true)}
                                    className="w-full bg-white text-diva-dark py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Iniciar Fechamento
                                </button>
                            </div>
                            <div className="absolute top-[-20px] right-[-20px] opacity-10">
                                <Lock size={120} />
                            </div>
                        </div>

                        <div className="bg-diva-light/20 p-6 rounded-xl border border-diva-light/40">
                            <h4 className="font-bold text-diva-dark mb-4 flex items-center">
                                <AlertCircle size={18} className="mr-2 text-diva-alert" />
                                Atenção Financeira
                            </h4>
                            <div className="space-y-3">
                                <div className="bg-white p-3 rounded-lg border-l-4 border-diva-alert shadow-sm">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Atrasado</p>
                                    <p className="text-sm font-medium text-diva-dark">Botox Full Face (T6)</p>
                                    <p className="text-xs text-diva-alert font-bold mt-1">R$ 1.800,00</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border-l-4 border-yellow-400 shadow-sm">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Pendente</p>
                                    <p className="text-sm font-medium text-diva-dark">Manutenção AC (T3)</p>
                                    <p className="text-xs text-yellow-600 font-bold mt-1">Vence Hoje</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-center space-x-2 bg-white border border-diva-dark text-diva-dark py-3 rounded-lg hover:bg-gray-50 transition">
                            <Download size={18} />
                            <span>Exportar Relatório DRE</span>
                        </button>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 overflow-hidden mt-6">
                    <div className="p-6 border-b border-diva-light/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-diva-dark">Transações Recentes</h3>
                        <div className="flex space-x-2">
                            <button className="flex items-center space-x-1 px-3 py-1.5 border border-diva-light/50 rounded text-sm text-gray-600 hover:bg-gray-50">
                                <Filter size={14} />
                                <span>Filtrar</span>
                            </button>
                            <button
                                onClick={() => setIsNewTransactionModalOpen(true)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-diva-primary text-white rounded text-sm hover:bg-diva-dark"
                            >
                                <FileText size={14} />
                                <span>Nova Transação</span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Descrição</th>
                                    <th className="px-6 py-4">Categoria</th>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {transactions.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-diva-dark flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${t.type === 'income' ? 'bg-green-500' : 'bg-diva-alert'}`}></div>
                                            {t.description}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="bg-diva-light/20 text-diva-dark px-2 py-1 rounded text-xs">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${t.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                                t.status === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
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

            <CashClosingModal
                isOpen={isClosingModalOpen}
                onClose={() => setIsClosingModalOpen(false)}
            />

            <NewTransactionModal
                isOpen={isNewTransactionModalOpen}
                onClose={() => setIsNewTransactionModalOpen(false)}
            />
        </div>
    );
};

export default FinanceModule;
