
import React, { useState } from 'react';
import { Asset, MaintenanceRecord, AssetStatus } from '../../types';
import { Wrench, AlertTriangle, CheckCircle, Activity, Calendar, PenTool, Plus, Search, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

const mockAssets: Asset[] = [
    { 
        id: 'a1', name: 'Laser Galaxy 808 (Ponteira A)', serialNumber: 'SN-998877', 
        purchaseDate: '2022-05-10', warrantyExpires: '2024-05-10', supplierId: 'sup1', 
        status: 'operational', totalShots: 2500000, maxShots: 5000000, 
        lastMaintenance: '2023-08-15', nextMaintenance: '2023-11-15', location: 'Sala 01' 
    },
    { 
        id: 'a2', name: 'Laser Galaxy 808 (Ponteira B)', serialNumber: 'SN-998878', 
        purchaseDate: '2022-05-10', warrantyExpires: '2024-05-10', supplierId: 'sup1', 
        status: 'warning', totalShots: 4800000, maxShots: 5000000, 
        lastMaintenance: '2023-06-10', nextMaintenance: '2023-10-20', location: 'Sala 01' 
    },
    { 
        id: 'a3', name: 'Criofrequência Body', serialNumber: 'CF-112233', 
        purchaseDate: '2023-01-20', warrantyExpires: '2025-01-20', supplierId: 'sup2', 
        status: 'operational', totalShots: 500, maxShots: 10000, // Hours instead of shots for Crio
        lastMaintenance: '2023-07-01', nextMaintenance: '2024-01-01', location: 'Sala 03' 
    },
    { 
        id: 'a4', name: 'Autoclave XP', serialNumber: 'AT-555', 
        purchaseDate: '2021-11-15', warrantyExpires: '2022-11-15', supplierId: 'sup3', 
        status: 'maintenance', totalShots: 0, maxShots: 0, 
        lastMaintenance: '2023-09-01', nextMaintenance: '2023-10-28', location: 'Esterilização' 
    },
];

const mockMaintenance: MaintenanceRecord[] = [
    { id: 'm1', assetId: 'a4', assetName: 'Autoclave XP', date: '2023-10-28', type: 'corrective', technician: 'Carlos Tec', cost: 450, notes: 'Troca da borracha de vedação', status: 'scheduled' },
    { id: 'm2', assetId: 'a1', assetName: 'Laser Galaxy 808', date: '2023-08-15', type: 'preventive', technician: 'LaserFix', cost: 1200, notes: 'Calibração de energia e limpeza de filtros', status: 'completed' },
];

const AssetsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'maintenance'>('assets');

  const getStatusColor = (status: AssetStatus) => {
      switch(status) {
          case 'operational': return 'text-green-600 bg-green-100';
          case 'warning': return 'text-orange-600 bg-orange-100';
          case 'critical': return 'text-red-600 bg-red-100';
          case 'maintenance': return 'text-gray-600 bg-gray-200';
      }
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('pt-BR').format(num);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Ativos Totais</p>
                    <h3 className="text-3xl font-bold text-diva-dark">{mockAssets.length}</h3>
                </div>
                <div className="w-12 h-12 bg-diva-light/20 rounded-full flex items-center justify-center text-diva-dark">
                    <Activity size={24} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Em Manutenção</p>
                    <h3 className="text-3xl font-bold text-gray-600">{mockAssets.filter(a => a.status === 'maintenance').length}</h3>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <Wrench size={24} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Alertas Críticos</p>
                    <h3 className="text-3xl font-bold text-diva-alert">{mockAssets.filter(a => a.status === 'warning' || a.status === 'critical').length}</h3>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-diva-alert animate-pulse">
                    <AlertTriangle size={24} />
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
            
            {/* Tabs */}
            <div className="border-b border-diva-light/20 px-6 pt-4 flex space-x-6">
                <button 
                    onClick={() => setActiveTab('assets')}
                    className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'assets' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                >
                    <PenTool size={16} className="mr-2" /> Equipamentos
                </button>
                <button 
                    onClick={() => setActiveTab('maintenance')}
                    className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'maintenance' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                >
                    <Calendar size={16} className="mr-2" /> Agenda de Manutenção
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                
                {activeTab === 'assets' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input type="text" placeholder="Buscar equipamento..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none" />
                            </div>
                            <button className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark transition-colors shadow-sm">
                                <Plus size={18} className="mr-2" /> Novo Equipamento
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {mockAssets.map(asset => {
                                const lifespan = asset.maxShots > 0 ? (asset.totalShots / asset.maxShots) * 100 : 0;
                                return (
                                    <div key={asset.id} className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(asset.status)}`}>
                                                        {asset.status === 'operational' ? 'Operacional' : asset.status === 'warning' ? 'Atenção' : asset.status === 'maintenance' ? 'Em Manutenção' : 'Crítico'}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{asset.location}</span>
                                                </div>
                                                <h3 className="font-bold text-diva-dark text-lg">{asset.name}</h3>
                                                <p className="text-xs text-gray-500 font-mono">S/N: {asset.serialNumber}</p>
                                            </div>
                                            <button className="text-gray-400 hover:text-diva-dark p-1 rounded hover:bg-gray-100">
                                                <Wrench size={18} />
                                            </button>
                                        </div>

                                        {asset.maxShots > 0 && (
                                            <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">Vida Útil (Disparos)</span>
                                                    <span className="text-sm font-mono font-bold text-diva-dark">
                                                        {formatNumber(asset.totalShots)} <span className="text-gray-400 text-xs font-normal">/ {formatNumber(asset.maxShots)}</span>
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-1000 ${lifespan > 90 ? 'bg-red-500' : lifespan > 70 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                        style={{ width: `${lifespan}%` }}
                                                    ></div>
                                                </div>
                                                {lifespan > 90 && (
                                                    <p className="text-[10px] text-red-500 mt-1 font-bold flex items-center">
                                                        <AlertTriangle size={10} className="mr-1" /> Troca de ponteira recomendada
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 text-xs border-t border-gray-100 pt-4">
                                            <div>
                                                <p className="text-gray-400">Última Manutenção</p>
                                                <p className="font-bold text-diva-dark flex items-center">
                                                    <CheckCircle size={12} className="mr-1 text-green-500" />
                                                    {new Date(asset.lastMaintenance).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Próxima Manutenção</p>
                                                <p className={`font-bold flex items-center ${asset.status === 'warning' ? 'text-orange-600' : 'text-diva-primary'}`}>
                                                    <Clock size={12} className="mr-1" />
                                                    {new Date(asset.nextMaintenance).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'maintenance' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-diva-dark text-lg">Agenda Técnica</h3>
                                <p className="text-sm text-gray-500">Histórico e previsões de intervenções.</p>
                            </div>
                            <button className="bg-white border border-diva-dark text-diva-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">
                                Agendar Visita Técnica
                            </button>
                        </div>

                        <div className="bg-white rounded-xl border border-diva-light/30 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Equipamento</th>
                                        <th className="px-6 py-4">Tipo</th>
                                        <th className="px-6 py-4">Técnico</th>
                                        <th className="px-6 py-4 text-right">Custo</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {mockMaintenance.map(rec => (
                                        <tr key={rec.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-mono text-gray-600">{new Date(rec.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold text-diva-dark">{rec.assetName}</td>
                                            <td className="px-6 py-4 capitalize">{rec.type === 'preventive' ? 'Preventiva' : 'Corretiva'}</td>
                                            <td className="px-6 py-4 text-gray-600">{rec.technician}</td>
                                            <td className="px-6 py-4 text-right font-mono">R$ {rec.cost.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${rec.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {rec.status === 'completed' ? 'Concluído' : 'Agendado'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default AssetsModule;
