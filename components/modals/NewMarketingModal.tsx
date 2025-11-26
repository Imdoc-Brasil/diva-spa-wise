
import React, { useState, useEffect } from 'react';
import { X, Save, Megaphone, Zap, Users, MessageCircle, Mail, Instagram } from 'lucide-react';
import { MarketingCampaign, AutomationRule, CampaignChannel } from '../../types';

type ModalType = 'campaign' | 'automation' | 'segment';

interface NewMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  onSave: (data: any) => void;
  initialData?: any;
}

const NewMarketingModal: React.FC<NewMarketingModalProps> = ({ isOpen, onClose, type, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    channel: 'whatsapp' as CampaignChannel,
    trigger: 'birthday',
    action: 'send_message',
    scheduledDate: ''
  });

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                channel: initialData.channel || 'whatsapp',
                trigger: initialData.trigger || 'birthday',
                action: initialData.action || 'send_message',
                scheduledDate: initialData.scheduledFor || ''
            });
        } else {
            // Reset for creation
            setFormData({
                name: '',
                description: '',
                channel: 'whatsapp',
                trigger: 'birthday',
                action: 'send_message',
                scheduledDate: ''
            });
        }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const getTitle = () => {
      const prefix = initialData ? 'Editar' : 'Nova';
      switch(type) {
          case 'campaign': return `${prefix} Campanha`;
          case 'automation': return `${prefix} Automação`;
          case 'segment': return `${initialData ? 'Editar' : 'Novo'} Segmento`;
      }
  };

  const getIcon = () => {
      switch(type) {
          case 'campaign': return <Megaphone size={20} className="mr-2" />;
          case 'automation': return <Zap size={20} className="mr-2" />;
          case 'segment': return <Users size={20} className="mr-2" />;
      }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white">
          <h3 className="font-bold text-lg flex items-center">
            {getIcon()} {getTitle()}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome / Título *</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900"
              placeholder={`Ex: ${type === 'campaign' ? 'Black Friday' : type === 'automation' ? 'Mensagem de Boas-vindas' : 'Clientes VIP'}`}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* CAMPAIGN FIELDS */}
          {type === 'campaign' && (
              <>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Canal de Envio</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['whatsapp', 'email', 'instagram'].map(ch => (
                            <button
                                type="button"
                                key={ch}
                                onClick={() => setFormData({...formData, channel: ch as any})}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${formData.channel === ch ? 'bg-diva-primary/10 border-diva-primary text-diva-primary' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                {ch === 'whatsapp' && <MessageCircle size={20} />}
                                {ch === 'email' && <Mail size={20} />}
                                {ch === 'instagram' && <Instagram size={20} />}
                                <span className="text-[10px] font-bold uppercase mt-1">{ch}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Agendar Para (Opcional)</label>
                    <input 
                        type="datetime-local" 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    />
                </div>
              </>
          )}

          {/* AUTOMATION FIELDS */}
          {type === 'automation' && (
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gatilho (Quando)</label>
                      <select 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                        value={formData.trigger}
                        onChange={(e) => setFormData({...formData, trigger: e.target.value})}
                      >
                          <option value="birthday">Aniversário</option>
                          <option value="post_service">Pós-Atendimento</option>
                          <option value="abandoned_cart">Carrinho Abandonado</option>
                          <option value="inactive_30d">Inativo 30 dias</option>
                          <option value="lead_stale_24h">Lead s/ Contato 24h</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ação (Fazer)</label>
                      <select 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                        value={formData.action}
                        onChange={(e) => setFormData({...formData, action: e.target.value})}
                      >
                          <option value="send_message">Enviar Mensagem</option>
                          <option value="create_task">Criar Tarefa</option>
                          <option value="notify_team">Notificar Equipe</option>
                      </select>
                  </div>
              </div>
          )}

          {/* SEGMENT FIELDS */}
          {type === 'segment' && (
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição do Segmento</label>
                  <textarea 
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 h-24 resize-none"
                      placeholder="Ex: Clientes que gastaram mais de R$ 1000 nos últimos 3 meses..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
              </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-diva-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-diva-dark transition-all flex items-center"
            >
              <Save size={16} className="mr-2" /> {initialData ? 'Salvar Alterações' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMarketingModal;
