
import React, { useState } from 'react';
import { Receivable, PaymentLink, SplitRule } from '../../types';
import { CreditCard, Link as LinkIcon, DollarSign, Calendar, CheckCircle, Copy, Plus, Trash2, TrendingUp, RefreshCw, Share2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

const mockReceivables: Receivable[] = [
    { id: 'r1', date: '2023-10-28', amount: 2500, origin: 'credit_card', installment: '1/1', status: 'scheduled', fees: 120 },
    { id: 'r2', date: '2023-10-29', amount: 890, origin: 'pix', status: 'paid', fees: 0 },
    { id: 'r3', date: '2023-11-15', amount: 1200, origin: 'credit_card', installment: '1/3', status: 'scheduled', fees: 60 },
    { id: 'r4', date: '2023-11-20', amount: 4500, origin: 'credit_card', installment: '1/10', status: 'scheduled', fees: 250 },
    { id: 'r5', date: '2023-12-15', amount: 1200, origin: 'credit_card', installment: '2/3', status: 'scheduled', fees: 60 },
];

const mockLinks: PaymentLink[] = [
    { id: 'lnk1', description: 'Sinal - Agendamento Botox', amount: 200.00, status: 'active', createdAt: '2023-10-27', url: 'https://diva.pay/l/xyz123', clientName: 'Fernanda Lima' },
    { id: 'lnk2', description: 'Promoção Laser Day', amount: 890.00, status: 'paid', createdAt: '2023-10-26', url: 'https://diva.pay/l/abc999', clientName: 'Ana Silva' },
];

const mockSplits: SplitRule[] = [
    { id: 'sp1', staffId: 's1', staffName: 'Dra. Julia', percentage: 30, serviceCategory: 'Injectables', active: true },
    { id: 'sp2', staffId: 's2', staffName: 'Est. Carla', percentage: 15, serviceCategory: 'Esthetics', active: true },
];

const PayModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'receivables' | 'links' | 'split'>('receivables');
    const [showAnticipationModal, setShowAnticipationModal] = useState(false);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // Prepare Chart Data (Group by Date)
    const chartData = mockReceivables.reduce((acc: any[], curr) => {
        const existing = acc.find(i => i.date === curr.date);
        if (existing) {
            existing.amount += curr.amount;
        } else {
            acc.push({ date: curr.date, amount: curr.amount, status: curr.status });
        }
        return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalReceivables = mockReceivables.filter(r => r.status === 'scheduled').reduce((acc, r) => acc + r.amount, 0);

    const [links, setLinks] = useState<PaymentLink[]>(mockLinks);
    const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
    const [newLinkData, setNewLinkData] = useState({ description: '', amount: '', clientName: '' });

    const handleCreateLink = () => {
        if (!newLinkData.description || !newLinkData.amount) return;

        const newLink: PaymentLink = {
            id: `lnk_${Date.now()}`,
            description: newLinkData.description,
            amount: parseFloat(newLinkData.amount),
            status: 'active',
            createdAt: new Date().toISOString(),
            url: `https://diva.pay/l/${Math.random().toString(36).substring(7)}`,
            clientName: newLinkData.clientName || 'Cliente Avulso'
        };

        setLinks([newLink, ...links]);
        setIsCreateLinkModalOpen(false);
        setNewLinkData({ description: '', amount: '', clientName: '' });
        alert(`Link criado com sucesso!\nURL: ${newLink.url}`);
    };

    const handleShareLink = (link: PaymentLink) => {
        const text = `Olá ${link.clientName}! Segue o link para pagamento de *${link.description}* no valor de *${formatCurrency(link.amount)}*: ${link.url}`;
        navigator.clipboard.writeText(text);
        alert('Link copiado para a área de transferência! Pronto para colar no WhatsApp.');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-diva-dark to-diva-primary text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center shrink-0">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                        <CreditCard size={32} className="text-diva-accent" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold">Diva Pay</h1>
                        <p className="text-sm opacity-80">Soluções Financeiras Integradas</p>
                    </div>
                </div>
                <div className="flex gap-4 text-right">
                    <div>
                        <p className="text-xs uppercase font-bold opacity-70">Saldo Disponível</p>
                        <p className="text-2xl font-bold">R$ 12.450,00</p>
                    </div>
                    <div className="border-l border-white/20 pl-4">
                        <p className="text-xs uppercase font-bold opacity-70">A Receber (Futuro)</p>
                        <p className="text-2xl font-bold text-diva-accent">{formatCurrency(totalReceivables)}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">

                {/* Tabs */}
                <div className="border-b border-diva-light/20 px-6 pt-4 flex space-x-6">
                    <button
                        onClick={() => setActiveTab('receivables')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'receivables' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                    >
                        <Calendar size={16} className="mr-2" /> Agenda de Recebíveis
                    </button>
                    <button
                        onClick={() => setActiveTab('links')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'links' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                    >
                        <LinkIcon size={16} className="mr-2" /> Links de Pagamento
                    </button>
                    <button
                        onClick={() => setActiveTab('split')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'split' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                    >
                        <TrendingUp size={16} className="mr-2" /> Split Automático
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

                    {/* TAB: RECEIVABLES */}
                    {activeTab === 'receivables' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Chart */}
                                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-diva-dark">Fluxo de Recebimento (30 Dias)</h3>
                                        <button
                                            onClick={() => setShowAnticipationModal(true)}
                                            className="text-xs bg-diva-accent text-white px-3 py-1.5 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center"
                                        >
                                            <TrendingUp size={12} className="mr-1" /> Antecipar Valores
                                        </button>
                                    </div>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                    tick={{ fontSize: 10 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <Tooltip
                                                    formatter={(val: number) => formatCurrency(val)}
                                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                                    cursor={{ fill: 'transparent' }}
                                                />
                                                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.status === 'paid' ? '#22c55e' : '#14808C'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-diva-light/10 border border-diva-light/30 rounded-xl p-6 flex flex-col gap-4">
                                    <h4 className="font-bold text-diva-dark text-sm">Resumo da Carteira</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Disponível Hoje</span>
                                            <span className="font-bold text-green-600">{formatCurrency(12450)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">A Receber (30d)</span>
                                            <span className="font-bold text-diva-dark">{formatCurrency(3500)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Parcelado (+30d)</span>
                                            <span className="font-bold text-gray-500">{formatCurrency(5800)}</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-diva-light/20">
                                        <p className="text-xs text-gray-500 mb-2">Taxa média de antecipação: <strong>1.99% a.m.</strong></p>
                                    </div>
                                </div>
                            </div>

                            {/* List */}
                            <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Data Prevista</th>
                                            <th className="px-6 py-4">Origem</th>
                                            <th className="px-6 py-4 text-center">Parcela</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Líquido</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {mockReceivables.map(rec => (
                                            <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-gray-600">{new Date(rec.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 capitalize flex items-center gap-2">
                                                    {rec.origin === 'credit_card' ? <CreditCard size={14} className="text-diva-primary" /> : <DollarSign size={14} className="text-green-600" />}
                                                    {rec.origin.replace('_', ' ')}
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-500">{rec.installment || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded
                                                    ${rec.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                            rec.status === 'anticipated' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                                                        {rec.status === 'paid' ? 'Pago' : rec.status === 'anticipated' ? 'Antecipado' : 'Agendado'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-diva-dark">
                                                    {formatCurrency(rec.amount - rec.fees)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: LINKS */}
                    {activeTab === 'links' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-diva-dark">Gerador de Links</h3>
                                    <p className="text-sm text-gray-500">Crie cobranças para enviar por WhatsApp ou Instagram.</p>
                                </div>
                                <button
                                    onClick={() => setIsCreateLinkModalOpen(true)}
                                    className="bg-diva-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark shadow-md transition-colors"
                                >
                                    <Plus size={18} className="mr-2" /> Novo Link
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {links.map(link => (
                                    <div key={link.id} className="bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                                            ${link.status === 'paid' ? 'bg-green-500' : 'bg-diva-primary'}`}>
                                                {link.status === 'paid' ? <CheckCircle size={24} /> : <LinkIcon size={24} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-diva-dark">{link.description}</h4>
                                                <p className="text-xs text-gray-500">Criado em: {new Date(link.createdAt).toLocaleDateString()} • Cliente: {link.clientName || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-diva-dark">{formatCurrency(link.amount)}</p>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded
                                                ${link.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        link.status === 'expired' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                                    {link.status === 'paid' ? 'Pago' : link.status === 'expired' ? 'Expirado' : 'Ativo'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleShareLink(link)}
                                                    className="p-2 text-gray-400 hover:text-diva-primary hover:bg-gray-100 rounded-lg" title="Copiar Link"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleShareLink(link)}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Enviar WhatsApp"
                                                >
                                                    <Share2 size={18} />
                                                </button>
                                                {link.status === 'active' && (
                                                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Cancelar">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: SPLIT */}
                    {activeTab === 'split' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                                <div className="bg-white p-2 rounded-full h-max text-blue-500 shadow-sm"><RefreshCw size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-blue-800 text-sm">Split de Pagamento Automático</h4>
                                    <p className="text-xs text-blue-700 mt-1">
                                        As regras abaixo dividem o valor da transação diretamente na adquirente. O profissional recebe a parte dele direto na conta bancária cadastrada, reduzindo sua carga tributária (bitributação).
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-bold text-diva-dark text-sm">Regras Ativas</h3>
                                    <button className="text-xs font-bold text-diva-primary hover:underline">+ Adicionar Regra</button>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {mockSplits.map(split => (
                                        <div key={split.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-diva-light/30 flex items-center justify-center font-bold text-diva-dark">
                                                    {split.staffName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-diva-dark">{split.staffName}</h4>
                                                    <p className="text-xs text-gray-500">Aplica em: <strong>{split.serviceCategory}</strong></p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <span className="text-xs text-gray-400 font-bold uppercase">Comissão Direta</span>
                                                    <p className="text-lg font-bold text-diva-primary">{split.percentage}%</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={split.active} readOnly className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-diva-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Anticipation Modal (Mock) */}
            {showAnticipationModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-diva-dark mb-4">Antecipar Recebíveis</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Você tem <strong>R$ 5.800,00</strong> disponíveis para antecipação.
                            <br />Taxa aplicada: <strong>1.99%</strong>.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Valor Bruto</span>
                                <span className="font-bold">{formatCurrency(5800)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2 text-red-500">
                                <span>Taxa (1.99%)</span>
                                <span>- {formatCurrency(115.42)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 text-diva-dark">
                                <span>A Receber Hoje</span>
                                <span>{formatCurrency(5684.58)}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowAnticipationModal(false)} className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-50">Cancelar</button>
                            <button onClick={() => { setShowAnticipationModal(false); alert('Solicitação enviada!'); }} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Link Modal */}
            {isCreateLinkModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-diva-dark mb-4">Novo Link de Pagamento</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                                <input
                                    type="text"
                                    value={newLinkData.description}
                                    onChange={(e) => setNewLinkData({ ...newLinkData, description: e.target.value })}
                                    placeholder="Ex: Pacote Laser 10 Sessões"
                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$)</label>
                                <input
                                    type="number"
                                    value={newLinkData.amount}
                                    onChange={(e) => setNewLinkData({ ...newLinkData, amount: e.target.value })}
                                    placeholder="0,00"
                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Cliente (Opcional)</label>
                                <input
                                    type="text"
                                    value={newLinkData.clientName}
                                    onChange={(e) => setNewLinkData({ ...newLinkData, clientName: e.target.value })}
                                    placeholder="Nome do cliente"
                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsCreateLinkModalOpen(false)} className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-50">Cancelar</button>
                            <button onClick={handleCreateLink} className="flex-1 py-3 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark shadow-md">Gerar Link</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayModule;
