import React, { useState } from 'react';
import { ServiceRoom } from '../../types';
import { X, Plus, Trash2, Wrench, CheckCircle, AlertTriangle, Save } from 'lucide-react';

interface EquipmentManagementModalProps {
    room: ServiceRoom;
    isOpen: boolean;
    onClose: () => void;
    onSave: (roomId: string, equipments: any[]) => void;
}

const EquipmentManagementModal: React.FC<EquipmentManagementModalProps> = ({ room, isOpen, onClose, onSave }) => {
    const [equipments, setEquipments] = useState(room.equipments || []);
    const [newEquipmentName, setNewEquipmentName] = useState('');
    const [newEquipmentStatus, setNewEquipmentStatus] = useState<'operational' | 'maintenance'>('operational');

    if (!isOpen) return null;

    const handleAddEquipment = () => {
        if (!newEquipmentName.trim()) return;

        const newEquipment = {
            id: `eq_${Date.now()}`,
            name: newEquipmentName,
            status: newEquipmentStatus,
            lastMaintenance: new Date().toISOString(),
            nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
        };

        setEquipments([...equipments, newEquipment]);
        setNewEquipmentName('');
        setNewEquipmentStatus('operational');
    };

    const handleRemoveEquipment = (id: string) => {
        setEquipments(equipments.filter(eq => eq.id !== id));
    };

    const handleToggleStatus = (id: string) => {
        setEquipments(equipments.map(eq => {
            if (eq.id === id) {
                const newStatus = eq.status === 'operational' ? 'maintenance' : 'operational';
                return {
                    ...eq,
                    status: newStatus,
                    lastMaintenance: newStatus === 'operational' ? new Date().toISOString() : eq.lastMaintenance
                };
            }
            return eq;
        }));
    };

    const handleSave = () => {
        onSave(room.id, equipments);
        onClose();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-diva-dark text-white p-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">Gerenciar Equipamentos</h3>
                        <p className="text-sm text-diva-light opacity-80">{room.name}</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Add Equipment Form */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <h4 className="text-sm font-bold text-blue-800 uppercase mb-3">Adicionar Equipamento</h4>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newEquipmentName}
                                onChange={(e) => setNewEquipmentName(e.target.value)}
                                placeholder="Ex: Laser Candela GentleMax Pro"
                                className="flex-1 p-2 border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={newEquipmentStatus}
                                onChange={(e) => setNewEquipmentStatus(e.target.value as any)}
                                className="p-2 border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="operational">Operacional</option>
                                <option value="maintenance">Manutenção</option>
                            </select>
                            <button
                                onClick={handleAddEquipment}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center whitespace-nowrap"
                            >
                                <Plus size={16} className="mr-1" /> Adicionar
                            </button>
                        </div>
                    </div>

                    {/* Equipment List */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase">
                            Equipamentos Cadastrados ({equipments.length})
                        </h4>

                        {equipments.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Wrench size={48} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Nenhum equipamento cadastrado nesta sala</p>
                            </div>
                        ) : (
                            equipments.map(eq => (
                                <div
                                    key={eq.id}
                                    className={`p-4 rounded-xl border-2 transition-all ${eq.status === 'operational'
                                            ? 'border-green-200 bg-green-50/50'
                                            : 'border-yellow-200 bg-yellow-50/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h5 className="font-bold text-diva-dark flex items-center">
                                                {eq.status === 'operational' ? (
                                                    <CheckCircle size={16} className="text-green-600 mr-2" />
                                                ) : (
                                                    <AlertTriangle size={16} className="text-yellow-600 mr-2" />
                                                )}
                                                {eq.name}
                                            </h5>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {eq.status === 'operational' ? 'Funcionando normalmente' : 'Requer manutenção'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(eq.id)}
                                                className={`p-2 rounded-lg text-xs font-bold transition-colors ${eq.status === 'operational'
                                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                                title={eq.status === 'operational' ? 'Marcar para manutenção' : 'Marcar como operacional'}
                                            >
                                                {eq.status === 'operational' ? <Wrench size={14} /> : <CheckCircle size={14} />}
                                            </button>
                                            <button
                                                onClick={() => handleRemoveEquipment(eq.id)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                title="Remover equipamento"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Maintenance Info */}
                                    {eq.lastMaintenance && (
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <span className="text-gray-500">Última Manutenção:</span>
                                                <p className="font-medium text-gray-700">{formatDate(eq.lastMaintenance)}</p>
                                            </div>
                                            {eq.nextMaintenance && (
                                                <div>
                                                    <span className="text-gray-500">Próxima Manutenção:</span>
                                                    <p className="font-medium text-gray-700">{formatDate(eq.nextMaintenance)}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark shadow-md flex items-center"
                    >
                        <Save size={16} className="mr-2" /> Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentManagementModal;
