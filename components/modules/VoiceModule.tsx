
import React, { useState } from 'react';
import { CallLog } from '../../types';
import { Phone, Mic, Play, Pause, Search, Settings, Calendar, User, Clock, BarChart2, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from 'recharts';

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
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(mockCalls[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'booked': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Agendado</span>;
          case 'question': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Dúvida</span>;
          case 'transfer': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Transferido</span>;
          case 'missed': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Perdida</span>;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold flex items-center gap-2"><Phone size={24} /> Diva Voice AI</h3>
                    <p className="text-xs opacity-80 mt-1">Sua recepcionista 24h</p>
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
                <Activity className="absolute -right-6 -bottom-6 text-white/10" size={120} />
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
                <p className="text-xs text-green-600 mt-auto font-bold">+ 4h de tempo economizado da equipe</p>
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
                    <h3 className="font-bold text-diva-dark">Histórico</h3>
                    <Settings size={16} className="text-gray-400 cursor-pointer hover:text-diva-primary" />
                </div>
                <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        <input type="text" placeholder="Buscar número..." className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-diva-primary" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {mockCalls.map(call => (
                        <div 
                            key={call.id} 
                            onClick={() => setSelectedCall(call)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-all ${selectedCall?.id === call.id ? 'bg-blue-50 border-l-4 border-l-diva-primary' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm text-diva-dark">{call.caller}</span>
                                <span className="text-[10px] text-gray-400">{call.timestamp}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                {getStatusBadge(call.status)}
                                <span className="text-[10px] text-gray-500 flex items-center"><Clock size={10} className="mr-1"/> {call.duration}</span>
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
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-xl text-diva-dark">{selectedCall.caller}</h2>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        São Paulo, SP • {selectedCall.timestamp}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
                                    Ver no CRM
                                </button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center">
                                    <Phone size={16} className="mr-2" /> Retornar
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto flex flex-col">
                            {/* Player Mock */}
                            <div className="bg-gray-900 rounded-xl p-4 text-white mb-8 flex items-center gap-4 shadow-lg">
                                <button 
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-10 h-10 bg-diva-primary rounded-full flex items-center justify-center hover:bg-white hover:text-diva-primary transition-all"
                                >
                                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
                                </button>
                                <div className="flex-1">
                                    <div className="h-8 flex items-center gap-0.5 opacity-50">
                                        {[...Array(40)].map((_, i) => (
                                            <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${Math.random() * 100}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                                <span className="font-mono text-xs">{selectedCall.duration}</span>
                            </div>

                            {/* Transcript */}
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Transcrição da Chamada</h4>
                            <div className="space-y-4">
                                {selectedCall.transcript.split('\n').map((line, idx) => {
                                    const isAI = line.startsWith('IA:');
                                    return (
                                        <div key={idx} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${isAI ? 'bg-gray-100 text-gray-800 rounded-tl-none' : 'bg-diva-primary/10 text-diva-dark rounded-tr-none border border-diva-primary/20'}`}>
                                                <p className="font-bold text-xs mb-1 opacity-70">{isAI ? 'Diva Voice AI' : 'Cliente'}</p>
                                                {line.replace(/^(IA:|Cliente:)/, '').trim()}
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
                            <Mic size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Selecione uma chamada para ver detalhes</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default VoiceModule;
