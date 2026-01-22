import React from 'react';
import { Save, Loader } from 'lucide-react';

interface SaveButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
}

/**
 * Reusable save button for settings
 * Shows loading state and handles disabled state
 */
export const SaveButton: React.FC<SaveButtonProps> = ({
    onClick,
    isLoading = false,
    disabled = false,
    children = 'Salvar Alterações',
    className = ''
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        bg-purple-600 text-white font-medium
        hover:bg-purple-700 active:bg-purple-800
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
        >
            {isLoading ? (
                <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Salvando...
                </>
            ) : (
                <>
                    <Save className="w-4 h-4" />
                    {children}
                </>
            )}
        </button>
    );
};
