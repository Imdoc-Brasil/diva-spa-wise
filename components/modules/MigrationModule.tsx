
import React, { useState } from 'react';
import { Upload, ArrowRight, FileSpreadsheet, CheckCircle, AlertTriangle, Database, RefreshCw, X, Sparkles } from 'lucide-react';

type ImportStep = 'upload' | 'map' | 'validate' | 'finish';

const mockCsvColumns = ['Nome Completo', 'Email', 'Celular', 'Dt Nascimento', 'Tags'];
const systemFields = [
    { id: 'name', label: 'Nome do Cliente', required: true },
    { id: 'email', label: 'E-mail', required: true },
    { id: 'phone', label: 'Telefone/WhatsApp', required: true },
    { id: 'birthDate', label: 'Data de Nascimento', required: false },
    { id: 'tags', label: 'Etiquetas (Tags)', required: false },
    { id: 'notes', label: 'Observações', required: false },
];

const MigrationModule: React.FC = () => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });

  const handleFileDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if(e.dataTransfer.files && e.dataTransfer.files[0]) {
          setFile(e.dataTransfer.files[0]);
          setStep('map');
      }
  };

  const handleAutoMap = () => {
      // Mock automapping logic
      const newMap: Record<string, string> = {};
      mockCsvColumns.forEach(col => {
          if (col.includes('Nome')) newMap[col] = 'name';
          if (col.includes('Email')) newMap[col] = 'email';
          if (col.includes('Celular')) newMap[col] = 'phone';
          if (col.includes('Nascimento')) newMap[col] = 'birthDate';
          if (col.includes('Tags')) newMap[col] = 'tags';
      });
      setMapping(newMap);
  };

  const handleImport = () => {
      setStep('validate');
      // Simulate processing
      let p = 0;
      const interval = setInterval(() => {
          p += 5;
          setProgress(p);
          if (p >= 100) {
              clearInterval(interval);
              setStats({ total: 1450, valid: 1420, invalid: 30 });
              setStep('finish');
          }
      }, 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-serif font-bold text-diva-dark">Assistente de Migração</h2>
                <p className="text-sm text-gray-500">Importe dados de sistemas antigos ou planilhas.</p>
            </div>
            <div className="flex items-center space-x-2">
                {['Upload', 'Mapeamento', 'Processamento', 'Conclusão'].map((label, idx) => {
                    const currentIdx = ['upload', 'map', 'validate', 'finish'].indexOf(step);
                    return (
                        <div key={idx} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                                ${idx <= currentIdx ? 'bg-diva-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {idx + 1}
                            </div>
                            {idx < 3 && <div className={`w-8 h-1 mx-1 ${idx < currentIdx ? 'bg-diva-primary' : 'bg-gray-100'}`}></div>}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
            
            {/* STEP 1: UPLOAD */}
            {step === 'upload' && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50">
                    <div 
                        className="w-full max-w-2xl border-4 border-dashed border-gray-300 rounded-2xl p-16 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-diva-primary hover:bg-diva-primary/5 transition-all group"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        onClick={() => {
                            // Mock file input trigger
                            const fakeFile = new File(["content"], "clientes_antigos.csv", { type: "text/csv" });
                            setFile(fakeFile);
                            setStep('map');
                        }}
                    >
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Upload size={48} className="text-diva-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-diva-dark mb-2">Arraste sua planilha aqui</h3>
                        <p className="text-gray-500 mb-8">Suporta arquivos .CSV, .XLSX e .XML</p>
                        <button className="bg-diva-primary text-white px-8 py-3 rounded-xl font-bold shadow-md group-hover:shadow-lg transition-all">
                            Selecionar Arquivo
                        </button>
                    </div>
                    <div className="mt-8 flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center"><FileSpreadsheet size={16} className="mr-1"/> Modelo de Clientes</span>
                        <span className="flex items-center"><FileSpreadsheet size={16} className="mr-1"/> Modelo de Produtos</span>
                        <span className="flex items-center"><FileSpreadsheet size={16} className="mr-1"/> Modelo de Agendamentos</span>
                    </div>
                </div>
            )}

            {/* STEP 2: MAPPING */}
            {step === 'map' && (
                <div className="flex-1 flex flex-col p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-diva-dark">Mapeamento de Colunas</h3>
                            <p className="text-sm text-gray-500">Arquivo: <strong>{file?.name}</strong> (1.450 linhas encontradas)</p>
                        </div>
                        <button onClick={handleAutoMap} className="text-sm font-bold text-diva-primary flex items-center hover:underline">
                            <Sparkles className="mr-1" size={16} /> Tentar Mapeamento Automático
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto border border-gray-200 rounded-xl">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4 w-1/3">Coluna no Arquivo (Origem)</th>
                                    <th className="px-6 py-4 w-10 text-center"></th>
                                    <th className="px-6 py-4 w-1/3">Campo no Sistema (Destino)</th>
                                    <th className="px-6 py-4">Exemplo de Dados</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {mockCsvColumns.map((col, idx) => (
                                    <tr key={col} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-700 flex items-center">
                                            <Database size={16} className="mr-2 text-gray-400" /> {col}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <ArrowRight size={16} className="text-gray-400 mx-auto" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <select 
                                                className={`w-full p-2 border rounded-lg text-sm outline-none focus:border-diva-primary ${mapping[col] ? 'border-green-300 bg-green-50 text-green-800 font-bold' : 'border-gray-300'}`}
                                                value={mapping[col] || ''}
                                                onChange={(e) => setMapping({...mapping, [col]: e.target.value})}
                                            >
                                                <option value="">-- Ignorar Coluna --</option>
                                                {systemFields.map(field => (
                                                    <option key={field.id} value={field.id}>{field.label} {field.required ? '*' : ''}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 italic">
                                            {idx === 0 ? 'Ana Maria Silva' : idx === 1 ? 'ana@email.com' : idx === 2 ? '(11) 99999-9999' : '...'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setStep('upload')} className="px-6 py-3 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50">
                            Voltar
                        </button>
                        <button 
                            onClick={handleImport}
                            disabled={Object.keys(mapping).length === 0}
                            className="px-8 py-3 bg-diva-primary text-white font-bold rounded-xl hover:bg-diva-dark shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Iniciar Importação
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: VALIDATE / PROCESS */}
            {step === 'validate' && (
                <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <div className="w-full max-w-lg text-center">
                        <div className="mb-8 relative h-48 w-48 mx-auto">
                             <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                <circle 
                                    cx="50" cy="50" r="45" fill="none" stroke="#14808C" strokeWidth="8" 
                                    strokeDasharray="283" 
                                    strokeDashoffset={283 - (283 * progress) / 100}
                                    className="transition-all duration-300 ease-out"
                                />
                             </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                 <span className="text-4xl font-bold text-diva-dark">{progress}%</span>
                                 <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Processando</span>
                             </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-diva-dark mb-2">Validando dados...</h3>
                        <p className="text-gray-500">Estamos verificando duplicidades e formatos inválidos. Isso pode levar alguns segundos.</p>
                        
                        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100 text-left space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Lendo linhas...</span>
                                <span className="text-green-600 font-bold">OK</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Verificando emails duplicados...</span>
                                {progress > 30 && <span className="text-green-600 font-bold">OK</span>}
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Formatando telefones...</span>
                                {progress > 60 && <span className="text-green-600 font-bold">OK</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: FINISH */}
            {step === 'finish' && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 bg-green-50/30 animate-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-xl">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-diva-dark mb-2">Importação Concluída!</h2>
                    <p className="text-gray-600 mb-10">Sua base de dados foi atualizada com sucesso.</p>

                    <div className="grid grid-cols-3 gap-6 w-full max-w-3xl mb-10">
                        <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase">Total Processado</p>
                            <p className="text-3xl font-bold text-diva-dark">{stats.total}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase">Registros Válidos</p>
                            <p className="text-3xl font-bold text-green-600">{stats.valid}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm text-center relative overflow-hidden">
                            <p className="text-xs font-bold text-gray-400 uppercase">Erros / Ignorados</p>
                            <p className="text-3xl font-bold text-red-500">{stats.invalid}</p>
                            {stats.invalid > 0 && (
                                <button className="absolute bottom-2 left-0 w-full text-[10px] text-red-600 underline hover:text-red-800">
                                    Baixar Relatório de Erros
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setStep('upload')} className="px-6 py-3 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-white">
                            Nova Importação
                        </button>
                        <button className="px-8 py-3 bg-diva-primary text-white font-bold rounded-xl hover:bg-diva-dark shadow-lg">
                            Ir para Clientes (CRM)
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default MigrationModule;
