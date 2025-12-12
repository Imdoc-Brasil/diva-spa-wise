import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../ui/ToastContext';
import { supabase } from '../../../services/supabase';
import {
    Save, Globe, Activity, Layout, Type,
    Search, Image as ImageIcon, Settings, CheckCircle, DollarSign, FileText
} from 'lucide-react';
import { SaaSAppConfig } from '../../../types';
import BlogEditorModule from './BlogEditorModule';

const SalesPageEditorModule: React.FC = () => {
    const { saasAppConfig, updateSaaSAppConfig } = useData();
    const { addToast } = useToast();

    // Local state for form
    const [config, setConfig] = useState<SaaSAppConfig | null>(null);
    const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'visuals' | 'integrations' | 'plans' | 'blog'>('content');
    const [plans, setPlans] = useState<any[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);

    useEffect(() => {
        if (activeTab === 'plans') {
            fetchPlans();
        }
    }, [activeTab]);

    const fetchPlans = async () => {
        setLoadingPlans(true);
        const { data, error } = await supabase.from('saas_plans').select('*');
        if (error) {
            console.error('Error fetching plans:', error);
            addToast('Erro ao carregar planos. Tabela não encontrada?', 'error');
        }
        if (data) {
            const PLAN_ORDER = ['start', 'growth', 'experts', 'empire'];
            const sortedPlans = (data as any[]).sort((a, b) => PLAN_ORDER.indexOf(a.key) - PLAN_ORDER.indexOf(b.key));
            setPlans(sortedPlans);
        }
        setLoadingPlans(false);
    };

    const handleUpdatePlan = async (planId: string, updates: any) => {
        const { error } = await (supabase.from('saas_plans') as any).update(updates).eq('id', planId);
        if (!error) {
            addToast('Plano atualizado!', 'success');
            setPlans(plans.map(p => p.id === planId ? { ...p, ...updates } : p));
        } else {
            addToast('Erro ao atualizar plano', 'error');
        }
    };

    useEffect(() => {
        if (saasAppConfig) {
            setConfig({ ...saasAppConfig });
        }
    }, [saasAppConfig]);

    const handleSave = () => {
        if (config && updateSaaSAppConfig) {
            updateSaaSAppConfig(config);
            addToast('SaaS Sales Page atualizada com sucesso!', 'success');
        }
    };

    if (!config) return <div className="p-8 text-white">Carregando configurações...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto text-slate-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        CMS & Gestão do Site
                    </h1>
                    <p className="text-slate-400 mt-2">Personalize a página de vendas e gerencie o SEO.</p>
                </div>
                <div className="flex gap-3">
                    <a
                        href="/#/sales"
                        target="_blank"
                        className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Globe size={18} /> Ver Site
                    </a>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                        <Save size={18} /> Salvar Alterações
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-700 pb-1 overflow-x-auto">
                {[
                    { id: 'content', label: 'Conteúdo & Hero', icon: <Type size={18} /> },
                    { id: 'visuals', label: 'Visual & Cores', icon: <Layout size={18} /> },
                    { id: 'seo', label: 'SEO & Meta Tags', icon: <Search size={18} /> },
                    { id: 'integrations', label: 'Analytics & Pixels', icon: <Activity size={18} /> },
                    { id: 'plans', label: 'Planos & Assinaturas', icon: <DollarSign size={18} /> },
                    { id: 'blog', label: 'Blog & Conteúdo', icon: <FileText size={18} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'border-purple-500 text-purple-400 font-medium'
                            : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

                {/* CONTENT TAB */}
                {activeTab === 'content' && (
                    <div className="space-y-6 max-w-3xl">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Título Principal (H1)</label>
                            <input
                                type="text"
                                value={config.heroTitle}
                                onChange={e => setConfig({ ...config, heroTitle: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                placeholder="Ex: O Futuro da Sua Clínica"
                            />
                            <p className="text-xs text-slate-500 mt-1">Aparece em destaque no topo da página de vendas.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Subtítulo (H2)</label>
                            <textarea
                                value={config.heroSubtitle}
                                onChange={e => setConfig({ ...config, heroSubtitle: e.target.value })}
                                rows={3}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none transition-all"
                                placeholder="Ex: Gestão inteligente com IA..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Telefone de Contato (WhatsApp)</label>
                                <input
                                    type="text"
                                    value={config.contactPhone}
                                    onChange={e => setConfig({ ...config, contactPhone: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                />
                            </div>
                        </div>

                        {/* Features Section Texts */}
                        <div className="pt-8 border-t border-slate-800">
                            <h3 className="text-lg font-bold mb-4 text-purple-400">Seção de Features</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Título</label>
                                    <input
                                        type="text"
                                        value={config.featuresTitle || ''}
                                        onChange={e => setConfig({ ...config, featuresTitle: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600"
                                        placeholder="Ex: Por que escolher o I'mdoc?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Subtítulo</label>
                                    <textarea
                                        value={config.featuresSubtitle || ''}
                                        onChange={e => setConfig({ ...config, featuresSubtitle: e.target.value })}
                                        rows={2}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600"
                                        placeholder="Texto explicativo abaixo do título"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section Texts */}
                        <div className="pt-8 border-t border-slate-800">
                            <h3 className="text-lg font-bold mb-4 text-purple-400">Seção de Preços</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Título</label>
                                    <input
                                        type="text"
                                        value={config.pricingTitle || ''}
                                        onChange={e => setConfig({ ...config, pricingTitle: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600"
                                        placeholder="Ex: Escolha seu plano"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Subtítulo</label>
                                    <textarea
                                        value={config.pricingSubtitle || ''}
                                        onChange={e => setConfig({ ...config, pricingSubtitle: e.target.value })}
                                        rows={2}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CTA Section Texts */}
                        <div className="pt-8 border-t border-slate-800">
                            <h3 className="text-lg font-bold mb-4 text-purple-400">Chamada para Ação (CTA Final)</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Título</label>
                                    <input
                                        type="text"
                                        value={config.ctaTitle || ''}
                                        onChange={e => setConfig({ ...config, ctaTitle: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600"
                                        placeholder="Ex: Pronto para começar?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Botão de Ação</label>
                                    <input
                                        type="text"
                                        value={config.ctaButtonText || ''}
                                        onChange={e => setConfig({ ...config, ctaButtonText: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600"
                                        placeholder="Ex: Começar Agora"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO TAB */}
                {activeTab === 'seo' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <Search size={20} className="text-blue-400" /> Preview no Google
                            </h3>
                            <div className="bg-white p-4 rounded-lg max-w-xl">
                                <div className="text-[#1a0dab] text-xl font-medium cursor-pointer hover:underline truncate">
                                    {config.seoTitle || config.heroTitle}
                                </div>
                                <div className="text-[#006621] text-sm my-1">
                                    https://imdoc.com.br/saas
                                </div>
                                <div className="text-[#545454] text-sm line-clamp-2">
                                    {config.seoDescription || config.heroSubtitle}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Meta Title (Título da Aba)</label>
                            <input
                                type="text"
                                value={config.seoTitle || ''}
                                onChange={e => setConfig({ ...config, seoTitle: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                placeholder="Título otimizado para SEO (60 caracteres)"
                            />
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-slate-500">Recomendado: I'mdoc - Gestão Inteligente para Clínicas</span>
                                <span className={`text-xs ${(config.seoTitle?.length || 0) > 60 ? 'text-red-400' : 'text-slate-500'}`}>
                                    {(config.seoTitle?.length || 0)}/60
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Meta Description</label>
                            <textarea
                                value={config.seoDescription || ''}
                                onChange={e => setConfig({ ...config, seoDescription: e.target.value })}
                                rows={3}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                placeholder="Resumo atrativo para aparecer no Google (160 caracteres)"
                            />
                            <div className="flex justify-between mt-1">
                                <span className={`text-xs ${(config.seoDescription?.length || 0) > 160 ? 'text-red-400' : 'text-slate-500'}`}>
                                    {(config.seoDescription?.length || 0)}/160
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* INTEGRATIONS TAB */}
                {activeTab === 'integrations' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-sm mb-6 flex items-start gap-3">
                            <Activity className="shrink-0 mt-0.5" size={18} />
                            <p>
                                As tags inseridas aqui serão carregadas automaticamente em todas as páginas públicas (Sales Page, Signup, Login).
                                Certifique-se de que os IDs estão corretos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="w-5" alt="Google" />
                                    </div>
                                    <span className="font-bold">Google Analytics 4 (GA4)</span>
                                </div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Measurement ID (G-XXXX)</label>
                                <input
                                    type="text"
                                    value={config.googleAnalyticsId || ''}
                                    onChange={e => setConfig({ ...config, googleAnalyticsId: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono"
                                    placeholder="G-1A2B3C4D5E"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded bg-[#1877F2] flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">f</span>
                                    </div>
                                    <span className="font-bold">Meta Pixel (Facebook)</span>
                                </div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Pixel ID</label>
                                <input
                                    type="text"
                                    value={config.metaPixelId || ''}
                                    onChange={e => setConfig({ ...config, metaPixelId: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono"
                                    placeholder="123456789012345"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* VISUALS TAB */}
                {activeTab === 'visuals' && (
                    <div className="space-y-6 max-w-3xl">
                        {/* Theme Config */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Tema & Aparência</label>
                            <div className="flex flex-col gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={config.enableThemeToggle || false}
                                        onChange={e => setConfig({ ...config, enableThemeToggle: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-white">Mostrar botão de alternar tema (Sol/Lua) no site</span>
                                </div>

                                <div className="pt-2 border-t border-slate-700">
                                    <label className="text-xs text-slate-500 mb-2 block font-bold uppercase">Tema Padrão Inicial</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setConfig({ ...config, defaultTheme: 'dark' })}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${config.defaultTheme === 'dark' || !config.defaultTheme ? 'bg-slate-950 text-white border-purple-500 ring-1 ring-purple-500' : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'}`}
                                        >
                                            Dark Mode (Escuro)
                                        </button>
                                        <button
                                            onClick={() => setConfig({ ...config, defaultTheme: 'light' })}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${config.defaultTheme === 'light' ? 'bg-white text-slate-900 border-purple-500 ring-1 ring-purple-500' : 'bg-slate-100 text-slate-500 border-slate-300 hover:border-slate-400'}`}
                                        >
                                            Light Mode (Claro)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Cor Primária (Hex)</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    value={config.primaryColor}
                                    onChange={e => setConfig({ ...config, primaryColor: e.target.value })}
                                    className="w-16 h-12 bg-transparent border-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Cor Secundária (Hex)</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    value={config.secondaryColor || '#0ea5e9'}
                                    onChange={e => setConfig({ ...config, secondaryColor: e.target.value })}
                                    className="w-16 h-12 bg-transparent border-0 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={config.secondaryColor || '#0ea5e9'}
                                    onChange={e => setConfig({ ...config, secondaryColor: e.target.value })}
                                    className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white uppercase font-mono w-32"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Tipografia (Google Fonts)</label>
                            <select
                                value={config.fontFamily || 'Inter'}
                                onChange={e => setConfig({ ...config, fontFamily: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                            >
                                <option value="Inter">Inter (Padrão - Clean)</option>
                                <option value="Roboto">Roboto (Clássico)</option>
                                <option value="Poppins">Poppins (Geométrico/Moderno)</option>
                                <option value="Montserrat">Montserrat (Elegante)</option>
                                <option value="Open Sans">Open Sans (Legibilidade)</option>
                                <option value="Lato">Lato (Equilibrado)</option>
                                <option value="Playfair Display">Playfair Display (Serifado/Luxo)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Imagem de Hero (URL)</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={config.heroImage}
                                    onChange={e => setConfig({ ...config, heroImage: e.target.value })}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-300"
                                />
                                <div className="w-32 h-20 bg-slate-800 rounded border border-slate-700 overflow-hidden relative">
                                    <img src={config.heroImage} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Seções Visíveis</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-800 p-2 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={config.showCalculator}
                                        onChange={e => setConfig({ ...config, showCalculator: e.target.checked })}
                                        className="w-5 h-5 accent-purple-600 rounded"
                                    />
                                    <span>Mostrar Calculadora de Prejuízo</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-800 p-2 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={config.showFeatures}
                                        onChange={e => setConfig({ ...config, showFeatures: e.target.checked })}
                                        className="w-5 h-5 accent-purple-600 rounded"
                                    />
                                    <span>Mostrar Features (Pilares)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-800 p-2 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={config.showComparison}
                                        onChange={e => setConfig({ ...config, showComparison: e.target.checked })}
                                        className="w-5 h-5 accent-purple-600 rounded"
                                    />
                                    <span>Mostrar Tabela Comparativa</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* PLANS TAB */}
                {activeTab === 'plans' && (
                    <div className="space-y-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-200 text-sm mb-6">
                            <p><strong>Atenção:</strong> Alterar os preços aqui atualiza a tabela de vendas imediatamente. Clientes existentes não são afetados.</p>
                        </div>

                        {loadingPlans ? (
                            <div className="text-center py-8 text-slate-400">Carregando planos...</div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {plans.map(plan => (
                                    <div key={plan.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                                <span className="text-xs text-slate-500 font-mono uppercase">{plan.key}</span>
                                            </div>
                                            {plan.is_popular && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Popular</span>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mensal (R$)</label>
                                                <input
                                                    type="number"
                                                    value={plan.monthly_price}
                                                    onChange={e => handleUpdatePlan(plan.id, { monthly_price: Number(e.target.value) })}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Anual (R$)</label>
                                                <input
                                                    type="number"
                                                    value={plan.yearly_price}
                                                    onChange={e => handleUpdatePlan(plan.id, { yearly_price: Number(e.target.value) })}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição Curta</label>
                                            <input
                                                type="text"
                                                value={plan.description}
                                                onChange={e => handleUpdatePlan(plan.id, { description: e.target.value })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Features (Uma por linha)</label>
                                            <textarea
                                                rows={5}
                                                value={Array.isArray(plan.features) ? plan.features.join('\n') : ''}
                                                onChange={e => {
                                                    const lines = e.target.value.split('\n').filter((l: string) => l.trim() !== '');
                                                    handleUpdatePlan(plan.id, { features: lines });
                                                }}
                                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 font-mono"
                                                placeholder="Agenda Inteligente&#10;Prontuário..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {/* BLOG TAB */}
                {activeTab === 'blog' && (
                    <BlogEditorModule />
                )}
            </div>
        </div>
    );
};

export default SalesPageEditorModule;
