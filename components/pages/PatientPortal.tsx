import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, Download, Calendar, MapPin, Users, MessageSquare, CreditCard, Bell, Megaphone, Star, Crown, Gift, History, Smartphone, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import SignaturePad from '../ui/SignaturePad';
import { ClientDocument, DocumentSignature, ClinicEvent, AppointmentStatus, ServiceAppointment } from '../../types';
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
    const [activeTab, setActiveTab] = useState<'documents' | 'events' | 'notifications' | 'loyalty' | 'scheduling'>('scheduling');
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallApp = () => {
        if (installPrompt) {
            installPrompt.prompt();
            installPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                setInstallPrompt(null);
            });
        } else {
            alert('Para instalar: Toque no botão de compartilhamento do seu navegador e selecione "Adicionar à Tela de Início".');
        }
    };

    const { events, guests, addGuest, updateGuest, appointments, services, staff, addAppointment } = useData();

    // Booking State
    const [showBooking, setShowBooking] = useState(false);
    const [bookingStep, setBookingStep] = useState(1);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    // Derived state for registrations will be calculated from guests and clientId

    useEffect(() => {
        // Validar token e carregar dados
        const loadData = () => {
            try {
                // Validar token
                let tokenData = TokenService.validateToken(token);

                // MOCK PARA DEMONSTRAÇÃO
                if (token === 'demo' || token === 'demo-token') {
                    tokenData = {
                        id: 'demo-token-id',
                        clientId: 'c1',
                        token: token,
                        expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24h
                        createdAt: new Date().toISOString(),
                        purpose: 'document_signature',
                        documentIds: [],
                    };
                }

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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-diva-dark mb-2">Portal do Paciente</h1>
                            <p className="text-gray-600">Olá, <strong>{clientName}</strong>! Bem-vindo ao seu espaço exclusivo.</p>
                            <button onClick={handleInstallApp} className="mt-3 text-xs bg-diva-primary/10 text-diva-primary px-3 py-1.5 rounded-full font-bold flex items-center gap-2 hover:bg-diva-primary/20 transition-colors">
                                <Smartphone size={14} /> Instalar Aplicativo
                            </button>
                        </div>
                        <div onClick={() => setActiveTab('loyalty')} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3 transform hover:scale-105 transition-transform cursor-pointer active:scale-95">
                            <div className="p-2 bg-white/20 rounded-full">
                                <Crown size={24} className="fill-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">Meus Pontos Diva</p>
                                <p className="text-2xl font-black leading-none">1.250</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 mt-8 border-b border-gray-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('scheduling')}
                            className={`pb-4 px-2 font-bold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'scheduling' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Agendamentos
                            {activeTab === 'scheduling' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-diva-primary rounded-t-full"></div>}
                        </button>
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
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`pb-4 px-2 font-bold text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'notifications' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Bell size={16} />
                            Notificações
                            {activeTab === 'notifications' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-diva-primary rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('loyalty')}
                            className={`pb-4 px-2 font-bold text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'loyalty' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Gift size={16} />
                            Fidelidade
                            {activeTab === 'loyalty' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-diva-primary rounded-t-full"></div>}
                        </button>
                    </div>
                </div>

                {activeTab === 'scheduling' && (
                    <div className="space-y-6">
                        {!showBooking ? (
                            <>
                                {/* Upcoming Appointments */}
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg text-diva-dark">Próximas Consultas</h3>
                                    <button
                                        onClick={() => setShowBooking(true)}
                                        className="bg-diva-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-diva-dark transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Nova Consulta
                                    </button>
                                </div>

                                {appointments.filter(a => a.clientName === clientName && a.status !== AppointmentStatus.CANCELLED).length > 0 ? (
                                    <div className="space-y-4">
                                        {appointments
                                            .filter(a => a.clientName === clientName && a.status !== AppointmentStatus.CANCELLED)
                                            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                            .map(apt => (
                                                <div key={apt.appointmentId} className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                                                            <Calendar size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{apt.serviceName || apt.serviceId}</h4>
                                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                                <Clock size={12} /> {new Date(apt.startTime).toLocaleDateString()} às {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            <p className="text-xs text-purple-600 font-medium mt-1">
                                                                Profissional: {staff.find(s => s.id === apt.staffId)?.name || apt.staffName || 'Dra. Julia'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${apt.status === AppointmentStatus.CONFIRMED ? 'bg-green-100 text-green-700' :
                                                                apt.status === AppointmentStatus.COMPLETED ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {apt.status === AppointmentStatus.CONFIRMED ? 'Confirmado' : apt.status === AppointmentStatus.COMPLETED ? 'Concluído' : 'Pendente'}
                                                        </span>
                                                        <br />
                                                        <button className="text-xs text-red-400 hover:text-red-600 font-bold underline">Cancelar</button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="font-bold text-gray-900">Nenhuma consulta agendada</h3>
                                        <p className="text-gray-500 text-sm mb-6">Que tal marcar um momento para você?</p>
                                        <button
                                            onClick={() => setShowBooking(true)}
                                            className="bg-diva-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-diva-dark transition-colors"
                                        >
                                            Agendar Agora
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* BOOKING WIZARD */
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => {
                                            if (bookingStep > 1) setBookingStep(bookingStep - 1);
                                            else setShowBooking(false);
                                        }} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <h3 className="font-bold text-gray-900">
                                            {bookingStep === 1 ? 'Escolha o Serviço' :
                                                bookingStep === 2 ? 'Escolha o Profissional' :
                                                    bookingStep === 3 ? 'Escolha a Data' : 'Confirmação'}
                                        </h3>
                                    </div>
                                    <div className="text-sm font-bold text-diva-primary">Passo {bookingStep}/4</div>
                                </div>

                                <div className="p-6">
                                    {/* STEP 1: SERVICES */}
                                    {bookingStep === 1 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {services.filter(s => s.active).map(service => (
                                                <div
                                                    key={service.id}
                                                    onClick={() => {
                                                        setSelectedService(service.id);
                                                        setBookingStep(2);
                                                    }}
                                                    className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-diva-primary hover:bg-purple-50 transition-all flex justify-between items-center group"
                                                >
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{service.name}</h4>
                                                        <p className="text-sm text-gray-500">{service.duration} min • R$ {service.price.toFixed(2)}</p>
                                                    </div>
                                                    <ChevronRight className="text-gray-300 group-hover:text-diva-primary" size={20} />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* STEP 2: PROFESSIONAL */}
                                    {bookingStep === 2 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div
                                                onClick={() => {
                                                    setSelectedProfessional('any');
                                                    setBookingStep(3);
                                                }}
                                                className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-diva-primary hover:bg-purple-50 transition-all flex items-center gap-4"
                                            >
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                    <Users size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800">Qualquer Profissional</h4>
                                                    <p className="text-sm text-gray-500">Encontrar horário mais próximo</p>
                                                </div>
                                            </div>
                                            {staff.map(member => (
                                                <div
                                                    key={member.id}
                                                    onClick={() => {
                                                        setSelectedProfessional(member.id);
                                                        setBookingStep(3);
                                                    }}
                                                    className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-diva-primary hover:bg-purple-50 transition-all flex items-center gap-4"
                                                >
                                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{member.name}</h4>
                                                        <p className="text-sm text-gray-500">{member.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* STEP 3: DATE & TIME (Simplificado) */}
                                    {bookingStep === 3 && (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Selecione o Dia</label>
                                                <input
                                                    type="date"
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-diva-primary"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>

                                            {selectedDate && (
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Horários Disponíveis</label>
                                                    <div className="grid grid-cols-4 gap-3">
                                                        {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                                                            <button
                                                                key={time}
                                                                onClick={() => setSelectedTime(time)}
                                                                className={`py-2 rounded-lg text-sm font-bold transition-colors ${selectedTime === time ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    onClick={() => setBookingStep(4)}
                                                    disabled={!selectedDate || !selectedTime}
                                                    className="bg-diva-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-diva-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Continuar
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 4: CONFIRMATION */}
                                    {bookingStep === 4 && (
                                        <div className="text-center py-6">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle size={32} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirmar Agendamento?</h3>
                                            <p className="text-gray-500 mb-8">
                                                Serviço: <strong>{services.find(s => s.id === selectedService)?.name}</strong><br />
                                                Data: <strong>{new Date(selectedDate).toLocaleDateString()} às {selectedTime}</strong><br />
                                                Profissional: <strong>{selectedProfessional === 'any' ? 'Qualquer um disponível' : staff.find(s => s.id === selectedProfessional)?.name}</strong>
                                            </p>

                                            <button
                                                onClick={() => {
                                                    // Create appointment logic here
                                                    const selectedServiceObj = services.find(s => s.id === selectedService);
                                                    const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
                                                    const endDateTime = new Date(startDateTime.getTime() + (selectedServiceObj?.duration || 60) * 60000);

                                                    const newAppt: ServiceAppointment = {
                                                        appointmentId: `apt_${Date.now()}`,
                                                        organizationId: 'org_demo',
                                                        clientId: clientId,
                                                        clientName: clientName,
                                                        serviceId: selectedService || '',
                                                        serviceName: selectedServiceObj?.name || '',
                                                        staffId: selectedProfessional === 'any' ? staff[0].id : selectedProfessional || '',
                                                        staffName: staff.find(s => s.id === (selectedProfessional === 'any' ? staff[0].id : selectedProfessional))?.name || '',
                                                        roomId: 'room1', // Default room
                                                        startTime: startDateTime.toISOString(),
                                                        endTime: endDateTime.toISOString(),
                                                        price: selectedServiceObj?.price || 0,
                                                        status: AppointmentStatus.CONFIRMED,
                                                        referralSource: 'app_paciente'
                                                    };
                                                    addAppointment(newAppt);
                                                    alert('Agendamento realizado com sucesso!');
                                                    setShowBooking(false);
                                                    setBookingStep(1);
                                                    setSelectedDate('');
                                                    setSelectedTime('');
                                                }}
                                                className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl w-full md:w-auto"
                                            >
                                                Confirmar Agendamento
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex gap-4 hover:shadow-xl transition-shadow cursor-pointer relative group">
                            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                <Megaphone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Promoção Relâmpago!</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Somente hoje! <b>20% OFF</b> em Drenagem Linfática. Aproveite essa oportunidade para relaxar e cuidar de você.
                                </p>
                                <button className="mt-3 bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">Agendar Agora</button>
                                <span className="text-xs text-gray-400 block mt-2">Há 2 horas</span>
                            </div>
                            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex gap-4 hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Lembrete de Agendamento</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Sua sessão de Laser é <b>amanhã às 14:00</b>. Estamos ansiosos para te ver.
                                </p>
                                <div className="flex gap-2 mt-3">
                                    <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Confirmar</button>
                                    <button className="border border-gray-300 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Remarcar</button>
                                </div>
                                <span className="text-xs text-gray-400 block mt-2">Ontem</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex gap-4 hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Pesquisa de Satisfação</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Como foi seu atendimento com Dra. Julia? Sua opinião é muito importante para nós.
                                </p>
                                <div className="flex gap-1 mt-3">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-yellow-400 fill-current cursor-pointer hover:scale-110 transition-transform" />)}
                                </div>
                                <span className="text-xs text-gray-400 block mt-2">3 dias atrás</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex gap-4 opacity-75">
                            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                                <Megaphone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700">Bem-vindo(a) ao Diva Spa!</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Ficamos felizes em tê-lo(a) conosco. Confira nossos tratamentos e pacotes especiais.
                                </p>
                                <span className="text-xs text-gray-400 block mt-2">1 semana atrás</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'loyalty' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Status Card */}
                        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm font-medium opacity-90 mb-1">Seu Saldo Atual</p>
                                <h2 className="text-4xl font-black mb-4">1.250 <span className="text-xl font-normal opacity-80">pontos</span></h2>
                                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-white w-[60%]"></div>
                                </div>
                                <p className="text-xs">Faltam <strong>250 pontos</strong> para sua próxima recompensa!</p>
                            </div>
                            <Gift className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 rotate-12" />
                        </div>

                        {/* Rewards */}
                        <div>
                            <h3 className="text-lg font-bold text-diva-dark mb-4 flex items-center gap-2">
                                <Gift size={20} className="text-diva-primary" /> Recompensas Disponíveis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Massagem Relaxante (30min)', points: 1500, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400' },
                                    { title: 'Hidratação Facial Profunda', points: 2000, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400' },
                                    { title: 'Kit Skincare Premium', points: 3000, image: 'https://images.unsplash.com/photo-1556228720-1957be83f3e7?w=400' }
                                ].map((reward, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl shadow border border-gray-100 flex gap-4 items-center group cursor-pointer hover:border-yellow-400 transition-colors">
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                            <img src={reward.image} alt={reward.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-sm">{reward.title}</h4>
                                            <p className="text-yellow-600 font-bold text-xs mt-1">{reward.points} pontos</p>
                                        </div>
                                        <button className="bg-gray-100 text-gray-400 px-3 py-1.5 rounded-lg text-xs font-bold" disabled>Resgatar</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* History */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="font-bold text-diva-dark flex items-center gap-2">
                                    <History size={18} /> Histórico
                                </h3>
                                <button className="text-xs text-diva-primary font-bold hover:underline">Ver tudo</button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { date: '12/05/2025', desc: 'Procedimento: Laser Lavieen', value: '+250', type: 'earn' },
                                    { date: '12/05/2025', desc: 'Bônus de Avaliação', value: '+50', type: 'earn' },
                                    { date: '15/04/2025', desc: 'Resgate: Desconto 10%', value: '-500', type: 'burn' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{item.desc}</p>
                                            <p className="text-xs text-gray-500">{item.date}</p>
                                        </div>
                                        <span className={`font-bold ${item.type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
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
                )}

                {activeTab === 'events' && (
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
