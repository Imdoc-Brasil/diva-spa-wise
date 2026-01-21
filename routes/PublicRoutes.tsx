import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load public pages
const PublicPage = lazy(() => import('../components/public/PublicPage'));
const SalesPage = lazy(() => import('../components/public/SalesPage'));
const SignupPage = lazy(() => import('../components/public/SignupPage'));
const CheckoutPage = lazy(() => import('../components/public/CheckoutPage'));
const ThankYouPage = lazy(() => import('../components/public/ThankYouPage'));
const CalculatorPage = lazy(() => import('../components/public/CalculatorPage'));

/**
 * Public Routes - Accessible without authentication
 */
export const PublicRoutes = () => (
    <>
        <Route path="/" element={<PublicPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
    </>
);
