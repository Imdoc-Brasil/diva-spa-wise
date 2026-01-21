// ============================================
// EVENTS & CLINIC OPERATIONS
// ============================================

export interface EventChecklistItem {
    id: string;
    task: string;
    completed: boolean;
}

export interface EventFeedPost {
    id: string;
    eventId: string;
    authorName: string;
    authorRole: 'staff' | 'admin' | 'system';
    content: string;
    imageUrl?: string;
    timestamp: string;
    likes: number;
}

export interface ClinicEvent {
    id: string;
    organizationId: string;
    title: string;
    date: string;
    time: string;
    description: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    capacity: number;
    confirmedCount: number;
    checkInCount: number;
    revenue: number;
    cost: number;
    bannerUrl?: string;
    price: number;
    location: string;
    feed: EventFeedPost[];
    checklist?: EventChecklistItem[];
}

export interface EventGuest {
    id: string;
    eventId: string;
    clientName: string;
    phone: string;
    status: 'confirmed' | 'invited' | 'no_show' | 'checked_in';
    vip: boolean;
    notes?: string;
    paymentStatus?: 'paid' | 'pending' | 'free' | 'refunded';
    ticketType?: 'standard' | 'vip';
}

// Operations & Tasks
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = string;

export interface OpsTask {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    category: TaskCategory;
    assignedTo?: string;
    dueDate?: string;
    tags?: string[];
    followers?: string[];
    createdAt: string;
}

// Compliance & Licenses
export interface ClinicLicense {
    id: string;
    name: string;
    issuer: string;
    expiryDate: string;
    status: 'valid' | 'warning' | 'expired';
}

export interface WasteLog {
    id: string;
    date: string;
    type: 'infectious' | 'sharps' | 'common';
    weight: number;
    collectedBy: string;
    manifestId: string;
    staffSignature: string;
}

// Integrations & Security
export interface Integration {
    id: string;
    name: string;
    category: 'communication' | 'utility' | 'finance' | 'marketing';
    description: string;
    connected: boolean;
    icon: string;
    configRequired: boolean;
}

export interface Webhook {
    id: string;
    event: string;
    url: string;
    status: 'active' | 'inactive';
    lastFired: string;
}

export interface AuditLogEntry {
    id: string;
    action: string;
    module: string;
    performedBy: string;
    role: string;
    timestamp: string;
    details: string;
    ipAddress: string;
}
