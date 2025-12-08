# 🚀 Guia Rápido - Iniciar Testes

## ⚡ Início Rápido (2 minutos)

### **Passo 1: Iniciar o Servidor**
```bash
cd "/Users/mimaejack/Library/Mobile Documents/com~apple~CloudDocs/diva-spa-wise"
npm run dev
```

### **Passo 2: Abrir no Navegador**
```
http://localhost:5173
```

### **Passo 3: Ativar DevTools Mobile**
```
1. Pressione F12 (ou Cmd+Option+I no Mac)
2. Pressione Ctrl+Shift+M (ou Cmd+Shift+M no Mac)
3. Selecione "iPhone 12 Pro" no dropdown
```

### **Passo 4: Testar Responsividade**
```
✅ Navegue pelos módulos
✅ Abra modais
✅ Teste formulários
✅ Verifique se tudo está acessível
```

---

## 📱 Testes Prioritários (10 minutos)

### **1. Dashboard** (2 min)
- Abrir aplicação
- Verificar KPIs em mobile
- Testar gráficos
- ✅ Tudo visível e legível?

### **2. Agenda** (2 min)
- Clicar em "Agenda"
- Verificar controles de visualização
- Criar novo agendamento
- ✅ Formulário funciona?

### **3. CRM** (2 min)
- Clicar em "CRM"
- Verificar lista de clientes (cards)
- Abrir perfil de um cliente
- ✅ Modal full-screen?

### **4. Checkout** (2 min)
- Abrir um agendamento
- Clicar em "Checkout"
- Verificar layout
- ✅ Tudo acessível?

### **5. Navegação** (2 min)
- Testar sidebar
- Navegar entre módulos
- Testar FAB
- ✅ Navegação fluida?

---

## 🎯 Checklist Rápido

### **Visual**
- [ ] Sem overflow horizontal
- [ ] Sem conteúdo cortado
- [ ] Texto legível
- [ ] Botões acessíveis

### **Funcional**
- [ ] Todos os botões clicam
- [ ] Formulários funcionam
- [ ] Modais abrem/fecham
- [ ] Navegação funciona

### **Performance**
- [ ] Sem lag
- [ ] Animações suaves
- [ ] Sem erros no console

---

## 🐛 Se Encontrar Bugs

### **Reportar Bug**
```markdown
**Componente**: [Nome]
**Dispositivo**: [iPhone 12, 390px]
**Descrição**: [O que aconteceu]
**Esperado**: [O que deveria acontecer]
**Screenshot**: [Anexar se possível]
```

### **Prioridade**
- 🔴 **Crítico**: Bloqueia uso
- 🟡 **Alto**: Afeta UX
- 🟢 **Baixo**: Cosmético

---

## ✅ Aprovação

Se tudo estiver funcionando:
- ✅ Marcar `VALIDATION_CHECKLIST.md` como aprovado
- ✅ Preparar para deploy
- ✅ Comemorar! 🎉

---

**Tempo estimado**: 10-15 minutos  
**Dificuldade**: Fácil  
**Resultado**: Validação completa da responsividade
