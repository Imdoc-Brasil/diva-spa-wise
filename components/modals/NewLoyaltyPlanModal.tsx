
import React, { useState } from 'react';
import { X, Save, Crown, Check, Plus, Trash2, DollarSign } from 'lucide-react';
import { MembershipPlan } from '../../types';

interface NewLoyaltyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: MembershipPlan) => void;
}

const NewLoyaltyPlanModal: React.FC<NewLoyaltyPlanModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    colorHex: '#14808C',
    benefits: ['']
  });

  if (!isOpen) return null;

  const handleBenefitChange = (index: number, value: string) => {
      const newBenefits = [...formData.benefits];
      newBenefits[index] = value;
      setFormData({...formData, benefits: newBenefits});
  };

  const addBenefit = () => {
      setFormData({...formData, benefits: [...formData.benefits, '']});
  };

  const removeBenefit = (index: number) => {
      const newBenefits = formData.benefits.filter((_, i) => i !== index);
      setFormData({...formData, benefits: newBenefits});
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newPlan: MembershipPlan = {
          id: `plan_${Date.now()}`,
          name: formData.name,
          price: parseFloat(formData.price) || 0,
          billingCycle: 'monthly',
          benefits: formData.benefits.filter(b => b.trim() !== ''),
          activeMembers: 0,
          colorHex: formData.colorHex
      };
      onSave(newPlan);
      onClose();
      setFormData({ name: '', price: '', colorHex: '#14808C', benefits: [''] });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white">
          <h3 className="font-bold text-lg flex items-center">
            <Crown size={20} className="mr-2" /> Novo Plano de Assinatura
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Plano</label>
                <input 
                    type="text" 
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 outline-none focus:border-diva-primary"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Diva Gold"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço Mensal</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                            type="number" 
                            required
                            className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 outline-none focus:border-diva-primary"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            placeholder="99.90"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cor do Card</label>
                    <div className="flex items-center gap-2 h-[46px] border border-gray-200 rounded-lg px-3 bg-white">
                        <input 
                            type="color" 
                            className="w-8 h-8 border-none rounded cursor-pointer"
                            value={formData.colorHex}
                            onChange={e => setFormData({...formData, colorHex: e.target.value})}
                        />
                        <span className="text-xs text-gray-500 font-mono">{formData.colorHex}</span>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Benefícios</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {formData.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input 
                                type="text" 
                                className="flex-1 p-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
                                value={benefit}
                                onChange={e => handleBenefitChange(idx, e.target.value)}
                                placeholder="Benefício..."
                            />
                            <button 
                                type="button" 
                                onClick={() => removeBenefit(idx)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <button 
                    type="button" 
                    onClick={addBenefit}
                    className="mt-2 text-xs text-diva-primary font-bold flex items-center hover:underline"
                >
                    <Plus size={12} className="mr-1" /> Adicionar Benefício
                </button>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-diva-dark transition-all flex items-center">
                    <Save size={16} className="mr-2" /> Criar Plano
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default NewLoyaltyPlanModal;
