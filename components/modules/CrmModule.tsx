
import React, { useState, useMemo } from 'react';
import { Client, SalesLead, LeadStage, User as UserType } from '../../types';
import { Search, Filter, Phone, Mail, MoreHorizontal, Plus, Crown, Star, MessageCircle, TrendingUp, Users, DollarSign } from 'lucide-react';
import ClientProfileModal from '../modals/ClientProfileModal';
import NewClientModal from '../modals/NewClientModal';
import { useUnitData } from '../hooks/useUnitData';
import { useDataIsolation, sanitizeClientData } from '../../hooks/useDataIsolation';
import { useToast } from '../ui/ToastContext';

interface CrmModuleProps {
  user: UserType;
}

const CrmModule: React.FC<CrmModuleProps> = ({ user }) => {
  const { clients, leads, appointments, transactions } = useUnitData();
  const { filterClients, canViewFinancialData } = useDataIsolation(user);
  const { addToast } = useToast();

  // Filtrar pacientes baseado no perfil do usuário
  const visibleClients = filterClients(clients, appointments);

  const [activeTab, setActiveTab] = useState<'clients' | 'leads'>('clients');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('');

  // Search and filter clients
  const filteredClients = useMemo(() => {
    return visibleClients.filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);

      const matchesTag = !filterTag || client.behaviorTags.includes(filterTag);

      return matchesSearch && matchesTag;
    });
  }, [visibleClients, searchTerm, filterTag]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    visibleClients.forEach(client => {
      client.behaviorTags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [visibleClients]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalClients = visibleClients.length;
    const vipClients = visibleClients.filter(c => c.rfmScore > 70).length;
    const totalLTV = canViewFinancialData
      ? visibleClients.reduce((sum, c) => sum + c.lifetimeValue, 0)
      : 0;
    const avgLTV = totalClients > 0 ? totalLTV / totalClients : 0;

    return { totalClients, vipClients, totalLTV, avgLTV };
  }, [visibleClients, canViewFinancialData]);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsProfileOpen(true);
  };

  const handlePhoneClick = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${client.phone}`;
    addToast(`Ligando para ${client.name}...`, 'info');
  };

  const handleEmailClick = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `mailto:${client.email}`;
    addToast(`Abrindo email para ${client.name}...`, 'info');
  };

  const handleWhatsAppClick = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = client.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}`, '_blank');
    addToast(`Abrindo WhatsApp para ${client.name}...`, 'success');
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Statistics Cards */}
      {canViewFinancialData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
          <div className="bg-white rounded-xl p-4 border border-diva-light/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Total Pacientes</p>
                <p className="text-2xl font-bold text-diva-dark mt-1">{stats.totalClients}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-diva-light/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">VIP Clients</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.vipClients}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Crown size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-diva-light/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">LTV Total</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats.totalLTV)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-diva-light/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">LTV Médio</p>
                <p className="text-2xl font-bold text-diva-primary mt-1">{formatCurrency(stats.avgLTV)}</p>
              </div>
              <div className="bg-diva-light/30 p-3 rounded-lg">
                <TrendingUp size={24} className="text-diva-primary" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-diva-light/30 p-4 md:p-6 shrink-0">
          {/* Tabs */}
          <div className="flex space-x-4 md:space-x-6 mb-4">
            <button
              onClick={() => setActiveTab('clients')}
              className={`pb-2 text-xs md:text-sm font-semibold tracking-wide transition-colors ${activeTab === 'clients'
                  ? 'text-diva-primary border-b-2 border-diva-primary'
                  : 'text-gray-400 hover:text-diva-dark'
                }`}
            >
              <span className="hidden sm:inline">BASE DE PACIENTES</span>
              <span className="sm:hidden">PACIENTES</span> ({filteredClients.length})
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`pb-2 text-xs md:text-sm font-semibold tracking-wide transition-colors ${activeTab === 'leads'
                  ? 'text-diva-primary border-b-2 border-diva-primary'
                  : 'text-gray-400 hover:text-diva-dark'
                }`}
            >
              <span className="hidden sm:inline">PIPELINE DE VENDAS</span>
              <span className="sm:hidden">LEADS</span> ({leads.length})
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-diva-light/50 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none"
              />
            </div>

            {allTags.length > 0 && (
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-2 border border-diva-light/50 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none"
              >
                <option value="">Todas as Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            )}

            <button
              onClick={() => setIsNewClientModalOpen(true)}
              className="bg-diva-primary text-white px-4 py-2 rounded-lg hover:bg-diva-dark transition-colors flex items-center justify-center gap-2 active:scale-95"
              title="Novo Paciente"
            >
              <Plus size={20} />
              <span className="sm:hidden">Novo Paciente</span>
            </button>
          </div>
        </div>

        <div className="p-3 md:p-6 flex-1 overflow-auto">
          {activeTab === 'clients' ? (
            filteredClients.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        <th className="pb-3 pl-2">Paciente</th>
                        <th className="pb-3">Tags Comportamentais</th>
                        <th className="pb-3">Score RFM</th>
                        <th className="pb-3 text-center">Pontos</th>
                        <th className="pb-3">LTV</th>
                        <th className="pb-3">Último Contato</th>
                        <th className="pb-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-50">
                      {filteredClients.map(client => {
                        const safeClient = canViewFinancialData ? client : { ...client, lifetimeValue: 0, rfmScore: 0 };

                        return (
                          <tr
                            key={client.clientId}
                            onClick={() => handleClientClick(client)}
                            className={`transition-colors cursor-pointer group border-b border-gray-50 ${safeClient.rfmScore > 70 ? 'bg-purple-50 hover:bg-purple-100' : 'hover:bg-diva-light/10'}`}
                          >
                            <td className="py-4 pl-2">
                              <div className="flex items-center gap-2">
                                {safeClient.rfmScore > 70 && <Crown size={14} className="text-purple-600" />}
                                <div>
                                  <p className="font-medium text-diva-dark group-hover:text-diva-primary transition-colors">{client.name}</p>
                                  <p className="text-xs text-gray-400">{client.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex gap-1 flex-wrap">
                                {client.behaviorTags.map(tag => (
                                  <span key={tag} className="bg-diva-light/30 text-diva-dark px-2 py-0.5 rounded text-xs border border-diva-light/50">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-4">
                              {canViewFinancialData ? (
                                <>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                                    <div className={`h-2.5 rounded-full ${safeClient.rfmScore > 70 ? 'bg-purple-600' : 'bg-diva-accent'}`} style={{ width: `${safeClient.rfmScore}%` }}></div>
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1 block font-bold">{safeClient.rfmScore}/100</span>
                                </>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-4 text-center">
                              {client.loyaltyPoints ? (
                                <span className="inline-flex items-center bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full text-xs font-bold">
                                  <Star size={10} className="mr-1 fill-current" /> {client.loyaltyPoints}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-4 font-mono text-diva-dark">
                              {canViewFinancialData ? `R$ ${safeClient.lifetimeValue.toLocaleString('pt-BR')}` : '-'}
                            </td>
                            <td className="py-4 text-gray-500">
                              {client.lastContact ? new Date(client.lastContact).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-4">
                              <div className="flex space-x-2 text-gray-400">
                                <button
                                  onClick={(e) => handlePhoneClick(client, e)}
                                  className="hover:text-blue-600 transition-colors"
                                  title="Ligar"
                                >
                                  <Phone size={16} />
                                </button>
                                <button
                                  onClick={(e) => handleEmailClick(client, e)}
                                  className="hover:text-green-600 transition-colors"
                                  title="Email"
                                >
                                  <Mail size={16} />
                                </button>
                                <button
                                  onClick={(e) => handleWhatsAppClick(client, e)}
                                  className="hover:text-green-500 transition-colors"
                                  title="WhatsApp"
                                >
                                  <MessageCircle size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3">
                  {filteredClients.map(client => {
                    const safeClient = canViewFinancialData ? client : { ...client, lifetimeValue: 0, rfmScore: 0 };

                    return (
                      <div
                        key={client.clientId}
                        onClick={() => handleClientClick(client)}
                        className={`bg-white border rounded-xl p-4 cursor-pointer transition-all active:scale-[0.98] ${safeClient.rfmScore > 70
                            ? 'border-purple-200 bg-purple-50'
                            : 'border-gray-200 hover:border-diva-primary hover:shadow-md'
                          }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {safeClient.rfmScore > 70 && <Crown size={16} className="text-purple-600 shrink-0" />}
                            <div className="min-w-0">
                              <p className="font-bold text-diva-dark truncate">{client.name}</p>
                              <p className="text-xs text-gray-500 truncate">{client.email}</p>
                            </div>
                          </div>
                          {client.loyaltyPoints && (
                            <span className="inline-flex items-center bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full text-xs font-bold shrink-0 ml-2">
                              <Star size={10} className="mr-1 fill-current" /> {client.loyaltyPoints}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        {client.behaviorTags.length > 0 && (
                          <div className="flex gap-1 flex-wrap mb-3">
                            {client.behaviorTags.map(tag => (
                              <span key={tag} className="bg-diva-light/30 text-diva-dark px-2 py-0.5 rounded text-xs border border-diva-light/50">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                          {canViewFinancialData && (
                            <>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Score RFM</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${safeClient.rfmScore > 70 ? 'bg-purple-600' : 'bg-diva-accent'}`}
                                      style={{ width: `${safeClient.rfmScore}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-bold text-gray-700">{safeClient.rfmScore}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">LTV</p>
                                <p className="font-mono font-bold text-diva-dark">R$ {safeClient.lifetimeValue.toLocaleString('pt-BR')}</p>
                              </div>
                            </>
                          )}
                          <div className={canViewFinancialData ? 'col-span-2' : 'col-span-2'}>
                            <p className="text-xs text-gray-500 mb-1">Último Contato</p>
                            <p className="text-sm text-gray-700">{client.lastContact ? new Date(client.lastContact).toLocaleDateString('pt-BR') : 'Nunca'}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={(e) => handlePhoneClick(client, e)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors active:scale-95"
                          >
                            <Phone size={16} />
                            <span className="text-xs font-bold">Ligar</span>
                          </button>
                          <button
                            onClick={(e) => handleEmailClick(client, e)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
                          >
                            <Mail size={16} />
                            <span className="text-xs font-bold">Email</span>
                          </button>
                          <button
                            onClick={(e) => handleWhatsAppClick(client, e)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors active:scale-95"
                          >
                            <MessageCircle size={16} />
                            <span className="text-xs font-bold">WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Nenhum paciente encontrado</p>
                <p className="text-sm">Tente ajustar os filtros de busca</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(LeadStage).slice(0, 3).map(stage => (
                <div key={stage} className="bg-gray-50 rounded-lg p-4 border border-gray-100 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">{stage}</h4>
                    <span className="bg-white text-xs px-2 py-1 rounded shadow-sm">
                      {leads.filter(l => l.stage === stage).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {leads.filter(l => l.stage === stage).map(lead => (
                      <div key={lead.leadId} className="bg-white p-3 rounded shadow-sm border border-l-4 border-l-diva-accent border-gray-100 hover:shadow-md cursor-pointer">
                        <p className="font-medium text-diva-dark">{lead.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{lead.notes}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">{lead.channelSource}</span>
                          <span className="text-[10px] text-gray-400">{new Date(lead.lastActivity).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedClient && (
        <ClientProfileModal
          client={selectedClient}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
      />
    </div>
  );
};

export default CrmModule;
