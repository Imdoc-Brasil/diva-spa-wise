
import React, { useRef } from 'react';
import { X, Printer, Download, Share2 } from 'lucide-react';
import { Transaction, StaffMember } from '../../types';
import { useOrganization } from '../context/OrganizationContext';
import { useUnitData } from '../hooks/useUnitData';

interface ReceiptPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction;
}

const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({ isOpen, onClose, transaction }) => {
    const { organization } = useOrganization();
    const { staff, appointments, clients, businessConfig } = useUnitData();
    const receiptRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    // Resolve Data
    const appointment = transaction.relatedAppointmentId
        ? appointments.find(a => a.appointmentId === transaction.relatedAppointmentId)
        : null;

    const staffMember = appointment
        ? staff.find(s => s.id === appointment.staffId)
        : null; // Fallback: try to find by some other means if transaction has info

    // Client Name: from appointment or generic
    const clientName = appointment?.clientName || "Cliente Consumidor";
    const clientCpf = "___.___.___-__"; // Placeholder or fetch if Client type has it

    // Amount
    const amountFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header Actions */}
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center no-print">
                    <h3 className="font-bold text-gray-800 flex items-center">
                        Pré-visualização do Recibo
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
                        >
                            <Printer size={14} /> Imprimir
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Receipt Content */}
                <div className="p-8 overflow-y-auto bg-gray-100 flex justify-center">
                    <div
                        ref={receiptRef}
                        className="bg-white w-full max-w-[210mm] p-10 shadow-sm border border-gray-200 min-h-[140mm] print:shadow-none print:border-none print:w-full"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                        {/* Header */}
                        <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
                            <h1 className="text-2xl font-bold uppercase tracking-wide text-black mb-1">{organization?.displayName || businessConfig?.name || "Clínica de Estética"}</h1>
                            <p className="text-sm text-gray-500">{businessConfig?.address || "Endereço da Clínica"}</p>
                            <p className="text-sm text-gray-500">Tel: {businessConfig?.phone || "(00) 0000-0000"}</p>
                        </div>

                        {/* Body */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h2 className="text-4xl font-bold text-gray-900">RECIBO</h2>
                                <div className="text-xl font-bold border border-gray-800 px-4 py-2 rounded">
                                    {amountFormatted}
                                </div>
                            </div>

                            <p className="text-lg leading-relaxed text-justify mt-8">
                                Recebemos de <strong className="uppercase border-b border-dotted border-gray-400">{clientName}</strong>,
                                inscrito(a) no CPF nº {clientCpf}, a importância supra de <strong className="uppercase">{amountFormatted}</strong>,
                                referente aos serviços prestados de: <strong className="uppercase">{transaction.description || "Procedimentos Estéticos"}</strong>.
                            </p>

                            <p className="text-lg leading-relaxed text-justify">
                                Pelo que firmamos o presente para que surta seus efeitos legais.
                            </p>

                            {/* Footer / Signature */}
                            <div className="mt-16 pt-8 flex flex-col items-end">
                                <p className="mb-12 text-gray-600">{businessConfig?.address?.split(',')[0] || "São Paulo"}, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>

                                <div className="mt-8 text-center min-w-[250px]">
                                    <div className="border-t border-black pt-2">
                                        <p className="font-bold text-lg">{staffMember?.name || organization?.displayName || businessConfig?.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {staffMember ? `CPF: ${staffMember.cpf || "___.___.___-__"}` : `CNPJ: ${organization?.id || "00.000.000/0001-00"}`}
                                        </p>
                                        {staffMember?.signature && (
                                            <p className="text-xs text-gray-400 mt-1">{staffMember.signature}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-12 pt-4 border-t border-gray-100 text-[10px] text-center text-gray-400">
                            Este recibo não substitui a Nota Fiscal de Serviços quando exigida por lei.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReceiptPreviewModal;
