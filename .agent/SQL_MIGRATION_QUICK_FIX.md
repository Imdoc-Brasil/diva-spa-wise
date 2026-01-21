# 🚨 Solução Rápida - Erro de Migração SQL

**Problema:** `ERROR: 42703: column "status" does not exist`

**Solução:** Executar migração em 2 partes separadas

---

## ✅ Passo a Passo

### Parte 1: Criar Tabelas (SEM status)

1. Abrir Supabase SQL Editor
2. Copiar TODO o conteúdo de:
   ```
   supabase/migrations/20251223_saas_part1_tables.sql
   ```
3. Colar no SQL Editor
4. Executar (Run)
5. ✅ Deve completar sem erros

### Parte 2: Adicionar Coluna Status

1. No mesmo SQL Editor
2. Copiar TODO o conteúdo de:
   ```
   supabase/migrations/20251223_saas_part2_status.sql
   ```
3. Colar no SQL Editor
4. Executar (Run)
5. ✅ Deve completar sem erros
6. Verificar que retorna a lista de colunas incluindo `status`

---

## 📋 Verificação

Após executar ambas as partes, execute:

```sql
-- Verificar que todas as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'saas_%'
ORDER BY table_name;

-- Deve retornar:
-- saas_feature_requests
-- saas_implementation_projects
-- saas_leads
-- saas_plans
-- saas_posts
-- saas_support_tickets
-- saas_tasks
```

---

## 🎯 Por Que 2 Partes?

O Supabase estava tentando criar indexes/comments em uma coluna que ainda não existia. Dividindo em 2 partes:

1. **Parte 1:** Cria todas as tabelas SEM a coluna problemática
2. **Parte 2:** Adiciona a coluna e seu index de forma segura

---

## ✅ Pronto!

Após executar ambas as partes, sua migração estará completa e você pode:
- Testar funcionalidades no site
- Criar leads
- Converter leads em assinantes
- Tudo funcionando! 🎉
