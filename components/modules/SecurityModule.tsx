
import React, { useState } from 'react';
import { AuditLogEntry, UserRole } from '../../types';
import { Shield, Lock, Eye, Activity, Search, FileText, Smartphone, AlertTriangle, UserX, Database, CheckCircle, XCircle } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'audit' | 'permissions' | 'privacy' | 'sessions'>('audit');
  const [logs, setLogs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');

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
                    <p className="text-green-400 font-bold flex items-center justify-end"><CheckCircle size={14} className="mr-1"/> Protegido</p>
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
            <div className="border-b border-diva-light/20 px-6 pt-4 flex space-x-6">
                <button 
                    onClick={() => setActiveTab('audit')}
                    className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'audit' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                >
                    <Activity size={16} className="mr-2" /> Trilha de Auditoria
                </button>
                <button 
                    onClick={() => setActiveTab('permissions')}
                    className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'permissions' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                >
                    <Lock size={16} className="mr-2" /> Permissões (RBAC)
                </button>
                <button 
                    onClick={() => setActiveTab('privacy')}
                    className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'privacy' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                >
                    <Database size={16} className="mr-2" /> Privacidade (LGPD)
                </button>
                <button 
                    onClick={() => setActiveTab('sessions')}
                    className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'sessions' ? 'border-diva-primary text-diva-primary' : 'border-transparent text-gray-400 hover:text-diva-dark'}`}
                >
                    <Smartphone size={16} className="mr-2" /> Sessões Ativas
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                
                {/* AUDIT TAB */}
                {activeTab === 'audit' && (
                    <div className="flex flex-col h-full">
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
                                            <td className="px-6 py-3 font-bold text-diva-dark">{log.action}</td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    log.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
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
                    <div className="space-y-6">
                        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3">
                            <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-yellow-800 text-sm">Matriz de Controle de Acesso (RBAC)</h4>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Alterações aqui afetam imediatamente o acesso dos usuários. Cuidado ao remover permissões de Admin.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-center">
                                <thead className="bg-gray-100 text-xs font-bold text-gray-600 uppercase border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Recurso / Módulo</th>
                                        <th className="px-4 py-4 bg-blue-50 text-blue-800">Staff</th>
                                        <th className="px-4 py-4 bg-purple-50 text-purple-800">Gerente</th>
                                        <th className="px-4 py-4 bg-gray-800 text-white">Admin</th>
                                        <th className="px-4 py-4 bg-green-50 text-green-800">Financeiro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {[
                                        { name: 'Dados de Clientes (CRM)', staff: 'Read/Write', manager: 'Full', admin: 'Full', finance: 'Read' },
                                        { name: 'Agenda', staff: 'Read/Write', manager: 'Full', admin: 'Full', finance: 'Read' },
                                        { name: 'Financeiro (DRE)', staff: 'None', manager: 'Read', admin: 'Full', finance: 'Full' },
                                        { name: 'Preços e Configurações', staff: 'None', manager: 'Read/Write', admin: 'Full', finance: 'None' },
                                        { name: 'Exclusão de Registros', staff: 'None', manager: 'None', admin: 'Full', finance: 'None' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-left font-bold text-diva-dark">{row.name}</td>
                                            <td className="px-4 py-4 text-gray-500">{row.staff}</td>
                                            <td className="px-4 py-4 text-gray-500">{row.manager}</td>
                                            <td className="px-4 py-4 font-bold text-diva-dark"><CheckCircle size={16} className="mx-auto text-green-600"/></td>
                                            <td className="px-4 py-4 text-gray-500">{row.finance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PRIVACY TAB */}
                {activeTab === 'privacy' && (
                    <div className="space-y-6">
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
                    <div className="space-y-4">
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

            </div>
        </div>
    </div>
  );
};

export default SecurityModule;
