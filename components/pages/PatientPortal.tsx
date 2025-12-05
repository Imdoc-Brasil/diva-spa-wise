import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, Download, Calendar, MapPin, Users, MessageSquare, CreditCard } from 'lucide-react';
import SignaturePad from '../ui/SignaturePad';
import { ClientDocument, DocumentSignature, ClinicEvent } from '../../types';
import { useData } from '../context/DataContext';
import { TokenService, SignatureService, PDFService } from '../../services/documentServices';

interface PatientPortalProps {
    token: string; // Token de acesso único
}

const PatientPortal: React.FC<PatientPortalProps> = ({ token }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [clientId, setClientId] = useState('');
    const [clientName, setClientName] = useState('');
    const [documents, setDocuments] = useState<ClientDocument[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<ClientDocument | null>(null);
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [activeTab, setActiveTab] = useState<'documents' | 'events'>('documents');

    const { events, guests, addGuest, updateGuest } = useData();
    // Derived state for registrations will be calculated from guests and clientId

    useEffect(() => {
        // Validar token e carregar dados
        const loadData = () => {
            try {
                // Validar token
                const tokenData = TokenService.validateToken(token);

                if (!tokenData) {
                    setError('Link inválido ou expirado. Por favor, solicite um novo link.');
                    setLoading(false);
                    return;
                }

                // Simular busca de cliente (em produção viria do backend)
                // Por enquanto, usar dados mockados
                setClientId(tokenData.clientId);
                setClientName('Maria Silva'); // Viria do backend

                // Carregar documentos vinculados ao token
                const mockDocs: ClientDocument[] = [
                    {
                        id: 'd1',
                        title: 'Termo de Consentimento - Laser',
                        type: 'consent_term',
                        content: `
                            <h2>Termo de Consentimento para Tratamento com Laser</h2>
                            <p>Eu, <strong>{{clientName}}</strong>, declaro estar ciente e de acordo com o procedimento de laser que será realizado.</p>
                            <h3>Riscos e Benefícios</h3>
                            <ul>
                                <li>Possível vermelhidão temporária</li>
                                <li>Sensibilidade aumentada na área tratada</li>
                                <li>Resultados visíveis após 3-5 sessões</li>
                            </ul>
                            <p>Declaro ter sido informado(a) sobre todos os procedimentos, riscos e cuidados necessários.</p>
                        `,
                        signedAt: '',
                        status: 'pending',
                        url: '#',
                        requiresSignature: true,
                        createdAt: new Date().toISOString(),
                        clientId: tokenData.clientId,
                    },
                    {
                        id: 'd2',
                        title: 'Direito de Uso de Imagem',
                        type: 'image_rights',
                        content: `
                            <h2>Autorização de Uso de Imagem</h2>
                            <p>Eu, <strong>{{clientName}}</strong>, autorizo o uso de minhas imagens (fotos antes/depois) para fins de divulgação científica e marketing da clínica.</p>
                            <p>As imagens poderão ser utilizadas em:</p>
                            <ul>
                                <li>Redes sociais</li>
                                <li>Site institucional</li>
                                <li>Material impresso</li>
                            </ul>
                        `,
                        signedAt: '',
                        status: 'pending',
                        url: '#',
                        requiresSignature: true,
                        createdAt: new Date().toISOString(),
                        clientId: tokenData.clientId,
                    },
                ];

                // Verificar se já existem assinaturas
                const updatedDocs = mockDocs.map(doc => {
                    const existingSignature = SignatureService.getSignatureByDocumentId(doc.id);
                    if (existingSignature) {
                        return {
                            ...doc,
                            status: 'signed' as const,
                            signedAt: existingSignature.signedAt,
                            signatureId: existingSignature.id,
                        };
                    }
                    return doc;
                });

                setDocuments(updatedDocs);
                setLoading(false);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Erro ao carregar documentos. Tente novamente.');
                setLoading(false);
            }
        };

        loadData();
    }, [token]);

    const handleSignDocument = (doc: ClientDocument) => {
        setSelectedDocument(doc);
        setShowSignaturePad(true);
    };

    const handleSaveSignature = async (signatureData: string) => {
        if (!selectedDocument) return;

        try {
            // Criar assinatura
            const signature: DocumentSignature = {
                id: SignatureService.generateSignatureId(),
                documentId: selectedDocument.id,
                clientId: clientId,
                signatureData,
                signedAt: new Date().toISOString(),
                ipAddress: window.location.hostname,
                userAgent: navigator.userAgent,
            };

            // Salvar assinatura
            SignatureService.saveSignature(signature);

            // Atualizar documento
            setDocuments(prev =>
                prev.map(d =>
                    d.id === selectedDocument.id
                        ? {
                            ...d,
                            status: 'signed' as const,
                            signedAt: new Date().toISOString(),
                            signatureId: signature.id,
                        }
                        : d
                )
            );

            setShowSignaturePad(false);
            setSelectedDocument(null);

            // Gerar PDF automaticamente
            const pdfBlob = await PDFService.generateSignedPDF(
                selectedDocument,
                signature,
                clientName
            );

            // Auto-download do PDF
            const filename = `${selectedDocument.title.replace(/\s+/g, '_')}_Assinado.pdf`;
            PDFService.downloadPDF(pdfBlob, filename);

            alert('Documento assinado com sucesso!');
        } catch (error) {
            console.error('Error saving signature:', error);
            alert('Erro ao salvar assinatura. Tente novamente.');
        }
    };

    const handleDownloadPDF = async (doc: ClientDocument) => {
        try {
            const signature = SignatureService.getSignatureByDocumentId(doc.id);
            if (!signature) {
                alert('Assinatura não encontrada.');
                return;
            }

            const pdfBlob = await PDFService.generateSignedPDF(doc, signature, clientName);
            const filename = `${doc.title.replace(/\s+/g, '_')}_Assinado.pdf`;
            PDFService.downloadPDF(pdfBlob, filename);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Erro ao gerar PDF. Tente novamente.');
        }
    };

    const handleRegisterEvent = (eventId: string) => {
        if (confirm('Deseja confirmar sua inscrição neste evento?')) {
            const newGuest: any = {
                id: `g_${Date.now()}`,
                eventId,
                clientName: clientName,
                phone: '', // Should come from client profile if available
                status: 'confirmed',
                vip: false,
                paymentStatus: 'pending',
                ticketType: 'standard'
            };
            addGuest(newGuest);
            alert('Inscrição realizada com sucesso!');
        }
    };

    const handleCancelRegistration = (eventId: string) => {
        if (confirm('Tem certeza que deseja cancelar sua inscrição?')) {
            const guestRecord = guests.find(g => g.eventId === eventId && g.clientName === clientName);
            if (guestRecord) {
                updateGuest(guestRecord.id, { status: 'no_show' });
                alert('Inscrição cancelada.');
            }
        }
    };

    const handlePayRegistration = (eventId: string, price: number) => {
        if (confirm(`Deseja realizar o pagamento de R$ ${price.toFixed(2)}?`)) {
            // Simulate payment processing
            setTimeout(() => {
                const guestRecord = guests.find(g => g.eventId === eventId && g.clientName === clientName);
                if (guestRecord) {
                    updateGuest(guestRecord.id, { paymentStatus: 'paid' });
                    alert('Pagamento realizado com sucesso!');
                }
            }, 1000);
        }
    };

    const renderDocumentContent = (content: string) => {
        // Substituir variáveis
        return content.replace(/{{clientName}}/g, clientName);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-diva-primary/10 to-diva-light/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-diva-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando documentos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Erro ao Carregar</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-diva-primary/10 to-diva-light/20 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h1 className="text-3xl font-bold text-diva-dark mb-2">Portal do Paciente</h1>
                    <p className="text-gray-600">Olá, <strong>{clientName}</strong>! Bem-vindo ao seu espaço exclusivo.</p>

                    <div className="flex gap-6 mt-8 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'documents' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Documentos
                            {activeTab === 'documents' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-diva-primary rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'events' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Eventos & Workshops
                            {activeTab === 'events' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-diva-primary rounded-t-full"></div>}
                        </button>
                    </div>
                </div>

                {activeTab === 'documents' ? (
                    <>
                        {/* Documents List */}
                        <div className="space-y-4">
                            {documents.map(doc => (
                                <div
                                    key={doc.id}
                                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.status === 'signed'
                                                    ? 'bg-green-100'
                                                    : 'bg-orange-100'
                                                    }`}
                                            >
                                                {doc.status === 'signed' ? (
                                                    <CheckCircle className="text-green-600" size={24} />
                                                ) : (
                                                    <Clock className="text-orange-600" size={24} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                    {doc.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span
                                                        className={`px-2 py-1 rounded font-bold ${doc.status === 'signed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                            }`}
                                                    >
                                                        {doc.status === 'signed' ? 'Assinado' : 'Pendente'}
                                                    </span>
                                                    {doc.signedAt && (
                                                        <span className="text-gray-500">
                                                            em {new Date(doc.signedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Document Preview */}
                                                {selectedDocument?.id === doc.id && (
                                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                        <div
                                                            className="prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{
                                                                __html: renderDocumentContent(doc.content || ''),
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {doc.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            setSelectedDocument(
                                                                selectedDocument?.id === doc.id ? null : doc
                                                            )
                                                        }
                                                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        {selectedDocument?.id === doc.id ? 'Ocultar' : 'Visualizar'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleSignDocument(doc)}
                                                        className="px-4 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors flex items-center gap-2"
                                                    >
                                                        <FileText size={16} />
                                                        Assinar
                                                    </button>
                                                </>
                                            )}
                                            {doc.status === 'signed' && (
                                                <button
                                                    onClick={() => handleDownloadPDF(doc)}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                >
                                                    <Download size={16} />
                                                    Baixar PDF
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-3xl font-bold text-green-600">
                                        {documents.filter(d => d.status === 'signed').length}
                                    </p>
                                    <p className="text-sm text-gray-600">Documentos Assinados</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {documents.filter(d => d.status === 'pending').length}
                                    </p>
                                    <p className="text-sm text-gray-600">Pendentes</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        {events.map(evt => {
                            // Check if registered
                            const isRegistered = guests.some(g => g.eventId === evt.id && g.clientName === clientName && g.status !== 'no_show'); // Using clientName for matching

                            return (
                                <div key={evt.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                                    <div className="h-48 relative">
                                        <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="text-2xl font-bold mb-1">{evt.title}</h3>
                                            <div className="flex items-center text-sm opacity-90">
                                                <Calendar size={14} className="mr-1" /> {new Date(evt.date).toLocaleDateString()}
                                                <span className="mx-2">•</span>
                                                <Clock size={14} className="mr-1" /> {evt.time}
                                            </div>
                                        </div>
                                        {isRegistered && (
                                            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                                                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                                    <CheckCircle size={12} /> Inscrito
                                                </div>
                                                {guests.find(g => g.eventId === evt.id && g.clientName === clientName)?.paymentStatus === 'paid' ? (
                                                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                                        <CheckCircle size={12} /> Pago
                                                    </div>
                                                ) : evt.price > 0 ? (
                                                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                                        <Clock size={12} /> Pagamento Pendente
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-600 mb-6 leading-relaxed">{evt.description}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={16} className="text-diva-primary" />
                                                <span>{evt.location || 'Local a definir'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users size={16} className="text-diva-primary" />
                                                <span>{evt.capacity} Vagas</span>
                                            </div>
                                        </div>

                                        {isRegistered && evt.feed && evt.feed.length > 0 && (
                                            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <h4 className="font-bold text-sm text-diva-dark mb-3 flex items-center gap-2">
                                                    <MessageSquare size={16} /> Feed do Evento
                                                </h4>
                                                <div className="space-y-3">
                                                    {evt.feed.map(post => (
                                                        <div key={post.id} className="bg-white p-3 rounded-lg shadow-sm text-sm">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="font-bold text-diva-primary">{post.authorName}</span>
                                                                <span className="text-[10px] text-gray-400">{new Date(post.timestamp).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-gray-700">{post.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold">Valor</p>
                                                <p className="text-xl font-bold text-diva-dark">
                                                    {evt.price ? `R$ ${evt.price}` : 'Gratuito'}
                                                </p>
                                            </div>
                                            {isRegistered ? (
                                                <div className="flex gap-2">
                                                    {isRegistered && evt.price > 0 && guests.find(g => g.eventId === evt.id && g.clientName === clientName)?.paymentStatus !== 'paid' && (
                                                        <button
                                                            onClick={() => handlePayRegistration(evt.id, evt.price || 0)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                                                        >
                                                            <CreditCard size={16} /> Pagar Agora
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleCancelRegistration(evt.id)}
                                                        className="px-4 py-2 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleRegisterEvent(evt.id)}
                                                    className="px-6 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors shadow-md hover:shadow-lg"
                                                >
                                                    Inscrever-se
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Signature Pad Modal */}
                <SignaturePad
                    isOpen={showSignaturePad}
                    onSave={handleSaveSignature}
                    onCancel={() => {
                        setShowSignaturePad(false);
                        setSelectedDocument(null);
                    }}
                />
            </div>
        </div>
    );
};

export default PatientPortal;
