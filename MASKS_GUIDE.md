# 🎭 Guia de Máscaras e Validações

Este projeto utiliza um conjunto centralizado de utilitários para formatação (máscaras) e validação de dados.

**Localização:** `src/utils/masks.ts`

---

## 🛠️ Funções Disponíveis

### Máscaras (Formatters)
Usadas principalmente no evento `onChange` de inputs.

| Função | Descrição | Exemplo de Saída |
|--------|-----------|------------------|
| `maskCPF(value)` | Formata CPF | `123.456.789-00` |
| `maskCNPJ(value)` | Formata CNPJ | `12.345.678/0001-90` |
| `maskPhone(value)` | Formata Telefone (Fixo/Celular) | `(11) 99999-9999` |
| `maskCEP(value)` | Formata CEP | `12345-678` |
| `maskDate(value)` | Formata Data | `25/12/2023` |
| `maskCurrency(value)` | Formata Moeda (BRL) | `R$ 1.250,00` |

### Validadores (Validators)
Usados antes de submeter formulários. Retornam `true` se válido.

| Função | Descrição |
|--------|-----------|
| `validateCPF(cpf)` | Verifica algoritmo de CPF e dígitos verificadores. |
| `validateEmail(email)` | Verifica formato de e-mail (Regex). |
| `validatePhone(phone)` | Verifica se tem 10 ou 11 dígitos. |

---

## 💻 Como Usar

### 1. Importar
```typescript
import { maskPhone, validateEmail } from '../utils/masks'; // Ajuste o caminho conforme necessário
```

### 2. Aplicar em Input (Máscara)
```tsx
<input 
  type="tel"
  value={phone}
  onChange={(e) => setPhone(maskPhone(e.target.value))}
  maxLength={15} // Importante limitar
/>
```

### 3. Validar no Submit
```typescript
const handleSubmit = () => {
  if (!validateEmail(email)) {
    setError('E-mail inválido');
    return;
  }
  // ... salvar
};
```

---

## ⚠️ Boas Práticas
- Sempre use `maxLength` nos inputs para evitar que o usuário digite além da máscara.
- Armazene os dados preferencialmente limpos (sem máscara) no banco de dados se for fazer buscas, ou com máscara se for apenas para exibição. Atualmente, o estado local mantém a máscara para melhor UX.
