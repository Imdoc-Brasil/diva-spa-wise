
import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, User, MapPin, Sparkles, Activity, Megaphone, Plus, AlertTriangle } from 'lucide-react';
import { ServiceAppointment, AppointmentStatus } from '../../types';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';
import NewClientModal from './NewClientModal';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock Service Options (In real app, fetch from Settings/Services)
const services = [
  { name: 'Depilação a Laser - Perna', price: 250, duration: 30 },
  { name: 'Limpeza de Pele', price: 150, duration: 60 },
  { name: 'Botox (3 Regiões)', price: 1200, duration: 45 },
  { name: 'Drenagem Linfática', price: 180, duration: 60 },
];

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose }) => {
  const { addAppointment, appointments, clients, staff, rooms } = useData();
  const { addToast } = useToast();
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const initialFormState = {
    clientId: '',
    serviceName: services[0].name,
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    staffName: '', // Will use staff[0] ID if available
    roomId: '', // Will use rooms[0] ID if available
    status: AppointmentStatus.SCHEDULED,
    referralSource: 'instagram'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Reset form when modal opens to ensure clean state
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...initialFormState,
        date: new Date().toISOString().split('T')[0]
      }));
      setConflictWarning(null);
    }
  }, [isOpen]);

  // Check for conflicts whenever relevant fields change
  useEffect(() => {
    if (!formData.roomId || !formData.date || !formData.time) {
      setConflictWarning(null);
      return;
    }

    const service = services.find(s => s.name === formData.serviceName);
    if (!service) return;

    const startDateTime = `${formData.date}T${formData.time}:00`;
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + service.duration * 60000);

    // Check for room conflicts
    const roomConflict = appointments.find(appt => {
      if (appt.roomId !== formData.roomId) return false;
      if (appt.status === AppointmentStatus.CANCELLED) return false;

      const apptStart = new Date(appt.startTime);
      const apptEnd = new Date(appt.endTime);

      // Check if times overlap
      return (startDate < apptEnd && endDate > apptStart);
    });

    if (roomConflict) {
      setConflictWarning(`⚠️ Conflito: ${formData.roomId} já está ocupada neste horário com ${roomConflict.clientName}`);
    } else {
      setConflictWarning(null);
    }
  }, [formData.roomId, formData.date, formData.time, formData.serviceName, appointments]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (conflictWarning) {
      if (!confirm('Há um conflito de horário. Deseja agendar mesmo assim?')) {
        return;
      }
    }

    const client = clients.find(c => c.clientId === formData.clientId);
    const service = services.find(s => s.name === formData.serviceName);
    const selectedStaff = staff.find(s => s.name === formData.staffName) || staff[0];
    const selectedRoom = rooms.find(r => r.name === formData.roomId) || rooms[0];

    if (!client || !service) {
      addToast('Selecione um cliente e um serviço válidos.', 'error');
      return;
    }

    const startDateTime = `${formData.date}T${formData.time}:00`;
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + service.duration * 60000);

    const newAppointment: ServiceAppointment = {
      appointmentId: `apt_${Date.now()}`,
      clientId: client.clientId,
      clientName: client.name,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      roomId: selectedRoom.name, // Currently app uses room name as ID in some places, sticking to name for display
      startTime: startDateTime,
      endTime: endDate.toISOString(),
      status: formData.status,
      serviceName: service.name,
      price: service.price
    };

    // In a real app, we would update the Client's acquisition source here using formData.referralSource
    addAppointment(newAppointment);
    addToast(`Agendamento criado com sucesso para ${client.name}!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white">
          <h3 className="font-bold text-lg flex items-center">
            <Calendar size={20} className="mr-2" /> Novo Agendamento
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente *</label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select
                  required
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                >
                  <option value="" className="text-gray-400">Selecione um cliente...</option>
                  {clients.map(client => (
                    <option key={client.clientId} value={client.clientId} className="text-gray-900">
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setIsNewClientModalOpen(true)}
                className="bg-diva-light/20 text-diva-primary p-3 rounded-lg hover:bg-diva-primary hover:text-white transition-colors border border-diva-light/50"
                title="Novo Cliente"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Procedimento *</label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select
                  required
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                >
                  {services.map(s => (
                    <option key={s.name} value={s.name} className="text-gray-900">{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Origem</label>
              <div className="relative">
                <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                  value={formData.referralSource}
                  onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                >
                  <option value="instagram">Instagram</option>
                  <option value="google">Google / Site</option>
                  <option value="referral">Indicação</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="passing">Passou em Frente</option>
                  <option value="other">Outros</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
              <input
                type="date"
                required
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Horário</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="time"
                  required
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profissional</label>
              <select
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                value={formData.staffName}
                onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
              >
                <option value="">Selecione...</option>
                {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sala</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {rooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status Inicial</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as AppointmentStatus })}
              >
                <option value={AppointmentStatus.SCHEDULED}>Agendado (Padrão)</option>
                <option value={AppointmentStatus.CONFIRMED}>Confirmado</option>
                <option value={AppointmentStatus.IN_PROGRESS}>Em Andamento</option>
              </select>
            </div>
          </div>

          {/* Conflict Warning Banner */}
          {conflictWarning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-yellow-800">Atenção: Conflito de Horário</p>
                <p className="text-xs text-yellow-700 mt-1">{conflictWarning}</p>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
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
              <Save size={16} className="mr-2" /> Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>

      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
      />
    </div>
  );
};

export default NewAppointmentModal;
