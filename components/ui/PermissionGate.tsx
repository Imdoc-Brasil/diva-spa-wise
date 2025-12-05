import React from 'react';
import { UserRole } from '../../types';
import AccessDenied from './AccessDenied';

interface PermissionGateProps {
    allowedRoles: UserRole[];
    userRole: UserRole | undefined;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    fallbackMessage?: string;
}

/**
 * Componente wrapper que controla o acesso baseado no perfil do usuário
 * 
 * Uso:
 * <PermissionGate allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]} userRole={user.role}>
 *   <SensitiveComponent />
 * </PermissionGate>
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
    allowedRoles,
    userRole,
    children,
    fallback,
    fallbackMessage
}) => {
    // Se não houver usuário ou role, nega acesso
    if (!userRole) {
        return fallback || <AccessDenied message="Você precisa estar autenticado para acessar este conteúdo." />;
    }

    // Verifica se o role do usuário está na lista de permitidos
    if (!allowedRoles.includes(userRole)) {
        return fallback || <AccessDenied message={fallbackMessage} />;
    }

    // Se tiver permissão, renderiza o conteúdo
    return <>{children}</>;
};

export default PermissionGate;
