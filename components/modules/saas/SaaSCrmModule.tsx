import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { SaaSLead, SaaSLeadStage, SaaSPlan } from '../../../types';
import {
    Search, Filter, Plus, MoreHorizontal, Phone, Mail,
    Calendar, CheckCircle, XCircle, DollarSign
} from 'lucide-react';
import { useToast } from '../../ui/ToastContext';

const SaaSCrmModule: React.FC = () => {
    const { saasLeads, updateSaaSLead, addSaaSLead } = useData();
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { id: SaaSLeadStage.NEW, title: 'Novos Leads', color: 'border-blue-500' },
        { id: SaaSLeadStage.QUALIFIED, title: 'Qualificados', color: 'border-yellow-500' },
        { id: SaaSLeadStage.DEMO_SCHEDULED, title: 'Demo Agendada', color: 'border-purple-500' },
        { id: SaaSLeadStage.TRIAL_STARTED, title: 'Em Trial (14 Dias)', color: 'border-pink-500' },
        { id: SaaSLeadStage.CLOSED_WON, title: 'Assinantes', color: 'border-green-500' },
    ];

    const filteredLeads = useMemo(() => {
        return saasLeads?.filter(l =>
            l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.clinicName.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
    }, [saasLeads, searchTerm]);

    const handleMove = (id: string, newStage: SaaSLeadStage) => {
        updateSaaSLead(id, { stage: newStage });
        addToast(`Lead movido para ${newStage}`, 'success');
    };

    const getPlanBadge = (plan: SaaSPlan) => {
        switch (plan) {
            case SaaSPlan.START: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 uppercase">Start</span>;
            case SaaSPlan.GROWTH: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/50 text-purple-300 border border-purple-500/30 uppercase">Growth</span>;
            case SaaSPlan.EMPIRE: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-900/50 text-yellow-300 border border-yellow-500/30 uppercase">Empire</span>;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Pipeline de Vendas</h2>
                    <p className="text-slate-400">Gerencie a aquisição de novas clínicas.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-yellow-500 outline-none w-64 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors">
                        <Plus size={20} /> Novo Lead
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-max">
                    {columns.map(col => (
                        <div key={col.id} className="w-80 flex flex-col shrink-0">
                            <div className={`flex justify-between items-center mb-4 px-1 py-2 border-b-2 ${col.color}`}>
                                <h3 className="font-bold text-slate-200 uppercase tracking-wide text-sm">{col.title}</h3>
                                <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                                    {filteredLeads.filter(l => l.stage === col.id).length}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                                {filteredLeads.filter(l => l.stage === col.id).map(lead => (
                                    <div key={lead.id} className="bg-slate-800 border border-white/5 p-4 rounded-xl hover:border-yellow-500/50 transition-colors group cursor-pointer relative shadow-lg">
                                        <div className="flex justify-between items-start mb-3">
                                            {getPlanBadge(lead.planInterest)}
                                            <button className="text-slate-600 hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
                                        </div>

                                        <h4 className="font-bold text-white text-lg leading-tight mb-1">{lead.clinicName}</h4>
                                        <p className="text-sm text-slate-400 mb-4">{lead.name}</p>

                                        <div className="flex items-center gap-3 mb-4">
                                            <a href={`tel:${lead.phone}`} className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-green-500/20 hover:text-green-400 transition-colors">
                                                <Phone size={14} />
                                            </a>
                                            <a href={`mailto:${lead.email}`} className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                                                <Mail size={14} />
                                            </a>
                                        </div>

                                        <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
                                            <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1 font-bold text-emerald-400">
                                                R$ {lead.estimatedValue}
                                            </span>
                                        </div>

                                        {/* Quick Actions overlay on hover (Optional, simplified to discrete buttons for now) */}
                                        <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-slate-900 via-slate-900 to-transparent flex justify-center gap-2">
                                            {lead.stage !== SaaSLeadStage.CLOSED_WON && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleMove(lead.id, SaaSLeadStage.CLOSED_WON); }}
                                                    className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded shadow-lg hover:bg-green-500"
                                                >
                                                    Fechar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {filteredLeads.filter(l => l.stage === col.id).length === 0 && (
                                    <div className="h-32 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-700 text-sm italic">
                                        Vazio
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SaaSCrmModule;
