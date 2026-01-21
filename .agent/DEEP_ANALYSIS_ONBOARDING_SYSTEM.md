# 🔍 ANÁLISE PROFUNDA - SISTEMA DE ONBOARDING

**Data:** 2025-12-23 19:05  
**Fase:** Análise Completa (Opção C)  
**Status:** 📊 EM ANDAMENTO

---

## 📋 OBJETIVO DA ANÁLISE

Entender completamente como o sistema funciona antes de implementar qualquer mudança na conversão de leads para assinantes.

---

## 🏗️ ARQUITETURA ATUAL

### 1. SISTEMA DE AUTENTICAÇÃO

#### Fluxo de Login:
```
1. Usuário acessa URL com slug: /clinica-teste#/login
2. LoginPage detecta slug via useParams()
3. Usuário seleciona perfil (Admin, Staff, etc)
4. Faz login com email/senha
5. Supabase Auth autentica
6. Profile carregado do banco
7. Organization detectada via OrganizationContext
8. Redirecionado para dashboard
```

#### Detecção de Organização (OrganizationContext.tsx):
```typescript
// Método 1: Subdomain (NÃO FUNCIONA - requer DNS)
const hostname = window.location.hostname;
// Ex: clinica-teste.imdoc.com.br

// Método 2: Path Slug (NÃO IMPLEMENTADO)
// Ex: /clinica-teste#/login

// Método 3: LocalStorage (FALLBACK)
const storedOrgId = localStorage.getItem('currentOrganizationId');

// Método 4: Profile do Usuário (ATUAL)
const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();
```

**PROBLEMA IDENTIFICADO:**
- Sistema espera subdomínio, mas não está configurado
- Não detecta slug no path
- Depende de `organization_id` no profile do usuário
- **Quando lead é convertido, nenhum usuário é criado!**

---

### 2. ESTRUTURA DO BANCO DE DADOS

#### Tabela: `organizations`
```sql
CREATE TABLE organizations (
    id TEXT PRIMARY KEY,              -- Ex: org_clinica-teste
    name TEXT NOT NULL,               -- Ex: Clínica Teste
    slug TEXT UNIQUE NOT NULL,        -- Ex: clinica-teste
    type TEXT DEFAULT 'clinic',       -- clinic, franchise, etc
    subscription_status TEXT DEFAULT 'trial',
    subscription_plan_id TEXT,        -- start, growth, empire
    owner_id UUID,                    -- FK para auth.users
    asaas_customer_id TEXT,
    asaas_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**CAMPOS FALTANDO:**
- ❌ `legal_name` (razão social)
- ❌ `cnpj`
- ❌ `email`
- ❌ `phone`
- ❌ `address`, `number`, `complement`
- ❌ `neighborhood`, `city`, `state`, `zip_code`

#### Tabela: `profiles`
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users,
    organization_id TEXT REFERENCES organizations(id),
    name TEXT,
    email TEXT,
    role TEXT,
    -- outros campos
);
```

#### Tabela: `units` (NÃO EXISTE!)
**PROBLEMA:** Sistema espera unidades, mas não há tabela!

#### Tabela: `saas_leads`
```sql
CREATE TABLE saas_leads (
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
    cnpj TEXT,
    zip_code TEXT,
    address TEXT,
    number TEXT,
    complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    -- outros campos
);
```

---

### 3. FLUXO ATUAL DE CONVERSÃO (BUGADO)

#### Código Atual (SaaSCrmModule.tsx:347-385):
```typescript
const handleConvertToSubscriber = async (lead: SaaSLead) => {
    try {
        const slug = lead.clinicName.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

        // 1. Cria Organization (INCOMPLETA)
        const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .insert({
                id: `org_${slug}`,
                name: lead.clinicName,
                slug: slug,
                type: 'clinic',
                subscription_status: 'trial',
                subscription_plan_id: lead.planInterest || 'start'
            } as any)
            .select()
            .single();

        if (orgError) throw orgError;

        // 2. Atualiza Lead
        await updateSaaSLead(lead.id, {
            stage: SaaSLeadStage.TRIAL_STARTED,
            status: 'active',
            notes: lead.notes + `\n[System] Converted to Organization: ${orgData.name} (${orgData.id})`
        });

        addToast(`Lead convertido em Assinante (Trial): ${lead.clinicName}`, 'success');

        // 3. RELOAD (CAUSA REDIRECT!)
        setTimeout(() => window.location.reload(), 1500);

    } catch (error: any) {
        console.error('Conversion Failed:', error);
        addToast(`Erro ao converter: ${error.message}`, 'error');
    }
};
```

**O QUE ESTÁ FALTANDO:**
1. ❌ Criar usuário admin
2. ❌ Criar profile do usuário
3. ❌ Criar unidade padrão
4. ❌ Copiar dados do lead para organization
5. ❌ Gerar senha temporária
6. ❌ Enviar email de boas-vindas
7. ❌ Configurar RLS para isolamento

---

### 4. SISTEMA DE RLS (ROW LEVEL SECURITY)

#### Política Atual (PERMISSIVA DEMAIS):
```sql
CREATE POLICY "Enable all access for organizations" 
ON organizations 
FOR ALL 
USING (true);
```

**PROBLEMA:** Permite acesso a TODAS as organizações!

#### Política Correta (DEVE SER):
```sql
-- Usuários só veem sua organização
CREATE POLICY "Users can only see their organization"
ON organizations
FOR SELECT
USING (
    id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);

-- Usuários só podem atualizar sua organização
CREATE POLICY "Users can only update their organization"
ON organizations
FOR UPDATE
USING (
    id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);
```

---

### 5. SISTEMA DE UNIDADES

#### Código Esperado (SettingsModule.tsx):
```typescript
// Pede para selecionar unidade
if (!selectedUnit) {
    return <div>Selecione uma Unidade</div>;
}
```

**PROBLEMA:** 
- Tabela `units` não existe
- Unidade não é criada automaticamente
- Sistema espera pelo menos 1 unidade

#### Estrutura Esperada:
```sql
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT REFERENCES organizations(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'main', -- main, branch, franchise
    address TEXT,
    number TEXT,
    complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);
```

---

## 🎯 DESCOBERTAS CRÍTICAS

### 1. URL DE ACESSO

**URL Gerada (ERRADA):**
```
https://cl-nica-teste-de-slug.imdoc.com.br/
```
- Usa subdomínio
- Requer configuração de DNS
- Não funciona

**URL Correta (DEVE SER):**
```
https://www.imdoc.com.br/clinica-teste-de-slug#/login
```
- Usa path slug
- Funciona sem DNS
- Já implementado no App.tsx (linha 563)

**CÓDIGO EXISTENTE:**
```typescript
// App.tsx:563
<Route path="/:orgSlug" element={<LoginPage onLogin={login} />} />
```

**MAS:** OrganizationContext não detecta slug no path!

---

### 2. ISOLAMENTO DE DADOS

**Por que vê outras organizações:**
1. RLS está com política permissiva (`USING (true)`)
2. Não há filtro por `organization_id`
3. Usuário não tem `organization_id` no profile
4. LocalStorage pode ter org antiga

**SOLUÇÃO:**
1. Criar políticas RLS corretas
2. Sempre filtrar por `organization_id`
3. Criar profile com `organization_id` correto
4. Limpar localStorage ao criar nova org

---

### 3. REDIRECT PARA PÁGINA DE VENDAS

**Causa Raiz:**
```typescript
// SaaSCrmModule.tsx:379
setTimeout(() => window.location.reload(), 1500);
```

**Por que redireciona para vendas:**
1. `window.location.reload()` recarrega página
2. Usuário não está logado (nenhum user criado!)
3. App.tsx detecta `!user`
4. Redireciona para `/` (SalesPage)

**CÓDIGO:**
```typescript
// App.tsx:561
{user ? (
    // ... rotas autenticadas
) : (
    <>
        <Route path="/" element={<SalesPage />} />
        <Route path="/login" element={<LoginPage onLogin={login} />} />
    </>
)}
```

---

## 💡 SOLUÇÕES IDENTIFICADAS

### Solução 1: Criar Função Completa de Onboarding

```typescript
async function createCompleteSubscriber(lead: SaaSLead) {
    const slug = generateSlug(lead.clinicName);
    
    // 1. Criar Organization (COMPLETA)
    const org = await createOrganization({
        id: `org_${slug}`,
        name: lead.clinicName,
        slug: slug,
        type: 'clinic',
        subscription_status: 'trial',
        subscription_plan_id: lead.planInterest,
        // Dados do lead
        legal_name: lead.legalName,
        cnpj: lead.cnpj,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
        number: lead.number,
        complement: lead.complement,
        neighborhood: lead.neighborhood,
        city: lead.city,
        state: lead.state,
        zip_code: lead.zipCode
    });

    // 2. Criar Usuário Admin no Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: lead.email,
        password: generateTemporaryPassword(),
        email_confirm: true,
        user_metadata: {
            name: lead.name,
            organization_id: org.id,
            role: 'admin'
        }
    });

    // 3. Criar Profile
    await supabase.from('profiles').insert({
        id: authUser.user.id,
        organization_id: org.id,
        name: lead.name,
        email: lead.email,
        role: 'admin',
        phone: lead.phone
    });

    // 4. Criar Unidade Padrão
    await supabase.from('units').insert({
        organization_id: org.id,
        name: lead.clinicName,
        slug: 'matriz',
        type: 'main',
        address: lead.address,
        number: lead.number,
        complement: lead.complement,
        neighborhood: lead.neighborhood,
        city: lead.city,
        state: lead.state,
        zip_code: lead.zipCode,
        phone: lead.phone,
        email: lead.email,
        status: 'active'
    });

    // 5. Enviar Email de Boas-Vindas
    await sendWelcomeEmail({
        to: lead.email,
        name: lead.name,
        organization: lead.clinicName,
        url: `https://www.imdoc.com.br/${slug}#/login`,
        temporaryPassword: temporaryPassword
    });

    // 6. Atualizar Lead
    await updateSaaSLead(lead.id, {
        stage: SaaSLeadStage.TRIAL_STARTED,
        status: 'active',
        notes: lead.notes + `\n[System] Converted to Organization: ${org.name} (${org.id})`
    });

    return { org, authUser };
}
```

---

### Solução 2: Corrigir Detecção de Organização

**Adicionar detecção por path slug:**
```typescript
// OrganizationContext.tsx
useEffect(() => {
    const detectOrganization = () => {
        // Método 1: Path Slug (NOVO!)
        const path = window.location.pathname;
        const match = path.match(/^\/([^\/]+)/);
        if (match && match[1] !== 'login' && match[1] !== 'master') {
            const org = findOrgBySlug(match[1]);
            if (org) { 
                setOrganization(org); 
                setIsLoading(false); 
                return; 
            }
        }

        // Método 2: Subdomain
        // ... código existente

        // Método 3: LocalStorage
        // ... código existente
    };

    detectOrganization();
}, [userOrganizations]);
```

---

### Solução 3: Implementar RLS Correto

```sql
-- Remover política permissiva
DROP POLICY IF EXISTS "Enable all access for organizations" ON organizations;

-- Criar políticas corretas
CREATE POLICY "Users can only see their organization"
ON organizations
FOR SELECT
USING (
    id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Users can only update their organization"
ON organizations
FOR UPDATE
USING (
    id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);

-- Aplicar para todas as tabelas
-- units, clients, appointments, etc
```

---

### Solução 4: Criar Tabela de Unidades

```sql
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'main',
    address TEXT,
    number TEXT,
    complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

-- Enable RLS
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only see units from their organization"
ON units
FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);
```

---

### Solução 5: Remover window.location.reload()

```typescript
// ANTES:
setTimeout(() => window.location.reload(), 1500);

// DEPOIS:
// Atualizar estado local
await fetchSubscribers();
setClosingLead(null);
setViewLead(null);
// Mudar aba para "Gestão de Assinantes"
setActivePipeline('subscribers');
```

---

## 📊 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Preparação do Banco de Dados
- [ ] Adicionar campos faltantes em `organizations`
- [ ] Criar tabela `units`
- [ ] Implementar RLS correto
- [ ] Testar políticas

### Fase 2: Criar Serviço de Onboarding
- [ ] Criar `OnboardingService.ts`
- [ ] Implementar `createCompleteSubscriber()`
- [ ] Implementar `generateTemporaryPassword()`
- [ ] Implementar `sendWelcomeEmail()`

### Fase 3: Atualizar Conversão de Leads
- [ ] Refatorar `handleConvertToSubscriber()`
- [ ] Usar `OnboardingService`
- [ ] Remover `window.location.reload()`
- [ ] Atualizar estado local

### Fase 4: Corrigir Detecção de Organização
- [ ] Adicionar detecção por path slug
- [ ] Testar com diferentes URLs
- [ ] Garantir isolamento

### Fase 5: Testes
- [ ] Criar lead
- [ ] Converter em assinante
- [ ] Verificar organização criada
- [ ] Verificar unidade criada
- [ ] Verificar usuário criado
- [ ] Fazer login
- [ ] Verificar isolamento
- [ ] Verificar configurações

---

## ⏱️ ESTIMATIVA DE TEMPO

| Fase | Tempo | Complexidade |
|------|-------|--------------|
| 1. Banco de Dados | 30 min | Média |
| 2. Onboarding Service | 45 min | Alta |
| 3. Conversão de Leads | 20 min | Baixa |
| 4. Detecção de Org | 15 min | Média |
| 5. Testes | 30 min | Média |
| **TOTAL** | **2h20min** | **Alta** |

---

## 🎯 PRÓXIMA DECISÃO

**Aguardando aprovação do usuário para:**
1. Implementar soluções propostas
2. Criar migrations do banco
3. Criar OnboardingService
4. Testar fluxo completo

---

**Status:** ✅ ANÁLISE COMPLETA  
**Próximo Passo:** Aguardando decisão do usuário

---

**Última Atualização:** 2025-12-23 19:10
