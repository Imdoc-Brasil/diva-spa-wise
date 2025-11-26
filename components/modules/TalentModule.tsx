
import React, { useState } from 'react';
import { JobOpening, Candidate, CandidateStage } from '../../types';
import { Briefcase, Users, Plus, MoreHorizontal, Star, FileText, Phone, Mail, Filter, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import NewJobModal from '../modals/NewJobModal';
import { useToast } from '../ui/ToastContext';

const mockJobs: JobOpening[] = [
    { id: 'j1', title: 'Biomédica Esteta', type: 'Full-time', department: 'Clínico', location: 'Jardins, SP', status: 'open', applicantsCount: 12, createdAt: '2023-10-20' },
    { id: 'j2', title: 'Recepcionista', type: 'Full-time', department: 'Atendimento', location: 'Jardins, SP', status: 'open', applicantsCount: 45, createdAt: '2023-10-25' },
    { id: 'j3', title: 'Esteticista Corporal', type: 'Part-time', department: 'Clínico', location: 'Jardins, SP', status: 'closed', applicantsCount: 8, createdAt: '2023-09-10' },
];

const mockCandidates: Candidate[] = [
    { id: 'c1', name: 'Amanda Costa', email: 'amanda@email.com', phone: '(11) 99999-1111', roleApplied: 'Biomédica Esteta', jobId: 'j1', stage: 'new', resumeUrl: '#', appliedDate: '2023-10-27' },
    { id: 'c2', name: 'Bruna Silva', email: 'bruna@email.com', phone: '(11) 98888-2222', roleApplied: 'Biomédica Esteta', jobId: 'j1', stage: 'interview', resumeUrl: '#', rating: 4, appliedDate: '2023-10-25' },
    { id: 'c3', name: 'Carla Perez', email: 'carla@email.com', phone: '(11) 97777-3333', roleApplied: 'Recepcionista', jobId: 'j2', stage: 'screening', resumeUrl: '#', appliedDate: '2023-10-26' },
];

const stages: { id: CandidateStage, label: string, color: string }[] = [
    { id: 'new', label: 'Novos', color: 'bg-blue-50 border-blue-200' },
    { id: 'screening', label: 'Triagem', color: 'bg-purple-50 border-purple-200' },
    { id: 'interview', label: 'Entrevista', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'practical_test', label: 'Teste Prático', color: 'bg-orange-50 border-orange-200' },
    { id: 'offer', label: 'Proposta', color: 'bg-green-50 border-green-200' },
];

const TalentModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');
  const [jobs, setJobs] = useState<JobOpening[]>(mockJobs);
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedJob, setSelectedJob] = useState<string | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const filteredCandidates = selectedJob === 'all' ? candidates : candidates.filter(c => c.jobId === selectedJob);

  const moveCandidate = (id: string, stage: CandidateStage) => {
      setCandidates(candidates.map(c => c.id === id ? { ...c, stage } : c));
  };

  const handleCreateJob = (newJob: JobOpening) => {
      setJobs([newJob, ...jobs]);
      addToast('Vaga publicada com sucesso!', 'success');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                    <Briefcase size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-bold text-diva-dark">Diva Talent</h2>
                    <p className="text-sm text-gray-500">Recrutamento e Seleção (ATS)</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'jobs' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Vagas Abertas
                </button>
                <button 
                    onClick={() => setActiveTab('candidates')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'candidates' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Candidatos
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
            
            {activeTab === 'jobs' && (
                <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-diva-dark text-lg">Oportunidades Ativas</h3>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark transition-colors shadow-md"
                        >
                            <Plus size={16} className="mr-2" /> Criar Vaga
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {job.status === 'open' ? 'Aberto' : 'Fechado'}
                                        </span>
                                        <h4 className="font-bold text-lg text-diva-dark mt-2">{job.title}</h4>
                                        <p className="text-xs text-gray-500">{job.department} • {job.type}</p>
                                    </div>
                                    <button className="text-gray-300 hover:text-diva-dark"><MoreHorizontal size={20} /></button>
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                                {String.fromCharCode(64+i)}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500 font-bold">+{job.applicantsCount > 3 ? job.applicantsCount - 3 : 0} candidatos</span>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <button 
                                        onClick={() => { setSelectedJob(job.id); setActiveTab('candidates'); }}
                                        className="flex-1 py-2 bg-diva-light/10 text-diva-dark rounded-lg text-xs font-bold hover:bg-diva-light/20 transition-colors"
                                    >
                                        Ver Candidatos
                                    </button>
                                    <button className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                                        Editar Vaga
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'candidates' && (
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            <Filter size={16} className="text-gray-400" />
                            <select 
                                value={selectedJob} 
                                onChange={(e) => setSelectedJob(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-diva-primary"
                            >
                                <option value="all">Todas as Vagas</option>
                                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                            </select>
                        </div>
                        <div className="text-xs text-gray-500">
                            Mostrando <strong>{filteredCandidates.length}</strong> candidatos
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-gray-50">
                        <div className="flex gap-4 h-full min-w-[1200px]">
                            {stages.map(stage => (
                                <div key={stage.id} className={`flex-1 flex flex-col rounded-xl border ${stage.color} min-w-[220px]`}>
                                    <div className="p-3 border-b border-gray-200/50 flex justify-between items-center bg-white/50 rounded-t-xl">
                                        <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">{stage.label}</span>
                                        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm text-gray-600">
                                            {filteredCandidates.filter(c => c.stage === stage.id).length}
                                        </span>
                                    </div>

                                    <div className="p-3 flex-1 space-y-3 overflow-y-auto">
                                        {filteredCandidates.filter(c => c.stage === stage.id).map(candidate => (
                                            <div key={candidate.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-sm text-diva-dark">{candidate.name}</h4>
                                                    {candidate.rating && (
                                                        <div className="flex items-center text-yellow-400 text-xs">
                                                            <Star size={10} fill="currentColor" className="mr-0.5" /> {candidate.rating}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mb-1">{candidate.roleApplied}</p>
                                                <div className="flex gap-2 mb-3">
                                                    <button className="p-1 text-gray-400 hover:text-green-600" title="WhatsApp"><Phone size={12} /></button>
                                                    <button className="p-1 text-gray-400 hover:text-blue-600" title="Email"><Mail size={12} /></button>
                                                    <button className="p-1 text-gray-400 hover:text-diva-dark" title="Currículo"><FileText size={12} /></button>
                                                </div>
                                                
                                                {candidate.notes && (
                                                    <p className="text-[10px] bg-gray-50 p-2 rounded text-gray-600 italic mb-3 border border-gray-100">
                                                        "{candidate.notes}"
                                                    </p>
                                                )}

                                                <div className="flex justify-end gap-1 pt-2 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="text-[10px] text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded">Reprovar</button>
                                                    <button 
                                                        onClick={() => {
                                                            const idx = stages.findIndex(s => s.id === stage.id);
                                                            if (idx < stages.length - 1) moveCandidate(candidate.id, stages[idx + 1].id);
                                                        }}
                                                        className="text-[10px] text-white bg-diva-primary font-bold px-2 py-1 rounded hover:bg-diva-dark flex items-center"
                                                    >
                                                        Avançar <ChevronRight size={10} className="ml-1" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        <NewJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreateJob} />
    </div>
  );
};

export default TalentModule;
