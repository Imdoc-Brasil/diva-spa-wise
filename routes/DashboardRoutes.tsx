import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';

// Lazy load dashboard modules
const Dashboard = lazy(() => import('../components/Dashboard'));
const StaffDashboard = lazy(() => import('../components/StaffDashboard'));
const UserProfileModule = lazy(() => import('../components/modules/UserProfileModule'));
const ClientPortalModule = lazy(() => import('../components/modules/ClientPortalModule'));

// Core Modules
const CrmModule = lazy(() => import('../components/modules/CrmModule'));
const SchedulingModule = lazy(() => import('../components/modules/SchedulingModule'));
const FinanceModule = lazy(() => import('../components/modules/FinanceModule'));
const StaffModule = lazy(() => import('../components/modules/StaffModule'));
const SettingsModule = lazy(() => import('../components/modules/SettingsModule'));
const ReportsModule = lazy(() => import('../components/modules/ReportsModule'));

// Clinical Modules
const TreatmentPlansModule = lazy(() => import('../components/modules/TreatmentPlansModule'));
const PharmacyModule = lazy(() => import('../components/modules/PharmacyModule'));
const RoomsModule = lazy(() => import('../components/modules/RoomsModule'));

// Marketing & Sales
const MarketingModule = lazy(() => import('../components/modules/MarketingModule'));
const LoyaltyModule = lazy(() => import('../components/modules/LoyaltyModule'));
const FunnelModule = lazy(() => import('../components/modules/FunnelModule'));

// Operations
const TasksModule = lazy(() => import('../components/modules/TasksModule'));
const EventsModule = lazy(() => import('../components/modules/EventsModule'));
const ComplianceModule = lazy(() => import('../components/modules/ComplianceModule'));
const SecurityModule = lazy(() => import('../components/modules/SecurityModule'));

// Experience & Services
const MarketplaceModule = lazy(() => import('../components/modules/MarketplaceModule'));
const ConciergeModule = lazy(() => import('../components/modules/ConciergeModule'));
const WebsiteModule = lazy(() => import('../components/modules/WebsiteModule'));
const CommunicationModule = lazy(() => import('../components/modules/CommunicationModule'));
const VoiceModule = lazy(() => import('../components/modules/VoiceModule'));

// Additional Modules
const PayModule = lazy(() => import('../components/modules/PayModule'));
const LaundryModule = lazy(() => import('../components/modules/LaundryModule'));
const DriveModule = lazy(() => import('../components/modules/DriveModule'));
const PartnersModule = lazy(() => import('../components/modules/PartnersModule'));
const PromotionsModule = lazy(() => import('../components/modules/PromotionsModule'));
const ReputationModule = lazy(() => import('../components/modules/ReputationModule'));
const KioskModule = lazy(() => import('../components/modules/KioskModule'));
const TvModule = lazy(() => import('../components/modules/TvModule'));
const AcademyModule = lazy(() => import('../components/modules/AcademyModule'));
const AssetsModule = lazy(() => import('../components/modules/AssetsModule'));
const FranchiseModule = lazy(() => import('../components/modules/FranchiseModule'));
const IntegrationsModule = lazy(() => import('../components/modules/IntegrationsModule'));
const TalentModule = lazy(() => import('../components/modules/TalentModule'));
const HelpModule = lazy(() => import('../components/modules/HelpModule'));
const MigrationModule = lazy(() => import('../components/modules/MigrationModule'));
const OrganizationSettings = lazy(() => import('../components/modules/OrganizationSettings'));

/**
 * Dashboard Routes - Protected routes for authenticated users
 */
export const DashboardRoutes = () => (
    <>
        {/* Main Dashboards */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/staff" element={<ProtectedRoute><Layout><StaffDashboard /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><Layout><UserProfileModule /></Layout></ProtectedRoute>} />

        {/* Core Modules */}
        <Route path="/dashboard/crm" element={<ProtectedRoute><Layout><CrmModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/scheduling" element={<ProtectedRoute><Layout><SchedulingModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/finance" element={<ProtectedRoute><Layout><FinanceModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/staff-management" element={<ProtectedRoute><Layout><StaffModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><Layout><SettingsModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><Layout><ReportsModule /></Layout></ProtectedRoute>} />

        {/* Clinical */}
        <Route path="/dashboard/treatment-plans" element={<ProtectedRoute><Layout><TreatmentPlansModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/pharmacy" element={<ProtectedRoute><Layout><PharmacyModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/rooms" element={<ProtectedRoute><Layout><RoomsModule /></Layout></ProtectedRoute>} />

        {/* Marketing & Sales */}
        <Route path="/dashboard/marketing" element={<ProtectedRoute><Layout><MarketingModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/loyalty" element={<ProtectedRoute><Layout><LoyaltyModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/funnel" element={<ProtectedRoute><Layout><FunnelModule /></Layout></ProtectedRoute>} />

        {/* Operations */}
        <Route path="/dashboard/tasks" element={<ProtectedRoute><Layout><TasksModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/events" element={<ProtectedRoute><Layout><EventsModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/compliance" element={<ProtectedRoute><Layout><ComplianceModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/security" element={<ProtectedRoute><Layout><SecurityModule /></Layout></ProtectedRoute>} />

        {/* Experience & Services */}
        <Route path="/dashboard/marketplace" element={<ProtectedRoute><Layout><MarketplaceModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/concierge" element={<ProtectedRoute><Layout><ConciergeModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/website" element={<ProtectedRoute><Layout><WebsiteModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/communication" element={<ProtectedRoute><Layout><CommunicationModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/voice" element={<ProtectedRoute><Layout><VoiceModule /></Layout></ProtectedRoute>} />

        {/* Additional Modules */}
        <Route path="/dashboard/pay" element={<ProtectedRoute><Layout><PayModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/laundry" element={<ProtectedRoute><Layout><LaundryModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/drive" element={<ProtectedRoute><Layout><DriveModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/partners" element={<ProtectedRoute><Layout><PartnersModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/promotions" element={<ProtectedRoute><Layout><PromotionsModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/reputation" element={<ProtectedRoute><Layout><ReputationModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/kiosk" element={<ProtectedRoute><Layout><KioskModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/tv" element={<ProtectedRoute><Layout><TvModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/academy" element={<ProtectedRoute><Layout><AcademyModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/assets" element={<ProtectedRoute><Layout><AssetsModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/franchise" element={<ProtectedRoute><Layout><FranchiseModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/integrations" element={<ProtectedRoute><Layout><IntegrationsModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/talent" element={<ProtectedRoute><Layout><TalentModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/help" element={<ProtectedRoute><Layout><HelpModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/migration" element={<ProtectedRoute><Layout><MigrationModule /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/organization" element={<ProtectedRoute><Layout><OrganizationSettings /></Layout></ProtectedRoute>} />
    </>
);
