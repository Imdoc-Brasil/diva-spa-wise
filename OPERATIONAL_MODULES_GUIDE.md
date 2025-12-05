# 🔧 Guia dos Módulos Operacionais Finais - Diva Spa OS

## Visão Geral
Os módulos operacionais finalizam a gestão completa da clínica, cobrindo enxoval, equipamentos e assistência inteligente.

---

## 1. 👔 **Laundry Module** (Gestão de Enxoval)

### Objetivo
Controle completo do ciclo de rouparia, lavanderia e custos operacionais.

### Funcionalidades

#### **Aba 1: Estoque & Ciclo**

**Ciclo Visual de 4 Estágios:**
1. 🟢 **Limpo**: Pronto para uso
2. 🔵 **Em Uso**: Atualmente com cliente/sala
3. 🟡 **Sujo**: Aguardando envio
4. 🟣 **Lavanderia**: Fora da clínica

**Informações por Item:**
- Nome do item (ex: Toalha de Rosto Branca)
- Quantidade total cadastrada
- Distribuição por estágio (visual)
- Vida útil: Lavagens atuais / Máximo
- Custo por lavagem
- Alerta de divergência (se faltar peças)

**Exemplo de Item:**
```
Toalha de Banho (Gigante)
Total: 50 unidades
├─ Limpo: 15
├─ Em Uso: 5
├─ Sujo: 10
└─ Lavanderia: 20

Vida Útil: 30/80 lavagens
Custo: R$ 2,50/lavagem
```

**Ações:**
- ✏️ Editar item (hover)
- 🗑️ Excluir item
- ➕ Novo item

---

#### **Aba 2: Remessas (Transações)**

**Painel Esquerdo - Ações Rápidas:**
- 📤 **Enviar para Lavanderia**
  - Seleciona itens sujos
  - Define quantidade
  - Registra peso total
  - Escolhe lavanderia
  
- 📥 **Receber Limpo**
  - Seleciona itens retornando
  - Define quantidade
  - Calcula custo automático
  - Incrementa contador de lavagens
  - Move para "Limpo"

**Resumo Financeiro:**
- Gasto mensal estimado
- Baseado em transações

**Painel Direito - Histórico:**
- Lista de todas as remessas
- Tipo: Envio ou Recebimento
- Data e lavanderia
- Peso (envio) ou Custo (recebimento)
- Itens detalhados

---

### Lógica de Movimentação

**Ao Enviar:**
```
Sujo → Lavanderia (prioridade)
Se não houver suficiente em Sujo:
  Limpo → Lavanderia
```

**Ao Receber:**
```
Lavanderia → Limpo
currentWashes += 1
```

**Alerta de Fim de Vida:**
- Se `currentWashes >= lifespanWashes`:
  - Item precisa ser reposto
  - Alerta visual

---

## 2. 🔧 **Assets Module** (Ativos & Manutenção)

### Objetivo
Gestão de equipamentos médicos, manutenção preventiva e controle de vida útil.

### Dashboard (Topo)

**3 KPIs Principais:**
1. **Ativos Totais**: Quantidade de equipamentos
2. **Em Manutenção**: Equipamentos parados
3. **Alertas Críticos**: Equipamentos com warning/critical

---

### Aba 1: Equipamentos

**Card por Equipamento:**

**Status Visual:**
- 🟢 **Operacional**: Funcionando normalmente
- 🟠 **Atenção**: Próximo de limite
- 🔴 **Crítico**: Ação urgente necessária
- ⚫ **Em Manutenção**: Parado

**Informações:**
- Nome do equipamento
- Número de série (S/N)
- Localização (sala)
- Status atual

**Vida Útil (se aplicável):**
- Barra de progresso visual
- Disparos atuais / Máximo
- Exemplo: Laser 2.500.000 / 5.000.000 shots
- Alerta se > 90%: "Troca de ponteira recomendada"

**Datas:**
- ✅ Última manutenção
- ⏰ Próxima manutenção (agendada)

**Ações:**
- 🔧 Agendar manutenção
- ➕ Novo equipamento

---

### Aba 2: Agenda de Manutenção

**Tabela de Registros:**

| Data | Equipamento | Tipo | Técnico | Custo | Status |
|------|-------------|------|---------|-------|--------|
| 28/10 | Autoclave XP | Corretiva | Carlos Tec | R$ 450 | Agendado |
| 15/08 | Laser Galaxy | Preventiva | LaserFix | R$ 1.200 | Concluído |

**Tipos de Manutenção:**
- **Preventiva**: Programada, periódica
- **Corretiva**: Quebra, emergência

**Status:**
- 🔵 **Agendado**: Futuro
- 🟢 **Concluído**: Histórico

**Ações:**
- Agendar visita técnica
- Ver detalhes (notas do técnico)

---

### Casos de Uso

**Caso 1: Monitoramento de Laser**
- Laser atinge 4.800.000 shots (96% de 5M)
- Status muda para 🟠 **Atenção**
- Sistema alerta: "Troca de ponteira recomendada"
- Gestor agenda manutenção preventiva
- Equipamento vai para status ⚫ **Em Manutenção**
- Após troca, volta para 🟢 **Operacional**

**Caso 2: Quebra de Autoclave**
- Autoclave para de funcionar
- Status manual para ⚫ **Em Manutenção**
- Agendar manutenção corretiva
- Registrar custo e técnico
- Após reparo, marcar como concluído
- Volta para 🟢 **Operacional**

---

## 3. ✨ **Diva AI** (Assistente Inteligente)

### Objetivo
Copilot contextual para otimizar operação, gerar conteúdo e responder perguntas.

### Interface

**Painel Lateral Direito:**
- Abre com atalho ou botão
- Chat em tempo real
- Widgets interativos

---

### Funcionalidades

#### **1. Análise de Faturamento**
**Pergunta**: "Como está o faturamento hoje?"

**Resposta**:
- Widget visual com gráfico
- Total do dia
- Comparação com meta
- Tendência (últimas horas)
- % de crescimento

**Exemplo:**
```
Total Hoje: R$ 7.250
Meta: R$ 6.000
Status: +20% ✅
[Gráfico de área mostrando evolução]
```

---

#### **2. Geração de Conteúdo (Marketing)**
**Pergunta**: "Criar post para Instagram sobre Botox"

**Resposta**:
- Copy completa pronta para usar
- Hashtags relevantes
- Call-to-action
- Botão "Copiar"

**Exemplo:**
```
✨ Pele lisinha o ano todo? Comece agora!

O verão se constrói no inverno. Inicie suas 
sessões de Depilação a Laser na Diva Spa e 
diga adeus às lâminas.

Agenda aberta! Link na bio.
#DivaSpa #Laser #Estetica
```

---

#### **3. Busca de Clientes**
**Pergunta**: "Buscar cliente Ana Silva"

**Resposta**:
- Card do cliente
- Nome e avatar
- Tags (VIP, Laser, etc.)
- LTV (Lifetime Value)
- Última visita
- Botão para abrir perfil completo

---

#### **4. Protocolos Clínicos**
**Pergunta**: "Parâmetros para Fototipo IV"

**Resposta**:
- Widget de protocolo seguro
- Fluência recomendada
- Pulse width
- Resfriamento
- Avisos de segurança

**Exemplo:**
```
⚡ Protocolo Seguro - Fototipo IV

Fluência: 10-12 J/cm²
Pulse: 30ms
Resfriamento: Máximo

⚠️ Cautela: Risco de hiperpigmentação
```

---

### Sugestões Rápidas (Botões)

Abaixo do input, 3 botões de atalho:
- 💰 **Faturamento**
- 📱 **Marketing**
- ⚡ **Protocolos**

Clique pré-preenche a pergunta.

---

### Lógica de Respostas

**Palavras-chave detectadas:**
- "faturamento", "vendas", "receita" → Widget Revenue
- "post", "instagram", "marketing" → Widget Content
- "cliente", nome próprio → Widget Client
- "parametro", "fototipo", "protocolo" → Widget Protocol
- Outros → Texto genérico com sugestões

---

### Limitações Atuais (Simulado)

- ❌ Não conecta com IA real (GPT, Claude)
- ✅ Lógica baseada em palavras-chave
- ✅ Widgets pré-definidos
- ✅ Interface completa e funcional

**Futuro (Produção):**
- Integração com OpenAI API
- Contexto real do sistema
- Aprendizado contínuo
- Ações executáveis ("Agendar cliente X")

---

## 📊 Resumo de Funcionalidades

### Laundry (Enxoval):
- ✅ Ciclo visual de 4 estágios
- ✅ Envio e recebimento de lavanderia
- ✅ Controle de vida útil
- ✅ Histórico de transações
- ✅ Cálculo de custos

### Assets (Ativos):
- ✅ Inventário de equipamentos
- ✅ Status operacional em tempo real
- ✅ Vida útil (shots/horas)
- ✅ Agenda de manutenção
- ✅ Preventiva e corretiva
- ✅ Controle de custos

### Diva AI:
- ✅ Chat interativo
- ✅ 4 tipos de widgets
- ✅ Análise de faturamento
- ✅ Geração de conteúdo
- ✅ Busca de clientes
- ✅ Protocolos clínicos
- ✅ Sugestões rápidas

---

## 🎓 Melhores Práticas

### Enxoval:
1. **Inventário**: Manter 30% de margem de segurança
2. **Frequência**: Enviar para lavanderia 2-3x/semana
3. **Rastreamento**: Sempre registrar envios/recebimentos
4. **Reposição**: Substituir itens com > 90% de lavagens

### Ativos:
1. **Preventiva**: Agendar com 30 dias de antecedência
2. **Monitoramento**: Verificar vida útil semanalmente
3. **Documentação**: Manter notas de todas as manutenções
4. **Garantia**: Rastrear datas de expiração

### Diva AI:
1. **Perguntas**: Seja específico
2. **Contexto**: Use termos do domínio
3. **Exploração**: Teste diferentes perguntas
4. **Feedback**: Reporte respostas inadequadas

---

## ❓ FAQ

**P: O que acontece se um item de enxoval não retornar?**
R: O sistema mostra "Divergência de Estoque" e indica quantas peças faltam. Você pode ajustar manualmente ou registrar perda.

**P: Como saber quando trocar ponteira de laser?**
R: O sistema alerta automaticamente quando > 90% da vida útil. Barra fica vermelha e aparece mensagem.

**P: A Diva AI aprende com minhas perguntas?**
R: Atualmente não (simulado). Em produção, com IA real, sim.

**P: Posso agendar manutenção recorrente?**
R: Sim, ao cadastrar equipamento, defina periodicidade (ex: a cada 6 meses).

---

**Diva Spa OS** - Gestão Operacional Completa 🔧💜
