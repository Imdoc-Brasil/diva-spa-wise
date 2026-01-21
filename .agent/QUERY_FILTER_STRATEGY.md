# 🎯 ESTRATÉGIA DE FILTRO DE QUERIES

## 📊 **QUERIES IDENTIFICADAS:**

### **CRÍTICAS (Implementar Agora):**
1. ✅ `clients` - Clientes
2. ✅ `appointments` - Agendamentos
3. ✅ `transactions` - Transações financeiras

### **IMPORTANTES (Implementar Depois):**
4. 🔜 `saas_leads` - Leads do SaaS
5. 🔜 `saas_tasks` - Tarefas
6. 🔜 `saas_implementation_projects` - Projetos de implementação
7. 🔜 `saas_support_tickets` - Tickets de suporte
8. 🔜 `saas_feature_requests` - Solicitações de features

### **SISTEMA (Não Filtrar):**
- ❌ `app_configs` - Configurações globais
- ❌ `organizations` - Organizações (já filtrado por contexto)

---

## 🔧 **IMPLEMENTAÇÃO:**

### **Padrão de Filtro:**

```typescript
// ANTES
const { data } = await supabase
    .from('clients')
    .select('*');

// DEPOIS
const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('organization_id', currentUser.organizationId);
```

### **Localização das Queries:**

#### **1. Clients (Linha ~993)**
```typescript
// fetchClients()
const { data, error } = await (supabase
    .from('clients')
    .select('*') as any);
```

#### **2. Appointments (Linha ~1141)**
```typescript
// fetchAppointments()
const { data, error } = await (supabase
    .from('appointments')
    .select('*') as any);
```

#### **3. Transactions (Linha ~1104)**
```typescript
// fetchTransactions()
const { data, error } = await (supabase
    .from('transactions')
    .select('*') as any);
```

---

## ⚠️ **ATENÇÃO:**

### **Problema: currentUser pode não estar disponível**

O `DataContext` é carregado ANTES do login, então `currentUser` pode ser `null`.

### **Solução:**

1. **Verificar se currentUser existe:**
```typescript
if (!currentUser?.organizationId) {
    console.warn('No organization ID - skipping data fetch');
    return;
}
```

2. **Ou usar fallback:**
```typescript
const orgId = currentUser?.organizationId || 'org_demo';
```

---

## 🎯 **PLANO DE IMPLEMENTAÇÃO:**

### **Fase 1: Queries Críticas (Agora)**
- ✅ fetchClients
- ✅ fetchAppointments  
- ✅ fetchTransactions

### **Fase 2: Queries Importantes (Depois)**
- 🔜 fetchSaaSLeads
- 🔜 fetchSaaSTasks
- 🔜 fetchImplementationProjects
- 🔜 fetchSupportTickets
- 🔜 fetchFeatureRequests

---

## 📝 **CÓDIGO A MODIFICAR:**

Vou modificar 3 funções no DataContext:

1. `fetchClients()` - Linha ~993
2. `fetchAppointments()` - Linha ~1141
3. `fetchTransactions()` - Linha ~1104

---

**Pronto para implementar!** 🚀
