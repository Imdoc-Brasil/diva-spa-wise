# 🎨 Guia dos Módulos de Experiência - Diva Spa OS

## Visão Geral
Os módulos de experiência transformam a jornada do cliente com tecnologia de ponta, desde o auto-atendimento até a comunicação visual premium.

---

## 1. 📱 **Kiosk Module** (Auto-Atendimento)

### Objetivo
Totem de auto-atendimento para check-in rápido e preenchimento de formulários sem interação com recepcionista.

### Fluxo Completo

#### **Etapa 1: Welcome (Boas-Vindas)**
- Tela de espera atrativa
- Animação de pulso
- "Toque para iniciar"
- Design minimalista e premium

#### **Etapa 2: Identify (Identificação)**
- Teclado numérico virtual
- Entrada de telefone (11 dígitos)
- Formatação automática: (11) 99999-9999
- Busca automática no banco de dados

#### **Etapa 3: Confirm (Confirmação)**
- Exibe nome do cliente
- Mostra agendamento do dia
- Alerta de formulários pendentes
- Opção "Não sou eu" para correção

#### **Etapa 4: Forms (Formulários Inteligentes)**
- **Anamnese Dinâmica**:
  - Cabeçalhos de seção
  - Campos de texto
  - Seleção múltipla (botões grandes)
  - Checkbox Sim/Não visual
  - **Assinatura Digital** (canvas touch)

**Tipos de Campo Suportados:**
- `section_header`: Título de seção
- `text`: Entrada de texto livre
- `select`: Seleção única (botões)
- `checkbox`: Sim/Não visual
- `signature`: Canvas de assinatura

**Exemplo de Formulário:**
```typescript
{
  title: 'Anamnese Facial Obrigatória',
  fields: [
    { type: 'section_header', label: 'Histórico de Saúde' },
    { type: 'select', label: 'Está gestante ou lactante?', 
      options: ['Não', 'Sim - Gestante', 'Sim - Lactante'] },
    { type: 'checkbox', label: 'Fez uso de ácidos nos últimos 7 dias?' },
    { type: 'text', label: 'Possui alguma alergia conhecida?', 
      placeholder: 'Ex: Dipirona, Latex...' },
    { type: 'signature', label: 'Termo de Responsabilidade' }
  ]
}
```

#### **Etapa 5: NPS (Avaliação)**
- Feedback rápido da experiência
- 3 opções visuais:
  - 😊 Excelente
  - 😐 Normal
  - 😞 Ruim (não implementado, mas pode adicionar)

#### **Etapa 6: Finish (Conclusão)**
- Confirmação visual (✓ verde)
- Mensagem de sucesso
- Auto-reset em 5 segundos

### Funcionalidades Técnicas

**Assinatura Digital:**
- Canvas HTML5
- Suporte touch e mouse
- Botão "Limpar" para refazer
- Salva como imagem base64

**Responsividade:**
- Otimizado para tablets (10-13")
- Modo retrato ou paisagem
- Touch-friendly (botões grandes)

**Segurança:**
- Timeout automático
- Botão de saída (modo admin)
- Sem teclado físico necessário

---

## 2. 📺 **TV Signage** (Display de Chamadas)

### Objetivo
Tela de TV na recepção exibindo chamadas de pacientes, promoções e informações em tempo real.

### Layout

#### **Área Principal (75% - Esquerda)**
**Carrossel de Promoções:**
- Slides rotativos (8 segundos cada)
- Imagem de fundo em tela cheia
- Gradiente overlay para legibilidade
- Conteúdo:
  - Título grande (8xl font)
  - Subtítulo com tracking
  - Descrição detalhada
  - Barra de progresso animada

**Slides Pré-Configurados:**
1. **Laser Day**
   - Próximo evento
   - Condições especiais
   - Call-to-action

2. **Novidade: Lavieen**
   - Novo tratamento
   - Benefícios
   - Tecnologia

3. **Clube Diva**
   - Programa de assinatura
   - Preços
   - Vantagens

#### **Painel Lateral (25% - Direita)**

**Seção 1: Relógio**
- Hora atual (HH:MM)
- Data completa
- Logo Diva Spa

**Seção 2: Chamada Atual (Hero)**
- Nome do paciente (grande)
- Sala de atendimento
- Ícone de som animado
- Glow effect pulsante
- Efeito sonoro (simulado)

**Seção 3: Próximos**
- Lista de 3-5 próximos pacientes
- Horário de cada um
- Opacidade reduzida

**Seção 4: Footer**
- Clima atual
- Mensagem institucional

### Funcionalidades

**Auto-Atualização:**
- Relógio em tempo real (1s)
- Slides automáticos (8s)
- Chamadas via WebSocket (simulado)

**Animações:**
- Fade in/out de slides
- Bounce no ícone de chamada
- Progress bar linear
- Glow pulsante

**Responsividade:**
- Otimizado para TVs 40-55"
- Resolução Full HD (1920x1080)
- Modo paisagem obrigatório

---

## 3. 🌐 **Website Builder** (Diva Pages)

### Objetivo
Editor visual de site institucional e landing pages sem código.

### Interface

#### **Painel Esquerdo (Editor)**

**Seção 1: Hero (Capa)**
- Título principal (editável)
- Subtítulo (textarea)
- Imagem de fundo (URL)
- Preview thumbnail

**Seção 2: Seções Ativas**
Toggles para ativar/desativar:
- ✅ Catálogo de Serviços
- ✅ Equipe (Staff)
- ✅ Depoimentos

**Seção 3: Marca & Contato**
- Cor primária (color picker)
- WhatsApp de contato
- Instagram handle

#### **Painel Direito (Preview)**

**Simulador Mobile:**
- Frame de iPhone
- Notch realista
- Scroll funcional
- Preview em tempo real

**Conteúdo Renderizado:**
- Hero com imagem e overlay
- Cards de serviços
- Galeria de equipe
- Botão flutuante (CTA)

### Funcionalidades

**Edição em Tempo Real:**
- Mudanças instantâneas no preview
- Sem necessidade de "salvar" para ver

**Publicação:**
- Botão "Publicar Alterações"
- Gera site estático
- URL personalizada (simulado)

**Preview Externo:**
- Botão "Ver Site Online"
- Abre em nova aba
- Modo desktop e mobile

### Seções Disponíveis

**Hero:**
- Imagem full-width
- Título + Subtítulo
- Gradiente overlay

**Serviços:**
- Cards com imagem
- Nome do tratamento
- Preço "A partir de"

**Equipe:**
- Carrossel horizontal
- Foto circular
- Nome e especialidade

**CTA (Call-to-Action):**
- Botão fixo no rodapé
- Cor personalizável
- Link para agendamento

---

## 📊 Casos de Uso

### Caso 1: Implementação de Kiosk
**Objetivo**: Reduzir fila na recepção

**Setup:**
1. Tablet 10-13" em suporte fixo
2. Acesse `/kiosk` no navegador
3. Modo fullscreen (F11)
4. Configurar formulários em Settings

**Benefícios:**
- ✅ Reduz tempo de espera
- ✅ Dados mais precisos (cliente preenche)
- ✅ Experiência moderna
- ✅ Libera recepcionista para outras tarefas

**Métricas:**
- Tempo médio de check-in: 2-3 minutos
- Taxa de conclusão: > 90%
- Satisfação (NPS): Excelente

---

### Caso 2: TV Signage na Recepção
**Objetivo**: Comunicação visual e chamadas

**Setup:**
1. TV 40-55" na parede
2. Computador/Chromecast conectado
3. Acesse `/tv` no navegador
4. Modo fullscreen

**Conteúdo:**
- Promoções do mês
- Novos tratamentos
- Chamadas de pacientes
- Clima e hora

**Integração:**
- Chamadas automáticas via sistema
- Atualização de promoções via CMS
- Som opcional (campainha)

---

### Caso 3: Site Institucional
**Objetivo**: Presença online profissional

**Fluxo:**
1. Acesse **Website** no menu
2. Edite conteúdo:
   - Título e descrição
   - Imagens (Unsplash ou próprias)
   - Cor da marca
   - Contato
3. Preview mobile
4. Publicar

**Resultado:**
- Site responsivo
- SEO otimizado
- Agendamento online
- Integração com WhatsApp

---

## 🎓 Melhores Práticas

### Kiosk:
1. **Posicionamento**: Entrada, antes da recepção
2. **Altura**: 1,20m (acessível)
3. **Limpeza**: Álcool gel ao lado
4. **Instruções**: Placa visual "Check-in Aqui"
5. **Backup**: Recepcionista disponível para ajuda

### TV Signage:
1. **Posicionamento**: Parede frontal, visível de toda recepção
2. **Altura**: 1,80-2,00m (olho sentado)
3. **Brilho**: Ajustar conforme iluminação
4. **Som**: Volume baixo (opcional)
5. **Conteúdo**: Atualizar promoções semanalmente

### Website:
1. **Imagens**: Alta qualidade (min 1920px)
2. **Texto**: Claro e objetivo
3. **CTA**: Sempre visível
4. **Mobile**: Testar em dispositivos reais
5. **SEO**: Título e descrição otimizados

---

## 🔧 Configurações Avançadas

### Kiosk - Personalização de Formulários
Acesse **Settings** → **Forms** para:
- Criar novos formulários
- Definir campos obrigatórios
- Adicionar termos de consentimento
- Configurar lógica condicional

### TV - Gerenciamento de Conteúdo
Acesse **Settings** → **Signage** para:
- Upload de slides personalizados
- Definir tempo de rotação
- Configurar chamadas automáticas
- Ajustar cores e branding

### Website - SEO e Analytics
Acesse **Settings** → **Website** para:
- Meta tags (título, descrição)
- Google Analytics ID
- Facebook Pixel
- Domínio personalizado

---

## 📈 Métricas de Sucesso

### Kiosk:
- ✅ Taxa de uso: > 70% dos clientes
- ✅ Tempo médio: < 3 minutos
- ✅ Taxa de conclusão: > 90%
- ✅ NPS: > 8/10

### TV Signage:
- ✅ Visualizações: 100% dos clientes
- ✅ Tempo de espera percebido: -30%
- ✅ Recall de promoções: +50%
- ✅ Conversão de ofertas: +20%

### Website:
- ✅ Tráfego orgânico: +100/mês
- ✅ Taxa de conversão: > 5%
- ✅ Agendamentos online: 30% do total
- ✅ Tempo no site: > 2 minutos

---

## 🔗 Integrações

### Atual (Simulado):
- Dados mockados
- Funcionalidades completas
- Preview em tempo real

### Futuro (Produção):
- **Kiosk**: 
  - Integração com CRM
  - Envio de SMS de confirmação
  - Foto do cliente (webcam)
  
- **TV Signage**:
  - WebSocket para chamadas em tempo real
  - CMS para gerenciar slides
  - Integração com agenda
  
- **Website**:
  - Agendamento online real
  - Pagamento via Stripe/Mercado Pago
  - Chat ao vivo (Zendesk)

---

## ❓ FAQ

**P: O Kiosk funciona offline?**
R: Não. Precisa de conexão para buscar dados do cliente e enviar formulários.

**P: Posso personalizar as cores do Kiosk?**
R: Sim, via CSS variables ou Settings (futuro).

**P: A TV Signage funciona em qualquer resolução?**
R: Otimizada para Full HD (1920x1080). Funciona em outras, mas pode precisar ajustes.

**P: Posso ter múltiplos sites (filiais)?**
R: Sim, cada unidade pode ter seu próprio site com conteúdo personalizado.

**P: Como adiciono novos slides na TV?**
R: Atualmente via código. Em produção, haverá CMS visual.

---

**Diva Spa OS** - Experiência Premium do Cliente 🎨💜

