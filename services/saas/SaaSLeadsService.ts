
import { SaaSLead, SaaSLeadStage, SaaSPlan } from '../../types';

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SaaSLeadsService = {
    async getAllLeads(): Promise<SaaSLead[]> {
        if (!PROJECT_URL || !ANON_KEY) return [];

        try {
            // 1. Fetch Explicit Leads (saas_leads table)
            const leadsResponse = await fetch(`${PROJECT_URL}/rest/v1/saas_leads?select=*&order=created_at.desc`, {
                method: 'GET',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            let dbLeads: any[] = [];
            if (leadsResponse.ok) {
                dbLeads = await leadsResponse.json();
            }

            // 2. Fetch Organizations (Implicit Leads/Subscribers)
            // Organizations that are in 'trial' or 'active' should appear in CRM
            const orgsResponse = await fetch(`${PROJECT_URL}/rest/v1/organizations?select=*`, {
                method: 'GET',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            let dbOrgs: any[] = [];
            if (orgsResponse.ok) {
                dbOrgs = await orgsResponse.json();
            }

            // 3. Map & Merge
            const mappedLeads: SaaSLead[] = [];
            const processedEmails = new Set<string>();

            // Process DB Leads first
            dbLeads.forEach((d: any) => {
                const lead: SaaSLead = {
                    id: d.id,
                    name: d.name,
                    clinicName: d.clinic_name,
                    legalName: d.legal_name,
                    email: d.email,
                    phone: d.phone,
                    stage: mapStatusToStage(d.stage || d.status),
                    planInterest: d.plan_interest as SaaSPlan,
                    source: d.source || 'website',
                    status: 'active',
                    notes: d.notes,
                    estimatedValue: d.estimated_value || 0,
                    cnpj: d.cnpj,
                    address: d.address,
                    city: d.city,
                    state: d.state,
                    trialStartDate: d.trial_start_date,
                    createdAt: d.created_at,
                    updatedAt: d.updated_at
                };
                mappedLeads.push(lead);
                if (d.email) processedEmails.add(d.email.toLowerCase());
            });

            // Process Orgs as Leads (if not already present)
            // Organizations are generally further down the funnel (Trial or Subscriber)
            dbOrgs.forEach((o: any) => {
                // If we don't have an email to match, we might duplicate. 
                // But organizations from 'profiles' usually have an owner. 
                // We'll trust that if an org exists, it's a valid entity to list.
                // We can check if an org name matches a lead clinic name to avoid dups too.

                // Note: Organizations table might not have owner email directly if it's normalized.
                // But let's assume valid fields or we might need to fetch profiles. 
                // For simplicity/robustness, we show them. 

                const stage = mapSubscriptionToStage(o.subscription_status);

                // Attempt to matching by ID or Name if email is missing
                const alreadyExists = mappedLeads.find(l =>
                    l.clinicName?.toLowerCase() === o.name?.toLowerCase()
                );

                if (!alreadyExists) {
                    mappedLeads.push({
                        id: o.id, // Use Org ID
                        name: 'Admin (Org)', // Placeholder if profile not linked
                        clinicName: o.name,
                        email: '', // Unknown from this endpoint
                        phone: '',
                        stage: stage,
                        planInterest: o.subscription_plan_id as SaaSPlan,
                        source: 'other', // Mapped from 'platform' to 'other'
                        status: 'active',
                        createdAt: o.created_at,
                        updatedAt: o.created_at,
                        estimatedValue: 0,
                        notes: `Organization ID: ${o.id}`
                    });
                } else {
                    // Update existing lead stage if the Org status is more advanced
                    // e.g. Lead was 'New', but Org is 'Trial'
                    // This links the signup lead to the org
                    if (isStageAdvanced(stage, alreadyExists.stage)) {
                        alreadyExists.stage = stage;
                        alreadyExists.notes += ` [Linked to Org ${o.id}]`;
                    }
                }
            });

            return mappedLeads;

        } catch (error) {
            console.error('SaaSLeadsService Error:', error);
            return [];
        }
    }
};

function mapStatusToStage(status: string): SaaSLeadStage {
    if (!status) return SaaSLeadStage.NEW;
    status = status.toLowerCase();
    if (status.includes('trial')) return SaaSLeadStage.TRIAL_STARTED;
    if (status.includes('won') || status.includes('active')) return SaaSLeadStage.CLOSED_WON;
    if (status.includes('demo')) return SaaSLeadStage.DEMO_SCHEDULED;
    if (status.includes('lost')) return SaaSLeadStage.CLOSED_LOST;
    return SaaSLeadStage.NEW;
}

function mapSubscriptionToStage(status: string): SaaSLeadStage {
    if (!status) return SaaSLeadStage.NEW;
    if (status === 'trial') return SaaSLeadStage.TRIAL_STARTED;
    if (status === 'active') return SaaSLeadStage.CLOSED_WON;
    if (status === 'canceled') return SaaSLeadStage.CLOSED_LOST;
    return SaaSLeadStage.QUALIFIED;
}

function isStageAdvanced(newStage: SaaSLeadStage, currentStage: SaaSLeadStage): boolean {
    const order = [
        SaaSLeadStage.NEW,
        SaaSLeadStage.QUALIFIED,
        SaaSLeadStage.DEMO_SCHEDULED,
        SaaSLeadStage.TRIAL_STARTED,
        SaaSLeadStage.CLOSED_WON,
        SaaSLeadStage.CLOSED_LOST
    ];
    return order.indexOf(newStage) > order.indexOf(currentStage);
}
