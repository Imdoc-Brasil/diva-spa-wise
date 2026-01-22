# 🪝 Custom Hooks

Hooks customizados organizados por domínio para reutilização em todo o projeto.

---

## 📁 Estrutura

```
hooks/
├── index.ts              # Barrel export
├── auth/
│   └── useAuth.ts        # Autenticação e permissões
├── data/
│   ├── useOrganizationSlug.ts
│   └── useDataIsolation.ts
├── ui/
│   ├── useDebounce.ts    # Debounce para inputs
│   └── useLocalStorage.ts # Persistência local
└── utils/
    └── (futuros hooks)
```

---

## 🔐 Auth Hooks

### useAuth

Hook de autenticação com helpers para verificação de roles.

```typescript
import { useAuth } from '../hooks';

const MyComponent = () => {
  const { user, isAuthenticated, hasRole, isAdmin, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (isAdmin()) {
    return <AdminPanel />;
  }

  if (hasRole('STAFF')) {
    return <StaffDashboard />;
  }

  return <UserDashboard />;
};
```

**Retorna:**
- `user` - Usuário atual ou null
- `isAuthenticated` - Boolean se está autenticado
- `hasRole(role)` - Verifica se tem role específico
- `isAdmin()` - Verifica se é MASTER ou ADMIN
- `isStaff()` - Verifica se é MASTER, ADMIN ou STAFF
- `login(credentials)` - Função de login
- `logout()` - Função de logout

---

## 🎨 UI Hooks

### useDebounce

Debounce para otimizar performance em inputs e buscas.

```typescript
import { useDebounce } from '../hooks';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Só executa 500ms após o usuário parar de digitar
    if (debouncedSearch) {
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar..."
    />
  );
};
```

**Parâmetros:**
- `value` - Valor a ser debounced
- `delay` - Delay em ms (padrão: 500ms)

**Retorna:** Valor debounced

---

### useLocalStorage

Persiste estado no localStorage com sync automático.

```typescript
import { useLocalStorage } from '../hooks';

const ThemeComponent = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Tema atual: {theme}
    </button>
  );
};
```

**Parâmetros:**
- `key` - Chave do localStorage
- `initialValue` - Valor inicial se não existir

**Retorna:** `[value, setValue]` (mesma API do useState)

**Features:**
- ✅ Sync entre tabs/windows
- ✅ Tratamento de erros
- ✅ SSR safe
- ✅ TypeScript support

---

## 📊 Data Hooks

### useOrganizationSlug

Detecta e carrega organização baseado no slug da URL.

```typescript
import { useOrganizationSlug } from '../hooks';

const App = () => {
  const { organization, loading, error, slug, isMultiTenant } = useOrganizationSlug();

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return <Dashboard organization={organization} />;
};
```

### useDataIsolation

Isola dados por organização.

---

## 🎯 Boas Práticas

### 1. Sempre use hooks no topo do componente

```typescript
// ✅ Correto
const MyComponent = () => {
  const { user } = useAuth();
  const [value, setValue] = useLocalStorage('key', 'default');
  
  return <div>...</div>;
};

// ❌ Errado
const MyComponent = () => {
  if (condition) {
    const { user } = useAuth(); // Hooks não podem ser condicionais
  }
};
```

### 2. Use barrel exports

```typescript
// ✅ Correto
import { useAuth, useDebounce } from '../hooks';

// ❌ Evite
import { useAuth } from '../hooks/auth/useAuth';
import { useDebounce } from '../hooks/ui/useDebounce';
```

### 3. Documente seus hooks

Sempre adicione JSDoc com exemplos de uso.

---

## 🚀 Próximos Hooks

Hooks planejados para futuras implementações:

- `useAsync` - Gerenciar operações assíncronas
- `useForm` - Gestão de formulários
- `useMediaQuery` - Responsive design
- `usePermissions` - Permissões granulares
- `useToast` - Notificações (migrar do ToastContext)

---

## 📝 Contribuindo

Ao criar um novo hook:

1. Coloque na pasta apropriada (auth, data, ui, utils)
2. Adicione JSDoc com exemplos
3. Exporte no `index.ts`
4. Documente neste README
5. Adicione testes (futuro)

---

**Última atualização:** 22/01/2026  
**Hooks disponíveis:** 5  
**Status:** ✅ Ativo
