
const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface SaaSPlan {
    id: string;
    key: string;
    name: string;
    description: string;
    monthly_price: number;
    yearly_price: number;
    features: string[];
    is_popular: boolean;
    active: boolean;
}

export const PlansService = {
    async listPlans(): Promise<SaaSPlan[]> {
        if (!PROJECT_URL || !ANON_KEY) {
            console.error('PlansService: Missing Supabase Env Vars');
            return [];
        }

        try {
            const response = await fetch(`${PROJECT_URL}/rest/v1/saas_plans?select=*&active=eq.true&order=monthly_price.asc`, {
                method: 'GET',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('PlansService: Fetch failed', response.statusText);
                return [];
            }

            const data = await response.json();

            // Ensure correct sorting order preference
            const PLAN_ORDER = ['start', 'growth', 'experts', 'empire'];
            return data.sort((a: SaaSPlan, b: SaaSPlan) => {
                const idxA = PLAN_ORDER.indexOf(a.key);
                const idxB = PLAN_ORDER.indexOf(b.key);
                // Fallback to price if not in explicit order list
                if (idxA === -1 || idxB === -1) return a.monthly_price - b.monthly_price;
                return idxA - idxB;
            });

        } catch (error) {
            console.error('PlansService: Network Error', error);
            return [];
        }
    },

    async updatePlan(id: string, updates: Partial<SaaSPlan>): Promise<boolean> {
        if (!PROJECT_URL || !ANON_KEY) return false;

        try {
            const response = await fetch(`${PROJECT_URL}/rest/v1/saas_plans?id=eq.${id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(updates)
            });

            return response.ok;
        } catch (error) {
            console.error('PlansService: Update Error', error);
            return false;
        }
    }
};
