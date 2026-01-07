# 🧪 Guia de Teste: Criação de Usuários com Edge Function

**Data**: 2026-01-06  
**Status da Edge Function**: ✅ DEPLOYED (Version 2, ACTIVE)  
**Objetivo**: Testar o fluxo completo de criação de usuários usando a Edge Function

---

## 📋 Pré-requisitos

- ✅ Edge Function `create-user` deployada e ativa
- ✅ Frontend integrado com o serviço `userService.ts`
- ✅ DataContext atualizado para usar a Edge Function
- ✅ Aplicação rodando em: https://www.imdoc.com.br/teste-2412

---

## 🔐 Credenciais de Teste

**Login Admin:**
- Email: `admin@imdoc.com.br`
- Password: `102030`

**Novo Usuário (para criar):**
- Nome: `Teste Edge Function`
- Email: `teste.edge@imdoc.com.br`
- Role: `Profissional` (ou qualquer role disponível)
- Unidade: Selecionar qualquer unidade disponível

---

## 📝 Passo a Passo do Teste

### 1️⃣ Login na Aplicação

1. Abra o navegador e acesse: `https://www.imdoc.com.br/teste-2412#/login`
2. Verifique se o branding da organização "Teste 24/12" está visível
3. Faça login com as credenciais acima
4. **Verificar**: Dashboard principal deve carregar corretamente

---

### 2️⃣ Navegar para Configurações da Organização

1. Procure pelo ícone de **Configurações** (⚙️) no menu lateral ou superior
2. Clique em **Configurações** ou **Settings**
3. **Verificar**: Página de configurações deve abrir

---

### 3️⃣ Acessar a Aba de Equipe

1. Dentro das configurações, procure pela aba **"Equipe"** ou **"Team"**
2. Clique na aba **Equipe**
3. **Verificar**: Lista de membros da equipe atual deve aparecer

---

### 4️⃣ Iniciar Criação de Novo Usuário

1. Procure pelo botão **"Convidar Membro"** ou **"Invite Member"**
2. Clique no botão
3. **Verificar**: Um formulário/modal deve abrir

---

### 5️⃣ Preencher o Formulário

Preencha os campos com os seguintes dados:

| Campo | Valor |
|-------|-------|
| **Nome** | `Teste Edge Function` |
| **Email** | `teste.edge@imdoc.com.br` |
| **Role/Função** | `Profissional` (ou qualquer disponível) |
| **Unidade** | Selecionar qualquer unidade disponível |

---

### 6️⃣ Submeter o Formulário

1. Clique no botão **"Convidar"** ou **"Enviar"**
2. **Aguarde** a resposta (pode levar 2-5 segundos)

---

### 7️⃣ Verificar o Resultado

#### ✅ **Cenário de Sucesso:**

Você deve ver:
- ✅ Mensagem de sucesso (toast/notificação)
- ✅ O novo usuário aparece na lista de membros da equipe
- ✅ Console do navegador (F12) mostra logs de sucesso

**Mensagem esperada:**
```
"Membro convidado com sucesso! Senha temporária: [senha gerada]"
```

#### ❌ **Cenário de Erro:**

Se houver erro, você pode ver:
- ❌ Mensagem de erro específica
- ❌ Console mostra detalhes do erro

**Possíveis erros:**
- "Unauthorized" → Problema de autenticação
- "Permission denied" → Usuário não tem permissão (não é owner/admin)
- "Email already exists" → Email já cadastrado
- "Organization mismatch" → Problema de organização

---

## 🔍 Verificações Adicionais

### Console do Navegador (F12)

Abra o console e procure por:

```javascript
// Logs esperados:
✅ "Calling Edge Function create-user..."
✅ "Edge Function response: { success: true, ... }"
✅ "User created successfully"

// Ou erros:
❌ "Edge Function error: ..."
❌ "Failed to create user: ..."
```

### Network Tab (Aba Rede)

1. Abra as **DevTools** (F12)
2. Vá para a aba **Network** (Rede)
3. Filtre por **Fetch/XHR**
4. Procure pela requisição para: `create-user`

**Verificar:**
- Status Code: `200 OK` (sucesso) ou `4xx/5xx` (erro)
- Response Body: Deve conter `{ success: true, user: {...}, temporaryPassword: "..." }`

---

## 🗄️ Verificação no Supabase

### Verificar na Tabela `app_users`

1. Acesse: https://supabase.com/dashboard/project/ypbtyxhpbtnnwrbulnyg
2. Vá para **Table Editor**
3. Abra a tabela **`app_users`**
4. Procure pelo email: `teste.edge@imdoc.com.br`

**Verificar:**
- ✅ Registro existe
- ✅ `name` = "Teste Edge Function"
- ✅ `email` = "teste.edge@imdoc.com.br"
- ✅ `organization_id` = ID da organização "Teste 24/12"
- ✅ `role` = Role selecionada
- ✅ `unit_id` = Unidade selecionada

### Verificar no Supabase Auth

1. No dashboard do Supabase, vá para **Authentication** → **Users**
2. Procure pelo email: `teste.edge@imdoc.com.br`

**Verificar:**
- ✅ Usuário existe em `auth.users`
- ✅ Email confirmado automaticamente
- ✅ Pode fazer login com a senha temporária

---

## 🐛 Troubleshooting

### Problema: "Unauthorized" ou "Not authenticated"

**Causa**: Token de autenticação inválido ou expirado  
**Solução**: 
1. Faça logout
2. Faça login novamente
3. Tente criar o usuário novamente

### Problema: "Permission denied"

**Causa**: Usuário logado não tem role de `owner` ou `admin`  
**Solução**: 
1. Verifique a role do usuário logado
2. Use um usuário com permissões adequadas

### Problema: "Email already exists"

**Causa**: Email já foi usado anteriormente  
**Solução**: 
1. Use um email diferente (ex: `teste.edge2@imdoc.com.br`)
2. Ou delete o usuário existente no Supabase primeiro

### Problema: "Organization mismatch"

**Causa**: Tentando criar usuário para outra organização  
**Solução**: 
1. Verifique se está logado na organização correta
2. Verifique o `organizationId` no console

### Problema: Erro 500 ou timeout

**Causa**: Problema na Edge Function  
**Solução**: 
1. Verifique os logs da Edge Function:
```bash
supabase functions logs create-user
```
2. Verifique se a Edge Function está ativa:
```bash
supabase functions list
```

---

## 📊 Checklist de Validação

Use este checklist para validar o teste:

- [ ] Login realizado com sucesso
- [ ] Navegação para configurações funcionou
- [ ] Aba de equipe acessível
- [ ] Formulário de convite abriu corretamente
- [ ] Formulário preenchido com dados de teste
- [ ] Formulário submetido sem erros
- [ ] Mensagem de sucesso exibida
- [ ] Senha temporária mostrada na mensagem
- [ ] Novo usuário aparece na lista de equipe
- [ ] Console não mostra erros críticos
- [ ] Network tab mostra status 200 para create-user
- [ ] Usuário existe em `app_users` no Supabase
- [ ] Usuário existe em `auth.users` no Supabase
- [ ] Dados do usuário estão corretos (nome, email, role, unit)

---

## 📸 Screenshots Recomendados

Tire screenshots dos seguintes momentos:

1. **Login page** - Mostrando o branding da organização
2. **Dashboard** - Após login bem-sucedido
3. **Configurações** - Página de configurações
4. **Aba Equipe** - Lista de membros
5. **Formulário de convite** - Antes de preencher
6. **Formulário preenchido** - Com os dados de teste
7. **Mensagem de sucesso** - Com a senha temporária
8. **Lista atualizada** - Mostrando o novo membro
9. **Console** - Mostrando os logs
10. **Network tab** - Mostrando a requisição bem-sucedida

---

## 🎯 Próximos Passos Após Teste Bem-Sucedido

1. ✅ **Testar login com o novo usuário**
   - Use o email e a senha temporária gerada
   - Verifique se o login funciona

2. 📧 **Implementar envio de email**
   - Configurar serviço de email (SendGrid, Resend, etc.)
   - Enviar senha temporária por email
   - Adicionar link de reset de senha

3. 🔒 **Re-habilitar RLS**
   - Criar políticas de segurança
   - Testar isolamento de dados

4. 🔑 **Implementar reset de senha**
   - Permitir usuário trocar senha temporária
   - Fluxo de "esqueci minha senha"

---

## 📝 Notas Importantes

- A senha temporária é gerada automaticamente pela Edge Function
- A senha tem 12 caracteres com letras maiúsculas, minúsculas e números
- O email do usuário é automaticamente confirmado no Supabase Auth
- Se a criação em `app_users` falhar, o usuário em `auth.users` é automaticamente deletado (rollback)
- Apenas usuários com role `owner` ou `admin` podem criar novos usuários
- Usuários só podem ser criados dentro da mesma organização do usuário logado

---

**Boa sorte com o teste! 🚀**
