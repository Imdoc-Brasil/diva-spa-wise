
import React, { useState, useMemo } from 'react';
import { Client, ClientDocument, ClientPhoto, ClientWallet, Invoice, AppointmentRecord, AppointmentStatus, TreatmentPlan } from '../../types';
import { X, Calendar, DollarSign, Image, FileText, Clock, Phone, Mail, MapPin, Tag, ChevronRight, Download, Eye, Upload, CheckCircle, AlertTriangle, ScanFace, Share2, Sparkles, Star, ArrowRightLeft, MessageCircle, ClipboardList, Plus, BarChart3, Crown, Smartphone, Home, Bell, Megaphone, User } from 'lucide-react';
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
import PrescribePlanModal from './PrescribePlanModal';
import PlanDetailsModal from './PlanDetailsModal';
import { useData } from '../context/DataContext';
import { calculateRFM } from '../../utils/rfmUtils';

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
    const { appointments, transactions, units, updateClient, formTemplates, formResponses, addFormResponse, appointmentRecords, addAppointmentRecord, updateAppointmentRecord, getAppointmentRecord, products, updateProductStock, updateAppointmentStatus, treatmentPlans, addTreatmentPlan, updateTreatmentPlan } = useData();
    const [activeTab, setActiveTab] = useState<'timeline' | 'registration' | 'gallery' | 'docs' | 'financial' | 'forms' | 'medical_record' | 'plans' | 'app_view'>('timeline');
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
    const [isARMirrorOpen, setIsARMirrorOpen] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isPrescribeModalOpen, setIsPrescribeModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);

    // Registration Form State
    const [editForm, setEditForm] = useState({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        cpf: client.cpf || '',
        rg: client.rg || '',
        birthDate: client.birthDate || '',
        gender: client.gender || 'female',
        profession: client.profession || '',
        zipCode: client.address?.zipCode || '',
        street: client.address?.street || '',
        number: client.address?.number || '',
        neighborhood: client.address?.neighborhood || '',
        city: client.address?.city || '',
        state: client.address?.state || '',
        notes: client.notes || ''
    });

    const handleSaveRegistration = () => {
        updateClient(client.clientId, {
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            cpf: editForm.cpf,
            rg: editForm.rg,
            birthDate: editForm.birthDate,
            gender: editForm.gender as any,
            profession: editForm.profession,
            notes: editForm.notes,
            address: {
                street: editForm.street,
                number: editForm.number,
                neighborhood: editForm.neighborhood,
                city: editForm.city,
                state: editForm.state,
                zipCode: editForm.zipCode
            }
        });
        alert('Dados atualizados com sucesso!');
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhoto: ClientPhoto = {
                    id: `ph_${Date.now()}`,
                    date: new Date().toISOString(),
                    type: 'after',
                    area: 'Nova Área',
                    url: reader.result as string,
                    notes: 'Foto adicionada recentemente'
                };
                setPhotos([newPhoto, ...photos]);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- LOGIC RESTORATION ---
    const clientTimeline = useMemo(() => {
        const timeline: any[] = [];
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

        const combined = [...clientAppointments, ...clientTransactions]
            .sort((a, b) => b.sortDate - a.sortDate)
            .slice(0, 10);

        return combined;
    }, [appointments, transactions, client.clientId, client.name]);

    const realLTV = useMemo(() => {
        return transactions
            .filter(t => t.description.includes(client.name) && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions, client.name]);

    const totalVisits = useMemo(() => {
        return appointments.filter(appt =>
            appt.clientId === client.clientId &&
            appt.status === 'Completed'
        ).length;
    }, [appointments, client.clientId]);

    const rfm = useMemo(() => {
        return calculateRFM(client, appointments, realLTV);
    }, [client, appointments, realLTV]);

    const handleOpenAppointmentRecord = (timelineItem: any) => {
        if (timelineItem.type !== 'appointment') return;
        const appointmentId = timelineItem.rawAppointmentId;
        let record = getAppointmentRecord(appointmentId);
        if (!record) {
            record = {
                id: `record_${Date.now()}`,
                organizationId: client.organizationId || 'org_demo',
                appointmentId: appointmentId,
                clientId: client.clientId,
                clientName: client.name,
                serviceId: 'serviceId' in timelineItem ? timelineItem.serviceId : 'unknown',
                serviceName: timelineItem.title,
                professionalId: timelineItem.staffId || 'unknown',
                professionalName: timelineItem.staff,
                date: timelineItem.date,
                duration: 60,
                status: timelineItem.status,
                createdAt: new Date().toISOString()
            };
        }
        setSelectedAppointmentRecord(record);
        setIsAppointmentRecordModalOpen(true);
    };

    const handleSaveAppointmentRecord = (updatedData: Partial<AppointmentRecord>) => {
        if (!selectedAppointmentRecord) return;
        if (updatedData.productsUsed) {
            const oldProducts = selectedAppointmentRecord.productsUsed || [];
            const newProducts = updatedData.productsUsed;
            newProducts.forEach(newP => {
                const oldP = oldProducts.find(p => p.productId === newP.productId);
                const oldQty = oldP ? oldP.quantity : 0;
                const diff = newP.quantity - oldQty;
                if (diff > 0) updateProductStock(newP.productId, diff, 'remove');
                else if (diff < 0) updateProductStock(newP.productId, Math.abs(diff), 'add');
            });
            oldProducts.forEach(oldP => {
                const newP = newProducts.find(p => p.productId === oldP.productId);
                if (!newP) updateProductStock(oldP.productId, oldP.quantity, 'add');
            });
        }
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-diva-dark/90 backdrop-blur-sm p-0 md:p-4">
            <div className="bg-white rounded-none md:rounded-2xl shadow-2xl w-full h-full md:h-[90vh] md:max-w-5xl flex flex-col md:flex-row overflow-hidden">

                {/* LEFT COLUMN: Static Profile Info */}
                <div className="hidden lg:flex w-80 bg-gray-50 border-r border-diva-light/30 flex-col p-6 overflow-y-auto">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-diva-primary text-white flex items-center justify-center text-3xl font-serif font-bold shadow-md mb-3 border-4 border-white">
                            {client.name.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-diva-dark leading-tight">{client.name}</h2>
                        <div className={`mt-2 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 ${rfm.segmentColor}`}>
                            {rfm.segment === 'Champions' && <Crown size={12} />}
                            {rfm.segmentLabel}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Paciente desde 2022</p>
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
                            <p className="text-xs text-gray-500 mb-2 font-bold flex justify-between items-center">
                                Score RFM
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${rfm.segmentColor}`}>{rfm.score}/100</span>
                            </p>
                            <div className="flex items-center mb-1">
                                <div className="flex-1 bg-gray-100 h-2.5 rounded-full mr-2 relative overflow-hidden">
                                    <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${rfm.score}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-purple-700 min-w-[24px] text-right">{rfm.score}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1 bg-gray-100 h-2.5 rounded-full mr-2 relative overflow-hidden">
                                    <div className="bg-yellow-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (client.loyaltyPoints || 0) / 10)}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-yellow-600 min-w-[24px] text-right">{Math.min(100, Math.round((client.loyaltyPoints || 0) / 10))}</span>
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

                        <div className="flex h-12 md:h-full overflow-x-auto scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={`px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${activeTab === 'timeline' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                <span className="hidden sm:inline">Linha do Tempo</span>
                                <span className="sm:hidden">Timeline</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('registration')}
                                className={`px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${activeTab === 'registration' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                Dados Cadastrais
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
                                onClick={() => setActiveTab('plans')}
                                className={`px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 ${activeTab === 'plans' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                <span className="hidden sm:inline">Planos de Tratamento</span>
                                <span className="sm:hidden">Planos</span>
                            </button>
                            <button
                                onClick={() => setIsSmartConsultationOpen(true)}
                                className="ml-2 md:ml-4 px-3 md:px-4 py-1.5 bg-gradient-to-r from-diva-primary to-diva-accent text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 animate-pulse shrink-0"
                            >
                                <Sparkles size={14} />
                                <span className="hidden sm:inline">IA</span>
                                <span className="sm:hidden">IA</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('app_view')}
                                className={`ml-2 md:ml-2 px-3 md:px-4 h-full border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'app_view' ? 'border-diva-dark text-diva-dark' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                            >
                                <Smartphone size={16} />
                                <span className="hidden sm:inline">Visão do App</span>
                            </button>
                        </div >
                        <button onClick={onClose} className="hidden lg:block p-2 text-gray-400 hover:text-diva-dark hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div >

                    {/* Content Body */}
                    < div className="flex-1 overflow-y-auto p-3 md:p-8 bg-gray-50/50" >

                        {activeTab === 'app_view' && (
                            <div className="flex justify-center items-start pt-4 pb-12">
                                <div className="w-[300px] h-[600px] bg-black rounded-[40px] p-3 border-4 border-gray-800 shadow-2xl relative ring-4 ring-gray-200">
                                    {/* Phone Screen */}
                                    <div className="w-full h-full bg-white rounded-[32px] overflow-hidden flex flex-col relative">
                                        {/* Status Bar */}
                                        <div className="h-7 bg-diva-dark text-white text-[10px] flex justify-between items-center px-5 pt-1">
                                            <span className="font-medium">9:41</span>
                                            <div className="flex gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full"></div>
                                                <div className="w-3 h-1.5 bg-white/80 rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* App Header */}
                                        <div className="p-4 bg-diva-primary/5 border-b border-diva-primary/10 flex justify-between items-center pt-8 pb-4">
                                            <div>
                                                <h4 className="font-bold text-diva-dark text-sm">Olá, {client.name.split(' ')[0]} 👋</h4>
                                                <p className="text-[10px] text-diva-primary font-bold bg-diva-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">💎 Cliente Premium</p>
                                            </div>
                                            <div className="relative p-2 bg-white rounded-full shadow-sm">
                                                <Bell size={18} className="text-diva-dark" />
                                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                            </div>
                                        </div>

                                        {/* Notifications List */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Notificações Recentes</h5>

                                            {/* Mock Notifications */}
                                            <div className="bg-white p-3 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 relative group active:scale-95 transition-transform cursor-pointer">
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                                        <Megaphone size={14} />
                                                    </div>
                                                    <div>
                                                        <h6 className="font-bold text-xs text-gray-800">Promoção Relâmpago!</h6>
                                                        <p className="text-[10px] text-gray-500 leading-tight mt-1">
                                                            Somente hoje! <b>20% OFF</b> em Drenagem Linfática. Toque para agendar.
                                                        </p>
                                                        <span className="text-[9px] text-gray-300 mt-2 block">Há 2 horas</span>
                                                    </div>
                                                </div>
                                                <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            </div>

                                            <div className="bg-white p-3 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 relative group active:scale-95 transition-transform cursor-pointer">
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                                        <Calendar size={14} />
                                                    </div>
                                                    <div>
                                                        <h6 className="font-bold text-xs text-gray-800">Lembrete de Agendamento</h6>
                                                        <p className="text-[10px] text-gray-500 leading-tight mt-1">
                                                            Sua sessão de Laser é <b>amanhã às 14:00</b>.
                                                        </p>
                                                        <button className="mt-2 text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded w-full">Confirmar Presença</button>
                                                        <span className="text-[9px] text-gray-300 mt-2 block">Ontem</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white p-3 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 relative group active:scale-95 transition-transform cursor-pointer">
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                                                        <MessageCircle size={14} />
                                                    </div>
                                                    <div>
                                                        <h6 className="font-bold text-xs text-gray-800">Pesquisa de Satisfação</h6>
                                                        <p className="text-[10px] text-gray-500 leading-tight mt-1">
                                                            Como foi seu atendimento com Dra. Julia?
                                                        </p>
                                                        <div className="flex gap-1 mt-2">
                                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="text-yellow-400 fill-current" />)}
                                                        </div>
                                                        <span className="text-[9px] text-gray-300 mt-2 block">3 dias atrás</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Nav */}
                                        <div className="h-16 bg-white border-t border-gray-100 flex justify-around items-center px-4 pb-2">
                                            <div className="flex flex-col items-center text-diva-primary gap-1">
                                                <Home size={20} className="fill-current" />
                                                <span className="text-[9px] font-bold">Início</span>
                                            </div>
                                            <div className="flex flex-col items-center text-gray-300 gap-1">
                                                <Calendar size={20} />
                                                <span className="text-[9px] font-medium">Agenda</span>
                                            </div>
                                            <div className="flex flex-col items-center text-gray-300 gap-1">
                                                <User size={20} />
                                                <span className="text-[9px] font-medium">Perfil</span>
                                            </div>
                                        </div>

                                        {/* Home Indicator */}
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-black/20 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'registration' && (
                            <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl border border-diva-light/30 shadow-sm space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-diva-dark mb-4 flex items-center gap-2">
                                        <User size={20} className="text-diva-primary" />
                                        Dados Pessoais
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nome Completo</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary focus:ring-1 focus:ring-diva-primary outline-none transition-all font-medium text-diva-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">E-mail</label>
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Telefone / WhatsApp</label>
                                            <input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">CPF</label>
                                            <input
                                                type="text"
                                                value={editForm.cpf}
                                                onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">RG</label>
                                            <input
                                                type="text"
                                                value={editForm.rg}
                                                onChange={(e) => setEditForm({ ...editForm, rg: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Data de Nascimento</label>
                                            <input
                                                type="date"
                                                value={editForm.birthDate}
                                                onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Gênero</label>
                                            <select
                                                value={editForm.gender}
                                                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as any })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            >
                                                <option value="female">Feminino</option>
                                                <option value="male">Masculino</option>
                                                <option value="other">Outro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Profissão</label>
                                            <input
                                                type="text"
                                                value={editForm.profession}
                                                onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-lg font-bold text-diva-dark mb-4 flex items-center gap-2">
                                        <MapPin size={20} className="text-diva-primary" />
                                        Endereço
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">CEP</label>
                                            <input
                                                type="text"
                                                value={editForm.zipCode}
                                                onChange={(e) => setEditForm({ ...editForm, zipCode: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-4">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Logradouro (Rua/Av)</label>
                                            <input
                                                type="text"
                                                value={editForm.street}
                                                onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Número</label>
                                            <input
                                                type="text"
                                                value={editForm.number}
                                                onChange={(e) => setEditForm({ ...editForm, number: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Bairro</label>
                                            <input
                                                type="text"
                                                value={editForm.neighborhood}
                                                onChange={(e) => setEditForm({ ...editForm, neighborhood: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Cidade</label>
                                            <input
                                                type="text"
                                                value={editForm.city}
                                                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">UF</label>
                                            <input
                                                type="text"
                                                maxLength={2}
                                                value={editForm.state}
                                                onChange={(e) => setEditForm({ ...editForm, state: e.target.value.toUpperCase() })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-lg font-bold text-diva-dark mb-4 flex items-center gap-2">
                                        <FileText size={20} className="text-diva-primary" />
                                        Observações Internas
                                    </h3>
                                    <div>
                                        <textarea
                                            value={editForm.notes}
                                            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-diva-primary outline-none transition-all resize-none"
                                            placeholder="Anote aqui informações importantes sobre o cliente..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={handleSaveRegistration}
                                        className="bg-diva-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-diva-dark transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                    >
                                        <CheckCircle size={18} />
                                        Salvar Alterações
                                    </button>
                                </div>
                            </div>
                        )}

                        {
                            activeTab === 'timeline' && (
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
                            )
                        }

                        {
                            activeTab === 'medical_record' && (
                                <div className="max-w-4xl mx-auto space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-diva-dark">Prontuário Eletrônico</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsPrescribeModalOpen(true)}
                                                className="bg-white border border-diva-primary text-diva-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-primary hover:text-white transition-colors"
                                            >
                                                <ClipboardList size={16} className="mr-2" /> Prescrever Plano
                                            </button>
                                            <button
                                                onClick={() => setIsSmartConsultationOpen(true)}
                                                className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark transition-colors"
                                            >
                                                <Sparkles size={16} className="mr-2" /> Nova Evolução (IA)
                                            </button>
                                        </div>
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
                            )
                        }

                        {
                            activeTab === 'gallery' && (
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
                            )
                        }

                        {
                            activeTab === 'docs' && (
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
                            )
                        }

                        {
                            activeTab === 'financial' && (
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
                            )
                        }

                        {
                            activeTab === 'forms' && (
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
                            )
                        }


                        {
                            activeTab === 'plans' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-diva-dark">Planos de Tratamento</h3>
                                        <button
                                            onClick={() => setIsPrescribeModalOpen(true)}
                                            className="bg-diva-primary text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-diva-dark transition-colors"
                                        >
                                            <Plus size={16} className="mr-2" /> Novo Plano
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {treatmentPlans.filter(p => p.clientId === client.clientId).length > 0 ? (
                                            treatmentPlans.filter(p => p.clientId === client.clientId).map(plan => (
                                                <div
                                                    key={plan.id}
                                                    onClick={() => setSelectedPlan(plan)}
                                                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-diva-primary/50 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-diva-dark text-lg group-hover:text-diva-primary transition-colors">{plan.name}</h4>
                                                            <p className="text-sm text-gray-500">{new Date(plan.createdAt).toLocaleDateString()} • {plan.professionalName}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                                        ${plan.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                                                                plan.status === 'closed' || plan.status === 'partially_paid' ? 'bg-green-100 text-green-700' :
                                                                    'bg-blue-100 text-blue-700'}`}>
                                                            {plan.status === 'prescribed' ? 'Prescrito' :
                                                                plan.status === 'negotiating' ? 'Em Negociação' :
                                                                    plan.status === 'closed' ? 'Fechado' : 'Concluído'}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-end mt-4">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-500 mb-1">Itens do Plano:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {plan.items.slice(0, 3).map((item, idx) => (
                                                                    <span key={idx} className="bg-gray-50 border border-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                                                                        {item.quantity}x {item.serviceName}
                                                                    </span>
                                                                ))}
                                                                {plan.items.length > 3 && (
                                                                    <span className="text-xs text-gray-400 self-center">+{plan.items.length - 3} mais</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-400">Valor Total</p>
                                                            <p className="text-xl font-bold text-diva-dark">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.total)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                                                <ClipboardList size={48} className="mx-auto text-gray-300 mb-3" />
                                                <p className="text-gray-500 font-medium">Nenhum plano prescrito para este paciente.</p>
                                                <button
                                                    onClick={() => setIsPrescribeModalOpen(true)}
                                                    className="mt-3 text-diva-primary font-bold text-sm hover:underline"
                                                >
                                                    Prescrever Primeiro Plano
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    </div >
                </div >
            </div >

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
            {
                isTransferModalOpen && (
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
                )
            }

            {/* Fill Form Modal */}
            {
                selectedFormTemplate && (
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
                )
            }

            {/* View Form Response Modal */}
            {
                selectedFormResponse && (
                    <ViewFormResponseModal
                        isOpen={isViewFormModalOpen}
                        onClose={() => {
                            setIsViewFormModalOpen(false);
                            setSelectedFormResponse(null);
                        }}
                        formResponse={selectedFormResponse}
                    />
                )
            }

            {/* Appointment Record Modal */}
            {
                selectedAppointmentRecord && (
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
                )
            }

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

            {/* Treatment Plan Modals */}
            {
                isPrescribeModalOpen && (
                    <PrescribePlanModal
                        onClose={() => setIsPrescribeModalOpen(false)}
                        initialClientName={client.name}
                        initialClientId={client.clientId}
                        onSave={(newPlan) => {
                            const plan: TreatmentPlan = {
                                id: `plan_${Date.now()}`,
                                organizationId: 'org_demo',
                                clientId: newPlan.clientId || client.clientId,
                                clientName: newPlan.clientName || client.name,
                                professionalId: 'prof_demo',
                                professionalName: 'Dr(a). Atual',
                                name: newPlan.name || 'Novo Plano',
                                items: newPlan.items as any[] || [],
                                status: 'prescribed',
                                pipelineStage: 'Novo',
                                discount: 0,
                                subtotal: newPlan.total || 0,
                                total: newPlan.total || 0,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            };
                            addTreatmentPlan(plan);
                            setIsPrescribeModalOpen(false);
                        }}
                    />
                )
            }

            {
                selectedPlan && (
                    <PlanDetailsModal
                        plan={selectedPlan}
                        onClose={() => setSelectedPlan(null)}
                        onUpdate={(updatedPlan) => {
                            updateTreatmentPlan(updatedPlan);
                            setSelectedPlan(updatedPlan);
                        }}
                    />
                )
            }
        </div >
    );
};

export default ClientProfileModal;
