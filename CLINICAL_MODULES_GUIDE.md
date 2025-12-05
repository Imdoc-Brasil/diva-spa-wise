# 🏥 Guia dos Módulos Clínicos - Diva Spa OS

## Visão Geral
Os módulos clínicos garantem conformidade regulatória, segurança sanitária e rastreabilidade completa de procedimentos e insumos.

---

## 1. 🛡️ **Compliance Module** (Conformidade)

### Funcionalidades

#### **📄 Licenças e Alvarás**
Gestão completa de documentação obrigatória para funcionamento legal.

**Documentos Gerenciados:**
- ✅ Alvará de Funcionamento (Prefeitura)
- ✅ Licença Sanitária - CMVS (Vigilância Sanitária)
- ✅ AVCB (Corpo de Bombeiros)
- ✅ Responsabilidade Técnica - CRT (Conselho Regional)

**Status Automático:**
- 🟢 **Vigente**: Documento válido
- 🟡 **A Vencer**: Menos de 30 dias para expirar
- 🔴 **Vencido**: Documento expirado

**Funcionalidades:**
- Adicionar novas licenças
- Renovação simulada (+1 ano)
- Download de PDF (simulado)
- Alertas de vencimento
- Contagem de dias restantes

---

#### **🗑️ PGRSS (Plano de Gerenciamento de Resíduos)**
Controle de resíduos de serviços de saúde conforme ANVISA.

**Tipos de Resíduos:**
- 🔴 **Infectantes**: Materiais contaminados
- 🟡 **Perfurocortantes**: Agulhas, lâminas

**Registro de Coleta:**
- Data da coleta
- Tipo de resíduo
- Peso (Kg)
- Empresa coletora
- Manifesto ID (MTR)
- Responsável pela entrega

**Gráfico de Geração:**
- Evolução mensal de resíduos
- Identificação de tendências
- Alertas de aumento anormal

**Insights Automáticos:**
- Detecta aumento na geração
- Sugere melhorias na segregação
- Compliance com normas ambientais

---

#### **💉 Saúde Ocupacional (PCMSO)**
Monitoramento de saúde da equipe conforme NR-7.

**Documentos Rastreados:**
- ASO (Atestado de Saúde Ocupacional)
  - Exame admissional
  - Exames periódicos
  - Data de validade

**Vacinação Obrigatória:**
- ✅ Hepatite B
- ✅ Tétano
- Status: Válida / Vencida

**Status do Profissional:**
- 🟢 **Compliant**: Tudo em dia
- 🔴 **Non-Compliant**: Pendências

**Ações:**
- Atualizar status de saúde
- Ver prontuário completo
- Alertas de vencimento de ASO

---

## 2. 💊 **Pharmacy Module** (Farmácia Inteligente)

### Funcionalidades

#### **🧊 Geladeira Virtual**
Controle de frascos abertos de injetáveis com prazo de validade pós-abertura.

**Produtos Gerenciados:**
- Toxina Botulínica (Botox, Dysport)
- Bioestimuladores (NCTF, Sculptra)
- Preenchedores (Ácido Hialurônico)
- Outros injetáveis fracionados

**Informações por Frasco:**
- Nome do produto
- Lote (Batch Number)
- Data/Hora de abertura
- Prazo de validade pós-abertura (horas)
- Unidades iniciais
- Unidades restantes
- Profissional que abriu

**Status Visual:**
- 🟢 **Verde**: Válido (> 4h restantes)
- 🟠 **Laranja**: Crítico (< 4h)
- 🔴 **Vermelho**: Vencido

**Barra de Progresso:**
- Visual de unidades restantes
- Alerta quando < 20%

**Ações:**
- Abrir novo frasco
- Registrar uso
- Descartar frasco (gera perda no estoque)

---

#### **🧪 Calculadora de Diluição**
Ferramenta para cálculo seguro de concentração de toxinas.

**Produtos Suportados:**
- Botox (100U)
- Dysport (300U)

**Cálculo:**
```
Concentração = (Total de Unidades / Volume de Diluente) × 0.1ml
```

**Exemplo:**
- Produto: Botox 100U
- Diluente: 2.0ml de soro
- **Resultado**: 5.0 U por 0.1ml (1 traço na seringa de insulina)

**Avisos de Segurança:**
- Responsabilidade do profissional habilitado
- Sempre verificar bula do fabricante
- Ferramenta auxiliar, não substitui conhecimento técnico

---

#### **📋 Rastreabilidade (Lote-Paciente)**
Histórico completo de uso de injetáveis por paciente.

**Informações Registradas:**
- Data e hora do procedimento
- Nome do paciente
- Produto utilizado
- ID do frasco (rastreabilidade de lote)
- Procedimento realizado
- Dose aplicada (unidades)
- Profissional responsável

**Busca Avançada:**
- Por lote
- Por paciente
- Por produto
- Por profissional

**Benefícios:**
- Compliance com ANVISA
- Rastreabilidade em caso de recall
- Auditoria de uso
- Segurança do paciente

---

## 📊 Casos de Uso

### Caso 1: Gestão de Licenças
**Objetivo**: Manter documentação sempre em dia

**Fluxo:**
1. Acesse **Compliance** → **Licenças**
2. Verifique status de cada documento
3. Se houver licença **A Vencer** (amarela):
   - Inicie processo de renovação
   - Clique em "Renovar" para simular
4. Se houver licença **Vencida** (vermelha):
   - **URGENTE**: Renovar imediatamente
   - Risco de multa ou interdição

**Frequência**: Verificar semanalmente

---

### Caso 2: Controle de Resíduos
**Objetivo**: Compliance ambiental e sanitário

**Fluxo:**
1. Após cada coleta de resíduos:
   - Acesse **Compliance** → **Resíduos**
   - Clique em "Registrar Coleta"
   - Preencha:
     - Data
     - Tipo (Infectante/Perfuro)
     - Peso
     - Empresa coletora
     - Manifesto ID
     - Responsável
2. Monitore gráfico mensal
3. Se houver aumento > 10%:
   - Revisar segregação
   - Treinar equipe

**Frequência**: A cada coleta (geralmente semanal)

---

### Caso 3: Uso de Toxina Botulínica
**Objetivo**: Rastreabilidade e segurança

**Fluxo Completo:**

**Antes do Procedimento:**
1. Acesse **Farmácia** → **Calculadora**
2. Selecione produto (Botox/Dysport)
3. Defina volume de diluente
4. Anote concentração resultante

**Durante Abertura do Frasco:**
1. Acesse **Farmácia** → **Geladeira Virtual**
2. Clique em "Abrir Novo Frasco"
3. Preencha:
   - Produto
   - Lote
   - Unidades iniciais
   - Prazo pós-abertura (ex: 72h)

**Durante o Procedimento:**
1. Aplique conforme protocolo
2. Após aplicação:
   - Clique em "Registrar Uso"
   - Preencha:
     - Paciente
     - Procedimento
     - Unidades utilizadas

**Pós-Procedimento:**
1. Sistema atualiza automaticamente:
   - Unidades restantes no frasco
   - Histórico de rastreabilidade
2. Se frasco < 20%: Alerta visual
3. Se frasco vencido: Descartar

**Auditoria:**
1. Acesse **Farmácia** → **Rastreabilidade**
2. Busque por:
   - Lote específico
   - Paciente
   - Período

---

## 🎓 Melhores Práticas

### Compliance:
1. **Revisão Mensal**: Verificar todas as licenças
2. **Antecedência**: Renovar com 60 dias de antecedência
3. **Backup**: Manter cópias digitais de todos os documentos
4. **Treinamento**: Equipe ciente das obrigações legais

### Farmácia:
1. **Rotulação**: Sempre etiquetar frascos abertos
2. **Temperatura**: Monitorar geladeira (2-8°C)
3. **Descarte**: Nunca usar frasco vencido
4. **Rastreabilidade**: Registrar TODOS os usos
5. **Auditoria**: Revisar logs mensalmente

### Resíduos:
1. **Segregação**: Separar corretamente na origem
2. **Treinamento**: Equipe treinada em PGRSS
3. **Frequência**: Coleta regular (não acumular)
4. **Documentação**: Guardar MTRs por 5 anos

---

## ⚠️ Alertas Críticos

### 🚨 Licença Vencida
**Ação Imediata:**
- Suspender atividades relacionadas
- Contatar órgão emissor
- Iniciar processo de renovação urgente

### 🚨 Frasco Vencido
**Ação Imediata:**
- NÃO UTILIZAR
- Descartar conforme PGRSS
- Registrar perda no estoque

### 🚨 ASO Vencido
**Ação Imediata:**
- Afastar profissional de atividades clínicas
- Agendar exame periódico
- Atualizar status após resultado

---

## 📈 Métricas de Sucesso

### Compliance:
- ✅ 100% das licenças vigentes
- ✅ Zero multas/notificações
- ✅ Renovações com > 30 dias de antecedência

### Farmácia:
- ✅ 100% de rastreabilidade
- ✅ Zero uso de frascos vencidos
- ✅ Perda < 5% por vencimento

### Resíduos:
- ✅ 100% dos MTRs arquivados
- ✅ Segregação correta > 95%
- ✅ Coleta regular (sem atrasos)

---

## 🔗 Integrações

### Atual (Simulado):
- Dados mockados para demonstração
- Funcionalidades completas

### Futuro (Produção):
- **API Vigilância Sanitária**: Consulta automática de licenças
- **Sistema de Gestão de Resíduos**: Integração com coletora
- **Estoque**: Baixa automática de injetáveis
- **Prontuário Eletrônico**: Registro automático de aplicações

---

## ❓ FAQ

**P: O que acontece se uma licença vencer?**
R: O sistema alerta visualmente (vermelho). Você deve renovar imediatamente para evitar multas ou interdição.

**P: Como funciona a rastreabilidade de lote?**
R: Cada uso de injetável é registrado com: paciente, lote, dose e profissional. Em caso de recall, você sabe exatamente quem recebeu qual lote.

**P: Posso usar um frasco vencido se ainda tiver produto?**
R: **NÃO**. Após o prazo pós-abertura, o produto perde eficácia e segurança microbiológica. Deve ser descartado.

**P: Como calcular a diluição correta?**
R: Use a **Calculadora de Diluição** no módulo Farmácia. Ela calcula automaticamente a concentração por 0.1ml.

**P: Preciso guardar os MTRs de resíduos?**
R: **SIM**. Por lei, deve-se manter por 5 anos para fiscalização.

---

**Diva Spa OS** - Compliance e Segurança Clínica 🏥💜
