import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Cpu, Zap, TrendingUp, Users, Shield, Globe,
    CheckCircle, XCircle, ArrowRight, Play,
    MessageCircle, Calendar, CreditCard, Star,
    Smartphone, BarChart3, Lock, Award, Heart, Search, Bell, Mic, Gift, Sparkles, PhoneCall,
    Sun, Moon
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { SaaSLead, SaaSLeadStage, SaaSPlan } from '../../types';
import { useToast } from '../../components/ui/ToastContext';
import { supabase } from '../../services/supabase';


const SalesPage: React.FC = () => {
    const navigate = useNavigate();
    // Loss Calculator State
    const [dailyPatients, setDailyPatients] = useState(10);
    const [ticket, setTicket] = useState(250);
    const [showLoss, setShowLoss] = useState(false);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [plans, setPlans] = useState<any[]>([]);

    // Theme State
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const { addSaaSLead, saasAppConfig } = useData();
    const { addToast } = useToast();

    // Load Google Font dynamically
    useEffect(() => {
        if (saasAppConfig?.fontFamily) {
            const fontName = saasAppConfig.fontFamily.replace(/ /g, '+');
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            return () => {
                try { document.head.removeChild(link); } catch (e) { }
            };
        }
    }, [saasAppConfig?.fontFamily]);

    // Initialize Theme
    useEffect(() => {
        if (saasAppConfig?.defaultTheme) {
            setTheme(saasAppConfig.defaultTheme);
        }
    }, [saasAppConfig?.defaultTheme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        const fetchPlans = async () => {
            const { data } = await supabase.from('saas_plans').select('*');
            if (data) {
                const PLAN_ORDER = ['start', 'growth', 'experts', 'empire'];
                const sortedPlans = (data as any[]).sort((a, b) => PLAN_ORDER.indexOf(a.key) - PLAN_ORDER.indexOf(b.key));
                setPlans(sortedPlans);
            }
        };
        fetchPlans();
    }, []);

    const handleCaptureLead = () => {
        const lead: SaaSLead = {
            id: `lead_${Date.now()}`,
            name: 'Visitante Interessado',
            clinicName: 'Clínica (Calculadora)',
            email: 'contato@clinica.com',
            phone: '(11) 99999-9999',
            stage: SaaSLeadStage.NEW,
            planInterest: SaaSPlan.GROWTH,
            source: 'landing_page',
            status: 'active',
            notes: `Calculou perda de: ${calculateLoss()}`,
            estimatedValue: 597,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (addSaaSLead) {
            addSaaSLead(lead);
            addToast('Solicitação enviada! Nossa equipe entrará em contato.', 'success');
        } else {
            alert('Lead capturado (Demo Mode)');
        }
    };


    const calculateLoss = () => {
        const noShowRate = 0.15; // 15% market average
        const lostLtv = 0.20; // 20% lost without retention marketing

        const monthlyRevenue = dailyPatients * ticket * 22; // 22 working days
        const lostRevenue = monthlyRevenue * (noShowRate + lostLtv);

        return lostRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Theme Variables
    const themeStyles = theme === 'dark' ? {
        '--bg-page': '#020617', // slate-950
        '--bg-blur': 'rgba(2, 6, 23, 0.8)',
        '--bg-card': 'rgba(15, 23, 42, 0.5)', // slate-900/50
        '--bg-surface': '#1e293b', // slate-800
        '--bg-input': '#1e293b',
        '--text-main': '#ffffff',
        '--text-muted': '#94a3b8', // slate-400
        '--border-color': 'rgba(255, 255, 255, 0.1)',
        '--shadow-color': 'rgba(0,0,0,0.5)',
        '--card-hover': 'rgba(255,255,255,0.05)'
    } : {
        '--bg-page': '#f8fafc', // slate-50
        '--bg-blur': 'rgba(255, 255, 255, 0.9)',
        '--bg-card': '#ffffff',
        '--bg-surface': '#f1f5f9', // slate-100
        '--bg-input': '#ffffff',
        '--text-main': '#0f172a', // slate-900
        '--text-muted': '#64748b', // slate-500
        '--border-color': '#e2e8f0', // slate-200
        '--shadow-color': 'rgba(0,0,0,0.05)',
        '--card-hover': 'rgba(0,0,0,0.02)'
    };

    return (
        <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] selection:bg-purple-500/30 font-sans transition-colors duration-300"
            style={{
                ...themeStyles,
                '--primary-color': saasAppConfig?.primaryColor || '#A855F7',
                '--secondary-color': saasAppConfig?.secondaryColor || '#0ea5e9',
                fontFamily: saasAppConfig?.fontFamily || 'Inter, sans-serif'
            } as React.CSSProperties}
        >
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-[var(--bg-blur)] backdrop-blur-md border-b border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-color)] rounded-lg flex items-center justify-center font-bold text-white">I</div>
                        <span className="font-bold text-xl tracking-wide">I'mDoc SaaS</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
                        {saasAppConfig?.showFeatures && (
                            <button onClick={() => scrollToSection('features')} className="hover:text-[var(--text-main)] transition-colors">Recursos</button>
                        )}
                        {saasAppConfig?.showComparison && (
                            <button onClick={() => scrollToSection('comparison')} className="hover:text-[var(--text-main)] transition-colors">Comparativo</button>
                        )}
                        {saasAppConfig?.showPricing && (
                            <button onClick={() => scrollToSection('pricing')} className="hover:text-[var(--text-main)] transition-colors">Planos</button>
                        )}

                        {saasAppConfig?.enableThemeToggle && (
                            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[var(--text-main)] text-[var(--bg-page)] px-6 py-2 rounded-full hover:opacity-90 transition-colors font-bold"
                        >
                            Entrar
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[var(--primary-color)]/30 rounded-full blur-[120px] -z-10"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-green-500">Nova Era da Gestão</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-main)] via-[var(--text-muted)] to-[var(--text-main)]">
                        {saasAppConfig?.heroTitle || "Não é apenas gestão. É o Futuro da Sua Clínica."}
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto mb-10 leading-relaxed">
                        {saasAppConfig?.heroSubtitle || "Abandone planilhas e softwares do passado. O I'mdoc usa Inteligência Artificial para lotar sua agenda, fidelizar pacientes e automatizar seu financeiro enquanto você dorme."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button
                            onClick={() => scrollToSection('pricing')}
                            className="group relative px-8 py-4 bg-[var(--primary-color)] hover:opacity-90 rounded-full font-bold text-lg text-white shadow-[0_0_40px_-10px_var(--primary-color)] transition-all hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Quero Ver o Futuro Agora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button
                            onClick={() => scrollToSection('ai-demo')}
                            className="flex items-center gap-3 px-8 py-4 border border-[var(--border-color)] rounded-full font-bold hover:bg-[var(--bg-surface)] transition-colors"
                        >
                            <Play size={20} className="fill-current" /> Ver Demo de 1min
                        </button>
                    </div>

                    {/* Dashboard Preview Mockup */}
                    <div className="relative mx-auto max-w-5xl rounded-xl border border-[var(--border-color)] shadow-2xl bg-[var(--bg-card)] backdrop-blur-xl overflow-hidden aspect-video group">
                        <img
                            src={saasAppConfig?.heroImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"}
                            alt="Dashboard Preview"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-slate-900' : 'from-slate-50'} via-transparent to-transparent`}></div>
                    </div>
                </div>
            </header>

            {/* Pain Calculator Section */}
            {saasAppConfig?.showCalculator && (
                <section className="py-20 bg-[var(--bg-surface)] relative">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Sua clínica está perdendo dinheiro pelo ralo...</h2>
                        <p className="text-xl text-[var(--text-muted)] mb-12">...e você nem vê. Calcule agora o prejuízo da "má gestão".</p>

                        <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-color)] shadow-xl max-w-2xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="text-left">
                                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Pacientes por Dia</label>
                                    <input
                                        type="number"
                                        value={dailyPatients}
                                        onChange={(e) => setDailyPatients(Number(e.target.value))}
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl p-4 text-2xl font-bold text-[var(--text-main)] focus:border-[var(--primary-color)] outline-none transition-colors"
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Ticket Médio (R$)</label>
                                    <input
                                        type="number"
                                        value={ticket}
                                        onChange={(e) => setTicket(Number(e.target.value))}
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl p-4 text-2xl font-bold text-[var(--text-main)] focus:border-[var(--primary-color)] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {!showLoss ? (
                                <button
                                    onClick={() => setShowLoss(true)}
                                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Zap size={20} /> Calcular Meu Prejuízo Invisível
                                </button>
                            ) : (
                                <div className="animate-zoom-in duration-300">
                                    <p className="text-sm text-[var(--text-muted)] mb-2">Você pode estar perdendo até:</p>
                                    <p className="text-5xl font-black text-red-500 mb-4">{calculateLoss()} / mês</p>
                                    <button
                                        onClick={handleCaptureLead}
                                        className="mt-6 px-8 py-3 bg-[var(--primary-color)] hover:opacity-90 rounded-full font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <PhoneCall size={18} /> Quero Resolver Isso Agora
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Features / 3 Pillars */}
            {saasAppConfig?.showFeatures && (
                <section id="features" className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                                {saasAppConfig?.featuresTitle || "Tudo o que você precisa para escalar"}
                            </h2>
                            <p className="text-lg text-[var(--text-muted)]">
                                {saasAppConfig?.featuresSubtitle || "Centralize sua operação clínica em uma única plataforma inteligente."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-color)] hover:border-[var(--primary-color)]/50 hover:bg-[var(--card-hover)] transition-all group shadow-lg shadow-[var(--shadow-color)]">
                                <div className="w-16 h-16 bg-[var(--primary-color)]/10 rounded-2xl flex items-center justify-center text-[var(--primary-color)] mb-6 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Crescimento Automático</h3>
                                <p className="text-[var(--text-muted)] leading-relaxed">
                                    Marketing que roda sozinho. Campanhas de WhatsApp, recuperação de inativos e réguas de relacionamento que vendem por você.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-color)] hover:border-[var(--primary-color)]/50 hover:bg-[var(--card-hover)] transition-all group shadow-lg shadow-[var(--shadow-color)]">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                    <Cpu size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Gestão Invisível</h3>
                                <p className="text-[var(--text-muted)] leading-relaxed">
                                    Financeiro, DRE e Estoque que se atualizam sozinhos. A Inteligência Artificial cuida da burocracia para você cuidar dos pacientes.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-color)] hover:border-[var(--primary-color)]/50 hover:bg-[var(--card-hover)] transition-all group shadow-lg shadow-[var(--shadow-color)]">
                                <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
                                    <Star size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Experiência 5 Estrelas</h3>
                                <p className="text-[var(--text-muted)] leading-relaxed">
                                    App exclusivo para seu paciente (White Label), Clube de Vantagens e Telemedicina integrada para fidelização total.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* PATIENT JOURNEY TIMELINE */}
            <section className="py-24 bg-[var(--bg-surface)] relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-[var(--primary-color)] font-bold uppercase tracking-widest text-sm mb-2 block">O Efeito I'mdoc</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">A Jornada do Paciente Perfeito</h2>
                        <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
                            Veja como transformamos um visitante curioso em um fã leal da sua marca,
                            <strong className="text-[var(--text-main)]"> sem você levantar um dedo</strong>.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[var(--primary-color)] via-pink-500 to-blue-500 rounded-full opacity-30 hidden md:block"></div>
                        <div className="space-y-24">
                            {[
                                { step: 1, icon: <Search size={24} />, title: "Descoberta & Agendamento", desc: "O paciente encontra seu site (Diva Pages), vê seus resultados e agenda online em 3 cliques, 24/7.", color: "bg-[var(--primary-color)]" },
                                { step: 2, icon: <Bell size={24} />, title: "Confirmação Automática", desc: "O I'mdoc envia um WhatsApp amigável confirmando o horário e enviando o link de Check-in antecipado.", color: "bg-pink-500" },
                                { step: 3, icon: <Smartphone size={24} />, title: "Experiência na Clínica", desc: "Check-in facial no Kiosk, Wi-Fi automático e playlist personalizada na sala de espera.", color: "bg-red-500" },
                                { step: 4, icon: <Mic size={24} />, title: "Durante o Procedimento", desc: "Você usa o Diva Voice para ditar a evolução clínica. A IA transcreve e salva tudo no prontuário.", color: "bg-orange-500" },
                                { step: 5, icon: <Gift size={24} />, title: "Fidelização Infinita", desc: "Pós-venda automático: Pesquisa NPS enviada + Cupom de aniversário + Lembrete de retorno em 3 meses.", color: "bg-green-500" }
                            ].map((item, idx) => (
                                <div key={idx} className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 group ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className={`md:w-1/2 text-center ${idx % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--primary-color)] transition-colors">{item.title}</h3>
                                        <p className="text-[var(--text-muted)]">{item.desc}</p>
                                    </div>
                                    <div className="relative z-10 shrink-0">
                                        <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_-5px_currentColor] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 hidden md:block"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* DIVA AI DEMO */}
            <section id="ai-demo" className="py-24 bg-[var(--bg-card)]/50">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <div className="inline-flex items-center gap-2 bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 rounded-full px-4 py-1.5 mb-6">
                            <Sparkles size={14} className="text-[var(--primary-color)]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Diva AI 2.0</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Sua nova <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">CEO Digital</span>.
                        </h2>
                        <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
                            A Diva não apenas responde perguntas. Ela <strong>executa tarefas</strong>.
                            Peça para ela analisar seu financeiro, criar campanhas ou sugerir tratamentos.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Previsão de Faturamento em tempo real",
                                "Criação de Campanhas de Marketing",
                                "Análise de Pele via IA",
                                "Sugestão de Preços Dinâmicos"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-[var(--text-muted)]">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                        <CheckCircle size={14} />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:w-1/2 w-full">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-sm mx-auto h-[450px]">
                            {/* Chat Header Always Dark */}
                            <div className="bg-slate-800 p-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">Diva AI</p>
                                    <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online</p>
                                </div>
                            </div>
                            <div className="flex-1 p-4 space-y-4 overflow-hidden relative text-white">
                                {/* Demo Messages Hardcoded Dark */}
                                <div className="flex justify-end animate-slide-up">
                                    <div className="bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-lg">
                                        Diva, quanto vamos faturar até o final do mês?
                                    </div>
                                </div>
                                <div className="flex justify-start animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                                    <div className="bg-slate-800 border border-white/5 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-lg">
                                        <p className="mb-2">Baseado nos agendamentos confirmados e na média histórica:</p>
                                        <div className="text-2xl font-bold text-white mb-1">R$ 45.890,00</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Comparison Table */}
            {saasAppConfig?.showComparison && (
                <section id="comparison" className="py-20 bg-[var(--bg-surface)] border-t border-[var(--border-color)]">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-4xl font-bold text-center mb-16">Por que somos superiores?</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-6 text-[var(--text-muted)] font-medium uppercase tracking-wider text-sm">Funcionalidade</th>
                                        <th className="p-6 bg-[var(--primary-color)]/20 text-[var(--primary-color)] font-bold text-xl rounded-t-xl border-t border-x border-[var(--primary-color)]/30 text-center w-1/3 relative">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary-color)] shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
                                            I'mdoc SaaS
                                        </th>
                                        <th className="p-6 text-[var(--text-muted)] font-bold text-lg text-center w-1/4">Doctoralia</th>
                                        <th className="p-6 text-[var(--text-muted)] font-bold text-lg text-center w-1/4">Legado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {[
                                        { label: 'Foco Principal', imdoc: 'Sua Marca & Clínica', doc: ' Marketplace (Deles)', leg: 'Burocracia' },
                                        { label: 'Inteligência Artificial', imdoc: 'Nativa & Preditiva', doc: 'Não tem', leg: 'Não tem' },
                                        { label: 'App do Paciente', imdoc: 'Sim (White Label)', doc: 'Não', leg: 'Não' },
                                        { label: 'Automação Marketing', imdoc: 'Régua Completa', doc: 'Básico', leg: 'Email Básico' },
                                        { label: 'Ecossistema (Kiosk/TV)', imdoc: 'Completo', doc: 'Agenda apenas', leg: 'Prontuário apenas' },
                                        { label: 'Design & UX', imdoc: 'Premium Future', doc: 'Padrão', leg: 'Datado' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-[var(--card-hover)] transition-colors">
                                            <td className="p-6 text-[var(--text-main)] font-medium">{row.label}</td>
                                            <td className="p-6 bg-[var(--primary-color)]/10 text-[var(--text-main)] font-bold text-center border-x border-[var(--primary-color)]/10">
                                                {row.imdoc.includes('Sim') || row.imdoc.includes('Completo') || row.imdoc.includes('Nativa') ? (
                                                    <div className="flex items-center justify-center gap-2 text-[var(--primary-color)]">
                                                        <CheckCircle size={20} /> {row.imdoc}
                                                    </div>
                                                ) : (row.imdoc)}
                                            </td>
                                            <td className="p-6 text-[var(--text-muted)] text-center">{row.doc}</td>
                                            <td className="p-6 text-[var(--text-muted)] text-center">{row.leg}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* PRICING PLANS */}
            {saasAppConfig?.showPricing && (
                <section id="pricing" className="py-32 relative">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--secondary-color)] to-transparent opacity-20"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                {saasAppConfig?.pricingTitle || "Escolha o plano ideal para sua fase"}
                            </h2>
                            <p className="text-lg text-[var(--text-muted)]">
                                {saasAppConfig?.pricingSubtitle || "Sem fidelidade. Sem taxas escondidas. Cancele quando quiser."}
                            </p>

                            <div className="flex items-center justify-center gap-4 mt-8">
                                <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>Mensal</span>
                                <button
                                    onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                                    className={`w-16 h-8 rounded-full p-1 transition-colors duration-300 ${billingCycle === 'yearly' ? 'bg-[var(--primary-color)]' : 'bg-slate-500'}`}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-8' : ''}`}></div>
                                </button>
                                <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                                    Anual <span className="text-[var(--primary-color)] text-xs ml-1">(Até 17% OFF)</span>
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`
                                    flex flex-col p-6 rounded-3xl transition-all relative
                                    ${plan.is_popular
                                            ? 'bg-[var(--bg-card)] border-2 border-[var(--primary-color)] shadow-2xl transform md:-translate-y-4 z-10'
                                            : 'bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--primary-color)]/30'
                                        }
                                `}
                                >
                                    {plan.is_popular && (
                                        <div className="absolute top-0 right-0 left-0 -mt-3 text-center">
                                            <span className="bg-[var(--primary-color)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Mais Popular</span>
                                        </div>
                                    )}

                                    <span className={`text-xs font-bold uppercase tracking-widest mb-2 mt-2 ${plan.is_popular ? 'text-[var(--primary-color)]' : 'text-[var(--text-muted)]'}`}>
                                        {plan.name}
                                    </span>

                                    <div className={`mb-4 ${plan.monthly_price > 0 ? 'h-20' : 'h-20 flex items-center'}`}>
                                        {plan.monthly_price > 0 ? (
                                            billingCycle === 'monthly' ? (
                                                <h3 className="text-3xl font-bold">
                                                    {plan.monthly_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(',00', '')}
                                                    <span className="text-sm font-normal text-[var(--text-muted)]">/mês</span>
                                                </h3>
                                            ) : (
                                                <>
                                                    <h3 className="text-3xl font-bold">
                                                        {(plan.yearly_price / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        <span className="text-sm font-normal text-[var(--text-muted)]">/mês</span>
                                                    </h3>
                                                    <p className="text-xs text-[var(--primary-color)]">
                                                        12x de {(plan.yearly_price / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </p>
                                                </>
                                            )
                                        ) : (
                                            <h3 className="text-2xl font-bold text-[var(--text-main)]">Sob Consulta</h3>
                                        )}
                                    </div>

                                    <p className="text-[var(--text-muted)] text-xs mb-6 h-10 line-clamp-2" title={plan.description}>
                                        {plan.description}
                                    </p>

                                    <ul className="space-y-3 mb-8 flex-1">
                                        {(Array.isArray(plan.features) ? plan.features : []).map((feat: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                                                <CheckCircle size={14} className={`${plan.is_popular ? 'text-green-500' : 'text-[var(--text-muted)]'} shrink-0 mt-0.5`} />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => {
                                            if (plan.monthly_price === 0) {
                                                window.open(`https://wa.me/5511999999999?text=Tenho interesse no ${plan.name}`, '_blank');
                                            } else {
                                                navigate(`/signup?plan=${plan.key}`);
                                            }
                                        }}
                                        className={`
                                        w-full py-3 rounded-xl font-bold text-sm transition-colors
                                        ${plan.is_popular
                                                ? 'bg-[var(--primary-color)] hover:opacity-90 shadow-lg text-white'
                                                : 'border border-[var(--border-color)] hover:bg-[var(--bg-surface)] text-[var(--text-main)]'
                                            }
                                    `}
                                    >
                                        {plan.monthly_price === 0 ? 'Falar com Consultor' : `Assinar ${plan.name.replace("I'mdoc ", "")}`}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)] via-[var(--bg-surface)] to-black opacity-80"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                        {saasAppConfig?.ctaTitle || "Pronto para a Transformação Digital?"}
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        {saasAppConfig?.ctaSubtitle || "Junte-se a +500 clínicas de elite que já automatizaram o sucesso com o I'mdoc."}
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-12 py-5 bg-white text-purple-900 rounded-full font-black text-xl hover:bg-slate-200 transition-colors shadow-2xl hover:scale-105 transform duration-200"
                    >
                        {saasAppConfig?.ctaButtonText || "Começar Minha Transformação"}
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-page)] text-center text-[var(--text-muted)] text-sm">
                <p>&copy; {new Date().getFullYear()} I'mdoc SaaS. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default SalesPage;
