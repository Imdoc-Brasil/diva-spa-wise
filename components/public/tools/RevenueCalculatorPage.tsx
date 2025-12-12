import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { SaaSLead, SaaSLeadStage, SaaSPlan } from '../../../types';
import { Calculator, ArrowRight, DollarSign, Users, Building, CheckCircle, Lock, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useToast } from '../../ui/ToastContext';

const RevenueCalculatorPage: React.FC = () => {
    const navigate = useNavigate();
    const { addSaaSLead } = useData();
    const { addToast } = useToast();

    // Steps: 0 = Intro, 1 = Data, 2 = Contact, 3 = Result
    const [step, setStep] = useState(0);

    // Inputs
    const [chairs, setChairs] = useState(3);
    const [ticket, setTicket] = useState(250);
    const [daysOpen, setDaysOpen] = useState(22); // Mensal (dias úteis)
    const [dailyCapacity, setDailyCapacity] = useState(8); // Atendimentos por dia por sala
    const [occupancyRate, setOccupancyRate] = useState(40); // % Atual estimada

    // Lead Data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculation Results
    const calculatePotential = () => {
        const totalCapacityMonthly = chairs * dailyCapacity * daysOpen;
        const potentialRevenue = totalCapacityMonthly * ticket * 0.85; // 85% occupancy target
        const currentRevenueEstimate = totalCapacityMonthly * ticket * (occupancyRate / 100);
        const lostRevenue = potentialRevenue - currentRevenueEstimate;

        return { potentialRevenue, currentRevenueEstimate, lostRevenue };
    };

    const results = calculatePotential();

    const handleCapture = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const lead: SaaSLead = {
            id: `lead_calc_${Date.now()}`,
            name,
            email,
            phone,
            clinicName: 'Via Calculadora',
            stage: SaaSLeadStage.NEW,
            source: 'landing_page', // Fixed: use valid union type
            planInterest: results.potentialRevenue > 50000 ? SaaSPlan.GROWTH : SaaSPlan.START, // Fixed: use Enum
            status: 'active',
            notes: `Origem: Calculadora Faturamento. Potencial de ${formatCurrency(results.potentialRevenue)}. Perda de ${formatCurrency(results.lostRevenue)}`,
            estimatedValue: results.potentialRevenue > 50000 ? 597 : 297,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            if (addSaaSLead) {
                await addSaaSLead(lead);
            }
            setStep(3);
            addToast('Análise gerada com sucesso!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Erro ao processar. Tente novamente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    const chartData = [
        { name: 'Atual (Est.)', value: results.currentRevenueEstimate, color: '#94a3b8' },
        { name: 'Potencial', value: results.potentialRevenue, color: '#a855f7' }
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
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="w-full max-w-4xl relative z-10">

                    {/* STEP 0: INTRO */}
                    {step === 0 && (
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/10 rounded-3xl mb-8 border border-purple-500/20 shadow-lg shadow-purple-500/20">
                                <Calculator className="text-purple-400" size={40} />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                Calculadora de<br />Potencial de Faturamento
                            </h1>
                            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                                Descubra quanto sua clínica está deixando de ganhar por ineficiência na gestão e buracos na agenda. Análise gratuita em 30 segundos.
                            </p>
                            <button
                                onClick={() => setStep(1)}
                                className="group relative px-10 py-5 bg-white text-slate-900 rounded-full font-black text-xl hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                            >
                                <span className="flex items-center gap-3">
                                    Começar Análise <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    )}

                    {/* STEP 1: CLINIC DATA */}
                    {step === 1 && (
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl animate-in slide-in-from-right duration-500">
                            <h2 className="text-3xl font-bold mb-2">Estrutura da Clínica</h2>
                            <p className="text-slate-400 mb-8">Conte um pouco sobre sua capacidade atual de atendimento.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Salas de Atendimento</label>
                                    <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 border border-slate-700 focus-within:border-purple-500 transition-colors">
                                        <Building className="text-purple-500" size={24} />
                                        <input
                                            type="number"
                                            value={chairs}
                                            onChange={e => setChairs(Number(e.target.value))}
                                            className="bg-transparent w-full text-2xl font-bold outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Ticket Médio (R$)</label>
                                    <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 border border-slate-700 focus-within:border-purple-500 transition-colors">
                                        <DollarSign className="text-green-500" size={24} />
                                        <input
                                            type="number"
                                            value={ticket}
                                            onChange={e => setTicket(Number(e.target.value))}
                                            className="bg-transparent w-full text-2xl font-bold outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Atendimentos / Dia (Capacidade)</label>
                                    <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 border border-slate-700 focus-within:border-purple-500 transition-colors">
                                        <Users className="text-blue-500" size={24} />
                                        <input
                                            type="number"
                                            value={dailyCapacity}
                                            onChange={e => setDailyCapacity(Number(e.target.value))}
                                            className="bg-transparent w-full text-2xl font-bold outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Ocupação Atual Estimada (%)</label>
                                    <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 border border-slate-700 focus-within:border-purple-500 transition-colors">
                                        <TrendingUp className="text-orange-500" size={24} />
                                        <input
                                            type="number"
                                            value={occupancyRate}
                                            onChange={e => setOccupancyRate(Number(e.target.value))}
                                            className="bg-transparent w-full text-2xl font-bold outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <button onClick={() => setStep(0)} className="text-slate-500 hover:text-white font-bold transition-colors">Voltar</button>
                                <button
                                    onClick={() => setStep(2)}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
                                >
                                    Próximo Passo <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: LEAD CAPTURE */}
                    {step === 2 && (
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl animate-in slide-in-from-right duration-500 max-w-2xl mx-auto">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-2xl mb-4 text-green-500">
                                    <CheckCircle size={32} />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Cálculo Pronto!</h2>
                                <p className="text-slate-400">Insira seus dados para liberar o relatório detalhado.</p>
                            </div>

                            <form onSubmit={handleCapture} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Seu Nome</label>
                                    <input
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                        placeholder="Dr. Nome Sobrenome"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">E-mail Corporativo</label>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">WhatsApp</label>
                                    <input
                                        required
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                        placeholder="(DD) 99999-9999"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-xl text-white shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Gerando Relatório...' : 'Ver Meu Faturamento Potencial'}
                                        {!isSubmitting && <Lock size={20} />}
                                    </button>
                                    <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                                        <Lock size={12} /> Seus dados estão 100% seguros.
                                    </p>
                                </div>
                            </form>
                            <button onClick={() => setStep(1)} className="w-full text-center mt-4 text-slate-500 text-sm hover:text-white transition-colors">Voltar e corrigir dados</button>
                        </div>
                    )}

                    {/* STEP 3: RESULTS DASHBOARD */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                                {/* Header Result */}
                                <div className="bg-slate-800/50 p-8 border-b border-slate-700 text-center">
                                    <h2 className="text-2xl text-slate-400 mb-2">Seu Potencial Mensal</h2>
                                    <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4">
                                        {formatCurrency(results.potentialRevenue)}
                                    </div>
                                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-bold">
                                        <AlertCircle size={16} />
                                        Você está deixando {formatCurrency(results.lostRevenue)} na mesa todos os meses.
                                    </div>
                                </div>

                                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Chart */}
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 'bold' }} />
                                                <YAxis hide />
                                                <Tooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                                    formatter={(value) => formatCurrency(Number(value))}
                                                />
                                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Action Plan */}
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                            <Sparkles className="text-purple-500" /> Como atingir esse número?
                                        </h3>
                                        <ul className="space-y-4 mb-8">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                                                <span className="text-slate-300">Automatize confirmações para reduzir No-Show a zero.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                                                <span className="text-slate-300">Use IA para reativar pacientes antigos da base.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                                                <span className="text-slate-300">Ofereça agendamento online 24/7.</span>
                                            </li>
                                        </ul>
                                        <button
                                            onClick={() => navigate('/signup?plan=growth')}
                                            className="w-full py-4 bg-white text-purple-900 rounded-xl font-black text-lg hover:bg-slate-200 transition-all shadow-lg hover:scale-[1.02]"
                                        >
                                            Quero atingir {formatCurrency(results.potentialRevenue)}
                                        </button>
                                        <p className="text-center text-xs text-slate-500 mt-4">
                                            Plano recomendado: Growth (Para Clínicas em Escala)
                                        </p>
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
