# 🔧 Solução: Problemas de Login

**Data**: 2026-01-07  
**Problemas Identificados**:
1. ❌ Tela em branco ao tentar fazer login
2. 🔐 Senha desconhecida para `email@ponto.com`

---

## 📊 Análise das Imagens

### Imagem 1: Teste Edge Function ✅
- Edge Function está funcionando corretamente
- Validação de autenticação OK
- Status: ATIVO

### Imagem 2: Tela em Branco ❌
- URL: `https://www.imdoc.com.br/teste-2412#/login`
- Tela completamente branca
- Console mostra erros (visível no DevTools)

### Imagem 3: Usuário no Supabase ✅
- Tabela: `public.organizations`
- Organização: "Teste 24/12"
- Email: `email@ponto.com`
- ID: `org_teste-2412`

### Imagens 4 e 5: Supabase Auth ✅
- 6 usuários cadastrados no Auth
- Usuário `email@ponto.com` não está visível na lista de Auth Users
- Isso significa que o usuário existe apenas na tabela `organizations`, não em `auth.users`

---

## 🎯 Problema Principal: Usuário Sem Autenticação

O usuário `email@ponto.com` existe na tabela `organizations` mas **NÃO existe em `auth.users`**.

Para fazer login, o usuário precisa existir em **AMBAS** as tabelas:
1. ✅ `public.organizations` - Existe
2. ❌ `auth.users` - NÃO existe

---

## ✅ Solução 1: Criar Usuário com Senha Conhecida

### Opção A: Usar a Edge Function (RECOMENDADO)

1. **Faça login com um usuário demo primeiro**:
   - URL: `https://www.imdoc.com.br/teste-2412#/login`
   - Selecione: "Administrador / Gerente"
   - Email: `admin@imdoc.com.br` (usuário demo)
   - Senha: `102030`

2. **Navegue para Configurações → Equipe**

3. **Crie um novo usuário**:
   - Nome: `Administrador Teste`
   - Email: `admin.teste@imdoc.com.br`
   - Senha: Será gerada automaticamente
   - Role: `owner` ou `admin`
   - Unidade: Selecione qualquer

4. **Anote a senha temporária** que aparecerá na mensagem de sucesso

5. **Faça login com o novo usuário**:
   - Email: `admin.teste@imdoc.com.br`
   - Senha: [senha temporária gerada]

### Opção B: Criar Usuário Diretamente no Supabase Dashboard

1. **Acesse o Dashboard**:
   ```
   https://supabase.com/dashboard/project/ypbtyxhpbtnnwrbulnyg/auth/users
   ```

2. **Clique em "Add User"**

3. **Preencha os dados**:
   - Email: `admin.teste@imdoc.com.br`
   - Password: `102030` (ou qualquer senha que você queira)
   - Auto Confirm User: ✅ SIM

4. **Após criar, pegue o User ID** (UUID)

5. **Vá para Table Editor → `app_users`**

6. **Insira um registro**:
   ```json
   {
     "id": "[UUID do usuário criado]",
     "email": "admin.teste@imdoc.com.br",
     "full_name": "Administrador Teste",
     "role": "owner",
     "organization_id": "org_teste-2412",
     "unit_id": "[ID de alguma unidade]",
     "created_at": "now()"
   }
   ```

### Opção C: Usar SQL no Supabase

1. **Acesse SQL Editor**:
   ```
   https://supabase.com/dashboard/project/ypbtyxhpbtnnwrbulnyg/sql/new
   ```

2. **Execute este SQL**:
   ```sql
   -- Primeiro, criar o usuário no Auth
   -- NOTA: Isso precisa ser feito via Dashboard ou API Admin
   
   -- Depois, inserir na tabela app_users
   INSERT INTO public.app_users (
     id,
     email,
     full_name,
     role,
     organization_id,
     created_at
   ) VALUES (
     '[UUID do usuário criado no Auth]',
     'admin.teste@imdoc.com.br',
     'Administrador Teste',
     'owner',
     'org_teste-2412',
     now()
   );
   ```

---

## 🔍 Solução 2: Investigar Tela em Branco

### Passo 1: Verificar Erros no Console

1. **Abra a aplicação**:
   ```
   https://www.imdoc.com.br/teste-2412#/login
   ```

2. **Abra o DevTools** (F12)

3. **Vá para a aba Console**

4. **Procure por erros em vermelho**

**Erros comuns**:
- ❌ `Uncaught TypeError: Cannot read property...`
- ❌ `Failed to fetch`
- ❌ `CORS error`
- ❌ `Module not found`

### Passo 2: Verificar Network Tab

1. **Vá para a aba Network**

2. **Recarregue a página** (Ctrl+R ou Cmd+R)

3. **Procure por requisições falhadas** (em vermelho)

**Verificar**:
- ✅ `index.html` - Status 200
- ✅ `App.tsx` ou `main.js` - Status 200
- ✅ Requisições para Supabase - Status 200

### Passo 3: Verificar se o Dev Server está Rodando

No terminal, verifique se você vê:
```
VITE v... ready in ...ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Se não estiver rodando:
```bash
cd "/Users/mimaejack/Library/Mobile Documents/com~apple~CloudDocs/diva-spa-wise"
npm run dev
```

### Passo 4: Limpar Cache

1. **No navegador**:
   - Abra DevTools (F12)
   - Clique com botão direito no ícone de reload
   - Selecione "Empty Cache and Hard Reload"

2. **Ou use atalho**:
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`

---

## 🎯 Solução Rápida (RECOMENDADA)

### Passo a Passo:

1. **Criar novo usuário via Dashboard do Supabase**:
   - Vá para: Authentication → Users → Add User
   - Email: `teste@imdoc.com.br`
   - Password: `102030`
   - Auto Confirm: ✅ SIM
   - Clique em "Create User"

2. **Copiar o User ID** (UUID gerado)

3. **Criar registro em `app_users`**:
   - Vá para: Table Editor → `app_users` → Insert → Insert row
   - Preencha:
     ```
     id: [UUID copiado]
     email: teste@imdoc.com.br
     full_name: Teste Admin
     role: owner
     organization_id: org_teste-2412
     ```
   - Clique em "Save"

4. **Testar login**:
   - URL: `https://www.imdoc.com.br/teste-2412#/login`
   - Email: `teste@imdoc.com.br`
   - Senha: `102030`

---

## 🐛 Debug da Tela em Branco

Se a tela continuar em branco após criar o usuário:

### 1. Verificar Build de Produção

A aplicação em `www.imdoc.com.br` está usando a versão deployada no Vercel.

**Verificar**:
```bash
# Ver último deploy
vercel ls

# Ver logs
vercel logs
```

### 2. Verificar Variáveis de Ambiente

No Vercel Dashboard:
1. Settings → Environment Variables
2. Verificar se existem:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 3. Re-deploy

Se necessário:
```bash
cd "/Users/mimaejack/Library/Mobile Documents/com~apple~CloudDocs/diva-spa-wise"
vercel --prod
```

---

## 📝 Checklist de Resolução

### Criar Usuário
- [ ] Acessar Supabase Dashboard
- [ ] Authentication → Users → Add User
- [ ] Email: `teste@imdoc.com.br`
- [ ] Password: `102030`
- [ ] Auto Confirm: SIM
- [ ] Copiar User ID
- [ ] Table Editor → `app_users` → Insert
- [ ] Preencher dados com User ID
- [ ] Save

### Testar Login
- [ ] Abrir: `https://www.imdoc.com.br/teste-2412#/login`
- [ ] Abrir DevTools (F12)
- [ ] Verificar Console (sem erros)
- [ ] Tentar login com novo usuário
- [ ] Verificar se entra no sistema

### Se Tela Continuar em Branco
- [ ] Verificar erros no Console
- [ ] Verificar Network tab
- [ ] Limpar cache do navegador
- [ ] Verificar variáveis de ambiente no Vercel
- [ ] Re-deploy se necessário

---

## 🔗 Links Úteis

- **Supabase Dashboard**: https://supabase.com/dashboard/project/ypbtyxhpbtnnwrbulnyg
- **Auth Users**: https://supabase.com/dashboard/project/ypbtyxhpbtnnwrbulnyg/auth/users
- **Table Editor**: https://supabase.com/dashboard/project/ypbtyxhpbtnnwrbulnyg/editor
- **Aplicação**: https://www.imdoc.com.br/teste-2412#/login

---

## 💡 Dica Final

**Para evitar problemas futuros**:

1. Sempre crie usuários usando a **Edge Function** (via interface da aplicação)
2. Isso garante que o usuário seja criado em **ambas** as tabelas
3. A senha temporária é gerada e mostrada automaticamente
4. Rollback automático em caso de erro

**Comando para criar usuário via Edge Function**:
- Login como admin demo → Configurações → Equipe → Convidar Membro

---

**Status**: Aguardando criação de usuário no Supabase  
**Próxima Ação**: Criar usuário e testar login
