import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { SaaSLead, SaaSLeadStage, SaaSPlan } from '../../../types';
import { Calculator, ArrowRight, DollarSign, Users, Building, CheckCircle, Lock, TrendingUp, AlertCircle, Sparkles, Clock, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useToast } from '../../ui/ToastContext';
import { supabase } from '../../../services/supabase';

import jsPDF from 'jspdf';
import { automationService } from '../../../services/saas/AutomationService';

const RevenueCalculatorPage: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Steps: 0 = Intro, 1 = Type & Basic, 2 = Details, 3 = Lead, 4 = Result
    const [step, setStep] = useState(0);

    // Inputs
    const [entityType, setEntityType] = useState<'professional' | 'office' | 'clinic' | 'franchise'>('clinic');
    const [ns, setNs] = useState(1); // Número de Salas
    const [nt, setNt] = useState(10); // Turnos por semana (max 14)
    const [nu, setNu] = useState(1); // Número de Unidades (Franquia)
    const [tmd, setTmd] = useState<20 | 30 | 60 | 90>(30); // Tempo Médio
    const [mfm, setMfm] = useState(0); // Melhor Faturamento Mensal (Atual)

    // Lead Data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculation Logic
    const calculatePotential = () => {
        let multiplier = 0;
        if (tmd === 20) multiplier = 10 * 4 * 500;
        if (tmd === 30) multiplier = 9 * 4 * 600;
        if (tmd === 60) multiplier = 6 * 4 * 1000;
        if (tmd === 90) multiplier = 5 * 4 * 1500;

        let occupancyFactor = 1.0;
        if (entityType === 'professional') occupancyFactor = 0.6; // 60% occupation for professionals per formula

        let totalSalas = ns;
        if (entityType === 'professional' || entityType === 'office') totalSalas = 1;
        if (entityType === 'franchise') totalSalas = ns * nu;

        // Formula: Rooms * Shifts * Multiplier * Occupancy
        const potentialRevenue = totalSalas * nt * multiplier * occupancyFactor;
        const currentRevenue = mfm;
        const lostRevenue = Math.max(0, potentialRevenue - currentRevenue);

        return { potentialRevenue, currentRevenue, lostRevenue };
    };

    const results = calculatePotential();
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    const generateReportPDF = () => {
        const doc = new jsPDF();

        // Colors
        const purple = '#7f30ac';
        const slate = '#334155';

        // Header
        doc.setFillColor(127, 48, 172); // Purple
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text("Relatório de Potencial", 105, 25, { align: 'center' });
        doc.setFontSize(12);
        doc.text("I'mDoc SaaS - Inteligência de Negócios", 105, 35, { align: 'center' });

        // Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`Olá, ${name}`, 20, 60);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Preparamos uma análise exclusiva para seu modelo de negócio (${entityType === 'professional' ? 'Profissional Liberal' : 'Clínica/Empresa'}).`, 20, 70);

        // Results Box
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(20, 85, 170, 60, 3, 3, 'F');

        doc.setFontSize(16);
        doc.setTextColor(purple);
        doc.text("Seu Potencial Mensal Estimado", 105, 100, { align: 'center' });

        doc.setFontSize(32);
        doc.setFont('helvetica', 'bold');
        doc.text(formatCurrency(results.potentialRevenue), 105, 120, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(200, 50, 50);
        if (results.lostRevenue > 0) {
            doc.text(`Prejuízo Oculto Atual: ${formatCurrency(results.lostRevenue)} / mês`, 105, 135, { align: 'center' });
        }

        // Details
        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.text("Parâmetros Utilizados:", 20, 160);
        doc.setFontSize(10);
        doc.text(`- Salas: ${ns}`, 25, 170);
        doc.text(`- Turnos Semanais: ${nt}`, 25, 175);
        doc.text(`- Tempo Médio de Atendimento: ${tmd} min`, 25, 180);
        doc.text(`- Ocupação Projetada: ${entityType === 'professional' ? '60%' : '85%'}`, 25, 185);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Gerado automaticamente por I'mDoc AI. Este relatório é uma estimativa baseada em benchmarks de mercado.", 105, 280, { align: 'center' });

        return doc.output('blob');
    };

    const handleCapture = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const leadData: Partial<SaaSLead> = {
            name,
            email,
            phone,
            clinicName: entityType === 'professional' ? 'Profissional Liberal' : (entityType === 'franchise' ? 'Rede de Franquias' : 'Clínica/Consultório'),
            stage: SaaSLeadStage.NEW,
            source: 'landing_page',
            planInterest: results.potentialRevenue > 50000 ? SaaSPlan.GROWTH : SaaSPlan.START,
            status: 'active',
            estimatedValue: results.potentialRevenue > 50000 ? 597 : 297,
        };

        const contextData = {
            calculator: {
                results: results,
                inputs: { entityType, ns, nt, tmd, mfm }
            },
            tags: ['Calculadora', 'Lead Quente']
        };

        try {
            // Generate PDF
            const pdfBlob = generateReportPDF();

            // Process via Automation Service
            await automationService.processConversion('REVENUE_CALCULATOR', leadData, contextData, [pdfBlob]);

            // Success Feedback
            setStep(4);
            addToast('Relatório enviado para seu e-mail e WhatsApp!', 'success');

            // Download PDF directly for user as well (Nice to have)
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Relatorio_ImDoc_${name.split(' ')[0]}.pdf`;
            link.click();
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
            addToast('Erro ao processar sua solicitação.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const chartData = [
        { name: 'Seu Melhor Mês', value: results.currentRevenue, color: '#94a3b8' },
        { name: 'Potencial I\'mdoc', value: results.potentialRevenue, color: '#a855f7' }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30">
            {/* Header */}
            <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/sales')}>
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white">I</div>
                    <span className="font-bold text-xl tracking-wide">I'mDoc Tools</span>
                </div>
            </nav>

            <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="w-full max-w-4xl relative z-10">

                    {/* STEP 0: INTRO */}
                    {step === 0 && (
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-500/10 rounded-3xl mb-8 border border-purple-500/20 shadow-lg shadow-purple-500/20">
                                <Calculator className="text-purple-400" size={48} />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                Simule sua Capacidade<br />de Faturamento
                            </h1>
                            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                                Descubra o verdadeiro potencial do seu negócio de saúde com o algoritmo exclusivo do I'mdoc, baseado em dados reais de mercado.
                            </p>
                            <button
                                onClick={() => setStep(1)}
                                className="group relative px-10 py-5 bg-white text-slate-900 rounded-full font-black text-xl hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                            >
                                <span className="flex items-center gap-3">
                                    Iniciar Simulação Gratuita <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    )}

                    {/* STEP 1: TYPE */}
                    {step === 1 && (
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl animate-in slide-in-from-right duration-500">
                            <h2 className="text-3xl font-bold mb-8">Qual o perfil do seu negócio?</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <button onClick={() => { setEntityType('professional'); setNs(1); }} className={`p-6 rounded-xl border text-left transition-all relative overflow-hidden group ${entityType === 'professional' ? 'bg-purple-600/20 border-purple-500 ring-1 ring-purple-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}>
                                    <div className="font-bold text-lg mb-1 relative z-10">Profissional Liberal</div>
                                    <p className="text-xs text-slate-400 relative z-10">Presta serviço em clínicas de terceiros.</p>
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                </button>
                                <button onClick={() => { setEntityType('office'); setNs(1); }} className={`p-6 rounded-xl border text-left transition-all relative overflow-hidden group ${entityType === 'office' ? 'bg-purple-600/20 border-purple-500 ring-1 ring-purple-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}>
                                    <div className="font-bold text-lg mb-1 relative z-10">Consultório Próprio</div>
                                    <p className="text-xs text-slate-400 relative z-10">Possui consultório ou sala própria.</p>
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                </button>
                                <button onClick={() => setEntityType('clinic')} className={`p-6 rounded-xl border text-left transition-all relative overflow-hidden group ${entityType === 'clinic' ? 'bg-purple-600/20 border-purple-500 ring-1 ring-purple-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}>
                                    <div className="font-bold text-lg mb-1 relative z-10">Clínica / Centro Médico</div>
                                    <p className="text-xs text-slate-400 relative z-10">Estrutura com múltiplas salas.</p>
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                </button>
                                <button onClick={() => setEntityType('franchise')} className={`p-6 rounded-xl border text-left transition-all relative overflow-hidden group ${entityType === 'franchise' ? 'bg-purple-600/20 border-purple-500 ring-1 ring-purple-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}>
                                    <div className="font-bold text-lg mb-1 relative z-10">Rede de Franquias</div>
                                    <p className="text-xs text-slate-400 relative z-10">Possui múltiplas unidades.</p>
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                </button>
                            </div>

                            <button onClick={() => setStep(2)} className="w-full bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-900/20">
                                Continuar
                            </button>
                        </div>
                    )}

                    {/* STEP 2: DETAILS */}
                    {step === 2 && (
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl animate-in slide-in-from-right duration-500">
                            <div className="flex items-center gap-2 mb-8 cursor-pointer text-slate-500 hover:text-white transition-colors" onClick={() => setStep(1)}><ArrowRight className="rotate-180" size={16} /> Voltar</div>
                            <h2 className="text-3xl font-bold mb-8">Dados de Capacidade</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {(entityType === 'clinic' || entityType === 'franchise') && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Número de Salas de Atendimento</label>
                                        <input type="number" min="1" value={ns} onChange={e => setNs(Math.max(1, Number(e.target.value)))} className="w-full bg-slate-800 p-4 rounded-xl text-white font-bold text-xl border border-slate-700 focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                )}
                                {entityType === 'franchise' && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2">Número de Unidades</label>
                                        <input type="number" min="1" value={nu} onChange={e => setNu(Math.max(1, Number(e.target.value)))} className="w-full bg-slate-800 p-4 rounded-xl text-white font-bold text-xl border border-slate-700 focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Turnos Semanais por Sala (Max 14)</label>
                                    <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 focus-within:border-purple-500 transition-all">
                                        <Clock className="text-blue-500" />
                                        <input type="number" min="1" max="14" value={nt} onChange={e => setNt(Math.min(14, Math.max(1, Number(e.target.value))))} className="bg-transparent w-full text-white font-bold text-xl outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Tempo Médio de Atendimento</label>
                                    <select value={tmd} onChange={e => setTmd(Number(e.target.value) as any)} className="w-full bg-slate-800 p-4 rounded-xl text-white font-bold text-xl border border-slate-700 focus:border-purple-500 outline-none transition-all cursor-pointer">
                                        <option value={20}>20 minutos</option>
                                        <option value={30}>30 minutos</option>
                                        <option value={60}>60 minutos (1h)</option>
                                        <option value={90}>90 minutos (1.5h)</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Melhor Faturamento Mensal (Últimos 12 meses)</label>
                                    <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 focus-within:border-green-500 transition-all shadow-inner shadow-black/20">
                                        <DollarSign className="text-green-500" />
                                        <input type="number" value={mfm || ''} onChange={e => setMfm(Number(e.target.value))} placeholder="0,00" className="bg-transparent w-full text-white font-bold text-xl outline-none" />
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setStep(3)} className="w-full bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-900/20">
                                Calcular Potencial Agora
                            </button>
                        </div>
                    )}

                    {/* STEP 3: LEAD CAPTURE */}
                    {step === 3 && (
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl animate-in slide-in-from-right duration-500 max-w-2xl mx-auto">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6 border border-green-500/20">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                <h2 className="text-3xl font-bold mb-3 text-white">Cálculo Realizado</h2>
                                <p className="text-slate-400">Insira seus dados para liberar o relatório detalhado.</p>
                            </div>

                            <form onSubmit={handleCapture} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Nome Completo</label>
                                    <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-slate-600" placeholder="Seu Nome" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">E-mail Profissional</label>
                                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-slate-600" placeholder="seu@email.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">WhatsApp</label>
                                    <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-slate-600" placeholder="(DD) 99999-9999" />
                                </div>

                                <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-xl text-white shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]">
                                    {isSubmitting ? 'Gerando...' : 'Ver Meu Relatório'} <Lock size={20} />
                                </button>
                                <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                                    <Lock size={12} /> Seus dados estão seguros. Não enviamos spam.
                                </p>
                            </form>
                        </div>
                    )}

                    {/* STEP 4: RESULT */}
                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                                <div className="bg-slate-800/50 p-10 border-b border-slate-700 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                                    <Sparkles className="mx-auto text-yellow-400 mb-4" size={32} />
                                    <h2 className="text-2xl font-bold text-slate-300 mb-2">Seu Potencial Mensal</h2>
                                    <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-6 drop-shadow-sm">
                                        {formatCurrency(results.potentialRevenue)}
                                    </div>

                                    {results.lostRevenue > 0 ? (
                                        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-full text-base font-bold animate-pulse">
                                            <TrendingUp size={20} />
                                            Você está deixando {formatCurrency(results.lostRevenue)} na mesa todos os meses.
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-full text-base font-bold">
                                            <CheckCircle size={20} />
                                            Você já está no caminho da alta performance!
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                    <div className="h-80 w-full bg-slate-800/30 rounded-2xl p-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 'bold' }} />
                                                <YAxis hide />
                                                <Tooltip
                                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                                    formatter={(val) => formatCurrency(Number(val))}
                                                />
                                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-3xl font-bold mb-4 text-white">Como alcançar a meta?</h3>
                                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                            O <span className="text-purple-400 font-bold">I'mdoc Saas</span> organiza sua agenda, reduz faltas com IA e otimiza cada turno para você atingir a ocupação máxima ideal, sem sobrecarga.
                                        </p>
                                        <div className="space-y-4">
                                            <button onClick={() => navigate('/signup')} className="w-full py-4 bg-white text-purple-900 rounded-xl font-black text-lg hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                                Começar Teste Grátis Agora
                                            </button>
                                            <button onClick={() => window.open('https://wa.me/55000000000', '_blank')} className="w-full py-4 bg-transparent border border-slate-700 text-slate-300 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all">
                                                Falar com Consultor
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default RevenueCalculatorPage;
