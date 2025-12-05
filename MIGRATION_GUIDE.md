# 📋 Sistema de Migração de Dados - Guia Completo

## 🎯 Visão Geral

O Sistema de Migração permite importar dados de clientes de sistemas anteriores ou planilhas, com opções flexíveis para importar apenas dados básicos ou histórico médico completo.

---

## ✨ Funcionalidades

### 1. **Dois Tipos de Importação**

#### 📝 **Básica** (Dados de Contato)
Importa apenas informações essenciais:
- Nome Completo
- CPF
- E-mail
- Telefone/WhatsApp
- Data de Nascimento
- Endereço Completo (Rua, Cidade, Estado, CEP)
- Como Conheceu a Clínica

#### 🏥 **Completa** (Histórico Médico)
Importa dados básicos + histórico clínico:
- Histórico Médico
- Alergias
- Medicamentos em Uso
- Tipo de Pele
- Tratamentos Anteriores
- Observações Gerais

### 2. **Sistema de Tags/Etiquetas**

Marque clientes migrados com tags personalizadas:
- **Tag Padrão:** "Migrado" (automática)
- **Tags Personalizadas:** Ex: "Sistema Anterior", "Planilha 2024", "Clínica X"
- **Múltiplas Tags:** Adicione quantas quiser
- **Filtros:** Use tags para filtrar clientes migrados

### 3. **Mapeamento Inteligente de Colunas**

- **Automático:** Templates pré-configurados para sistemas populares
- **Manual:** Mapeie cada coluna do CSV para campos do sistema
- **Flexível:** Não precisa mapear todos os campos

### 4. **Validação e Preview**

Antes de importar, o sistema valida:
- ✅ Campos obrigatórios preenchidos
- ✅ E-mails válidos
- ✅ CPFs válidos
- ✅ Duplicados no arquivo
- ✅ Duplicados com clientes existentes

### 5. **Relatório Detalhado**

Após migração, receba relatório com:
- Total processado
- Sucessos e erros
- Linhas ignoradas (duplicados)
- Detalhes de cada erro
- IDs dos clientes importados

---

## 🚀 Como Usar

### **Passo 1: Preparar Arquivo CSV**

1. Exporte dados do sistema anterior em formato CSV
2. Certifique-se que a primeira linha contém os nomes das colunas
3. Formato aceito: UTF-8, separado por vírgula

**Exemplo de CSV:**
```csv
Nome Completo,CPF,Email,Telefone,Data Nascimento,Endereço
Maria Silva,123.456.789-00,maria@email.com,(11) 99999-9999,15/03/1985,Rua ABC 123
João Santos,987.654.321-00,joao@email.com,(11) 98888-8888,20/07/1990,Av XYZ 456
```

### **Passo 2: Abrir Assistente de Migração**

1. Acesse **Menu Lateral → Migração**
2. Clique em **"Nova Migração"**
3. Assistente abrirá em 4 etapas

### **Passo 3: Upload do Arquivo (Etapa 1)**

1. Clique em **"Selecionar Arquivo CSV"**
2. Escolha seu arquivo
3. Sistema mostrará quantas linhas foram detectadas
4. **Opcional:** Escolha um template pré-configurado:
   - ClinicWare
   - Prontuário Online
   - Excel Genérico

### **Passo 4: Mapear Colunas (Etapa 2)**

1. Para cada campo do sistema, selecione a coluna correspondente do CSV
2. Campos obrigatórios marcados com **\***
3. Campos não mapeados serão ignorados

**Exemplo de Mapeamento:**
```
Nome Completo (CSV) → Nome do Cliente (Sistema)
CPF (CSV) → CPF (Sistema)
Email (CSV) → E-mail (Sistema)
Telefone (CSV) → Telefone/WhatsApp (Sistema)
```

### **Passo 5: Configurar Importação (Etapa 3)**

#### **5.1. Escolher Tipo de Importação**

- **Dados Básicos:** Apenas informações de contato
- **Histórico Completo:** Inclui dados médicos

#### **5.2. Adicionar Tags**

1. Digite nome da tag
2. Clique **"Adicionar"**
3. Repita para múltiplas tags
4. Tags serão aplicadas a TODOS os clientes importados

**Sugestões de Tags:**
- `Migrado - [Data]`
- `Sistema Anterior`
- `Importação [Mês/Ano]`
- `Clínica [Nome]`

#### **5.3. Configurar Opções**

- ☑️ **Ignorar duplicados:** Pula clientes com CPF/Email já cadastrado
- ☐ **Atualizar existentes:** Atualiza dados de clientes já cadastrados

#### **5.4. Gerar Preview**

1. Clique **"Gerar Preview"**
2. Sistema mostrará:
   - Total de linhas
   - Linhas válidas
   - Linhas com erro
   - Duplicados encontrados
3. **Revise os erros** antes de prosseguir

### **Passo 6: Executar Migração (Etapa 3)**

1. Se preview estiver OK, clique **"Iniciar Migração"**
2. Aguarde processamento
3. Sistema importará linha por linha

### **Passo 7: Revisar Resultado (Etapa 4)**

1. Veja resumo da migração:
   - ✅ Sucessos
   - ❌ Erros
   - ⏭️ Ignorados
2. Clique **"Baixar Relatório Completo"** para arquivo .txt detalhado
3. Clique **"Concluir"** para fechar

---

## 📊 Templates Pré-configurados

### **ClinicWare**
```
nome_completo → Nome do Cliente
cpf → CPF
email → E-mail
telefone → Telefone/WhatsApp
data_nascimento → Data de Nascimento
endereco → Endereço
historico_medico → Histórico Médico
```

### **Prontuário Online**
```
Nome → Nome do Cliente
CPF → CPF
Email → E-mail
Celular → Telefone/WhatsApp
Nascimento → Data de Nascimento
```

### **Excel Genérico**
```
Nome → Nome do Cliente
Telefone → Telefone/WhatsApp
```

---

## ⚙️ Transformações Automáticas

O sistema aplica formatações automaticamente:

| Campo | Transformação | Exemplo |
|-------|---------------|---------|
| CPF | Remove formatação | `123.456.789-00` → `12345678900` |
| Telefone | Formata (XX) XXXXX-XXXX | `11999999999` → `(11) 99999-9999` |
| Email | Lowercase | `MARIA@EMAIL.COM` → `maria@email.com` |
| Data | Padroniza formato | Vários formatos aceitos |

---

## 🔍 Validações Realizadas

### **Campos Obrigatórios**
- Nome Completo
- Telefone/WhatsApp

### **Validações de Formato**
- **E-mail:** Formato válido (xxx@xxx.xxx)
- **CPF:** 11 dígitos, não pode ser sequência (111.111.111-11)
- **Telefone:** 10 ou 11 dígitos

### **Duplicados**
- **No arquivo:** Detecta CPF/Email repetido no próprio CSV
- **No sistema:** Compara com clientes já cadastrados

---

## 📝 Exemplo de Relatório

```
=== RELATÓRIO DE MIGRAÇÃO ===

Data: 02/12/2024 11:45:00
Status: ✅ Sucesso

RESUMO:
- Total processado: 150
- Importados com sucesso: 145
- Erros: 3
- Ignorados (duplicados): 2

ERROS ENCONTRADOS:
Linha 15: E-mail inválido (email: maria.silva@)
Linha 47: CPF inválido (cpf: 111.111.111-11)
Linha 89: Campo obrigatório "Nome" está vazio

IDs dos clientes importados:
client_1733155200_abc123, client_1733155201_def456, ...
```

---

## 🏷️ Gerenciando Tags Pós-Migração

Após migração, você pode:

1. **Filtrar por Tag:**
   - Vá em Clientes
   - Use filtro de tags
   - Selecione "Migrado" ou tag personalizada

2. **Adicionar/Remover Tags:**
   - Abra perfil do cliente
   - Edite tags manualmente

3. **Relatórios:**
   - Gere relatórios apenas de clientes migrados
   - Use tags para segmentação

---

## ⚠️ Dicas Importantes

### ✅ **Faça Backup**
Antes de migrar, faça backup dos dados atuais.

### ✅ **Teste com Amostra**
Importe primeiro 10-20 linhas para testar mapeamento.

### ✅ **Revise Preview**
SEMPRE revise o preview antes de executar.

### ✅ **Limpe Dados**
Remova linhas vazias e caracteres especiais do CSV.

### ✅ **Use UTF-8**
Salve CSV em UTF-8 para evitar problemas com acentos.

### ✅ **Guarde Relatório**
Salve o relatório de migração para auditoria.

---

## 🐛 Problemas Comuns

### **"Nenhuma linha detectada"**
- Verifique se arquivo está em formato CSV
- Certifique-se que primeira linha tem cabeçalhos

### **"Muitos erros de validação"**
- Revise formato dos dados (CPF, Email, Telefone)
- Use transformações automáticas

### **"Duplicados não detectados"**
- Verifique se CPF/Email estão mapeados corretamente
- Ative opção "Ignorar duplicados"

### **"Caracteres estranhos no nome"**
- Salve CSV em UTF-8
- Evite caracteres especiais

---

## 🔄 Migração em Lote vs Individual

| Característica | Lote (CSV) | Individual (Manual) |
|----------------|------------|---------------------|
| Velocidade | ⚡ Rápida | 🐌 Lenta |
| Precisão | ⚠️ Requer validação | ✅ Alta |
| Histórico | ✅ Sim | ✅ Sim |
| Tags | ✅ Automáticas | ⚙️ Manual |
| Recomendado para | 50+ clientes | < 10 clientes |

---

## 📞 Suporte

Dúvidas sobre migração?
- Email: suporte@diva-spa.com
- WhatsApp: (11) 99999-9999

---

**Desenvolvido com ❤️ para Diva Spa**
