# 📐 Guia de Estilo e Padrões - AptaFlow

**Versão:** 1.0  
**Data:** 21 de Janeiro de 2026

---

## 🎯 Objetivo

Este documento define os padrões de código, nomenclatura e organização que devem ser seguidos durante e após a refatoração do AptaFlow.

---

## 📁 Estrutura de Arquivos

### Nomenclatura de Arquivos

#### Componentes React
```
✅ PascalCase para componentes
- ClientModal.tsx
- UserProfile.tsx
- DashboardLayout.tsx

❌ Evitar:
- clientModal.tsx
- user-profile.tsx
- dashboard_layout.tsx
```

#### Hooks
```
✅ camelCase com prefixo 'use'
- useAuth.ts
- useClients.ts
- useDebounce.ts

❌ Evitar:
- UseAuth.ts
- auth-hook.ts
- authHook.ts
```

#### Utilitários e Serviços
```
✅ camelCase
- dateUtils.ts
- clientService.ts
- formatters.ts

❌ Evitar:
- DateUtils.ts
- client-service.ts
- Formatters.ts
```

#### Types e Interfaces
```
✅ camelCase para arquivos, PascalCase para tipos
- auth.ts → export interface User
- client.ts → export interface Client
- appointment.ts → export interface Appointment

❌ Evitar:
- Auth.ts
- types-client.ts
- appointment_types.ts
```

---

## 🗂️ Organização de Pastas

### Estrutura Padrão por Feature

```
feature/
├── index.ts                    # Barrel export
├── FeatureComponent.tsx        # Componente principal
├── components/                 # Subcomponentes
│   ├── FeatureHeader.tsx
│   ├── FeatureBody.tsx
│   └── FeatureFooter.tsx
├── hooks/                      # Hooks específicos
│   ├── useFeatureData.ts
│   └── useFeatureValidation.ts
├── utils/                      # Utilitários específicos
│   └── featureHelpers.ts
├── types.ts                    # Tipos específicos (se necessário)
└── constants.ts                # Constantes específicas
```

### Exemplo Prático: SettingsModule

```
components/modules/settings/
├── index.ts
├── SettingsModule.tsx
├── components/
│   ├── GeneralSettings.tsx
│   ├── SecuritySettings.tsx
│   ├── BillingSettings.tsx
│   └── NotificationSettings.tsx
├── hooks/
│   ├── useSettings.ts
│   └── useSettingsValidation.ts
└── types.ts
```

---

## 💻 Padrões de Código

### Componentes React

#### Estrutura Padrão
```typescript
import React, { useState, useEffect } from 'react';
import { SomeType } from '@/types';
import { someUtil } from '@/utils';
import { useSomeHook } from '@/hooks';

// 1. Interfaces de Props
interface ComponentNameProps {
  id: string;
  name: string;
  onSave?: (data: SomeType) => void;
  className?: string;
}

// 2. Componente
export function ComponentName({
  id,
  name,
  onSave,
  className = ''
}: ComponentNameProps) {
  // 2.1. Hooks
  const [state, setState] = useState<SomeType | null>(null);
  const { data, loading } = useSomeHook(id);

  // 2.2. Effects
  useEffect(() => {
    // Effect logic
  }, [id]);

  // 2.3. Handlers
  const handleSave = () => {
    if (onSave && state) {
      onSave(state);
    }
  };

  // 2.4. Early returns
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  // 2.5. Render
  return (
    <div className={className}>
      {/* JSX */}
    </div>
  );
}
```

#### Componentes Pequenos vs Grandes

```typescript
// ✅ Componente pequeno (< 100 linhas)
export function SimpleButton({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="btn">
      {label}
    </button>
  );
}

// ✅ Componente médio (100-300 linhas)
export function UserForm({ userId, onSave }: UserFormProps) {
  // Lógica de formulário
  // Validação
  // Handlers
  return (/* JSX */);
}

// ❌ Componente grande (> 300 linhas)
// DECOMPOR em subcomponentes!
```

---

### Hooks Customizados

#### Estrutura Padrão
```typescript
import { useState, useEffect } from 'react';
import { SomeType } from '@/types';
import { someService } from '@/services';

/**
 * Hook para gerenciar dados de clientes
 * @param clientId - ID do cliente
 * @returns Dados do cliente, loading state e funções de atualização
 * @example
 * const { client, loading, updateClient } = useClient('123');
 */
export function useClient(clientId: string) {
  const [client, setClient] = useState<SomeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadClient();
  }, [clientId]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const data = await someService.getClient(clientId);
      setClient(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (updates: Partial<SomeType>) => {
    // Update logic
  };

  return {
    client,
    loading,
    error,
    updateClient,
    refresh: loadClient
  };
}
```

---

### Serviços

#### Estrutura Padrão
```typescript
import { supabase } from './supabase';
import { Client, CreateClientData } from '@/types';

/**
 * Serviço para gerenciar operações de clientes
 */
export const clientService = {
  /**
   * Busca todos os clientes da organização
   * @param organizationId - ID da organização
   * @returns Lista de clientes
   */
  async getClients(organizationId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) throw error;
    return data || [];
  },

  /**
   * Cria um novo cliente
   * @param clientData - Dados do cliente
   * @returns Cliente criado
   */
  async createClient(clientData: CreateClientData): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ... outros métodos
};
```

---

## 🏷️ Nomenclatura

### Variáveis e Constantes

```typescript
// ✅ camelCase para variáveis
const userName = 'John';
const isActive = true;
const totalAmount = 100;

// ✅ UPPER_SNAKE_CASE para constantes
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;

// ✅ Nomes descritivos
const filteredActiveClients = clients.filter(c => c.isActive);

// ❌ Nomes vagos
const temp = clients.filter(c => c.isActive);
const data = fetchData();
const x = calculateTotal();
```

### Funções

```typescript
// ✅ Verbos para ações
function calculateTotal() { }
function fetchUserData() { }
function validateEmail() { }

// ✅ is/has para booleanos
function isValid() { }
function hasPermission() { }
function canEdit() { }

// ✅ get/set para getters/setters
function getUser() { }
function setUser() { }

// ❌ Nomes vagos
function process() { }
function handle() { }
function doStuff() { }
```

### Tipos e Interfaces

```typescript
// ✅ PascalCase
interface User { }
type UserRole = 'admin' | 'user';
interface CreateUserData { }

// ✅ Sufixos descritivos
interface UserFormProps { }
type UserStatus = 'active' | 'inactive';
interface UserRepository { }

// ❌ Prefixos desnecessários
interface IUser { }  // Não usar I
type TUserRole { }   // Não usar T
```

---

## 📝 Comentários e Documentação

### JSDoc para Funções Públicas

```typescript
/**
 * Calcula o desconto aplicado ao preço
 * 
 * @param price - Preço original em reais
 * @param discountPercentage - Percentual de desconto (0-100)
 * @returns Preço com desconto aplicado
 * 
 * @throws {Error} Se o percentual for inválido
 * 
 * @example
 * ```typescript
 * const finalPrice = calculateDiscount(100, 10);
 * console.log(finalPrice); // 90
 * ```
 */
export function calculateDiscount(
  price: number,
  discountPercentage: number
): number {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error('Invalid discount percentage');
  }
  return price * (1 - discountPercentage / 100);
}
```

### Comentários Inline

```typescript
// ✅ Comentários úteis
// HACK: Workaround temporário para bug do Safari
// TODO: Refatorar para usar novo hook
// FIXME: Corrigir validação de CPF
// NOTE: Este cálculo segue a regra de negócio X

// ❌ Comentários óbvios
// Incrementa o contador
counter++;

// Retorna o usuário
return user;
```

---

## 🎨 Formatação

### Imports

```typescript
// 1. Imports de bibliotecas externas
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Imports de tipos
import type { User, Client } from '@/types';

// 3. Imports de serviços
import { clientService } from '@/services';

// 4. Imports de hooks
import { useAuth } from '@/hooks';

// 5. Imports de componentes
import { Button } from '@/components/ui';

// 6. Imports de utilitários
import { formatDate } from '@/utils';

// 7. Imports relativos (evitar quando possível)
import { LocalComponent } from './LocalComponent';
```

### Ordenação de Propriedades

```typescript
// ✅ Ordem lógica
interface User {
  // IDs primeiro
  id: string;
  organizationId: string;
  
  // Dados principais
  name: string;
  email: string;
  
  // Dados secundários
  phone?: string;
  avatar?: string;
  
  // Status e flags
  isActive: boolean;
  role: UserRole;
  
  // Timestamps por último
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔧 TypeScript

### Tipagem Forte

```typescript
// ✅ Sempre tipar parâmetros e retornos
function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ Evitar any
function processData(data: any) {  // Não fazer!
  // ...
}

// ✅ Usar unknown quando tipo é desconhecido
function processData(data: unknown) {
  if (typeof data === 'string') {
    // TypeScript sabe que é string aqui
  }
}
```

### Tipos vs Interfaces

```typescript
// ✅ Interface para objetos que podem ser estendidos
interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}

// ✅ Type para unions, intersections, primitivos
type UserRole = 'admin' | 'user' | 'guest';
type UserWithRole = User & { role: UserRole };
```

### Generics

```typescript
// ✅ Usar generics para reutilização
function fetchData<T>(url: string): Promise<T> {
  // ...
}

const users = await fetchData<User[]>('/users');
const client = await fetchData<Client>('/client/123');
```

---

## ⚡ Performance

### Memoização

```typescript
// ✅ Usar React.memo para componentes puros
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{/* Render pesado */}</div>;
});

// ✅ Usar useMemo para cálculos pesados
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// ✅ Usar useCallback para funções passadas como props
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Lazy Loading

```typescript
// ✅ Lazy load de rotas
const Dashboard = lazy(() => import('./components/Dashboard'));
const Settings = lazy(() => import('./components/Settings'));

// ✅ Usar Suspense
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

---

## 🧪 Testes (Futuro)

### Nomenclatura de Testes

```typescript
// ✅ Padrão: describe > it/test
describe('calculateDiscount', () => {
  it('should apply discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  it('should throw error for invalid percentage', () => {
    expect(() => calculateDiscount(100, 150)).toThrow();
  });
});
```

---

## 📦 Exports

### Barrel Exports

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
export { Card } from './Card';

// Uso:
import { Button, Input, Modal } from '@/components/ui';
```

### Named vs Default Exports

```typescript
// ✅ Preferir named exports
export function Button() { }
export const config = { };

// ✅ Default export apenas para componentes principais
export default function App() { }

// ❌ Evitar default exports em arquivos com múltiplas exportações
```

---

## 🚫 Anti-Padrões a Evitar

### 1. God Components
```typescript
// ❌ Componente fazendo tudo
function MegaComponent() {
  // 1000+ linhas
  // Múltiplas responsabilidades
  // Difícil de testar
}

// ✅ Decompor em subcomponentes
function Header() { }
function Body() { }
function Footer() { }
function MegaComponent() {
  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
}
```

### 2. Prop Drilling
```typescript
// ❌ Passar props por muitos níveis
<A prop={x}>
  <B prop={x}>
    <C prop={x}>
      <D prop={x} />
    </C>
  </B>
</A>

// ✅ Usar Context ou hooks
const value = useContext(MyContext);
```

### 3. Lógica em JSX
```typescript
// ❌ Lógica complexa no render
return (
  <div>
    {data.filter(x => x.active).map(x => x.value).join(', ')}
  </div>
);

// ✅ Extrair para variável
const activeValues = data
  .filter(x => x.active)
  .map(x => x.value)
  .join(', ');

return <div>{activeValues}</div>;
```

---

## ✅ Checklist de Code Review

Antes de fazer commit, verificar:

- [ ] Código segue padrões de nomenclatura
- [ ] Componentes < 300 linhas
- [ ] Funções < 50 linhas
- [ ] Tipos definidos corretamente
- [ ] JSDoc em funções públicas
- [ ] Sem console.logs
- [ ] Sem código comentado
- [ ] Imports organizados
- [ ] Sem duplicação de código
- [ ] Tratamento de erros adequado

---

**Este guia é vivo e deve ser atualizado conforme o projeto evolui.**

**Última atualização:** 21/01/2026
