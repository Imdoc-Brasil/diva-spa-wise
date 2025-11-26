
import React, { useState, useEffect } from 'react';
import { X, Save, Hash, DollarSign, User, Building, Instagram } from 'lucide-react';
import { Partner, PartnerType } from '../../types';

interface NewPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Partner) => void;
  initialData?: Partner | null;
}

const NewPartnerModal: React.FC<NewPartnerModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Partner>>({
    name: '',
    type: 'business',
    contact: '',
    code: '',
    commissionRate: 10,
    clientDiscountRate: 0,
    pixKey: '',
    active: true
  });

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                type: 'business',
                contact: '',
                code: '',
                commissionRate: 10,
                clientDiscountRate: 0,
                pixKey: '',
                active: true
            });
        }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const partner: Partner = {
          id: initialData?.id || `p_${Date.now()}`,
          name: formData.name || '',
          type: formData.type as PartnerType,
          contact: formData.contact || '',
          code: formData.code?.toUpperCase() || '',
          commissionRate: Number(formData.commissionRate) || 0,
          clientDiscountRate: Number(formData.clientDiscountRate) || 0,
          pixKey: formData.pixKey || '',
          active: formData.active || true,
          totalReferred: initialData?.totalReferred || 0,
          totalRevenue: initialData?.totalRevenue || 0,
          pendingPayout: initialData?.pendingPayout || 0,
      };

      onSave(partner);
      onClose();
  };

  return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white">
                  <h3 className="font-bold text-lg flex items-center">
                      {initialData ? 'Editar Parceiro' : 'Novo Parceiro'}
                  </h3>
                  <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                      <X size={20} />
                  </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Fields */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome *</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="Nome do Parceiro/Empresa" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                          <select 
                              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                              value={formData.type} 
                              onChange={e => setFormData({...formData, type: e.target.value as PartnerType})}
                          >
                              <option value="business">Empresa</option>
                              <option value="influencer">Influenciador</option>
                              <option value="client">Cliente</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contato</label>
                          <input 
                              type="text" 
                              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                              value={formData.contact} 
                              onChange={e => setFormData({...formData, contact: e.target.value})} 
                              placeholder="@insta / Tel" 
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cód. Cupom *</label>
                          <div className="relative">
                             <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                             <input 
                                type="text" 
                                required 
                                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 uppercase font-bold"
                                value={formData.code} 
                                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                                placeholder="CODIGO" 
                             />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chave PIX</label>
                          <div className="relative">
                             <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                             <input 
                                type="text" 
                                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                                value={formData.pixKey} 
                                onChange={e => setFormData({...formData, pixKey: e.target.value})} 
                                placeholder="CPF/Email" 
                             />
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comissão (%)</label>
                          <input 
                              type="number" 
                              min="0" 
                              max="100" 
                              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                              value={formData.commissionRate} 
                              onChange={e => setFormData({...formData, commissionRate: Number(e.target.value)})} 
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Desc. Cliente (%)</label>
                          <input 
                              type="number" 
                              min="0" 
                              max="100" 
                              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                              value={formData.clientDiscountRate} 
                              onChange={e => setFormData({...formData, clientDiscountRate: Number(e.target.value)})} 
                          />
                      </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                      <button type="submit" className="px-6 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-diva-dark transition-all flex items-center">
                          <Save size={16} className="mr-2" /> Salvar
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );
}

export default NewPartnerModal;
