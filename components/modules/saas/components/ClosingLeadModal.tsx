import React, { useState } from 'react';
import { SaaSLead, SaaSPlan, PaymentMethod, Recurrence } from '@/types';
import { XCircle, CheckCircle, Link, Copy } from 'lucide-react';
import { SAAS_PLANS_CONFIG } from '../saasPlans';

interface ClosingLeadModalProps {
    lead: SaaSLead | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { plan: SaaSPlan; paymentMethod: PaymentMethod; recurrence: Recurrence }) => Promise<void>;
    onGenerateCheckout: (data: { plan: SaaSPlan; paymentMethod: PaymentMethod; recurrence: Recurrence }) => Promise<string | null>;
}

export function ClosingLeadModal({ lead, isOpen, onClose, onConfirm, onGenerateCheckout }: ClosingLeadModalProps) {
    const [closingData, setClosingData] = useState({
        plan: SaaSPlan.GROWTH,
        paymentMethod: 'credit_card' as PaymentMethod,
        recurrence: 'monthly' as Recurrence
    });
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateCheckout = async () => {
        setIsGenerating(true);
        try {
            const url = await onGenerateCheckout(closingData);
            if (url) {
                setCheckoutUrl(url);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleConfirm = async () => {
        await onConfirm(closingData);
        // Reset state
        setCheckoutUrl(null);
        setClosingData({
            plan: SaaSPlan.GROWTH,
            paymentMethod: 'credit_card',
            recurrence: 'monthly'
        });
    };

    const copyToClipboard = () => {
        if (checkoutUrl) {
            navigator.clipboard.writeText(checkoutUrl);
        }
    };

    if (!isOpen || !lead) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <XCircle size={24} />
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Fechar Venda</h3>
                    <p className="text-slate-400">Configure os detalhes da assinatura para <strong>{lead.clinicName}</strong>.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Plano Escolhido</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[SaaSPlan.START, SaaSPlan.GROWTH, SaaSPlan.EMPIRE].map((plan) => {
                                const config = SAAS_PLANS_CONFIG[plan];
                                const isSelected = closingData.plan === plan;
                                return (
                                    <button
                                        key={plan}
                                        onClick={() => setClosingData({ ...closingData, plan })}
                                        className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${isSelected
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                            : 'bg-slate-800 border-white/10 text-slate-400 hover:bg-slate-750 hover:border-emerald-500/30'
                                            }`}
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{config?.name || plan}</span>
                                        <span className="text-lg font-mono font-bold text-white">
                                            {config ? `R$ ${Math.floor(config.monthlyPrice)}` : '-'}
                                        </span>
                                        {isSelected && <CheckCircle size={14} className="mt-1 animate-in zoom-in" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Forma de Pagamento</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setClosingData({ ...closingData, paymentMethod: 'credit_card' })}
                                className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${closingData.paymentMethod === 'credit_card'
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-slate-800 border-white/10 text-slate-400 active:scale-95'
                                    }`}
                            >
                                Cartão
                            </button>
                            <button
                                onClick={() => setClosingData({ ...closingData, paymentMethod: 'pix' })}
                                className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${closingData.paymentMethod === 'pix'
                                    ? 'bg-emerald-600 border-emerald-500 text-white'
                                    : 'bg-slate-800 border-white/10 text-slate-400 active:scale-95'
                                    }`}
                            >
                                Pix
                            </button>
                            <button
                                onClick={() => setClosingData({ ...closingData, paymentMethod: 'boleto' })}
                                className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${closingData.paymentMethod === 'boleto'
                                    ? 'bg-yellow-600 border-yellow-500 text-white'
                                    : 'bg-slate-800 border-white/10 text-slate-400 active:scale-95'
                                    }`}
                            >
                                Boleto
                            </button>
                        </div>
                    </div>

                    {closingData.paymentMethod === 'credit_card' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Recorrência</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setClosingData({ ...closingData, recurrence: 'monthly' })}
                                    className={`p-4 rounded-xl border text-left transition-all ${closingData.recurrence === 'monthly'
                                        ? 'bg-slate-700 border-white text-white'
                                        : 'bg-slate-800 border-white/10 text-slate-400'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="block font-bold">Mensal</span>
                                        {closingData.plan && SAAS_PLANS_CONFIG[closingData.plan] && (
                                            <span className="text-sm font-mono text-emerald-400">
                                                R$ {SAAS_PLANS_CONFIG[closingData.plan].monthlyPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs opacity-70 mt-1 block">Pagamento todo mês</span>
                                </button>
                                <button
                                    onClick={() => setClosingData({ ...closingData, recurrence: 'annual' })}
                                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${closingData.recurrence === 'annual'
                                        ? 'bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-400 text-white'
                                        : 'bg-slate-800 border-white/10 text-slate-400'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="block font-bold">Anual</span>
                                        {closingData.plan && SAAS_PLANS_CONFIG[closingData.plan] && (
                                            <span className="text-sm font-mono text-white bg-black/20 px-1 rounded">
                                                R$ {SAAS_PLANS_CONFIG[closingData.plan].yearlyPrice.toFixed(0)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-2 inline-block bg-white/20 px-2 py-0.5 rounded text-white font-bold">
                                        Economize ~17%
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                <Link size={12} /> Link de Pagamento (Checkout)
                            </label>
                            {!checkoutUrl && (
                                <button
                                    onClick={handleGenerateCheckout}
                                    disabled={isGenerating}
                                    className="text-xs text-yellow-500 hover:text-yellow-400 font-bold transition-colors disabled:opacity-50"
                                >
                                    {isGenerating ? 'Gerando...' : 'Gerar Link Agora'}
                                </button>
                            )}
                        </div>

                        {checkoutUrl ? (
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={checkoutUrl}
                                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                                    title="Copiar"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500">
                                Gere um link para o cliente preencher os dados e pagar sozinho.
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-emerald-500/20 transition-all mt-4"
                    >
                        Confirmar Venda e Enviar Acesso
                    </button>
                </div>
            </div>
        </div>
    );
}
