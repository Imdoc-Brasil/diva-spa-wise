
import React, { useState, useEffect, useMemo } from 'react';
import { ServiceAppointment, Invoice, InvoiceItem, PaymentMethod, Promotion, PaymentGateway } from '../../types';
import { X, ShoppingBag, CreditCard, DollarSign, Smartphone, Plus, Trash2, Printer, CheckCircle, Ticket, Share2, Percent, Tag, Star, ArrowRight, Calculator } from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import { useData } from '../context/DataContext';

interface CheckoutModalProps {
    appointment: ServiceAppointment;
    isOpen: boolean;
    onClose: () => void;
    onPaymentComplete: (invoice: Invoice) => void;
}

// Mock Packages for the client
const mockClientPackages = [
    { id: 'pkg1', name: 'Depilação a Laser - Perna', total: 10, used: 4 },
    { id: 'pkg2', name: 'Limpeza de Pele', total: 5, used: 5 } // Expired/Full
];

// Mock Active Promotions (Available in System)
const mockActivePromotions: Promotion[] = [
    { id: 'p1', code: 'BEMVINDO20', description: '20% Primeira Visita', type: 'percentage', value: 20, startDate: '', endDate: '', usageLimit: 100, usageCount: 0, active: true, minSpend: 100 },
    { id: 'p2', code: 'VERAO50', description: 'R$ 50 OFF', type: 'fixed_amount', value: 50, startDate: '', endDate: '', usageLimit: 100, usageCount: 0, active: true, minSpend: 200 },
];

// Mock Gateways (Usually fetched from settings/context)
const mockGateways: PaymentGateway[] = [
    {
        id: 'gw_stone_rec',
        name: 'Stone - Recepção',
        type: 'physical_pos',
        provider: 'stone',
        active: true,
        fees: {
            debit: 1.25,
            credit_1x: 2.89,
            credit_2x_6x: 3.59,
            credit_7x_12x: 4.19,
            pix: 0,
            pix_type: 'percentage'
        },
        settlementDays: { debit: 1, credit: 1, pix: 0 }
    },
    {
        id: 'gw_infinitepay',
        name: 'InfinitePay - Dra. Julia',
        type: 'physical_pos',
        provider: 'infinitepay',
        active: true,
        fees: {
            debit: 1.38,
            credit_1x: 2.90,
            credit_2x_6x: 3.90,
            credit_7x_12x: 4.90,
            pix: 0,
            pix_type: 'percentage'
        },
        settlementDays: { debit: 1, credit: 1, pix: 0 }
    }
];

const CheckoutModal: React.FC<CheckoutModalProps> = ({ appointment, isOpen, onClose, onPaymentComplete }) => {
    const { products, updateProductStock, clients, updateClient, addTransaction } = useData();
    const { addToast } = useToast();
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [discount, setDiscount] = useState<number>(0);
    const [couponCode, setCouponCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);

    // Gateway & Installments State
    const [selectedGatewayId, setSelectedGatewayId] = useState<string>(mockGateways[0].id);
    const [installments, setInstallments] = useState<number>(1);

    // Split State (Not fully implemented with gateways yet, keeping simpler for now)
    const [splitPayments, setSplitPayments] = useState<{ method: PaymentMethod, amount: number }[]>([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [usePackage, setUsePackage] = useState(false);
    const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

    // Get Client Data
    const client = clients.find(c => c.clientId === appointment.clientId);
    const loyaltyDiscountValue = client && client.loyaltyPoints ? Math.floor(client.loyaltyPoints / 10) : 0;

    // Filter products for upsell (e.g., homecare items with stock)
    const upsellProducts = products.filter(p => p.category === 'homecare' && (p.stock || 0) > 0).slice(0, 3);

    // Detect matching package
    const matchingPackage = mockClientPackages.find(p => appointment.serviceName.includes(p.name) && p.used < p.total);

    // Initialize Invoice with the service
    useEffect(() => {
        if (isOpen && appointment) {
            setItems([{
                id: 'svc_' + appointment.appointmentId,
                description: appointment.serviceName,
                quantity: 1,
                unitPrice: appointment.price,
                total: appointment.price,
                type: 'service'
            }]);
            setPaymentMethod(null);
            setIsSuccess(false);
            setUsePackage(false);
            setUseLoyaltyPoints(false);
            setSplitPayments([]);
            setDiscount(0);
            setAppliedPromo(null);
            setCouponCode('');
            setInstallments(1);
            setSelectedGatewayId(mockGateways[0].id);
        }
    }, [isOpen, appointment]);

    // Update totals when package is toggled
    useEffect(() => {
        if (usePackage && matchingPackage) {
            setItems(prev => prev.map(item => {
                if (item.type === 'service' && item.description.includes(matchingPackage.name)) {
                    return { ...item, total: 0 }; // Discount 100%
                }
                return item;
            }));
            setPaymentMethod('package');
            addToast('Pacote aplicado! 1 sessão será descontada.', 'info');
        } else if (!usePackage && items.some(i => i.total === 0 && i.type === 'service')) {
            // Reset price if untoggled
            setItems(prev => prev.map(item => {
                if (item.type === 'service' && item.id.startsWith('svc_')) {
                    return { ...item, total: item.unitPrice * item.quantity };
                }
                return item;
            }));
            if (paymentMethod === 'package') setPaymentMethod(null);
        }
    }, [usePackage]);

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const totalDiscount = discount + (useLoyaltyPoints ? loyaltyDiscountValue : 0);
    const total = Math.max(0, subtotal - totalDiscount);

    // --- FINANCIAL CALCULATIONS ---
    const financialSummary = useMemo(() => {
        if (!paymentMethod || !total) return null;

        const gateway = mockGateways.find(g => g.id === selectedGatewayId);
        if (!gateway) return null;

        let feePercentage = 0;
        let settlementDays = 0;

        if (paymentMethod === 'debit_card') {
            feePercentage = gateway.fees.debit;
            settlementDays = gateway.settlementDays.debit;
        } else if (paymentMethod === 'credit_card') {
            if (installments === 1) {
                feePercentage = gateway.fees.credit_1x;
            } else if (installments <= 6) {
                feePercentage = gateway.fees.credit_2x_6x;
            } else {
                feePercentage = gateway.fees.credit_7x_12x;
            }
            settlementDays = gateway.settlementDays.credit;
        } else if (paymentMethod === 'pix') {
            // Basic PIX check (assuming percentage for simplicity)
            feePercentage = gateway.fees.pix;
            settlementDays = gateway.settlementDays.pix;
        }

        const feeAmount = total * (feePercentage / 100);
        const netAmount = total - feeAmount;

        const settlementDate = new Date();
        settlementDate.setDate(settlementDate.getDate() + settlementDays);

        return {
            gatewayName: gateway.name,
            provider: gateway.provider,
            feePercentage,
            feeAmount,
            netAmount,
            settlementDays,
            settlementDate
        };
    }, [paymentMethod, selectedGatewayId, installments, total]);

    const handleAddProduct = (prod: { id: string, name: string, price: number }) => {
        const newItem: InvoiceItem = {
            id: 'inv_item_' + Date.now(),
            productId: prod.id, // Store original product ID
            description: prod.name,
            quantity: 1,
            unitPrice: prod.price,
            total: prod.price,
            type: 'product'
        };
        setItems([...items, newItem]);
        addToast(`${prod.name} adicionado à comanda.`, 'success');
    };

    const handleRemoveItem = (itemId: string) => {
        // Prevent removing the main service (optional rule)
        if (itemId.startsWith('svc_')) return;
        setItems(items.filter(i => i.id !== itemId));
    };

    const handleApplyCoupon = () => {
        if (!couponCode) return;
        const promo = mockActivePromotions.find(p => p.code === couponCode.toUpperCase());

        if (!promo) {
            addToast('Cupom inválido ou expirado.', 'error');
            return;
        }
        if (promo.minSpend && subtotal < promo.minSpend) {
            addToast(`Valor mínimo para este cupom: R$ ${promo.minSpend}`, 'warning');
            return;
        }

        let discountValue = 0;
        if (promo.type === 'percentage') {
            discountValue = subtotal * (promo.value / 100);
        } else {
            discountValue = promo.value;
        }

        setDiscount(discountValue);
        setAppliedPromo(promo);
        addToast(`Cupom ${promo.code} aplicado com sucesso!`, 'success');
    };

    const handleRemoveCoupon = () => {
        setDiscount(0);
        setAppliedPromo(null);
        setCouponCode('');
    };

    const handlePayment = () => {
        if (!paymentMethod && total > 0 && splitPayments.reduce((acc, curr) => acc + curr.amount, 0) < total) return;

        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);

            // Deduct Stock for Products
            items.forEach(item => {
                if (item.type === 'product' && item.productId) {
                    updateProductStock(item.productId, item.quantity, 'remove');
                }
            });

            // Deduct Loyalty Points
            if (useLoyaltyPoints && client) {
                updateClient(client.clientId, { loyaltyPoints: 0 });
            }

            const invoice: Invoice = {
                id: 'inv_' + Date.now(),
                appointmentId: appointment.appointmentId,
                clientId: appointment.clientId,
                clientName: appointment.clientName,
                items: items,
                subtotal,
                discount: totalDiscount,
                total,
                paymentMethod: splitPayments.length > 0 ? 'split' : paymentMethod || 'cash',
                splitDetails: splitPayments.length > 0 ? splitPayments : undefined,
                status: 'paid',
                createdAt: new Date().toISOString()
            };

            // Main Service Transaction (or mixed)
            // If total > 0, we create an income transaction.
            if (total > 0) {
                // Determine Financial Info
                const financialInfo = financialSummary ? {
                    gatewayId: selectedGatewayId,
                    installments: paymentMethod === 'credit_card' ? installments : 1,
                    mdrFee: financialSummary.feeAmount,
                    netAmount: financialSummary.netAmount,
                    settlementDate: financialSummary.settlementDate.toISOString().split('T')[0]
                } : {};

                // If using split payments, we might need multiple transactions or one complex one.
                // For now, let's assume single payment method for full "Gateway Magic" demo.

                const transaction: any = {
                    id: `t_${Date.now()}_checkout`,
                    organizationId: 'org_default', // Placeholder
                    description: `Procd. - ${appointment.clientName}`,
                    category: 'Serviços',
                    amount: total,
                    type: 'income',
                    status: 'paid',
                    date: new Date().toISOString().split('T')[0],
                    unitId: appointment.unitId,
                    relatedAppointmentId: appointment.appointmentId,
                    revenueType: 'service', // Simplified
                    paymentMethod: paymentMethod,
                    ...financialInfo
                };

                addTransaction(transaction);
            }

            addToast('Venda registrada e valores de taxas calculados!', 'success');
            onPaymentComplete(invoice);
        }, 1500);
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const renderPaymentButton = (method: PaymentMethod, label: string, icon: React.ReactNode) => (
        <button
            onClick={() => { setPaymentMethod(method); setSplitPayments([]); if (method !== 'credit_card') setInstallments(1); }}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all min-h-[90px]
              ${paymentMethod === method ? 'border-diva-primary bg-diva-primary/10 text-diva-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
        >
            {icon}
            <span className="text-xs font-bold mt-2">{label}</span>
        </button>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-diva-dark/80 backdrop-blur-sm p-0 md:p-4">
            <div className="bg-white rounded-none md:rounded-2xl shadow-2xl w-full h-full md:h-[90vh] md:max-w-5xl overflow-hidden flex flex-col">

                {/* LEFT COLUMN: Summary & Upsell */}
                <div className="flex-1 p-4 md:p-6 bg-gray-50 flex flex-col border-r border-gray-200 overflow-y-auto custom-scrollbar">
                    {/* ... (Existing left column content remains mostly same) ... */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg md:text-xl font-serif font-bold text-diva-dark">Checkout</h2>
                            <p className="text-xs md:text-sm text-gray-500">Pedido #1024 • {appointment.clientName}</p>
                        </div>
                        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-diva-dark"><X size={24} /></button>
                    </div>

                    {/* Alerts Logic (Package/Loyalty) same as before */}
                    {matchingPackage && !usePackage && (
                        <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Ticket size={20} /></div>
                                <div>
                                    <p className="text-sm font-bold text-purple-800">Pacote Disponível</p>
                                    <p className="text-xs text-purple-600">Restam {matchingPackage.total - matchingPackage.used} sessões.</p>
                                </div>
                            </div>
                            <button onClick={() => setUsePackage(true)} className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-purple-700 transition-colors">Usar Sessão</button>
                        </div>
                    )}

                    {usePackage && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between animate-in slide-in-from-top-2 fade-in">
                            <div className="flex items-center gap-3">
                                <CheckCircle size={20} className="text-green-600" />
                                <p className="text-sm font-bold text-green-800">1 Sessão será debitada do pacote</p>
                            </div>
                            <button onClick={() => setUsePackage(false)} className="text-xs text-red-500 hover:underline">Cancelar</button>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4 md:mb-6 flex-1">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-medium">
                                    <tr>
                                        <th className="px-3 md:px-4 py-3">Item</th>
                                        <th className="px-3 md:px-4 py-3 text-right">Valor</th>
                                        <th className="px-3 md:px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {items.map(item => (
                                        <tr key={item.id}>
                                            <td className="px-3 md:px-4 py-3">
                                                <p className="font-medium text-diva-dark text-xs md:text-sm">{item.description}</p>
                                                {item.type === 'service' && usePackage && item.total === 0 && (
                                                    <span className="text-[10px] text-green-600 font-bold flex items-center"><Ticket size={10} className="mr-1" /> Pacote Aplicado</span>
                                                )}
                                            </td>
                                            <td className="px-3 md:px-4 py-3 text-right font-mono text-xs md:text-sm">
                                                <span className={item.total === 0 ? 'text-green-600 font-bold' : 'text-gray-600'}>{formatCurrency(item.total)}</span>
                                            </td>
                                            <td className="px-3 md:px-4 py-3 text-center">
                                                {item.type === 'product' && (
                                                    <button onClick={() => handleRemoveItem(item.id)} className="text-gray-300 hover:text-red-500 active:scale-95"><Trash2 size={16} /></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Upsell Area */}
                    <div className="mt-auto hidden md:block">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Levar Também (Upsell)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {upsellProducts.map(prod => (
                                <button
                                    key={prod.id}
                                    onClick={() => handleAddProduct(prod)}
                                    className="flex flex-col items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg hover:border-diva-primary hover:bg-diva-primary/5 transition-all group active:scale-95">
                                    <ShoppingBag size={20} className="text-gray-400 group-hover:text-diva-primary mb-1" />
                                    <span className="text-xs font-medium text-diva-dark text-center leading-tight line-clamp-1">{prod.name}</span>
                                    <span className="text-[10px] font-bold text-diva-accent mt-1">+ {formatCurrency(prod.price)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Payment & Gateway Magic */}
                <div className="w-full md:w-[480px] p-4 md:p-6 flex flex-col bg-white border-t md:border-t-0 md:border-l border-gray-100 shadow-xl z-10 relative overflow-y-auto">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <h2 className="text-lg md:text-xl font-serif font-bold text-diva-dark">Pagamento</h2>
                        <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-diva-dark"><X size={24} /></button>
                    </div>

                    {isSuccess ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-lg">
                                <CheckCircle size={48} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-diva-dark">Venda Realizada!</h3>
                                <p className="text-gray-500 text-sm mt-1">Fatura gerada e contabilidade atualizada.</p>
                                {financialSummary && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
                                        <p className="font-bold mb-1">Previsão de Recebimento:</p>
                                        <p>{financialSummary.settlementDate.toLocaleDateString()} - {formatCurrency(financialSummary.netAmount)}</p>
                                    </div>
                                )}
                            </div>
                            <div className="w-full space-y-3">
                                <button className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center shadow-md">
                                    <Share2 size={18} className="mr-2" /> Enviar no WhatsApp
                                </button>
                            </div>
                            <button onClick={onClose} className="text-sm text-diva-primary hover:underline mt-4">Fechar</button>
                        </div>
                    ) : (
                        <>
                            {/* Totals Section */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-diva-dark">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    {!appliedPromo ? (
                                        <div className="w-full flex gap-2 mt-1">
                                            <input
                                                type="text"
                                                placeholder="CUPOM"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="w-full pl-3 p-1.5 text-xs border border-gray-300 rounded outline-none focus:border-diva-primary uppercase"
                                            />
                                            <button onClick={handleApplyCoupon} className="bg-diva-dark text-white px-2 py-1 rounded text-xs font-bold hover:bg-diva-primary">Aplicar</button>
                                        </div>
                                    ) : (
                                        <div className="w-full flex justify-between items-center bg-green-50 border border-green-200 rounded p-2 mt-1">
                                            <span className="text-xs font-bold text-green-700 flex items-center"><Ticket size={12} className="mr-1" /> {appliedPromo.code}</span>
                                            <span className="text-xs text-red-500 font-medium">- {formatCurrency(discount)}</span>
                                            <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 ml-2"><X size={14} /></button>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between items-end">
                                    <span className="text-lg font-bold text-diva-dark">Total a Pagar</span>
                                    <span className="text-3xl font-serif font-bold text-diva-primary">{formatCurrency(total)}</span>
                                </div>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Forma de Pagamento</h3>
                                <div className="grid grid-cols-2 gap-2 md:gap-3">
                                    {renderPaymentButton('credit_card', 'Crédito', <CreditCard size={24} />)}
                                    {renderPaymentButton('debit_card', 'Débito', <CreditCard size={24} />)}
                                    {renderPaymentButton('pix', 'PIX', <Smartphone size={24} />)}
                                    {renderPaymentButton('cash', 'Dinheiro', <DollarSign size={24} />)}
                                </div>
                            </div>

                            {/* GATEWAY SETTINGS MAGIC (Only if Card/Pix selected) */}
                            {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card' || paymentMethod === 'pix') && (
                                <div className="bg-diva-primary/5 rounded-xl border border-diva-primary/20 p-4 mb-6 animate-in slide-in-from-bottom-2">
                                    <h3 className="text-xs font-bold text-diva-primary uppercase tracking-wider mb-3 flex items-center">
                                        <Calculator size={14} className="mr-1" /> Detalhes da Maquininha
                                    </h3>

                                    {/* Gateway Selector */}
                                    <div className="mb-3">
                                        <label className="block text-xs text-gray-500 font-medium mb-1">Terminal Responsável</label>
                                        <select
                                            value={selectedGatewayId}
                                            onChange={(e) => setSelectedGatewayId(e.target.value)}
                                            className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-diva-primary bg-white"
                                        >
                                            {mockGateways.filter(g => g.active).map(g => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Installments (Only Credit) */}
                                    {paymentMethod === 'credit_card' && (
                                        <div className="mb-3">
                                            <label className="block text-xs text-gray-500 font-medium mb-1">Parcelamento</label>
                                            <select
                                                value={installments}
                                                onChange={(e) => setInstallments(Number(e.target.value))}
                                                className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-diva-primary bg-white"
                                            >
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                                                    <option key={num} value={num}>
                                                        {num}x de {formatCurrency(total / num)} {num > 1 ? '(Sem Juros)' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Financial Simulation Result */}
                                    {financialSummary && (
                                        <div className="mt-3 pt-3 border-t border-diva-primary/10 text-xs">
                                            <div className="flex justify-between mb-1 text-gray-600">
                                                <span>Taxa ({financialSummary.feePercentage}%):</span>
                                                <span className="text-red-500 font-medium">- {formatCurrency(financialSummary.feeAmount)}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white p-2 rounded border border-diva-primary/20">
                                                <span className="font-bold text-diva-dark">Líquido a Receber</span>
                                                <div className="text-right">
                                                    <span className="block font-bold text-green-600 font-mono text-sm">{formatCurrency(financialSummary.netAmount)}</span>
                                                    <span className="block text-[10px] text-gray-400">
                                                        em {financialSummary.settlementDays} dias
                                                        ({financialSummary.settlementDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Final Action */}
                            <button
                                onClick={handlePayment}
                                disabled={(!paymentMethod && total > 0) || isProcessing}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg mt-2 flex items-center justify-center transition-all
                                ${(!paymentMethod && total > 0) || isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-diva-primary hover:bg-diva-dark transform hover:-translate-y-1'}`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Processando...</span>
                                ) : (
                                    <>
                                        <CheckCircle size={20} className="mr-2" />
                                        Finalizar Pedido {total > 0 && `• ${formatCurrency(total)}`}
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};

export default CheckoutModal;
