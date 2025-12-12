import React, { useState } from 'react';
import { X, Copy, CheckCircle, Smartphone, CreditCard, FileText } from 'lucide-react';
import { asaasService } from '@/services/asaasService';
import { useToast } from '@/components/ui/ToastContext';
import { SaaSLead, SaaSPlan } from '@/types_saas';
import { SAAS_PLANS_CONFIG } from '@/components/modules/saas/saasPlans';
import { maskCpfCnpj } from '@/utils/masks';

interface QuickPaymentLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    lead?: SaaSLead | null;
}

// Função auxiliar para gerar CPF válido para testes
const generateCpf = () => {
    const rnd = (n: number) => Math.round(Math.random() * n);
    const mod = (base: number, div: number) => Math.round(base - Math.floor(base / div) * div);
    const n = Array(9).fill(0).map(() => rnd(9));
    let d1 = n.reduce((total, num, i) => total + num * (10 - i), 0);
    d1 = 11 - mod(d1, 11);
    if (d1 >= 10) d1 = 0;
    let d2 = n.reduce((total, num, i) => total + num * (11 - i), 0) + d1 * 2;
    d2 = 11 - mod(d2, 11);
    if (d2 >= 10) d2 = 0;
    return `${n.join('')}${d1}${d2}`;
};

const QuickPaymentLinkModal: React.FC<QuickPaymentLinkModalProps> = ({ isOpen, onClose, onSuccess, lead }) => {


    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');

    // Form State
    const [value, setValue] = useState<string>('1.00'); // Default demo value
    const [description, setDescription] = useState<string>('Teste de Integração Sandbox');

    // New Recurrence State
    const [isRecurrent, setIsRecurrent] = useState(false);
    const [cycle, setCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
    const [selectedPlan, setSelectedPlan] = useState<SaaSPlan | ''>('');
    const [customerCpf, setCustomerCpf] = useState('');
    const [customerName, setCustomerName] = useState('');

    const [generatedLink, setGeneratedLink] = useState<string>('');



    // Auto-fill from Lead
    React.useEffect(() => {
        if (!SAAS_PLANS_CONFIG) return;
        if (isOpen && lead) {
            const planConfig = SAAS_PLANS_CONFIG[lead.planInterest];
            if (planConfig) {
                setValue(planConfig.monthlyPrice.toFixed(2));
                setDescription(`Assinatura ${planConfig.name} - ${lead.clinicName}`);
                setIsRecurrent(true);
                setCycle('MONTHLY');
                setSelectedPlan(lead.planInterest);
            }
            // Auto-fill customer data
            setCustomerCpf(lead.cnpj || '');
            setCustomerName(lead.legalName || lead.clinicName || lead.name || '');
        } else if (isOpen && !lead) {
            // Reset for generic use
            setValue('0.00');
            setDescription('');
            setIsRecurrent(false);
            setSelectedPlan('');
            setCustomerCpf('');
            setCustomerName('');
        }
    }, [isOpen, lead]);

    // Handle Plan Selection Change
    const handlePlanChange = (plan: SaaSPlan) => {
        if (!SAAS_PLANS_CONFIG) return;
        setSelectedPlan(plan);
        const config = SAAS_PLANS_CONFIG[plan];
        if (config) {
            setValue(cycle === 'YEARLY' ? config.yearlyPrice.toFixed(2) : config.monthlyPrice.toFixed(2));
            setDescription(`Assinatura ${config.name}`);
            setIsRecurrent(true);
        }
    };

    const handleCreateLink = async () => {
        setIsLoading(true);
        try {
            const numValue = parseFloat(value.replace(',', '.'));

            if (isNaN(numValue) || numValue <= 0) {
                addToast('Valor inválido', 'error');
                return;
            }

            if (!customerCpf || !customerName) {
                addToast('Preencha CPF/CNPJ e Nome do Cliente', 'error');
                return;
            }

            // 1. Busca ou Cria Cliente
            let cpfCnpjToUse = customerCpf.replace(/\D/g, '');
            let nameToUse = customerName;
            let addressData = {};

            if (lead) {
                // Se tiver lead, usa os dados do lead para garantir endereço completo
                addressData = {
                    postalCode: lead.zipCode,
                    address: lead.address,
                    addressNumber: lead.number,
                    complement: lead.complement,
                    province: lead.neighborhood,
                };
            }

            let customer = await asaasService.findCustomer(cpfCnpjToUse);
            if (!customer) {
                customer = await asaasService.createCustomer({
                    name: nameToUse,
                    cpfCnpj: cpfCnpjToUse,
                    email: lead?.email,
                    mobilePhone: lead?.phone,
                    ...addressData
                });
            }

            // 2. Cria Cobrança ou Assinatura
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 3); // Vence em 3 dias
            let finalLink = '';

            if (isRecurrent) {
                // ASSINATURA
                const subscription = await asaasService.createSubscription({
                    customer: customer.id,
                    billingType: 'BOLETO',
                    value: numValue,
                    nextDueDate: dueDate.toISOString().split('T')[0],
                    cycle: cycle,
                    description: description
                });

                // Tenta pegar a primeira fatura
                const payments = await asaasService.listSubscriptionPayments(subscription.id);
                if (payments.data && payments.data.length > 0) {
                    finalLink = payments.data[0].invoiceUrl;
                } else {
                    finalLink = `https://sandbox.asaas.com/subscriptions/${subscription.id}`; // Fallback visual
                }

            } else {
                // COBRANÇA AVULSA
                const response = await asaasService.createPayment({
                    customer: customer.id,
                    billingType: 'PIX', // Gera link de pagamento versátil
                    value: numValue,
                    dueDate: dueDate.toISOString().split('T')[0],
                    description: description
                });
                finalLink = response.invoiceUrl;
            }

            if (finalLink) {
                setGeneratedLink(finalLink);
                setStep('success');
                addToast(isRecurrent ? 'Assinatura criada!' : 'Cobrança criada!', 'success');
                if (onSuccess) onSuccess();
            } else {
                throw new Error('Resposta inválida do Asaas');
            }
        } catch (error: any) {
            console.error(error);
            addToast(error.message || 'Erro ao criar link', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        addToast('Link copiado!', 'success');
    };

    if (!isOpen) return null;

    // Safety Check for Runtime Dependencies
    if (!SaaSPlan || !SAAS_PLANS_CONFIG) {
        console.error("Critical Dependencies Missing in QPModal used in SaaSFinanceModule:", { SaaSPlan, SAAS_PLANS_CONFIG });
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-900/90 text-white p-8 animate-in fade-in zoom-in duration-300">
                <div className="bg-red-950 border-2 border-red-500 p-8 rounded-2xl max-w-lg shadow-2xl">
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-red-100">
                        <span className="text-3xl">⚠️</span> Erro de Dependência
                    </h3>
                    <p className="text-red-200 mb-4 text-lg">
                        O sistema falhou ao carregar as configurações de Planos SaaS.
                    </p>
                    <div className="bg-black/40 p-4 rounded-lg text-sm font-mono text-red-300 border border-red-500/30 overflow-auto max-h-40">
                        <p><strong>Config Status:</strong></p>
                        <p>SaaSPlan Enum: {typeof SaaSPlan !== 'undefined' ? 'Loaded ✅' : 'Missing ❌'}</p>
                        <p>SAAS_PLANS_CONFIG: {typeof SAAS_PLANS_CONFIG !== 'undefined' ? 'Loaded ✅' : 'Missing ❌'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-8 w-full bg-white hover:bg-red-50 text-red-900 px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Fechar Janela
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-all duration-300 transform scale-100`}>

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Nova Cobrança Rápida</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'form' ? (
                        <div className="space-y-4">

                            {/* Customer Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">CPF / CNPJ</label>
                                    <input
                                        type="text"
                                        value={customerCpf}
                                        onChange={(e) => setCustomerCpf(maskCpfCnpj(e.target.value))}
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white text-gray-700"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Cliente</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white text-gray-700"
                                        placeholder="Nome Completo"
                                    />
                                </div>
                            </div>

                            {/* Plan Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Selecionar Plano (Opcional)</label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white text-gray-700"
                                    value={selectedPlan}
                                    onChange={(e) => handlePlanChange(e.target.value as SaaSPlan)}
                                >
                                    <option value="">Personalizado / Avulso</option>
                                    <option value={SaaSPlan.START}>Plano Start (R$ 199,90)</option>
                                    <option value={SaaSPlan.GROWTH}>Plano Growth (R$ 399,90)</option>
                                    <option value={SaaSPlan.EMPIRE}>Plano Empire (R$ 799,90)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Valor (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full text-2xl font-bold p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                    placeholder="0,00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 text-sm resize-none"
                                    placeholder="Ex: Consultoria Técnica..."
                                />
                            </div>

                            {/* Recurrence Options */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isRecurrent}
                                        onChange={(e) => setIsRecurrent(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Assinatura Recorrente?</span>
                                </label>

                                {isRecurrent && (
                                    <select
                                        value={cycle}
                                        onChange={(e) => setCycle(e.target.value as any)}
                                        className="text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-blue-500 text-gray-700"
                                    >
                                        <option value="MONTHLY">Mensal</option>
                                        <option value="YEARLY">Anual</option>
                                    </select>
                                )}
                            </div>

                            <div className="flex gap-2 text-xs text-gray-400 p-1">
                                <div className="flex items-center gap-1"><Smartphone size={12} /> Pix</div>
                                <div className="flex items-center gap-1"><CreditCard size={12} /> Cartão</div>
                                <div className="flex items-center gap-1"><FileText size={12} /> Boleto</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">Link Gerado!</h4>
                                <p className="text-sm text-gray-500">Envie este link para o cliente realizar o pagamento.</p>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl mt-4">
                                <span className="text-xs text-blue-600 font-mono flex-1 truncate">{generatedLink}</span>
                                <button
                                    onClick={handleCopyLink}
                                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"
                                    title="Copiar"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-3">
                    {step === 'form' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateLink}
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'Gerar Link'
                                )}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg"
                        >
                            Fechar e Atualizar Lista
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickPaymentLinkModal;
