import { lazy } from 'react';
import { Route, useParams } from 'react-router-dom';

// Lazy load auth pages
const LoginPage = lazy(() => import('../components/auth/LoginPage'));
const NewOrganizationWizard = lazy(() => import('../components/onboarding/NewOrganizationWizard'));
const OrganizationSetup = lazy(() => import('../components/auth/OrganizationSetup'));
const ClientPortalModule = lazy(() => import('../components/modules/ClientPortalModule'));

/**
 * Portal Route Wrapper - Extracts token from URL
 */
const PortalRoute = () => {
    const { token } = useParams();
    return <ClientPortalModule accessToken={token} />;
};

/**
 * Auth Routes - Login, signup, and onboarding
 */
export const AuthRoutes = (onLogin: any) => (
    <>
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
        <Route path="/onboarding" element={<NewOrganizationWizard />} />
        <Route path="/setup/:slug" element={<OrganizationSetup />} />
        <Route path="/portal/:token" element={<PortalRoute />} />
    </>
);
