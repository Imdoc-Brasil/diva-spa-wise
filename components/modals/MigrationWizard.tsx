import React, { useState } from 'react';
import { X, Upload, ArrowRight, ArrowLeft, Check, AlertCircle, FileText, Settings, Play, Download } from 'lucide-react';
import { MigrationConfig, MigrationPreview, MigrationResult, AVAILABLE_FIELDS, MAPPING_TEMPLATES } from '../../types/migration';
import { MigrationService } from '../../services/migrationService';
import { useData } from '../context/DataContext';

interface MigrationWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const MigrationWizard: React.FC<MigrationWizardProps> = ({ isOpen, onClose }) => {
    const { clients, addClient } = useData();
    const [step, setStep] = useState(1);
    const [csvFile, setCSVFile] = useState<File | null>(null);
    const [csvData, setCSVData] = useState<any[]>([]);
    const [csvHeaders, setCSVHeaders] = useState<string[]>([]);

    const [config, setConfig] = useState<MigrationConfig>({
        id: `config_${Date.now()}`,
        name: 'Nova Migração',
        createdAt: new Date().toISOString(),
        sourceSystem: '',
        importType: 'basic',
        tags: [],
        columnMapping: [],
        options: {
            importBasicData: true,
            importMedicalHistory: false,
            importAppointments: false,
            importTreatments: false,
            importPhotos: false,
            importDocuments: false,
            skipDuplicates: true,
            updateExisting: false,
            createTags: true,
            defaultTags: ['Migrado'],
        },
    });

    const [preview, setPreview] = useState<MigrationPreview | null>(null);
    const [result, setResult] = useState<MigrationResult | null>(null);
    const [newTag, setNewTag] = useState('');

    if (!isOpen) return null;

    // Step 1: Upload CSV
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCSVFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            const parsed = MigrationService.parseCSV(content);

            if (parsed.length > 0) {
                setCSVData(parsed);
                setCSVHeaders(Object.keys(parsed[0]));
            }
        };
        reader.readAsText(file);
    };

    const handleTemplateSelect = (templateKey: string) => {
        const template = MAPPING_TEMPLATES[templateKey as keyof typeof MAPPING_TEMPLATES];
        if (template) {
            setConfig(prev => ({
                ...prev,
                sourceSystem: template.name,
                columnMapping: template.mapping,
            }));
        }
    };

    // Step 2: Configure Mapping
    const handleAddMapping = (sourceColumn: string, targetField: string) => {
        const field = [...AVAILABLE_FIELDS.basic, ...AVAILABLE_FIELDS.medical, ...AVAILABLE_FIELDS.metadata]
            .find(f => f.id === targetField);

        if (!field) return;

        setConfig(prev => ({
            ...prev,
            columnMapping: [
                ...prev.columnMapping.filter(m => m.targetField !== targetField),
                {
                    sourceColumn,
                    targetField,
                    required: field.required,
                },
            ],
        }));
    };

    const handleRemoveMapping = (targetField: string) => {
        setConfig(prev => ({
            ...prev,
            columnMapping: prev.columnMapping.filter(m => m.targetField !== targetField),
        }));
    };

    // Step 3: Preview and Execute
    const handleGeneratePreview = () => {
        const previewData = MigrationService.previewMigration(csvData, config);
        setPreview(previewData);
    };

    const handleExecuteMigration = async () => {
        const migrationResult = await MigrationService.executeMigration(csvData, config, clients);
        setResult(migrationResult);

        // Add imported clients to context
        // In real implementation, this would be done in the service
        setStep(4);
    };

    const handleAddTag = () => {
        if (newTag.trim() && !config.tags.includes(newTag.trim())) {
            setConfig(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }));
            setNewTag('');
        }
    };

    const handleDownloadReport = () => {
        if (!result) return;

        const report = MigrationService.generateReport(result);
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio_migracao_${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-diva-dark">Assistente de Migração</h2>
                        <p className="text-sm text-gray-500">
                            Etapa {step} de 4: {
                                step === 1 ? 'Upload do Arquivo' :
                                    step === 2 ? 'Mapeamento de Colunas' :
                                        step === 3 ? 'Configurações e Preview' :
                                            'Resultado da Migração'
                            }
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className="flex items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${s < step ? 'bg-green-500 text-white' :
                                    s === step ? 'bg-diva-primary text-white' :
                                        'bg-gray-200 text-gray-500'
                                    }`}>
                                    {s < step ? <Check size={20} /> : s}
                                </div>
                                {s < 4 && (
                                    <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Upload */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Upload do Arquivo CSV</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Faça upload de um arquivo CSV contendo os dados dos pacientes.
                                </p>

                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-diva-primary transition-colors">
                                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="csv-upload"
                                    />
                                    <label
                                        htmlFor="csv-upload"
                                        className="cursor-pointer inline-block px-6 py-3 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors"
                                    >
                                        Selecionar Arquivo CSV
                                    </label>
                                    {csvFile && (
                                        <p className="mt-4 text-sm text-green-600 font-medium">
                                            ✓ {csvFile.name} ({csvData.length} linhas)
                                        </p>
                                    )}
                                </div>
                            </div>

                            {csvData.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">Usar Template Pré-configurado</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {Object.entries(MAPPING_TEMPLATES).map(([key, template]) => (
                                            <button
                                                key={key}
                                                onClick={() => handleTemplateSelect(key)}
                                                className="p-4 border border-gray-300 rounded-lg hover:border-diva-primary hover:bg-diva-primary/5 transition-colors text-left"
                                            >
                                                <FileText size={20} className="text-diva-primary mb-2" />
                                                <p className="font-medium text-sm">{template.name}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Mapping */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Mapeamento de Colunas</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Mapeie as colunas do seu arquivo para os campos do sistema.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Basic Fields */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Dados Básicos</h4>
                                    <div className="space-y-2">
                                        {AVAILABLE_FIELDS.basic.map(field => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                <label className="text-sm text-gray-700 w-40">
                                                    {field.label}
                                                    {field.required && <span className="text-red-500">*</span>}
                                                </label>
                                                <select
                                                    value={config.columnMapping.find(m => m.targetField === field.id)?.sourceColumn || ''}
                                                    onChange={(e) => handleAddMapping(e.target.value, field.id)}
                                                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                                >
                                                    <option value="">Não mapear</option>
                                                    {csvHeaders.map(header => (
                                                        <option key={header} value={header}>{header}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Medical Fields */}
                                {config.importType === 'complete' && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">Dados Clínicos</h4>
                                        <div className="space-y-2">
                                            {AVAILABLE_FIELDS.medical.map(field => (
                                                <div key={field.id} className="flex items-center gap-2">
                                                    <label className="text-sm text-gray-700 w-40">{field.label}</label>
                                                    <select
                                                        value={config.columnMapping.find(m => m.targetField === field.id)?.sourceColumn || ''}
                                                        onChange={(e) => handleAddMapping(e.target.value, field.id)}
                                                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                                    >
                                                        <option value="">Não mapear</option>
                                                        {csvHeaders.map(header => (
                                                            <option key={header} value={header}>{header}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Configuration & Preview */}
                    {step === 3 && (
                        <div className="space-y-6">
                            {/* Configuration */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Configurações</h3>

                                {/* Import Type */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Importação</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setConfig(prev => ({ ...prev, importType: 'basic' }))}
                                            className={`p-4 border-2 rounded-lg text-left transition-colors ${config.importType === 'basic'
                                                ? 'border-diva-primary bg-diva-primary/5'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <p className="font-bold text-sm mb-1">Dados Básicos</p>
                                            <p className="text-xs text-gray-600">Nome, CPF, Email, Telefone, Endereço</p>
                                        </button>
                                        <button
                                            onClick={() => setConfig(prev => ({ ...prev, importType: 'complete' }))}
                                            className={`p-4 border-2 rounded-lg text-left transition-colors ${config.importType === 'complete'
                                                ? 'border-diva-primary bg-diva-primary/5'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <p className="font-bold text-sm mb-1">Histórico Completo</p>
                                            <p className="text-xs text-gray-600">Inclui histórico médico e tratamentos</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Tags/Etiquetas para Pacientes Migrados
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                            placeholder="Digite uma tag..."
                                            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <button
                                            onClick={handleAddTag}
                                            className="px-4 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {config.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-diva-primary/10 text-diva-primary rounded-full text-sm font-medium flex items-center gap-2"
                                            >
                                                {tag}
                                                <button
                                                    onClick={() => setConfig(prev => ({
                                                        ...prev,
                                                        tags: prev.tags.filter(t => t !== tag),
                                                    }))}
                                                    className="hover:text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={config.options.skipDuplicates}
                                            onChange={(e) => setConfig(prev => ({
                                                ...prev,
                                                options: { ...prev.options, skipDuplicates: e.target.checked },
                                            }))}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-gray-700">Ignorar pacientes duplicados (por CPF/Email)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Preview */}
                            {preview && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Preview da Migração</h3>
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-600">{preview.totalRows}</p>
                                            <p className="text-xs text-gray-600">Total de Linhas</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">{preview.validRows}</p>
                                            <p className="text-xs text-gray-600">Válidas</p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <p className="text-2xl font-bold text-red-600">{preview.invalidRows}</p>
                                            <p className="text-xs text-gray-600">Com Erros</p>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <p className="text-2xl font-bold text-orange-600">{preview.duplicates}</p>
                                            <p className="text-xs text-gray-600">Duplicados</p>
                                        </div>
                                    </div>

                                    {preview.errors.length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                                            <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                                                <AlertCircle size={16} />
                                                Erros Encontrados
                                            </h4>
                                            <div className="space-y-1">
                                                {preview.errors.slice(0, 10).map((error, idx) => (
                                                    <p key={idx} className="text-xs text-red-600">
                                                        Linha {error.row}: {error.error}
                                                    </p>
                                                ))}
                                                {preview.errors.length > 10 && (
                                                    <p className="text-xs text-red-600 font-medium">
                                                        ... e mais {preview.errors.length - 10} erros
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!preview && (
                                <button
                                    onClick={handleGeneratePreview}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Settings size={20} />
                                    Gerar Preview
                                </button>
                            )}
                        </div>
                    )}

                    {/* Step 4: Result */}
                    {step === 4 && result && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${result.status === 'success' ? 'bg-green-100' :
                                    result.status === 'partial' ? 'bg-orange-100' :
                                        'bg-red-100'
                                    }`}>
                                    {result.status === 'success' ? (
                                        <Check className="text-green-600" size={40} />
                                    ) : (
                                        <AlertCircle className={result.status === 'partial' ? 'text-orange-600' : 'text-red-600'} size={40} />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {result.status === 'success' ? 'Migração Concluída!' :
                                        result.status === 'partial' ? 'Migração Parcial' :
                                            'Migração com Erros'}
                                </h3>
                                <p className="text-gray-600">
                                    {result.successCount} de {result.totalProcessed} pacientes importados com sucesso
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <p className="text-3xl font-bold text-green-600">{result.successCount}</p>
                                    <p className="text-sm text-gray-600">Sucesso</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg text-center">
                                    <p className="text-3xl font-bold text-red-600">{result.errorCount}</p>
                                    <p className="text-sm text-gray-600">Erros</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <p className="text-3xl font-bold text-gray-600">{result.skippedCount}</p>
                                    <p className="text-sm text-gray-600">Ignorados</p>
                                </div>
                            </div>

                            <button
                                onClick={handleDownloadReport}
                                className="w-full py-3 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                Baixar Relatório Completo
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={() => step > 1 && setStep(step - 1)}
                        disabled={step === 1 || step === 4}
                        className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Voltar
                    </button>

                    {step < 3 && (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={step === 1 && csvData.length === 0}
                            className="px-6 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Próximo
                            <ArrowRight size={16} />
                        </button>
                    )}

                    {step === 3 && preview && (
                        <button
                            onClick={handleExecuteMigration}
                            disabled={preview.validRows === 0}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Play size={16} />
                            Iniciar Migração
                        </button>
                    )}

                    {step === 4 && (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors"
                        >
                            Concluir
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MigrationWizard;
