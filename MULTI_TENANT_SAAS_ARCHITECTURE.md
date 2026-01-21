# 🏢 Arquitetura Multi-Tenant SaaS - Diva Spa OS

## 🎯 Objetivo

Transformar o Diva Spa OS em uma **plataforma SaaS escalável** que permite:
- Múltiplos clientes (médicos, clínicas, grupos) usando a mesma infraestrutura
- Isolamento total de dados entre organizações
- Personalização por organização
- Cobrança baseada em assinatura
- Escalabilidade ilimitada

---

## 📊 Modelo de Negócio Proposto

### **Públicos-Alvo**

#### **1. Médico Individual** 👨‍⚕️
```
Perfil: Dermatologista ou Cirurgião Plástico
Necessidade: Gerenciar pacientes em consultório próprio
Unidades: 1 consultório
Usuários: 1-5 (médico + assistentes)
```

#### **2. Clínica Pequena** 🏥
```
Perfil: Clínica de estética com 2-3 profissionais
Necessidade: Gestão de agenda, pacientes e estoque
Unidades: 1 clínica
Usuários: 5-15 (médicos + equipe)
```

#### **3. Grupo de Clínicas** 🏢
```
Perfil: Rede com múltiplas unidades
Necessidade: Gestão centralizada + visão por unidade
Unidades: 3-20+ unidades
Usuários: 20-200+ (multi-unidades)
```

#### **4. Franquia** 🌐
```
Perfil: Rede de franquias
Necessidade: Gestão corporativa + autonomia das unidades
Unidades: 10-100+ franquias
Usuários: 50-1000+
```

---

## 🏗️ Arquitetura Multi-Tenant

### **Modelo: Hybrid Multi-Tenant**

```
┌─────────────────────────────────────────────────────────┐
│                    DIVA SPA OS (SaaS)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Organization │  │ Organization │  │ Organization │ │
│  │      1       │  │      2       │  │      3       │ │
│  │              │  │              │  │              │ │
│  │ Dr. Silva    │  │ Clínica Diva │  │ Grupo Beauty │ │
│  │ (1 unidade)  │  │ (1 unidade)  │  │ (5 unidades) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              Shared Infrastructure                      │
│  - Database (isolado por organizationId)                │
│  - Storage (isolado por organizationId)                 │
│  - Authentication (multi-org)                           │
│  - APIs (tenant-aware)                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Estrutura de Dados

### **1. Nova Entidade: Organization**

```typescript
export interface Organization {
    // Identificação
    id: string; // org_abc123
    slug: string; // dr-silva-dermatologia (URL: app.divaspa.com/dr-silva-dermatologia)
    
    // Informações Básicas
    name: string; // "Dr. Silva Dermatologia"
    displayName: string; // Nome exibido no sistema
    logo?: string; // URL do logo
    primaryColor?: string; // Cor primária da marca
    
    // Tipo de Organização
    type: 'individual' | 'clinic' | 'group' | 'franchise';
    
    // Plano e Assinatura
    subscriptionPlan: SubscriptionPlan;
    subscriptionStatus: 'trial' | 'active' | 'suspended' | 'cancelled';
    trialEndsAt?: string;
    billingCycle: 'monthly' | 'yearly';
    
    // Limites do Plano
    limits: {
        maxUnits: number; // Máximo de unidades
        maxUsers: number; // Máximo de usuários
        maxClients: number; // Máximo de clientes
        maxStorage: number; // GB de armazenamento
        features: string[]; // Features habilitadas
    };
    
    // Uso Atual
    usage: {
        units: number;
        users: number;
        clients: number;
        storage: number; // GB usado
    };
    
    // Contato e Cobrança
    owner: {
        userId: string;
        name: string;
        email: string;
        phone: string;
        cpf?: string;
    };
    
    billing: {
        email: string;
        address?: Address;
        paymentMethod?: PaymentMethod;
        taxId?: string; // CNPJ ou CPF
    };
    
    // Configurações
    settings: {
        timezone: string; // "America/Sao_Paulo"
        language: string; // "pt-BR"
        currency: string; // "BRL"
        dateFormat: string; // "DD/MM/YYYY"
        allowMultiUnit: boolean;
        shareClientsAcrossUnits: boolean;
        requireTwoFactor: boolean;
    };
    
    // Metadata
    createdAt: string;
    activatedAt?: string;
    suspendedAt?: string;
    cancelledAt?: string;
}
```

### **2. Planos de Assinatura**

```typescript
export interface SubscriptionPlan {
    id: string;
    name: string;
    tier: 'starter' | 'professional' | 'enterprise' | 'custom';
    pricing: {
        monthly: number; // R$ por mês
        yearly: number; // R$ por ano (com desconto)
        currency: 'BRL';
    };
    limits: {
        maxUnits: number;
        maxUsers: number;
        maxClients: number;
        maxStorage: number; // GB
    };
    features: string[];
    popular?: boolean;
}

// Planos Sugeridos
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'starter',
        name: 'Starter',
        tier: 'starter',
        pricing: {
            monthly: 297, // ~R$ 300/mês
            yearly: 2970, // ~R$ 250/mês (17% desconto)
            currency: 'BRL'
        },
        limits: {
            maxUnits: 1,
            maxUsers: 5,
            maxClients: 500,
            maxStorage: 10 // GB
        },
        features: [
            'Agenda e Agendamentos',
            'CRM de Clientes',
            'Prontuário Eletrônico',
            'Controle Financeiro Básico',
            'Relatórios Básicos',
            'Suporte por Email'
        ]
    },
    {
        id: 'professional',
        name: 'Professional',
        tier: 'professional',
        pricing: {
            monthly: 597, // ~R$ 600/mês
            yearly: 5970, // ~R$ 500/mês (17% desconto)
            currency: 'BRL'
        },
        limits: {
            maxUnits: 3,
            maxUsers: 20,
            maxClients: 2000,
            maxStorage: 50 // GB
        },
        features: [
            'Tudo do Starter +',
            'Até 3 Unidades',
            'Marketing e Campanhas',
            'Automações Avançadas',
            'Relatórios Avançados',
            'Integração WhatsApp',
            'Portal do Paciente',
            'Suporte Prioritário'
        ],
        popular: true
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        tier: 'enterprise',
        pricing: {
            monthly: 1497, // ~R$ 1500/mês
            yearly: 14970, // ~R$ 1250/mês (17% desconto)
            currency: 'BRL'
        },
        limits: {
            maxUnits: 999, // Ilimitado
            maxUsers: 999, // Ilimitado
            maxClients: 999999, // Ilimitado
            maxStorage: 500 // GB
        },
        features: [
            'Tudo do Professional +',
            'Unidades Ilimitadas',
            'Usuários Ilimitados',
            'White Label (Marca Própria)',
            'API Personalizada',
            'Treinamento Dedicado',
            'Gerente de Conta',
            'SLA 99.9%',
            'Suporte 24/7'
        ]
    },
    {
        id: 'custom',
        name: 'Custom',
        tier: 'custom',
        pricing: {
            monthly: 0, // Sob consulta
            yearly: 0,
            currency: 'BRL'
        },
        limits: {
            maxUnits: 999,
            maxUsers: 999,
            maxClients: 999999,
            maxStorage: 999999
        },
        features: [
            'Tudo do Enterprise +',
            'Desenvolvimento Customizado',
            'Integrações Específicas',
            'Infraestrutura Dedicada',
            'Consultoria Estratégica'
        ]
    }
];
```

---

## 🔐 Isolamento de Dados

### **Estratégia: Row-Level Security (RLS)**

Cada registro no banco de dados terá um campo `organizationId`:

```typescript
// Exemplo: Client com organizationId
export interface Client {
    clientId: string;
    organizationId: string; // ← NOVO: Isolamento
    userId: string;
    name: string;
    email: string;
    // ... resto dos campos
}

// Exemplo: ServiceAppointment com organizationId
export interface ServiceAppointment {
    appointmentId: string;
    organizationId: string; // ← NOVO: Isolamento
    clientId: string;
    // ... resto dos campos
}

// Exemplo: StaffMember com organizationId
export interface StaffMember {
    id: string;
    organizationId: string; // ← NOVO: Isolamento
    userId: string;
    name: string;
    // ... resto dos campos
}
```

### **Regras de Acesso**

```typescript
// Toda query deve filtrar por organizationId
const getClients = (organizationId: string) => {
    return db.clients.where({ organizationId }).getAll();
};

// Toda criação deve incluir organizationId
const createClient = (organizationId: string, clientData: Partial<Client>) => {
    return db.clients.create({
        ...clientData,
        organizationId, // Sempre incluir
        clientId: generateId()
    });
};
```

---

## 🌐 Acesso Multi-Tenant

### **Opção 1: Subdomain (Recomendado)**

```
https://dr-silva.divaspa.com.br
https://clinica-diva.divaspa.com.br
https://grupo-beauty.divaspa.com.br
```

**Vantagens:**
- ✅ Isolamento visual claro
- ✅ Branding personalizado
- ✅ SEO melhor
- ✅ Certificado SSL wildcard

**Implementação:**
```typescript
// Detectar organização pelo subdomain
const getOrganizationFromSubdomain = () => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    if (subdomain === 'app' || subdomain === 'www') {
        return null; // Landing page
    }
    
    return subdomain; // org slug
};
```

### **Opção 2: Path-based**

```
https://app.divaspa.com.br/dr-silva
https://app.divaspa.com.br/clinica-diva
https://app.divaspa.com.br/grupo-beauty
```

**Vantagens:**
- ✅ Mais simples de implementar
- ✅ Não requer DNS wildcard

---

## 💳 Modelo de Cobrança

### **1. Estrutura de Preços**

```typescript
export interface PricingModel {
    basePrice: number; // Preço base do plano
    perUnitPrice?: number; // Preço adicional por unidade extra
    perUserPrice?: number; // Preço adicional por usuário extra
    perClientPrice?: number; // Preço por cliente (acima do limite)
    storagePrice?: number; // Preço por GB adicional
}

// Exemplo: Professional Plan
const professionalPricing: PricingModel = {
    basePrice: 597, // R$ 597/mês
    perUnitPrice: 150, // R$ 150/mês por unidade adicional
    perUserPrice: 30, // R$ 30/mês por usuário adicional
    storagePrice: 10 // R$ 10/mês por GB adicional
};
```

### **2. Cálculo de Fatura**

```typescript
const calculateMonthlyBill = (org: Organization): number => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === org.subscriptionPlan.id);
    if (!plan) return 0;
    
    let total = plan.pricing.monthly;
    
    // Unidades extras
    const extraUnits = Math.max(0, org.usage.units - plan.limits.maxUnits);
    total += extraUnits * (professionalPricing.perUnitPrice || 0);
    
    // Usuários extras
    const extraUsers = Math.max(0, org.usage.users - plan.limits.maxUsers);
    total += extraUsers * (professionalPricing.perUserPrice || 0);
    
    // Storage extra
    const extraStorage = Math.max(0, org.usage.storage - plan.limits.maxStorage);
    total += extraStorage * (professionalPricing.storagePrice || 0);
    
    return total;
};
```

### **3. Métodos de Pagamento**

```typescript
export interface PaymentMethod {
    type: 'credit_card' | 'boleto' | 'pix';
    default: boolean;
    
    // Cartão de Crédito
    cardBrand?: string;
    cardLast4?: string;
    cardExpiry?: string;
    
    // Boleto/PIX
    autoRenew?: boolean;
}

export interface Invoice {
    id: string;
    organizationId: string;
    amount: number;
    dueDate: string;
    paidAt?: string;
    status: 'pending' | 'paid' | 'overdue' | 'cancelled';
    items: InvoiceItem[];
    paymentMethod?: PaymentMethod;
    paymentUrl?: string; // Link para pagamento
}
```

---

## 🚀 Onboarding de Novos Clientes

### **Fluxo de Cadastro**

```
1. Landing Page
   ↓
2. Escolher Plano
   ↓
3. Criar Conta (Email + Senha)
   ↓
4. Configurar Organização
   - Nome da clínica
   - Slug (URL personalizada)
   - Logo (opcional)
   ↓
5. Configurar Primeira Unidade
   - Nome da unidade
   - Endereço
   - Contato
   ↓
6. Adicionar Primeiro Profissional
   - Nome
   - Especialidade
   - Email
   ↓
7. Configurar Pagamento
   - Método de pagamento
   - Dados de cobrança
   ↓
8. Trial de 14 dias GRÁTIS
   ↓
9. Dashboard Personalizado
```

### **Trial Gratuito**

```typescript
export interface TrialSettings {
    duration: number; // dias
    features: string[]; // Features disponíveis no trial
    autoConvert: boolean; // Converter automaticamente para pago?
    requirePaymentMethod: boolean; // Exigir cartão no cadastro?
}

const DEFAULT_TRIAL: TrialSettings = {
    duration: 14, // 14 dias grátis
    features: ['all'], // Todas as features do plano Professional
    autoConvert: true, // Sim, converter automaticamente
    requirePaymentMethod: false // Não, não exigir cartão
};
```

---

## 📊 Dashboard Multi-Tenant

### **Visões por Tipo de Usuário**

#### **1. Owner/Admin da Organização**
```
- Visão consolidada de TODAS as unidades
- Métricas globais
- Gerenciamento de usuários
- Configurações da organização
- Cobrança e assinatura
```

#### **2. Gerente de Unidade**
```
- Visão da SUA unidade
- Métricas da unidade
- Gerenciamento de equipe da unidade
- Agenda da unidade
```

#### **3. Profissional (Staff)**
```
- Visão da SUA agenda
- Seus pacientes
- Suas comissões
- Seus atendimentos
```

#### **4. Cliente (Paciente)**
```
- Portal do paciente
- Seus agendamentos
- Seu prontuário
- Seus documentos
```

---

## 🔧 Implementação Técnica

### **Fase 1: Adicionar Suporte Multi-Tenant (2-3 semanas)**

#### **1.1 Atualizar Types**
```typescript
// Adicionar organizationId em TODAS as entidades
// Ver arquivo: types.ts (modificações necessárias)
```

#### **1.2 Criar Context de Organização**
```typescript
// components/context/OrganizationContext.tsx
export const OrganizationContext = createContext<{
    organization: Organization | null;
    switchOrganization: (orgId: string) => void;
}>({
    organization: null,
    switchOrganization: () => {}
});
```

#### **1.3 Modificar DataContext**
```typescript
// Filtrar TODOS os dados por organizationId
const getClients = () => {
    const { organization } = useOrganization();
    return mockClients.filter(c => c.organizationId === organization?.id);
};
```

### **Fase 2: Implementar Backend (4-6 semanas)**

#### **2.1 Escolher Stack**
- **Recomendado**: Supabase (PostgreSQL + Auth + Storage)
- **Alternativa**: Firebase

#### **2.2 Schema do Banco**
```sql
-- Tabela de Organizações
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    subscription_plan VARCHAR(50) NOT NULL,
    subscription_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Clientes (com RLS)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    -- ... outros campos
);

-- Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their org's clients"
ON clients
FOR SELECT
USING (organization_id = current_setting('app.current_organization_id')::UUID);
```

#### **2.3 Autenticação Multi-Tenant**
```typescript
// Usuário pertence a uma organização
interface AuthUser {
    uid: string;
    email: string;
    organizationId: string; // ← Crítico
    role: UserRole;
}
```

### **Fase 3: Sistema de Cobrança (2-3 semanas)**

#### **3.1 Integração com Gateway**
- **Stripe** (internacional)
- **Mercado Pago** (Brasil)
- **Asaas** (Brasil, recomendado para SaaS)

#### **3.2 Webhooks**
```typescript
// Receber notificações de pagamento
POST /webhooks/payment
{
    "event": "invoice.paid",
    "organizationId": "org_123",
    "amount": 597.00,
    "paidAt": "2025-12-06T15:00:00Z"
}
```

---

## 💰 Projeção de Receita

### **Cenário Conservador (Ano 1)**

```
Mês 1-3 (Lançamento):
- 10 clientes Starter (R$ 297) = R$ 2.970/mês
- 3 clientes Professional (R$ 597) = R$ 1.791/mês
Total: R$ 4.761/mês

Mês 6:
- 30 clientes Starter = R$ 8.910/mês
- 10 clientes Professional = R$ 5.970/mês
- 2 clientes Enterprise (R$ 1.497) = R$ 2.994/mês
Total: R$ 17.874/mês

Mês 12:
- 50 clientes Starter = R$ 14.850/mês
- 25 clientes Professional = R$ 14.925/mês
- 5 clientes Enterprise = R$ 7.485/mês
Total: R$ 37.260/mês = R$ 447.120/ano
```

### **Cenário Otimista (Ano 2)**

```
- 100 clientes Starter = R$ 29.700/mês
- 50 clientes Professional = R$ 29.850/mês
- 15 clientes Enterprise = R$ 22.455/mês
Total: R$ 82.005/mês = R$ 984.060/ano
```

---

## ✅ Checklist de Implementação

### **Pré-Requisitos**
- [ ] Definir planos e preços finais
- [ ] Escolher gateway de pagamento
- [ ] Registrar empresa (CNPJ)
- [ ] Configurar domínio (divaspa.com.br)

### **Fase 1: Multi-Tenant (3 semanas)**
- [ ] Adicionar `organizationId` em todos os types
- [ ] Criar `OrganizationContext`
- [ ] Modificar `DataContext` para filtrar por org
- [ ] Criar tela de onboarding
- [ ] Criar página de planos

### **Fase 2: Backend (6 semanas)**
- [ ] Setup Supabase
- [ ] Criar schema do banco
- [ ] Implementar RLS
- [ ] Migrar dados mockados
- [ ] Implementar autenticação

### **Fase 3: Cobrança (3 semanas)**
- [ ] Integrar gateway de pagamento
- [ ] Criar sistema de faturas
- [ ] Implementar webhooks
- [ ] Criar portal de cobrança
- [ ] Testar fluxo completo

### **Fase 4: Lançamento (2 semanas)**
- [ ] Testes finais
- [ ] Documentação
- [ ] Landing page
- [ ] Marketing
- [ ] Lançamento beta

**Total: ~14 semanas (3,5 meses)**

---

## 🎯 Próximos Passos Imediatos

### **Opção 1: Começar Agora (Recomendado)**
1. Criar estrutura de `Organization`
2. Adicionar `organizationId` nos types
3. Implementar isolamento no frontend
4. Preparar para backend

### **Opção 2: Validar Primeiro**
1. Lançar versão atual como DEMO
2. Coletar feedback de clientes
3. Validar preços
4. Depois implementar multi-tenant

---

## 💡 Minha Recomendação

**Implementar Multi-Tenant AGORA**, porque:
1. ✅ Arquitetura correta desde o início
2. ✅ Evita refatoração massiva depois
3. ✅ Permite crescimento escalável
4. ✅ Facilita vendas (cada cliente tem seu ambiente)

**Posso ajudar com:**
- ✅ Implementar estrutura de Organization
- ✅ Adicionar organizationId em todos os types
- ✅ Criar sistema de onboarding
- ✅ Preparar para backend multi-tenant

---

**Quer que eu comece a implementar a estrutura multi-tenant?** 🚀
