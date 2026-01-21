
# Arquitetura de Automação & IA - I'mDoc SaaS

Este documento descreve como o "Automation Engine" conecta os diferentes módulos do sistema (CRM, Financeiro, Marketing) para criar uma experiência de crescimento acelerado ("Growth Hacking").

## 1. Visão Geral

O sistema utiliza uma arquitetura baseada em eventos. Quando uma ação ocorre em qualquer lugar do Admin (ex: mover um card no CRM), um evento é enviado para o `AutomationService`, que verifica se há campanhas ativas para aquele gatilho.

## 2. Componentes Principais

### A. Automation Engine (`AutomationService.ts`)
O cérebro da operação.
- Recebe gatilhos (`processConversion`).
- Executa fluxos passo-a-passo.
- Integra com IA para gerar conteúdo dinâmico.
- Dispara ações (Email, WhatsApp, Tags).

### B. Marketing Module (`SaaSMarketingModule.tsx`)
A interface de comando.
- Construtor visual de fluxos.
- Gerenciamento de Templates.
- Visualização de estatísticas de funil em tempo real.

### C. Gatilhos do Sistema (Triggers)

O sistema já está programado para disparar automações nas seguintes situações:

| Origem | Evento | Gatilho (ID) | Ação Padrão (Sugestão) |
| :--- | :--- | :--- | :--- |
| **CRM** | Novo Lead Criado (Manual) | `MANUAL_LEAD_CREATED` | Enviar boas vindas + Tag 'Origem: Manual' |
| **CRM** | Mudança de Fase (Kanban) | `STAGE_CHANGED_TO_{NewStage}` | Enviar email específico da fase (ex: Trial) |
| **Vendas** | Venda Confirmada | `NEW_CUSTOMER_ONBOARDING` | Iniciar Setup, Enviar Contrato, Notificar CS |
| **Ferramentas** | Calculadora Submetida | `REVENUE_CALCULATOR` | Gerar Relatório PDF + Email de Análise |
| **Marketing** | Lead Frio (Arquivado) | `STAGE_CHANGED_TO_archived` | Iniciar "Remarketing" após 3 dias |

## 3. Inteligência Artificial (AI Steps)

Diferente de automações tradicionais que usam templates estáticos, nosso motor possui passos de IA (`AI_GENERATE_CONTENT`).

**Exemplo Prático:**
1. Lead entra com faturamento de R$ 50.000.
2. Automação aciona IA: *"Escreva uma mensagem de WhatsApp parabenizando o lead pelo faturamento de 50k e sugerindo como chegar a 80k."*
3. O cliente recebe uma mensagem ultra-personalizada, aumentando a conversão.

## 4. Oportunidades de Expansão (Próximos Passos)

- **Integração CMS**: Disparar emails para a base quando um novo Post de Blog for publicado (`NEW_BLOG_POST`).
- **Webhook Externo**: Permitir que ferramentas externas (ex: Typeform, Zapier) disparem nossos fluxos via API.
- **Score de Engajamento**: Aumentar o "Lead Score" cada vez que um lead abre um email ou responde um WhatsApp.
