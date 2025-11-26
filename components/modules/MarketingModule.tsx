
import React, { useState } from 'react';
import { MarketingCampaign, AutomationRule, CampaignChannel, CampaignStatus } from '../../types';
import { Megaphone, Mail, MessageCircle, Instagram, Play, Pause, Plus, Target, BarChart, Zap, Settings, User, Filter, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import NewMarketingModal from '../modals/NewMarketingModal';
import { useToast } from '../ui/ToastContext';

const mockCampaignsInitial: MarketingCampaign[] = [
  { 
    id: 'c1', 
    name: 'Promoção Relâmpago: Botox Week', 
    channel: 'whatsapp', 
    segmentId: 's1', 
    status: 'active',
    stats: { sent: 1500, opened: 1200, converted: 85, revenue: 25500 } 
  },
  { 
    id: 'c2', 
    name: 'Lançamento: Protocolo Verão', 
    channel: 'email', 
    segmentId: 's1', 
    status: 'scheduled', 
    scheduledFor: '2023-11-01T10:00:00',
    stats: { sent: 0, opened: 0, converted: 0, revenue: 0 } 
  },
];

const mockAutomationsInitial: AutomationRule[] = [
  { id: 'a1', name: 'Mensagem de Aniversário', trigger: 'birthday', action: 'send_message', active: true },
  { id: 'a2', name: 'Reativação Pós-60 dias', trigger: 'inactive_30d', action: 'send_message', active: true },
  { id: 'a3', name: 'Lembrete de Retoque Botox', trigger: 'post_service', action: 'create_task', active: false },
  { id: 'a4', name: 'Alerta: Leads Novos sem Contato (24h)', trigger: 'lead_stale_24h', action: 'notify_team', active: true },
];

const mockSegmentsInitial = [
    { id: 's1', name: 'Clientes VIP (LTV > 5k)', count: 120, description: 'Clientes com alto gasto vitalício.' },
    { id: 's2', name: 'Novos Clientes (30 dias)', count: 45, description: 'Clientes que vieram no último mês.' },
    { id: 's3', name: 'Clientes Inativos - Último Contato há 6 Meses', count: 89, description: 'Última Visita > 180 dias' },
];

const MarketingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'automations' | 'segments'>('campaigns');
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(mockCampaignsInitial);
  const [automations, setAutomations] = useState<AutomationRule[]>(mockAutomationsInitial);
  const [segments, setSegments] = useState(mockSegmentsInitial);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'campaign' | 'automation' | 'segment'>('campaign');
  const [editingItem, setEditingItem] = useState<any>(null);
  const { addToast } = useToast();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const openModal = (type: 'campaign' | 'automation' | 'segment', item?: any) => {
      setModalType(type);
      setEditingItem(item || null);
      setIsModalOpen(true);
  };

  const handleSave = (data: any) => {
      if (modalType === 'campaign') {
          if (editingItem) {
              setCampaigns(campaigns.map(c => c.id === editingItem.id ? { ...c, ...data, status: data.scheduledDate ? 'scheduled' : 'draft' } : c));
              addToast('Campanha atualizada!', 'success');
          } else {
              const newCampaign: MarketingCampaign = {
                  id: `c_${Date.now()}`,
                  name: data.name,
                  channel: data.channel,
                  segmentId: 's1', // Default for demo
                  status: data.scheduledDate ? 'scheduled' : 'draft',
                  scheduledFor: data.scheduledDate,
                  stats: { sent: 0, opened: 0, converted: 0, revenue: 0 }
              };
              setCampaigns([newCampaign, ...campaigns]);
              addToast('Campanha criada com sucesso!', 'success');
          }
      } 
      else if (modalType === 'automation') {
          if (editingItem) {
              setAutomations(automations.map(a => a.id === editingItem.id ? { ...a, ...data } : a));
              addToast('Automação atualizada!', 'success');
          } else {
              const newAuto: AutomationRule = {
                  id: `a_${Date.now()}`,
                  name: data.name,
                  trigger: data.trigger,
                  action: data.action,
                  active: true
              };
              setAutomations([newAuto, ...automations]);
              addToast('Regra de automação ativada!', 'success');
          }
      }
      else if (modalType === 'segment') {
          if (editingItem) {
              setSegments(segments.map(s => s.id === editingItem.id ? { ...s, ...data } : s));
              addToast('Segmento atualizado!', 'success');
          } else {
              const newSeg = {
                  id: `s_${Date.now()}`,
                  name: data.name,
                  description: data.description,
                  count: 0
              };
              setSegments([newSeg, ...segments]);
              addToast('Novo segmento de clientes criado.', 'success');
          }
      }
      setIsModalOpen(false);
  };

  const toggleAutomation = (id: string) => {
      setAutomations(automations.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-50 rounded-xl text-pink-600 border border-pink-100">
                    <Megaphone size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-bold text-diva-dark">Marketing & Automação</h2>
                    <p className="text-sm text-gray-500">Campanhas, CRM e Régua de Relacionamento</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveTab('campaigns')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'campaigns' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Campanhas
                </button>
                <button 
                    onClick={() => setActiveTab('automations')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'automations' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Automações
                </button>
                <button 
                    onClick={() => setActiveTab('segments')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'segments' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Segmentos
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                
                {activeTab === 'campaigns' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {campaigns.map(campaign => (
                            <div key={campaign.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal('campaign', campaign)} className="text-gray-400 hover:text-diva-primary"><Settings size={16}/></button>
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-diva-dark text-lg">{campaign.name}</h4>
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        {campaign.channel === 'whatsapp' ? <MessageCircle size={20} className="text-green-500" /> : <Mail size={20} className="text-blue-500" />}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Canal</p>
                                        <p className="font-medium text-gray-700 capitalize">{campaign.channel}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                            {campaign.status}
                                        </span>
                                    </div>
                                    {campaign.status === 'active' && (
                                        <div className="col-span-2 border-t border-gray-100 pt-2 mt-2">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Taxa de Abertura</span>
                                                <span className="font-bold">80%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-1.5 rounded-full">
                                                <div className="bg-green-500 h-1.5 rounded-full" style={{width: '80%'}}></div>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">Receita Gerada: <strong className="text-green-600">{formatCurrency(campaign.stats.revenue)}</strong></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div 
                            onClick={() => openModal('campaign')}
                            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-400 hover:border-diva-primary hover:text-diva-primary cursor-pointer transition-colors bg-white min-h-[200px]"
                        >
                            <div className="text-center">
                                <Plus size={32} className="mx-auto mb-2" />
                                <p className="font-bold">Criar Nova Campanha</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'automations' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-diva-dark">Régua de Relacionamento</h3>
                            <button 
                                onClick={() => openModal('automation')}
                                className="text-xs font-bold text-diva-primary border border-diva-primary px-3 py-1.5 rounded hover:bg-diva-light/10 flex items-center"
                            >
                                <Plus size={14} className="mr-1" /> Nova Regra
                            </button>
                        </div>
                        {automations.map(auto => (
                            <div key={auto.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${auto.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-diva-dark">{auto.name}</h4>
                                        <p className="text-xs text-gray-500">Gatilho: <span className="font-mono bg-gray-50 px-1 rounded">{auto.trigger}</span> → Ação: <span className="font-mono bg-gray-50 px-1 rounded">{auto.action}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => toggleAutomation(auto.id)}
                                        className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-all ${auto.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                                    >
                                        {auto.active ? 'Ativo' : 'Pausado'}
                                    </button>
                                    <button 
                                        onClick={() => openModal('automation', auto)}
                                        className="text-gray-400 hover:text-diva-dark p-1 rounded hover:bg-gray-100 transition-colors"
                                    >
                                        <Settings size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'segments' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-diva-dark">Segmentos de Clientes</h3>
                            <button 
                                onClick={() => openModal('segment')}
                                className="bg-diva-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-primary transition-colors"
                            >
                                <Plus size={16} className="mr-2" /> Novo Segmento
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {segments.map(seg => (
                                <div 
                                    key={seg.id} 
                                    onClick={() => openModal('segment', seg)}
                                    className="bg-white p-5 rounded-xl border border-gray-200 hover:border-diva-primary transition-colors cursor-pointer shadow-sm hover:shadow-md group relative"
                                >
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Settings size={16} className="text-gray-400" />
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                            <Users size={20} />
                                        </div>
                                        <span className="text-lg font-bold text-diva-dark">{seg.count}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-sm mb-1">{seg.name}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2">{seg.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>

        <NewMarketingModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            type={modalType}
            onSave={handleSave}
            initialData={editingItem}
        />
    </div>
  );
};

export default MarketingModule;
