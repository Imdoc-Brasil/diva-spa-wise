import React, { useState } from 'react';
import { ServiceRoom } from '../../types';
import { X, Plus, Trash2, Wrench, CheckCircle, AlertTriangle, Save, QrCode, Calendar, Printer, Search, Image as ImageIcon, Box } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

interface EquipmentManagementModalProps {
    room: ServiceRoom;
    isOpen: boolean;
    onClose: () => void;
    onSave: (roomId: string, equipments: any[]) => void;
}

interface Equipment {
    id: string;
    name: string;
    status: 'operational' | 'maintenance';
    serialNumber: string;
    manufacturer: string;
    anvisaRecord?: string;
    lastMaintenance: string;
    nextMaintenance?: string;
    photoUrl?: string;
}

const EquipmentManagementModal: React.FC<EquipmentManagementModalProps> = ({ room, isOpen, onClose, onSave }) => {
    const { addToast } = useToast();
    const [equipments, setEquipments] = useState<Equipment[]>(
        (room.equipments || []).map((eq: any) => ({
            id: eq.id,
            name: eq.name,
            status: eq.status || 'operational',
            serialNumber: eq.serialNumber || '',
            manufacturer: eq.manufacturer || '',
            anvisaRecord: eq.anvisaRecord || '',
            lastMaintenance: eq.lastMaintenance || new Date().toISOString(),
            nextMaintenance: eq.nextMaintenance,
            photoUrl: eq.photoUrl
        }))
    );

    const [view, setView] = useState<'list' | 'add'>('list');

    // Form State
    const [newEq, setNewEq] = useState<Partial<Equipment>>({
        name: '',
        status: 'operational',
        serialNumber: '',
        manufacturer: '',
        anvisaRecord: '',
        lastMaintenance: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const handleAddEquipment = () => {
        if (!newEq.name) {
            addToast('Nome do equipamento é obrigatório.', 'error');
            return;
        }

        const equipment: Equipment = {
            id: `eq_${Date.now()}`,
            name: newEq.name || 'Novo Equipamento',
            status: newEq.status as 'operational' | 'maintenance',
            serialNumber: newEq.serialNumber || `SN-${Math.floor(Math.random() * 10000)}`,
            manufacturer: newEq.manufacturer || 'Generico',
            anvisaRecord: newEq.anvisaRecord || '',
            lastMaintenance: newEq.lastMaintenance || new Date().toISOString(),
            nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        };

        setEquipments([...equipments, equipment]);
        setNewEq({ name: '', status: 'operational', serialNumber: '', manufacturer: '', anvisaRecord: '', lastMaintenance: new Date().toISOString().split('T')[0] });
        setView('list');
        addToast('Equipamento adicionado com sucesso.', 'success');
    };

    const handleRemoveEquipment = (id: string) => {
        if (confirm('Remover este equipamento permanentemente?')) {
            setEquipments(equipments.filter(eq => eq.id !== id));
            addToast('Equipamento removido.', 'info');
        }
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
        try {
            return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' });
        } catch { return dateStr; }
    };

    const handlePrintQr = (eqName: string) => {
        addToast(`Imprimindo etiqueta QR para ${eqName}...`, 'info');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-diva-dark/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">

                {/* Header */}
                <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-diva-primary/10 text-diva-primary p-1.5 rounded-lg">
                                <Box size={20} />
                            </span>
                            <h3 className="text-xl font-serif font-bold text-diva-dark">Gestão de Ativos</h3>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center">
                            Localização: <span className="font-bold text-diva-dark ml-1">{room.name}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-gray-50">

                    {/* Sidebar / List */}
                    <div className="w-full md:w-1/3 border-r border-gray-200 bg-white flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <p className="text-xs font-bold text-gray-500 uppercase">{equipments.length} Equipamentos</p>
                            <button
                                onClick={() => setView('add')}
                                className="text-xs bg-diva-dark text-white px-3 py-1.5 rounded-lg font-bold hover:bg-black transition-colors flex items-center"
                            >
                                <Plus size={14} className="mr-1" /> Novo
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {equipments.length === 0 ? (
                                <div className="text-center py-10 opacity-50">
                                    <Box size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-xs text-gray-400">Nenhum equipamento.</p>
                                </div>
                            ) : (
                                equipments.map(eq => (
                                    <div
                                        key={eq.id}
                                        className="p-3 rounded-xl border border-gray-100 bg-white hover:border-diva-primary/30 hover:shadow-sm transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-sm text-diva-dark leading-tight">{eq.name}</h4>
                                            {eq.status === 'operational' ?
                                                <CheckCircle size={14} className="text-green-500 shrink-0" /> :
                                                <AlertTriangle size={14} className="text-yellow-500 shrink-0" />
                                            }
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-mono mb-2">{eq.serialNumber || 'S/N'}</p>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{eq.manufacturer || 'Geral'}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handlePrintQr(eq.name); }}
                                                className="text-gray-300 hover:text-diva-primary transition-colors"
                                                title="Imprimir QR Code"
                                            >
                                                <QrCode size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Detail / Form Area */}
                    <div className="flex-1 p-6 overflow-y-auto w-full">
                        {view === 'add' ? (
                            <div className="max-w-md mx-auto animate-in slide-in-from-right-4 duration-300">
                                <h4 className="text-lg font-bold text-diva-dark mb-6 flex items-center">
                                    <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-2"><Plus size={18} /></span>
                                    Cadastrar Equipamento
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Equipamento</label>
                                        <input
                                            type="text"
                                            value={newEq.name}
                                            onChange={e => setNewEq({ ...newEq, name: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-diva-primary/20 outline-none"
                                            placeholder="Ex: Laser Galaxy 808"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fabricante</label>
                                            <input
                                                type="text"
                                                value={newEq.manufacturer}
                                                onChange={e => setNewEq({ ...newEq, manufacturer: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-diva-primary"
                                                placeholder="Ex: Alma Lasers"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número de Série</label>
                                            <input
                                                type="text"
                                                value={newEq.serialNumber}
                                                onChange={e => setNewEq({ ...newEq, serialNumber: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-diva-primary font-mono text-sm"
                                                placeholder="SN-123456"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Registro ANVISA</label>
                                            <input
                                                type="text"
                                                value={newEq.anvisaRecord}
                                                onChange={e => setNewEq({ ...newEq, anvisaRecord: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-diva-primary font-mono text-sm"
                                                placeholder="80020000123"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Última Revisão</label>
                                            <input
                                                type="date"
                                                value={newEq.lastMaintenance}
                                                onChange={e => setNewEq({ ...newEq, lastMaintenance: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-diva-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status Inicial</label>
                                            <select
                                                value={newEq.status}
                                                onChange={e => setNewEq({ ...newEq, status: e.target.value as any })}
                                                className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-white"
                                            >
                                                <option value="operational">Operacional</option>
                                                <option value="maintenance">Em Manutenção</option>
                                            </select>
                                        </div>
                                        {/* Next Maintenance field could go here if needed */}
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            onClick={() => setView('list')}
                                            className="flex-1 py-3 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleAddEquipment}
                                            className="flex-1 py-3 bg-diva-primary text-white font-bold rounded-xl hover:bg-diva-dark shadow-lg transition-all"
                                        >
                                            Salvar Ativo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Detail View (Grid of Cards) */
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Inventário da Sala</h4>
                                    <div className="relative">
                                        <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Buscar..." className="pl-7 pr-3 py-1 text-xs border border-gray-200 rounded-full outline-none focus:border-diva-primary w-32" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {equipments.map(eq => (
                                        <div key={eq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                                            <div className={`h-2 w-full ${eq.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h5 className="font-bold text-diva-dark text-lg">{eq.name}</h5>
                                                        <p className="text-xs text-gray-400 font-medium">{eq.manufacturer || 'Fabricante N/A'}</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-diva-primary/10 group-hover:text-diva-primary transition-colors">
                                                        <ImageIcon size={16} />
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex justify-between text-xs border-b border-gray-50 pb-1">
                                                        <span className="text-gray-400">Patrimônio / SN</span>
                                                        <span className="font-mono text-gray-600">{eq.serialNumber || '-'}</span>
                                                    </div>
                                                    {eq.anvisaRecord && (
                                                        <div className="flex justify-between text-xs border-b border-gray-50 pb-1">
                                                            <span className="text-gray-400">ANVISA</span>
                                                            <span className="font-mono text-blue-600 font-bold">{eq.anvisaRecord}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-xs border-b border-gray-50 pb-1">
                                                        <span className="text-gray-400">Status</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${eq.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {eq.status === 'operational' ? 'Operacional' : 'Manutenção'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-400">Próx. Revisão</span>
                                                        <span className="flex items-center text-gray-600">
                                                            <Calendar size={10} className="mr-1" />
                                                            {formatDate(eq.nextMaintenance || '')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(eq.id)}
                                                        className="flex-1 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
                                                    >
                                                        <Wrench size={14} className="mr-1" />
                                                        {eq.status === 'operational' ? 'Reportar Erro' : 'Finalizar Reparo'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveEquipment(eq.id)}
                                                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                        title="Remover"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Quick Add Card */}
                                    <button
                                        onClick={() => setView('add')}
                                        className="rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-diva-primary hover:text-diva-primary hover:bg-diva-primary/5 transition-all min-h-[160px]"
                                    >
                                        <Plus size={32} className="mb-2 opacity-50" />
                                        <span className="text-sm font-bold">Adicionar Equipamento</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center">
                    <button
                        onClick={() => addToast('Relatório de inventário gerado (PDF)', 'success')}
                        className="text-gray-500 hover:text-diva-dark text-sm font-medium flex items-center px-4"
                    >
                        <Printer size={16} className="mr-2" /> Imprimir Inventário
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 rounded-xl bg-diva-dark text-white font-bold hover:bg-black shadow-lg flex items-center"
                        >
                            <Save size={18} className="mr-2" /> Salvar Tudo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentManagementModal;
