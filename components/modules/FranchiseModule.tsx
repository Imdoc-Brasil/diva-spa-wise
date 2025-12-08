import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';
import {
    Building2, MapPin, ArrowRightLeft,
    TrendingUp, Users, Plus, Truck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import NewUnitModal from '../modals/NewUnitModal'; // Keeping the import if it exists

const FranchiseModule: React.FC = () => {
    const { units, products, updateProductStock, transactions } = useData();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'inventory'>('overview');
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

    // Stats Calculation
    const totalRevenue = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const revenueByUnitData = units.map(unit => {
        const unitRevenue = transactions
            .filter(t => (t.unitId === unit.id || t.organizationId === unit.organizationId /** fallback */) && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            name: unit.name,
            revenue: unitRevenue > 0 ? unitRevenue : Math.floor(Math.random() * 50000) + 10000 // Mock if empty
        };
    });

    // --- INVENTORY TRANSFER LOGIC ---
    const [transferData, setTransferData] = useState({
        productId: '',
        sourceUnitId: '',
        destUnitId: '',
        quantity: 1
    });

    const handleTransfer = () => {
        if (!transferData.productId || !transferData.sourceUnitId || !transferData.destUnitId) {
            addToast('Selecione o produto e as unidades de origem/destino.', 'error');
            return;
        }

        if (transferData.sourceUnitId === transferData.destUnitId) {
            addToast('A unidade de origem e destino devem ser diferentes.', 'error');
            return;
        }

        const product = products.find(p => p.id === transferData.productId);
        if (!product) return;

        const currentSourceStock = product.stockByUnit?.[transferData.sourceUnitId] || 0;

        if (currentSourceStock < transferData.quantity) {
            addToast(`Estoque insuficiente na origem. Disponível: ${currentSourceStock}`, 'error');
            return;
        }

        // Execute Transfer
        updateProductStock(product.id, transferData.quantity, 'remove', transferData.sourceUnitId);
        updateProductStock(product.id, transferData.quantity, 'add', transferData.destUnitId);

        addToast('Transferência realizada com sucesso!', 'success');
        setTransferData({ ...transferData, quantity: 1 }); // Reset qty
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Grupo Empresarial</h1>
                    <p className="text-slate-500">Gestão Centralizada de Franquias e Unidades</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsUnitModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-diva-accent text-white rounded-lg hover:bg-diva-accent/90 transition-colors shadow-lg shadow-diva-accent/20"
                    >
                        <Plus size={18} /> Nova Unidade
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-200 flex gap-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-diva-accent' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} /> Visão Geral
                    </div>
                    {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-diva-accent"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('units')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'units' ? 'text-diva-accent' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <div className="flex items-center gap-2">
                        <Building2 size={18} /> Unidades
                    </div>
                    {activeTab === 'units' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-diva-accent"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'inventory' ? 'text-diva-accent' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <div className="flex items-center gap-2">
                        <ArrowRightLeft size={18} /> Estoque Inter-unidades
                    </div>
                    {activeTab === 'inventory' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-diva-accent"></div>}
                </button>
            </div>

            {/* Content: Overview */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-diva-light/20 rounded-lg text-diva-primary">
                                    <Building2 size={24} />
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Operando</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800">{units.length}</h3>
                            <p className="text-slate-500 text-sm">Unidades da Rede</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                    <Users size={24} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800">2.4k</h3>
                            <p className="text-slate-500 text-sm">Base Total de Clientes</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800">
                                {totalRevenue > 0 ? totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 145k'}
                            </h3>
                            <p className="text-slate-500 text-sm">Faturamento Global (Mês)</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                                    <Truck size={24} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800">4</h3>
                            <p className="text-slate-500 text-sm">Transferências Hoje</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-6">Performance por Unidade</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueByUnitData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(v) => `R$${v / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="revenue" fill="#14808C" radius={[4, 4, 0, 0]} name="Faturamento" barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Content: Units */}
            {activeTab === 'units' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {units.map((unit) => (
                        <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:border-diva-accent transition-colors">
                            <div className="h-32 bg-slate-100 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop"
                                    className="w-full h-full object-cover opacity-80"
                                    alt={unit.name}
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-green-700">
                                    {unit.status === 'operational' ? 'Aberta' : 'Fechada'}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl text-slate-800 mb-1">{unit.name}</h3>
                                <div className="flex items-center text-slate-500 text-sm mb-4">
                                    <MapPin size={14} className="mr-1" />
                                    {unit.location || 'Endereço não cadastrado'}
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase">Gerente</p>
                                        <p className="font-medium text-slate-700">Ana Paula</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase">Equipe</p>
                                        <p className="font-medium text-slate-700">12 Colab.</p>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium rounded-lg transition-colors">
                                    Gerenciar Unidade
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Content: Inventory Transfer */}
            {activeTab === 'inventory' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transfer Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Truck size={20} className="text-diva-accent" />
                            Transferir Estoque
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Produto</label>
                                <select
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-diva-accent/20 outline-none"
                                    value={transferData.productId}
                                    onChange={(e) => setTransferData({ ...transferData, productId: e.target.value })}
                                >
                                    <option value="">Selecione um produto</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Origem</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 outline-none"
                                        value={transferData.sourceUnitId}
                                        onChange={(e) => setTransferData({ ...transferData, sourceUnitId: e.target.value })}
                                    >
                                        <option value="">De...</option>
                                        {units.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Destino</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 outline-none"
                                        value={transferData.destUnitId}
                                        onChange={(e) => setTransferData({ ...transferData, destUnitId: e.target.value })}
                                    >
                                        <option value="">Para...</option>
                                        {units.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
                                <input
                                    type="number"
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 outline-none"
                                    min={1}
                                    value={transferData.quantity}
                                    onChange={(e) => setTransferData({ ...transferData, quantity: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            {/* Stock Preview */}
                            {transferData.productId && transferData.sourceUnitId && (
                                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                                    Estoque na Origem: <strong>{products.find(p => p.id === transferData.productId)?.stockByUnit?.[transferData.sourceUnitId] || 0} un</strong>
                                </div>
                            )}

                            <button
                                onClick={handleTransfer}
                                className="w-full py-3 bg-diva-accent hover:bg-diva-accent/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-diva-accent/20 flex justify-center items-center gap-2"
                            >
                                <ArrowRightLeft size={18} /> Confirmar Transferência
                            </button>
                        </div>
                    </div>

                    {/* Stock Matrix Table */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Mapa de Estoque Global</h3>
                            <button className="text-sm text-diva-accent font-medium hover:underline">Baixar Relatório</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="p-4">Produto</th>
                                        <th className="p-4 text-center">Global</th>
                                        {units.map(u => (
                                            <th key={u.id} className="p-4 text-center border-l border-slate-200">{u.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-slate-800">{product.name}</p>
                                                <p className="text-xs text-slate-500">{product.category}</p>
                                            </td>
                                            <td className="p-4 text-center font-bold text-slate-700">
                                                {Object.values(product.stockByUnit || {}).reduce((a, b) => a + b, 0)}
                                            </td>
                                            {units.map(u => {
                                                const stock = product.stockByUnit?.[u.id] || 0;
                                                const isLow = stock < (product.minStockLevel || 5);
                                                return (
                                                    <td key={u.id} className="p-4 text-center border-l border-slate-100">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${isLow ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                            {stock}
                                                        </span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Nova Unidade (if available) */}
            <NewUnitModal
                isOpen={isUnitModalOpen}
                onClose={() => setIsUnitModalOpen(false)}
            />
        </div>
    );
};

export default FranchiseModule;
