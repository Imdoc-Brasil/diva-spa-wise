# 📊 Análise: SettingsModule.tsx

**Arquivo:** `components/modules/SettingsModule.tsx`  
**Linhas:** 1,652  
**Status:** 🔴 CRÍTICO - Precisa refatoração urgente

---

## 🔍 ESTRUTURA IDENTIFICADA

### Seções Principais (baseado no outline)

1. **Imports** (linhas 1-21)
   - 20+ imports de componentes
   - Modals, UI components, utils

2. **Mock Data** (linhas 22-59)
   - Mock products
   - Mock forms
   - Demand data

3. **Component Main** (linhas 60-1649)
   - Estado local (muitos useState)
   - Lógica de negócio
   - Renderização

### Funções Identificadas

| Função | Linhas | Responsabilidade |
|--------|--------|------------------|
| `ImportDemoDataButton` | 32 | Importar dados demo |
| `formatCurrency` | 2 | Formatar moeda |
| `handleSaveBusiness` | 35 | Salvar configurações de negócio |
| `handleSaveNotifications` | 3 | Salvar notificações |
| `handleAddItem` | 11 | Adicionar item ao protocolo |
| `handleRemoveItem` | 5 | Remover item |
| `handleUpdateQuantity` | 3 | Atualizar quantidade |
| `handleSaveProtocol` | 5 | Salvar protocolo |
| `createNewForm` | 14 | Criar novo formulário |
| `addNewYieldRule` | 20 | Adicionar regra de rendimento |
| `addField` | 13 | Adicionar campo ao form |
| `saveForm` | 17 | Salvar formulário |
| `duplicateForm` | 12 | Duplicar formulário |
| `getFieldIcon` | 7 | Ícone do campo |
| `handleAddCategory` | 6 | Adicionar categoria |

---

## 🎯 ESTRATÉGIA DE DECOMPOSIÇÃO

### Fase 1: Criar Estrutura Base (30min)

```
components/modules/settings/
├── index.tsx                    # Main component (< 200 linhas)
├── SettingsModule.tsx          # Wrapper principal
├── components/
│   ├── GeneralSettings/
│   │   ├── index.tsx
│   │   ├── BusinessInfo.tsx
│   │   └── DemoDataImport.tsx
│   ├── ProductSettings/
│   │   ├── index.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProtocolBuilder.tsx
│   │   └── CategoryManager.tsx
│   ├── FormBuilder/
│   │   ├── index.tsx
│   │   ├── FormList.tsx
│   │   ├── FormEditor.tsx
│   │   ├── FieldPalette.tsx
│   │   └── YieldRules.tsx
│   └── NotificationSettings/
│       └── index.tsx
├── shared/
│   ├── SettingsSection.tsx     # Wrapper de seção
│   ├── SettingsCard.tsx        # Card reutilizável
│   ├── SettingsHeader.tsx      # Header de seção
│   └── SaveButton.tsx          # Botão de salvar
├── hooks/
│   ├── useBusinessSettings.ts  # Lógica de negócio
│   ├── useProductSettings.ts   # Lógica de produtos
│   ├── useFormBuilder.ts       # Lógica de forms
│   └── useNotifications.ts     # Lógica de notificações
└── utils/
    ├── formatters.ts           # Formatadores
    └── validators.ts           # Validadores
```

### Fase 2: Migrar Seções (2-3h)

#### 1. General Settings (~300 linhas)
- Business info
- Demo data import
- Basic configurations

#### 2. Product Settings (~400 linhas)
- Product list
- Protocol builder
- Category manager

#### 3. Form Builder (~500 linhas)
- Form list
- Form editor
- Field palette
- Yield rules

#### 4. Notification Settings (~100 linhas)
- Notification preferences

### Fase 3: Criar Componentes Compartilhados (30min)

#### SettingsSection.tsx
```typescript
interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

#### SettingsCard.tsx
```typescript
interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}
```

### Fase 4: Criar Hooks (1h)

#### useBusinessSettings.ts
```typescript
export const useBusinessSettings = () => {
  const [businessInfo, setBusinessInfo] = useState(...);
  
  const saveBusiness = async () => { ... };
  
  return {
    businessInfo,
    setBusinessInfo,
    saveBusiness,
    isLoading,
    error
  };
};
```

---

## 📋 CHECKLIST DE EXECUÇÃO

### Preparação
- [x] Criar branch `refactor/phase-3-modules`
- [x] Analisar estrutura do arquivo
- [ ] Criar pasta `components/modules/settings/`
- [ ] Criar estrutura de subpastas

### Componentes Compartilhados
- [ ] SettingsSection.tsx
- [ ] SettingsCard.tsx
- [ ] SettingsHeader.tsx
- [ ] SaveButton.tsx

### Hooks
- [ ] useBusinessSettings.ts
- [ ] useProductSettings.ts
- [ ] useFormBuilder.ts
- [ ] useNotifications.ts

### Componentes de Seção
- [ ] GeneralSettings/
- [ ] ProductSettings/
- [ ] FormBuilder/
- [ ] NotificationSettings/

### Main Component
- [ ] Refatorar SettingsModule.tsx
- [ ] Implementar navegação por tabs
- [ ] Integrar todos os componentes

### Testes
- [ ] Compilação TypeScript
- [ ] Teste manual de cada seção
- [ ] Verificar funcionalidades

---

## 🎯 META

**Reduzir de 1,652 para < 300 linhas no arquivo principal**

**Criar:**
- 15+ componentes modulares
- 4 hooks customizados
- 4 seções principais

**Tempo estimado:** 3-4 horas

---

**Próximo passo:** Criar estrutura de pastas e componentes compartilhados

**Status:** 🟡 Análise completa, pronto para começar
