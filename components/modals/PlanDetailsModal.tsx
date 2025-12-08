
import React, { useState } from 'react';
import {
    X, CheckCircle, Circle, DollarSign, Calendar, Clock,
    CreditCard, ArrowRight, Printer, Share2, AlertTriangle
} from 'lucide-react';
import { TreatmentPlan, TreatmentItemStatus, TreatmentPlanItem, ServiceAppointment } from '../../types';
import { useToast } from '../ui/ToastContext';
import NewAppointmentModal from './NewAppointmentModal';

interface PlanDetailsModalProps {
    plan: TreatmentPlan;
    onClose: () => void;
    onUpdate: (updatedPlan: TreatmentPlan) => void;
}

const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({ plan, onClose, onUpdate }) => {
    const { addToast } = useToast();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [appointmentInitialData, setAppointmentInitialData] = useState<Partial<ServiceAppointment> | undefined>(undefined);

    // Derived Check
    const totalSelected = plan.items
        .filter(item => selectedItems.includes(item.id))
        .reduce((acc, item) => acc + item.totalPrice, 0);

    const isAllPaid = plan.items.every(i => i.status === 'paid' || i.status === 'completed' || i.status === 'scheduled');

    const handleToggleItem = (itemId: string) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleProcessPayment = () => {
        // Simulando processamento de pagamento
        const updatedItems = plan.items.map(item => {
            if (selectedItems.includes(item.id)) {
                return { ...item, status: 'paid' as TreatmentItemStatus };
            }
            return item;
        });

        const newStatus = updatedItems.every(i => i.status === 'paid' || i.status === 'completed')
            ? 'closed'
            : 'partially_paid';

        const updatedPlan = {
            ...plan,
            items: updatedItems,
            status: newStatus as any,
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedPlan);
        addToast(`Pagamento de R$ ${totalSelected.toLocaleString('pt-BR')} confirmado!`, 'success');
        setSelectedItems([]); // Limpar seleção
    };

    const handleScheduleSession = (item: TreatmentPlanItem) => {
        setAppointmentInitialData({
            clientId: plan.clientId,
            clientName: plan.clientName,
            serviceName: item.serviceName,
            unitId: 'unit_1', // Or derived from context
        });
        setIsAppointmentModalOpen(true);
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* HEAD: Status Bar */}
                <div className="bg-diva-dark text-white p-6 flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-serif font-bold">{plan.name}</h2>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase text-diva-dark bg-white`}>
                                {plan.pipelineStage}
                            </span>
                        </div>
                        <p className="opacity-80 text-sm flex items-center gap-2">
                            <span className="font-bold">{plan.clientName}</span> • Prescrito por Dra. {plan.professionalName}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* BODY: Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50 flex flex-col md:flex-row gap-8">

                    {/* Left: Items Management */}
                    <div className="flex-1 space-y-6">

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="font-bold text-gray-700">Itens do Plano & Créditos</h3>
                                <div className="text-xs text-gray-500">
                                    Selecione os itens para realizar o pagamento (Checkout)
                                </div>
                            </div>

                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase font-bold border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 w-10"></th>
                                        <th className="p-4">Tratamento</th>
                                        <th className="p-4 text-center">Sessões</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-right">Valor</th>
                                        <th className="p-4 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {plan.items.map(item => {
                                        const isPaid = item.status === 'paid' || item.status === 'completed' || item.status === 'scheduled';

                                        return (
                                            <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50/30' : ''}`}>
                                                <td className="p-4">
                                                    {!isPaid && (
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-gray-300 text-diva-primary focus:ring-diva-primary cursor-pointer"
                                                            checked={selectedItems.includes(item.id)}
                                                            onChange={() => handleToggleItem(item.id)}
                                                        />
                                                    )}
                                                    {isPaid && <CheckCircle size={16} className="text-green-500" />}
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-bold text-gray-800 text-sm">{item.serviceName}</p>
                                                    <p className="text-xs text-gray-500">Prioridade:
                                                        <span className={item.priority === 'high' ? 'text-red-500 font-bold ml-1' : 'ml-1'}>
                                                            {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Média' : 'Baixa'}
                                                        </span>
                                                    </p>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="inline-flex items-center justify-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                                                        <span className="font-bold text-diva-dark">{item.sessionsUsed}</span>
                                                        <span className="text-gray-400">/</span>
                                                        <span className="text-gray-600">{item.quantity}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full
                                                        ${item.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                item.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {item.status === 'paid' ? 'Pago (Credito)' :
                                                            item.status === 'pending' ? 'A Pagar' :
                                                                item.status === 'completed' ? 'Realizado' : item.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-mono text-sm text-gray-700">
                                                    {formatCurrency(item.totalPrice)}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {isPaid && item.sessionsUsed < item.quantity && (
                                                        <button
                                                            onClick={() => handleScheduleSession(item)}
                                                            className="text-xs font-bold text-white bg-diva-primary hover:bg-diva-dark px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                                        >
                                                            Agendar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Payment Selection Bar */}
                        {selectedItems.length > 0 && (
                            <div className="bg-diva-dark text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-bottom-5">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs opacity-70 uppercase font-bold tracking-wider">Total Selecionado</p>
                                        <p className="text-xl font-bold">{formatCurrency(totalSelected)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">
                                        Gerar Link
                                    </button>
                                    <button
                                        onClick={handleProcessPayment}
                                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold transition-colors shadow-md flex items-center gap-2"
                                    >
                                        <CreditCard size={18} /> Confirmar Pagamento
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Summary & Stats */}
                    <div className="w-full md:w-80 space-y-6 shrink-0">

                        {/* Financial Summary */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard size={18} className="text-diva-primary" /> Resumo Financeiro
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Valor Total</span>
                                    <span className="font-bold text-gray-800">{formatCurrency(plan.total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Já Pago</span>
                                    <span className="font-bold text-green-600">
                                        {formatCurrency(plan.items.filter(i => i.status !== 'pending').reduce((acc, i) => acc + i.totalPrice, 0))}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
                                    <div
                                        className="h-full bg-green-500"
                                        style={{ width: `${(plan.items.filter(i => i.status !== 'pending').reduce((acc, i) => acc + i.totalPrice, 0) / plan.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button className="flex items-center justify-center gap-2 p-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                    <Printer size={16} /> Imprimir
                                </button>
                                <button className="flex items-center justify-center gap-2 p-2 border border-blue-200 bg-blue-50 rounded-lg text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
                                    <Share2 size={16} /> Enviar
                                </button>
                            </div>
                        </div>

                        {/* Next Steps / Timeline */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Calendar size={18} className="text-diva-primary" /> Próximas Sessões
                            </h3>

                            <div className="space-y-4">
                                {plan.items.filter(i => (i.status === 'paid' || i.status === 'scheduled') && i.sessionsUsed < i.quantity).length > 0 ? (
                                    plan.items
                                        .filter(i => (i.status === 'paid' || i.status === 'scheduled') && i.sessionsUsed < i.quantity)
                                        .map(item => (
                                            <div key={item.id} className="flex gap-3 items-start p-3 bg-green-50 rounded-lg border border-green-100">
                                                <Clock size={16} className="text-green-600 mt-1" />
                                                <div>
                                                    <p className="font-bold text-sm text-green-900">{item.serviceName}</p>
                                                    <p className="text-xs text-green-700">Disponível: {item.quantity - item.sessionsUsed} sessões</p>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-center py-6 text-gray-400 text-sm">
                                        <AlertTriangle size={24} className="mx-auto mb-2 opacity-50" />
                                        Nenhum crédito disponível.<br />Realize um pagamento.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <NewAppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
                initialData={appointmentInitialData}
            />
        </div>
    );
};

export default PlanDetailsModal;
