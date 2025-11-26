
import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Share, Layout, EyeOff, Type, Image as ImageIcon, Move, Palette } from 'lucide-react';
import { Client } from '../../types';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  beforePhoto?: string;
  afterPhoto?: string;
}

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ isOpen, onClose, client, beforePhoto, afterPhoto }) => {
  const [layout, setLayout] = useState<'split-v' | 'split-h' | 'overlay'>('split-v');
  const [showPrivacyMask, setShowPrivacyMask] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const [caption, setCaption] = useState(`Resultado Incrível da ${client.name.split(' ')[0]}! ✨`);
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
      // Logic to capture canvas as image would go here (e.g., html2canvas)
      alert("Imagem gerada e baixada em Alta Resolução!");
  };

  const handleShare = () => {
      alert("Enviado para o WhatsApp do Marketing!");
  };

  const demoBefore = beforePhoto || 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400';
  const demoAfter = afterPhoto || 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-diva-dark w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex overflow-hidden border border-white/10">
        
        {/* LEFT: Editor Tools */}
        <div className="w-80 bg-gray-900 p-6 flex flex-col border-r border-white/10">
            <h2 className="text-white font-serif font-bold text-xl mb-6 flex items-center">
                <Palette className="mr-2 text-diva-accent" /> Diva Studio
            </h2>

            <div className="space-y-6 overflow-y-auto flex-1">
                {/* Layouts */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Layout</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={() => setLayout('split-v')}
                            className={`p-2 rounded border flex flex-col items-center gap-1 transition-all ${layout === 'split-v' ? 'border-diva-primary bg-diva-primary/20 text-diva-primary' : 'border-gray-700 text-gray-500 hover:bg-gray-800'}`}
                        >
                            <div className="flex gap-0.5 w-6 h-6">
                                <div className="bg-current w-1/2 h-full rounded-l-sm"></div>
                                <div className="bg-current w-1/2 h-full rounded-r-sm opacity-50"></div>
                            </div>
                            <span className="text-[9px]">Lado a Lado</span>
                        </button>
                        <button 
                            onClick={() => setLayout('split-h')}
                            className={`p-2 rounded border flex flex-col items-center gap-1 transition-all ${layout === 'split-h' ? 'border-diva-primary bg-diva-primary/20 text-diva-primary' : 'border-gray-700 text-gray-500 hover:bg-gray-800'}`}
                        >
                            <div className="flex flex-col gap-0.5 w-6 h-6">
                                <div className="bg-current w-full h-1/2 rounded-t-sm"></div>
                                <div className="bg-current w-full h-1/2 rounded-b-sm opacity-50"></div>
                            </div>
                            <span className="text-[9px]">Vertical</span>
                        </button>
                        <button 
                            onClick={() => setLayout('overlay')}
                            className={`p-2 rounded border flex flex-col items-center gap-1 transition-all ${layout === 'overlay' ? 'border-diva-primary bg-diva-primary/20 text-diva-primary' : 'border-gray-700 text-gray-500 hover:bg-gray-800'}`}
                        >
                            <div className="relative w-6 h-6">
                                <div className="bg-current w-full h-full rounded-sm"></div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-white/50 rounded-sm"></div>
                            </div>
                            <span className="text-[9px]">Sobreposto</span>
                        </button>
                    </div>
                </div>

                {/* Privacy */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Privacidade & Marca</label>
                    <div className="space-y-2">
                        <button 
                            onClick={() => setShowPrivacyMask(!showPrivacyMask)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${showPrivacyMask ? 'bg-white text-diva-dark border-white' : 'bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                        >
                            <span className="text-sm font-bold flex items-center"><EyeOff size={16} className="mr-2" /> Ocultar Identidade</span>
                            <div className={`w-4 h-4 rounded-full border ${showPrivacyMask ? 'bg-diva-primary border-diva-primary' : 'border-gray-500'}`}></div>
                        </button>
                        <button 
                            onClick={() => setShowWatermark(!showWatermark)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${showWatermark ? 'bg-white text-diva-dark border-white' : 'bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                        >
                            <span className="text-sm font-bold flex items-center"><ImageIcon size={16} className="mr-2" /> Marca D'água</span>
                            <div className={`w-4 h-4 rounded-full border ${showWatermark ? 'bg-diva-primary border-diva-primary' : 'border-gray-500'}`}></div>
                        </button>
                    </div>
                </div>

                {/* Caption */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Legenda / Título</label>
                    <div className="bg-gray-800 rounded-lg p-2 border border-gray-700 focus-within:border-diva-primary transition-colors">
                        <input 
                            type="text" 
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full bg-transparent text-white text-sm outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
                <button 
                    onClick={handleDownload}
                    className="w-full py-3 bg-diva-primary text-white rounded-xl font-bold flex items-center justify-center hover:bg-white hover:text-diva-primary transition-all"
                >
                    <Download size={18} className="mr-2" /> Baixar Imagem
                </button>
                <button 
                    onClick={handleShare}
                    className="w-full py-3 border border-gray-600 text-gray-300 rounded-xl font-bold flex items-center justify-center hover:bg-gray-800 transition-all"
                >
                    <Share size={18} className="mr-2" /> Enviar Marketing
                </button>
            </div>
        </div>

        {/* RIGHT: Canvas Preview */}
        <div className="flex-1 bg-[#1a1a1a] relative flex items-center justify-center p-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            
            <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white p-2 bg-black/20 rounded-full hover:bg-black/50 transition-all">
                <X size={24} />
            </button>

            {/* THE CANVAS */}
            <div 
                ref={canvasRef}
                className="bg-white aspect-[4/5] h-full max-h-[600px] shadow-2xl relative overflow-hidden flex flex-col"
            >
                {/* Header Branding */}
                <div className="bg-diva-dark text-white p-4 flex justify-between items-center z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-diva-accent flex items-center justify-center font-serif font-bold text-xs">D</div>
                        <span className="font-serif tracking-widest text-sm font-bold">DIVA SPA</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider opacity-70">Resultado Clínico</span>
                </div>

                {/* Image Container based on Layout */}
                <div className={`flex-1 relative overflow-hidden ${layout === 'split-v' ? 'flex' : layout === 'split-h' ? 'flex flex-col' : ''}`}>
                    
                    {/* BEFORE IMAGE */}
                    <div className={`relative overflow-hidden group ${layout === 'split-v' ? 'w-1/2 h-full border-r border-white' : layout === 'split-h' ? 'h-1/2 w-full border-b border-white' : 'w-full h-full'}`}>
                        <img src={demoBefore} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Antes
                        </div>
                        {showPrivacyMask && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-12 bg-black blur-md opacity-90 rotate-[-5deg] cursor-move group-hover:ring-2 ring-white/50">
                                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[10px]">PROTEGIDO</div>
                            </div>
                        )}
                    </div>

                    {/* AFTER IMAGE */}
                    <div className={`relative overflow-hidden group ${layout === 'split-v' ? 'w-1/2 h-full' : layout === 'split-h' ? 'h-1/2 w-full' : 'absolute inset-0 w-1/2 h-1/2 bottom-4 right-4 border-4 border-white shadow-xl rounded-lg'}`}>
                        <img src={demoAfter} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-diva-primary/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            Depois
                        </div>
                        {showPrivacyMask && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-12 bg-black blur-md opacity-90 rotate-[-5deg] cursor-move"></div>
                        )}
                    </div>

                </div>

                {/* Footer Caption */}
                <div className="bg-white p-4 z-20 border-t border-gray-100">
                    <h3 className="font-bold text-diva-dark text-lg leading-tight mb-1">{caption}</h3>
                    <p className="text-xs text-gray-400">Procedimento realizado por especialistas. Os resultados podem variar.</p>
                </div>

                {/* Watermark Overlay */}
                {showWatermark && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-10">
                        <h1 className="text-6xl font-bold -rotate-45">DIVA SPA</h1>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
