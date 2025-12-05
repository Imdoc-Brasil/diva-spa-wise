
import React, { useState, useEffect } from 'react';
import { AuditLogEntry, UserRole } from '../../types';
import { Shield, Lock, Eye, Activity, Search, FileText, Smartphone, AlertTriangle, UserX, Database, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

// Mock Audit Logs
const mockLogs: AuditLogEntry[] = [
    { id: 'l1', action: 'Deletou Agendamento', module: 'Agendamento', performedBy: 'Dra. Julia', role: UserRole.STAFF, timestamp: '2023-10-27 14:32', details: 'Agendamento #998 (Beatriz) removido.', ipAddress: '192.168.1.45' },
    { id: 'l2', action: 'Acessou Relatório DRE', module: 'Financeiro', performedBy: 'Admin User', role: UserRole.ADMIN, timestamp: '2023-10-27 10:15', details: 'Visualização do DRE Outubro.', ipAddress: '200.189.44.12' },
    { id: 'l3', action: 'Alterou Preço Serviço', module: 'Configurações', performedBy: 'Gerente Ana', role: UserRole.MANAGER, timestamp: '2023-10-26 18:00', details: 'Botox: R$ 1.000 -> R$ 1.200', ipAddress: '172.16.0.5' },
    { id: 'l4', action: 'Exportou Base Clientes', module: 'CRM', performedBy: 'Admin User', role: UserRole.ADMIN, timestamp: '2023-10-25 09:30', details: 'Exportação CSV completa.', ipAddress: '200.189.44.12' },
    { id: 'l5', action: 'Login Falho', module: 'Auth', performedBy: 'Desconhecido', role: UserRole.CLIENT, timestamp: '2023-10-24 23:12', details: 'Tentativa de acesso IP suspeito.', ipAddress: '45.22.11.99' },
];

const mockSessions = [
    { id: 's1', device: 'MacBook Pro - Chrome', ip: '200.189.44.12', location: 'São Paulo, BR', active: true, current: true },
    { id: 's2', device: 'iPhone 13 - App', ip: '177.55.44.22', location: 'São Paulo, BR', active: true, current: false },
    { id: 's3', device: 'iPad Air - Safari', ip: '192.168.1.45', location: 'Rede Interna (Wi-Fi)', active: true, current: false },
];

const SecurityModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'audit' | 'permissions' | 'privacy' | 'sessions' | 'settings'>('audit');
    const [logs, setLogs] = useState(mockLogs);
    const [searchTerm, setSearchTerm] = useState('');

    const { addToast } = useToast();

    // Load RBAC from localStorage or use defaults
    const getInitialRBAC = () => {
        const saved = localStorage.getItem('diva_rbac_matrix');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse RBAC from localStorage', e);
            }
        }
        return [
            { id: 'dashboard', name: 'Dashboard & Analytics', staff: false, manager: true, admin: true, finance: true, client: false },
            { id: 'schedule', name: 'Agenda & Concierge', staff: true, manager: true, admin: true, finance: false, client: true },
            { id: 'crm', name: 'CRM & Dados de Clientes', staff: true, manager: true, admin: true, finance: false, client: true },
            { id: 'inbox', name: 'Inbox & Diva AI', staff: true, manager: true, admin: true, finance: false, client: true },
            { id: 'finance', name: 'Financeiro & Diva Pay', staff: false, manager: true, admin: true, finance: true, client: false },
            { id: 'boutique', name: 'Boutique Diva', staff: true, manager: true, admin: true, finance: true, client: true },
            { id: 'ops', name: 'Operacional (Enxoval/Ativos)', staff: true, manager: true, admin: true, finance: false, client: false },
            { id: 'marketing', name: 'Marketing & Vendas', staff: false, manager: true, admin: true, finance: false, client: false },
            { id: 'hr', name: 'Gestão de Equipe & RH', staff: false, manager: true, admin: true, finance: false, client: false },
            { id: 'settings', name: 'Configurações & Segurança', staff: false, manager: true, admin: true, finance: false, client: false },
        ];
    };

    // Interactive RBAC State
    const [rbacMatrix, setRbacMatrix] = useState(getInitialRBAC());

    // Security Settings State
    const [securityConfig, setSecurityConfig] = useState({
        twoFactor: false,
        loginAlerts: true,
        passwordExpiry: 90, // days
        sessionTimeout: 30 // minutes
    });

    // Persist RBAC changes to localStorage
    useEffect(() => {
        localStorage.setItem('diva_rbac_matrix', JSON.stringify(rbacMatrix));
    }, [rbacMatrix]);

    const togglePermission = (rowId: string, role: string) => {
        setRbacMatrix(rbacMatrix.map(row => {
            if (row.id === rowId) {
                return { ...row, [role]: !row[role as keyof typeof row] };
            }
            return row;
        }));
    };

    const savePermissions = () => {
        // In production, this would call an API endpoint
        localStorage.setItem('diva_rbac_matrix', JSON.stringify(rbacMatrix));
        addToast('Permissões atualizadas com sucesso!', 'success');
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Header */}
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg shrink-0 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                        <Shield size={32} className="text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold">Diva Guard</h2>
                        <p className="text-sm text-gray-400">Central de Segurança e Compliance (LGPD)</p>
                    </div>
                </div>
                <div className="flex gap-6 text-right relative z-10">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Status do Sistema</p>
                        <p className="text-green-400 font-bold flex items-center justify-end"><CheckCircle size={14} className="mr-1" /> Protegido</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Último Backup</p>
                        <p className="text-white font-bold">Há 2 horas</p>
                    </div>
                </div>
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">

                {/* Tabs */}
                <div className="border-b border-diva-light/20 px-6 pt-4 flex space-x-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('audit')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center whitespace-nowrap ${activeTab === 'audit' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                    >
                        <Activity size={16} className="mr-2" /> Trilha de Auditoria
                    </button>
                    <button
                        onClick={() => setActiveTab('permissions')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center whitespace-nowrap ${activeTab === 'permissions' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                    >
                        <Lock size={16} className="mr-2" /> Permissões (RBAC)
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center whitespace-nowrap ${activeTab === 'privacy' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                    >
                        <Database size={16} className="mr-2" /> Privacidade (LGPD)
                    </button>
                    <button
                        onClick={() => setActiveTab('sessions')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center whitespace-nowrap ${activeTab === 'sessions' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                    >
                        <Smartphone size={16} className="mr-2" /> Sessões Ativas
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center whitespace-nowrap ${activeTab === 'settings' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                    >
                        <Shield size={16} className="mr-2" /> Configurações
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

                    {/* AUDIT TAB */}
                    {activeTab === 'audit' && (
                        <div className="flex flex-col h-full animate-in fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <div className="relative w-96">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Buscar por usuário, ação ou IP..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-diva-primary"
                                    />
                                </div>
                                <button className="text-xs text-diva-primary font-bold hover:underline flex items-center">
                                    <FileText size={14} className="mr-1" /> Exportar Logs (Jurídico)
                                </button>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3">Timestamp</th>
                                            <th className="px-6 py-3">Ação</th>
                                            <th className="px-6 py-3">Usuário</th>
                                            <th className="px-6 py-3">Módulo</th>
                                            <th className="px-6 py-3">Detalhes</th>
                                            <th className="px-6 py-3">IP</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-xs">
                                        {filteredLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors font-mono">
                                                <td className="px-6 py-3 text-gray-500">{log.timestamp}</td>
                                                <td className="px-6 py-3 font-bold text-diva-dark flex items-center gap-2">
                                                    {log.action.includes('Deletou') || log.action.includes('Falho') ?
                                                        <XCircle size={14} className="text-red-500" /> :
                                                        <CheckCircle size={14} className="text-green-500" />
                                                    }
                                                    {log.action}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${log.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        log.role === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {log.performedBy}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-gray-600">{log.module}</td>
                                                <td className="px-6 py-3 text-gray-500 truncate max-w-xs" title={log.details}>{log.details}</td>
                                                <td className="px-6 py-3 text-gray-400">{log.ipAddress}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PERMISSIONS TAB (RBAC) */}
                    {activeTab === 'permissions' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3">
                                <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold text-yellow-800 text-sm">Matriz de Controle de Acesso (RBAC)</h4>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        Defina o que cada perfil pode visualizar ou editar. O perfil "Cliente" refere-se ao acesso via Portal do Cliente.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <table className="w-full text-center">
                                    <thead className="bg-gray-100 text-xs font-bold text-gray-600 uppercase border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left">Recurso / Módulo</th>
                                            <th className="px-4 py-4 bg-orange-50 text-orange-800">Cliente</th>
                                            <th className="px-4 py-4 bg-blue-50 text-blue-800">Staff</th>
                                            <th className="px-4 py-4 bg-purple-50 text-purple-800">Gerente</th>
                                            <th className="px-4 py-4 bg-gray-800 text-white">Admin</th>
                                            <th className="px-4 py-4 bg-green-50 text-green-800">Financeiro</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {rbacMatrix.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-left font-bold text-diva-dark">{row.name}</td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={row.client}
                                                        onChange={() => togglePermission(row.id, 'client')}
                                                        className="w-4 h-4 text-diva-primary rounded border-gray-300 focus:ring-diva-primary cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={row.staff}
                                                        onChange={() => togglePermission(row.id, 'staff')}
                                                        className="w-4 h-4 text-diva-primary rounded border-gray-300 focus:ring-diva-primary cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={row.manager}
                                                        onChange={() => togglePermission(row.id, 'manager')}
                                                        className="w-4 h-4 text-diva-primary rounded border-gray-300 focus:ring-diva-primary cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={row.admin}
                                                        disabled
                                                        className="w-4 h-4 text-gray-400 rounded border-gray-300 cursor-not-allowed bg-gray-100"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={row.finance}
                                                        onChange={() => togglePermission(row.id, 'finance')}
                                                        className="w-4 h-4 text-diva-primary rounded border-gray-300 focus:ring-diva-primary cursor-pointer"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={savePermissions}
                                    className="bg-diva-primary text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-diva-dark transition-colors flex items-center"
                                >
                                    <Lock size={18} className="mr-2" /> Salvar Permissões
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PRIVACY TAB */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="font-bold text-diva-dark mb-4 flex items-center">
                                        <Database size={18} className="mr-2 text-diva-primary" /> Exportação de Dados
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Gere um arquivo JSON/XML contendo todos os dados pessoais de um cliente específico conforme Art. 19 da LGPD.
                                    </p>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Email ou CPF do Cliente" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                        <button className="bg-diva-dark text-white px-4 py-2 rounded-lg text-sm font-bold">Gerar</button>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="font-bold text-diva-dark mb-4 flex items-center">
                                        <UserX size={18} className="mr-2 text-red-600" /> Direito ao Esquecimento
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Anonimizar dados pessoais de um cliente. <strong className="text-red-600">Atenção:</strong> Dados financeiros e clínicos obrigatórios por lei serão mantidos (anonimizados).
                                    </p>
                                    <button className="w-full border border-red-200 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100">
                                        Iniciar Processo de Anonimização
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SESSIONS TAB */}
                    {activeTab === 'sessions' && (
                        <div className="space-y-4 animate-in fade-in">
                            {mockSessions.map(session => (
                                <div key={session.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${session.current ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <Smartphone size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-diva-dark flex items-center gap-2">
                                                {session.device}
                                                {session.current && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Atual</span>}
                                            </h4>
                                            <p className="text-xs text-gray-500">IP: {session.ip} • {session.location}</p>
                                        </div>
                                    </div>
                                    {!session.current && (
                                        <button className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 font-bold">
                                            Revogar Acesso
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button className="text-sm text-diva-dark font-bold hover:underline mt-4">Sair de todas as outras sessões</button>
                        </div>
                    )}

                    {/* SETTINGS TAB (NEW) */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-in fade-in max-w-2xl">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-diva-dark mb-6 flex items-center text-lg">
                                    <Shield size={20} className="mr-2 text-diva-primary" /> Configurações de Segurança
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-800">Autenticação de Dois Fatores (2FA)</h4>
                                            <p className="text-sm text-gray-500">Exigir código via SMS/Email para login de Admins.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={securityConfig.twoFactor}
                                                onChange={() => setSecurityConfig({ ...securityConfig, twoFactor: !securityConfig.twoFactor })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-diva-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-800">Alertas de Login Suspeito</h4>
                                            <p className="text-sm text-gray-500">Notificar por email acessos de IPs desconhecidos.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={securityConfig.loginAlerts}
                                                onChange={() => setSecurityConfig({ ...securityConfig, loginAlerts: !securityConfig.loginAlerts })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-diva-primary"></div>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiração de Senha (Dias)</label>
                                            <input
                                                type="number"
                                                value={securityConfig.passwordExpiry}
                                                onChange={(e) => setSecurityConfig({ ...securityConfig, passwordExpiry: parseInt(e.target.value) })}
                                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Timeout de Sessão (Min)</label>
                                            <input
                                                type="number"
                                                value={securityConfig.sessionTimeout}
                                                onChange={(e) => setSecurityConfig({ ...securityConfig, sessionTimeout: parseInt(e.target.value) })}
                                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SecurityModule;
