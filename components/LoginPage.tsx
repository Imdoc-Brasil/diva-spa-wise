
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { Lock, Mail, ArrowRight, User, Shield, Stethoscope, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Animation trigger on mount
  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Auto-fill for demo purposes based on role
    switch(role) {
        case UserRole.ADMIN: 
            setEmail('admin@divaspa.com'); 
            setPassword('admin123'); // Auto-filled for demo
            break;
        case UserRole.STAFF: 
            setEmail('dra.julia@divaspa.com'); 
            setPassword('staff123'); // Auto-filled for demo
            break;
        case UserRole.CLIENT: 
            setEmail('ana.silva@gmail.com'); 
            setPassword('client123'); // Auto-filled for demo
            break;
        case UserRole.FINANCE: 
            setEmail('financeiro@divaspa.com'); 
            setPassword('finance123'); // Auto-filled for demo
            break;
        default: 
            setEmail('');
            setPassword('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
        onLogin(selectedRole);
        setIsLoading(false);
    }, 1500);
  };

  // Shared Card Component for visual consistency
  const ProfileCard = ({ role, icon: Icon, title, desc, colorClass, delay }: any) => (
      <button 
        onClick={() => handleRoleSelect(role)}
        className={`w-full bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-diva-primary transition-all duration-300 group text-left flex items-center gap-5 transform translate-y-0 opacity-0 animate-slide-up`}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm shrink-0 transition-transform group-hover:scale-110 ${colorClass}`}>
            <Icon size={22} />
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-diva-dark text-base">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-diva-primary transition-colors" size={20} />
      </button>
  );

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* CSS for custom simple animations without external plugins */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>

      {/* Left Column: Brand & Image (Editorial) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-diva-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-overlay scale-105 hover:scale-100 transition-transform duration-[20s]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-diva-dark via-diva-dark/50 to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                        <Sparkles className="text-diva-accent" size={20} />
                    </div>
                    <span className="text-xl font-serif font-bold tracking-widest text-white/90">DIVA SPA</span>
                </div>
                <h1 className="text-6xl font-serif font-medium leading-[1.1] mb-6">
                    Be Your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-diva-light to-white font-italic">Best Self.</span>
                </h1>
            </div>

            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-4 group cursor-default">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-diva-primary group-hover:border-diva-primary transition-colors">
                        <Shield size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Segurança de Dados</p>
                        <p className="text-xs text-white/60">Criptografia Ponta-a-Ponta</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 group cursor-default">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-diva-primary group-hover:border-diva-primary transition-colors">
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Alta Disponibilidade</p>
                        <p className="text-xs text-white/60">SLA de 99.9% Garantido</p>
                    </div>
                </div>
            </div>
            
            <div className="text-[10px] text-white/30 uppercase tracking-widest animate-slide-up" style={{ animationDelay: '500ms' }}>
                © 2023 Diva Spa Technology
            </div>
        </div>
      </div>

      {/* Right Column: Interactive Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-[420px] relative">
            
            {/* Header Text */}
            <div className="text-center mb-10 animate-slide-up" style={{ animationDelay: '0ms' }}>
                <h2 className="text-3xl font-bold text-diva-dark mb-2">Bem-vindo de volta</h2>
                <p className="text-gray-500 text-sm">Acesse sua conta para gerenciar o spa.</p>
            </div>

            {/* CONTENT SWAPPER */}
            {!selectedRole ? (
                <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase text-center mb-6 tracking-widest animate-slide-up" style={{ animationDelay: '100ms' }}>
                        Selecione seu perfil (Demo)
                    </p>
                    
                    <ProfileCard 
                        role={UserRole.ADMIN} 
                        icon={Shield} 
                        title="Administrador / Gerente" 
                        desc="Acesso total ao sistema e configurações." 
                        colorClass="bg-diva-dark"
                        delay="200"
                    />
                    
                    <ProfileCard 
                        role={UserRole.STAFF} 
                        icon={Stethoscope} 
                        title="Profissional / Staff" 
                        desc="Agenda, Prontuários e Comissões." 
                        colorClass="bg-diva-primary"
                        delay="300"
                    />
                    
                    <ProfileCard 
                        role={UserRole.CLIENT} 
                        icon={User} 
                        title="Portal do Cliente" 
                        desc="Auto-agendamento e Clube de Pontos." 
                        colorClass="bg-diva-accent"
                        delay="400"
                    />
                </div>
            ) : (
                <form onSubmit={handleLogin} className="space-y-6 animate-slide-up">
                    <button 
                        type="button" 
                        onClick={() => setSelectedRole(null)} 
                        className="text-xs text-gray-400 hover:text-diva-dark flex items-center mb-6 transition-colors"
                    >
                        ← Voltar para seleção de perfil
                    </button>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0
                            ${selectedRole === UserRole.ADMIN ? 'bg-diva-dark' : 
                              selectedRole === UserRole.STAFF ? 'bg-diva-primary' : 'bg-diva-accent'}`}>
                            {selectedRole === UserRole.ADMIN ? <Shield size={18} /> : 
                             selectedRole === UserRole.STAFF ? <Stethoscope size={18} /> : <User size={18} />}
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Acessando como</p>
                            <p className="text-sm font-bold text-diva-dark capitalize">{selectedRole}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">E-mail Corporativo</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-diva-primary transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none transition-all bg-white"
                                    placeholder="nome@divaspa.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-diva-primary transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary outline-none transition-all bg-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <a href="#" className="text-xs font-bold text-diva-primary hover:text-diva-dark">Esqueceu a senha?</a>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full bg-diva-dark text-white py-4 rounded-xl font-bold shadow-lg shadow-diva-dark/20 flex items-center justify-center transition-all duration-300
                            ${isLoading ? 'opacity-80 cursor-wait' : 'hover:bg-diva-primary hover:shadow-diva-primary/30 hover:-translate-y-1'}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                Autenticando...
                            </span>
                        ) : (
                            <>Entrar no Sistema <ArrowRight size={18} className="ml-2" /></>
                        )}
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Ambiente Seguro • Diva Spa OS v2.0
                    </p>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
