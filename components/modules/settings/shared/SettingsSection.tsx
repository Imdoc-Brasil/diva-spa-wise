import React from 'react';

interface SettingsSectionProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

/**
 * Wrapper component for settings sections
 * Provides consistent styling and layout
 */
export const SettingsSection: React.FC<SettingsSectionProps> = ({
    title,
    description,
    icon,
    children,
    className = ''
}) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        {description && (
                            <p className="text-sm text-gray-500 mt-1">{description}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
