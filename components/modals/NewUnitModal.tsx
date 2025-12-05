
import React, { useState } from 'react';
import { X, Save, Building, MapPin, Phone, Mail, FileText, Settings } from 'lucide-react';
import { BusinessUnit } from '../../types';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';

interface NewUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingUnit?: BusinessUnit | null;
}

const NewUnitModal: React.FC<NewUnitModalProps> = ({ isOpen, onClose, editingUnit }) => {
    const { addUnit, updateUnit } = useData();
    const { addToast } = useToast();

    const initialFormState = {
        name: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        whatsapp: '',
        cnpj: '',
        stateRegistration: '',
        municipalRegistration: '',
        managerName: '',
        type: 'own' as 'own' | 'franchise' | 'partner',
        status: 'operational' as 'operational' | 'implementation' | 'inactive' | 'alert',
        shareClients: false,
        allowTransfers: true,
        syncInventory: false,
        useGlobalPricing: true
    };

    const [formData, setFormData] = useState(initialFormState);
    const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'legal' | 'settings'>('basic');

    React.useEffect(() => {
        if (isOpen && editingUnit) {
            setFormData({
                name: editingUnit.name,
                street: editingUnit.address?.street || '',
                number: editingUnit.address?.number || '',
                complement: editingUnit.address?.complement || '',
                neighborhood: editingUnit.address?.neighborhood || '',
                city: editingUnit.address?.city || '',
                state: editingUnit.address?.state || '',
                zipCode: editingUnit.address?.zipCode || '',
                phone: editingUnit.contact?.phone || '',
                email: editingUnit.contact?.email || '',
                whatsapp: editingUnit.contact?.whatsapp || '',
                cnpj: editingUnit.legal?.cnpj || '',
                stateRegistration: editingUnit.legal?.stateRegistration || '',
                municipalRegistration: editingUnit.legal?.municipalRegistration || '',
                managerName: editingUnit.managerName,
                type: editingUnit.type || 'own',
                status: editingUnit.status,
                shareClients: editingUnit.settings?.shareClients || false,
                allowTransfers: editingUnit.settings?.allowTransfers || true,
                syncInventory: editingUnit.settings?.syncInventory || false,
                useGlobalPricing: editingUnit.settings?.useGlobalPricing || true
            });
        } else if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen, editingUnit]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.city || !formData.state) {
            addToast('Preencha os campos obrigatórios (Nome, Cidade, Estado)', 'error');
            return;
        }

        const location = `${formData.city}, ${formData.state}`;

        const unitData: Partial<BusinessUnit> = {
            name: formData.name,
            location: location,
            address: {
                street: formData.street,
                number: formData.number,
                complement: formData.complement,
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: 'Brasil'
            },
            contact: {
                phone: formData.phone,
                email: formData.email,
                whatsapp: formData.whatsapp
            },
            legal: {
                cnpj: formData.cnpj,
                stateRegistration: formData.stateRegistration,
                municipalRegistration: formData.municipalRegistration
            },
            managerName: formData.managerName,
            type: formData.type,
            status: formData.status,
            settings: {
                shareClients: formData.shareClients,
                allowTransfers: formData.allowTransfers,
                syncInventory: formData.syncInventory,
                useGlobalPricing: formData.useGlobalPricing
            },
            metrics: editingUnit?.metrics || {
                revenue: 0,
                revenueMoM: 0,
                activeClients: 0,
                nps: 0
            }
        };

        if (editingUnit) {
            updateUnit(editingUnit.id, unitData);
            addToast(`${formData.name} atualizada com sucesso!`, 'success');
        } else {
            const newUnit: BusinessUnit = {
                id: `u${Date.now()}`,
                ...unitData,
                revenue: 0,
                revenueMoM: 0,
                activeClients: 0,
                nps: 0
            } as BusinessUnit;
            addUnit(newUnit);
            addToast(`${formData.name} adicionada à rede!`, 'success');
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-diva-primary to-diva-dark text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {editingUnit ? 'Editar Unidade' : 'Nova Unidade'}
                        </h2>
                        <p className="text-sm opacity-90 mt-1">
                            {editingUnit ? 'Atualize as informações da unidade' : 'Cadastre uma nova unidade da rede'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50 px-6">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`px-4 py-3 text-sm font-bold transition-colors relative ${activeTab === 'basic' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Building size={16} className="inline mr-2" />
                        Dados Básicos
                        {activeTab === 'basic' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-diva-primary"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`px-4 py-3 text-sm font-bold transition-colors relative ${activeTab === 'contact' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Phone size={16} className="inline mr-2" />
                        Contato
                        {activeTab === 'contact' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-diva-primary"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('legal')}
                        className={`px-4 py-3 text-sm font-bold transition-colors relative ${activeTab === 'legal' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FileText size={16} className="inline mr-2" />
                        Dados Legais
                        {activeTab === 'legal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-diva-primary"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-3 text-sm font-bold transition-colors relative ${activeTab === 'settings' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Settings size={16} className="inline mr-2" />
                        Configurações
                        {activeTab === 'settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-diva-primary"></div>}
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">

                    {/* Tab: Basic Info */}
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Nome da Unidade <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="Ex: Diva Salvador - Barra"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Gerente Responsável
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.managerName}
                                        onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="Ex: Maria Santos"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Tipo de Unidade
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent bg-white"
                                    >
                                        <option value="own">Própria</option>
                                        <option value="franchise">Franquia</option>
                                        <option value="partner">Parceira</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent bg-white"
                                    >
                                        <option value="operational">Operacional</option>
                                        <option value="implementation">Em Implantação</option>
                                        <option value="inactive">Inativa</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <h3 className="font-bold text-gray-700 mb-3 flex items-center">
                                    <MapPin size={16} className="mr-2" />
                                    Endereço
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Rua/Avenida</label>
                                        <input
                                            type="text"
                                            value={formData.street}
                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Ex: Av. Oceânica"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Número</label>
                                        <input
                                            type="text"
                                            value={formData.number}
                                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="1234"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Complemento</label>
                                        <input
                                            type="text"
                                            value={formData.complement}
                                            onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Sala 101"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Bairro</label>
                                        <input
                                            type="text"
                                            value={formData.neighborhood}
                                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Barra"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">
                                            Cidade <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Salvador"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">
                                            Estado <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="BA"
                                            maxLength={2}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">CEP</label>
                                        <input
                                            type="text"
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="40140-130"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Contact */}
                    {activeTab === 'contact' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        <Phone size={14} className="inline mr-1" />
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="(71) 3333-4444"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        <Phone size={14} className="inline mr-1" />
                                        WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="(71) 99999-9999"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        <Mail size={14} className="inline mr-1" />
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="salvador@divaspa.com.br"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Legal */}
                    {activeTab === 'legal' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        <FileText size={14} className="inline mr-1" />
                                        CNPJ
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cnpj}
                                        onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="12.345.678/0001-90"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Inscrição Estadual
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.stateRegistration}
                                        onChange={(e) => setFormData({ ...formData, stateRegistration: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="123.456.789"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Inscrição Municipal
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.municipalRegistration}
                                        onChange={(e) => setFormData({ ...formData, municipalRegistration: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="987.654.321"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Settings */}
                    {activeTab === 'settings' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Configure como esta unidade interage com a rede
                            </p>

                            <div className="space-y-3">
                                <label className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.shareClients}
                                        onChange={(e) => setFormData({ ...formData, shareClients: e.target.checked })}
                                        className="mt-1 mr-3 w-5 h-5 text-diva-primary rounded focus:ring-diva-primary"
                                    />
                                    <div>
                                        <div className="font-bold text-sm text-gray-700">Compartilhar Base de Clientes</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Clientes cadastrados nesta unidade ficam visíveis para outras unidades
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowTransfers}
                                        onChange={(e) => setFormData({ ...formData, allowTransfers: e.target.checked })}
                                        className="mt-1 mr-3 w-5 h-5 text-diva-primary rounded focus:ring-diva-primary"
                                    />
                                    <div>
                                        <div className="font-bold text-sm text-gray-700">Permitir Transferências</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Permite transferir clientes, estoque e dados entre unidades
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.syncInventory}
                                        onChange={(e) => setFormData({ ...formData, syncInventory: e.target.checked })}
                                        className="mt-1 mr-3 w-5 h-5 text-diva-primary rounded focus:ring-diva-primary"
                                    />
                                    <div>
                                        <div className="font-bold text-sm text-gray-700">Sincronizar Estoque</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Estoque é compartilhado e sincronizado em tempo real com outras unidades
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.useGlobalPricing}
                                        onChange={(e) => setFormData({ ...formData, useGlobalPricing: e.target.checked })}
                                        className="mt-1 mr-3 w-5 h-5 text-diva-primary rounded focus:ring-diva-primary"
                                    />
                                    <div>
                                        <div className="font-bold text-sm text-gray-700">Usar Tabela de Preços Global</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Usa a mesma tabela de preços da matriz (recomendado para franquias)
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors flex items-center"
                    >
                        <Save size={18} className="mr-2" />
                        {editingUnit ? 'Atualizar' : 'Criar Unidade'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewUnitModal;
