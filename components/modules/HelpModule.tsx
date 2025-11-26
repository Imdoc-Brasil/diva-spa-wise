
import React, { useState } from 'react';
import { HelpArticle, SupportTicket } from '../../types';
import { Search, BookOpen, MessageSquare, CheckCircle, AlertTriangle, PlayCircle, Terminal, Send, LifeBuoy, ExternalLink } from 'lucide-react';

const mockArticles: HelpArticle[] = [
    { id: 'a1', title: 'Como realizar o Fechamento de Caixa?', category: 'finance', content: 'O fechamento deve ser feito diariamente ao final do expediente...', views: 125 },
    { id: 'a2', title: 'Criando um novo Protocolo de Laser', category: 'clinical', content: 'Acesse Configurações > Fichas Técnicas para definir os parâmetros...', views: 89 },
    { id: 'a3', title: 'Integração com WhatsApp API', category: 'system', content: 'Para conectar, escaneie o QR Code na aba Integrações...', views: 45 },
    { id: 'a4', title: 'Primeiros passos no Diva Spa', category: 'getting_started', content: 'Bem-vindo! Comece cadastrando sua equipe e serviços...', views: 320 },
];

const mockTickets: SupportTicket[] = [
    { id: 't1', subject: 'Erro ao gerar Nota Fiscal', status: 'open', priority: 'high', createdAt: '2023-10-27' },
    { id: 't2', subject: 'Dúvida sobre comissão parcelada', status: 'closed', priority: 'low', createdAt: '2023-10-20' },
];

const HelpModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'tickets'>('knowledge');
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState(mockTickets);

  const filteredArticles = mockArticles.filter(art => art.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleNewTicket = () => {
      const subject = prompt("Descreva o problema resumidamente:");
      if(subject) {
          setTickets([{ id: `t_${Date.now()}`, subject, status: 'open', priority: 'low', createdAt: new Date().toISOString().split('T')[0] }, ...tickets]);
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-xl shadow-lg shrink-0 text-white relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-serif font-bold mb-2">Central de Ajuda</h2>
                <p className="text-blue-100 opacity-90 max-w-xl">
                    Encontre tutoriais, tire dúvidas e resolva problemas técnicos. Nossa equipe está pronta para ajudar você a extrair o máximo do Diva Spa.
                </p>
                
                <div className="mt-6 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Como podemos ajudar hoje?" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 outline-none shadow-md"
                        />
                    </div>
                    <button 
                        onClick={() => setActiveTab('tickets')}
                        className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/30 transition-colors flex items-center"
                    >
                        <MessageSquare size={18} className="mr-2" /> Meus Chamados
                    </button>
                </div>
            </div>
            <LifeBuoy className="absolute right-0 bottom-0 text-white/10 -mb-10 -mr-10" size={200} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-6 overflow-hidden">
            
            {/* Left: Content */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
                
                {activeTab === 'knowledge' && (
                    <div className="flex-1 overflow-y-auto p-8">
                        <h3 className="font-bold text-diva-dark text-lg mb-6 flex items-center">
                            <BookOpen size={20} className="mr-2 text-diva-primary" /> Base de Conhecimento
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredArticles.map(article => (
                                <div key={article.id} className="p-5 border border-gray-200 rounded-xl hover:border-diva-primary hover:shadow-md transition-all cursor-pointer group bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                            {article.category.replace('_', ' ')}
                                        </span>
                                        <ExternalLink size={14} className="text-gray-300 group-hover:text-diva-primary" />
                                    </div>
                                    <h4 className="font-bold text-diva-dark mb-2">{article.title}</h4>
                                    <p className="text-sm text-gray-500 line-clamp-2">{article.content}</p>
                                    <div className="mt-4 flex items-center text-xs text-gray-400">
                                        <PlayCircle size={12} className="mr-1" /> Videoaula disponível
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 className="font-bold text-diva-dark text-lg mb-4 mt-10 flex items-center">
                            <Terminal size={20} className="mr-2 text-gray-600" /> Atalhos de Teclado
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center">
                                <span className="text-sm text-gray-600">Busca Global</span>
                                <kbd className="bg-white border border-gray-300 rounded px-2 py-0.5 text-xs font-mono font-bold text-gray-500">Cmd+K</kbd>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center">
                                <span className="text-sm text-gray-600">Novo Agendamento</span>
                                <kbd className="bg-white border border-gray-300 rounded px-2 py-0.5 text-xs font-mono font-bold text-gray-500">N</kbd>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center">
                                <span className="text-sm text-gray-600">Fechar Modal</span>
                                <kbd className="bg-white border border-gray-300 rounded px-2 py-0.5 text-xs font-mono font-bold text-gray-500">Esc</kbd>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center">
                                <span className="text-sm text-gray-600">Salvar</span>
                                <kbd className="bg-white border border-gray-300 rounded px-2 py-0.5 text-xs font-mono font-bold text-gray-500">Cmd+S</kbd>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-diva-dark text-lg">Meus Chamados de Suporte</h3>
                            <button 
                                onClick={handleNewTicket}
                                className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark shadow-md"
                            >
                                <Send size={16} className="mr-2" /> Abrir Novo Chamado
                            </button>
                        </div>

                        <div className="space-y-3">
                            {tickets.map(ticket => (
                                <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-xs text-gray-400">#{ticket.id}</span>
                                            <h4 className="font-bold text-diva-dark">{ticket.subject}</h4>
                                        </div>
                                        <p className="text-xs text-gray-500">Aberto em: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {ticket.status === 'open' ? 'Em Aberto' : 'Resolvido'}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {ticket.priority === 'high' ? 'Alta Prioridade' : 'Normal'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Right: System Status */}
            <div className="w-80 bg-white rounded-xl border border-diva-light/30 shadow-sm p-6 flex flex-col">
                <h3 className="font-bold text-diva-dark text-sm mb-6">Status do Sistema</h3>
                
                <div className="space-y-4 flex-1">
                    {[
                        { name: 'Banco de Dados', status: 'online' },
                        { name: 'API WhatsApp', status: 'online' },
                        { name: 'Emissão de NFe', status: 'maintenance' },
                        { name: 'Servidor de Imagens', status: 'online' },
                        { name: 'Gateway de Pagamento', status: 'online' },
                    ].map((sys, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{sys.name}</span>
                            {sys.status === 'online' ? (
                                <span className="flex items-center text-green-600 text-xs font-bold">
                                    <CheckCircle size={12} className="mr-1" /> Online
                                </span>
                            ) : (
                                <span className="flex items-center text-yellow-600 text-xs font-bold">
                                    <AlertTriangle size={12} className="mr-1" /> Manutenção
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                        Versão 2.4.0 (Stable) <br/>
                        Último deploy: Há 2h
                    </p>
                </div>
            </div>

        </div>
    </div>
  );
};

export default HelpModule;
