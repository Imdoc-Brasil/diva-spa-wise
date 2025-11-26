
import React, { useState } from 'react';
import { X, Save, Briefcase, Clock, DollarSign, Tag, Star } from 'lucide-react';
import { ServiceDefinition } from '../../types';

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ServiceDefinition) => void;
}

const NewServiceModal: React.FC<NewServiceModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'laser' as const,
    duration: 30,
    price: '',
    description: '',
    loyaltyPoints: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newService: ServiceDefinition = {
      id: `srv_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      duration: Number(formData.duration),
      price: parseFloat(formData.price) || 0,
      active: true,
      description: formData.description,
      loyaltyPoints: parseInt(formData.loyaltyPoints) || 0
    };

    onSave(newService);
    setFormData({ name: '', category: 'laser', duration: 30, price: '', description: '', loyaltyPoints: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white">
          <h3 className="font-bold text-lg flex items-center">
            <Briefcase size={20} className="mr-2" /> Novo Tratamento
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Serviço *</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
              placeholder="Ex: Depilação Laser - Axila"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    >
                        <option value="laser">Laser</option>
                        <option value="esthetics">Estética</option>
                        <option value="injectables">Injetáveis</option>
                        <option value="spa">Spa / Relax</option>
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
                        onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
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
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, loyaltyPoints: e.target.value})}
                  />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição (Opcional)</label>
            <textarea 
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 resize-none h-20 text-sm"
                placeholder="Detalhes para o site/agendamento..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-diva-dark transition-all flex items-center"
            >
              <Save size={16} className="mr-2" /> Salvar Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewServiceModal;
