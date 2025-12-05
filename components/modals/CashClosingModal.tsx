
import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Smartphone, AlertCircle, CheckCircle, ArrowRight, Printer } from 'lucide-react';

import { useData } from '../context/DataContext';

interface CashClosingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CashClosingModal: React.FC<CashClosingModalProps> = ({ isOpen, onClose }) => {
    const { transactions } = useData();
    const [step, setStep] = useState<'count' | 'review' | 'finish'>('count');

    // Calculate System Totals from Real Transactions (Today)
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const todayTransactions = transactions.filter(t => t.date === localDate && t.type === 'income');

    const systemTotals = {
        cash: todayTransactions.filter(t => t.paymentMethod === 'cash').reduce((acc, t) => acc + t.amount, 0),
        credit: todayTransactions.filter(t => t.paymentMethod === 'credit_card').reduce((acc, t) => acc + t.amount, 0),
        debit: todayTransactions.filter(t => t.paymentMethod === 'debit_card').reduce((acc, t) => acc + t.amount, 0),
        pix: todayTransactions.filter(t => t.paymentMethod === 'pix').reduce((acc, t) => acc + t.amount, 0),
        openingBalance: 200.00 // Fixed Opening Balance for now
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

    const parseCurrency = (val: string) => {
        const num = parseFloat(val.replace(',', '.'));
        return isNaN(num) ? 0 : num;
    };

    // Calculations
    const totalExpected = systemTotals.cash + systemTotals.credit + systemTotals.debit + systemTotals.pix + systemTotals.openingBalance;
    const cashDifference = parseCurrency(counted.cash) - (systemTotals.cash + systemTotals.openingBalance);
    const totalDifference = (parseCurrency(counted.cash) + parseCurrency(counted.credit) + parseCurrency(counted.debit) + parseCurrency(counted.pix)) - totalExpected;

    const handleNext = () => {
        setStep('review');
    };

    const handleFinish = () => {
        setStep('finish');
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-diva-dark/90 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-diva-dark text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold font-serif">Fechamento de Caixa</h2>
                        <p className="text-diva-light text-sm opacity-80">Reconciliação Diária • {new Date().toLocaleDateString()}</p>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* STEP 1: COUNTING (BLIND) */}
                {step === 'count' && (
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
                            <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-blue-800 text-sm">Conferência de Valores</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                    Por favor, conte o dinheiro físico na gaveta e some os comprovantes das maquininhas antes de digitar.
                                    Não olhe o sistema ainda.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm">
                                <h3 className="font-bold text-diva-dark mb-4 flex items-center text-lg">
                                    <DollarSign size={20} className="mr-2 text-green-600" /> Dinheiro em Espécie
                                </h3>
                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-gray-600">Valor Contado (Gaveta)</label>
                                    <div className="flex items-center w-48 border-2 border-gray-200 rounded-lg focus-within:border-diva-primary focus-within:ring-2 focus-within:ring-diva-primary/20 transition-all bg-gray-50">
                                        <span className="pl-3 text-gray-500 font-bold">R$</span>
                                        <input
                                            type="number"
                                            placeholder="0,00"
                                            value={counted.cash}
                                            onChange={e => setCounted({ ...counted, cash: e.target.value })}
                                            className="w-full p-3 bg-transparent outline-none text-right font-mono font-bold text-diva-dark text-lg"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 text-right">Incluindo fundo de troco</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm space-y-4">
                                <h3 className="font-bold text-diva-dark mb-2 flex items-center text-lg">
                                    <CreditCard size={20} className="mr-2 text-diva-primary" /> Cartões e Eletrônicos
                                </h3>

                                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <label className="text-sm text-gray-600">Crédito (Soma das Filipetas)</label>
                                    <div className="flex items-center w-48 border border-gray-300 rounded-lg bg-white">
                                        <span className="pl-3 text-gray-500 text-sm">R$</span>
                                        <input
                                            type="number"
                                            value={counted.credit}
                                            onChange={e => setCounted({ ...counted, credit: e.target.value })}
                                            className="w-full p-2 bg-transparent outline-none text-right font-mono text-diva-dark"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <label className="text-sm text-gray-600">Débito</label>
                                    <div className="flex items-center w-48 border border-gray-300 rounded-lg bg-white">
                                        <span className="pl-3 text-gray-500 text-sm">R$</span>
                                        <input
                                            type="number"
                                            value={counted.debit}
                                            onChange={e => setCounted({ ...counted, debit: e.target.value })}
                                            className="w-full p-2 bg-transparent outline-none text-right font-mono text-diva-dark"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-gray-600 flex items-center"><Smartphone size={14} className="mr-1" /> PIX (Confirmados)</label>
                                    <div className="flex items-center w-48 border border-gray-300 rounded-lg bg-white">
                                        <span className="pl-3 text-gray-500 text-sm">R$</span>
                                        <input
                                            type="number"
                                            value={counted.pix}
                                            onChange={e => setCounted({ ...counted, pix: e.target.value })}
                                            className="w-full p-2 bg-transparent outline-none text-right font-mono text-diva-dark"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: REVIEW (COMPARISON) */}
                {step === 'review' && (
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                        <h3 className="text-lg font-bold text-diva-dark mb-6">Resumo da Conferência</h3>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Tipo</th>
                                        <th className="px-6 py-3 text-right">Sistema</th>
                                        <th className="px-6 py-3 text-right">Contado</th>
                                        <th className="px-6 py-3 text-right">Diferença</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* CASH ROW */}
                                    <tr className={cashDifference !== 0 ? 'bg-red-50' : ''}>
                                        <td className="px-6 py-4 font-medium">Dinheiro</td>
                                        <td className="px-6 py-4 text-right text-gray-500">{formatCurrency(systemTotals.cash + systemTotals.openingBalance)}</td>
                                        <td className="px-6 py-4 text-right font-bold">{formatCurrency(parseCurrency(counted.cash))}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${cashDifference === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {cashDifference > 0 ? '+' : ''}{formatCurrency(cashDifference)}
                                        </td>
                                    </tr>
                                    {/* OTHER ROWS (Simplified logic for demo) */}
                                    <tr>
                                        <td className="px-6 py-4 font-medium">Crédito</td>
                                        <td className="px-6 py-4 text-right text-gray-500">{formatCurrency(systemTotals.credit)}</td>
                                        <td className="px-6 py-4 text-right font-bold">{formatCurrency(parseCurrency(counted.credit))}</td>
                                        <td className="px-6 py-4 text-right text-green-500">R$ 0,00</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium">Débito</td>
                                        <td className="px-6 py-4 text-right text-gray-500">{formatCurrency(systemTotals.debit)}</td>
                                        <td className="px-6 py-4 text-right font-bold">{formatCurrency(parseCurrency(counted.debit))}</td>
                                        <td className="px-6 py-4 text-right text-green-500">R$ 0,00</td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-diva-light/20 font-bold">
                                    <tr>
                                        <td className="px-6 py-4 text-diva-dark">TOTAL</td>
                                        <td className="px-6 py-4 text-right">{formatCurrency(totalExpected)}</td>
                                        <td className="px-6 py-4 text-right text-diva-dark">
                                            {formatCurrency(parseCurrency(counted.cash) + parseCurrency(counted.credit) + parseCurrency(counted.debit) + parseCurrency(counted.pix))}
                                        </td>
                                        <td className={`px-6 py-4 text-right ${totalDifference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {totalDifference > 0 ? '+' : ''}{formatCurrency(totalDifference)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {cashDifference !== 0 && (
                            <div className="mt-6">
                                <label className="block text-sm font-bold text-diva-alert mb-2">Justificativa da Divergência (Obrigatório)</label>
                                <textarea
                                    className="w-full p-3 border border-red-300 rounded-lg focus:ring-1 focus:ring-diva-alert outline-none text-sm bg-white"
                                    placeholder="Ex: Diferença de troco não registrado..."
                                    rows={3}
                                ></textarea>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: FINISH */}
                {step === 'finish' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-lg">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-diva-dark mb-2">Caixa Fechado com Sucesso!</h2>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                            O relatório de fechamento #1024 foi gerado e enviado para a gerência financeira.
                        </p>
                        <button className="flex items-center text-diva-primary font-bold hover:underline">
                            <Printer size={18} className="mr-2" /> Imprimir Comprovante
                        </button>
                    </div>
                )}

                {/* Footer Actions */}
                {step !== 'finish' && (
                    <div className="p-6 bg-white border-t border-diva-light/20 flex justify-between">
                        {step === 'review' ? (
                            <button onClick={() => setStep('count')} className="px-6 py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50">
                                Voltar e Recorrigir
                            </button>
                        ) : (
                            <button onClick={onClose} className="px-6 py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50">
                                Cancelar
                            </button>
                        )}

                        {step === 'count' ? (
                            <button onClick={handleNext} className="px-8 py-3 rounded-xl bg-diva-primary text-white font-bold hover:bg-diva-dark shadow-md flex items-center">
                                Conferir Diferenças <ArrowRight size={18} className="ml-2" />
                            </button>
                        ) : (
                            <button onClick={handleFinish} className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-md flex items-center">
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
