import React, { useState } from 'react';
import {
    Cpu, Zap, TrendingUp, Users, Shield, Globe,
    CheckCircle, XCircle, ArrowRight, Play,
    MessageCircle, Calendar, CreditCard, Star,
    Smartphone, BarChart3, Lock, Award
} from 'lucide-react';

const SalesPage: React.FC = () => {
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
                        <a href="#features" className="hover:text-white transition-colors">Recursos</a>
                        <a href="#comparison" className="hover:text-white transition-colors">Comparativo</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
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
                        <button className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] transition-all hover:scale-105">
                            <span className="relative z-10 flex items-center gap-2">
                                Quero Ver o Futuro Agora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button className="flex items-center gap-3 px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-colors">
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
                            <div className="animate-in zoom-in duration-300">
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

            {/* CTA Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-black opacity-80"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Pronto para a <br />Transformação Digital?</h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Junte-se a +500 clínicas de elite que já automatizaram o sucesso com o I'mdoc.
                        <br />Teste por 14 dias sem compromisso.
                    </p>
                    <button className="px-12 py-5 bg-white text-purple-900 rounded-full font-black text-xl hover:bg-slate-200 transition-colors shadow-2xl hover:scale-105 transform duration-200">
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
