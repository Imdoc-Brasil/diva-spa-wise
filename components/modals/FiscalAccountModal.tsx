
import React, { useState, useEffect } from 'react';
import { FiscalAccount } from '../../types';
import { X, Save, Building2, User, ShoppingBag, CreditCard, Shield } from 'lucide-react';

interface FiscalAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (account: FiscalAccount) => void;
    accountToEdit?: FiscalAccount | null;
}

const FiscalAccountModal: React.FC<FiscalAccountModalProps> = ({ isOpen, onClose, onSave, accountToEdit }) => {
    const [formData, setFormData] = useState<Partial<FiscalAccount>>({
        name: '',
        alias: '',
        document: '',
        type: 'clinic_service',
        address: '',
        digitalCertificateInfo: { validTo: '', hasPassword: false },
        receivingConfig: { pixKey: '', pixKeyType: undefined, cardMachineLabel: '' },
        paymentMethods: []
    });

    useEffect(() => {
        if (accountToEdit) {
            setFormData(accountToEdit);
        } else {
            setFormData({
                name: '',
                alias: '',
                document: '',
                type: 'clinic_service',
                address: '',
                digitalCertificateInfo: { validTo: '', hasPassword: false },
                receivingConfig: { pixKey: '', pixKeyType: undefined, cardMachineLabel: '' },
                paymentMethods: []
            });
        }
    }, [accountToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation logic here
        const newAccount: FiscalAccount = {
            id: accountToEdit?.id || `fa_${Date.now()}`,
            organizationId: accountToEdit?.organizationId || 'org_demo',
            name: formData.name || '',
            alias: formData.alias || '',
            document: formData.document || '',
            type: formData.type as any,
            address: formData.address,
            digitalCertificateInfo: formData.digitalCertificateInfo,
            receivingConfig: formData.receivingConfig,
            paymentMethods: formData.paymentMethods
        };
        onSave(newAccount);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-diva-dark text-white">
                    <h3 className="text-xl font-bold flex items-center">
                        <Building2 className="mr-2" size={20} />
                        {accountToEdit ? 'Editar Conta Fiscal' : 'Nova Conta Fiscal'}
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nome Identificação (Apelido)</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none"
                                placeholder="Ex: CNPJ Serviços, Dra. Julia, Marketplace Loja"
                                value={formData.alias}
                                onChange={e => setFormData({ ...formData, alias: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Conta</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none appearance-none bg-white"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    <option value="clinic_service">Serviços da Clínica (CNPJ Principal)</option>
                                    <option value="marketplace">Marketplace / Venda de Produtos</option>
                                    <option value="professional">Profissional Parceiro (CPF/CNPJ)</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Documento (CPF/CNPJ)</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none"
                                placeholder="00.000.000/0000-00"
                                value={formData.document}
                                onChange={e => setFormData({ ...formData, document: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Razão Social / Nome Completo</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none"
                                placeholder="Nome oficial para Nota Fiscal"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Endereço Fiscal</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none"
                                placeholder="Rua, Número, Bairro, Cidade - UF"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>


                    {/* Receiving Config */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="text-green-600" size={18} />
                            <h4 className="font-bold text-gray-800">Dados de Recebimento (Vínculos)</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chave PIX</label>
                                <input
                                    type="text"
                                    placeholder="Chave PIX deste documento"
                                    className="w-full p-2 border border-gray-200 rounded bg-white text-sm"
                                    value={formData.receivingConfig?.pixKey || ''}
                                    onChange={e => setFormData({
                                        ...formData,
                                        receivingConfig: { ...formData.receivingConfig, pixKey: e.target.value }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Chave</label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded bg-white text-sm"
                                    value={formData.receivingConfig?.pixKeyType || ''}
                                    onChange={e => setFormData({
                                        ...formData,
                                        receivingConfig: { ...formData.receivingConfig, pixKeyType: e.target.value as any }
                                    })}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="cpf">CPF</option>
                                    <option value="cnpj">CNPJ</option>
                                    <option value="email">E-mail</option>
                                    <option value="phone">Telefone</option>
                                    <option value="random">Aleatória</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Identificação da Maquininha (Cartão)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Stone S920 - Balcão 1"
                                    className="w-full p-2 border border-gray-200 rounded bg-white text-sm"
                                    value={formData.receivingConfig?.cardMachineLabel || ''}
                                    onChange={e => setFormData({
                                        ...formData,
                                        receivingConfig: { ...formData.receivingConfig, cardMachineLabel: e.target.value }
                                    })}
                                />
                                <p className="text-xs text-gray-400 mt-1">Identifique qual terminal está vinculado a este CNPJ.</p>
                            </div>
                        </div>
                    </div>

                    {/* Certificate & Config */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="text-blue-600" size={18} />
                            <h4 className="font-bold text-gray-800">Certificado Digital (A1)</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Validade do Certificado</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-200 rounded bg-white text-sm"
                                    value={formData.digitalCertificateInfo?.validTo}
                                    onChange={e => setFormData({
                                        ...formData,
                                        digitalCertificateInfo: { ...formData.digitalCertificateInfo, validTo: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-diva-primary focus:ring-diva-primary"
                                        checked={formData.digitalCertificateInfo?.hasPassword}
                                        onChange={e => setFormData({
                                            ...formData,
                                            digitalCertificateInfo: { ...formData.digitalCertificateInfo!, hasPassword: e.target.checked }
                                        })}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Senha Salva (Ambiente Seguro)</span>
                                </label>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded text-center">
                            * O upload do arquivo .pfx será solicitado na primeira emissão.
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-diva-primary text-white rounded-lg font-bold hover:bg-opacity-90 shadow-md flex items-center"
                        >
                            <Save size={18} className="mr-2" /> Salvar Conta Fiscal
                        </button>
                    </div>

                </form>
            </div >
        </div >
    );
};

export default FiscalAccountModal;
