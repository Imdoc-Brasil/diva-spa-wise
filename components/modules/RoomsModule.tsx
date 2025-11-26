
import React, { useState } from 'react';
import { ServiceRoom, AppointmentStatus } from '../../types';
import { MapPin, Thermometer, Sun, Wrench, Sparkles, Clock, AlertTriangle, PlayCircle, Grid, List, Plus, Settings, Filter, Trash2, Save, X } from 'lucide-react';
import { useData } from '../context/DataContext';

const RoomsModule: React.FC = () => {
  // Use Global Data instead of Local State
  const { rooms, updateRoomStatus, addRoom, removeRoom } = useData();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  
  // State for new room form
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'treatment' | 'spa' | 'consultation'>('treatment');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'border-green-500 bg-green-50 text-green-700';
      case 'occupied': return 'border-diva-alert bg-red-50 text-diva-alert';
      case 'cleaning': return 'border-orange-400 bg-orange-50 text-orange-700';
      case 'maintenance': return 'border-gray-500 bg-gray-100 text-gray-600';
      default: return 'border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'available': return 'Livre';
      case 'occupied': return 'Ocupada';
      case 'cleaning': return 'Higienização';
      case 'maintenance': return 'Manutenção';
      default: return status;
    }
  };

  const handleAddRoom = () => {
      if(!newRoomName) return;
      const newRoom: ServiceRoom = {
          id: `r_${Date.now()}`,
          name: newRoomName,
          type: newRoomType,
          status: 'available',
          equipments: [],
          ambience: { temperature: 24, lighting: 100 }
      };
      addRoom(newRoom);
      setNewRoomName('');
  };

  const handleDeleteRoom = (id: string) => {
      if(confirm('Tem certeza que deseja remover esta sala?')) {
          removeRoom(id);
      }
  };

  const handleStatusChange = (id: string, newStatus: any) => {
      updateRoomStatus(id, newStatus);
  };

  const filteredRooms = rooms.filter(r => filterStatus === 'all' || r.status === filterStatus);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header Overview */}
      <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 gap-4">
        <div>
            <h2 className="text-xl font-serif text-diva-dark font-bold">Mapa de Salas & Recursos</h2>
            <p className="text-sm text-gray-500">
                {rooms.length} salas configuradas nesta unidade.
            </p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-end">
            {/* View Toggles */}
            <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-400'}`}
                    title="Visualização Detalhada"
                >
                    <Grid size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-400'}`}
                    title="Visualização Compacta"
                >
                    <List size={18} />
                </button>
            </div>

            {/* Filter */}
            <div className="relative flex items-center">
                <Filter size={16} className="absolute left-3 text-gray-400" />
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-diva-primary"
                >
                    <option value="all">Todos os Status</option>
                    <option value="available">Livres</option>
                    <option value="occupied">Ocupadas</option>
                    <option value="cleaning">Higienização</option>
                    <option value="maintenance">Manutenção</option>
                </select>
            </div>

            {/* Edit Mode Toggle */}
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isEditing ? 'bg-diva-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                <Settings size={16} className="mr-2" /> {isEditing ? 'Concluir Edição' : 'Gerenciar Salas'}
            </button>
        </div>
      </div>

      {/* EDIT MODE PANEL */}
      {isEditing && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-wrap gap-4 items-end animate-in slide-in-from-top-2">
              <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Nome da Sala</label>
                  <input 
                    type="text" 
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Ex: Sala 04 - Injetáveis"
                    className="w-full p-2 rounded border border-blue-200 text-sm outline-none focus:border-blue-500"
                  />
              </div>
              <div className="w-48">
                  <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Tipo</label>
                  <select 
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as any)}
                    className="w-full p-2 rounded border border-blue-200 text-sm outline-none focus:border-blue-500 bg-white"
                  >
                      <option value="treatment">Tratamento</option>
                      <option value="spa">Spa / Relax</option>
                      <option value="consultation">Consultório</option>
                  </select>
              </div>
              <button 
                onClick={handleAddRoom}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center"
              >
                  <Plus size={16} className="mr-2" /> Adicionar Sala
              </button>
          </div>
      )}

      {/* ROOMS DISPLAY */}
      <div className="flex-1 overflow-y-auto pb-4">
        
        {viewMode === 'grid' ? (
            /* GRID VIEW (Detailed) */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRooms.map(room => (
                    <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-diva-light/20 transition-all hover:shadow-lg relative group">
                        
                        {isEditing && (
                            <button 
                                onClick={() => handleDeleteRoom(room.id)}
                                className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}

                        {/* Room Header Status Bar */}
                        <div className={`h-2 w-full ${
                            room.status === 'available' ? 'bg-green-500' :
                            room.status === 'occupied' ? 'bg-diva-alert' :
                            room.status === 'cleaning' ? 'bg-orange-400' : 'bg-gray-500'
                        }`}></div>
                        
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-diva-dark flex items-center">
                                        {room.name}
                                    </h3>
                                    <span className="text-xs text-gray-400 uppercase font-medium tracking-wider">{room.type}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(room.status)}`}>
                                    {getStatusLabel(room.status).toUpperCase()}
                                </span>
                            </div>

                            {/* Content based on Status */}
                            <div className="flex-1 min-h-[120px]">
                                {room.status === 'occupied' && room.currentAppointment ? (
                                    <div className="bg-red-50/50 p-4 rounded-lg border border-red-100 h-full">
                                        <p className="text-xs font-bold text-diva-alert uppercase mb-2 flex items-center">
                                            <PlayCircle size={12} className="mr-1 animate-pulse" /> Em Atendimento
                                        </p>
                                        <p className="font-bold text-diva-dark">{room.currentAppointment.clientName}</p>
                                        <p className="text-sm text-gray-600 mb-1">{room.currentAppointment.serviceName}</p>
                                        <div className="flex items-center text-xs text-gray-500 mt-2">
                                            <Clock size={12} className="mr-1" />
                                            <span>Termina às {new Date(room.currentAppointment.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <div className="w-full bg-red-200 h-1 rounded-full mt-3 overflow-hidden">
                                            <div className="bg-red-500 h-full w-[60%]"></div>
                                        </div>
                                    </div>
                                ) : room.status === 'cleaning' ? (
                                    <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 flex flex-col items-center justify-center h-full text-orange-400">
                                        <Sparkles size={32} className="mb-2" />
                                        <span className="text-sm font-medium">Aguardando Higienização</span>
                                        <button 
                                            onClick={() => handleStatusChange(room.id, 'available')}
                                            className="mt-2 text-xs bg-white border border-orange-200 text-orange-600 px-3 py-1 rounded hover:bg-orange-100 shadow-sm"
                                        >
                                            Marcar como Limpo
                                        </button>
                                    </div>
                                ) : room.status === 'maintenance' ? (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col items-center justify-center h-full text-gray-400">
                                        <Wrench size={32} className="mb-2" />
                                        <span className="text-sm font-medium">Manutenção Técnica</span>
                                        <button 
                                            onClick={() => handleStatusChange(room.id, 'available')}
                                            className="mt-2 text-xs bg-white border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-100"
                                        >
                                            Reativar Sala
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 h-full flex flex-col justify-center items-center">
                                        <p className="text-sm text-green-800 font-medium text-center flex items-center">
                                            <MapPin size={16} className="mr-1" /> Sala Disponível
                                        </p>
                                        {room.nextAppointmentTime && (
                                            <p className="text-xs text-green-600 text-center mt-1">
                                                Próximo: {room.nextAppointmentTime}
                                            </p>
                                        )}
                                        <div className="flex gap-2 mt-3">
                                            <button onClick={() => handleStatusChange(room.id, 'cleaning')} className="text-[10px] bg-white border border-green-200 px-2 py-1 rounded hover:bg-green-50 text-green-700">
                                                Limpar
                                            </button>
                                            <button onClick={() => handleStatusChange(room.id, 'maintenance')} className="text-[10px] bg-white border border-green-200 px-2 py-1 rounded hover:bg-green-50 text-green-700">
                                                Manutenção
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Equipments List */}
                            <div className="mt-4 pt-4 border-t border-diva-light/20">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Equipamentos</p>
                                    {room.equipments.length > 0 && (
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded">{room.equipments.length}</span>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {room.equipments.length > 0 ? room.equipments.map(eq => (
                                        <div key={eq.id} className="flex justify-between items-center text-xs">
                                            <span className="text-gray-600 flex items-center">
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${eq.status === 'operational' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                {eq.name}
                                            </span>
                                            {eq.status === 'maintenance' && (
                                                <span title="Manutenção Necessária">
                                                    <AlertTriangle size={12} className="text-yellow-500" />
                                                </span>
                                            )}
                                        </div>
                                    )) : (
                                        <span className="text-xs text-gray-300 italic">Nenhum equipamento fixo</span>
                                    )}
                                </div>
                            </div>

                            {/* Ambience Controls */}
                            <div className="mt-4 bg-diva-dark rounded-lg p-3 text-white flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                        <Thermometer size={14} className="text-diva-accent" />
                                        <span className="text-xs font-mono">{room.ambience.temperature}°C</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Sun size={14} className="text-yellow-400" />
                                        <span className="text-xs font-mono">{room.ambience.lighting}%</span>
                                    </div>
                                </div>
                                <div className="text-[10px] text-diva-light truncate max-w-[100px]">
                                    {room.ambience.music || 'Sem áudio'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            /* LIST VIEW (Compact for Scalability) */
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4 w-1/4">Sala</th>
                            <th className="px-6 py-4 w-1/4">Status</th>
                            <th className="px-6 py-4 w-1/4">Atividade Atual</th>
                            <th className="px-6 py-4 w-1/4 text-right">Ações Rápidas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredRooms.map(room => (
                            <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${
                                            room.status === 'available' ? 'bg-green-500' :
                                            room.status === 'occupied' ? 'bg-diva-alert' :
                                            room.status === 'cleaning' ? 'bg-orange-400' : 'bg-gray-500'
                                        }`}></div>
                                        <div>
                                            <p className="font-bold text-diva-dark">{room.name}</p>
                                            <p className="text-xs text-gray-500">{room.type} • {room.equipments.length} eqps</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getStatusColor(room.status)}`}>
                                        {getStatusLabel(room.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {room.status === 'occupied' && room.currentAppointment ? (
                                        <div>
                                            <p className="font-medium text-diva-dark">{room.currentAppointment.clientName}</p>
                                            <p className="text-xs text-gray-500">{room.currentAppointment.serviceName}</p>
                                        </div>
                                    ) : room.status === 'available' && room.nextAppointmentTime ? (
                                        <p className="text-xs text-green-600 flex items-center">
                                            <Clock size={12} className="mr-1" /> Próximo: {room.nextAppointmentTime}
                                        </p>
                                    ) : (
                                        <span className="text-gray-400 text-xs">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        {room.status === 'cleaning' && (
                                            <button onClick={() => handleStatusChange(room.id, 'available')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Liberar Sala">
                                                <Sparkles size={16} />
                                            </button>
                                        )}
                                        {room.status === 'available' && (
                                            <button onClick={() => handleStatusChange(room.id, 'cleaning')} className="p-1.5 bg-orange-100 text-orange-700 rounded hover:bg-orange-200" title="Enviar p/ Limpeza">
                                                <Sparkles size={16} />
                                            </button>
                                        )}
                                        {isEditing && (
                                            <button onClick={() => handleDeleteRoom(room.id)} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Excluir Sala">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default RoomsModule;
