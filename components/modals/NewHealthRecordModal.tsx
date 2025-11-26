
import React, { useState } from 'react';
import { X, Save, User, Calendar, Syringe, CheckSquare, AlertCircle } from 'lucide-react';
import { StaffHealthRecord } from '../../types';
import { useData } from '../context/DataContext';

interface NewHealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: StaffHealthRecord) => void;
}

const NewHealthRecordModal: React.FC<NewHealthRecordModalProps> = ({ isOpen, onClose, onSave }) => {
  const { staff } = useData();
  const [formData, setFormData] = useState({
    staffId: '',
    asoExpiry: '',
    hepB: false,
    tetano: false,
    gripe: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedStaff = staff.find(s => s.id === formData.staffId);
    if (!selectedStaff) return;

    const vaccines = [
        { name: 'Hepatite B', valid: formData.hepB },
        { name: 'Tétano', valid: formData.tetano },
        { name: 'Influenza', valid: formData.gripe }
    ];

    // Determine compliance
    const isAsoValid = new Date(formData.asoExpiry) > new Date();
    const areVaccinesValid = formData.hepB && formData.tetano; // Assuming mandatory
    const status = isAsoValid && areVaccinesValid ? 'compliant' : 'non_compliant';

    const newRecord: StaffHealthRecord = {
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      asoExpiry: formData.asoExpiry,
      vaccines,
      status
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-green-600 text-white">
          <h3 className="font-bold text-lg flex items-center">
            <User size={20} className="mr-2" /> Atualizar Saúde Ocupacional
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Colaborador *</label>
            <select 
                required
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900"
                value={formData.staffId}
                onChange={(e) => setFormData({...formData, staffId: e.target.value})}
            >
                <option value="">Selecione...</option>
                {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Validade do ASO (Exame) *</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                    type="date" 
                    required
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900 text-sm"
                    value={formData.asoExpiry}
                    onChange={(e) => setFormData({...formData, asoExpiry: e.target.value})}
                />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                  <Syringe size={14} className="mr-1" /> Carteira de Vacinação
              </h4>
              <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        checked={formData.hepB}
                        onChange={(e) => setFormData({...formData, hepB: e.target.checked})}
                      />
                      <span className="text-sm text-gray-700">Hepatite B (3 doses)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        checked={formData.tetano}
                        onChange={(e) => setFormData({...formData, tetano: e.target.checked})}
                      />
                      <span className="text-sm text-gray-700">Antitetânica (Vigente)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        checked={formData.gripe}
                        onChange={(e) => setFormData({...formData, gripe: e.target.checked})}
                      />
                      <span className="text-sm text-gray-700">Influenza (Anual)</span>
                  </label>
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700 transition-all flex items-center"
            >
              <Save size={16} className="mr-2" /> Atualizar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewHealthRecordModal;
