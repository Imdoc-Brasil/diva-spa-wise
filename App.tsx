import React, { Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './components/context/DataContext';
import { ToastProvider } from './components/ui/ToastContext';
import { CurrentOrganizationProvider } from './components/context/CurrentOrganizationContext';
import { useOrganizationSlug } from './hooks/useOrganizationSlug';
import AnalyticsManager from './components/ui/AnalyticsManager';

// Route modules with lazy loading
import { PublicRoutes, AuthRoutes, DashboardRoutes, SaaSRoutes } from './routes';

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
 * Handles routing and organization context
 */
const AppContent = () => {
    const { slug, isLoading } = useOrganizationSlug();

    if (isLoading) {
        return <LoadingFallback />;
    }

    return (
        <CurrentOrganizationProvider slug={slug}>
            <AnalyticsManager />
            <ScrollToTop />

            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public Routes */}
                    <PublicRoutes />

                    {/* Auth Routes */}
                    <AuthRoutes />

                    {/* Dashboard Routes */}
                    <DashboardRoutes />

                    {/* SaaS Routes */}
                    <SaaSRoutes />

                    {/* Default Redirect */}
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
