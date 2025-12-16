import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Smartphone, AlertCircle, CheckCircle, ArrowRight, Printer, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';

interface CashClosingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CashClosingModal: React.FC<CashClosingModalProps> = ({ isOpen, onClose }) => {
    const { transactions } = useData();
    const [step, setStep] = useState<'count' | 'review' | 'finish'>('count');
    const [openingBalance, setOpeningBalance] = useState<string>('200,00');

    // Calculate System Totals from Real Transactions (Today)
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const todayTransactions = transactions.filter(t => t.date === localDate);

    // Cash Flow Logic
    const cashIn = todayTransactions.filter(t => t.type === 'income' && t.paymentMethod === 'cash').reduce((acc, t) => acc + t.amount, 0);
    const cashOut = todayTransactions.filter(t => t.type === 'expense' && t.paymentMethod === 'cash').reduce((acc, t) => acc + t.amount, 0);

    const systemTotals = {
        cashTotal: cashIn - cashOut, // Expected Cash in Drawer
        cashIn,
        cashOut,
        credit: todayTransactions.filter(t => t.type === 'income' && t.paymentMethod === 'credit_card').reduce((acc, t) => acc + t.amount, 0),
        debit: todayTransactions.filter(t => t.type === 'income' && t.paymentMethod === 'debit_card').reduce((acc, t) => acc + t.amount, 0),
        pix: todayTransactions.filter(t => t.type === 'income' && t.paymentMethod === 'pix').reduce((acc, t) => acc + t.amount, 0),
    };

    // User Inputs (Counted)
    const [counted, setCounted] = useState({
        cash: '',
        credit: '',
        debit: '',
        pix: ''
    });

    if (!isOpen) return null;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const parseInput = (val: string) => {
        if (!val) return 0;
        const clean = val.replace(/[R$\s.]/g, '').replace(',', '.');
        const num = parseFloat(clean);
        return isNaN(num) ? 0 : num;
    };

    // Calculations
    const openingVal = parseInput(openingBalance);
    const expectedDrawerCash = openingVal + systemTotals.cashTotal;

    const countedCashVal = parseInput(counted.cash);
    const cashDifference = countedCashVal - expectedDrawerCash;

    const handleNext = () => {
        setStep('review');
    };

    const handleFinish = () => {
        // Here we would save the closing record to DB
        setStep('finish');
    };

    const handleReset = () => {
        onClose();
        setStep('count');
        setCounted({ cash: '', credit: '', debit: '', pix: '' });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-diva-dark/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] animate-in slide-in-from-bottom-8 duration-300">

                {/* Header */}
                <div className="bg-diva-dark text-white p-6 flex justify-between items-center border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                            <TrendingUp size={24} className="text-green-400" /> Fechamento de Caixa
                        </h2>
                        <p className="text-diva-light text-sm opacity-80 mt-1">Reconciliação Diária • {new Date().toLocaleDateString()}</p>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors bg-white/10 p-2 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* STEP 1: COUNTING (BLIND) */}
                {step === 'count' && (
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3 items-start animate-in slide-in-from-left-2 delay-100">
                            <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-blue-800 text-sm">Conferência Cega</h4>
                                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                    Conte o dinheiro físico na gaveta e os comprovantes <b>antes</b> de comparar com o sistema.
                                    Isso garante a integridade do fechamento.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Left Column: Cash */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-diva-dark text-sm uppercase tracking-wider border-b border-gray-200 pb-2">Dinheiro em Espécie</h3>

                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="p-1.5 bg-gray-100 rounded-lg"><DollarSign size={16} /></div>
                                            <span className="text-sm font-bold">Fundo de Troco (Inicial)</span>
                                        </div>
                                        <div className="w-32">
                                            <input
                                                type="text"
                                                value={openingBalance}
                                                onChange={e => setOpeningBalance(e.target.value)}
                                                className="w-full text-right font-mono font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-1.5 focus:ring-2 focus:ring-diva-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-diva-dark font-bold">Valor Total em Gaveta (Contado)</label>
                                        <div className="flex items-center border-2 border-diva-primary/30 rounded-xl focus-within:border-diva-primary focus-within:ring-4 focus-within:ring-diva-primary/10 transition-all bg-white p-1">
                                            <span className="pl-3 text-gray-400 font-bold text-lg">R$</span>
                                            <input
                                                type="number"
                                                placeholder="0,00"
                                                autoFocus
                                                value={counted.cash}
                                                onChange={e => setCounted({ ...counted, cash: e.target.value })}
                                                className="w-full p-2 bg-transparent outline-none text-right font-mono font-bold text-diva-dark text-2xl"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 text-right mt-1">Inclua moedas e o fundo de troco na contagem.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Cards */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-diva-dark text-sm uppercase tracking-wider border-b border-gray-200 pb-2">Cartões & Digital</h3>

                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                            <CreditCard size={16} className="text-diva-primary" /> Crédito
                                        </label>
                                        <div className="w-32 flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                                            <span className="pl-2 text-gray-400 text-xs">R$</span>
                                            <input
                                                type="number"
                                                value={counted.credit}
                                                onChange={e => setCounted({ ...counted, credit: e.target.value })}
                                                className="w-full p-1.5 outline-none text-right font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                            <CreditCard size={16} className="text-blue-500" /> Débito
                                        </label>
                                        <div className="w-32 flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                                            <span className="pl-2 text-gray-400 text-xs">R$</span>
                                            <input
                                                type="number"
                                                value={counted.debit}
                                                onChange={e => setCounted({ ...counted, debit: e.target.value })}
                                                className="w-full p-1.5 outline-none text-right font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                            <Smartphone size={16} className="text-green-500" /> PIX
                                        </label>
                                        <div className="w-32 flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                                            <span className="pl-2 text-gray-400 text-xs">R$</span>
                                            <input
                                                type="number"
                                                value={counted.pix}
                                                onChange={e => setCounted({ ...counted, pix: e.target.value })}
                                                className="w-full p-1.5 outline-none text-right font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: REVIEW (COMPARISON) */}
                {step === 'review' && (
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-diva-dark mb-4 flex items-center gap-2">
                            <CheckCircle size={20} className="text-diva-primary" /> Resumo da Conferência
                        </h3>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <p className="text-xs text-gray-500 uppercase font-bold">Vendas Dinheiro</p>
                                <p className="text-lg font-bold text-green-600">+{formatCurrency(systemTotals.cashIn)}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <p className="text-xs text-gray-500 uppercase font-bold">Saídas (Sangrias)</p>
                                <p className="text-lg font-bold text-red-500">-{formatCurrency(systemTotals.cashOut)}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-diva-primary">
                                <p className="text-xs text-gray-500 uppercase font-bold">Esperado em Gaveta</p>
                                <p className="text-xl font-bold text-diva-dark">{formatCurrency(expectedDrawerCash)}</p>
                                <p className="text-[10px] text-gray-400">Inclui Abertura {formatCurrency(openingVal)}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Tipo</th>
                                        <th className="px-6 py-3 text-right">Sistema (Esperado)</th>
                                        <th className="px-6 py-3 text-right">Contado (Físico)</th>
                                        <th className="px-6 py-3 text-right">Diferença (Quebra)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* CASH ROW */}
                                    <tr className={Math.abs(cashDifference) > 0.01 ? 'bg-red-50/50' : 'bg-green-50/30'}>
                                        <td className="px-6 py-4 font-bold text-diva-dark flex items-center gap-2">
                                            <DollarSign size={16} /> Dinheiro
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">{formatCurrency(expectedDrawerCash)}</td>
                                        <td className="px-6 py-4 text-right font-bold text-diva-dark">{formatCurrency(countedCashVal)}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${Math.abs(cashDifference) < 0.01 ? 'text-green-600' : 'text-red-500'}`}>
                                            {cashDifference > 0 ? '+' : ''}{formatCurrency(cashDifference)}
                                        </td>
                                    </tr>
                                    {/* OTHER ROWS */}
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-gray-600">Cartão de Crédito</td>
                                        <td className="px-6 py-4 text-right text-gray-500">{formatCurrency(systemTotals.credit)}</td>
                                        <td className="px-6 py-4 text-right font-medium">{formatCurrency(parseInput(counted.credit))}</td>
                                        <td className="px-6 py-4 text-right text-gray-400">-</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-gray-600">Cartão de Débito</td>
                                        <td className="px-6 py-4 text-right text-gray-500">{formatCurrency(systemTotals.debit)}</td>
                                        <td className="px-6 py-4 text-right font-medium">{formatCurrency(parseInput(counted.debit))}</td>
                                        <td className="px-6 py-4 text-right text-gray-400">-</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-gray-600">PIX</td>
                                        <td className="px-6 py-4 text-right text-gray-500">{formatCurrency(systemTotals.pix)}</td>
                                        <td className="px-6 py-4 text-right font-medium">{formatCurrency(parseInput(counted.pix))}</td>
                                        <td className="px-6 py-4 text-right text-gray-400">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {Math.abs(cashDifference) > 0.01 && (
                            <div className="mt-6 animate-in fade-in">
                                <label className="block text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                                    <AlertCircle size={16} /> Justificativa da Divergência (Obrigatório)
                                </label>
                                <textarea
                                    className="w-full p-4 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none text-sm bg-red-50/30"
                                    placeholder="Explique o motivo da quebra de caixa (Ex: Diferença de troco não registrado, erro de contagem...)"
                                    rows={3}
                                ></textarea>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: FINISH */}
                {step === 'finish' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-lg">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-diva-dark mb-2">Caixa Fechado com Sucesso!</h2>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                            O relatório de fechamento <b>#{new Date().toISOString().slice(0, 10).replace(/-/g, '')}</b> foi gerado e enviado para a gerência.
                        </p>
                        <div className="flex gap-4">
                            <button className="flex items-center text-gray-600 font-bold hover:bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                <Printer size={18} className="mr-2" /> Imprimir Comprovante
                            </button>
                            <button onClick={handleReset} className="flex items-center bg-diva-dark text-white font-bold px-6 py-2 rounded-lg hover:bg-black shadow-lg">
                                Voltar ao Início
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                {step !== 'finish' && (
                    <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                        {step === 'review' ? (
                            <button onClick={() => setStep('count')} className="px-6 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all">
                                Voltar e Recorrigir
                            </button>
                        ) : (
                            <button onClick={onClose} className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-all">
                                Cancelar
                            </button>
                        )}

                        {step === 'count' ? (
                            <button onClick={handleNext} className="px-8 py-3 rounded-xl bg-diva-primary text-white font-bold hover:bg-diva-dark shadow-lg hover:shadow-xl transition-all flex items-center transform active:scale-95">
                                Conferir Diferenças <ArrowRight size={18} className="ml-2" />
                            </button>
                        ) : (
                            <button onClick={handleFinish} className="px-10 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg hover:shadow-xl hover:shadow-green-500/20 transition-all flex items-center transform active:scale-95">
                                Encerrar o Dia <CheckCircle size={18} className="ml-2" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashClosingModal;
