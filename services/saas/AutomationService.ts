
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
        if (!supabase) return Object.values(SYSTEM_CAMPAIGNS);

        const { data, error } = await supabase
            .from('marketing_campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Automation] Error fetching campaigns:', error);
            return Object.values(SYSTEM_CAMPAIGNS);
        }

        // Mapeia do formato do banco (snake_case) para nosso tipo se necessário.
        // Aqui assumimos que o banco retorna JSONB compatível com o tipo
        return data.map((row: any) => ({
            id: row.id,
            name: row.name,
            status: row.status,
            trigger: { type: row.trigger_type, config: row.trigger_config },
            steps: row.steps,
            stats: row.stats,
            createdAt: row.created_at
        }));
    }

    async saveCampaign(campaign: MarketingCampaign): Promise<MarketingCampaign | null> {
        if (!supabase) {
            console.warn('[Automation] Mock Save (No DB connection)');
            return campaign;
        }

        const payload = {
            id: campaign.id.length < 30 ? undefined : campaign.id, // Avoid sending temp IDs
            name: campaign.name,
            status: campaign.status,
            trigger_type: campaign.trigger.type,
            trigger_config: campaign.trigger.config,
            steps: campaign.steps,
            stats: campaign.stats,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('marketing_campaigns')
            .upsert(payload as any)
            .select()
            .single();

        if (error) {
            console.error('[Automation] Error saving campaign:', error);
            throw error;
        }

        if (!data) throw new Error('Failed to save campaign (No data returned)');

        const row = data as any;
        return {
            id: row.id,
            name: row.name,
            status: row.status,
            trigger: { type: row.trigger_type, config: row.trigger_config },
            steps: row.steps,
            stats: row.stats,
            createdAt: row.created_at
        };
    }

    async listTemplates(): Promise<MessageTemplate[]> {
        if (!supabase) return [];
        const { data, error } = await supabase.from('marketing_templates').select('*');

        if (error) {
            console.error('[Automation] Error fetching templates:', error);
            return [];
        }

        return data.map((row: any) => ({
            id: row.id,
            name: row.name,
            channel: row.channel,
            content: row.content,
            subject: row.subject,
            isAiPowered: row.is_ai_powered || false
        }));
    }

    async saveTemplate(template: MessageTemplate): Promise<MessageTemplate> {
        if (!supabase) {
            console.warn('[Automation] Mock Save Template (No DB connection)');
            return template;
        }

        const payload = {
            id: template.id.length < 30 ? undefined : template.id, // Generate new UUID if temp ID
            name: template.name,
            channel: template.channel,
            content: template.content,
            subject: template.subject,
            is_ai_powered: template.isAiPowered
            // updated_at: new Date().toISOString() // Removed to avoid error if column missing
        };

        try {
            console.log('[Automation] Sending Payload:', payload);
            const { data, error } = await supabase
                .from('marketing_templates')
                .upsert(payload as any)
                .select()
                .maybeSingle();

            if (error) {
                console.error('[Automation] Supabase Error:', error);
                throw new Error(error.message || 'Database error');
            }

            if (!data) {
                console.error('[Automation] No data returned from insert.');
                throw new Error('Falha ao Salvar: O banco não retornou os dados. Verifique a conexão.');
            }

            console.log('[Automation] Save Success:', data);
            const row = data as any;
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

    // --- Execution Core ---

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
        const { data: existing } = await supabase
            .from('saas_leads')
            .select('*')
            .eq('email', data.email)
            .single();

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
