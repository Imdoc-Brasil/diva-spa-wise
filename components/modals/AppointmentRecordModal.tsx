import React, { useState } from 'react';
import { X, FileText, Calendar, User, Clock, Pill, Camera, ClipboardList, AlertCircle, Save, Image as ImageIcon, Upload, Trash2, Printer } from 'lucide-react';
import { AppointmentRecord, FormResponse, Product } from '../../types';

interface AppointmentRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: AppointmentRecord;
    formResponses?: FormResponse[];
    products?: Product[];
    onSave?: (updatedRecord: Partial<AppointmentRecord>) => void;
}

const AppointmentRecordModal: React.FC<AppointmentRecordModalProps> = ({
    isOpen,
    onClose,
    record,
    formResponses = [],
    products = [],
    onSave
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedRecord, setEditedRecord] = useState<AppointmentRecord>(record);
    const [selectedProductToAdd, setSelectedProductToAdd] = useState('');

    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleSave = () => {
        if (onSave) {
            onSave({
                clinicalNotes: editedRecord.clinicalNotes,
                observations: editedRecord.observations,
                reactions: editedRecord.reactions,
                parameters: editedRecord.parameters,
                nextSessionDate: editedRecord.nextSessionDate,
                nextSessionNotes: editedRecord.nextSessionNotes,
                beforePhotos: editedRecord.beforePhotos,
                afterPhotos: editedRecord.afterPhotos,
                productsUsed: editedRecord.productsUsed,
                updatedAt: new Date().toISOString()
            });
        }
        setIsEditing(false);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (type === 'before') {
                    setEditedRecord(prev => ({
                        ...prev,
                        beforePhotos: [...(prev.beforePhotos || []), base64String]
                    }));
                } else {
                    setEditedRecord(prev => ({
                        ...prev,
                        afterPhotos: [...(prev.afterPhotos || []), base64String]
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = (type: 'before' | 'after', index: number) => {
        if (type === 'before') {
            setEditedRecord(prev => ({
                ...prev,
                beforePhotos: prev.beforePhotos?.filter((_, i) => i !== index)
            }));
        } else {
            setEditedRecord(prev => ({
                ...prev,
                afterPhotos: prev.afterPhotos?.filter((_, i) => i !== index)
            }));
        }
    };

    const handleAddProduct = () => {
        if (!selectedProductToAdd) return;
        const product = products.find(p => p.id === selectedProductToAdd);
        if (!product) return;

        const currentProducts = editedRecord.productsUsed || [];
        const existingIndex = currentProducts.findIndex(p => p.productId === product.id);
        const currentQty = existingIndex >= 0 ? currentProducts[existingIndex].quantity : 0;

        if ((product.stock || 0) <= currentQty) {
            alert(`Estoque insuficiente! Apenas ${product.stock} unidades disponíveis.`);
            return;
        }

        let newProducts;
        if (existingIndex >= 0) {
            newProducts = [...currentProducts];
            newProducts[existingIndex].quantity += 1;
        } else {
            newProducts = [...currentProducts, { productId: product.id, productName: product.name, quantity: 1 }];
        }

        setEditedRecord({ ...editedRecord, productsUsed: newProducts });
        setSelectedProductToAdd('');
    };

    const handleRemoveProduct = (index: number) => {
        const newProducts = [...(editedRecord.productsUsed || [])];
        if (newProducts[index].quantity > 1) {
            newProducts[index].quantity -= 1;
        } else {
            newProducts.splice(index, 1);
        }
        setEditedRecord({ ...editedRecord, productsUsed: newProducts });
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Prontuário - ${editedRecord.clientName}</title>
                        <style>
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
                            h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 30px; }
                            .header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
                            .section { margin-bottom: 25px; }
                            .section-title { font-weight: bold; margin-bottom: 8px; color: #2c3e50; font-size: 1.1em; border-left: 4px solid #6366f1; padding-left: 10px; }
                            .field { margin-bottom: 8px; }
                            .label { font-weight: bold; color: #555; }
                            .content-box { background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 4px; }
                            .photos { display: flex; gap: 15px; flex-wrap: wrap; }
                            .photo { width: 200px; height: 150px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
                            .footer { margin-top: 60px; border-top: 1px solid #ddd; padding-top: 20px; display: flex; justify-content: space-between; font-size: 0.9em; color: #777; }
                        </style>
                    </head>
                    <body>
                        <h1>Prontuário de Atendimento</h1>
                        
                        <div class="header-grid">
                            <div>
                                <div class="field"><span class="label">Cliente:</span> ${editedRecord.clientName}</div>
                                <div class="field"><span class="label">Data:</span> ${formatDate(editedRecord.date)}</div>
                            </div>
                            <div>
                                <div class="field"><span class="label">Procedimento:</span> ${editedRecord.serviceName}</div>
                                <div class="field"><span class="label">Profissional:</span> ${editedRecord.professionalName}</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">Notas Clínicas</div>
                            <div class="content-box">${editedRecord.clinicalNotes || 'Nenhuma nota registrada.'}</div>
                        </div>

                        ${editedRecord.observations ? `
                        <div class="section">
                            <div class="section-title">Observações</div>
                            <div class="content-box">${editedRecord.observations}</div>
                        </div>
                        ` : ''}

                        ${editedRecord.parameters && Object.keys(editedRecord.parameters).length > 0 ? `
                        <div class="section">
                            <div class="section-title">Parâmetros Utilizados</div>
                            <div class="content-box">
                                ${Object.entries(editedRecord.parameters).map(([k, v]) => `<div><b>${k}:</b> ${v}</div>`).join('')}
                            </div>
                        </div>
                        ` : ''}

                        ${(editedRecord.beforePhotos?.length || 0) > 0 ? `
                        <div class="section">
                            <div class="section-title">Fotos Antes</div>
                            <div class="photos">
                                ${editedRecord.beforePhotos?.map(src => `<img src="${src}" class="photo" />`).join('')}
                            </div>
                        </div>
                        ` : ''}

                        ${(editedRecord.afterPhotos?.length || 0) > 0 ? `
                        <div class="section">
                            <div class="section-title">Fotos Depois</div>
                            <div class="photos">
                                ${editedRecord.afterPhotos?.map(src => `<img src="${src}" class="photo" />`).join('')}
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="footer">
                            <div>Gerado em ${new Date().toLocaleString()}</div>
                            <div>Assinatura do Profissional: __________________________</div>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const relatedForms = formResponses.filter(f =>
        editedRecord.formResponseIds?.includes(f.id)
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-200">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-diva-primary/10 rounded-xl flex items-center justify-center">
                            <ClipboardList className="text-diva-primary" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-diva-dark">{editedRecord.serviceName}</h2>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <User size={14} />
                                    {editedRecord.clientName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {formatDate(editedRecord.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {editedRecord.duration} min
                                </span>
                            </div>
                            <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded font-bold ${editedRecord.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                    editedRecord.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    {editedRecord.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-2 text-gray-400 hover:text-diva-primary hover:bg-diva-primary/10 rounded-full transition-colors"
                            title="Imprimir Prontuário"
                        >
                            <Printer size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-diva-dark hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Profissional */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                                    <User size={16} className="mr-2" />
                                    Profissional Responsável
                                </h3>
                                <p className="text-gray-900 font-medium">{editedRecord.professionalName}</p>
                            </div>

                            {/* Notas Clínicas */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                    <FileText size={16} className="mr-2" />
                                    Notas Clínicas
                                </h3>
                                {isEditing ? (
                                    <textarea
                                        value={editedRecord.clinicalNotes || ''}
                                        onChange={(e) => setEditedRecord({ ...editedRecord, clinicalNotes: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-diva-primary resize-none"
                                        rows={4}
                                        placeholder="Descreva o procedimento realizado..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {editedRecord.clinicalNotes || <span className="text-gray-400 italic">Nenhuma nota registrada</span>}
                                    </p>
                                )}
                            </div>

                            {/* Parâmetros Utilizados */}
                            {editedRecord.parameters && Object.keys(editedRecord.parameters).length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-gray-700 mb-3">Parâmetros Utilizados</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(editedRecord.parameters).map(([key, value]) => (
                                            <div key={key} className="bg-gray-50 p-2 rounded">
                                                <span className="text-xs text-gray-500 block">{key}</span>
                                                <span className="text-sm font-bold text-gray-900">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Observações */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Observações</h3>
                                {isEditing ? (
                                    <textarea
                                        value={editedRecord.observations || ''}
                                        onChange={(e) => setEditedRecord({ ...editedRecord, observations: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-diva-primary resize-none"
                                        rows={3}
                                        placeholder="Observações gerais..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {editedRecord.observations || <span className="text-gray-400 italic">Nenhuma observação</span>}
                                    </p>
                                )}
                            </div>

                            {/* Reações/Intercorrências */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                    <AlertCircle size={16} className="mr-2 text-orange-500" />
                                    Reações / Intercorrências
                                </h3>
                                {isEditing ? (
                                    <textarea
                                        value={editedRecord.reactions || ''}
                                        onChange={(e) => setEditedRecord({ ...editedRecord, reactions: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-diva-primary resize-none"
                                        rows={3}
                                        placeholder="Registre qualquer reação ou intercorrência..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {editedRecord.reactions || <span className="text-gray-400 italic">Nenhuma reação registrada</span>}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Formulários Preenchidos */}
                            {relatedForms.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                        <FileText size={16} className="mr-2" />
                                        Formulários Preenchidos ({relatedForms.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {relatedForms.map(form => (
                                            <div key={form.id} className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm font-medium text-gray-900">{form.formTitle}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {form.responses.length} campos preenchidos
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Produtos Utilizados */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                    <Pill size={16} className="mr-2" />
                                    Produtos Utilizados
                                </h3>

                                {isEditing && (
                                    <div className="flex gap-2 mb-3">
                                        <select
                                            value={selectedProductToAdd}
                                            onChange={(e) => setSelectedProductToAdd(e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                        >
                                            <option value="">Selecionar produto...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id} disabled={(p.stock || 0) <= 0}>
                                                    {p.name} (Disp: {p.stock || 0})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleAddProduct}
                                            disabled={!selectedProductToAdd}
                                            className="bg-diva-primary text-white px-3 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                )}

                                {editedRecord.productsUsed && editedRecord.productsUsed.length > 0 ? (
                                    <div className="space-y-2">
                                        {editedRecord.productsUsed.map((product, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded group">
                                                <span className="text-sm text-gray-900">{product.productName}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-gray-600">{product.quantity}x</span>
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => handleRemoveProduct(idx)}
                                                            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Nenhum produto registrado.</p>
                                )}
                            </div>

                            {/* Fotos Antes/Depois */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                    <Camera size={16} className="mr-2" />
                                    Fotos Antes/Depois
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs text-gray-500">Antes</p>
                                            {isEditing && (
                                                <label className="cursor-pointer text-diva-primary hover:text-diva-dark">
                                                    <Upload size={14} />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handlePhotoUpload(e, 'before')}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        {editedRecord.beforePhotos && editedRecord.beforePhotos.length > 0 ? (
                                            <div className="space-y-2">
                                                {editedRecord.beforePhotos.map((photo, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img src={photo} alt="Antes" className="w-full h-32 object-cover rounded-lg" />
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => removePhoto('before', idx)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                                                {isEditing ? (
                                                    <label className="cursor-pointer flex flex-col items-center text-gray-400 hover:text-diva-primary">
                                                        <Upload size={24} />
                                                        <span className="text-xs mt-1">Adicionar</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handlePhotoUpload(e, 'before')}
                                                        />
                                                    </label>
                                                ) : (
                                                    <ImageIcon size={24} className="text-gray-400" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs text-gray-500">Depois</p>
                                            {isEditing && (
                                                <label className="cursor-pointer text-diva-primary hover:text-diva-dark">
                                                    <Upload size={14} />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handlePhotoUpload(e, 'after')}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        {editedRecord.afterPhotos && editedRecord.afterPhotos.length > 0 ? (
                                            <div className="space-y-2">
                                                {editedRecord.afterPhotos.map((photo, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img src={photo} alt="Depois" className="w-full h-32 object-cover rounded-lg" />
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => removePhoto('after', idx)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                                                {isEditing ? (
                                                    <label className="cursor-pointer flex flex-col items-center text-gray-400 hover:text-diva-primary">
                                                        <Upload size={24} />
                                                        <span className="text-xs mt-1">Adicionar</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handlePhotoUpload(e, 'after')}
                                                        />
                                                    </label>
                                                ) : (
                                                    <ImageIcon size={24} className="text-gray-400" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Próxima Sessão */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center">
                                    <Calendar size={16} className="mr-2" />
                                    Próxima Sessão
                                </h3>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="date"
                                            value={editedRecord.nextSessionDate || ''}
                                            onChange={(e) => setEditedRecord({ ...editedRecord, nextSessionDate: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                                        />
                                        <textarea
                                            value={editedRecord.nextSessionNotes || ''}
                                            onChange={(e) => setEditedRecord({ ...editedRecord, nextSessionNotes: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                                            rows={2}
                                            placeholder="Recomendações para próxima sessão..."
                                        />
                                    </>
                                ) : (
                                    <>
                                        {editedRecord.nextSessionDate ? (
                                            <p className="text-blue-900 font-medium mb-2">
                                                {formatDate(editedRecord.nextSessionDate)}
                                            </p>
                                        ) : (
                                            <p className="text-gray-400 italic mb-2">Não agendada</p>
                                        )}
                                        <p className="text-sm text-blue-800">
                                            {editedRecord.nextSessionNotes || <span className="text-gray-400 italic">Sem recomendações</span>}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-500">
                        {editedRecord.updatedAt && (
                            <span>Última atualização: {formatDate(editedRecord.updatedAt)}</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => {
                                        setEditedRecord(record);
                                        setIsEditing(false);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors flex items-center"
                                >
                                    <Save size={16} className="mr-2" />
                                    Salvar Alterações
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Fechar
                                </button>
                                {onSave && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors"
                                    >
                                        Editar Prontuário
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentRecordModal;
