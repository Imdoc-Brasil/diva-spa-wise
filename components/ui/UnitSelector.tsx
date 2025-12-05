
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Building, ChevronDown, Check, Globe } from 'lucide-react';

const UnitSelector: React.FC = () => {
    const { units, selectedUnitId, setSelectedUnitId } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedUnit = units.find(u => u.id === selectedUnitId);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (id: string | 'all') => {
        setSelectedUnitId(id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 text-gray-700 text-sm shadow-sm"
            >
                {selectedUnitId === 'all' ? (
                    <Globe size={16} className="text-blue-500" />
                ) : (
                    <Building size={16} className="text-amber-500" />
                )}

                <span className="font-medium max-w-[150px] truncate">
                    {selectedUnitId === 'all' ? 'Visão Consolidada' : selectedUnit?.name || 'Selecione uma Unidade'}
                </span>

                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs font-bold text-gray-500 uppercase px-2">Selecione a Unidade</p>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto py-1">
                        <button
                            onClick={() => handleSelect('all')}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedUnitId === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-md ${selectedUnitId === 'all' ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                    <Globe size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Visão Consolidada</p>
                                    <p className="text-xs opacity-70">Todas as unidades</p>
                                </div>
                            </div>
                            {selectedUnitId === 'all' && <Check size={16} className="text-blue-600" />}
                        </button>

                        <div className="h-px bg-gray-100 my-1 mx-2"></div>

                        {units.map(unit => (
                            <button
                                key={unit.id}
                                onClick={() => handleSelect(unit.id)}
                                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedUnitId === unit.id ? 'bg-amber-50 text-amber-700' : 'text-gray-700'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md ${selectedUnitId === unit.id ? 'bg-amber-200 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                        <Building size={16} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm truncate">{unit.name}</p>
                                        <p className="text-xs opacity-70 truncate">{unit.location}</p>
                                    </div>
                                </div>
                                {selectedUnitId === unit.id && <Check size={16} className="text-amber-600" />}
                            </button>
                        ))}
                    </div>

                    <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                        <button className="text-xs text-diva-primary font-bold hover:underline">
                            Gerenciar Unidades
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitSelector;
