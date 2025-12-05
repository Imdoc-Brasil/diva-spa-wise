import React from 'react';
import { X, FileText, Calendar, User, Download, Printer, CheckCircle } from 'lucide-react';
import { FormResponse } from '../../types';

interface ViewFormResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    formResponse: FormResponse;
}

const ViewFormResponseModal: React.FC<ViewFormResponseModalProps> = ({
    isOpen,
    onClose,
    formResponse
}) => {
    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        // TODO: Implementar exportação para PDF
        alert('Exportação para PDF será implementada em breve');
    };

    const renderValue = (response: any) => {
        if (typeof response.value === 'boolean') {
            return response.value ? (
                <span className="inline-flex items-center text-green-600">
                    <CheckCircle size={16} className="mr-1" /> Sim
                </span>
            ) : (
                <span className="text-gray-400">Não</span>
            );
        }

        if (Array.isArray(response.value)) {
            return response.value.join(', ');
        }

        if (!response.value || response.value === '') {
            return <span className="text-gray-400 italic">Não preenchido</span>;
        }

        return response.value;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-200">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-diva-primary/10 rounded-xl flex items-center justify-center">
                            <FileText className="text-diva-primary" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-diva-dark">{formResponse.formTitle}</h2>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <User size={14} />
                                    {formResponse.clientName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {formatDate(formResponse.filledAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Metadata */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 font-medium">Preenchido por:</span>
                            <p className="text-gray-900 font-bold mt-1">{formResponse.filledBy}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 font-medium">Data e Hora:</span>
                            <p className="text-gray-900 font-bold mt-1">{formatDate(formResponse.filledAt)}</p>
                        </div>
                        {formResponse.appointmentId && (
                            <div>
                                <span className="text-gray-500 font-medium">Atendimento:</span>
                                <p className="text-gray-900 font-bold mt-1">#{formResponse.appointmentId}</p>
                            </div>
                        )}
                        {formResponse.signature && (
                            <div>
                                <span className="text-gray-500 font-medium">Assinatura:</span>
                                <p className="text-green-600 font-bold mt-1 flex items-center">
                                    <CheckCircle size={16} className="mr-1" /> Documento Assinado
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Responses */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-diva-dark mb-4">Respostas</h3>
                        {formResponse.responses.map((response, index) => (
                            <div
                                key={response.fieldId}
                                className="border-l-4 border-diva-primary/30 pl-4 py-2"
                            >
                                <label className="text-sm font-bold text-gray-700 block mb-1">
                                    {response.fieldLabel}
                                </label>
                                <div className="text-gray-900">
                                    {renderValue(response)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Signature Display */}
                    {formResponse.signature && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">Assinatura Digital</h3>
                            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                                <img
                                    src={formResponse.signature}
                                    alt="Assinatura"
                                    className="max-h-32 mx-auto"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-500">
                        ID: {formResponse.id}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                        >
                            <Printer size={16} className="mr-2" />
                            Imprimir
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors flex items-center"
                        >
                            <Download size={16} className="mr-2" />
                            Exportar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewFormResponseModal;
