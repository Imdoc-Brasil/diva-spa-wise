import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Building2, ArrowRight, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

const OrganizationSetup: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useData();

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: Input, 2: Success

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        // Auto-generate slug
        const generatedSlug = val
            .toLowerCase()
            .normalize('NFD') // Remove accents
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphen
            .replace(/-+/g, '-') // Remove duplicate hyphens
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
        setSlug(generatedSlug);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !slug) return;

        setIsSubmitting(true);

        try {
            // 1. Create Organization in Supabase
            const { data, error } = await supabase
                .from('organizations')
                .insert([
                    {
                        name: name,
                        slug: slug,
                        primary_color: '#9333ea', // Default Purple
                        subscription_status: 'trial'
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            console.log('Organization created:', data);

            // Success Animation
            setStep(2);

            // Wait a moment then redirect
            setTimeout(() => {
                navigate('/master'); // Or dashboard
                addToast('Clínica configurada com sucesso!', 'success');
            }, 2000);

        } catch (error: any) {
            console.error('Error creating org:', error);
            addToast('Erro ao criar clínica. O nome da URL pode já estar em uso.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans text-white">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-6">

                {/* Logo / Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)]">
                        <Sparkles className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                        Bem-vindo ao Diva
                    </h1>
                    <p className="text-slate-400">Configure sua clínica para começar.</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {step === 1 ? (
                        <form onSubmit={handleCreate} className="space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Nome da Clínica</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={handleNameChange}
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium"
                                        placeholder="Ex: Clínica Dermatológica Silva"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">URL Personalizada</label>
                                <div className="relative flex items-center">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-mono text-sm">diva.app/</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        className="block w-full pl-24 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-purple-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono text-sm"
                                        placeholder="clinica-silva"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-500 ml-1">
                                    Este será o link para seus pacientes e funcionários acessarem.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-lg shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin h-6 w-6" />
                                ) : (
                                    <>
                                        Criar Meu Ambiente
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-10 animate-fade-in-up">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6 text-green-400">
                                <CheckCircle size={48} className="animate-bounce-short" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Ambiente Criado!</h2>
                            <p className="text-slate-400">Redirecionando para seu dashboard...</p>
                        </div>
                    )}
                </div>

                <p className="text-center mt-8 text-sm text-slate-500">
                    &copy; 2025 Diva Spa OS. Secure Multi-Tenant Architecture.
                </p>
            </div>
        </div>
    );
};

export default OrganizationSetup;
