# Instruções de Deploy Local e Validação

Todas as funcionalidades solicitadas foram implementadas e configuradas. Como medida final, siga os passos abaixo para gerar a versão de produção e validar.

## 1. Instalar Dependências (se necessário)
Certifique-se de que todas as bibliotecas novas (recharts, jspdf) estão instaladas.
```bash
npm install
```

## 2. Executar Build de Produção
Gere a pasta `dist` otimizada.
```bash
npm run build
```
*Verifique se o comando finaliza com "Build complete" e sem erros de TypeScript.*

## 3. Testar Localmente (Preview)
Para simular o servidor de produção:
```bash
npm run preview
```
Acesse o localhost indicado (geralmente http://localhost:4173).

## O Que Validar:

### 💰 Financeiro
1.  Acesse o módulo **Financeiro**.
2.  Verifique o novo card **"Saldos por Conta / Caixa"**.
3.  Clique em **"Relatórios Contábeis"** -> **"DRE Gerencial"**.
4.  Confira se o gráfico de **Tendência Semestral** aparece abaixo da tabela.

### 📢 Marketing
1.  Acesse o módulo **Marketing** -> Aba **Segmentos**.
2.  Clique no segmento **"Em Risco"** ou **"Perdidos"**.
3.  Use o botão **"Criar Campanha"** e veja se o modal abre já preenchido.

### ⚙️ Configurações I'mDoc
1.  Verifique a barra lateral exibindo **"I'mDoc"**.
2.  Acesse **Configurações** (Engrenagem).
3.  Confira se os dados da **"Diva Spa - Demonstração"** aparecem corretamente.

🚀 **Pronto para uso!**
