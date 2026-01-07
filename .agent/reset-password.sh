#!/bin/bash

# Script para resetar senha de usuário no Supabase
# Este script permite definir uma nova senha para um usuário existente

echo "🔐 Reset de Senha - Supabase Auth"
echo "=================================="
echo ""

# Configurações
SUPABASE_URL="https://ypbtyxhpbtnnwrbulnyg.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwYnR5eGhwYnRubndyYnVsbnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIxMzgzMiwiZXhwIjoyMDgwNzg5ODMyfQ.4rvxLlCOdqJdEBCjCBOQGJdECbRKmXQFxOQJlMQJlMQ"

# Usuário
EMAIL="email@ponto.com"
NEW_PASSWORD="102030"

echo "📧 Email: ${EMAIL}"
echo "🔑 Nova Senha: ${NEW_PASSWORD}"
echo ""
echo "⚠️  ATENÇÃO: Este script requer a SERVICE_ROLE_KEY"
echo "   Você precisará obter a chave no Dashboard do Supabase:"
echo "   Settings → API → service_role key (secret)"
echo ""
echo "🔄 Para resetar a senha manualmente:"
echo "   1. Acesse: https://supabase.com/dashboard/project/ypbtyxhpbtnnwrbulnyg"
echo "   2. Vá em: Authentication → Users"
echo "   3. Encontre o usuário: ${EMAIL}"
echo "   4. Clique nos 3 pontos → Reset Password"
echo "   5. Ou use 'Send Magic Link' para enviar link de reset"
echo ""
echo "💡 SOLUÇÃO MAIS FÁCIL:"
echo "   Use a Edge Function create-user para criar um novo usuário com senha conhecida"
echo ""

# Nota: O comando abaixo NÃO funcionará sem a SERVICE_ROLE_KEY real
# echo "🔄 Tentando resetar senha..."
# curl -X PUT "${SUPABASE_URL}/auth/v1/admin/users/USER_ID" \
#   -H "apikey: ${SERVICE_ROLE_KEY}" \
#   -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
#   -H "Content-Type: application/json" \
#   -d "{\"password\": \"${NEW_PASSWORD}\"}"

echo "=================================="
echo "Script concluído!"
