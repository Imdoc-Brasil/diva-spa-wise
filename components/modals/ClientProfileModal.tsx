
import React, { useState } from 'react';
import { Client, ClientDocument, ClientPhoto, ClientWallet, Invoice } from '../../types';
import { X, Calendar, DollarSign, Image, FileText, Clock, Phone, Mail, MapPin, Tag, ChevronRight, Download, Eye, Upload, CheckCircle, AlertTriangle, ScanFace, Share2, Sparkles, Star } from 'lucide-react';
import DocumentModal from './DocumentModal';
import SkinAnalysisModal from './SkinAnalysisModal';
import SocialMediaModal from './SocialMediaModal';
import ARMirrorModal from './ARMirrorModal';

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
    { id: 'd1', title: 'Termo de Consentimento - Laser', signedAt: '2023-01-15', status: 'signed', url: '#' },
    { id: 'd2', title: 'Direito de Uso de Imagem', signedAt: '2023-01-15', status: 'signed', url: '#' },
    { id: 'd3', title: 'Ficha de Anamnese Atualizada', signedAt: '', status: 'pending', url: '#' },
];

const mockPhotos: ClientPhoto[] = [
    { id: 'ph1', date: '2023-01-15', type: 'before', area: 'Face', url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=200', notes: 'Início do tratamento' },
    { id: 'ph2', date: '2023-06-20', type: 'after', area: 'Face', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=200', notes: 'Após 5 sessões' },
];

const mockTimeline = [
    { id: 't1', type: 'appointment', date: '2023-10-10', title: 'Depilação a Laser - Perna', status: 'completed', staff: 'Dra. Julia' },
    { id: 't2', type: 'purchase', date: '2023-10-10', title: 'Compra: Kit Home Care', value: 189.90 },
    { id: 't3', type: 'note', date: '2023-09-15', title: 'Observação Clínica', content: 'Cliente relatou sensibilidade leve após última sessão. Reduzir fluência em 10%.' },
    { id: 't4', type: 'appointment', date: '2023-09-15', title: 'Depilação a Laser - Perna', status: 'completed', staff: 'Dra. Julia' },
];

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ client, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'gallery' | 'docs' | 'financial'>('timeline');
  const [docs, setDocs] = useState<ClientDocument[]>(initialDocs);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isSkinAnalysisOpen, setIsSkinAnalysisOpen] = useState(false);
  const [isSocialStudioOpen, setIsSocialStudioOpen] = useState(false);
  const [isARMirrorOpen, setIsARMirrorOpen] = useState(false);

  if (!isOpen) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleDocumentSigned = (newDoc: ClientDocument) => {
      setDocs([newDoc, ...docs]);
      alert("Documento assinado digitalmente e salvo com sucesso!");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-diva-dark/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex overflow-hidden">
        
        {/* LEFT COLUMN: Static Profile Info */}
        <div className="w-80 bg-gray-50 border-r border-diva-light/30 flex flex-col p-6 overflow-y-auto">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-diva-primary text-white flex items-center justify-center text-3xl font-serif font-bold shadow-md mb-3 border-4 border-white">
                    {client.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-diva-dark leading-tight">{client.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Cliente desde 2022</p>
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
                    <p className="text-lg font-mono font-bold text-diva-dark">{formatCurrency(client.lifetimeValue)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-diva-light/30 shadow-sm">
                    <p className="text-xs text-gray-500">Score RFM</p>
                    <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 h-2 rounded-full mr-2">
                            <div className="bg-diva-accent h-2 rounded-full" style={{width: `${client.rfmScore}%`}}></div>
                        </div>
                        <span className="text-xs font-bold text-diva-accent">{client.rfmScore}</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-auto pt-6">
                <button className="w-full py-2 border border-diva-alert text-diva-alert rounded-lg text-sm font-bold hover:bg-diva-alert/5 transition-colors">
                    Bloquear Cliente
                </button>
            </div>
        </div>

        {/* RIGHT COLUMN: Dynamic Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Header / Tabs */}
            <div className="h-16 border-b border-diva-light/20 flex items-center justify-between px-6 bg-white sticky top-0 z-10">
                <div className="flex h-full space-x-1">
                    <button 
                        onClick={() => setActiveTab('timeline')}
                        className={`px-4 h-full border-b-2 font-medium text-sm transition-colors ${activeTab === 'timeline' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                    >
                        Linha do Tempo
                    </button>
                    <button 
                        onClick={() => setActiveTab('gallery')}
                        className={`px-4 h-full border-b-2 font-medium text-sm transition-colors ${activeTab === 'gallery' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                    >
                        Galeria & Análise IA
                    </button>
                    <button 
                        onClick={() => setActiveTab('docs')}
                        className={`px-4 h-full border-b-2 font-medium text-sm transition-colors ${activeTab === 'docs' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                    >
                        Documentos & Consentimento
                    </button>
                    <button 
                        onClick={() => setActiveTab('financial')}
                        className={`px-4 h-full border-b-2 font-medium text-sm transition-colors ${activeTab === 'financial' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-500 hover:text-diva-dark'}`}
                    >
                        Carteira & Pacotes
                    </button>
                </div>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-diva-dark hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                
                {activeTab === 'timeline' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {mockTimeline.map((item, idx) => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10
                                        ${item.type === 'appointment' ? 'bg-diva-primary text-white' : 
                                          item.type === 'purchase' ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
                                        {item.type === 'appointment' ? <Clock size={14} /> : 
                                         item.type === 'purchase' ? <DollarSign size={14} /> : <FileText size={14} />}
                                    </div>
                                    {idx !== mockTimeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>}
                                </div>
                                <div className="flex-1 bg-white p-4 rounded-xl border border-diva-light/20 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-diva-dark">{item.title}</h4>
                                        <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {item.type === 'appointment' && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Realizado por {item.staff}</span>}
                                        {item.type === 'purchase' && <span className="font-mono text-green-600 font-bold">{formatCurrency(item.value || 0)}</span>}
                                        {item.type === 'note' && <span className="italic">"{item.content}"</span>}
                                    </p>
                                </div>
                            </div>
                        ))}
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
                                <button className="bg-diva-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-primary transition-colors">
                                    <Upload size={16} className="mr-2" /> Nova Foto
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8">
                            {mockPhotos.map(photo => (
                                <div key={photo.id} className="group relative bg-white p-3 rounded-xl border border-diva-light/30 shadow-sm">
                                    <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
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
                        </div>
                    </div>
                )}

                {activeTab === 'docs' && (
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-diva-dark">Documentos Legais</h3>
                            <button 
                                onClick={() => setIsDocModalOpen(true)}
                                className="bg-white border border-diva-primary text-diva-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-primary/5 transition-colors"
                            >
                                <FileText size={16} className="mr-2" /> Gerar Novo Termo
                            </button>
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
                                            <div className="bg-diva-primary h-2 rounded-full" style={{width: `${(pkg.sessionsUsed/pkg.sessionsTotal)*100}%`}}></div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 text-right">Expira em: {new Date(pkg.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
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
    </div>
  );
};

export default ClientProfileModal;
