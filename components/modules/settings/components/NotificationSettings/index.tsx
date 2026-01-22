import React, { useState, useEffect } from 'react';
import { Bell, Save } from 'lucide-react';
import { SettingsSection, SettingsCard, SaveButton } from '../../shared';
import { NotificationConfig } from '../../../../../types';

interface NotificationSettingsProps {
    notificationConfig: NotificationConfig;
    onSave: (config: NotificationConfig) => void;
}

/**
 * Notification Settings Component
 * Manages automated communication templates (WhatsApp)
 */
export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
    notificationConfig,
    onSave
}) => {
    const [localConfig, setLocalConfig] = useState<NotificationConfig>(notificationConfig);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Update local config when prop changes
    useEffect(() => {
        setLocalConfig(notificationConfig);
        setHasChanges(false);
    }, [notificationConfig]);

    // Track changes
    useEffect(() => {
        const changed = JSON.stringify(localConfig) !== JSON.stringify(notificationConfig);
        setHasChanges(changed);
    }, [localConfig, notificationConfig]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(localConfig);
            setHasChanges(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SettingsSection
            title="Comunicação Automática"
            description="Personalize as mensagens enviadas via WhatsApp para seus clientes."
            icon={<Bell size={20} />}
        >
            <div className="space-y-6">
                {/* Appointment Confirmation */}
                <SettingsCard
                    title="Confirmação de Agendamento"
                    description="Mensagem enviada imediatamente após o agendamento"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                            Ativo
                        </span>
                    </div>
                    <textarea
                        className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-1 focus:ring-purple-600 outline-none resize-none"
                        value={localConfig.appointmentConfirmation}
                        onChange={(e) => setLocalConfig({
                            ...localConfig,
                            appointmentConfirmation: e.target.value
                        })}
                        placeholder="Digite a mensagem de confirmação..."
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        Variáveis disponíveis: {'{nome}'}, {'{data}'}, {'{hora}'}, {'{servico}'}
                    </p>
                </SettingsCard>

                {/* Appointment Reminder */}
                <SettingsCard
                    title="Lembrete (24h antes)"
                    description="Mensagem enviada 24 horas antes do agendamento"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                            Ativo
                        </span>
                    </div>
                    <textarea
                        className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-1 focus:ring-purple-600 outline-none resize-none"
                        value={localConfig.appointmentReminder}
                        onChange={(e) => setLocalConfig({
                            ...localConfig,
                            appointmentReminder: e.target.value
                        })}
                        placeholder="Digite a mensagem de lembrete..."
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        Variáveis disponíveis: {'{nome}'}, {'{data}'}, {'{hora}'}, {'{servico}'}
                    </p>
                </SettingsCard>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <SaveButton
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={!hasChanges}
                    >
                        Salvar Modelos
                    </SaveButton>
                </div>
            </div>
        </SettingsSection>
    );
};

export default NotificationSettings;
