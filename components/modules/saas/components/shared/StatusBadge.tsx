import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, Zap } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
    type?: 'lead' | 'subscriber' | 'ticket' | 'project';
    size?: 'sm' | 'md';
    className?: string;
}

/**
 * Universal status badge component
 * Displays status with appropriate icon and color
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    type = 'lead',
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'text-xs gap-1',
        md: 'text-sm gap-1.5'
    };

    const iconSize = size === 'sm' ? 12 : 14;

    // Subscriber status
    if (type === 'subscriber') {
        const config = {
            active: { icon: CheckCircle, color: 'text-green-400', label: 'Ativo' },
            delinquent: { icon: AlertCircle, color: 'text-red-400', label: 'Inadimplente' },
            trial: { icon: Zap, color: 'text-blue-400', label: 'Trial' },
            cancelled: { icon: XCircle, color: 'text-gray-400', label: 'Cancelado' }
        }[status] || { icon: Clock, color: 'text-slate-400', label: status };

        const Icon = config.icon;
        return (
            <span className={`flex items-center ${sizeClasses[size]} font-bold ${config.color} ${className}`}>
                <Icon size={iconSize} />
                {config.label}
            </span>
        );
    }

    // Ticket status
    if (type === 'ticket') {
        const config = {
            Open: { icon: Clock, color: 'text-blue-400', label: 'Aberto' },
            'In Progress': { icon: Zap, color: 'text-yellow-400', label: 'Em Andamento' },
            'Waiting Client': { icon: AlertCircle, color: 'text-orange-400', label: 'Aguardando Cliente' },
            Resolved: { icon: CheckCircle, color: 'text-green-400', label: 'Resolvido' },
            Closed: { icon: XCircle, color: 'text-gray-400', label: 'Fechado' }
        }[status] || { icon: Clock, color: 'text-slate-400', label: status };

        const Icon = config.icon;
        return (
            <span className={`flex items-center ${sizeClasses[size]} font-bold ${config.color} ${className}`}>
                <Icon size={iconSize} />
                {config.label}
            </span>
        );
    }

    // Project status
    if (type === 'project') {
        const config = {
            on_track: { icon: CheckCircle, color: 'text-green-400', label: 'No Prazo' },
            at_risk: { icon: AlertCircle, color: 'text-yellow-400', label: 'Em Risco' },
            delayed: { icon: XCircle, color: 'text-red-400', label: 'Atrasado' },
            completed: { icon: CheckCircle, color: 'text-blue-400', label: 'Concluído' }
        }[status] || { icon: Clock, color: 'text-slate-400', label: status };

        const Icon = config.icon;
        return (
            <span className={`flex items-center ${sizeClasses[size]} font-bold ${config.color} ${className}`}>
                <Icon size={iconSize} />
                {config.label}
            </span>
        );
    }

    // Default (lead or generic)
    return (
        <span className={`flex items-center ${sizeClasses[size]} font-bold text-slate-400 ${className}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
