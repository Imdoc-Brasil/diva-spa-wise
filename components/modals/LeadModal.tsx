
import React, { useState, useEffect } from 'react';
import { X, Save, Users, Search, MessageCircle } from 'lucide-react';
import { SalesLead, Client, LeadStage } from '../../types';
import { useData } from '../context/DataContext';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<SalesLead>) => void;
  initialData?: SalesLead | null;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const { clients } = useData();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    channelSource: 'instagram',
    notes: '',
    referredByClientId: '',
    referrerName: '',
    referrerPhone: '',
    stage: LeadStage.NEW
  });

  // Referral Search State
  const [referralSearch, setReferralSearch] = useState('');
  const [referralMode, setReferralMode] = useState<'existing' | 'manual'>('existing');
  const [selectedReferrer, setSelectedReferrer] = useState<Client | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          contact: initialData.contact,
          channelSource: initialData.channelSource,
          notes: initialData.notes || '',
          referredByClientId: initialData.referredByClientId || '',
          referrerName: initialData.referrerName || '',
          referrerPhone: initialData.referrerPhone || '',
          stage: initialData.stage
        });
        if (initialData.referredByClientId) {
            const client = clients.find(c => c.clientId === initialData.referredByClientId);
            if (client) setSelectedReferrer(client);
        }
        if (initialData.referrerName) {
            setReferralMode('manual');
        }
      } else {
        setFormData({ name: '', contact: '', channelSource: 'instagram', notes: '', referredByClientId: '', referrerName: '', referrerPhone: '', stage: LeadStage.NEW });
        setSelectedReferrer(null);
        setReferralSearch('');
        setReferralMode('existing');
      }
    }
  }, [isOpen, initialData, clients]);

  if (!isOpen) return null;

  const handleSubmit = () => {
      const leadData: Partial<SalesLead> = {
          ...formData,
          referredByClientId: selectedReferrer ? selectedReferrer.clientId : undefined,
          referrerName: referralMode === 'manual' ? formData.referrerName : undefined,
          referrerPhone: referralMode === 'manual' ? formData.referrerPhone : undefined,
      };
      onSave(leadData);
      onClose();
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(referralSearch.toLowerCase()));

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                  <h3 className="font-bold text-diva-dark text-lg">{initialData ? 'Editar Lead' : 'Adicionar Novo Lead'}</h3>
                  <button onClick={onClose} className="text-gray-400 hover:text-diva-dark">
                      <X size={20} />
                  </button>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto">
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo *</label>
                      <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none text-sm bg-white text-gray-900"
                          placeholder="Ex: Ana Clara"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                  </div>
                  
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contato (Tel/Email) *</label>
                      <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none text-sm bg-white text-gray-900"
                          placeholder="(00) 00000-0000"
                          value={formData.contact}
                          onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      />
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Canal de Origem</label>
                      <select 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none text-sm bg-white text-gray-900"
                          value={formData.channelSource}
                          onChange={(e) => setFormData({...formData, channelSource: e.target.value})}
                      >
                          <option value="instagram">Instagram</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="website">Site</option>
                          <option value="referral">Indicação</option>
                      </select>
                  </div>
                  
                  {initialData && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estágio do Funil</label>
                        <select 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none text-sm bg-white text-gray-900"
                            value={formData.stage}
                            onChange={(e) => setFormData({...formData, stage: e.target.value as LeadStage})}
                        >
                            {Object.values(LeadStage).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                  )}

                  {/* REFERRAL SECTION */}
                  {formData.channelSource === 'referral' && (
                      <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl space-y-3 animate-in fade-in">
                          <div className="flex justify-between items-center">
                              <h4 className="font-bold text-purple-800 text-sm flex items-center">
                                  <Users size={14} className="mr-1" /> Quem indicou?
                              </h4>
                              <div className="flex bg-purple-200/50 p-0.5 rounded text-[10px] font-bold">
                                  <button 
                                    onClick={() => setReferralMode('existing')}
                                    className={`px-2 py-1 rounded transition-all ${referralMode === 'existing' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-500'}`}
                                  >
                                      Cliente
                                  </button>
                                  <button 
                                    onClick={() => setReferralMode('manual')}
                                    className={`px-2 py-1 rounded transition-all ${referralMode === 'manual' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-500'}`}
                                  >
                                      Outro
                                  </button>
                              </div>
                          </div>

                          {referralMode === 'existing' ? (
                              <>
                                  {!selectedReferrer ? (
                                      <div className="relative">
                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                          <input 
                                              type="text"
                                              className="w-full pl-9 p-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 bg-white text-gray-900"
                                              placeholder="Buscar cliente..."
                                              value={referralSearch}
                                              onChange={(e) => setReferralSearch(e.target.value)}
                                          />
                                          {referralSearch && (
                                              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-lg rounded-lg mt-1 max-h-32 overflow-y-auto z-10">
                                                  {filteredClients.map(client => (
                                                      <div 
                                                        key={client.clientId}
                                                        onClick={() => { setSelectedReferrer(client); setReferralSearch(''); }}
                                                        className="p-2 hover:bg-purple-50 cursor-pointer text-xs border-b border-gray-50"
                                                      >
                                                          <p className="font-bold text-diva-dark">{client.name}</p>
                                                          <p className="text-gray-500">{client.phone}</p>
                                                      </div>
                                                  ))}
                                                  {filteredClients.length === 0 && <p className="p-2 text-xs text-gray-400 text-center">Nenhum cliente encontrado.</p>}
                                              </div>
                                          )}
                                      </div>
                                  ) : (
                                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-purple-200 shadow-sm">
                                          <div className="flex items-center gap-2">
                                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                                  {selectedReferrer.name.charAt(0)}
                                              </div>
                                              <div>
                                                  <p className="text-xs font-bold text-gray-700">{selectedReferrer.name}</p>
                                                  <p className="text-[10px] text-green-600 font-bold">+100 pts Fidelidade</p>
                                              </div>
                                          </div>
                                          <button onClick={() => setSelectedReferrer(null)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                                      </div>
                                  )}
                              </>
                          ) : (
                              <div className="grid grid-cols-2 gap-2">
                                  <input 
                                      type="text" 
                                      placeholder="Nome do indicador" 
                                      className="p-2 text-xs border border-purple-200 rounded-lg outline-none bg-white text-gray-900"
                                      value={formData.referrerName}
                                      onChange={(e) => setFormData({...formData, referrerName: e.target.value})}
                                  />
                                  <input 
                                      type="text" 
                                      placeholder="Telefone (Automação)" 
                                      className="p-2 text-xs border border-purple-200 rounded-lg outline-none bg-white text-gray-900"
                                      value={formData.referrerPhone}
                                      onChange={(e) => setFormData({...formData, referrerPhone: e.target.value})}
                                  />
                              </div>
                          )}
                          
                          <p className="text-[10px] text-purple-600 italic flex items-center">
                              <MessageCircle size={10} className="mr-1" /> Automação: Enviaremos um agradecimento via WhatsApp.
                          </p>
                      </div>
                  )}

                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Anotações / Observações</label>
                      <textarea 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none text-sm h-24 resize-none bg-white text-gray-900"
                          placeholder="Detalhes do interesse, horários preferidos..."
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      ></textarea>
                  </div>
              </div>

              <div className="p-5 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 shrink-0">
                  <button 
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                      Cancelar
                  </button>
                  <button 
                      onClick={handleSubmit}
                      disabled={!formData.name}
                      className="px-4 py-2 text-sm font-bold text-white bg-diva-primary hover:bg-diva-dark rounded-lg transition-colors shadow-sm flex items-center disabled:opacity-50"
                  >
                      <Save size={16} className="mr-2" /> {initialData ? 'Atualizar Lead' : 'Salvar Lead'}
                  </button>
              </div>
          </div>
      </div>
  );
};

export default LeadModal;
