
import React, { useState } from 'react';
import { User, BookingStep, StaffMember, Product, TimeSlot } from '../../types';
import { X, ChevronRight, ChevronLeft, Calendar, User as UserIcon, CheckCircle, Clock, Sparkles } from 'lucide-react';

// Mock Data for Booking
const mockServices: Product[] = [
    { id: 's1', name: 'Depilação Laser - Axila', description: 'Sessão individual. Rápido e eficaz.', price: 89.90, category: 'treatment_package', stock: 999 },
    { id: 's2', name: 'Depilação Laser - Perna', description: 'Perna inteira. Requer 45 min.', price: 250.00, category: 'treatment_package', stock: 999 },
    { id: 's3', name: 'Limpeza de Pele', description: 'Protocolo exclusivo Diva Spa com extração.', price: 180.00, category: 'treatment_package', stock: 999 },
    { id: 's4', name: 'Botox (Avaliação)', description: 'Avaliação gratuita com Biomédica.', price: 0.00, category: 'treatment_package', stock: 999 },
];

const mockStaff: StaffMember[] = [
    { id: 'st1', userId: 'u1', name: 'Dra. Julia Martins', role: 'Biomédica', specialties: ['Laser', 'Botox'], status: 'available', commissionRate: 0.1, performanceMetrics: { monthlyRevenue: 0, appointmentsCount: 0, averageTicket: 0, npsScore: 0 }, activeGoals: [] },
    { id: 'st2', userId: 'u2', name: 'Carla Dias', role: 'Esteticista', specialties: ['Limpeza de Pele'], status: 'available', commissionRate: 0.1, performanceMetrics: { monthlyRevenue: 0, appointmentsCount: 0, averageTicket: 0, npsScore: 0 }, activeGoals: [] },
];

const mockSlots: TimeSlot[] = [
    { time: '09:00', available: true }, { time: '09:30', available: false },
    { time: '10:00', available: true }, { time: '10:30', available: true },
    { time: '11:00', available: false }, { time: '11:30', available: true },
    { time: '13:00', available: true }, { time: '13:30', available: true },
    { time: '14:00', available: false }, { time: '14:30', available: true },
    { time: '15:00', available: true }, { time: '15:30', available: true },
];

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ isOpen, onClose, user }) => {
  const [step, setStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<Product | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleNext = () => {
      if (step === 'service' && selectedService) setStep('professional');
      else if (step === 'professional') setStep('time');
      else if (step === 'time' && selectedTime) setStep('confirm');
  };

  const handleBack = () => {
      if (step === 'professional') setStep('service');
      else if (step === 'time') setStep('professional');
      else if (step === 'confirm') setStep('time');
  };

  const handleConfirm = () => {
      // Logic to save appointment would go here
      alert(`Agendamento Confirmado!\nServiço: ${selectedService?.name}\nProfissional: ${selectedStaff?.name || 'Qualquer um'}\nData: ${new Date(selectedDate).toLocaleDateString()} às ${selectedTime}`);
      onClose();
      // Reset state
      setStep('service');
      setSelectedService(null);
      setSelectedStaff(null);
      setSelectedTime(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-diva-dark/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-diva-primary p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-xl font-serif font-bold">Novo Agendamento</h2>
                <p className="text-diva-light opacity-90 text-sm">Seu momento de cuidado começa aqui.</p>
            </div>
            <Sparkles className="absolute top-[-10px] right-[-10px] text-white opacity-10" size={120} />
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
             <div className="flex items-center justify-between">
                 {['Serviço', 'Profissional', 'Horário', 'Confirmação'].map((label, idx) => {
                     const stepIdx = ['service', 'professional', 'time', 'confirm'].indexOf(step);
                     const isActive = idx <= stepIdx;
                     const isCurrent = idx === stepIdx;
                     return (
                         <div key={label} className="flex flex-col items-center flex-1 relative">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all z-10
                                 ${isActive ? 'bg-diva-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                 {idx + 1}
                             </div>
                             <span className={`text-[10px] uppercase font-bold ${isCurrent ? 'text-diva-primary' : 'text-gray-400'}`}>
                                 {label}
                             </span>
                             {idx < 3 && (
                                 <div className={`absolute top-4 left-1/2 w-full h-[2px] -translate-y-1/2
                                    ${idx < stepIdx ? 'bg-diva-primary' : 'bg-gray-200'}`}></div>
                             )}
                         </div>
                     );
                 })}
             </div>
        </div>

        {/* Steps Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
            
            {/* STEP 1: SERVICE */}
            {step === 'service' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-diva-dark mb-4">Escolha o Tratamento</h3>
                    {mockServices.map(service => (
                        <div 
                            key={service.id} 
                            onClick={() => setSelectedService(service)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center group
                                ${selectedService?.id === service.id ? 'border-diva-primary bg-diva-primary/5' : 'border-gray-100 hover:border-diva-light'}`}
                        >
                            <div>
                                <h4 className="font-bold text-diva-dark group-hover:text-diva-primary transition-colors">{service.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                            </div>
                            <span className="font-mono font-bold text-diva-dark bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
                                {service.price === 0 ? 'Grátis' : formatCurrency(service.price)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* STEP 2: PROFESSIONAL */}
            {step === 'professional' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-diva-dark mb-4">Preferência de Profissional</h3>
                    
                    <div 
                        onClick={() => setSelectedStaff(null)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4
                            ${selectedStaff === null ? 'border-diva-primary bg-diva-primary/5' : 'border-gray-100 hover:border-diva-light'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-diva-light to-diva-primary flex items-center justify-center text-white">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-diva-dark">Qualquer Profissional</h4>
                            <p className="text-xs text-gray-500">Encontrar o horário mais próximo</p>
                        </div>
                        {selectedStaff === null && <CheckCircle size={20} className="ml-auto text-diva-primary" />}
                    </div>

                    {mockStaff.map(staff => (
                        <div 
                            key={staff.id} 
                            onClick={() => setSelectedStaff(staff)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4
                                ${selectedStaff?.id === staff.id ? 'border-diva-primary bg-diva-primary/5' : 'border-gray-100 hover:border-diva-light'}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                                {staff.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-diva-dark">{staff.name}</h4>
                                <p className="text-xs text-gray-500">{staff.role}</p>
                            </div>
                            {selectedStaff?.id === staff.id && <CheckCircle size={20} className="ml-auto text-diva-primary" />}
                        </div>
                    ))}
                </div>
            )}

            {/* STEP 3: TIME */}
            {step === 'time' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-diva-dark mb-4">Data</h3>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {[0, 1, 2, 3, 4, 5].map(offset => {
                                const d = new Date();
                                d.setDate(d.getDate() + offset);
                                const isSelected = selectedDate === d.toISOString().split('T')[0];
                                return (
                                    <button 
                                        key={offset}
                                        onClick={() => setSelectedDate(d.toISOString().split('T')[0])}
                                        className={`min-w-[80px] p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all
                                            ${isSelected ? 'border-diva-primary bg-diva-primary text-white' : 'border-gray-100 bg-white text-gray-500 hover:border-diva-light'}`}
                                    >
                                        <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                                        <span className="text-xl font-bold">{d.getDate()}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-diva-dark mb-4">Horários Disponíveis</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {mockSlots.map((slot, idx) => (
                                <button 
                                    key={idx}
                                    disabled={!slot.available}
                                    onClick={() => setSelectedTime(slot.time)}
                                    className={`py-3 rounded-lg text-sm font-bold border transition-all
                                        ${!slot.available ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed decoration-slice' :
                                          selectedTime === slot.time ? 'bg-diva-primary text-white border-diva-primary shadow-md' :
                                          'bg-white text-diva-dark border-gray-200 hover:border-diva-primary'}`}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: CONFIRM */}
            {step === 'confirm' && (
                <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto animate-bounce">
                        <CheckCircle size={40} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-diva-dark">Quase lá!</h3>
                        <p className="text-gray-500">Confirme os detalhes do seu agendamento.</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl text-left border border-gray-100 space-y-4 max-w-sm mx-auto shadow-sm">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-sm text-gray-500">Serviço</span>
                            <span className="font-bold text-diva-dark text-right">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-sm text-gray-500">Profissional</span>
                            <span className="font-bold text-diva-dark">{selectedStaff?.name || 'Qualquer Profissional'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-sm text-gray-500">Data e Hora</span>
                            <span className="font-bold text-diva-dark">
                                {new Date(selectedDate).toLocaleDateString()} às {selectedTime}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-bold text-diva-primary">Total Estimado</span>
                            <span className="font-mono text-xl font-bold text-diva-primary">{formatCurrency(selectedService?.price || 0)}</span>
                        </div>
                    </div>
                    
                    <p className="text-xs text-gray-400">O pagamento será realizado no dia do atendimento.</p>
                </div>
            )}

        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-between">
            {step !== 'service' ? (
                <button 
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors flex items-center"
                >
                    <ChevronLeft size={18} className="mr-2" /> Voltar
                </button>
            ) : (
                <div></div> // Spacer
            )}
            
            {step === 'confirm' ? (
                <button 
                    onClick={handleConfirm}
                    className="px-8 py-3 rounded-xl bg-diva-primary text-white font-bold hover:bg-diva-dark shadow-lg hover:shadow-xl transition-all flex items-center"
                >
                    Confirmar Agendamento <CheckCircle size={18} className="ml-2" />
                </button>
            ) : (
                <button 
                    onClick={handleNext}
                    disabled={
                        (step === 'service' && !selectedService) || 
                        (step === 'time' && !selectedTime)
                    }
                    className={`px-8 py-3 rounded-xl font-bold flex items-center transition-all
                        ${((step === 'service' && !selectedService) || (step === 'time' && !selectedTime))
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-diva-primary text-white hover:bg-diva-dark shadow-md'}`}
                >
                    Continuar <ChevronRight size={18} className="ml-2" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;
