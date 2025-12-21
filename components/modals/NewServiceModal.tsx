import React, { useState, useEffect } from 'react';
import { X, Save, Package, Tag, Clock, DollarSign, Star, Plus, Trash2, Users, Calculator, Briefcase } from 'lucide-react';
import { ServiceDefinition, ProtocolItem } from '../../types';
import { useData } from '../context/DataContext';

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ServiceDefinition) => void;
  serviceToEdit?: ServiceDefinition | null;
}

const NewServiceModal: React.FC<NewServiceModalProps> = ({ isOpen, onClose, onSave, serviceToEdit }) => {
  const { products, staff, rooms, serviceCategories } = useData();
  const [formData, setFormData] = useState({
    name: '',
    category: 'laser',
    duration: 30,
    price: '',
    description: '',
    loyaltyPoints: ''
  });

  const [protocol, setProtocol] = useState<ProtocolItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [allowedStaffIds, setAllowedStaffIds] = useState<string[]>([]);
  const [allowedRoomIds, setAllowedRoomIds] = useState<string[]>([]);

  // Load Data on Open
  useEffect(() => {
    if (isOpen) {
      if (serviceToEdit) {
        setFormData({
          name: serviceToEdit.name,
          category: serviceToEdit.category,
          duration: serviceToEdit.duration,
          price: serviceToEdit.price.toString(),
          description: serviceToEdit.description || '',
          loyaltyPoints: serviceToEdit.loyaltyPoints?.toString() || ''
        });
        setProtocol(serviceToEdit.protocol || []);
        setAllowedStaffIds(serviceToEdit.allowedStaffIds || []);
        setAllowedRoomIds(serviceToEdit.allowedRoomIds || []);
      } else {
        // Reset
        setFormData({ name: '', category: 'laser', duration: 30, price: '', description: '', loyaltyPoints: '' });
        setProtocol([]);
        setAllowedStaffIds([]);
        setAllowedRoomIds([]);
      }
    }
  }, [isOpen, serviceToEdit]);

  if (!isOpen) return null;

  const handleAddProtocolItem = () => {
    if (!selectedProductId) return;
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    // Check if already exists
    if (protocol.some(item => item.productId === prod.id)) {
      alert('Este produto já está na lista.');
      return;
    }

    // Calculate cost per unit (e.g. Cost per ml, per UI, or per Ampoule)
    const contentQty = prod.contentQuantity && prod.contentQuantity > 0 ? prod.contentQuantity : 1;
    const costPerUnit = (prod.costPrice || 0) / contentQty;

    const newItem: ProtocolItem = {
      productId: prod.id,
      productName: prod.name,
      quantity: 1, // Default Usage
      unit: prod.contentUnit || 'un',
      unitCost: costPerUnit,
      optional: false
    };

    setProtocol([...protocol, newItem]);
    setSelectedProductId('');
  };

  const handleRemoveProtocolItem = (index: number) => {
    const newProtocol = [...protocol];
    newProtocol.splice(index, 1);
    setProtocol(newProtocol);
  };

  const updateProtocolQty = (index: number, newQty: number) => {
    const newProtocol = [...protocol];
    newProtocol[index].quantity = newQty;
    setProtocol(newProtocol);
  };

  const toggleProtocolOptional = (index: number) => {
    const newProtocol = [...protocol];
    newProtocol[index].optional = !newProtocol[index].optional;
    setProtocol(newProtocol);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newService: ServiceDefinition = {
      id: serviceToEdit ? serviceToEdit.id : `srv_${Date.now()}`,
      organizationId: 'org_default',
      name: formData.name,
      category: formData.category,
      duration: Number(formData.duration),
      price: parseFloat(formData.price) || 0,
      active: serviceToEdit ? serviceToEdit.active : true,
      description: formData.description,
      loyaltyPoints: parseInt(formData.loyaltyPoints) || 0,
      protocol: protocol,
      allowedStaffIds,
      allowedRoomIds
    };

    onSave(newService);

    // Reset Form
    setFormData({ name: '', category: 'laser', duration: 30, price: '', description: '', loyaltyPoints: '' });
    setProtocol([]);
    onClose();
  };

  // Calculate estimated cost
  const totalCost = protocol.reduce((acc, item) => {
    if (item.optional) return acc;
    return acc + (item.unitCost * item.quantity);
  }, 0);
  const profitMargin = (parseFloat(formData.price || '0') - totalCost);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white shrink-0">
          <h3 className="font-bold text-lg flex items-center">
            <Briefcase size={20} className="mr-2" /> {serviceToEdit ? 'Editar Serviço' : 'Novo Serviço / Tratamento'}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Basic Info Section */}
          <div className="space-y-4">
            <h4 className="text-gray-900 font-bold border-b border-gray-100 pb-2 mb-4">Informações Básicas</h4>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Serviço *</label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                placeholder="Ex: Depilação Laser - Axila"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <select
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {serviceCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duração (min)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="number"
                    required
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço de Venda (R$) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pontos Fidelidade</label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500" size={14} />
                  <input
                    type="number"
                    min="0"
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                    placeholder="Ex: 50"
                    value={formData.loyaltyPoints}
                    onChange={(e) => setFormData({ ...formData, loyaltyPoints: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 resize-none h-20 text-sm"
                placeholder="Detalhes para o site/agendamento..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          {/* Protocol / BOM Section - NEW */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="flex items-center text-gray-900 font-bold">
                  <Package size={18} className="mr-2 text-diva-primary" /> Ficha Técnica / Insumos
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">Defina quais produtos são consumidos automaticamente.</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Custo Estimado</p>
                <p className="text-lg font-bold text-gray-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCost)}
                </p>
                {parseFloat(formData.price) > 0 && (
                  <p className={`text-[10px] font-bold ${profitMargin > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    Margem: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(profitMargin)}
                  </p>
                )}
              </div>
            </div>

            {/* Add Item Form */}
            <div className="flex gap-2 mb-3">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-diva-primary"
              >
                <option value="">Selecione um insumo...</option>
                {products.filter(p => !p.category || p.category === 'professional_use' || p.category === 'homecare' || p.category === 'medical_material').map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Custo: {p.costPrice ? `R$ ${p.costPrice}` : 'N/A'})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddProtocolItem}
                disabled={!selectedProductId}
                className="bg-diva-primary text-white px-3 py-2 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-diva-dark transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* List */}
            {protocol.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-3 py-2">Insumo</th>
                      <th className="px-3 py-2 w-24">Qtd.</th>
                      <th className="px-3 py-2 w-16 text-center" title="Incluir no cálculo?">Calc.</th>
                      <th className="px-3 py-2 text-right">Custo</th>
                      <th className="px-3 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {protocol.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 font-medium text-gray-700">{item.productName}</td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            className="w-16 p-1 border border-gray-200 rounded text-center"
                            value={item.quantity}
                            onChange={(e) => updateProtocolQty(idx, parseFloat(e.target.value))}
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => toggleProtocolOptional(idx)}
                            className={`p-1.5 rounded transition-colors ${!item.optional ? 'text-white bg-green-500 hover:bg-green-600' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                            title={!item.optional ? "Incluído no Custo Total" : "Opcional (Excluído do Custo)"}
                          >
                            <Calculator size={14} />
                          </button>
                        </td>
                        <td className={`px-3 py-2 text-right ${item.optional ? 'text-gray-300 line-through' : 'text-gray-500'}`}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitCost * item.quantity)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveProtocolItem(idx)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg bg-white/50">
                <Package size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-400">Nenhum insumo vinculado.</p>
              </div>
            )}
          </div>

          {/* Resources Section - PRO & ROOMS */}
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h4 className="flex items-center text-gray-900 font-bold mb-4">
              <Users size={18} className="mr-2 text-diva-accent" /> Recursos Vinculados
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Staff Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Profissionais Habilitados</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                  {staff.map(s => (
                    <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={allowedStaffIds.includes(s.id)}
                        onChange={(e) => {
                          if (e.target.checked) setAllowedStaffIds([...allowedStaffIds, s.id]);
                          else setAllowedStaffIds(allowedStaffIds.filter(id => id !== s.id));
                        }}
                        className="rounded text-diva-primary focus:ring-diva-primary"
                      />
                      <span className="text-gray-700">{s.name}</span>
                    </label>
                  ))}
                  {staff.length === 0 && <p className="text-xs text-gray-400 italic">Nenhum profissional cadastrado.</p>}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Se nenhum selecionado, todos terão acesso.</p>
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Salas Permitidas</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                  {rooms.map(r => (
                    <label key={r.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={allowedRoomIds.includes(r.id)}
                        onChange={(e) => {
                          if (e.target.checked) setAllowedRoomIds([...allowedRoomIds, r.id]);
                          else setAllowedRoomIds(allowedRoomIds.filter(id => id !== r.id));
                        }}
                        className="rounded text-diva-primary focus:ring-diva-primary"
                      />
                      <span className="text-gray-700">{r.name}</span>
                    </label>
                  ))}
                  {rooms.length === 0 && <p className="text-xs text-gray-400 italic">Nenhuma sala cadastrada.</p>}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Se nenhuma selecionada, todas disponíveis.</p>
              </div>
            </div>
          </div>

        </form>

        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-diva-dark transition-all flex items-center"
          >
            <Save size={16} className="mr-2" /> Salvar Serviço
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewServiceModal;
