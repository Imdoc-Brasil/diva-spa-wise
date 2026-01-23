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
    const getHeatStyles = () => {
        if (diffDays <= 2) return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' };
        if (diffDays <= 7) return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' };
        return { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', dot: 'bg-rose-500' };
    };

    const getHeatLabel = () => {
        if (diffDays <= 2) return 'Novo';
        if (diffDays <= 7) return 'Ativo';
        return 'Pendente';
    };

    const heatStyles = getHeatStyles();

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
            className="group relative bg-card border border-border p-5 rounded-2xl hover:border-primary/40 transition-all duration-300 cursor-pointer shadow-spa hover:shadow-spa-md active:scale-[0.98] active:cursor-grabbing"
        >
            {/* Health Indicator Line */}
            <div className={`absolute top-0 left-6 w-12 h-[3px] rounded-full opacity-80 group-hover:opacity-100 transition-opacity ${heatStyles.dot}`}></div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                    <PlanBadge plan={lead.planInterest} />
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${heatStyles.bg} ${heatStyles.text}`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${heatStyles.dot}`}></div>
                        {getHeatLabel()}
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={onToggleActionMenu}
                        className={`p-1.5 rounded-lg transition-all ${isActionMenuOpen ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {isActionMenuOpen && (
                        <div className="absolute right-0 top-10 w-52 bg-popover border border-border rounded-xl shadow-spa-lg z-50 overflow-hidden animate-in fade-in zoom-in-95">
                            <button
                                onClick={onViewDetails}
                                className="w-full text-left px-4 py-3 hover:bg-muted text-sm font-medium text-foreground transition-colors flex items-center gap-3"
                            >
                                <TrendingUp size={14} className="text-primary" />
                                Abrir Oportunidade
                            </button>
                            <button
                                onClick={onArchive}
                                className="w-full text-left px-4 py-3 hover:bg-destructive/10 text-sm font-medium text-destructive border-t border-border transition-colors flex items-center gap-3"
                            >
                                <Clock size={14} />
                                Arquivar Lead
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-1 mb-5">
                <h4 className="font-semibold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors leading-tight">
                    {lead.clinicName}
                </h4>
                <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                    <span className="opacity-50">—</span> {lead.name}
                </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
                <a
                    href={`tel:${lead.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                    <Phone size={14} className="mr-2" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide">Ligar</span>
                </a>
                <a
                    href={`mailto:${lead.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/30 dark:hover:text-sky-400 transition-all border border-transparent hover:border-sky-200 dark:hover:border-sky-800"
                >
                    <Mail size={14} className="mr-2" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide">Email</span>
                </a>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-end">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Capturado em</p>
                    <p className="text-xs text-foreground font-medium">{leadDate.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-medium text-primary uppercase tracking-wide mb-0.5">Valor Estimado</p>
                    <p className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                        R$ {lead.estimatedValue.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
