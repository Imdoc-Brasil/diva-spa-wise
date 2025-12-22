# 📚 Guia de Migrações Supabase - Diva Spa

**Última atualização:** 2025-12-22

---

## 🎯 Ordem de Execução

Execute as migrações na seguinte ordem para garantir integridade referencial:

### **Core Schema** (Executar primeiro)
1. `schema.sql` - Schema base
2. `core_migration.sql` - Tabelas principais (organizations, clients, appointments, etc)
3. `fix_database_ids.sql` - Correção de IDs e constraints
4. `fix_database_v2.sql` - Ajustes adicionais

### **Segurança e Acesso**
5. `security_enable.sql` - Habilita RLS
6. `20251221_finalize_security.sql` - Políticas de segurança finais
7. `20251221_public_access.sql` - Acesso público para landing pages

### **Módulos Core**
8. `20251222_core_modules.sql` - Módulos principais do sistema
9. `20251221_add_folders.sql` - Sistema de pastas
10. `20251221_fix_templates.sql` - Templates de documentos

### **SaaS Específico**
11. `saas_migration.sql` - Schema SaaS base
12. `saas_leads_migration.sql` - Tabela de leads
13. `saas_lead_address_fields.sql` - Campos de endereço
14. `saas_lead_legal_name.sql` - Razão social
15. `saas_lead_payment_fields.sql` - Campos de pagamento
16. `saas_leads_invoice_fields.sql` - Campos de faturamento
17. `20251222_saas_crm_pipelines.sql` - Pipelines CRM (tickets, features, implementação)
18. `20251222_saas_plans.sql` - Planos de assinatura
19. `20251217_automation_schema.sql` - Automações e workflows

### **Conteúdo e Marketing**
20. `saas_content_migration.sql` - Blog e conteúdo
21. `saas_crm_enhancements.sql` - Melhorias no CRM
22. `saas_plans_migration.sql` - Migração de planos antigos (se aplicável)

### **Seeds e Dados Iniciais**
23. `seed_blog_post.sql` - Posts de exemplo
24. `supabase_setup.sql` - Configurações finais

---

## 📋 Tabelas Principais

### **Core**
- `organizations` - Organizações/clientes SaaS
- `profiles` - Perfis de usuários
- `clients` - Clientes das clínicas
- `appointments` - Agendamentos
- `transactions` - Transações financeiras
- `staff` - Equipe
- `services` - Serviços oferecidos
- `products` - Produtos
- `rooms` - Salas/recursos

### **SaaS CRM**
- `saas_leads` - Leads de vendas
- `saas_tasks` - Tarefas vinculadas a leads
- `saas_implementation_projects` - Projetos de onboarding
- `saas_support_tickets` - Tickets de suporte
- `saas_feature_requests` - Solicitações de features
- `saas_plans` - Planos de assinatura

### **Conteúdo**
- `saas_posts` - Posts do blog
- `marketing_campaigns` - Campanhas de marketing
- `marketing_templates` - Templates de email/SMS

---

## 🔧 Comandos Úteis

### Executar todas as migrações
```bash
# Via Supabase CLI
supabase db reset

# Ou aplicar migrações pendentes
supabase db push
```

### Verificar status
```bash
supabase migration list
```

### Criar nova migração
```bash
supabase migration new nome_da_migracao
```

### Rollback (cuidado!)
```bash
supabase db reset --version <migration_version>
```

---

## ⚠️ Notas Importantes

### **RLS (Row Level Security)**
- Todas as tabelas têm RLS habilitado
- Políticas permissivas em desenvolvimento (`for all using (true)`)
- **IMPORTANTE:** Revisar políticas antes de produção!

### **Migrations vs Seed Data**
- Migrações: Estrutura do banco (DDL)
- Seeds: Dados iniciais (DML)
- Separar claramente os dois conceitos

### **Backup**
- Sempre fazer backup antes de executar migrações em produção
- Testar em ambiente local/staging primeiro

### **Versionamento**
- Formato de nome: `YYYYMMDD_descricao.sql`
- Nunca editar migrações já aplicadas em produção
- Criar nova migração para correções

---

## 🚨 Troubleshooting

### Erro: "relation already exists"
```sql
-- Usar IF NOT EXISTS
CREATE TABLE IF NOT EXISTS nome_tabela (...);
```

### Erro: "column already exists"
```sql
-- Verificar antes de adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='tabela' AND column_name='coluna') THEN
        ALTER TABLE tabela ADD COLUMN coluna tipo;
    END IF;
END $$;
```

### Erro de constraint/foreign key
```sql
-- Dropar constraint antiga antes de recriar
ALTER TABLE tabela DROP CONSTRAINT IF EXISTS nome_constraint;
ALTER TABLE tabela ADD CONSTRAINT nome_constraint ...;
```

---

## 📊 Diagrama de Dependências

```
schema.sql
  └─ core_migration.sql
      ├─ security_enable.sql
      ├─ saas_migration.sql
      │   ├─ saas_leads_migration.sql
      │   ├─ saas_crm_pipelines.sql
      │   └─ saas_plans.sql
      └─ core_modules.sql
```

---

## 🔄 Próximos Passos

1. **Consolidar migrações incrementais** em arquivos maiores e mais organizados
2. **Criar testes automatizados** para validar schema
3. **Documentar políticas RLS** específicas por tabela
4. **Implementar versionamento semântico** para migrações críticas

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Verificar logs do Supabase Dashboard
- Consultar documentação oficial: https://supabase.com/docs
- Revisar este README e o plano de refatoração
