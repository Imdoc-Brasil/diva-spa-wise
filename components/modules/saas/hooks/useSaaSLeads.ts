import { useCallback } from 'react';
import { useData } from '../../../../context/DataContext';
import { useToast } from '../../../../ui/ToastContext';
import { SaaSLead, SaaSLeadStage } from '@/types';
import { supabase } from '../../../../../services/supabase';
import { automationService } from '../../../../../services/saas/AutomationService';

/**
 * Custom hook for managing SaaS leads
 * Centralizes all lead-related operations
 */
export function useSaaSLeads() {
    const { saasLeads, addSaaSLead, updateSaaSLead } = useData();
    const { addToast } = useToast();

    /**
     * Move lead to a different stage
     */
    const moveLead = useCallback(async (id: string, newStage: SaaSLeadStage) => {
        try {
            await updateSaaSLead(id, { stage: newStage });
            addToast(`Lead movido para ${newStage}`, 'success');
        } catch (error) {
            console.error('Error moving lead:', error);
            addToast('Erro ao mover lead', 'error');
        }
    }, [updateSaaSLead, addToast]);

    /**
     * Create a new lead
     */
    const createLead = useCallback(async (leadData: Partial<SaaSLead>) => {
        try {
            const success = await addSaaSLead(leadData as SaaSLead);

            if (success) {
                addToast('Lead criado com sucesso!', 'success');

                // Trigger automation if lead has calculator metadata
                if (leadData.metadata?.calculator) {
                    try {
                        await automationService.processConversion({
                            leadId: leadData.id || '',
                            source: 'calculator',
                            metadata: leadData.metadata
                        });
                    } catch (error) {
                        console.error('Automation error:', error);
                    }
                }

                return true;
            }

            return false;
        } catch (error) {
            console.error('Error creating lead:', error);
            addToast('Erro ao criar lead', 'error');
            return false;
        }
    }, [addSaaSLead, addToast]);

    /**
     * Convert lead to subscriber
     */
    const convertToSubscriber = useCallback(async (lead: SaaSLead) => {
        try {
            addToast('Convertendo lead em assinante...', 'info');

            // Generate slug from clinic name
            const slug = lead.clinicName
                .toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, '-');

            // Create organization in Supabase
            const { data: orgData, error: orgError } = await supabase
                .from('organizations')
                .insert({
                    name: lead.clinicName,
                    slug: slug,
                    type: 'clinic',
                    subscription_status: 'trial',
                    subscription_plan_id: lead.planInterest,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (orgError) throw orgError;
            if (!orgData) throw new Error('Failed to create organization');

            // Update lead stage
            await updateSaaSLead(lead.id, {
                stage: SaaSLeadStage.TRIAL_STARTED,
                notes: `${lead.notes || ''}\n\n[${new Date().toLocaleDateString()}] Convertido em assinante. Org ID: ${(orgData as any).id}`
            });

            addToast('Lead convertido com sucesso!', 'success');

            // Reload to show in subscriber list
            setTimeout(() => window.location.reload(), 1500);

            return true;
        } catch (error) {
            console.error('Error converting lead:', error);
            addToast('Erro ao converter lead', 'error');
            return false;
        }
    }, [updateSaaSLead, addToast]);

    /**
     * Archive a lead
     */
    const archiveLead = useCallback(async (id: string) => {
        try {
            await updateSaaSLead(id, { status: 'archived' });
            addToast('Lead arquivado', 'success');
        } catch (error) {
            console.error('Error archiving lead:', error);
            addToast('Erro ao arquivar lead', 'error');
        }
    }, [updateSaaSLead, addToast]);

    return {
        leads: saasLeads || [],
        moveLead,
        createLead,
        convertToSubscriber,
        archiveLead
    };
}
