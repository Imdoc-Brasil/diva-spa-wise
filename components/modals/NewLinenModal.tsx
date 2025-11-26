
import React, { useState, useEffect } from 'react';
import { X, Save, Shirt, Hash, DollarSign, Activity, Edit } from 'lucide-react';
import { LinenItem } from '../../types';

interface NewLinenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: LinenItem) => void;
  itemToEdit?: LinenItem | null;
}

const NewLinenModal: React.FC<NewLinenModalProps> = ({ isOpen, onClose, onSave, itemToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    totalQuantity: 0,
    costPerWash: 0,
    lifespanWashes: 50
  });

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setFormData({
          name: itemToEdit.name,
          totalQuantity: itemToEdit.totalQuantity,
          costPerWash: itemToEdit.costPerWash,
          lifespanWashes: itemToEdit.lifespanWashes
        });
      } else {
        setFormData({ name: '', totalQuantity: 0, costPerWash: 0, lifespanWashes: 50 });
      }
    }
  }, [isOpen, itemToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: LinenItem = {
      id: itemToEdit ? itemToEdit.id : `l_${Date.now()}`, // Keep ID if editing, new ID if creating
      name: formData.name,
      totalQuantity: formData.totalQuantity,
      statusCounts: itemToEdit ? {
        ...itemToEdit.statusCounts,
        clean: formData.totalQuantity - (itemToEdit.statusCounts.inUse + itemToEdit.statusCounts.dirty + itemToEdit.statusCounts.laundry) // Adjust clean count based on total change
      } : {
        clean: formData.totalQuantity,
        inUse: 0,
        dirty: 0,
        laundry: 0
      },
      costPerWash: formData.costPerWash,
      lifespanWashes: formData.lifespanWashes,
      currentWashes: itemToEdit ? itemToEdit.currentWashes : 0
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
          <h3 className="font-bold text-lg flex items-center">
            {itemToEdit ? <Edit size={20} className="mr-2" /> : <Shirt size={20} className="mr-2" />}
            {itemToEdit ? 'Editar Item' : 'Novo Item de Enxoval'}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Item *</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 bg-white"
              placeholder="Ex: Lençol Térmico"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantidade Total</label>
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="number" 
                        required
                        min="1"
                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm text-gray-900"
                        value={formData.totalQuantity || ''}
                        onChange={(e) => setFormData({...formData, totalQuantity: parseInt(e.target.value)})}
                    />
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo Lavagem</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="number"
                        step="0.10" 
                        required
                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm text-gray-900"
                        placeholder="0.00"
                        value={formData.costPerWash || ''}
                        onChange={(e) => setFormData({...formData, costPerWash: parseFloat(e.target.value)})}
                    />
                </div>
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vida Útil (Lavagens)</label>
            <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                    type="number" 
                    required
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm text-gray-900"
                    placeholder="Ex: 100"
                    value={formData.lifespanWashes || ''}
                    onChange={(e) => setFormData({...formData, lifespanWashes: parseInt(e.target.value)})}
                />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 ml-1">Estimativa para troca do enxoval.</p>
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
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center"
            >
              <Save size={16} className="mr-2" /> {itemToEdit ? 'Salvar Alterações' : 'Cadastrar Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLinenModal;
