import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';

// Lazy load SaaS modules
const SaaSCrmModule = lazy(() => import('../components/modules/saas/SaaSCrmModule'));
const SaaSImplementationModule = lazy(() => import('../components/modules/saas/SaaSImplementationModule'));
const SaaSSubscribersModule = lazy(() => import('../components/modules/saas/SaaSSubscribersModule'));
const SaaSFinanceModule = lazy(() => import('../components/modules/saas/SaaSFinanceModule'));
const SalesPageEditorModule = lazy(() => import('../components/modules/saas/SalesPageEditorModule'));
const SaaSMarketingModule = lazy(() => import('../components/modules/saas/SaaSMarketingModule'));

/**
 * SaaS Routes - Routes for SaaS management (MASTER/SAAS_STAFF only)
 */
export const SaaSRoutes = () => (
    <>
        <Route path="/dashboard/saas/crm" element={<ProtectedRoute><Layout><SaaSCrmModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/saas/implementation" element={<ProtectedRoute><Layout><SaaSImplementationModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/saas/subscribers" element={<ProtectedRoute><Layout><SaaSSubscribersModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/saas/finance" element={<ProtectedRoute><Layout><SaaSFinanceModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/saas/sales-page" element={<ProtectedRoute><Layout><SalesPageEditorModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/saas/marketing" element={<ProtectedRoute><Layout><SaaSMarketingModule /></Layout></ProtectedRoute>} />
    </>
);
