import jsPDF from 'jspdf';
import { ClientDocument, DocumentSignature, ClientAccessToken } from '../types';

/**
 * Serviço para gerenciamento de tokens de acesso do paciente
 */
export class TokenService {
    private static readonly TOKEN_EXPIRY_DAYS = 7;
    private static readonly STORAGE_KEY = 'diva_access_tokens';

    /**
     * Gera um token único para acesso do paciente
     */
    static generateToken(clientId: string, documentIds: string[]): ClientAccessToken {
        const token = this.generateUUID();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

        const accessToken: ClientAccessToken = {
            id: this.generateUUID(),
            clientId,
            token,
            expiresAt: expiresAt.toISOString(),
            createdAt: now.toISOString(),
            purpose: 'document_signature',
            documentIds,
        };

        // Salvar no localStorage
        this.saveToken(accessToken);

        return accessToken;
    }

    /**
     * Valida um token e retorna os dados se válido
     */
    static validateToken(token: string): ClientAccessToken | null {
        const tokens = this.getAllTokens();
        const accessToken = tokens.find(t => t.token === token);

        if (!accessToken) {
            return null;
        }

        // Verificar expiração
        if (new Date(accessToken.expiresAt) < new Date()) {
            return null;
        }

        // Marcar como usado
        if (!accessToken.usedAt) {
            accessToken.usedAt = new Date().toISOString();
            this.updateToken(accessToken);
        }

        return accessToken;
    }

    /**
     * Marca token como usado
     */
    static markTokenAsUsed(token: string): void {
        const tokens = this.getAllTokens();
        const accessToken = tokens.find(t => t.token === token);

        if (accessToken && !accessToken.usedAt) {
            accessToken.usedAt = new Date().toISOString();
            this.updateToken(accessToken);
        }
    }

    /**
     * Gera UUID v4
     */
    private static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Salva token no localStorage
     */
    private static saveToken(token: ClientAccessToken): void {
        const tokens = this.getAllTokens();
        tokens.push(token);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
    }

    /**
     * Atualiza token existente
     */
    private static updateToken(updatedToken: ClientAccessToken): void {
        const tokens = this.getAllTokens();
        const index = tokens.findIndex(t => t.id === updatedToken.id);
        if (index !== -1) {
            tokens[index] = updatedToken;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
        }
    }

    /**
     * Busca todos os tokens
     */
    private static getAllTokens(): ClientAccessToken[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Limpa tokens expirados
     */
    static cleanExpiredTokens(): void {
        const tokens = this.getAllTokens();
        const now = new Date();
        const validTokens = tokens.filter(t => new Date(t.expiresAt) > now);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validTokens));
    }
}

/**
 * Serviço para geração de PDFs com assinatura digital
 */
export class PDFService {
    /**
     * Gera PDF de documento com assinatura incorporada
     */
    static async generateSignedPDF(
        document: ClientDocument,
        signature: DocumentSignature,
        clientName: string
    ): Promise<Blob> {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;

        // Header
        doc.setFillColor(99, 102, 241); // diva-primary
        doc.rect(0, 0, pageWidth, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Diva Spa', margin, 20);

        // Document Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(document.title, margin, 45);

        // Document Type Badge
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const typeLabel = this.getDocumentTypeLabel(document.type);
        doc.setFillColor(243, 244, 246);
        doc.roundedRect(margin, 50, 60, 8, 2, 2, 'F');
        doc.setTextColor(75, 85, 99);
        doc.text(typeLabel, margin + 3, 56);

        // Client Info
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Cliente: ${clientName}`, margin, 70);
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text(`Data de Assinatura: ${new Date(signature.signedAt).toLocaleString('pt-BR')}`, margin, 77);

        // Document Content
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');

        const content = this.stripHTML(document.content || '');
        const lines = doc.splitTextToSize(content, contentWidth);

        let yPosition = 90;
        const lineHeight = 7;

        for (const line of lines) {
            if (yPosition > pageHeight - 80) {
                doc.addPage();
                yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += lineHeight;
        }

        // Signature Section
        if (yPosition > pageHeight - 80) {
            doc.addPage();
            yPosition = margin;
        } else {
            yPosition += 20;
        }

        // Signature Box
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(margin, yPosition, contentWidth, 60);

        // Signature Label
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Assinatura Digital:', margin + 5, yPosition + 10);

        // Add signature image
        try {
            doc.addImage(
                signature.signatureData,
                'PNG',
                margin + 5,
                yPosition + 15,
                80,
                30
            );
        } catch (error) {
            console.error('Error adding signature image:', error);
        }

        // Signature metadata
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(`Assinado por: ${clientName}`, margin + 5, yPosition + 50);
        doc.text(`Data/Hora: ${new Date(signature.signedAt).toLocaleString('pt-BR')}`, margin + 5, yPosition + 55);

        if (signature.ipAddress) {
            doc.text(`IP: ${signature.ipAddress}`, margin + 100, yPosition + 50);
        }

        // Footer
        const footerY = pageHeight - 15;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('Documento gerado digitalmente - Diva Spa', margin, footerY);
        doc.text(`ID: ${document.id}`, pageWidth - margin - 50, footerY);

        // Generate blob
        return doc.output('blob');
    }

    /**
     * Baixa PDF gerado
     */
    static downloadPDF(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Remove tags HTML do conteúdo
     */
    private static stripHTML(html: string): string {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    /**
     * Retorna label do tipo de documento
     */
    private static getDocumentTypeLabel(type: string): string {
        const labels: Record<string, string> = {
            consent_term: 'Termo de Consentimento',
            image_rights: 'Direito de Imagem',
            anamnesis: 'Anamnese',
            treatment_plan: 'Plano de Tratamento',
            other: 'Outro',
        };
        return labels[type] || 'Documento';
    }
}

/**
 * Serviço para gerenciamento de assinaturas
 */
export class SignatureService {
    private static readonly STORAGE_KEY = 'diva_signatures';

    /**
     * Salva assinatura
     */
    static saveSignature(signature: DocumentSignature): void {
        const signatures = this.getAllSignatures();
        signatures.push(signature);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(signatures));
    }

    /**
     * Busca assinatura por ID de documento
     */
    static getSignatureByDocumentId(documentId: string): DocumentSignature | null {
        const signatures = this.getAllSignatures();
        return signatures.find(s => s.documentId === documentId) || null;
    }

    /**
     * Busca todas as assinaturas de um cliente
     */
    static getSignaturesByClientId(clientId: string): DocumentSignature[] {
        const signatures = this.getAllSignatures();
        return signatures.filter(s => s.clientId === clientId);
    }

    /**
     * Busca todas as assinaturas
     */
    private static getAllSignatures(): DocumentSignature[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Gera ID único para assinatura
     */
    static generateSignatureId(): string {
        return `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
