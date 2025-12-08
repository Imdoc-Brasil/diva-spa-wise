# Blueprint: Separação Financeira e Tributária (Serviços vs Produtos)

## 1. Contexto e Necessidade
Clínicas de estética frequentemente operam em modelo híbrido:
1.  **Prestação de Serviços** (Consultas, Procedimentos, Lasers) -> Tributados via ISS/Simples Nacional (Anexo III ou V).
2.  **Venda de Produtos** (Home Care, Cosméticos, Suplementos) -> Tributados via ICMS/Simples Nacional (Anexo I).

Para uma gestão fiscal e financeira correta (DRE, EBITDA), o sistema deve tratar essas receitas separadamente, desde a venda até o relatório contábil.

## 2. Impactos na Arquitetura

### A. Banco de Dados & Tipagem
A interface `Transaction` e `Invoice` deve distinguir explicitamente a origem da receita.

```typescript
// types.ts
export type RevenueType = 'service' | 'product' | 'mixed';

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    category: string;
    type: RevenueType; // NOVO CAMPO
    taxRate?: number; // Alíquota estimada
    // ...
}
```

### B. Módulo Financeiro (FinanceModule)
*   **Fluxo de Caixa**: Filtros para visualizar apenas "Vendas de Produtos" ou "Serviços".
*   **Contas/Categorias**: É recomendável criar categorias "mãe" separadas:
    *   Receita Operacional Bruta - Serviços
    *   Receita Operacional Bruta - Produtos

### C. DRE (ReportsModule)
O DRE (Demonstrativo de Resultados do Exercício) deve quebrar a receita bruta:

```
(+) RECEITA OPERACIONAL BRUTA
    (+) Receita de Serviços (Procedimentos)
    (+) Receita de Produtos (Venda Direta/Marketplace)
(-) DEDUÇÕES DA RECEITA
    (-) Impostos s/ Serviços (ISS, PIS/COFINS) -> Configurar % média
    (-) Impostos s/ Produtos (ICMS, IPI) -> Configurar % média
(=) RECEITA LÍQUIDA
```

### D. Marketplace ("Boutique Diva")
*   Vendas do Marketplace são, por definição, `type: 'product'`.
*   Ao fechar uma venda no carrinho que contenha ambos (ex: "Botox + Creme Pós-Procedimento"), o sistema deve gerar:
    *   Ou duas transações separadas (ideal para contabilidade).
    *   Ou uma transação "mista" (mixed) que internalmente guarda o split de valores.

### E. Split de Pagamentos (Gateway)
*   Se a clínica tiver CNPJs diferentes para Serviços e Comércio (comum para otimização fiscal), o Gateway de Pagamento deve suportar **Split de Pagamento**.
*   Ex: O cliente paga R$ 1.000. R$ 800 vai para a conta "CNPJ Serviços" e R$ 200 para "CNPJ Comércio".
*   *Ação*: Verificar suporte da API de Pagamento (Asaas, Stripe, Pagar.me) para Split por "Recipient".

## 3. Plano de Implementação

### Fase 1: Classificação (Curto Prazo)
1.  Adicionar campo `type` ('service' | 'product') na criação de transações.
2.  No `Checkout` (Venda), classificar automaticamente itens do `Marketplace` como produto.
3.  Atualizar o DRE para agrupar por esse tipo.

### Fase 2: Configuração Fiscal (Médio Prazo)
1.  Criar tela "Configurações Fiscais" no módulo Financeiro.
2.  Permitir definir alíquotas padrão para Serviços vs Produtos.
3.  Calcular provisão de impostos no Dashboard Financeiro.

### Fase 3: Multi-CNPJ (Longo Prazo/Enterprise)
1.  Permitir cadastrar múltiplos "Entidades Legais" dentro da Organização.
2.  Vincular Itens de Venda a Entidades Específicas.
3.  Operar Split de Pagamento automático no Gateway.

---
**Status**: Planejamento Aprovado. Aguardando priorização para implementação da Fase 1.
