
import { Client, ServiceAppointment, Invoice } from '../types';

export type RFMSegment =
    | 'Champions'      // Campeões / Premium
    | 'Loyal'          // Fiéis
    | 'PotentialLoyalist' // Potenciais Fiéis / Em Fidelização
    | 'NewCustomers'   // Novos Pacientes
    | 'Promising'      // Promissores
    | 'NeedsAttention' // Precisam de Atenção
    | 'AboutToSleep'   // Prestes a dormir
    | 'AtRisk'         // Em Risco
    | 'CantLose'       // Não pode perdê-los
    | 'Hibernating'    // Hibernando / Adormecido
    | 'Lost';          // Perdidos / Ausentes / Parado

export interface RFMMetrics {
    recencyDays: number;
    frequencyCount: number;
    monetaryTotal: number;
    averageTicket: number;
    score: number; // 0-100
    segment: RFMSegment;
    segmentLabel: string;
    segmentColor: string;
}

export const getRFMDisplay = (segment: RFMSegment) => {
    switch (segment) {
        case 'Champions': return { label: 'Premium', color: 'bg-purple-600 text-white' };
        case 'Loyal': return { label: 'Pacientes Leais', color: 'bg-blue-400 text-white' };
        case 'PotentialLoyalist': return { label: 'Potenciais Leais', color: 'bg-blue-200 text-blue-900' };
        case 'NewCustomers': return { label: 'Novos Pacientes', color: 'bg-yellow-400 text-yellow-900' };
        case 'Promising': return { label: 'Promissores', color: 'bg-cyan-500 text-white' };
        case 'NeedsAttention': return { label: 'Precisam de Atenção', color: 'bg-green-500 text-white' };
        case 'AboutToSleep': return { label: 'Prestes a Dormir', color: 'bg-blue-300 text-blue-900' };
        case 'AtRisk': return { label: 'Em Risco', color: 'bg-cyan-600 text-white' };
        case 'CantLose': return { label: 'Não Pode Perder', color: 'bg-yellow-300 text-yellow-900' };
        case 'Hibernating': return { label: 'Hibernando', color: 'bg-indigo-900 text-white' };
        case 'Lost': return { label: 'Perdidos', color: 'bg-red-500 text-white' };
        default: return { label: 'Desconhecido', color: 'bg-gray-400 text-white' };
    }
};

export const calculateRFM = (
    client: Client,
    appointments: ServiceAppointment[], // History of appointments
    currentMonetaryTotal: number // Calculated LTV from transactions/invoices
): RFMMetrics => {
    const now = new Date();

    // 1. Calculate Recency (Days since last completed appointment)
    // Filter completed appointments for this client
    const clientAppts = appointments
        .filter(a => a.clientId === client.clientId && a.status === 'Completed')
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    let lastActivityDate = clientAppts.length > 0 ? new Date(clientAppts[0].startTime) : null;

    // Fallback to client.lastContact if no appointments found (mock data support)
    if (!lastActivityDate && client.lastContact) {
        lastActivityDate = new Date(client.lastContact);
    }

    const recencyDays = lastActivityDate
        ? Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))
        : 999; // Never visited

    // 2. Calculate Frequency (Visits in last 365 days)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const frequencyCount = clientAppts.length; // Total Lifetime Frequency or Annual?
    // User definition says "3+ visitas/ano". Using Annual Frequency for segmentation logic seems safer for "Premium".
    // But generic RFM often uses lifetime or variable windows. I'll calculate both but logic below uses what fits user description.
    const annualHeuristic = clientAppts.filter(a => new Date(a.startTime) > oneYearAgo).length;

    // 3. Monetary (Total Spent)
    // Use the passed currentMonetaryTotal, fallback to client.lifetimeValue if zero (mock safety)
    const finalMonetary = Math.max(currentMonetaryTotal, client.lifetimeValue);

    const averageTicket = frequencyCount > 0 ? finalMonetary / frequencyCount : 0;

    // 4. Segmentation Logic (Based on User + Matrix)
    // Matrix dimensions: Recency (X) vs F+M (Y)

    let segment: RFMSegment = 'Lost';

    // Premium / Champions: R <= 180, F >= 3/yr, M > 10k
    if (recencyDays <= 180 && annualHeuristic >= 3 && finalMonetary > 10000) {
        segment = 'Champions';
    }
    // Loyal: R <= 210, F >= 2, M > 5k
    else if (recencyDays <= 210 && annualHeuristic >= 2 && finalMonetary > 5000) {
        segment = 'Loyal';
    }
    // Potential Loyalist: R <= 240, F >= 2
    else if (recencyDays <= 240 && annualHeuristic >= 2) {
        segment = 'PotentialLoyalist';
    }
    // New Customers: R <= 90, F 1-2
    else if (recencyDays <= 90 && finalMonetary > 0) {
        segment = 'NewCustomers';
    }
    // Promising: R <= 120 (Recent but low F/M)
    else if (recencyDays <= 120) {
        segment = 'Promising';
    }
    // Needs Attention: R [360-540], High M historic
    else if (recencyDays >= 360 && recencyDays <= 540 && finalMonetary > 5000) {
        segment = 'NeedsAttention'; // "Não pode perdê-los" in matrix? Or "Precisam de atenção".
        // Matrix "Não pode perdê-los" is usually High M + High R (Churning VIPs).
    }
    // Hibernating / Sleep: R [450-720], Low F
    else if (recencyDays > 450 && recencyDays <= 720) {
        segment = 'Hibernating';
    }
    // Inactive / Lost: R > 730
    else if (recencyDays > 730) {
        segment = 'Lost';
    }
    // Catch-all for recent but generic
    else if (recencyDays <= 180) {
        segment = 'Promising';
    }
    // Catch-all for churning
    else {
        segment = 'AtRisk';
    }

    // 5. Score Calculation (0-100)
    // Simple heuristic: 
    // Recency Score (0-40): 40 if < 30 days, 0 if > 365 days.
    // Frequency Score (0-30): 30 if > 10 visits.
    // Monetary Score (0-30): 30 if > 10k.

    const rScore = Math.max(0, 40 - (recencyDays / 365) * 40);
    const fScore = Math.min(30, (frequencyCount / 10) * 30);
    const mScore = Math.min(30, (finalMonetary / 10000) * 30);

    const score = Math.round(rScore + fScore + mScore);

    // Force specific segments to have specific score ranges if needed
    // But calculated score is more "honest".

    const { label, color } = getRFMDisplay(segment);

    return {
        recencyDays,
        frequencyCount,
        monetaryTotal: finalMonetary,
        averageTicket,
        score,
        segment,
        segmentLabel: label,
        segmentColor: color
    };
};
