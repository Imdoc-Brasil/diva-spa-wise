# 🎯 Fase 4: Organização de Hooks - PLANO

**Início:** 22/01/2026 12:40  
**Branch:** `refactor/phase-4-hooks`  
**Status:** 🟡 Planejamento

---

## 📋 OBJETIVO DA FASE 4

Organizar e consolidar hooks customizados do projeto:
- Identificar hooks duplicados
- Criar hooks reutilizáveis
- Organizar por domínio
- Melhorar performance
- Estabelecer padrões

---

## 🔍 HOOKS IDENTIFICADOS

### Hooks Existentes
1. `hooks/useOrganizationSlug.ts` - Detecção de organização
2. `hooks/useDataIsolation.ts` - Isolamento de dados
3. `components/hooks/useUnitData.ts` - Dados da unidade
4. `components/modules/saas/hooks/useSaaSLeads.ts` - Leads SaaS

### Hooks Potenciais (a criar)
1. `useAuth` - Autenticação
2. `useUser` - Dados do usuário
3. `usePermissions` - Permissões
4. `useLocalStorage` - Storage local
5. `useDebounce` - Debounce
6. `useAsync` - Operações assíncronas
7. `useForm` - Gestão de formulários
8. `useToast` - Notificações (já existe no ToastContext)

---

## 🎯 ESTRATÉGIA

### Fase 4A: Análise e Organização (1h)
1. Analisar hooks existentes
2. Identificar duplicações
3. Mapear dependências
4. Definir estrutura de pastas

### Fase 4B: Criação de Estrutura (30min)
```
hooks/
├── index.ts              # Barrel export
├── auth/
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── usePermissions.ts
├── data/
│   ├── useOrganizationSlug.ts (mover)
│   ├── useDataIsolation.ts (mover)
│   └── useUnitData.ts (mover)
├── saas/
│   └── useSaaSLeads.ts (mover)
├── ui/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
└── utils/
    ├── useAsync.ts
    └── useForm.ts
```

### Fase 4C: Migração e Criação (2-3h)
1. Mover hooks existentes
2. Criar hooks novos
3. Atualizar imports
4. Testar funcionamento

### Fase 4D: Documentação (30min)
1. Documentar cada hook
2. Criar exemplos de uso
3. Atualizar README

---

## 📊 HOOKS A CRIAR

### 1. useAuth (Alta Prioridade)
```typescript
export const useAuth = () => {
  const { user, login, logout } = useData();
  const isAuthenticated = !!user;
  const hasRole = (role: UserRole) => user?.role === role;
  
  return {
    user,
    isAuthenticated,
    hasRole,
    login,
    logout
  };
};
```

### 2. useDebounce (Alta Prioridade)
```typescript
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

### 3. useLocalStorage (Média Prioridade)
```typescript
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue] as const;
};
```

### 4. useAsync (Média Prioridade)
```typescript
export const useAsync = <T>(asyncFunction: () => Promise<T>) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
    } catch (error) {
      setError(error as Error);
      setStatus('error');
    }
  }, [asyncFunction]);
  
  return { execute, status, data, error };
};
```

---

## 🎯 PRIORIDADES

### Alta Prioridade (Fazer Agora)
1. ✅ Criar estrutura de pastas
2. ✅ Mover hooks existentes
3. ✅ Criar useAuth
4. ✅ Criar useDebounce
5. ✅ Atualizar imports principais

### Média Prioridade (Se houver tempo)
1. Criar useLocalStorage
2. Criar useAsync
3. Criar useMediaQuery
4. Documentar todos os hooks

### Baixa Prioridade (Futuro)
1. Criar useForm
2. Criar hooks de validação
3. Criar hooks de API

---

## 📋 CHECKLIST

### Preparação
- [x] Criar branch refactor/phase-4-hooks
- [x] Analisar hooks existentes
- [ ] Criar estrutura de pastas
- [ ] Criar README.md em hooks/

### Migração
- [ ] Mover useOrganizationSlug
- [ ] Mover useDataIsolation
- [ ] Mover useUnitData
- [ ] Mover useSaaSLeads

### Criação
- [ ] Criar useAuth
- [ ] Criar useDebounce
- [ ] Criar useLocalStorage (opcional)
- [ ] Criar useAsync (opcional)

### Atualização
- [ ] Atualizar imports em componentes
- [ ] Criar barrel export (index.ts)
- [ ] Testar compilação

### Documentação
- [ ] Documentar cada hook
- [ ] Criar exemplos
- [ ] Atualizar README principal

---

## ⏱️ ESTIMATIVAS

| Atividade | Tempo Estimado |
|-----------|----------------|
| Análise | 30min |
| Estrutura | 30min |
| Migração | 1h |
| Criação | 1-2h |
| Testes | 30min |
| Documentação | 30min |
| **Total** | **4-5h** |

---

## 🎯 META

**Reduzir duplicação e melhorar organização dos hooks**

**Criar:**
- Estrutura organizada por domínio
- 4-6 hooks novos
- Documentação completa
- Barrel exports

**Benefícios:**
- Código mais reutilizável
- Melhor organização
- Fácil de encontrar
- Padrões estabelecidos

---

**Criado:** 22/01/2026 12:40  
**Status:** 🟡 Pronto para começar  
**Próximo:** Criar estrutura de pastas
