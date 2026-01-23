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
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
            trend: '+12%',
            isPositive: true
        },
        {
            label: 'Leads Quentes',
            value: hotLeads.toString(),
            icon: Zap,
            iconColor: 'text-teal-600 dark:text-teal-400',
            iconBg: 'bg-teal-100 dark:bg-teal-900/30',
            trend: 'Novos 48h',
            isPositive: true
        },
        {
            label: 'Taxa de Conversão',
            value: `${conversionRate.toFixed(1)}%`,
            icon: TrendingUp,
            iconColor: 'text-sky-600 dark:text-sky-400',
            iconBg: 'bg-sky-100 dark:bg-sky-900/30',
            trend: '+2.4%',
            isPositive: true
        },
        {
            label: 'Trials Ativos',
            value: activeTrials.toString(),
            icon: Users,
            iconColor: 'text-violet-600 dark:text-violet-400',
            iconBg: 'bg-violet-100 dark:bg-violet-900/30',
            trend: 'Em setup',
            isPositive: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pb-0">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border p-5 rounded-2xl shadow-spa hover:shadow-spa-md transition-all duration-300"
                >
                    <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                            <stat.icon size={20} className={stat.iconColor} />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.isPositive
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            }`}>
                            {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {stat.trend}
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-foreground mt-1 tracking-tight">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
