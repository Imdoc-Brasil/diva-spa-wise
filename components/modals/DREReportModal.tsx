import React, { useMemo, useState } from 'react';
import { Transaction } from '../../types';
import { X, Download, PieChart, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Cell, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DREReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactions: Transaction[];
}

const DREReportModal: React.FC<DREReportModalProps> = ({ isOpen, onClose, transactions }) => {
    // State for selected month
    const [selectedDate, setSelectedDate] = useState(new Date());

    const changeMonth = (offset: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setSelectedDate(newDate);
    };

    const monthName = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    // Helper to calculate DRE for a given month/year
    const calculateDRE = (month: number, year: number) => {
        const periodTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === month && tDate.getFullYear() === year;
        });

        const grossRevenue = periodTransactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);

        const taxes = periodTransactions
            .filter(t => t.type === 'expense' && ['Impostos', 'Imposto', 'DAS', 'Simples'].some(cat => t.category?.includes(cat)))
            .reduce((acc, t) => acc + t.amount, 0);

        const deductions = taxes; // Can add 'Estornos' here if implemented

        const netRevenue = grossRevenue - deductions;

        // Variable Costs: Material (Stock) + Commissions
        const variableCosts = periodTransactions
            .filter(t => t.type === 'expense' &&
                ['Material', 'Materiais', 'Estoque', 'Produtos', 'Comissão', 'Comissões'].some(cat => t.category?.includes(cat))
            )
            .reduce((acc, t) => acc + t.amount, 0);

        const contributionMargin = netRevenue - variableCosts;

        // Fixed Costs: Rent, Payroll, Marketing, Utilities, Maintenance, Others
        const fixedCosts = periodTransactions
            .filter(t => t.type === 'expense' &&
                !['Impostos', 'Imposto', 'DAS', 'Simples'].some(cat => t.category?.includes(cat)) &&
                !['Material', 'Materiais', 'Estoque', 'Produtos', 'Comissão', 'Comissões'].some(cat => t.category?.includes(cat))
            )
            .reduce((acc, t) => acc + t.amount, 0);

        const ebitda = contributionMargin - fixedCosts;

        return {
            grossRevenue,
            deductions,
            netRevenue,
            variableCosts,
            contributionMargin,
            fixedCosts,
            ebitda,
            profitMargin: grossRevenue ? (ebitda / grossRevenue) * 100 : 0
        };
    };

    const currentDRE = useMemo(() => calculateDRE(selectedDate.getMonth(), selectedDate.getFullYear()), [selectedDate, transactions]);

    // Previous Month Comparison logic
    const prevDate = new Date(selectedDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevDRE = useMemo(() => calculateDRE(prevDate.getMonth(), prevDate.getFullYear()), [prevDate, transactions]);

    const calculateVariation = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    // Calculate History Data (Last 6 Months)
    const historyData = useMemo(() => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(selectedDate);
            d.setMonth(d.getMonth() - i);
            const dre = calculateDRE(d.getMonth(), d.getFullYear());
            data.push({
                name: d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
                Receita: dre.grossRevenue,
                Lucro: dre.ebitda,
                Margem: dre.profitMargin
            });
        }
        return data;
    }, [selectedDate, transactions]);

    if (!isOpen) return null;

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const renderVariation = (current: number, prev: number) => {
        const variation = calculateVariation(current, prev);
        if (variation === 0) return <span className="text-gray-400 text-xs flex justify-end gap-1"><Minus size={12} /> 0%</span>;
        const isPositive = variation > 0;
        // For Costs (Deductions, Variable, Fixed), Positive variation is BAD (Red). For Revenue/Profit, Positive is GOOD (Green).
        // Let's stick to standard math: Growth = Green arrow, Decline = Red arrow, but color logic depends on context?
        // Actually, simple is better: Up Arrow = Green, Down Arrow = Red. User interprets if "Cost Warning".

        return (
            <span className={`text-xs flex items-center justify-end gap-1 font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {Math.abs(variation).toFixed(1)}%
            </span>
        );
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`DRE Gerencial - ${monthName.toUpperCase()}`, 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);

        // @ts-ignore
        autoTable(doc, {
            startY: 40,
            head: [['Descrição', 'Valor', '% Rec. Bruta', 'Var. Mês Ant.']],
            body: [
                ['(+) Receita Bruta', formatCurrency(currentDRE.grossRevenue), '100%', `${calculateVariation(currentDRE.grossRevenue, prevDRE.grossRevenue).toFixed(1)}%`],
                ['(-) Impostos/Deduções', formatCurrency(currentDRE.deductions), `${((currentDRE.deductions / currentDRE.grossRevenue) * 100).toFixed(1)}%`, `${calculateVariation(currentDRE.deductions, prevDRE.deductions).toFixed(1)}%`],
                ['(=) Receita Líquida', formatCurrency(currentDRE.netRevenue), `${((currentDRE.netRevenue / currentDRE.grossRevenue) * 100).toFixed(1)}%`, `${calculateVariation(currentDRE.netRevenue, prevDRE.netRevenue).toFixed(1)}%`],
                ['(-) Custos Variáveis', formatCurrency(currentDRE.variableCosts), `${((currentDRE.variableCosts / currentDRE.grossRevenue) * 100).toFixed(1)}%`, `${calculateVariation(currentDRE.variableCosts, prevDRE.variableCosts).toFixed(1)}%`],
                ['(=) Margem Contribuição', formatCurrency(currentDRE.contributionMargin), `${((currentDRE.contributionMargin / currentDRE.grossRevenue) * 100).toFixed(1)}%`, `${calculateVariation(currentDRE.contributionMargin, prevDRE.contributionMargin).toFixed(1)}%`],
                ['(-) Despesas Fixas', formatCurrency(currentDRE.fixedCosts), `${((currentDRE.fixedCosts / currentDRE.grossRevenue) * 100).toFixed(1)}%`, `${calculateVariation(currentDRE.fixedCosts, prevDRE.fixedCosts).toFixed(1)}%`],
                ['(=) Resultado Operacional (EBITDA)', formatCurrency(currentDRE.ebitda), `${((currentDRE.ebitda / currentDRE.grossRevenue) * 100).toFixed(1)}%`, `${calculateVariation(currentDRE.ebitda, prevDRE.ebitda).toFixed(1)}%`],
            ],
            theme: 'striped',
            headStyles: { fillColor: [20, 128, 140] } // Diva Primary Color
        });

        doc.save(`DRE_${monthName}.pdf`);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-diva-dark/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-diva-dark text-white p-6 flex justify-between items-center shrink-0 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                            <PieChart className="text-diva-primary" /> Relatório DRE Gerencial
                        </h2>
                        <p className="text-diva-light text-sm opacity-80 mt-1">Demonstrativo de Resultado do Exercício</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 rounded-xl p-1">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
                        <span className="font-mono font-bold w-32 text-center uppercase text-sm">{monthName}</span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronRight size={20} /></button>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleExportPDF} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors border border-white/10">
                            <Download size={16} className="mr-2" /> Exportar PDF
                        </button>
                        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col lg:flex-row gap-6">

                    {/* DRE Table */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Estrutura de Resultados</h4>
                            <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">Regime de Competência</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase text-[11px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Demonstrativo</th>
                                        <th className="px-6 py-4 text-right">Valor Consolidado</th>
                                        <th className="px-6 py-4 text-right">% Receita</th>
                                        <th className="px-6 py-4 text-right w-32">MoM (Mês Ant.)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {/* Gross Revenue */}
                                    <tr className="bg-green-50/30 hover:bg-green-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">(+) Receita Bruta</td>
                                        <td className="px-6 py-4 text-right font-bold text-green-700">{formatCurrency(currentDRE.grossRevenue)}</td>
                                        <td className="px-6 py-4 text-right text-gray-400 text-xs font-mono">100%</td>
                                        <td className="px-6 py-4 text-right">{renderVariation(currentDRE.grossRevenue, prevDRE.grossRevenue)}</td>
                                    </tr>

                                    {/* Deductions */}
                                    <tr className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-3 text-gray-600 pl-8 flex items-center group-hover:text-red-500 transition-colors">(-) Impostos sobre Venda</td>
                                        <td className="px-6 py-3 text-right text-red-400">{formatCurrency(currentDRE.deductions)}</td>
                                        <td className="px-6 py-3 text-right text-gray-400 text-xs font-mono">{currentDRE.grossRevenue > 0 ? ((currentDRE.deductions / currentDRE.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                        <td className="px-6 py-3 text-right opacity-60 group-hover:opacity-100 transition-opacity">{renderVariation(currentDRE.deductions, prevDRE.deductions)}</td>
                                    </tr>

                                    {/* Net Revenue */}
                                    <tr className="font-bold bg-gray-50 border-t border-gray-100">
                                        <td className="px-6 py-4 text-gray-800">(=) Receita Líquida</td>
                                        <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(currentDRE.netRevenue)}</td>
                                        <td className="px-6 py-4 text-right text-gray-500 text-xs font-mono">{currentDRE.grossRevenue > 0 ? ((currentDRE.netRevenue / currentDRE.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                        <td className="px-6 py-4 text-right">{renderVariation(currentDRE.netRevenue, prevDRE.netRevenue)}</td>
                                    </tr>

                                    {/* Variable Costs */}
                                    <tr className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-3 text-gray-600 pl-8 flex items-center group-hover:text-red-500 transition-colors">(-) Custos Variáveis (Mat/Comissões)</td>
                                        <td className="px-6 py-3 text-right text-red-500">{formatCurrency(currentDRE.variableCosts)}</td>
                                        <td className="px-6 py-3 text-right text-gray-400 text-xs font-mono">{currentDRE.grossRevenue > 0 ? ((currentDRE.variableCosts / currentDRE.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                        <td className="px-6 py-3 text-right opacity-60 group-hover:opacity-100 transition-opacity">{renderVariation(currentDRE.variableCosts, prevDRE.variableCosts)}</td>
                                    </tr>

                                    {/* Contribution Margin */}
                                    <tr className="font-bold bg-blue-50/20 border-t border-blue-100">
                                        <td className="px-6 py-4 text-blue-900">(=) Margem de Contribuição</td>
                                        <td className="px-6 py-4 text-right text-blue-900">{formatCurrency(currentDRE.contributionMargin)}</td>
                                        <td className="px-6 py-4 text-right text-blue-400 text-xs font-mono">{currentDRE.grossRevenue > 0 ? ((currentDRE.contributionMargin / currentDRE.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                        <td className="px-6 py-4 text-right">{renderVariation(currentDRE.contributionMargin, prevDRE.contributionMargin)}</td>
                                    </tr>

                                    {/* Fixed Costs */}
                                    <tr className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-3 text-gray-600 pl-8 flex items-center group-hover:text-red-500 transition-colors">(-) Despesas Fixas Operacionais</td>
                                        <td className="px-6 py-3 text-right text-red-500">{formatCurrency(currentDRE.fixedCosts)}</td>
                                        <td className="px-6 py-3 text-right text-gray-400 text-xs font-mono">{currentDRE.grossRevenue > 0 ? ((currentDRE.fixedCosts / currentDRE.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                        <td className="px-6 py-3 text-right opacity-60 group-hover:opacity-100 transition-opacity">{renderVariation(currentDRE.fixedCosts, prevDRE.fixedCosts)}</td>
                                    </tr>

                                    {/* EBITDA */}
                                    <tr className={`font-bold text-lg border-t-2 ${currentDRE.ebitda >= 0 ? 'bg-green-100/50 text-green-800 border-green-200' : 'bg-red-100/50 text-red-800 border-red-200'} transition-all`}>
                                        <td className="px-6 py-5">
                                            (=) Resultado Operacional (EBITDA)
                                            <span className="block text-[10px] font-normal opacity-60 mt-1 uppercase tracking-wide">Earnings Before Interest, Taxes, Depreciation and Amortization</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">{formatCurrency(currentDRE.ebitda)}</td>
                                        <td className="px-6 py-5 text-right text-sm font-mono opacity-80">{currentDRE.grossRevenue > 0 ? ((currentDRE.ebitda / currentDRE.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                        <td className="px-6 py-5 text-right">{renderVariation(currentDRE.ebitda, prevDRE.ebitda)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-white">
                            <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                                <TrendingUp size={16} className="text-diva-primary" /> Evolução Semestral (Tendência)
                            </h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={historyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        />
                                        <Bar dataKey="Receita" fill="#14808C" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                        <Bar dataKey="Lucro" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Analysis */}
                <div className="w-full lg:w-80 flex flex-col gap-6">

                    {/* Result Card */}
                    <div className={`p-8 rounded-2xl border shadow-sm text-center relative overflow-hidden ${currentDRE.ebitda >= 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        <div className="relative z-10">
                            <p className="text-xs uppercase font-bold opacity-80 mb-2 tracking-widest">Lucratividade Real</p>
                            <h3 className="text-5xl font-bold font-serif mb-2">
                                {currentDRE.grossRevenue > 0 ? ((currentDRE.ebitda / currentDRE.grossRevenue) * 100).toFixed(1) : 0}<span className="text-3xl">%</span>
                            </h3>
                            <p className="text-sm opacity-90">Margem Líquida do Período</p>
                        </div>
                        {/* Decorative Blobs */}
                        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-[-30px] left-[-30px] w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
                    </div>

                    {/* Breakdown Chart */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col">
                        <h4 className="font-bold text-gray-700 mb-6 text-sm flex items-center gap-2">
                            <PieChart size={16} className="text-diva-primary" /> Composição de Custos
                        </h4>
                        <div className="flex-1 min-h-[200px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={[
                                            { name: 'Variáveis', value: currentDRE.variableCosts, fill: '#ef4444' },
                                            { name: 'Fixos', value: currentDRE.fixedCosts, fill: '#f97316' },
                                            { name: 'Impostos', value: currentDRE.deductions, fill: '#64748b' },
                                            { name: 'Lucro', value: Math.max(0, currentDRE.ebitda), fill: '#22c55e' }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#ef4444" />
                                        <Cell fill="#f97316" />
                                        <Cell fill="#64748b" />
                                        <Cell fill="#22c55e" />
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                    />
                                </RePieChart>
                            </ResponsiveContainer>

                            {/* Centered Label */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="text-xs text-gray-400 font-bold uppercase">Total</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Variáveis</div>
                                <span className="font-bold text-gray-800">{currentDRE.variableCosts > 0 ? ((currentDRE.variableCosts / currentDRE.grossRevenue) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div> Fixos</div>
                                <span className="font-bold text-gray-800">{currentDRE.fixedCosts > 0 ? ((currentDRE.fixedCosts / currentDRE.grossRevenue) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div> Impostos</div>
                                <span className="font-bold text-gray-800">{currentDRE.deductions > 0 ? ((currentDRE.deductions / currentDRE.grossRevenue) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Margem Líquida</div>
                                <span className="font-bold text-green-600">{currentDRE.profitMargin.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DREReportModal;
