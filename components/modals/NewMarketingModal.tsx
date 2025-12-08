import React, { useState, useEffect } from 'react';
import { X, Save, Megaphone, Zap, Users, MessageCircle, Mail, Instagram, Bell, FileText, Bot } from 'lucide-react';
import { MarketingCampaign, AutomationRule, CampaignChannel } from '../../types';

type ModalType = 'campaign' | 'automation' | 'segment';

interface NewMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  onSave: (data: any) => void;
  initialData?: any;
}

const MESSAGE_TEMPLATES = [
  { id: 'custom', name: 'Personalizado (Em branco)', content: '' },
  { id: 't1', name: 'Promoção Relâmpago', content: 'Olá {name}, aproveite 20% OFF em todos os tratamentos hoje! Agende agora: {link}' },
  { id: 't2', name: 'Lembrete de Agendamento', content: 'Oi {name}, lembrete do seu horário amanhã às {time}. Confirma?' },
  { id: 't3', name: 'Feliz Aniversário', content: 'Parabéns {name}! 🎂 Você ganhou um peeling de diamante de presente. Venha buscar!' },
  { id: 't4', name: 'Recuperação de Inativos', content: 'Olá {name}, faz tempo que não te vemos! Estamos com saades. Que tal um retorno?' }
];

const WHATSAPP_FLOWS = [
  { id: 'f1', name: '🤖 Agendamento Automático (Chatbot)' },
  { id: 'f2', name: '⭐ Pesquisa de Satisfação (NPS)' },
  { id: 'f3', name: '📋 Qualificação de Lead' }
];

const NewMarketingModal: React.FC<NewMarketingModalProps> = ({ isOpen, onClose, type, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    channel: 'whatsapp' as CampaignChannel,
    trigger: 'birthday',
    action: 'send_message',
    scheduledDate: '',
    messageContent: '',
    selectedTemplate: 'custom',
    useWhatsappFlow: false,
    selectedFlow: ''
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
          scheduledDate: initialData.scheduledFor || '',
          messageContent: initialData.messageContent || '',
          selectedTemplate: initialData.templateId || 'custom',
          useWhatsappFlow: initialData.useWhatsappFlow || false,
          selectedFlow: initialData.flowId || ''
        });
      } else {
        // Reset for creation
        setFormData({
          name: '',
          description: '',
          channel: 'whatsapp',
          trigger: 'birthday',
          action: 'send_message',
          scheduledDate: '',
          messageContent: '',
          selectedTemplate: 'custom',
          useWhatsappFlow: false,
          selectedFlow: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const handleTemplateChange = (templateId: string) => {
    const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
    setFormData(prev => ({
      ...prev,
      selectedTemplate: templateId,
      messageContent: template ? template.content : prev.messageContent
    }));
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const getTitle = () => {
    const prefix = initialData ? 'Editar' : 'Nova';
    switch (type) {
      case 'campaign': return `${prefix} Campanha`;
      case 'automation': return `${prefix} Automação`;
      case 'segment': return `${initialData ? 'Editar' : 'Novo'} Segmento`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'campaign': return <Megaphone size={20} className="mr-2" />;
      case 'automation': return <Zap size={20} className="mr-2" />;
      case 'segment': return <Users size={20} className="mr-2" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">

        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white sticky top-0 z-10">
          <h3 className="font-bold text-lg flex items-center">
            {getIcon()} {getTitle()}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome / Título *</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900"
              placeholder={`Ex: ${type === 'campaign' ? 'Black Friday' : type === 'automation' ? 'Mensagem de Boas-vindas' : 'Clientes VIP'}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* CAMPAIGN FIELDS */}
          {type === 'campaign' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Canal de Envio</label>
                <div className="grid grid-cols-4 gap-2">
                  {['whatsapp', 'email', 'in_app', 'instagram'].map(ch => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => setFormData({ ...formData, channel: ch as any })}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${formData.channel === ch ? 'bg-diva-primary/10 border-diva-primary text-diva-primary' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {ch === 'whatsapp' && <MessageCircle size={20} />}
                      {ch === 'email' && <Mail size={20} />}
                      {ch === 'instagram' && <Instagram size={20} />}
                      {ch === 'in_app' && <Bell size={20} />}
                      <span className="text-[9px] font-bold uppercase mt-1 leading-tight text-center">{ch.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates & Content */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-diva-primary" />
                  <h4 className="font-bold text-diva-dark text-sm">Conteúdo da Mensagem</h4>
                </div>

                {formData.channel === 'whatsapp' && (
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="useFlow"
                      checked={formData.useWhatsappFlow}
                      onChange={(e) => setFormData({ ...formData, useWhatsappFlow: e.target.checked })}
                      className="w-4 h-4 text-diva-primary rounded border-gray-300 focus:ring-diva-primary"
                    />
                    <label htmlFor="useFlow" className="text-sm font-medium text-gray-700 flex items-center">
                      <Bot size={14} className="mr-1 text-green-600" /> Usar Fluxo Interativo (Chatbot)
                    </label>
                  </div>
                )}

                {!formData.useWhatsappFlow ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Modelo (Template)</label>
                      <select
                        value={formData.selectedTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                      >
                        {MESSAGE_TEMPLATES.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mensagem</label>
                      <textarea
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-diva-primary text-sm h-32 resize-none"
                        placeholder="Digite sua mensagem aqui... Use {name} para o nome do cliente."
                        value={formData.messageContent}
                        onChange={(e) => setFormData({ ...formData, messageContent: e.target.value })}
                      />
                      <p className="text-[10px] text-gray-400 mt-1">Variáveis disponíveis: {'{name}'}, {'{date}'}, {'{link}'}</p>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Selecione o Fluxo</label>
                    <select
                      value={formData.selectedFlow}
                      onChange={(e) => setFormData({ ...formData, selectedFlow: e.target.value })}
                      className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-blue-50 text-blue-800 font-medium"
                    >
                      <option value="">Selecione um fluxo...</option>
                      {WHATSAPP_FLOWS.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-blue-500 mt-2">O cliente entrará neste fluxo automático ao receber a campanha.</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Agendar Para (Opcional)</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary bg-white text-gray-900 text-sm"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                >
                  <option value="send_message">Enviar Mensagem</option>
                  <option value="create_task">Criar Tarefa</option>
                  <option value="notify_team">Notificar Equipe</option>
                </select>
              </div>
              <div className="col-span-2">
                {/* Simplified template selector for automation for now */}
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Modelo de Mensagem</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg text-sm">
                  <option>Usar Padrão do Sistema</option>
                  <option>Personalizado</option>
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
