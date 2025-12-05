# 🔐 Análise Minuciosa: Isolamento de Dados para Perfil STAFF (Profissional)

## 📊 Situação Atual vs. Situação Ideal

### **SITUAÇÃO ATUAL** ❌

#### Problemas Identificados:
1. **StaffDashboard** - Filtra apenas agendamentos (`currentStaffId = 's1'`)
2. **Outros módulos** - Não implementam filtro por profissional
3. **Dados financeiros** - Profissional pode ver comissões de outros
4. **CRM** - Profissional pode acessar todos os clientes
5. **Agenda** - Profissional pode ver agenda de outros profissionais
6. **Relatórios** - Sem isolamento de dados

### **SITUAÇÃO IDEAL** ✅

#### Princípios de Isolamento:
1. **Princípio do Menor Privilégio** - Profissional vê apenas o necessário para seu trabalho
2. **Isolamento por Profissional** - Cada profissional vê apenas seus próprios dados
3. **Jornada do Paciente** - Profissional vê histórico completo do paciente que está atendendo
4. **Transparência Limitada** - Métricas agregadas sem identificação individual

---

## 🎯 Escopo de Acesso do Perfil STAFF

### ✅ **O QUE O PROFISSIONAL DEVE VER:**

#### 1. **Agenda (SchedulingModule)**
- ✅ Apenas seus próprios agendamentos
- ✅ Status dos seus atendimentos
- ✅ Salas disponíveis (sem ver quem está usando)
- ❌ Agendamentos de outros profissionais

#### 2. **CRM (CrmModule)**
- ✅ Clientes que ele já atendeu
- ✅ Clientes agendados para ele
- ✅ Histórico completo do cliente (quando atendendo)
- ❌ Clientes de outros profissionais
- ❌ Dados financeiros do cliente (valor gasto, etc.)

#### 3. **Financeiro (FinanceModule)**
- ✅ Suas próprias comissões
- ✅ Histórico de pagamentos pessoais
- ✅ Metas individuais
- ❌ Comissões de outros profissionais
- ❌ Faturamento total da clínica
- ❌ Custos operacionais

#### 4. **Inbox (CommunicationModule)**
- ✅ Mensagens direcionadas a ele
- ✅ Conversas com seus pacientes
- ❌ Conversas de outros profissionais

#### 5. **Boutique Diva (MarketplaceModule)**
- ✅ Venda balcão (comissão para ele)
- ✅ Produtos disponíveis
- ❌ Gestão de estoque
- ❌ Compras e fornecedores

#### 6. **Dashboard (StaffDashboard)**
- ✅ Seus atendimentos do dia
- ✅ Sua comissão do dia
- ✅ Suas metas pessoais
- ✅ Avisos da gerência
- ❌ Desempenho de outros profissionais

#### 7. **Prontuário (ServiceModal)**
- ✅ Acesso completo durante o atendimento
- ✅ Histórico de atendimentos do paciente
- ✅ Fotos de evolução
- ✅ Anamnese e contraindicações
- ❌ Valores cobrados (apenas serviço, não preço)

---

## 🏗️ Arquitetura de Isolamento

### **Camada 1: Contexto de Usuário**
```typescript
interface UserContext {
  userId: string;
  role: UserRole;
  staffId?: string;  // Apenas para STAFF
  permissions: Permission[];
}
```

### **Camada 2: Filtros de Dados**
```typescript
// Exemplo: Filtrar agendamentos
const getAppointmentsForUser = (user: User, appointments: Appointment[]) => {
  if (user.role === UserRole.STAFF) {
    return appointments.filter(a => a.staffId === user.uid);
  }
  if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
    return appointments; // Vê todos
  }
  if (user.role === UserRole.CLIENT) {
    return appointments.filter(a => a.clientId === user.uid);
  }
  return [];
};
```

### **Camada 3: Componentes Condicionais**
```typescript
// Exemplo: Mostrar/ocultar seções
{user.role !== UserRole.STAFF && (
  <FinancialSummary />  // Apenas Admin/Manager/Finance
)}

{user.role === UserRole.STAFF && (
  <MyCommissions staffId={user.uid} />  // Apenas suas comissões
)}
```

---

## 📋 Plano de Implementação

### **FASE 1: Infraestrutura Base** ⚙️

#### 1.1. Criar Hook de Isolamento de Dados
```typescript
// hooks/useDataIsolation.ts
export const useDataIsolation = () => {
  const { user } = useAuth();
  const { appointments, clients, transactions } = useData();

  const filterByUser = <T extends { staffId?: string; clientId?: string }>(
    data: T[],
    filterType: 'staff' | 'client'
  ): T[] => {
    if (!user) return [];
    
    if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
      return data; // Acesso total
    }

    if (user.role === UserRole.STAFF && filterType === 'staff') {
      return data.filter(item => item.staffId === user.uid);
    }

    if (user.role === UserRole.CLIENT && filterType === 'client') {
      return data.filter(item => item.clientId === user.uid);
    }

    return [];
  };

  return {
    getMyAppointments: () => filterByUser(appointments, 'staff'),
    getMyClients: () => {
      // Clientes que o profissional já atendeu
      const myAppointments = filterByUser(appointments, 'staff');
      const clientIds = [...new Set(myAppointments.map(a => a.clientId))];
      return clients.filter(c => clientIds.includes(c.clientId));
    },
    getMyTransactions: () => filterByUser(transactions, 'staff'),
  };
};
```

#### 1.2. Atualizar User Type
```typescript
// types.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  staffId?: string;  // ID do profissional (se role === STAFF)
  clientId?: string; // ID do cliente (se role === CLIENT)
}
```

### **FASE 2: Atualizar Módulos** 🔧

#### 2.1. SchedulingModule
- [ ] Filtrar agendamentos por `staffId`
- [ ] Ocultar agenda de outros profissionais
- [ ] Mostrar apenas salas disponíveis (sem detalhes)

#### 2.2. CrmModule
- [ ] Filtrar clientes por histórico de atendimentos
- [ ] Ocultar dados financeiros (LTV, RFM)
- [ ] Mostrar apenas clientes relevantes

#### 2.3. FinanceModule
- [ ] Criar view específica para STAFF
- [ ] Mostrar apenas comissões pessoais
- [ ] Ocultar faturamento total

#### 2.4. CommunicationModule
- [ ] Filtrar mensagens por destinatário
- [ ] Ocultar conversas de outros profissionais

#### 2.5. MarketplaceModule
- [ ] Já implementado (Cliente vê apenas loja)
- [ ] Staff vê loja + estoque básico

### **FASE 3: Componentes de UI** 🎨

#### 3.1. Criar Componente de Acesso Negado
```typescript
// components/AccessDenied.tsx
const AccessDenied: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
    <Lock size={48} className="mb-4" />
    <h3 className="font-bold text-lg">Acesso Restrito</h3>
    <p className="text-sm">{message || 'Você não tem permissão para visualizar este conteúdo.'}</p>
  </div>
);
```

#### 3.2. Criar Wrapper de Permissão
```typescript
// components/PermissionGate.tsx
const PermissionGate: React.FC<{
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ allowedRoles, children, fallback }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || <AccessDenied />;
  }
  
  return <>{children}</>;
};
```

---

## 🔍 Casos de Uso Detalhados

### **Caso 1: Profissional Acessa Agenda**

**Fluxo Atual:** ❌
1. Profissional abre `/schedule`
2. Vê todos os agendamentos da clínica
3. Pode ver horários de outros profissionais

**Fluxo Ideal:** ✅
1. Profissional abre `/schedule`
2. Sistema filtra: `appointments.filter(a => a.staffId === user.uid)`
3. Vê apenas seus próprios agendamentos
4. Salas aparecem como "Disponível" ou "Ocupada" (sem nome do profissional)

### **Caso 2: Profissional Acessa CRM**

**Fluxo Atual:** ❌
1. Profissional abre `/crm`
2. Vê todos os clientes da clínica
3. Pode ver dados financeiros de todos

**Fluxo Ideal:** ✅
1. Profissional abre `/crm`
2. Sistema filtra: clientes que ele já atendeu
3. Vê apenas nome, contato, histórico de atendimentos
4. Dados financeiros ocultos (LTV, valor gasto)

### **Caso 3: Profissional Inicia Atendimento**

**Fluxo Atual:** ✅ (Já funciona bem)
1. Profissional clica "Iniciar Atendimento"
2. Abre ServiceModal com dados do paciente
3. Acesso completo ao prontuário

**Fluxo Ideal:** ✅ (Manter como está)
1. Durante o atendimento, acesso total ao histórico
2. Pode ver fotos, anamnese, contraindicações
3. Pode registrar evolução e observações

### **Caso 4: Profissional Acessa Financeiro**

**Fluxo Atual:** ❌
1. Profissional abre `/finance`
2. Vê faturamento total da clínica
3. Pode ver comissões de outros

**Fluxo Ideal:** ✅
1. Profissional abre `/finance`
2. Vê apenas "Minhas Comissões"
3. Histórico de pagamentos pessoais
4. Metas individuais

---

## 🛡️ Regras de Segurança

### **Regra 1: Isolamento por Padrão**
- Todo dado deve ser filtrado por padrão
- Acesso total apenas para ADMIN

### **Regra 2: Contexto de Atendimento**
- Durante atendimento, acesso completo ao paciente
- Após finalizar, acesso apenas ao histórico

### **Regra 3: Dados Agregados**
- Profissional pode ver métricas agregadas
- Sem identificação individual de outros profissionais

### **Regra 4: Transparência Controlada**
- Profissional vê ranking geral (sem nomes)
- Vê sua posição no ranking
- Não vê valores individuais de outros

---

## 📊 Matriz de Acesso Refinada

| Recurso | Admin | Manager | Staff | Finance | Client |
|---------|-------|---------|-------|---------|--------|
| **Agenda - Própria** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Agenda - Outros** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **CRM - Próprios Clientes** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **CRM - Todos Clientes** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **CRM - Dados Financeiros** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Financeiro - Próprias Comissões** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Financeiro - Outras Comissões** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Financeiro - Faturamento Total** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Prontuário - Durante Atendimento** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Prontuário - Histórico Completo** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Inbox - Próprias Mensagens** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Inbox - Todas Mensagens** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Boutique - Loja** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Boutique - Gestão** | ✅ | ✅ | ❌ | ✅ | ❌ |

---

## 🎯 Priorização de Implementação

### **PRIORIDADE ALTA** 🔴 (Implementar Agora)
1. ✅ **StaffDashboard** - Já implementado
2. 🔧 **SchedulingModule** - Filtrar agenda
3. 🔧 **CrmModule** - Filtrar clientes
4. 🔧 **FinanceModule** - View de comissões

### **PRIORIDADE MÉDIA** 🟡 (Próxima Sprint)
5. 🔧 **CommunicationModule** - Filtrar mensagens
6. 🔧 **ReportsModule** - Relatórios pessoais
7. 🔧 **PermissionGate** - Componente reutilizável

### **PRIORIDADE BAIXA** 🟢 (Futuro)
8. 🔧 **Ranking Anônimo** - Gamificação
9. 🔧 **Metas Dinâmicas** - Sistema de metas
10. 🔧 **Notificações Contextuais** - Alertas personalizados

---

## 🧪 Testes de Validação

### **Teste 1: Isolamento de Agenda**
- [ ] Staff vê apenas seus agendamentos
- [ ] Staff não vê horários de outros
- [ ] Admin vê todos os agendamentos

### **Teste 2: Isolamento de CRM**
- [ ] Staff vê apenas clientes que atendeu
- [ ] Staff não vê dados financeiros
- [ ] Manager vê todos os clientes

### **Teste 3: Isolamento Financeiro**
- [ ] Staff vê apenas suas comissões
- [ ] Staff não vê faturamento total
- [ ] Finance vê todos os dados

### **Teste 4: Contexto de Atendimento**
- [ ] Staff acessa prontuário completo durante atendimento
- [ ] Staff não acessa prontuário fora do atendimento
- [ ] Histórico salvo corretamente

---

## 📝 Checklist de Implementação

### **Infraestrutura**
- [ ] Criar `useDataIsolation` hook
- [ ] Atualizar `User` type com `staffId`
- [ ] Criar `PermissionGate` component
- [ ] Criar `AccessDenied` component

### **Módulos**
- [ ] Atualizar `SchedulingModule`
- [ ] Atualizar `CrmModule`
- [ ] Atualizar `FinanceModule`
- [ ] Atualizar `CommunicationModule`
- [ ] Validar `StaffDashboard`

### **Testes**
- [ ] Testar com perfil STAFF
- [ ] Testar com perfil ADMIN
- [ ] Testar com perfil MANAGER
- [ ] Validar isolamento de dados

---

## 🚀 Próximos Passos

1. **Implementar `useDataIsolation` hook**
2. **Atualizar `SchedulingModule` com filtros**
3. **Criar view de comissões em `FinanceModule`**
4. **Testar isolamento em todos os módulos**
5. **Documentar regras de acesso**

---

**Conclusão:** O sistema precisa de uma camada robusta de isolamento de dados para garantir que cada profissional veja apenas informações relevantes ao seu trabalho, respeitando a privacidade e a hierarquia organizacional.
