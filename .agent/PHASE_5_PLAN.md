# 🎯 Fase 5: Organização de Serviços - PLANO

**Início:** 22/01/2026 14:21  
**Branch:** `refactor/phase-5-services`  
**Status:** 🟡 Planejamento

---

## 📋 OBJETIVO DA FASE 5

Organizar e padronizar serviços de API:
- Criar estrutura organizada
- Estabelecer padrões de API
- Melhorar error handling
- Adicionar tipos consistentes
- Criar interceptors
- Documentar serviços

---

## 🔍 SERVIÇOS IDENTIFICADOS

### Serviços Existentes
```
services/
├── asaasService.ts (8.5KB)
├── documentServices.ts (10KB)
├── migrationService.ts (12KB)
├── supabase.ts (584B)
├── userService.ts (2.7KB)
└── saas/
    ├── AutomationService.ts
    ├── OnboardingService.ts
    ├── PlansService.ts
    └── SaaSLeadsService.ts
```

---

## 🎯 ESTRATÉGIA

### Fase 5A: Análise e Estrutura (30min)
1. Analisar serviços existentes
2. Identificar padrões comuns
3. Definir estrutura de pastas
4. Criar base classes

### Fase 5B: Criar Infraestrutura (1h)
```
services/
├── index.ts              # Barrel export
├── base/
│   ├── ApiClient.ts      # Cliente HTTP base
│   ├── ApiError.ts       # Error handling
│   └── types.ts          # Tipos comuns
├── api/
│   ├── supabase.ts       # Supabase client
│   └── asaas.ts          # Asaas integration
├── auth/
│   └── userService.ts    # Mover
├── documents/
│   └── documentService.ts # Mover
├── saas/                 # Já existe
│   ├── AutomationService.ts
│   ├── OnboardingService.ts
│   ├── PlansService.ts
│   └── SaaSLeadsService.ts
└── utils/
    └── migrationService.ts # Mover
```

### Fase 5C: Criar Base Classes (1h)
1. ApiClient base
2. ApiError customizado
3. Tipos comuns
4. Interceptors

### Fase 5D: Refatorar Serviços (1-2h)
1. Mover serviços para pastas
2. Aplicar padrões
3. Melhorar error handling
4. Adicionar tipos

### Fase 5E: Documentação (30min)
1. README.md
2. Exemplos de uso
3. Padrões de API

---

## 📊 SERVIÇOS A CRIAR

### 1. ApiClient (Base)
```typescript
export class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    // Implementation
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    // Implementation
  }
  
  async put<T>(endpoint: string, data: any): Promise<T> {
    // Implementation
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    // Implementation
  }
}
```

### 2. ApiError (Custom Error)
```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### 3. Tipos Comuns
```typescript
export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

## 🎯 PRIORIDADES

### Alta Prioridade (Fazer Agora)
1. ✅ Criar estrutura de pastas
2. ✅ Criar ApiClient base
3. ✅ Criar ApiError
4. ✅ Criar tipos comuns
5. ✅ Mover serviços existentes

### Média Prioridade (Se houver tempo)
1. Criar interceptors
2. Adicionar retry logic
3. Adicionar cache
4. Melhorar logging

### Baixa Prioridade (Futuro)
1. Criar mocks para testes
2. Adicionar rate limiting
3. Criar service workers
4. Otimizações avançadas

---

## 📋 CHECKLIST

### Preparação
- [x] Criar branch refactor/phase-5-services
- [x] Analisar serviços existentes
- [ ] Criar estrutura de pastas
- [ ] Criar README.md

### Infraestrutura
- [ ] Criar ApiClient base
- [ ] Criar ApiError
- [ ] Criar tipos comuns
- [ ] Criar barrel export

### Migração
- [ ] Mover userService
- [ ] Mover documentServices
- [ ] Mover migrationService
- [ ] Organizar saas services

### Melhorias
- [ ] Adicionar error handling
- [ ] Adicionar tipos
- [ ] Melhorar logging
- [ ] Documentar APIs

### Documentação
- [ ] Criar README.md
- [ ] Documentar cada serviço
- [ ] Criar exemplos
- [ ] Atualizar imports

---

## ⏱️ ESTIMATIVAS

| Atividade | Tempo Estimado |
|-----------|----------------|
| Análise | 30min |
| Estrutura | 30min |
| Base classes | 1h |
| Migração | 1h |
| Melhorias | 30min |
| Documentação | 30min |
| **Total** | **4h** |

---

## 🎯 META

**Organizar e padronizar todos os serviços de API**

**Criar:**
- Estrutura organizada por domínio
- Base classes reutilizáveis
- Error handling consistente
- Tipos bem definidos
- Documentação completa

**Benefícios:**
- Código mais consistente
- Fácil adicionar novos serviços
- Error handling melhorado
- Type-safe
- Bem documentado

---

**Criado:** 22/01/2026 14:21  
**Status:** 🟡 Pronto para começar  
**Próximo:** Criar estrutura de pastas
