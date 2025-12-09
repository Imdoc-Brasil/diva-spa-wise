# Configurando Domínio Personalizado (imdoc.com.br)

Para usar seu domínio próprio (`imdoc.com.br`) ao invés do subdomínio da Vercel, siga estes passos:

## 1. Configuração na Vercel

1. Acesse o **Dashboard da Vercel**.
2. Vá para o seu projeto (`diva-spa-wise`).
3. Clique na aba **Settings** > **Domains**.
4. Digite o domínio que deseja usar (ex: `imdoc.com.br`) e clique em **Add**.
5. A Vercel mostrará os registros DNS que você precisa configurar (Geralmente um registro **A** apontando para `76.76.21.21` ou um **CNAME** para `cname.vercel-dns.com`).

## 2. Configuração no Registro de Domínio (Registro.br, GoDaddy, etc)

1. Acesse onde você comprou o domínio.
2. Vá para a zona de edição de DNS.
3. Adicione os registros indicados pela Vercel no passo anterior.
4. Aguarde a propagação (pode levar de 1 a 24 horas, mas geralmente é rápido).

## 3. Configuração CRÍTICA no Supabase (Auth)

Para que o login e o cadastro continuem funcionando, você precisa autorizar o novo domínio no Supabase:

1. Acesse o **Dashboard do Supabase**.
2. Vá para **Authentication** > **URL Configuration**.
3. Em **Site URL**, coloque o seu novo domínio principal: `https://imdoc.com.br`
4. Em **Redirect URLs**, adicione:
   - `https://imdoc.com.br/**`
   - `https://imdoc.com.br/auth/callback` (se estiver usando fluxo de PKCE/Callback)

**Se você não fizer isso, os usuários não conseguirão fazer login ou redefinir senha, pois o Supabase bloqueará o redirecionamento para um domínio desconhecido.**

## 4. Atualização de Links de Email (Opcional)

Se o sistema envia emails com links (convites, reset de senha), verifique se eles estão usando alguma variável de ambiente para montar o link. Se estiverem, atualize a variável `NEXT_PUBLIC_SITE_URL` (ou equivalente) no painel da Vercel para o novo domínio.
