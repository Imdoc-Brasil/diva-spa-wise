# 🗄️ Guia de Configuração do Supabase (Banco de Dados)

Para ativar o modo Profissional, siga os passos abaixo:

## 1. Criar Projeto
1.  Acesse [database.new](https://database.new) (Supabase).
2.  Faça login com GitHub.
3.  Crie um novo projeto (ex: `diva-spa-prod`).
4.  Defina uma senha forte para o banco (guarde-a).

## 2. Obter Credenciais
1.  No dashboard do projeto, vá em **Project Settings** (ícone de engrenagem) > **API**.
2.  Copie a URL do projeto (`Project URL`).
3.  Copie a chave `anon` (`public`).

## 3. Configurar Ambiente Local
1.  Abra o arquivo `.env.local` na raiz do projeto.
2.  Substitua os valores de exemplo:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

## 4. Instalar Dependência
No terminal do projeto, execute:
```bash
npm install @supabase/supabase-js
```

## 5. Próximos Passos (Migração)
Após conectar, o sistema precisará criar as tabelas.
O agente (eu) criará um script de migração automática na próxima etapa.
