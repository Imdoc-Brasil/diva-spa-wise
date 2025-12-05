# 🧪 Plano de Teste Manual - Diva Spa OS

Este guia orienta a validação completa do sistema, cobrindo os fluxos críticos de ponta a ponta.

---

## 🛠️ Pré-requisitos
1. Certifique-se de ter `Node.js` e `npm` instalados.
2. No terminal, na pasta do projeto, execute:
   ```bash
   npm install
   npm run dev
   ```
3. Acesse `http://localhost:5173` (ou a porta indicada).

---

## 1. 🚦 Fluxo de Check-in & Atendimento (End-to-End)

**Objetivo**: Validar a jornada do cliente desde a chegada até o atendimento.

1. **Login**: Entre como `Admin` ou `Staff`.
2. **Kiosk (Simulação)**:
   - Abra uma nova aba anônima em `http://localhost:5173/#/kiosk`.
   - Simule um check-in com um número de telefone (ex: `11999999999`).
   - Preencha o formulário de anamnese.
   - Assine digitalmente e finalize.
3. **Recepção (Concierge)**:
   - Volte para a aba principal.
   - Vá para o módulo **Concierge**.
   - Verifique se o cliente aparece na lista de "Check-in Realizado".
4. **Agenda (Scheduling)**:
   - Vá para **Agenda**.
   - Localize o agendamento do dia.
   - Arraste o card para a coluna "Em Atendimento".
5. **Mapa de Salas**:
   - Vá para **Salas**.
   - Verifique se a sala correspondente está ocupada (Vermelha).

---

## 2. 💰 Fluxo Financeiro & Checkout

**Objetivo**: Validar pagamento, estoque e comissões.

1. **Iniciar Checkout**:
   - Na Agenda, clique no agendamento "Em Atendimento".
   - Clique em **Finalizar / Checkout**.
2. **Adicionar Produtos**:
   - No modal de Checkout, clique na aba "Produtos".
   - Adicione um produto (ex: "Home Care Kit").
   - Verifique se o valor total atualizou.
3. **Pagamento**:
   - Selecione "Pagamento Misto" (Split).
   - Pague metade em **Dinheiro** e metade em **Crédito**.
   - Clique em **Finalizar Venda**.
4. **Validação**:
   - Vá para **Financeiro** → **Transações**.
   - Verifique se as transações de receita foram criadas.
   - Verifique se a transação de despesa (Comissão) foi gerada automaticamente.
   - Vá para **Marketplace** → **Estoque**.
   - Confirme se a quantidade do produto vendido foi reduzida.

---

## 3. 🏥 Fluxo Clínico & Compliance

**Objetivo**: Validar segurança e rastreabilidade.

1. **Farmácia**:
   - Vá para **Farmácia** → **Geladeira Virtual**.
   - Clique em "Abrir Novo Frasco".
   - Registre um frasco de Botox.
   - Vá para a aba **Calculadora** e simule uma diluição.
2. **Compliance**:
   - Vá para **Compliance** → **Resíduos**.
   - Registre uma nova coleta de lixo infectante.
   - Verifique se o gráfico atualizou.

---

## 4. 🔧 Fluxo Operacional (Enxoval & Ativos)

**Objetivo**: Validar gestão de recursos.

1. **Enxoval (Lavanderia)**:
   - Vá para **Lavanderia**.
   - Na aba "Remessas", clique em "Enviar para Lavanderia".
   - Selecione itens sujos e confirme.
   - Verifique se o status dos itens mudou para "Lavanderia".
2. **Ativos**:
   - Vá para **Ativos**.
   - Selecione um equipamento.
   - Clique em "Agendar Manutenção".
   - Crie um agendamento preventivo.
   - Verifique se apareceu na aba "Agenda de Manutenção".

---

## 5. 🤖 Fluxo de Inteligência (Diva AI)

**Objetivo**: Validar o assistente virtual.

1. **Abrir Chat**:
   - Clique no ícone da Diva AI (canto inferior direito ou atalho).
2. **Perguntas de Teste**:
   - Digite: "Como está o faturamento hoje?" (Deve mostrar widget financeiro).
   - Digite: "Criar post sobre Laser" (Deve gerar texto de marketing).
   - Digite: "Buscar cliente Ana" (Deve mostrar card do cliente).

---

## ✅ Checklist Final

- [ ] Navegação entre todos os módulos está fluida?
- [ ] Dark mode/Light mode (se aplicável) está visualmente correto?
- [ ] Responsividade: Teste redimensionar a janela para tamanho de celular.
- [ ] Nenhuma tela branca (Crash) durante os fluxos.

Se todos os itens acima passarem, o sistema está **Pronto para Produção (Beta)**! 🚀
