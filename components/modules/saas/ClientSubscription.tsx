
import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { CheckCircle, AlertCircle, Clock, FileText, CreditCard, ChevronRight, Star } from 'lucide-react';
import { SAAS_PLANS_CONFIG } from './saasPlans';
import { SaaSPlan } from '@/types';

import { asaasService } from '../../../services/asaasService';

// Mock Invoice Type
interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    pdfUrl: string;
}

const ClientSubscription: React.FC = () => {
    const { organization } = useOrganization();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (organization?.asaasCustomerId) {
                setIsLoading(true);
                try {
                    const response = await asaasService.listPayments(organization.asaasCustomerId);
                    // Map Asaas Data
                    const mapped: Invoice[] = (response.data || []).map((p: any) => ({
                        id: p.id,
                        date: p.dateCreated, // ou p.dueDate
                        amount: p.value,
                        status: (p.status === 'RECEIVED' || p.status === 'CONFIRMED' || p.status === 'PAID') ? 'paid'
                            : (p.status === 'OVERDUE') ? 'overdue'
                                : 'pending',
                        pdfUrl: p.invoiceUrl || p.bankSlipUrl || '#'
                    }));
                    setInvoices(mapped);
                } catch (error) {
                    console.error('Error fetching Asaas payments:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Mock data Fallback
                const mockInvoices: Invoice[] = [
                    { id: 'inv_01', date: new Date().toISOString(), amount: 199.90, status: 'pending', pdfUrl: '#' },
                    { id: 'inv_02', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), amount: 199.90, status: 'paid', pdfUrl: '#' },
                    { id: 'inv_03', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), amount: 199.90, status: 'paid', pdfUrl: '#' },
                ];
                setInvoices(mockInvoices);
            }
        };

        fetchInvoices();
    }, [organization?.asaasCustomerId]);

    const currentPlan = SAAS_PLANS_CONFIG[organization?.subscriptionPlanId as SaaSPlan] || SAAS_PLANS_CONFIG[SaaSPlan.GROWTH];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Pago';
            case 'pending': return 'Aguardando';
            case 'overdue': return 'Atrasado';
            default: return status;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* HER0 CARD */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase border border-purple-500/30">
                                {organization?.subscriptionStatus === 'active' ? 'Assinatura Ativa' : 'Inativo'}
                            </span>
                            <span className="text-slate-400 text-sm">Renova em {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </div>
                        <h2 className="text-4xl font-serif font-bold mb-2">{currentPlan.name}</h2>
                        <p className="text-slate-300 max-w-lg">
                            Você tem acesso a todos os recursos essenciais. Para desbloquear IA ilimitada e Múltiplas Unidades, considere o plano Empire.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                            <Star size={18} className="text-yellow-500 fill-yellow-500" />
                            Fazer Upgrade
                        </button>
                        <button className="bg-slate-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-600 transition-colors border border-slate-600">
                            Gerenciar Cartão
                        </button>
                    </div>
                </div>

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Usage Stats (Detailed) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                            <FileText size={20} className="text-slate-400" /> Histórico de Faturas
                        </h3>

                        <div className="overflow-hidden rounded-lg border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Data</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Valor</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Fatura</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invoices.map(inv => (
                                        <tr key={inv.id} className="hover:bg-gray-50/50">
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(inv.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 font-bold text-slate-800">
                                                R$ {inv.amount.toFixed(2).replace('.', ',')}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(inv.status)}`}>
                                                    {getStatusLabel(inv.status)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <a href={inv.pdfUrl} className="text-blue-600 hover:underline text-sm font-medium flex items-center justify-end gap-1">
                                                    Download <ChevronRight size={14} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Secure Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-slate-400" /> Método de Pagamento
                        </h3>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                            <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center">
                                <span className="text-[8px] text-white font-bold tracking-widest">VISA</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">•••• •••• •••• 4242</p>
                                <p className="text-xs text-gray-500">Expira em 12/28</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Seu pagamento é processado de forma segura pelo Asaas.</p>
                        <button className="text-sm text-blue-600 font-bold hover:underline">Alterar método de pagamento</button>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            Precisa de ajuda com a fatura?
                        </h3>
                        <p className="text-sm text-blue-700 mb-4">
                            Nossa equipe financeira pode te ajudar a entender suas cobranças ou alterar dados cadastrais.
                        </p>
                        <button className="w-full bg-white text-blue-600 border border-blue-200 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
                            Falar com Suporte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientSubscription;
