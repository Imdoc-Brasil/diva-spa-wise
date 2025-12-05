
import React, { useState, useEffect, useMemo } from 'react';
import { PatientFlowEntry, PatientFlowStage, ServiceAppointment, AppointmentStatus } from '../../types';
import { User, Clock, MoreHorizontal, ChevronRight, Coffee, Sparkles, CheckCircle, AlertCircle, Move, Bell, UserPlus, MessageSquare, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';

const stages: { id: PatientFlowStage, label: string, color: string }[] = [
    { id: 'reception', label: 'Recepção / Aguardando', color: 'bg-gray-100 border-gray-200' },
    { id: 'checkout', label: 'Checkout / Pagamento', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'prep', label: 'Em Preparo (Anestésico)', color: 'bg-blue-50 border-blue-200' },
    { id: 'procedure', label: 'Em Procedimento', color: 'bg-purple-50 border-purple-200' },
    { id: 'recovery', label: 'Recuperação / Relax', color: 'bg-green-50 border-green-200' },
];

const ConciergeModule: React.FC = () => {
    const { appointments, updateAppointment } = useData();
    const { addToast } = useToast();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    // Update timers every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Convert appointments to patient flow entries
    const patients = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];

        return appointments
            .filter(appt => {
                const apptDate = appt.startTime.split('T')[0];
                return apptDate === today &&
                    (appt.status === AppointmentStatus.CONFIRMED ||
                        appt.status === AppointmentStatus.SCHEDULED ||
                        appt.status === AppointmentStatus.IN_PROGRESS ||
                        appt.status === AppointmentStatus.COMPLETED);
            })
            .map(appt => {
                let stage: PatientFlowStage = 'reception';

                if (appt.status === AppointmentStatus.CONFIRMED || appt.status === AppointmentStatus.SCHEDULED) stage = 'reception';
                else if (appt.status === AppointmentStatus.IN_PROGRESS) stage = 'procedure';
                else if (appt.status === AppointmentStatus.COMPLETED) stage = 'recovery';

                return {
                    id: appt.appointmentId,
                    clientId: appt.clientId,
                    clientName: appt.clientName,
                    stage,
                    enteredStageAt: appt.startTime,
                    serviceName: appt.serviceName,
                    staffName: appt.staffName,
                    tags: [],
                    notes: undefined
                } as PatientFlowEntry;
            });
    }, [appointments, currentTime]);

    const getDuration = (isoTime: string) => {
        const start = new Date(isoTime);
        const diff = Math.floor((currentTime.getTime() - start.getTime()) / 60000); // minutes
        return diff;
    };

    const movePatient = (id: string, direction: 'next' | 'prev') => {
        const patient = patients.find(p => p.id === id);
        if (!patient) return;

        const currentIdx = stages.findIndex(s => s.id === patient.stage);
        let newIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;

        if (newIdx >= 0 && newIdx < stages.length) {
            const newStage = stages[newIdx].id;
            const appointment = appointments.find(a => a.appointmentId === id);

            if (appointment) {
                let newStatus = appointment.status;

                // Map stage to status
                if (newStage === 'reception') newStatus = AppointmentStatus.CONFIRMED;
                else if (newStage === 'procedure') newStatus = AppointmentStatus.IN_PROGRESS;
                else if (newStage === 'recovery' || newStage === 'checkout') newStatus = AppointmentStatus.COMPLETED;

                updateAppointment({
                    ...appointment,
                    status: newStatus
                });

                addToast(`${patient.clientName} movido para ${stages[newIdx].label}`, 'success');
            }
        }
    };

    const handleCheckIn = (appointmentId: string) => {
        const appointment = appointments.find(a => a.appointmentId === appointmentId);
        if (appointment) {
            updateAppointment({
                ...appointment,
                status: AppointmentStatus.CONFIRMED
            });
            addToast(`Check-in realizado para ${appointment.clientName}`, 'success');
        }
    };

    const handleCallPatient = (patient: PatientFlowEntry) => {
        addToast(`Chamando ${patient.clientName} - ${patient.serviceName}`, 'info');
        // In production: trigger notification system, TV signage, etc.
    };

    const handleAddNote = () => {
        if (!selectedPatient || !noteText.trim()) return;

        const appointment = appointments.find(a => a.appointmentId === selectedPatient);
        if (appointment) {
            // In production: update appointment with note
            addToast('Nota adicionada com sucesso!', 'success');
            setNoteText('');
            setIsNoteModalOpen(false);
            setSelectedPatient(null);
        }
    };

    const getTimerStyle = (minutes: number, stage: PatientFlowStage) => {
        let limit = 15; // default limit
        if (stage === 'prep') limit = 30; // Anesthetic takes longer
        if (stage === 'procedure') limit = 60;

        if (minutes > limit) return 'text-red-600 bg-red-100 animate-pulse';
        if (minutes > limit * 0.7) return 'text-orange-600 bg-orange-100';
        return 'text-green-600 bg-green-100';
    };

    // Waitlist: appointments confirmed but not checked in yet
    const waitlist = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return appointments.filter(appt => {
            const apptDate = appt.startTime.split('T')[0];
            return apptDate === today && (appt.status === AppointmentStatus.CONFIRMED || appt.status === AppointmentStatus.SCHEDULED);
        });
    }, [appointments]);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Header with Waitlist */}
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-diva-dark">Concierge & Fluxo</h2>
                        <p className="text-sm text-gray-500">Gestão da jornada física do paciente na clínica.</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">No Prazo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-gray-600">Atenção / Atraso</span>
                        </div>
                    </div>
                </div>

                {/* Waitlist */}
                {waitlist.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Bell size={16} className="text-diva-primary" />
                            <h3 className="text-sm font-bold text-diva-dark">Fila de Espera ({waitlist.length})</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {waitlist.slice(0, 6).map(appt => (
                                <div key={appt.appointmentId} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-diva-dark">{appt.clientName}</p>
                                        <p className="text-xs text-gray-500">{appt.serviceName}</p>
                                        <p className="text-xs text-gray-400">{new Date(appt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCheckIn(appt.appointmentId)}
                                        className="bg-diva-primary text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-diva-dark transition-colors flex items-center gap-1"
                                    >
                                        <UserPlus size={12} />
                                        Check-in
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-2">
                <div className="flex gap-4 h-full min-w-[1200px]">
                    {stages.map(stage => (
                        <div key={stage.id} className={`flex-1 flex flex-col rounded-xl border ${stage.color} min-w-[220px]`}>
                            {/* Column Header */}
                            <div className="p-3 border-b border-gray-200/50 flex justify-between items-center bg-white/50 rounded-t-xl">
                                <span className="font-bold text-diva-dark text-sm uppercase tracking-wide">{stage.label}</span>
                                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm text-gray-600">
                                    {patients.filter(p => p.stage === stage.id).length}
                                </span>
                            </div>

                            {/* Cards Container */}
                            <div className="p-3 flex-1 space-y-3 overflow-y-auto">
                                {patients.filter(p => p.stage === stage.id).map(patient => {
                                    const minutes = getDuration(patient.enteredStageAt);
                                    return (
                                        <div key={patient.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all group relative">

                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-diva-light/20 flex items-center justify-center text-diva-dark font-bold text-xs">
                                                        {patient.clientName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-diva-dark leading-tight">{patient.clientName}</h4>
                                                        <p className="text-[10px] text-gray-500">{patient.staffName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleCallPatient(patient)}
                                                        className="text-gray-400 hover:text-diva-primary transition-colors"
                                                        title="Chamar Paciente"
                                                    >
                                                        <Bell size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPatient(patient.id);
                                                            setIsNoteModalOpen(true);
                                                        }}
                                                        className="text-gray-400 hover:text-diva-primary transition-colors"
                                                        title="Adicionar Nota"
                                                    >
                                                        <MessageSquare size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <p className="text-xs font-medium text-diva-primary bg-diva-primary/5 px-2 py-1 rounded inline-block mb-1">
                                                    {patient.serviceName}
                                                </p>
                                                {patient.tags && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {patient.tags.map(tag => (
                                                            <span key={tag} className="text-[9px] border border-gray-200 text-gray-500 px-1.5 rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {patient.notes && (
                                                <div className="bg-yellow-50 p-2 rounded border border-yellow-100 mb-3 flex gap-2">
                                                    <AlertCircle size={12} className="text-yellow-600 shrink-0 mt-0.5" />
                                                    <p className="text-[10px] text-yellow-800 italic">{patient.notes}</p>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${getTimerStyle(minutes, stage.id)}`}>
                                                    <Clock size={10} />
                                                    {minutes} min
                                                </div>

                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {stage.id !== 'reception' && (
                                                        <button onClick={() => movePatient(patient.id, 'prev')} className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600" title="Voltar">
                                                            <Move size={12} className="transform rotate-180" />
                                                        </button>
                                                    )}
                                                    {stage.id !== 'recovery' && (
                                                        <button onClick={() => movePatient(patient.id, 'next')} className="p-1 bg-diva-primary hover:bg-diva-dark text-white rounded" title="Avançar Etapa">
                                                            <ChevronRight size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Empty State Decoration */}
                                {patients.filter(p => p.stage === stage.id).length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50">
                                        {stage.id === 'recovery' ? <Coffee size={32} /> : <Sparkles size={32} />}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Note Modal */}
            {isNoteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-diva-dark mb-4">Adicionar Nota</h3>

                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none resize-none"
                            rows={4}
                            placeholder="Ex: Oferecer chá de hibisco, Anestésico aplicado às 14:10..."
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsNoteModalOpen(false);
                                    setNoteText('');
                                    setSelectedPatient(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddNote}
                                className="flex-1 px-4 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors shadow-md"
                            >
                                Salvar Nota
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConciergeModule;
