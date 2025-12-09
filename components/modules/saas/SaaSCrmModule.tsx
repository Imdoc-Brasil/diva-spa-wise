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

    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [viewLead, setViewLead] = useState<SaaSLead | null>(null);
    const [closingLead, setClosingLead] = useState<SaaSLead | null>(null);

    const [closingData, setClosingData] = useState({
        plan: SaaSPlan.GROWTH,
        paymentMethod: 'credit_card' as 'credit_card' | 'boleto' | 'pix',
        recurrence: 'monthly' as 'monthly' | 'annual'
    });

    const handleConfirmClose = () => {
        if (!closingLead) return;

        updateSaaSLead(closingLead.id, {
            stage: SaaSLeadStage.CLOSED_WON,
            planInterest: closingData.plan,
            paymentMethod: closingData.paymentMethod,
            recurrence: closingData.recurrence,
            trialStartDate: new Date().toISOString()
        });

        addToast(
            'Venda Confirmada! 🎉 Email de boas-vindas e link de pagamento enviados. Trial de 30 dias iniciado.',
            'success'
        );

        setClosingLead(null);
        setViewLead(null);
    };

    const [showNewLeadModal, setShowNewLeadModal] = useState(false);
    const [newLeadData, setNewLeadData] = useState<Partial<SaaSLead>>({
        name: '',
        clinicName: '',
        email: '',
        phone: '',
        planInterest: SaaSPlan.GROWTH,
        stage: SaaSLeadStage.NEW,
        estimatedValue: 0,
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
    });

    const handleCreateLead = () => {
        if (!newLeadData.name || !newLeadData.clinicName || !newLeadData.email || !newLeadData.phone) {
            addToast('Preencha Nome, Clínica, Email e Telefone.', 'error');
            return;
        }

        addSaaSLead({
            id: `temp_${Date.now()}`,
            name: newLeadData.name,
            clinicName: newLeadData.clinicName,
            legalName: newLeadData.legalName,
            email: newLeadData.email,
            phone: newLeadData.phone,
            planInterest: newLeadData.planInterest as SaaSPlan,
            stage: SaaSLeadStage.NEW,
            source: 'outbound',
            status: 'active',
            notes: '',
            cnpj: newLeadData.cnpj,
            address: newLeadData.address,
            number: newLeadData.number,
            complement: newLeadData.complement,
            neighborhood: newLeadData.neighborhood,
            city: newLeadData.city,
            state: newLeadData.state,
            estimatedValue: newLeadData.estimatedValue || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        setShowNewLeadModal(false);
        setNewLeadData({
            name: '', clinicName: '', legalName: '', email: '', phone: '',
            planInterest: SaaSPlan.GROWTH, estimatedValue: 0, cnpj: '',
            address: '', number: '', complement: '', neighborhood: '', city: '', state: ''
        });
    };

    return (
        <div className="h-full flex flex-col relative">
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
                    <button
                        onClick={() => setShowNewLeadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors"
                    >
                        <Plus size={20} /> Novo Lead
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-max">
                    {columns.map(col => (
                        <div key={col.id} className="w-80 flex flex-col shrink-0">
                            <div
                                className={`flex justify-between items-center mb-4 px-1 py-2 border-b-2 ${col.color}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedLeadId) {
                                        handleMove(draggedLeadId, col.id);
                                        setDraggedLeadId(null);
                                    }
                                }}
                            >
                                <h3 className="font-bold text-slate-200 uppercase tracking-wide text-sm">{col.title}</h3>
                                <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                                    {filteredLeads.filter(l => l.stage === col.id).length}
                                </span>
                            </div>

                            <div
                                className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedLeadId) {
                                        handleMove(draggedLeadId, col.id);
                                        setDraggedLeadId(null);
                                    }
                                }}
                            >
                                {filteredLeads.filter(l => l.stage === col.id).map(lead => (
                                    <div
                                        key={lead.id}
                                        draggable
                                        onDragStart={(e) => setDraggedLeadId(lead.id)}
                                        onClick={() => setViewLead(lead)}
                                        className="bg-slate-800 border border-white/5 p-4 rounded-xl hover:border-yellow-500/50 transition-colors group cursor-pointer relative shadow-lg active:cursor-grabbing hover:scale-[1.02] transform duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            {getPlanBadge(lead.planInterest)}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); }}
                                                className="text-slate-600 hover:text-white transition-colors"
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
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

                                        {/* Quick Actions overlay on hover */}
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

            {/* NEW LEAD MODAL */}
            {showNewLeadModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button
                            onClick={() => setShowNewLeadModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <XCircle size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6">Novo Lead</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome do Contato</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                    value={newLeadData.name}
                                    onChange={e => setNewLeadData({ ...newLeadData, name: e.target.value })}
                                    placeholder="Ex: Dra. Ana"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome da Clínica</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                    value={newLeadData.clinicName}
                                    onChange={e => setNewLeadData({ ...newLeadData, clinicName: e.target.value })}
                                    placeholder="Ex: Clínica Real"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Razão Social (Opcional)</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                    value={newLeadData.legalName || ''}
                                    onChange={e => setNewLeadData({ ...newLeadData, legalName: e.target.value })}
                                    placeholder="Ex: Irecê Atividades Médicas LTDA"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.email}
                                        onChange={e => setNewLeadData({ ...newLeadData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Telefone</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.phone}
                                        onChange={e => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">CNPJ (Opcional)</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.cnpj || ''}
                                        onChange={e => setNewLeadData({ ...newLeadData, cnpj: e.target.value })}
                                        placeholder="00.000.000/0000-00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Logradouro / Rua</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.address || ''}
                                        onChange={e => setNewLeadData({ ...newLeadData, address: e.target.value })}
                                        placeholder="Av. Paulista"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Número</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.number || ''}
                                        onChange={e => setNewLeadData({ ...newLeadData, number: e.target.value })}
                                        placeholder="1234"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Complemento</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.complement || ''}
                                        onChange={e => setNewLeadData({ ...newLeadData, complement: e.target.value })}
                                        placeholder="Sala 101"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bairro</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.neighborhood || ''}
                                        onChange={e => setNewLeadData({ ...newLeadData, neighborhood: e.target.value })}
                                        placeholder="Centro"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cidade</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.city || ''}
                                        onChange={e => setNewLeadData({ ...newLeadData, city: e.target.value })}
                                        placeholder="São Paulo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Estado</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.state || ''}
                                        onChange={e => setNewLeadData({ ...newLeadData, state: e.target.value })}
                                        placeholder="SP"
                                        maxLength={2}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Plano de Interesse</label>
                                    <select
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none appearance-none"
                                        value={newLeadData.planInterest}
                                        onChange={e => setNewLeadData({ ...newLeadData, planInterest: e.target.value as SaaSPlan })}
                                    >
                                        <option value={SaaSPlan.START}>Start</option>
                                        <option value={SaaSPlan.GROWTH}>Growth</option>
                                        <option value={SaaSPlan.EMPIRE}>Empire</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor Estimado (R$)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
                                        value={newLeadData.estimatedValue}
                                        onChange={e => setNewLeadData({ ...newLeadData, estimatedValue: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreateLead}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg mt-4 transition-colors"
                            >
                                Criar Lead
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* VIEW / EDIT LEAD MODAL */}
            {viewLead && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setViewLead(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <XCircle size={24} />
                        </button>

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">{viewLead.clinicName}</h3>
                                <p className="text-slate-400 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${viewLead.stage === SaaSLeadStage.CLOSED_WON ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    {viewLead.name}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Valor Estimado</p>
                                <p className="text-xl font-bold text-emerald-400">R$ {viewLead.estimatedValue}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <h4 className="font-bold text-white border-b border-white/10 pb-2 mb-4">Contato</h4>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Phone size={18} className="text-slate-500" /> {viewLead.phone}
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Mail size={18} className="text-slate-500" /> {viewLead.email}
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <DollarSign size={18} className="text-slate-500" /> Plano: <span className="capitalize text-yellow-500 font-bold">{viewLead.planInterest}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-white border-b border-white/10 pb-2 mb-4">Endereço & Legal</h4>
                                {viewLead.legalName && (
                                    <div className="text-sm">
                                        <p className="text-xs text-slate-500 uppercase">Razão Social</p>
                                        <p className="text-slate-300">{viewLead.legalName}</p>
                                    </div>
                                )}
                                {viewLead.cnpj && (
                                    <div className="text-sm">
                                        <p className="text-xs text-slate-500 uppercase">CNPJ</p>
                                        <p className="text-slate-300">{viewLead.cnpj}</p>
                                    </div>
                                )}
                                {viewLead.address && (
                                    <div className="text-sm">
                                        <p className="text-xs text-slate-500 uppercase">Endereço</p>
                                        <p className="text-slate-300">
                                            {viewLead.address}, {viewLead.number} {viewLead.complement && `- ${viewLead.complement}`}<br />
                                            {viewLead.neighborhood} - {viewLead.city}/{viewLead.state}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
                            {viewLead.stage !== SaaSLeadStage.CLOSED_WON && (
                                <button
                                    onClick={() => {
                                        setClosingLead(viewLead);
                                        setClosingData({
                                            plan: viewLead.planInterest,
                                            paymentMethod: 'credit_card',
                                            recurrence: 'monthly'
                                        });
                                        // Keep viewLead open underneath or close it? Let's keep it but maybe we should close it to avoid clutter
                                        // For better UX, let's close viewLead when opening closingLead
                                        setViewLead(null);
                                    }}
                                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                                >
                                    Marcar como Fechado (Assinante)
                                </button>
                            )}
                            {viewLead.stage === SaaSLeadStage.CLOSED_WON && (
                                <span className="text-green-500 font-bold flex items-center gap-2">
                                    <CheckCircle size={20} /> Venda Já Realizada
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {closingLead && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative">
                        <button
                            onClick={() => setClosingLead(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <XCircle size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Fechar Venda</h3>
                            <p className="text-slate-400">Configure os detalhes da assinatura para <strong>{closingLead.clinicName}</strong>.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Plano Escolhido</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[SaaSPlan.START, SaaSPlan.GROWTH, SaaSPlan.EMPIRE].map((plan) => (
                                        <button
                                            key={plan}
                                            onClick={() => setClosingData({ ...closingData, plan })}
                                            className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${closingData.plan === plan
                                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                                : 'bg-slate-800 border-white/10 text-slate-400 hover:border-emerald-500/50'
                                                }`}
                                        >
                                            {plan.toUpperCase()}
                                        </button>
                                    ))}
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
                                            className={`p-3 rounded-lg border text-left transition-all ${closingData.recurrence === 'monthly'
                                                ? 'bg-slate-700 border-white text-white'
                                                : 'bg-slate-800 border-white/10 text-slate-400'
                                                }`}
                                        >
                                            <span className="block font-bold">Mensal</span>
                                            <span className="text-xs opacity-70">Sem desconto</span>
                                        </button>
                                        <button
                                            onClick={() => setClosingData({ ...closingData, recurrence: 'annual' })}
                                            className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden ${closingData.recurrence === 'annual'
                                                ? 'bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-400 text-white'
                                                : 'bg-slate-800 border-white/10 text-slate-400'
                                                }`}
                                        >
                                            <span className="block font-bold">Anual</span>
                                            <span className="text-xs opacity-90 text-yellow-200">Com Desconto 🎉</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleConfirmClose}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-emerald-500/20 transition-all mt-4"
                            >
                                Confirmar Venda e Enviar Acesso
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaaSCrmModule;
