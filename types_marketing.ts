
// ============================================
// MARKETING AUTOMATION TYPES
// ============================================

export type AutomationTriggerType = 'LEAD_CREATED' | 'TAG_ADDED' | 'STAGE_CHANGED' | 'FORM_SUBMITTED' | 'MANUAL_TRIGGER';
export type AutomationActionType = 'SEND_EMAIL' | 'SEND_WHATSAPP' | 'WAIT_DELAY' | 'ADD_TAG' | 'UPDATE_LEAD' | 'AI_GENERATE_CONTENT' | 'START_CAMPAIGN';

export interface AutomationTrigger {
    type: AutomationTriggerType;
    config?: {
        tag?: string; // Para TAG_ADDED
        fromStage?: string; // Para STAGE_CHANGED
        toStage?: string; // Para STAGE_CHANGED
        formId?: string; // Para FORM_SUBMITTED
    };
}

export interface AutomationAction {
    id: string;
    type: AutomationActionType;
    config: {
        templateId?: string; // ID do template de email/whats
        delayMinutes?: number; // Para WAIT
        tag?: string; // Para ADD_TAG
        prompt?: string; // Para AI_GENERATE
        channel?: 'email' | 'whatsapp'; // Para AI_GENERATE
    };
}

export interface MarketingCampaign {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'draft';
    trigger: AutomationTrigger;
    steps: AutomationAction[]; // Sequência linear de ações
    stats: {
        enrolled: number;
        completed: number;
        converted: number;
    };
    createdAt: string;
}

export interface MessageTemplate {
    id: string;
    name: string;
    channel: 'email' | 'whatsapp';
    subject?: string; // Só para email
    content: string; // Suporta variáveis {{name}}, {{company}}
    isAiPowered: boolean; // Se true, usa o content como base para o prompt
}
