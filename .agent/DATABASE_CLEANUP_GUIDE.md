# 🧹 Guia de Execução - Limpeza Automática do Banco de Dados

**Arquivo:** `supabase/migrations/20251223_database_cleanup_automatic.sql`  
**Tempo Estimado:** 30 segundos  
**Risco:** Baixo (faz backup automático)

---

## ✅ O Que Este Script Faz

### 1. Backup Automático (Segurança)
Cria tabelas temporárias com backup de:
- ✅ 4 planos (saas_plans)
- ✅ 2 assinantes (organizations)
- ✅ 5 templates de marketing
- ✅ 1 campanha
- ✅ 1 lead
- ✅ 1 projeto de implementação

### 2. Remove Tabelas Desnecessárias
Dropa 9 tabelas de clínica:
- ❌ appointments
- ❌ clients
- ❌ staff
- ❌ services
- ❌ rooms
- ❌ products
- ❌ profiles
- ❌ transactions
- ❌ app_configs

### 3. Recria Organizations com Schema Limpo
Schema correto com apenas as colunas necessárias:
- `id`, `name`, `slug`
- `type`, `subscription_status`, `subscription_plan_id`
- `owner_id`, `asaas_customer_id`, `asaas_subscription_id`
- `created_at`, `updated_at`

### 4. Garante Todas as Tabelas SaaS
Cria (se não existir) as 10 tabelas essenciais

### 5. Configura RLS e Indexes
- Habilita Row Level Security
- Cria policies permissivas (desenvolvimento)
- Cria indexes otimizados

### 6. Restaura Dados
Restaura todos os dados do backup

### 7. Verificação
Mostra estado final do banco

---

## 🚀 Como Executar

### Passo 1: Acessar Supabase
https://supabase.com/dashboard → Seu Projeto → SQL Editor

### Passo 2: Copiar Script Completo
Copiar **TODO** o conteúdo de:
```
supabase/migrations/20251223_database_cleanup_automatic.sql
```

### Passo 3: Colar e Executar
1. Colar no SQL Editor
2. Clicar em "Run"
3. Aguardar (~30 segundos)

### Passo 4: Verificar Resultado
Você verá várias tabelas de resultado mostrando:
1. ✅ "Backup created successfully!"
2. ✅ "Unnecessary tables dropped!"
3. ✅ "Organizations table recreated!"
4. ✅ "All SaaS tables ensured!"
5. ✅ "RLS enabled!"
6. ✅ "Indexes created!"
7. ✅ "Data restored successfully!"
8. 📊 Estado final do banco
9. 📈 Contagem de linhas
10. 🎉 "Database cleanup completed successfully!"

---

## 📊 Resultado Esperado

### Antes
```
19 tabelas:
- 9 tabelas de clínica (desnecessárias)
- 10 tabelas SaaS (necessárias)
```

### Depois
```
10 tabelas:
- organizations (schema limpo)
- saas_leads
- saas_tasks
- saas_plans
- saas_implementation_projects
- saas_support_tickets
- saas_feature_requests
- saas_posts
- marketing_templates
- marketing_campaigns
```

### Dados Preservados
- ✅ 4 planos
- ✅ 2 assinantes
- ✅ 5 templates
- ✅ 1 campanha
- ✅ 1 lead
- ✅ 1 projeto

---

## ⚠️ Avisos Importantes

### 1. Execute Tudo de Uma Vez
- ❌ NÃO execute linha por linha
- ✅ Execute o script COMPLETO

### 2. Backup Automático
- O script faz backup automático
- Dados são restaurados no final
- Seguro para executar

### 3. Irreversível
- Após executar, tabelas dropadas não voltam
- Mas dados importantes são preservados

### 4. Tempo de Execução
- ~30 segundos total
- Não interrompa durante execução

---

## 🔍 Verificação Pós-Execução

### 1. Verificar Tabelas
No Supabase Dashboard → Database → Tables

Deve mostrar apenas 10 tabelas

### 2. Verificar Dados
```sql
-- Verificar planos
SELECT * FROM saas_plans;
-- Deve retornar 4 planos

-- Verificar assinantes
SELECT * FROM organizations;
-- Deve retornar 2 assinantes
```

### 3. Testar Aplicação
1. Acessar: https://imdoc.com.br/master/crm
2. Verificar que tudo funciona
3. Criar novo lead (teste)
4. Converter em assinante (teste)

---

## 🆘 Em Caso de Problemas

### Erro Durante Execução
1. Verificar mensagem de erro
2. Se falhou no backup: seguro continuar
3. Se falhou no restore: dados estão no backup temporário

### Dados Não Restaurados
```sql
-- Verificar se backup existe
SELECT * FROM backup_saas_plans;
SELECT * FROM backup_organizations;

-- Restaurar manualmente se necessário
INSERT INTO saas_plans SELECT * FROM backup_saas_plans;
INSERT INTO organizations SELECT * FROM backup_organizations;
```

### Rollback (Se Necessário)
Não há rollback automático, mas você pode:
1. Recriar tabelas manualmente
2. Importar dados de backup
3. Ou executar script novamente (é idempotente)

---

## ✅ Checklist Final

Antes de executar:
- [ ] Abri Supabase SQL Editor
- [ ] Copiei script COMPLETO
- [ ] Estou pronto para executar

Após executar:
- [ ] Vi mensagem "cleanup completed successfully"
- [ ] Verifico que tenho 10 tabelas
- [ ] Verifico que dados foram preservados
- [ ] Testei aplicação

---

## 🎉 Pronto!

Após executar, você terá:
- ✅ Banco de dados limpo
- ✅ Schema consistente
- ✅ Apenas tabelas necessárias
- ✅ Dados importantes preservados
- ✅ Performance otimizada

**Execute agora e veja a mágica acontecer! 🚀**
