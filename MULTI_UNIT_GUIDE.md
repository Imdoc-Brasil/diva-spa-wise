# 🏢 Sistema Multi-Unidades - Diva Spa CRM

## 📊 Situação Atual

### ✅ O que JÁ EXISTE:

#### 1. **Módulo de Franquias** (`FranchiseModule.tsx`)
- ✅ Visualização de múltiplas unidades
- ✅ Ranking por performance
- ✅ Métricas agregadas (receita total, clientes, NPS)
- ✅ Gráfico de crescimento da rede
- ✅ Distribuição geográfica
- ✅ Status operacional por unidade

#### 2. **Tipo BusinessUnit** (`types.ts`)
```typescript
interface BusinessUnit {
    id: string;
    name: string;              // Ex: "Diva Jardins (Matriz)"
    location: string;          // Ex: "São Paulo, SP"
    managerName: string;       // Ex: "Ana G."
    revenue: number;           // Receita mensal
    revenueMoM: number;        // Crescimento mês a mês (%)
    activeClients: number;     // Clientes ativos
    nps: number;               // Net Promoter Score
    status: 'operational' | 'alert';
}
```

#### 3. **Unidades Mockadas**
Atualmente existem 4 unidades de exemplo:
- 🏢 Diva Jardins (Matriz) - São Paulo, SP
- 🏢 Diva Moema - São Paulo, SP
- 🏢 Diva Leblon - Rio de Janeiro, RJ
- 🏢 Diva Savassi - Belo Horizonte, MG

---

## ⚠️ O que FALTA para Multi-Unidades Completo:

### 🔴 **CRÍTICO - Funcionalidades Essenciais**

#### 1. **Isolamento de Dados por Unidade**
**Problema Atual:**
- Todos os dados (clientes, agendamentos, staff, etc.) são globais
- Não há separação por unidade
- Cliente cadastrado em SP aparece em Salvador

**Solução Necessária:**
```typescript
// Adicionar unitId em TODAS as entidades

interface Client {
    id: string;
    unitId: string;  // ← NOVO
    name: string;
    // ... outros campos
}

interface Appointment {
    id: string;
    unitId: string;  // ← NOVO
    clientId: string;
    // ... outros campos
}

interface StaffMember {
    id: string;
    unitIds: string[];  // ← NOVO (pode trabalhar em múltiplas unidades)
    name: string;
    // ... outros campos
}
```

---

#### 2. **Seletor de Unidade Ativa**
**O que precisa:**
- Dropdown no header para selecionar unidade
- Filtrar todos os dados pela unidade selecionada
- Salvar preferência do usuário

**Mockup:**
```
┌─────────────────────────────────────┐
│  [📍 São Paulo - Jardins ▼]         │
│     ├─ São Paulo - Moema            │
│     ├─ Rio de Janeiro - Leblon      │
│     ├─ Belo Horizonte - Savassi     │
│     └─ 🌐 Visão Consolidada (Admin) │
└─────────────────────────────────────┘
```

---

#### 3. **Permissões por Unidade**
**Níveis de Acesso:**

```typescript
enum UnitAccessLevel {
    UNIT_ADMIN,      // Gerente da unidade (acesso total à sua unidade)
    UNIT_STAFF,      // Staff da unidade (acesso limitado)
    NETWORK_ADMIN,   // Admin da rede (acesso a todas as unidades)
    NETWORK_VIEWER   // Visualização de todas as unidades
}

interface User {
    id: string;
    role: UserRole;
    unitAccess: {
        unitId: string;
        level: UnitAccessLevel;
    }[];
}
```

**Exemplos:**
- **Ana (Gerente SP Jardins):** Acesso total apenas à unidade SP Jardins
- **Carlos (Staff SP Moema):** Acesso limitado apenas à unidade SP Moema
- **Diretor Geral:** Acesso a todas as unidades + visão consolidada
- **Contador:** Visualização de todas as unidades (sem edição)

---

#### 4. **Cadastro e Configuração de Novas Unidades**

**Modal de Nova Unidade:**
```
┌────────────────────────────────────────┐
│  📍 Nova Unidade                       │
├────────────────────────────────────────┤
│                                        │
│  Nome da Unidade *                     │
│  [Diva Salvador - Barra        ]       │
│                                        │
│  Endereço Completo *                   │
│  [Av. Oceânica, 1234           ]       │
│  [Salvador, BA                 ]       │
│  [CEP: 40140-130               ]       │
│                                        │
│  Gerente Responsável *                 │
│  [Selecionar usuário...        ▼]      │
│                                        │
│  Telefone                              │
│  [(71) 3333-4444               ]       │
│                                        │
│  Email                                 │
│  [salvador@divaspa.com.br      ]       │
│                                        │
│  CNPJ                                  │
│  [12.345.678/0001-90           ]       │
│                                        │
│  Tipo de Unidade                       │
│  ○ Própria                             │
│  ● Franquia                            │
│  ○ Parceira                            │
│                                        │
│  Status Inicial                        │
│  ● Operacional                         │
│  ○ Em Implantação                      │
│  ○ Inativa                             │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Configurações Avançadas          │  │
│  ├──────────────────────────────────┤  │
│  │ □ Compartilhar base de clientes  │  │
│  │ □ Permitir transferências        │  │
│  │ □ Sincronizar estoque            │  │
│  │ □ Usar tabela de preços global   │  │
│  └──────────────────────────────────┘  │
│                                        │
│  [Cancelar]  [Criar Unidade]           │
└────────────────────────────────────────┘
```

---

#### 5. **Transferência de Dados Entre Unidades**

**Casos de Uso:**

**A) Transferência de Cliente**
```
Cliente mudou de cidade:
São Paulo → Salvador

Opções:
1. Transferir histórico completo
2. Criar novo cadastro (manter histórico em SP)
3. Compartilhar cadastro (acesso em ambas)
```

**B) Transferência de Profissional**
```
Profissional trabalha em 2 unidades:
- Segunda a Quarta: São Paulo
- Quinta a Sábado: Salvador

Solução: unitIds: ['sp-jardins', 'salvador-barra']
```

**C) Transferência de Estoque**
```
Produto em excesso em SP → Enviar para Salvador

Registro de Movimentação:
- Origem: SP Jardins
- Destino: Salvador Barra
- Produto: Creme XYZ
- Quantidade: 10 unidades
- Data: 29/11/2024
- Responsável: Ana G.
```

---

### 🟡 **IMPORTANTE - Funcionalidades Desejáveis**

#### 6. **Dashboard Consolidado (Visão Rede)**

**Métricas Globais:**
```
┌─────────────────────────────────────────────┐
│  📊 VISÃO CONSOLIDADA - REDE DIVA SPA       │
├─────────────────────────────────────────────┤
│                                             │
│  Receita Total (Todas as Unidades)          │
│  R$ 400.000 / mês                           │
│  ↑ 15% vs mês anterior                      │
│                                             │
│  Total de Clientes Ativos                   │
│  3.290 clientes                             │
│                                             │
│  NPS Médio da Rede                          │
│  91 pontos                                  │
│                                             │
│  Unidades Operacionais                      │
│  4 de 4 (100%)                              │
│                                             │
├─────────────────────────────────────────────┤
│  RANKING DE PERFORMANCE                     │
├─────────────────────────────────────────────┤
│  🥇 Diva Jardins (SP)    R$ 145.000  ↑ 12% │
│  🥈 Diva Leblon (RJ)     R$ 112.000  ↑  8% │
│  🥉 Diva Moema (SP)      R$  98.000  ↓  5% │
│  4️⃣  Diva Savassi (MG)   R$  45.000  ↑ 20% │
└─────────────────────────────────────────────┘
```

---

#### 7. **Relatórios Comparativos**

**Comparação Entre Unidades:**
- Receita por unidade
- Ticket médio por unidade
- Serviços mais vendidos por unidade
- Profissionais mais produtivos por unidade
- Horários de pico por unidade

**Exportação:**
- Excel consolidado
- PDF executivo
- Envio automático para diretoria

---

#### 8. **Comunicação Corporativa**

**Push Corporativo (já existe botão no módulo):**
```
Enviar para todas as unidades:
- Novos preços
- Novas campanhas
- Políticas corporativas
- Treinamentos
- Avisos importantes
```

**Exemplo:**
```
┌────────────────────────────────────┐
│  📢 Push Corporativo               │
├────────────────────────────────────┤
│  Assunto:                          │
│  [Nova Tabela de Preços - Dez/24]  │
│                                    │
│  Mensagem:                         │
│  [A partir de 01/12, novos preços] │
│  [conforme tabela anexa.        ]  │
│                                    │
│  Anexos:                           │
│  📎 tabela_precos_dez24.pdf        │
│                                    │
│  Enviar para:                      │
│  ☑ Todas as unidades               │
│  ☐ Apenas unidades selecionadas    │
│                                    │
│  Notificar:                        │
│  ☑ Gerentes                        │
│  ☑ Staff                           │
│  ☐ Clientes                        │
│                                    │
│  [Cancelar]  [Enviar Agora]        │
└────────────────────────────────────┘
```

---

## 🛠️ **Implementação Técnica**

### **Fase 1: Estrutura de Dados (1 semana)**

#### 1.1 Expandir BusinessUnit
```typescript
export interface BusinessUnit {
    id: string;
    name: string;
    location: string;
    address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    contact: {
        phone: string;
        email: string;
        whatsapp?: string;
    };
    legal: {
        cnpj: string;
        stateRegistration?: string;
        municipalRegistration?: string;
    };
    managerId: string;  // Referência ao usuário gerente
    type: 'own' | 'franchise' | 'partner';
    status: 'operational' | 'implementation' | 'inactive';
    settings: {
        shareClients: boolean;
        allowTransfers: boolean;
        syncInventory: boolean;
        useGlobalPricing: boolean;
    };
    metrics: {
        revenue: number;
        revenueMoM: number;
        activeClients: number;
        nps: number;
    };
    createdAt: Date;
    activatedAt?: Date;
}
```

#### 1.2 Adicionar unitId em todas as entidades
```typescript
// Atualizar TODOS os tipos:
- Client → adicionar unitId
- Appointment → adicionar unitId
- StaffMember → adicionar unitIds[]
- ServiceRoom → adicionar unitId
- Product (Pharmacy) → adicionar unitId
- Transaction → adicionar unitId
- etc.
```

---

### **Fase 2: Context de Unidade (3 dias)**

```typescript
// UnitContext.tsx
interface UnitContextType {
    currentUnit: BusinessUnit | null;
    allUnits: BusinessUnit[];
    setCurrentUnit: (unitId: string) => void;
    canAccessUnit: (unitId: string) => boolean;
    isNetworkView: boolean;
    setNetworkView: (enabled: boolean) => void;
}

const UnitContext = createContext<UnitContextType>(...);

export const UnitProvider: React.FC = ({ children }) => {
    const { user } = useAuth();
    const [currentUnit, setCurrentUnit] = useState<BusinessUnit | null>(null);
    const [isNetworkView, setIsNetworkView] = useState(false);
    
    // Filtrar dados baseado na unidade selecionada
    const filterByUnit = (data: any[]) => {
        if (isNetworkView && user.isNetworkAdmin) {
            return data; // Ver tudo
        }
        return data.filter(item => item.unitId === currentUnit?.id);
    };
    
    return (
        <UnitContext.Provider value={{...}}>
            {children}
        </UnitContext.Provider>
    );
};
```

---

### **Fase 3: UI Components (1 semana)**

#### 3.1 Unit Selector (Header)
```typescript
// components/ui/UnitSelector.tsx
const UnitSelector: React.FC = () => {
    const { currentUnit, allUnits, setCurrentUnit, isNetworkView, setNetworkView } = useUnit();
    
    return (
        <select onChange={(e) => setCurrentUnit(e.target.value)}>
            {allUnits.map(unit => (
                <option key={unit.id} value={unit.id}>
                    📍 {unit.name} - {unit.location}
                </option>
            ))}
            {user.isNetworkAdmin && (
                <option value="network">🌐 Visão Consolidada</option>
            )}
        </select>
    );
};
```

#### 3.2 New Unit Modal
```typescript
// components/modals/NewUnitModal.tsx
const NewUnitModal: React.FC = ({ isOpen, onClose }) => {
    // Formulário completo de cadastro de unidade
    // Ver mockup acima
};
```

#### 3.3 Unit Settings
```typescript
// components/modals/UnitSettingsModal.tsx
const UnitSettingsModal: React.FC = ({ unit, onClose }) => {
    // Configurações da unidade
    // Compartilhamento, transferências, etc.
};
```

---

### **Fase 4: Lógica de Negócio (1 semana)**

#### 4.1 Filtros Automáticos
```typescript
// Todos os módulos devem filtrar por unidade automaticamente

// Exemplo: CrmModule
const CrmModule: React.FC = () => {
    const { currentUnit } = useUnit();
    const { clients } = useData();
    
    // Filtrar clientes da unidade atual
    const unitClients = clients.filter(c => c.unitId === currentUnit?.id);
    
    return (
        // Renderizar apenas clientes da unidade
    );
};
```

#### 4.2 Transferências
```typescript
// services/transfers.ts
export const transferClient = async (
    clientId: string,
    fromUnitId: string,
    toUnitId: string,
    options: {
        keepHistory: boolean;
        shareAccess: boolean;
    }
) => {
    // Lógica de transferência
    // Registrar auditoria
    // Notificar unidades
};
```

---

## 📋 **Checklist de Implementação**

### **Sprint 1: Estrutura (1 semana)**
- [ ] Expandir tipo BusinessUnit
- [ ] Adicionar unitId em Client
- [ ] Adicionar unitId em Appointment
- [ ] Adicionar unitIds em StaffMember
- [ ] Adicionar unitId em ServiceRoom
- [ ] Adicionar unitId em Product
- [ ] Adicionar unitId em Transaction
- [ ] Criar UnitContext
- [ ] Criar UnitProvider

### **Sprint 2: UI Básica (1 semana)**
- [ ] Criar UnitSelector component
- [ ] Adicionar UnitSelector no Header
- [ ] Criar NewUnitModal
- [ ] Criar UnitSettingsModal
- [ ] Atualizar FranchiseModule
- [ ] Adicionar botão "Nova Unidade"

### **Sprint 3: Filtros (1 semana)**
- [ ] Implementar filtro em CrmModule
- [ ] Implementar filtro em SchedulingModule
- [ ] Implementar filtro em StaffModule
- [ ] Implementar filtro em RoomsModule
- [ ] Implementar filtro em PharmacyModule
- [ ] Implementar filtro em MarketplaceModule
- [ ] Implementar filtro em FinanceModule

### **Sprint 4: Permissões (3 dias)**
- [ ] Criar sistema de permissões por unidade
- [ ] Implementar UnitAccessLevel
- [ ] Restringir acesso baseado em permissões
- [ ] Testes de segurança

### **Sprint 5: Transferências (3 dias)**
- [ ] Implementar transferência de clientes
- [ ] Implementar transferência de estoque
- [ ] Implementar compartilhamento de profissionais
- [ ] Logs de auditoria

### **Sprint 6: Relatórios (3 dias)**
- [ ] Dashboard consolidado
- [ ] Relatórios comparativos
- [ ] Exportação Excel/PDF
- [ ] Gráficos por unidade

---

## 🎯 **Exemplo Prático: São Paulo e Salvador**

### **Cenário:**
Você tem 2 unidades:
1. **Diva São Paulo - Jardins**
2. **Diva Salvador - Barra**

### **Configuração:**

#### **1. Cadastrar Unidade Salvador**
```
Nome: Diva Salvador - Barra
Endereço: Av. Oceânica, 1234, Salvador, BA
Gerente: Maria Santos
CNPJ: 12.345.678/0001-90
Tipo: Própria
Status: Operacional

Configurações:
☐ Compartilhar base de clientes (NÃO)
☑ Permitir transferências (SIM)
☐ Sincronizar estoque (NÃO)
☑ Usar tabela de preços global (SIM)
```

#### **2. Atribuir Gerente**
```
Usuário: Maria Santos
Email: maria@divaspa.com.br
Unidade: Salvador - Barra
Nível de Acesso: UNIT_ADMIN
```

#### **3. Cadastrar Profissionais**
```
Profissional: Dra. Carla (Salvador)
unitIds: ['salvador-barra']

Profissional: Dr. João (Trabalha em ambas)
unitIds: ['sp-jardins', 'salvador-barra']
```

#### **4. Uso Diário**

**Maria (Gerente Salvador) faz login:**
- Vê apenas: Clientes de Salvador
- Vê apenas: Agendamentos de Salvador
- Vê apenas: Profissionais de Salvador
- Vê apenas: Estoque de Salvador

**Diretor Geral faz login:**
- Pode selecionar: 📍 São Paulo ou 📍 Salvador
- Ou ver: 🌐 Visão Consolidada
- Acessa: Todos os dados de todas as unidades

---

## 💡 **Recomendação**

### **Para Demo Atual:**
O módulo de Franquias já mostra bem o conceito de multi-unidades. É suficiente para apresentações.

### **Para Produção:**
Implementar as 6 Sprints acima (≈ 4-5 semanas de desenvolvimento).

### **Prioridade:**
1. **Alta:** Estrutura de dados + Filtros (Sprints 1-3)
2. **Média:** Permissões (Sprint 4)
3. **Baixa:** Transferências e Relatórios (Sprints 5-6)

---

## ❓ **Próximos Passos**

**Você quer:**

**A)** Manter como está (demo) e focar em validação

**B)** Começar implementação de multi-unidades agora

**C)** Melhorar o módulo de Franquias existente (adicionar modal de nova unidade, etc.)

**D)** Outra prioridade

---

**O que você prefere fazer?** 🚀
