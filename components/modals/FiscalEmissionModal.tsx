
import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle, Copy, AlertCircle, Building2, User } from 'lucide-react';
import { Transaction, FiscalAccount, FiscalRecord, Client, OrganizationType } from '../../types';
import { useUnitData } from '../hooks/useUnitData';

interface FiscalEmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

const FiscalEmissionModal: React.FC<FiscalEmissionModalProps> = ({ isOpen, onClose, transaction }) => {
    const { clients, appointments, fiscalAccounts, addFiscalRecord, updateTransaction } = useUnitData();

    // Resolution State
    const [client, setClient] = useState<Client | null>(null);
    const [issuer, setIssuer] = useState<FiscalAccount | null>(null);

    // Form State
    const [noteNumber, setNoteNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [emissionDate, setEmissionDate] = useState(new Date().toISOString().split('T')[0]);
    const [linkUrl, setLinkUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && transaction) {
            // 1. Find Issuer (Fiscal Account)
            if (transaction.fiscalAccountId) {
                const found = fiscalAccounts.find(f => f.id === transaction.fiscalAccountId);
                setIssuer(found || null);
            } else {
                setIssuer(null);
            }

            // 2. Find Client (Tomador)
            if (transaction.relatedAppointmentId) {
                const appt = appointments.find(a => a.appointmentId === transaction.relatedAppointmentId);
                if (appt && appt.clientId) {
                    const foundClient = clients.find(c => c.clientId === appt.clientId);
                    setClient(foundClient || null);
                }
            } else {
                // Try to find by name if possible, or leave null (Consumidor Final)
                setClient(null);
            }

            // Reset Form
            setNoteNumber('');
            setVerificationCode('');
            setLinkUrl('');
            setEmissionDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen, transaction, fiscalAccounts, appointments, clients]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show toast here
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!transaction || !issuer || !noteNumber) return;

        setIsSubmitting(true);

        const newRecord: FiscalRecord = {
            id: `fr_${Date.now()}`,
            organizationId: transaction.organizationId,
            transactionId: transaction.id,
            type: transaction.revenueType === 'product' ? 'NF-e' : 'NFS-e',
            status: 'emitted',
            number: noteNumber,
            series: '1',
            emissionDate: new Date().toISOString(), // Or use emissionDate form field?
            amount: transaction.amount,

            // Issuer Info
            issuerName: issuer.name,
            issuerDocument: issuer.document,

            // Recipient Info
            recipientName: client ? client.name : (transaction.payerName || 'Consumidor Final'),
            recipientDocument: client?.cpf || 'Não informado',

            verificationCode: verificationCode,
            pdfUrl: linkUrl || '#'
        };

        addFiscalRecord(newRecord);
        updateTransaction(transaction.id, { fiscalRecordId: newRecord.id });

        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen || !transaction) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-dark text-white shrink-0">
                    <h3 className="font-bold text-lg flex items-center">
                        <FileText size={20} className="mr-2" /> Controle de Emissão Manual
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8">

                    {/* LEFT COLUMN: Reference Data */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex gap-3">
                            <AlertCircle className="shrink-0 mt-0.5" size={16} />
                            <div>
                                <p className="font-bold mb-1">Instruções:</p>
                                <p>1. Utilize os dados abaixo para emitir a nota no site da Prefeitura/Sefaz.</p>
                                <p>2. Após emitir, preencha os dados do registro à direita para dar baixa na pendência.</p>
                            </div>
                        </div>

                        {/* Issuer Data */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h4 className="font-bold text-gray-400 text-xs uppercase mb-3 flex items-center">
                                <Building2 size={12} className="mr-1" /> Prestador (Sua Empresa)
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center group">
                                    <span className="text-xs text-gray-500">Razão Social/Nome</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-800 text-sm text-right">{issuer?.name || '---'}</span>
                                        <button onClick={() => handleCopy(issuer?.name || '')} className="text-gray-400 hover:text-diva-primary opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} /></button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-xs text-gray-500">CNPJ/CPF</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-gray-800 text-sm">{issuer?.document || '---'}</span>
                                        <button onClick={() => handleCopy(issuer?.document || '')} className="text-gray-400 hover:text-diva-primary opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} /></button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                                    <span className="text-xs font-bold text-gray-600">Serviço/Produto</span>
                                    <span className="font-bold text-diva-primary">{transaction.description}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                                    <span className="text-xs font-bold text-gray-600">Valor da Nota</span>
                                    <span className="font-mono font-bold text-green-600">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recipient Data */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h4 className="font-bold text-gray-400 text-xs uppercase mb-3 flex items-center">
                                <User size={12} className="mr-1" /> Tomador (Cliente)
                            </h4>
                            {client ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center group">
                                        <span className="text-xs text-gray-500">Nome Completo</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-800 text-sm text-right">{client.name}</span>
                                            <button onClick={() => handleCopy(client.name)} className="text-gray-400 hover:text-diva-primary opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} /></button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center group">
                                        <span className="text-xs text-gray-500">CPF/CNPJ</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-gray-800 text-sm">{client.cpf || 'Não informado'}</span>
                                            {client.cpf && <button onClick={() => handleCopy(client.cpf || '')} className="text-gray-400 hover:text-diva-primary opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} /></button>}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start group">
                                        <span className="text-xs text-gray-500 mt-1">Endereço</span>
                                        <div className="flex items-start gap-2 max-w-[70%] justify-end">
                                            <span className="text-gray-800 text-xs text-right break-words">
                                                {client.address ? `${client.address.street}, ${client.address.number} - ${client.address.neighborhood}, ${client.address.city}/${client.address.state}` : 'Endereço não cadastrado'}
                                                {client.address && <br />}
                                                {client.address?.zipCode && <span className="text-gray-500">{client.address.zipCode}</span>}
                                            </span>
                                            {client.address && <button onClick={() => handleCopy(`${client.address!.street}, ${client.address!.number} - ${client.address!.neighborhood}, ${client.address!.city}/${client.address!.state}`)} className="text-gray-400 hover:text-diva-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1"><Copy size={12} /></button>}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center group">
                                        <span className="text-xs text-gray-500">E-mail</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-800 text-sm">{client.email}</span>
                                            <button onClick={() => handleCopy(client.email)} className="text-gray-400 hover:text-diva-primary opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} /></button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 text-center bg-white rounded border border-dashed border-gray-300">
                                    <p className="text-sm text-gray-500 italic">Cliente não identificado ou não registrado.</p>
                                    <p className="text-xs text-gray-400 mt-1">Use "Consumidor Final" se necessário.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Action Form */}
                    <div className="w-full md:w-1/3 flex flex-col border-l border-gray-100 pl-8">
                        <h4 className="font-bold text-diva-dark mb-6">Registro da Emissão</h4>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número da Nota *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary text-lg font-mono font-bold"
                                    placeholder="Ex: 1250"
                                    value={noteNumber}
                                    onChange={(e) => setNoteNumber(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Emissão</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary"
                                    value={emissionDate}
                                    onChange={(e) => setEmissionDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Código de Verificação</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary font-mono text-sm"
                                    placeholder="ABC-1234"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Link da Nota (PDF/Site)</label>
                                <input
                                    type="url"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary text-sm text-blue-600"
                                    placeholder="https://..."
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                />
                            </div>

                            <div className="pt-6 mt-auto">
                                <button
                                    type="submit"
                                    disabled={!noteNumber || isSubmitting}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Registrando...' : (
                                        <>
                                            <CheckCircle size={18} className="mr-2" /> Confirmar Emissão
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full mt-3 text-sm text-gray-500 hover:text-gray-800 underline"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FiscalEmissionModal;
