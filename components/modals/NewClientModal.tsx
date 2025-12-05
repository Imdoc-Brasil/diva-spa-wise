
import React, { useState } from 'react';
import { X, Save, User, Phone, Mail, Tag, Megaphone, Users, Search } from 'lucide-react';
import { Client } from '../../types';
import { useUnitData } from '../hooks/useUnitData';
import { maskPhone, maskCPF, validateCPF, validateEmail } from '../../utils/masks';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient, clients, selectedUnitId } = useUnitData();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cpf: '',
    notes: '',
    channelSource: 'instagram',
    referredBy: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Referral Search State
  const [referrerSearch, setReferrerSearch] = useState('');
  const [showReferrerList, setShowReferrerList] = useState(false);
  const [selectedReferrer, setSelectedReferrer] = useState<Client | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    const newErrors: Record<string, string> = {};
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newClient: Client = {
      clientId: `c_${Date.now()}`,
      userId: `u_${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      cpf: formData.cpf,
      rfmScore: 0,
      behaviorTags: ['Novo'],
      lifetimeValue: 0,
      lastContact: new Date().toISOString(),
      channelSource: formData.channelSource,
      referredBy: selectedReferrer ? selectedReferrer.clientId : formData.referredBy,
      unitId: selectedUnitId === 'all' ? undefined : selectedUnitId
    };

    addClient(newClient);

    // Reset form
    setFormData({ name: '', phone: '', email: '', cpf: '', notes: '', channelSource: 'instagram', referredBy: '' });
    setSelectedReferrer(null);
    setReferrerSearch('');
    setErrors({});
    onClose();
  };

  // Filter clients for referral
  const filteredReferrers = clients.filter(c =>
    c.name.toLowerCase().includes(referrerSearch.toLowerCase()) ||
    c.phone.includes(referrerSearch)
  );

  const handleReferrerSelect = (client: Client) => {
    setSelectedReferrer(client);
    setReferrerSearch(client.name);
    setShowReferrerList(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-diva-primary text-white">
          <h3 className="font-bold text-lg flex items-center">
            <User size={20} className="mr-2" /> Novo Paciente
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900"
              placeholder="Ex: Maria Silva"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="tel"
                  required
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                  maxLength={15}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="email"
                  className={`w-full pl-9 pr-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="paciente@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CPF</label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 ${errors.cpf ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="000.000.000-00"
              value={formData.cpf || ''}
              onChange={(e) => {
                setFormData({ ...formData, cpf: maskCPF(e.target.value) });
                if (errors.cpf) setErrors({ ...errors, cpf: '' });
              }}
              maxLength={14}
            />
            {errors.cpf && <p className="text-xs text-red-500 mt-1">{errors.cpf}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Canal de Origem *</label>
            <div className="relative">
              <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900"
                value={formData.channelSource}
                onChange={(e) => setFormData({ ...formData, channelSource: e.target.value })}
              >
                <option value="instagram">Instagram</option>
                <option value="google">Google / Site</option>
                <option value="referral">Indicação (Amigo/Cliente)</option>
                <option value="facebook">Facebook</option>
                <option value="passing">Passou em frente</option>
                <option value="influencer">Influenciador</option>
                <option value="other">Outros</option>
              </select>
            </div>
          </div>

          {/* Referral Flow */}
          {formData.channelSource === 'referral' && (
            <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg animate-in fade-in">
              <label className="block text-xs font-bold text-purple-700 uppercase mb-1">Quem Indicou?</label>

              {!selectedReferrer ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={14} />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 bg-white text-gray-900"
                    placeholder="Buscar paciente existente..."
                    value={referrerSearch}
                    onChange={(e) => {
                      setReferrerSearch(e.target.value);
                      setShowReferrerList(true);
                    }}
                    onFocus={() => setShowReferrerList(true)}
                  />

                  {showReferrerList && referrerSearch && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-32 overflow-y-auto z-10">
                      {filteredReferrers.map(c => (
                        <div
                          key={c.clientId}
                          onClick={() => handleReferrerSelect(c)}
                          className="p-2 hover:bg-purple-50 cursor-pointer text-xs border-b border-gray-50 flex justify-between"
                        >
                          <span className="font-bold">{c.name}</span>
                          <span className="text-gray-500">{c.phone}</span>
                        </div>
                      ))}
                      {filteredReferrers.length === 0 && (
                        <div className="p-2 text-xs text-gray-400 text-center">Nenhum paciente encontrado.</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white p-2 rounded border border-purple-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                      {selectedReferrer.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{selectedReferrer.name}</span>
                  </div>
                  <button onClick={() => { setSelectedReferrer(null); setReferrerSearch(''); }} className="text-gray-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              )}

              <p className="text-[10px] text-purple-600 mt-1 flex items-center">
                <Users size={10} className="mr-1" /> Vincular indicação gera pontos de fidelidade.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observações Iniciais</label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all h-24 resize-none bg-white text-gray-900"
              placeholder="Detalhes importantes, horários preferidos..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
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
              <Save size={16} className="mr-2" /> Cadastrar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientModal;
