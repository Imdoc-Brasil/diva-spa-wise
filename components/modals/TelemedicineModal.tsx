
import React, { useState, useEffect, useRef } from 'react';
import { Client, Product } from '../../types';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, FileText, ShoppingBag, Camera, Plus, Settings, Share } from 'lucide-react';

interface TelemedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  appointmentId: string;
}

// Mock Products for Prescription
const mockPrescriptionProducts: Product[] = [
    { id: 'p1', name: 'Kit Pós-Laser Calmante', price: 189.90, category: 'homecare', description: '' },
    { id: 'p3', name: 'Sérum Vitamina C 20%', price: 245.00, category: 'homecare', description: '' },
    { id: 'p7', name: 'Protetor Solar FPS 70', price: 120.00, category: 'homecare', description: '' },
];

const TelemedicineModal: React.FC<TelemedicineModalProps> = ({ isOpen, onClose, clientName, appointmentId }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'prescription' | 'chat'>('notes');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);
  const [prescribedItems, setPrescribedItems] = useState<Product[]>([]);

  // Timer
  useEffect(() => {
    if (isOpen) {
        const timer = setInterval(() => setDuration(d => d + 1), 1000);
        return () => clearInterval(timer);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrescribe = (prod: Product) => {
      if (!prescribedItems.find(i => i.id === prod.id)) {
          setPrescribedItems([...prescribedItems, prod]);
      }
  };

  const handleRemovePrescription = (id: string) => {
      setPrescribedItems(prescribedItems.filter(i => i.id !== id));
  };

  const handleSnapshot = () => {
      // Simulate snapshot flash
      const flash = document.getElementById('camera-flash');
      if(flash) {
          flash.style.opacity = '1';
          setTimeout(() => flash.style.opacity = '0', 100);
      }
      // Logic to save image would go here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black text-white flex flex-col md:flex-row overflow-hidden animate-in zoom-in duration-300">
      
      {/* MAIN VIDEO AREA (LEFT) */}
      <div className="flex-1 relative bg-gray-900 flex flex-col">
          {/* Header Overlay */}
          <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start">
              <div>
                  <h2 className="font-bold text-lg">{clientName}</h2>
                  <div className="flex items-center gap-2 text-xs text-red-500 font-mono">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      REC {formatTime(duration)}
                  </div>
              </div>
              <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/10">
                  Conexão Criptografada (E2EE)
              </div>
          </div>

          {/* Video Feed (Mock) */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop" 
                alt="Patient" 
                className="w-full h-full object-cover"
              />
              
              {/* Flash Effect Layer */}
              <div id="camera-flash" className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"></div>

              {/* Self View (PiP) */}
              <div className="absolute bottom-24 right-6 w-32 h-48 bg-black rounded-xl border border-white/20 overflow-hidden shadow-2xl">
                  {!isVideoOff ? (
                      <img 
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop" 
                        alt="Doctor" 
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <VideoOff size={24} className="text-white/50" />
                      </div>
                  )}
              </div>
          </div>

          {/* Controls Bar */}
          <div className="h-20 bg-gray-900 border-t border-white/10 flex items-center justify-center gap-4 relative z-20">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
              >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              
              <button 
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
              >
                  {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>

              <button 
                onClick={onClose}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white px-8 shadow-lg hover:scale-105 transition-all"
              >
                  <PhoneOff size={24} />
              </button>

              <button onClick={handleSnapshot} className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white absolute right-6 hidden md:block" title="Capturar Foto">
                  <Camera size={24} />
              </button>
              
              <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white absolute left-6 hidden md:block" title="Configurações">
                  <Settings size={24} />
              </button>
          </div>
      </div>

      {/* SIDEBAR (CLINICAL TOOLS) */}
      <div className="w-full md:w-96 bg-white text-gray-800 flex flex-col border-l border-gray-200">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'notes' ? 'text-diva-primary border-b-2 border-diva-primary bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  <FileText size={16} className="mx-auto mb-1" /> Notas
              </button>
              <button 
                onClick={() => setActiveTab('prescription')}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'prescription' ? 'text-diva-primary border-b-2 border-diva-primary bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  <ShoppingBag size={16} className="mx-auto mb-1" /> Prescrição
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'chat' ? 'text-diva-primary border-b-2 border-diva-primary bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  <MessageSquare size={16} className="mx-auto mb-1" /> Chat
              </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              
              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                  <div className="space-y-4 h-full flex flex-col">
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800">
                          <strong>Histórico:</strong> Última visita em 10/Out. Fez Laser Perna. Relatou sensibilidade leve.
                      </div>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Digite a evolução clínica aqui..."
                        className="flex-1 w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-diva-primary focus:border-transparent outline-none resize-none text-sm"
                      ></textarea>
                      <button className="w-full bg-diva-dark text-white py-3 rounded-xl font-bold text-sm hover:bg-diva-primary transition-colors">
                          Salvar no Prontuário
                      </button>
                  </div>
              )}

              {/* PRESCRIPTION TAB */}
              {activeTab === 'prescription' && (
                  <div className="space-y-6">
                      {/* Prescribed List */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-h-[150px]">
                          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Itens Recomendados</h3>
                          {prescribedItems.length === 0 ? (
                              <p className="text-sm text-gray-400 italic text-center mt-8">Nenhum item adicionado.</p>
                          ) : (
                              <ul className="space-y-2">
                                  {prescribedItems.map(item => (
                                      <li key={item.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                          <span className="font-medium text-diva-dark">{item.name}</span>
                                          <button onClick={() => handleRemovePrescription(item.id)} className="text-red-400 hover:text-red-600"><X size={14}/></button>
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </div>

                      {/* Suggestions */}
                      <div>
                          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Sugestões Rápidas</h3>
                          <div className="space-y-2">
                              {mockPrescriptionProducts.map(prod => (
                                  <div key={prod.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 hover:border-diva-primary transition-colors group">
                                      <div>
                                          <p className="text-sm font-bold text-diva-dark">{prod.name}</p>
                                          <p className="text-xs text-gray-500">R$ {prod.price.toFixed(2)}</p>
                                      </div>
                                      <button 
                                        onClick={() => handlePrescribe(prod)}
                                        className="bg-gray-100 text-gray-600 p-1.5 rounded-lg hover:bg-diva-primary hover:text-white transition-colors"
                                      >
                                          <Plus size={16} />
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <button 
                        disabled={prescribedItems.length === 0}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                          <Share size={16} className="mr-2" /> Enviar Link de Pagamento
                      </button>
                  </div>
              )}

              {/* CHAT TAB */}
              {activeTab === 'chat' && (
                  <div className="flex flex-col h-full">
                      <div className="flex-1 border border-gray-200 rounded-xl bg-white mb-4 p-4 overflow-y-auto">
                          <div className="text-center text-xs text-gray-400 my-2">Chat iniciado</div>
                          {/* Mock Messages */}
                          <div className="flex justify-end mb-2">
                              <div className="bg-diva-primary text-white p-2 rounded-lg rounded-tr-none text-sm max-w-[80%]">
                                  Olá! Consegue me ouvir bem?
                              </div>
                          </div>
                          <div className="flex justify-start mb-2">
                              <div className="bg-gray-100 text-gray-800 p-2 rounded-lg rounded-tl-none text-sm max-w-[80%]">
                                  Sim, o áudio está ótimo.
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <input type="text" placeholder="Digite..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-diva-primary" />
                          <button className="bg-diva-dark text-white p-2 rounded-lg"><Share size={16} /></button>
                      </div>
                  </div>
              )}

          </div>
      </div>
    </div>
  );
};

export default TelemedicineModal;
