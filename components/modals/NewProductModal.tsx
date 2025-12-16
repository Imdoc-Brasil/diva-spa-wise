
import React, { useState } from 'react';
import { X, Save, Package, DollarSign, Tag, Archive, Link2, Layers, Calendar, AlertCircle } from 'lucide-react';
import { useUnitData } from '../hooks/useUnitData';
import { Product, ProductCategory } from '../../types';

interface NewProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose }) => {
    const { addProduct, services } = useUnitData();
    const [formData, setFormData] = useState({
        name: '',
        category: 'homecare' as ProductCategory,
        price: '',
        costPrice: '',
        stock: '',
        minStockLevel: '',
        expirationDate: '',
        batchNumber: '',
        // Package specifics
        serviceReferenceId: '',
        packageSessionCount: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.price) return;

        const newProduct: Omit<Product, 'organizationId'> = {
            id: `prod_${Date.now()}`,
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price) || 0,
            costPrice: parseFloat(formData.costPrice) || 0,
            stock: parseInt(formData.stock) || 0,
            minStockLevel: parseInt(formData.minStockLevel) || 5,
            batchNumber: formData.batchNumber,
            expirationDate: formData.expirationDate || undefined,
            // Package fields
            serviceReferenceId: formData.category === 'treatment_package' ? formData.serviceReferenceId : undefined,
            packageSessionCount: formData.category === 'treatment_package' ? (parseInt(formData.packageSessionCount) || 1) : undefined
        };

        addProduct(newProduct);

        // Reset and Close
        onClose();
        setFormData({
            name: '', category: 'homecare', price: '', costPrice: '', stock: '',
            minStockLevel: '', expirationDate: '', batchNumber: '',
            serviceReferenceId: '', packageSessionCount: ''
        });
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white shrink-0">
                    <h3 className="font-bold text-lg flex items-center">
                        <Package size={20} className="mr-2" /> Novo Produto
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h4 className="text-gray-900 font-bold border-b border-gray-100 pb-2 mb-4">Informações Básicas</h4>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Produto *</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                                placeholder="Ex: Kit Skin Care, Botox Vial..."
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <select
                                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                                    >
                                        <option value="homecare">Home Care (Venda)</option>
                                        <option value="professional_use">Uso Profissional (Insumo)</option>
                                        <option value="treatment_package">Pacote de Tratamento</option>
                                        <option value="giftcard">Gift Card</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço Venda (R$)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stock Info */}
                    <div className="space-y-4">
                        <h4 className="text-gray-900 font-bold border-b border-gray-100 pb-2 mb-4">Estoque e Custo</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo Unitário (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                                    placeholder="0.00"
                                    value={formData.costPrice}
                                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Inicial</label>
                                <div className="relative">
                                    <Archive className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="number"
                                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estoque Minimo</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                                    value={formData.minStockLevel}
                                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Validade (Opcional)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="date"
                                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900"
                                        value={formData.expirationDate}
                                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PACKAGE SPECIFIC SECTION - NEW */}
                    {formData.category === 'treatment_package' && (
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 animate-in slide-in-from-top-2">
                            <h4 className="flex items-center text-purple-900 font-bold mb-3">
                                <Layers size={18} className="mr-2" /> Configuração do Pacote
                            </h4>
                            <p className="text-xs text-purple-700 mb-4">
                                Defina quantas sessões este pacote concede e a qual serviço ele se refere.
                                Quando o cliente comprar este item, as sessões serão creditadas automaticamente.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-purple-800 uppercase mb-1">Serviço Vinculado *</label>
                                    <div className="relative">
                                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={14} />
                                        <select
                                            required={formData.category === 'treatment_package'}
                                            className="w-full pl-9 pr-3 py-3 border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900 text-sm"
                                            value={formData.serviceReferenceId}
                                            onChange={(e) => setFormData({ ...formData, serviceReferenceId: e.target.value })}
                                        >
                                            <option value="">Selecione um serviço...</option>
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                            {/* Fallback mock match if names are consistent */}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-purple-800 uppercase mb-1">Qtde. de Sessões *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required={formData.category === 'treatment_package'}
                                        className="w-full p-3 border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900"
                                        placeholder="Ex: 5, 10"
                                        value={formData.packageSessionCount}
                                        onChange={(e) => setFormData({ ...formData, packageSessionCount: e.target.value })}
                                    />
                                </div>
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
                        <Save size={16} className="mr-2" /> Salvar Produto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewProductModal;
