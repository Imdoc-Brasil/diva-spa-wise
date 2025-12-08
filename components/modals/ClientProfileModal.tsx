
import React, { useState, useMemo } from 'react';
import { Client, ClientDocument, ClientPhoto, ClientWallet, Invoice, AppointmentRecord, AppointmentStatus } from '../../types';
import { X, Calendar, DollarSign, Image, FileText, Clock, Phone, Mail, MapPin, Tag, ChevronRight, Download, Eye, Upload, CheckCircle, AlertTriangle, ScanFace, Share2, Sparkles, Star, ArrowRightLeft, MessageCircle } from 'lucide-react';
import DocumentModal from './DocumentModal';
import SkinAnalysisModal from './SkinAnalysisModal';
import SocialMediaModal from './SocialMediaModal';
import ARMirrorModal from './ARMirrorModal';
import FillFormModal from './FillFormModal';
import ViewFormResponseModal from './ViewFormResponseModal';
import AppointmentRecordModal from './AppointmentRecordModal';
import SendDocumentWhatsAppModal from './SendDocumentWhatsAppModal';
import ClientFormsViewer from '../ui/ClientFormsViewer';
import SmartConsultationModal from './SmartConsultationModal';
import { useData } from '../context/DataContext';

interface ClientProfileModalProps {
    client: Client;
    isOpen: boolean;
    onClose: () => void;
}

// --- MOCK DATA FOR 360 VIEW ---
const mockWallet: ClientWallet = {
    balance: 150.00,
    activePackages: [
        { name: 'Depilação Laser - Axila (10 Sessões)', sessionsTotal: 10, sessionsUsed: 4, expiryDate: '2024-05-10' }
    ]
};

const initialDocs: ClientDocument[] = [
    { id: 'd1', title: 'Termo de Consentimento - Laser', type: 'consent_term', signedAt: '2023-01-15', status: 'signed', url: '#', requiresSignature: true },
    { id: 'd2', title: 'Direito de Uso de Imagem', type: 'image_rights', signedAt: '2023-01-15', status: 'signed', url: '#', requiresSignature: true },
    { id: 'd3', title: 'Ficha de Anamnese Atualizada', type: 'anamnesis', signedAt: '', status: 'pending', url: '#', requiresSignature: true },
];

const mockPhotos: ClientPhoto[] = [
    { id: 'ph1', date: '2023-01-15', type: 'before', area: 'Face', url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=200', notes: 'Início do tratamento' },
    { id: 'ph2', date: '2023-06-20', type: 'after', area: 'Face', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=200', notes: 'Após 5 sessões' },
];

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ client, isOpen, onClose }) => {
    const { appointments, transactions, units, updateClient, formTemplates, formResponses, addFormResponse, appointmentRecords, addAppointmentRecord, updateAppointmentRecord, getAppointmentRecord, products, updateProductStock, updateAppointmentStatus } = useData();
    const [activeTab, setActiveTab] = useState<'timeline' | 'gallery' | 'docs' | 'financial' | 'forms' | 'medical_record'>('timeline');
    const [docs, setDocs] = useState<ClientDocument[]>(initialDocs);
    const [photos, setPhotos] = useState<ClientPhoto[]>(mockPhotos);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [isSkinAnalysisOpen, setIsSkinAnalysisOpen] = useState(false);
    const [isSocialStudioOpen, setIsSocialStudioOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [targetUnitId, setTargetUnitId] = useState('');
    const [isFillFormModalOpen, setIsFillFormModalOpen] = useState(false);
    const [selectedFormTemplate, setSelectedFormTemplate] = useState<any>(null);
    const [selectedFormResponse, setSelectedFormResponse] = useState<any>(null);
    const [isViewFormModalOpen, setIsViewFormModalOpen] = useState(false);
    const [isAppointmentRecordModalOpen, setIsAppointmentRecordModalOpen] = useState(false);
    const [selectedAppointmentRecord, setSelectedAppointmentRecord] = useState<AppointmentRecord | null>(null);
    const [isSmartConsultationOpen, setIsSmartConsultationOpen] = useState(false);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhoto: ClientPhoto = {
                    id: `ph_${Date.now()}`,
                    date: new Date().toISOString(),
                    type: 'after', // Default to 'after' for new uploads
                    area: 'Nova Área',
                    url: reader.result as string,
                    notes: 'Foto adicionada recentemente'
                };
                setPhotos([newPhoto, ...photos]);
            };
            reader.readAsDataURL(file);
        }
    };
    const [isARMirrorOpen, setIsARMirrorOpen] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

    // --- BUILD REAL TIMELINE FROM APPOINTMENTS AND TRANSACTIONS ---
    const clientTimeline = useMemo(() => {
        const timeline: any[] = [];

        // Add client appointments
        const clientAppointments = appointments
            .filter(appt => appt.clientId === client.clientId)
            .map(appt => ({
                id: `appt_${appt.appointmentId}`,
                rawAppointmentId: appt.appointmentId,
                type: 'appointment',
                date: appt.startTime,
                title: appt.serviceName,
                status: appt.status,
                staff: appt.staffName,
                staffId: appt.staffId,
                sortDate: new Date(appt.startTime).getTime()
            }));

        // Add client transactions (purchases) - ONLY for this specific client
        const clientTransactions = transactions
            .filter(t => t.description.includes(client.name))
            .map(t => ({
                id: `trans_${t.id}`,
                type: t.type === 'income' ? 'purchase' : 'payment',
                date: t.date,
                title: t.description,
                value: t.amount,
                sortDate: new Date(t.date).getTime()
            }));

        // Combine and sort by date (most recent first)
        const combined = [...clientAppointments, ...clientTransactions]
            .sort((a, b) => b.sortDate - a.sortDate)
            .slice(0, 10); // Show last 10 activities

        return combined;
    }, [appointments, transactions, client.clientId, client.name]);

    // Calculate real LTV from transactions
    const realLTV = useMemo(() => {
        return transactions
            .filter(t => t.description.includes(client.name) && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions, client.name]);

    // Count total visits
    const totalVisits = useMemo(() => {
        return appointments.filter(appt =>
            appt.clientId === client.clientId &&
            appt.status === 'Completed'
        ).length;
    }, [appointments, client.clientId]);

    const handleOpenAppointmentRecord = (timelineItem: any) => {
        if (timelineItem.type !== 'appointment') return;

        const appointmentId = timelineItem.rawAppointmentId;

        // Tenta encontrar um registro existente
        let record = getAppointmentRecord(appointmentId);

        // Se não existir, cria um novo (em memória, para edição)
        if (!record) {
            record = {
                id: `record_${Date.now()}`,
                appointmentId: appointmentId,
                clientId: client.clientId,
                clientName: client.name,
                serviceId: 'serviceId' in timelineItem ? timelineItem.serviceId : 'unknown',
                serviceName: timelineItem.title,
                professionalId: timelineItem.staffId || 'unknown',
                professionalName: timelineItem.staff,
                date: timelineItem.date,
                duration: 60, // TODO: Calcular duração real
                status: timelineItem.status,
                createdAt: new Date().toISOString()
            };
        }

        setSelectedAppointmentRecord(record);
        setIsAppointmentRecordModalOpen(true);
    };

    const handleSaveAppointmentRecord = (updatedData: Partial<AppointmentRecord>) => {
        if (!selectedAppointmentRecord) return;

        // Stock Update Logic
        if (updatedData.productsUsed) {
            const oldProducts = selectedAppointmentRecord.productsUsed || [];
            const newProducts = updatedData.productsUsed;

            // 1. Check for modified or added products
            newProducts.forEach(newP => {
                const oldP = oldProducts.find(p => p.productId === newP.productId);
                const oldQty = oldP ? oldP.quantity : 0;
                const diff = newP.quantity - oldQty;

                if (diff > 0) {
                    // Consumed more -> Remove from stock
                    updateProductStock(newP.productId, diff, 'remove');
                } else if (diff < 0) {
                    // Consumed less -> Add back to stock
                    updateProductStock(newP.productId, Math.abs(diff), 'add');
                }
            });

            // 2. Check for removed products
            oldProducts.forEach(oldP => {
                const newP = newProducts.find(p => p.productId === oldP.productId);
                if (!newP) {
                    // Removed completely -> Add back to stock
                    updateProductStock(oldP.productId, oldP.quantity, 'add');
                }
            });
        }



        // Auto-complete appointment if not already completed
        if (selectedAppointmentRecord.status !== AppointmentStatus.COMPLETED) {
            updateAppointmentStatus(selectedAppointmentRecord.appointmentId, AppointmentStatus.COMPLETED);
            updatedData.status = AppointmentStatus.COMPLETED;
        }

        const updatedRecord = { ...selectedAppointmentRecord, ...updatedData };

        if (getAppointmentRecord(selectedAppointmentRecord.appointmentId)) {
            updateAppointmentRecord(selectedAppointmentRecord.id, updatedData);
        } else {
            addAppointmentRecord(updatedRecord);
        }

        setSelectedAppointmentRecord(updatedRecord);
    };

    if (!isOpen) return null;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const handleDocumentSigned = (newDoc: ClientDocument) => {
        setDocs([newDoc, ...docs]);
        alert("Documento assinado digitalmente e salvo com sucesso!");
    };

    const handleTransferClient = () => {
        if (!targetUnitId) return;
        updateClient(client.clientId, { unitId: targetUnitId });
        alert(`Cliente transferido com sucesso para ${units.find(u => u.id === targetUnitId)?.name}`);
        setIsTransferModalOpen(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-diva-dark/90 backdrop-blur-sm p-0 md:p-4">
            <div className="bg-white rounded-none md:rounded-2xl shadow-2xl w-full h-full md:h-[90vh] md:max-w-5xl flex flex-col md:flex-row overflow-hidden">

                {/* LEFT COLUMN: Static Profile Info - Hidden on mobile */}
                <div className="hidden lg:flex w-80 bg-gray-50 border-r border-diva-light/30 flex-col p-6 overflow-y-auto">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-diva-primary text-white flex items-center justify-center text-3xl font-serif font-bold shadow-md mb-3 border-4 border-white">
                            {client.name.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-diva-dark leading-tight">{client.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">Paciente desde 2022</p>
                        <p className="text-xs text-diva-primary font-bold mt-1">{totalVisits} visitas realizadas</p>
                        <div className="flex gap-2 mt-3 flex-wrap justify-center">
                            {client.behaviorTags.map(tag => (
                                <span key={tag} className="text-[10px] bg-diva-light/30 text-diva-dark px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                            <Phone size={14} className="mr-3 text-diva-primary" />
                            {client.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Mail size={14} className="mr-3 text-diva-primary" />
                            {client.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin size={14} className="mr-3 text-diva-primary" />
                            São Paulo, SP
                        </div>
                    </div>

                    <div className="border-t border-diva-light/20 pt-6 space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Métricas de Valor</h3>
                        <div className="bg-white p-3 rounded-lg border border-diva-light/30 shadow-sm">
                            <p className="text-xs text-gray-500 flex items-center">
                                <Star size={10} className="mr-1 text-yellow-500 fill-current" /> Diva Points
                            </p>
                            <p className="text-xl font-bold text-diva-dark mt-1">{client.loyaltyPoints || 0}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-diva-light/30 shadow-sm">
                            <p className="text-xs text-gray-500">LTV (Total Gasto)</p>
                            <p className="text-lg font-mono font-bold text-diva-dark">{formatCurrency(realLTV || client.lifetimeValue)}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-diva-light/30 shadow-sm">
                            <p className="text-xs text-gray-500">Score RFM</p>
                            <div className="flex items-center">
                                <div className="flex-1 bg-gray-200 h-2 rounded-full mr-2">
                                    <div className="bg-diva-accent h-2 rounded-full" style={{ width: `${client.rfmScore}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-diva-accent">{client.rfmScore}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 space-y-3">
                        <button
                            onClick={() => setIsTransferModalOpen(true)}
                            className="w-full py-2 border border-diva-primary text-diva-primary rounded-lg text-sm font-bold hover:bg-diva-primary/5 transition-colors flex items-center justify-center"
                        >
                            <ArrowRightLeft size={16} className="mr-2" /> Transferir Unidade
                        </button>
                        <button className="w-full py-2 border border-diva-alert text-diva-alert rounded-lg text-sm font-bold hover:bg-diva-alert/5 transition-colors">
                            Bloquear Paciente
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Dynamic Content */}
                <div className="flex-1 flex flex-col min-w-0 bg-white">
                    {/* Header / Tabs */}
                    <div className="h-auto md:h-16 border-b border-diva-light/20 flex flex-col md:flex-row items-stretch md:items-center justify-between px-3 md:px-6 bg-white sticky top-0 z-10 py-2 md:py-0">
                        {/* Mobile: Client Info Header */}
                        <div className="lg:hidden mb-2 md:mb-0 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-diva-primary text-white flex items-center justify-center text-sm font-bold">
                                {client.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-diva-dark truncate">{client.name}</h3>
                                <p className="text-xs text-gray-500">{totalVisits} visitas</p>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-diva-dark hover:bg-gray-100 rounded-full transition-colors shrink-0">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs - Scrollable on mobile */}
                        <div className="flex h-12 md:h-full overflow-x-auto scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={`px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${activeTab === 'timeline' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                <span className="hidden sm:inline">Linha do Tempo</span>
                                <span className="sm:hidden">Timeline</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('medical_record')}
                                className={`px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${activeTab === 'medical_record' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                Prontuário
                            </button>
                            <button
                                onClick={() => setActiveTab('gallery')}
                                className={`px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${activeTab === 'gallery' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                <span className="hidden sm:inline">Galeria & Análise IA</span>
                                <span className="sm:hidden">Galeria</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('docs')}
                                className={`px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${activeTab === 'docs' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                <span className="hidden sm:inline">Documentos & Consentimento</span>
                                <span className="sm:hidden">Docs</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('financial')}
                                className={`px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${activeTab === 'financial' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                <span className="hidden sm:inline">Carteira & Pacotes</span>
                                <span className="sm:hidden">Carteira</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('forms')}
                                className={`px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${activeTab === 'forms' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                <span className="hidden sm:inline">Formulários Clínicos</span>
                                <span className="sm:hidden">Formulários</span>
                            </button>
                            <button
                                onClick={() => setIsSmartConsultationOpen(true)}
                                className="ml-2 md:ml-4 px-3 md:px-4 py-1.5 bg-gradient-to-r from-diva-primary to-diva-accent text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 animate-pulse shrink-0"
                            >
                                <Sparkles size={14} />
                                <span className="hidden sm:inline">Consulta IA</span>
                                <span className="sm:hidden">IA</span>
                            </button>
                        </div>
                        <button onClick={onClose} className="hidden lg:block p-2 text-gray-400 hover:text-diva-dark hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-y-auto p-3 md:p-8 bg-gray-50/50">

                        {activeTab === 'timeline' && (
                            <div className="max-w-3xl mx-auto space-y-6">
                                {clientTimeline.length > 0 ? (
                                    clientTimeline.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className={`flex gap-4 group ${item.type === 'appointment' ? 'cursor-pointer' : ''}`}
                                            onClick={() => item.type === 'appointment' && handleOpenAppointmentRecord(item)}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10
                                            ${item.type === 'appointment' ? 'bg-diva-primary text-white' :
                                                        item.type === 'purchase' ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
                                                    {item.type === 'appointment' ? <Clock size={14} /> :
                                                        item.type === 'purchase' ? <DollarSign size={14} /> : <FileText size={14} />}
                                                </div>
                                                {idx !== clientTimeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>}
                                            </div>
                                            <div className={`flex-1 bg-white p-4 rounded-xl border border-diva-light/20 shadow-sm transition-all ${item.type === 'appointment' ? 'hover:shadow-md hover:border-diva-primary/50' : ''}`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-diva-dark flex items-center gap-2">
                                                        {item.title}
                                                        {item.type === 'appointment' && (
                                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 group-hover:bg-diva-primary group-hover:text-white transition-colors">
                                                                Ver Prontuário
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {item.type === 'appointment' && 'staff' in item && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Realizado por {item.staff}</span>}
                                                    {item.type === 'purchase' && 'value' in item && <span className="font-mono text-green-600 font-bold">{formatCurrency(item.value || 0)}</span>}
                                                    {item.type === 'note' && 'content' in item && <span className="italic">"{(item.content as string)}"</span>}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>Nenhuma atividade registrada ainda.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'medical_record' && (
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-diva-dark">Prontuário Eletrônico</h3>
                                    <button
                                        onClick={() => setIsSmartConsultationOpen(true)}
                                        className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark transition-colors"
                                    >
                                        <Sparkles size={16} className="mr-2" /> Nova Evolução (IA)
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {appointments
                                        .filter(appt => appt.clientId === client.clientId && appt.status === 'Completed')
                                        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                                        .map(appt => {
                                            const record = getAppointmentRecord(appt.appointmentId);
                                            return (
                                                <div key={appt.appointmentId} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                                                        onClick={() => handleOpenAppointmentRecord({
                                                            type: 'appointment',
                                                            rawAppointmentId: appt.appointmentId,
                                                            title: appt.serviceName,
                                                            staff: appt.staffName,
                                                            staffId: appt.staffId,
                                                            date: appt.startTime,
                                                            status: appt.status,
                                                            serviceId: appt.serviceId
                                                        })}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-diva-primary/10 rounded-full flex items-center justify-center text-diva-primary">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-diva-dark">{appt.serviceName}</h4>
                                                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                                                    <span>{new Date(appt.startTime).toLocaleDateString()}</span>
                                                                    <span>•</span>
                                                                    <span>{appt.staffName}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {record ? (
                                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded flex items-center">
                                                                    <CheckCircle size={12} className="mr-1" /> Registrado
                                                                </span>
                                                            ) : (
                                                                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded flex items-center">
                                                                    <AlertTriangle size={12} className="mr-1" /> Pendente
                                                                </span>
                                                            )}
                                                            <ChevronRight size={18} className="text-gray-400" />
                                                        </div>
                                                    </div>

                                                    {record && (
                                                        <div className="p-4 text-sm text-gray-600 space-y-2">
                                                            {record.clinicalNotes && (
                                                                <p className="line-clamp-2"><span className="font-bold">Notas:</span> {record.clinicalNotes}</p>
                                                            )}
                                                            {record.parameters && Object.keys(record.parameters).length > 0 && (
                                                                <div className="flex gap-2 flex-wrap">
                                                                    {Object.entries(record.parameters).map(([k, v]) => (
                                                                        <span key={k} className="bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">
                                                                            <b>{k}:</b> {v}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                    {appointments.filter(appt => appt.clientId === client.clientId && appt.status === 'Completed').length === 0 && (
                                        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                                            <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>Nenhum atendimento concluído para gerar prontuário.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="space-y-6">
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <h3 className="text-lg font-bold text-diva-dark">Registro Fotográfico</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsARMirrorOpen(true)}
                                            className="bg-gradient-to-r from-diva-primary to-diva-accent text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:opacity-90 transition-opacity shadow-md animate-pulse"
                                        >
                                            <Sparkles size={16} className="mr-2" /> Simulador AR
                                        </button>
                                        <button
                                            onClick={() => setIsSkinAnalysisOpen(true)}
                                            className="bg-white border border-diva-primary text-diva-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-primary hover:text-white transition-colors shadow-sm"
                                        >
                                            <ScanFace size={16} className="mr-2" /> Análise IA
                                        </button>
                                        <button
                                            onClick={() => setIsSocialStudioOpen(true)}
                                            className="bg-white border border-diva-accent text-diva-accent px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-orange-50 transition-colors shadow-sm"
                                        >
                                            <Share2 size={16} className="mr-2" /> Criar Post
                                        </button>
                                        <label className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark transition-colors cursor-pointer shadow-md">
                                            <Upload size={16} className="mr-2" /> Nova Foto
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePhotoUpload}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {photos.map(photo => (
                                        <div key={photo.id} className="group cursor-pointer">
                                            <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3 relative border border-gray-200 shadow-sm">
                                                <img src={photo.url} alt={photo.type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                <span className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold uppercase rounded text-white shadow-sm
                                            ${photo.type === 'before' ? 'bg-gray-600' : 'bg-green-600'}`}>
                                                    {photo.type === 'before' ? 'Antes' : 'Depois'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="font-bold text-diva-dark text-sm">{photo.area}</p>
                                                    <p className="text-xs text-gray-500">{new Date(photo.date).toLocaleDateString()}</p>
                                                </div>
                                                <button className="text-diva-primary hover:text-diva-dark">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                                {photo.notes}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Upload Placeholder if empty */}
                                    {photos.length === 0 && (
                                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                            <Image size={48} className="mb-4 opacity-50" />
                                            <p className="text-sm font-medium">Nenhuma foto registrada</p>
                                            <p className="text-xs">Clique em "Nova Foto" para começar</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'docs' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-diva-dark">Documentos Legais</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsWhatsAppModalOpen(true)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-green-700 transition-colors"
                                        >
                                            <MessageCircle size={16} className="mr-2" /> Enviar WhatsApp
                                        </button>
                                        <button
                                            onClick={() => setIsDocModalOpen(true)}
                                            className="bg-white border border-diva-primary text-diva-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-primary/5 transition-colors"
                                        >
                                            <FileText size={16} className="mr-2" /> Gerar Novo Termo
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold">
                                            <tr>
                                                <th className="px-6 py-4">Documento</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Data Assinatura</th>
                                                <th className="px-6 py-4 text-right">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {docs.map(doc => (
                                                <tr key={doc.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-diva-dark">{doc.title}</td>
                                                    <td className="px-6 py-4">
                                                        {doc.status === 'signed' ? (
                                                            <span className="flex items-center text-green-600 text-xs font-bold uppercase">
                                                                <CheckCircle size={14} className="mr-1" /> Assinado
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center text-orange-500 text-xs font-bold uppercase">
                                                                <Clock size={14} className="mr-1" /> Pendente
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {doc.signedAt ? new Date(doc.signedAt).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {doc.status === 'signed' ? (
                                                            <button className="text-diva-primary hover:underline text-xs font-bold flex items-center justify-end w-full">
                                                                <Download size={14} className="mr-1" /> PDF
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => setIsDocModalOpen(true)}
                                                                className="bg-diva-primary text-white px-3 py-1 rounded text-xs font-bold hover:bg-diva-dark"
                                                            >
                                                                Coletar Assinatura
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'financial' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-r from-diva-dark to-diva-primary p-6 rounded-xl text-white shadow-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-xs uppercase font-bold text-diva-light opacity-80">Saldo em Carteira</p>
                                                <h3 className="text-3xl font-mono font-bold">{formatCurrency(mockWallet.balance)}</h3>
                                            </div>
                                            <div className="bg-white/20 p-2 rounded-lg"><DollarSign size={24} /></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold transition-colors">Adicionar Crédito</button>
                                            <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold transition-colors">Histórico</button>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm">
                                        <h4 className="font-bold text-diva-dark mb-4">Pacotes Ativos</h4>
                                        {mockWallet.activePackages.map((pkg, i) => (
                                            <div key={i} className="mb-4 last:mb-0">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium text-gray-700">{pkg.name}</span>
                                                    <span className="text-diva-primary font-bold">{pkg.sessionsUsed}/{pkg.sessionsTotal}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                                                    <div className="bg-diva-primary h-2 rounded-full" style={{ width: `${(pkg.sessionsUsed / pkg.sessionsTotal) * 100}%` }}></div>
                                                </div>
                                                <p className="text-[10px] text-gray-400 text-right">Expira em: {new Date(pkg.expiryDate).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'forms' && (
                            <div className="max-w-3xl mx-auto space-y-6">
                                {/* Header with action button */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-diva-dark">Formulários Clínicos</h3>
                                        <p className="text-sm text-gray-500">Histórico de anamneses e termos preenchidos</p>
                                    </div>
                                    {formTemplates.filter(t => t.active).length > 0 && (
                                        <div className="relative group">
                                            <button
                                                onClick={() => {
                                                    const activeTemplates = formTemplates.filter(t => t.active);
                                                    if (activeTemplates.length === 1) {
                                                        setSelectedFormTemplate(activeTemplates[0]);
                                                        setIsFillFormModalOpen(true);
                                                    }
                                                }}
                                                className="bg-diva-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-diva-dark transition-colors flex items-center"
                                            >
                                                <FileText size={16} className="mr-2" />
                                                Preencher Formulário
                                            </button>
                                            {formTemplates.filter(t => t.active).length > 1 && (
                                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                    <div className="p-2">
                                                        {formTemplates.filter(t => t.active).map(template => (
                                                            <button
                                                                key={template.id}
                                                                onClick={() => {
                                                                    setSelectedFormTemplate(template);
                                                                    setIsFillFormModalOpen(true);
                                                                }}
                                                                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700 font-medium"
                                                            >
                                                                {template.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Forms Viewer */}
                                <ClientFormsViewer
                                    clientId={client.clientId}
                                    clientName={client.name}
                                    formResponses={formResponses}
                                    onViewDetails={(response) => {
                                        setSelectedFormResponse(response);
                                        setIsViewFormModalOpen(true);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DocumentModal
                isOpen={isDocModalOpen}
                onClose={() => setIsDocModalOpen(false)}
                client={client}
                documentType="consent_laser"
                onSign={handleDocumentSigned}
            />

            <SkinAnalysisModal
                isOpen={isSkinAnalysisOpen}
                onClose={() => setIsSkinAnalysisOpen(false)}
                clientName={client.name}
            />

            <SocialMediaModal
                isOpen={isSocialStudioOpen}
                onClose={() => setIsSocialStudioOpen(false)}
                client={client}
                beforePhoto={mockPhotos.find(p => p.type === 'before')?.url}
                afterPhoto={mockPhotos.find(p => p.type === 'after')?.url}
            />

            <ARMirrorModal
                isOpen={isARMirrorOpen}
                onClose={() => setIsARMirrorOpen(false)}
                clientName={client.name}
            />

            {/* Transfer Unit Modal */}
            {isTransferModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-diva-dark mb-2">Transferir Paciente</h3>
                        <p className="text-sm text-gray-500 mb-4">Selecione a unidade de destino para {client.name}. O histórico será mantido.</p>

                        <div className="space-y-3 mb-6">
                            {units.filter(u => u.id !== client.unitId).map(unit => (
                                <label key={unit.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${targetUnitId === unit.id ? 'border-diva-primary bg-diva-light/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="targetUnit"
                                        value={unit.id}
                                        checked={targetUnitId === unit.id}
                                        onChange={(e) => setTargetUnitId(e.target.value)}
                                        className="mr-3 text-diva-primary focus:ring-diva-primary"
                                    />
                                    <span className="text-sm font-medium text-diva-dark">{unit.name}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsTransferModalOpen(false)}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleTransferClient}
                                disabled={!targetUnitId}
                                className={`px-4 py-2 bg-diva-primary text-white rounded-lg font-bold text-sm shadow-md transition-colors ${!targetUnitId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-diva-dark'}`}
                            >
                                Confirmar Transferência
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fill Form Modal */}
            {selectedFormTemplate && (
                <FillFormModal
                    isOpen={isFillFormModalOpen}
                    onClose={() => {
                        setIsFillFormModalOpen(false);
                        setSelectedFormTemplate(null);
                    }}
                    formTemplate={selectedFormTemplate}
                    clientId={client.clientId}
                    clientName={client.name}
                    onSubmit={addFormResponse}
                />
            )}

            {/* View Form Response Modal */}
            {selectedFormResponse && (
                <ViewFormResponseModal
                    isOpen={isViewFormModalOpen}
                    onClose={() => {
                        setIsViewFormModalOpen(false);
                        setSelectedFormResponse(null);
                    }}
                    formResponse={selectedFormResponse}
                />
            )}

            {/* Appointment Record Modal */}
            {selectedAppointmentRecord && (
                <AppointmentRecordModal
                    isOpen={isAppointmentRecordModalOpen}
                    onClose={() => {
                        setIsAppointmentRecordModalOpen(false);
                        setSelectedAppointmentRecord(null);
                    }}
                    record={selectedAppointmentRecord}
                    formResponses={formResponses}
                    products={products}
                    onSave={handleSaveAppointmentRecord}
                />
            )}

            {/* Send Document WhatsApp Modal */}
            <SendDocumentWhatsAppModal
                isOpen={isWhatsAppModalOpen}
                onClose={() => setIsWhatsAppModalOpen(false)}
                client={client}
                documents={docs}
            />

            {/* Smart Consultation Modal */}
            <SmartConsultationModal
                isOpen={isSmartConsultationOpen}
                onClose={() => setIsSmartConsultationOpen(false)}
                client={client}
            />
        </div>
    );
};

export default ClientProfileModal;
