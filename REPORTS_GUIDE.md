# 📊 Guia do Módulo de Relatórios DRE - Diva Spa OS

## Visão Geral
O módulo de **Relatórios** oferece análises financeiras e operacionais completas, incluindo DRE, Heatmap de Ocupação e Fechamento de Folha.

---

## 🎯 Funcionalidades

### 1. **💰 DRE Gerencial** (Demonstrativo de Resultados)

Dashboard financeiro completo com estrutura contábil profissional.

**Estrutura do DRE:**
```
(=) Receita Bruta de Vendas
(-) Impostos Estimados (6%)
─────────────────────────────
(=) Receita Líquida
(-) Custos Variáveis (CMV + Comissões ~20%)
─────────────────────────────
(=) Margem de Contribuição
(-) Despesas Operacionais
─────────────────────────────
(=) Lucro Líquido (EBITDA)
```

**Métricas Calculadas:**
- ✅ Receita Bruta (todas as transações de entrada)
- ✅ Impostos (estimativa Simples Nacional 6%)
- ✅ Receita Líquida
- ✅ Custos Variáveis (20% da receita)
- ✅ Margem de Contribuição
- ✅ Despesas Operacionais (transações de saída)
- ✅ **Lucro Líquido**
- ✅ **Margem Líquida %**

**Como Usar:**
1. Acesse **Relatórios DRE** no menu
2. Clique na aba **"DRE Gerencial"**
3. Visualize o demonstrativo completo
4. Analise a margem líquida

**Interpretação:**
- 🟢 **Margem > 20%**: Excelente
- 🟡 **Margem 10-20%**: Boa
- 🔴 **Margem < 10%**: Atenção necessária
- ⚠️ **Prejuízo**: Despesas > Receitas

---

### 2. **👥 Fechamento de Folha (Payroll)**

Cálculo automático de comissões e pagamentos da equipe.

**Informações por Profissional:**
- Total de Serviços Realizados (R$)
- % de Comissão (configurado no cadastro)
- Valor da Comissão (R$)
- Adiantamentos (-)
- Bônus/Salário Fixo (+)
- **Total a Pagar**

**Como Usar:**
1. Aba **"Fechamento de Folha"**
2. Selecione o período (botão "Este Mês")
3. Visualize cálculos automáticos
4. Clique em **"Exportar Folha"** para gerar relatório

**Cálculo Automático:**
```
Comissão = Total Serviços × % Comissão
A Pagar = Comissão - Adiantamentos + Bônus + Salário
```

**Exemplo:**
- Dra. Julia realizou R$ 28.500 em serviços
- Taxa de comissão: 15%
- Comissão = R$ 4.275
- Sem adiantamentos
- Total a Pagar: **R$ 4.275**

---

### 3. **🔥 Heatmap de Ocupação**

Visualização de ocupação da agenda por dia e horário.

**Matriz de Ocupação:**
- **Eixo X**: Dias da semana (Seg-Sáb)
- **Eixo Y**: Horários (08:00-20:00)
- **Cores**:
  - ⚪ Cinza: Vazio (0%)
  - 🟢 Verde: Baixa ocupação (< 30%)
  - 🔵 Azul: Média ocupação (30-70%)
  - 🟠 Laranja: Alta ocupação (70-90%)
  - 🔴 Vermelho: Lotado (> 90%)

**Insights Automáticos:**

**🚨 Gargalos Operacionais**
- Identifica horários de pico recorrentes
- Sugestão: Abrir agenda extra ou aumentar preços (Yield Management)

**💡 Oportunidades**
- Detecta horários com baixa ocupação
- Sugestão: Promoções de "Happy Hour" ou pacotes especiais

**Como Usar:**
1. Aba **"Ocupação & Heatmap"**
2. Analise visualmente os padrões
3. Leia os insights no card lateral
4. Tome decisões estratégicas:
   - Ajustar preços em horários de pico
   - Criar promoções em horários vazios
   - Otimizar escala de equipe

**Exemplo de Ação:**
- **Problema**: Sextas 16h-19h sempre lotadas (90%+)
- **Solução**: 
  - Aumentar preço em 20% nesse horário (Yield)
  - OU abrir agenda extra com profissional adicional

---

## 📈 Casos de Uso

### Caso 1: Análise Mensal de Lucratividade
**Objetivo**: Entender se o mês foi lucrativo

**Passos:**
1. Acesse **DRE Gerencial**
2. Verifique **Lucro Líquido**
3. Analise **Margem Líquida %**
4. Compare com mês anterior

**Decisão:**
- Se margem < 15%: Revisar custos ou aumentar preços
- Se prejuízo: Ação urgente necessária

---

### Caso 2: Planejamento de Folha de Pagamento
**Objetivo**: Calcular quanto pagar à equipe

**Passos:**
1. Acesse **Fechamento de Folha**
2. Revise comissões calculadas
3. Adicione bônus manualmente (se aplicável)
4. Exporte relatório
5. Processe pagamentos

**Benefício:**
- Transparência total
- Cálculo automático e preciso
- Reduz erros manuais

---

### Caso 3: Otimização de Agenda
**Objetivo**: Maximizar ocupação e receita

**Passos:**
1. Acesse **Heatmap de Ocupação**
2. Identifique horários vazios
3. Crie campanha de marketing para esses horários
4. Monitore evolução

**Exemplo Real:**
- Terças-feiras manhã: 20% ocupação
- Ação: Promoção "Terça Relax" com 15% desconto
- Resultado esperado: Ocupação sobe para 60%

---

## 🎓 Dicas Avançadas

### 1. **Análise de Margem por Categoria**
Embora o DRE mostre margem geral, você pode:
- Filtrar transações por categoria no módulo Finance
- Calcular margem específica de cada serviço
- Identificar serviços mais/menos lucrativos

### 2. **Comparativo de Períodos**
Para comparar meses:
- Exporte DRE do Mês 1
- Exporte DRE do Mês 2
- Compare lado a lado no Excel

### 3. **Yield Management**
Use o Heatmap para:
- Identificar horários de alta demanda
- Aumentar preços nesses horários (10-30%)
- Maximizar receita sem aumentar custos

### 4. **Previsão de Folha**
Antes do mês fechar:
- Monitore comissões acumuladas
- Projete total a pagar
- Garanta caixa suficiente

---

## 📊 Métricas de Sucesso

### Financeiras:
- **Margem Líquida**: Meta > 20%
- **Lucro Mensal**: Crescimento consistente
- **Despesas/Receita**: < 60%

### Operacionais:
- **Ocupação Média**: > 60%
- **Horários Ociosos**: < 20%
- **Taxa de No-Show**: < 10%

### Equipe:
- **Comissão Média/Staff**: Crescente
- **Produtividade**: Receita/Hora trabalhada

---

## 🚀 Próximos Passos

Com os relatórios implementados, você pode:

1. **Análise Diária**: Verificar DRE todo dia
2. **Reuniões Mensais**: Apresentar resultados para equipe
3. **Planejamento Estratégico**: Usar dados para decisões
4. **Otimização Contínua**: Ajustar preços e agenda

---

## ❓ FAQ

**P: O DRE considera todas as transações?**
R: Sim, todas as transações lançadas no sistema (receitas e despesas).

**P: Como adicionar adiantamentos na folha?**
R: Atualmente é mockado. Em versão futura, será integrado com transações de "Adiantamento".

**P: O Heatmap considera feriados?**
R: Não, ele analisa padrões gerais. Você pode filtrar manualmente.

**P: Posso exportar os relatórios?**
R: Sim, há botões de exportação (PDF/Excel) - atualmente simulados, mas prontos para integração real.

---

**Diva Spa OS** - Gestão Financeira Inteligente 💜📊
