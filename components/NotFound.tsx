
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 text-9xl font-serif">4</div>
          <div className="absolute bottom-10 right-10 text-9xl font-serif">4</div>
      </div>

      <div className="bg-white p-12 rounded-2xl shadow-xl border border-diva-light/30 max-w-lg relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-diva-light/20 rounded-full flex items-center justify-center mx-auto mb-6 text-diva-primary">
            <MapPin size={48} className="animate-bounce" />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-diva-dark mb-2">Ops! Página não encontrada.</h1>
        <p className="text-gray-500 text-lg mb-8">
            Parece que você se perdeu nos corredores do nosso Spa Digital. 
            Esta página não existe ou foi movida.
        </p>

        <div className="space-y-3">
            <button 
                onClick={() => navigate('/')}
                className="w-full bg-diva-primary text-white py-3 rounded-xl font-bold hover:bg-diva-dark transition-colors flex items-center justify-center shadow-md"
            >
                <Home size={18} className="mr-2" /> Voltar ao Dashboard
            </button>
            
            <button 
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
                <Search size={18} className="mr-2" /> Buscar (Cmd+K)
            </button>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest">Diva Spa OS v2.0</p>
    </div>
  );
};

export default NotFound;
