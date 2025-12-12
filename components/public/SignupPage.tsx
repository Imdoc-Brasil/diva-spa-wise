
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OrganizationType } from '../../types';
import { useData } from '../context/DataContext';
import { Building, CreditCard, ChevronRight, Check, ArrowLeft, Shield, User, Lock, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabase';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // const { login } = useData(); 

    // Initial Plan from URL
    const planParam = searchParams.get('plan');
    const initialPlanId = planParam || 'start'; // Default to start if not provided

    // Steps
    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
        { id: 1, title: 'Criar Conta', icon: User },
        { id: 2, title: 'Dados da Clínica', icon: Building },
        { id: 3, title: 'Plano', icon: Shield },
        { id: 4, title: 'Confirmação', icon: Check }
    ];

    // Form Data - User
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    // Form Data - Org
    const [orgName, setOrgName] = useState('');
    const [orgSlug, setOrgSlug] = useState('');
    const [orgType, setOrgType] = useState<OrganizationType>('clinic');

    // Plan Data
    const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    // Processing State
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch Plans Dynamically
    useEffect(() => {
        const fetchPlans = async () => {
            const { data } = await supabase.from('saas_plans').select('*');
            if (data) {
                const PLAN_ORDER = ['start', 'growth', 'experts', 'empire'];
                const sorted = (data as any[]).sort((a, b) => PLAN_ORDER.indexOf(a.key) - PLAN_ORDER.indexOf(b.key));
                setPlans(sorted);

                // If the URL param provided a plan that exists, ensure it's selected
                if (planParam && sorted.find(p => p.key === planParam)) {
                    setSelectedPlanId(planParam);
                }
            }
        };
        fetchPlans();
    }, [planParam]);

    // Auto-generate slug
    const handleOrgNameChange = (val: string) => {
        setOrgName(val);
        const generated = val.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-')     // Replace spaces with dash
            .replace(/--+/g, '-');    // Remove multiple dashes
        setOrgSlug(generated);
    };

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else navigate('/sales');
    };


    const handleSignup = async () => {
        setIsProcessing(true);

        try {
            // 1. Sign Up User (Auth)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: userEmail,
                password: userPassword,
                options: {
                    data: {
                        full_name: userName,
                        avatar_url: '' // Optional
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create Organization
                const { data: org, error: orgError } = await (supabase.from('organizations') as any).insert([
                    {
                        name: orgName,
                        slug: orgSlug,
                        primary_color: '#9333ea',
                        subscription_status: 'trial',
                        subscription_plan: selectedPlanId,
                        subscription_cycle: billingCycle,
                        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
                    }
                ])
                    .select()
                    .single();

                if (orgError) throw orgError;

                // 3. Link Profile to Organization
                if (org) {
                    const { error: profileError } = await (supabase.from('profiles') as any).update({
                        organization_id: org.id,
                        role: 'owner'
                    }).eq('id', authData.user.id);

                    if (profileError) throw profileError;
                }

                // 4. Redirect
                if (!authData.session) {
                    alert('Conta criada! Verifique seu email para confirmar antes de entrar.');
                    navigate('/');
                } else {
                    navigate('/?welcome=true');
                }
            }
        } catch (error: any) {
            console.error('Signup Error:', error);
            alert('Erro ao criar conta: ' + (error.message || 'Tente novamente.'));
        } finally {
            setIsProcessing(false);
        }
    };

    const getSelectedPlanDetails = () => {
        return plans.find(p => p.key === selectedPlanId);
    };

    const selectedPlan = getSelectedPlanDetails();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 font-sans">
            {/* Header */}
            <div className="w-full max-w-4xl px-6 mb-8 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white">I</div>
                    <span className="font-bold text-xl tracking-wide text-slate-800">I'mDoc SaaS</span>
                </div>
                <div className="text-sm text-slate-500">
                    Já tem conta? <button onClick={() => navigate('/')} className="text-purple-600 font-bold hover:underline">Entrar</button>
                </div>
            </div>

            {/* Stepper */}
            <div className="w-full max-w-4xl px-6 mb-10">
                <div className="relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-purple-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>

                    <div className="flex justify-between">
                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center group cursor-default">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-300 z-10 ${currentStep >= step.id ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white border-slate-200 text-slate-400'}`}>
                                    <step.icon size={18} />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${currentStep >= step.id ? 'text-purple-600' : 'text-slate-400'}`}>{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col">

                {/* Progress Bar Top */}
                <div className="h-1 w-full bg-slate-100">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
                </div>

                <div className="p-8 md:p-12 flex-1 flex flex-col">

                    {/* STEP 1: USER ACCOUNT */}
                    {currentStep === 1 && (
                        <div className="animate-in slide-in-from-right duration-300 fade-in flex-1">
                            <h2 className="text-2xl font-bold mb-2 text-slate-800">Comece sua jornada</h2>
                            <p className="text-slate-500 mb-8">Crie sua conta de administrador para gerenciar sua clínica.</p>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Seu Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            value={userName}
                                            onChange={e => setUserName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                                            placeholder="Ex: Dr. João Silva"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Seu Email Corporativo</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            value={userEmail}
                                            onChange={e => setUserEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Crie uma Senha Segura</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            value={userPassword}
                                            onChange={e => setUserPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CLINIC DATA */}
                    {currentStep === 2 && (
                        <div className="animate-in slide-in-from-right duration-300 fade-in flex-1">
                            <h2 className="text-2xl font-bold mb-2 text-slate-800">Sobre sua Clínica</h2>
                            <p className="text-slate-500 mb-8">Vamos configurar seu espaço de trabalho digital.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Organização</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            value={orgName}
                                            onChange={e => handleOrgNameChange(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                                            placeholder="Ex: Clínica Bem Estar"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Link de Acesso (Slug)</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-xs font-medium">
                                                app.imdoc.com/
                                            </span>
                                            <input
                                                value={orgSlug}
                                                onChange={e => setOrgSlug(e.target.value)}
                                                className="w-full pl-3 pr-4 py-3 border border-slate-200 rounded-r-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all min-w-0 font-mono text-sm"
                                                placeholder="sua-clinica"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tipo</label>
                                        <select
                                            value={orgType}
                                            onChange={e => setOrgType(e.target.value as OrganizationType)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 bg-slate-50"
                                        >
                                            <option value="individual">Consultório (Individual)</option>
                                            <option value="clinic">Clínica</option>
                                            <option value="group">Rede / Franquia</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PLAN SELECTION */}
                    {currentStep === 3 && (
                        <div className="animate-in slide-in-from-right duration-300 fade-in flex-1">
                            <h2 className="text-2xl font-bold mb-2 text-slate-800">Confirme seu Plano</h2>
                            <p className="text-slate-500 mb-6">Escolha a melhor opção para o seu momento.</p>

                            <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-6 mx-auto">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                                >
                                    Mensal
                                </button>
                                <button
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                                >
                                    Anual (-17%)
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {plans.map(plan => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.key)}
                                        className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedPlanId === plan.key ? 'border-purple-500 bg-purple-50' : 'border-slate-100 hover:border-purple-200'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlanId === plan.key ? 'border-purple-500 bg-purple-500' : 'border-slate-300'}`}>
                                            {selectedPlanId === plan.key && <Check size={14} className="text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-bold text-slate-800">{plan.name}</h3>
                                                <span className="font-bold text-purple-600">
                                                    {plan.monthly_price === 0 ? 'Sob Consulta' : (
                                                        <>
                                                            R$ {billingCycle === 'monthly' ? plan.monthly_price : (plan.yearly_price / 12).toFixed(0)}/mês
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">{plan.description}</p>
                                        </div>
                                    </div>
                                ))}
                                {plans.length === 0 && (
                                    <div className="text-center py-10 text-slate-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Carregando planos...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: TRIAL ACTIVATION (Updated to reflect real flow) */}
                    {currentStep === 4 && (
                        <div className="animate-in slide-in-from-right duration-300 fade-in flex-1">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield size={32} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-slate-800">Tudo pronto!</h2>
                                <p className="text-slate-500">Sua clínica está a um clique de ser otimizada.</p>
                            </div>

                            <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl mb-8">
                                <h3 className="font-bold text-purple-900 mb-4">Resumo da Assinatura</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Organização:</span>
                                        <span className="font-bold text-slate-900">{orgName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Plano Escolhido:</span>
                                        <span className="font-bold text-slate-900">{selectedPlan?.name || 'Start'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Ciclo de Faturamento:</span>
                                        <span className="font-bold text-slate-900">{billingCycle === 'monthly' ? 'Mensal' : 'Anual'}</span>
                                    </div>
                                    <div className="border-t border-purple-200 mt-2 pt-2 flex justify-between text-base">
                                        <span className="font-bold text-purple-900">Período de Teste:</span>
                                        <span className="font-bold text-green-600">14 Dias Grátis</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                                <p>Ao clicar em "Finalizar", você concorda com nossos Termos de Uso e Política de Privacidade.</p>
                                <p className="mt-1">Nenhuma cobrança será realizada hoje. Seu teste vai até {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}.</p>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100">
                        <button
                            onClick={handleBack}
                            disabled={isProcessing}
                            className="text-slate-400 font-bold hover:text-slate-600 transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft size={16} /> Voltar
                        </button>

                        {currentStep < 4 ? (
                            <button
                                onClick={handleNext}
                                disabled={
                                    (currentStep === 1 && (!userName || !userEmail || !userPassword)) ||
                                    (currentStep === 2 && (!orgName || !orgSlug))
                                }
                                className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Continuar <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSignup}
                                disabled={isProcessing}
                                className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200 flex items-center gap-2 disabled:opacity-70"
                            >
                                {isProcessing ? 'Criando Conta...' : 'Ativar Teste Grátis'}
                                {!isProcessing && <Check size={18} />}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignupPage;
