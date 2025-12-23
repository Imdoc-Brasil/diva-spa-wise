# 🔧 Correção Final - Organizations Schema

**Problema:** Tabela `organizations` está faltando colunas necessárias

**Solução:** Executar migração SQL para adicionar colunas

---

## ✅ Passo a Passo

### 1. Acessar Supabase SQL Editor
https://supabase.com/dashboard → Seu Projeto → SQL Editor

### 2. Executar Migração
Copiar e colar TODO o conteúdo de:
```
supabase/migrations/20251223_fix_organizations_schema.sql
```

### 3. Clicar em "Run"

### 4. Verificar Resultado
Você verá 2 tabelas de resultados:
- **Primeira:** Schema ANTES da migração
- **Segunda:** Schema DEPOIS da migração

A segunda tabela deve mostrar as novas colunas:
- ✅ `type` (TEXT, default 'clinic')
- ✅ `subscription_plan_id` (TEXT)

---

## 🎯 Após Executar

1. Recarregar site: https://imdoc.com.br/master/crm
2. Criar um lead de teste
3. Converter em assinante
4. ✅ **Deve funcionar!**

---

## 📋 O Que a Migração Faz

```sql
-- Adiciona coluna 'type' se não existir
ALTER TABLE organizations ADD COLUMN type TEXT DEFAULT 'clinic';

-- Adiciona coluna 'subscription_plan_id' se não existir
ALTER TABLE organizations ADD COLUMN subscription_plan_id TEXT;
```

**Seguro:** Verifica se as colunas já existem antes de adicionar

---

## ✅ Checklist

- [ ] Acessar Supabase Dashboard
- [ ] Abrir SQL Editor
- [ ] Copiar migração completa
- [ ] Executar
- [ ] Verificar que 2 colunas foram adicionadas
- [ ] Testar conversão de lead

---

**Execute agora e teste!** 🚀
