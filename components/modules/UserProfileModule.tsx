import React, { useState } from 'react';
import { User, UserPreferences } from '../../types';
import { User as UserIcon, Shield, Bell, Globe, Smartphone, LogOut, Save, Key, Mail, Edit2, Camera, Moon, Sun, Laptop, Settings } from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import { useData } from '../context/DataContext';

interface UserProfileModuleProps {
    user: User;
    onLogout: () => void;
}

const defaultPreferences: UserPreferences = {
    notifications: { email: true, push: true, whatsapp: false },
    theme: 'light',
    language: 'pt-BR',
    twoFactorEnabled: false
};

const UserProfileModule: React.FC<UserProfileModuleProps> = ({ user, onLogout }) => {
    const { addToast } = useToast();
    const { updateUser } = useData();
    const [activeTab, setActiveTab] = useState<'general' | 'security' | 'preferences'>('general');
    const [profile, setProfile] = useState({
        displayName: user.displayName,
        email: user.email,
        phone: user.profileData?.phoneNumber || '',
        bio: user.profileData?.bio || 'Profissional Diva Spa'
    });
    const [preferences, setPreferences] = useState<UserPreferences>(user.profileData?.preferences || defaultPreferences);

    const handleSave = () => {
        updateUser({
            displayName: profile.displayName,
            profileData: {
                ...user.profileData,
                phoneNumber: profile.phone,
                bio: profile.bio,
                preferences: preferences
            }
        });
        addToast('Perfil atualizado com sucesso!', 'success');
    };

    const updatePreferenceState = (newPreferences: UserPreferences) => {
        setPreferences(newPreferences);
        // Auto-save preferences
        updateUser({
            profileData: {
                ...user.profileData,
                preferences: newPreferences
            }
        });
    };

    const handleToggle2FA = () => {
        const newPreferences = { ...preferences, twoFactorEnabled: !preferences.twoFactorEnabled };
        updatePreferenceState(newPreferences);
        addToast(newPreferences.twoFactorEnabled ? '2FA Ativado com sucesso.' : '2FA Desativado.', newPreferences.twoFactorEnabled ? 'success' : 'warning');
    };

    const handlePasswordReset = () => {
        addToast('Um link de redefinição de senha foi enviado para seu e-mail.', 'success');
    };

    const handlePhotoUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result as string;
                    updateUser({ photoURL: result });
                    addToast('Foto de perfil atualizada!', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 relative overflow-hidden shrink-0">
                <div className="h-32 bg-gradient-to-r from-diva-primary to-diva-dark"></div>
                <div className="px-8 pb-6 flex items-end gap-6 -mt-12">
                    <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-6xl font-bold text-diva-dark relative group">
                        {user.photoURL ? (
                            <img src={user.photoURL} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span>{profile.displayName.charAt(0)}</span>
                        )}
                        <button onClick={handlePhotoUpload} className="absolute bottom-0 right-0 bg-diva-primary text-white p-2 rounded-full shadow-sm hover:bg-diva-dark transition-colors">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="flex-1 mb-2">
                        <h1 className="text-2xl font-bold text-diva-dark">{profile.displayName}</h1>
                        <p className="text-gray-500 text-sm">{user.email} • <span className="uppercase font-bold text-diva-primary text-xs bg-diva-primary/10 px-2 py-0.5 rounded">{user.role}</span></p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="mb-4 flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={16} className="mr-2" /> Sair da Conta
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">

                {/* Sidebar Tabs */}
                <div className="w-64 bg-white rounded-xl border border-diva-light/30 shadow-sm p-4 flex flex-col gap-2 shrink-0">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'general' ? 'bg-diva-light/20 text-diva-dark font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <UserIcon size={18} className="mr-3" /> Dados Pessoais
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'security' ? 'bg-diva-light/20 text-diva-dark font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Shield size={18} className="mr-3" /> Segurança & Login
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'preferences' ? 'bg-diva-light/20 text-diva-dark font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Settings size={18} className="mr-3" /> Preferências
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-y-auto p-8">

                    {activeTab === 'general' && (
                        <div className="max-w-2xl space-y-6">
                            <h2 className="text-xl font-bold text-diva-dark mb-6">Informações Básicas</h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={profile.displayName}
                                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Celular / WhatsApp</label>
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="(00) 00000-0000"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-bold text-gray-600">Bio Profissional</label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary outline-none h-24 resize-none"
                                        placeholder="Breve descrição sobre você..."
                                    />
                                    <p className="text-xs text-gray-400 text-right">Visível para clientes no agendamento online.</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleSave}
                                    className="bg-diva-primary text-white px-6 py-3 rounded-lg font-bold flex items-center hover:bg-diva-dark transition-colors"
                                >
                                    <Save size={18} className="mr-2" /> Salvar Alterações
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="max-w-2xl space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-diva-dark mb-4">Senha e Autenticação</h2>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-800 flex items-center"><Key size={16} className="mr-2" /> Alterar Senha</h4>
                                            <p className="text-sm text-gray-500">Última alteração há 3 meses.</p>
                                        </div>
                                        <button onClick={handlePasswordReset} className="text-sm font-bold text-diva-primary border border-diva-primary px-4 py-2 rounded-lg hover:bg-diva-light/10">
                                            Redefinir
                                        </button>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-800 flex items-center"><Smartphone size={16} className="mr-2" /> Autenticação de Dois Fatores (2FA)</h4>
                                            <p className="text-sm text-gray-500">Adiciona uma camada extra de segurança via SMS ou App.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={preferences.twoFactorEnabled} onChange={handleToggle2FA} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-diva-dark mb-4">Sessões Ativas</h2>
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Laptop size={20} className="text-gray-400" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">MacBook Pro (Este dispositivo)</p>
                                                <p className="text-xs text-gray-500">São Paulo, BR • Ativo agora</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">Atual</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 flex justify-between items-center opacity-70">
                                        <div className="flex items-center gap-3">
                                            <Smartphone size={20} className="text-gray-400" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">iPhone 13</p>
                                                <p className="text-xs text-gray-500">São Paulo, BR • Há 2 horas</p>
                                            </div>
                                        </div>
                                        <button className="text-xs text-red-500 font-bold hover:underline">Desconectar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="max-w-2xl space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-diva-dark mb-4">Notificações</h2>
                                <div className="bg-white border border-diva-light/30 rounded-xl p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail size={18} /></div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">Notificações por E-mail</p>
                                                <p className="text-xs text-gray-500">Resumos semanais e alertas de segurança.</p>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={preferences.notifications.email} onChange={() => updatePreferenceState({ ...preferences, notifications: { ...preferences.notifications, email: !preferences.notifications.email } })} className="accent-diva-primary w-5 h-5" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Bell size={18} /></div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">Push (Navegador/App)</p>
                                                <p className="text-xs text-gray-500">Alertas em tempo real sobre agendamentos.</p>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={preferences.notifications.push} onChange={() => updatePreferenceState({ ...preferences, notifications: { ...preferences.notifications, push: !preferences.notifications.push } })} className="accent-diva-primary w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-diva-dark mb-4">Aparência e Sistema</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => updatePreferenceState({ ...preferences, theme: 'light' })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${preferences.theme === 'light' ? 'border-diva-primary bg-diva-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <Sun size={24} className="mb-2 text-orange-500" />
                                        <p className="font-bold text-sm text-gray-800">Modo Claro</p>
                                        <p className="text-xs text-gray-500">Padrão do sistema</p>
                                    </button>
                                    <button
                                        onClick={() => updatePreferenceState({ ...preferences, theme: 'dark' })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${preferences.theme === 'dark' ? 'border-diva-primary bg-diva-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <Moon size={24} className="mb-2 text-indigo-500" />
                                        <p className="font-bold text-sm text-gray-800">Modo Escuro</p>
                                        <p className="text-xs text-gray-500">Descanso visual</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default UserProfileModule;