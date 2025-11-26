
import React, { useState } from 'react';
import { X, Save, Calendar, Clock, DollarSign, Users, Image } from 'lucide-react';
import { ClinicEvent } from '../../types';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: ClinicEvent) => void;
}

const NewEventModal: React.FC<NewEventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    capacity: '',
    cost: '',
    revenue: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: ClinicEvent = {
        id: `ev_${Date.now()}`,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        description: formData.description,
        status: 'upcoming',
        capacity: Number(formData.capacity) || 0,
        confirmedCount: 0,
        checkInCount: 0,
        revenue: Number(formData.revenue) || 0,
        cost: Number(formData.cost) || 0,
        bannerUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop' // Default mock image
    };

    onSave(newEvent);
    setFormData({ title: '', date: '', time: '', description: '', capacity: '', cost: '', revenue: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white">
          <h3 className="font-bold text-lg flex items-center">
            <Calendar size={20} className="mr-2" /> Novo Evento
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Evento *</label>
            <input 
              type="text" 
              required 
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Botox Day"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                <input 
                    type="date" 
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Horário</label>
                <input 
                    type="text" 
                    placeholder="09:00 - 18:00"
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
            <textarea 
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm h-20 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Detalhes do evento..."
            ></textarea>
          </div>

          <div className="grid grid-cols-3 gap-4">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Capacidade</label>
                  <input type="number" className="w-full p-2 border rounded-lg bg-white text-gray-900" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
              </div>
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Rec.</label>
                  <input type="number" className="w-full p-2 border rounded-lg bg-white text-gray-900" value={formData.revenue} onChange={e => setFormData({...formData, revenue: e.target.value})} />
              </div>
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo</label>
                  <input type="number" className="w-full p-2 border rounded-lg bg-white text-gray-900" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
              </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-diva-dark transition-all flex items-center">
              <Save size={16} className="mr-2" /> Criar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEventModal;
