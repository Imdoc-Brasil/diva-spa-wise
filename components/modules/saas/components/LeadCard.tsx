import React from 'react';
import { SaaSLead, SaaSLeadStage } from '@/types';
import { MoreHorizontal, Phone, Mail } from 'lucide-react';
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
    onConvert,
    onArchive,
    onClose
}: LeadCardProps) {
    return (
        <div
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
            className="bg-slate-800 border border-white/5 p-4 rounded-xl hover:border-yellow-500/50 transition-colors group cursor-pointer relative shadow-lg active:cursor-grabbing hover:scale-[1.02] transform duration-200"
        >
            <div className="flex justify-between items-start mb-3">
                <PlanBadge plan={lead.planInterest} />
                <button
                    onClick={onToggleActionMenu}
                    className={`transition-colors ${isActionMenuOpen ? 'text-white' : 'text-slate-600 hover:text-white'}`}
                >
                    <MoreHorizontal size={16} />
                </button>

                {/* Kanban Card Action Menu */}
                {isActionMenuOpen && (
                    <div className="absolute right-2 top-8 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                        <button
                            onClick={onViewDetails}
                            className="w-full text-left px-4 py-3 hover:bg-slate-700 text-xs text-slate-200 block"
                        >
                            Ver Detalhes
                        </button>

                        <button
                            onClick={onArchive}
                            className="w-full text-left px-4 py-3 hover:bg-red-900/50 text-xs text-red-400 border-t border-white/5 block"
                        >
                            Arquivar Lead
                        </button>
                    </div>
                )}
            </div>

            <h4 className="font-bold text-white text-lg leading-tight mb-1">{lead.clinicName}</h4>
            <p className="text-sm text-slate-400 mb-4">{lead.name}</p>

            <div className="flex items-center gap-3 mb-4">
                <a
                    href={`tel:${lead.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-green-500/20 hover:text-green-400 transition-colors"
                >
                    <Phone size={14} />
                </a>
                <a
                    href={`mailto:${lead.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                >
                    <Mail size={14} />
                </a>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                    R$ {lead.estimatedValue}
                </span>
            </div>
        </div>
    );
}
