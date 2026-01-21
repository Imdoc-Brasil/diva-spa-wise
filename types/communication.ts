// ============================================
// COMMUNICATION & MESSAGING
// ============================================

export type ChannelType = 'whatsapp' | 'instagram' | 'email';

export interface ChatMessage {
    id: string;
    content: string;
    sender: 'client' | 'staff' | 'system';
    timestamp: string;
    read: boolean;
}

export interface ChatConversation {
    id: string;
    organizationId: string;
    clientId: string;
    clientName: string;
    channel: ChannelType;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    status: 'open' | 'resolved';
    messages: ChatMessage[];
}

export interface CallLog {
    id: string;
    caller: string;
    duration: string;
    status: 'booked' | 'question' | 'transfer' | 'missed';
    timestamp: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    transcript: string;
}

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: 'alert' | 'info' | 'success';
    category: 'system' | 'inventory' | 'schedule';
    timestamp: string;
    read: boolean;
    actionLabel?: string;
    actionLink?: string;
}

// Forms & Templates
export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'section_header' | 'signature';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    width: 'full' | 'half';
    options?: string[];
    placeholder?: string;
}

export interface FormTemplate {
    id: string;
    organizationId: string;
    title: string;
    type: 'anamnesis' | 'consent' | 'evolution';
    active: boolean;
    createdAt: string;
    fields: FormField[];
}

export interface FieldResponse {
    fieldId: string;
    fieldLabel: string;
    fieldType: FieldType;
    value: string | boolean | string[];
}

export interface FormResponse {
    id: string;
    organizationId: string;
    formTemplateId: string;
    formTitle: string;
    appointmentId?: string;
    clientId: string;
    clientName: string;
    filledBy: string;
    filledAt: string;
    responses: FieldResponse[];
    signature?: string;
}

// Marketing Automation Templates
export type AutomationTriggerType = 'LEAD_CREATED' | 'TAG_ADDED' | 'STAGE_CHANGED' | 'FORM_SUBMITTED' | 'MANUAL_TRIGGER';
export type AutomationActionType = 'SEND_EMAIL' | 'SEND_WHATSAPP' | 'WAIT_DELAY' | 'ADD_TAG' | 'UPDATE_LEAD' | 'AI_GENERATE_CONTENT' | 'START_CAMPAIGN';

export interface AutomationTrigger {
    type: AutomationTriggerType;
    config?: {
        tag?: string;
        fromStage?: string;
        toStage?: string;
        formId?: string;
    };
}

export interface AutomationAction {
    id: string;
    type: AutomationActionType;
    config: {
        templateId?: string;
        delayMinutes?: number;
        tag?: string;
        prompt?: string;
        channel?: 'email' | 'whatsapp';
    };
}

export interface MessageTemplate {
    id: string;
    name: string;
    channel: 'email' | 'whatsapp';
    subject?: string;
    content: string;
    isAiPowered: boolean;
    folder?: string;
}
