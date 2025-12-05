import React, { useState } from 'react';
import { Database, Upload, FileSpreadsheet, Download } from 'lucide-react';
import MigrationWizard from '../modals/MigrationWizard';
import { TokenService } from '../../services/documentServices';

const MigrationModule: React.FC = () => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0">
                <h2 className="text-xl font-serif font-bold text-diva-dark mb-2">Migração de Dados</h2>
                <p className="text-sm text-gray-500">
                    Importe pacientes de sistemas anteriores ou planilhas com validação completa e mapeamento inteligente.
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-y-auto">
                <div className="min-h-full flex flex-col items-center justify-center p-12 bg-gradient-to-br from-diva-primary/5 to-diva-light/10">
                    {/* Main Action Card */}
                    <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="w-24 h-24 bg-diva-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Database size={48} className="text-diva-primary" />
                        </div>

                        <h3 className="text-3xl font-bold text-diva-dark mb-4">
                            Assistente de Migração Inteligente
                        </h3>

                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Importe dados de pacientes de forma rápida e segura. O sistema valida automaticamente
                            CPF, email, telefone e detecta duplicados antes de importar.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div
                                onClick={() => setIsWizardOpen(true)}
                                className="bg-blue-50 p-6 rounded-xl text-left cursor-pointer hover:bg-blue-100 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                                    <Upload className="text-blue-600" size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">Importação Flexível</h4>
                                <p className="text-sm text-gray-600">
                                    Escolha entre importar apenas dados básicos ou histórico médico completo
                                </p>
                            </div>

                            <div
                                onClick={() => setIsWizardOpen(true)}
                                className="bg-green-50 p-6 rounded-xl text-left cursor-pointer hover:bg-green-100 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                                    <FileSpreadsheet className="text-green-600" size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">Templates Pré-configurados</h4>
                                <p className="text-sm text-gray-600">
                                    Use templates prontos para ClinicWare, Prontuário Online ou Excel
                                </p>
                            </div>

                            <div
                                onClick={() => setIsWizardOpen(true)}
                                className="bg-purple-50 p-6 rounded-xl text-left cursor-pointer hover:bg-purple-100 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                                    <Database className="text-purple-600" size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">Sistema de Tags</h4>
                                <p className="text-sm text-gray-600">
                                    Marque pacientes migrados com tags personalizadas para fácil identificação
                                </p>
                            </div>

                            <div
                                onClick={() => setIsWizardOpen(true)}
                                className="bg-orange-50 p-6 rounded-xl text-left cursor-pointer hover:bg-orange-100 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                                    <Download className="text-orange-600" size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">Relatório Detalhado</h4>
                                <p className="text-sm text-gray-600">
                                    Receba relatório completo com sucessos, erros e duplicados detectados
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => setIsWizardOpen(true)}
                            className="px-10 py-4 bg-diva-primary text-white rounded-xl font-bold text-lg hover:bg-diva-dark shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            Iniciar Nova Migração
                        </button>

                        {/* Help Text */}
                        <p className="text-xs text-gray-500 mt-6">
                            Precisa de ajuda? Consulte o{' '}
                            <a href="#" className="text-diva-primary font-medium hover:underline">
                                Guia de Migração
                            </a>
                            {' '}ou baixe nosso{' '}
                            <a href="#" className="text-diva-primary font-medium hover:underline">
                                CSV de Exemplo
                            </a>
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-12 grid grid-cols-3 gap-6 max-w-3xl w-full">
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-diva-primary">0</p>
                            <p className="text-xs text-gray-600">Migrações Realizadas</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-green-600">0</p>
                            <p className="text-xs text-gray-600">Pacientes Importados</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-blue-600">98%</p>
                            <p className="text-xs text-gray-600">Taxa de Sucesso</p>
                        </div>
                    </div>

                    {/* Test Link Generator (Temporary) */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                // Gerar token válido
                                const token = TokenService.generateToken('cliente-teste-1', ['d1', 'd2']);
                                const url = `${window.location.origin}/#/portal/${token.token}`;
                                prompt('Copie este link para testar o Portal do Paciente:', url);
                            }}
                            className="text-sm text-diva-primary underline hover:text-diva-dark"
                        >
                            Gerar Link de Teste do Portal (Assinatura)
                        </button>
                    </div>
                </div>
            </div>

            {/* Migration Wizard Modal */}
            <MigrationWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
            />
        </div>
    );
};

export default MigrationModule;
