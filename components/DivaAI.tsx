
import React, { useState, useEffect, useRef } from 'react';
import { AIMessage, User } from '../types';
import { Sparkles, X, Send, User as UserIcon, TrendingUp, FileText, Zap, ChevronRight, Copy } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface DivaAIProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const DivaAI: React.FC<DivaAIProps> = ({ isOpen, onClose, user }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          type: 'text',
          content: `Olá, ${user.displayName.split(' ')[0]}! Sou a **Diva AI**, sua assistente inteligente. Como posso ajudar a otimizar sua operação hoje?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, user, messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Logic
    setTimeout(() => {
      processAIResponse(userMsg.content);
    }, 1500);
  };

  const processAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let response: AIMessage;

    // LOGIC: REVENUE / FINANCE
    if (lowerQuery.includes('faturamento') || lowerQuery.includes('vendas') || lowerQuery.includes('receita')) {
      response = {
        id: Date.now().toString(),
        sender: 'ai',
        type: 'widget_revenue',
        content: 'Aqui está uma análise rápida do seu faturamento hoje.',
        timestamp: new Date(),
        data: {
          total: 7250,
          target: 6000,
          trend: [4000, 3000, 2000, 2780, 1890, 2390, 3490]
        }
      };
    }
    // LOGIC: CONTENT GENERATION
    else if (lowerQuery.includes('post') || lowerQuery.includes('instagram') || lowerQuery.includes('legenda') || lowerQuery.includes('marketing')) {
       response = {
        id: Date.now().toString(),
        sender: 'ai',
        type: 'widget_content',
        content: 'Criei uma sugestão de copy para o Instagram focada em **Depilação a Laser**.',
        timestamp: new Date(),
        data: {
            title: 'Campanha Laser Verão',
            copy: "✨ Pele lisinha o ano todo? Comece agora! \n\nO verão se constrói no inverno. Inicie suas sessões de Depilação a Laser na Diva Spa e diga adeus às lâminas. \n\nAgenda aberta! Link na bio. #DivaSpa #Laser #Estetica"
        }
      };
    }
    // LOGIC: CLIENT SEARCH
    else if (lowerQuery.includes('cliente') || lowerQuery.includes('ana')) {
        response = {
            id: Date.now().toString(),
            sender: 'ai',
            type: 'widget_client',
            content: 'Encontrei o perfil da cliente Ana Silva. Ela é uma cliente **VIP**.',
            timestamp: new Date(),
            data: {
                name: 'Ana Silva',
                ltv: 3500,
                lastVisit: '2023-10-10',
                tags: ['VIP', 'Laser']
            }
        };
    }
    // LOGIC: PROTOCOLS
    else if (lowerQuery.includes('parametro') || lowerQuery.includes('fototipo')) {
         response = {
            id: Date.now().toString(),
            sender: 'ai',
            type: 'widget_protocol',
            content: 'Para **Fototipo IV**, recomendo cautela com a fluência.',
            timestamp: new Date(),
            data: {
                skinType: 'IV',
                fluence: '10-12 J/cm²',
                pulse: '30ms',
                cooling: 'Máximo'
            }
        };
    }
    // FALLBACK
    else {
      response = {
        id: Date.now().toString(),
        sender: 'ai',
        type: 'text',
        content: 'Entendi. Posso ajudar com Faturamento, Marketing, Protocolos ou busca de Clientes. Tente perguntar: "Como está o faturamento hoje?"',
        timestamp: new Date()
      };
    }

    setIsTyping(false);
    setMessages(prev => [...prev, response]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-[70] border-l border-diva-light/30 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-diva-dark to-diva-primary p-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
                 <Sparkles size={20} className="text-yellow-300" />
            </div>
            <div>
                <h3 className="font-bold text-lg leading-none">Diva AI</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-wider font-medium">Copilot Inteligente</p>
            </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-diva-primary flex items-center justify-center text-white shadow-sm mr-2 mt-1 shrink-0">
                          <Sparkles size={14} />
                      </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm 
                      ${msg.sender === 'user' 
                        ? 'bg-diva-dark text-white rounded-br-none' 
                        : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'}`}>
                      
                      {/* Text Content */}
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                      {/* WIDGET: REVENUE */}
                      {msg.type === 'widget_revenue' && msg.data && (
                          <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                              <div className="flex justify-between items-end mb-2">
                                  <div>
                                      <p className="text-xs text-gray-500 uppercase">Total Hoje</p>
                                      <p className="text-xl font-bold text-diva-primary">R$ {msg.data.total}</p>
                                  </div>
                                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">+20%</span>
                              </div>
                              <div className="h-16 w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={msg.data.trend.map((v:number, i:number) => ({v}))}>
                                          <Area type="monotone" dataKey="v" stroke="#14808C" fill="#14808C" fillOpacity={0.2} />
                                      </AreaChart>
                                  </ResponsiveContainer>
                              </div>
                          </div>
                      )}

                      {/* WIDGET: CLIENT CARD */}
                      {msg.type === 'widget_client' && msg.data && (
                          <div className="mt-3 bg-white rounded-xl p-3 border border-diva-light/40 shadow-sm flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-diva-light/30 flex items-center justify-center font-bold text-diva-dark">
                                  {msg.data.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                  <p className="font-bold text-diva-dark">{msg.data.name}</p>
                                  <div className="flex gap-1 mt-1">
                                      {msg.data.tags.map((t: string) => (
                                          <span key={t} className="text-[9px] bg-gray-100 border border-gray-200 px-1 rounded">{t}</span>
                                      ))}
                                  </div>
                              </div>
                              <ChevronRight size={16} className="text-gray-400" />
                          </div>
                      )}

                       {/* WIDGET: CONTENT */}
                       {msg.type === 'widget_content' && msg.data && (
                           <div className="mt-3 bg-purple-50 rounded-xl p-3 border border-purple-100">
                               <div className="flex justify-between items-center mb-2">
                                   <span className="text-[10px] font-bold text-purple-700 uppercase">Instagram Caption</span>
                                   <button className="text-purple-600 hover:text-purple-800"><Copy size={12} /></button>
                               </div>
                               <p className="text-xs italic text-purple-900 bg-white/50 p-2 rounded border border-purple-100/50">
                                   {msg.data.copy}
                               </p>
                           </div>
                       )}

                        {/* WIDGET: PROTOCOL */}
                        {msg.type === 'widget_protocol' && msg.data && (
                           <div className="mt-3 bg-orange-50 rounded-xl p-3 border border-orange-100">
                               <div className="flex items-center gap-2 mb-2">
                                   <Zap size={14} className="text-orange-500" />
                                   <span className="text-xs font-bold text-orange-700 uppercase">Protocolo Seguro</span>
                               </div>
                               <div className="grid grid-cols-2 gap-2 text-xs">
                                   <div className="bg-white p-2 rounded border border-orange-100">
                                       <span className="block text-gray-400">Fluência</span>
                                       <span className="font-bold text-gray-700">{msg.data.fluence}</span>
                                   </div>
                                   <div className="bg-white p-2 rounded border border-orange-100">
                                       <span className="block text-gray-400">Resfriamento</span>
                                       <span className="font-bold text-gray-700">{msg.data.cooling}</span>
                                   </div>
                               </div>
                           </div>
                       )}

                  </div>
              </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-diva-primary flex items-center justify-center text-white shadow-sm mr-2 mt-1">
                       <Sparkles size={14} className="animate-pulse" />
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none text-xs text-gray-400 italic">
                      Diva está digitando...
                  </div>
             </div>
          )}
          <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-diva-light/20">
          <div className="relative">
              <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte à Diva AI..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-diva-light/30 rounded-xl focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none transition-all text-sm"
              />
              <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-diva-primary text-white rounded-lg hover:bg-diva-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                  <Send size={16} />
              </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
               <button onClick={() => setInput('Como está o faturamento hoje?')} className="px-3 py-1 bg-white border border-diva-light/30 rounded-full text-[10px] font-bold text-gray-600 hover:bg-diva-primary hover:text-white whitespace-nowrap transition-colors">
                   💰 Faturamento
               </button>
               <button onClick={() => setInput('Criar post para Instagram sobre Botox')} className="px-3 py-1 bg-white border border-diva-light/30 rounded-full text-[10px] font-bold text-gray-600 hover:bg-diva-primary hover:text-white whitespace-nowrap transition-colors">
                   📱 Marketing
               </button>
               <button onClick={() => setInput('Parâmetros para Fototipo IV')} className="px-3 py-1 bg-white border border-diva-light/30 rounded-full text-[10px] font-bold text-gray-600 hover:bg-diva-primary hover:text-white whitespace-nowrap transition-colors">
                   ⚡ Protocolos
               </button>
          </div>
      </div>
    </div>
  );
};

export default DivaAI;
