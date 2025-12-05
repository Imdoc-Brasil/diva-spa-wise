import React from 'react';
import { FileText, Calendar, User, Eye } from 'lucide-react';
import { FormResponse } from '../../types';

interface ClientFormsViewerProps {
    clientId: string;
    clientName: string;
    formResponses: FormResponse[];
    onViewDetails?: (response: FormResponse) => void;
}

const ClientFormsViewer: React.FC<ClientFormsViewerProps> = ({
    clientId,
    clientName,
    formResponses,
    onViewDetails
}) => {
    const clientForms = formResponses.filter(r => r.clientId === clientId);

    if (clientForms.length === 0) {
        return (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhum formulário preenchido</p>
                <p className="text-sm text-gray-400 mt-1">
                    Os formulários clínicos preenchidos aparecerão aqui
                </p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getFormTypeLabel = (formTitle: string) => {
        if (formTitle.toLowerCase().includes('anamnese')) return { label: 'Anamnese', color: 'bg-blue-100 text-blue-700' };
        if (formTitle.toLowerCase().includes('termo') || formTitle.toLowerCase().includes('consent')) return { label: 'Termo', color: 'bg-purple-100 text-purple-700' };
        if (formTitle.toLowerCase().includes('evolução') || formTitle.toLowerCase().includes('evolution')) return { label: 'Evolução', color: 'bg-green-100 text-green-700' };
        return { label: 'Formulário', color: 'bg-gray-100 text-gray-700' };
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-diva-dark">
                    Formulários Clínicos
                </h3>
                <span className="text-sm text-gray-500">
                    {clientForms.length} {clientForms.length === 1 ? 'formulário' : 'formulários'}
                </span>
            </div>

            {clientForms.map(form => {
                const typeInfo = getFormTypeLabel(form.formTitle);
                return (
                    <div
                        key={form.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-diva-primary transition-all group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${typeInfo.color}`}>
                                        {typeInfo.label}
                                    </span>
                                    {form.signature && (
                                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-medium">
                                            ✓ Assinado
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-diva-dark mb-1">{form.formTitle}</h4>
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {formatDate(form.filledAt)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User size={12} />
                                        Preenchido por: {form.filledBy}
                                    </span>
                                    <span className="text-gray-400">
                                        {form.responses.length} {form.responses.length === 1 ? 'campo' : 'campos'}
                                    </span>
                                </div>
                            </div>
                            {onViewDetails && (
                                <button
                                    onClick={() => onViewDetails(form)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 px-3 py-1.5 bg-diva-primary/10 text-diva-primary rounded-lg text-sm font-medium hover:bg-diva-primary hover:text-white flex items-center gap-1"
                                >
                                    <Eye size={14} />
                                    Ver
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ClientFormsViewer;
