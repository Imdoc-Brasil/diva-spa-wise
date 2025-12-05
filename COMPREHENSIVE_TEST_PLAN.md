# 🧪 Plano de Testes Completo - Diva Spa CRM

## Data: 28 de Novembro de 2024
## Objetivo: Testar todos os módulos e realizar ajustes finos necessários

---

## 📋 Checklist de Módulos

### ✅ Módulos Principais
- [ ] Dashboard
- [ ] Inbox & Chat
- [ ] Agenda (Scheduling)
- [ ] Tarefas & Ops
- [ ] Concierge
- [ ] Mapa de Salas
- [ ] Farmácia
- [ ] Boutique Diva
- [ ] Enviar
- [ ] Ativos & Manufatura
- [ ] CRM Clientes
- [ ] Equipe (Staff)

---

## 🔍 Testes Detalhados por Módulo

### 1. DASHBOARD
**Funcionalidades a Testar:**
- [ ] Exibição de métricas (Receita, Atendimentos, NPS)
- [ ] Gráficos de performance
- [ ] Alertas e notificações
- [ ] Filtros de data funcionando
- [ ] Responsividade mobile

**Possíveis Problemas:**
- Dados mockados podem não refletir realidade
- Gráficos podem não renderizar corretamente

---

### 2. AGENDA (SCHEDULING)
**Funcionalidades a Testar:**
- [ ] **Visualização Dia (Grid)**
  - [ ] Todas as salas aparecem (incluindo Sala 01 - Laser Master)
  - [ ] Agendamentos aparecem nas salas corretas
  - [ ] Cores de status funcionando (Agendado, Em Progresso, Concluído, Cancelado)
  
- [ ] **Visualização Semana (Week)**
  - [ ] Agendamentos sobrepostos aparecem lado a lado
  - [ ] Filtro por sala funciona
  - [ ] Dropdown "Todas as Salas" vs sala específica
  
- [ ] **Visualização Lista**
  - [ ] Ordenação por data/hora
  - [ ] Filtros funcionando
  
- [ ] **Novo Agendamento**
  - [ ] Modal abre corretamente
  - [ ] Seleção de cliente
  - [ ] Seleção de serviço
  - [ ] Seleção de profissional
  - [ ] Seleção de sala
  - [ ] Data e horário
  - [ ] Salvamento funciona

**Ajustes Recentes:**
✅ Grid View usa salas dinâmicas
✅ Week View com detecção de sobreposição
✅ Filtro por sala na Week View

**Possíveis Problemas:**
- Validação de horários conflitantes
- Disponibilidade de profissionais

---

### 3. EQUIPE (STAFF)
**Funcionalidades a Testar:**
- [ ] **Visualização de Cards**
  - [ ] Métricas de performance aparecem
  - [ ] Status (Disponível, Em Atendimento, Intervalo)
  - [ ] Botão de editar funciona
  
- [ ] **Adicionar Novo Profissional**
  - [ ] Modal abre
  - [ ] **Aba Dados Básicos:**
    - [ ] Nome, Cargo, Email, Telefone, CPF, Endereço
    - [ ] Campo de Assinatura Profissional
    - [ ] Especialidades (seleção múltipla)
  
  - [ ] **Aba Horários:**
    - [ ] Configuração de horário por dia da semana
    - [ ] Botão "Folga" funciona
    - [ ] Horários salvam corretamente
  
  - [ ] **Aba Serviços & Comissão:**
    - [ ] Taxa de comissão padrão (slider 0-50%)
    - [ ] Seleção de serviços
    - [ ] **NOVO:** Comissão personalizada por serviço
    - [ ] Campo aparece quando serviço é selecionado
    - [ ] Placeholder mostra taxa padrão
    - [ ] Seleção de salas de atendimento
    - [ ] **NOVO:** Dados bancários (Banco, Agência, Conta, Tipo, PIX, Tipo PIX)
  
- [ ] **Editar Profissional Existente**
  - [ ] Dados carregam corretamente
  - [ ] Alterações salvam
  - [ ] Comissões personalizadas persistem

**Ajustes Recentes:**
✅ Campo de assinatura profissional
✅ Seleção de salas de atendimento
✅ Comissões personalizadas por serviço
✅ Dados bancários completos

**Possíveis Problemas:**
- Validação de CPF
- Formato de telefone
- Validação de chave PIX

---

### 4. MAPA DE SALAS
**Funcionalidades a Testar:**
- [ ] **Visualização de Salas**
  - [ ] Grid View mostra todas as salas
  - [ ] Status em tempo real (Livre, Ocupada, Limpeza, Manutenção)
  - [ ] Agendamento atual aparece se sala ocupada
  - [ ] Próximo agendamento aparece
  
- [ ] **Adicionar Nova Sala**
  - [ ] Botão "Gerenciar Salas" funciona
  - [ ] Campo de nome
  - [ ] Dropdown de tipo:
    - [ ] Tratamento
    - [ ] Spa / Relax
    - [ ] Consultório
    - [ ] **NOVO:** Virtual / Telemedicina
  - [ ] Sala é criada e aparece na lista
  
- [ ] **Editar/Deletar Sala**
  - [ ] Botão de deletar aparece no modo edição
  - [ ] Confirmação de deleção
  
- [ ] **Sala Virtual**
  - [ ] Ícone de vídeo aparece
  - [ ] Label "Virtual / Telemedicina"
  - [ ] Campo meetingUrl (se aplicável)

**Ajustes Recentes:**
✅ Tipo "Virtual / Telemedicina" adicionado
✅ Ícone de vídeo para salas virtuais
✅ Sala "Online (Tele)" mockada

**Possíveis Problemas:**
- Sincronização de status com agendamentos
- Equipamentos e ambiência para salas virtuais

---

### 5. CONCIERGE
**Funcionalidades a Testar:**
- [ ] **Fluxo de Pacientes**
  - [ ] Colunas na ordem correta:
    1. Recepção / Aguardando
    2. **Checkout / Pagamento** (movido para cá)
    3. Em Preparo (Anestésico)
    4. Em Procedimento
    5. Recuperação / Relax
  
- [ ] **Movimentação de Pacientes**
  - [ ] Botão "Avançar" funciona
  - [ ] Botão "Voltar" funciona
  - [ ] Última coluna não tem botão "Avançar"
  
- [ ] **Informações do Paciente**
  - [ ] Nome, serviço, horário aparecem
  - [ ] Cores por status

**Ajustes Recentes:**
✅ Pagamento movido para antes do procedimento

**Possíveis Problemas:**
- Lógica de navegação entre estágios

---

### 6. MARKETPLACE (BOUTIQUE DIVA)
**Funcionalidades a Testar:**
- [ ] **Para Administrador:**
  - [ ] Visualização de produtos
  - [ ] Adicionar ao carrinho
  - [ ] Botão "Receber Pedido" funciona
  - [ ] Carrinho limpa após receber
  
- [ ] **Para Cliente:**
  - [ ] Visualização de produtos
  - [ ] Adicionar ao carrinho
  - [ ] **NOVO:** Botão "Checkout" funciona
  - [ ] Alerta de sucesso aparece
  - [ ] Carrinho limpa após checkout
  - [ ] Botão desabilitado quando carrinho vazio

**Ajustes Recentes:**
✅ Checkout ativado para clientes

**Possíveis Problemas:**
- Integração com estoque
- Cálculo de totais

---

### 7. CRM CLIENTES
**Funcionalidades a Testar:**
- [ ] **Listagem de Clientes**
  - [ ] Busca funciona
  - [ ] Filtros (Ativo, Lead, Inativo)
  - [ ] Ordenação
  
- [ ] **Detalhes do Cliente**
  - [ ] Informações pessoais
  - [ ] Histórico de agendamentos
  - [ ] Documentos
  - [ ] Fotos antes/depois
  - [ ] Pacotes e créditos
  
- [ ] **Adicionar Novo Cliente**
  - [ ] Formulário completo
  - [ ] Validações

**Possíveis Problemas:**
- Performance com muitos clientes
- Upload de fotos

---

### 8. FARMÁCIA
**Funcionalidades a Testar:**
- [ ] Listagem de produtos
- [ ] Controle de estoque
- [ ] Alertas de estoque baixo
- [ ] Movimentações

**Possíveis Problemas:**
- Sincronização de estoque
- Validação de quantidades

---

### 9. INBOX & CHAT
**Funcionalidades a Testar:**
- [ ] Listagem de conversas
- [ ] Envio de mensagens
- [ ] Notificações
- [ ] Busca

**Possíveis Problemas:**
- Tempo real (mockado)
- Ordenação por data

---

### 10. TAREFAS & OPS
**Funcionalidades a Testar:**
- [ ] Criação de tarefas
- [ ] Atribuição
- [ ] Status (Pendente, Em Progresso, Concluída)
- [ ] Filtros

**Possíveis Problemas:**
- Notificações
- Priorização

---

## 🎯 Testes de Integração

### Fluxo Completo: Novo Agendamento
1. [ ] Cliente cadastrado no CRM
2. [ ] Profissional cadastrado com:
   - [ ] Serviços configurados
   - [ ] Comissões personalizadas
   - [ ] Salas de atendimento
   - [ ] Horários de trabalho
3. [ ] Sala disponível
4. [ ] Criar agendamento na Agenda
5. [ ] Verificar aparece no Concierge
6. [ ] Mover paciente pelo fluxo
7. [ ] Finalizar com checkout
8. [ ] Verificar comissão calculada corretamente

### Fluxo Completo: Venda de Produto
1. [ ] Produto em estoque (Farmácia)
2. [ ] Cliente adiciona ao carrinho (Marketplace)
3. [ ] Checkout
4. [ ] Estoque atualiza
5. [ ] Receita contabilizada

---

## 🐛 Bugs Conhecidos para Verificar

### Prioridade Alta
- [ ] Nomes de salas consistentes entre módulos
- [ ] Agendamentos sobrepostos na Week View
- [ ] Checkout para clientes no Marketplace

### Prioridade Média
- [ ] Validação de horários conflitantes
- [ ] Sincronização de status de salas
- [ ] Cálculo de comissões

### Prioridade Baixa
- [ ] Formatação de moeda
- [ ] Formatação de telefone
- [ ] Validação de CPF

---

## 📱 Testes de Responsividade

### Desktop (1920x1080)
- [ ] Todos os módulos renderizam corretamente
- [ ] Modais centralizados
- [ ] Tabelas com scroll horizontal se necessário

### Tablet (768x1024)
- [ ] Menu lateral funciona
- [ ] Grids adaptam para 2 colunas
- [ ] Modais ocupam largura adequada

### Mobile (375x667)
- [ ] Menu lateral colapsa
- [ ] Cards empilham verticalmente
- [ ] Modais ocupam tela inteira
- [ ] Botões acessíveis

---

## 🎨 Testes de UI/UX

### Consistência Visual
- [ ] Cores do tema aplicadas consistentemente
- [ ] Tipografia uniforme
- [ ] Espaçamentos consistentes
- [ ] Ícones do mesmo estilo

### Feedback ao Usuário
- [ ] Toasts aparecem para ações
- [ ] Loading states visíveis
- [ ] Mensagens de erro claras
- [ ] Confirmações para ações destrutivas

### Acessibilidade
- [ ] Contraste adequado
- [ ] Textos legíveis
- [ ] Botões com tamanho mínimo
- [ ] Navegação por teclado

---

## 🔧 Ajustes Finos Necessários

### Validações
- [ ] CPF válido
- [ ] Email válido
- [ ] Telefone no formato correto
- [ ] Horários válidos (início < fim)
- [ ] Datas futuras para agendamentos

### Mensagens de Erro
- [ ] Campos obrigatórios destacados
- [ ] Mensagens específicas e úteis
- [ ] Sugestões de correção

### Performance
- [ ] Listas longas com paginação ou virtualização
- [ ] Imagens otimizadas
- [ ] Lazy loading de módulos

### Dados Mockados
- [ ] Dados realistas e consistentes
- [ ] Relacionamentos corretos (cliente-agendamento-profissional)
- [ ] Datas relevantes (não muito antigas)

---

## 📊 Relatório de Testes

### Template para Cada Módulo:
```
## [Nome do Módulo]
**Status:** ✅ Passou | ⚠️ Com Ressalvas | ❌ Falhou

**Funcionalidades Testadas:**
- [x] Funcionalidade 1 - OK
- [ ] Funcionalidade 2 - Problema: [descrição]

**Bugs Encontrados:**
1. [Descrição do bug]
   - Severidade: Alta/Média/Baixa
   - Passos para reproduzir
   - Comportamento esperado vs atual

**Melhorias Sugeridas:**
1. [Sugestão]
```

---

## 🚀 Próximos Passos Após Testes

1. **Corrigir Bugs Críticos**
   - Bugs que impedem uso básico
   - Problemas de segurança

2. **Implementar Validações Faltantes**
   - Formulários
   - Regras de negócio

3. **Melhorar UX**
   - Feedback visual
   - Mensagens claras
   - Fluxos intuitivos

4. **Otimizar Performance**
   - Lazy loading
   - Memoização
   - Virtualização de listas

5. **Documentação**
   - Manual do usuário
   - Guia de funcionalidades
   - FAQ

---

## 📝 Notas

- Priorize testes de fluxos completos sobre funcionalidades isoladas
- Teste com diferentes perfis de usuário (Admin, Staff, Cliente)
- Anote qualquer comportamento inesperado, mesmo que pequeno
- Considere casos extremos (campos vazios, valores muito grandes, etc.)

---

**Última Atualização:** 28/11/2024
**Responsável:** Equipe de Desenvolvimento
**Próxima Revisão:** Após execução dos testes
