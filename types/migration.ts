// Tipos para o sistema de migração

export interface MigrationConfig {
    id: string;
    name: string;
    createdAt: string;
    sourceSystem?: string; // Ex: "Sistema Anterior", "Planilha Excel"
    importType: 'basic' | 'complete';
    tags: string[]; // Tags para marcar clientes migrados
    columnMapping: ColumnMapping[];
    options: MigrationOptions;
}

export interface ColumnMapping {
    sourceColumn: string; // Nome da coluna no arquivo CSV
    targetField: string; // Campo no sistema (ex: 'name', 'email', 'phone')
    required: boolean;
    transform?: 'uppercase' | 'lowercase' | 'phone_format' | 'date_format' | 'cpf_format';
}

export interface MigrationOptions {
    // Dados Básicos (sempre importados)
    importBasicData: boolean; // Nome, CPF, Email, Telefone, Endereço

    // Dados Clínicos (opcional)
    importMedicalHistory: boolean; // Histórico médico
    importAppointments: boolean; // Agendamentos anteriores
    importTreatments: boolean; // Tratamentos realizados
    importPhotos: boolean; // Fotos antes/depois
    importDocuments: boolean; // Documentos assinados

    // Configurações
    skipDuplicates: boolean; // Pular clientes duplicados (por CPF/Email)
    updateExisting: boolean; // Atualizar clientes existentes
    createTags: boolean; // Criar tags automaticamente
    defaultTags: string[]; // Tags padrão para todos os importados
    assignToUnit?: string; // Unidade padrão
}

export interface MigrationPreview {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    duplicates: number;
    errors: MigrationError[];
    sample: any[]; // Primeiras 5 linhas como preview
}

export interface MigrationError {
    row: number;
    field: string;
    value: any;
    error: string;
}

export interface MigrationResult {
    id: string;
    configId: string;
    startedAt: string;
    completedAt: string;
    status: 'success' | 'partial' | 'failed';
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    skippedCount: number;
    errors: MigrationError[];
    importedClientIds: string[];
}

// Campos disponíveis para mapeamento
export const AVAILABLE_FIELDS = {
    // Dados Básicos
    basic: [
        { id: 'name', label: 'Nome Completo', required: true, type: 'text' },
        { id: 'cpf', label: 'CPF', required: false, type: 'cpf' },
        { id: 'email', label: 'E-mail', required: false, type: 'email' },
        { id: 'phone', label: 'Telefone/WhatsApp', required: true, type: 'phone' },
        { id: 'birthDate', label: 'Data de Nascimento', required: false, type: 'date' },
        { id: 'gender', label: 'Gênero', required: false, type: 'select' },
        { id: 'address', label: 'Endereço', required: false, type: 'text' },
        { id: 'city', label: 'Cidade', required: false, type: 'text' },
        { id: 'state', label: 'Estado', required: false, type: 'text' },
        { id: 'zipCode', label: 'CEP', required: false, type: 'text' },
        { id: 'referralSource', label: 'Como Conheceu', required: false, type: 'text' },
    ],

    // Dados Clínicos
    medical: [
        { id: 'medicalHistory', label: 'Histórico Médico', required: false, type: 'textarea' },
        { id: 'allergies', label: 'Alergias', required: false, type: 'textarea' },
        { id: 'medications', label: 'Medicamentos em Uso', required: false, type: 'textarea' },
        { id: 'skinType', label: 'Tipo de Pele', required: false, type: 'select' },
        { id: 'previousTreatments', label: 'Tratamentos Anteriores', required: false, type: 'textarea' },
        { id: 'observations', label: 'Observações Gerais', required: false, type: 'textarea' },
    ],

    // Metadados
    metadata: [
        { id: 'tags', label: 'Tags/Etiquetas', required: false, type: 'tags' },
        { id: 'notes', label: 'Notas de Migração', required: false, type: 'textarea' },
        { id: 'originalId', label: 'ID no Sistema Anterior', required: false, type: 'text' },
    ],
};

// Templates de mapeamento pré-configurados
export const MAPPING_TEMPLATES: Record<string, { name: string; mapping: ColumnMapping[] }> = {
    'clinicware': {
        name: 'ClinicWare',
        mapping: [
            { sourceColumn: 'nome_completo', targetField: 'name', required: true },
            { sourceColumn: 'cpf', targetField: 'cpf', required: false, transform: 'cpf_format' as const },
            { sourceColumn: 'email', targetField: 'email', required: false },
            { sourceColumn: 'telefone', targetField: 'phone', required: true, transform: 'phone_format' as const },
            { sourceColumn: 'data_nascimento', targetField: 'birthDate', required: false, transform: 'date_format' as const },
            { sourceColumn: 'endereco', targetField: 'address', required: false },
            { sourceColumn: 'historico_medico', targetField: 'medicalHistory', required: false },
        ],
    },
    'prontuario_online': {
        name: 'Prontuário Online',
        mapping: [
            { sourceColumn: 'Nome', targetField: 'name', required: true },
            { sourceColumn: 'CPF', targetField: 'cpf', required: false, transform: 'cpf_format' as const },
            { sourceColumn: 'Email', targetField: 'email', required: false },
            { sourceColumn: 'Celular', targetField: 'phone', required: true, transform: 'phone_format' as const },
            { sourceColumn: 'Nascimento', targetField: 'birthDate', required: false, transform: 'date_format' as const },
        ],
    },
    'excel_generic': {
        name: 'Planilha Excel Genérica',
        mapping: [
            { sourceColumn: 'Nome', targetField: 'name', required: true },
            { sourceColumn: 'Telefone', targetField: 'phone', required: true, transform: 'phone_format' as const },
        ],
    },
};

