# 🎯 Quick Start: Deploy Edge Function

## Comandos Rápidos

### 1. Instalar Supabase CLI (se ainda não tiver)
```bash
brew install supabase/tap/supabase
```

### 2. Login
```bash
supabase login
```

### 3. Linkar Projeto
```bash
cd "/Users/mimaejack/Library/Mobile Documents/com~apple~CloudDocs/diva-spa-wise"
supabase link --project-ref YOUR_PROJECT_REF
```

**Como encontrar o PROJECT_REF:**
- Acesse: https://app.supabase.com/
- Abra seu projeto
- O `project-ref` está na URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`

### 4. Deploy da Edge Function
```bash
supabase functions deploy create-user
```

### 5. Verificar
```bash
supabase functions list
```

Você deve ver:
```
┌─────────────┬────────────┬─────────────┐
│ NAME        │ VERSION    │ STATUS      │
├─────────────┼────────────┼─────────────┤
│ create-user │ v1         │ ACTIVE      │
└─────────────┴────────────┴─────────────┘
```

## ✅ Pronto!

Agora você pode testar criando um novo usuário em:
`https://www.imdoc.com.br/teste-2412#/settings` → Equipe → Convidar Membro

---

## 🐛 Troubleshooting

### Erro: "Project ref not found"
Execute novamente o comando link com o project-ref correto.

### Erro: "Not logged in"
Execute `supabase login` novamente.

### Erro: "Function already exists"
Isso é normal. A função será atualizada automaticamente.

---

Para mais detalhes, veja: `.agent/EDGE_FUNCTION_IMPLEMENTATION.md`
