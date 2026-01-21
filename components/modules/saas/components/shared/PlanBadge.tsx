import React from 'react';
import { SaaSPlan } from '@/types';

interface PlanBadgeProps {
    plan: SaaSPlan;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * Badge component for displaying SaaS plan tiers
 * Consistent styling across the application
 */
export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm'
    };

    const colorClasses = {
        [SaaSPlan.START]: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
        [SaaSPlan.GROWTH]: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        [SaaSPlan.EXPERTS]: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        [SaaSPlan.EMPIRE]: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    };

    return (
        <span
            className={`
                inline-flex items-center justify-center
                rounded border font-bold uppercase
                ${sizeClasses[size]}
                ${colorClasses[plan]}
                ${className}
            `}
        >
            {plan}
        </span>
    );
};

export default PlanBadge;
