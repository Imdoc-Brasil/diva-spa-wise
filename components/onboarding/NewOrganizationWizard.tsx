import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '../context/OrganizationContext';
import { SUBSCRIPTION_PLANS } from '../../utils/subscriptionPlans';
import { Organization, OrganizationType, SubscriptionPlan } from '../../types';
import { Building, CreditCard, ChevronRight, Check, ArrowLeft, Globe, Shield } from 'lucide-react';

const NewOrganizationWizard: React.FC = () => {
    const navigate = useNavigate();
    const { createOrganization } = useOrganization();

    // Steps
    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
        { id: 1, title: 'Dados da Clínica', icon: Building },
        { id: 2, title: 'Escolha o Plano', icon: Shield },
        { id: 3, title: 'Pagamento', icon: CreditCard }
    ];

    // Form Data
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [type, setType] = useState<OrganizationType>('clinic');
    const [selectedPlanId, setSelectedPlanId] = useState<string>('professional');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    // Processing State
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCreate = async () => {
        setIsProcessing(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId);

        const newOrg: Organization = {
            id: `org_${Date.now()}`,
            name,
            slug,
            displayName: name,
            type,
            subscriptionPlanId: selectedPlanId,
            subscriptionStatus: 'trial',
            subscriptionStartedAt: new Date().toISOString(),
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            billingCycle,
            limits: {
                maxUnits: selectedPlan?.limits.maxUnits || 1,
                maxUsers: selectedPlan?.limits.maxUsers || 5,
                maxClients: selectedPlan?.limits.maxClients || 500,
                maxStorage: selectedPlan?.limits.maxStorage || 10,
                features: selectedPlan?.features || []
            },
            usage: {
                units: 1,
                users: 1,
                clients: 0,
                storage: 0,
                appointmentsThisMonth: 0
            },
            owner: {
                userId: 'current_user', // In real app, get from auth
                name: 'Você',
                email: 'voce@email.com',
                phone: ''
            },
            billing: {
                email: 'voce@email.com'
            },
            settings: {
                timezone: 'America/Sao_Paulo',
                language: 'pt-BR',
                currency: 'BRL',
                dateFormat: 'DD/MM/YYYY',
                timeFormat: '24h',
                allowMultiUnit: true,
                shareClientsAcrossUnits: true,
                requireTwoFactor: false,
                allowStaffDataAccess: true,
                enableWhatsAppIntegration: true,
                enableEmailMarketing: true
            },
            createdAt: new Date().toISOString(),
            activatedAt: new Date().toISOString()
        };

        createOrganization(newOrg);
    };

    // Auto-generate slug
    const handleNameChange = (val: string) => {
        setName(val);
        const generated = val.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-')     // Replace spaces with dash
            .replace(/--+/g, '-');    // Remove multiple dashes
        setSlug(generated);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
            {/* Header */}
            <div className="w-full max-w-4xl px-4 mb-8">
                <button
                    onClick={() => navigate('/settings/organization')}
                    className="flex items-center text-sm text-gray-500 hover:text-diva-dark mb-4 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-1" /> Voltar
                </button>
                <h1 className="text-3xl font-serif font-bold text-diva-dark">Criar Nova Organização</h1>
                <p className="text-gray-500">Configure seu novo ambiente de trabalho em poucos passos.</p>
            </div>

            {/* Stepper */}
            <div className="w-full max-w-4xl px-4 mb-10">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                    {steps.map((step, idx) => (
                        <div key={step.id} className={`flex flex-col items-center bg-gray-50 px-2 ${currentStep >= step.id ? 'text-diva-primary' : 'text-gray-300'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${currentStep >= step.id ? 'bg-diva-primary border-diva-primary text-white' : 'bg-white border-gray-200'}`}>
                                <step.icon size={18} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Card */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* STEP 1: IDENTITY */}
                {currentStep === 1 && (
                    <div className="p-8 animate-in slide-in-from-right duration-300">
                        <h2 className="text-xl font-bold mb-6 text-diva-dark">Identidade da Clínica</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Organização</label>
                                <input
                                    value={name}
                                    onChange={e => handleNameChange(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-diva-primary focus:ring-2 focus:ring-diva-primary/20 transition-all text-lg"
                                    placeholder="Ex: Clínica Bem Estar"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Endereço Web (Slug)</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium">
                                            app.imdoc.com/
                                        </span>
                                        <input
                                            value={slug}
                                            onChange={e => setSlug(e.target.value)}
                                            className="flex-1 p-4 border border-gray-200 rounded-r-xl outline-none focus:border-diva-primary focus:ring-2 focus:ring-diva-primary/20 transition-all min-w-0"
                                            placeholder="clinica-bem-estar"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Este será o link para sua equipe acessar o sistema.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Organização</label>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value as OrganizationType)}
                                        className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-diva-primary focus:ring-2 focus:ring-diva-primary/20 transition-all bg-white"
                                    >
                                        <option value="individual">Profissional Individual</option>
                                        <option value="clinic">Clínica / Consultório</option>
                                        <option value="group">Rede de Clínicas</option>
                                        <option value="franchise">Franquia</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={() => setCurrentStep(2)}
                                disabled={!name || !slug}
                                className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${!name || !slug ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-diva-primary text-white hover:bg-diva-dark shadow-lg shadow-diva-primary/30'}`}
                            >
                                Próximo Passo <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: PLANS */}
                {currentStep === 2 && (
                    <div className="p-8 animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-diva-dark">Escolha seu Plano</h2>
                            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow text-diva-dark' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Mensal
                                </button>
                                <button
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white shadow text-diva-dark' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Anual (-17%)
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {SUBSCRIPTION_PLANS.map(plan => (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlanId(plan.id)}
                                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedPlanId === plan.id ? 'border-diva-primary bg-diva-light/5 shadow-xl scale-105 z-10' : 'border-gray-100 hover:border-diva-primary/30 hover:shadow-lg'}`}
                                >
                                    {plan.popular && (
                                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                            Mais Popular
                                        </span>
                                    )}
                                    <h3 className="text-lg font-bold text-diva-dark mb-2">{plan.name}</h3>
                                    <div className="mb-4">
                                        <span className="text-3xl font-serif font-bold text-diva-dark">
                                            {plan.pricing.currency === 'BRL' ? 'R$' : '$'}
                                            {billingCycle === 'monthly' ? plan.pricing.monthly : (plan.pricing.yearly / 12).toFixed(2)}
                                        </span>
                                        <span className="text-gray-400 text-sm">/mês</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-6 h-10">{plan.description}</p>

                                    <div className="space-y-3 mb-6">
                                        {plan.features.slice(0, 5).map((feat, i) => (
                                            <div key={i} className="flex items-center text-sm text-gray-600">
                                                <Check size={14} className="text-green-500 mr-2 flex-shrink-0" />
                                                <span className="truncate">{feat}</span>
                                            </div>
                                        ))}
                                        {plan.features.length > 5 && (
                                            <p className="text-xs text-diva-primary font-medium pl-6">+ {plan.features.length - 5} benefícios</p>
                                        )}
                                    </div>

                                    <div className={`w-full py-2 rounded-lg text-center font-bold text-sm transition-colors ${selectedPlanId === plan.id ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}`}>
                                        {selectedPlanId === plan.id ? 'Selecionado' : 'Escolher'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex justify-between">
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="text-gray-500 font-medium hover:text-diva-dark transition-colors"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={() => setCurrentStep(3)}
                                className="px-8 py-3 bg-diva-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-diva-dark transition-colors shadow-lg shadow-diva-primary/30"
                            >
                                Próximo Passo <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: PAYMENT */}
                {currentStep === 3 && (
                    <div className="p-8 animate-in slide-in-from-right duration-300">
                        <h2 className="text-xl font-bold mb-6 text-diva-dark">Confirmação e Pagamento</h2>

                        <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl mb-8 flex items-start">
                            <Shield className="flex-shrink-0 mr-3 mt-1" size={20} />
                            <div>
                                <p className="font-bold text-sm">Ambiente Seguro</p>
                                <p className="text-xs mt-1">Seus dados são criptografados. Você terá 14 dias de teste grátis antes da primeira cobrança.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Dados do Cartão</h3>
                                <div className="space-y-4">
                                    <input
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary bg-gray-50"
                                        placeholder="Número do Cartão"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary bg-gray-50"
                                            placeholder="MM/AA"
                                        />
                                        <input
                                            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary bg-gray-50"
                                            placeholder="CVC"
                                        />
                                    </div>
                                    <input
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary bg-gray-50"
                                        placeholder="Nome impresso no cartão"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Resumo do Pedido</h3>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="font-bold text-diva-dark">Plano {SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId)?.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">Ciclo {billingCycle === 'monthly' ? 'Mensal' : 'Anual'}</p>
                                        </div>
                                        <p className="font-bold text-diva-dark">
                                            R$ {billingCycle === 'monthly'
                                                ? SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId)?.pricing.monthly
                                                : SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId)?.pricing.yearly}
                                        </p>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                        <p className="font-bold text-lg">Total Hoje</p>
                                        <p className="font-bold text-lg text-green-600">R$ 0,00</p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-right">Cobrança inicia em 14 dias.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-between">
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="text-gray-500 font-medium hover:text-diva-dark transition-colors"
                                disabled={isProcessing}
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isProcessing}
                                className={`px-8 py-3 bg-diva-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-diva-dark transition-all shadow-lg shadow-diva-primary/30 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isProcessing ? 'Criando Ambiente...' : 'Finalizar Criação'} <Check size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewOrganizationWizard;
