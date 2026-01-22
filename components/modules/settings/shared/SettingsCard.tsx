import React from 'react';

interface SettingsCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

/**
 * Card component for individual settings items
 * Provides consistent styling for settings cards
 */
export const SettingsCard: React.FC<SettingsCardProps> = ({
    title,
    description,
    children,
    actions,
    className = ''
}) => {
    return (
        <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex-shrink-0 ml-4">
                        {actions}
                    </div>
                )}
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
};
