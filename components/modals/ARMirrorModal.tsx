
import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Sparkles, Wand2, SplitSquareHorizontal, RefreshCw, Info } from 'lucide-react';

interface ARMirrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
}

const filters = [
    { id: 'none', name: 'Natural', icon: <X size={16} />, css: '' },
    { id: 'glow', name: 'Diva Glow', icon: <Sparkles size={16} />, css: 'contrast(1.1) brightness(1.2) saturate(1.1) blur(0.5px)' }, // Simulates hydrated/peeling skin
    { id: 'smooth', name: 'Pele de Porcelana', icon: <Wand2 size={16} />, css: 'contrast(1.05) brightness(1.1) blur(2px)' }, // Simulates laser smoothing
    { id: 'lift', name: 'Efeito Lifting', icon: <Sparkles size={16} />, css: 'contrast(1.2) saturate(0.9)' }, // Simulates Ultraformer (sharpening mock)
];

const ARMirrorModal: React.FC<ARMirrorModalProps> = ({ isOpen, onClose, clientName }) => {
  const [activeFilter, setActiveFilter] = useState('none');
  const [showComparison, setShowComparison] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
        startCamera();
    } else {
        stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
              setIsCameraOn(true);
          }
      } catch (err) {
          console.error("Erro ao acessar câmera:", err);
          // Fallback handling usually goes here
      }
  };

  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
          setIsCameraOn(false);
      }
  };

  const handleCapture = () => {
      // Logic to capture canvas frame
      const flash = document.getElementById('ar-flash');
      if(flash) {
          flash.style.opacity = '1';
          setTimeout(() => flash.style.opacity = '0', 150);
      }
      setTimeout(() => alert("Simulação salva na Galeria do Cliente!"), 200);
  };

  if (!isOpen) return null;

  const currentFilterStyle = filters.find(f => f.id === activeFilter)?.css || '';

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in zoom-in duration-300">
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 z-30 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto">
                <h2 className="text-white font-serif font-bold text-2xl drop-shadow-md flex items-center gap-2">
                    <Sparkles className="text-diva-accent" /> Diva Vision AR
                </h2>
                <p className="text-white/80 text-sm font-medium">Simulando para: {clientName}</p>
            </div>
            <button 
                onClick={onClose} 
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md pointer-events-auto transition-all"
            >
                <X size={24} />
            </button>
        </div>

        {/* Main AR Viewport */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gray-900">
            {!isCameraOn && (
                <div className="text-white/50 flex flex-col items-center animate-pulse">
                    <Camera size={48} className="mb-4" />
                    <p>Iniciando Câmera...</p>
                </div>
            )}
            
            {/* The Video Feed */}
            <div className="relative w-full h-full max-w-4xl aspect-[3/4] md:aspect-video">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                />
                
                {/* AR Filter Layer (CSS Based Mock) */}
                {activeFilter !== 'none' && (
                    <div 
                        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] pointer-events-none transition-all duration-500"
                        style={{ 
                            backgroundImage: `url(${videoRef.current?.poster || ''})`, // Hack to allow filter app without duplicating video element easily in React without canvas
                            backdropFilter: showComparison ? 'none' : currentFilterStyle,
                            // In a real app, we'd process the video stream on a canvas or use WebGL. 
                            // For this React UI demo, we use backdrop-filter on a transparent overlay to simulate "glossing" or "blurring" the video behind it.
                        }}
                    >
                        {/* Simulation of Face Mesh / Tech Lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1"/>
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>
                )}

                {/* Comparison Slider Simulator */}
                {activeFilter !== 'none' && (
                    <div 
                        className="absolute inset-0 flex z-20 cursor-col-resize"
                        onMouseDown={() => setShowComparison(true)}
                        onMouseUp={() => setShowComparison(false)}
                        onTouchStart={() => setShowComparison(true)}
                        onTouchEnd={() => setShowComparison(false)}
                    >
                        {showComparison ? (
                            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md border border-white/20">
                                Original
                            </div>
                        ) : (
                            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-diva-primary/80 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md border border-white/20 animate-pulse">
                                Com Filtro {filters.find(f => f.id === activeFilter)?.name}
                            </div>
                        )}
                    </div>
                )}

                {/* Flash Effect */}
                <div id="ar-flash" className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-150 z-50"></div>
            </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-black/80 backdrop-blur-xl p-6 border-t border-white/10 z-30">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Filter Selector */}
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                    {filters.map(filter => (
                        <button 
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl min-w-[80px] transition-all border ${activeFilter === filter.id ? 'bg-diva-primary/20 border-diva-primary text-diva-primary' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeFilter === filter.id ? 'bg-diva-primary text-white' : 'bg-gray-800'}`}>
                                {filter.icon}
                            </div>
                            <span className="text-[10px] font-bold uppercase">{filter.name}</span>
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <button 
                        className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                        title="Trocar Câmera"
                    >
                        <RefreshCw size={20} />
                    </button>
                    
                    <button 
                        onClick={handleCapture}
                        className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative"
                    >
                        <div className="w-16 h-16 bg-white rounded-full group-hover:bg-diva-primary transition-colors"></div>
                    </button>

                    <button 
                        className={`p-4 rounded-full transition-colors ${showComparison ? 'bg-diva-primary text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                        onMouseDown={() => setShowComparison(true)}
                        onMouseUp={() => setShowComparison(false)}
                        title="Pressione para comparar"
                    >
                        <SplitSquareHorizontal size={20} />
                    </button>
                </div>
            </div>
            
            <div className="text-center mt-4 text-[10px] text-gray-500 flex items-center justify-center gap-1">
                <Info size={10} />
                Simulação ilustrativa. Os resultados reais podem variar conforme a fisiologia.
            </div>
        </div>
    </div>
  );
};

export default ARMirrorModal;
