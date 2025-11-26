
import React, { useState } from 'react';
import { X, Save, Trash2, Scale, FileText, User } from 'lucide-react';
import { WasteLog } from '../../types';

interface NewWasteLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: WasteLog) => void;
}

const NewWasteLogModal: React.FC<NewWasteLogModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'infectious' as const,
    weight: '',
    collectedBy: 'EcoHealth Co.',
    manifestId: '',
    staffSignature: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLog: WasteLog = {
      id: `w_${Date.now()}`,
      date: formData.date,
      type: formData.type,
      weight: parseFloat(formData.weight) || 0,
      collectedBy: formData.collectedBy,
      manifestId: formData.manifestId || `M-${Math.floor(Math.random() * 10000)}`,
      staffSignature: formData.staffSignature
    };

    onSave(newLog);
    setFormData({ ...formData, weight: '', manifestId: '', staffSignature: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-orange-600 text-white">
          <h3 className="font-bold text-lg flex items-center">
            <Trash2 size={20} className="mr-2" /> Registrar Coleta (PGRSS)
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data da Coleta</label>
                <input 
                    type="date" 
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 text-sm"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Resíduo</label>
                <select 
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                >
                    <option value="infectious">Infectante (A)</option>
                    <option value="sharps">Perfurocortante (E)</option>
                    <option value="common">Comum (D)</option>
                </select>
              </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Peso (Kg) *</label>
            <div className="relative">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                    type="number" 
                    step="0.1"
                    required
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Empresa Coletora</label>
            <input 
                type="text" 
                required
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900"
                value={formData.collectedBy}
                onChange={(e) => setFormData({...formData, collectedBy: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID do Manifesto</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 text-sm"
                        placeholder="Opcional"
                        value={formData.manifestId}
                        onChange={(e) => setFormData({...formData, manifestId: e.target.value})}
                    />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsável</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        required
                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 text-sm"
                        placeholder="Seu nome"
                        value={formData.staffSignature}
                        onChange={(e) => setFormData({...formData, staffSignature: e.target.value})}
                    />
                </div>
              </div>
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
              className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-orange-700 transition-all flex items-center"
            >
              <Save size={16} className="mr-2" /> Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewWasteLogModal;
