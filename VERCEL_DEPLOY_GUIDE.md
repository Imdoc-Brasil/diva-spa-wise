# 🚀 Guia de Deploy no Vercel - Diva Spa CRM

## ⚡ Deploy Rápido (Método Recomendado)

### Passo 1: Preparar o Projeto

```bash
cd "/Users/mimaejack/Library/Mobile Documents/com~apple~CloudDocs/diva-spa-wise"
```

### Passo 2: Instalar Vercel CLI (se ainda não tiver)

```bash
npm install -g vercel
```

### Passo 3: Fazer Login no Vercel

```bash
vercel login
```

Siga as instruções no navegador para fazer login.

### Passo 4: Deploy!

```bash
vercel
```

**Responda as perguntas:**
- Set up and deploy? → **Y** (Yes)
- Which scope? → Selecione sua conta
- Link to existing project? → **N** (No)
- What's your project's name? → **diva-spa-crm** (ou o nome que preferir)
- In which directory is your code located? → **./** (pressione Enter)
- Want to override the settings? → **N** (No)

O Vercel vai:
1. ✅ Detectar que é um projeto Vite
2. ✅ Fazer o build automaticamente
3. ✅ Fazer o deploy
4. ✅ Te dar uma URL: `https://diva-spa-crm-xxx.vercel.app`

### Passo 5: Deploy para Produção

```bash
vercel --prod
```

Isso vai fazer o deploy final e te dar a URL de produção!

---

## 🌐 Método Alternativo: Deploy via GitHub

### Passo 1: Criar Repositório no GitHub

1. Vá em https://github.com/new
2. Nome: `diva-spa-crm`
3. Privado ou Público (sua escolha)
4. Clique em "Create repository"

### Passo 2: Conectar Projeto ao GitHub

```bash
cd "/Users/mimaejack/Library/Mobile Documents/com~apple~CloudDocs/diva-spa-wise"

# Inicializar git (se ainda não foi)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Diva Spa CRM Demo"

# Adicionar remote (substitua SEU-USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU-USUARIO/diva-spa-crm.git

# Push
git branch -M main
git push -u origin main
```

### Passo 3: Conectar Vercel ao GitHub

1. Vá em https://vercel.com
2. Clique em "New Project"
3. Clique em "Import Git Repository"
4. Selecione seu repositório `diva-spa-crm`
5. Clique em "Import"
6. **Framework Preset:** Vite
7. **Build Command:** `npm run build` (já preenchido)
8. **Output Directory:** `dist` (já preenchido)
9. Clique em "Deploy"

Pronto! Vercel vai fazer o build e deploy automaticamente.

---

## 📝 Configurações Importantes

### vercel.json (Opcional - para configurações avançadas)

Crie um arquivo `vercel.json` na raiz do projeto:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Isso garante que o roteamento funcione corretamente.

---

## ✅ Checklist Pré-Deploy

Antes de fazer o deploy, verifique:

- [x] Banner de demonstração adicionado ✅
- [ ] Build local funciona: `npm run build`
- [ ] Preview local funciona: `npm run preview`
- [ ] Sem erros no console
- [ ] Todas as rotas funcionam
- [ ] Responsivo em mobile

### Testar Build Local

```bash
# Build
npm run build

# Preview (testa a versão de produção localmente)
npm run preview
```

Abra http://localhost:4173 e teste!

---

## 🎯 Após o Deploy

### URL da Demo

Você receberá uma URL como:
```
https://diva-spa-crm-xxx.vercel.app
```

### Compartilhar

Você pode compartilhar esta URL para:
- ✅ Investidores
- ✅ Stakeholders
- ✅ Testers beta
- ✅ Coletar feedback

### ⚠️ IMPORTANTE: Avisos

Sempre mencione ao compartilhar:
1. **"Esta é uma versão de demonstração"**
2. **"Os dados não são salvos permanentemente"**
3. **"Ao recarregar a página, os dados voltam ao estado inicial"**
4. **"Não usar com dados reais de clientes"**

---

## 🔧 Atualizações Futuras

### Deploy Automático (se usou GitHub)

Toda vez que você fizer push no GitHub, o Vercel vai:
1. Detectar o push
2. Fazer build automaticamente
3. Fazer deploy
4. Atualizar a URL

### Deploy Manual

```bash
# Fazer mudanças no código
# ...

# Deploy
vercel --prod
```

---

## 🌍 Domínio Personalizado (Opcional)

Se você tiver um domínio próprio:

1. Vá em https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em "Settings" → "Domains"
4. Adicione seu domínio (ex: demo.divaspa.com.br)
5. Configure os DNS conforme instruções

---

## 📊 Analytics (Opcional)

Vercel oferece analytics gratuito:

1. Vá em seu projeto no Vercel
2. Aba "Analytics"
3. Veja:
   - Número de visitantes
   - Páginas mais acessadas
   - Performance
   - Erros

---

## 🐛 Troubleshooting

### Erro: "Command not found: npm"

Instale o Node.js: https://nodejs.org

### Erro: "Build failed"

```bash
# Limpar cache
rm -rf node_modules
rm package-lock.json

# Reinstalar
npm install

# Tentar build novamente
npm run build
```

### Erro: "Routes not working"

Adicione o arquivo `vercel.json` com as configurações de rewrite (veja acima).

### Erro: "Page not found" ao recarregar

Isso é normal com HashRouter. Use o `vercel.json` para corrigir.

---

## 📞 Suporte

- Documentação Vercel: https://vercel.com/docs
- Suporte Vercel: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

---

## 🎉 Pronto!

Após seguir estes passos, sua demo estará online e acessível para qualquer pessoa com o link!

**Próximos Passos:**
1. Compartilhe a URL
2. Colete feedback
3. Comece a planejar o backend para versão de produção

---

**Boa sorte com sua demo! 🚀**
