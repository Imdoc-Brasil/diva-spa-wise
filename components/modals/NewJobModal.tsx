
import React, { useState } from 'react';
import { X, Save, Briefcase, MapPin, Users } from 'lucide-react';
import { JobOpening } from '../../types';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: JobOpening) => void;
}

const NewJobModal: React.FC<NewJobModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-time' as const,
    department: '',
    location: 'Jardins, SP'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobOpening = {
      id: `job_${Date.now()}`,
      title: formData.title,
      type: formData.type,
      department: formData.department,
      location: formData.location,
      status: 'open',
      applicantsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onSave(newJob);
    onClose();
    setFormData({ title: '', type: 'Full-time', department: '', location: 'Jardins, SP' });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white">
          <h3 className="font-bold text-lg flex items-center">
            <Briefcase size={20} className="mr-2" /> Nova Vaga
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título da Vaga *</label>
            <input 
              type="text" 
              required 
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="Ex: Biomédica Esteta" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                  <select 
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 outline-none focus:border-diva-primary"
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                      <option value="Full-time">Integral</option>
                      <option value="Part-time">Meio Período</option>
                      <option value="Contract">Contrato (PJ)</option>
                  </select>
              </div>
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Departamento</label>
                  <input 
                      type="text" 
                      required
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 outline-none focus:border-diva-primary"
                      value={formData.department} 
                      onChange={e => setFormData({...formData, department: e.target.value})} 
                      placeholder="Ex: Clínico" 
                  />
              </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Localização</label>
             <div className="relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                 <input 
                    type="text" 
                    required
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 outline-none focus:border-diva-primary"
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                 />
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-diva-dark transition-all flex items-center">
              <Save size={16} className="mr-2" /> Publicar Vaga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewJobModal;
