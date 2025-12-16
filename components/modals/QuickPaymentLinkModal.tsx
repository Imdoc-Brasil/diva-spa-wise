import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, Smartphone, CreditCard, FileText, Globe, Link as LinkIcon, AlertCircle, Package, Settings } from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import { PaymentGateway } from '../../types';

interface QuickPaymentLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialValue?: number;
    initialDescription?: string;
}

// MOCK GATEWAYS (Simulating Global Configuration)
const MOCK_ONLINE_GATEWAYS: PaymentGateway[] = [
    {
        id: 'gw_infinitepay',
        name: 'InfinitePay - Online',
        type: 'online_api',
        integrationType: 'api',
        provider: 'infinitepay',
        scope: 'all',
        active: true,
        fees: { debit: 1.38, credit_1x: 2.90, credit_2x_6x: 3.90, credit_7x_12x: 4.90, pix: 0, pix_type: 'percentage' },
        installmentRule: { maxInstallments: 12, maxFreeInstallments: 10, interestRate: 1.99, buyerPaysInterest: false }, // Loja absorve
        settlementDays: { debit: 1, credit: 1, pix: 0 }
    },
    {
        id: 'gw_asaas',
        name: 'Asaas - Cobranças',
        type: 'online_api',
        integrationType: 'api',
        provider: 'asaas',
        scope: 'online_only',
        active: true,
        fees: { debit: 0, credit_1x: 0, credit_2x_6x: 0, credit_7x_12x: 0, pix: 0.99, pix_type: 'fixed' },
        installmentRule: { maxInstallments: 1, maxFreeInstallments: 1, interestRate: 0, buyerPaysInterest: false }, // Só à vista? Assume boleto/pix
        settlementDays: { debit: 1, credit: 1, pix: 0 }
    },
    {
        id: 'gw_stripe',
        name: 'Stripe Checkout',
        type: 'online_api',
        integrationType: 'api',
        provider: 'stripe',
        scope: 'online_only',
        active: true,
        fees: { debit: 0, credit_1x: 3.99, credit_2x_6x: 3.99, credit_7x_12x: 3.99, pix: 0, pix_type: 'fixed' },
        installmentRule: { maxInstallments: 12, maxFreeInstallments: 12, interestRate: 0, buyerPaysInterest: false },
        settlementDays: { debit: 2, credit: 5, pix: 0 }
    }
];

const QuickPaymentLinkModal: React.FC<QuickPaymentLinkModalProps> = ({ isOpen, onClose, onSuccess, initialValue, initialDescription }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');

    // Form
    const [amount, setAmount] = useState<string>('0.00');
    const [description, setDescription] = useState('');
    const [clientName, setClientName] = useState('');

    // Gateway Selection
    const [selectedGatewayId, setSelectedGatewayId] = useState<string>('');
    const [availableGateways, setAvailableGateways] = useState<PaymentGateway[]>([]);

    // Output
    const [generatedLink, setGeneratedLink] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Filter gateways that support online scope
            const onlineGateways = MOCK_ONLINE_GATEWAYS.filter(g => g.active && (g.scope === 'online_only' || g.scope === 'all'));
            setAvailableGateways(onlineGateways);
            if (onlineGateways.length > 0) {
                setSelectedGatewayId(onlineGateways[0].id);
            }

            // Set initials
            if (initialValue) setAmount(initialValue.toFixed(2));
            if (initialDescription) setDescription(initialDescription);
            setStep('form');
            setGeneratedLink('');
        }
    }, [isOpen, initialValue, initialDescription]);

    const selectedGateway = availableGateways.find(g => g.id === selectedGatewayId);

    const handleCreateLink = () => {
        if (!amount || parseFloat(amount) <= 0) {
            addToast('Insira um valor válido.', 'error');
            return;
        }
        if (!selectedGateway) return;

        setIsLoading(true);

        // Simulate API Call delay
        setTimeout(() => {
            setIsLoading(false);

            // Generate Mock URL based on Provider
            let url = '';
            const code = Math.random().toString(36).substring(7).toUpperCase();

            switch (selectedGateway.provider) {
                case 'infinitepay':
                    url = `https://pay.infinitepay.io/divaspa/${amount.replace('.', '')}?desc=${encodeURIComponent(description)}`;
                    break;
                case 'asaas':
                    url = `https://www.asaas.com/c/${code}`;
                    break;
                case 'stripe':
                    url = `https://buy.stripe.com/${code}`;
                    break;
                default:
                    url = `https://diva.link/${code}`;
            }

            setGeneratedLink(url);
            setStep('success');
            addToast('Link gerado com sucesso!', 'success');
            if (onSuccess) onSuccess();

        }, 1500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLink);
        addToast('Copiado para a área de transferência!', 'success');
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-diva-dark p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Globe size={24} className="text-blue-300" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Venda Online</h2>
                            <p className="text-xs text-blue-200">Gerador de Link de Pagamento</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
                    {step === 'form' ? (
                        <div className="space-y-6">

                            {/* Gateway Selector */}
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center">
                                    <Settings size={14} className="mr-1" /> Processador de Pagamento
                                </label>
                                <select
                                    value={selectedGatewayId}
                                    onChange={(e) => setSelectedGatewayId(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-diva-primary focus:ring-1 focus:ring-diva-primary transition-all"
                                >
                                    {availableGateways.map(gw => (
                                        <option key={gw.id} value={gw.id}>
                                            {gw.name} ({gw.provider.toUpperCase()})
                                        </option>
                                    ))}
                                </select>

                                {selectedGateway && (
                                    <div className="mt-3 text-xs text-gray-500 flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold text-[10px]">ATIVO</span>
                                            <span>Taxas online aplicadas automaticamente.</span>
                                        </div>
                                        {selectedGateway.installmentRule && (
                                            <div className="flex items-center gap-2 mt-1 p-2 bg-blue-50 rounded border border-blue-100 text-blue-700">
                                                <CreditCard size={12} />
                                                <span>
                                                    Parcelamento: Até <strong>{selectedGateway.installmentRule.maxInstallments}x</strong>
                                                    {selectedGateway.installmentRule.maxFreeInstallments > 1 && ` (${selectedGateway.installmentRule.maxFreeInstallments}x Sem Juros)`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Valor da Cobrança (R$)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-10 get p-4 text-2xl font-bold text-diva-dark bg-white border border-gray-200 rounded-xl outline-none focus:border-diva-primary"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Descrição do Pedido / Produto</label>
                                    <div className="relative">
                                        <Package size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-diva-primary"
                                            placeholder="Ex: Kit Homecare + Consulta"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Cliente (Opcional)</label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-diva-primary"
                                        placeholder="Nome para identificação"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Link Gerado com Sucesso!</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">
                                O link para pagamento de <strong>{formatCurrency(parseFloat(amount))}</strong> via <strong>{selectedGateway?.name}</strong> está pronto.
                            </p>

                            <div className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <LinkIcon size={20} />
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-xs text-gray-400 font-bold uppercase">URL de Pagamento</p>
                                    <p className="text-sm text-blue-600 font-medium truncate">{generatedLink}</p>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-diva-primary"
                                    title="Copiar"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => {
                                        window.open(`https://wa.me/?text=Olá ${clientName}, segue o link para pagamento: ${generatedLink}`, '_blank');
                                    }}
                                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-green-500/20 transition-all"
                                >
                                    <Smartphone size={18} className="mr-2" /> Enviar WhatsApp
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step === 'form' && (
                    <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreateLink}
                            disabled={isLoading || !selectedGateway}
                            className={`px-8 py-3 bg-diva-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center
                            ${(isLoading || !selectedGateway) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-diva-dark'}`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Gerando...
                                </>
                            ) : (
                                <>
                                    <LinkIcon size={18} className="mr-2" />
                                    Gerar Link de Pagamento
                                </>
                            )}
                        </button>
                    </div>
                )}
                {step === 'success' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default QuickPaymentLinkModal;
