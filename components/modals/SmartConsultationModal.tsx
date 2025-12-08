import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, FileText, Sparkles, Save, Share2, Play, Pause, RotateCcw, Check } from 'lucide-react';
import { Client } from '../../types';
import { useData } from '../context/DataContext';

interface SmartConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client;
    onFinish?: (data: { transcription: string; skincarePlan: string }) => void;
}

const SmartConsultationModal: React.FC<SmartConsultationModalProps> = ({ isOpen, onClose, client, onFinish }) => {
    const { addAppointmentRecord } = useData();
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [skincarePlan, setSkincarePlan] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'transcription' | 'plan'>('transcription');

    // Mock transcription simulation
    const transcriptionInterval = useRef<NodeJS.Timeout | null>(null);
    const mockConversation = [
        "Médico: Olá, como você tem sentido sua pele ultimamente?",
        "Paciente: Tenho notado um pouco mais de oleosidade na zona T, principalmente no final do dia.",
        "Médico: Entendi. E você tem usado o protetor solar que indicamos na última consulta?",
        "Paciente: Sim, mas confesso que às vezes esqueço de reaplicar à tarde.",
        "Médico: Certo. A reaplicação é fundamental. Vamos ajustar sua rotina para incluir um sabonete com ácido salicílico à noite.",
        "Paciente: Ótimo. E sobre as manchas? Sinto que clarearam um pouco.",
        "Médico: Sim, o tratamento está respondendo bem. Vamos manter o clareador e adicionar um antioxidante pela manhã."
    ];

    useEffect(() => {
        if (isRecording) {
            let index = 0;
            transcriptionInterval.current = setInterval(() => {
                if (index < mockConversation.length) {
                    setTranscript(prev => prev + (prev ? '\n\n' : '') + mockConversation[index]);
                    index++;
                } else {
                    if (transcriptionInterval.current) clearInterval(transcriptionInterval.current);
                    setIsRecording(false);
                }
            }, 2000);
        } else {
            if (transcriptionInterval.current) clearInterval(transcriptionInterval.current);
        }

        return () => {
            if (transcriptionInterval.current) clearInterval(transcriptionInterval.current);
        };
    }, [isRecording]);

    const handleGeneratePlan = () => {
        setIsGenerating(true);
        setActiveTab('plan');

        // Simulate AI generation
        setTimeout(() => {
            const plan = `
# Plano de Skincare Personalizado - ${client.name}
Data: ${new Date().toLocaleDateString()}

## ☀️ Manhã
1. **Limpeza**: Gel de Limpeza Suave
2. **Tratamento**: Sérum Vitamina C 10% (Antioxidante)
3. **Hidratação**: Hidratante Oil-free
4. **Proteção**: Protetor Solar FPS 50 (Toque Seco) - *Reaplicar a cada 3h*

## 🌙 Noite
1. **Limpeza**: Sabonete com Ácido Salicílico (foco na zona T)
2. **Tratamento**: Ácido Glicólico 5% (em dias alternados)
3. **Hidratação**: Creme Reparador Noturno

## 📝 Observações
- Evitar água quente no rosto.
- Beber pelo menos 2L de água por dia.
- Retornar em 30 dias para reavaliação.
            `;
            setSkincarePlan(plan.trim());
            setIsGenerating(false);
        }, 2000);
    };

    const handleSave = () => {
        if (onFinish) {
            onFinish({
                transcription: transcript,
                skincarePlan: skincarePlan
            });
            onClose();
            return;
        }

        // Save transcription and skincare plan to appointment record
        const record = {
            id: `rec_${Date.now()}`,
            organizationId: client.organizationId || 'org_demo',
            appointmentId: `appt_${Date.now()}`, // In production, this should be passed via props
            clientId: client.clientId,
            clientName: client.name,
            serviceId: 'consultation',
            serviceName: 'Consulta Dermatológica com IA',
            professionalId: 'current_user',
            professionalName: 'Dra. Julia',
            date: new Date().toISOString(),
            duration: 30,
            status: 'Completed' as any,
            transcription: transcript,
            skincarePlan: skincarePlan,
            clinicalNotes: 'Consulta realizada com assistência de IA para transcrição e geração de plano personalizado.',
            createdAt: new Date().toISOString()
        };

        addAppointmentRecord(record);
        alert('Prontuário e Plano de Skincare salvos com sucesso!');
        onClose();
    };

    const handleShareWhatsApp = () => {
        const message = encodeURIComponent(`Olá ${client.name}! Aqui está o seu Plano de Skincare personalizado:\n\n${skincarePlan}`);
        window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-diva-primary p-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="text-yellow-300" /> Assistente de Consulta IA
                        </h2>
                        <p className="text-white/80 text-sm">Atendendo: <strong>{client.name}</strong></p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Transcription */}
                    <div className={`flex-1 flex flex-col border-r border-gray-200 transition-all duration-300 ${activeTab === 'plan' ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <Mic size={18} /> Transcrição da Consulta
                            </h3>
                            <button
                                onClick={() => setIsRecording(!isRecording)}
                                className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${isRecording
                                    ? 'bg-red-100 text-red-600 animate-pulse'
                                    : 'bg-diva-primary text-white hover:bg-diva-dark'
                                    }`}
                            >
                                {isRecording ? <><Pause size={16} /> Gravando...</> : <><Play size={16} /> Iniciar Gravação</>}
                            </button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto bg-white">
                            {transcript ? (
                                <div className="space-y-4">
                                    {transcript.split('\n\n').map((line, i) => (
                                        <div key={i} className={`p-3 rounded-lg ${line.startsWith('Médico:') ? 'bg-blue-50 ml-8' : 'bg-gray-100 mr-8'}`}>
                                            <p className="text-sm text-gray-800">{line}</p>
                                        </div>
                                    ))}
                                    {isRecording && (
                                        <div className="flex justify-center mt-4">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <Mic size={48} className="mb-4 opacity-20" />
                                    <p>Inicie a gravação para transcrever a consulta.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={handleGeneratePlan}
                                disabled={!transcript}
                                className="w-full py-3 bg-gradient-to-r from-diva-primary to-diva-accent text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Sparkles size={20} />
                                Gerar Plano de Skincare com IA
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Skincare Plan */}
                    <div className={`flex-1 flex flex-col bg-white transition-all duration-300 ${activeTab === 'transcription' ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <FileText size={18} /> Plano Personalizado
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('transcription')}
                                    className="md:hidden px-3 py-1 text-sm text-gray-500"
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto relative">
                            {isGenerating ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                                    <Sparkles size={48} className="text-diva-primary animate-spin mb-4" />
                                    <p className="text-diva-dark font-bold animate-pulse">A IA está analisando a transcrição...</p>
                                    <p className="text-sm text-gray-500 mt-2">Criando rotina ideal para {client.name}</p>
                                </div>
                            ) : null}

                            {skincarePlan ? (
                                <textarea
                                    value={skincarePlan}
                                    onChange={(e) => setSkincarePlan(e.target.value)}
                                    className="w-full h-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none resize-none font-mono text-sm leading-relaxed"
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl m-4">
                                    <Sparkles size={48} className="mb-4 opacity-20" />
                                    <p className="text-center max-w-xs">O plano de skincare será gerado aqui automaticamente após a análise da consulta.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                            <button
                                onClick={handleShareWhatsApp}
                                disabled={!skincarePlan}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Share2 size={20} />
                                Enviar no WhatsApp
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!skincarePlan}
                                className="flex-1 py-3 bg-diva-dark text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                Salvar no Prontuário
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartConsultationModal;
