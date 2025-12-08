
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '../../utils/subscriptionPlans';
import { Organization, OrganizationType } from '../../types';
import { useData } from '../context/DataContext';
import { Building, CreditCard, ChevronRight, Check, ArrowLeft, Shield, User, Lock, Mail } from 'lucide-react';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useData(); // We will use this to "login" the user after creation

    // Initial Plan from URL
    const planParam = searchParams.get('plan');
    const initialPlanId = planParam === 'start' ? 'starter' :
        planParam === 'growth' ? 'professional' :
            planParam === 'empire' ? 'enterprise' : 'starter';

    // Steps
    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
        { id: 1, title: 'Criar Conta', icon: User },
        { id: 2, title: 'Dados da Clínica', icon: Building },
        { id: 3, title: 'Plano', icon: Shield },
        { id: 4, title: 'Confirmação', icon: CreditCard }
    ];

    // Form Data - User
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    // Form Data - Org
    const [orgName, setOrgName] = useState('');
    const [orgSlug, setOrgSlug] = useState('');
    const [orgType, setOrgType] = useState<OrganizationType>('clinic');
    const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    // Processing State
    const [isProcessing, setIsProcessing] = useState(false);

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

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // In a real app, this would create the User and the Organization via API
        // Here we will simulate a successful signup and auto-login

        // Mock Login as Admin
        // In reality, we would create a new user object, but for this demo, we can just switch role to ADMIN
        // and redirect to dashboard.
        // login('ADMIN'); // This comes from DataContext, usually expects UserRole

        // Redirect
        navigate('/?welcome=true');
    };

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
                                {SUBSCRIPTION_PLANS.map(plan => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedPlanId === plan.id ? 'border-purple-500 bg-purple-50' : 'border-slate-100 hover:border-purple-200'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlanId === plan.id ? 'border-purple-500 bg-purple-500' : 'border-slate-300'}`}>
                                            {selectedPlanId === plan.id && <Check size={14} className="text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-bold text-slate-800">{plan.name}</h3>
                                                <span className="font-bold text-purple-600">
                                                    R$ {billingCycle === 'monthly' ? plan.pricing.monthly : (plan.pricing.yearly / 12).toFixed(0)}/mês
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">{plan.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: PAYMENT MOCK */}
                    {currentStep === 4 && (
                        <div className="animate-in slide-in-from-right duration-300 fade-in flex-1">
                            <h2 className="text-2xl font-bold mb-2 text-slate-800">Quase lá!</h2>
                            <p className="text-slate-500 mb-6">Insira seus dados para iniciar o teste grátis de 14 dias.</p>

                            <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl mb-6 flex gap-3 text-purple-800 text-sm">
                                <Shield className="shrink-0" size={20} />
                                <div>
                                    <p className="font-bold">Teste Grátis de 14 Dias</p>
                                    <p className="opacity-80">Você não será cobrado agora. Cancele a qualquer momento.</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Número do Cartão" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="MM/AA" />
                                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="CVC" />
                                </div>
                                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Nome no Cartão" />
                            </div>

                            <div className="flex justify-between items-center py-4 border-t border-slate-100">
                                <span className="font-bold text-slate-600">Total a pagar hoje:</span>
                                <span className="text-xl font-bold text-green-600">R$ 0,00</span>
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
                                {isProcessing ? 'Criando Conta...' : 'Finalizar e Começar'}
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
