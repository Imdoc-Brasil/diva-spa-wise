import React, { useState } from 'react';
import { SaaSLead, SaaSPlan, PaymentMethod, Recurrence } from '@/types';
import { X, CheckCircle, Link, Copy, CreditCard, QrCode, FileText, Star, Zap, Crown } from 'lucide-react';
import { SAAS_PLANS_CONFIG } from '../saasPlans';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    const [copied, setCopied] = useState(false);

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
        setCheckoutUrl(null);
        setClosingData({
            plan: SaaSPlan.GROWTH,
            paymentMethod: 'credit_card',
            recurrence: 'monthly'
        });
        onClose();
    };

    const copyToClipboard = () => {
        if (checkoutUrl) {
            navigator.clipboard.writeText(checkoutUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!lead) return null;

    const currentPlanConfig = SAAS_PLANS_CONFIG[closingData.plan];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-slate-950 border-white/10 text-white p-0 overflow-hidden outline-none">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-white to-emerald-500 z-50"></div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white hover:bg-white/10 z-50 rounded-full"
                >
                    <X size={20} />
                </Button>

                <div className="p-8">
                    <DialogHeader className="text-center items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200 }}
                            className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/5"
                        >
                            <Crown className="text-emerald-500 w-10 h-10" />
                        </motion.div>
                        <DialogTitle className="text-3xl font-bold tracking-tight text-white mb-2">Fechar Venda de Sucesso</DialogTitle>
                        <DialogDescription className="text-slate-400 text-lg">
                            Detalhes finais da assinatura de <span className="text-emerald-400 font-semibold">{lead.clinicName}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-8">
                        {/* PLAN SELECTOR */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">1. Selecione o Plano</label>
                                {closingData.plan === SaaSPlan.EMPIRE && (
                                    <Badge variant="outline" className="bg-diva-accent/10 border-diva-accent/30 text-diva-accent text-[10px] uppercase font-black px-2 py-0.5 animate-pulse">
                                        Recomendado para Grandes Unidades
                                    </Badge>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[SaaSPlan.START, SaaSPlan.GROWTH, SaaSPlan.EMPIRE].map((plan) => {
                                    const config = SAAS_PLANS_CONFIG[plan];
                                    const isSelected = closingData.plan === plan;
                                    const Icon = plan === SaaSPlan.START ? Zap : plan === SaaSPlan.GROWTH ? Star : Crown;

                                    return (
                                        <button
                                            key={plan}
                                            onClick={() => {
                                                setClosingData({ ...closingData, plan });
                                                setCheckoutUrl(null);
                                            }}
                                            className={`group relative p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${isSelected
                                                ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-[1.02] shadow-xl shadow-emerald-500/10'
                                                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/[0.08] hover:border-white/10'
                                                }`}
                                        >
                                            <div className="flex flex-col h-full justify-between gap-px relative z-10">
                                                <div className="flex items-center justify-between mb-4">
                                                    <Icon size={20} className={isSelected ? 'text-slate-950' : 'text-emerald-500/50'} />
                                                    {isSelected && <CheckCircle size={14} className="animate-in zoom-in spin-in-90 fill-slate-950 text-emerald-300" />}
                                                </div>
                                                <div>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-slate-900/60' : 'text-slate-500'}`}>{config?.name || plan}</p>
                                                    <p className={`text-xl font-bold font-mono ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                                                        R$ {config ? Math.floor(config.monthlyPrice) : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Subtle background decoration */}
                                            {isSelected && (
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* PAYMENT DETAILS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">2. Forma de Pagamento</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, color: 'text-blue-400' },
                                        { id: 'pix', label: 'PIX Instantâneo', icon: QrCode, color: 'text-emerald-400' },
                                        { id: 'boleto', label: 'Boleto Bancário', icon: FileText, color: 'text-orange-400' }
                                    ].map((method) => {
                                        const isSelected = closingData.paymentMethod === method.id;
                                        const Icon = method.icon;
                                        return (
                                            <button
                                                key={method.id}
                                                onClick={() => setClosingData({ ...closingData, paymentMethod: method.id as PaymentMethod })}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected
                                                    ? 'bg-slate-900 border-white/20 text-white'
                                                    : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon size={18} className={isSelected ? method.color : 'opacity-40'} />
                                                    <span className="text-sm font-bold">{method.label}</span>
                                                </div>
                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {closingData.paymentMethod === 'credit_card' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">3. Periodicidade</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { id: 'monthly', label: 'Assinatura Mensal', desc: 'Flexibilidade total', price: currentPlanConfig?.monthlyPrice },
                                                { id: 'annual', label: 'Plano Anual (VIP)', desc: 'Melhor custo-benefício', price: currentPlanConfig?.yearlyPrice, badge: 'Economize 17%' }
                                            ].map((rec) => {
                                                const isSelected = closingData.recurrence === rec.id;
                                                return (
                                                    <button
                                                        key={rec.id}
                                                        onClick={() => setClosingData({ ...closingData, recurrence: rec.id as Recurrence })}
                                                        className={`relative p-4 rounded-2xl border text-left transition-all overflow-hidden ${isSelected
                                                            ? 'bg-gradient-to-br from-slate-900/80 to-emerald-900/20 border-emerald-500/50 text-white ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5'
                                                            : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/5'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="text-sm font-bold uppercase">{rec.label}</span>
                                                            <span className={`font-mono text-sm ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`}>
                                                                R$ {isSelected ? (rec.price || 0).toFixed(2) : '-'}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] opacity-60 mb-2">{rec.desc}</p>
                                                        {rec.badge && (
                                                            <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-500 text-[9px] uppercase font-black px-2 py-0">
                                                                {rec.badge}
                                                            </Badge>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* CHECKOUT SECTION */}
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative group">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <Link size={14} className="text-emerald-500" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Checkout Inteligente</span>
                                </div>
                                {!checkoutUrl && (
                                    <Button
                                        onClick={handleGenerateCheckout}
                                        disabled={isGenerating}
                                        variant="link"
                                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-black uppercase underline-offset-4 p-0 h-auto"
                                    >
                                        {isGenerating ? 'Gerando...' : 'Criar Novo Link'}
                                    </Button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {checkoutUrl ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-2"
                                    >
                                        <div className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-[11px] text-slate-300 font-mono truncate items-center flex">
                                            {checkoutUrl}
                                        </div>
                                        <Button
                                            onClick={copyToClipboard}
                                            className={`rounded-2xl px-6 py-6 transition-all font-bold ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                                        >
                                            {copied ? <CheckCircle size={18} /> : <div className="flex items-center gap-2"><Copy size={16} /> <span className="text-xs uppercase">Copiar</span></div>}
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">
                                        Se preferir, gere um link de pagamento customizado para o cliente concluir a contratação de forma autônoma.
                                    </p>
                                )}
                            </AnimatePresence>
                        </div>

                        <Separator className="bg-white/5" />

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleConfirm}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-8 rounded-2xl text-xl shadow-xl shadow-emerald-500/20 group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <span>CONCLUIR VENDA E LIBERAR ACESSO</span>
                                    <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                </div>
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="text-slate-500 hover:text-white"
                            >
                                Manter Lead no Funil
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
