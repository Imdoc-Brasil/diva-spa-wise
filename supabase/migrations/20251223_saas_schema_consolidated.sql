-- ============================================
-- CONSOLIDATED SAAS SCHEMA
-- Created: 2025-12-22
-- Purpose: Unified schema for all SaaS tables
-- ============================================

-- This migration consolidates all SaaS-related tables
-- Execute this AFTER core schema is in place

-- ============================================
-- 1. SAAS LEADS (Sales Pipeline)
-- ============================================

CREATE TABLE IF NOT EXISTS saas_leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    legal_name TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'New',
    plan_interest TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    notes TEXT,
    estimated_value NUMERIC,
    next_action TEXT,
    
    -- Address fields
    cnpj TEXT,
    zip_code TEXT,
    address TEXT,
    number TEXT,
    complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    
    -- Payment fields
    payment_method TEXT,
    recurrence TEXT,
    trial_start_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    tags TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb,
    attachments TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saas_leads_stage ON saas_leads(stage);
CREATE INDEX IF NOT EXISTS idx_saas_leads_status ON saas_leads(status);
CREATE INDEX IF NOT EXISTS idx_saas_leads_email ON saas_leads(email);
CREATE INDEX IF NOT EXISTS idx_saas_leads_created_at ON saas_leads(created_at DESC);

-- RLS
ALTER TABLE saas_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for saas_leads" ON saas_leads FOR ALL USING (true);

-- ============================================
-- 2. SAAS TASKS (Linked to Leads)
-- ============================================

CREATE TABLE IF NOT EXISTS saas_tasks (
    id TEXT PRIMARY KEY,
    lead_id TEXT REFERENCES saas_leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saas_tasks_lead_id ON saas_tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_saas_tasks_due_date ON saas_tasks(due_date);

ALTER TABLE saas_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for saas_tasks" ON saas_tasks FOR ALL USING (true);

-- ============================================
-- 3. SAAS PLANS (Subscription Tiers)
-- ============================================

CREATE TABLE IF NOT EXISTS saas_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT NOT NULL,
    monthly_price NUMERIC NOT NULL,
    yearly_price NUMERIC NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    limits JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE saas_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for saas_plans" ON saas_plans FOR ALL USING (true);

-- ============================================
-- 4. IMPLEMENTATION PROJECTS (Onboarding)
-- ============================================

CREATE TABLE IF NOT EXISTS saas_implementation_projects (
    id TEXT PRIMARY KEY,
    subscriber_id TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    stage TEXT NOT NULL,
    status TEXT DEFAULT 'on_track',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    deadline_date TIMESTAMP WITH TIME ZONE NOT NULL,
    modules_checked JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    tasks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_impl_projects_subscriber ON saas_implementation_projects(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_impl_projects_stage ON saas_implementation_projects(stage);

ALTER TABLE saas_implementation_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for impl_projects" ON saas_implementation_projects FOR ALL USING (true);

-- ============================================
-- 5. SUPPORT TICKETS
-- ============================================

CREATE TABLE IF NOT EXISTS saas_support_tickets (
    id TEXT PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    subscriber_id TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open',
    ai_summary TEXT,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_subscriber ON saas_support_tickets(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON saas_support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON saas_support_tickets(created_at DESC);

ALTER TABLE saas_support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for support_tickets" ON saas_support_tickets FOR ALL USING (true);

-- ============================================
-- 6. FEATURE REQUESTS
-- ============================================

CREATE TABLE IF NOT EXISTS saas_feature_requests (
    id TEXT PRIMARY KEY,
    subscriber_id TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    module TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    impact TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    shipped_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON saas_feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_feature_requests_votes ON saas_feature_requests(votes DESC);

ALTER TABLE saas_feature_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for feature_requests" ON saas_feature_requests FOR ALL USING (true);

-- ============================================
-- 7. BLOG POSTS (Content Marketing)
-- ============================================

CREATE TABLE IF NOT EXISTS saas_posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    tags TEXT[],
    seo_title TEXT,
    seo_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_saas_posts_slug ON saas_posts(slug);
CREATE INDEX IF NOT EXISTS idx_saas_posts_status ON saas_posts(status);
CREATE INDEX IF NOT EXISTS idx_saas_posts_published ON saas_posts(published_at DESC);

ALTER TABLE saas_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for saas_posts" ON saas_posts FOR SELECT USING (status = 'published' OR true);
CREATE POLICY "Enable all for saas_posts" ON saas_posts FOR ALL USING (true);

-- ============================================
-- SEED DATA - Default Plans
-- ============================================

INSERT INTO saas_plans (id, name, tier, monthly_price, yearly_price, features, limits)
VALUES 
    ('start', 'Start', 'starter', 197.00, 1985.00, 
     '["Até 2 profissionais", "Agenda digital", "CRM básico", "Financeiro simplificado"]'::jsonb,
     '{"maxUsers": 2, "maxClients": 500, "maxStorage": 5}'::jsonb),
    
    ('growth', 'Growth', 'professional', 497.00, 4970.00,
     '["Até 10 profissionais", "Marketing automation", "Relatórios avançados", "Integrações ilimitadas"]'::jsonb,
     '{"maxUsers": 10, "maxClients": 2000, "maxStorage": 20}'::jsonb),
    
    ('experts', 'Experts', 'professional', 897.00, 8970.00,
     '["Profissionais ilimitados", "IA avançada", "White label", "Suporte prioritário"]'::jsonb,
     '{"maxUsers": -1, "maxClients": -1, "maxStorage": 100}'::jsonb),
    
    ('empire', 'Empire', 'enterprise', 0, 0,
     '["Multi-unidades ilimitadas", "Customização total", "Gerente de conta dedicado", "SLA garantido"]'::jsonb,
     '{"maxUsers": -1, "maxClients": -1, "maxStorage": -1}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE saas_leads IS 'Sales pipeline - potential customers';
COMMENT ON TABLE saas_tasks IS 'Tasks linked to leads for follow-up';
COMMENT ON TABLE saas_plans IS 'Subscription plan definitions';
COMMENT ON TABLE saas_implementation_projects IS 'Customer onboarding projects';
COMMENT ON TABLE saas_support_tickets IS 'Customer support tickets';
COMMENT ON TABLE saas_feature_requests IS 'Product feature requests from customers';
COMMENT ON TABLE saas_posts IS 'Blog posts for content marketing';
