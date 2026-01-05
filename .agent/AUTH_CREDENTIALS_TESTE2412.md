# 🔐 CREDENCIAIS DE ACESSO - TESTE-2412

## 📊 **ORGANIZAÇÃO CRIADA:**

- **Nome:** Teste 24/12
- **Slug:** `teste-2412`
- **URL:** `https://www.imdoc.com.br/teste-2412#/login`
- **Status:** Trial (14 dias)
- **Plano:** Growth

---

## 👤 **ADMIN USER:**

### **Problema Atual:**
O usuário admin foi criado na tabela `profiles`, mas **NÃO** foi criado no `auth.users` do Supabase.

### **Causa:**
O `OnboardingService.createAdminUser()` está usando um **mock** (linha 291-323) porque a criação de usuários requer **Service Role Key** do Supabase.

### **Código Atual (Mock):**
```typescript
// Mock user creation
const mockUserId = crypto.randomUUID();

// Create profile
const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
        id: mockUserId,
        organization_id: data.organizationId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'admin',
        status: 'active'
    })
    .select()
    .single();
```

---

## ✅ **SOLUÇÃO TEMPORÁRIA:**

### **Opção 1: Criar Usuário Manualmente no Supabase Dashboard**

1. Acesse: https://supabase.com/dashboard
2. Vá em **Authentication** > **Users**
3. Clique em **Add User**
4. Preencha:
   - **Email:** (o email do lead)
   - **Password:** `Teste@123` (temporária)
   - **Auto Confirm:** ✅ Sim
5. Copie o **User ID** gerado
6. Atualize a tabela `profiles`:
   ```sql
   UPDATE profiles
   SET id = 'USER_ID_COPIADO'
   WHERE organization_id = 'org_teste-2412'
   AND role = 'admin';
   ```

### **Opção 2: Usar Email Demo (Bypass)**

O `LoginPage` já tem bypass para emails demo:

```typescript
const demoEmails = [
    'master@imdoc.com', 
    'support@imdoc.com', 
    'admin@imdoc.com', 
    'dra.julia@imdoc.com', 
    'dra.julia@divaspa.com', 
    'client@imdoc.com', 
    'financeiro@imdoc.com', 
    'ana.silva@gmail.com'
];
```

**Como usar:**
1. Acesse: `https://www.imdoc.com.br/teste-2412#/login`
2. Email: `admin@imdoc.com`
3. Senha: (qualquer)
4. Selecione perfil: **Administrador**
5. ✅ Login funcionará!

---

## 🚀 **SOLUÇÃO PERMANENTE:**

### **Implementar Edge Function para Criar Usuários:**

```typescript
// supabase/functions/create-admin-user/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { email, password, organizationId, name, phone } = await req.json()

  // Create user in auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      organization_id: organizationId
    }
  })

  if (authError) {
    return new Response(JSON.stringify({ error: authError.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Create profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: authData.user.id,
      organization_id: organizationId,
      name,
      email,
      phone,
      role: 'admin',
      status: 'active'
    })

  if (profileError) {
    // Rollback auth user
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ 
    success: true, 
    userId: authData.user.id 
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## 📝 **PRÓXIMOS PASSOS:**

1. ✅ **Usar Opção 2** (email demo) para testar agora
2. 🔜 **Implementar Edge Function** para produção
3. 🔜 **Atualizar OnboardingService** para chamar Edge Function

---

**Status:** ⚠️ **Autenticação funciona com bypass, mas precisa de implementação real**
