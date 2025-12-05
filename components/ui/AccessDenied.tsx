import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

interface AccessDeniedProps {
    message?: string;
    title?: string;
    showIcon?: boolean;
}

/**
 * Componente exibido quando o usuário não tem permissão para acessar um recurso
 */
const AccessDenied: React.FC<AccessDeniedProps> = ({
    message = 'Você não tem permissão para visualizar este conteúdo.',
    title = 'Acesso Restrito',
    showIcon = true
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 p-8">
            {showIcon && (
                <div className="mb-4 p-4 bg-gray-100 rounded-full">
                    <Lock size={48} className="text-gray-400" />
                </div>
            )}
            <h3 className="font-bold text-lg text-gray-600 mb-2">{title}</h3>
            <p className="text-sm text-center max-w-md">{message}</p>
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                <ShieldAlert size={14} />
                <span>Entre em contato com a administração se precisar de acesso</span>
            </div>
        </div>
    );
};

export default AccessDenied;
