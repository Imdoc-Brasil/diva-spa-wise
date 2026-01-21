import React, { useState, useRef } from 'react';
import { ServiceAppointment, Client, SessionRecord, AppointmentStatus, AppointmentRecord } from '../../types';
import { X, Shield, Zap, FileText, Camera, CheckCircle, AlertTriangle, Save, Map, Plus, Trash2, Mic, ChevronDown, Sparkles, Clock, Calendar, User, ClipboardList } from 'lucide-react';
import { useData } from '../context/DataContext';
import SmartConsultationModal from './SmartConsultationModal';
import { FormTemplate } from '../../types';

interface ServiceModalProps {
    appointment: ServiceAppointment;
    client: Client;
    isOpen: boolean;
    onClose: () => void;
    onSave: (record: any) => void;
    onEdit?: () => void;
    mode?: 'laser' | 'clinical';
}

interface BodyMarker {
    id: number;
    x: number;
    y: number;
    type: 'treatment' | 'avoid' | 'observation';
    note: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ appointment, client, isOpen, onClose, onSave, onEdit, mode = 'laser' }) => {
    const { updateAppointmentStatus, appointmentRecords, addAppointmentRecord, formTemplates } = useData();
    const [currentStatus, setCurrentStatus] = useState<AppointmentStatus>(appointment.status);
    const [activeTab, setActiveTab] = useState<'safety' | 'protocol' | 'body_map' | 'evolution'>(mode === 'clinical' ? 'evolution' : 'safety');

    // Filter history for this client
    const clientHistory = appointmentRecords
        .filter(r => r.clientId === client.clientId && r.appointmentId !== appointment.appointmentId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const [safetyCheck, setSafetyCheck] = useState({
        sunExposure: false,
        medication: false,
        skinLesion: false,
        tanning: false
    });

    const [laserParams, setLaserParams] = useState({
        fluence: 12, // J/cm2
        pulseWidth: 30, // ms
        frequency: 2, // Hz
        power: '',
        energy: ''
    });

    const [isSmartConsultationOpen, setIsSmartConsultationOpen] = useState(false);

    // Body Charting State
    const [bodyView, setBodyView] = useState<'front' | 'back'>('front');
    const [markers, setMarkers] = useState<BodyMarker[]>([]);
    const [selectedMarkerType, setSelectedMarkerType] = useState<'treatment' | 'avoid' | 'observation'>('treatment');
    const imageRef = useRef<HTMLDivElement>(null);

    // Photos State
    const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
    const [afterPhotos, setAfterPhotos] = useState<string[]>([]);

    const handleAddPhoto = (type: 'before' | 'after') => {
        // Simulating photo capture/upload
        const mockPhotoUrl = `https://picsum.photos/200/300?random=${Date.now()}`;
        if (type === 'before') {
            setBeforePhotos(prev => [...prev, mockPhotoUrl]);
        } else {
            setAfterPhotos(prev => [...prev, mockPhotoUrl]);
        }
    };

    // Evolution State
    const [evolutionText, setEvolutionText] = useState('');
    const [isListening, setIsListening] = useState(false);

    const handleSmartConsultationFinish = (data: { transcription: string; skincarePlan: string }) => {
        const newText = `
--- TRANSCRIÇÃO IA ---
${data.transcription}

--- PLANO SUGERIDO ---
${data.skincarePlan}
        `.trim();

        setEvolutionText(prev => prev ? prev + '\n\n' + newText : newText);
    };

    // Template State
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

    const handleInsertTemplate = (template: FormTemplate) => {
        let templateText = `\n--- MODELO: ${template.title} ---\n`;

        template.fields.forEach(field => {
            if (field.type === 'section_header') {
                templateText += `\n[ ${field.label} ]\n`;
            } else {
                templateText += `${field.label}: \n`;
            }
        });

        setEvolutionText(prev => prev + templateText);
        setIsTemplateMenuOpen(false);
    };

    // Handle status change
    const handleStatusChange = (newStatus: AppointmentStatus) => {
        setCurrentStatus(newStatus);
        updateAppointmentStatus(appointment.appointmentId, newStatus);
    };

    if (!isOpen) return null;

    const { addToast } = (window as any).toast || { addToast: console.log }; // Quick fix if useToast not imported, but useData is there. Assuming ToastContext is available or I should import it. 
    // Wait, useData doesn't have addToast. I should import useToast.
    // Let's rely on onSave callback for now or just console log if toast isnt available, but better to check imports.
    // Looking at previous file content, useToast is NOT imported in ServiceModal. I will stick to basic alert or assume parent handles toast via onSave. 
    // Actually, I can use alert for now or just trust the UI updates.

    const handleSave = () => {
        const newRecord: AppointmentRecord = {
            id: `rec_${Date.now()}`,
            organizationId: client.organizationId || 'org_demo',
            appointmentId: appointment.appointmentId,
            clientId: client.clientId,
            clientName: client.name,
            serviceId: appointment.serviceName, // Using name as ID for now based on mock data structure
            serviceName: appointment.serviceName,
            professionalId: appointment.staffId,
            professionalName: appointment.staffName,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            duration: 0, // Calculate if needed
            status: AppointmentStatus.COMPLETED,

            clinicalNotes: evolutionText,
            observations: JSON.stringify({
                safetyCheck,
                bodyMarkers: markers
            }),
            parameters: Object.entries(laserParams).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),

            beforePhotos: beforePhotos,
            afterPhotos: afterPhotos
        };

        addAppointmentRecord(newRecord);
        updateAppointmentStatus(appointment.appointmentId, AppointmentStatus.COMPLETED);

        if (onSave) {
            onSave(newRecord);
        }
        onClose();
    };

    const isSafetyClear = !safetyCheck.sunExposure && !safetyCheck.skinLesion;

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newMarker: BodyMarker = {
            id: Date.now(),
            x,
            y,
            type: selectedMarkerType,
            note: selectedMarkerType === 'treatment' ? 'Aplicação Padrão' : selectedMarkerType === 'avoid' ? 'Evitar Área' : 'Observação'
        };

        setMarkers([...markers, newMarker]);
    };

    const removeMarker = (id: number) => {
        setMarkers(markers.filter(m => m.id !== id));
    };

    const updateMarkerNote = (id: number, note: string) => {
        setMarkers(markers.map(m => m.id === id ? { ...m, note } : m));
    };

    const toggleDictation = () => {
        setIsListening(!isListening);
        if (!isListening) {
            // Mock start listening
            setTimeout(() => {
                setEvolutionText(prev => prev + (prev ? ' ' : '') + "Paciente relatou leve desconforto na região tibial. Aplicado gel pós-calmante.");
                setIsListening(false);
            }, 2000);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
            <div className="bg-white rounded-none md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-w-4xl overflow-hidden flex flex-col md:max-h-[90vh]">

                {/* Header */}
                <div className="bg-diva-dark text-white p-4 md:p-6 flex justify-between items-start shrink-0">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                            {/* Status Dropdown */}
                            <select
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(e.target.value as AppointmentStatus)}
                                className="bg-diva-accent text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded uppercase tracking-wider cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors outline-none"
                            >
                                <option value={AppointmentStatus.SCHEDULED}>Agendado</option>
                                <option value={AppointmentStatus.CONFIRMED}>Confirmado</option>
                                <option value={AppointmentStatus.IN_PROGRESS}>Em Progresso</option>
                                <option value={AppointmentStatus.COMPLETED}>Concluído</option>
                                <option value={AppointmentStatus.CANCELLED}>Cancelado</option>
                            </select>
                            <span className="text-diva-light text-xs font-mono">{appointment.startTime.split('T')[1].substring(0, 5)}</span>

                            {onEdit && (
                                <button
                                    onClick={onEdit}
                                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white font-medium transition-colors active:scale-95"
                                >
                                    Editar
                                </button>
                            )}
                        </div>
                        <h2 className="text-lg md:text-xl font-bold truncate">{client.name}</h2>
                        <p className="text-diva-light text-xs md:text-sm truncate">{appointment.serviceName}</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors active:scale-95 shrink-0">
                        <X size={20} className="md:hidden" />
                        <X size={24} className="hidden md:block" />
                    </button>
                </div>

                {/* Tabs - Segmented Control */}
                <div className="px-4 pt-4 pb-0 shrink-0">
                    <div className="flex bg-gray-100/80 p-1 rounded-xl overflow-x-auto scrollbar-hide">
                        {mode === 'laser' && (
                            <>
                                <button
                                    onClick={() => setActiveTab('safety')}
                                    className={`flex-1 min-w-[100px] py-2 md:py-2.5 text-xs md:text-sm font-bold flex items-center justify-center transition-all rounded-lg whitespace-nowrap ${activeTab === 'safety' ? 'bg-white text-diva-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                                >
                                    <Shield size={14} className="mr-1.5 md:mr-2" /> Segurança
                                </button>
                                <button
                                    onClick={() => setActiveTab('protocol')}
                                    className={`flex-1 min-w-[100px] py-2 md:py-2.5 text-xs md:text-sm font-bold flex items-center justify-center transition-all rounded-lg whitespace-nowrap ${activeTab === 'protocol' ? 'bg-white text-diva-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                                >
                                    <Zap size={14} className="mr-1.5 md:mr-2" /> Parâmetros
                                </button>
                                <button
                                    onClick={() => setActiveTab('body_map')}
                                    className={`flex-1 min-w-[100px] py-2 md:py-2.5 text-xs md:text-sm font-bold flex items-center justify-center transition-all rounded-lg whitespace-nowrap ${activeTab === 'body_map' ? 'bg-white text-diva-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                                >
                                    <Map size={14} className="mr-1.5 md:mr-2" /> <span className="hidden sm:inline">Mapeamento</span><span className="sm:hidden">Mapa</span>
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setActiveTab('evolution')}
                            className={`flex-1 min-w-[100px] py-2 md:py-2.5 text-xs md:text-sm font-bold flex items-center justify-center transition-all rounded-lg whitespace-nowrap ${activeTab === 'evolution' ? 'bg-white text-diva-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                        >
                            <FileText size={14} className="mr-1.5 md:mr-2" /> {mode === 'clinical' ? 'Prontuário & Evolução' : 'Evolução'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50">

                    {activeTab === 'safety' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                                <div className="bg-white p-2 rounded-full h-max text-blue-500 shadow-sm"><Shield size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-blue-800 text-sm">Verificação Obrigatória</h4>
                                    <p className="text-xs text-blue-600 mt-1">Confirme as condições do paciente antes de ligar o equipamento. A segurança é inegociável.</p>
                                </div>
                            </div>

                            <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                    <div className="flex items-center">
                                        <input type="checkbox" checked={safetyCheck.sunExposure} onChange={(e) => setSafetyCheck({ ...safetyCheck, sunExposure: e.target.checked })} className="w-5 h-5 text-diva-alert rounded border-gray-300 focus:ring-diva-alert" />
                                        <span className="ml-3 text-diva-dark font-medium">Exposição solar nos últimos 15 dias?</span>
                                    </div>
                                    {safetyCheck.sunExposure && <AlertTriangle size={18} className="text-diva-alert" />}
                                </label>
                                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                    <div className="flex items-center">
                                        <input type="checkbox" checked={safetyCheck.medication} onChange={(e) => setSafetyCheck({ ...safetyCheck, medication: e.target.checked })} className="w-5 h-5 text-diva-primary rounded border-gray-300 focus:ring-diva-primary" />
                                        <span className="ml-3 text-diva-dark font-medium">Uso de medicação fotossensibilizante?</span>
                                    </div>
                                </label>
                                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                    <div className="flex items-center">
                                        <input type="checkbox" checked={safetyCheck.skinLesion} onChange={(e) => setSafetyCheck({ ...safetyCheck, skinLesion: e.target.checked })} className="w-5 h-5 text-diva-alert rounded border-gray-300 focus:ring-diva-alert" />
                                        <span className="ml-3 text-diva-dark font-medium">Feridas ou lesões na área de tratamento?</span>
                                    </div>
                                    {safetyCheck.skinLesion && <AlertTriangle size={18} className="text-diva-alert" />}
                                </label>
                            </div>

                            <div className={`p - 4 rounded - xl border flex items - center justify - center text - sm font - bold transition - colors ${isSafetyClear ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} `}>
                                {isSafetyClear ? (
                                    <><CheckCircle size={18} className="mr-2" /> Paciente Apto para Procedimento</>
                                ) : (
                                    <><AlertTriangle size={18} className="mr-2" /> Atenção: Contraindicação Detectada</>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'protocol' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm">
                                <h3 className="font-bold text-diva-dark mb-4 flex items-center">
                                    <Zap size={18} className="mr-2 text-diva-accent" /> Parâmetros do Equipamento
                                </h3>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Fluência (J/cm²)</label>
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-diva-primary">
                                            <input
                                                type="number"
                                                value={laserParams.fluence}
                                                onChange={(e) => setLaserParams({ ...laserParams, fluence: Number(e.target.value) })}
                                                className="w-full p-3 outline-none text-center font-bold text-diva-dark"
                                            />
                                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-3.5 border-l">J</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Pulso (ms)</label>
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-diva-primary">
                                            <input
                                                type="number"
                                                value={laserParams.pulseWidth}
                                                onChange={(e) => setLaserParams({ ...laserParams, pulseWidth: Number(e.target.value) })}
                                                className="w-full p-3 outline-none text-center font-bold text-diva-dark"
                                            />
                                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-3.5 border-l">ms</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Freq. (Hz)</label>
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-diva-primary">
                                            <input
                                                type="number"
                                                value={laserParams.frequency}
                                                onChange={(e) => setLaserParams({ ...laserParams, frequency: Number(e.target.value) })}
                                                className="w-full p-3 outline-none text-center font-bold text-diva-dark"
                                            />
                                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-3.5 border-l">Hz</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-diva-light/10 rounded-lg border border-diva-light/30">
                                    <h4 className="text-xs font-bold text-diva-dark mb-2">Fototipo do Paciente (Fitzpatrick)</h4>
                                    <div className="flex justify-between gap-1">
                                        {['I', 'II', 'III', 'IV', 'V', 'VI'].map(type => (
                                            <button
                                                key={type}
                                                className={`flex - 1 py - 2 rounded text - xs font - bold transition - all ${client.fitzpatrickSkinType === type ? 'bg-diva-dark text-white shadow-md transform scale-105' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-100'} `}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BODY MAPPING TAB */}
                    {activeTab === 'body_map' && (
                        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
                            {/* Tools & Legend */}
                            <div className="w-full lg:w-48 flex flex-col gap-4 shrink-0">
                                <div className="bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Ferramentas</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setSelectedMarkerType('treatment')}
                                            className={`w - full flex items - center gap - 2 px - 3 py - 2 rounded - lg text - xs font - bold transition - all ${selectedMarkerType === 'treatment' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'} `}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div> Aplicação
                                        </button>
                                        <button
                                            onClick={() => setSelectedMarkerType('avoid')}
                                            className={`w - full flex items - center gap - 2 px - 3 py - 2 rounded - lg text - xs font - bold transition - all ${selectedMarkerType === 'avoid' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'} `}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div> Evitar/Lesão
                                        </button>
                                        <button
                                            onClick={() => setSelectedMarkerType('observation')}
                                            className={`w - full flex items - center gap - 2 px - 3 py - 2 rounded - lg text - xs font - bold transition - all ${selectedMarkerType === 'observation' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'} `}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Observação
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm flex-1 overflow-y-auto">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Registros ({markers.length})</h4>
                                    <div className="space-y-2">
                                        {markers.map((marker, idx) => (
                                            <div key={marker.id} className="bg-gray-50 p-2 rounded border border-gray-100 relative group">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className={`w - 2 h - 2 rounded - full shrink - 0 ${marker.type === 'treatment' ? 'bg-green-500' : marker.type === 'avoid' ? 'bg-red-500' : 'bg-yellow-500'} `}></div>
                                                    <span className="text-[10px] font-bold uppercase text-gray-600">{marker.type} #{idx + 1}</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={marker.note}
                                                    onChange={(e) => updateMarkerNote(marker.id, e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs text-diva-dark outline-none focus:border-diva-primary"
                                                />
                                                <button
                                                    onClick={() => removeMarker(marker.id)}
                                                    className="absolute top-1 right-1 text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {markers.length === 0 && <p className="text-xs text-gray-400 italic text-center py-4">Nenhum ponto marcado.</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Canvas */}
                            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col p-4 relative select-none">
                                <div className="flex justify-center gap-4 mb-4">
                                    <button
                                        onClick={() => setBodyView('front')}
                                        className={`px - 4 py - 1 rounded - full text - xs font - bold transition - colors ${bodyView === 'front' ? 'bg-diva-dark text-white' : 'bg-gray-100 text-gray-500'} `}
                                    >
                                        FRENTE
                                    </button>
                                    <button
                                        onClick={() => setBodyView('back')}
                                        className={`px - 4 py - 1 rounded - full text - xs font - bold transition - colors ${bodyView === 'back' ? 'bg-diva-dark text-white' : 'bg-gray-100 text-gray-500'} `}
                                    >
                                        COSTAS
                                    </button>
                                </div>

                                <div className="flex-1 relative bg-gray-50 rounded-lg overflow-hidden cursor-crosshair flex items-center justify-center">
                                    <div
                                        ref={imageRef}
                                        onClick={handleMapClick}
                                        className="relative h-full w-full max-w-[300px] mx-auto"
                                    >
                                        {/* Body Silhouette SVG */}
                                        <svg viewBox="0 0 200 500" className="h-full w-full drop-shadow-xl opacity-80">
                                            {bodyView === 'front' ? (
                                                <path d="M100,30 C120,30 130,50 130,70 C130,90 115,100 125,110 C145,120 160,150 155,200 C150,250 140,280 145,320 C150,360 140,480 130,490 L70,490 C60,480 50,360 55,320 C60,280 50,250 45,200 C40,150 55,120 75,110 C85,100 70,90 70,70 C70,50 80,30 100,30 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                                            ) : (
                                                <path d="M100,30 C120,30 130,50 130,70 C130,90 115,100 125,110 C145,120 160,150 155,200 C150,250 140,280 145,320 C150,360 140,480 130,490 L70,490 C60,480 50,360 55,320 C60,280 50,250 45,200 C40,150 55,120 75,110 C85,100 70,90 70,70 C70,50 80,30 100,30 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                                            )}
                                        </svg>

                                        {/* Render Markers */}
                                        {markers.map((marker, idx) => (
                                            <div
                                                key={marker.id}
                                                className={`absolute w - 4 h - 4 rounded - full border - 2 border - white shadow - md flex items - center justify - center text - [8px] text - white font - bold transform - translate - x - 1 / 2 - translate - y - 1 / 2 cursor - pointer hover: scale - 125 transition - transform
                                        ${marker.type === 'treatment' ? 'bg-green-500' : marker.type === 'avoid' ? 'bg-red-500' : 'bg-yellow-500'} `}
                                                style={{ left: `${marker.x}% `, top: `${marker.y}% ` }}
                                                title={marker.note}
                                            >
                                                {idx + 1}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="absolute bottom-4 left-4 text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                                        Clique na área para marcar
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'evolution' && (
                        <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">

                            {/* CURRENT SESSION INPUT */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 shrink-0">
                                {/* Left: Evolution Note & AI */}
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm relative flex flex-col h-full min-h-[300px]">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-diva-dark flex items-center gap-2">
                                                <FileText size={18} className="text-diva-primary" /> Evolução Atual
                                            </h3>
                                            <div className="flex gap-2">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                                                        className="flex items-center px-3 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 transition-all"
                                                    >
                                                        <ClipboardList size={14} className="mr-1.5" /> Modelos
                                                    </button>
                                                    {isTemplateMenuOpen && (
                                                        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                                                            <div className="px-4 py-2 border-b border-gray-50">
                                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Inserir Modelo</h4>
                                                            </div>
                                                            <div className="max-h-60 overflow-y-auto">
                                                                {formTemplates.filter(t => t.active).length > 0 ? (
                                                                    formTemplates.filter(t => t.active).map(t => (
                                                                        <button
                                                                            key={t.id}
                                                                            onClick={() => handleInsertTemplate(t)}
                                                                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-diva-light/10 hover:text-diva-primary transition-colors flex items-center"
                                                                        >
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-diva-primary mr-2"></span>
                                                                            {t.title}
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <div className="px-4 py-3 text-center">
                                                                        <p className="text-[10px] text-gray-400">Nenhum modelo ativo.</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setIsSmartConsultationOpen(true)}
                                                    className="flex items-center px-3 py-1.5 bg-gradient-to-r from-diva-primary to-diva-accent text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                                                >
                                                    <Sparkles size={14} className="mr-1.5" /> Assistente IA
                                                </button>
                                                <button
                                                    onClick={toggleDictation}
                                                    className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-gray-200 shadow-sm ${isListening ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    <Mic size={14} className="mr-1.5" /> {isListening ? 'Gravando...' : 'Ditado'}
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            className="flex-1 w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                                            placeholder="Descreva a reação da pele, queixas do paciente, procedimentos realizados e orientações..."
                                            value={evolutionText}
                                            onChange={(e) => setEvolutionText(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Right: Photos */}
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm h-full">
                                        <h3 className="font-bold text-diva-dark flex items-center gap-2 mb-3">
                                            <Camera size={18} className="text-diva-primary" /> Registro Fotográfico
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 flex-1">
                                            {/* Before Photo */}
                                            <div
                                                onClick={() => handleAddPhoto('before')}
                                                className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 hover:border-diva-primary transition-all relative overflow-hidden group"
                                            >
                                                {beforePhotos.length > 0 ? (
                                                    <img src={beforePhotos[beforePhotos.length - 1]} alt="Antes" className="absolute inset-0 w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <Camera size={24} className="text-gray-300 mb-2 group-hover:scale-110 transition-transform" />
                                                        <span className="text-xs font-bold text-gray-400">Antes</span>
                                                    </>
                                                )}
                                                {beforePhotos.length > 0 && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Plus className="text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* After Photo */}
                                            <div
                                                onClick={() => handleAddPhoto('after')}
                                                className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 hover:border-diva-primary transition-all relative overflow-hidden group"
                                            >
                                                {afterPhotos.length > 0 ? (
                                                    <img src={afterPhotos[afterPhotos.length - 1]} alt="Depois" className="absolute inset-0 w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <Camera size={24} className="text-gray-300 mb-2 group-hover:scale-110 transition-transform" />
                                                        <span className="text-xs font-bold text-gray-400">Depois</span>
                                                    </>
                                                )}
                                                {afterPhotos.length > 0 && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Plus className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* HISTORY SECTION (Unified View) */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-3 mt-2 flex items-center gap-2">
                                    <Clock size={12} /> Histórico Clínico ({clientHistory.length})
                                </h3>

                                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                                    {clientHistory.length > 0 ? (
                                        <div className="relative pl-4 space-y-6 before:absolute before:content-[''] before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                                            {clientHistory.map((record, idx) => (
                                                <div key={record.id || idx} className="relative pl-6">
                                                    {/* Timeline Dot */}
                                                    <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-diva-primary z-10"></div>

                                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-bold text-diva-dark text-sm flex items-center gap-2">
                                                                    {new Date(record.date).toLocaleDateString()}
                                                                    <span className="text-xs font-normal text-gray-400">• {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </h4>
                                                                <p className="text-xs text-diva-primary font-bold mt-0.5">{record.serviceName}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full flex items-center">
                                                                    <User size={10} className="mr-1" /> {record.professionalName}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {record.clinicalNotes && (
                                                            <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-100 mt-3">
                                                                <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                                                                    "{record.clinicalNotes}"
                                                                </p>
                                                            </div>
                                                        )}

                                                        {record.transcription && (
                                                            <div className="mt-3 flex items-center gap-2">
                                                                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded border border-indigo-100 flex items-center">
                                                                    <Sparkles size={10} className="mr-1" /> IA Utilizada
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <FileText size={24} className="opacity-40" />
                                            </div>
                                            <p className="font-medium text-sm text-gray-500">Nenhum histórico disponível</p>
                                            <p className="text-xs opacity-70 mt-1">Os atendimentos anteriores aparecerão aqui.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-3 md:p-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2 md:gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 md:py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors active:scale-95 order-2 sm:order-1">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={mode === 'laser' && (!isSafetyClear && activeTab === 'safety')}
                        className={`px-6 py-2.5 md:py-3 rounded-lg text-white font-bold flex items-center justify-center shadow-lg hover:shadow-xl transition-all order-1 sm:order-2
                    ${mode === 'laser' && !isSafetyClear && activeTab === 'safety' ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-diva-primary to-diva-dark hover:scale-[1.02] active:scale-95'}`}
                    >
                        <Save size={18} className="mr-2" />
                        Salvar e Finalizar
                    </button>
                </div>
            </div >
            {isSmartConsultationOpen && (
                <SmartConsultationModal
                    isOpen={isSmartConsultationOpen}
                    onClose={() => setIsSmartConsultationOpen(false)}
                    client={client}
                    onFinish={handleSmartConsultationFinish}
                />
            )}
        </div >
    );
};

export default ServiceModal;
