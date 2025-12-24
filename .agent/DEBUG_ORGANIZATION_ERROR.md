# 🐛 DEBUG: Failed to create organization

## Problema
Erro "Failed to create organization" ao arrastar lead para TRIAL

## Possíveis Causas

### 1. Slug Duplicado
O slug já existe no banco de dados.

**Verificar no Supabase:**
```sql
SELECT id, name, slug, created_at 
FROM organizations 
ORDER BY created_at DESC 
LIMIT 20;
```

**Procurar por:**
- `org_converter-em-assinatura`
- `org_teste-de-alertas`
- Outros slugs similares

### 2. Erro de Permissão (RLS)
As políticas RLS podem estar bloqueando a inserção.

**Verificar políticas:**
```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'organizations';
```

### 3. Campos Obrigatórios Faltando
Algum campo NOT NULL pode estar faltando.

**Verificar schema:**
```sql
SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'organizations'
AND is_nullable = 'NO';
```

## Como Debugar

### Passo 1: Abrir Console do Navegador
1. Pressione F12
2. Vá na aba "Console"
3. Tente arrastar um lead para TRIAL
4. Procure por mensagens começando com:
   - `❌ [Onboarding]`
   - Erro do Supabase

### Passo 2: Verificar Logs
Procure por:
```
❌ [Onboarding] Supabase error creating organization: {
  code: "...",
  message: "...",
  details: "...",
  hint: "...",
  slug: "...",
  orgId: "..."
}
```

### Passo 3: Copiar Erro Completo
Copie TODO o objeto de erro e me envie.

## Soluções Comuns

### Se for Slug Duplicado:
```sql
-- Deletar organização antiga
DELETE FROM organizations 
WHERE slug = 'converter-em-assinatura';
```

### Se for RLS:
```sql
-- Verificar se política está muito restritiva
-- A política "System can insert organizations" deve permitir INSERT
```

### Se for Campo Faltando:
Verificar no código do OnboardingService se todos os campos NOT NULL estão sendo preenchidos.

## Teste Rápido

1. Criar lead com nome ÚNICO:
   - Nome: "Teste Debug 123"
   - Clínica: "Clínica Debug 123"
   
2. Arrastar para TRIAL

3. Ver erro no console

4. Me enviar o erro completo

## Informações Necessárias

Para eu ajudar, preciso de:
1. ✅ Mensagem de erro completa do console
2. ✅ Lista de organizations no banco (query acima)
3. ✅ Nome do lead que tentou converter
