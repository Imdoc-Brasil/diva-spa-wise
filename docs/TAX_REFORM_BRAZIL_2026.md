# 🇧🇷 Plano de Adequação à Reforma Tributária (Visão 2026-2033)

> **Documento de Visão Futura**
> *Status: Planejamento Estratégico*
> *Base Legal: EC 132/2023 (Reforma Tributária sobre o Consumo)*

Este documento detalha o roadmap de atualização do **I'mdoc SaaS** para conformidade com as novas regras da Reforma Tributária brasileira, garantindo que nossas clínicas clientes estejam blindadas fiscalmente e aproveitem os benefícios de gestão de créditos.

---

## 📅 Cronograma de Impacto

A partir de **Janeiro de 2026**, inicia-se a transição oficial. O sistema deve estar preparado antes desta data.

| Fase | Período | O que acontece | Impacto no I'mdoc |
| :--- | :--- | :--- | :--- |
| **1. Testes** | **2026** | Obrigatoriedade de emitir NFS-e no **Padrão Nacional** com campos para IBS e CBS (ainda sem cobrança efetiva). | **Alto.** Necessário atualizar o módulo fiscal para o novo layout da API Nacional. |
| **2. Federal** | **2027** | Início da cobrança da **CBS** (Contribuição sobre Bens e Serviços). Extinção do PIS/Cofins. | **Médio.** Ajuste nas alíquotas automáticas do Financeiro. Início do sistema de créditos federais. |
| **3. Transição** | **2029-2032** | Redução gradual de ICMS/ISS e aumento do **IBS** (Imposto sobre Bens e Serviços). | **Alto.** Algoritmo de cálculo de imposto híbrido (Sistema Antigo + Novo). |
| **4. Pleno** | **2033+** | Vigência total do IBS/CBS. Extinção completa de ICMS/ISS/PIS/Cofins. | **Baixo.** Simplificação total do módulo. |

---

## 💡 Mudança de Paradigma: Produto vs. Serviço

### O Fim da "Guerra Fiscal" (Exemplo Botox)
Hoje, existe complexidade em definir o que é produto (ICMS) e serviço (ISS) em procedimentos estéticos. Com a reforma, essa distinção perde relevância financeira, pois ambos serão tributados por IBS/CBS com possibilidade de crédito.

**Fluxo no I'mdoc (Pós-2027):**
1.  **Compra de Insumo:** A clínica compra a toxina botulínica. O sistema reconhece o IBS/CBS pago na nota de entrada e lança como **"Crédito Tributário"** na carteira da clínica.
2.  **Prestação de Serviço:** A clínica vende a aplicação. O sistema calcula o imposto total sobre a venda.
3.  **Apuração:** O sistema abate automaticamente o crédito da compra, gerando a guia de recolhimento apenas sobre o valor agregado (lucro + mão de obra).

---

## 🛠 Roadmap de Desenvolvimento (Feature Flag: `tax_reform_2026`)

Para preparar o software, desenvolveremos as seguintes funcionalidades em versões futuras:

### Versão 3.0 (Q4 2025) - "Compliance First"
*   [ ] **Atualização de Layout NFS-e:** Implementar os campos `vIBS` e `vCBS` no XML de emissão de nota.
*   [ ] **Cadastro de NCM/NBS:** Refinar o cadastro de serviços e produtos para garantir a classificação correta exigida pelo padrão nacional.
*   [ ] **Validador de Transição:** Alerta para o usuário se ele estiver tentando emitir nota no padrão antigo após a virada.

### Versão 3.5 (2026) - "Educação Fiscal"
*   [ ] **Simulador de Impacto:** Um dashboard que mostra "Quanto você pagaria no sistema novo" vs "Sistema atual", ajudando a clínica a se planejar financeiramente.
*   [ ] **Smart Classification:** IA que sugere a classificação tributária correta para novos procedimentos cadastrados.

### Versão 4.0 (2027) - "Gestão de Créditos"
*   [ ] **Módulo de Apuração Automática:** Leitura automática das notas de compra (XML de entrada) para extrair créditos de CBS.
*   [ ] **Relatório de Economia:** Demonstrativo de quanto a clínica economizou usando o sistema de não-cumulatividade (créditos).

---

## ⚠️ Plano de Ação Imediato (Para o Cliente)

1.  **Não mudar nada agora:** Em 2024/2025, o regime atual (ISS municipal) continua valendo 100%.
2.  **Saneamento de Cadastro:** Começar a revisar o cadastro de produtos e serviços no sistema, garantindo que códigos NCM (produtos) e NBS (serviços) estejam corretos, pois serão chaves para a nova tributação.
3.  **Planejamento Contábil:** Clínicas no Simples Nacional terão regras específicas (geralmente podem optar por recolher IBS/CBS "por fora" para gerar crédito aos clientes, ou manter a guia única sem gerar crédito). O I'mdoc deverá suportar ambos os cenários.

---
*Este documento serve como guia para a equipe de produto e desenvolvimento. As regras fiscais podem sofrer alterações até a regulamentação final das leis complementares.*
