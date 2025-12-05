
import React, { useState, useEffect } from 'react';
import { OpenVial, VialUsageLog } from '../../types';
import { Beaker, Clock, Activity, AlertTriangle, Search, Plus, History, CheckCircle, Droplets, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';



const PharmacyModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'fridge' | 'calculator' | 'traceability'>('fridge');
    const { vials, removeVial, vialUsageLogs } = useData();

    // Calculator State
    const [toxinType, setToxinType] = useState('botox'); // botox (100u) or dysport (300u/500u)
    const [diluentVolume, setDiluentVolume] = useState(2.0); // ml
    const [calcResult, setCalcResult] = useState(0); // Units per 0.1ml

    useEffect(() => {
        // Simple calc logic
        const baseUnits = toxinType === 'botox' ? 100 : 300;
        // Units per 0.1ml = (Total Units / Diluent Volume) * 0.1
        if (diluentVolume > 0) {
            setCalcResult((baseUnits / diluentVolume) * 0.1);
        }
    }, [toxinType, diluentVolume]);

    const getExpiryStatus = (openedAt: string, hours: number) => {
        const openDate = new Date(openedAt);
        const expireDate = new Date(openDate.getTime() + hours * 60 * 60 * 1000);
        const now = new Date();
        const diffMs = expireDate.getTime() - now.getTime();
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

        if (diffHours <= 0) return { label: 'Vencido', color: 'bg-red-100 text-red-700', critical: true };
        if (diffHours < 4) return { label: `Vence em ${diffHours}h`, color: 'bg-orange-100 text-orange-700', critical: true };
        return { label: `Vence em ${diffHours}h`, color: 'bg-green-100 text-green-700', critical: false };
    };

    const discardVial = (id: string) => {
        if (confirm("Confirmar descarte do frasco? Isso registrará uma perda no estoque.")) {
            removeVial(id);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">

            {/* Header */}
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-50 rounded-xl text-teal-600 border border-teal-100">
                        <Beaker size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif font-bold text-diva-dark">Farmácia Inteligente</h2>
                        <p className="text-sm text-gray-500">Gestão de Injetáveis e Fracionados</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('fridge')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'fridge' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Geladeira Virtual
                    </button>
                    <button
                        onClick={() => setActiveTab('calculator')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'calculator' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Calculadora
                    </button>
                    <button
                        onClick={() => setActiveTab('traceability')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'traceability' ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Rastreabilidade
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden p-6 bg-gray-50">

                {/* TAB: FRIDGE (Open Vials) */}
                {activeTab === 'fridge' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-diva-dark flex items-center">
                                <Activity size={18} className="mr-2 text-diva-primary" /> Frascos em Uso
                            </h3>
                            <button className="bg-white border border-diva-primary text-diva-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-primary hover:text-white transition-colors">
                                <Plus size={16} className="mr-2" /> Abrir Novo Frasco
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vials.map(vial => {
                                const status = getExpiryStatus(vial.openedAt, vial.expiresAfterOpen);
                                const percentage = (vial.remainingUnits / vial.initialUnits) * 100;

                                return (
                                    <div key={vial.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all relative group overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-1 h-full ${status.critical ? 'bg-red-500' : 'bg-green-500'}`}></div>

                                        <div className="flex justify-between items-start mb-4 pl-3">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Lote: {vial.batchNumber}</span>
                                                <h4 className="font-bold text-diva-dark text-lg leading-tight">{vial.productName}</h4>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="pl-3 mb-4">
                                            <div className="flex justify-between text-xs mb-1 font-medium text-gray-600">
                                                <span>Restante</span>
                                                <span>{vial.remainingUnits} / {vial.initialUnits} U</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${percentage < 20 ? 'bg-red-500' : 'bg-teal-500'}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="pl-3 flex justify-between items-center border-t border-gray-50 pt-3 mt-auto">
                                            <div className="text-xs text-gray-400 flex items-center">
                                                <Clock size={12} className="mr-1" /> Aberto: {new Date(vial.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded" title="Descartar" onClick={() => discardVial(vial.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded hover:bg-teal-100">
                                                    Registrar Uso
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB: CALCULATOR */}
                {activeTab === 'calculator' && (
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-diva-light/30 shadow-lg">
                        <h3 className="text-xl font-bold text-diva-dark mb-6 text-center flex items-center justify-center">
                            <Droplets className="mr-2 text-teal-500" /> Calculadora de Diluição Segura
                        </h3>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">Produto</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setToxinType('botox')}
                                            className={`flex-1 py-3 rounded-lg border font-bold text-sm transition-all ${toxinType === 'botox' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-200'}`}
                                        >
                                            Botox (100U)
                                        </button>
                                        <button
                                            onClick={() => setToxinType('dysport')}
                                            className={`flex-1 py-3 rounded-lg border font-bold text-sm transition-all ${toxinType === 'dysport' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-200'}`}
                                        >
                                            Dysport (300U)
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">Volume de Diluente (Soro)</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500">
                                        <input
                                            type="number"
                                            value={diluentVolume}
                                            onChange={(e) => setDiluentVolume(parseFloat(e.target.value))}
                                            step="0.1"
                                            className="w-full p-3 text-center font-bold text-diva-dark outline-none"
                                        />
                                        <span className="bg-gray-100 px-4 py-3 text-sm font-bold text-gray-500 border-l border-gray-300">ml</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-teal-50 p-6 rounded-xl border border-teal-100 text-center">
                                <p className="text-sm text-teal-800 font-bold uppercase tracking-wider mb-2">Resultado da Concentração</p>
                                <div className="text-5xl font-mono font-bold text-teal-700 mb-2">
                                    {calcResult.toFixed(1)} <span className="text-lg text-teal-600">U</span>
                                </div>
                                <p className="text-sm text-teal-600">
                                    Para cada <strong>0.1 ml</strong> (1 traço na seringa de insulina).
                                </p>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-start gap-3">
                                <AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-800 leading-relaxed">
                                    <strong>Atenção:</strong> Esta calculadora é apenas uma ferramenta de auxílio. A responsabilidade pela diluição e aplicação é exclusivamente do profissional habilitado. Verifique sempre a bula do fabricante.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: TRACEABILITY */}
                {activeTab === 'traceability' && (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input type="text" placeholder="Buscar por Lote, Paciente ou Produto..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none" />
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center text-xs font-bold bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">
                                    <History size={14} className="mr-1" /> Histórico Completo
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex-1">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Data/Hora</th>
                                        <th className="px-6 py-4">Paciente</th>
                                        <th className="px-6 py-4">Produto (ID Frasco)</th>
                                        <th className="px-6 py-4">Procedimento</th>
                                        <th className="px-6 py-4 text-right">Dose</th>
                                        <th className="px-6 py-4 text-right">Profissional</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {vialUsageLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {new Date(log.timestamp).toLocaleDateString()} <br />
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-diva-dark">{log.patientName}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{log.productName}</span>
                                                    <span className="text-[10px] text-gray-400 font-mono">ID: {log.vialId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{log.procedure}</td>
                                            <td className="px-6 py-4 text-right font-mono font-bold text-teal-600">{log.unitsUsed} U</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                                    {log.staffName}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PharmacyModule;
