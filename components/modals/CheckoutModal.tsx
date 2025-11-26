
import React, { useState, useEffect } from 'react';
import { ServiceAppointment, Invoice, InvoiceItem, PaymentMethod, Promotion } from '../../types';
import { X, ShoppingBag, CreditCard, DollarSign, Smartphone, Plus, Trash2, Printer, CheckCircle, Ticket, Share2, Percent, Tag } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

interface CheckoutModalProps {
  appointment: ServiceAppointment;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (invoice: Invoice) => void;
}

// Mock mock products for upsell
const mockUpsellProducts = [
    { id: 'prod1', name: 'Hidratante Pós-Laser', price: 89.90 },
    { id: 'prod2', name: 'Protetor Solar FPS 70', price: 120.00 },
    { id: 'prod3', name: 'Gift Card R$ 100', price: 100.00 },
];

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

const CheckoutModal: React.FC<CheckoutModalProps> = ({ appointment, isOpen, onClose, onPaymentComplete }) => {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [usePackage, setUsePackage] = useState(false);
  const [splitPayments, setSplitPayments] = useState<{method: PaymentMethod, amount: number}[]>([]);
  const { addToast } = useToast();

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
        setSplitPayments([]);
        setDiscount(0);
        setAppliedPromo(null);
        setCouponCode('');
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
  const total = Math.max(0, subtotal - discount);

  const handleAddProduct = (prod: {id: string, name: string, price: number}) => {
      const newItem: InvoiceItem = {
          id: prod.id + '_' + Date.now(),
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
          
          const invoice: Invoice = {
              id: 'inv_' + Date.now(),
              appointmentId: appointment.appointmentId,
              clientId: appointment.clientId,
              clientName: appointment.clientName,
              items: items,
              subtotal,
              discount,
              total,
              paymentMethod: splitPayments.length > 0 ? 'split' : paymentMethod || 'cash',
              status: 'paid',
              createdAt: new Date().toISOString()
          };
          
          addToast('Venda registrada com sucesso!', 'success');
          onPaymentComplete(invoice); 
      }, 1500);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const renderPaymentButton = (method: PaymentMethod, label: string, icon: React.ReactNode) => (
      <button 
          onClick={() => { setPaymentMethod(method); setSplitPayments([]); }}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all min-h-[90px]
              ${paymentMethod === method ? 'border-diva-primary bg-diva-primary/10 text-diva-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
      >
          {icon}
          <span className="text-xs font-bold mt-2">{label}</span>
      </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-diva-dark/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
        
        {/* LEFT COLUMN: Summary & Upsell */}
        <div className="flex-1 p-6 bg-gray-50 flex flex-col border-r border-gray-200 overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-serif font-bold text-diva-dark mb-1">Checkout</h2>
            <p className="text-sm text-gray-500 mb-6">Pedido #1024 • {appointment.clientName}</p>

            {/* Package Alert */}
            {matchingPackage && !usePackage && (
                <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between animate-in slide-in-from-top-2 fade-in">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                            <Ticket size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-purple-800">Pacote Disponível</p>
                            <p className="text-xs text-purple-600">Restam {matchingPackage.total - matchingPackage.used} sessões.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setUsePackage(true)}
                        className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-purple-700 transition-colors"
                    >
                        Usar Sessão
                    </button>
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 flex-1">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3">Item</th>
                            <th className="px-4 py-3 text-right">Valor</th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {items.map(item => (
                            <tr key={item.id}>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-diva-dark">{item.description}</p>
                                    {item.type === 'service' && usePackage && item.total === 0 && (
                                        <span className="text-[10px] text-green-600 font-bold flex items-center">
                                            <Ticket size={10} className="mr-1"/> Pacote Aplicado
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right font-mono">
                                    {item.total === 0 && usePackage && item.type === 'service' ? (
                                        <span className="text-gray-400 line-through mr-2 text-xs">{formatCurrency(item.unitPrice)}</span>
                                    ) : null}
                                    <span className={item.total === 0 ? 'text-green-600 font-bold' : 'text-gray-600'}>
                                        {formatCurrency(item.total)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {item.type === 'product' && (
                                        <button onClick={() => handleRemoveItem(item.id)} className="text-gray-300 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Upsell Area */}
            <div className="mt-auto">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Levar Também (Upsell)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {mockUpsellProducts.map(prod => (
                        <button 
                            key={prod.id}
                            onClick={() => handleAddProduct(prod)}
                            className="flex flex-col items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg hover:border-diva-primary hover:bg-diva-primary/5 transition-all group"
                        >
                            <ShoppingBag size={20} className="text-gray-400 group-hover:text-diva-primary mb-1" />
                            <span className="text-xs font-medium text-diva-dark text-center leading-tight line-clamp-1">{prod.name}</span>
                            <span className="text-[10px] font-bold text-diva-accent mt-1">+ {formatCurrency(prod.price)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Payment */}
        <div className="w-full md:w-96 p-6 flex flex-col bg-white border-l border-gray-100 shadow-xl z-10 relative">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-serif font-bold text-diva-dark">Pagamento</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-diva-dark"><X size={24} /></button>
            </div>

            {isSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-lg">
                        <CheckCircle size={48} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-diva-dark">Venda Realizada!</h3>
                        <p className="text-gray-500 text-sm mt-1">Fatura #1024 gerada com sucesso.</p>
                    </div>
                    
                    <div className="w-full space-y-3">
                        <button className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center shadow-md">
                            <Share2 size={18} className="mr-2" /> Enviar no WhatsApp
                        </button>
                        <button className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center">
                            <Printer size={18} className="mr-2" /> Imprimir Recibo
                        </button>
                    </div>
                    
                    <button onClick={onClose} className="text-sm text-diva-primary hover:underline mt-4">
                        Fechar e voltar para Agenda
                    </button>
                </div>
            ) : (
                <>
                    {/* Financial Breakdown */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium text-diva-dark">{formatCurrency(subtotal)}</span>
                        </div>
                        
                        {/* Smart Coupon Input */}
                        <div className="flex justify-between text-sm items-center">
                            {!appliedPromo ? (
                                <div className="w-full">
                                    <div className="flex gap-2 mt-1">
                                        <div className="relative flex-1">
                                            <Tag className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                            <input 
                                                type="text" 
                                                placeholder="Cupom" 
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="w-full pl-7 p-1.5 text-xs border border-gray-300 rounded outline-none focus:border-diva-primary uppercase"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleApplyCoupon}
                                            className="bg-diva-dark text-white px-2 py-1 rounded text-xs font-bold hover:bg-diva-primary"
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full flex justify-between items-center bg-green-50 border border-green-200 rounded p-2 mt-1">
                                    <span className="text-xs font-bold text-green-700 flex items-center">
                                        <Ticket size={12} className="mr-1" /> {appliedPromo.code}
                                    </span>
                                    <span className="text-xs text-red-500 font-medium">- {formatCurrency(discount)}</span>
                                    <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 ml-2"><X size={14}/></button>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-3 flex justify-between items-end">
                            <span className="text-lg font-bold text-diva-dark">Total a Pagar</span>
                            <span className="text-3xl font-serif font-bold text-diva-primary">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Payment Methods Grid */}
                    {total > 0 ? (
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Forma de Pagamento</h3>
                                <button 
                                    onClick={() => { setPaymentMethod('split'); setSplitPayments([]); }}
                                    className="text-xs font-bold text-diva-primary hover:underline"
                                >
                                    Dividir Valor (Split)
                                </button>
                            </div>
                            
                            {paymentMethod === 'split' ? (
                                <div className="space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2">Adicione múltiplos pagamentos até atingir o total.</p>
                                    {/* Mock Split Interface */}
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Valor" className="flex-1 p-2 border rounded text-sm" />
                                        <select className="p-2 border rounded text-sm bg-white">
                                            <option>Crédito</option>
                                            <option>Débito</option>
                                            <option>Dinheiro</option>
                                        </select>
                                        <button className="p-2 bg-diva-dark text-white rounded"><Plus size={16}/></button>
                                    </div>
                                    <div className="text-xs text-right text-red-500 font-bold">Faltam: {formatCurrency(total)}</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {renderPaymentButton('credit_card', 'Crédito', <CreditCard size={24}/>)}
                                    {renderPaymentButton('debit_card', 'Débito', <CreditCard size={24}/>)}
                                    {renderPaymentButton('pix', 'PIX', <Smartphone size={24}/>)}
                                    {renderPaymentButton('cash', 'Dinheiro', <DollarSign size={24}/>)}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center text-gray-400 p-6 border-2 border-dashed border-gray-200 rounded-xl">
                            <div>
                                <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                                <p className="text-sm font-bold text-gray-600">Total Coberto</p>
                                <p className="text-xs">Nenhum pagamento adicional necessário.</p>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <button 
                        onClick={handlePayment}
                        disabled={(!paymentMethod && total > 0) || isProcessing}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg mt-6 flex items-center justify-center transition-all
                            ${(!paymentMethod && total > 0) || isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-diva-primary hover:bg-diva-dark transform hover:-translate-y-1'}`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Processando...</span>
                        ) : (
                            <>
                                <CheckCircle size={20} className="mr-2" />
                                Finalizar Pedido
                            </>
                        )}
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
