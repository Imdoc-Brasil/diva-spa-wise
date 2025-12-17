import React, { useState, useEffect } from 'react';
import { X, Save, Package, Tag, FlaskConical, Box, Scale, Layers, FileText, Calendar, DollarSign, PenTool, Link2 } from 'lucide-react';
import { useUnitData } from '../hooks/useUnitData';
import { Product, ProductCategory, ProtocolItem } from '../../types';

interface NewProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: Product | null;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
    const { addProduct, updateProduct, services, updateService } = useUnitData();
    const [activeTab, setActiveTab] = useState<'info' | 'financial' | 'services'>('info');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        activeIngredients: '',
        category: 'professional_use' as ProductCategory,
        presentation: 'Frasco',
        contentQuantity: '',
        contentUnit: 'ml',
        description: '',
        // Financial & Stock (Editable in Edit Mode)
        costPrice: '',
        price: '', // Sell Price
        minStockLevel: '',
        batchNumber: '',
        expirationDate: '',
        lastInvoice: '',
    });

    // Linked Services State
    const [linkedServices, setLinkedServices] = useState<{ serviceId: string, quantity: number }[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                // Load Product Data
                setFormData({
                    name: productToEdit.name,
                    activeIngredients: productToEdit.activeIngredients || '',
                    category: productToEdit.category,
                    presentation: productToEdit.presentation || 'Frasco',
                    contentQuantity: productToEdit.contentQuantity?.toString() || '',
                    contentUnit: productToEdit.contentUnit || 'ml',
                    description: productToEdit.description || '',
                    costPrice: productToEdit.costPrice?.toString() || '',
                    price: productToEdit.price.toString() || '',
                    minStockLevel: productToEdit.minStockLevel?.toString() || '',
                    batchNumber: productToEdit.batchNumber || '',
                    expirationDate: productToEdit.expirationDate || '',
                    lastInvoice: productToEdit.lastInvoice || '',
                });

                // Load Linked Services
                const links: { serviceId: string, quantity: number }[] = [];
                services.forEach(s => {
                    if (s.protocol) {
                        const item = s.protocol.find(p => p.productId === productToEdit.id);
                        if (item) {
                            links.push({ serviceId: s.id, quantity: item.quantity });
                        }
                    }
                });
                setLinkedServices(links);
            } else {
                // Reset for Create Mode
                setFormData({
                    name: '', activeIngredients: '', category: 'professional_use', presentation: 'Frasco',
                    contentQuantity: '', contentUnit: 'ml', description: '',
                    costPrice: '', price: '', minStockLevel: '', batchNumber: '', expirationDate: '', lastInvoice: ''
                });
                setLinkedServices([]);
            }
            setActiveTab('info');
        }
    }, [isOpen, productToEdit, services]);

    const handleServiceToggle = (serviceId: string) => {
        if (linkedServices.find(l => l.serviceId === serviceId)) {
            setLinkedServices(linkedServices.filter(l => l.serviceId !== serviceId));
        } else {
            setLinkedServices([...linkedServices, { serviceId, quantity: 1 }]);
        }
    };

    const handleServiceQuantity = (serviceId: string, qty: number) => {
        setLinkedServices(linkedServices.map(l => l.serviceId === serviceId ? { ...l, quantity: qty } : l));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Product Data
        const productData: any = {
            name: formData.name,
            activeIngredients: formData.activeIngredients,
            category: formData.category,
            presentation: formData.presentation,
            contentQuantity: parseFloat(formData.contentQuantity) || 0,
            contentUnit: formData.contentUnit,
            description: formData.description,
            // Financial/Stock Data (Update active values)
            costPrice: parseFloat(formData.costPrice) || 0,
            price: parseFloat(formData.price) || 0,
            minStockLevel: parseFloat(formData.minStockLevel) || 0,
            batchNumber: formData.batchNumber,
            expirationDate: formData.expirationDate,
            lastInvoice: formData.lastInvoice,
        };

        if (productToEdit) {
            // Update Existing Product
            updateProduct(productToEdit.id, productData);

            // Update Services (Diff Logic)
            // 1. Remove from services that were unselected (if previously linked)
            services.forEach(s => {
                const wasLinked = s.protocol?.some(p => p.productId === productToEdit.id);
                const isNowLinked = linkedServices.some(l => l.serviceId === s.id);

                if (wasLinked && !isNowLinked) {
                    // Remove
                    const newProtocol = s.protocol?.filter(p => p.productId !== productToEdit.id) || [];
                    updateService(s.id, { protocol: newProtocol });
                } else if (isNowLinked) {
                    // Add or Update
                    const linkData = linkedServices.find(l => l.serviceId === s.id);
                    if (!linkData) return;

                    const newProtocol = [...(s.protocol || [])];
                    const existingIdx = newProtocol.findIndex(p => p.productId === productToEdit.id);

                    const newItem: ProtocolItem = {
                        productId: productToEdit.id,
                        productName: formData.name,
                        quantity: linkData.quantity,
                        unit: formData.contentUnit,
                        unitCost: (parseFloat(formData.costPrice) || 0) / (parseFloat(formData.contentQuantity) || 1) // Unit Cost
                    };

                    if (existingIdx >= 0) {
                        newProtocol[existingIdx] = newItem;
                    } else {
                        newProtocol.push(newItem);
                    }
                    updateService(s.id, { protocol: newProtocol });
                }
            });

        } else {
            // Create New Product
            const newProduct: Omit<Product, 'organizationId'> = {
                id: `prod_${Date.now()}`,
                ...productData,
                stock: 0, // Initial stock 0
            };
            addProduct(newProduct);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white shrink-0">
                    <h3 className="font-bold text-lg flex items-center">
                        {productToEdit ? <PenTool size={20} className="mr-2" /> : <Package size={20} className="mr-2" />}
                        {productToEdit ? `Editar: ${productToEdit.name}` : 'Novo Produto'}
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* TABS */}
                <div className="flex border-b border-gray-100 bg-gray-50 px-6 pt-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`pb-2 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'info' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Dados Cadastrais
                    </button>
                    {productToEdit && (
                        <>
                            <button
                                onClick={() => setActiveTab('financial')}
                                className={`pb-2 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'financial' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                Lote, Custo & NF
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`pb-2 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'services' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                Serviços Vinculados
                            </button>
                        </>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">

                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                            {!productToEdit && (
                                <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                                    Cadastre aqui as informações técnicas. Após criar, você poderá editar para vincular serviços.
                                </p>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Comercial *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Princípios Ativos</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary"
                                    placeholder="Ex: Toxina Botulínica..."
                                    value={formData.activeIngredients}
                                    onChange={(e) => setFormData({ ...formData, activeIngredients: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary bg-white text-sm"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                                    >
                                        <option value="professional_use">Uso Profissional</option>
                                        <option value="homecare">Home Care (Venda)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apresentação</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary bg-white text-sm"
                                        value={formData.presentation}
                                        onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
                                    >
                                        <option value="Frasco">Frasco</option>
                                        <option value="Ampola">Ampola</option>
                                        <option value="Caixa">Caixa</option>
                                        <option value="Pote">Pote</option>
                                        <option value="Bisnaga">Bisnaga</option>
                                        <option value="Kit">Kit</option>
                                        <option value="Unidade">Unidade</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contendo (Qtd)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                        value={formData.contentQuantity}
                                        onChange={(e) => setFormData({ ...formData, contentQuantity: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unidade</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary bg-white text-sm"
                                        value={formData.contentUnit}
                                        onChange={(e) => setFormData({ ...formData, contentUnit: e.target.value })}
                                    >
                                        <option value="ml">ml</option>
                                        <option value="ui">UI</option>
                                        <option value="g">g</option>
                                        <option value="mg">mg</option>
                                        <option value="un">un</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FINANCIAL TAB */}
                    {activeTab === 'financial' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                            <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                Ajuste aqui os dados do lote atual e valores. Para adicionar quantidade ao estoque, use a <strong>Entrada de Nota</strong>.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Última Nota Fiscal</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="text"
                                            className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                            value={formData.lastInvoice}
                                            onChange={(e) => setFormData({ ...formData, lastInvoice: e.target.value })}
                                            placeholder="Nº da NF"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lote</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                        value={formData.batchNumber}
                                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                    <p className="text-xs text-gray-400 mt-1">Por {formData.presentation}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço Venda (R$)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Validade</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                        value={formData.expirationDate}
                                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
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
                                    <p className="text-xs text-gray-400 mt-1">Em {formData.contentUnit}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SERVICES TAB */}
                    {activeTab === 'services' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                            <div className="bg-purple-50 p-4 rounded-lg flex items-start gap-3 border border-purple-100">
                                <Link2 className="text-purple-600 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-purple-900 text-sm">Vincular a Serviços</h4>
                                    <p className="text-xs text-purple-700">
                                        Selecione quais serviços consomem este insumo. O estoque será baixado automaticamente após o atendimento.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 border border-gray-100 rounded-xl overflow-hidden">
                                {services.map(s => {
                                    const link = linkedServices.find(l => l.serviceId === s.id);
                                    const isLinked = !!link;

                                    return (
                                        <div key={s.id} className={`p-3 flex items-center justify-between transition-colors ${isLinked ? 'bg-purple-50/50' : 'hover:bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isLinked}
                                                    onChange={() => handleServiceToggle(s.id)}
                                                    className="w-5 h-5 rounded border-gray-300 text-diva-primary focus:ring-diva-primary"
                                                />
                                                <span className={`text-sm ${isLinked ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{s.name}</span>
                                            </div>

                                            {isLinked && (
                                                <div className="flex items-center gap-2">
                                                    <label className="text-xs text-gray-500">Qtd:</label>
                                                    <input
                                                        type="number"
                                                        min="0.1"
                                                        step="0.1"
                                                        className="w-20 p-1 text-center border border-gray-300 rounded text-sm"
                                                        value={link?.quantity || 1}
                                                        onChange={(e) => handleServiceQuantity(s.id, parseFloat(e.target.value))}
                                                    />
                                                    <span className="text-xs font-bold text-gray-400">{formData.contentUnit}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </form>

                <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-diva-dark transition-all flex items-center"
                    >
                        <Save size={16} className="mr-2" /> Salvar {productToEdit ? 'Alterações' : 'Produto'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewProductModal;
