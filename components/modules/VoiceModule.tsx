
import React, { useState, useEffect } from 'react';
import { CallLog } from '../../types';
import { Phone, Mic, Play, Pause, Search, Settings, Calendar, User, Clock, BarChart2, Activity, Volume2, Sliders, Zap, MessageSquare, Brain, Save, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const mockCalls: CallLog[] = [
    { id: 'c1', caller: '(11) 99876-5432', duration: '2m 45s', status: 'booked', timestamp: 'Há 10 min', sentiment: 'positive', transcript: "Cliente: Gostaria de marcar um horário para hoje. \nIA: Olá! Tenho horário disponível às 16h com a Dra. Julia. \nCliente: Perfeito, pode marcar." },
    { id: 'c2', caller: '(11) 98888-7777', duration: '1m 10s', status: 'question', timestamp: 'Há 35 min', sentiment: 'neutral', transcript: "Cliente: Qual o valor do Botox? \nIA: O valor é a partir de R$ 1.200, dependendo da avaliação. \nCliente: Ok, vou pensar." },
    { id: 'c3', caller: '(21) 97777-6666', duration: '0m 45s', status: 'missed', timestamp: 'Há 1h', sentiment: 'negative', transcript: "Cliente desligou antes de interagir." },
    { id: 'c4', caller: '(11) 96666-5555', duration: '3m 20s', status: 'transfer', timestamp: 'Há 2h', sentiment: 'neutral', transcript: "Cliente: Preciso falar com o financeiro sobre um boleto. \nIA: Entendido, vou transferir sua ligação." },
];

const callVolumeData = [
    { time: '08:00', calls: 5 },
    { time: '10:00', calls: 12 },
    { time: '12:00', calls: 8 },
    { time: '14:00', calls: 15 },
    { time: '16:00', calls: 20 },
    { time: '18:00', calls: 10 },
];

const VoiceModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
    const [selectedCall, setSelectedCall] = useState<CallLog | null>(mockCalls[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    // Settings State
    const [aiName, setAiName] = useState('Diva');
    const [voiceSpeed, setVoiceSpeed] = useState(1.0);
    const [personality, setPersonality] = useState(70);
    const [isSaved, setIsSaved] = useState(false);

    // Waveform Animation Logic
    const [bars, setBars] = useState<number[]>(Array(40).fill(10));
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setBars(bs => bs.map(() => Math.random() * 100));
            }, 100);
        } else {
            setBars(Array(40).fill(10));
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleSaveSettings = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'booked': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase border border-green-200">Agendado</span>;
            case 'question': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase border border-blue-200">Dúvida</span>;
            case 'transfer': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase border border-yellow-200">Transferido</span>;
            case 'missed': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase border border-red-200">Perdida</span>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Header / Tabs */}
            <div className="flex justify-between items-center shrink-0">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-diva-primary text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                        Painel de Controle
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-diva-primary text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Settings size={16} /> Configurações da IA
                    </button>
                </div>
                {activeTab === 'overview' && (
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <Phone size={16} className="text-green-500 animate-pulse" /> Simular Chamada
                    </button>
                )}
            </div>

            {activeTab === 'overview' ? (
                <>
                    {/* Header Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold flex items-center gap-2"><Brain size={24} /> Diva Voice AI</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <p className="text-xs opacity-80 font-mono">SYSTEM ONLINE</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-end relative z-10">
                                <div>
                                    <p className="text-3xl font-bold">142</p>
                                    <p className="text-xs uppercase opacity-70">Chamadas Hoje</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-300">98%</p>
                                    <p className="text-xs uppercase opacity-70">Taxa de Resposta</p>
                                </div>
                            </div>
                            <Activity className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform duration-500" size={120} />
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-diva-light/30 shadow-sm flex flex-col">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Agendamentos Automáticos</h4>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600"><Calendar size={24} /></div>
                                <div>
                                    <p className="text-2xl font-bold text-diva-dark">28</p>
                                    <p className="text-xs text-gray-400">Hoje</p>
                                </div>
                            </div>
                            <p className="text-xs text-green-600 mt-auto font-bold flex items-center gap-1">
                                <Zap size={12} fill="currentColor" /> Economia de 4h da equipe
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-diva-light/30 shadow-sm flex flex-col">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Volume de Ligações</h4>
                            <div className="h-16 mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={callVolumeData}>
                                        <Area type="monotone" dataKey="calls" stroke="#14808C" fill="#14808C" fillOpacity={0.1} />
                                        <Tooltip />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex gap-6 overflow-hidden">

                        {/* Call List */}
                        <div className="w-80 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-diva-dark">Histórico Recente</h3>
                                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold">LIVE</span>
                            </div>
                            <div className="p-2 border-b border-gray-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                    <input type="text" placeholder="Buscar número..." className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-diva-primary focus:bg-white transition-all" />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {mockCalls.map(call => (
                                    <div
                                        key={call.id}
                                        onClick={() => setSelectedCall(call)}
                                        className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-all ${selectedCall?.id === call.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm text-diva-dark">{call.caller}</span>
                                            <span className="text-[10px] text-gray-400">{call.timestamp}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            {getStatusBadge(call.status)}
                                            <span className="text-[10px] text-gray-500 flex items-center"><Clock size={10} className="mr-1" /> {call.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detail View */}
                        <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
                            {selectedCall ? (
                                <>
                                    <div className="p-6 border-b border-diva-light/20 flex justify-between items-center bg-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h2 className="font-bold text-xl text-diva-dark">{selectedCall.caller}</h2>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    São Paulo, SP • {selectedCall.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right mr-4">
                                                <p className="text-[10px] uppercase text-gray-400 font-bold">Sentimento</p>
                                                <div className="flex gap-1 items-center">
                                                    <div className={`w-2 h-2 rounded-full ${selectedCall.sentiment === 'positive' ? 'bg-green-500' : selectedCall.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                                                    <span className="text-sm font-bold capitalizing">{selectedCall.sentiment}</span>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center shadow-lg shadow-green-200">
                                                <Phone size={16} className="mr-2" /> Retornar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-8 overflow-y-auto flex flex-col bg-gray-50/30">
                                        {/* Player Visualizer */}
                                        <div className="bg-diva-dark rounded-2xl p-6 text-white mb-8 flex items-center gap-6 shadow-xl ring-4 ring-gray-100">
                                            <button
                                                onClick={() => setIsPlaying(!isPlaying)}
                                                className="w-12 h-12 bg-white text-diva-dark rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg"
                                            >
                                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                                            </button>
                                            <div className="flex-1 h-12 flex items-center gap-1">
                                                {bars.map((height, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-100"
                                                        style={{ height: `${height}%`, opacity: 0.8 }}
                                                    ></div>
                                                ))}
                                            </div>
                                            <span className="font-mono text-sm font-bold bg-white/10 px-3 py-1 rounded-lg">{selectedCall.duration}</span>
                                        </div>

                                        {/* Transcript */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <MessageSquare size={16} className="text-gray-400" />
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transcrição da Chamada</h4>
                                        </div>

                                        <div className="space-y-6">
                                            {selectedCall.transcript.split('\n').map((line, idx) => {
                                                const isAI = line.startsWith('IA:');
                                                return (
                                                    <div key={idx} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                                                        <div className={`flex gap-3 max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAI ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                                {isAI ? <Brain size={14} /> : <User size={14} />}
                                                            </div>
                                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isAI ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' : 'bg-diva-primary text-white rounded-tr-none'}`}>
                                                                {line.replace(/^(IA:|Cliente:)/, '').trim()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <Mic size={64} className="mx-auto mb-4 opacity-10" />
                                        <p className="font-medium">Selecione uma chamada</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                /* Settings Tab */
                <div className="bg-white rounded-xl border border-diva-light/30 shadow-lg p-8 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                            <Sliders size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-diva-dark">Configuração do Assistente</h2>
                            <p className="text-sm text-gray-500">Personalize como a IA interage com seus pacientes</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Assistente</label>
                            <input
                                type="text"
                                value={aiName}
                                onChange={(e) => setAiName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                            <p className="text-xs text-gray-400 mt-1">Este nome será usado na saudação inicial.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-4">Voz & Tom</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 border-2 border-purple-500 bg-purple-50 rounded-xl relative flex items-center gap-3 transition-all">
                                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700"><Volume2 size={20} /></div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-purple-900">Fernanda (BR)</p>
                                        <p className="text-xs text-purple-600">Natural, Empática</p>
                                    </div>
                                    <CheckCircle size={16} className="absolute top-2 right-2 text-purple-600" />
                                </button>
                                <button className="p-4 border border-gray-200 rounded-xl relative flex items-center gap-3 hover:bg-gray-50 transition-all opacity-60">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600"><Volume2 size={20} /></div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-gray-700">Ricardo (BR)</p>
                                        <p className="text-xs text-gray-500">Formal, Executivo</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-bold text-gray-700">Personalidade</label>
                                <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">{personality}% Amigável</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={personality}
                                onChange={(e) => setPersonality(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Formal</span>
                                <span>Descontraído</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Instruções do Sistema (Prompt)</label>
                            <textarea
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg h-32 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                defaultValue="Você é a assistente virtual da Diva Spa. Seu objetivo é agendar consultas e tirar dúvidas sobre procedimentos estéticos. Seja sempre cordial e use emojis ocasionalmente."
                            ></textarea>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleSaveSettings}
                                className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${isSaved ? 'bg-green-500' : 'bg-diva-dark hover:bg-black'}`}
                            >
                                {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                                {isSaved ? 'Salvo com Sucesso!' : 'Salvar Configurações'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceModule;
