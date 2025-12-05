import React, { useState } from 'react';
import { WebsiteConfig } from '../../types';
import { Layout, Image as ImageIcon, Type, Palette, Globe, Smartphone, Save, Eye, Sparkles, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';

const templates: WebsiteConfig[] = [
    {
        heroTitle: 'Realce Sua Beleza Natural',
        heroSubtitle: 'Tecnologia avançada em estética e depilação a laser para você se sentir única.',
        heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
        primaryColor: '#14808C',
        showServices: true,
        showTeam: true,
        showTestimonials: true,
        contactPhone: '(11) 99999-9999',
        instagramUrl: '@divaspa'
    },
    {
        heroTitle: 'Sua Clínica de Beleza Premium',
        heroSubtitle: 'Tratamentos exclusivos com tecnologia de ponta.',
        heroImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
        primaryColor: '#BF784E',
        showServices: true,
        showTeam: false,
        showTestimonials: true,
        contactPhone: '(11) 99999-9999',
        instagramUrl: '@divaspa'
    },
    {
        heroTitle: 'Beleza que Transforma',
        heroSubtitle: 'Cuidados personalizados para resultados incríveis.',
        heroImage: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2071&auto=format&fit=crop',
        primaryColor: '#E91E8C',
        showServices: true,
        showTeam: true,
        showTestimonials: false,
        contactPhone: '(11) 99999-9999',
        instagramUrl: '@divaspa'
    }
];

const WebsiteModule: React.FC = () => {
    const { websiteConfig, updateWebsiteConfig } = useData();
    const [config, setConfig] = useState<WebsiteConfig>(websiteConfig || templates[0]);
    const [showTemplates, setShowTemplates] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSave = () => {
        updateWebsiteConfig(config);
        addToast("Site publicado com sucesso! 🎉", 'success');
    };

    const handlePreview = () => {
        window.open('#/site', '_blank');
    };

    const applyTemplate = (template: WebsiteConfig) => {
        setConfig(template);
        setShowTemplates(false);
        addToast("Template aplicado! Personalize e publique.", 'info');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Header */}
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-serif font-bold text-diva-dark">Diva Pages</h2>
                    <p className="text-sm text-gray-500">Construtor de Site Institucional & Landing Page</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePreview}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-bold text-sm"
                    >
                        <Eye size={16} className="mr-2" /> Ver Site Online
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-diva-primary text-white rounded-lg hover:bg-diva-dark transition-colors font-bold text-sm shadow-md"
                    >
                        <Save size={16} className="mr-2" /> Publicar Alterações
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">

                {/* EDITOR SIDEBAR (LEFT) */}
                <div className="w-80 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-y-auto p-6">
                    <h3 className="font-bold text-diva-dark mb-6 flex items-center">
                        <Layout size={18} className="mr-2 text-diva-primary" /> Configuração Visual
                    </h3>

                    <div className="space-y-6">
                        {/* Hero Section */}
                        <div className="space-y-3 border-b border-gray-100 pb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase">Capa (Hero)</h4>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Título Principal</label>
                                <input
                                    type="text"
                                    value={config.heroTitle}
                                    onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-diva-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Subtítulo</label>
                                <textarea
                                    value={config.heroSubtitle}
                                    onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-diva-primary h-20 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Imagem de Fundo (URL)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={config.heroImage}
                                        onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-diva-primary"
                                    />
                                    <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 shrink-0 overflow-hidden">
                                        <img src={config.heroImage} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sections Toggle */}
                        <div className="space-y-3 border-b border-gray-100 pb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase">Seções Ativas</h4>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-700">Catálogo de Serviços</span>
                                <input type="checkbox" checked={config.showServices} onChange={(e) => setConfig({ ...config, showServices: e.target.checked })} className="accent-diva-primary" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-700">Equipe (Staff)</span>
                                <input type="checkbox" checked={config.showTeam} onChange={(e) => setConfig({ ...config, showTeam: e.target.checked })} className="accent-diva-primary" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-700">Depoimentos (Reputação)</span>
                                <input type="checkbox" checked={config.showTestimonials} onChange={(e) => setConfig({ ...config, showTestimonials: e.target.checked })} className="accent-diva-primary" />
                            </label>
                        </div>

                        {/* Brand */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase">Marca & Contato</h4>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Cor Primária</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={config.primaryColor}
                                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                        className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                                    />
                                    <span className="text-xs font-mono text-gray-500">{config.primaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">WhatsApp Contato</label>
                                <input
                                    type="text"
                                    value={config.contactPhone}
                                    onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-diva-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Instagram (@)</label>
                                <input
                                    type="text"
                                    value={config.instagramUrl}
                                    onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-diva-primary"
                                />
                            </div>
                        </div>

                        {/* Templates Button */}
                        <div className="pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setShowTemplates(true)}
                                className="w-full bg-diva-accent/10 hover:bg-diva-accent/20 border border-diva-accent/30 text-diva-dark font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Sparkles size={16} className="mr-2 text-diva-accent" />
                                Galeria de Templates
                            </button>
                        </div>
                    </div>
                </div>

                {/* LIVE PREVIEW (MOCK IFRAME) */}
                <div className="flex-1 bg-gray-100 rounded-xl border border-gray-300 overflow-hidden flex flex-col items-center p-8 shadow-inner relative">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full text-xs font-bold text-gray-400 shadow-sm flex gap-2">
                        <Globe size={14} /> Visualização Mobile
                    </div>

                    {/* Phone Frame */}
                    <div className="w-[375px] h-full bg-white rounded-[40px] border-[8px] border-gray-800 shadow-2xl overflow-hidden relative flex flex-col">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-50"></div>

                        {/* Site Content Preview */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
                            {/* Hero */}
                            <div className="relative h-80">
                                <img src={config.heroImage} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
                                    <h2 className="text-2xl font-serif font-bold mb-2 leading-tight">{config.heroTitle}</h2>
                                    <p className="text-sm opacity-90">{config.heroSubtitle}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-8">
                                {config.showServices && (
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-3 text-lg">Nossos Tratamentos</h3>
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3 items-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                                <div>
                                                    <p className="font-bold text-sm">Laser Full Body</p>
                                                    <p className="text-xs text-gray-500">A partir de R$ 250</p>
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3 items-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                                <div>
                                                    <p className="font-bold text-sm">Botox</p>
                                                    <p className="text-xs text-gray-500">A partir de R$ 1200</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {config.showTeam && (
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-3 text-lg">Especialistas</h3>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            <div className="w-24 shrink-0 text-center">
                                                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-2"></div>
                                                <p className="text-xs font-bold">Dra. Julia</p>
                                            </div>
                                            <div className="w-24 shrink-0 text-center">
                                                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-2"></div>
                                                <p className="text-xs font-bold">Est. Carla</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Floating Action Button */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <button
                                className="w-full py-4 rounded-xl text-white font-bold shadow-lg flex items-center justify-center"
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                Agendar Horário
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showTemplates && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="bg-diva-dark text-white p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Galeria de Templates</h3>
                                <p className="text-sm opacity-80">Escolha um template e personalize</p>
                            </div>
                            <button onClick={() => setShowTemplates(false)} className="text-white/70 hover:text-white">
                                <Eye size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {templates.map((template, idx) => (
                                    <div key={idx} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-diva-primary transition-all cursor-pointer group">
                                        <div className="relative aspect-[9/16] bg-gray-100">
                                            <img src={template.heroImage} className="w-full h-full object-cover" alt={template.heroTitle} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                                <h4 className="text-white font-bold text-sm">{template.heroTitle}</h4>
                                                <p className="text-white/80 text-xs line-clamp-2">{template.heroSubtitle}</p>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold text-gray-400">Cor Primária</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: template.primaryColor }}></div>
                                                    <span className="text-xs font-mono text-gray-500">{template.primaryColor}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => applyTemplate(template)}
                                                className="w-full bg-diva-primary hover:bg-diva-dark text-white font-bold py-2 rounded-lg transition-colors"
                                            >
                                                Usar Template
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebsiteModule;
