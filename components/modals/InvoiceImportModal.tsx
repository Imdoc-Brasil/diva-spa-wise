
import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Check, AlertCircle, RefreshCw, ArrowRight, Save, Search, Bot, Database } from 'lucide-react';
import { useUnitData } from '../hooks/useUnitData';
import { Product, Transaction } from '../../types';

interface InvoiceImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ParsedItem {
    id: string;
    rawName: string;
    quantity: number;
    unitCost: number;
    batch: string;
    expiry: string;
    matchedProductId?: string; // ID of the catalog product linked
}

interface ParsedInvoice {
    number: string;
    supplierName: string;
    date: string;
    totalAmount: number;
    items: ParsedItem[];
}

// Mock AI Service
const mockParseInvoice = (file: File): Promise<ParsedInvoice> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                number: '000.045.123',
                supplierName: 'Galderma Brasil Ltda',
                date: new Date().toISOString().split('T')[0],
                totalAmount: 5650.00,
                items: [
                    { id: '1', rawName: 'Dysport - Toxina Botulínica 300U', quantity: 5, unitCost: 850.00, batch: 'DYS-9988', expiry: '2026-12-31' },
                    { id: '2', rawName: 'Restylane Lyft Lidocaína 1ml', quantity: 2, unitCost: 700.00, batch: 'RES-1122', expiry: '2025-06-30' },
                    { id: '3', rawName: 'Agulha Descartável 30G', quantity: 50, unitCost: 0.50, batch: 'AG-5544', expiry: '2028-01-01' }
                ]
            });
        }, 2500);
    });
};

const InvoiceImportModal: React.FC<InvoiceImportModalProps> = ({ isOpen, onClose }) => {
    const { products, updateProduct, addTransaction, selectedUnitId } = useUnitData();

    // Steps: 'upload' | 'processing' | 'review' | 'success'
    const [step, setStep] = useState<'upload' | 'processing' | 'review' | 'success'>('upload');
    const [invoiceData, setInvoiceData] = useState<ParsedInvoice | null>(null);
    const [items, setItems] = useState<ParsedItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStep('processing');
        try {
            const data = await mockParseInvoice(file);
            setInvoiceData(data);

            // Auto-match logic (Simple name fuzzy match simulation)
            const matchedItems = data.items.map(item => {
                // Try to find a product that contains parts of the name
                const found = products.find(p =>
                    p.name.toLowerCase().includes('dysport') && item.rawName.toLowerCase().includes('dysport') ||
                    p.name.toLowerCase().includes('restylane') && item.rawName.toLowerCase().includes('restylane')
                );
                return { ...item, matchedProductId: found?.id };
            });

            setItems(matchedItems);
            setStep('review');
        } catch (err) {
            alert('Erro ao processar nota. Tente novamente.');
            setStep('upload');
        }
    };

    const handleMatchProduct = (itemId: string, productId: string) => {
        setItems(items.map(i => i.id === itemId ? { ...i, matchedProductId: productId } : i));
    };

    const handleProcessImport = async () => {
        if (!invoiceData) return;
        setIsSaving(true);

        // 1. Process each item linked to a product
        let processedCount = 0;
        const purchaseDescriptionItems: string[] = [];

        for (const item of items) {
            if (item.matchedProductId) {
                const product = products.find(p => p.id === item.matchedProductId);
                if (product) {
                    // Calculate total content added (e.g. 5 boxes * 1 unit/box = 5 units)
                    // Assumption: The invoice quantity matches the product presentation quantity unit
                    // Or usually invoice comes in "Commercial Unit". 
                    // We assume simple 1-to-1 mapping for this MVP or Quantity * Content

                    const contentAdded = item.quantity * (product.contentQuantity || 1);

                    const updatedProduct: Product = {
                        ...product,
                        stock: (product.stock || 0) + contentAdded,
                        costPrice: item.unitCost, // Update latest cost
                        batchNumber: item.batch,
                        expirationDate: item.expiry,
                        lastInvoice: invoiceData.number
                    };

                    updateProduct(product.id, updatedProduct);
                    purchaseDescriptionItems.push(`${product.name} (${item.quantity}x)`);
                    processedCount++;
                }
            }
        }

        // 2. Create Transaction (Accounts Payable)
        // We sum up the cost of ONLY matched items, or the whole invoice?
        // Usually whole invoice is payable. Unmatched items might be "General Supplies".
        // For accurate financial, we should use the invoice total.

        const newTransaction: Omit<Transaction, 'organizationId'> = {
            id: `exp_import_${Date.now()}`,
            description: `Importação NF ${invoiceData.number} - ${invoiceData.supplierName}`,
            category: 'Estoque',
            amount: invoiceData.totalAmount,
            type: 'expense',
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days default
            installments: 1,
            paymentMethod: 'invoice_30d', // Default
            supplierId: invoiceData.supplierName, // Store name as ID for now/legacy
            unitId: selectedUnitId !== 'all' ? selectedUnitId : undefined,
            // Store matched info in notes?
            attachmentUrl: '#' // Mock link to file
        };

        addTransaction(newTransaction);

        setIsSaving(false);
        setStep('success');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-diva-dark to-gray-800 text-white shrink-0">
                    <h3 className="font-bold text-lg flex items-center">
                        <Bot size={24} className="mr-3 text-purple-300" />
                        Importação Inteligente (IA)
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">

                    {/* STEP 1: UPLOAD */}
                    {step === 'upload' && (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                            <div className="w-full max-w-lg border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-diva-light/10 hover:border-diva-primary transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={32} className="text-diva-primary" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-700 mb-2">Upload da Nota Fiscal (XML ou PDF)</h4>
                                <p className="text-center text-gray-500 mb-6">
                                    Arraste seu arquivo aqui ou clique para buscar.<br />
                                    Nossa IA irá identificar produtos, lotes e valores automaticamente.
                                </p>
                                <button className="px-6 py-2 bg-diva-primary text-white rounded-lg font-bold shadow hover:bg-diva-dark transition-colors">
                                    Selecionar Arquivo
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".xml,.pdf"
                                    onChange={handleFileUpload}
                                />
                            </div>
                            <div className="mt-8 flex gap-6 text-xs text-gray-400">
                                <span className="flex items-center"><Check size={14} className="mr-1 text-green-500" /> Leitura de XML (NFe)</span>
                                <span className="flex items-center"><Check size={14} className="mr-1 text-green-500" /> OCR em PDFs</span>
                                <span className="flex items-center"><Check size={14} className="mr-1 text-green-500" /> Mapeamento Automático</span>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PROCESSING */}
                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center h-full py-20">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 border-4 border-diva-light/30 border-t-diva-primary rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Bot size={32} className="text-gray-400 animate-pulse" />
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Analisando Documento...</h4>
                            <p className="text-gray-500">A IA está extraindo os dados dos itens e conciliando com seu catálogo.</p>
                        </div>
                    )}

                    {/* STEP 3: REVIEW */}
                    {step === 'review' && invoiceData && (
                        <div className="space-y-6">
                            {/* Invoice Summary */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-wrap gap-6 items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                                        <FileText size={24} className="text-diva-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Nota Fiscal</p>
                                        <p className="font-bold text-gray-800 text-lg">{invoiceData.number}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Fornecedor</p>
                                    <p className="font-medium text-gray-800">{invoiceData.supplierName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Data Emissão</p>
                                    <p className="font-medium text-gray-800">{new Date(invoiceData.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Valor Total</p>
                                    <p className="font-bold text-green-600 text-xl">
                                        {invoiceData.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <h4 className="font-bold text-gray-700 flex items-center">
                                        <Database size={16} className="mr-2" /> Conciliação de Itens ({items.length})
                                    </h4>
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">
                                        {items.filter(i => !i.matchedProductId).length} Itens Pendentes de Vínculo
                                    </span>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-white text-xs font-bold text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-3 w-1/3">Item na Nota</th>
                                            <th className="px-6 py-3 text-center">Qtd / Lote</th>
                                            <th className="px-6 py-3 text-right">Custo Unit.</th>
                                            <th className="px-6 py-3 w-1/3 text-center">Vincular Produto (Catálogo)</th>
                                            <th className="px-6 py-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {items.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-800 text-sm">{item.rawName}</p>
                                                    <p className="text-xs text-gray-400">ID Fornecedor: {item.id}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <p className="font-bold text-gray-800">{item.quantity}</p>
                                                    <p className="text-xs text-gray-500">Lote: {item.batch}</p>
                                                    <p className="text-[10px] text-red-400">Val: {new Date(item.expiry).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-gray-600">
                                                    {item.unitCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        className={`w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 ${item.matchedProductId ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                                                        value={item.matchedProductId || ''}
                                                        onChange={(e) => handleMatchProduct(item.id, e.target.value)}
                                                    >
                                                        <option value="">-- Selecione ou Ignore --</option>
                                                        {products.map(p => (
                                                            <option key={p.id} value={p.id}>{p.name} ({p.presentation})</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {item.matchedProductId ? (
                                                        <Check size={20} className="text-green-500 mx-auto" />
                                                    ) : (
                                                        <div title="Não vinculado (não será importado estoque)" className="mx-auto w-fit">
                                                            <AlertCircle size={20} className="text-gray-300" />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleProcessImport}
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isSaving ? (
                                        <>Salvando...</>
                                    ) : (
                                        <>
                                            <Save size={20} /> Confirmar Importação
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center h-full py-12 animate-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <Check size={48} className="text-green-600" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-2">Importação Concluída!</h4>
                            <p className="text-gray-500 text-center max-w-md mb-8">
                                O estoque foi atualizado com sucesso e a conta a pagar foi lançada no financeiro.<br />

                            </p>
                            <div className="flex gap-4">
                                <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">
                                    Fechar Janela
                                </button>
                                <button onClick={() => { setStep('upload'); setInvoiceData(null); }} className="px-6 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark">
                                    Importar Outra Nota
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default InvoiceImportModal;
