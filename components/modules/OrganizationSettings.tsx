
import React, { useState, useEffect } from 'react';
import { useOrganization } from '../context/OrganizationContext';
import { useData } from '../context/DataContext';
import { Save, Plus, Users, Building, CreditCard, Mail, Trash2, Shield, MoreHorizontal, User as UserIcon, ShoppingBag } from 'lucide-react';
import { Organization, UserRole } from '../../types';

const OrganizationSettings: React.FC = () => {
    const { organization, setOrganization } = useOrganization();
    const { members, inviteMember, removeMember, updateMemberRole } = useData();

    // Tab State
    const [activeTab, setActiveTab] = useState<'general' | 'team'>('general');

    // General Settings State
    const [formState, setFormState] = useState<Organization | null>(null);

    // Invite Member State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'staff' });

    useEffect(() => {
        if (organization) {
            setFormState(organization);
        }
    }, [organization]);

    if (!organization || !formState) return <div className="p-8 text-center text-gray-500">Carregando informações da organização...</div>;

    const handleSaveGeneral = () => {
        setOrganization(formState);
        alert('Dados da organização atualizados com sucesso!');
    };

    const handleSendInvite = () => {
        if (!inviteData.email || !inviteData.name) return;
        inviteMember(inviteData.email, inviteData.role as any, inviteData.name);
        setIsInviteModalOpen(false);
        setInviteData({ name: '', email: '', role: 'staff' });
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">

            {/* Header & Tabs */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-diva-dark">Configurações da Organização</h1>
                        <p className="text-gray-500">Gerencie sua clínica, marca e equipe.</p>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 gap-6">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`pb-3 px-1 text-sm font-medium transition-all ${activeTab === 'general' ? 'border-b-2 border-diva-primary text-diva-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Dados da Organização
                    </button>
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`pb-3 px-1 text-sm font-medium transition-all ${activeTab === 'team' ? 'border-b-2 border-diva-primary text-diva-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Equipe e Permissões
                    </button>
                </div>
            </div>

            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: General Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-diva-dark border-b border-gray-100 pb-3">
                                <Building size={20} className="text-diva-primary" /> Dados Gerais
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Organização</label>
                                    <input
                                        value={formState.name}
                                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-diva-primary transition-colors"
                                        placeholder="Ex: Clínica Dermatológica Dr. Silva"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                app.imdoc.com/
                                            </span>
                                            <input
                                                value={formState.slug}
                                                onChange={e => setFormState({ ...formState, slug: e.target.value })}
                                                className="flex-1 p-3 border border-gray-300 rounded-r-lg outline-none focus:border-diva-primary transition-colors min-w-0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Domínio Personalizado</label>
                                        <input
                                            value={formState.domain || ''}
                                            onChange={e => setFormState({ ...formState, domain: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-diva-primary transition-colors"
                                            placeholder="Ex: portal.minhaclinica.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cores da Marca</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 mb-1 block">Cor Primária</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={formState.primaryColor || '#8B5CF6'}
                                                    onChange={e => setFormState({ ...formState, primaryColor: e.target.value })}
                                                    className="h-10 w-10 rounded border-0 cursor-pointer"
                                                />
                                                <input
                                                    value={formState.primaryColor || ''}
                                                    onChange={e => setFormState({ ...formState, primaryColor: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 mb-1 block">Cor Secundária</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={formState.secondaryColor || '#EC4899'}
                                                    onChange={e => setFormState({ ...formState, secondaryColor: e.target.value })}
                                                    className="h-10 w-10 rounded border-0 cursor-pointer"
                                                />
                                                <input
                                                    value={formState.secondaryColor || ''}
                                                    onChange={e => setFormState({ ...formState, secondaryColor: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Marketplace Settings (New) */}
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                            <ShoppingBag size={18} />
                                        </div>
                                        <h3 className="font-bold text-gray-800">E-commerce / Boutique</h3>
                                    </div>

                                    <div className="pl-2 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="enableMarketplace"
                                                checked={formState.settings?.enableMarketplace || false}
                                                onChange={e => setFormState({
                                                    ...formState,
                                                    settings: { ...formState.settings, enableMarketplace: e.target.checked }
                                                })}
                                                className="w-4 h-4 text-diva-primary rounded border-gray-300 focus:ring-diva-primary"
                                            />
                                            <label htmlFor="enableMarketplace" className="text-sm text-gray-700 font-medium cursor-pointer">
                                                Habilitar Módulo "Boutique Diva" (Marketplace)
                                            </label>
                                        </div>

                                        {formState.settings?.enableMarketplace && (
                                            <div className="pl-7 animate-in slide-in-from-top-2 duration-200">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Personalizado (White Label)</label>
                                                <input
                                                    value={formState.settings?.marketplaceName || ''}
                                                    onChange={e => setFormState({
                                                        ...formState,
                                                        settings: { ...formState.settings, marketplaceName: e.target.value }
                                                    })}
                                                    placeholder="Ex: Minha Loja, Boutique Premium"
                                                    className="w-full p-2 border border-blue-200 bg-blue-50/50 rounded-lg outline-none focus:border-diva-primary text-sm"
                                                />
                                                <p className="text-[10px] text-gray-400 mt-1">Este nome substituirá "Boutique Diva" na barra lateral.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSaveGeneral}
                                className="bg-diva-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-diva-dark/20"
                            >
                                <Save size={18} /> Salvar Alterações
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Plan & Usage */}
                    <div className="space-y-8">
                        {/* Plan Card */}
                        <div className="bg-gradient-to-br from-diva-primary to-diva-accent text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white/90 border-b border-white/20 pb-3">
                                    <CreditCard size={20} /> Assinatura
                                </h2>
                                <div className="mb-4">
                                    <p className="text-white/70 text-xs uppercase font-bold tracking-wider">Plano Atual</p>
                                    <p className="text-3xl font-serif font-bold capitalize">{organization.subscriptionPlanId}</p>
                                </div>
                                <div className="mb-6 flex items-center gap-2">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/30 capitalize">
                                        {organization.subscriptionStatus}
                                    </span>
                                </div>
                                <button className="w-full bg-white text-diva-primary py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
                                    Gerenciar Plano
                                </button>
                            </div>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-xl"></div>
                        </div>

                        {/* Usage Stats */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-diva-dark">
                                <Users size={20} className="text-diva-primary" /> Uso do Sistema
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Usuários</span>
                                        <span className="font-bold">{organization.usage.users} / {organization.limits.maxUsers}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-diva-accent" style={{ width: `${(organization.usage.users / organization.limits.maxUsers) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Unidades</span>
                                        <span className="font-bold">{organization.usage.units} / {organization.limits.maxUnits}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${(organization.usage.units / organization.limits.maxUnits) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: TEAM */}
            {activeTab === 'team' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-diva-light/30">
                        <div>
                            <h2 className="text-lg font-bold text-diva-dark">Membros da Equipe</h2>
                            <p className="text-sm text-gray-500">Gerencie quem tem acesso a esta organização.</p>
                        </div>
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="bg-diva-primary text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-diva-dark transition-colors shadow-md"
                        >
                            <Mail size={16} className="mr-2" /> Convidar Membro
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-diva-light/30 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Membro</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Papel (Role)</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Acesso</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {members.map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                    {member.avatarUrl ? <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" /> : <UserIcon size={20} className="text-gray-400" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-diva-dark text-sm">{member.name}</p>
                                                    <p className="text-xs text-gray-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={member.role}
                                                onChange={(e) => updateMemberRole(member.id, e.target.value)}
                                                className="text-sm border border-gray-200 rounded-lg p-1.5 bg-white text-gray-700 outline-none focus:border-diva-primary"
                                            >
                                                <option value="admin">Administrador</option>
                                                <option value="manager">Gerente</option>
                                                <option value="staff">Profissional (Staff)</option>
                                                <option value="finance">Financeiro</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${member.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    member.status === 'invited' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {member.status === 'invited' ? 'Convidado' : 'Ativo'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">
                                            {member.invitedAt ? new Date(member.invitedAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Tem certeza que deseja remover este membro? Ele perderá acesso à organização.')) {
                                                        removeMember(member.id);
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {members.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                                            Nenhum membro encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* INVITE MODAL */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-diva-dark">Convidar Novo Membro</h3>
                            <p className="text-sm text-gray-500">Envie um convite por e-mail.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                                <input
                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-diva-primary"
                                    placeholder="Ex: Maria Silva"
                                    value={inviteData.name}
                                    onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
                                <input
                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-diva-primary"
                                    placeholder="Ex: maria@clinica.com"
                                    value={inviteData.email}
                                    onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Função (Role)</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-diva-primary bg-white"
                                    value={inviteData.role}
                                    onChange={e => setInviteData({ ...inviteData, role: e.target.value })}
                                >
                                    <option value="staff">Profissional (Staff)</option>
                                    <option value="manager">Gerente</option>
                                    <option value="admin">Administrador</option>
                                    <option value="finance">Financeiro</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 rounded">
                                    {inviteData.role === 'admin' ? 'Acesso total a todas as configurações e dados.' :
                                        inviteData.role === 'manager' ? 'Acesso a gestão de equipe e clientes, sem configurações sensíveis.' :
                                            inviteData.role === 'staff' ? 'Acesso apenas à agenda e prontuários.' : 'Acesso a relatórios e fluxo de caixa.'}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsInviteModalOpen(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSendInvite}
                                className="px-4 py-2 bg-diva-primary text-white font-bold rounded-lg hover:bg-diva-dark shadow-md"
                            >
                                Enviar Convite
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationSettings;
