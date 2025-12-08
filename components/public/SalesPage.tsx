import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Cpu, Zap, TrendingUp, Users, Shield, Globe,
    CheckCircle, XCircle, ArrowRight, Play,
    MessageCircle, Calendar, CreditCard, Star,
    Smartphone, BarChart3, Lock, Award, Heart, Search, Bell, Mic, Gift, Sparkles
} from 'lucide-react';

const SalesPage: React.FC = () => {
    const navigate = useNavigate();
    // Loss Calculator State
    const [dailyPatients, setDailyPatients] = useState(10);
    const [ticket, setTicket] = useState(250);
    const [showLoss, setShowLoss] = useState(false);

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

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white">I</div>
                        <span className="font-bold text-xl tracking-wide">I'mDoc SaaS</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Recursos</button>
                        <button onClick={() => scrollToSection('comparison')} className="hover:text-white transition-colors">Comparativo</button>
                        <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Planos</button>
                        <button className="bg-white text-slate-900 px-6 py-2 rounded-full hover:bg-slate-100 transition-colors font-bold">
                            Entrar
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-green-400">Nova Era da Gestão</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Não é apenas gestão.<br />
                        É o <span className="text-purple-400">Futuro</span> da Sua Clínica.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Abandone planilhas e softwares do passado. O I'mdoc usa
                        <strong className="text-white"> Inteligência Artificial </strong>
                        para lotar sua agenda, fidelizar pacientes e automatizar seu financeiro enquanto você dorme.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button
                            onClick={() => scrollToSection('pricing')}
                            className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] transition-all hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Quero Ver o Futuro Agora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button
                            onClick={() => scrollToSection('ai-demo')}
                            className="flex items-center gap-3 px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-colors"
                        >
                            <Play size={20} className="fill-current" /> Ver Demo de 1min
                        </button>
                    </div>

                    {/* Dashboard Preview Mockup */}
                    <div className="relative mx-auto max-w-5xl rounded-xl border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-xl overflow-hidden aspect-video group">
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                            alt="Dashboard Preview"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                        {/* Floating Cards Animation */}
                        <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg animate-bounce duration-[3000ms]">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><TrendingUp size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Faturamento Hoje</p>
                                    <p className="text-lg font-bold text-white">R$ 12.450,00</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg animate-bounce duration-[4000ms]">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Users size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Novos Pacientes</p>
                                    <p className="text-lg font-bold text-white">+28 esta semana</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Pain Calculator Section */}
            <section className="py-24 bg-slate-800/50 relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Sua clínica está perdendo dinheiro pelo ralo...</h2>
                    <p className="text-xl text-slate-400 mb-12">...e você nem vê. Calcule agora o prejuízo da "má gestão".</p>

                    <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-xl max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="text-left">
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Pacientes por Dia</label>
                                <input
                                    type="number"
                                    value={dailyPatients}
                                    onChange={(e) => setDailyPatients(Number(e.target.value))}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-2xl font-bold text-white focus:border-purple-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Ticket Médio (R$)</label>
                                <input
                                    type="number"
                                    value={ticket}
                                    onChange={(e) => setTicket(Number(e.target.value))}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-2xl font-bold text-white focus:border-purple-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {!showLoss ? (
                            <button
                                onClick={() => setShowLoss(true)}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Zap size={20} /> Calcular Meu Prejuízo Invisível
                            </button>
                        ) : (
                            <div className="animate-zoom-in duration-300">
                                <p className="text-sm text-slate-400 mb-2">Você pode estar perdendo até:</p>
                                <p className="text-5xl font-black text-red-500 mb-4">{calculateLoss()} / mês</p>
                                <p className="text-xs text-slate-500 max-w-md mx-auto">
                                    Baseado em estatísticas de mercado: 15% de no-shows não recuperados + 20% de falta de recorrência (LTV).
                                    <br /><strong className="text-green-400">O I'mdoc recupera esse dinheiro para você.</strong>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features / 3 Pillars */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-4">I'mdoc Intelligence</h2>
                        <div className="h-1 w-20 bg-purple-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-800/30 p-8 rounded-3xl border border-white/5 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all group">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Crescimento Automático</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Marketing que roda sozinho. Campanhas de WhatsApp, recuperação de inativos e réguas de relacionamento que vendem por você.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-800/30 p-8 rounded-3xl border border-white/5 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all group">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                <Cpu size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Gestão Invisível</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Financeiro, DRE e Estoque que se atualizam sozinhos. A Inteligência Artificial cuida da burocracia para você cuidar dos pacientes.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-800/30 p-8 rounded-3xl border border-white/5 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all group">
                            <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                                <Star size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Experiência 5 Estrelas</h3>
                            <p className="text-slate-400 leading-relaxed">
                                App exclusivo para seu paciente (White Label), Clube de Vantagens e Telemedicina integrada para fidelização total.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PATIENT JOURNEY TIMELINE */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-2 block">O Efeito I'mdoc</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">A Jornada do Paciente Perfeito</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Veja como transformamos um visitante curioso em um fã leal da sua marca,
                            <strong className="text-white"> sem você levantar um dedo</strong>.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full opacity-30 hidden md:block"></div>

                        <div className="space-y-24">
                            {[
                                {
                                    step: 1,
                                    icon: <Search size={24} />,
                                    title: "Descoberta & Agendamento",
                                    desc: "O paciente encontra seu site (Diva Pages), vê seus resultados e agenda online em 3 cliques, 24/7.",
                                    color: "bg-purple-500"
                                },
                                {
                                    step: 2,
                                    icon: <Bell size={24} />,
                                    title: "Confirmação Automática",
                                    desc: "O I'mdoc envia um WhatsApp amigável confirmando o horário e enviando o link de Check-in antecipado.",
                                    color: "bg-pink-500"
                                },
                                {
                                    step: 3,
                                    icon: <Smartphone size={24} />,
                                    title: "Experiência na Clínica",
                                    desc: "Check-in facial no Kiosk, Wi-Fi automático e playlist personalizada na sala de espera.",
                                    color: "bg-red-500"
                                },
                                {
                                    step: 4,
                                    icon: <Mic size={24} />,
                                    title: "Durante o Procedimento",
                                    desc: "Você usa o Diva Voice para ditar a evolução clínica. A IA transcreve e salva tudo no prontuário.",
                                    color: "bg-orange-500"
                                },
                                {
                                    step: 5,
                                    icon: <Gift size={24} />,
                                    title: "Fidelização Infinita",
                                    desc: "Pós-venda automático: Pesquisa NPS enviada + Cupom de aniversário + Lembrete de retorno em 3 meses.",
                                    color: "bg-green-500"
                                }
                            ].map((item, idx) => (
                                <div key={idx} className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 group ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Text Side */}
                                    <div className={`md:w-1/2 text-center ${idx % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                        <p className="text-slate-400">{item.desc}</p>
                                    </div>

                                    {/* Icon Center */}
                                    <div className="relative z-10 shrink-0">
                                        <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_-5px_currentColor] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                            {item.icon}
                                        </div>
                                        <div className="absolute -inset-2 bg-white/20 blur-xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>

                                    {/* Empty Balance Side */}
                                    <div className="md:w-1/2 hidden md:block"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* DIVA AI DEMO */}
            <section id="ai-demo" className="py-24 bg-slate-800/30">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
                            <Sparkles size={14} className="text-purple-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Diva AI 2.0</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Sua nova <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">CEO Digital</span>.
                        </h2>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
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
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                        <CheckCircle size={14} />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Chat Interface Mockup */}
                    <div className="md:w-1/2 w-full">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-sm mx-auto h-[450px]">
                            {/* Chat Header */}
                            <div className="bg-slate-800 p-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">Diva AI</p>
                                    <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online</p>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                                {/* Message 1 (User) */}
                                <div className="flex justify-end animate-slide-up">
                                    <div className="bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-lg">
                                        Diva, quanto vamos faturar até o final do mês?
                                    </div>
                                </div>

                                {/* Message 2 (AI) */}
                                <div className="flex justify-start animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                                    <div className="bg-slate-800 border border-white/5 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-lg">
                                        <p className="mb-2">Baseado nos agendamentos confirmados e na média histórica:</p>
                                        <div className="text-2xl font-bold text-white mb-1">R$ 45.890,00</div>
                                        <div className="text-xs text-green-400 font-bold bg-green-500/10 inline-block px-2 py-1 rounded mb-2">
                                            +15% vs mês anterior 🚀
                                        </div>
                                        <p className="text-xs text-slate-400 pt-2 border-t border-white/10">
                                            Sugestão: Lance uma campanha de Botox para atingir 50k.
                                        </p>
                                    </div>
                                </div>

                                {/* Message 3 (User) */}
                                <div className="flex justify-end animate-slide-up" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
                                    <div className="bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-lg">
                                        Boa! Crie essa campanha pra mim agora.
                                    </div>
                                </div>

                                {/* Message 4 (AI Actions) */}
                                <div className="flex justify-start animate-slide-up" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
                                    <div className="bg-slate-800 border border-white/5 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-lg">
                                        <p className="mb-2"><strong>Campanha Criada!</strong> ⚡️</p>
                                        <div className="bg-slate-900 rounded p-2 text-xs font-mono text-purple-300 border border-purple-500/30 mb-2">
                                            Segmento: Clientes Inativos (Botox) &gt; 6 meses<br />
                                            Canal: WhatsApp
                                        </div>
                                        <button className="w-full bg-green-600 text-white text-xs font-bold py-2 rounded hover:bg-green-500 transition-colors">
                                            Aprovar e Enviar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Comparison Table */}
            <section id="comparison" className="py-24 px-6 bg-slate-900 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Por que somos superiores?</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 text-slate-500 font-medium uppercase tracking-wider text-sm">Funcionalidade</th>
                                    <th className="p-6 bg-purple-900/20 text-purple-400 font-bold text-xl rounded-t-xl border-t border-x border-purple-500/30 text-center w-1/3 relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
                                        I'mdoc SaaS
                                    </th>
                                    <th className="p-6 text-slate-400 font-bold text-lg text-center w-1/4">Doctoralia</th>
                                    <th className="p-6 text-slate-400 font-bold text-lg text-center w-1/4">Legado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { label: 'Foco Principal', imdoc: 'Sua Marca & Clínica', doc: ' Marketplace (Deles)', leg: 'Burocracia' },
                                    { label: 'Inteligência Artificial', imdoc: 'Nativa & Preditiva', doc: 'Não tem', leg: 'Não tem' },
                                    { label: 'App do Paciente', imdoc: 'Sim (White Label)', doc: 'Não', leg: 'Não' },
                                    { label: 'Automação Marketing', imdoc: 'Régua Completa', doc: 'Básico', leg: 'Email Básico' },
                                    { label: 'Ecossistema (Kiosk/TV)', imdoc: 'Completo', doc: 'Agenda apenas', leg: 'Prontuário apenas' },
                                    { label: 'Design & UX', imdoc: 'Premium Future', doc: 'Padrão', leg: 'Datado' },
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6 text-slate-300 font-medium">{row.label}</td>
                                        <td className="p-6 bg-purple-900/10 text-white font-bold text-center border-x border-purple-500/10 shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]">
                                            {row.imdoc === 'Sim (White Label)' || row.imdoc === 'Completo' || row.imdoc === 'Nativa & Preditiva' ? (
                                                <div className="flex items-center justify-center gap-2 text-purple-400">
                                                    <CheckCircle size={20} /> {row.imdoc}
                                                </div>
                                            ) : (
                                                row.imdoc
                                            )}
                                        </td>
                                        <td className="p-6 text-slate-500 text-center">{row.doc}</td>
                                        <td className="p-6 text-slate-500 text-center">{row.leg}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* PRICING PLANS */}
            <section id="pricing" className="py-24 px-6 bg-slate-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-4">Escolha o plano ideal para sua fase</h2>
                        <p className="text-slate-400">Sem fidelidade. Sem taxas escondidas. Cancele quando quiser.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Plan 1: Start */}
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl hover:border-white/20 transition-all flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">I'mdoc Start</span>
                            <h3 className="text-3xl font-bold mb-2">R$ 297<span className="text-base font-normal text-slate-500">/mês</span></h3>
                            <p className="text-slate-400 text-sm mb-8">Para clínicas que estão começando a se profissionalizar.</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {['Agenda Inteligente', 'Prontuário Eletrônico', 'Lembretes WhatsApp', 'App do Paciente (Básico)'].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle size={16} className="text-slate-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => navigate('/signup?plan=start')}
                                className="w-full py-4 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors"
                            >
                                Começar Grátis
                            </button>
                        </div>

                        {/* Plan 2: Growth (Highlighted) */}
                        <div className="bg-slate-800 border-2 border-purple-500 p-8 rounded-3xl relative transform md:-translate-y-4 shadow-2xl flex flex-col">
                            <div className="absolute top-0 right-0 left-0 -mt-4 text-center">
                                <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Mais Popular</span>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">I'mdoc Growth</span>
                            <h3 className="text-3xl font-bold mb-2">R$ 597<span className="text-base font-normal text-slate-500">/mês</span></h3>
                            <p className="text-slate-300 text-sm mb-8">Automação total para clínicas em crescimento acelerado.</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {['Tudo do Start +', 'Marketing Automático (Régua)', 'Diva AI (Chatbot)', 'Financeiro Completo (DRE)', 'Clube de Pontos'].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-white">
                                        <CheckCircle size={16} className="text-green-400 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => navigate('/signup?plan=growth')}
                                className="w-full py-4 bg-purple-600 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg"
                            >
                                Assinar Growth
                            </button>
                        </div>

                        {/* Plan 3: Empire */}
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl hover:border-white/20 transition-all flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-2">I'mdoc Empire</span>
                            <h3 className="text-3xl font-bold mb-2">R$ 997<span className="text-base font-normal text-slate-500">/mês</span></h3>
                            <p className="text-slate-400 text-sm mb-8">Para redes, franquias e gestão multi-unidade.</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {['Tudo do Growth +', 'Gestão Multi-Unidades', 'App White Label Próprio', 'API Aberta', 'Gerente de Contas'].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle size={16} className="text-yellow-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => navigate('/signup?plan=empire')}
                                className="w-full py-4 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors"
                            >
                                Começar Agora
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-black opacity-80"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Pronto para a <br />Transformação Digital?</h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Junte-se a +500 clínicas de elite que já automatizaram o sucesso com o I'mdoc.
                        <br />Teste por 14 dias sem compromisso.
                    </p>
                    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl mb-12 animate-zoom-in">
                        <h3 className="text-2xl font-bold mb-4">Demo Exclusiva:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="text-green-400" size={20} />
                                <span>Acesso a todas as features</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="text-green-400" size={20} />
                                <span>Sem cartão de crédito</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-12 py-5 bg-white text-purple-900 rounded-full font-black text-xl hover:bg-slate-200 transition-colors shadow-2xl hover:scale-105 transform duration-200"
                    >
                        Começar Minha Transformação
                    </button>
                    <p className="mt-8 text-sm text-slate-500 flex items-center justify-center gap-2">
                        <Shield size={16} /> Garantia de 30 dias ou seu dinheiro de volta.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-black text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} I'mDoc SaaS. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default SalesPage;
