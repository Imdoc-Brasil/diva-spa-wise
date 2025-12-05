# Guia de Testes - Diva Spa OS

Este guia ajudará você a testar todas as funcionalidades implementadas.

## 🚀 Como Iniciar

1. **Instalar dependências** (se ainda não fez):
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acessar no navegador**:
   - URL: `http://localhost:3000`

---

## ✅ Checklist de Testes

### 1. Login & Navegação Básica

- [ ] A tela de login aparece ao acessar
- [ ] Consegue fazer login como Admin/Manager/Staff
- [ ] Sidebar abre e fecha corretamente
- [ ] Sidebar é responsiva no mobile (vira drawer)
- [ ] **Command Palette** abre com `Cmd+K` (Mac) ou `Ctrl+K` (Windows)
- [ ] Busca por clientes no Command Palette funciona
- [ ] Navegação entre módulos funciona

### 2. Dashboard Principal

- [ ] **Briefing Matinal** abre ao clicar no botão
- [ ] Mostra dados reais de agendamentos do dia
- [ ] Mostra faturamento de ontem vs meta
- [ ] Alertas operacionais aparecem (estoque, contas, leads)
- [ ] KPIs mostram valores corretos:
  - Faturamento Hoje
  - Salas Ocupadas
  - Novos Leads
  - NPS
- [ ] Gráfico de Performance Semanal renderiza
- [ ] Cards clicáveis navegam para os módulos corretos

### 3. Módulo de Agenda

#### Visualização
- [ ] **Modo Grid (Dia)**: Mostra salas como colunas
- [ ] **Modo Lista**: Mostra agendamentos em lista
- [ ] **Modo Semana**: Mostra 6 dias da semana
- [ ] Navegação de data (anterior/próximo/hoje) funciona
- [ ] Agendamentos aparecem no horário correto

#### Criar Agendamento
- [ ] Botão "Novo Agendamento" abre modal
- [ ] Consegue selecionar cliente da lista
- [ ] Consegue selecionar serviço
- [ ] Consegue escolher data e horário
- [ ] **Alerta de conflito** aparece se sala já ocupada
- [ ] Toast de sucesso aparece ao criar
- [ ] Agendamento aparece na grade imediatamente

#### Ações no Agendamento
- [ ] Clicar em agendamento abre modal de detalhes
- [ ] Botão de checkout abre modal de pagamento
- [ ] Cancelar agendamento funciona
- [ ] Mover para lista de espera funciona

### 4. Módulo de Salas

- [ ] Salas mostram status correto (Livre/Ocupada/Limpeza/Manutenção)
- [ ] **Sala ocupada** mostra:
  - Nome do cliente
  - Serviço em andamento
  - Horário de término
- [ ] **Sala livre** mostra próximo agendamento
- [ ] Alternar entre Grid e Lista funciona
- [ ] Filtro por status funciona
- [ ] **Sincronização automática**: Sala fica ocupada quando agendamento está "Em Progresso"

### 5. Módulo CRM

#### Lista de Clientes
- [ ] Tabela mostra todos os clientes
- [ ] Score RFM aparece com barra de progresso
- [ ] Tags comportamentais aparecem
- [ ] LTV (Lifetime Value) está correto
- [ ] Clientes VIP (score > 70) têm destaque

#### Perfil do Cliente
- [ ] Clicar em cliente abre modal de perfil
- [ ] **Aba Timeline**:
  - Mostra agendamentos reais do cliente
  - Mostra transações do cliente
  - Ordenação cronológica correta
- [ ] **Métricas calculadas**:
  - Total de visitas está correto
  - LTV calculado automaticamente
- [ ] Abas de Galeria, Documentos e Carteira abrem

### 6. Módulo Financeiro

- [ ] Gráfico de Fluxo de Caixa renderiza
- [ ] Total de Entradas está correto
- [ ] Total de Saídas está correto
- [ ] Lucro Líquido calculado corretamente
- [ ] Tabela de transações mostra dados
- [ ] Botão "Nova Transação" abre modal

### 7. Checkout & Pagamento

- [ ] Modal de checkout abre ao clicar no botão $
- [ ] Mostra dados do agendamento
- [ ] Consegue finalizar pagamento
- [ ] **Transação é criada** no módulo financeiro
- [ ] **Status do agendamento** muda para "Concluído"

---

## 🐛 Bugs Conhecidos (Para Corrigir)

- [ ] Type error no ClientProfileModal (linha 234) - não afeta funcionalidade
- [ ] Alguns mocks ainda não conectados (fotos, documentos)

---

## 🎯 Fluxo de Teste Completo Sugerido

1. **Login** como Manager
2. **Dashboard**: Clicar em "Briefing Matinal" e verificar dados
3. **Agenda**: Criar um novo agendamento para hoje às 14:00
4. **Salas**: Verificar que sala está livre
5. **Agenda**: Mudar status do agendamento para "Em Progresso"
6. **Salas**: Verificar que sala agora está ocupada (sincronização automática!)
7. **Agenda**: Fazer checkout do agendamento
8. **Financeiro**: Verificar que transação foi criada
9. **CRM**: Abrir perfil do cliente e ver o agendamento na timeline
10. **Command Palette**: Buscar o cliente pelo nome

---

## 📝 Notas

- Todos os dados são salvos no `localStorage` do navegador
- Para resetar dados, limpe o localStorage ou use modo anônimo
- O sistema usa dados mockados iniciais para demonstração
