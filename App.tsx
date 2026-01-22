import React, { Suspense, useEffect, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './components/context/DataContext';
import { ToastProvider } from './components/ui/ToastContext';
import { CurrentOrganizationProvider } from './components/context/CurrentOrganizationContext';
import { useOrganizationSlug } from './hooks/useOrganizationSlug';
import AnalyticsManager from './components/ui/AnalyticsManager';
import { UserRole } from './types';

// Route modules with lazy loading
import { PublicRoutes, AuthRoutes, DashboardRoutes, SaaSRoutes } from './routes';

// Lazy load additional components
const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const SalesPage = lazy(() => import('./components/public/SalesPage'));

// Loading fallback
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
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

            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {user ? (
                        <>
                            {/* Authenticated Routes */}
                            <DashboardRoutes />
                            <SaaSRoutes />

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
                            <PublicRoutes />

                            {/* Auth Routes */}
                            <AuthRoutes />

                            {/* Default routes for unauthenticated users */}
                            <Route path="/" element={<SalesPage />} />
                            <Route path="/login" element={<LoginPage onLogin={login} />} />
                            <Route path="/:orgSlug" element={<LoginPage onLogin={login} />} />
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
                <DataProvider>
                    <AppContent />
                </DataProvider>
            </ToastProvider>
        </Router>
    );
};

export default App;
