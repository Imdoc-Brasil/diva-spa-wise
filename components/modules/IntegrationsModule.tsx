
import React, { useState } from 'react';
import { Integration, Webhook } from '../../types';
import { Search, Power, Settings, RefreshCw, Plus, Trash2, CheckCircle, AlertCircle, Globe, MessageCircle, CreditCard, Calendar, Mail, Lock } from 'lucide-react';

import { useUnitData } from '../hooks/useUnitData';

const mockIntegrations: Integration[] = [
    { id: 'int1', name: 'WhatsApp Business API', category: 'communication', description: 'Envio de mensagens automáticas e lembretes.', connected: true, icon: 'whatsapp', configRequired: true },
    { id: 'int2', name: 'Google Calendar', category: 'utility', description: 'Sincronize a agenda do staff com o Google.', connected: true, icon: 'calendar', configRequired: false },
    { id: 'int3', name: 'Stripe Payments', category: 'finance', description: 'Processamento de cartões de crédito e assinaturas.', connected: true, icon: 'credit-card', configRequired: true },
    { id: 'int4', name: 'Mailchimp', category: 'marketing', description: 'Sincronização de contatos para newsletters.', connected: false, icon: 'mail', configRequired: true },
    { id: 'int5', name: 'OpenAI (Diva AI)', category: 'utility', description: 'Motor de inteligência artificial para o assistente.', connected: true, icon: 'cpu', configRequired: true },
    { id: 'int6', name: 'Conta Azul', category: 'finance', description: 'Exportação automática de notas fiscais.', connected: false, icon: 'file-text', configRequired: true },
];

const mockWebhooks: Webhook[] = [
    { id: 'wh1', event: 'appointment.created', url: 'https://hooks.zapier.com/hooks/catch/123/abc', status: 'active', lastFired: '10 min atrás' },
    { id: 'wh2', event: 'client.nps_submitted', url: 'https://api.slack.com/webhook/xyz', status: 'active', lastFired: '1h atrás' },
];

const IntegrationsModule: React.FC = () => {
    const { selectedUnitId, units } = useUnitData();
    const [activeTab, setActiveTab] = useState<'store' | 'webhooks'>('store');
    const [integrations] = useState(mockIntegrations); // Integrations definitions are static
    // Removed simple webhooks state in favor of unit-specific state below
    const [searchTerm, setSearchTerm] = useState('');

    // Mock database of connections per unit (unitId -> integrationId[])
    // Initializing with some dummy data for demonstration
    const [unitConnections, setUnitConnections] = useState<Record<string, string[]>>({
        '1': ['int1', 'int3', 'int5'], // Unit 1 connections
        '2': ['int2', 'int6'],         // Unit 2 connections
        '3': ['int1']                  // Unit 3 connections
    });

    // Mock database of webhooks per unit
    const [unitWebhooks, setUnitWebhooks] = useState<Record<string, Webhook[]>>({
        '1': [mockWebhooks[0]], // Unit 1 has appointment webhook
        '2': [mockWebhooks[1]], // Unit 2 has NPS webhook
        '3': []
    });

    const currentWebhooks = selectedUnitId === 'all' ? [] : (unitWebhooks[selectedUnitId] || []);

    const isConnected = (integrationId: string) => {
        if (selectedUnitId === 'all') return false;
        return unitConnections[selectedUnitId]?.includes(integrationId) || false;
    };

    const handleToggleIntegration = (id: string) => {
        if (selectedUnitId === 'all') {
            alert("Por favor, selecione uma unidade específica no menu superior para gerenciar suas integrações.");
            return;
        }

        setUnitConnections(prev => {
            const current = prev[selectedUnitId] || [];
            const connected = current.includes(id);
            let newConnections;

            if (connected) {
                newConnections = current.filter(cid => cid !== id);
            } else {
                newConnections = [...current, id];
            }

            return { ...prev, [selectedUnitId]: newConnections };
        });
    };

    const getIcon = (name: string) => {
        switch (name) {
            case 'whatsapp': return <MessageCircle size={24} className="text-green-500" />;
            case 'calendar': return <Calendar size={24} className="text-blue-500" />;
            case 'credit-card': return <CreditCard size={24} className="text-indigo-500" />;
            case 'mail': return <Mail size={24} className="text-yellow-500" />;
            default: return <Globe size={24} className="text-gray-500" />;
        }
    };

    const filteredIntegrations = integrations.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Header */}
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-diva-dark">Diva Connect</h2>
                        <p className="text-sm text-gray-500">Hub de Integrações e API</p>
                    </div>
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('store')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'store' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500'}`}
                        >
                            App Store
                        </button>
                        <button
                            onClick={() => setActiveTab('webhooks')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'webhooks' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500'}`}
                        >
                            Webhooks & API
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden flex flex-col">

                {activeTab === 'store' && (
                    <div className="flex-1 flex flex-col">
                        <div className="p-6 border-b border-diva-light/20">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar integração..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-diva-light/40 rounded-xl focus:ring-2 focus:ring-diva-primary/20 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {selectedUnitId === 'all' && (
                                <div className="mb-6 bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl flex items-center gap-3">
                                    <AlertCircle size={20} />
                                    <p className="text-sm">Você está visualizando o modo consolidado. Para conectar ou desconectar integrações, selecione uma unidade específica.</p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredIntegrations.map(int => {
                                    const connected = isConnected(int.id);
                                    return (
                                        <div key={int.id} className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    {getIcon(int.icon)}
                                                </div>
                                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase
                                            ${connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {connected ? <CheckCircle size={10} /> : <Power size={10} />}
                                                    {connected ? 'Ativo' : 'Inativo'}
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-diva-dark text-lg mb-1">{int.name}</h3>
                                            <p className="text-sm text-gray-500 mb-6 flex-1">{int.description}</p>

                                            <div className="flex gap-3 mt-auto">
                                                <button
                                                    onClick={() => handleToggleIntegration(int.id)}
                                                    disabled={selectedUnitId === 'all'}
                                                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors
                                                ${selectedUnitId === 'all' ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-transparent' :
                                                            connected ? 'border-red-200 text-red-600 hover:bg-red-50' : 'bg-diva-primary text-white border-transparent hover:bg-diva-dark'}`}
                                                >
                                                    {connected ? 'Desconectar' : 'Conectar'}
                                                </button>
                                                {connected && int.configRequired && (
                                                    <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                                                        <Settings size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'webhooks' && (
                    <div className="flex-1 flex flex-col p-6 bg-gray-50">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3">
                            <div className="bg-white p-2 rounded-full h-max text-blue-500 shadow-sm"><Lock size={20} /></div>
                            <div>
                                <h4 className="font-bold text-blue-800 text-sm">Área de Desenvolvedor</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                    Configure endpoints para receber notificações em tempo real sobre eventos do sistema.
                                    Use sua <strong>API Key Mestra</strong> para autenticação.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-diva-dark">Webhooks Configurados</h3>
                            <button
                                disabled={selectedUnitId === 'all'}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors
                                ${selectedUnitId === 'all' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-diva-dark text-white hover:bg-diva-primary'}`}
                            >
                                <Plus size={16} className="mr-2" /> Novo Webhook
                            </button>
                        </div>

                        <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Evento</th>
                                        <th className="px-6 py-4">Endpoint URL</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Último Disparo</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {currentWebhooks.length > 0 ? (
                                        currentWebhooks.map(hook => (
                                            <tr key={hook.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-mono text-diva-primary font-bold">{hook.event}</td>
                                                <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{hook.url}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${hook.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {hook.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{hook.lastFired}</td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    <button className="p-1.5 text-gray-400 hover:text-diva-primary hover:bg-gray-100 rounded"><RefreshCw size={14} /></button>
                                                    <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded"><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                                                {selectedUnitId === 'all'
                                                    ? "Selecione uma unidade para visualizar os webhooks configurados."
                                                    : "Nenhum webhook configurado para esta unidade."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default IntegrationsModule;
