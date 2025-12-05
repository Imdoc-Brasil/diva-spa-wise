import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageCircle } from 'lucide-react';
import { Client, ClientDocument } from '../../types';
import { TokenService } from '../../services/documentServices';

interface SendDocumentWhatsAppModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client;
    documents: ClientDocument[];
}

const SendDocumentWhatsAppModal: React.FC<SendDocumentWhatsAppModalProps> = ({
    isOpen,
    onClose,
    client,
    documents,
}) => {
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [generatedToken, setGeneratedToken] = useState<string>('');

    if (!isOpen) return null;

    // Gerar token real usando TokenService
    const getOrGenerateToken = () => {
        if (!generatedToken && selectedDocs.length > 0) {
            const accessToken = TokenService.generateToken(client.clientId, selectedDocs);
            setGeneratedToken(accessToken.token);
            return accessToken.token;
        }
        return generatedToken;
    };

    const token = getOrGenerateToken();
    const portalLink = token ? `${window.location.origin}/paciente/${token}` : '';

    const pendingDocs = documents.filter(d => d.status === 'pending');

    const generateWhatsAppMessage = () => {
        const docList = selectedDocs
            .map(id => {
                const doc = documents.find(d => d.id === id);
                return `• ${doc?.title}`;
            })
            .join('\n');

        return `Olá ${client.name}! 👋

Você tem ${selectedDocs.length} documento(s) pendente(s) de assinatura:

${docList}

Para visualizar e assinar digitalmente, acesse o link abaixo:
${portalLink}

Este link é pessoal e expira em 7 dias.

Qualquer dúvida, estamos à disposição! 😊

*Diva Spa - Sua beleza, nossa paixão* ✨`;
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(portalLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendWhatsApp = () => {
        const message = encodeURIComponent(generateWhatsAppMessage());
        const phone = client.phone.replace(/\D/g, ''); // Remove formatação
        const whatsappUrl = `https://wa.me/55${phone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const toggleDocument = (docId: string) => {
        setSelectedDocs(prev => {
            const newSelection = prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId];
            // Reset token quando seleção muda
            if (newSelection.length !== prev.length) {
                setGeneratedToken('');
            }
            return newSelection;
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <MessageCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-diva-dark">Enviar por WhatsApp</h2>
                            <p className="text-sm text-gray-500">{client.name}</p>
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
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Document Selection */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3">
                            Selecione os documentos para enviar:
                        </h3>
                        <div className="space-y-2">
                            {pendingDocs.map(doc => (
                                <label
                                    key={doc.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedDocs.includes(doc.id)}
                                        onChange={() => toggleDocument(doc.id)}
                                        className="w-5 h-5 text-diva-primary rounded focus:ring-diva-primary"
                                    />
                                    <span className="text-gray-900 font-medium">{doc.title}</span>
                                </label>
                            ))}
                        </div>
                        {pendingDocs.length === 0 && (
                            <p className="text-gray-500 italic text-sm">
                                Nenhum documento pendente para este cliente.
                            </p>
                        )}
                    </div>

                    {/* Link Preview */}
                    {selectedDocs.length > 0 && (
                        <>
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-2">Link do Portal:</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={portalLink}
                                        readOnly
                                        className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={16} className="text-green-600" />
                                                <span className="text-green-600 font-medium">Copiado!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} />
                                                <span>Copiar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    ⏰ Este link expira em 7 dias
                                </p>
                            </div>

                            {/* Message Preview */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-2">
                                    Prévia da Mensagem:
                                </h3>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                                        {generateWhatsAppMessage()}
                                    </pre>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-500">
                        {selectedDocs.length} documento(s) selecionado(s)
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSendWhatsApp}
                            disabled={selectedDocs.length === 0}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send size={16} />
                            Enviar WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendDocumentWhatsAppModal;
