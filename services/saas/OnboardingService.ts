/**
 * OnboardingService
 * 
 * Complete subscriber onboarding service
 * Creates organization, admin user, profile, and default unit
 * 
 * Phase 2 of 4 - Onboarding Implementation
 */

import { supabase } from '../supabase';
import { SaaSLead, SaaSPlan } from '@/types';

// ============================================
// TYPES
// ============================================

export interface OnboardingResult {
    success: boolean;
    organization?: {
        id: string;
        name: string;
        slug: string;
    };
    adminUser?: {
        id: string;
        email: string;
        temporaryPassword: string;
    };
    unit?: {
        id: string;
        name: string;
    };
    accessUrl?: string;
    error?: string;
}

interface CreateOrganizationData {
    name: string;
    slug: string;
    planId: SaaSPlan;
    legalName?: string;
    cnpj?: string;
    email: string;
    phone: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

interface CreateAdminUserData {
    email: string;
    name: string;
    phone?: string;
    organizationId: string;
}

interface CreateUnitData {
    organizationId: string;
    name: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    email?: string;
}

// ============================================
// ONBOARDING SERVICE
// ============================================

export class OnboardingService {
    /**
     * Create a complete subscriber from a lead
     * This is the main entry point for lead conversion
     */
    async createCompleteSubscriber(lead: SaaSLead): Promise<OnboardingResult> {
        try {
            console.log('🚀 [Onboarding] Starting complete subscriber creation for:', lead.clinicName);

            // 1. Generate slug
            const slug = this.generateSlug(lead.clinicName);
            console.log('📝 [Onboarding] Generated slug:', slug);

            // 2. Create Organization
            const organization = await this.createOrganization({
                name: lead.clinicName,
                slug: slug,
                planId: lead.planInterest,
                legalName: lead.legalName,
                cnpj: lead.cnpj,
                email: lead.email,
                phone: lead.phone,
                address: lead.address,
                number: lead.number,
                complement: lead.complement,
                neighborhood: lead.neighborhood,
                city: lead.city,
                state: lead.state,
                zipCode: lead.zipCode
            });

            if (!organization) {
                throw new Error('Failed to create organization');
            }

            console.log('✅ [Onboarding] Organization created:', organization.id);

            // 3. Generate temporary password
            const temporaryPassword = this.generateTemporaryPassword();
            console.log('🔑 [Onboarding] Temporary password generated');

            // 4. Create Admin User in Supabase Auth
            const adminUser = await this.createAdminUser({
                email: lead.email,
                name: lead.name,
                phone: lead.phone,
                organizationId: organization.id
            }, temporaryPassword);

            if (!adminUser) {
                // Rollback organization
                await this.rollbackOrganization(organization.id);
                throw new Error('Failed to create admin user');
            }

            console.log('✅ [Onboarding] Admin user created:', adminUser.id);

            // 5. Create Default Unit
            const unit = await this.createDefaultUnit({
                organizationId: organization.id,
                name: lead.clinicName,
                address: lead.address,
                number: lead.number,
                complement: lead.complement,
                neighborhood: lead.neighborhood,
                city: lead.city,
                state: lead.state,
                zipCode: lead.zipCode,
                phone: lead.phone,
                email: lead.email
            });

            if (!unit) {
                // Rollback
                await this.rollbackAdminUser(adminUser.id);
                await this.rollbackOrganization(organization.id);
                throw new Error('Failed to create default unit');
            }

            console.log('✅ [Onboarding] Default unit created:', unit.id);

            // 6. Generate access URL
            const accessUrl = this.generateAccessUrl(slug);
            console.log('🔗 [Onboarding] Access URL:', accessUrl);

            // 7. Send welcome email (mock for now)
            await this.sendWelcomeEmail({
                to: lead.email,
                name: lead.name,
                organizationName: lead.clinicName,
                accessUrl: accessUrl,
                temporaryPassword: temporaryPassword
            });

            console.log('✅ [Onboarding] Welcome email sent (mock)');

            // 8. Return success
            return {
                success: true,
                organization: {
                    id: organization.id,
                    name: organization.name,
                    slug: organization.slug
                },
                adminUser: {
                    id: adminUser.id,
                    email: adminUser.email,
                    temporaryPassword: temporaryPassword
                },
                unit: {
                    id: unit.id,
                    name: unit.name
                },
                accessUrl: accessUrl
            };

        } catch (error: any) {
            console.error('❌ [Onboarding] Error:', error);
            return {
                success: false,
                error: error.message || 'Unknown error during onboarding'
            };
        }
    }

    /**
     * Create organization in database
     */
    private async createOrganization(data: CreateOrganizationData) {
        try {
            const now = new Date().toISOString();
            const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 days trial

            const { data: org, error } = await supabase
                .from('organizations')
                .insert({
                    id: `org_${data.slug}`,
                    name: data.name,
                    slug: data.slug,
                    type: 'clinic',
                    subscription_status: 'trial',
                    subscription_plan_id: data.planId,
                    legal_name: data.legalName,
                    cnpj: data.cnpj,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    number: data.number,
                    complement: data.complement,
                    neighborhood: data.neighborhood,
                    city: data.city,
                    state: data.state,
                    zip_code: data.zipCode,
                    trial_started_at: now,
                    trial_ends_at: trialEndsAt,
                    billing_email: data.email,
                    payment_method: null,
                    recurrence: 'monthly'
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating organization:', error);
                return null;
            }

            return org as any;
        } catch (error) {
            console.error('Exception creating organization:', error);
            return null;
        }
    }

    /**
     * Create admin user in Supabase Auth and profiles table
     */
    private async createAdminUser(data: CreateAdminUserData, password: string) {
        try {
            // Note: This requires admin privileges
            // In production, this should be called via a secure Edge Function
            // For now, we'll create the profile directly and assume auth user exists

            // TODO: Implement proper user creation via Supabase Admin API
            // This is a placeholder - actual implementation needs service role key

            console.warn('⚠️ [Onboarding] Admin user creation requires service role - using mock for now');

            // Mock user creation
            const mockUserId = crypto.randomUUID();

            // Create profile
            const { data: profile, error } = await supabase
                .from('profiles')
                .insert({
                    id: mockUserId,
                    organization_id: data.organizationId,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: 'admin',
                    status: 'active'
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating profile:', error);
                return null;
            }

            return {
                id: mockUserId,
                email: data.email
            };
        } catch (error) {
            console.error('Exception creating admin user:', error);
            return null;
        }
    }

    /**
     * Create default unit for organization
     */
    private async createDefaultUnit(data: CreateUnitData) {
        try {
            const { data: unit, error } = await supabase
                .from('units')
                .insert({
                    organization_id: data.organizationId,
                    name: data.name,
                    slug: 'matriz',
                    type: 'main',
                    address: data.address,
                    number: data.number,
                    complement: data.complement,
                    neighborhood: data.neighborhood,
                    city: data.city,
                    state: data.state,
                    zip_code: data.zipCode,
                    phone: data.phone,
                    email: data.email,
                    status: 'active'
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating unit:', error);
                return null;
            }

            return unit as any;
        } catch (error) {
            console.error('Exception creating unit:', error);
            return null;
        }
    }

    /**
     * Generate a URL-safe slug from clinic name
     */
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    /**
     * Generate a secure temporary password
     */
    private generateTemporaryPassword(): string {
        const length = 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';

        // Ensure at least one of each type
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
        password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
        password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
        password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special

        // Fill the rest
        for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }

        // Shuffle
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    /**
     * Generate access URL for organization
     */
    private generateAccessUrl(slug: string): string {
        const baseUrl = window.location.origin;
        return `${baseUrl}/${slug}#/login`;
    }

    /**
     * Send welcome email to new admin
     * TODO: Implement actual email sending
     */
    private async sendWelcomeEmail(data: {
        to: string;
        name: string;
        organizationName: string;
        accessUrl: string;
        temporaryPassword: string;
    }): Promise<void> {
        // Mock implementation
        console.log('📧 [Onboarding] Welcome email (MOCK):', {
            to: data.to,
            subject: `Bem-vindo ao I'mDoc - ${data.organizationName}`,
            body: `
Olá ${data.name}!

Sua conta no I'mDoc foi criada com sucesso! 🎉

Organização: ${data.organizationName}
Acesso: ${data.accessUrl}

Credenciais de Acesso:
Email: ${data.to}
Senha Temporária: ${data.temporaryPassword}

⚠️ IMPORTANTE: Altere sua senha no primeiro acesso!

Equipe I'mDoc
            `.trim()
        });

        // TODO: Integrate with email service (SendGrid, AWS SES, etc)
        // await emailService.send({...});
    }

    /**
     * Rollback organization creation
     */
    private async rollbackOrganization(organizationId: string): Promise<void> {
        try {
            await supabase
                .from('organizations')
                .delete()
                .eq('id', organizationId);
            console.log('🔄 [Onboarding] Rolled back organization:', organizationId);
        } catch (error) {
            console.error('Error rolling back organization:', error);
        }
    }

    /**
     * Rollback admin user creation
     */
    private async rollbackAdminUser(userId: string): Promise<void> {
        try {
            await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);
            console.log('🔄 [Onboarding] Rolled back admin user:', userId);
        } catch (error) {
            console.error('Error rolling back admin user:', error);
        }
    }
}

// Export singleton instance
export const onboardingService = new OnboardingService();
