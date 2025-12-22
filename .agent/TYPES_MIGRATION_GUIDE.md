# 🔄 Guia de Migração de Tipos

**Data:** 2025-12-22  
**Status:** Em Progresso

---

## 📋 Estrutura Nova vs Antiga

### ✅ Nova Estrutura (Modular)
```
types/
  ├── index.ts          # Barrel exports + utilities
  ├── core.ts           # User, Organization, Address
  ├── saas.ts           # SaaS CRM, Leads, Subscribers
  └── (futuro)
      ├── clinic.ts     # Client, Appointment, Service
      ├── financial.ts  # Transaction, Invoice, Payment
      └── marketing.ts  # Campaign, Template, Analytics
```

### ⚠️ Estrutura Antiga (Para Migrar)
```
types.ts              # 1828 linhas! Tudo misturado
types_saas.ts         # 173 linhas - SaaS types
types_financial.ts    # Financial types
```

---

## 🔄 Como Migrar Seus Imports

### Antes (Antigo)
```typescript
import { User, UserRole } from './types';
import { SaaSLead, SaaSPlan } from './types_saas';
import { Transaction } from './types_financial';
```

### Depois (Novo)
```typescript
// Tudo de um lugar só!
import { User, UserRole, SaaSLead, SaaSPlan, Transaction } from '@/types';

// Ou imports específicos
import { User, UserRole } from '@/types/core';
import { SaaSLead, SaaSPlan } from '@/types/saas';
```

---

## ✅ Benefícios da Nova Estrutura

1. **Organização Clara**
   - Cada módulo tem seu próprio arquivo
   - Fácil encontrar tipos relacionados

2. **Barrel Exports**
   - Import único: `from '@/types'`
   - Menos linhas de import

3. **Type Guards & Utilities**
   - `isAdmin(role)` - Check se é admin
   - `isPremiumPlan(plan)` - Check se é plano premium
   - `isStageAdvanced(a, b)` - Compara estágios de lead

4. **Constantes Centralizadas**
   - `BRAZIL_STATES` - Lista de UFs
   - `LEAD_STAGE_ORDER` - Ordem de progressão

---

## 📝 Checklist de Migração

### Fase 1: Criar Nova Estrutura ✅
- [x] Criar `/types` directory
- [x] Criar `types/core.ts`
- [x] Criar `types/saas.ts`
- [x] Criar `types/index.ts` (barrel)

### Fase 2: Atualizar tsconfig.json
- [ ] Adicionar path alias para `@/types`
```json
{
  "compilerOptions": {
    "paths": {
      "@/types": ["./types"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

### Fase 3: Migrar Imports Gradualmente
- [ ] Atualizar `SaaSCrmModule.tsx`
- [ ] Atualizar `SaaSDashboard.tsx`
- [ ] Atualizar `DataContext.tsx`
- [ ] Atualizar outros módulos SaaS

### Fase 4: Deprecar Arquivos Antigos
- [ ] Marcar `types.ts` como deprecated
- [ ] Marcar `types_saas.ts` como deprecated
- [ ] Manter `types_financial.ts` temporariamente

### Fase 5: Limpeza Final
- [ ] Remover arquivos antigos
- [ ] Atualizar documentação
- [ ] Commit & Deploy

---

## 🎯 Exemplo de Uso

### Type Guards
```typescript
import { isAdmin, isPremiumPlan, isLeadClosing } from '@/types';

// Check user permissions
if (isAdmin(user.role)) {
  // Show admin features
}

// Check plan tier
if (isPremiumPlan(subscriber.plan)) {
  // Enable premium features
}

// Check lead stage
if (isLeadClosing(lead.stage)) {
  // Show closing actions
}
```

### Utilities
```typescript
import { getStageIndex, isStageAdvanced, BRAZIL_STATES } from '@/types';

// Compare stages
const canMove = isStageAdvanced(newStage, currentStage);

// Render state dropdown
<select>
  {BRAZIL_STATES.map(uf => <option key={uf}>{uf}</option>)}
</select>
```

---

## ⚠️ Notas Importantes

1. **Compatibilidade Retroativa**
   - Arquivos antigos ainda funcionam
   - Migração pode ser gradual
   - Sem breaking changes

2. **TypeScript Strict Mode**
   - Novos tipos são mais estritos
   - Podem aparecer erros em código antigo
   - Corrigir conforme migra

3. **Performance**
   - Barrel exports podem aumentar bundle size
   - Tree-shaking resolve isso
   - Não é problema em produção

---

## 🚀 Próximos Passos

1. Atualizar `tsconfig.json` com path aliases
2. Migrar `SaaSCrmModule.tsx` como teste
3. Validar que tudo compila
4. Migrar resto dos módulos
5. Remover arquivos antigos

---

**Estimativa:** 30-40 minutos  
**Prioridade:** Média (não urgente, mas importante)
