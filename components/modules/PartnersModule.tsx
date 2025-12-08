import React, { useState, useMemo } from 'react';
import { Partner, PartnerType, Transaction } from '../../types';
import { Users, Link as LinkIcon, DollarSign, Award, TrendingUp, Instagram, Building, User, Plus, Copy, Edit, Search, CheckCircle, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import NewPartnerModal from '../modals/NewPartnerModal';
import PartnerContractModal from '../modals/PartnerContractModal';
import { useToast } from '../ui/ToastContext';
import { useData } from '../context/DataContext';

const PartnersModule: React.FC = () => {
    const { partners, addPartner, updatePartner, leads, clients, appointments, addTransaction } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const { addToast } = useToast();

    // Calculate real metrics for each partner based on leads and clients
    const partnersWithMetrics = useMemo(() => {
        return partners.map(partner => {
            // Find all leads referred by this partner code
            const referredLeads = leads.filter(lead =>
                lead.referrerName?.toLowerCase() === partner.code.toLowerCase() ||
                lead.notes?.toLowerCase().includes(partner.code.toLowerCase())
            );

            // Find all clients referred by this partner
            const referredClients = clients.filter(client =>
                client.referredBy?.toLowerCase() === partner.code.toLowerCase()
            );

            // Calculate total revenue from referred clients
            const totalRevenue = referredClients.reduce((sum, client) => {
                // Sum appointments for this client
                const clientRevenue = appointments
                    .filter(apt => apt.clientId === client.clientId && apt.status === 'Completed')
                    .reduce((aSum, apt) => aSum + apt.price, 0);
                return sum + clientRevenue;
            }, 0);

            const totalReferred = referredLeads.length + referredClients.length;
            const pendingPayout = Math.max(0, (totalRevenue * (partner.commissionRate / 100)) - (partner.totalPaid || 0));

            return {
                ...partner,
                totalReferred,
                totalRevenue,
                pendingPayout
            };
        });
    }, [partners, leads, clients, appointments]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const getPartnerIcon = (type: PartnerType) => {
        switch (type) {
            case 'influencer': return <Instagram size={20} className="text-pink-600" />;
            case 'business': return <Building size={20} className="text-blue-600" />;
            default: return <User size={20} className="text-green-600" />;
        }
    };

    const handlePayout = (id: string) => {
        const partner = partnersWithMetrics.find(p => p.id === id);
        if (!partner || partner.pendingPayout <= 0) return;

        if (confirm(`Confirmar pagamento de ${formatCurrency(partner.pendingPayout)} para ${partner.name} via PIX?`)) {
            const transaction: Transaction = {
                id: `tx_payout_${Date.now()}`,
                organizationId: 'org_default',
                description: `Comissão Parceiro: ${partner.name}`,
                amount: partner.pendingPayout,
                type: 'expense',
                category: 'Comissões',
                date: new Date().toISOString(),
                status: 'paid',
                paymentMethod: 'pix'
            };
            addTransaction(transaction);
            updatePartner(partner.id, { totalPaid: (partner.totalPaid || 0) + partner.pendingPayout });
            addToast("Pagamento registrado com sucesso!", 'success');
        }
    };

    const handleBatchPayout = () => {
        const totalPending = partnersWithMetrics.reduce((acc, p) => acc + p.pendingPayout, 0);
        if (totalPending === 0) {
            addToast("Não há comissões pendentes para pagar.", 'info');
            return;
        }

        if (confirm(`Confirmar pagamento em lote de ${formatCurrency(totalPending)} para todos os parceiros?`)) {
            partnersWithMetrics.forEach(partner => {
                if (partner.pendingPayout > 0) {
                    const transaction: Transaction = {
                        id: `tx_payout_${Date.now()}_${partner.id}`,
                        organizationId: 'org_default',
                        description: `Comissão Parceiro: ${partner.name}`,
                        amount: partner.pendingPayout,
                        type: 'expense',
                        category: 'Comissões',
                        date: new Date().toISOString(),
                        status: 'paid',
                        paymentMethod: 'pix'
                    };
                    addTransaction(transaction);
                    updatePartner(partner.id, { totalPaid: (partner.totalPaid || 0) + partner.pendingPayout });
                }
            });
            addToast("Pagamentos em lote processados!", 'success');
        }
    };

    const handleSavePartner = (partner: Partner) => {
        if (editingPartner) {
            updatePartner(partner.id, partner);
            addToast('Parceiro atualizado com sucesso!', 'success');
        } else {
            addPartner(partner);
            addToast('Novo parceiro cadastrado!', 'success');
        }
        setIsModalOpen(false);
        setEditingPartner(null);
    };

    const openNewModal = () => {
        setEditingPartner(null);
        setIsModalOpen(true);
    };

    const openEditModal = (partner: Partner) => {
        setEditingPartner(partner);
        setIsModalOpen(true);
    };

    const handleGenerateContract = (partner: Partner) => {
        setEditingPartner(partner);
        setIsContractModalOpen(true);
    };

    const filteredPartners = partnersWithMetrics.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Prepare chart data
    const referralData = partnersWithMetrics
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5)
        .map(p => ({ name: p.name.split(' ')[0], sales: p.totalRevenue }));

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Award size={20} className="text-yellow-300" />
                            <p className="text-xs uppercase font-bold opacity-80">Vendas por Indicação</p>
                        </div>
                        <h3 className="text-3xl font-mono font-bold">{formatCurrency(partners.reduce((acc, p) => acc + p.totalRevenue, 0))}</h3>
                        <p className="text-xs mt-2 bg-white/20 w-max px-2 py-1 rounded">ROI: 8.5x (Custo Comissão)</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-20 transform translate-y-4">
                        <TrendingUp size={100} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Novos Clientes (Referral)</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-3xl font-bold text-diva-dark">{partners.reduce((acc, p) => acc + p.totalReferred, 0)}</h3>
                            <span className="text-xs text-green-600 font-bold mb-1 flex items-center">
                                +15% este mês
                            </span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4">
                        <div className="bg-diva-primary h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Comissões Pendentes</p>
                        <h3 className="text-3xl font-bold text-diva-alert">{formatCurrency(partners.reduce((acc, p) => acc + p.pendingPayout, 0))}</h3>
                        <p className="text-xs text-gray-400 mt-2">Próximo pagamento: 30/Out</p>
                    </div>
                    <button
                        onClick={handleBatchPayout}
                        className="mt-2 text-xs font-bold text-diva-primary border border-diva-primary rounded py-1 hover:bg-diva-primary hover:text-white transition-colors"
                    >
                        Realizar Payout em Lote
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">

                {/* Partners List */}
                <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-diva-light/20 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-diva-dark text-lg">Parceiros & Afiliados</h3>
                            <p className="text-sm text-gray-500">Gerencie seus canais de aquisição indireta.</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Buscar parceiro..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none"
                                />
                            </div>
                            <button
                                onClick={openNewModal}
                                className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark transition-colors shadow-md"
                            >
                                <Plus size={16} className="mr-2" /> Novo Parceiro
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-4">
                            {filteredPartners.map(partner => (
                                <div key={partner.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative">
                                    <button
                                        onClick={() => openEditModal(partner)}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-diva-primary p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Edit size={16} />
                                    </button>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
                                                {getPartnerIcon(partner.type)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-diva-dark text-lg flex items-center gap-2">
                                                    {partner.name}
                                                    {partner.pendingPayout > 0 && <span className="w-2 h-2 bg-diva-alert rounded-full animate-pulse" title="Pagamento Pendente"></span>}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded font-mono font-bold text-gray-700 border border-gray-200">
                                                        {partner.code}
                                                    </span>
                                                    <span>{partner.contact}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right pr-8">
                                            <p className="text-xs text-gray-400 uppercase font-bold">Comissão</p>
                                            <p className="font-bold text-diva-primary text-lg">{partner.commissionRate}%</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Clientes</p>
                                            <p className="font-bold text-diva-dark">{partner.totalReferred}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Vendas</p>
                                            <p className="font-bold text-green-600">{formatCurrency(partner.totalRevenue)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">A Pagar</p>
                                            <p className={`font-bold ${partner.pendingPayout > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {formatCurrency(partner.pendingPayout)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex gap-2">
                                            <button
                                                className="text-xs font-bold text-gray-500 hover:text-diva-dark flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`https://divaspa.com.br/?ref=${partner.code}`);
                                                    addToast("Link copiado!", "success");
                                                }}
                                            >
                                                <LinkIcon size={14} className="mr-1" /> Copiar Link
                                            </button>

                                            <button
                                                className="text-xs font-bold text-gray-500 hover:text-diva-dark flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                                                onClick={() => handleGenerateContract(partner)}
                                            >
                                                <FileText size={14} className="mr-1" /> Contrato
                                            </button>
                                        </div>

                                        {partner.pendingPayout > 0 && (
                                            <button
                                                onClick={() => handlePayout(partner.id)}
                                                className="text-xs font-bold bg-green-50 text-green-700 border border-green-200 px-4 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex items-center"
                                            >
                                                <DollarSign size={14} className="mr-1" /> Pagar Comissão (PIX)
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Analytics Sidebar */}
                <div className="w-full lg:w-80 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex-1 flex flex-col">
                        <h3 className="font-bold text-diva-dark mb-6 text-sm">Top Parceiros (Receita)</h3>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={referralData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(val: number) => formatCurrency(val)} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="sales" barSize={20} radius={[0, 4, 4, 0]}>
                                        {referralData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#14808C' : '#BF784E'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 text-sm mb-2">Link de Indicação Geral</h3>
                        <p className="text-xs text-blue-700 mb-4">Envie este link para cadastro espontâneo de novos parceiros.</p>
                        <div className="bg-white p-2 rounded border border-blue-200 flex items-center justify-between">
                            <code className="text-xs text-gray-600 truncate">divaspa.com.br/parceiros</code>
                            <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                    navigator.clipboard.writeText("divaspa.com.br/parceiros");
                                    addToast("Link geral copiado!", "success");
                                }}
                            >
                                <Copy size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <NewPartnerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePartner}
                initialData={editingPartner}
            />

            {editingPartner && (
                <PartnerContractModal
                    isOpen={isContractModalOpen}
                    onClose={() => setIsContractModalOpen(false)}
                    partner={editingPartner}
                />
            )}
        </div>
    );
};

export default PartnersModule;
