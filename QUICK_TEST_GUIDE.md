# 🚀 Guia Rápido de Testes - Diva Spa CRM

## Como Iniciar os Testes

### 1. Iniciar o Servidor de Desenvolvimento

```bash
cd "/Users/mimaejack/Library/Mobile Documents/com~apple~CloudDocs/diva-spa-wise"
npm run dev
```

O servidor iniciará em: **http://localhost:3000**

---

## 2. Sequência Recomendada de Testes

### 🎯 Fase 1: Testes Básicos (30 min)
Teste se os módulos principais abrem e funcionam:

1. **Dashboard** - Abra e verifique se métricas aparecem
2. **Agenda** - Teste as 3 visualizações (Dia, Semana, Lista)
3. **Equipe** - Abra o modal de adicionar profissional
4. **Mapa de Salas** - Verifique se todas as salas aparecem
5. **Concierge** - Veja se as colunas estão na ordem correta

### 🔍 Fase 2: Funcionalidades Novas (45 min)
Teste as funcionalidades que acabamos de implementar:

#### **Agenda:**
- [ ] Grid View mostra "Sala 01 - Laser Master"?
- [ ] Week View: Crie 2 agendamentos no mesmo horário → Aparecem lado a lado?
- [ ] Week View: Filtro por sala funciona?

#### **Equipe (Staff):**
- [ ] Adicionar novo profissional:
  - [ ] Aba Dados Básicos: Campo "Assinatura Profissional" aparece?
  - [ ] Aba Serviços: Ao selecionar um serviço, aparece campo de comissão?
  - [ ] Aba Serviços: Campo de comissão mostra placeholder com taxa padrão?
  - [ ] Aba Serviços: Seção de salas de atendimento aparece?
  - [ ] Aba Serviços: Seção de dados bancários aparece?

#### **Mapa de Salas:**
- [ ] Ao criar nova sala, opção "Virtual / Telemedicina" está disponível?
- [ ] Sala "Online (Tele)" aparece com ícone de vídeo?

#### **Concierge:**
- [ ] "Checkout / Pagamento" está na 2ª posição (antes do procedimento)?

#### **Marketplace:**
- [ ] Como cliente, botão "Checkout" funciona?
- [ ] Carrinho limpa após checkout?

### 🧪 Fase 3: Testes de Integração (60 min)
Teste fluxos completos:

#### **Fluxo 1: Cadastrar Profissional Completo**
1. Vá em **Equipe** → Adicionar Staff
2. Preencha **todos** os campos:
   - Nome: Dra. Carla Dias
   - Cargo: Biomédica
   - Email: carla@divaspa.com
   - Telefone: (71) 99999-9999
   - CPF: 123.456.789-00
   - Assinatura: `Dra Carla Dias - CRM 21452-BA|RQE 15461`
3. Aba Horários:
   - Segunda a Sexta: 09:00 - 18:00
   - Sábado: 09:00 - 14:00
   - Domingo: Folga
4. Aba Serviços:
   - Taxa padrão: 10%
   - Selecione "Depilação a Laser" → Comissão: 15%
   - Selecione "Botox" → Comissão: 5%
   - Selecione "Limpeza de Pele" → Deixe em branco (usará 10%)
   - Salas: Sala 01 - Laser Master, Sala 02 - Facial
   - Banco: Nubank
   - Chave PIX: 123.456.789-00
   - Tipo: CPF
5. Salvar
6. Editar novamente → Dados persistiram?

#### **Fluxo 2: Criar Agendamento com Sobreposição**
1. Vá em **Agenda** → Visualização Dia
2. Crie agendamento 1:
   - Cliente: Ana Silva
   - Serviço: Botox
   - Profissional: Dra. Julia
   - Sala: Consultório A
   - Data: Hoje
   - Horário: 14:00 - 14:30
3. Crie agendamento 2:
   - Cliente: Maria Santos
   - Serviço: Limpeza de Pele
   - Profissional: Fernanda
   - Sala: Consultório A (mesma sala!)
   - Data: Hoje
   - Horário: 14:00 - 15:00 (mesmo horário!)
4. Mude para **Visualização Semana**
5. Os 2 agendamentos aparecem lado a lado?
6. Use o filtro "Consultório A" → Só esses 2 aparecem?

#### **Fluxo 3: Jornada do Paciente no Concierge**
1. Vá em **Concierge**
2. Encontre um paciente em "Recepção / Aguardando"
3. Clique "Avançar" → Vai para "Checkout / Pagamento"?
4. Clique "Avançar" → Vai para "Em Preparo"?
5. Continue até "Recuperação / Relax"
6. Botão "Avançar" desaparece na última coluna?

---

## 3. Reportar Problemas

### Se encontrar um bug:

**Formato do Reporte:**
```
## Bug: [Título curto]

**Módulo:** [Nome do módulo]
**Severidade:** Alta / Média / Baixa

**Passos para Reproduzir:**
1. Passo 1
2. Passo 2
3. Passo 3

**Comportamento Esperado:**
[O que deveria acontecer]

**Comportamento Atual:**
[O que está acontecendo]

**Screenshot:** [Se possível]
```

### Onde reportar:
- Anote no arquivo `COMPREHENSIVE_TEST_PLAN.md`
- Ou me envie diretamente para correção imediata

---

## 4. Checklist Rápido (5 min)

Use este checklist para verificação rápida:

### ✅ Funcionalidades Críticas
- [ ] Dashboard abre
- [ ] Agenda mostra agendamentos
- [ ] Posso criar novo agendamento
- [ ] Posso adicionar novo profissional
- [ ] Posso adicionar nova sala
- [ ] Concierge mostra pacientes
- [ ] Marketplace mostra produtos
- [ ] CRM mostra clientes

### ✅ Novas Funcionalidades
- [ ] Agenda Week View: sobreposição funciona
- [ ] Agenda Week View: filtro por sala funciona
- [ ] Staff: campo assinatura existe
- [ ] Staff: comissão personalizada por serviço funciona
- [ ] Staff: seleção de salas funciona
- [ ] Staff: dados bancários funcionam
- [ ] Salas: tipo "Virtual / Telemedicina" existe
- [ ] Concierge: Checkout está na posição correta
- [ ] Marketplace: Checkout funciona para clientes

---

## 5. Dicas de Teste

### 🎯 Foco nas Mudanças Recentes
Priorize testar o que foi modificado recentemente:
1. Sistema de comissões personalizadas
2. Seleção de salas por profissional
3. Dados bancários
4. Campo de assinatura profissional
5. Sobreposição de agendamentos
6. Filtro por sala

### 🔍 Teste Casos Extremos
- Campos vazios
- Valores muito grandes
- Caracteres especiais
- Datas passadas/futuras
- Horários inválidos

### 📱 Teste em Diferentes Telas
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

### 👥 Teste com Diferentes Perfis
- Admin
- Staff
- Cliente

---

## 6. Após os Testes

### Se tudo estiver OK:
✅ Marque como concluído no `COMPREHENSIVE_TEST_PLAN.md`
✅ Podemos partir para próxima fase (deploy, documentação, etc.)

### Se houver problemas:
⚠️ Liste todos os bugs encontrados
⚠️ Priorize por severidade
⚠️ Vamos corrigir um por um

---

## 📞 Suporte

Se tiver dúvidas durante os testes:
1. Consulte `COMPREHENSIVE_TEST_PLAN.md` para detalhes
2. Consulte `INTEGRATION_COMPLETE.md` para funcionalidades implementadas
3. Me envie suas dúvidas/problemas

---

**Boa sorte nos testes! 🚀**
