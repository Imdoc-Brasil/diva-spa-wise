import React from 'react';
import { SaaSLead } from '@/types';
import { MoreHorizontal, Phone, Mail, Clock, TrendingUp } from 'lucide-react';
import { PlanBadge } from './shared/PlanBadge';

interface LeadCardProps {
    lead: SaaSLead;
    isActionMenuOpen: boolean;
    onDragStart: () => void;
    onClick: () => void;
    onToggleActionMenu: (e: React.MouseEvent) => void;
    onViewDetails: (e: React.MouseEvent) => void;
    onConvert: (e: React.MouseEvent) => void;
    onArchive: (e: React.MouseEvent) => void;
    onClose: (e: React.MouseEvent) => void;
}

export function LeadCard({
    lead,
    isActionMenuOpen,
    onDragStart,
    onClick,
    onToggleActionMenu,
    onViewDetails,
    onArchive,
}: LeadCardProps) {
    // Lead "Heat" logic based on age
    const leadDate = new Date(lead.createdAt);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - leadDate.getTime()) / (1000 * 3600 * 24));

    // Status color logic
    const getHeatColor = () => {
        if (diffDays <= 2) return 'bg-emerald-500'; // Hot
        if (diffDays <= 7) return 'bg-yellow-500';  // Warm
        return 'bg-rose-500';                      // Cold
    };

    const getHeatLabel = () => {
        if (diffDays <= 2) return 'Novo';
        if (diffDays <= 7) return 'Ativo';
        return 'Pendente';
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
            className="group relative bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-white/5 p-5 rounded-2xl hover:border-diva-accent/40 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-diva-accent/5 active:scale-95 active:cursor-grabbing backdrop-blur-sm"
        >
            {/* Health Indicator Line */}
            <div className={`absolute top-0 left-6 w-12 h-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity ${getHeatColor()}`}></div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                    <PlanBadge plan={lead.planInterest} />
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 ${getHeatColor().replace('bg-', 'text-')}`}>
                        <div className={`w-1 h-1 rounded-full animate-pulse ${getHeatColor()}`}></div>
                        {getHeatLabel()}
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={onToggleActionMenu}
                        className={`p-1 rounded-lg transition-all ${isActionMenuOpen ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {isActionMenuOpen && (
                        <div className="absolute right-0 top-10 w-52 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 backdrop-saturate-150">
                            <button
                                onClick={onViewDetails}
                                className="w-full text-left px-5 py-3.5 hover:bg-white/5 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-3"
                            >
                                <TrendingUp size={14} className="text-diva-accent" />
                                Abrir Oportunidade
                            </button>
                            <button
                                onClick={onArchive}
                                className="w-full text-left px-5 py-3.5 hover:bg-rose-500/10 text-xs font-semibold text-rose-400 border-t border-white/5 transition-colors flex items-center gap-3"
                            >
                                <Clock size={14} />
                                Arquivar Lead
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-1 mb-5">
                <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-diva-accent transition-colors leading-tight">
                    {lead.clinicName}
                </h4>
                <div className="flex items-center gap-2 text-slate-400 font-medium text-sm italic">
                    <span className="opacity-50">—</span> {lead.name}
                </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
                <a
                    href={`tel:${lead.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/30"
                >
                    <Phone size={14} className="mr-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ligar</span>
                </a>
                <a
                    href={`mailto:${lead.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-sky-500/20 hover:text-sky-400 transition-all border border-transparent hover:border-sky-500/30"
                >
                    <Mail size={14} className="mr-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Email</span>
                </a>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Capturado em</p>
                    <p className="text-xs text-slate-300 font-medium">{leadDate.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-diva-accent uppercase tracking-widest mb-0.5">Valor Estimado</p>
                    <p className="text-sm font-bold text-white bg-diva-accent/10 px-2 py-0.5 rounded border border-diva-accent/20">
                        R$ {lead.estimatedValue.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

