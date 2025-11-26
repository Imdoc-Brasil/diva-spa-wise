
import React, { useState, useEffect } from 'react';
import { X, Scan, Activity, ShoppingBag, Calendar, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Product } from '../../types';

interface SkinAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientPhotoUrl?: string; // URL of the photo to analyze
}

// Mock Analysis Data
const mockAnalysisData = [
  { subject: 'Hidratação', A: 40, fullMark: 100 },
  { subject: 'Oleosidade', A: 85, fullMark: 100 },
  { subject: 'Poros', A: 60, fullMark: 100 },
  { subject: 'Manchas', A: 50, fullMark: 100 },
  { subject: 'Rugas', A: 70, fullMark: 100 },
  { subject: 'Textura', A: 65, fullMark: 100 },
];

const recommendedProducts = [
    { id: 'p3', name: 'Sérum Vitamina C 20%', price: 245.00, reason: 'Tratamento de Manchas' },
    { id: 'p1', name: 'Kit Controle de Oleosidade', price: 189.90, reason: 'Zona T Comprometida' }
];

const recommendedServices = [
    { id: 's2', name: 'Limpeza de Pele Profunda', price: 180.00, reason: 'Desobstrução de Poros' },
    { id: 's5', name: 'Peeling Químico', price: 350.00, reason: 'Renovação de Textura' }
];

const SkinAnalysisModal: React.FC<SkinAnalysisModalProps> = ({ isOpen, onClose, clientName, clientPhotoUrl }) => {
  const [step, setStep] = useState<'scanning' | 'results'>('scanning');
  const [scanProgress, setScanProgress] = useState(0);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
        setStep('scanning');
        setScanProgress(0);
        
        // Simulate scanning process
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setStep('results'), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
        return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const demoImage = clientPhotoUrl || 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop'; // Default face

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-diva-dark/95 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden relative">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
        >
            <X size={24} />
        </button>

        {/* LEFT COLUMN: VISUAL ANALYSIS */}
        <div className="w-1/2 bg-black relative flex items-center justify-center overflow-hidden">
            <img 
                src={demoImage} 
                alt="Analysis Subject" 
                className={`w-full h-full object-cover opacity-80 transition-all duration-1000 ${step === 'scanning' ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`} 
            />
            
            {/* Scanning Overlay */}
            {step === 'scanning' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <div className="w-full h-1 bg-diva-primary shadow-[0_0_20px_#14808C] absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                    <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl text-white flex flex-col items-center">
                        <Loader2 size={32} className="animate-spin text-diva-accent mb-2" />
                        <p className="font-mono font-bold text-lg tracking-widest">ANALISANDO DERME...</p>
                        <p className="text-xs text-diva-light mt-1">{scanProgress}% Concluído</p>
                    </div>
                </div>
            )}

            {/* Results Overlay (Points of interest) */}
            {step === 'results' && (
                <div className="absolute inset-0 z-10 animate-in fade-in duration-1000">
                    {/* Simulated AI detection points */}
                    <div className="absolute top-[30%] left-[40%] w-4 h-4 border-2 border-red-500 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute top-[30%] left-[40%] w-32 h-10 border-l-2 border-red-500 pl-2 text-red-500 text-xs font-bold">
                        Mancha Solar Detectada
                    </div>

                    <div className="absolute top-[45%] left-[55%] w-4 h-4 border-2 border-yellow-500 rounded-full animate-pulse"></div>
                    <div className="absolute top-[45%] left-[55%] w-32 h-10 border-l-2 border-yellow-500 pl-2 text-yellow-500 text-xs font-bold mt-4">
                        Poros Dilatados
                    </div>

                    <div className="absolute top-[35%] left-[65%] w-4 h-4 border-2 border-blue-500 rounded-full"></div>
                    <div className="absolute top-[35%] left-[65%] w-32 h-10 border-l-2 border-blue-500 pl-2 text-blue-500 text-xs font-bold -mt-6">
                        Desidratação Leve
                    </div>
                </div>
            )}
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-20 pointer-events-none"></div>
        </div>

        {/* RIGHT COLUMN: DATA & RECOMMENDATIONS */}
        <div className="w-1/2 bg-white flex flex-col">
            
            {step === 'scanning' ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 p-12 text-center">
                    <div>
                        <Sparkles size={48} className="mx-auto mb-4 text-diva-light animate-pulse" />
                        <h3 className="text-xl font-bold text-diva-dark">Processando Imagem</h3>
                        <p className="text-sm mt-2">Nossa IA está mapeando 120 pontos faciais para identificar necessidades clínicas.</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-500">
                    
                    {/* Header Results */}
                    <div className="p-8 border-b border-diva-light/20 bg-gray-50">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-diva-dark">Relatório de Pele</h2>
                                <p className="text-gray-500 text-sm">Paciente: {clientName} • {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-gray-400 uppercase">Idade da Pele</span>
                                <p className="text-3xl font-bold text-diva-primary">32 Anos</p>
                            </div>
                        </div>

                        {/* Radar Chart */}
                        <div className="h-64 w-full relative -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockAnalysisData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                    <Radar
                                        name="Pele Atual"
                                        dataKey="A"
                                        stroke="#14808C"
                                        strokeWidth={2}
                                        fill="#14808C"
                                        fillOpacity={0.4}
                                    />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                            {/* Score Badge */}
                            <div className="absolute top-0 right-0 bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center">
                                <span className="block text-xs font-bold text-gray-400 uppercase">Score Geral</span>
                                <span className="block text-2xl font-bold text-diva-dark">62/100</span>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="p-8 space-y-8">
                        
                        {/* Products */}
                        <div>
                            <h3 className="flex items-center font-bold text-diva-dark mb-4 text-lg">
                                <ShoppingBag size={20} className="mr-2 text-diva-primary" /> Home Care Recomendado
                            </h3>
                            <div className="space-y-3">
                                {recommendedProducts.map(prod => (
                                    <div key={prod.id} className="flex justify-between items-center p-4 rounded-xl border border-gray-200 hover:border-diva-primary transition-colors bg-white shadow-sm">
                                        <div>
                                            <p className="font-bold text-diva-dark">{prod.name}</p>
                                            <p className="text-xs text-orange-500 font-medium flex items-center mt-1">
                                                <Sparkles size={12} className="mr-1" /> Motivo: {prod.reason}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-diva-dark">R$ {prod.price.toFixed(2)}</p>
                                            <button className="text-xs text-diva-primary font-bold hover:underline mt-1">Adicionar à Sacola</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Treatments */}
                        <div>
                            <h3 className="flex items-center font-bold text-diva-dark mb-4 text-lg">
                                <Activity size={20} className="mr-2 text-diva-accent" /> Protocolos em Cabine
                            </h3>
                            <div className="space-y-3">
                                {recommendedServices.map(srv => (
                                    <div key={srv.id} className="flex justify-between items-center p-4 rounded-xl border border-gray-200 hover:border-diva-accent transition-colors bg-white shadow-sm">
                                        <div>
                                            <p className="font-bold text-diva-dark">{srv.name}</p>
                                            <p className="text-xs text-blue-500 font-medium flex items-center mt-1">
                                                <Sparkles size={12} className="mr-1" /> Motivo: {srv.reason}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-diva-dark">R$ {srv.price.toFixed(2)}</p>
                                            <button className="text-xs text-diva-accent font-bold hover:underline mt-1">Agendar Agora</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-diva-light/20 bg-gray-50 mt-auto flex justify-between items-center">
                        <button className="flex items-center text-gray-500 text-sm hover:text-diva-dark">
                            <Calendar size={16} className="mr-2" /> Reavaliar em 30 dias
                        </button>
                        <button className="bg-diva-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-diva-dark transition-all flex items-center">
                            Enviar Relatório WhatsApp <ArrowRight size={18} className="ml-2" />
                        </button>
                    </div>

                </div>
            )}
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SkinAnalysisModal;
