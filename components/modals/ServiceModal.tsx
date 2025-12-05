
import React, { useState, useRef } from 'react';
import { ServiceAppointment, Client, SessionRecord, AppointmentStatus } from '../../types';
import { X, Shield, Zap, FileText, Camera, CheckCircle, AlertTriangle, Save, Map, Plus, Trash2, Mic, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ServiceModalProps {
    appointment: ServiceAppointment;
    client: Client;
    isOpen: boolean;
    onClose: () => void;
    onSave: (record: any) => void;
}

interface BodyMarker {
    id: number;
    x: number;
    y: number;
    type: 'treatment' | 'avoid' | 'observation';
    note: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ appointment, client, isOpen, onClose, onSave }) => {
    const { updateAppointmentStatus } = useData();
    const [currentStatus, setCurrentStatus] = useState<AppointmentStatus>(appointment.status);
    const [activeTab, setActiveTab] = useState<'safety' | 'protocol' | 'body_map' | 'evolution'>('safety');
    const [safetyCheck, setSafetyCheck] = useState({
        sunExposure: false,
        medication: false,
        skinLesion: false,
    });

    const [laserParams, setLaserParams] = useState({
        fluence: 12, // J/cm2
        pulseWidth: 30, // ms
        frequency: 2, // Hz
    });

    // Body Charting State
    const [bodyView, setBodyView] = useState<'front' | 'back'>('front');
    const [markers, setMarkers] = useState<BodyMarker[]>([]);
    const [selectedMarkerType, setSelectedMarkerType] = useState<'treatment' | 'avoid' | 'observation'>('treatment');
    const imageRef = useRef<HTMLDivElement>(null);

    // Evolution State
    const [evolutionText, setEvolutionText] = useState('');
    const [isListening, setIsListening] = useState(false);

    // Handle status change
    const handleStatusChange = (newStatus: AppointmentStatus) => {
        setCurrentStatus(newStatus);
        updateAppointmentStatus(appointment.appointmentId, newStatus);
    };

    if (!isOpen) return null;

    const handleSave = () => {
        // Mock save logic
        onSave({
            safetyCheck,
            laserParams,
            bodyMarkers: markers,
            evolution: evolutionText,
            appointmentId: appointment.appointmentId
        });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-diva-dark text-white p-6 flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {/* Status Dropdown */}
                            <select
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(e.target.value as AppointmentStatus)}
                                className="bg-diva-accent text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors outline-none"
                            >
                                <option value={AppointmentStatus.SCHEDULED}>Agendado</option>
                                <option value={AppointmentStatus.CONFIRMED}>Confirmado</option>
                                <option value={AppointmentStatus.IN_PROGRESS}>Em Progresso</option>
                                <option value={AppointmentStatus.COMPLETED}>Concluído</option>
                                <option value={AppointmentStatus.CANCELLED}>Cancelado</option>
                            </select>
                            <span className="text-diva-light text-xs font-mono">{appointment.startTime.split('T')[1].substring(0, 5)}</span>
                        </div>
                        <h2 className="text-xl font-bold">{client.name}</h2>
                        <p className="text-diva-light text-sm">{appointment.serviceName}</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('safety')}
                        className={`flex-1 py-4 min-w-[120px] text-sm font-bold flex items-center justify-center transition-colors ${activeTab === 'safety' ? 'text-diva-primary border-b-2 border-diva-primary bg-diva-light/10' : 'text-gray-400 hover:text-diva-dark'}`}
                    >
                        <Shield size={16} className="mr-2" /> Segurança
                    </button>
                    <button
                        onClick={() => setActiveTab('protocol')}
                        className={`flex-1 py-4 min-w-[120px] text-sm font-bold flex items-center justify-center transition-colors ${activeTab === 'protocol' ? 'text-diva-primary border-b-2 border-diva-primary bg-diva-light/10' : 'text-gray-400 hover:text-diva-dark'}`}
                    >
                        <Zap size={16} className="mr-2" /> Parâmetros
                    </button>
                    <button
                        onClick={() => setActiveTab('body_map')}
                        className={`flex-1 py-4 min-w-[120px] text-sm font-bold flex items-center justify-center transition-colors ${activeTab === 'body_map' ? 'text-diva-primary border-b-2 border-diva-primary bg-diva-light/10' : 'text-gray-400 hover:text-diva-dark'}`}
                    >
                        <Map size={16} className="mr-2" /> Mapeamento
                    </button>
                    <button
                        onClick={() => setActiveTab('evolution')}
                        className={`flex-1 py-4 min-w-[120px] text-sm font-bold flex items-center justify-center transition-colors ${activeTab === 'evolution' ? 'text-diva-primary border-b-2 border-diva-primary bg-diva-light/10' : 'text-gray-400 hover:text-diva-dark'}`}
                    >
                        <FileText size={16} className="mr-2" /> Evolução
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

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

                            <div className={`p-4 rounded-xl border flex items-center justify-center text-sm font-bold transition-colors ${isSafetyClear ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
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
                                                className={`flex-1 py-2 rounded text-xs font-bold transition-all ${client.fitzpatrickSkinType === type ? 'bg-diva-dark text-white shadow-md transform scale-105' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-100'}`}
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
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedMarkerType === 'treatment' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div> Aplicação
                                        </button>
                                        <button
                                            onClick={() => setSelectedMarkerType('avoid')}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedMarkerType === 'avoid' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div> Evitar/Lesão
                                        </button>
                                        <button
                                            onClick={() => setSelectedMarkerType('observation')}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedMarkerType === 'observation' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
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
                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${marker.type === 'treatment' ? 'bg-green-500' : marker.type === 'avoid' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
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
                                        className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${bodyView === 'front' ? 'bg-diva-dark text-white' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        FRENTE
                                    </button>
                                    <button
                                        onClick={() => setBodyView('back')}
                                        className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${bodyView === 'back' ? 'bg-diva-dark text-white' : 'bg-gray-100 text-gray-500'}`}
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
                                                className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] text-white font-bold transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform
                                        ${marker.type === 'treatment' ? 'bg-green-500' : marker.type === 'avoid' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
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
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm">
                                <h3 className="font-bold text-diva-dark mb-4 flex items-center">
                                    <Camera size={18} className="mr-2 text-diva-primary" /> Registro Fotográfico
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <Camera size={32} className="mb-2" />
                                        <span className="text-xs font-bold">Adicionar Foto (Antes)</span>
                                    </div>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <Camera size={32} className="mb-2" />
                                        <span className="text-xs font-bold">Adicionar Foto (Depois)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm relative">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-diva-dark">Notas de Evolução</h3>
                                    <button
                                        onClick={toggleDictation}
                                        className={`flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        <Mic size={14} className="mr-1" /> {isListening ? 'Gravando...' : 'Ditado de Voz'}
                                    </button>
                                </div>
                                <textarea
                                    className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none resize-none"
                                    placeholder="Descreva a reação da pele (eritema, edema), nível de dor relatado e orientações pós-procedimento..."
                                    value={evolutionText}
                                    onChange={(e) => setEvolutionText(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isSafetyClear && activeTab === 'safety'}
                        className={`px-6 py-3 rounded-lg text-white font-bold flex items-center shadow-lg transition-all
                    ${!isSafetyClear && activeTab === 'safety' ? 'bg-gray-300 cursor-not-allowed' : 'bg-diva-primary hover:bg-diva-dark transform hover:-translate-y-0.5'}`}
                    >
                        <Save size={18} className="mr-2" />
                        Salvar e Finalizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceModal;
