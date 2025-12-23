import React, { useState, useEffect } from 'react';
import { SaaSLead, SaaSLeadStage, SaaSPlan, BRAZIL_STATES } from '@/types';
import { XCircle } from 'lucide-react';
import { maskPhone, maskCEP, maskCpfCnpj } from '../../../../utils/masks';
import { SAAS_PLANS_CONFIG } from '../saasPlans';

interface CreateLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (lead: SaaSLead) => Promise<void>;
}

export function CreateLeadModal({ isOpen, onClose, onCreate }: CreateLeadModalProps) {
    const [formData, setFormData] = useState<Partial<SaaSLead>>({
        name: '',
        clinicName: '',
        email: '',
        phone: '',
        planInterest: SaaSPlan.GROWTH,
        stage: SaaSLeadStage.NEW,
        estimatedValue: 0,
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
    });

    // Initialize estimated value when modal opens or plan changes
    useEffect(() => {
        if (isOpen) {
            const config = SAAS_PLANS_CONFIG[formData.planInterest || SaaSPlan.GROWTH];
            if (formData.estimatedValue === 0 && config) {
                setFormData(prev => ({ ...prev, estimatedValue: config.monthlyPrice }));
            }
        }
    }, [isOpen, formData.planInterest, formData.estimatedValue]);

    const handleSubmit = async () => {
        if (!formData.name || !formData.clinicName || !formData.email || !formData.phone) {
            alert('Preencha Nome, Clínica, Email e Telefone.');
            return;
        }

        const newLead: SaaSLead = {
            id: crypto.randomUUID(),
            name: formData.name!,
            clinicName: formData.clinicName!,
            legalName: formData.legalName,
            email: formData.email!,
            phone: formData.phone!,
            planInterest: formData.planInterest as SaaSPlan,
            stage: SaaSLeadStage.NEW,
            source: 'outbound',
            status: 'active',
            notes: '',
            cnpj: formData.cnpj,
            zipCode: formData.zipCode,
            address: formData.address,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            estimatedValue: formData.estimatedValue || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await onCreate(newLead);

        // Reset form
        setFormData({
            name: '', clinicName: '', legalName: '', email: '', phone: '',
            planInterest: SaaSPlan.GROWTH, estimatedValue: 0, cnpj: '',
            address: '', number: '', complement: '', neighborhood: '', city: '', state: ''
        });
    };

    const handleCEPChange = async (value: string) => {
        const cep = maskCEP(value);
        setFormData(prev => ({ ...prev, zipCode: cep }));

        if (cep.length === 9) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        zipCode: cep,
                        address: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                >
                    <XCircle size={28} />
                </button>

                <h3 className="text-2xl font-bold text-white mb-2">Adicionar cliente</h3>
                <p className="text-slate-400 text-sm mb-8">Preencha os campos abaixo para adicionar o seu cliente.</p>

                <div className="space-y-8">
                    {/* DADOS DO CLIENTE */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">Dados do cliente</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Informe o nome do cliente"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">CPF ou CNPJ (Opcional)</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.cnpj || ''}
                                    onChange={e => setFormData({ ...formData, cnpj: maskCpfCnpj(e.target.value) })}
                                    maxLength={18}
                                    placeholder="Informe o CPF ou CNPJ do cliente"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Informe o email do cliente"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Celular</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                                    maxLength={15}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome da Clínica (Interno)</label>
                                <input
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-lg px-4 py-2 text-sm text-slate-300 focus:border-blue-500 outline-none transition-colors"
                                    value={formData.clinicName}
                                    onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                                    placeholder="Ex: Clínica Real"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Razão Social (Interno)</label>
                                <input
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-lg px-4 py-2 text-sm text-slate-300 focus:border-blue-500 outline-none transition-colors"
                                    value={formData.legalName || ''}
                                    onChange={e => setFormData({ ...formData, legalName: e.target.value })}
                                    placeholder="Ex: Razão Social LTDA"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ENDEREÇO */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">Endereço</h4>
                        <div className="grid grid-cols-4 gap-6">
                            <div className="col-span-4 md:col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">CEP (Opcional)</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.zipCode || ''}
                                    onChange={e => handleCEPChange(e.target.value)}
                                    placeholder="00000-000"
                                    maxLength={9}
                                />
                            </div>
                            <div className="col-span-4 md:col-span-3 hidden md:block"></div>

                            <div className="col-span-4 md:col-span-3">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rua (Opcional)</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.address || ''}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="col-span-4 md:col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Número (Opcional)</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.number || ''}
                                    onChange={e => setFormData({ ...formData, number: e.target.value })}
                                />
                            </div>

                            <div className="col-span-4 md:col-span-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Complemento (Opcional)</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.complement || ''}
                                    onChange={e => setFormData({ ...formData, complement: e.target.value })}
                                />
                            </div>
                            <div className="col-span-4 md:col-span-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bairro (Opcional)</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.neighborhood || ''}
                                    onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                                />
                            </div>

                            <div className="col-span-4 md:col-span-3">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cidade (Opcional)</label>
                                <input
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.city || ''}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div className="col-span-4 md:col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Estado</label>
                                <select
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.state || ''}
                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                >
                                    <option value="">UF</option>
                                    {BRAZIL_STATES.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* DADOS COMERCIAIS */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">Dados Comerciais (Interno)</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Plano de Interesse</label>
                                <select
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    value={formData.planInterest}
                                    onChange={e => {
                                        const newPlan = e.target.value as SaaSPlan;
                                        const config = SAAS_PLANS_CONFIG[newPlan];
                                        setFormData({
                                            ...formData,
                                            planInterest: newPlan,
                                            estimatedValue: config ? config.monthlyPrice : 0
                                        });
                                    }}
                                >
                                    <option value={SaaSPlan.START}>Start</option>
                                    <option value={SaaSPlan.GROWTH}>Growth</option>
                                    <option value={SaaSPlan.EMPIRE}>Empire</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor Estimado (R$)</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    value={formData.estimatedValue}
                                    onChange={e => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Adicionar cliente
                    </button>
                </div>
            </div>
        </div>
    );
}
