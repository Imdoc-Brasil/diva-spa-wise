-- ==============================================================================
-- ATIVAÇÃO DE SEGURANÇA MÁXIMA (RLS)
-- ==============================================================================

-- 1. Ativar RLS nas tabelas críticas
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 2. Recriar Função Helper (Mais Robusta)
CREATE OR REPLACE FUNCTION get_auth_org_id()
RETURNS uuid
LANGUAGE sql 
STABLE
SECURITY DEFINER -- Roda como admin para garantir leitura correta do profile
SET search_path = public
AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
$$;

-- 3. Políticas para ORGANIZATIONS
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (id = get_auth_org_id());

DROP POLICY IF EXISTS "Users can update own organization" ON organizations;
CREATE POLICY "Users can update own organization" ON organizations
  FOR UPDATE USING (id = get_auth_org_id());

-- 4. Políticas para PROFILES (Ajustado para ver colegas de trabalho)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
-- Nova Regra: Posso ver meu perfil OU perfis da minha organização
CREATE POLICY "Users can view org members" ON profiles
  FOR SELECT USING (
    auth.uid() = id -- Eu mesmo
    OR 
    organization_id = get_auth_org_id() -- Meus colegas
  );

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. Políticas para CLIENTS (Já eram boas, apenas garantindo)
DROP POLICY IF EXISTS "Users can view org clients" ON clients;
CREATE POLICY "Users can view org clients" ON clients
  FOR SELECT USING (organization_id = get_auth_org_id());

DROP POLICY IF EXISTS "Users can insert org clients" ON clients;
CREATE POLICY "Users can insert org clients" ON clients
  FOR INSERT WITH CHECK (organization_id = get_auth_org_id());

DROP POLICY IF EXISTS "Users can update org clients" ON clients;
CREATE POLICY "Users can update org clients" ON clients
  FOR UPDATE USING (organization_id = get_auth_org_id());

DROP POLICY IF EXISTS "Users can delete org clients" ON clients;
CREATE POLICY "Users can delete org clients" ON clients
  FOR DELETE USING (organization_id = get_auth_org_id());

-- Confirmação
SELECT 'Segurança Ativada com Sucesso' as status;
