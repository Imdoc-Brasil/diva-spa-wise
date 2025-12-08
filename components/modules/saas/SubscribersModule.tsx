import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SaaSPlan, SaaSSubscriber } from '../../../types';
import {
    Search, Filter, MoreVertical, Shield, AlertTriangle,
    CheckCircle, MessageSquare, CreditCard
} from 'lucide-react';
import { useToast } from '../../ui/ToastContext';

const SubscribersModule: React.FC = () => {
    const { saasSubscribers, updateSaaSSubscriber } = useData();
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSubs = saasSubscribers?.filter(s =>
        s.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.adminName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getPlanColor = (plan: SaaSPlan) => {
        switch (plan) {
            case SaaSPlan.START: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
            case SaaSPlan.GROWTH: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case SaaSPlan.EMPIRE: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-white';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="flex items-center gap-1 text-xs font-bold text-green-400"><CheckCircle size={12} /> Ativo</span>;
            case 'delinquent': return <span className="flex items-center gap-1 text-xs font-bold text-red-400"><AlertTriangle size={12} /> Inadimplente</span>;
            case 'trial': return <span className="flex items-center gap-1 text-xs font-bold text-blue-400"><CreditCard size={12} /> Trial</span>;
            default: return <span className="text-xs text-slate-500">{status}</span>;
        }
    };

    const toggleStatus = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'delinquent' : 'active';
        updateSaaSSubscriber(id, { status: newStatus as any });
        addToast(`Status alterado para ${newStatus}`, 'info');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Assinantes</h2>
                    <p className="text-slate-400">Gerenciamento de carteira e faturamento.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar clínica..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-yellow-500 outline-none w-64 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-300">
                        <Filter size={20} /> Filtros
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors">
                        Exportar CSV
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-xs font-bold uppercase text-slate-500 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">Clínica / Admin</th>
                            <th className="px-6 py-4">Plano</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">MRR</th>
                            <th className="px-6 py-4">Usuários</th>
                            <th className="px-6 py-4">Saldo SMS</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredSubs.map(sub => (
                            <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center font-bold text-slate-400">
                                            {sub.clinicName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{sub.clinicName}</p>
                                            <p className="text-xs text-slate-400">{sub.adminName} • {sub.adminEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${getPlanColor(sub.plan)}`}>
                                        {sub.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(sub.status)}
                                </td>
                                <td className="px-6 py-4 font-mono text-white">
                                    R$ {sub.mrr},00
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm">
                                    {sub.usersCount}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <MessageSquare size={14} /> {sub.smsBalance}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => toggleStatus(sub.id, sub.status)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white" title="Bloquear/Desbloquear"
                                        >
                                            <Shield size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSubs.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        Nenhum assinante encontrado.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscribersModule;
