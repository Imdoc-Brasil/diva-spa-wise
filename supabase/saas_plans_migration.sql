-- Create saas_plans table
CREATE TABLE IF NOT EXISTS public.saas_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE, -- 'start', 'growth', 'experts', 'empire'
    name TEXT NOT NULL,
    monthly_price NUMERIC(10, 2) DEFAULT 0,
    yearly_price NUMERIC(10, 2) DEFAULT 0,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb, -- Array of strings
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.saas_plans ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public plans are viewable by everyone" ON public.saas_plans
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert plans" ON public.saas_plans
    FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.email() = 'admin@diva.com'); -- Simplificado, ideal usar role check

CREATE POLICY "Admins can update plans" ON public.saas_plans
    FOR UPDATE USING (auth.role() = 'service_role' OR auth.email() = 'admin@diva.com');

-- Seed Data
INSERT INTO public.saas_plans (key, name, monthly_price, yearly_price, description, features, is_popular)
VALUES
    (
        'start',
        'I''mdoc Start',
        197.00,
        1985.00,
        'Gestão essencial para consultórios e clínicas individuais.',
        '["Agenda Inteligente", "Prontuário Eletrônico", "Lembretes WhatsApp", "App do Paciente (Básico)"]'::jsonb,
        false
    ),
    (
        'growth',
        'I''mdoc Growth',
        497.00,
        4950.00,
        'Automação total para clínicas em crescimento acelerado.',
        '["Tudo do Start +", "Marketing Automático (Régua)", "Diva AI (Chatbot)", "Financeiro Completo (DRE)", "Clube de Pontos"]'::jsonb,
        true
    ),
    (
        'experts',
        'I''mdoc Experts',
        897.00,
        9687.00,
        'Alta performance e gestão avançada para especialistas.',
        '["Tudo do Growth +", "Gestão de Múltiplos Profissionais", "Dashboard de BI Avançado", "Gerente de Contas Dedicado", "Consultoria Trimestral"]'::jsonb,
        false
    ),
    (
        'empire',
        'I''mdoc Empire',
        0.00,
        0.00,
        'Para grandes redes, franquias e hospitais.',
        '["Infraestrutura Dedicada", "API Aberta & Webhooks", "App White Label Próprio", "SLA de Atendimento", "Treinamento In-loco"]'::jsonb,
        false
    )
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    monthly_price = EXCLUDED.monthly_price,
    yearly_price = EXCLUDED.yearly_price,
    description = EXCLUDED.description,
    features = EXCLUDED.features;
