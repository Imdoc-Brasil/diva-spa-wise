
import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, Save, FileText, Check, User, ArrowRight, Layout, Search } from 'lucide-react';
import { TreatmentPlan, TreatmentPlanItem, TreatmentPriority } from '../../types';
import { MOCK_TREATMENT_TEMPLATES } from '../../utils/mockTreatmentPlans';
import { useData } from '../context/DataContext';
import BodyMapSelector from '../ui/BodyMapSelector';

interface PrescribePlanModalProps {
    onClose: () => void;
    onSave: (plan: Partial<TreatmentPlan>) => void;
    initialClientName?: string;
    initialClientId?: string;
}

const PrescribePlanModal: React.FC<PrescribePlanModalProps> = ({ onClose, onSave, initialClientName, initialClientId }) => {
    const { services, clients } = useData();
    const [patientName, setPatientName] = useState(initialClientName || '');
    const [items, setItems] = useState<Partial<TreatmentPlanItem>[]>([]);
    const [planName, setPlanName] = useState('');

    // Body Map Selection State
    const [suggestedServices, setSuggestedServices] = useState<{ zone: string, services: string[] } | null>(null);

    const handleTemplateChange = (tplId: string) => {
        const template = MOCK_TREATMENT_TEMPLATES.find(t => t.id === tplId);
        if (template) {
            setPlanName(template.name);
            const newItems = template.items.map((item, idx) => ({
                id: `new_${idx}_${Date.now()}`,
                serviceId: item.serviceId,
                serviceName: item.serviceName,
                quantity: item.quantity,
                priority: item.priority,
                unitPrice: 1000, // Mock price
                totalPrice: 1000 * item.quantity,
                status: 'pending' as const,
                sessionsUsed: 0
            }));
            setItems(prev => [...prev, ...newItems]);
        }
    };

    const handleAddItem = (serviceName = 'Novo Serviço', price = 500) => {
        setItems([...items, {
            id: `new_${Date.now()}_${Math.random()}`,
            serviceName: serviceName,
            quantity: 1,
            priority: 'medium',
            unitPrice: price,
            totalPrice: price,
            status: 'pending',
            sessionsUsed: 0
        }]);
    };

    const updateItem = (index: number, field: keyof TreatmentPlanItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].totalPrice = (newItems[index].quantity || 0) * (newItems[index].unitPrice || 0);
        }
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!patientName) return alert('Informe o nome do paciente');
        onSave({
            clientName: patientName,
            name: planName || `Plano de ${patientName}`,
            items: items as any[],
            total: items.reduce((acc, i) => acc + (i.totalPrice || 0), 0)
        });
        onClose();
    };

    const totalValue = items.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-gray-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-diva-primary/10 rounded-lg text-diva-primary">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-bold text-diva-dark">Nova Prescrição Visual</h2>
                            <p className="text-xs text-gray-500">Selecione as áreas no mapa ou adicione itens manualmente.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-bold text-sm transition-colors">
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-diva-primary text-white rounded-lg font-bold text-sm hover:bg-diva-dark shadow-lg shadow-diva-primary/20 flex items-center gap-2 transition-all hover:scale-105"
                        >
                            <Save size={16} /> Salvar Prescrição
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                    {/* LEFT: BODY MAP */}
                    <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200 p-6 flex flex-col items-center overflow-y-auto custom-scrollbar">
                        <BodyMapSelector
                            onZoneSelect={(zone, services) => setSuggestedServices({ zone, services })}
                        />

                        {suggestedServices ? (
                            <div className="mt-6 w-full bg-white p-4 rounded-xl shadow-sm border border-diva-primary/20 animate-in slide-in-from-top-4">
                                <h4 className="font-bold text-diva-dark mb-3 text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-diva-primary"></div>
                                    Sugerido para: {suggestedServices.zone}
                                </h4>
                                <div className="space-y-2">
                                    {suggestedServices.services.map((svc, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAddItem(svc, 1500)} // Using Mock Price
                                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-diva-primary hover:text-white rounded-lg transition-colors flex justify-between group"
                                        >
                                            {svc}
                                            <Plus size={14} className="opacity-0 group-hover:opacity-100" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                <p className="text-xs text-gray-400">Selecione uma área no rosto para ver sugestões personalizadas.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: PLAN DETAILS */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">

                        {/* Patient & Template Info */}
                        <div className="p-6 border-b border-gray-100 grid grid-cols-2 gap-6 bg-white shrink-0">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Paciente</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-diva-primary"
                                        placeholder="Nome do Paciente..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Modelo Rápido</label>
                                <div className="relative">
                                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <select
                                        onChange={(e) => handleTemplateChange(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-diva-primary appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecione um template...</option>
                                        {MOCK_TREATMENT_TEMPLATES.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-bold text-diva-dark">Itens do Plano</h3>
                                <button
                                    onClick={() => handleAddItem()}
                                    className="text-xs font-bold text-diva-primary flex items-center gap-1 hover:underline"
                                >
                                    <Plus size={14} /> Adicionar Manualmente
                                </button>
                            </div>

                            {items.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-xl">
                                    <FileText size={48} className="mb-2 opacity-20" />
                                    <p className="text-sm">Nenhum item adicionado</p>
                                    <p className="text-xs">Use o mapa ou adicione manualmente</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-diva-primary/30 transition-colors items-center group">
                                            <div className="flex-1">
                                                <input
                                                    value={item.serviceName}
                                                    onChange={(e) => updateItem(index, 'serviceName', e.target.value)}
                                                    className="w-full font-bold text-sm text-diva-dark bg-transparent border-none p-0 focus:ring-0 placeholder-gray-400"
                                                    placeholder="Nome do Serviço"
                                                />
                                                <div className="flex gap-4 mt-1">
                                                    <label className="text-xs text-gray-500 flex items-center gap-1">
                                                        Qtd:
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                                            className="w-12 bg-gray-50 rounded px-1 py-0.5 text-center font-medium focus:outline-none focus:bg-white border border-transparent focus:border-diva-primary"
                                                        />
                                                    </label>
                                                    <label className="text-xs text-gray-500 flex items-center gap-1">
                                                        Prioridade:
                                                        <select
                                                            value={item.priority}
                                                            onChange={(e) => updateItem(index, 'priority', e.target.value)}
                                                            className="bg-gray-50 rounded px-1 py-0.5 text-[10px] uppercase font-bold focus:outline-none cursor-pointer"
                                                        >
                                                            <option value="high">Alta</option>
                                                            <option value="medium">Média</option>
                                                            <option value="low">Baixa</option>
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <input
                                                    type="number"
                                                    value={item.unitPrice}
                                                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                                                    className="w-24 text-right font-bold text-diva-primary bg-transparent border-none p-0 focus:ring-0"
                                                />
                                                <div className="text-xs text-gray-400">Total: R$ {((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}</div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Totals */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200 shrink-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-500 text-sm">Subtotal</span>
                                <span className="font-medium text-gray-700">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500 text-sm">Desconto</span>
                                <span className="font-medium text-green-600">- R$ 0,00</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="font-bold text-xl text-diva-dark">Total Estimado</span>
                                <span className="font-bold text-2xl text-diva-primary">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PrescribePlanModal;
