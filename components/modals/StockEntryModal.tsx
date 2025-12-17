import React, { useState, useEffect } from 'react';
import { X, Save, Package, FileText, Calendar, DollarSign, Archive, Layers, CreditCard, Link2, Search } from 'lucide-react';
import { useUnitData } from '../hooks/useUnitData';
import { Product, ProtocolItem, Transaction } from '../../types';

interface StockEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StockEntryModal: React.FC<StockEntryModalProps> = ({ isOpen, onClose }) => {
    const { products, updateProduct, services, updateService, addTransaction, selectedUnitId } = useUnitData();

    // Step 1: Select Product
    const [selectedProductId, setSelectedProductId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Step 2: Entry Data
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        supplier: '',
        batchNumber: '',
        expirationDate: '',
        quantity: '', // Quantity of PRESENTATION units (e.g. 10 Frascos)
        costPrice: '',
        sellPrice: '',
        minStockLevel: '',
        paymentMethod: 'invoice_30d',
    });

    // Step 3: Service Linking
    const [selectedServices, setSelectedServices] = useState<{ serviceId: string, quantity: number }[]>([]);

    // Helper: Filter products
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.activeIngredients?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeProduct = products.find(p => p.id === selectedProductId);

    useEffect(() => {
        if (!isOpen) {
            // Reset
            setSelectedProductId('');
            setSearchQuery('');
            setFormData({
                invoiceNumber: '', supplier: '', batchNumber: '', expirationDate: '',
                quantity: '', costPrice: '', sellPrice: '', minStockLevel: '', paymentMethod: 'invoice_30d'
            });
            setSelectedServices([]);
        }
    }, [isOpen]);

    // Handle selecting a product to pre-fill specific fields if known
    useEffect(() => {
        if (activeProduct) {
            setFormData(prev => ({
                ...prev,
                costPrice: activeProduct.costPrice ? activeProduct.costPrice.toString() : '',
                sellPrice: activeProduct.price ? activeProduct.price.toString() : '',
                minStockLevel: activeProduct.minStockLevel ? activeProduct.minStockLevel.toString() : '',
                batchNumber: activeProduct.batchNumber || '',
            }));
        }
    }, [activeProduct]);

    const handleToggleService = (serviceId: string) => {
        if (selectedServices.find(s => s.serviceId === serviceId)) {
            setSelectedServices(selectedServices.filter(s => s.serviceId !== serviceId));
        } else {
            setSelectedServices([...selectedServices, { serviceId, quantity: 1 }]); // Default 1 unit used per service
        }
    };

    const handleServiceQuantityChange = (serviceId: string, qty: number) => {
        setSelectedServices(selectedServices.map(s => s.serviceId === serviceId ? { ...s, quantity: qty } : s));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeProduct) return;

        const qtyEntered = parseFloat(formData.quantity) || 0;
        const totalContentAdded = qtyEntered * (activeProduct.contentQuantity || 1); // e.g. 10 Frascos * 100UI = 1000UI

        // 1. Update Product Stock and Data
        const updatedProduct: Product = {
            ...activeProduct,
            stock: (activeProduct.stock || 0) + totalContentAdded,
            costPrice: parseFloat(formData.costPrice) || activeProduct.costPrice,
            price: parseFloat(formData.sellPrice) || activeProduct.price,
            minStockLevel: parseFloat(formData.minStockLevel) || activeProduct.minStockLevel,
            batchNumber: formData.batchNumber,
            expirationDate: formData.expirationDate,
        };
        updateProduct(activeProduct.id, updatedProduct);

        // 2. Update Linked Services Formulations (Protocols)
        if (selectedServices.length > 0) {
            selectedServices.forEach(item => {
                const service = services.find(s => s.id === item.serviceId);
                if (service) {
                    const currentProtocol = service.protocol || [];
                    const existingItemIndex = currentProtocol.findIndex(p => p.productId === activeProduct.id);

                    let newProtocol = [...currentProtocol];
                    const newItem: ProtocolItem = {
                        productId: activeProduct.id,
                        productName: activeProduct.name,
                        quantity: item.quantity,
                        unit: activeProduct.contentUnit || 'un',
                        unitCost: 0
                    };

                    // Recalculate Unit Cost based on Entry Data
                    if (activeProduct.contentQuantity && activeProduct.contentQuantity > 0) {
                        newItem.unitCost = (parseFloat(formData.costPrice) || 0) / activeProduct.contentQuantity;
                    } else {
                        newItem.unitCost = parseFloat(formData.costPrice) || 0;
                    }

                    if (existingItemIndex >= 0) {
                        newProtocol[existingItemIndex] = newItem;
                    } else {
                        newProtocol.push(newItem);
                    }
                    updateService(service.id, { protocol: newProtocol });
                }
            });
        }

        // 3. Create Accounts Payable (Transaction)
        const unitCost = parseFloat(formData.costPrice) || 0;
        const totalAmount = qtyEntered * unitCost;

        if (totalAmount > 0) {
            const isPending = formData.paymentMethod === 'invoice_30d' || formData.paymentMethod === 'boleto';
            const today = new Date();
            const dueDate = new Date();
            if (isPending) dueDate.setDate(today.getDate() + 30);

            const newTransaction: Omit<Transaction, 'organizationId'> = {
                id: `exp_${Date.now()}`,
                description: `Compra Estoque: ${activeProduct.name} - NF ${formData.invoiceNumber || 'S/N'}`,
                category: 'Insumos', // Or 'Estoque'
                amount: totalAmount,
                type: 'expense', // Expense
                status: isPending ? 'pending' : 'paid',
                date: today.toISOString().split('T')[0],
                dueDate: isPending ? dueDate.toISOString().split('T')[0] : undefined,
                paymentMethod: formData.paymentMethod as any,
                supplierId: formData.supplier, // Storing legacy/text supplier name here
                unitId: selectedUnitId !== 'all' ? selectedUnitId : undefined
            };

            addTransaction(newTransaction);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-dark text-white shrink-0">
                    <h3 className="font-bold text-lg flex items-center">
                        <Archive size={20} className="mr-2" /> Entrada de Nota Fiscal & Estoque
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8">

                    {/* LEFT COLUMN: Product & Invoice Data */}
                    <div className="flex-1 space-y-6">
                        {/* Product Selection */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Selecione o Produto (Catálogo)</label>
                            {!selectedProductId ? (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                            placeholder="Buscar produto..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-lg">
                                        {filteredProducts.map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => setSelectedProductId(p.id)}
                                                className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
                                            >
                                                <span className="font-medium text-gray-800">{p.name}</span>
                                                <span className="text-xs text-gray-400">{p.presentation} ({p.contentQuantity}{p.contentUnit})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-diva-light/10 border border-diva-primary rounded-lg">
                                    <div>
                                        <p className="font-bold text-diva-dark">{activeProduct?.name}</p>
                                        <p className="text-xs text-gray-500">{activeProduct?.presentation} - {activeProduct?.contentQuantity} {activeProduct?.contentUnit}</p>
                                    </div>
                                    <button onClick={() => setSelectedProductId('')} className="text-sm text-red-500 hover:underline">Trocar</button>
                                </div>
                            )}
                        </div>

                        {/* Invoice & Supplier */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nota Fiscal</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                        placeholder="Número da NF"
                                        value={formData.invoiceNumber}
                                        onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fornecedor</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                    placeholder="Nome do Fornecedor"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Batch & Expiry */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lote</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                        value={formData.batchNumber}
                                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Validade</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="date"
                                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                        value={formData.expirationDate}
                                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quantities & Values */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-green-600 uppercase mb-1">Qtd Entrada ({activeProduct?.presentation || 'Un'})</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border-2 border-green-100 rounded-lg outline-none focus:border-green-500 text-lg font-bold text-gray-800"
                                    placeholder="0"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Total a adicionar: {((parseFloat(formData.quantity) || 0) * (activeProduct?.contentQuantity || 1))} {activeProduct?.contentUnit}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo Unitário (R$)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Por {activeProduct?.presentation || 'unidade'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço Venda (Opcional)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                    value={formData.sellPrice}
                                    onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Mínimo</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                    value={formData.minStockLevel}
                                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                                />
                                <p className="text-xs text-gray-400 mt-1">Em {activeProduct?.contentUnit}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Forma de Pagamento</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <select
                                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary bg-white"
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                >
                                    <option value="invoice_30d">Faturado 30 dias (Contas a Pagar)</option>
                                    <option value="boleto">Boleto Bancário</option>
                                    <option value="pix">PIX (À vista)</option>
                                    <option value="credit_card">Cartão de Crédito</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Service Linking */}
                    <div className="w-full lg:w-1/3 bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h4 className="font-bold text-diva-dark mb-4 flex items-center">
                            <Link2 size={18} className="mr-2" /> Vincular a Serviços
                        </h4>
                        <p className="text-xs text-gray-500 mb-4">
                            Selecione os serviços que utilizam este produto para configurar a baixa automática de estoque.
                        </p>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {services.map(s => {
                                const isSelected = selectedServices.some(sel => sel.serviceId === s.id);
                                const selectedData = selectedServices.find(sel => sel.serviceId === s.id);

                                return (
                                    <div key={s.id} className={`p-3 rounded-lg border transition-all ${isSelected ? 'bg-white border-diva-primary shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-sm text-gray-700">{s.name}</span>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleService(s.id)}
                                                className="w-4 h-4 text-diva-primary rounded focus:ring-diva-primary"
                                            />
                                        </div>
                                        {isSelected && (
                                            <div className="flex items-center gap-2 mt-2 animate-in slide-in-from-top-1">
                                                <label className="text-xs text-gray-500">Qtd usada:</label>
                                                <input
                                                    type="number"
                                                    min="0.1"
                                                    step="0.1"
                                                    value={selectedData?.quantity || 1}
                                                    onChange={(e) => handleServiceQuantityChange(s.id, parseFloat(e.target.value))}
                                                    className="w-16 p-1 text-sm border border-gray-300 rounded text-center"
                                                />
                                                <span className="text-xs font-bold text-gray-400">{activeProduct?.contentUnit || 'un'}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!activeProduct}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={16} className="mr-2" /> Confirmar Entrada
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockEntryModal;
