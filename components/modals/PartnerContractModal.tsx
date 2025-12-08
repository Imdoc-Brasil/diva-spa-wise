
import React, { useRef } from 'react';
import { Partner } from '../../types';
import { X, Download, FileText, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface PartnerContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    partner: Partner;
}

const PartnerContractModal: React.FC<PartnerContractModalProps> = ({ isOpen, onClose, partner }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const generatePDF = () => {
        const doc = new jsPDF();

        // Add logo/header
        doc.setFontSize(22);
        doc.text('CONTRATO DE PARCERIA COMERCIAL', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Identificador: ${partner.id}`, 105, 30, { align: 'center' });

        // Content
        const currentDate = new Date().toLocaleDateString('pt-BR');

        const content = `
        Pelo presente instrumento particular, de um lado DIVA SPA, doravante denominada CONTRATANTE, e de outro lado ${partner.name}, doravante denominado(a) PARCEIRO(A), portador(a) do contato ${partner.contact}, têm entre si justo e contratado o que segue:

        1. OBJETO
        O presente contrato tem por objeto a parceria comercial para indicação de clientes através do código promocional "${partner.code}".

        2. COMISSÃO E BENEFÍCIOS
        2.1. O PARCEIRO receberá uma comissão de ${partner.commissionRate}% sobre o valor líquido dos serviços consumidos pelos clientes indicados.
        2.2. Os clientes indicados receberão um desconto de ${partner.clientDiscountRate}% em serviços selecionados.

        3. PAGAMENTO
        3.1. Os pagamentos serão realizados via PIX para a chave: ${partner.pixKey || 'A definir'}.
        3.2. O pagamento será realizado mediante solicitação, respeitando o ciclo de fechamento mensal.

        4. VIGÊNCIA
        Este contrato tem vigência indeterminada, podendo ser rescindido por qualquer das partes com aviso prévio de 30 dias.

        Data de Emissão: ${currentDate}
        `;

        // Split text to fit page
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, 50);

        // Signatures
        doc.line(20, 250, 90, 250);
        doc.text('DIVA SPA', 55, 255, { align: 'center' });

        doc.line(120, 250, 190, 250);
        doc.text(partner.name.toUpperCase(), 155, 255, { align: 'center' });

        doc.save(`Contrato_Parceria_${partner.name.replace(/\s+/g, '_')}.pdf`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:p-0 print:bg-white">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:max-w-none print:h-full print:max-h-none print:rounded-none">

                {/* Header (Hidden on print) */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 print:hidden">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-diva-dark">
                        <FileText size={20} className="text-diva-primary" /> Contrato de Parceria
                    </h3>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="p-2 text-gray-500 hover:text-diva-dark hover:bg-gray-200 rounded-lg transition-colors"
                            title="Imprimir"
                        >
                            <Printer size={20} />
                        </button>
                        <button
                            onClick={generatePDF}
                            className="flex items-center gap-2 px-4 py-2 bg-diva-primary text-white rounded-lg hover:bg-diva-dark transition-colors font-bold text-sm"
                        >
                            <Download size={16} /> Baixar PDF
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Contract Content */}
                <div ref={contentRef} className="flex-1 overflow-y-auto p-12 bg-white text-gray-800 print:p-0 print:overflow-visible">
                    <div className="max-w-2xl mx-auto space-y-8 print:max-w-none">

                        {/* Title */}
                        <div className="text-center mb-12">
                            <h1 className="text-2xl font-serif font-bold mb-2">CONTRATO DE PARCERIA COMERCIAL</h1>
                            <p className="text-sm text-gray-500 font-mono">ID: {partner.id}</p>
                        </div>

                        {/* Preamble */}
                        <div className="text-justify leading-relaxed">
                            <p>
                                Pelo presente instrumento particular, de um lado <strong>DIVA SPA</strong>, pessoa jurídica de direito privado, doravante denominada <strong>CONTRATANTE</strong>, e de outro lado <strong>{partner.name.toUpperCase()}</strong>, portador(a) do contato <strong>{partner.contact}</strong>, doravante denominado(a) <strong>PARCEIRO(A)</strong>, têm entre si justo e contratado o que segue:
                            </p>
                        </div>

                        {/* Clauses */}
                        <div className="space-y-6">
                            <section>
                                <h3 className="font-bold uppercase text-sm mb-2">1. DO OBJETO</h3>
                                <p className="text-justify leading-relaxed text-sm">
                                    O presente contrato tem por objeto o estabelecimento de uma parceria comercial visando a divulgação dos serviços da CONTRATANTE e a indicação de novos clientes através do código promocional exclusivo <strong>"{partner.code}"</strong>.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-bold uppercase text-sm mb-2">2. DA COMISSÃO E BENEFÍCIOS</h3>
                                <div className="pl-4 space-y-2 text-sm text-justify leading-relaxed">
                                    <p>2.1. O PARCEIRO fará jus a uma comissão de <strong>{partner.commissionRate}%</strong> sobre o valor líquido dos serviços efetivamente consumidos e pagos pelos clientes indicados.</p>
                                    <p>2.2. Os clientes que utilizarem o código do PARCEIRO terão direito a um desconto de <strong>{partner.clientDiscountRate}%</strong> em serviços selecionados, não cumulativo com outras promoções.</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="font-bold uppercase text-sm mb-2">3. DO PAGAMENTO</h3>
                                <div className="pl-4 space-y-2 text-sm text-justify leading-relaxed">
                                    <p>3.1. Os pagamentos das comissões devidas serão realizados via transferência bancária ou PIX para a chave informada: <strong>{partner.pixKey || '______________________'}</strong>.</p>
                                    <p>3.2. O pagamento será realizado mediante solicitação do PARCEIRO ou automaticamente no dia 30 de cada mês, respeitando o valor mínimo de saque de R$ 50,00.</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="font-bold uppercase text-sm mb-2">4. DA VIGÊNCIA E RESCISÃO</h3>
                                <p className="text-justify leading-relaxed text-sm">
                                    Este contrato entra em vigor na data de sua assinatura e terá vigência indeterminada, podendo ser rescindido por qualquer uma das partes, sem ônus, mediante aviso prévio por escrito (incluindo e-mail ou mensagem) com antecedência mínima de 30 (trinta) dias.
                                </p>
                            </section>
                        </div>

                        {/* Signatures */}
                        <div className="pt-16 grid grid-cols-2 gap-12 mt-12 page-break-inside-avoid">
                            <div className="text-center">
                                <div className="border-t border-gray-400 pt-4 w-full"></div>
                                <p className="font-bold text-sm">DIVA SPA</p>
                                <p className="text-xs text-gray-500">Contratante</p>
                            </div>
                            <div className="text-center">
                                <div className="border-t border-gray-400 pt-4 w-full"></div>
                                <p className="font-bold text-sm">{partner.name.toUpperCase()}</p>
                                <p className="text-xs text-gray-500">Parceiro(a)</p>
                            </div>
                        </div>

                        <div className="text-center pt-12 text-xs text-gray-400">
                            Documento gerado eletronicamente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerContractModal;
