
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Home, Users, Calendar, DollarSign, PieChart, ShoppingBag, UserCheck, Map,
  Settings, LogOut, Menu, X, FileBarChart, Megaphone, MessageSquare, Crown,
  Search, Command, Sparkles, Bell, Monitor, Tv, GraduationCap, CreditCard,
  Wrench, ClipboardList, Building, Link as LinkIcon, Shield, Smile, Beaker,
  Move, HardDrive, Globe, Award, Phone, PartyPopper, ShieldCheck, HelpCircle, Shirt, Database, User as UserIcon, Tag, Briefcase
} from 'lucide-react';
import CommandPalette from './CommandPalette';
import DivaAI from './DivaAI';
import NotificationCenter from './NotificationCenter';
import UnitSelector from './ui/UnitSelector';
import OrganizationSwitcher from './ui/OrganizationSwitcher';
import { useData } from './context/DataContext';
import { useOrganization } from './context/OrganizationContext';
import { useCurrentOrganization } from './context/CurrentOrganizationContext';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}


const roleTranslations: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MANAGER]: 'Gerente',
  [UserRole.STAFF]: 'Profissional',
  [UserRole.FINANCE]: 'Financeiro',
  [UserRole.CLIENT]: 'Paciente',
  [UserRole.MASTER]: 'Master',
  [UserRole.SAAS_STAFF]: 'SaaS Staff'
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser: user, logout, updateUser } = useData();

  // Helper for dev role switching
  const handleRoleSwitch = (role: UserRole) => {
    if (user && updateUser) {
      updateUser({ ...user, role });
    }
  };

  if (!user) return null; // Or some fallback
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useData();
  const { organization } = useOrganization();
  const { currentOrganization, isMultiTenant } = useCurrentOrganization();
  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  // Log organization info
  useEffect(() => {
    if (currentOrganization) {
      console.log('🏢 [Layout] Current Organization:', currentOrganization.name);
      console.log('🔒 [Layout] Multi-tenant mode:', isMultiTenant);
    }
  }, [currentOrganization, isMultiTenant]);

  // Handle Resize & Initial Mobile Check
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false); // Auto-close on mobile
      else setIsSidebarOpen(true); // Auto-open on desktop
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-close sidebar on mobile navigation & Scroll Restoration
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);

    // Scroll main content to top on route change
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, isMobile]);

  const navSections: NavSection[] = [
    // SaaS Admin Section (Only for MASTER and SAAS_STAFF)
    {
      title: 'Administração SaaS',
      items: [
        { label: 'CRM de Vendas', path: '/dashboard/saas/crm', icon: <Users size={20} />, allowedRoles: [UserRole.MASTER, UserRole.SAAS_STAFF] },
        { label: 'Financeiro SaaS', path: '/dashboard/saas/finance', icon: <DollarSign size={20} />, allowedRoles: [UserRole.MASTER, UserRole.SAAS_STAFF] },
        { label: 'Marketing SaaS', path: '/dashboard/saas/marketing', icon: <Megaphone size={20} />, allowedRoles: [UserRole.MASTER, UserRole.SAAS_STAFF] },
        { label: 'Editor de LP', path: '/dashboard/saas/sales-page', icon: <Globe size={20} />, allowedRoles: [UserRole.MASTER, UserRole.SAAS_STAFF] },
      ]
    },
    {
      title: 'Principal',
      items: [
        { label: 'Dashboard', path: '/', icon: <PieChart size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Portal do Paciente', path: '/portal', icon: <Home size={20} />, allowedRoles: [UserRole.CLIENT] },
        { label: 'Inbox & Chat', path: '/inbox', icon: <MessageSquare size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
        { label: 'Agenda', path: '/schedule', icon: <Calendar size={20} />, allowedRoles: [UserRole.STAFF, UserRole.ADMIN, UserRole.CLIENT] },
        { label: 'Tarefas & Ops', path: '/tasks', icon: <ClipboardList size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
      ]
    },
    {
      title: 'Clínico & Operacional',
      items: [
        { label: 'Concierge', path: '/concierge', icon: <Move size={20} />, allowedRoles: [UserRole.STAFF, UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Mapa de Salas', path: '/rooms', icon: <Map size={20} />, allowedRoles: [UserRole.STAFF, UserRole.ADMIN] },
        { label: 'Farmácia', path: '/pharmacy', icon: <Beaker size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
        ...(organization?.settings.enableMarketplace ? [{ label: organization?.settings.marketplaceName || 'Boutique Diva', path: '/marketplace', icon: <ShoppingBag size={20} />, allowedRoles: [UserRole.CLIENT, UserRole.ADMIN, UserRole.STAFF] }] : []),
        { label: 'Enxoval', path: '/laundry', icon: <Shirt size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
        { label: 'Ativos & Manut.', path: '/assets', icon: <Wrench size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
      ]
    },
    {
      title: 'Crescimento & CRM',
      items: [
        { label: 'CRM Pacientes', path: '/crm', icon: <Users size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
        { label: 'Planos de Tratamento', path: '/plans', icon: <ClipboardList size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
        { label: 'Funil de Vendas', path: '/funnel', icon: <FileBarChart size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Marketing', path: '/marketing', icon: <Megaphone size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Promoções (Smart)', path: '/promotions', icon: <Tag size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Clube Diva', path: '/loyalty', icon: <Crown size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE] },
        { label: 'Parceiros', path: '/partners', icon: <Award size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE] },
        { label: 'Eventos', path: '/events', icon: <PartyPopper size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Site & LP', path: '/website', icon: <Globe size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Telefonia IA', path: '/voice', icon: <Phone size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
      ]
    },
    {
      title: 'Financeiro',
      items: [
        { label: 'Fluxo de Caixa', path: '/finance', icon: <DollarSign size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.FINANCE] },
        { label: 'Diva Pay', path: '/pay', icon: <CreditCard size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.FINANCE] },
      ]
    },
    {
      title: 'Gestão & Admin',
      items: [
        { label: 'Analytics & Relatórios', path: '/reports', icon: <FileBarChart size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE] },
        { label: 'Franquia', path: '/franchise', icon: <Building size={20} />, allowedRoles: [UserRole.ADMIN] },
        { label: 'Equipe (Staff)', path: '/staff', icon: <UserCheck size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
        { label: 'Recrutamento', path: '/talent', icon: <Briefcase size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Diva Academy', path: '/academy', icon: <GraduationCap size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
        { label: 'Documentos (GED)', path: '/drive', icon: <HardDrive size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
        { label: 'Compliance', path: '/compliance', icon: <ShieldCheck size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Reputação', path: '/reputation', icon: <Smile size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Segurança', path: '/security', icon: <Shield size={20} />, allowedRoles: [UserRole.ADMIN] },
        { label: 'Integrações', path: '/integrations', icon: <LinkIcon size={20} />, allowedRoles: [UserRole.ADMIN] },
        { label: 'Migração', path: '/migration', icon: <Database size={20} />, allowedRoles: [UserRole.ADMIN] },
        { label: 'Configurações', path: '/settings', icon: <Settings size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER] },
        { label: 'Ajuda', path: '/help', icon: <HelpCircle size={20} />, allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Backdrop with Blur */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar (Drawer Style on Mobile) */}
      <aside
        className={`
            fixed lg:relative inset-y-0 left-0 z-50
            ${isSidebarOpen ? 'w-72 translate-x-0' : isMobile ? '-translate-x-full w-72' : 'w-20 translate-x-0'} 
            bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl border-r border-slate-800
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          {isSidebarOpen || isMobile ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <h1 className="text-lg font-bold tracking-widest text-white font-serif">I'mDoc</h1>
            </div>
          ) : (
            <span className="font-bold text-xl mx-auto font-serif">DS</span>
          )}
          {!isMobile && (
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white transition-colors">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:text-teal-400 transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {navSections.map((section, idx) => {
            const filteredItems = section.items.filter(item => item && item.allowedRoles.includes(user.role));

            if (filteredItems.length === 0) return null;

            return (
              <div key={idx} className="mb-6">
                {(isSidebarOpen || isMobile) && (
                  <h3 className="px-5 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <nav className="space-y-0.5 px-3">
                  {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                          ? 'bg-teal-500 text-white font-semibold shadow-lg shadow-teal-500/20'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        title={!isSidebarOpen && !isMobile ? item.label : undefined}
                      >
                        <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>
                          {item.icon}
                        </span>
                        {(isSidebarOpen || isMobile) && (
                          <span className="ml-3 text-sm truncate font-medium">{item.label}</span>
                        )}

                        {/* Desktop Tooltip for Collapsed State */}
                        {!isSidebarOpen && !isMobile && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-diva-light/10 bg-black/20 shrink-0">
          <div
            className="flex items-center mb-4 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group"
            onClick={() => navigate('/profile')}
            title="Meu Perfil"
          >
            <div className="w-9 h-9 rounded-full bg-diva-accent flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden border-2 border-transparent group-hover:border-diva-light transition-all">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                user.displayName.charAt(0)
              )}
            </div>
            {(isSidebarOpen || isMobile) && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                <p className="text-[10px] text-diva-light capitalize truncate opacity-80">{roleTranslations[user.role]}</p>
              </div>
            )}
          </div>

          {(isSidebarOpen || isMobile) && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {user.role !== UserRole.CLIENT && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate('/kiosk')}
                    className="text-[10px] flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 text-diva-light p-2 rounded-lg transition-colors border border-transparent hover:border-white/10"
                  >
                    <Monitor size={16} className="mb-1 opacity-80" />
                    Kiosk
                  </button>
                  <button
                    onClick={() => navigate('/tv')}
                    className="text-[10px] flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 text-diva-light p-2 rounded-lg transition-colors border border-transparent hover:border-white/10"
                  >
                    <Tv size={16} className="mb-1 opacity-80" />
                    TV
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-white/10">
                <label className="text-[9px] uppercase text-diva-light/50 font-bold tracking-wider mb-1 block">Perfil (Demo)</label>
                <select
                  className="w-full text-xs bg-black/30 border border-white/10 rounded px-2 py-1.5 text-gray-300 focus:outline-none focus:border-diva-primary hover:border-white/30 transition-colors cursor-pointer"
                  value={user.role}
                  onChange={(e) => {
                    const newRole = e.target.value as UserRole;
                    handleRoleSwitch(newRole);
                    navigate('/');
                  }}
                >
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{roleTranslations[role]}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`mt-3 flex items-center w-full px-2 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ${!isSidebarOpen && !isMobile ? 'justify-center' : ''}`}
            title="Sair"
          >
            <LogOut size={16} />
            {(isSidebarOpen || isMobile) && <span className="ml-2 font-bold">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 overflow-auto relative flex flex-col w-full transition-all duration-300 scroll-smooth"
      >
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border h-16 flex items-center px-4 md:px-8 justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-foreground p-1 hover:bg-muted rounded-lg">
                <Menu size={24} />
              </button>
            )}
            <h2 className="text-lg md:text-xl font-serif text-foreground font-bold truncate max-w-[150px] md:max-w-none">
              {location.pathname === '/profile' ? 'Meu Perfil' : (navSections.flatMap(s => s.items).find(i => i.path === location.pathname)?.label || organization?.name || "I'mDoc")}
            </h2>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Organization & Unit Selectors */}
            <div className="hidden md:flex items-center gap-2">
              <OrganizationSwitcher />
              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              <UnitSelector />
            </div>

            {/* Command Palette Trigger (Adaptive) */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="hidden md:flex items-center space-x-2 bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-1.5 rounded-xl border border-border transition-colors text-sm"
            >
              <Search size={14} />
              <span>Buscar...</span>
              <div className="flex items-center gap-1 ml-2 text-muted-foreground">
                <Command size={10} />
                <span className="text-xs font-semibold">K</span>
              </div>
            </button>
            <button
              onClick={() => setIsCommandOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-muted text-muted-foreground"
            >
              <Search size={20} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full hover:bg-muted transition-colors relative ${isNotificationsOpen ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
                )}
              </button>
              <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-64px)] pb-20 md:pb-8" onClick={() => setIsNotificationsOpen(false)}>
          {children}

          <div className="mt-12 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground font-medium">
              © {new Date().getFullYear()} I'mDoc Technology® <span className="mx-1">•</span> Desenvolvimento Contínuo
            </p>
          </div>
        </div>
      </main>

      {/* FLOATING ACTION BUTTON FOR DIVA AI */}
      {user.role !== UserRole.CLIENT && (
        <button
          onClick={() => setIsAIOpen(!isAIOpen)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-2 border-white/30"
          title="I'mDoc AI Assistant"
        >
          {isAIOpen ? <X size={20} className="md:w-6 md:h-6" /> : <Sparkles size={20} className="md:w-6 md:h-6" />}
        </button>
      )}

      {/* Diva AI Sidebar */}
      <DivaAI isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} user={user} />

      {/* Command Palette Overlay */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
};

export default Layout;
