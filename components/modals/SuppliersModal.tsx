
import React, { useState, useEffect } from 'react';
import { X, Save, Building, User, Mail, Phone, FileText, Tag, Trash2 } from 'lucide-react';
import { Supplier } from '../../types';
import { useUnitData } from '../hooks/useUnitData';

interface SuppliersModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplierToEdit?: Supplier | null;
}

const SuppliersModal: React.FC<SuppliersModalProps> = ({ isOpen, onClose, supplierToEdit }) => {
    const { addSupplier, updateSupplier, removeSupplier } = useUnitData();

    const [formData, setFormData] = useState<{
        name: string;
        contact: string;
        email: string;
        phone: string;
        document: string;
        categories: string; // Comma separated for simplicity, or handle as array
        active: boolean;
    }>({
        name: '',
        contact: '',
        email: '',
        phone: '',
        document: '',
        categories: '',
        active: true
    });

    useEffect(() => {
        if (supplierToEdit) {
            setFormData({
                name: supplierToEdit.name,
                contact: supplierToEdit.contact,
                email: supplierToEdit.email || '',
                phone: supplierToEdit.phone || '',
                document: supplierToEdit.document || '',
                categories: supplierToEdit.categories.join(', '),
                active: supplierToEdit.active
            });
        } else {
            setFormData({
                name: '',
                contact: '',
                email: '',
                phone: '',
                document: '',
                categories: '',
                active: true
            });
        }
    }, [supplierToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const categoriesArray = formData.categories.split(',').map(c => c.trim()).filter(c => c.length > 0);

        if (supplierToEdit) {
            updateSupplier(supplierToEdit.id, {
                ...formData,
                categories: categoriesArray
            });
        } else {
            addSupplier({
                id: `sup_${Date.now()}`,
                ...formData,
                categories: categoriesArray,
                rating: 0 // Default
            });
        }
        onClose();
    };

    const handleDelete = () => {
        if (supplierToEdit && confirm('Tem certeza que deseja remover este fornecedor?')) {
            removeSupplier(supplierToEdit.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-bold text-diva-dark flex items-center gap-2">
                        <Building className="text-diva-primary" size={24} />
                        {supplierToEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Razão Social / Nome Fantasia</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none"
                                    placeholder="Ex: DermoTech Labs"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CNPJ / CPF</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.document}
                                        onChange={e => setFormData({ ...formData, document: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none"
                                        placeholder="00.000.000/0000-00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contato Principal</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.contact}
                                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none"
                                        placeholder="Nome do representante"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none"
                                        placeholder="contato@empresa.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone / WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categorias (separadas por vírgula)</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.categories}
                                    onChange={e => setFormData({ ...formData, categories: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none"
                                    placeholder="Ex: Descartáveis, Dermocosméticos, Laser"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                className="w-4 h-4 text-diva-primary border-gray-300 rounded focus:ring-diva-primary"
                            />
                            <label htmlFor="active" className="text-sm text-gray-700">Fornecedor Ativo</label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        {supplierToEdit && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center transition-colors mr-auto"
                            >
                                <Trash2 size={18} className="mr-2" /> Excluir
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-bold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-diva-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-diva-dark transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Save size={18} className="mr-2" /> Salvar Fornecedor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuppliersModal;
