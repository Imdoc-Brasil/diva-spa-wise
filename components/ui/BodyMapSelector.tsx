
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface BodyZone {
    id: string;
    name: string;
    path: string; // SVG Path
    color: string;
    suggestedServices: string[];
}

const FACE_ZONES: BodyZone[] = [
    {
        id: 'forehead',
        name: 'Testa / Frontal',
        path: 'M50,25 C80,10 120,10 150,25 C155,40 155,55 150,65 C100,80 100,80 50,65 C45,55 45,40 50,25 Z',
        color: '#E0B0FF', // Purple-ish
        suggestedServices: ['Toxina Botulínica (Testa)', 'Skinbooster']
    },
    {
        id: 'glabella',
        name: 'Glabela (Entre Sobrancelhas)',
        path: 'M85,65 C100,75 100,75 115,65 L110,85 C100,90 100,90 90,85 Z',
        color: '#FFB6C1', // Pink
        suggestedServices: ['Toxina Botulínica (Glabela)', 'Fios de PDO']
    },
    {
        id: 'eyes_left',
        name: 'Olhos (Pés de Galinha) - Esq',
        path: 'M35,65 C50,65 50,80 35,80 C20,80 20,65 35,65 Z',
        color: '#87CEFA', // Blue
        suggestedServices: ['Toxina Botulínica (Orbicular)', 'Preenchimento Olheiras']
    },
    {
        id: 'eyes_right',
        name: 'Olhos (Pés de Galinha) - Dir',
        path: 'M165,65 C180,65 180,80 165,80 C150,80 150,65 165,65 Z',
        color: '#87CEFA',
        suggestedServices: ['Toxina Botulínica (Orbicular)', 'Preenchimento Olheiras']
    },
    {
        id: 'cheeks',
        name: 'Malar / Bochechas',
        path: 'M40,90 C70,100 130,100 160,90 C170,120 160,140 150,150 C100,140 100,140 50,150 C40,140 30,120 40,90 Z',
        color: '#98FB98', // Green
        suggestedServices: ['Preenchimento Malar', 'Bioestimulador de Colágeno', 'Fios de Sustentação']
    },
    {
        id: 'nasolabial',
        name: 'Sulco Nasogeniano (Bigode Chinês)',
        path: 'M80,130 C90,125 110,125 120,130 L130,160 C110,170 90,170 70,160 Z',
        color: '#FFA07A', // Salmon
        suggestedServices: ['Preenchimento Sulco', 'Fios de PDO']
    },
    {
        id: 'lips',
        name: 'Lábios',
        path: 'M85,165 C100,160 100,160 115,165 C120,175 115,185 100,190 C85,185 80,175 85,165 Z',
        color: '#FF69B4', // Hot Pink
        suggestedServices: ['Preenchimento Labial', 'Hidratação Labial']
    },
    {
        id: 'marionette',
        name: 'Linhas de Marionete',
        path: 'M70,170 C65,185 65,185 75,200 L90,195 C85,185 85,185 80,175 Z M130,170 C135,185 135,185 125,200 L110,195 C115,185 115,185 120,175 Z',
        color: '#DDA0DD',
        suggestedServices: ['Preenchimento Marionete']
    },
    {
        id: 'chin',
        name: 'Mento (Queixo)',
        path: 'M80,205 C100,200 100,200 120,205 C115,225 105,235 100,235 C95,235 85,225 80,205 Z',
        color: '#F0E68C', // Khaki
        suggestedServices: ['Preenchimento Mento', 'Toxina Botulínica (Mentalis)']
    },
    {
        id: 'jawline',
        name: 'Contorno Mandibular',
        path: 'M40,160 C50,190 70,220 90,235 L110,235 C130,220 150,190 160,160 L170,170 C160,210 130,250 100,250 C70,250 40,210 30,170 Z',
        color: '#B0C4DE',
        suggestedServices: ['Preenchimento Mandíbula', 'Bioestimulador', 'Esvaziadores']
    },
    {
        id: 'neck',
        name: 'Pescoço',
        path: 'M60,255 L140,255 L150,300 L50,300 Z',
        color: '#D3D3D3',
        suggestedServices: ['Bioestimulador Pescoço', 'Skinbooster', 'Toxina Nefertiti']
    }
];

interface BodyMapSelectorProps {
    onZoneSelect: (zoneName: string, services: string[]) => void;
}

const BodyMapSelector: React.FC<BodyMapSelectorProps> = ({ onZoneSelect }) => {
    const [hoveredZone, setHoveredZone] = useState<string | null>(null);

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Mapeamento Facial</h3>

            <div className="relative w-64 h-80 bg-white rounded-xl shadow-inner border border-gray-100 p-2">
                <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-xl" style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))' }}>
                    {/* Face Base Outline */}
                    <path
                        d="M20,70 C20,10 180,10 180,70 C180,180 150,240 100,240 C50,240 20,180 20,70 Z"
                        fill="#F5F5F5"
                        stroke="#E5E5E5"
                        strokeWidth="2"
                    />

                    {/* Zones */}
                    {FACE_ZONES.map(zone => (
                        <path
                            key={zone.id}
                            d={zone.path}
                            fill={hoveredZone === zone.id ? zone.color : 'rgba(255,255,255,0.01)'} // Transparent unless hovered
                            stroke={hoveredZone === zone.id ? 'white' : 'rgba(0,0,0,0.1)'}
                            strokeWidth="1.5"
                            className="cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80"
                            onMouseEnter={() => setHoveredZone(zone.id)}
                            onMouseLeave={() => setHoveredZone(null)}
                            onClick={() => onZoneSelect(zone.name, zone.suggestedServices)}
                        />
                    ))}

                    {/* Labels on Hover */}
                    {/* Simple geometric features for reference if needed, but zones cover mostly everything */}
                </svg>

                {/* Floating Tooltip */}
                {hoveredZone && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-diva-dark text-white text-xs px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in slide-in-from-bottom-2">
                        {FACE_ZONES.find(z => z.id === hoveredZone)?.name}
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
                Clique em uma área para ver tratamentos sugeridos.
            </p>
        </div>
    );
};

export default BodyMapSelector;
