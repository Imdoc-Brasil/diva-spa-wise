# 🧪 Guia de Teste - Sistema de Migração

## 🚀 Como Testar

### **Passo 1: Iniciar o Servidor**

No terminal, execute:
```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000` (ou porta similar).

---

### **Passo 2: Acessar o Módulo de Migração**

1. Abra o navegador em `http://localhost:3000`
2. Faça login no sistema
3. No menu lateral, clique em **"Migração"** (ícone de banco de dados)

Você verá a página inicial do módulo de migração com:
- Card principal com descrição
- 4 cards de funcionalidades (Importação Flexível, Templates, Tags, Relatório)
- Botão **"Iniciar Nova Migração"**
- Estatísticas rápidas

---

### **Passo 3: Iniciar o Wizard**

1. Clique no botão **"Iniciar Nova Migração"**
2. O wizard abrirá em modal fullscreen

---

## 📋 Testando Cada Etapa do Wizard

### **Etapa 1: Upload do Arquivo CSV**

#### ✅ O que testar:

1. **Upload de arquivo:**
   - Clique em "Selecionar Arquivo CSV"
   - Escolha o arquivo `exemplo_migracao.csv` (na raiz do projeto)
   - Verifique se aparece: "✓ exemplo_migracao.csv (10 linhas)"

2. **Templates pré-configurados:**
   - Após upload, deve aparecer 3 cards de templates:
     - ClinicWare
     - Prontuário Online
     - Planilha Excel Genérica
   - Clique em um template para testar auto-mapeamento

3. **Navegação:**
   - Botão "Próximo" deve estar habilitado após upload
   - Clique em "Próximo" para ir para Etapa 2

#### ❌ Possíveis erros:
- Se arquivo não carregar, verifique formato CSV (UTF-8, separado por vírgula)
- Se não aparecer número de linhas, verifique se CSV tem header

---

### **Etapa 2: Mapeamento de Colunas**

#### ✅ O que testar:

1. **Mapeamento manual:**
   - Você verá duas colunas:
     - **Dados Básicos** (esquerda)
     - **Dados Clínicos** (direita, se tipo = Completo)
   
2. **Para cada campo do sistema:**
   - Selecione a coluna correspondente do CSV
   - Exemplo:
     ```
     Nome Completo (CSV) → Nome do Cliente (Sistema)
     CPF (CSV) → CPF (Sistema)
     Email (CSV) → E-mail (Sistema)
     ```

3. **Campos obrigatórios:**
   - Marcados com asterisco vermelho (*)
   - Nome Completo e Telefone são obrigatórios

4. **Teste de template:**
   - Se clicou em template na Etapa 1, mapeamento já deve estar preenchido
   - Verifique se está correto

5. **Navegação:**
   - "Voltar" retorna para Etapa 1
   - "Próximo" vai para Etapa 3

---

### **Etapa 3: Configurações e Preview**

#### ✅ O que testar:

1. **Tipo de Importação:**
   - Clique em **"Dados Básicos"**
     - Deve destacar em roxo
     - Esconde campos clínicos no mapeamento
   - Clique em **"Histórico Completo"**
     - Deve destacar em roxo
     - Mostra campos clínicos no mapeamento

2. **Sistema de Tags:**
   - Digite uma tag (ex: "Teste Migração")
   - Clique "Adicionar"
   - Tag deve aparecer como chip roxo
   - Clique no X para remover
   - Adicione múltiplas tags

3. **Opções:**
   - Marque/desmarque "Ignorar clientes duplicados"
   - Checkbox deve funcionar

4. **Gerar Preview:**
   - Clique em **"Gerar Preview"**
   - Deve aparecer 4 cards com estatísticas:
     - Total de Linhas: 10
     - Válidas: (depende dos dados)
     - Com Erros: (se houver)
     - Duplicados: (se houver)

5. **Erros (se houver):**
   - Card vermelho com lista de erros
   - Exemplo: "Linha 5: E-mail inválido"
   - Mostra até 10 erros, depois "... e mais X erros"

6. **Iniciar Migração:**
   - Botão verde "Iniciar Migração"
   - Só habilitado se preview foi gerado
   - Desabilitado se validRows = 0

---

### **Etapa 4: Resultado**

#### ✅ O que testar:

1. **Status visual:**
   - ✅ **Sucesso:** Círculo verde com check
   - ⚠️ **Parcial:** Círculo laranja com alerta
   - ❌ **Falha:** Círculo vermelho com X

2. **Estatísticas:**
   - 3 cards mostrando:
     - Sucesso (verde)
     - Erros (vermelho)
     - Ignorados (cinza)

3. **Baixar Relatório:**
   - Clique em "Baixar Relatório Completo"
   - Deve baixar arquivo `.txt` com:
     - Data/hora
     - Status
     - Resumo (total, sucessos, erros, ignorados)
     - Lista de erros (se houver)
     - IDs dos clientes importados

4. **Concluir:**
   - Clique em "Concluir"
   - Modal fecha
   - Volta para página de migração

---

## 🎯 Cenários de Teste

### **Cenário 1: Importação Básica com Sucesso**

1. Upload `exemplo_migracao.csv`
2. Use template "Planilha Excel Genérica"
3. Tipo: **Dados Básicos**
4. Tags: `Migrado`, `Teste`
5. Gerar preview
6. Iniciar migração
7. ✅ Deve importar 10 clientes com sucesso

---

### **Cenário 2: Importação Completa com Tags**

1. Upload `exemplo_migracao.csv`
2. Mapeamento manual:
   - Nome Completo → Nome do Cliente
   - CPF → CPF
   - Email → E-mail
   - Telefone → Telefone/WhatsApp
   - Histórico Médico → Histórico Médico
   - Alergias → Alergias
   - Tipo de Pele → Tipo de Pele
3. Tipo: **Histórico Completo**
4. Tags: `Sistema Anterior`, `Dez/2024`, `Importação Teste`
5. Gerar preview
6. Iniciar migração
7. ✅ Deve importar com dados médicos

---

### **Cenário 3: Teste de Validação (Erros)**

1. Crie um CSV com dados inválidos:
```csv
Nome Completo,CPF,Email,Telefone
João Silva,111.111.111-11,email_invalido,11999999999
Maria,123.456.789-00,maria@email.com,telefone_invalido
,987.654.321-00,teste@email.com,11988888888
```

2. Upload do arquivo
3. Mapear colunas
4. Gerar preview
5. ❌ Deve mostrar erros:
   - Linha 2: CPF inválido (sequencial)
   - Linha 3: E-mail inválido
   - Linha 4: Campo obrigatório "Nome" vazio

---

### **Cenário 4: Teste de Duplicados**

1. Crie CSV com duplicados:
```csv
Nome Completo,CPF,Email,Telefone
João Silva,123.456.789-00,joao@email.com,11999999999
Maria Santos,123.456.789-00,maria@email.com,11988888888
Pedro Costa,987.654.321-00,joao@email.com,11977777777
```

2. Upload e mapear
3. Marcar "Ignorar duplicados"
4. Gerar preview
5. ⚠️ Deve detectar:
   - Linha 3: CPF duplicado
   - Linha 4: Email duplicado

---

## 🐛 Checklist de Bugs para Verificar

- [ ] Upload de arquivo funciona
- [ ] Templates aplicam mapeamento correto
- [ ] Progress bar avança (Etapa 1→2→3→4)
- [ ] Validação de CPF funciona
- [ ] Validação de email funciona
- [ ] Detecção de duplicados funciona
- [ ] Tags são adicionadas/removidas corretamente
- [ ] Preview mostra estatísticas corretas
- [ ] Botões habilitam/desabilitam conforme esperado
- [ ] Relatório é gerado e baixado
- [ ] Modal fecha ao clicar "Concluir"
- [ ] Navegação Voltar/Próximo funciona
- [ ] Responsivo em mobile

---

## 📸 Screenshots Esperados

### Etapa 1
```
┌─────────────────────────────────────────┐
│ Assistente de Migração                  │
│ Etapa 1 de 4: Upload do Arquivo         │
├─────────────────────────────────────────┤
│ [1] ─── [2] ─── [3] ─── [4]            │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  📤 Upload                         │ │
│  │  Arraste arquivo ou clique         │ │
│  │  [Selecionar Arquivo CSV]          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Templates:                             │
│  [ClinicWare] [Prontuário] [Excel]     │
│                                         │
│              [Próximo →]                │
└─────────────────────────────────────────┘
```

### Etapa 3 (Preview)
```
┌─────────────────────────────────────────┐
│ Preview da Migração                     │
├─────────────────────────────────────────┤
│ [10]        [8]         [2]        [0]  │
│ Total     Válidas    Erros    Duplicados│
├─────────────────────────────────────────┤
│ ⚠️ Erros Encontrados:                   │
│ Linha 5: E-mail inválido                │
│ Linha 7: CPF inválido                   │
└─────────────────────────────────────────┘
│         [Iniciar Migração]              │
└─────────────────────────────────────────┘
```

---

## ✅ Resultado Esperado Final

Após completar migração com sucesso:

1. **Clientes importados** aparecem no CRM
2. **Tags aplicadas** em todos os clientes
3. **Relatório baixado** com detalhes
4. **Dados validados** (CPF, email, telefone formatados)
5. **Histórico médico** salvo (se tipo = Completo)

---

**Boa sorte nos testes! 🚀**

Se encontrar bugs, anote:
- Etapa onde ocorreu
- Ação realizada
- Erro esperado vs obtido
- Console do navegador (F12)
