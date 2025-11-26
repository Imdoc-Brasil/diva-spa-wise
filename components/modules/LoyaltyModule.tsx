
import React, { useState } from 'react';
import { MembershipPlan, Subscription } from '../../types';
import { Crown, TrendingUp, Users, DollarSign, CheckCircle, AlertCircle, RefreshCw, Trophy, Plus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { useData } from '../context/DataContext';
import NewLoyaltyPlanModal from '../modals/NewLoyaltyPlanModal';
import { useToast } from '../ui/ToastContext';

const mockPlans: MembershipPlan[] = [
  { id: 'p1', name: 'Diva Silver', price: 99.90, billingCycle: 'monthly', benefits: ['1 Limpeza de Pele/mês', '5% OFF em Produtos'], activeMembers: 145, colorHex: '#94a3b8' },
  { id: 'p2', name: 'Diva Gold', price: 249.90, billingCycle: 'monthly', benefits: ['1 Laser Área P/mês', '10% OFF em Produtos', 'Gift Card Aniversário'], activeMembers: 89, colorHex: '#BF784E' },
  { id: 'p3', name: 'Diva Diamond', price: 499.90, billingCycle: 'monthly', benefits: ['Laser Full Body', '20% OFF em Produtos', 'Agendamento Prioritário'], activeMembers: 32, colorHex: '#14808C' },
];

const mockSubs: Subscription[] = [
  { id: 'sub1', clientId: 'c1', clientName: 'Ana Silva', planId: 'p2', status: 'active', nextBillingDate: '2023-11-15', paymentMethod: 'Mastercard •••• 4242' },
  { id: 'sub2', clientId: 'c2', clientName: 'Beatriz Costa', planId: 'p1', status: 'overdue', nextBillingDate: '2023-10-10', paymentMethod: 'Visa •••• 8899' },
];

const mrrData = [
  { month: 'Jun', value: 12000 },
  { month: 'Jul', value: 13500 },
  { month: 'Ago', value: 14200 },
  { month: 'Set', value: 15800 },
  { month: 'Out', value: 18500 },
];

const LoyaltyModule: React.FC = () => {
  const { clients } = useData();
  const { addToast } = useToast();
  const [plans, setPlans] = useState<MembershipPlan[]>(mockPlans);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalMembers = plans.reduce((acc, p) => acc + p.activeMembers, 0);
  const totalMRR = plans.reduce((acc, p) => acc + (p.price * p.activeMembers), 0);

  const topRankedClients = [...clients]
    .sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0))
    .slice(0, 5);

  const handleCreatePlan = (newPlan: MembershipPlan) => {
      setPlans([...plans, newPlan]);
      addToast('Novo plano de assinatura criado!', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-diva-primary to-diva-dark rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-2">
                     <Crown size={20} className="text-diva-accent" />
                     <p className="text-xs uppercase font-bold opacity-80">MRR (Receita Recorrente)</p>
                 </div>
                 <h3 className="text-3xl font-mono font-bold">{formatCurrency(totalMRR)}</h3>
                 <p className="text-xs mt-2 bg-white/20 w-max px-2 py-1 rounded">+15% vs mês anterior</p>
             </div>
             <div className="absolute right-0 bottom-0 opacity-20 transform translate-y-4">
                 <Crown size={120} />
             </div>
         </div>

         <div className="bg-white rounded-xl p-6 border border-diva-light/30 shadow-sm flex flex-col justify-between">
             <div>
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Membros Ativos</p>
                 <div className="flex items-end gap-2">
                     <h3 className="text-3xl font-bold text-diva-dark">{totalMembers}</h3>
                     <span className="text-xs text-green-600 font-bold mb-1 flex items-center">
                         <TrendingUp size={14} className="mr-1" /> +12
                     </span>
                 </div>
             </div>
             <div className="h-10 mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={mrrData}>
                         <Area type="monotone" dataKey="value" stroke="#14808C" fill="#14808C" fillOpacity={0.1} />
                         <Tooltip cursor={false} />
                     </AreaChart>
                 </ResponsiveContainer>
             </div>
         </div>

         <div className="bg-white rounded-xl p-6 border border-diva-light/30 shadow-sm flex flex-col justify-between">
             <div>
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Churn Rate (Cancelamentos)</p>
                 <h3 className="text-3xl font-bold text-diva-alert">1.2%</h3>
                 <p className="text-xs text-gray-400 mt-2">Dentro da meta saudável ({"<"} 2%)</p>
             </div>
             <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4">
                 <div className="bg-diva-alert h-1.5 rounded-full" style={{width: '60%'}}></div>
             </div>
         </div>
      </div>

      {/* Plans Configuration */}
      <div>
         <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-bold text-diva-dark">Níveis de Assinatura</h3>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-bold text-diva-primary border border-diva-primary px-4 py-2 rounded-lg hover:bg-diva-primary hover:text-white transition-colors flex items-center"
             >
                 <Plus size={16} className="mr-1" /> Configurar Planos
             </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {plans.map(plan => (
                 <div key={plan.id} className="bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
                     <div className="h-1.5 w-full" style={{backgroundColor: plan.colorHex}}></div>
                     <div className="p-6">
                         <h4 className="font-bold text-lg text-diva-dark flex justify-between items-center">
                             {plan.name}
                             <Crown size={16} style={{color: plan.colorHex}} />
                         </h4>
                         <p className="text-2xl font-bold text-diva-dark mt-2">
                             {formatCurrency(plan.price)}
                             <span className="text-xs text-gray-400 font-normal"> /mês</span>
                         </p>
                         
                         <div className="my-6 space-y-2">
                             {plan.benefits.map((benefit, idx) => (
                                 <div key={idx} className="flex items-start text-sm text-gray-600">
                                     <CheckCircle size={14} className="mr-2 mt-0.5 text-green-500 shrink-0" />
                                     {benefit}
                                 </div>
                             ))}
                         </div>

                         <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                             <span className="text-gray-500">Assinantes Ativos</span>
                             <span className="font-bold text-diva-dark bg-gray-100 px-2 py-1 rounded">{plan.activeMembers}</span>
                         </div>
                     </div>
                 </div>
             ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-diva-light/20 bg-diva-primary/5">
                  <h3 className="font-bold text-diva-dark flex items-center">
                      <Trophy size={18} className="mr-2 text-yellow-500" /> Ranking de Milhagem
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Pacientes com maior pontuação.</p>
              </div>
              <div className="divide-y divide-gray-100">
                  {topRankedClients.map((client, idx) => (
                      <div key={client.clientId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm
                                  ${idx === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                                    idx === 1 ? 'bg-gray-100 text-gray-600 border border-gray-300' : 
                                    idx === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-white border border-gray-100 text-gray-400'}`}>
                                  {idx + 1}
                              </div>
                              <div>
                                  <p className="font-bold text-diva-dark text-sm">{client.name}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="font-mono font-bold text-diva-primary">{client.loyaltyPoints || 0}</span>
                              <p className="text-[9px] text-gray-400 uppercase">pts</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Subscribers List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-diva-light/30 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-diva-light/20 flex justify-between items-center">
                  <h3 className="font-bold text-diva-dark">Últimas Assinaturas</h3>
              </div>
              <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold">
                      <tr>
                          <th className="px-6 py-4">Cliente</th>
                          <th className="px-6 py-4">Plano</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Renovação</th>
                          <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                      {subscriptions.map(sub => {
                          const plan = plans.find(p => p.id === sub.planId);
                          return (
                              <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-diva-dark">{sub.clientName}</td>
                                  <td className="px-6 py-4">
                                      <span className="px-2 py-1 rounded text-xs font-bold text-white shadow-sm" style={{backgroundColor: plan?.colorHex || '#ccc'}}>
                                          {plan?.name || 'Plano'}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4">
                                      {sub.status === 'active' ? (
                                          <span className="flex items-center text-green-600 font-bold text-xs uppercase">
                                              <CheckCircle size={14} className="mr-1" /> Ativo
                                          </span>
                                      ) : (
                                          <span className="flex items-center text-diva-alert font-bold text-xs uppercase">
                                              <AlertCircle size={14} className="mr-1" /> Atrasado
                                          </span>
                                      )}
                                  </td>
                                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                      {new Date(sub.nextBillingDate).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <button className="text-gray-400 hover:text-diva-primary p-1">
                                          <RefreshCw size={16} />
                                      </button>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>
      <NewLoyaltyPlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreatePlan} />
    </div>
  );
};

export default LoyaltyModule;
