
import React, { useState, useRef, useEffect } from 'react';
import { useOrganization } from '../context/OrganizationContext';
import { ChevronDown, Check, Plus, Settings, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrganizationSlug } from '../../hooks/useOrganizationSlug';

const OrganizationSwitcher: React.FC = () => {
    const { organization, switchOrganization, userOrganizations } = useOrganization();
    const { organization: urlOrganization, isMultiTenant } = useOrganizationSlug();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // If in multi-tenant mode, show read-only organization
    if (isMultiTenant && urlOrganization) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200 text-gray-600 text-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-diva-primary to-diva-accent rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {urlOrganization.name.charAt(0)}
                </div>
                <div className="flex flex-col items-start mr-1">
                    <span className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-[1px]">Organização</span>
                    <span className="font-bold text-sm max-w-[150px] truncate leading-none text-diva-dark">
                        {urlOrganization.name}
                    </span>
                </div>
                <div title="Organização fixa">
                    <Lock size={12} className="text-gray-400" />
                </div>
            </div>
        );
    }

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

    const handleSelect = (orgId: string) => {
        switchOrganization(orgId);
        setIsOpen(false);
    };

    const handleCreateOrg = () => {
        setIsOpen(false);
        navigate('/settings/organization/new');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 text-gray-800 text-sm shadow-sm group"
            >
                <div className="w-6 h-6 bg-gradient-to-br from-diva-primary to-diva-accent rounded flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:shadow-md transition-all">
                    {organization?.name.charAt(0)}
                </div>
                <div className="flex flex-col items-start mr-1">
                    <span className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-[1px]">Organização</span>
                    <span className="font-bold text-sm max-w-[150px] truncate leading-none text-diva-dark">
                        {organization?.name || 'Selecione'}
                    </span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-500 uppercase">Minhas Clínicas</p>
                        <button
                            onClick={() => { setIsOpen(false); navigate('/settings/organization'); }}
                            className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-diva-dark"
                            title="Gerenciar Organização"
                        >
                            <Settings size={14} />
                        </button>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto py-1 custom-scrollbar">
                        {userOrganizations.map(org => (
                            <button
                                key={org.id}
                                onClick={() => handleSelect(org.id)}
                                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-l-4 ${organization?.id === org.id ? 'bg-diva-light/10 border-diva-primary' : 'border-transparent'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ${organization?.id === org.id ? 'bg-diva-primary' : 'bg-gray-300'}`}>
                                        {org.logo ? <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-lg" /> : org.name.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className={`font-bold text-sm truncate ${organization?.id === org.id ? 'text-diva-dark' : 'text-gray-700'}`}>{org.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{org.domain ? `${org.domain}` : `${org.slug}.imdoc.com`}</p>
                                        <p className="text-[10px] text-gray-300 capitalize">{org.subscriptionPlanId}</p>
                                    </div>
                                </div>
                                {organization?.id === org.id && <Check size={16} className="text-diva-primary" />}
                            </button>
                        ))}
                    </div>

                    <div className="p-2 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={handleCreateOrg}
                            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-diva-primary font-bold hover:bg-white hover:shadow-sm rounded-lg transition-all border border-dashed border-diva-primary/30 hover:border-diva-primary"
                        >
                            <Plus size={16} />
                            Criar Nova Clínica
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationSwitcher;
