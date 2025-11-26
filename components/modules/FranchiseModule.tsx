
import React from 'react';
import { BusinessUnit } from '../../types';
import { Building, TrendingUp, Users, Map, ArrowUpRight, ArrowDownRight, BarChart, DollarSign, Send, Settings } from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

const mockUnits: BusinessUnit[] = [
    { id: 'u1', name: 'Diva Jardins (Matriz)', location: 'São Paulo, SP', managerName: 'Ana G.', revenue: 145000, revenueMoM: 12, activeClients: 1200, nps: 92, status: 'operational' },
    { id: 'u2', name: 'Diva Moema', location: 'São Paulo, SP', managerName: 'Carlos R.', revenue: 98000, revenueMoM: -5, activeClients: 850, nps: 88, status: 'alert' },
    { id: 'u3', name: 'Diva Leblon', location: 'Rio de Janeiro, RJ', managerName: 'Mariana X.', revenue: 112000, revenueMoM: 8, activeClients: 940, nps: 95, status: 'operational' },
    { id: 'u4', name: 'Diva Savassi', location: 'Belo Horizonte, MG', managerName: 'Fernanda S.', revenue: 45000, revenueMoM: 20, activeClients: 300, nps: 90, status: 'operational' },
];

const aggregateData = [
    { month: 'Jun', total: 280000 },
    { month: 'Jul', total: 310000 },
    { month: 'Ago', total: 305000 },
    { month: 'Set', total: 340000 },
    { month: 'Out', total: 400000 },
];

const FranchiseModule: React.FC = () => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const totalRevenue = mockUnits.reduce((acc, u) => acc + u.revenue, 0);
  const totalClients = mockUnits.reduce((acc, u) => acc + u.activeClients, 0);
  const avgNps = Math.round(mockUnits.reduce((acc, u) => acc + u.nps, 0) / mockUnits.length);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header & Aggregate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
            <div className="bg-diva-dark text-white p-6 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div>
                    <p className="text-diva-light text-xs font-bold uppercase tracking-wider mb-1">Receita Global (ARR)</p>
                    <h3 className="text-3xl font-bold">{formatCurrency(totalRevenue)}</h3>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-green-400">
                    <TrendingUp size={14} className="mr-1" /> +15% vs Mês Anterior
                </div>
                <Building className="absolute bottom-4 right-4 text-white/10" size={64} />
            </div>

            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex flex-col justify-center">
                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Total de Clientes</p>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={24} /></div>
                    <span className="text-2xl font-bold text-diva-dark">{totalClients.toLocaleString()}</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex flex-col justify-center">
                <p className="text-gray-500 text-xs font-bold uppercase mb-2">NPS da Rede</p>
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Settings size={24} /></div>
                    <span className="text-2xl font-bold text-diva-dark">{avgNps}</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm flex flex-col justify-center items-center text-center">
                <button className="w-full bg-diva-primary text-white py-3 rounded-lg font-bold shadow-md hover:bg-diva-dark transition-all flex items-center justify-center">
                    <Send size={18} className="mr-2" /> Push Corporativo
                </button>
                <p className="text-[10px] text-gray-400 mt-2">Enviar novos preços/campanhas para todas as unidades</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
            
            {/* Left: Performance Ranking */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-diva-light/20 flex justify-between items-center">
                    <h3 className="font-bold text-diva-dark text-lg">Desempenho por Unidade</h3>
                    <button className="text-xs text-diva-primary hover:underline">Ver Detalhes</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {mockUnits.sort((a, b) => b.revenue - a.revenue).map((unit, idx) => (
                            <div key={unit.id} className="group p-4 rounded-xl border border-gray-200 hover:border-diva-primary hover:shadow-md transition-all bg-white cursor-pointer">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-diva-light'}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-diva-dark">{unit.name}</h4>
                                            <p className="text-xs text-gray-500">{unit.location} • Gerente: {unit.managerName}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${unit.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {unit.status}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-3">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase">Faturamento</p>
                                        <p className="font-mono font-bold text-diva-dark text-sm">{formatCurrency(unit.revenue)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase">Crescimento</p>
                                        <p className={`font-bold text-sm flex items-center ${unit.revenueMoM >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {unit.revenueMoM >= 0 ? <ArrowUpRight size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
                                            {Math.abs(unit.revenueMoM)}%
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase">NPS</p>
                                        <p className="font-bold text-diva-primary text-sm">{unit.nps}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Analytics & Map */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                
                {/* Growth Chart */}
                <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm h-64 flex flex-col">
                    <h3 className="font-bold text-diva-dark text-sm mb-4">Crescimento da Rede (5 Meses)</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={aggregateData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <YAxis hide />
                                <Tooltip formatter={(val:number) => formatCurrency(val)} />
                                <Line type="monotone" dataKey="total" stroke="#14808C" strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-diva-dark/5 p-6 rounded-xl border border-diva-dark/10 shadow-sm flex-1 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Brazil_location_map.svg/1701px-Brazil_location_map.svg.png')] bg-cover bg-center mix-blend-multiply pointer-events-none"></div>
                    
                    <h3 className="font-bold text-diva-dark text-sm mb-4 relative z-10 flex items-center">
                        <Map size={16} className="mr-2" /> Distribuição Geográfica
                    </h3>
                    
                    <div className="flex-1 relative z-10 space-y-2 overflow-y-auto">
                        {/* Simulated Pins on List */}
                        {mockUnits.map(unit => (
                            <div key={unit.id} className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-2 rounded border border-white/50 shadow-sm text-xs">
                                <span className="font-medium text-diva-dark">{unit.location}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-diva-primary"></div>
                                    <span className="text-gray-500">1 Unidade</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button className="w-full mt-4 bg-white border border-diva-dark text-diva-dark py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors relative z-10">
                        Adicionar Nova Filial
                    </button>
                </div>

            </div>
        </div>
    </div>
  );
};

export default FranchiseModule;
