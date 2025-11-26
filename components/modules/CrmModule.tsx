
import React, { useState } from 'react';
import { Client, SalesLead, LeadStage } from '../../types';
import { Search, Filter, Phone, Mail, MoreHorizontal, Plus, Crown, Star } from 'lucide-react';
import ClientProfileModal from '../modals/ClientProfileModal';
import NewClientModal from '../modals/NewClientModal';
import { useData } from '../context/DataContext';

const CrmModule: React.FC = () => {
  const { clients, leads } = useData();
  const [activeTab, setActiveTab] = useState<'clients' | 'leads'>('clients');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsProfileOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 min-h-[600px] flex flex-col relative">
      <div className="border-b border-diva-light/30 p-6 flex justify-between items-center">
        <div className="flex space-x-6">
          <button 
            onClick={() => setActiveTab('clients')}
            className={`pb-2 text-sm font-semibold tracking-wide transition-colors ${activeTab === 'clients' ? 'text-diva-primary border-b-2 border-diva-primary' : 'text-gray-400 hover:text-diva-dark'}`}
          >
            BASE DE CLIENTES ({clients.length})
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`pb-2 text-sm font-semibold tracking-wide transition-colors ${activeTab === 'leads' ? 'text-diva-primary border-b-2 border-diva-primary' : 'text-gray-400 hover:text-diva-dark'}`}
          >
            PIPELINE DE VENDAS ({leads.length})
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 border border-diva-light/50 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none" />
            </div>
            <button 
                onClick={() => setIsNewClientModalOpen(true)}
                className="bg-diva-primary text-white p-2 rounded-lg hover:bg-diva-dark transition-colors" 
                title="Novo Cliente"
            >
                <Plus size={20} />
            </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-auto">
        {activeTab === 'clients' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 pl-2">Cliente</th>
                <th className="pb-3">Tags Comportamentais</th>
                <th className="pb-3">Score RFM</th>
                <th className="pb-3 text-center">Pontos</th>
                <th className="pb-3">LTV</th>
                <th className="pb-3">Último Contato</th>
                <th className="pb-3">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {clients.map(client => (
                <tr 
                  key={client.clientId} 
                  onClick={() => handleClientClick(client)}
                  className={`transition-colors cursor-pointer group border-b border-gray-50 ${client.rfmScore > 70 ? 'bg-purple-50 hover:bg-purple-100' : 'hover:bg-diva-light/10'}`}
                >
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-2">
                      {client.rfmScore > 70 && <Crown size={14} className="text-purple-600" />}
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
                    <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                      <div className={`h-2.5 rounded-full ${client.rfmScore > 70 ? 'bg-purple-600' : 'bg-diva-accent'}`} style={{ width: `${client.rfmScore}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block font-bold">{client.rfmScore}/100</span>
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
                    R$ {client.lifetimeValue.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-4 text-gray-500">
                    {client.lastContact ? new Date(client.lastContact).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2 text-gray-400">
                      <button className="hover:text-diva-primary" onClick={(e) => { e.stopPropagation(); }}><Phone size={16} /></button>
                      <button className="hover:text-diva-primary" onClick={(e) => { e.stopPropagation(); }}><Mail size={16} /></button>
                      <button className="hover:text-diva-primary" onClick={(e) => { e.stopPropagation(); }}><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
