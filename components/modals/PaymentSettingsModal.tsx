
import React, { useState } from 'react';
import { X, CreditCard, Plus, Trash2, Edit2, Settings, Smartphone, Globe, Info } from 'lucide-react';
import { PaymentGateway } from '../../types';
import { useData } from '../context/DataContext';

interface PaymentSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaymentSettingsModal: React.FC<PaymentSettingsModalProps> = ({ isOpen, onClose }) => {
    // Mock Data for UI Dev - Later move to Context
    const [gateways, setGateways] = useState<PaymentGateway[]>([
        {
            id: 'gw_stone_rec',
            name: 'Stone - Recepção',
            type: 'physical_pos',
            provider: 'stone',
            active: true,
            fees: {
                debit: 1.25,
                credit_1x: 2.89,
                credit_2x_6x: 3.59,
                credit_7x_12x: 4.19,
                pix: 0,
                pix_type: 'percentage'
            },
            settlementDays: { debit: 1, credit: 1, pix: 0 } // Antecipado
        },
        {
            id: 'gw_infinitepay',
            name: 'InfinitePay - Dra. Julia',
            type: 'physical_pos',
            provider: 'infinitepay',
            active: true,
            fees: {
                debit: 1.38,
                credit_1x: 2.90,
                credit_2x_6x: 3.90,
                credit_7x_12x: 4.90,
                pix: 0,
                pix_type: 'percentage'
            },
            settlementDays: { debit: 1, credit: 1, pix: 0 }
        }
    ]);

    const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Initial State for New Gateway
    const initialGatewayState: PaymentGateway = {
        id: '',
        name: '',
        type: 'physical_pos',
        provider: 'stone',
        active: true,
        fees: {
            debit: 0,
            credit_1x: 0,
            credit_2x_6x: 0,
            credit_7x_12x: 0,
            pix: 0,
            pix_type: 'percentage'
        },
        settlementDays: { debit: 1, credit: 30, pix: 0 }
    };

    if (!isOpen) return null;

    const handleSave = () => {
        if (!editingGateway) return;

        if (editingGateway.id) {
            // Update
            setGateways(gateways.map(g => g.id === editingGateway.id ? editingGateway : g));
        } else {
            // Create
            const newGw = { ...editingGateway, id: `gw_${Date.now()}` };
            setGateways([...gateways, newGw]);
        }
        setIsEditing(false);
        setEditingGateway(null);
    };

    const getProviderIcon = (provider: string) => {
        // Simplified icon logic
        switch (provider) {
            case 'stone': return <span className="bg-green-600 text-white text-[10px] font-bold px-1 py-0.5 rounded">STONE</span>;
            case 'infinitepay': return <span className="bg-black text-white text-[10px] font-bold px-1 py-0.5 rounded">∞ PAY</span>;
            case 'asaas': return <span className="bg-blue-600 text-white text-[10px] font-bold px-1 py-0.5 rounded">ASAAS</span>;
            default: return <CreditCard size={16} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-diva-dark text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Settings size={24} /> Configuração de Pagamentos
                        </h2>
                        <p className="text-white/70 text-sm mt-1">Gerencie suas maquininhas, gateways online e taxas.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar / List */}
                    <div className={`w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 ${isEditing ? 'hidden md:block' : 'w-full md:w-1/3'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-700">Gateways & Maquininhas</h3>
                            <button
                                onClick={() => {
                                    setEditingGateway(initialGatewayState);
                                    setIsEditing(true);
                                }}
                                className="p-2 bg-diva-primary text-white rounded-lg hover:bg-diva-dark transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {gateways.map(gw => (
                                <div
                                    key={gw.id}
                                    onClick={() => {
                                        setEditingGateway(gw);
                                        setIsEditing(true);
                                    }}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${editingGateway?.id === gw.id
                                            ? 'bg-white border-diva-primary shadow-sm ring-1 ring-diva-primary'
                                            : 'bg-white border-gray-200 hover:border-diva-primary/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {gw.type === 'physical_pos' ? <Smartphone size={16} className="text-gray-400" /> : <Globe size={16} className="text-blue-400" />}
                                            <span className="font-bold text-diva-dark text-sm">{gw.name}</span>
                                        </div>
                                        {gw.active ? (
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        ) : (
                                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            {getProviderIcon(gw.provider)}
                                        </div>
                                        <span>Débito: {gw.fees.debit}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Edit Form */}
                    {isEditing && editingGateway ? (
                        <div className="flex-1 overflow-y-auto p-6 bg-white animate-in slide-in-from-right-4">
                            <h3 className="text-xl font-bold text-diva-dark mb-6">
                                {editingGateway.id ? 'Editar Gateway' : 'Novo Gateway'}
                            </h3>

                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome de Identificação</label>
                                        <input
                                            type="text"
                                            value={editingGateway.name}
                                            onChange={e => setEditingGateway({ ...editingGateway, name: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            placeholder="Ex: Maquininha Recepção"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Provedor</label>
                                        <select
                                            value={editingGateway.provider}
                                            onChange={e => setEditingGateway({ ...editingGateway, provider: e.target.value as any })}
                                            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                                        >
                                            <option value="stone">Stone</option>
                                            <option value="infinitepay">InfinitePay</option>
                                            <option value="cielo">Cielo</option>
                                            <option value="rede">Rede</option>
                                            <option value="pagseguro">PagSeguro</option>
                                            <option value="asaas">Asaas (Online)</option>
                                            <option value="stripe">Stripe (Online)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingGateway({ ...editingGateway, type: 'physical_pos' })}
                                                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${editingGateway.type === 'physical_pos' ? 'bg-diva-primary text-white border-diva-primary' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                            >
                                                Maquininha Física
                                            </button>
                                            <button
                                                onClick={() => setEditingGateway({ ...editingGateway, type: 'online_api' })}
                                                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${editingGateway.type === 'online_api' ? 'bg-diva-primary text-white border-diva-primary' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                            >
                                                API Online
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                        <div className="flex items-center gap-3 py-2">
                                            <span className={`text-sm font-medium ${editingGateway.active ? 'text-green-600' : 'text-gray-400'}`}>
                                                {editingGateway.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                            <button
                                                onClick={() => setEditingGateway({ ...editingGateway, active: !editingGateway.active })}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${editingGateway.active ? 'bg-green-500' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${editingGateway.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Fees Configuration */}
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                        <Settings size={18} className="mr-2 text-diva-primary" /> Taxas Administrativas (MDR)
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Débito (%)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editingGateway.fees.debit}
                                                onChange={e => setEditingGateway({ ...editingGateway, fees: { ...editingGateway.fees, debit: Number(e.target.value) } })}
                                                className="w-full bg-transparent font-bold text-diva-dark outline-none"
                                            />
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Crédito 1x (%)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editingGateway.fees.credit_1x}
                                                onChange={e => setEditingGateway({ ...editingGateway, fees: { ...editingGateway.fees, credit_1x: Number(e.target.value) } })}
                                                className="w-full bg-transparent font-bold text-diva-dark outline-none"
                                            />
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Crédito 2x-6x (%)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editingGateway.fees.credit_2x_6x}
                                                onChange={e => setEditingGateway({ ...editingGateway, fees: { ...editingGateway.fees, credit_2x_6x: Number(e.target.value) } })}
                                                className="w-full bg-transparent font-bold text-diva-dark outline-none"
                                            />
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Crédito 7x-12x (%)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editingGateway.fees.credit_7x_12x}
                                                onChange={e => setEditingGateway({ ...editingGateway, fees: { ...editingGateway.fees, credit_7x_12x: Number(e.target.value) } })}
                                                className="w-full bg-transparent font-bold text-diva-dark outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Settlement Days */}
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                        <Settings size={18} className="mr-2 text-diva-primary" /> Prazo de Recebimento (Dias)
                                    </h4>
                                    <div className="flex gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100 text-sm text-blue-800 mb-4 items-start">
                                        <Info size={16} className="mt-0.5 flex-shrink-0" />
                                        <p>Defina em quantos dias o dinheiro cai na conta. Use "1" para antecipação automática.</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Débito</label>
                                            <input
                                                type="number"
                                                value={editingGateway.settlementDays.debit}
                                                onChange={e => setEditingGateway({ ...editingGateway, settlementDays: { ...editingGateway.settlementDays, debit: Number(e.target.value) } })}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Crédito</label>
                                            <input
                                                type="number"
                                                value={editingGateway.settlementDays.credit}
                                                onChange={e => setEditingGateway({ ...editingGateway, settlementDays: { ...editingGateway.settlementDays, credit: Number(e.target.value) } })}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingGateway(null);
                                    }}
                                    className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-diva-primary text-white font-bold rounded-lg hover:bg-diva-dark transition-colors shadow-lg shadow-diva-primary/20"
                                >
                                    Salvar Configuração
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 hidden md:flex">
                            <CreditCard size={64} className="mb-4 opacity-20" />
                            <p className="font-medium">Selecione um gateway para editar ou adicione um novo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSettingsModal;
