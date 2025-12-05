import React, { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { FormTemplate, FormResponse, FieldResponse, FieldType } from '../../types';

interface FillFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    formTemplate: FormTemplate;
    clientId: string;
    clientName: string;
    appointmentId?: string;
    onSubmit: (response: FormResponse) => void;
}

const FillFormModal: React.FC<FillFormModalProps> = ({
    isOpen,
    onClose,
    formTemplate,
    clientId,
    clientName,
    appointmentId,
    onSubmit
}) => {
    const [responses, setResponses] = useState<Record<string, string | boolean | string[]>>({});
    const [signature, setSignature] = useState<string>('');

    if (!isOpen) return null;

    const handleFieldChange = (fieldId: string, value: string | boolean | string[]) => {
        setResponses(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = () => {
        // Validação de campos obrigatórios
        const missingRequired = formTemplate.fields.filter(field =>
            field.required &&
            field.type !== 'section_header' &&
            !responses[field.id]
        );

        if (missingRequired.length > 0) {
            alert(`Por favor, preencha todos os campos obrigatórios: ${missingRequired.map(f => f.label).join(', ')}`);
            return;
        }

        const fieldResponses: FieldResponse[] = formTemplate.fields
            .filter(f => f.type !== 'section_header')
            .map(field => ({
                fieldId: field.id,
                fieldLabel: field.label,
                fieldType: field.type,
                value: responses[field.id] || ''
            }));

        const formResponse: FormResponse = {
            id: `response_${Date.now()}`,
            formTemplateId: formTemplate.id,
            formTitle: formTemplate.title,
            appointmentId,
            clientId,
            clientName,
            filledBy: 'current_user', // TODO: pegar do contexto de autenticação
            filledAt: new Date().toISOString(),
            responses: fieldResponses,
            signature: signature || undefined
        };

        onSubmit(formResponse);
        onClose();
    };

    const renderField = (field: any) => {
        switch (field.type) {
            case 'section_header':
                return (
                    <div key={field.id} className="col-span-2 mt-4 mb-2">
                        <h4 className="text-lg font-bold text-diva-dark border-b-2 border-diva-primary pb-2">
                            {field.label}
                        </h4>
                    </div>
                );

            case 'text':
            case 'number':
            case 'date':
                return (
                    <div key={field.id} className={field.width === 'full' ? 'col-span-2' : 'col-span-1'}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type={field.type}
                            value={(responses[field.id] as string) || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-diva-primary"
                        />
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.id} className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            value={(responses[field.id] as string) || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-diva-primary resize-none"
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={field.id} className={field.width === 'full' ? 'col-span-2' : 'col-span-1'}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <select
                            value={(responses[field.id] as string) || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-diva-primary bg-white"
                        >
                            <option value="">Selecione...</option>
                            {field.options?.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={field.id} className={field.width === 'full' ? 'col-span-2' : 'col-span-1'}>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={(responses[field.id] as boolean) || false}
                                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                                className="w-4 h-4 text-diva-primary border-gray-300 rounded focus:ring-diva-primary"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </span>
                        </label>
                    </div>
                );

            case 'signature':
                return (
                    <div key={field.id} className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                            <p className="text-sm text-gray-500 text-center">
                                Assinatura digital será implementada em breve
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-200">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-diva-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="text-diva-primary" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-diva-dark">{formTemplate.title}</h2>
                            <p className="text-sm text-gray-500">
                                Cliente: <span className="font-medium text-gray-700">{clientName}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Fields */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {formTemplate.fields.map(field => renderField(field))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors flex items-center"
                    >
                        <Save size={18} className="mr-2" />
                        Salvar Formulário
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FillFormModal;
