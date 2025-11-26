
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, User, Calendar, DollarSign, TrendingUp, CheckCircle, PlayCircle, AlertCircle, Coffee, Heart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { ServiceAppointment, AppointmentStatus, MoodType, Client } from '../types';
import { useToast } from './ui/ToastContext';
import ServiceModal from './modals/ServiceModal';
import { useData } from './context/DataContext';

const performanceData = [
  { day: 'Seg', val: 450 },
  { day: 'Ter', val: 720 },
  { day: 'Qua', val: 300 },
  { day: 'Qui', val: 0 },
  { day: 'Sex', val: 0 },
];

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  // Connect to Global Context
  const { appointments, updateAppointmentStatus, clients, staff } = useData();
  
  // Filter appointments for the logged-in staff (Simulating 's1' as Dra. Julia)
  const currentStaffId = 's1';
  const currentUser = staff.find(s => s.id === currentStaffId);
  const myAppointments = appointments.filter(a => a.staffId === currentStaffId).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const [mood, setMood] = useState<MoodType | null>(null);
  
  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState<ServiceAppointment | null>(null);

  // Logic to find the next relevant patient
  const nextPatient = myAppointments.find(a => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.IN_PROGRESS);
  
  // Dynamic Commission Calculation
  const todayDate = new Date().toISOString().split('T')[0];
  const completedToday = myAppointments.filter(a => a.status === AppointmentStatus.COMPLETED && a.startTime.startsWith(todayDate));
  const totalServiceValue = completedToday.reduce((acc, curr) => acc + curr.price, 0);
  const commissionRate = currentUser ? currentUser.commissionRate : 0.15; // Default fallback
  const todayCommission = totalServiceValue * commissionRate;

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleMoodSelect = (selectedMood: MoodType) => {
      setMood(selectedMood);
      addToast('Obrigado por compartilhar! Tenha um ótimo dia.', 'success');
  };

  const handleSendKudos = () => {
      const colleague = prompt("Para quem você quer enviar um elogio?");
      if (colleague) {
          addToast(`Elogio enviado para ${colleague}!`, 'success');
      }
  };

  const handleStartService = (appt: ServiceAppointment) => {
      setActiveAppointment(appt);
      // Update status to In Progress globally
      updateAppointmentStatus(appt.appointmentId, AppointmentStatus.IN_PROGRESS);
      setIsServiceModalOpen(true);
  };

  const handleFinishService = (record: any) => {
      if (activeAppointment) {
          updateAppointmentStatus(activeAppointment.appointmentId, AppointmentStatus.COMPLETED);
          addToast('Atendimento finalizado e prontuário salvo com sucesso!', 'success');
      }
      setIsServiceModalOpen(false);
      setActiveAppointment(null);
  };

  // Get Client Data for Active Appointment
  const activeClient = activeAppointment ? clients.find(c => c.clientId === activeAppointment.clientId) : null;

  // Fallback mock if client not found (should not happen in production)
  const mockFallbackClient: Client = {
      clientId: '0',
      userId: '0',
      name: 'Cliente Desconhecido',
      email: '',
      phone: '',
      rfmScore: 0,
      behaviorTags: [],
      lifetimeValue: 0
  };

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="bg-diva-dark rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <p className="text-diva-light uppercase tracking-wider text-xs font-bold mb-1">Área do Profissional</p>
                <h1 className="text-3xl font-serif font-bold">Olá, {currentUser ? currentUser.name : 'Doutora'}</h1>
                <p className="opacity-80 mt-2">
                    Você tem {myAppointments.filter(a => a.status !== AppointmentStatus.COMPLETED).length} atendimentos restantes hoje. Bom trabalho! ✨
                </p>
            </div>
            <div className="flex gap-4">
                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 min-w-[140px]">
                     <div className="flex items-center gap-2 mb-1 text-diva-accent">
                         <DollarSign size={16} />
                         <span className="text-xs font-bold uppercase">Minha Comissão</span>
                     </div>
                     <p className="text-2xl font-bold">R$ {todayCommission.toFixed(2)}</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 min-w-[140px]">
                     <div className="flex items-center gap-2 mb-1 text-green-400">
                         <TrendingUp size={16} />
                         <span className="text-xs font-bold uppercase">Meta Mensal</span>
                     </div>
                     <p className="text-2xl font-bold">68%</p>
                 </div>
            </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Clock size={200} className="-mr-10 -mt-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Mood Tracker */}
            {!mood && (
                <div className="bg-white rounded-xl border border-diva-light/30 p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div>
                        <h4 className="font-bold text-diva-dark text-sm">Como você está se sentindo hoje?</h4>
                        <p className="text-xs text-gray-500">Sua resposta é anônima para a gestão.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handleMoodSelect('happy')} className="text-2xl hover:scale-125 transition-transform" title="Bem/Feliz">😁</button>
                        <button onClick={() => handleMoodSelect('neutral')} className="text-2xl hover:scale-125 transition-transform" title="Normal">🙂</button>
                        <button onClick={() => handleMoodSelect('tired')} className="text-2xl hover:scale-125 transition-transform" title="Cansada">😴</button>
                        <button onClick={() => handleMoodSelect('stressed')} className="text-2xl hover:scale-125 transition-transform" title="Estressada">🤯</button>
                    </div>
                </div>
            )}
            
            {/* NEXT PATIENT CARD (HERO) */}
            {nextPatient ? (
                <div className="bg-white border-l-4 border-diva-primary rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-6 animate-in slide-in-from-left duration-500">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                             <span className={`text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded animate-pulse ${nextPatient.status === AppointmentStatus.IN_PROGRESS ? 'bg-green-500' : 'bg-diva-primary'}`}>
                                 {nextPatient.status === AppointmentStatus.IN_PROGRESS ? 'Em Andamento' : 'Próximo Atendimento'}
                             </span>
                             <span className="text-gray-500 text-xs font-mono flex items-center"><Clock size={12} className="mr-1"/> {nextPatient.status === AppointmentStatus.IN_PROGRESS ? 'Iniciado agora' : 'Inicia em 5 min'}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-diva-dark">{nextPatient.clientName}</h2>
                        <p className="text-gray-600 font-medium">{nextPatient.serviceName}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center"><MapPin size={14} className="mr-1 text-diva-accent"/> {nextPatient.roomId}</span>
                            <span className="flex items-center"><User size={14} className="mr-1"/> Recorrente (VIP)</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <button 
                            onClick={() => handleStartService(nextPatient)}
                            className="bg-diva-primary text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center hover:bg-diva-dark transition-all shadow-md transform hover:scale-105"
                        >
                            <PlayCircle size={20} className="mr-2" /> 
                            {nextPatient.status === AppointmentStatus.IN_PROGRESS ? 'Continuar Atendimento' : 'Iniciar Atendimento'}
                        </button>
                        <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                            Ver Ficha Completa
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex items-center justify-center text-green-800">
                    <Coffee size={24} className="mr-3" />
                    <span className="font-bold">Sem pacientes aguardando no momento. Aproveite sua pausa!</span>
                </div>
            )}

            {/* TIMELINE */}
            <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm p-6">
                <h3 className="font-bold text-diva-dark mb-6 flex items-center">
                    <Calendar size={18} className="mr-2 text-diva-primary" /> Minha Agenda Hoje
                </h3>
                
                <div className="space-y-0 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[2.45rem] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                    {myAppointments.length > 0 ? myAppointments.map((appt) => {
                        const isPast = appt.status === AppointmentStatus.COMPLETED;
                        const isNext = appt.appointmentId === nextPatient?.appointmentId;
                        
                        return (
                            <div key={appt.appointmentId} className={`flex gap-4 relative group ${isPast ? 'opacity-60' : ''}`}>
                                {/* Time Column */}
                                <div className="w-16 flex flex-col items-end pt-1">
                                    <span className={`text-sm font-bold ${isNext ? 'text-diva-primary' : 'text-gray-500'}`}>
                                        {formatTime(appt.startTime)}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{formatTime(appt.endTime)}</span>
                                </div>

                                {/* Status Dot */}
                                <div className="relative pt-2">
                                    <div className={`w-4 h-4 rounded-full border-2 z-10 relative bg-white
                                        ${isPast ? 'border-gray-400 bg-gray-400' : 
                                          isNext ? 'border-diva-primary bg-diva-primary animate-pulse' : 'border-diva-light bg-diva-light'}`}>
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 pb-8">
                                    <div className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md
                                        ${isNext ? 'bg-white border-diva-primary/30 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className={`font-bold ${isPast ? 'text-gray-600 line-through' : 'text-diva-dark'}`}>{appt.clientName}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{appt.serviceName}</p>
                                            </div>
                                            {isPast ? (
                                                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded flex items-center">
                                                    <CheckCircle size={10} className="mr-1" /> Realizado
                                                </span>
                                            ) : (
                                                <span className="bg-diva-light/20 text-diva-dark text-[10px] font-bold px-2 py-1 rounded">
                                                    {appt.roomId}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="text-center text-gray-400 py-10">Nenhum agendamento para você hoje.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Alerts & Performance */}
        <div className="space-y-6">
            
            {/* Notifications / Alerts */}
            <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm p-5">
                <h3 className="font-bold text-diva-dark text-sm mb-4">Avisos da Gerência</h3>
                <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg">
                        <div className="flex gap-2">
                            <AlertCircle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-yellow-800">Reunião de Equipe</p>
                                <p className="text-xs text-yellow-700 mt-1">Hoje às 18:00. Pauta: Novos protocolos de verão.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                         <div className="flex gap-2">
                            <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-blue-800">Manutenção Laser</p>
                                <p className="text-xs text-blue-700 mt-1">Sala 02 bloqueada para calibração até as 14h.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Chart Mini */}
            <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm p-5">
                <h3 className="font-bold text-diva-dark text-sm mb-4">Meu Desempenho (Semanal)</h3>
                <div className="h-40">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData}>
                            <XAxis dataKey="day" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px'}} />
                            <Bar dataKey="val" fill="#14808C" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">Valores em R$ (Comissão Estimada)</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-diva-dark/5 rounded-xl border border-diva-dark/10 p-5">
                <h3 className="font-bold text-diva-dark text-sm mb-3">Ações Rápidas</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button className="bg-white hover:bg-gray-50 border border-gray-200 text-diva-dark py-2 rounded-lg text-xs font-bold transition-colors">
                        Bloquear Agenda
                    </button>
                    <button onClick={() => navigate('/settings')} className="bg-white hover:bg-gray-50 border border-gray-200 text-diva-dark py-2 rounded-lg text-xs font-bold transition-colors">
                        Solicitar Folga
                    </button>
                    <button onClick={handleSendKudos} className="bg-white hover:bg-pink-50 border border-pink-200 text-pink-600 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center">
                        <Heart size={12} className="mr-1" /> Enviar Elogio
                    </button>
                    <button onClick={() => navigate('/marketplace')} className="bg-diva-primary text-white py-2 rounded-lg text-xs font-bold hover:bg-diva-dark transition-colors shadow-sm">
                        Venda Balcão
                    </button>
                </div>
            </div>

        </div>
      </div>

      {/* SERVICE MODAL INTEGRATION */}
      {activeAppointment && activeClient && (
          <ServiceModal 
            isOpen={isServiceModalOpen}
            onClose={() => setIsServiceModalOpen(false)}
            onSave={handleFinishService}
            appointment={activeAppointment}
            client={activeClient}
          />
      )}
      {/* Fallback if client not found in context */}
      {activeAppointment && !activeClient && (
          <ServiceModal 
            isOpen={isServiceModalOpen}
            onClose={() => setIsServiceModalOpen(false)}
            onSave={handleFinishService}
            appointment={activeAppointment}
            client={mockFallbackClient}
          />
      )}
    </div>
  );
};

export default StaffDashboard;
