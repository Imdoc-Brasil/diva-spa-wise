
import React, { useState } from 'react';
import { SalesLead, LeadStage, Client } from '../../types';
import { Filter, Plus, MoreHorizontal, MessageCircle, Instagram, Globe, Users, TrendingUp, X, Save, UserPlus, Search, Phone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import LeadModal from '../modals/LeadModal';

const channelData = [
  { name: 'Instagram', value: 45, color: '#E1306C' },
  { name: 'WhatsApp', value: 25, color: '#25D366' },
  { name: 'Indicação', value: 20, color: '#BF784E' },
  { name: 'Site/Google', value: 10, color: '#4285F4' },
];

const conversionData = [
  { stage: 'Leads', count: 120 },
  { stage: 'Contatos', count: 85 },
  { stage: 'Agendados', count: 45 },
  { stage: 'Vendas', count: 28 },
];

const FunnelModule: React.FC = () => {
  const { leads, addLead, updateLeadStage, clients } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<SalesLead | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'instagram': return <Instagram size={12} />;
      case 'whatsapp': return <MessageCircle size={12} />;
      case 'website': return <Globe size={12} />;
      case 'referral': return <Users size={12} />;
      default: return <Globe size={12} />;
    }
  };

  const formatRelativeTime = (isoString: string) => {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `${diffMins}m atrás`;
      if (diffHours < 24) return `${diffHours}h atrás`;
      if (diffDays === 1) return 'Ontem';
      return `${diffDays}d atrás`;
  };

  const handleOpenModal = (lead?: SalesLead) => {
      setEditingLead(lead || null);
      setIsModalOpen(true);
  };

  const handleSaveLead = (leadData: Partial<SalesLead>) => {
      if (editingLead) {
          // Update logic (Note: Context needs an update method for full lead object, using stage update for now + manual mutation mock for other fields if context lacks method)
          // In real app, we'd have updateLead(id, data) in context.
          // For now, we just update stage if changed via context, but name/notes would be lost without proper context method.
          // Assuming addLead handles ID generation, if we pass an existing ID it might fail or dup depending on implementation.
          // Let's just close modal for now as full CRUD needs context update.
          // updateLead(editingLead.leadId, leadData); 
          alert("Edição de detalhes seria salva aqui via Contexto (Implementar updateLead).");
      } else {
          const newLead: SalesLead = {
            leadId: `l_${Date.now()}`,
            name: leadData.name || '',
            contact: leadData.contact || '',
            channelSource: leadData.channelSource || 'instagram',
            stage: LeadStage.NEW,
            lastActivity: new Date().toISOString(),
            notes: leadData.notes,
            referredByClientId: leadData.referredByClientId,
            referrerName: leadData.referrerName,
            referrerPhone: leadData.referrerPhone
          };
          addLead(newLead);
      }
      setIsModalOpen(false);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggingId(id);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: LeadStage) => {
      e.preventDefault();
      if (draggingId) {
          const lead = leads.find(l => l.leadId === draggingId);
          if (lead && lead.stage !== stage) {
              updateLeadStage(draggingId, stage);
          }
          setDraggingId(null);
      }
  };

  const getStageLabel = (stage: LeadStage) => {
      switch(stage) {
          case LeadStage.NEW: return 'Novos / Entrada';
          case LeadStage.CONTACTED: return 'Em Contato';
          case LeadStage.SCHEDULED: return 'Agendamento';
          case LeadStage.CONVERTED: return 'Convertidos';
          default: return stage;
      }
  };

  const stages = [LeadStage.NEW, LeadStage.CONTACTED, LeadStage.SCHEDULED, LeadStage.CONVERTED];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Kanban Board Section */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-diva-dark flex items-center">
                <Filter size={20} className="mr-2 opacity-50" /> Pipeline de Vendas
            </h2>
            <button 
                onClick={() => handleOpenModal()}
                className="bg-diva-primary text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-diva-dark transition-colors"
            >
                <Plus size={16} className="mr-2" /> Novo Lead
            </button>
        </div>

        {/* Kanban Columns Container */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex h-full gap-4 min-w-[1000px] pb-4">
                {stages.map(stage => (
                    <div 
                        key={stage} 
                        className={`flex-1 flex flex-col bg-gray-50 rounded-xl border min-w-[240px] transition-colors
                            ${draggingId ? 'border-dashed border-gray-300' : 'border-gray-200'}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stage)}
                    >
                        {/* Column Header */}
                        <div className={`p-3 border-b border-gray-200 rounded-t-xl flex justify-between items-center
                            ${stage === LeadStage.NEW ? 'bg-blue-50/50' : 
                              stage === LeadStage.CONVERTED ? 'bg-green-50/50' : 'bg-gray-100/50'}`}>
                            <span className="text-xs font-bold uppercase text-gray-600 tracking-wider">
                                {getStageLabel(stage)}
                            </span>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 shadow-sm">
                                {leads.filter(l => l.stage === stage).length}
                            </span>
                        </div>

                        {/* Cards List */}
                        <div className="p-2 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                            {leads.filter(l => l.stage === stage).map(lead => (
                                <div 
                                    key={lead.leadId} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead.leadId)}
                                    onClick={() => handleOpenModal(lead)}
                                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-diva-primary/50 hover:-translate-y-1 cursor-grab active:cursor-grabbing group transition-all duration-200"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 uppercase font-bold
                                            ${lead.channelSource === 'instagram' ? 'bg-pink-50 text-pink-600' : 
                                              lead.channelSource === 'whatsapp' ? 'bg-green-50 text-green-600' : 
                                              lead.channelSource === 'referral' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {getChannelIcon(lead.channelSource)} {lead.channelSource === 'referral' ? 'Indicação' : lead.channelSource}
                                        </span>
                                        <button className="text-gray-300 hover:text-diva-dark opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                    <h4 className="font-medium text-diva-dark text-sm">{lead.name}</h4>
                                    
                                    {/* Referral Info Display */}
                                    {(lead.referredByClientId || lead.referrerName) && (
                                        <div className="text-[10px] text-purple-600 mt-1 bg-purple-50 p-1 rounded inline-block">
                                            Por: {lead.referrerName || 'Cliente (ID ' + lead.referredByClientId + ')'}
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2" title={lead.notes}>{lead.notes}</p>
                                    <div className="mt-3 pt-2 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400">
                                        <span>{formatRelativeTime(lead.lastActivity)}</span>
                                        <div className="w-5 h-5 rounded-full bg-diva-light/30 flex items-center justify-center text-diva-dark font-bold text-xs">
                                            {lead.name.charAt(0)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Empty State Dropzone Placeholder */}
                            {stage === LeadStage.NEW && (
                                <div 
                                    onClick={() => handleOpenModal()}
                                    className="h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    + Adicionar
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Analytics Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6 overflow-y-auto pr-1">
        
        {/* Conversion Rate Card */}
        <div className="bg-white p-5 rounded-xl border border-diva-light/30 shadow-sm">
            <h3 className="font-bold text-diva-dark text-sm mb-4 flex items-center">
                <TrendingUp size={16} className="mr-2 text-diva-primary" /> Taxa de Conversão
            </h3>
            <div className="flex items-end space-x-2 mb-2">
                <span className="text-3xl font-bold text-diva-dark">23,5%</span>
                <span className="text-xs text-green-600 font-medium mb-1 flex items-center">
                    +2.1% <TrendingUp size={10} className="ml-0.5" />
                </span>
            </div>
            <p className="text-xs text-gray-400">Média do setor: 18%</p>
            
            <div className="mt-4 h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="stage" hide />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="count" fill="#14808C" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Lead Source Chart */}
        <div className="bg-white p-5 rounded-xl border border-diva-light/30 shadow-sm flex-1 min-h-[300px]">
            <h3 className="font-bold text-diva-dark text-sm mb-4">Origem dos Leads</h3>
            <div className="h-48 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={channelData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {channelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 {/* Center Text */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-xl font-bold text-diva-dark">{leads.length}</span>
                    <p className="text-[10px] text-gray-400">Total</p>
                 </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-3 mt-2">
                {channelData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-bold text-diva-dark">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <LeadModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveLead}
          initialData={editingLead}
      />
    </div>
  );
};

export default FunnelModule;
