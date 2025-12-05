
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Command, CornerDownLeft, User, Calendar, CreditCard, Settings,
  Home, Box, Plus, Beaker, Shirt, Move, Globe, Shield, GraduationCap,
  Building, Phone, PartyPopper, Tag
} from 'lucide-react';
import { useData } from './context/DataContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

type ResultType = 'navigation' | 'action' | 'client';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: ResultType;
  icon: React.ReactNode;
  action: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { clients } = useData();

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // --- COMPREHENSIVE DATA SOURCE ---
  const results: SearchResult[] = useMemo(() => {
    const baseResults: SearchResult[] = [
      // --- CORE NAVIGATION ---
      { id: 'nav-dashboard', title: 'Dashboard Central', type: 'navigation', icon: <Home size={18} />, action: () => navigate('/') },
      { id: 'nav-schedule', title: 'Agenda de Atendimentos', type: 'navigation', icon: <Calendar size={18} />, action: () => navigate('/schedule') },
      { id: 'nav-crm', title: 'CRM & Clientes', type: 'navigation', icon: <User size={18} />, action: () => navigate('/crm') },
      { id: 'nav-finance', title: 'Financeiro & Fluxo', type: 'navigation', icon: <CreditCard size={18} />, action: () => navigate('/finance') },
      { id: 'nav-rooms', title: 'Mapa de Salas', type: 'navigation', icon: <Box size={18} />, action: () => navigate('/rooms') },
      { id: 'nav-settings', title: 'Configurações', type: 'navigation', icon: <Settings size={18} />, action: () => navigate('/settings') },

      // --- NEW MODULES ---
      { id: 'nav-promotions', title: 'Promoções e Cupons', type: 'navigation', icon: <Tag size={18} />, action: () => navigate('/promotions') },
      { id: 'nav-pharmacy', title: 'Farmácia & Injetáveis', type: 'navigation', icon: <Beaker size={18} />, action: () => navigate('/pharmacy') },
      { id: 'nav-laundry', title: 'Enxoval & Lavanderia', type: 'navigation', icon: <Shirt size={18} />, action: () => navigate('/laundry') },
      { id: 'nav-concierge', title: 'Concierge & Fluxo', type: 'navigation', icon: <Move size={18} />, action: () => navigate('/concierge') },
      { id: 'nav-website', title: 'Editor de Site (Diva Pages)', type: 'navigation', icon: <Globe size={18} />, action: () => navigate('/website') },
      { id: 'nav-compliance', title: 'Compliance & ANVISA', type: 'navigation', icon: <Shield size={18} />, action: () => navigate('/compliance') },
      { id: 'nav-academy', title: 'Diva Academy (Treinamento)', type: 'navigation', icon: <GraduationCap size={18} />, action: () => navigate('/academy') },
      { id: 'nav-franchise', title: 'Gestão de Franquia', type: 'navigation', icon: <Building size={18} />, action: () => navigate('/franchise') },
      { id: 'nav-voice', title: 'Telefonia IA (Voice)', type: 'navigation', icon: <Phone size={18} />, action: () => navigate('/voice') },
      { id: 'nav-events', title: 'Gestão de Eventos', type: 'navigation', icon: <PartyPopper size={18} />, action: () => navigate('/events') },
      { id: 'nav-profile', title: 'Meu Perfil', type: 'navigation', icon: <User size={18} />, action: () => navigate('/profile') },

      // --- QUICK ACTIONS ---
      { id: 'act-new-appt', title: 'Novo Agendamento', subtitle: 'Criar horário na agenda', type: 'action', icon: <Plus size={18} />, action: () => navigate('/schedule') },
      { id: 'act-new-client', title: 'Cadastrar Cliente', subtitle: 'Adicionar novo perfil', type: 'action', icon: <User size={18} />, action: () => navigate('/crm') },
      { id: 'act-new-sale', title: 'Nova Venda (PDV)', subtitle: 'Abrir caixa rápido', type: 'action', icon: <CreditCard size={18} />, action: () => navigate('/marketplace') },
      { id: 'act-new-ticket', title: 'Abrir Chamado', subtitle: 'Suporte Técnico', type: 'action', icon: <Plus size={18} />, action: () => navigate('/help') },
    ];

    // --- DYNAMIC CLIENTS FROM CONTEXT ---
    const clientResults: SearchResult[] = clients.map(client => ({
      id: `cli-${client.clientId}`,
      title: client.name,
      subtitle: `${client.email} • ${client.behaviorTags.join(', ')}`,
      type: 'client' as ResultType,
      icon: <User size={18} />,
      action: () => navigate('/crm') // In future: navigate(`/crm/client/${client.clientId}`)
    }));

    return [...baseResults, ...clientResults];
  }, [clients, navigate]);

  // Filtering Logic
  const filteredResults = results.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle?.toLowerCase().includes(query.toLowerCase())
  );

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          filteredResults[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm transition-all duration-200">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Search Input */}
        <div className="flex items-center p-4 border-b border-gray-100">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
            placeholder="Digite um comando (ex: Farmácia, Novo, Ana)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded border border-gray-200">ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredResults.length > 0 ? (
            <>
              {filteredResults.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => {
                    result.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${index === selectedIndex ? 'bg-diva-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${index === selectedIndex ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {result.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${index === selectedIndex ? 'text-white' : 'text-diva-dark'}`}>
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className={`text-xs ${index === selectedIndex ? 'text-diva-light opacity-90' : 'text-gray-400'}`}>
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {index === selectedIndex && (
                    <CornerDownLeft size={16} className="text-white opacity-70" />
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p className="text-sm">Nenhum resultado encontrado para "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 px-4">
          <div className="flex gap-4">
            <span>Use <strong className="text-gray-600">↑↓</strong> para navegar</span>
            <span><strong className="text-gray-600">Enter</strong> para selecionar</span>
          </div>
          <div className="flex items-center gap-1">
            <Command size={10} />
            <span>Diva OS 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
