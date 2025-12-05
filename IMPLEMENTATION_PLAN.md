# Plano de Implementação - Diva Spa OS

Este documento serve como roteiro para a revisão, finalização e implementação das funcionalidades do sistema Diva Spa. O objetivo é transformar os mocks e interfaces estáticas em funcionalidades vivas e integradas.

## Legenda de Status
- 🔴 **Pendente**: Funcionalidade não implementada ou apenas visual estático.
- 🟡 **Em Progresso**: Lógica parcial, mocks conectados, falta persistência ou regras complexas.
- 🟢 **Concluído**: Funcionalidade completa, testada e integrada.

---

## Fase 1: Core & Navegação (Fundação)
O foco inicial é garantir que a estrutura base funcione perfeitamente, permitindo navegação fluida e gestão de identidade.

| Módulo / Componente | Funcionalidade | Status | Observações |
|---------------------|----------------|--------|-------------|
| **Layout Principal** | Sidebar Responsiva | 🟡 | Verificar comportamento mobile e transições. |
| | Command Palette (Ctrl+K) | 🟢 | Busca global funcional com clientes dinâmicos. |
| | Notificações | 🔴 | Conectar ao contexto de notificações reais. |
| | Tema & Estilos | 🟢 | Base Tailwind configurada. |
| **Autenticação** | Login Page | 🟡 | Lógica de login mockada. Precisa de validação real/simulada robusta. |
| | Proteção de Rotas | 🟢 | `ProtectedRoute` implementado. |
| | Troca de Papéis (Dev) | 🟢 | Funcional para testes. |
| **Perfil de Usuário** | Edição de Perfil | 🔴 | Salvar alterações de nome/foto/senha. |
| | Preferências | 🔴 | Persistir tema, idioma e notificações. |
| **Dashboard** | Briefing Matinal | 🟢 | Conectado aos dados reais (agenda, financeiro, alertas). |
| | KPIs em Tempo Real | 🟢 | Faturamento, salas, leads e NPS dinâmicos. |
| | Gráficos | 🟢 | Performance semanal com dados do contexto. |

## Fase 2: Operacional Clínico (O Coração do Spa)
Foco no dia a dia da clínica: agenda, atendimento e gestão de espaços.

| Módulo | Funcionalidade | Status | Observações |
|--------|----------------|--------|-------------|
| **Agenda (Scheduling)** | Visualização Calendário | 🟢 | Grid, Lista e Semana funcionais. |
| | Criação de Agendamento | 🟢 | Com validação de conflitos de horário. |
| | Status (Check-in/out) | 🟢 | Atualização de status funcional. |
| | Checkout & Pagamento | 🟢 | Gera transação no financeiro. |
| | Lista de Espera | 🟢 | Adicionar/remover da waitlist. |
| **Salas (Rooms)** | Mapa de Salas | 🟢 | Sincronização automática com agenda em tempo real. |
| | Status Automático | 🟢 | Salas ocupadas/liberadas automaticamente. |
| | Próximo Agendamento | 🟢 | Exibe horário do próximo atendimento. |
| | Status Equipamentos | 🔴 | Gestão de manutenção e ativos dentro da sala. |
| **Concierge** | Fila de Espera | 🔴 | Lógica de prioridade e notificação. |
| | Check-in Flow | 🔴 | Fluxo de recepção do cliente. |

## Fase 3: CRM & Vendas (Crescimento)
Gestão do relacionamento com o cliente e conversão de leads.

| Módulo | Funcionalidade | Status | Observações |
|--------|----------------|--------|-------------|
| **CRM** | Lista de Clientes | 🟢 | Filtros, busca e visualização completa. |
| | Perfil Detalhado | 🟢 | Timeline com histórico real de agendamentos e transações. |
| | LTV Calculado | 🟢 | Valor real baseado em transações do contexto. |
| | Total de Visitas | 🟢 | Contador automático de agendamentos concluídos. |
| | Galeria de Fotos | 🟡 | Interface pronta, falta upload real. |
| **Funil (Funnel)** | Kanban de Vendas | 🟡 | Arrastar cards para mudar estágio. |
| | Automação de Leads | 🔴 | Regras para mover leads estagnados. |
| **Marketplace/Estoque** | Vitrine de Produtos | 🟡 | Adicionar ao carrinho funciona (local). |
| | Gestão de Estoque | 🟡 | Baixa automática ao vender/usar. |
| | Compras/Fornecedores | 🔴 | Gerar pedidos reais e entrada de nota. |

## Fase 4: Financeiro & Administrativo
Controle de fluxo de caixa e gestão de equipe.

| Módulo | Funcionalidade | Status | Observações |
|--------|----------------|--------|-------------|
| **Financeiro** | Fluxo de Caixa | 🟡 | Gráficos com dados mockados. |
| | Contas a Pagar/Receber | 🔴 | CRUD completo de transações. |
| | Fechamento de Caixa | 🔴 | Relatório final do dia e conferência. |
| **Diva Pay** | Link de Pagamento | 🔴 | Simulação de geração de link/QR Code Pix. |
| | Split de Pagamento | 🔴 | Regras de comissão automática. |
| **Staff** | Gestão de Equipe | 🟡 | Lista de colaboradores. |
| | Cálculo de Comissões | 🔴 | Lógica baseada em serviços realizados. |
| | Metas & Performance | 🔴 | Dashboard individual do colaborador. |

## Fase 5: Expansão & Fidelidade
Ferramentas para reter clientes e expandir a marca.

| Módulo | Funcionalidade | Status | Observações |
|--------|----------------|--------|-------------|
| **Loyalty** | Clube de Pontos | 🔴 | Regras de pontuação e resgate. |
| **Marketing** | Campanhas | 🔴 | Disparos (simulados) de Email/WhatsApp. |
| **Parceiros** | Gestão de Afiliados | 🔴 | Rastreamento de indicações. |
| **Site Builder** | Editor de Landing Page | 🔴 | Configuração básica do site público. |

## Fase 6: Módulos Especiais & IA
Funcionalidades avançadas e diferenciais.

| Módulo | Funcionalidade | Status | Observações |
|--------|----------------|--------|-------------|
| **Diva AI** | Chatbot Assistente | 🟡 | Interface existe. Falta "inteligência" contextual. |
| **Kiosk** | Auto-atendimento | 🟡 | Interface tablet para clientes. |
| **TV** | Signage | 🟡 | Display de chamadas e promoções. |
| **Outros** | Lavanderia, Compliance | 🔴 | Implementação pendente. |

---

## Próximos Passos Imediatos
1.  **Revisão do Dashboard Principal**: Garantir que os KPIs reflitam dados do Contexto (mesmo que mockados) e que os botões de ação rápida (Briefing, etc) funcionem.
2.  **Módulo de Agenda**: É o core. Precisamos garantir que criar/editar/mover agendamentos funcione perfeitamente.
3.  **Módulo Financeiro**: Conectar as transações geradas na agenda/loja com o fluxo de caixa.
