# 📚 Guia de Refatoração do SettingsModule

**Criado:** 21/01/2026  
**Status:** Estrutura base completa, pronta para refatoração incremental

---

## ✅ O QUE JÁ FOI FEITO

### Estrutura Criada
```
components/modules/settings/
├── components/
│   ├── GeneralSettings/      (pronto para uso)
│   ├── ProductSettings/       (pronto para uso)
│   ├── FormBuilder/           (pronto para uso)
│   └── NotificationSettings/  (pronto para uso)
├── shared/                    ✅ COMPLETO
│   ├── SettingsSection.tsx   ✅ Wrapper de seção
│   ├── SettingsCard.tsx      ✅ Card de configuração
│   ├── SaveButton.tsx        ✅ Botão de salvar
│   └── index.ts              ✅ Barrel export
├── hooks/                     (pronto para uso)
└── utils/                     ✅ COMPLETO
    └── formatters.ts         ✅ Formatadores
```

### Componentes Reutilizáveis (204 linhas)

#### SettingsSection
Wrapper para seções com título, descrição e ícone.

**Uso:**
```tsx
<SettingsSection
  title="Configurações Gerais"
  description="Configure informações básicas"
  icon={<Settings />}
>
  {/* Conteúdo da seção */}
</SettingsSection>
```

#### SettingsCard
Card para itens individuais de configuração.

**Uso:**
```tsx
<SettingsCard
  title="Nome da Empresa"
  description="Nome que aparece nos documentos"
  actions={<SaveButton onClick={handleSave} />}
>
  <input type="text" value={name} onChange={...} />
</SettingsCard>
```

#### SaveButton
Botão de salvar com estado de loading.

**Uso:**
```tsx
<SaveButton
  onClick={handleSave}
  isLoading={isSaving}
  disabled={!hasChanges}
>
  Salvar Alterações
</SaveButton>
```

---

## 🎯 PRÓXIMOS PASSOS (Futuras Sessões)

### Sessão 1: Notificações (1h)
**Arquivo:** `components/NotificationSettings/index.tsx`

**Extrair:**
- Configurações de notificações por email
- Configurações de notificações push
- Configurações de WhatsApp

**Benefício:** Seção simples, baixo risco

### Sessão 2: Business Settings (1-2h)
**Arquivo:** `components/GeneralSettings/index.tsx`

**Extrair:**
- Informações da empresa
- Endereço
- Contatos
- Horários de funcionamento

**Hook:** `hooks/useBusinessSettings.ts`

### Sessão 3: Product Settings (2-3h)
**Arquivo:** `components/ProductSettings/index.tsx`

**Extrair:**
- Lista de produtos
- Categorias
- Protocolos
- Gestão de estoque

**Hooks:**
- `hooks/useProductSettings.ts`
- `hooks/useProtocols.ts`

### Sessão 4: Form Builder (2-3h)
**Arquivo:** `components/FormBuilder/index.tsx`

**Extrair:**
- Lista de formulários
- Editor de formulários
- Campos customizados
- Regras de rendimento

**Hooks:**
- `hooks/useFormBuilder.ts`
- `hooks/useYieldRules.ts`

---

## 📋 TEMPLATE PARA NOVA SEÇÃO

### 1. Criar Componente

```tsx
// components/modules/settings/components/NovaSecao/index.tsx
import React, { useState } from 'react';
import { SettingsSection, SettingsCard, SaveButton } from '../../shared';
import { useToast } from '../../../ui/ToastContext';

export const NovaSecao: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Lógica de salvar
      addToast('Configurações salvas!', 'success');
    } catch (error) {
      addToast('Erro ao salvar', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsSection
      title="Título da Seção"
      description="Descrição da seção"
      icon={<IconeAqui />}
    >
      <div className="space-y-4">
        <SettingsCard
          title="Item de Configuração"
          description="Descrição do item"
        >
          {/* Campos do formulário */}
        </SettingsCard>

        <div className="flex justify-end">
          <SaveButton onClick={handleSave} isLoading={isLoading} />
        </div>
      </div>
    </SettingsSection>
  );
};
```

### 2. Criar Hook (se necessário)

```tsx
// components/modules/settings/hooks/useNovaSecao.ts
import { useState, useEffect } from 'react';
import { useToast } from '../../../ui/ToastContext';

export const useNovaSecao = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carregar dados
      setData(result);
    } catch (error) {
      addToast('Erro ao carregar', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (newData: any) => {
    setIsLoading(true);
    try {
      // Salvar dados
      addToast('Salvo com sucesso!', 'success');
    } catch (error) {
      addToast('Erro ao salvar', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    saveData,
    loadData
  };
};
```

### 3. Integrar no SettingsModule

```tsx
// No SettingsModule.tsx principal
import { NovaSecao } from './settings/components/NovaSecao';

// Dentro do componente
<Tab.Panel>
  <NovaSecao />
</Tab.Panel>
```

---

## 🎨 PADRÕES DE DESIGN

### Cores
- Primary: `purple-600`
- Success: `green-600`
- Error: `red-600`
- Warning: `yellow-600`

### Espaçamento
- Entre cards: `space-y-4`
- Padding interno: `p-4` ou `p-6`
- Margem de botões: `mt-4`

### Tipografia
- Título de seção: `text-lg font-semibold`
- Título de card: `text-sm font-medium`
- Descrição: `text-xs text-gray-500`

---

## 📊 MÉTRICAS DE SUCESSO

### Por Seção Extraída
- ✅ Redução de 200-400 linhas no arquivo principal
- ✅ Componente reutilizável criado
- ✅ Lógica isolada em hook (se aplicável)
- ✅ Testes manuais passando

### Meta Final
- 🎯 SettingsModule.tsx: < 300 linhas
- 🎯 8-10 componentes modulares
- 🎯 4-5 hooks customizados
- 🎯 100% funcionalidade mantida

---

## 🚀 COMO COMEÇAR PRÓXIMA SESSÃO

1. **Escolher seção** (recomendo NotificationSettings)
2. **Criar arquivo** em `components/NovaSecao/index.tsx`
3. **Copiar código** relevante do SettingsModule.tsx
4. **Adaptar** para usar componentes compartilhados
5. **Testar** funcionalidade
6. **Remover** código do arquivo original
7. **Commit** com mensagem descritiva

---

## 💡 DICAS

### Ao Extrair Código
- ✅ Copie primeiro, delete depois
- ✅ Teste cada seção isoladamente
- ✅ Mantenha backup do original
- ✅ Commit frequente

### Ao Criar Hooks
- ✅ Um hook por responsabilidade
- ✅ Nome descritivo (use + substantivo)
- ✅ Retorne objeto com funções e estado
- ✅ Documente parâmetros e retorno

### Ao Usar Componentes Compartilhados
- ✅ Sempre use SettingsSection como wrapper
- ✅ Use SettingsCard para agrupamentos
- ✅ Use SaveButton para ações
- ✅ Mantenha consistência visual

---

## 📚 REFERÊNCIAS

- Componentes compartilhados: `components/modules/settings/shared/`
- Utilitários: `components/modules/settings/utils/`
- Exemplos: Este guia

---

**Criado por:** Refatoração Fase 3  
**Última atualização:** 21/01/2026  
**Status:** Pronto para uso
