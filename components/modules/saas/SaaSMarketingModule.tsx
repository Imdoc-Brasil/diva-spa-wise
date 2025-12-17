
import React, { useState, useMemo, useEffect } from 'react';
import {
    Zap, Mail, MessageCircle, Clock, Plus, Play, Pause,
    MoreHorizontal, ArrowRight, Settings, Trash2, Bot,
    Sparkles, LayoutTemplate, MousePointerClick
} from 'lucide-react';
import { useToast } from '../../ui/ToastContext';
import { MarketingCampaign, MessageTemplate, AutomationActionType } from '../../../types_marketing';
import { automationService } from '../../../services/saas/AutomationService';

const MOCK_TEMPLATES: MessageTemplate[] = [
    {
        id: 'tpl_revenue_report',
        name: 'Email - Relatório Calculadora',
        channel: 'email',
        subject: 'Seu Relatório de Potencial I\'mDoc Chegou 🚀',
        content: 'Olá {{name}},\n\nSua análise de faturamento indica que você pode crescer R$ {{potential}}.\n\nVeja o anexo.',
        isAiPowered: false
    },
    {
        id: 'tpl_whats_followup',
        name: 'Whats - Follow up Calculadora',
        channel: 'whatsapp',
        content: 'Oi {{name}}, conseguiu ver o relatório? Fiquei impressionado com o potencial da {{company}}.',
        isAiPowered: true
    }
];

const SaaSMarketingModule: React.FC = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'campaigns' | 'templates'>('campaigns');
    const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Partial<MarketingCampaign>>({ steps: [] });

    // Load Campaigns on Mount
    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        setIsLoading(true);
        try {
            const data = await automationService.listCampaigns();
            setCampaigns(data);
        } catch (error) {
            console.error(error);
            addToast('Erro ao carregar campanhas', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // --- HELPER FUNCTIONS ---

    const getActionIcon = (type: AutomationActionType) => {
        switch (type) {
            case 'SEND_EMAIL': return <Mail size={16} className="text-blue-400" />;
            case 'SEND_WHATSAPP': return <MessageCircle size={16} className="text-green-400" />;
            case 'WAIT_DELAY': return <Clock size={16} className="text-yellow-400" />;
            case 'AI_GENERATE_CONTENT': return <Sparkles size={16} className="text-purple-400" />;
            case 'START_CAMPAIGN': return <Play size={16} className="text-pink-400" />;
            default: return <Settings size={16} className="text-slate-400" />;
        }
    };

    const getActionLabel = (step: any) => {
        switch (step.type) {
            case 'SEND_EMAIL': return `Enviar Email (${step.config.templateId || 'Selecionar'})`;
            case 'SEND_WHATSAPP': return `Enviar WhatsApp (${step.config.templateId || 'Selecionar'})`;
            case 'WAIT_DELAY': return `Esperar ${step.config.delayMinutes} minutos`;
            case 'AI_GENERATE_CONTENT': return `IA: ${step.config.prompt || 'Gerar Conteúdo'}`;
            case 'ADD_TAG': return `Adicionar Tag: ${step.config.tag}`;
            case 'START_CAMPAIGN': return `Iniciar Fluxo: ${step.config.templateId || 'Selecionar'}`;
            default: return step.type;
        }
    };

    const handleCreateCampaign = () => {
        setEditingCampaign({
            id: crypto.randomUUID(),
            name: 'Nova Automação',
            status: 'draft',
            trigger: { type: 'LEAD_CREATED' },
            steps: [],
            stats: { enrolled: 0, completed: 0, converted: 0 }
        });
        setEditorOpen(true);
    };

    const handleSaveCampaign = async () => {
        if (!editingCampaign.name) return addToast('Dê um nome para a campanha', 'error');

        try {
            await automationService.saveCampaign(editingCampaign as MarketingCampaign);
            addToast('Automação salva com sucesso!', 'success');
            setEditorOpen(false);
            loadCampaigns(); // Refresh list
        } catch (e) {
            addToast('Erro ao salvar', 'error');
        }
    };

    const addStep = (type: AutomationActionType) => {
        const newStep = {
            id: crypto.randomUUID(),
            type,
            config: type === 'WAIT_DELAY' ? { delayMinutes: 30 } : {}
        };
        setEditingCampaign(prev => ({
            ...prev,
            steps: [...(prev.steps || []), newStep]
        }));
    };

    return (
        <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Bot className="text-purple-500" size={32} />
                        Automação & IA
                    </h2>
                    <p className="text-slate-400">Configure seus funis de venda automáticos e deixe a IA trabalhar.</p>
                </div>
                <button
                    onClick={handleCreateCampaign}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                    <Plus size={20} /> Nova Automação
                </button>
            </div>

            {/* TABS */}
            <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('campaigns')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'campaigns' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Fluxos Ativos
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'templates' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Templates de Mensagem
                </button>
            </div>

            {/* CONTENT */}
            {activeTab === 'campaigns' && !editorOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(camp => (
                        <div key={camp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap size={80} />
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${camp.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {camp.status === 'active' ? 'Em Execução' : 'Rascunho'}
                                </span>
                                <button className="text-slate-500 hover:text-white"><MoreHorizontal size={20} /></button>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{camp.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                                <MousePointerClick size={16} /> Gatilho: <span className="text-purple-400">{camp.trigger.type}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-800 mb-4">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-white">{camp.stats.enrolled}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Entraram</p>
                                </div>
                                <div className="text-center border-l border-slate-800">
                                    <p className="text-2xl font-black text-blue-400">{camp.stats.completed}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Concluídos</p>
                                </div>
                                <div className="text-center border-l border-slate-800">
                                    <p className="text-2xl font-black text-emerald-400">{camp.stats.converted}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Vendas</p>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-2">Preview do Fluxo</p>
                                {camp.steps.slice(0, 3).map((step, idx) => (
                                    <div key={step.id} className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-xs font-bold text-slate-400">
                                            {idx + 1}
                                        </div>
                                        {getActionIcon(step.type)}
                                        <span className="truncate">{getActionLabel(step)}</span>
                                    </div>
                                ))}
                                {camp.steps.length > 3 && (
                                    <div className="text-center text-xs text-slate-500 pt-1">+ {camp.steps.length - 3} passos</div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Blank State Card */}
                    <button onClick={handleCreateCampaign} className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus size={32} className="text-slate-500 group-hover:text-purple-400" />
                        </div>
                        <h3 className="font-bold text-slate-400 group-hover:text-white">Criar Nova Automação</h3>
                    </button>
                </div>
            )}

            {/* FLOW EDITOR */}
            {editorOpen && (
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setEditorOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><ArrowRight className="rotate-180" /></button>
                            <input
                                value={editingCampaign.name}
                                onChange={e => setEditingCampaign(prev => ({ ...prev, name: e.target.value }))}
                                className="bg-transparent text-xl font-bold text-white outline-none placeholder-slate-600 w-96"
                                placeholder="Nome da Automação..."
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-white/10">
                                <span className="text-xs text-slate-400 uppercase font-bold">Gatilho:</span>
                                <select
                                    className="bg-transparent text-sm font-bold text-purple-400 outline-none"
                                    value={editingCampaign.trigger?.type}
                                    onChange={(e) => setEditingCampaign(prev => ({ ...prev, trigger: { ...prev.trigger, type: e.target.value as any } }))}
                                >
                                    <option value="LEAD_CREATED">Novo Lead Criado</option>
                                    <option value="TAG_ADDED">Tag Adicionada</option>
                                    <option value="STAGE_CHANGED">Mudança de Fase</option>
                                </select>
                            </div>
                            <button onClick={handleSaveCampaign} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors">
                                Salvar & Ativar
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">

                        {/* LEFT: Nodes Visualization */}
                        <div className="flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-950 p-8 overflow-y-auto relative">
                            <div className="max-w-xl mx-auto space-y-6 pb-20">
                                {/* Trigger Node */}
                                <div className="flex justify-center">
                                    <div className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-purple-900/40 flex items-center gap-2">
                                        <Zap size={18} />
                                        Quando: {editingCampaign.trigger?.type === 'TAG_ADDED' ? 'Tag Adicionada' : 'Lead Criado'}
                                    </div>
                                </div>

                                {/* Connector Line */}
                                <div className="w-0.5 h-6 bg-slate-700 mx-auto"></div>

                                {/* Steps */}
                                {editingCampaign.steps?.map((step, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="bg-slate-800 border-2 border-slate-700 hover:border-purple-500 p-4 rounded-xl shadow-lg relative z-10 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${step.type === 'WAIT_DELAY' ? 'bg-yellow-500/20' : step.type.includes('AI') ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                                                        {getActionIcon(step.type)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{step.type.replace(/_/g, ' ')}</h4>
                                                        <p className="text-xs text-slate-400">{getActionLabel(step)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setEditingCampaign(prev => ({ ...prev, steps: prev.steps?.filter(s => s.id !== step.id) }))}
                                                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Connector Line below */}
                                        {idx < (editingCampaign.steps?.length || 0) - 1 && (
                                            <div className="w-0.5 h-6 bg-slate-700 mx-auto"></div>
                                        )}
                                    </div>
                                ))}

                                {/* Add Button */}
                                <div className="flex justify-center pt-2">
                                    <div className="dropdown dropdown-top dropdown-end">
                                        <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 hover:border-white hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all">
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* RIGHT: Toolbox */}
                        <div className="w-80 bg-slate-900 border-l border-white/5 p-4 overflow-y-auto">
                            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Ferramentas</h3>

                            <div className="space-y-3">
                                <p className="text-xs text-slate-500 font-bold mb-2">Comunicação</p>
                                <button onClick={() => addStep('SEND_EMAIL')} className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors group">
                                    <Mail className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
                                    <div>
                                        <span className="block text-white font-bold text-sm">Enviar Email</span>
                                        <span className="block text-slate-500 text-xs">Template ou Custom</span>
                                    </div>
                                </button>
                                <button onClick={() => addStep('SEND_WHATSAPP')} className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors group">
                                    <MessageCircle className="text-green-400 group-hover:scale-110 transition-transform" size={20} />
                                    <div>
                                        <span className="block text-white font-bold text-sm">Enviar WhatsApp</span>
                                        <span className="block text-slate-500 text-xs">Texto ou Mídia</span>
                                    </div>
                                </button>

                                <p className="text-xs text-slate-500 font-bold mb-2 mt-6">Inteligência (IA)</p>
                                <button onClick={() => addStep('AI_GENERATE_CONTENT')} className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 hover:from-purple-900 hover:to-indigo-900 border border-purple-500/30 rounded-xl text-left transition-colors group">
                                    <Sparkles className="text-purple-400 group-hover:scale-110 transition-transform" size={20} />
                                    <div>
                                        <span className="block text-white font-bold text-sm">Gerar Conteúdo IA</span>
                                        <span className="block text-slate-500 text-xs">Personalização dinâmica</span>
                                    </div>
                                </button>

                                <p className="text-xs text-slate-500 font-bold mb-2 mt-6">Fluxo</p>
                                <button onClick={() => addStep('WAIT_DELAY')} className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors group">
                                    <Clock className="text-yellow-400 group-hover:scale-110 transition-transform" size={20} />
                                    <div>
                                        <span className="block text-white font-bold text-sm">Esperar (Delay)</span>
                                        <span className="block text-slate-500 text-xs">Pausar o fluxo</span>
                                    </div>
                                </button>
                                <button onClick={() => addStep('START_CAMPAIGN')} className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors group mt-3">
                                    <Play className="text-pink-400 group-hover:scale-110 transition-transform" size={20} />
                                    <div>
                                        <span className="block text-white font-bold text-sm">Iniciar Outro Fluxo</span>
                                        <span className="block text-slate-500 text-xs">Conectar automações</span>
                                    </div>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* TEMPLATES TAB */}
            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {MOCK_TEMPLATES.map(tpl => (
                        <div key={tpl.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                {tpl.channel === 'email' ? <Mail size={18} className="text-blue-400" /> : <MessageCircle size={18} className="text-green-400" />}
                                <span className="text-sm font-bold text-slate-400 uppercase">{tpl.channel}</span>
                                {tpl.isAiPowered && <span className="ml-auto flex items-center gap-1 text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full"><Sparkles size={10} /> AI POWERED</span>}
                            </div>
                            <h3 className="font-bold text-white mb-2">{tpl.name}</h3>
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono mb-4 whitespace-pre-wrap">
                                {tpl.content}
                            </div>
                            <button className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700">Editar Template</button>
                        </div>
                    ))}
                    <button className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all">
                        <Plus size={24} className="text-slate-500 mb-2" />
                        <span className="text-sm font-bold text-slate-400">Novo Template</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SaaSMarketingModule;
