
import React, { useState } from 'react';
import { ClientFeedback, FeedbackSentiment } from '../../types';
import { Smile, Meh, Frown, MessageSquare, ThumbsUp, ThumbsDown, Filter, CheckCircle, AlertTriangle, Gift, TrendingUp, User } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const mockFeedbacks: ClientFeedback[] = [
    { id: 'f1', clientId: 'c1', clientName: 'Ana Silva', npsScore: 10, comment: 'Amei o atendimento da Dra. Julia! O laser foi indolor.', sentiment: 'positive', tags: ['Atendimento', 'Técnica'], date: '2023-10-27', status: 'new', staffMentioned: 'Dra. Julia' },
    { id: 'f2', clientId: 'c2', clientName: 'Beatriz Costa', npsScore: 6, comment: 'O resultado é bom, mas a sala estava muito fria e demoraram para me atender.', sentiment: 'neutral', tags: ['Ambiente', 'Pontualidade'], date: '2023-10-26', status: 'new' },
    { id: 'f3', clientId: 'c3', clientName: 'Carla Dias', npsScore: 2, comment: 'Não consegui agendar pelo app e ninguém atende o telefone.', sentiment: 'negative', tags: ['Agendamento', 'Comunicação'], date: '2023-10-25', status: 'resolved' },
    { id: 'f4', clientId: 'c4', clientName: 'Fernanda Lima', npsScore: 10, comment: 'Melhor spa da cidade. O chá de hibisco é maravilhoso.', sentiment: 'positive', tags: ['Experiência'], date: '2023-10-24', status: 'addressed' },
];

const sentimentData = [
    { name: 'Promotores (9-10)', value: 65, color: '#22c55e' },
    { name: 'Neutros (7-8)', value: 25, color: '#eab308' },
    { name: 'Detratores (0-6)', value: 10, color: '#ef4444' },
];

const ReputationModule: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'negative'>('all');
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);

  const handleResolve = (id: string) => {
      setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: 'resolved' } : f));
  };

  const filteredFeedbacks = filter === 'all' ? feedbacks : feedbacks.filter(f => f.sentiment === 'negative' || f.sentiment === 'neutral');

  const getNpsColor = (score: number) => {
      if (score >= 9) return 'text-green-500';
      if (score >= 7) return 'text-yellow-500';
      return 'text-red-500';
  };

  const getSentimentIcon = (sentiment: FeedbackSentiment) => {
      switch(sentiment) {
          case 'positive': return <Smile size={20} className="text-green-500" />;
          case 'neutral': return <Meh size={20} className="text-yellow-500" />;
          case 'negative': return <Frown size={20} className="text-red-500" />;
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">NPS Atual</p>
                    <h3 className="text-4xl font-bold text-diva-dark flex items-baseline">
                        72 <span className="text-sm font-normal text-gray-400 ml-2">/ 100</span>
                    </h3>
                    <p className="text-xs text-green-600 font-bold mt-1 flex items-center"><TrendingUp size={12} className="mr-1"/> Zona de Qualidade</p>
                </div>
                <div className="h-16 w-16">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={sentimentData} dataKey="value" innerRadius={15} outerRadius={25} paddingAngle={2}>
                                {sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Principais Elogios</p>
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">Atendimento</span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">Técnica Laser</span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">Limpeza</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Pontos de Atenção</p>
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">Atraso</span>
                    <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">Temperatura Sala</span>
                </div>
            </div>
        </div>

        {/* Feed Section */}
        <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-diva-light/20 flex justify-between items-center bg-gray-50">
                <div>
                    <h3 className="font-bold text-diva-dark text-lg">Mural de Feedback</h3>
                    <p className="text-sm text-gray-500">Opiniões reais coletadas via Totem e App.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-diva-dark text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
                    >
                        Todos
                    </button>
                    <button 
                        onClick={() => setFilter('negative')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'negative' ? 'bg-red-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
                    >
                        Apenas Críticas
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredFeedbacks.map(feedback => (
                    <div key={feedback.id} className="border border-gray-200 rounded-xl p-5 flex gap-4 hover:shadow-md transition-shadow bg-white group">
                        {/* Score Box */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border-2 ${getNpsColor(feedback.npsScore)} border-current`}>
                                {feedback.npsScore}
                            </div>
                            <div className="mt-1">{getSentimentIcon(feedback.sentiment)}</div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-diva-dark flex items-center">
                                        {feedback.clientName}
                                        {feedback.staffMentioned && (
                                            <span className="ml-2 text-[10px] bg-diva-light/20 text-diva-dark px-2 py-0.5 rounded-full font-normal flex items-center">
                                                <User size={10} className="mr-1"/> {feedback.staffMentioned}
                                            </span>
                                        )}
                                    </h4>
                                    <p className="text-xs text-gray-400">{new Date(feedback.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    {feedback.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                "{feedback.comment}"
                            </p>

                            {/* Actions for Detractors */}
                            {feedback.sentiment !== 'positive' && feedback.status !== 'resolved' && (
                                <div className="mt-3 flex gap-2 animate-in fade-in">
                                    <button className="text-xs bg-diva-primary text-white px-3 py-1.5 rounded font-bold hover:bg-diva-dark flex items-center shadow-sm">
                                        <MessageSquare size={12} className="mr-1" /> Responder WhatsApp
                                    </button>
                                    <button className="text-xs bg-white border border-diva-accent text-diva-accent px-3 py-1.5 rounded font-bold hover:bg-orange-50 flex items-center">
                                        <Gift size={12} className="mr-1" /> Enviar Voucher
                                    </button>
                                    <button 
                                        onClick={() => handleResolve(feedback.id)}
                                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded font-bold hover:bg-green-100 hover:text-green-700 flex items-center ml-auto"
                                    >
                                        <CheckCircle size={12} className="mr-1" /> Marcar Resolvido
                                    </button>
                                </div>
                            )}
                            
                            {feedback.status === 'resolved' && (
                                <div className="mt-2 text-xs text-green-600 flex items-center font-bold">
                                    <CheckCircle size={12} className="mr-1" /> Tratado pela equipe
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

export default ReputationModule;
