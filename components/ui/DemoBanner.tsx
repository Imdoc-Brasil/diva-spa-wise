
import React from 'react';
import { AlertCircle } from 'lucide-react';

const DemoBanner: React.FC = () => {
    return (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center shadow-lg relative z-50">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <AlertCircle size={18} />
                <span>
                    <strong>VERSÃO DE DEMONSTRAÇÃO</strong> - Os dados não são salvos permanentemente.
                    Esta é uma versão de apresentação para validação de funcionalidades.
                </span>
            </div>
        </div>
    );
};

export default DemoBanner;
