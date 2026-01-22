import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SaaSLead, SaaSLeadStage } from '@/types';

interface CRMStatsProps {
    leads: SaaSLead[];
}

export function CRMStats({ leads }: CRMStatsProps) {
    // 1. Total Pipeline Value (MRR)
    const totalMRR = leads.reduce((acc, lead) => acc + (lead.estimatedValue || 0), 0);

    // 2. Conversion Rate (Closed Won / Total Active)
    const wonLeads = leads.filter(l => l.stage === SaaSLeadStage.CLOSED_WON).length;
    const conversionRate = leads.length > 0 ? (wonLeads / leads.length) * 100 : 0;

    // 3. Hot Leads (New or Qualified in last 48h)
    const hotLeads = leads.filter(l => {
        const ageInHours = (new Date().getTime() - new Date(l.createdAt).getTime()) / (1000 * 60 * 60);
        return ageInHours <= 48 && l.status === 'active';
    }).length;

    // 4. Trial Velocity (Trial Started)
    const activeTrials = leads.filter(l => l.stage === SaaSLeadStage.TRIAL_STARTED).length;

    const stats = [
        {
            label: 'Valor em Pipeline',
            value: `R$ ${totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            trend: '+12%',
            isPositive: true
        },
        {
            label: 'Leads Quentes',
            value: hotLeads.toString(),
            icon: Zap,
            color: 'text-diva-accent',
            bg: 'bg-diva-accent/10',
            trend: 'Novos 48h',
            isPositive: true
        },
        {
            label: 'Taxa de Conversão',
            value: `${conversionRate.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            trend: '+2.4%',
            isPositive: true
        },
        {
            label: 'Trials Ativos',
            value: activeTrials.toString(),
            icon: Users,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            trend: 'Em setup',
            isPositive: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-slate-900/40 border border-white/5 p-5 rounded-3xl hover:border-white/10 transition-all duration-300 backdrop-blur-md overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${stat.bg}`}></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div className={`p-2.5 rounded-2xl ${stat.bg} ${stat.color} border border-white/5`}>
                            <stat.icon size={20} />
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {stat.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                            {stat.trend}
                        </div>
                    </div>

                    <div className="mt-4 relative z-10">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
