
import { SaaSLead } from '../../types_saas';
import { MarketingCampaign, AutomationAction, AutomationActionType, MessageTemplate } from '../../types_marketing';
import { supabase } from '../supabase';

// Workflows pré-definidos (HARDCODED FOR DEMO)
// Em produção, isso viria de `await supabase.from('marketing_campaigns').select('*')...`
const SYSTEM_CAMPAIGNS: Record<string, MarketingCampaign> = {
    'REVENUE_CALCULATOR': {
        id: 'camp_system_01',
        name: 'Funil Calculadora de Receita (System)',
        status: 'active',
        createdAt: new Date().toISOString(),
        stats: { enrolled: 0, completed: 0, converted: 0 },
        trigger: { type: 'LEAD_CREATED' }, // Generic trigger for system calls
        steps: [
            { id: '1', type: 'ADD_TAG', config: { tag: 'Origem: Calculadora' } },
            { id: '2', type: 'ADD_TAG', config: { tag: 'Interesse: Alta Performance' } },
            // Em vez de hardcoded templates, usamos estrutura compatível
            { id: '3', type: 'SEND_EMAIL', config: { templateId: 'tpl_revenue_report' } },
            { id: '4', type: 'WAIT_DELAY', config: { delayMinutes: 2 } }, // Simula tempo de leitura
            { id: '5', type: 'AI_GENERATE_CONTENT', config: { prompt: 'Gerar mensagem de boas vindas personalizada citando o faturamento potencial de {potential_revenue}', channel: 'whatsapp' } },
            { id: '6', type: 'SEND_WHATSAPP', config: { templateId: 'tpl_ai_generated_msg' } }
        ]
    }
};

class AutomationService {

    // --- Persistence Methods (Supabase) ---

    async listCampaigns(): Promise<MarketingCampaign[]> {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!url || !key) return Object.values(SYSTEM_CAMPAIGNS);

        try {
            const res = await fetch(`${url}/rest/v1/marketing_campaigns?select=*&order=created_at.desc`, {
                headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
            });

            if (!res.ok) {
                console.warn('[Automation] Fetch Campaigns Failed:', res.status);
                return Object.values(SYSTEM_CAMPAIGNS);
            }

            const data = await res.json();
            return data.map((row: any) => ({
                id: row.id,
                name: row.name,
                status: row.status,
                trigger: { type: row.trigger_type, config: row.trigger_config },
                steps: row.steps,
                stats: row.stats,
                createdAt: row.created_at,
                folder: row.folder || 'Geral'
            }));
        } catch (e) {
            console.error('[Automation] Error listing campaigns:', e);
            return Object.values(SYSTEM_CAMPAIGNS);
        }
    }

    async saveCampaign(campaign: MarketingCampaign): Promise<MarketingCampaign | null> {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!url || !key) {
            console.warn('[Automation] Mock Save (No Keys)');
            return campaign;
        }

        const payload = {
            id: campaign.id.length < 30 ? undefined : campaign.id,
            name: campaign.name,
            status: campaign.status,
            trigger_type: campaign.trigger.type,
            trigger_config: campaign.trigger.config,
            steps: campaign.steps,
            stats: campaign.stats,
            folder: campaign.folder || 'Geral',
            updated_at: new Date().toISOString()
        };

        try {
            // Upsert via POST + Prefer: resolution=merge-duplicates
            const res = await fetch(`${url}/rest/v1/marketing_campaigns`, {
                method: 'POST',
                headers: {
                    'apikey': key,
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation,resolution=merge-duplicates'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`API Error: ${res.status} - ${text}`);
            }

            const data = await res.json();
            const row = data[0];

            return {
                id: row.id,
                name: row.name,
                status: row.status,
                trigger: { type: row.trigger_type, config: row.trigger_config },
                steps: row.steps,
                stats: row.stats,
                createdAt: row.created_at,
                folder: row.folder || 'Geral'
            };
        } catch (e) {
            console.error('[Automation] Error saving campaign:', e);
            throw e;
        }
    }

    async listTemplates(): Promise<MessageTemplate[]> {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (!url || !key) return [];

        try {
            const res = await fetch(`${url}/rest/v1/marketing_templates?select=*`, {
                headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
            });

            if (!res.ok) throw new Error(res.statusText);
            const data = await res.json();

            return data.map((row: any) => ({
                id: row.id,
                name: row.name,
                channel: row.channel,
                content: row.content,
                subject: row.subject,
                isAiPowered: row.is_ai_powered || false,
                folder: row.folder || 'Geral'
            }));
        } catch (e) {
            console.error('[Automation] Error fetching templates:', e);
            return [];
        }
    }

    async saveTemplate(template: MessageTemplate): Promise<MessageTemplate> {
        // Fallback or Direct Fetch to bypass Client issues
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!url || !key) {
            console.warn('[Automation] Mock Save (No Keys)');
            return template;
        }

        const payload = {
            id: template.id.length < 30 ? undefined : template.id,
            name: template.name,
            channel: template.channel,
            content: template.content,
            subject: template.subject,
            is_ai_powered: template.isAiPowered
        };

        try {
            console.log('[Automation] Saving via Raw Fetch:', payload);

            const response = await fetch(`${url}/rest/v1/marketing_templates`, {
                method: 'POST',
                headers: {
                    'apikey': key,
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation,resolution=merge-duplicates'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Erro API: ${response.status} - ${text}`);
            }

            const data = await response.json();
            const row = data[0];

            console.log('[Automation] Save Success (Raw):', row);

            return {
                id: row.id,
                name: row.name,
                channel: row.channel,
                content: row.content,
                subject: row.subject,
                isAiPowered: row.is_ai_powered
            };

        } catch (err) {
            console.error('[Automation] Save Exception:', err);
            throw err;
        }
    }

    async deleteTemplate(id: string): Promise<boolean> {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!url || !key) return false;

        try {
            console.log('[Automation] Deleting Template:', id);
            const res = await fetch(`${url}/rest/v1/marketing_templates?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'apikey': key,
                    'Authorization': `Bearer ${key}`
                }
            });
            if (res.ok) console.log('[Automation] Delete Success');
            else console.error('[Automation] Delete Failed:', res.status, await res.text());

            return res.ok;
        } catch (e) {
            console.error('[Automation] Delete Exception:', e);
            return false;
        }
    }

    async checkConnection() {
        if (!supabase) return { count: null, error: { message: 'Supabase client not initialized' } };

        try {
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout check')), 5000));
            const op = supabase.from('marketing_templates').select('*', { count: 'exact', head: true });

            // @ts-ignore
            return await Promise.race([op, timeout]);
        } catch (e: any) {
            return { count: null, error: e };
        }
    }

    /**
     * Processa a entrada de um lead através de um ponto de conversão (CTA)
     */
    async processConversion(
        conversionId: string, // 'REVENUE_CALCULATOR', 'EBOOK_X', etc
        leadData: Partial<SaaSLead>,
        contextData?: any, // Dados ricos (resultado do cálculo, respostas do quiz)
        attachments?: Blob[] // Arquivos gerados (PDFs)
    ) {
        console.log(`[Automation] 🚀 Triggered: ${conversionId} for ${leadData.email}`);

        // 1. Identificar ou Criar o Lead (Upsert)
        const lead = await this.upsertLead(leadData, contextData);

        // 2. Buscar o Campaign/Workflow
        // Tenta buscar no Banco primeiro
        let campaigns: MarketingCampaign[] = [];
        try {
            campaigns = await this.listCampaigns();
        } catch (e) {
            console.warn('DB fetch failed, using system defaults');
            campaigns = Object.values(SYSTEM_CAMPAIGNS);
        }

        // Simples lógica de match:
        // Se conversionId é um SYSTEM_CAMPAIGN key, usa ele.
        // Se não, procura um campaign cujo gatilho "Faça sentido" com o ID.
        // Ex: conversionId = 'STAGE_CHANGED_TO_trial' -> Campaign Trigger = 'STAGE_CHANGED' & config.toStage = 'trial'

        let activeCampaign = SYSTEM_CAMPAIGNS[conversionId]; // Fallback to hardcoded ID match

        if (!activeCampaign) {
            // Busca dinâmica
            activeCampaign = campaigns.find(c => {
                if (c.status !== 'active') return false;

                // Match logic
                if (conversionId === 'MANUAL_LEAD_CREATED' && c.trigger.type === 'LEAD_CREATED') return true;
                if (conversionId.startsWith('STAGE_CHANGED') && c.trigger.type === 'STAGE_CHANGED') {
                    const stage = conversionId.replace('STAGE_CHANGED_TO_', '');
                    return c.trigger.config?.toStage === stage;
                }
                if (conversionId === 'REVENUE_CALCULATOR' && c.trigger.type === 'TAG_ADDED' && c.trigger.config?.tag?.includes('Calculadora')) return true;

                return false;
            }) as MarketingCampaign;
        }

        if (!activeCampaign) {
            console.log(`[Automation] ℹ️ No active campaign found for trigger "${conversionId}"`);
            return lead;
        }

        // 3. Executar o Workflow
        await this.executeWorkflow(activeCampaign, lead, contextData, attachments);

        return lead;
    }

    private async upsertLead(data: Partial<SaaSLead>, contextData?: any): Promise<SaaSLead> {
        // Tenta buscar lead existente por email para merge
        let existing: any = null;
        if (data.email) {
            const { data: found } = await supabase
                .from('saas_leads')
                .select('*')
                .eq('email', data.email)
                .maybeSingle();
            existing = found;
        }

        const leadToSave = {
            ...data,
            id: existing?.id || data.id || `lead_${Date.now()}`,
            updatedAt: new Date().toISOString(),
            metadata: {
                ...(existing?.metadata || {}),
                ...(contextData || {}),
                lastConversion: new Date().toISOString()
            }
        };

        if (!existing) {
            leadToSave.createdAt = new Date().toISOString();
        }

        // Salva/Atualiza no Supabase
        const { error } = await supabase
            .from('saas_leads')
            .upsert(leadToSave as any);

        if (error) {
            // Em desenvolvimento sem conexão real, apenas loga e segue
            console.error('[Automation] ⚠️ Database sync skipped (Dev Mode):', error.message);
        } else {
            console.log('[Automation] ✅ Lead synced to database');
        }

        return leadToSave as SaaSLead;
    }

    async executeWorkflow(campaign: MarketingCampaign, lead: SaaSLead, context: any, attachments?: Blob[]) {
        console.log(`[Automation] ▶️ Starting Campaign: "${campaign.name}"`);

        // Contexto volátil para passar dados entre passos (ex: Conteúdo gerado pela IA)
        let executionContext: any = { ...context };

        for (const step of campaign.steps) {
            await this.executeStep(step, lead, executionContext, attachments);
        }

        console.log(`[Automation] 🏁 Campaign "${campaign.name}" Completed for ${lead.name}`);
    }

    private async executeStep(step: AutomationAction, lead: SaaSLead, context: any, attachments?: Blob[]) {
        switch (step.type) {
            case 'ADD_TAG':
                console.log(`[Automation] 🏷️ Added Tag: [${step.config.tag}]`);
                break;

            case 'WAIT_DELAY':
                console.log(`[Automation] ⏳ Waiting ${step.config.delayMinutes} minutes... (Simulated)`);
                break;

            case 'START_CAMPAIGN':
                console.log(`[Automation] 🔀 Triggering Nested Campaign: ${step.config.templateId || 'ID not set'}`);
                // Recursion logic would go here
                break;

            case 'AI_GENERATE_CONTENT':
                console.log(`[Automation] 🤖 AI generating content for ${step.config.channel}...`);
                console.log(`   Prompt: "${step.config.prompt}"`);
                // Simulação de IA gerando texto
                const generatedText = `Olá ${lead.name.split(' ')[0]}! Analisei seus dados e vi que sua clínica pode faturar mais R$ ${context?.calculator?.results?.potentialRevenue?.toLocaleString('pt-BR')} com nosso método.`;
                context.aiGeneratedContent = generatedText;
                console.log(`   ✨ Result: "${generatedText}"`);
                break;

            case 'SEND_EMAIL':
                this.mockSendEmail(lead, step.config, attachments);
                break;

            case 'SEND_WHATSAPP':
                // Se tiver conteúdo gerado por IA no contexto anterior, usa ele
                const content = context.aiGeneratedContent || "Olá, gostaria de falar sobre seu potencial.";
                this.mockSendWhatsApp(lead, { ...step.config, content });
                break;
        }
    }

    // --- Mock Senders ---

    private mockSendEmail(lead: SaaSLead, config: any, attachments?: Blob[]) {
        console.group(`[Automation] 📧 Email Sent to ${lead.email}`);
        console.log(`Template ID: ${config.templateId}`);
        if (attachments?.length) console.log(`📎 Attachments: ${attachments.length} file(s)`);
        console.groupEnd();
    }

    private mockSendWhatsApp(lead: SaaSLead, config: any) {
        console.group(`[Automation] 🟢 WhatsApp Sent to ${lead.phone}`);
        console.log(`Message: "${config.content}"`);
        console.groupEnd();
    }
}

export const automationService = new AutomationService();
