
import React, { useMemo } from 'react';
import { Transaction } from '../../types';
import { X, Download, Calendar, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Pie } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure these are installed or mock if raw unavailable

interface DREReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactions: Transaction[];
}

const DREReportModal: React.FC<DREReportModalProps> = ({ isOpen, onClose, transactions }) => {
    // Basic date range (Current Month)
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthName = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    // Filter transactions for current month
    const monthTransactions = useMemo(() => {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });
    }, [transactions, currentMonth, currentYear]);

    // DRE Calculation
    const dre = useMemo(() => {
        const grossRevenue = monthTransactions
            .filter(t => t.type === 'income' && (t.category === 'Serviços' || t.category === 'Produtos'))
            .reduce((acc, t) => acc + t.amount, 0);

        const deductions = monthTransactions // Taxes, cancelations (simulated)
            .filter(t => t.category === 'Impostos' || t.category === 'Estornos')
            .reduce((acc, t) => acc + t.amount, 0);

        const netRevenue = grossRevenue - deductions;

        const variableCosts = monthTransactions // Stock, commissions
            .filter(t => t.type === 'expense' && (t.category === 'Estoque' || t.category === 'Comissões'))
            .reduce((acc, t) => acc + t.amount, 0);

        const contributionMargin = netRevenue - variableCosts;

        const fixedCosts = monthTransactions // Rent, salaries, utilities
            .filter(t => t.type === 'expense' && t.category !== 'Estoque' && t.category !== 'Comissões')
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
    }, [monthTransactions]);

    if (!isOpen) return null;

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

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
            head: [['Descrição', 'Valor', '% Rec. Bruta']],
            body: [
                ['(+) Receita Bruta', formatCurrency(dre.grossRevenue), '100%'],
                ['(-) Deduções/Impostos', formatCurrency(dre.deductions), `${((dre.deductions / dre.grossRevenue) * 100).toFixed(1)}%`],
                ['(=) Receita Líquida', formatCurrency(dre.netRevenue), `${((dre.netRevenue / dre.grossRevenue) * 100).toFixed(1)}%`],
                ['(-) Custos Variáveis', formatCurrency(dre.variableCosts), `${((dre.variableCosts / dre.grossRevenue) * 100).toFixed(1)}%`],
                ['(=) Margem Contribuição', formatCurrency(dre.contributionMargin), `${((dre.contributionMargin / dre.grossRevenue) * 100).toFixed(1)}%`],
                ['(-) Despesas Fixas', formatCurrency(dre.fixedCosts), `${((dre.fixedCosts / dre.grossRevenue) * 100).toFixed(1)}%`],
                ['(=) Resultado Operacional (EBITDA)', formatCurrency(dre.ebitda), `${((dre.ebitda / dre.grossRevenue) * 100).toFixed(1)}%`],
            ],
            theme: 'striped',
            headStyles: { fillColor: [20, 128, 140] } // Diva Primary Color
        });

        doc.save(`DRE_${monthName}.pdf`);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-diva-dark text-white p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                            <PieChart className="text-diva-primary" /> DRE Gerencial
                        </h2>
                        <p className="text-diva-light text-sm opacity-80 uppercase font-bold">{monthName}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleExportPDF} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors">
                            <Download size={16} className="mr-2" /> PDF
                        </button>
                        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col lg:flex-row gap-6">

                    {/* DRE Table */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Demonstrativo</th>
                                    <th className="px-6 py-3 text-right">Valor</th>
                                    <th className="px-6 py-3 text-right w-24">Análise V.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {/* Gross Revenue */}
                                <tr className="bg-green-50/50">
                                    <td className="px-6 py-3 font-bold text-gray-700">(+) Receita Bruta</td>
                                    <td className="px-6 py-3 text-right font-bold text-green-700">{formatCurrency(dre.grossRevenue)}</td>
                                    <td className="px-6 py-3 text-right text-gray-400 text-xs">100%</td>
                                </tr>

                                {/* Deductions */}
                                <tr>
                                    <td className="px-6 py-2 text-gray-600 pl-8">(-) Impostos/Deduções</td>
                                    <td className="px-6 py-2 text-right text-red-400">{formatCurrency(dre.deductions)}</td>
                                    <td className="px-6 py-2 text-right text-gray-400 text-xs">{dre.grossRevenue > 0 ? ((dre.deductions / dre.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                </tr>

                                {/* Net Revenue */}
                                <tr className="font-bold bg-gray-50">
                                    <td className="px-6 py-3 text-gray-800 border-t border-gray-200">(=) Receita Líquida</td>
                                    <td className="px-6 py-3 text-right border-t border-gray-200">{formatCurrency(dre.netRevenue)}</td>
                                    <td className="px-6 py-3 text-right text-gray-400 text-xs border-t border-gray-200">{dre.grossRevenue > 0 ? ((dre.netRevenue / dre.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                </tr>

                                {/* Variable Costs */}
                                <tr>
                                    <td className="px-6 py-2 text-gray-600 pl-8">(-) Custos Variáveis (CMV/Comissões)</td>
                                    <td className="px-6 py-2 text-right text-red-500">{formatCurrency(dre.variableCosts)}</td>
                                    <td className="px-6 py-2 text-right text-gray-400 text-xs">{dre.grossRevenue > 0 ? ((dre.variableCosts / dre.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                </tr>

                                {/* Contribution Margin */}
                                <tr className="font-bold bg-blue-50/30">
                                    <td className="px-6 py-3 text-blue-800 border-t border-gray-200">(=) Margem de Contribuição</td>
                                    <td className="px-6 py-3 text-right text-blue-800 border-t border-gray-200">{formatCurrency(dre.contributionMargin)}</td>
                                    <td className="px-6 py-3 text-right text-blue-400 text-xs border-t border-gray-200">{dre.grossRevenue > 0 ? ((dre.contributionMargin / dre.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                </tr>

                                {/* Fixed Costs */}
                                <tr>
                                    <td className="px-6 py-2 text-gray-600 pl-8">(-) Despesas Fixas Operacionais</td>
                                    <td className="px-6 py-2 text-right text-red-500">{formatCurrency(dre.fixedCosts)}</td>
                                    <td className="px-6 py-2 text-right text-gray-400 text-xs">{dre.grossRevenue > 0 ? ((dre.fixedCosts / dre.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                </tr>

                                {/* EBITDA */}
                                <tr className={`font-bold text-lg border-t-2 ${dre.ebitda >= 0 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                    <td className="px-6 py-4">(=) Resultado Operacional (EBITDA)</td>
                                    <td className="px-6 py-4 text-right">{formatCurrency(dre.ebitda)}</td>
                                    <td className="px-6 py-4 text-right text-xs opacity-70">{dre.grossRevenue > 0 ? ((dre.ebitda / dre.grossRevenue) * 100).toFixed(1) : 0}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Visual Analysis */}
                    <div className="w-full lg:w-80 flex flex-col gap-6">

                        {/* Result Card */}
                        <div className={`p-6 rounded-xl border shadow-sm text-center ${dre.ebitda >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <p className="text-xs uppercase font-bold opacity-60 mb-2">Lucratividade do Mês</p>
                            <h3 className={`text-4xl font-bold ${dre.ebitda >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {dre.grossRevenue > 0 ? ((dre.ebitda / dre.grossRevenue) * 100).toFixed(1) : 0}%
                            </h3>
                            <p className="text-xs mt-2 text-gray-500">Margem Líquida</p>
                        </div>

                        {/* Waterfall / Breakdown Chart */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
                            <h4 className="font-bold text-gray-700 mb-4 text-sm">Composição de Custos</h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Variáveis', value: dre.variableCosts, fill: '#ef4444' },
                                                { name: 'Fixos', value: dre.fixedCosts, fill: '#f97316' },
                                                { name: 'Impostos', value: dre.deductions, fill: '#64748b' },
                                                { name: 'Lucro', value: Math.max(0, dre.ebitda), fill: '#22c55e' }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#ef4444" />
                                            <Cell fill="#f97316" />
                                            <Cell fill="#64748b" />
                                            <Cell fill="#22c55e" />
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Variáveis</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Fixos</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-500"></div> Impostos</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Lucro</div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default DREReportModal;
