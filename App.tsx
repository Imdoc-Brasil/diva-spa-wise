import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import CrmModule from './components/modules/CrmModule';
import SchedulingModule from './components/modules/SchedulingModule';
import ClientPortalModule from './components/modules/ClientPortalModule';
import FinanceModule from './components/modules/FinanceModule';
import PayModule from './components/modules/PayModule';
import StaffModule from './components/modules/StaffModule';
import MarketplaceModule from './components/modules/MarketplaceModule';
import FunnelModule from './components/modules/FunnelModule';
import RoomsModule from './components/modules/RoomsModule';
import SettingsModule from './components/modules/SettingsModule';
import ReportsModule from './components/modules/ReportsModule';
import MarketingModule from './components/modules/MarketingModule';
import CommunicationModule from './components/modules/CommunicationModule';
import LoyaltyModule from './components/modules/LoyaltyModule';
import KioskModule from './components/modules/KioskModule';
import TvModule from './components/modules/TvModule';
import AcademyModule from './components/modules/AcademyModule';
import AssetsModule from './components/modules/AssetsModule';
import TasksModule from './components/modules/TasksModule';
import FranchiseModule from './components/modules/FranchiseModule';
import IntegrationsModule from './components/modules/IntegrationsModule';
import SecurityModule from './components/modules/SecurityModule';
import ReputationModule from './components/modules/ReputationModule';
import PharmacyModule from './components/modules/PharmacyModule';
import ConciergeModule from './components/modules/ConciergeModule';
import DriveModule from './components/modules/DriveModule';
import WebsiteModule from './components/modules/WebsiteModule';
import PartnersModule from './components/modules/PartnersModule';
import VoiceModule from './components/modules/VoiceModule';
import EventsModule from './components/modules/EventsModule';
import ComplianceModule from './components/modules/ComplianceModule';
import HelpModule from './components/modules/HelpModule';
import LaundryModule from './components/modules/LaundryModule';
import MigrationModule from './components/modules/MigrationModule';
import UserProfileModule from './components/modules/UserProfileModule';
import PromotionsModule from './components/modules/PromotionsModule';
import TalentModule from './components/modules/TalentModule';
import OrganizationSettings from './components/modules/OrganizationSettings';
import NewOrganizationWizard from './components/onboarding/NewOrganizationWizard';
import TreatmentPlansModule from './components/modules/TreatmentPlansModule';

import PublicPage from './components/public/PublicPage';
import SalesPage from './components/public/SalesPage';
import SignupPage from './components/public/SignupPage';
import RevenueCalculatorPage from './components/public/tools/RevenueCalculatorPage';
import BlogPage from './components/public/blog/BlogPage';
import BlogPostPage from './components/public/blog/BlogPostPage';
import StaffDashboard from './components/StaffDashboard';
import LoginPage from './components/LoginPage';
import NotFound from './components/NotFound';
import PatientPortal from './components/pages/PatientPortal';
import { ToastProvider } from './components/ui/ToastContext';
import { DataProvider, useData } from './components/context/DataContext';
import { OrganizationProvider } from './components/context/OrganizationContext';
import DemoBanner from './components/ui/DemoBanner';
import { UserRole } from './types';
import MasterLayout from './components/MasterLayout';
import SaaSCrmModule from './components/modules/saas/SaaSCrmModule';
import SaaSDashboard from './components/modules/saas/SaaSDashboard';
import SaaSFinanceModule from './components/modules/saas/SaaSFinanceModule';
import SalesPageEditorModule from './components/modules/saas/SalesPageEditorModule';
import SaaSMarketingModule from './components/modules/saas/SaaSMarketingModule';
import AnalyticsManager from './components/ui/AnalyticsManager';
import { OrganizationSetup } from './components/auth/OrganizationSetup';
import { useOrganizationSlug } from './hooks/useOrganizationSlug';

// Scroll Restoration Component (Window level backup, main logic is in Layout)
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const AppContent: React.FC = () => {
    const { currentUser: user, login, logout } = useData();
    const { organization, loading, error, isMultiTenant } = useOrganizationSlug();

    const handleRoleSwitch = (newRole: UserRole, realUser?: any) => {
        login(newRole, realUser);
    };

    // Show loading state while detecting organization
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-white">Carregando organização...</p>
                </div>
            </div>
        );
    }

    // Show error if organization not found
    if (error && isMultiTenant) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">❌ Organização não encontrada</h1>
                    <p className="text-white mb-4">{error}</p>
                    <a href="https://www.imdoc.com.br" className="text-yellow-500 hover:text-yellow-400 underline">
                        Voltar para página inicial
                    </a>
                </div>
            </div>
        );
    }

    // Show organization info in console
    useEffect(() => {
        if (organization) {
            console.log('🏢 [App] Organization loaded:', {
                name: organization.name,
                slug: organization.slug,
                status: organization.subscription_status,
                plan: organization.subscription_plan_id
            });
        } else {
            console.log('🏢 [App] Master mode - no organization');
        }
    }, [organization]);

    return (
        <Router>
            <DemoBanner />
            <ScrollToTop />
            <Routes>
                {/* PUBLIC SITE ROUTE (Accessible without Login) */}
                <Route path="/site" element={<PublicPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/tools/revenue-calculator" element={<RevenueCalculatorPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/setup" element={<OrganizationSetup />} />

                {user ? (
                    <>
                        {/* KIOSK ROUTE (STANDALONE) */}
                        <Route
                            path="/kiosk"
                            element={
                                <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                    <KioskModule />
                                </ProtectedRoute>
                            }
                        />

                        {/* TV / DIGITAL SIGNAGE ROUTE (STANDALONE) */}
                        <Route
                            path="/tv"
                            element={
                                <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                    <TvModule />
                                </ProtectedRoute>
                            }
                        />


                        {/* MASTER / SAAS ADMIN ROUTES */}
                        <Route path="/master/*" element={
                            <ProtectedRoute user={user} allowedRoles={[UserRole.MASTER, UserRole.SAAS_STAFF]}>
                                <MasterLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<SaaSDashboard />} />
                            <Route path="crm" element={<SaaSCrmModule />} />
                            <Route path="finance" element={<SaaSFinanceModule />} />
                            <Route path="cms" element={<SalesPageEditorModule />} />
                            <Route path="marketing" element={<SaaSMarketingModule />} />
                        </Route>

                        {/* MAIN APP ROUTES (WITH LAYOUT) */}
                        <Route path="/*" element={
                            <Layout user={user} onLogout={logout} onRoleSwitch={handleRoleSwitch}>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            (user.role === UserRole.MASTER || user.role === UserRole.SAAS_STAFF) ? <Navigate to="/master" /> :
                                                user.role === UserRole.CLIENT ? <Navigate to="/portal" /> :
                                                    user.role === UserRole.STAFF ? <StaffDashboard /> :
                                                        <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE]}>
                                                            <Dashboard />
                                                        </ProtectedRoute>
                                        }
                                    />

                                    {/* Client Portal */}
                                    <Route
                                        path="/portal"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.CLIENT]}>
                                                <ClientPortalModule user={user} />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Staff Dashboard */}
                                    <Route
                                        path="/staff-dashboard"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.STAFF]}>
                                                <StaffDashboard />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* User Profile */}
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF, UserRole.FINANCE]}>
                                                <UserProfileModule user={user} onLogout={logout} />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Website Builder */}
                                    <Route
                                        path="/website"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <WebsiteModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Inbox Omnichannel */}
                                    <Route
                                        path="/inbox"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF, UserRole.CLIENT]}>
                                                <CommunicationModule user={user} />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Diva Voice */}
                                    <Route
                                        path="/voice"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <VoiceModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Events & Workshops */}
                                    <Route
                                        path="/events"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <EventsModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/compliance"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <ComplianceModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Franchise & Multi-Unit */}
                                    <Route
                                        path="/franchise"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <FranchiseModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Laundry */}
                                    <Route
                                        path="/laundry"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                                <LaundryModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Loyalty */}
                                    <Route
                                        path="/loyalty"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE]}>
                                                <LoyaltyModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Partners / Affiliates */}
                                    <Route
                                        path="/partners"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE]}>
                                                <PartnersModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Promotions & Coupons */}
                                    <Route
                                        path="/promotions"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <PromotionsModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* CRM */}
                                    <Route
                                        path="/crm"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.MANAGER]}>
                                                <CrmModule user={user!} />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Scheduling */}
                                    <Route
                                        path="/schedule"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.CLIENT]}>
                                                <SchedulingModule user={user!} />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Concierge */}
                                    <Route
                                        path="/concierge"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.MANAGER]}>
                                                <ConciergeModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Finance */}
                                    <Route
                                        path="/finance"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.FINANCE, UserRole.STAFF]}>
                                                <FinanceModule user={user!} />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Diva Pay */}
                                    <Route
                                        path="/pay"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.FINANCE]}>
                                                <PayModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Marketing */}
                                    <Route
                                        path="/marketing"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <MarketingModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Reports */}
                                    <Route
                                        path="/reports"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE]}>
                                                <ReportsModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Staff Management */}
                                    <Route
                                        path="/staff"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <StaffModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Recruitment / Talent */}
                                    <Route
                                        path="/talent"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <TalentModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Marketplace */}
                                    <Route
                                        path="/marketplace"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.CLIENT, UserRole.ADMIN, UserRole.STAFF]}>
                                                <MarketplaceModule user={user!} />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Funnel */}
                                    <Route
                                        path="/funnel"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <FunnelModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Rooms */}
                                    <Route
                                        path="/rooms"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
                                                <RoomsModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Assets & Maintenance */}
                                    <Route
                                        path="/assets"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                                <AssetsModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Tasks & Ops */}
                                    <Route
                                        path="/tasks"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                                <TasksModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Franchise */}
                                    <Route
                                        path="/franchise"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN]}>
                                                <FranchiseModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Integrations */}
                                    <Route
                                        path="/integrations"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN]}>
                                                <IntegrationsModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Security */}
                                    <Route
                                        path="/security"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN]}>
                                                <SecurityModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Reputation */}
                                    <Route
                                        path="/reputation"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <ReputationModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Pharmacy */}
                                    <Route
                                        path="/pharmacy"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                                <PharmacyModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Diva Drive */}
                                    <Route
                                        path="/drive"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                                <DriveModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Treatment Plans */}
                                    <Route
                                        path="/plans"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                                <TreatmentPlansModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Academy */}
                                    <Route
                                        path="/academy"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                                <AcademyModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Help Center */}
                                    <Route
                                        path="/help"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                                <HelpModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Create Organization Wizard */}
                                    <Route
                                        path="/settings/organization/new"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]}>
                                                <NewOrganizationWizard />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Organization Settings */}
                                    <Route
                                        path="/settings/organization"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN]}>
                                                <OrganizationSettings />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Settings */}
                                    <Route
                                        path="/settings"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                                                <SettingsModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Migration */}
                                    <Route
                                        path="/migration"
                                        element={
                                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN]}>
                                                <MigrationModule />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Catch-all Route for 404 */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Layout>
                        } />
                    </>
                ) : (
                    // Show Sales Page (Landing) at root, and specific login route
                    <>
                        <Route path="/" element={<SalesPage />} />
                        <Route path="/login" element={<LoginPage onLogin={login} />} />
                        <Route path="/:orgSlug" element={<LoginPage onLogin={login} />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                )}

                {/* Public Routes (Accessible without login) */}
                <Route path="/portal/:token" element={<PortalRoute />} />

            </Routes>
        </Router>
    );
};



const App: React.FC = () => {
    return (
        <ToastProvider>
            <OrganizationProvider>
                <DataProvider>
                    <AnalyticsManager />
                    <AppContent />
                </DataProvider>
            </OrganizationProvider>
        </ToastProvider>
    );
};

// Wrapper para extrair token da URL
const PortalRoute = () => {
    const { token } = useParams<{ token: string }>();
    return <PatientPortal token={token || ''} />;
};

export default App;
