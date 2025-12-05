# Guia de Teste - Checkout & Pagamento

## 🎯 Objetivo
Testar o fluxo completo de checkout, desde o agendamento até a criação da transação no financeiro.

---

## 📋 Passo a Passo

### 1. **Abrir o Modal de Checkout**

Na **Agenda** (`/schedule`):
- Clique no agendamento que está "Em Progresso"
- No modal de atendimento, procure o **botão $ (cifrão)** 
- Ou clique no botão "Checkout" na lista

**Localização do botão:**
- **Modo Grid**: Botão $ no canto inferior direito do card
- **Modo Lista**: Botão $ verde na linha do agendamento

---

### 2. **Tela de Checkout - O Que Você Verá**

#### Coluna Esquerda (Resumo):
- ✅ Nome do cliente
- ✅ Serviço principal (ex: Depilação a Laser - Perna)
- ✅ Valor do serviço
- ✅ Produtos para upsell (adicionar à venda)

#### Coluna Direita (Pagamento):
- ✅ Subtotal
- ✅ Campo para cupom de desconto
- ✅ Total a pagar
- ✅ Formas de pagamento

---

### 3. **Funcionalidades para Testar**

#### A) **Adicionar Produtos (Upsell)**
1. Na coluna esquerda, veja os produtos sugeridos
2. Clique em qualquer produto (ex: "Hidratante Pós-Laser")
3. ✅ Produto é adicionado à lista
4. ✅ Total é atualizado
5. ✅ Toast de confirmação aparece

#### B) **Aplicar Cupom de Desconto**
1. No campo "Cupom", digite: **BEMVINDO20**
2. Clique em "Aplicar"
3. ✅ Desconto de 20% é aplicado
4. ✅ Total é recalculado
5. ✅ Badge verde mostra o cupom aplicado

**Cupons disponíveis para teste:**
- `BEMVINDO20` - 20% de desconto (mínimo R$ 100)
- `VERAO50` - R$ 50 OFF (mínimo R$ 200)

#### C) **Usar Pacote do Cliente**
Se o cliente tiver um pacote ativo:
1. Aparece um alerta roxo "Pacote Disponível"
2. Clique em "Usar Sessão"
3. ✅ Valor do serviço vai para R$ 0,00
4. ✅ Forma de pagamento muda para "Pacote"

#### D) **Selecionar Forma de Pagamento**
1. Escolha uma das opções:
   - **Crédito**
   - **Débito**
   - **PIX**
   - **Dinheiro**
2. ✅ Botão fica destacado
3. ✅ Botão "Finalizar Pedido" fica habilitado

---

### 4. **Finalizar Pagamento**

1. Clique em **"Finalizar Pedido"**
2. ✅ Botão mostra "Processando..." por 1.5s
3. ✅ Tela de sucesso aparece com:
   - Ícone verde de check
   - "Venda Realizada!"
   - Número da fatura
   - Botões: WhatsApp e Imprimir

---

### 5. **Verificar Resultados**

#### A) **No Módulo Financeiro**
1. Feche o modal de checkout
2. Vá para **Financeiro** (`/finance`)
3. ✅ **Nova transação de entrada** deve aparecer
4. ✅ Descrição: "Pagamento: [Nome Cliente] - [Serviço]"
5. ✅ Valor correto
6. ✅ Status: "Pago"

#### B) **Status do Agendamento**
1. Volte para **Agenda** (`/schedule`)
2. ✅ Agendamento deve estar com status **"Concluído"**
3. ✅ Aparência visual mudou (cinza/opaco)

#### C) **Status da Sala**
1. Vá para **Salas** (`/rooms`)
2. ✅ Sala deve estar **"Livre"** novamente
3. ✅ Não mostra mais o cliente

#### D) **Perfil do Cliente (CRM)**
1. Vá para **CRM** (`/crm`)
2. Clique no cliente
3. Aba **"Linha do Tempo"**:
   - ✅ Agendamento aparece
   - ✅ Transação de pagamento aparece
4. ✅ **LTV atualizado** com o valor pago

---

## 🎯 Fluxo Completo de Teste

```
1. Agenda → Criar agendamento
2. Agenda → Mudar para "Em Progresso"
3. Salas → Verificar ocupada ✅
4. Agenda → Abrir checkout ($)
5. Checkout → Adicionar produto
6. Checkout → Aplicar cupom BEMVINDO20
7. Checkout → Selecionar PIX
8. Checkout → Finalizar
9. Financeiro → Ver transação ✅
10. Agenda → Ver status "Concluído" ✅
11. Salas → Ver sala livre ✅
12. CRM → Ver timeline do cliente ✅
```

---

## 💡 Dicas

- **Botão $ está sempre visível** nos cards de agendamento
- **Cupons são case-insensitive** (pode digitar minúsculo)
- **Pacotes são detectados automaticamente** se o nome do serviço coincidir
- **Split payment** está disponível mas é mockado (clique em "Dividir Valor")

---

## 🐛 Se Algo Não Funcionar

1. **Checkout não abre?**
   - Verifique se clicou no botão $ (cifrão)
   - Tente no modo Lista em vez do Grid

2. **Transação não aparece no Financeiro?**
   - Recarregue a página (F5)
   - Verifique se finalizou o pagamento

3. **Sala não liberou?**
   - Verifique se o status mudou para "Concluído"
   - Recarregue o módulo de Salas
