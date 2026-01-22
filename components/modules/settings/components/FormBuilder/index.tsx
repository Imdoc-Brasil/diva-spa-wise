import React, { useState } from 'react';
import { FileText, Plus, Trash2, Edit2, Copy } from 'lucide-react';
import { SettingsSection, SettingsCard, SaveButton } from '../../shared';

interface FormField {
    id: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number';
    label: string;
    required: boolean;
    options?: string[];
}

interface FormTemplate {
    id: string;
    title: string;
    type: 'anamnesis' | 'consent' | 'evolution';
    active: boolean;
    fields: FormField[];
    createdAt: string;
}

interface FormBuilderProps {
    forms: FormTemplate[];
    onCreateForm: () => void;
    onUpdateForm: (formId: string, updates: Partial<FormTemplate>) => void;
    onDeleteForm: (formId: string) => void;
    onDuplicateForm?: (formId: string) => void;
}

/**
 * Form Builder Component
 * Manages clinical forms, anamnesis, and consent templates
 */
export const FormBuilder: React.FC<FormBuilderProps> = ({
    forms,
    onCreateForm,
    onUpdateForm,
    onDeleteForm,
    onDuplicateForm
}) => {
    const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(
        forms.length > 0 ? forms[0] : null
    );

    const handleToggleActive = (formId: string, currentActive: boolean) => {
        onUpdateForm(formId, { active: !currentActive });
    };

    const handleDeleteForm = (formId: string, formTitle: string) => {
        if (confirm(`Tem certeza que deseja excluir o formulário "${formTitle}"?`)) {
            onDeleteForm(formId);
            if (selectedForm?.id === formId) {
                setSelectedForm(forms.length > 1 ? forms[0] : null);
            }
        }
    };

    const getFormTypeLabel = (type: string) => {
        switch (type) {
            case 'anamnesis':
                return 'Anamnese';
            case 'consent':
                return 'Termo';
            case 'evolution':
                return 'Evolução';
            default:
                return type;
        }
    };

    const activeFormsCount = forms.filter(f => f.active).length;
    const emptyFormsCount = forms.filter(f => f.fields.length === 0).length;

    return (
        <SettingsSection
            title="Formulários Clínicos"
            description="Crie modelos de anamnese e termos de consentimento."
            icon={<FileText size={20} />}
        >
            <div className="space-y-4">
                {/* Header Stats */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-xs">
                        <span className="text-gray-600">
                            <strong className="text-purple-600">{forms.length}</strong> formulários
                        </span>
                        <span className="text-gray-600">
                            <strong className="text-green-600">{activeFormsCount}</strong> ativos
                        </span>
                        <span className="text-gray-600">
                            <strong className="text-gray-400">{emptyFormsCount}</strong> sem campos
                        </span>
                    </div>
                    <button
                        onClick={onCreateForm}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 flex items-center"
                    >
                        <Plus size={16} className="mr-2" />
                        Novo Modelo
                    </button>
                </div>

                {/* Forms List and Editor */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Forms List */}
                    <div className="lg:col-span-1 space-y-3">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Modelos</h4>
                        {forms.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500 mb-3">Nenhum formulário criado</p>
                                <button
                                    onClick={onCreateForm}
                                    className="text-purple-600 font-bold underline text-xs"
                                >
                                    Criar Primeiro Formulário
                                </button>
                            </div>
                        ) : (
                            forms.map(form => (
                                <div
                                    key={form.id}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedForm?.id === form.id
                                            ? 'bg-purple-600 text-white shadow-md border-purple-600'
                                            : 'bg-white border-gray-200 hover:border-purple-600 text-gray-900'
                                        }`}
                                    onClick={() => setSelectedForm(form)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm">{form.title}</h4>
                                        {form.active && (
                                            <div
                                                className={`w-2 h-2 rounded-full ${selectedForm?.id === form.id ? 'bg-white' : 'bg-green-500'
                                                    }`}
                                            />
                                        )}
                                    </div>
                                    <p
                                        className={`text-xs ${selectedForm?.id === form.id ? 'text-white/80' : 'text-gray-400'
                                            }`}
                                    >
                                        {getFormTypeLabel(form.type)} • {form.fields.length} campos
                                    </p>
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200/20">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleActive(form.id, form.active);
                                            }}
                                            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${form.active
                                                    ? selectedForm?.id === form.id
                                                        ? 'bg-white/20 text-white hover:bg-white/30'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    : selectedForm?.id === form.id
                                                        ? 'bg-white/20 text-white hover:bg-white/30'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                        >
                                            {form.active ? 'Ativo' : 'Inativo'}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteForm(form.id, form.title);
                                            }}
                                            className={`px-3 py-1.5 rounded text-xs transition-colors ${selectedForm?.id === form.id
                                                    ? 'bg-white/20 text-white hover:bg-red-500'
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Form Editor */}
                    <div className="lg:col-span-2">
                        {selectedForm ? (
                            <SettingsCard title={`Editando: ${selectedForm.title}`}>
                                <div className="space-y-4">
                                    {/* Form Title and Type */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">
                                                Título do Formulário
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedForm.title}
                                                onChange={(e) =>
                                                    onUpdateForm(selectedForm.id, { title: e.target.value })
                                                }
                                                className="w-full p-3 border border-gray-300 rounded-lg font-bold text-gray-900 outline-none focus:border-purple-600"
                                                placeholder="Título do Formulário"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Tipo</label>
                                            <select
                                                value={selectedForm.type}
                                                onChange={(e) =>
                                                    onUpdateForm(selectedForm.id, {
                                                        type: e.target.value as FormTemplate['type']
                                                    })
                                                }
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none bg-white focus:border-purple-600"
                                            >
                                                <option value="anamnesis">Anamnese</option>
                                                <option value="consent">Termo de Consentimento</option>
                                                <option value="evolution">Evolução</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Fields List */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-gray-700">
                                                Campos ({selectedForm.fields.length})
                                            </label>
                                            <button className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded hover:bg-purple-100 font-medium">
                                                + Adicionar Campo
                                            </button>
                                        </div>

                                        {selectedForm.fields.length === 0 ? (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                <p className="text-sm text-gray-500">Nenhum campo adicionado</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Clique em "Adicionar Campo" para começar
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                                {selectedForm.fields.map((field, index) => (
                                                    <div
                                                        key={field.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm text-gray-900">
                                                                {field.label}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {field.type}
                                                                {field.required && ' • Obrigatório'}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between pt-4 border-t border-gray-200">
                                        {onDuplicateForm && (
                                            <button
                                                onClick={() => onDuplicateForm(selectedForm.id)}
                                                className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-2"
                                            >
                                                <Copy size={16} />
                                                Duplicar Formulário
                                            </button>
                                        )}
                                        <SaveButton
                                            onClick={() => {
                                                // Save is automatic through onUpdateForm
                                            }}
                                            disabled={true}
                                        >
                                            Salvo Automaticamente
                                        </SaveButton>
                                    </div>
                                </div>
                            </SettingsCard>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <div className="text-center">
                                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                                    <h4 className="text-lg font-bold text-gray-600 mb-2">
                                        Nenhum formulário selecionado
                                    </h4>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Selecione um formulário da lista ou crie um novo
                                    </p>
                                    <button
                                        onClick={onCreateForm}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700"
                                    >
                                        Criar Formulário
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SettingsSection>
    );
};

export default FormBuilder;
