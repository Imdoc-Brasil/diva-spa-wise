
import React from 'react';
import { X, Sun, Calendar, TrendingUp, AlertTriangle, Quote, CheckCircle, Coffee } from 'lucide-react';
import { User } from '../../types';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const date = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-diva-dark/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Hero Header */}
        <div className="relative h-48 bg-gradient-to-r from-diva-primary to-diva-dark flex items-end p-8 text-white">
            <div className="absolute top-0 right-0 p-8 opacity-20">
                <Sun size={120} />
            </div>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors backdrop-blur-md"
            >
                <X size={20} />
            </button>
            
            <div className="relative z-10 w-full">
                <p className="text-diva-accent font-bold uppercase tracking-widest text-xs mb-2">{date}</p>
                <h1 className="text-4xl font-serif font-bold mb-1">Bom dia, {user.displayName.split(' ')[0]}!</h1>
                <p className="text-white/80 text-sm flex items-center">
                    <Coffee size={14} className="mr-2" /> Prepare-se para um dia produtivo.
                </p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Agenda Insight */}
                <div className="bg-white p-6 rounded-xl border-l-4 border-diva-primary shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-diva-dark text-lg">Sua Agenda Hoje</h3>
                            <p className="text-gray-500 text-xs">Foco total na manhã</p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-full text-diva-primary">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Atendimentos</span>
                            <span className="font-bold text-diva-dark">4 Confirmados</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Primeiro Horário</span>
                            <span className="font-bold text-diva-dark">09:00</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Buracos na Agenda</span>
                            <span className="font-bold text-green-600">2 horários (Tarde)</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400 italic">Dica: Utilize os horários livres da tarde para follow-up de leads.</p>
                    </div>
                </div>

                {/* Financial Insight */}
                <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-diva-dark text-lg">Flash Financeiro</h3>
                            <p className="text-gray-500 text-xs">Ontem vs Meta</p>
                        </div>
                        <div className="bg-green-50 p-2 rounded-full text-green-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-3xl font-bold text-diva-dark">R$ 7.250</span>
                        <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded mb-1">Meta Batida! 🚀</span>
                    </div>
                    <p className="text-sm text-gray-600">
                        O ticket médio subiu <strong>12%</strong> graças às vendas de Home Care.
                    </p>
                </div>

                {/* Alerts */}
                <div className="bg-white p-6 rounded-xl border-l-4 border-orange-400 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-diva-dark text-lg">Atenção Operacional</h3>
                            <p className="text-gray-500 text-xs">Prioridades do dia</p>
                        </div>
                        <div className="bg-orange-50 p-2 rounded-full text-orange-500">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            Reposição de Botox (Estoque Crítico)
                        </li>
                        <li className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                            Conta de Energia vence hoje
                        </li>
                        <li className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                            3 Leads do Instagram sem resposta
                        </li>
                    </ul>
                </div>

                {/* Motivation */}
                <div className="bg-gradient-to-br from-gray-800 to-black text-white p-6 rounded-xl shadow-lg flex flex-col justify-center relative overflow-hidden">
                    <Quote className="absolute top-4 left-4 opacity-20 text-diva-accent" size={40} />
                    <p className="text-lg font-serif italic text-center leading-relaxed relative z-10">
                        "A qualidade é a melhor estratégia de negócios."
                    </p>
                    <p className="text-xs text-center mt-4 text-diva-accent uppercase tracking-widest font-bold relative z-10">
                        — John Lasseter
                    </p>
                </div>

            </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-200 flex justify-center">
            <button 
                onClick={onClose}
                className="bg-diva-primary text-white px-12 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-diva-dark hover:scale-105 transition-all flex items-center"
            >
                Vamos Começar! <CheckCircle size={20} className="ml-2" />
            </button>
        </div>

      </div>
    </div>
  );
};

export default DailyBriefingModal;
