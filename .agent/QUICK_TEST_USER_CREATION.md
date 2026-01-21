# 🎯 Teste Rápido - Criação de Usuário

## ✅ Status da Edge Function
- **Deployada**: ✅ Sim (Version 2)
- **Status**: ✅ ACTIVE
- **Respondendo**: ✅ Sim (validação de auth funcionando)

---

## 🚀 Teste em 5 Passos

### 1. Abrir a Aplicação
```
https://www.imdoc.com.br/teste-2412#/login
```

### 2. Fazer Login
- **Email**: `admin@imdoc.com.br`
- **Senha**: `102030`

### 3. Ir para Configurações → Equipe
- Clique no ícone ⚙️ (Configurações)
- Clique na aba "Equipe"

### 4. Convidar Novo Membro
- Clique em "Convidar Membro"
- Preencha:
  - **Nome**: `Teste Edge Function`
  - **Email**: `teste.edge@imdoc.com.br`
  - **Role**: Qualquer
  - **Unidade**: Qualquer
- Clique em "Enviar"

### 5. Verificar Resultado
- ✅ **Sucesso**: Mensagem com senha temporária
- ❌ **Erro**: Veja a seção de troubleshooting abaixo

---

## 🔍 O que Observar

### Console do Navegador (F12)
Abra o console e procure por:
```
✅ "Calling Edge Function create-user..."
✅ "User created successfully"
```

### Network Tab
Procure pela requisição `create-user`:
- **Status esperado**: `200 OK`
- **Response**: `{ success: true, user: {...}, temporaryPassword: "..." }`

---

## 🐛 Troubleshooting Rápido

### Erro: "Unauthorized"
→ Faça logout e login novamente

### Erro: "Permission denied"
→ Use um usuário com role `owner` ou `admin`

### Erro: "Email already exists"
→ Use outro email: `teste.edge2@imdoc.com.br`

### Erro 500 ou timeout
→ Verifique logs:
```bash
supabase functions logs create-user
```

---

## 📋 Checklist Rápido

- [ ] Login funcionou
- [ ] Acessou configurações
- [ ] Abriu formulário de convite
- [ ] Preencheu dados
- [ ] Submeteu formulário
- [ ] Recebeu mensagem de sucesso
- [ ] Viu senha temporária
- [ ] Novo usuário aparece na lista

---

## 📞 Comandos Úteis

### Ver logs da Edge Function
```bash
supabase functions logs create-user
```

### Ver status da Edge Function
```bash
supabase functions list
```

### Re-deploy (se necessário)
```bash
supabase functions deploy create-user
```

---

**Guia completo**: `.agent/USER_CREATION_TEST_GUIDE.md`
