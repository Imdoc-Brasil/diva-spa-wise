// ============================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================

export enum UserRole {
    MASTER = 'master',
    SAAS_STAFF = 'saas_staff',
    ADMIN = 'admin',
    MANAGER = 'manager',
    STAFF = 'staff',
    FINANCE = 'finance',
    CLIENT = 'client'
}

export interface UserPreferences {
    notifications: { email: boolean; push: boolean; whatsapp: boolean };
    theme: 'light' | 'dark';
    language: string;
    twoFactorEnabled: boolean;
}

export interface User {
    uid: string;
    organizationId: string;
    email: string;
    displayName: string;
    role: UserRole;
    photoURL?: string;
    staffId?: string;  // ID do profissional (se role === STAFF)
    clientId?: string; // ID do cliente (se role === CLIENT)
    profileData?: {
        phoneNumber?: string;
        bio?: string;
        preferences?: UserPreferences;
    };
}

export type MemberStatus = 'active' | 'invited' | 'pending' | 'disabled';

export interface OrganizationMember {
    id: string;
    organizationId: string;
    userId?: string;
    email: string;
    name: string;
    role: string;
    status: MemberStatus;
    invitedAt: string;
    joinedAt?: string;
    lastActiveAt?: string;
    avatarUrl?: string;
}

export interface ClientAccessToken {
    id: string;
    clientId: string;
    token: string;
    expiresAt: string;
    createdAt: string;
    usedAt?: string;
    purpose: 'document_signature' | 'portal_access';
    documentIds?: string[];
}

export interface DocumentSignature {
    id: string;
    documentId: string;
    clientId: string;
    signatureData: string;
    signedAt: string;
    ipAddress?: string;
    userAgent?: string;
}
