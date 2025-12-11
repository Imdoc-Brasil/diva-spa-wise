# Fluxo Financeiro SaaS - Integração Asaas

Este documento descreve o fluxo de dados entre o Sistema CRM (I'mdoc) e o Gateway de Pagamento (Asaas).

## Diagrama de Fluxo

```mermaid
sequenceDiagram
    participant User as Admin (Backoffice)
    participant CRM as SaaS CRM (Frontend)
    participant DB as Supabase (Organizations)
    participant Asaas as Asaas API

    Note over User, Asaas: 1. Onboarding do Cliente (Sync)
    User->>CRM: Clica "Sincronizar Asaas"
    CRM->>Asaas: POST /v3/customers (Dados do Lead)
    Asaas-->>CRM: Retorna { id: "cus_123" }
    CRM->>DB: UPDATE organizations SET asaas_customer_id = "cus_123"
    DB-->>CRM: Sucesso
    CRM-->>User: Toast "Cliente Sincronizado"

    Note over User, Asaas: 2. Criação de Assinatura
    User->>CRM: Clica "Criar Assinatura"
    CRM->>CRM: Calcula Valor (Plano Growth = 797)
    CRM->>Asaas: POST /v3/subscriptions
    Note right of Asaas: Payload: { customer: "cus_123", value: 797, cycle: "MONTHLY", billingType: "BOLETO" }
    Asaas-->>CRM: Retorna { id: "sub_999", status: "ACTIVE" }
    CRM->>DB: UPDATE organizations SET asaas_subscription_id = "sub_999"
    DB-->>CRM: Sucesso
    CRM-->>User: Toast "Assinatura Criada"

    Note over User, Asaas: 3. Cobrança Automática (Futuro)
    Asaas->>Asaas: Gera Boleto Mensalmente
    Asaas->>User: Envia E-mail com Boleto (Automático do Asaas)
    
    Note over User, Asaas: 4. Atualização de Status (Via Webhook - Planejado)
    Asaas->>DB: POST /webhook (PAYMENT_RECEIVED)
    DB->>DB: UPDATE organizations SET status = "active"
```

## Estrutura de Dados

### Organization (Supabase)
```sql
| Column                | Type | Description                     |
|-----------------------|------|---------------------------------|
| id                    | uuid | ID interno                      |
| plan                  | text | Start, Growth, Empire           |
| asaas_customer_id     | text | Chave estrangeira do Asaas      |
| asaas_subscription_id | text | Chave da assinatura recorrente  |
| saas_status           | text | active, delinquent, trial       |
```

## Próximos Passos
1. Configurar Webhooks no Painel do Asaas para apontar para `https://<supabase-url>/functions/v1/asaas-webhook`.
2. Criar Edge Function para processar `PAYMENT_RECEIVED` e `PAYMENT_OVERDUE`.
