
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Sparkles, Volume2, ArrowRight } from 'lucide-react';

const promoSlides = [
    {
        id: 1,
        title: "Laser Day",
        subtitle: "Próximo dia 15/Nov",
        desc: "Condições especiais para pacotes corporais completos. Agende na recepção.",
        image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
        color: "from-purple-900"
    },
    {
        id: 2,
        title: "Novidade: Lavieen",
        subtitle: "Efeito BB Cream",
        desc: "O laser que trata manchas, poros e textura em uma única sessão.",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
        color: "from-pink-900"
    },
    {
        id: 3,
        title: "Clube Diva",
        subtitle: "Seja Exclusiva",
        desc: "Assine nosso clube e garanta tratamentos mensais a partir de R$ 99,90.",
        image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop",
        color: "from-diva-dark"
    }
];

const TvModule: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [time, setTime] = useState(new Date());
  const [lastCall, setLastCall] = useState<{name: string, room: string} | null>(null);

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Slide Rotator
  useEffect(() => {
    const slider = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % promoSlides.length);
    }, 8000); // 8 seconds per slide
    return () => clearInterval(slider);
  }, []);

  // Simulate "Calling Patient" Event
  useEffect(() => {
    // Simulate a call happening 3 seconds after mount for demo
    const timeout = setTimeout(() => {
        setLastCall({ name: 'Ana Silva', room: 'Sala 01' });
        // Play sound logic would go here
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const slide = promoSlides[currentSlide];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex font-sans select-none relative">
      
      {/* LEFT: CONTENT ROTATOR (75%) */}
      <div className="w-3/4 relative h-screen">
          <div className="absolute inset-0 z-0">
              <img 
                src={slide.image} 
                alt="Promo Background" 
                className="w-full h-full object-cover transition-opacity duration-1000 animate-in fade-in"
                key={slide.id} // Key change triggers animation
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-90`}></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-center p-24 animate-slide-up">
              <span className="text-diva-accent uppercase tracking-[0.3em] font-bold text-xl mb-4 animate-pulse">
                  {slide.subtitle}
              </span>
              <h1 className="text-8xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
                  {slide.title}
              </h1>
              <p className="text-3xl text-white/90 max-w-2xl font-light leading-relaxed drop-shadow-md">
                  {slide.desc}
              </p>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10">
              <div 
                key={slide.id}
                className="h-full bg-diva-accent animate-[width_8s_linear]" 
                style={{ width: '100%' }}
              ></div>
          </div>
      </div>

      {/* RIGHT: INFO & QUEUE (25%) */}
      <div className="w-1/4 bg-diva-dark border-l border-white/10 flex flex-col relative z-20">
          
          {/* Header/Clock */}
          <div className="p-8 border-b border-white/10 text-center bg-diva-dark/50 backdrop-blur-md">
              <div className="flex items-center justify-center gap-2 mb-2 opacity-70">
                  <Sparkles size={16} className="text-diva-accent" />
                  <span className="text-xs uppercase tracking-widest">Diva Spa</span>
              </div>
              <p className="text-5xl font-bold font-mono tracking-tighter">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-sm text-white/50 mt-1 uppercase">
                  {time.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
          </div>

          {/* Current Call (Hero) */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
              {lastCall ? (
                  <div className="text-center w-full animate-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-diva-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-[0_0_30px_rgba(20,128,140,0.6)]">
                          <Volume2 size={32} />
                      </div>
                      <p className="text-sm text-diva-accent uppercase font-bold tracking-widest mb-4">Chamada Atual</p>
                      <h2 className="text-4xl font-bold mb-2 leading-tight">{lastCall.name}</h2>
                      <div className="h-1 w-20 bg-white/20 mx-auto my-6"></div>
                      <div className="bg-white text-diva-dark px-6 py-3 rounded-xl inline-flex items-center gap-3 font-bold text-xl shadow-xl">
                          <MapPin size={24} className="text-diva-primary" /> {lastCall.room}
                      </div>
                  </div>
              ) : (
                  <div className="text-center opacity-30">
                      <Sparkles size={48} className="mx-auto mb-4" />
                      <p>Aguardando chamada...</p>
                  </div>
              )}

              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-diva-primary rounded-full blur-[100px] opacity-20 -z-10"></div>
          </div>

          {/* Next List */}
          <div className="bg-black/20 p-6">
              <h3 className="text-xs font-bold uppercase text-white/40 mb-4 tracking-widest">Próximos</h3>
              <div className="space-y-4">
                   <div className="flex items-center justify-between opacity-50">
                       <span className="font-medium">Beatriz Costa</span>
                       <span className="text-xs">14:30</span>
                   </div>
                   <div className="flex items-center justify-between opacity-50">
                       <span className="font-medium">Carla Dias</span>
                       <span className="text-xs">15:00</span>
                   </div>
                   <div className="flex items-center justify-between opacity-50">
                       <span className="font-medium">Fernanda L.</span>
                       <span className="text-xs">15:30</span>
                   </div>
              </div>
          </div>

          {/* Footer Weather/News Ticker */}
          <div className="p-4 bg-diva-primary text-white text-xs font-bold text-center">
              <div className="flex items-center justify-center gap-2">
                  <span>São Paulo, 24°C</span>
                  <span>•</span>
                  <span>Bem-estar e Tecnologia</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default TvModule;
