
import React, { useRef, useState, useEffect } from 'react';
import { Client, ClientDocument } from '../../types';
import { X, PenTool, Check, Download, Printer, AlertCircle, FileText } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  documentType: 'consent_laser' | 'image_rights' | 'anamnesis';
  onSign: (doc: ClientDocument) => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, client, documentType, onSign }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
        setHasSignature(false);
        setIsSigned(false);
        // Clear canvas
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Drawing Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
      let clientX, clientY;
      if ('touches' in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
      } else {
          clientX = (e as React.MouseEvent).clientX;
          clientY = (e as React.MouseEvent).clientY;
      }
      const rect = canvas.getBoundingClientRect();
      return {
          offsetX: clientX - rect.left,
          offsetY: clientY - rect.top
      };
  };

  const clearSignature = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setHasSignature(false);
      }
  };

  const handleFinish = () => {
      if (!hasSignature) return;
      setIsSigned(true);
      
      // Simulate API Save
      setTimeout(() => {
          const newDoc: ClientDocument = {
              id: `doc_${Date.now()}`,
              title: getDocTitle(),
              signedAt: new Date().toISOString(),
              status: 'signed',
              url: '#'
          };
          onSign(newDoc);
          onClose();
      }, 1500);
  };

  // Content Templates
  const getDocTitle = () => {
      switch(documentType) {
          case 'consent_laser': return 'Termo de Consentimento - Depilação a Laser';
          case 'image_rights': return 'Termo de Uso de Imagem';
          case 'anamnesis': return 'Confirmação de Anamnese';
          default: return 'Documento';
      }
  };

  const getDocContent = () => {
      const date = new Date().toLocaleDateString('pt-BR');
      
      if (documentType === 'consent_laser') {
          return (
              <div className="space-y-4 text-justify text-sm text-gray-700 leading-relaxed font-serif">
                  <p>Eu, <strong>{client.name}</strong>, portador(a) do CPF (Cadastrado), declaro ter sido informado(a) claramente sobre o procedimento de <strong>DEPILAÇÃO A LASER</strong>.</p>
                  
                  <p>1. Entendo que o tratamento consiste na aplicação de luz intensa pulsada ou laser para redução progressiva dos pelos.</p>
                  <p>2. Fui informado(a) que podem ocorrer reações adversas transitórias como: vermelhidão (eritema), inchaço (edema) perifolicular, sensação de ardor ou coceira leve.</p>
                  <p>3. Comprometo-me a NÃO me expor ao sol na área tratada por pelo menos 15 dias antes e depois da sessão, e a utilizar protetor solar FPS 30+.</p>
                  <p>4. Declaro não estar gestante, não fazer uso de ácidos na região e não ter ingerido medicamentos fotossensibilizantes (como Roacutan) nos últimos 6 meses.</p>
                  <p>5. Estou ciente de que o número de sessões varia conforme a fisiologia individual, cor da pele e do pelo.</p>
                  
                  <p className="mt-6 font-bold">São Paulo, {date}.</p>
              </div>
          );
      }
      return <p>Conteúdo não carregado.</p>;
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-diva-dark text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <FileText size={20} />
                <h3 className="font-bold text-lg">{getDocTitle()}</h3>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><X size={24} /></button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            <div className="bg-white p-8 shadow-sm border border-gray-200 min-h-[400px]">
                <div className="mb-8 text-center border-b border-gray-100 pb-4">
                    <h1 className="text-2xl font-serif font-bold text-diva-dark">Diva Spa</h1>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Excelência em Estética</p>
                </div>
                
                {getDocContent()}

                {/* Signature Area */}
                <div className="mt-12">
                    <p className="text-sm font-bold text-gray-700 mb-2">Assinatura Digital do Cliente</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 relative">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={160}
                            className="w-full touch-none cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        {!hasSignature && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                <p className="text-gray-400 text-sm">Assine aqui</p>
                            </div>
                        )}
                        {hasSignature && !isSigned && (
                            <button 
                                onClick={clearSignature}
                                className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700 bg-white/80 px-2 py-1 rounded shadow-sm border border-gray-200"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <AlertCircle size={10} className="mr-1" />
                        Ao assinar, você concorda legalmente com os termos acima. IP Registrado: 192.168.1.XX
                    </p>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center">
            <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-diva-dark rounded hover:bg-gray-100" title="Imprimir">
                    <Printer size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-diva-dark rounded hover:bg-gray-100" title="Baixar PDF">
                    <Download size={20} />
                </button>
            </div>
            
            <div className="flex gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                    Cancelar
                </button>
                <button 
                    onClick={handleFinish}
                    disabled={!hasSignature || isSigned}
                    className={`px-6 py-2 rounded-lg text-sm font-bold text-white flex items-center transition-all
                        ${!hasSignature || isSigned ? 'bg-gray-300 cursor-not-allowed' : 'bg-diva-primary hover:bg-diva-dark shadow-md'}`}
                >
                    {isSigned ? (
                        <>Salvo com Sucesso <Check size={16} className="ml-2" /></>
                    ) : (
                        <>Confirmar Assinatura <PenTool size={16} className="ml-2" /></>
                    )}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentModal;
