import React, { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './components/context/DataContext';
import { ToastProvider } from './components/ui/ToastContext';
import { OrganizationProvider } from './components/context/OrganizationContext';
import { CurrentOrganizationProvider } from './components/context/CurrentOrganizationContext';
import { useOrganizationSlug } from './hooks/useOrganizationSlug';
import AnalyticsManager from './components/ui/AnalyticsManager';
import { UserRole } from './types';

// Route modules with lazy loading
import { PublicRoutes, AuthRoutes, DashboardRoutes, SaaSRoutes } from './routes';

// Lazy load additional components
const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const SalesPage = lazy(() => import('./components/public/SalesPage'));
const PublicPage = lazy(() => import('./components/public/PublicPage'));

import { PremiumToaster } from './components/ui/PremiumToaster';
import { CommandMenu } from './components/ui/CommandMenu';


// Loading fallback
const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <div className="relative">
            <div className="w-24 h-24 rounded-full border-t-2 border-diva-accent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">✨</span>
            </div>
        </div>
        <p className="mt-8 text-slate-400 font-serif italic tracking-widest animate-pulse">
            Diva Spa Wise
        </p>
    </div>
);

/**
 * Scroll Restoration Component
 * Scrolls to top on route change
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

/**
 * Main App Content
 * Handles routing with authentication context
 */
const AppContent = () => {
    const { loading } = useOrganizationSlug();
    const { currentUser: user, login } = useData();

    if (loading) {
        return <LoadingFallback />;
    }

    return (
        <CurrentOrganizationProvider>
            <AnalyticsManager />
            <ScrollToTop />
            <CommandMenu />

            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {user ? (
                        <>
                            {/* Authenticated Routes */}
                            {DashboardRoutes()}
                            {SaaSRoutes()}

                            {/* Default redirect based on role */}
                            <Route path="/" element={
                                (user.role === UserRole.MASTER || user.role === UserRole.SAAS_STAFF) ?
                                    <Navigate to="/dashboard/saas/crm" replace /> :
                                    user.role === UserRole.CLIENT ?
                                        <Navigate to="/dashboard/profile" replace /> :
                                        user.role === UserRole.STAFF ?
                                            <Navigate to="/dashboard/staff" replace /> :
                                            <Navigate to="/dashboard" replace />
                            } />
                        </>
                    ) : (
                        <>
                            {/* Public Routes */}
                            <Route path="/" element={<SalesPage />} />
                            {PublicRoutes()}

                            {/* Auth Routes */}
                            {AuthRoutes(login)}

                            {/* Organization Slug Route */}
                            <Route path="/:orgSlug" element={<PublicPage />} />
                        </>
                    )}

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </CurrentOrganizationProvider>
    );
};

/**
 * App Component
 * Root component with providers
 */
const App = () => {
    return (
        <Router>
            <ToastProvider>
                <PremiumToaster />
                <OrganizationProvider>
                    <DataProvider>
                        <AppContent />
                    </DataProvider>
                </OrganizationProvider>
            </ToastProvider>
        </Router>
    );
};

export default App;
