# 🔌 Services

Serviços organizados para integração com APIs e gerenciamento de dados.

---

## 📁 Estrutura

```
services/
├── index.ts              # Barrel export
├── README.md             # Este arquivo
├── base/
│   ├── ApiError.ts       # Error handling customizado
│   └── types.ts          # Tipos comuns
├── auth/
│   └── (futuros serviços de autenticação)
├── documents/
│   └── (futuros serviços de documentos)
├── saas/
│   ├── AutomationService.ts
│   ├── OnboardingService.ts
│   ├── PlansService.ts
│   └── SaaSLeadsService.ts
├── utils/
│   └── (utilitários)
├── supabase.ts           # Cliente Supabase
├── userService.ts        # Serviço de usuários
├── asaasService.ts       # Integração Asaas
├── documentServices.ts   # Serviços de documentos
└── migrationService.ts   # Migrações
```

---

## 🎯 Base Classes

### ApiError

Classe de erro customizada com helpers úteis.

```typescript
import { ApiError } from '../services';

try {
  // API call
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.getUserMessage()); // Mensagem amigável
    
    if (error.is(401)) {
      // Redirecionar para login
    }
    
    if (error.isServerError()) {
      // Mostrar erro genérico
    }
  }
}
```

**Métodos:**
- `is(statusCode)` - Verifica status code específico
- `isClientError()` - Verifica se é erro 4xx
- `isServerError()` - Verifica se é erro 5xx
- `getUserMessage()` - Retorna mensagem amigável

---

## 📊 Tipos Comuns

### ApiResponse<T>

```typescript
interface ApiResponse<T> {
  data: T;
  error?: ApiError | null;
  status: number;
  message?: string;
}
```

### PaginatedResponse<T>

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

---

## 🔐 Serviços Disponíveis

### Supabase
Cliente Supabase configurado.

```typescript
import { supabase } from '../services';

const { data, error } = await supabase
  .from('users')
  .select('*');
```

### User Service
Gerenciamento de usuários.

```typescript
import { userService } from '../services';

const user = await userService.getUser(userId);
```

### Asaas Service
Integração com Asaas para pagamentos.

```typescript
import { asaasService } from '../services';

const payment = await asaasService.createPayment(data);
```

### Document Services
Gerenciamento de documentos.

```typescript
import { documentServices } from '../services';

const pdf = await documentServices.generatePDF(data);
```

---

## 🎯 Padrões de Uso

### 1. Sempre use barrel exports

```typescript
// ✅ Correto
import { ApiError, supabase } from '../services';

// ❌ Evite
import { ApiError } from '../services/base/ApiError';
import { supabase } from '../services/supabase';
```

### 2. Trate erros adequadamente

```typescript
try {
  const response = await apiCall();
  return response.data;
} catch (error) {
  if (error instanceof ApiError) {
    // Tratar erro de API
    console.error(error.getUserMessage());
  } else {
    // Erro desconhecido
    console.error('Erro inesperado:', error);
  }
  throw error;
}
```

### 3. Use tipos para responses

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<ApiResponse<User>> => {
  // Implementation
};
```

---

## 🚀 Próximos Serviços

Serviços planejados para futuras implementações:

- `AuthService` - Autenticação centralizada
- `CacheService` - Cache de requisições
- `LogService` - Logging centralizado
- `NotificationService` - Notificações push
- `AnalyticsService` - Analytics e tracking

---

## 📝 Contribuindo

Ao criar um novo serviço:

1. Coloque na pasta apropriada
2. Use `ApiError` para erros
3. Use tipos do `base/types.ts`
4. Exporte no `index.ts`
5. Documente neste README
6. Adicione exemplos de uso

---

## 🎯 Boas Práticas

### Error Handling
- Sempre use `ApiError` para erros de API
- Forneça mensagens amigáveis ao usuário
- Log erros para debugging

### Tipos
- Sempre defina tipos para requests e responses
- Use tipos do `base/types.ts` quando possível
- Evite `any`

### Organização
- Um serviço por arquivo
- Agrupe serviços relacionados em pastas
- Use barrel exports

---

**Última atualização:** 22/01/2026  
**Serviços disponíveis:** 8+  
**Status:** ✅ Organizado
