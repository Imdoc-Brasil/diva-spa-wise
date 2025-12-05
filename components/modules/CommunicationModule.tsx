
import React, { useState } from 'react';
import { ChatConversation, ChannelType, User, ChatMessage } from '../../types';
import { Search, Send, Paperclip, MessageCircle, Instagram, Mail, MoreVertical, Check, User as UserIcon, Clock, Calendar, DollarSign, Smile, Video } from 'lucide-react';
import NewAppointmentModal from '../modals/NewAppointmentModal';
import ClientProfileModal from '../modals/ClientProfileModal';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';



interface CommunicationModuleProps {
    user: User;
}

const CommunicationModule: React.FC<CommunicationModuleProps> = ({ user }) => {
    const { clients, conversations, addMessage, markConversationAsRead } = useData();
    const { addToast } = useToast();

    // Filter conversations based on user role
    const filteredConversations = conversations.filter(c => {
        if (user.role === 'client') {
            return c.clientId === user.clientId || c.clientId === user.uid; // Match clientId
        }
        return true; // Staff sees all
    });

    const [selectedChatId, setSelectedChatId] = useState<string | null>(filteredConversations.length > 0 ? filteredConversations[0].id : null);
    const [replyText, setReplyText] = useState('');

    // Modal States
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const selectedChat = filteredConversations.find(c => c.id === selectedChatId);

    // Find the real client object from DataContext based on the chat name (for demo linking)
    const currentClient = selectedChat
        ? clients.find(c => c.name === selectedChat.clientName)
        : null;

    const getChannelIcon = (channel: ChannelType) => {
        switch (channel) {
            case 'whatsapp': return <MessageCircle size={16} className="text-green-500" />;
            case 'instagram': return <Instagram size={16} className="text-pink-500" />;
            case 'email': return <Mail size={16} className="text-blue-500" />;
        }
    };

    const handleSend = () => {
        if (!replyText.trim() || !selectedChatId) return;

        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            content: replyText,
            sender: user.role === 'client' ? 'client' : 'staff',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
        };

        addMessage(selectedChatId, newMessage);
        setReplyText('');

        // Simulate Chatbot Response
        if (user.role === 'client') {
            setTimeout(() => {
                const botMessage: ChatMessage = {
                    id: `msg_bot_${Date.now()}`,
                    content: 'Obrigado pela mensagem! Nossa equipe responderá em breve.',
                    sender: 'system',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    read: true
                };
                addMessage(selectedChatId, botMessage);
            }, 2000);
        }
    };

    const handleOpenProfile = () => {
        if (currentClient) {
            setIsProfileModalOpen(true);
        } else {
            addToast('Perfil do cliente não encontrado na base de dados.', 'error');
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">

            {/* LEFT: Conversation List */}
            <div className="w-80 flex flex-col border-r border-diva-light/20 bg-gray-50/50">
                <div className="p-4 border-b border-diva-light/20">
                    <h3 className="font-bold text-diva-dark mb-3">Inbox</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Buscar conversa..." className="w-full pl-9 pr-4 py-2 border border-diva-light/40 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none bg-white" />
                    </div>
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                        <button className="px-3 py-1 bg-diva-dark text-white rounded-full text-xs font-bold whitespace-nowrap">Todos</button>
                        <button className="px-3 py-1 bg-white border border-diva-light/40 text-gray-600 rounded-full text-xs font-medium hover:bg-green-50 hover:text-green-600 whitespace-nowrap">WhatsApp</button>
                        <button className="px-3 py-1 bg-white border border-diva-light/40 text-gray-600 rounded-full text-xs font-medium hover:bg-pink-50 hover:text-pink-600 whitespace-nowrap">Direct</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={`p-4 border-b border-diva-light/10 cursor-pointer hover:bg-white transition-colors group relative
                            ${selectedChatId === chat.id ? 'bg-white border-l-4 border-l-diva-primary shadow-sm' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center">
                                    {chat.unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-diva-primary mr-2"></span>}
                                    <h4 className={`text-sm ${selectedChatId === chat.id || chat.unreadCount > 0 ? 'font-bold text-diva-dark' : 'font-medium text-gray-600'}`}>{chat.clientName}</h4>
                                </div>
                                <span className="text-[10px] text-gray-400">{chat.lastMessageTime}</span>
                            </div>
                            <p className={`text-xs line-clamp-1 mb-2 ${chat.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                            <div className="flex justify-between items-center">
                                <div className="bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm">
                                    {getChannelIcon(chat.channel)}
                                </div>
                                {chat.status === 'resolved' && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Resolvido</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MIDDLE: Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#e5ddd5]/10"> {/* Subtle background reminiscent of chat apps */}
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 px-6 border-b border-diva-light/20 bg-white flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-diva-light/30 flex items-center justify-center text-diva-dark font-bold mr-3">
                                    {selectedChat.clientName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-diva-dark text-sm">{selectedChat.clientName}</h3>
                                    <p className="text-xs text-gray-500 flex items-center">
                                        via {selectedChat.channel} • <span className="ml-1 text-green-600">Online</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="bg-diva-light/10 hover:bg-diva-primary/20 text-diva-primary p-2 rounded-full transition-colors" title="Iniciar Vídeo">
                                    <Video size={20} />
                                </button>
                                <button className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-lg font-bold hover:bg-green-50">
                                    Marcar Resolvido
                                </button>
                                <button className="text-gray-400 hover:text-diva-dark"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')]">
                            {selectedChat.messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-xl shadow-sm relative text-sm
                                    ${msg.sender === 'client' ? 'bg-white text-gray-800 rounded-tl-none' :
                                            msg.sender === 'system' ? 'bg-yellow-50 text-gray-600 text-center text-xs border border-yellow-100 w-full max-w-none' :
                                                'bg-diva-primary text-white rounded-tr-none'}`}>
                                        {msg.content}
                                        <span className={`text-[9px] block text-right mt-1 opacity-70
                                        ${msg.sender === 'client' ? 'text-gray-400' : msg.sender === 'system' ? 'hidden' : 'text-diva-light'}`}>
                                            {msg.timestamp} {msg.read && msg.sender !== 'client' && '✓✓'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-diva-light/20">
                            {/* Quick Replies */}
                            <div className="flex gap-2 mb-3 overflow-x-auto text-xs pb-1">
                                <button onClick={() => setReplyText('Olá! Tudo bem? Como posso ajudar?')} className="px-3 py-1 bg-gray-100 hover:bg-diva-light/20 rounded-full text-gray-600 whitespace-nowrap transition-colors">👋 Saudação</button>
                                <button onClick={() => setReplyText('Temos horários disponíveis para amanhã. Gostaria de agendar?')} className="px-3 py-1 bg-gray-100 hover:bg-diva-light/20 rounded-full text-gray-600 whitespace-nowrap transition-colors">📅 Agendar</button>
                                <button onClick={() => setReplyText('Segue o link para pagamento:')} className="px-3 py-1 bg-gray-100 hover:bg-diva-light/20 rounded-full text-gray-600 whitespace-nowrap transition-colors">💰 Cobrança</button>
                            </div>

                            <div className="flex items-end gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
                                <button className="p-2 text-gray-400 hover:text-diva-primary rounded-full hover:bg-gray-200">
                                    <Paperclip size={20} />
                                </button>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 resize-none max-h-24 py-2"
                                    rows={1}
                                />
                                <button className="p-2 text-gray-400 hover:text-diva-primary rounded-full hover:bg-gray-200">
                                    <Smile size={20} />
                                </button>
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-diva-primary text-white rounded-lg hover:bg-diva-dark shadow-sm transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageCircle size={48} className="mb-4 opacity-20" />
                        <p>Selecione uma conversa para iniciar</p>
                    </div>
                )}
            </div>

            {/* RIGHT: Context Sidebar (Smart Context) */}
            {selectedChat && (
                <div className="w-80 border-l border-diva-light/20 bg-white p-6 flex flex-col overflow-y-auto">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 mx-auto rounded-full bg-diva-light/30 flex items-center justify-center text-2xl font-bold text-diva-dark mb-3">
                            {selectedChat.clientName.charAt(0)}
                        </div>
                        <h3 className="font-bold text-diva-dark text-lg">{selectedChat.clientName}</h3>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">Cliente VIP</span>
                    </div>

                    <div className="space-y-6">
                        {/* Next Appointment */}
                        <div className="bg-diva-light/10 p-4 rounded-xl border border-diva-light/30">
                            <h4 className="text-xs font-bold text-diva-dark uppercase mb-3 flex items-center">
                                <Calendar size={14} className="mr-1" /> Próximo Agendamento
                            </h4>
                            <p className="font-bold text-diva-primary text-sm">Depilação Laser - Perna</p>
                            <p className="text-xs text-gray-600 mt-1">Amanhã, 14:30</p>
                            <p className="text-xs text-gray-500">Sala 01 • Dra. Julia</p>
                        </div>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">LTV</p>
                                <p className="text-sm font-bold text-diva-dark">R$ 3.5k</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Saldo</p>
                                <p className="text-sm font-bold text-green-600">R$ 150</p>
                            </div>
                        </div>

                        {/* Last Notes */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Última Observação</h4>
                            <p className="text-xs text-gray-500 italic bg-yellow-50 p-3 rounded border border-yellow-100">
                                "Cliente prefere sala aquecida. Tem sensibilidade na canela."
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-4 border-t border-diva-light/20 space-y-2">
                            <button
                                onClick={() => setIsAppointmentModalOpen(true)}
                                className="w-full py-2 bg-diva-primary text-white rounded-lg text-xs font-bold hover:bg-diva-dark transition-colors"
                            >
                                Novo Agendamento
                            </button>
                            <button
                                onClick={handleOpenProfile}
                                className={`w-full py-2 border rounded-lg text-xs font-bold transition-colors ${currentClient ? 'border-diva-dark text-diva-dark hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                                disabled={!currentClient}
                            >
                                Ver Perfil Completo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALS */}
            <NewAppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
            />

            {currentClient && (
                <ClientProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    client={currentClient}
                />
            )}
        </div>
    );
};

export default CommunicationModule;
