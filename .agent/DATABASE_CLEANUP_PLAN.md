# 🧹 Plano de Limpeza do Banco de Dados

**Objetivo:** Limpar o banco de dados removendo tabelas de clínica e mantendo apenas o essencial para o SaaS

---

## 📊 Análise Atual

### Tabelas Existentes (19 total)
```
✅ MANTER (10):
- saas_leads (1 row)
- saas_plans (4 rows) 
- saas_posts (0 rows)
- saas_tasks (0 rows)
- saas_support_tickets (0 rows)
- saas_feature_requests (0 rows)
- saas_implementation_projects (1 row)
- organizations (2 rows)
- marketing_templates (5 rows)
- marketing_campaigns (1 row)

❌ REMOVER (9):
- appointments (0 rows) - Específico de clínica
- clients (0 rows) - Específico de clínica
- staff (0 rows) - Específico de clínica
- services (0 rows) - Específico de clínica
- rooms (0 rows) - Específico de clínica
- products (0 rows) - Específico de clínica
- profiles (6 rows) - Duplicado
- transactions (0 rows) - Pode recriar depois
- app_configs (1 row) - Pode recriar depois
```

---

## 🎯 Estratégia de Limpeza

### Fase 1: Backup (Segurança)
Antes de qualquer coisa, fazer backup dos dados importantes:
- ✅ saas_plans (4 planos)
- ✅ organizations (2 assinantes)
- ✅ marketing_templates (5 templates)

### Fase 2: Remover Tabelas Desnecessárias
Dropar tabelas que não são usadas no SaaS:
```sql
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS app_configs CASCADE;
```

### Fase 3: Limpar Tabelas SaaS Vazias
Manter estrutura, mas garantir que estão limpas:
- saas_posts (0 rows) - OK
- saas_tasks (0 rows) - OK
- saas_support_tickets (0 rows) - OK
- saas_feature_requests (0 rows) - OK

### Fase 4: Recriar Organizations com Schema Correto
Dropar e recriar `organizations` com o schema limpo:
```sql
DROP TABLE IF EXISTS organizations CASCADE;

CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'clinic',
    subscription_status TEXT DEFAULT 'trial',
    subscription_plan_id TEXT,
    owner_id UUID,
    asaas_customer_id TEXT,
    asaas_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Fase 5: Consolidar Migrações
Criar UMA migração consolidada final com:
- Schema limpo
- Seed data dos planos
- RLS policies
- Indexes otimizados

---

## 📁 Nova Estrutura de Migrações

```
supabase/migrations/
├── archive/ (mover migrações antigas)
│   └── [todas as 20+ migrações antigas]
├── 20251223_clean_database.sql (NOVA - limpeza)
└── 20251223_saas_schema_final.sql (NOVA - schema limpo)
```

---

## ✅ Schema Final (Limpo)

### Tabelas Core (10)
1. **organizations** - Assinantes do SaaS
2. **saas_leads** - Pipeline de vendas
3. **saas_tasks** - Tarefas de follow-up
4. **saas_plans** - Planos de assinatura
5. **saas_implementation_projects** - Onboarding
6. **saas_support_tickets** - Suporte
7. **saas_feature_requests** - Roadmap
8. **saas_posts** - Blog
9. **marketing_templates** - Templates
10. **marketing_campaigns** - Campanhas

### Relacionamentos
```
organizations
    ↓
saas_leads → saas_tasks
    ↓
saas_implementation_projects
    ↓
saas_support_tickets
saas_feature_requests
```

---

## 🚀 Execução

### Opção A: Limpeza Automática (Recomendado)
Executar script SQL que:
1. Faz backup dos dados importantes
2. Dropa tabelas desnecessárias
3. Recria organizations com schema correto
4. Restaura dados importantes

### Opção B: Limpeza Manual
1. Exportar dados importantes
2. Dropar todas as tabelas
3. Executar migração consolidada
4. Importar dados de volta

---

## 📊 Benefícios

### Antes
- 19 tabelas
- Schema confuso
- Migrações desorganizadas
- Colunas inconsistentes

### Depois
- 10 tabelas (47% redução)
- Schema limpo e focado
- 1-2 migrações consolidadas
- Colunas consistentes

---

## ⚠️ Avisos

1. **Backup Primeiro:** Sempre fazer backup antes de dropar tabelas
2. **Dados Importantes:** Você confirmou que só tem dados importantes em:
   - saas_plans (4 planos)
   - organizations (2 assinantes)
   - marketing_templates (5 templates)
3. **Irreversível:** Após dropar, não tem volta sem backup

---

## 🎯 Próximos Passos

Você quer que eu:

**A) Criar script de limpeza automática** (recomendado)
- Faz tudo de uma vez
- Seguro (verifica antes de dropar)
- Backup automático dos dados importantes

**B) Criar guia passo a passo manual**
- Você executa cada comando
- Mais controle
- Mais trabalhoso

**C) Apenas criar schema final limpo**
- Você dropa manualmente
- Executa migração limpa
- Mais flexível

**Qual prefere?** 🤔
