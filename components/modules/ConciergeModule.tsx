
import React, { useState, useEffect } from 'react';
import { PatientFlowEntry, PatientFlowStage } from '../../types';
import { User, Clock, MoreHorizontal, ChevronRight, Coffee, Sparkles, CheckCircle, AlertCircle, Move } from 'lucide-react';

const mockFlow: PatientFlowEntry[] = [
    { id: 'f1', clientId: 'c1', clientName: 'Ana Silva', stage: 'reception', enteredStageAt: new Date(Date.now() - 5 * 60000).toISOString(), serviceName: 'Depilação Laser', staffName: 'Dra. Julia', tags: ['Check-in App'] },
    { id: 'f2', clientId: 'c2', clientName: 'Beatriz Costa', stage: 'prep', enteredStageAt: new Date(Date.now() - 15 * 60000).toISOString(), serviceName: 'Botox', staffName: 'Dra. Julia', tags: ['Anestésico: 14:10'] },
    { id: 'f3', clientId: 'c3', clientName: 'Carla Dias', stage: 'procedure', enteredStageAt: new Date(Date.now() - 10 * 60000).toISOString(), serviceName: 'Limpeza de Pele', staffName: 'Est. Carla' },
    { id: 'f4', clientId: 'c4', clientName: 'Fernanda Lima', stage: 'recovery', enteredStageAt: new Date(Date.now() - 2 * 60000).toISOString(), serviceName: 'Peeling', staffName: 'Dra. Julia', notes: 'Oferecer Chá de Hibisco' },
];

const stages: { id: PatientFlowStage, label: string, color: string }[] = [
    { id: 'reception', label: 'Recepção / Aguardando', color: 'bg-gray-100 border-gray-200' },
    { id: 'prep', label: 'Em Preparo (Anestésico)', color: 'bg-blue-50 border-blue-200' },
    { id: 'procedure', label: 'Em Procedimento', color: 'bg-purple-50 border-purple-200' },
    { id: 'recovery', label: 'Recuperação / Relax', color: 'bg-green-50 border-green-200' },
    { id: 'checkout', label: 'Checkout / Pagamento', color: 'bg-yellow-50 border-yellow-200' },
];

const ConciergeModule: React.FC = () => {
  const [patients, setPatients] = useState<PatientFlowEntry[]>(mockFlow);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update timers every minute
  useEffect(() => {
      const timer = setInterval(() => setCurrentTime(new Date()), 60000);
      return () => clearInterval(timer);
  }, []);

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
          setPatients(patients.map(p => p.id === id ? { ...p, stage: newStage, enteredStageAt: new Date().toISOString() } : p));
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

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
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
                                          <button className="text-gray-300 hover:text-diva-dark"><MoreHorizontal size={16} /></button>
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
                                              {stage.id !== 'checkout' && (
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
    </div>
  );
};

export default ConciergeModule;
