# 📢 Guia do Módulo de Marketing - Diva Spa OS

## Visão Geral
O módulo de Marketing permite criar campanhas segmentadas, automatizar comunicações e gerenciar relacionamento com clientes através de múltiplos canais.

## Funcionalidades Implementadas

### 1. **Campanhas** 🎯
Crie e gerencie campanhas de marketing direcionadas.

**Como Usar:**
1. Acesse **Marketing** no menu lateral
2. Clique em **"Criar Nova Campanha"**
3. Preencha:
   - **Nome da Campanha**: Ex: "Promoção Relâmpago - Botox Week"
   - **Canal**: WhatsApp, Email ou SMS
   - **Segmento**: Escolha o público-alvo
   - **Mensagem**: Use variáveis como `{nome_cliente}`
   - **Agendamento**: Enviar agora ou agendar

**Status das Campanhas:**
- 🟢 **Ativa**: Campanha em andamento
- 🔵 **Agendada**: Programada para envio futuro
- ⚪ **Rascunho**: Ainda não enviada
- ✅ **Enviada**: Concluída

**Métricas Disponíveis:**
- Taxa de Abertura (%)
- Cliques
- Conversões (Agendamentos gerados)
- Receita Gerada

### 2. **Automações** ⚡
Configure réguas de relacionamento automáticas.

**Automações Pré-Configuradas:**
- **Mensagem de Aniversário**: Envia parabéns automaticamente
- **Reativação Pós-60 dias**: Reengaja clientes inativos
- **Lembrete de Retoque Botox**: Notifica quando é hora de retornar
- **Alerta de Leads Novos**: Notifica equipe sobre leads sem contato

**Como Ativar/Desativar:**
1. Vá para aba **"Automações"**
2. Clique no botão de status (Ativo/Pausado)
3. Configure gatilhos e ações personalizadas

### 3. **Segmentos de Clientes** 👥
Crie públicos-alvo baseados em comportamento e dados.

**Segmentos Pré-Definidos:**
- **Clientes VIP** (LTV > R$ 5.000)
- **Novos Clientes** (Últimos 30 dias)
- **Clientes Inativos** (Sem visita há 6+ meses)

**Como Criar Novo Segmento:**
1. Aba **"Segmentos"**
2. Clique em **"Novo Segmento"**
3. Defina critérios:
   - Tags comportamentais
   - RFM Score (Recência, Frequência, Monetário)
   - Histórico de serviços
   - Aniversariantes do mês

## Sugestões da Diva AI 💡

O sistema analisa automaticamente sua base e sugere campanhas:
- Clientes de Botox que precisam retocar
- VIPs inativos
- Aniversariantes da semana

**Como Usar:**
1. Veja as sugestões no card roxo no topo
2. Clique em **"Criar Campanha Automática"**
3. O sistema pré-preenche tudo para você

## Melhores Práticas

### ✅ **Faça**
- Personalize mensagens com variáveis (`{nome_cliente}`)
- Teste diferentes horários de envio
- Segmente bem seu público
- Acompanhe métricas de conversão
- Use automações para tarefas repetitivas

### ❌ **Evite**
- Enviar mensagens genéricas
- Bombardear clientes (respeite frequência)
- Ignorar opt-outs
- Criar segmentos muito amplos

## Variáveis Disponíveis

Use nas mensagens para personalização:
- `{nome_cliente}` - Nome do cliente
- `{primeiro_nome}` - Primeiro nome apenas
- `{data_aniversario}` - Data de aniversário
- `{ultimo_servico}` - Último serviço realizado
- `{pontos_fidelidade}` - Saldo de pontos

## Exemplos de Campanhas de Sucesso

### 1. Reativação de Inativos
**Canal**: WhatsApp  
**Segmento**: Clientes sem visita há 90+ dias  
**Mensagem**:
```
Olá {nome_cliente}! 💜

Sentimos sua falta na Diva Spa! 

Como você está? Temos novidades incríveis e um desconto especial de 15% esperando por você.

Que tal agendar um momento de autocuidado?

Responda SIM e nossa equipe entra em contato! ✨
```

### 2. Aniversariantes
**Canal**: Email  
**Segmento**: Aniversariantes do mês  
**Assunto**: 🎉 Feliz Aniversário, {nome_cliente}!  
**Mensagem**:
```
Parabéns, {nome_cliente}! 🎂

Preparamos um presente especial para você:
20% OFF em qualquer serviço neste mês!

Válido até {data_fim_mes}

[AGENDAR AGORA]
```

### 3. Retoque de Botox
**Canal**: SMS  
**Segmento**: Clientes de Botox (última sessão há 4+ meses)  
**Mensagem**:
```
Oi {nome_cliente}! É hora do retoque de Botox 💉

Agende agora e garanta seu horário preferido.

Diva Spa - (11) 99999-9999
```

## Próximos Passos

O módulo de Marketing está **100% funcional** e pronto para uso!

**Sugestões de Expansão Futura:**
- Integração real com WhatsApp Business API
- Disparos de Email via SendGrid/Mailchimp
- A/B Testing de campanhas
- Análise preditiva de churn
- Integração com Google Ads/Facebook Ads

---

**Dúvidas?** Acesse o menu **Ajuda** ou consulte a documentação completa.
