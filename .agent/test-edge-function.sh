#!/bin/bash

# Script para testar a Edge Function create-user
# Este script faz uma chamada direta à Edge Function para verificar se está funcionando

echo "🧪 Testando Edge Function: create-user"
echo "========================================"
echo ""

# Configurações
SUPABASE_URL="https://ypbtyxhpbtnnwrbulnyg.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwYnR5eGhwYnRubndyYnVsbnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTM4MzIsImV4cCI6MjA4MDc4OTgzMn0.jFGcYaLZoapUJnc0fZCebL73aN2gcsUlyrbawdNvStU"

echo "📍 URL: ${SUPABASE_URL}/functions/v1/create-user"
echo ""

# Nota: Este teste vai falhar com "Unauthorized" porque não temos um token de usuário válido
# Mas isso é esperado e confirma que a Edge Function está ativa e respondendo

echo "🔄 Fazendo requisição de teste..."
echo ""

response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST \
  "${SUPABASE_URL}/functions/v1/create-user" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "role": "professional",
    "unitId": "test-unit"
  }')

# Separar body e status code
http_body=$(echo "$response" | sed -e 's/HTTP_STATUS\:.*//g')
http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

echo "📊 Resultado:"
echo "-------------"
echo "Status Code: ${http_status}"
echo ""
echo "Response Body:"
echo "${http_body}" | jq '.' 2>/dev/null || echo "${http_body}"
echo ""

# Interpretar resultado
if [ "$http_status" = "401" ]; then
    echo "✅ Edge Function está ATIVA e respondendo!"
    echo "   (401 Unauthorized é esperado sem token válido)"
    echo ""
    echo "✨ Próximo passo: Testar através da interface web com usuário autenticado"
elif [ "$http_status" = "200" ]; then
    echo "✅ Edge Function funcionou perfeitamente!"
    echo "   Usuário foi criado com sucesso"
elif [ "$http_status" = "404" ]; then
    echo "❌ Edge Function NÃO encontrada!"
    echo "   Verifique se o deploy foi bem-sucedido"
elif [ "$http_status" = "500" ]; then
    echo "⚠️  Edge Function retornou erro 500"
    echo "   Verifique os logs: supabase functions logs create-user"
else
    echo "⚠️  Status inesperado: ${http_status}"
fi

echo ""
echo "========================================"
echo "Teste concluído!"
