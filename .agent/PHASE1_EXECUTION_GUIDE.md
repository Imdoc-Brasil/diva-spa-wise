# 🔴 FASE 1: EXECUÇÃO DA MIGRATION

**Data:** 2025-12-23 19:25  
**Tempo Estimado:** 30 minutos  
**Status:** 📋 PRONTO PARA EXECUTAR

---

## 📋 PRÉ-REQUISITOS

- [x] Migration criada: `20251223_phase1_complete_onboarding_schema.sql`
- [ ] Acesso ao Supabase Dashboard
- [ ] Backup do banco (recomendado)

---

## 🚀 PASSO A PASSO

### 1. Acessar Supabase Dashboard
```
https://supabase.com/dashboard/project/[seu-project-id]
```

### 2. Ir para SQL Editor
```
Menu lateral → SQL Editor → New Query
```

### 3. Copiar e Colar Migration
```
Abrir: supabase/migrations/20251223_phase1_complete_onboarding_schema.sql
Copiar TODO o conteúdo
Colar no SQL Editor
```

### 4. Executar Migration
```
Clicar em "Run" ou Ctrl+Enter
```

### 5. Verificar Resultados
Você deve ver várias mensagens de sucesso:
```
✅ Organizations table updated with missing fields!
✅ Units table created successfully!
✅ Organizations RLS policies updated!
✅ Units RLS policies created!
✅ Triggers created for automatic timestamp updates!
✅ Performance indexes created!
✅ PHASE 1 COMPLETE: Database schema ready for onboarding!
```

### 6. Verificar Schema
A migration inclui queries de validação que mostram:
- Schema da tabela `organizations`
- Schema da tabela `units`
- Status do RLS
- Políticas criadas

---

## ✅ VALIDAÇÃO

### Verificar Tabela Organizations:
```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'organizations'
ORDER BY ordinal_position;
```

**Campos Esperados:**
- [x] id
- [x] name
- [x] slug
- [x] type
- [x] subscription_status
- [x] subscription_plan_id
- [x] owner_id
- [x] asaas_customer_id
- [x] asaas_subscription_id
- [x] **legal_name** (NOVO)
- [x] **cnpj** (NOVO)
- [x] **email** (NOVO)
- [x] **phone** (NOVO)
- [x] **address** (NOVO)
- [x] **number** (NOVO)
- [x] **complement** (NOVO)
- [x] **neighborhood** (NOVO)
- [x] **city** (NOVO)
- [x] **state** (NOVO)
- [x] **zip_code** (NOVO)
- [x] **trial_started_at** (NOVO)
- [x] **trial_ends_at** (NOVO)
- [x] **billing_email** (NOVO)
- [x] **payment_method** (NOVO)
- [x] **recurrence** (NOVO)
- [x] created_at
- [x] updated_at

### Verificar Tabela Units:
```sql
SELECT * FROM units LIMIT 1;
```

**Deve existir** (mesmo que vazia)

### Verificar RLS:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('organizations', 'units');
```

**Resultado Esperado:**
```
organizations | true
units         | true
```

### Verificar Políticas:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('organizations', 'units');
```

**Políticas Esperadas:**
- Organizations:
  - Users can only see their organization
  - Users can only update their organization
  - System can insert organizations
  - System can delete organizations
- Units:
  - Users can only see units from their organization
  - Admins can insert units in their organization
  - Admins can update units in their organization
  - Admins can delete units in their organization

---

## 🐛 TROUBLESHOOTING

### Erro: "column already exists"
**Solução:** Alguns campos já existem, isso é normal. A migration usa `ADD COLUMN IF NOT EXISTS`.

### Erro: "table already exists"
**Solução:** A migration usa `DROP TABLE IF EXISTS` antes de criar. Se der erro, execute manualmente:
```sql
DROP TABLE IF EXISTS units CASCADE;
```

### Erro: "policy already exists"
**Solução:** Execute manualmente:
```sql
DROP POLICY IF EXISTS "nome_da_policy" ON nome_da_tabela;
```

### Erro de permissão
**Solução:** Certifique-se de estar usando o SQL Editor do Supabase Dashboard (tem permissões de admin).

---

## 📊 IMPACTO

### Tabelas Afetadas:
- ✅ `organizations` (campos adicionados)
- ✅ `units` (criada)

### Políticas Afetadas:
- ⚠️ `organizations` (políticas substituídas - BREAKING CHANGE)
- ✅ `units` (políticas criadas)

### Dados Existentes:
- ✅ Preservados (apenas adicionando campos)
- ⚠️ Organizações antigas terão campos novos como NULL

---

## ⚠️ ATENÇÃO

### BREAKING CHANGE:
As políticas RLS de `organizations` foram **substituídas**!

**ANTES:**
```sql
CREATE POLICY "Enable all access for organizations" 
ON organizations FOR ALL USING (true);
```

**DEPOIS:**
```sql
-- Usuários só veem sua organização
CREATE POLICY "Users can only see their organization"
ON organizations FOR SELECT
USING (
    id IN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);
```

**IMPACTO:**
- ✅ Isolamento de dados funcionará
- ⚠️ Usuários sem `organization_id` no profile NÃO verão nada
- ⚠️ Organizações de teste antigas podem ficar inacessíveis

---

## 🎯 PRÓXIMOS PASSOS

Após executar com sucesso:

1. ✅ Verificar que não há erros
2. ✅ Validar schema
3. ✅ Testar acesso (pode não funcionar ainda - normal!)
4. ✅ Reportar sucesso
5. 🚀 Partir para **FASE 2: OnboardingService**

---

## 📝 CHECKLIST DE EXECUÇÃO

- [ ] Abrir Supabase Dashboard
- [ ] Ir para SQL Editor
- [ ] Copiar migration
- [ ] Colar no editor
- [ ] Executar (Run)
- [ ] Verificar mensagens de sucesso
- [ ] Verificar schema organizations
- [ ] Verificar tabela units existe
- [ ] Verificar RLS habilitado
- [ ] Verificar políticas criadas
- [ ] Reportar resultado

---

## 🆘 SE ALGO DER ERRADO

**NÃO ENTRE EM PÂNICO!**

1. Copie a mensagem de erro completa
2. Me envie
3. Posso criar uma migration de rollback
4. Ou ajustar a migration

---

**Pronto para executar?** 🚀

**Aguardando seu feedback!** 😊
