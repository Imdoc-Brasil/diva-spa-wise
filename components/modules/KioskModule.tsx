
import React, { useState, useRef } from 'react';
import { ChevronRight, Phone, CheckCircle, Smile, Meh, Frown, Sparkles, RefreshCw, LogOut, FileText, Edit3, ArrowRight, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormTemplate, FormField } from '../../types';
import { maskPhone } from '../../utils/masks';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';

// Mock Pending Form based on types created in SettingsModule
const mockPendingForm: FormTemplate = {
    id: 'f_kiosk',
    organizationId: 'org_demo',
    title: 'Anamnese Facial Obrigatória',
    type: 'anamnesis',
    active: true,
    createdAt: new Date().toISOString(),
    fields: [
        { id: 'k1', type: 'section_header', label: 'Histórico de Saúde', required: false, width: 'full' },
        { id: 'k2', type: 'select', label: 'Está gestante ou lactante?', required: true, options: ['Não', 'Sim - Gestante', 'Sim - Lactante'], width: 'full' },
        { id: 'k3', type: 'checkbox', label: 'Fez uso de ácidos na pele nos últimos 7 dias?', required: true, width: 'full' },
        { id: 'k4', type: 'text', label: 'Possui alguma alergia conhecida?', required: false, placeholder: 'Ex: Dipirona, Latex...', width: 'full' },
        { id: 'k5', type: 'signature', label: 'Termo de Responsabilidade', required: true, width: 'full' }
    ]
};

const KioskModule: React.FC = () => {
    const { clients, appointments, addFormResponse } = useData();
    const { addToast } = useToast();
    const [step, setStep] = useState<'welcome' | 'identify' | 'confirm' | 'forms' | 'nps' | 'finish'>('welcome');
    const [phone, setPhone] = useState('');
    const [clientName, setClientName] = useState('');

    // Form State
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const navigate = useNavigate();

    const handleNumberClick = (num: string) => {
        if (phone.length < 11) {
            setPhone(prev => prev + num);
        }
    };

    const handleBackspace = () => {
        setPhone(prev => prev.slice(0, -1));
    };

    const handleIdentify = () => {
        const cleanPhone = phone.replace(/\D/g, '');
        // Try to find client
        const foundClient = clients.find(c => c.phone.replace(/\D/g, '').includes(cleanPhone));

        if (foundClient) {
            setClientName(foundClient.name);
            setStep('confirm');
        } else if (phone === '11999999999') {
            // Demo Fallback
            setClientName('Ana Silva (Demo)');
            setStep('confirm');
        } else {
            addToast('Cliente não encontrado. Tente (11) 99999-9999 para demo.', 'error');
        }
    };

    const handleConfirmCheckin = () => {
        // Check for pending forms logic (Mocked: always true for demo)
        setStep('forms');
    };

    const handleFormSubmit = () => {
        const response: any = { // Using any to bypass strict FormResponse type check for demo
            id: `fr_${Date.now()}`,
            templateId: mockPendingForm.id,
            clientId: 'demo_client',
            clientName: clientName,
            answers: formValues,
            submittedAt: new Date().toISOString(),
            staffReviewed: false
        };
        addFormResponse(response);
        setStep('nps');
    };

    const handleNpsSubmit = (score: number) => {
        setStep('finish');
        setTimeout(() => {
            setStep('welcome');
            setPhone('');
            setClientName('');
            setFormValues({});
        }, 5000);
    };



    // Signature Canvas Logic
    const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);

        const { offsetX, offsetY } = getCoords(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#14808C'; // Diva Primary
    };

    const draw = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { offsetX, offsetY } = getCoords(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        // Mark signature field as filled
        setFormValues(prev => ({ ...prev, signature: true }));
    };

    const getCoords = (e: React.TouchEvent | React.MouseEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top
        };
    };

    return (
        <div className="min-h-screen bg-diva-dark text-white flex flex-col relative overflow-hidden font-sans select-none">

            {/* Kiosk Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-diva-accent" />
                    <span className="font-serif tracking-widest font-bold">DIVA SPA</span>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="text-white/20 hover:text-white transition-colors p-2"
                    title="Sair do Modo Kiosk"
                >
                    <LogOut size={20} />
                </button>
            </div>

            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-diva-primary rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-diva-accent rounded-full blur-[150px]"></div>
            </div>

            {/* STEP: WELCOME */}
            {step === 'welcome' && (
                <div
                    onClick={() => setStep('identify')}
                    className="flex-1 z-10 flex flex-col items-center justify-center cursor-pointer animate-in fade-in duration-700"
                >
                    <div className="w-32 h-32 rounded-full border border-white/20 flex items-center justify-center mb-8 animate-pulse">
                        <span className="text-4xl">👋</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-center mb-6">Bem-vindo</h1>
                    <p className="text-xl md:text-2xl text-diva-light text-center max-w-md">
                        Toque na tela para realizar seu check-in
                    </p>
                    <div className="mt-12 text-sm uppercase tracking-widest opacity-50 flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        Toque para iniciar
                    </div>
                </div>
            )}

            {/* STEP: IDENTIFY */}
            {step === 'identify' && (
                <div className="flex-1 z-10 flex flex-col items-center justify-center max-w-md mx-auto w-full p-6 animate-in slide-in-from-bottom-10 duration-500">
                    <h2 className="text-2xl font-bold mb-8 flex items-center">
                        <Phone className="mr-3 text-diva-accent" /> Digite seu celular
                    </h2>

                    <div className="w-full bg-white/10 rounded-2xl p-4 text-center mb-8 border border-white/10 h-20 flex items-center justify-center">
                        <span className={`text-3xl font-mono tracking-widest ${phone ? 'text-white' : 'text-white/30'}`}>
                            {phone ? maskPhone(phone) : '(__) _____-____'}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full mb-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                onClick={() => handleNumberClick(num.toString())}
                                className="h-16 rounded-xl bg-white/5 border border-white/10 text-2xl font-medium hover:bg-white/20 active:scale-95 transition-all"
                            >
                                {num}
                            </button>
                        ))}
                        <button onClick={() => setStep('welcome')} className="h-16 rounded-xl text-sm font-bold text-white/50 hover:text-white">VOLTAR</button>
                        <button onClick={() => handleNumberClick('0')} className="h-16 rounded-xl bg-white/5 border border-white/10 text-2xl font-medium hover:bg-white/20 active:scale-95 transition-all">0</button>
                        <button onClick={handleBackspace} className="h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-diva-alert">⌫</button>
                    </div>

                    <button
                        onClick={handleIdentify}
                        disabled={phone.length < 11}
                        className="w-full py-5 bg-diva-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-diva-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:bg-white hover:text-diva-primary transition-all"
                    >
                        Continuar <ChevronRight className="ml-2" />
                    </button>
                </div>
            )}

            {/* STEP: CONFIRM */}
            {step === 'confirm' && (
                <div className="flex-1 z-10 flex flex-col items-center justify-center max-w-md mx-auto w-full p-6 animate-in zoom-in duration-300">
                    <div className="w-24 h-24 rounded-full bg-diva-light/20 flex items-center justify-center mb-6 text-3xl font-bold text-white border-4 border-diva-dark shadow-xl">
                        {clientName.charAt(0)}
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Olá, {clientName}!</h2>

                    {/* Pending Action Alert */}
                    <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-4 mb-6 flex items-start gap-3 w-full">
                        <Edit3 className="text-orange-400 shrink-0" />
                        <div className="text-left">
                            <p className="text-orange-200 font-bold text-sm uppercase">Ação Necessária</p>
                            <p className="text-white text-sm mt-1">Você possui 1 ficha de anamnese pendente de atualização.</p>
                        </div>
                    </div>

                    <div className="w-full bg-white/10 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-diva-accent"></div>
                        <p className="text-sm text-white/60 uppercase font-bold mb-1">14:00 • Sala 01</p>
                        <p className="text-xl font-bold mb-1">Depilação a Laser - Perna</p>
                        <p className="text-sm text-white/80">Com Dra. Julia</p>
                    </div>

                    <button
                        onClick={handleConfirmCheckin}
                        className="w-full py-5 bg-diva-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-diva-primary/30 flex items-center justify-center hover:scale-105 transition-all mb-4"
                    >
                        <FileText className="mr-2" /> Preencher e Confirmar
                    </button>
                    <button
                        onClick={() => setStep('welcome')}
                        className="text-white/50 text-sm hover:text-white transition-colors"
                    >
                        Não sou {clientName}
                    </button>
                </div>
            )}

            {/* STEP: FORMS (SMART INTAKE) */}
            {step === 'forms' && (
                <div className="flex-1 z-10 flex flex-col w-full h-full bg-gray-100 text-gray-800 animate-in slide-in-from-right duration-500">

                    {/* Sticky Header */}
                    <div className="bg-white p-6 shadow-sm flex justify-between items-center shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-diva-dark">{mockPendingForm.title}</h2>
                            <p className="text-sm text-gray-500">Por favor, preencha com atenção.</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-diva-light/20 flex items-center justify-center text-diva-primary font-bold">
                            1/1
                        </div>
                    </div>

                    {/* Scrollable Form */}
                    <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-6 pb-24">
                        {mockPendingForm.fields.map(field => (
                            <div key={field.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                {field.type === 'section_header' ? (
                                    <h3 className="text-lg font-bold text-diva-primary border-b border-gray-100 pb-2">{field.label}</h3>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="block text-lg font-bold text-gray-700">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>

                                        {field.type === 'text' && (
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-lg outline-none focus:border-diva-primary transition-colors"
                                                placeholder={field.placeholder}
                                                value={formValues[field.id] || ''}
                                                onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                                            />
                                        )}

                                        {field.type === 'select' && (
                                            <div className="grid grid-cols-1 gap-3">
                                                {field.options?.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setFormValues({ ...formValues, [field.id]: opt })}
                                                        className={`p-4 rounded-xl text-left font-medium border-2 transition-all ${formValues[field.id] === opt ? 'border-diva-primary bg-diva-primary/10 text-diva-primary' : 'border-gray-200 bg-gray-50 text-gray-600'}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {field.type === 'checkbox' && (
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setFormValues({ ...formValues, [field.id]: 'yes' })}
                                                    className={`flex-1 p-4 rounded-xl font-bold border-2 transition-all ${formValues[field.id] === 'yes' ? 'border-diva-alert bg-red-50 text-diva-alert' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                                                >
                                                    SIM
                                                </button>
                                                <button
                                                    onClick={() => setFormValues({ ...formValues, [field.id]: 'no' })}
                                                    className={`flex-1 p-4 rounded-xl font-bold border-2 transition-all ${formValues[field.id] === 'no' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                                                >
                                                    NÃO
                                                </button>
                                            </div>
                                        )}

                                        {field.type === 'signature' && (
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 relative h-64 touch-none">
                                                <canvas
                                                    ref={canvasRef}
                                                    width={600}
                                                    height={250}
                                                    className="w-full h-full"
                                                    onTouchStart={startDrawing}
                                                    onTouchMove={draw}
                                                    onMouseDown={startDrawing}
                                                    onMouseMove={draw}
                                                />
                                                {!isDrawing && !formValues.signature && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                                        <div className="text-center">
                                                            <PenTool size={32} className="mx-auto mb-2" />
                                                            <p className="text-lg font-bold">Assine aqui com o dedo</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        const canvas = canvasRef.current;
                                                        const ctx = canvas?.getContext('2d');
                                                        if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                        setIsDrawing(false);
                                                        setFormValues(prev => ({ ...prev, signature: false }));
                                                    }}
                                                    className="absolute top-4 right-4 text-xs text-red-500 font-bold bg-white px-3 py-1 rounded border border-gray-200"
                                                >
                                                    LIMPAR
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] fixed bottom-0 left-0 w-full flex justify-between items-center z-30">
                        <button onClick={() => setStep('confirm')} className="text-gray-500 font-bold px-6 py-4">
                            Cancelar
                        </button>
                        <button
                            onClick={handleFormSubmit}
                            className="bg-diva-primary text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-diva-dark transition-all flex items-center"
                        >
                            Finalizar e Entrar <ArrowRight size={24} className="ml-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP: NPS */}
            {step === 'nps' && (
                <div className="flex-1 z-10 flex flex-col items-center justify-center max-w-2xl mx-auto w-full p-6 text-center animate-in slide-in-from-right duration-500">
                    <h2 className="text-3xl font-serif font-bold mb-4">Tudo Certo!</h2>
                    <p className="text-xl text-diva-light mb-12">Já avisamos a Dra. Julia. Enquanto aguarda, como avalia a facilidade deste check-in?</p>

                    <div className="flex justify-center gap-6 mb-12">
                        <button onClick={() => handleNpsSubmit(10)} className="flex flex-col items-center group">
                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-5xl group-hover:bg-green-500 group-hover:scale-110 transition-all">
                                <Smile />
                            </div>
                            <span className="mt-4 text-lg font-bold">Excelente</span>
                        </button>
                        <button onClick={() => handleNpsSubmit(5)} className="flex flex-col items-center group">
                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-5xl group-hover:bg-yellow-500 group-hover:scale-110 transition-all">
                                <Meh />
                            </div>
                            <span className="mt-4 text-lg font-bold">Normal</span>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP: FINISH */}
            {step === 'finish' && (
                <div className="flex-1 z-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-xl shadow-green-500/30">
                        <CheckCircle size={48} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-4">Aguarde na Recepção</h2>
                    <p className="text-xl text-diva-light max-w-md">
                        Seus dados foram atualizados e seu check-in confirmado. Tenha um ótimo procedimento!
                    </p>
                    <p className="mt-12 text-sm text-white/40 flex items-center">
                        <RefreshCw size={14} className="mr-2 animate-spin" /> Retornando ao início...
                    </p>
                </div>
            )}

            {/* Footer Branding */}
            {step !== 'forms' && (
                <div className="absolute bottom-6 w-full text-center z-20 text-[10px] text-white/20 uppercase tracking-[0.3em]">
                    Diva Spa Technology
                </div>
            )}
        </div>
    );
};

export default KioskModule;
