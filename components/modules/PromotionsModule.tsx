
import React, { useState } from 'react';
import { Promotion, PromotionType } from '../../types';
import { Tag, Plus, Trash2, Edit2, Calendar, CheckCircle, XCircle, DollarSign, Percent, Search, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const mockPromotions: Promotion[] = [
    { id: 'p1', code: 'BEMVINDO20', description: 'Desconto para primeira visita', type: 'percentage', value: 20, startDate: '2023-01-01', endDate: '2023-12-31', usageLimit: 1000, usageCount: 145, active: true, minSpend: 100 },
    { id: 'p2', code: 'VERAO50', description: 'Voucher de R$ 50 para corporais', type: 'fixed_amount', value: 50, startDate: '2023-11-01', endDate: '2024-02-28', usageLimit: 500, usageCount: 12, active: true, minSpend: 300 },
    { id: 'p3', code: 'LASER10', description: '10% OFF em pacotes de Laser', type: 'percentage', value: 10, startDate: '2023-10-01', endDate: '2023-10-31', usageLimit: 100, usageCount: 98, active: false, minSpend: 0 },
];

const usageData = [
    { name: 'BEMVINDO20', used: 145 },
    { name: 'VERAO50', used: 12 },
    { name: 'LASER10', used: 98 },
    { name: 'VIPOFF', used: 45 },
];

const PromotionsModule: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<Promotion>>({
      type: 'percentage',
      active: true,
      usageLimit: 100,
      usageCount: 0,
      minSpend: 0
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleSave = () => {
      if (!newPromo.code || !newPromo.value) return;
      const promo: Promotion = {
          id: `promo_${Date.now()}`,
          code: newPromo.code.toUpperCase(),
          description: newPromo.description || '',
          type: newPromo.type || 'percentage',
          value: newPromo.value,
          startDate: newPromo.startDate || new Date().toISOString().split('T')[0],
          endDate: newPromo.endDate || new Date().toISOString().split('T')[0],
          usageLimit: newPromo.usageLimit || 100,
          usageCount: 0,
          active: newPromo.active || true,
          minSpend: newPromo.minSpend || 0
      };
      setPromotions([promo, ...promotions]);
      setShowForm(false);
      setNewPromo({ type: 'percentage', active: true, usageLimit: 100, usageCount: 0, minSpend: 0 });
  };

  const toggleStatus = (id: string) => {
      setPromotions(promotions.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const filteredPromos = promotions.filter(p => p.code.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-50 rounded-xl text-pink-600 border border-pink-100">
                    <Tag size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-bold text-diva-dark">Smart Promo</h2>
                    <p className="text-sm text-gray-500">Gestão de Cupons e Campanhas de Desconto</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar cupom..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-diva-primary" 
                    />
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark shadow-md transition-colors"
                >
                    <Plus size={16} className="mr-2" /> Criar Cupom
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex gap-6 overflow-hidden">
            
            {/* List */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-y-auto p-6">
                <h3 className="font-bold text-diva-dark mb-4">Cupons Ativos e Histórico</h3>
                <div className="space-y-3">
                    {filteredPromos.map(promo => (
                        <div key={promo.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 px-3 py-1 rounded-lg font-mono font-bold text-diva-dark border border-gray-300 text-sm tracking-wider">
                                        {promo.code}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${promo.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {promo.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => toggleStatus(promo.id)} className="p-1.5 text-gray-400 hover:text-diva-primary bg-gray-50 rounded"><CheckCircle size={14}/></button>
                                    <button className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded"><Trash2 size={14}/></button>
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{promo.description}</p>
                            
                            <div className="flex gap-6 text-xs text-gray-500 border-t border-gray-50 pt-3">
                                <div className="flex items-center">
                                    {promo.type === 'percentage' ? <Percent size={14} className="mr-1 text-diva-accent" /> : <DollarSign size={14} className="mr-1 text-green-600" />}
                                    <span className="font-bold text-gray-700 mr-1">{promo.value}</span> 
                                    {promo.type === 'percentage' ? '% OFF' : 'Reais OFF'}
                                </div>
                                <div className="flex items-center">
                                    <Calendar size={14} className="mr-1 text-gray-400" />
                                    Até {new Date(promo.endDate).toLocaleDateString()}
                                </div>
                                <div>
                                    Usos: <strong>{promo.usageCount}</strong> / {promo.usageLimit}
                                </div>
                                {promo.minSpend && promo.minSpend > 0 && (
                                    <div>Mín: {formatCurrency(promo.minSpend)}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar: Analytics or Form */}
            <div className="w-80 flex flex-col gap-6">
                {showForm ? (
                    <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-diva-dark">Novo Cupom</h3>
                            <button onClick={() => setShowForm(false)}><XCircle size={20} className="text-gray-400 hover:text-red-500" /></button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Código</label>
                                <input 
                                    type="text" 
                                    value={newPromo.code || ''} 
                                    onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                                    className="w-full p-2 border rounded text-sm uppercase font-bold tracking-wide" 
                                    placeholder="EX: VERAO10" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Descrição</label>
                                <input 
                                    type="text" 
                                    value={newPromo.description || ''} 
                                    onChange={e => setNewPromo({...newPromo, description: e.target.value})}
                                    className="w-full p-2 border rounded text-sm" 
                                    placeholder="Campanha de Verão..." 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
                                    <select 
                                        value={newPromo.type} 
                                        onChange={e => setNewPromo({...newPromo, type: e.target.value as PromotionType})}
                                        className="w-full p-2 border rounded text-sm"
                                    >
                                        <option value="percentage">% OFF</option>
                                        <option value="fixed_amount">R$ OFF</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Valor</label>
                                    <input 
                                        type="number" 
                                        value={newPromo.value || ''} 
                                        onChange={e => setNewPromo({...newPromo, value: Number(e.target.value)})}
                                        className="w-full p-2 border rounded text-sm" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Validade</label>
                                    <input 
                                        type="date" 
                                        value={newPromo.endDate || ''} 
                                        onChange={e => setNewPromo({...newPromo, endDate: e.target.value})}
                                        className="w-full p-2 border rounded text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Limite Usos</label>
                                    <input 
                                        type="number" 
                                        value={newPromo.usageLimit || ''} 
                                        onChange={e => setNewPromo({...newPromo, usageLimit: Number(e.target.value)})}
                                        className="w-full p-2 border rounded text-sm" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Gasto Mínimo (R$)</label>
                                <input 
                                    type="number" 
                                    value={newPromo.minSpend || ''} 
                                    onChange={e => setNewPromo({...newPromo, minSpend: Number(e.target.value)})}
                                    className="w-full p-2 border rounded text-sm" 
                                />
                            </div>
                            <button 
                                onClick={handleSave}
                                className="w-full py-3 bg-diva-primary text-white rounded-lg font-bold shadow-md hover:bg-diva-dark transition-colors"
                            >
                                Salvar Cupom
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex-1 flex flex-col">
                        <h3 className="font-bold text-diva-dark text-sm mb-4 flex items-center">
                            <BarChart2 size={16} className="mr-2" /> Top Cupons
                        </h3>
                        <div className="flex-1 min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={usageData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="used" fill="#14808C" barSize={20} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 text-center">
                            Total de Descontos: <strong>R$ 4.500,00</strong>
                        </div>
                    </div>
                )}
            </div>

        </div>
    </div>
  );
};

export default PromotionsModule;
