-- ============================================
-- FIX ORGANIZATIONS TABLE SCHEMA
-- Adiciona colunas que faltam para conversão de leads
-- ============================================

-- Verificar schema atual
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'organizations'
ORDER BY ordinal_position;

-- Adicionar colunas que podem estar faltando
DO $$ 
BEGIN
    -- Adicionar coluna 'type' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizations' AND column_name = 'type'
    ) THEN
        ALTER TABLE organizations ADD COLUMN type TEXT DEFAULT 'clinic';
    END IF;

    -- Adicionar coluna 'subscription_plan_id' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizations' AND column_name = 'subscription_plan_id'
    ) THEN
        ALTER TABLE organizations ADD COLUMN subscription_plan_id TEXT;
    END IF;

    -- Garantir que 'id' é TEXT (não UUID)
    -- Se for UUID, precisaria de migração mais complexa
    
END $$;

-- Verificar resultado
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'organizations'
ORDER BY ordinal_position;
