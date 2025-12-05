import { Client } from '../types';
import { MigrationConfig, MigrationPreview, MigrationResult, MigrationError, ColumnMapping } from '../types/migration';

export class MigrationService {
    /**
     * Parse CSV file to array of objects
     */
    static parseCSV(csvContent: string): any[] {
        const lines = csvContent.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const rows: any[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row: any = {};

            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });

            rows.push(row);
        }

        return rows;
    }

    /**
     * Validate and preview migration data
     */
    static previewMigration(
        csvData: any[],
        config: MigrationConfig
    ): MigrationPreview {
        const errors: MigrationError[] = [];
        let validRows = 0;
        let duplicates = 0;
        const seenCPFs = new Set<string>();
        const seenEmails = new Set<string>();

        csvData.forEach((row, index) => {
            const rowNumber = index + 2; // +2 because index starts at 0 and we skip header
            let isValid = true;

            // Validate required fields
            config.columnMapping.forEach(mapping => {
                if (mapping.required && !row[mapping.sourceColumn]) {
                    errors.push({
                        row: rowNumber,
                        field: mapping.targetField,
                        value: row[mapping.sourceColumn],
                        error: `Campo obrigatório "${mapping.sourceColumn}" está vazio`,
                    });
                    isValid = false;
                }

                // Validate specific field types
                if (row[mapping.sourceColumn]) {
                    const value = row[mapping.sourceColumn];

                    if (mapping.targetField === 'email' && !this.isValidEmail(value)) {
                        errors.push({
                            row: rowNumber,
                            field: 'email',
                            value,
                            error: 'E-mail inválido',
                        });
                        isValid = false;
                    }

                    if (mapping.targetField === 'cpf' && !this.isValidCPF(value)) {
                        errors.push({
                            row: rowNumber,
                            field: 'cpf',
                            value,
                            error: 'CPF inválido',
                        });
                        isValid = false;
                    }
                }
            });

            // Check duplicates
            const cpfMapping = config.columnMapping.find(m => m.targetField === 'cpf');
            const emailMapping = config.columnMapping.find(m => m.targetField === 'email');

            if (cpfMapping && row[cpfMapping.sourceColumn]) {
                const cpf = this.cleanCPF(row[cpfMapping.sourceColumn]);
                if (seenCPFs.has(cpf)) {
                    duplicates++;
                    errors.push({
                        row: rowNumber,
                        field: 'cpf',
                        value: cpf,
                        error: 'CPF duplicado no arquivo',
                    });
                }
                seenCPFs.add(cpf);
            }

            if (emailMapping && row[emailMapping.sourceColumn]) {
                const email = row[emailMapping.sourceColumn].toLowerCase();
                if (seenEmails.has(email)) {
                    duplicates++;
                    errors.push({
                        row: rowNumber,
                        field: 'email',
                        value: email,
                        error: 'E-mail duplicado no arquivo',
                    });
                }
                seenEmails.add(email);
            }

            if (isValid) validRows++;
        });

        return {
            totalRows: csvData.length,
            validRows,
            invalidRows: csvData.length - validRows,
            duplicates,
            errors,
            sample: csvData.slice(0, 5),
        };
    }

    /**
     * Execute migration
     */
    static async executeMigration(
        csvData: any[],
        config: MigrationConfig,
        existingClients: Client[]
    ): Promise<MigrationResult> {
        const result: MigrationResult = {
            id: `migration_${Date.now()}`,
            configId: config.id,
            startedAt: new Date().toISOString(),
            completedAt: '',
            status: 'success',
            totalProcessed: 0,
            successCount: 0,
            errorCount: 0,
            skippedCount: 0,
            errors: [],
            importedClientIds: [],
        };

        const importedClients: Client[] = [];

        for (let i = 0; i < csvData.length; i++) {
            const row = csvData[i];
            const rowNumber = i + 2;

            try {
                // Transform row data to Client object
                const clientData = this.transformRowToClient(row, config);

                // Check for duplicates
                if (config.options.skipDuplicates) {
                    const isDuplicate = existingClients.some(
                        c => c.cpf === clientData.cpf || c.email === clientData.email
                    );

                    if (isDuplicate) {
                        result.skippedCount++;
                        continue;
                    }
                }

                // Add migration tags
                if (config.options.createTags) {
                    clientData.tags = [
                        ...(clientData.tags || []),
                        ...config.tags,
                        ...config.options.defaultTags,
                    ];
                }

                importedClients.push(clientData);
                result.importedClientIds.push(clientData.clientId);
                result.successCount++;
            } catch (error: any) {
                result.errorCount++;
                result.errors.push({
                    row: rowNumber,
                    field: 'general',
                    value: JSON.stringify(row),
                    error: error.message || 'Erro desconhecido',
                });
            }

            result.totalProcessed++;
        }

        result.completedAt = new Date().toISOString();
        result.status = result.errorCount === 0 ? 'success' : result.successCount > 0 ? 'partial' : 'failed';

        return result;
    }

    /**
     * Transform CSV row to Client object
     */
    private static transformRowToClient(row: any, config: MigrationConfig): Client {
        const client: Partial<Client> = {
            clientId: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            tags: [],
        };

        config.columnMapping.forEach(mapping => {
            let value = row[mapping.sourceColumn];

            if (!value) return;

            // Apply transformations
            if (mapping.transform) {
                value = this.applyTransform(value, mapping.transform);
            }

            // Map to client field
            switch (mapping.targetField) {
                case 'name':
                    client.name = value;
                    break;
                case 'cpf':
                    client.cpf = this.cleanCPF(value);
                    break;
                case 'email':
                    client.email = value.toLowerCase();
                    break;
                case 'phone':
                    client.phone = this.formatPhone(value);
                    break;
                case 'birthDate':
                    client.birthDate = value;
                    break;
                case 'gender':
                    client.gender = value;
                    break;
                case 'address':
                    client.address = value;
                    break;
                case 'city':
                    client.city = value;
                    break;
                case 'state':
                    client.state = value;
                    break;
                case 'zipCode':
                    client.zipCode = value;
                    break;
                case 'referralSource':
                    client.referralSource = value;
                    break;
                case 'tags':
                    client.tags = value.split(',').map((t: string) => t.trim());
                    break;
                // Medical fields would go to a separate medicalHistory object
                case 'medicalHistory':
                case 'allergies':
                case 'medications':
                case 'skinType':
                case 'previousTreatments':
                case 'observations':
                    // Store in notes for now, or create a separate medical history structure
                    client.notes = (client.notes || '') + `\n${mapping.targetField}: ${value}`;
                    break;
            }
        });

        // Add migration metadata
        client.notes = (client.notes || '') + `\n\n[Migrado de ${config.sourceSystem || 'sistema anterior'} em ${new Date().toLocaleDateString()}]`;

        return client as Client;
    }

    /**
     * Apply transformation to value
     */
    private static applyTransform(value: string, transform: string): string {
        switch (transform) {
            case 'uppercase':
                return value.toUpperCase();
            case 'lowercase':
                return value.toLowerCase();
            case 'phone_format':
                return this.formatPhone(value);
            case 'cpf_format':
                return this.cleanCPF(value);
            case 'date_format':
                return this.formatDate(value);
            default:
                return value;
        }
    }

    /**
     * Validate email
     */
    private static isValidEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate CPF
     */
    private static isValidCPF(cpf: string): boolean {
        const cleaned = cpf.replace(/\D/g, '');
        if (cleaned.length !== 11) return false;

        // Basic validation (not checking digits)
        if (/^(\d)\1{10}$/.test(cleaned)) return false;

        return true;
    }

    /**
     * Clean CPF (remove formatting)
     */
    private static cleanCPF(cpf: string): string {
        return cpf.replace(/\D/g, '');
    }

    /**
     * Format phone number
     */
    private static formatPhone(phone: string): string {
        const cleaned = phone.replace(/\D/g, '');

        if (cleaned.length === 11) {
            return `(${cleaned.substr(0, 2)}) ${cleaned.substr(2, 5)}-${cleaned.substr(7)}`;
        } else if (cleaned.length === 10) {
            return `(${cleaned.substr(0, 2)}) ${cleaned.substr(2, 4)}-${cleaned.substr(6)}`;
        }

        return phone;
    }

    /**
     * Format date
     */
    private static formatDate(date: string): string {
        // Try to parse common date formats
        // DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, etc.
        // For now, return as is
        return date;
    }

    /**
     * Generate migration report
     */
    static generateReport(result: MigrationResult): string {
        return `
=== RELATÓRIO DE MIGRAÇÃO ===

Data: ${new Date(result.completedAt).toLocaleString('pt-BR')}
Status: ${result.status === 'success' ? '✅ Sucesso' : result.status === 'partial' ? '⚠️ Parcial' : '❌ Falha'}

RESUMO:
- Total processado: ${result.totalProcessed}
- Importados com sucesso: ${result.successCount}
- Erros: ${result.errorCount}
- Ignorados (duplicados): ${result.skippedCount}

${result.errors.length > 0 ? `
ERROS ENCONTRADOS:
${result.errors.map(e => `Linha ${e.row}: ${e.error} (${e.field}: ${e.value})`).join('\n')}
` : ''}

IDs dos clientes importados:
${result.importedClientIds.join(', ')}
        `.trim();
    }
}
