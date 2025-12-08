import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, TrendingUp, Settings,
    LogOut, Crown, DollarSign, PieChart, Shield, Globe
} from 'lucide-react';

const MasterLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/master' },
        { icon: <TrendingUp size={20} />, label: 'CRM de Vendas', path: '/master/crm' },
        { icon: <Users size={20} />, label: 'Assinantes', path: '/master/subscribers' },
        { icon: <DollarSign size={20} />, label: 'Financeiro SaaS', path: '/master/finance' },
        { icon: <Globe size={20} />, label: 'CMS / Site', path: '/master/cms' }, // New CMS Module
        { icon: <Shield size={20} />, label: 'Admin Logs', path: '/master/logs' },
    ];

    return (
        <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-black border-r border-white/10 flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                        M
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-wide text-white">Master</h1>
                        <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">God Mode</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[inset_0_0_10px_rgba(234,179,8,0.1)]'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className={`${isActive ? 'text-yellow-400' : 'text-slate-500 group-hover:text-white'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_5px_currentColor]"></div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sair do Master</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-slate-900 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white">
                            {menuItems.find(i => i.path === location.pathname)?.label || 'Visão Geral'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                            <Crown size={14} className="text-yellow-500" />
                            <span className="text-xs font-bold text-yellow-500">Super Admin</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                            <UserAvatar />
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const UserAvatar = () => (
    <img
        src="https://i.pravatar.cc/150?u=master"
        alt="Admin"
        className="w-full h-full rounded-full object-cover opacity-80 hover:opacity-100 transition-opacity"
    />
);

export default MasterLayout;
