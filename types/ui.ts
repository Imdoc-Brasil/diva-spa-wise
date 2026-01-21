// ============================================
// UI & CONFIGURATION
// ============================================

export type MoodType = 'happy' | 'neutral' | 'tired' | 'stressed';

export interface AIMessage {
    id: string;
    sender: 'user' | 'ai';
    type: 'text' | 'widget_revenue' | 'widget_client' | 'widget_content' | 'widget_protocol';
    content: string;
    timestamp: Date;
    data?: any;
}

// Website & SaaS Configuration
export interface WebsiteConfig {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    primaryColor: string;
    showServices: boolean;
    showTeam: boolean;
    showTestimonials: boolean;
    contactPhone: string;
    instagramUrl: string;
    googleAnalyticsId?: string;
    metaPixelId?: string;
    seoTitle?: string;
    seoDescription?: string;
}

export interface SaaSAppConfig {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    primaryColor: string;
    showCalculator: boolean;
    showFeatures: boolean;
    showComparison: boolean;
    showPricing: boolean;
    googleAnalyticsId?: string;
    metaPixelId?: string;
    seoTitle?: string;
    seoDescription?: string;
    contactPhone?: string;
    fontFamily?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    enableThemeToggle?: boolean;
    defaultTheme?: 'dark' | 'light';
    featuresTitle?: string;
    featuresSubtitle?: string;
    pricingTitle?: string;
    pricingSubtitle?: string;
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaButtonText?: string;
}

export interface BusinessConfig {
    name: string;
    phone: string;
    address: string;
    workingHours: Record<string, { open: string; close: string; active: boolean }>;
}

export interface NotificationConfig {
    appointmentConfirmation: string;
    appointmentReminder: string;
}

// Drive & Files
export type DriveFileType = 'folder' | 'pdf' | 'image' | 'sheet' | 'doc';

export interface DriveItem {
    id: string;
    name: string;
    type: DriveFileType;
    updatedAt: string;
    owner: string;
    starred: boolean;
    path: { id: string; name: string }[];
    size?: string;
    thumbnailUrl?: string;
}

// Help & Support
export interface HelpArticle {
    id: string;
    title: string;
    category: 'finance' | 'clinical' | 'system' | 'getting_started';
    content: string;
    views: number;
}
