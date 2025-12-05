# 🔗 Integração do Portal do Paciente

## Como Adicionar Rota Pública

Para que o portal funcione, você precisa adicionar uma rota pública na sua aplicação.

### Exemplo com React Router:

```tsx
// App.tsx ou Routes.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientPortal from './components/pages/PatientPortal';
import MainApp from './MainApp'; // Sua aplicação principal

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota Pública - Portal do Paciente */}
                <Route 
                    path="/paciente/:token" 
                    element={<PatientPortalWrapper />} 
                />
                
                {/* Rotas Privadas - Sistema Administrativo */}
                <Route path="/*" element={<MainApp />} />
            </Routes>
        </BrowserRouter>
    );
}

// Wrapper para extrair token da URL
function PatientPortalWrapper() {
    const { token } = useParams<{ token: string }>();
    
    if (!token) {
        return <div>Token inválido</div>;
    }
    
    return <PatientPortal token={token} />;
}

export default App;
```

---

## Backend API (Necessário)

### 1. **Endpoint: Validar Token**
```typescript
GET /api/patient-portal/validate/:token

Response:
{
    "valid": true,
    "clientId": "client_123",
    "clientName": "Maria Silva",
    "expiresAt": "2024-12-08T10:00:00Z",
    "documentIds": ["doc1", "doc2"]
}
```

### 2. **Endpoint: Buscar Documentos**
```typescript
GET /api/patient-portal/documents/:token

Response:
{
    "documents": [
        {
            "id": "doc1",
            "title": "Termo de Consentimento",
            "type": "consent_term",
            "content": "<html>...</html>",
            "status": "pending",
            "requiresSignature": true
        }
    ]
}
```

### 3. **Endpoint: Salvar Assinatura**
```typescript
POST /api/patient-portal/sign

Body:
{
    "token": "abc123...",
    "documentId": "doc1",
    "signatureData": "data:image/png;base64,...",
    "metadata": {
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0..."
    }
}

Response:
{
    "success": true,
    "signatureId": "sig_123",
    "signedAt": "2024-12-01T15:30:00Z",
    "pdfUrl": "https://storage.com/signed-doc.pdf"
}
```

---

## Geração de Token (Backend)

```typescript
// Exemplo em Node.js/Express

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

interface TokenData {
    clientId: string;
    documentIds: string[];
    expiresAt: Date;
}

function generatePatientToken(data: TokenData): string {
    // Gerar token único
    const token = uuidv4();
    
    // Calcular expiração (7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Salvar no banco de dados
    await db.clientAccessTokens.create({
        id: uuidv4(),
        token,
        clientId: data.clientId,
        documentIds: data.documentIds,
        expiresAt,
        createdAt: new Date(),
        purpose: 'document_signature'
    });
    
    return token;
}

// Rota para gerar token
app.post('/api/admin/generate-patient-token', async (req, res) => {
    const { clientId, documentIds } = req.body;
    
    const token = await generatePatientToken({
        clientId,
        documentIds,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    const portalUrl = `${process.env.APP_URL}/paciente/${token}`;
    
    res.json({ token, portalUrl });
});
```

---

## Geração de PDF com Assinatura

```typescript
import PDFDocument from 'pdfkit';
import fs from 'fs';

async function generateSignedPDF(
    documentContent: string,
    signatureData: string,
    clientName: string
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
        
        // Adicionar conteúdo do documento
        doc.fontSize(12).text(documentContent, {
            align: 'justify'
        });
        
        // Adicionar assinatura
        doc.moveDown(2);
        doc.fontSize(10).text('Assinatura Digital:', { underline: true });
        doc.moveDown(0.5);
        
        // Inserir imagem da assinatura
        const signatureBuffer = Buffer.from(
            signatureData.replace(/^data:image\/\w+;base64,/, ''),
            'base64'
        );
        doc.image(signatureBuffer, {
            fit: [200, 100],
            align: 'left'
        });
        
        doc.moveDown(0.5);
        doc.fontSize(8).text(`${clientName}`, { align: 'left' });
        doc.text(`Assinado digitalmente em ${new Date().toLocaleString('pt-BR')}`, {
            align: 'left'
        });
        
        doc.end();
    });
}
```

---

## Envio de WhatsApp (Backend)

### Opção 1: WhatsApp Business API
```typescript
import axios from 'axios';

async function sendWhatsAppMessage(
    phoneNumber: string,
    message: string
) {
    const response = await axios.post(
        'https://graph.facebook.com/v18.0/YOUR_PHONE_ID/messages',
        {
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'text',
            text: { body: message }
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }
    );
    
    return response.data;
}
```

### Opção 2: Twilio
```typescript
import twilio from 'twilio';

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsAppViaTwilio(
    phoneNumber: string,
    message: string
) {
    const result = await client.messages.create({
        from: 'whatsapp:+14155238886', // Twilio Sandbox
        to: `whatsapp:+55${phoneNumber}`,
        body: message
    });
    
    return result;
}
```

---

## Variáveis de Ambiente

```env
# .env

# App
APP_URL=https://diva-spa.com
NODE_ENV=production

# WhatsApp Business API
WHATSAPP_PHONE_ID=your_phone_id
WHATSAPP_TOKEN=your_access_token

# Twilio (alternativa)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token

# Storage (para PDFs)
AWS_S3_BUCKET=diva-spa-documents
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/diva_spa
```

---

## Checklist de Implementação

### Frontend ✅
- [x] SignaturePad component
- [x] PatientPortal page
- [x] SendDocumentWhatsAppModal
- [x] Integração com ClientProfileModal
- [x] Tipos TypeScript

### Backend (Pendente)
- [ ] Endpoint de validação de token
- [ ] Endpoint de busca de documentos
- [ ] Endpoint de salvamento de assinatura
- [ ] Geração de PDF assinado
- [ ] Upload para storage (S3/GCS)
- [ ] Integração WhatsApp API
- [ ] Notificações por email

### Infraestrutura
- [ ] Configurar domínio/subdomínio
- [ ] Certificado SSL
- [ ] CDN para assets
- [ ] Backup de documentos
- [ ] Logs e monitoramento

---

**Próximo Passo:** Implementar backend APIs
