import { useData } from '../../components/context/DataContext';
import { UserRole } from '../../types';

/**
 * Authentication Hook
 * Provides authentication state and methods
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, hasRole, login, logout } = useAuth();
 * 
 * if (!isAuthenticated) {
 *   return <LoginPage />;
 * }
 * 
 * if (hasRole('ADMIN')) {
 *   return <AdminPanel />;
 * }
 * ```
 */
export const useAuth = () => {
    const { user, login, logout } = useData();

    const isAuthenticated = !!user;

    const hasRole = (role: UserRole | UserRole[]) => {
        if (!user) return false;

        if (Array.isArray(role)) {
            return role.includes(user.role);
        }

        return user.role === role;
    };

    const isAdmin = () => hasRole(['MASTER', 'ADMIN']);
    const isStaff = () => hasRole(['MASTER', 'ADMIN', 'STAFF']);

    return {
        user,
        isAuthenticated,
        hasRole,
        isAdmin,
        isStaff,
        login,
        logout
    };
};
