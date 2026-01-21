// ============================================
// MARKETING & CAMPAIGNS
// ============================================

export type PromotionType = 'percentage' | 'fixed_amount';

export interface Promotion {
    id: string;
    code: string;
    description: string;
    type: PromotionType;
    value: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usageCount: number;
    active: boolean;
    minSpend?: number;
}

export interface CampaignSegment {
    tags?: string[];
    rfmScoreMin?: number;
    rfmScoreMax?: number;
    lastVisitDaysMin?: number;
    lastVisitDaysMax?: number;
    serviceCategory?: string;
    isBirthday?: boolean;
}

export interface CampaignStats {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
}

export interface Campaign {
    id: string;
    organizationId: string;
    name: string;
    type: 'whatsapp' | 'email' | 'sms';
    status: 'draft' | 'scheduled' | 'sent' | 'active';
    segment: CampaignSegment;
    targetCount: number;
    content: {
        subject?: string;
        message: string;
    };
    stats: CampaignStats;
    scheduledFor?: string;
    sentAt?: string;
    createdAt: string;
    createdBy: string;
}

export type CampaignChannel = 'email' | 'whatsapp' | 'sms' | 'instagram' | 'in_app';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed';

export interface MarketingCampaign {
    id: string;
    organizationId: string;
    name: string;
    channel: CampaignChannel;
    segmentId: string;
    linkedEventId?: string;
    targetAudience?: string;
    scheduledFor?: string;
    status: CampaignStatus;
    messageContent?: string;
    templateId?: string;
    useWhatsappFlow?: boolean;
    flowId?: string;
    stats: {
        sent: number;
        opened: number;
        converted: number;
        revenue: number;
    };
}

export interface AutomationRule {
    id: string;
    organizationId: string;
    name: string;
    trigger: 'birthday' | 'post_service' | 'abandoned_cart' | 'inactive_30d' | 'lead_stale_24h' | 'new_event';
    action: 'send_message' | 'create_task' | 'notify_team';
    active: boolean;
}

export interface CustomerSegment {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    count: number;
    criteria?: any;
}

export interface YieldRule {
    id: string;
    organizationId: string;
    name: string;
    type: 'surge_time' | 'last_minute' | 'seasonality';
    description: string;
    adjustmentPercentage: number;
    condition: string;
    active: boolean;
}

// Loyalty & Membership
export interface MembershipPlan {
    id: string;
    organizationId: string;
    name: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    benefits: string[];
    activeMembers: number;
    colorHex: string;
}

export interface Subscription {
    id: string;
    organizationId: string;
    clientId: string;
    clientName: string;
    planId: string;
    status: 'active' | 'overdue' | 'cancelled';
    nextBillingDate: string;
    paymentMethod: string;
}

// Partners & Referrals
export type PartnerType = 'business' | 'influencer';

export interface Partner {
    id: string;
    organizationId: string;
    name: string;
    type: PartnerType;
    contact: string;
    code: string;
    commissionRate: number;
    clientDiscountRate: number;
    active: boolean;
    totalReferred: number;
    totalRevenue: number;
    pendingPayout: number;
    totalPaid: number;
    pixKey?: string;
}
