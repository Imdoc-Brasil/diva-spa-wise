# 📄 Sistema de Assinatura Digital e Portal do Paciente

## 🎯 Visão Geral

O sistema permite que pacientes assinem documentos digitalmente através de um portal web acessível via link único enviado por WhatsApp.

---

## 🏗️ Componentes Implementados

### 1. **SignaturePad** (`components/ui/SignaturePad.tsx`)
- Canvas interativo para desenhar assinatura
- Suporte a mouse e touch (mobile)
- Funcionalidades: Limpar, Cancelar, Confirmar
- Exporta assinatura em Base64 (PNG)

### 2. **PatientPortal** (`components/pages/PatientPortal.tsx`)
- Página pública para pacientes
- Acesso via token único
- Visualização de documentos pendentes
- Assinatura digital integrada
- Download de documentos assinados

### 3. **SendDocumentWhatsAppModal** (`components/modals/SendDocumentWhatsAppModal.tsx`)
- Seleção de documentos para envio
- Geração de link único do portal
- Prévia da mensagem WhatsApp
- Envio direto via WhatsApp Web

---

## 🔄 Fluxo de Uso

### **Passo 1: Enviar Documentos**
1. Abra o **Perfil do Cliente**
2. Vá na aba **"Documentos & Consentimento"**
3. Clique em **"Enviar WhatsApp"** (botão verde)
4. Selecione os documentos pendentes
5. Revise a mensagem gerada
6. Clique em **"Enviar WhatsApp"**

### **Passo 2: Paciente Recebe e Acessa**
1. Paciente recebe mensagem no WhatsApp
2. Clica no link personalizado
3. É direcionado ao **Portal do Paciente**
4. Vê lista de documentos pendentes

### **Passo 3: Assinatura Digital**
1. Paciente clica em **"Visualizar"** para ler o documento
2. Clica em **"Assinar"**
3. Desenha assinatura no canvas
4. Confirma assinatura
5. Documento é marcado como **"Assinado"**

### **Passo 4: Confirmação**
1. Status atualiza automaticamente
2. Paciente pode baixar PDF assinado
3. Clínica vê documento como "Assinado" no perfil

---

## 🔐 Segurança

### **Tokens de Acesso**
- Gerados com UUID único
- Vinculados a cliente específico
- Expiram em 7 dias
- Rastreiam uso (IP, User-Agent)

### **Assinatura Digital**
- Armazenada em Base64
- Timestamp de assinatura
- Metadados de auditoria
- Não repudiável

---

## 📱 Integração WhatsApp

### **Formato da Mensagem**
```
Olá {Nome do Cliente}! 👋

Você tem {N} documento(s) pendente(s) de assinatura:

• Termo de Consentimento - Laser
• Direito de Uso de Imagem

Para visualizar e assinar digitalmente, acesse o link abaixo:
https://diva-spa.com/paciente/{token}

Este link é pessoal e expira em 7 dias.

Qualquer dúvida, estamos à disposição! 😊

*Diva Spa - Sua beleza, nossa paixão* ✨
```

### **Link Gerado**
- Formato: `{baseURL}/paciente/{token}`
- Token único por envio
- Pode incluir múltiplos documentos

---

## 🎨 Interface do Portal

### **Design Responsivo**
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

### **Elementos Visuais**
- Gradiente suave de fundo
- Cards com sombra e hover
- Badges de status (Assinado/Pendente)
- Ícones intuitivos
- Cores da marca Diva

---

## 📊 Tipos de Documentos Suportados

1. **Termo de Consentimento** (`consent_term`)
2. **Direito de Uso de Imagem** (`image_rights`)
3. **Ficha de Anamnese** (`anamnesis`)
4. **Plano de Tratamento** (`treatment_plan`)
5. **Outros** (`other`)

---

## 🔧 Próximas Melhorias

### **Backend (Necessário para Produção)**
- [ ] API para gerar tokens
- [ ] Validação de tokens
- [ ] Armazenamento de assinaturas
- [ ] Geração de PDF com assinatura
- [ ] Envio de email de confirmação
- [ ] Webhook para notificar clínica

### **Funcionalidades Adicionais**
- [ ] Autenticação via SMS (código de verificação)
- [ ] Múltiplas assinaturas (cliente + responsável)
- [ ] Assinatura de testemunha
- [ ] Histórico de versões de documentos
- [ ] Certificado digital (ICP-Brasil)
- [ ] Integração com e-CPF/e-CNPJ

### **UX/UI**
- [ ] Preview de PDF antes de assinar
- [ ] Zoom em documentos longos
- [ ] Modo escuro
- [ ] Acessibilidade (WCAG 2.1)
- [ ] Tradução (PT/EN/ES)

---

## 💡 Dicas de Uso

### **Para a Clínica**
1. Sempre revise os documentos antes de enviar
2. Envie apenas documentos relevantes para o procedimento
3. Monitore documentos pendentes regularmente
4. Mantenha templates atualizados

### **Para o Paciente**
1. Leia todo o documento antes de assinar
2. Use uma assinatura clara e legível
3. Guarde o PDF assinado
4. Entre em contato em caso de dúvidas

---

## 🐛 Troubleshooting

### **Link não abre**
- Verificar se token não expirou
- Verificar conexão com internet
- Tentar em navegador diferente

### **Assinatura não salva**
- Verificar se desenhou algo no canvas
- Verificar se clicou em "Confirmar"
- Tentar limpar e assinar novamente

### **WhatsApp não abre**
- Verificar se WhatsApp está instalado
- Verificar número de telefone do cliente
- Tentar copiar link manualmente

---

## 📞 Suporte

Para dúvidas ou problemas:
- Email: suporte@diva-spa.com
- WhatsApp: (11) 99999-9999
- Horário: Seg-Sex, 9h-18h

---

**Desenvolvido com ❤️ para Diva Spa**
