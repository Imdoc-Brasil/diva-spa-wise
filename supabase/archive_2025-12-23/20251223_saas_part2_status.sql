-- ============================================
-- PARTE 2: ADICIONAR COLUNA STATUS
-- Execute esta parte DEPOIS da Parte 1
-- ============================================

-- Adicionar coluna status à tabela saas_implementation_projects
ALTER TABLE saas_implementation_projects 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'on_track';

-- Criar index na coluna status
CREATE INDEX IF NOT EXISTS idx_impl_projects_status 
ON saas_implementation_projects(status);

-- Verificar resultado
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'saas_implementation_projects'
ORDER BY ordinal_position;
