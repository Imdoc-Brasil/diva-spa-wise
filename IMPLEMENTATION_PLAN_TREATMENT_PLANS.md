# Plano de Implementação: Planos de Tratamento e Vendas

Este documento detalha a implementação do módulo de Planos de Tratamento, abrangendo prescrição, pipeline de vendas e gestão de créditos/pagamentos.

## 1. Novas Estruturas de Dados (Types)

Serão adicionadas ao arquivo `types.ts` as seguintes interfaces:

### 1.1. Itens do Plano
```typescript
export type PrioridadeTratamento = 'alta' | 'media' | 'baixa';
export type StatusItemPlano = 'pendente' | 'pago' | 'agendado' | 'realizado';

interface TreatmentPlanItem {
    id: string; // ID único do item no plano
    serviceId: string; // ID do serviço (ServiceDefinition)
    serviceName: string;
    quantity: number; // Quantas sessões
    periodicity?: string; // Ex: "A cada 4 meses"
    priority: PrioridadeTratamento;
    unitPrice: number; // Preço unitário no momento da criação
    totalPrice: number; // unitPrice * quantity
    status: StatusItemPlano;
    sessionsUsed: number; // Controle de consumo
}
```

### 1.2. Plano de Tratamento (Instância)
```typescript
export type StatusPlano = 'prescrito' | 'em_negociacao' | 'fechado' | 'parcialmente_pago' | 'concluido' | 'perdido';

interface TreatmentPlan {
    id: string;
    organizationId: string;
    clientId: string; // Paciente
    clientName: string;
    professionalId: string; // Médico que prescreveu
    professionalName: string;
    
    name: string; // "Plano Anual da Beleza"
    description?: string;
    
    items: TreatmentPlanItem[];
    
    // Valores
    subtotal: number;
    discount: number;
    total: number;
    
    // CRM
    status: StatusPlano;
    pipelineStage: string; // "Novo", "Apresentado", "Negociação", "Fechado"
    
    createdAt: string;
    updatedAt: string;
    expirationDate?: string;
}
```

### 1.3. Template de Plano (Pré-cadastrados)
```typescript
interface TreatmentPlanTemplate {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    items: {
        serviceId: string; // Referência se existir, ou apenas nome/categoria
        serviceName: string; // Fallback
        quantity: number;
        priority: PrioridadeTratamento;
        periodicity?: string;
    }[];
}
```

## 2. Componentes e Módulos

### 2.1. Novo Módulo Principal: `TreatmentPlansModule.tsx`
Localizado em `components/modules/TreatmentPlansModule.tsx`.
Rota sugerida: `/treatment-plans`.

**Tabs:**
1.  **Pipeline (CRM)**: Kanban View dos planos em negociação.
2.  **Prescrições (Lista)**: Histórico de todos os planos gerados.
3.  **Modelos (Templates)**: Gestão de modelos pré-cadastrados.

### 2.2. Modal de Prescrição: `PrescribePlanModal.tsx`
*   Seleção de Paciente.
*   Seleção de Modelo (com preenchimento automático) ou Criação do Zero.
*   Adição dinâmica de serviços.
*   Definição de prioridade e periodicidade.
*   Botões de Ação: "Salvar", "Gerar PDF", "Enviar WhatsApp".

### 2.3. Gestão do Plano (Detalhes): `PlanDetailsModal.tsx` `PlanManager.tsx`
*   Visão detalhada do plano.
*   **Checkout Parcial**: Selecionar itens específicos para pagamento.
*   **Gestão de Créditos**: Visualizar saldo de sessões pagas e histórico de uso.
*   Status de cada item (Pago vs Pendente).

## 3. Integração com Backend (Simulado)
*   Persistência via `localStorage` (keys: `treatment_plans`, `treatment_templates`).
*   Mock de envio de WhatsApp (alerta com link).

## 4. Fluxo de Trabalho do Usuário

1.  **Médico**: Acessa "Planos de Tratamento" > "Nova Prescrição" ou via Perfil do Paciente.
2.  **Médico**: Preenche o plano (Toxina, Sculptra, etc) e define prioridades.
3.  **Sistema**: Gera PDF/Link.
4.  **Staff/Comercial**: Vê o plano no Pipeline ("Novo"). Entra em contato.
5.  **Paciente**: Aceita pagar parcialmente (ex: só a Toxina agora).
6.  **Staff**: No gerenciador do plano, seleciona os itens da Toxina e processa pagamento (integração visual com checkout).
7.  **Sistema**: Marca itens como "Pago" e incrementa saldo de sessões do paciente.
8.  **Staff**: Agenda as sessões debitando do saldo.

---
**Aprovação**:
Este plano cobre todos os requisitos solicitados:
1. Prescrição (Médico)
2. PDF/WhatsApp
3. Pipeline (Staff)
4. Gestão de Pagamentos Parciais e Créditos.

** Dashboard de indicadores dos módulo Planos de tratamento

O que acha de adcionarmos uma aba com os principais indicadores dos Planos de Tratamento, com filtros dos por período, serviços prescritos, total de precrisções, novas, apresentadas, em negociação, fechadas, prescrições por profissionais...

**