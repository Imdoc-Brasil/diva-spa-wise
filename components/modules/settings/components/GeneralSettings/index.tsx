import React, { useState, useEffect } from 'react';
import { Building2, Save } from 'lucide-react';
import { SettingsSection, SettingsCard, SaveButton } from '../../shared';
import { formatPhone, formatCPF, formatCNPJ } from '../../utils/formatters';

interface BusinessConfig {
    name: string;
    phone: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cnpj: string;
    cnaePrimary: string;
    cnaeSecondary: string;
    legalRepName: string;
    legalRepCpf: string;
    legalRepBirthDate: string;
}

interface GeneralSettingsProps {
    businessConfig: BusinessConfig;
    onSave: (config: BusinessConfig) => void;
    selectedUnitId?: string;
}

/**
 * General Settings Component
 * Manages business information and legal data
 */
export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    businessConfig,
    onSave,
    selectedUnitId = 'all'
}) => {
    const [localConfig, setLocalConfig] = useState<BusinessConfig>(businessConfig);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Update local config when prop changes
    useEffect(() => {
        setLocalConfig(businessConfig);
        setHasChanges(false);
    }, [businessConfig]);

    // Track changes
    useEffect(() => {
        const changed = JSON.stringify(localConfig) !== JSON.stringify(businessConfig);
        setHasChanges(changed);
    }, [localConfig, businessConfig]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(localConfig);
            setHasChanges(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhoneChange = (value: string) => {
        setLocalConfig({ ...localConfig, phone: formatPhone(value) });
    };

    const handleCNPJChange = (value: string) => {
        setLocalConfig({ ...localConfig, cnpj: formatCNPJ(value) });
    };

    const handleCPFChange = (value: string) => {
        setLocalConfig({ ...localConfig, legalRepCpf: formatCPF(value) });
    };

    // Show message if "all units" is selected
    if (selectedUnitId === 'all') {
        return (
            <SettingsSection
                title="Dados da Unidade"
                description="Informações visíveis no agendamento e rodapé de recibos."
                icon={<Building2 size={20} />}
            >
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Building2 size={48} className="text-gray-400 mb-4" />
                    <h4 className="text-lg font-bold text-gray-600">Selecione uma Unidade</h4>
                    <p className="text-sm text-gray-500 max-w-md mt-2">
                        Para editar os dados operacionais (endereço, telefone, etc.), selecione uma unidade específica no menu superior.
                    </p>
                </div>
            </SettingsSection>
        );
    }

    return (
        <SettingsSection
            title="Dados da Unidade"
            description="Informações visíveis no agendamento e rodapé de recibos."
            icon={<Building2 size={20} />}
        >
            <div className="space-y-6">
                {/* Basic Information */}
                <SettingsCard title="Informações Básicas">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Nome da Unidade</label>
                            <input
                                type="text"
                                value={localConfig.name}
                                onChange={(e) => setLocalConfig({ ...localConfig, name: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                placeholder="Nome da clínica"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Telefone/WhatsApp</label>
                            <input
                                type="text"
                                value={localConfig.phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                placeholder="(00) 00000-0000"
                                maxLength={15}
                            />
                        </div>
                    </div>
                </SettingsCard>

                {/* Address */}
                <SettingsCard title="Endereço">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Rua</label>
                            <input
                                type="text"
                                value={localConfig.street}
                                onChange={(e) => setLocalConfig({ ...localConfig, street: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                placeholder="Nome da rua"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Número</label>
                                <input
                                    type="text"
                                    value={localConfig.number}
                                    onChange={(e) => setLocalConfig({ ...localConfig, number: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                    placeholder="123"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Bairro</label>
                                <input
                                    type="text"
                                    value={localConfig.neighborhood}
                                    onChange={(e) => setLocalConfig({ ...localConfig, neighborhood: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                    placeholder="Centro"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Cidade</label>
                                <input
                                    type="text"
                                    value={localConfig.city}
                                    onChange={(e) => setLocalConfig({ ...localConfig, city: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                    placeholder="São Paulo"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:w-1/3">
                            <label className="text-sm font-bold text-gray-700">Estado</label>
                            <input
                                type="text"
                                value={localConfig.state}
                                onChange={(e) => setLocalConfig({ ...localConfig, state: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                placeholder="SP"
                                maxLength={2}
                            />
                        </div>
                    </div>
                </SettingsCard>

                {/* Fiscal & Legal */}
                <SettingsCard title="Fiscal & Legal">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">CNPJ</label>
                            <input
                                type="text"
                                value={localConfig.cnpj}
                                onChange={(e) => handleCNPJChange(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                placeholder="00.000.000/0000-00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">CNAE Principal</label>
                            <input
                                type="text"
                                value={localConfig.cnaePrimary}
                                onChange={(e) => setLocalConfig({ ...localConfig, cnaePrimary: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                placeholder="Código CNAE"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">CNAEs Secundários</label>
                            <input
                                type="text"
                                value={localConfig.cnaeSecondary}
                                onChange={(e) => setLocalConfig({ ...localConfig, cnaeSecondary: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                placeholder="Separados por vírgula"
                            />
                        </div>
                    </div>
                </SettingsCard>

                {/* Legal Representative */}
                <SettingsCard title="Representante Legal">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Nome Completo</label>
                            <input
                                type="text"
                                value={localConfig.legalRepName}
                                onChange={(e) => setLocalConfig({ ...localConfig, legalRepName: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                placeholder="Nome do representante"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">CPF</label>
                            <input
                                type="text"
                                value={localConfig.legalRepCpf}
                                onChange={(e) => handleCPFChange(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                                placeholder="000.000.000-00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Data de Nascimento</label>
                            <input
                                type="date"
                                value={localConfig.legalRepBirthDate}
                                onChange={(e) => setLocalConfig({ ...localConfig, legalRepBirthDate: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600 bg-white text-gray-900"
                            />
                        </div>
                    </div>
                </SettingsCard>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <SaveButton
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={!hasChanges}
                    >
                        Salvar Alterações
                    </SaveButton>
                </div>
            </div>
        </SettingsSection>
    );
};

export default GeneralSettings;
