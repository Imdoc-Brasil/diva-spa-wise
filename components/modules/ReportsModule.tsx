
import React, { useState } from 'react';
import { Download, Calendar, DollarSign, Users, Activity, Building2 } from 'lucide-react';
import { useUnitData } from '../hooks/useUnitData';
import { AppointmentStatus, FiscalAccount } from '../../types';

const ReportsModule: React.FC = () => {
    const { appointments, transactions, staff, fiscalAccounts } = useUnitData();
    const [activeTab, setActiveTab] = useState<'payroll' | 'heatmap' | 'financial'>('payroll');
    const [selectedFiscalAccountId, setSelectedFiscalAccountId] = useState<string>('all');

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // --- 1. DYNAMIC PAYROLL CALCULATION ---
    const payrollData = staff.map(member => {
        // Filter completed appointments for this staff
        const completedServices = appointments.filter(
            a => a.staffId === member.id && a.status === AppointmentStatus.COMPLETED
        );

        const totalServiceValue = completedServices.reduce((acc, curr) => acc + curr.price, 0);
        const commissionValue = totalServiceValue * member.commissionRate;

        return {
            id: member.id,
            name: member.name,
            role: member.role,
            totalServices: totalServiceValue,
            commissionRate: member.commissionRate,
            commissionValue: commissionValue,
            advances: 0, // Mock advances for now
            bonus: 0,    // Mock bonus
            salary: 0    // Mock fixed salary
        };
    });

    // --- 2. DYNAMIC HEATMAP CALCULATION ---
    // Initialize grid (Mon-Sat x 08:00-20:00)
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 to 19
    const heatmapData = hours.map(hour => {
        const row: any = { time: `${hour}:00` };
        const days = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

        days.forEach((day, dayIdx) => {
            // JS Day: 0=Sun, 1=Mon ... 6=Sat. We map Mon(1) -> seg(0)
            const targetJsDay = dayIdx + 1;

            const count = appointments.filter(a => {
                const d = new Date(a.startTime);
                return d.getDay() === targetJsDay && d.getHours() === hour;
            }).length;

            // Normalize: Assume max capacity per slot is 3 (3 rooms)
            const capacity = 3;
            const percentage = Math.min(100, Math.round((count / capacity) * 100));
            row[day] = percentage;
        });
        return row;
    });

    const getHeatmapColor = (value: number) => {
        if (value === 0) return 'bg-gray-50 text-gray-300';
        if (value < 30) return 'bg-green-100 text-green-700';
        if (value < 70) return 'bg-blue-100 text-blue-700';
        if (value < 90) return 'bg-orange-100 text-orange-700';
        return 'bg-diva-alert text-white';
    };

    // --- 3. DYNAMIC FINANCIAL DRE (Filtered) ---
    const filteredTransactions = React.useMemo(() => {
        // 1. Identify valid accounts for Company DRE (Clinic/Marketplace) -> Exclude Professionals
        const companyAccountIds = fiscalAccounts?.filter(f => f.type !== 'professional').map(f => f.id) || [];

        return transactions.filter(t => {
            // A. Specific Filter Active
            if (selectedFiscalAccountId !== 'all') {
                return t.fiscalAccountId === selectedFiscalAccountId;
            }
            // B. "All" View (Consolidated Company view)
            if (!t.fiscalAccountId) return true;
            return companyAccountIds.includes(t.fiscalAccountId);
        });
    }, [transactions, selectedFiscalAccountId, fiscalAccounts]);

    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');

    const serviceRevenue = incomeTransactions
        .filter(t => t.revenueType === 'service' || !t.revenueType)
        .reduce((acc, t) => acc + t.amount, 0);

    const productRevenue = incomeTransactions
        .filter(t => t.revenueType === 'product')
        .reduce((acc, t) => acc + t.amount, 0);

    // Tax Assumptions (Simples Nacional)
    const serviceTaxRate = 0.06; // Anexo III
    const productTaxRate = 0.12; // Anexo I/II estimated

    const serviceTaxes = serviceRevenue * serviceTaxRate;
    const productTaxes = productRevenue * productTaxRate;
    const totalTaxes = serviceTaxes + productTaxes;

    const totalRevenue = serviceRevenue + productRevenue;
    const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    const netRevenue = totalRevenue - totalTaxes;
    const contributionMargin = netRevenue - (totalRevenue * 0.2); // Approx Variable Costs
    const profit = contributionMargin - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">

            {/* Tab Navigation */}
            <div className="bg-white p-2 rounded-xl border border-diva-light/30 shadow-sm flex flex-wrap gap-2 shrink-0">
                <button
                    onClick={() => setActiveTab('payroll')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${activeTab === 'payroll' ? 'bg-diva-dark text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Users size={18} className="mr-2" /> Fechamento de Folha
                </button>
                <button
                    onClick={() => setActiveTab('heatmap')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${activeTab === 'heatmap' ? 'bg-diva-dark text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Activity size={18} className="mr-2" /> Ocupação & Heatmap
                </button>
                <button
                    onClick={() => setActiveTab('financial')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${activeTab === 'financial' ? 'bg-diva-dark text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <DollarSign size={18} className="mr-2" /> DRE Gerencial
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto animate-in fade-in">

                {/* TAB: PAYROLL */}
                {activeTab === 'payroll' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-diva-dark">Comissões & Pagamentos</h2>
                                <p className="text-sm text-gray-500">Cálculo automático baseado nos atendimentos concluídos.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                                    <Calendar size={16} className="mr-2" /> Este Mês
                                </button>
                                <button className="flex items-center px-4 py-2 bg-diva-primary text-white rounded-lg hover:bg-diva-dark shadow-md">
                                    <Download size={16} className="mr-2" /> Exportar Folha
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Profissional</th>
                                        <th className="px-6 py-4 text-right">Total Serviços</th>
                                        <th className="px-6 py-4 text-center">% Comissão</th>
                                        <th className="px-6 py-4 text-right">Comissão (R$)</th>
                                        <th className="px-6 py-4 text-right text-red-500">Adiantamentos</th>
                                        <th className="px-6 py-4 text-right text-green-600">Bônus/Fixo</th>
                                        <th className="px-6 py-4 text-right text-diva-dark font-black">A Pagar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {payrollData.map(staff => {
                                        const totalPayable = staff.commissionValue - staff.advances + staff.salary + staff.bonus;
                                        return (
                                            <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-diva-dark">{staff.name}</p>
                                                    <p className="text-xs text-gray-500">{staff.role}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-gray-600">
                                                    {formatCurrency(staff.totalServices)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="bg-diva-light/20 text-diva-dark px-2 py-1 rounded text-xs font-bold">
                                                        {(staff.commissionRate * 100).toFixed(0)}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-diva-primary">
                                                    {formatCurrency(staff.commissionValue)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-red-500">
                                                    - {formatCurrency(staff.advances)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-green-600">
                                                    + {formatCurrency(staff.salary + staff.bonus)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-lg text-diva-dark bg-gray-50/50">
                                                    {formatCurrency(totalPayable)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB: HEATMAP */}
                {activeTab === 'heatmap' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm">
                                <h3 className="font-bold text-diva-dark mb-4">Ocupação Real da Agenda</h3>
                                <div className="overflow-x-auto">
                                    <div className="min-w-[500px]">
                                        {/* Header Days */}
                                        <div className="grid grid-cols-7 gap-1 mb-1 text-center">
                                            <div className="w-16"></div> {/* Time Col */}
                                            {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                                                <div key={d} className="text-xs font-bold text-gray-500">{d}</div>
                                            ))}
                                        </div>

                                        {/* Rows */}
                                        {heatmapData.map((row, idx) => (
                                            <div key={idx} className="grid grid-cols-7 gap-1 mb-1 items-center">
                                                <div className="text-xs font-mono text-gray-400 text-right pr-2">{row.time}</div>
                                                {['seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map((day) => {
                                                    const val = (row as any)[day];
                                                    return (
                                                        <div
                                                            key={day}
                                                            className={`h-8 rounded text-[10px] font-bold flex items-center justify-center transition-all hover:scale-105 cursor-pointer ${getHeatmapColor(val)}`}
                                                            title={`${val}% Ocupado`}
                                                        >
                                                            {val > 0 ? `${val}%` : '-'}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end items-center gap-4 mt-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 rounded"></div> Baixa</div>
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 rounded"></div> Média</div>
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-100 rounded"></div> Alta</div>
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-diva-alert rounded"></div> Lotado</div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex flex-col">
                                <h3 className="font-bold text-diva-dark mb-2">Insights de Ocupação</h3>
                                <p className="text-xs text-gray-500 mb-6">Análise baseada nos seus agendamentos atuais.</p>

                                <div className="space-y-4">
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                                        <p className="text-xs font-bold text-orange-700 uppercase mb-1">Gargalo Operacional</p>
                                        <p className="text-sm text-diva-dark font-medium">Sextas-feiras 16:00 - 19:00</p>
                                        <p className="text-xs text-gray-500 mt-1">Horário de pico recorrente. Considere abrir agenda extra ou aumentar preços (Yield).</p>
                                    </div>

                                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                                        <p className="text-xs font-bold text-green-700 uppercase mb-1">Oportunidade</p>
                                        <p className="text-sm text-diva-dark font-medium">Terças Manhã</p>
                                        <p className="text-xs text-gray-500 mt-1">Baixa ocupação. Ideal para lançar promoções de "Happy Hour" matinal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: DRE (Financial Report) */}
                {activeTab === 'financial' && (
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-diva-light/30 shadow-lg">
                        <div className="text-center border-b border-gray-200 pb-6 mb-6">
                            <h2 className="text-2xl font-serif font-bold text-diva-dark uppercase tracking-wide">DRE - Demonstrativo de Resultados</h2>
                            <p className="text-gray-500 mb-4">Diva Spa - Baseado em Transações Lançadas</p>

                            {/* Fiscal Filter */}
                            <div className="flex justify-center">
                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                                    <Building2 size={16} className="text-gray-400" />
                                    <select
                                        value={selectedFiscalAccountId}
                                        onChange={(e) => setSelectedFiscalAccountId(e.target.value)}
                                        className="text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer"
                                    >
                                        <option value="all">Visão Consolidada (Clínica + Mkt)</option>
                                        <option disabled>──────────</option>
                                        {fiscalAccounts?.filter(f => f.type !== 'professional').map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.alias || acc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            {/* Receita Bruta */}
                            <div className="flex justify-between items-center py-2">
                                <span className="font-bold text-gray-700">(=) Receita Bruta Total</span>
                                <span className="font-mono font-bold text-diva-dark">{formatCurrency(totalRevenue)}</span>
                            </div>

                            {/* Sub-itens de Receita */}
                            <div className="pl-4 border-l-2 border-diva-light/20 ml-2 space-y-1 py-1">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>(+) Serviços (Isentos/ISS)</span>
                                    <span className="font-mono">{formatCurrency(serviceRevenue)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>(+) Produtos/Boutique (ICMS)</span>
                                    <span className="font-mono">{formatCurrency(productRevenue)}</span>
                                </div>
                            </div>

                            {/* Impostos Deduzidos */}
                            <div className="flex justify-between items-center py-1 pl-2 font-medium text-red-400 mt-2">
                                <span>(-) Impostos sobre Vendas</span>
                                <span className="font-mono">({formatCurrency(totalTaxes)})</span>
                            </div>
                            <div className="pl-6 text-xs text-red-300 italic mb-2">
                                (Est. Serviços: 6% | Produtos: 12%)
                            </div>

                            {/* Receita Líquida */}
                            <div className="flex justify-between items-center py-3 bg-gray-50 px-2 rounded font-bold mt-2">
                                <span className="text-diva-primary">(=) Receita Líquida</span>
                                <span className="font-mono text-diva-primary">{formatCurrency(netRevenue)}</span>
                            </div>

                            {/* Custos Variáveis */}
                            <div className="pt-4">
                                <p className="font-bold text-gray-700 mb-2">(-) Custos Variáveis Estimados</p>
                                <div className="flex justify-between items-center py-1 pl-4 text-sm text-gray-500 border-b border-gray-100 pb-2">
                                    <span>CMV + Comissões (Aprox. 20%)</span>
                                    <span className="font-mono text-red-400">({formatCurrency(totalRevenue * 0.2)})</span>
                                </div>
                            </div>

                            {/* Margem de Contribuição */}
                            <div className="flex justify-between items-center py-3 bg-gray-50 px-2 rounded font-bold">
                                <span className="text-gray-700">(=) Margem de Contribuição</span>
                                <span className="font-mono text-diva-dark">{formatCurrency(contributionMargin)}</span>
                            </div>

                            {/* Despesas Fixas (Real Data from Expenses) */}
                            <div className="pt-4">
                                <p className="font-bold text-gray-700 mb-2">(-) Despesas Operacionais (Lançadas)</p>
                                <div className="flex justify-between items-center py-1 pl-4 text-sm text-gray-500 border-b border-gray-100 pb-2">
                                    <span>Total de Saídas</span>
                                    <span className="font-mono text-red-400">({formatCurrency(totalExpenses)})</span>
                                </div>
                            </div>

                            {/* Resultado Final */}
                            <div className={`mt-6 flex justify-between items-center p-4 rounded-lg shadow-md text-white ${profit >= 0 ? 'bg-diva-dark' : 'bg-red-600'}`}>
                                <span className="text-lg font-bold uppercase tracking-wider">(=) Lucro Líquido (EBITDA)</span>
                                <span className="text-2xl font-mono font-bold">{formatCurrency(profit)}</span>
                            </div>
                            <div className="text-right mt-2 text-xs text-gray-500">
                                Margem Líquida: <strong>{profitMargin.toFixed(1)}%</strong>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReportsModule;
