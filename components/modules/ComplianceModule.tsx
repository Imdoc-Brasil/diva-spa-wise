
import React, { useState } from 'react';
import { ClinicLicense, WasteLog, StaffHealthRecord } from '../../types';
import { ShieldCheck, FileText, Trash2, UserCheck, AlertTriangle, Calendar, Plus, Upload, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import NewLicenseModal from '../modals/NewLicenseModal';
import NewWasteLogModal from '../modals/NewWasteLogModal';
import NewHealthRecordModal from '../modals/NewHealthRecordModal';

const mockLicenses: ClinicLicense[] = [
    { id: 'l1', name: 'Alvará de Funcionamento', issuer: 'Prefeitura Municipal', expiryDate: '2024-05-10', status: 'valid' },
    { id: 'l2', name: 'Licença Sanitária (CMVS)', issuer: 'Vigilância Sanitária', expiryDate: '2023-11-15', status: 'warning' },
    { id: 'l3', name: 'AVCB (Bombeiros)', issuer: 'Corpo de Bombeiros', expiryDate: '2025-01-20', status: 'valid' },
    { id: 'l4', name: 'Responsabilidade Técnica (CRT)', issuer: 'Conselho Regional (Biomed)', expiryDate: '2023-10-01', status: 'expired' },
];

const mockWaste: WasteLog[] = [
    { id: 'w1', date: '2023-10-25', type: 'infectious', weight: 4.5, collectedBy: 'EcoHealth Co.', manifestId: 'M-9988', staffSignature: 'Mariana' },
    { id: 'w2', date: '2023-10-20', type: 'sharps', weight: 1.2, collectedBy: 'EcoHealth Co.', manifestId: 'M-9970', staffSignature: 'Julia' },
    { id: 'w3', date: '2023-10-15', type: 'infectious', weight: 3.8, collectedBy: 'EcoHealth Co.', manifestId: 'M-9955', staffSignature: 'Mariana' },
];

const mockHealth: StaffHealthRecord[] = [
    { staffId: 's1', staffName: 'Dra. Julia Martins', asoExpiry: '2024-02-10', vaccines: [{name: 'Hepatite B', valid: true}, {name: 'Tétano', valid: true}], status: 'compliant' },
    { staffId: 's2', staffName: 'Carla Dias', asoExpiry: '2023-11-01', vaccines: [{name: 'Hepatite B', valid: true}, {name: 'Tétano', valid: false}], status: 'non_compliant' },
];

const wasteChartData = [
    { month: 'Jul', weight: 12 },
    { month: 'Ago', weight: 15 },
    { month: 'Set', weight: 11 },
    { month: 'Out', weight: 18 },
];

const ComplianceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'licenses' | 'waste' | 'health'>('licenses');
  
  // Local State for interactivity
  const [licenses, setLicenses] = useState<ClinicLicense[]>(mockLicenses);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>(mockWaste);
  const [healthRecords, setHealthRecords] = useState<StaffHealthRecord[]>(mockHealth);

  // Modals State
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'valid': return 'bg-green-100 text-green-700 border-green-200';
          case 'compliant': return 'bg-green-100 text-green-700 border-green-200';
          case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'expired': return 'bg-red-100 text-red-700 border-red-200';
          case 'non_compliant': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100';
      }
  };

  const getDaysRemaining = (dateStr: string) => {
      const diff = new Date(dateStr).getTime() - new Date().getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Handlers
  const handleAddLicense = (newLicense: ClinicLicense) => {
      setLicenses([newLicense, ...licenses]);
  };

  const handleRenewLicense = (id: string) => {
      if(confirm("Simular renovação desta licença para +1 ano?")) {
          setLicenses(licenses.map(l => {
              if (l.id === id) {
                  const newDate = new Date();
                  newDate.setFullYear(newDate.getFullYear() + 1);
                  return { ...l, expiryDate: newDate.toISOString().split('T')[0], status: 'valid' };
              }
              return l;
          }));
      }
  };

  const handleAddWasteLog = (newLog: WasteLog) => {
      setWasteLogs([newLog, ...wasteLogs]);
  };

  const handleUpdateHealth = (record: StaffHealthRecord) => {
      // Check if exists, update or add
      const exists = healthRecords.some(r => r.staffId === record.staffId);
      if (exists) {
          setHealthRecords(healthRecords.map(r => r.staffId === record.staffId ? record : r));
      } else {
          setHealthRecords([...healthRecords, record]);
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-bold text-diva-dark">Diva Compliance</h2>
                    <p className="text-sm text-gray-500">Gestão Regulatória, Sanitária e Legal</p>
                </div>
            </div>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('licenses')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'licenses' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500'}`}
                >
                    <FileText size={16} /> Licenças
                </button>
                <button 
                    onClick={() => setActiveTab('waste')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'waste' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500'}`}
                >
                    <Trash2 size={16} /> Resíduos (PGRSS)
                </button>
                <button 
                    onClick={() => setActiveTab('health')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'health' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500'}`}
                >
                    <UserCheck size={16} /> Saúde Ocupacional
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
            
            {activeTab === 'licenses' && (
                <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-diva-dark">Documentação Obrigatória</h3>
                        <button 
                            onClick={() => setIsLicenseModalOpen(true)}
                            className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark transition-colors"
                        >
                            <Plus size={16} className="mr-2" /> Adicionar Licença
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {licenses.map(lic => {
                            const days = getDaysRemaining(lic.expiryDate);
                            return (
                                <div key={lic.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-2 h-full ${lic.status === 'valid' ? 'bg-green-500' : lic.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                    
                                    <div className="flex justify-between items-start mb-4 pl-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-diva-dark">{lic.name}</h4>
                                            <p className="text-sm text-gray-500">{lic.issuer}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(lic.status)}`}>
                                            {lic.status === 'valid' ? 'Vigente' : lic.status === 'warning' ? 'A Vencer' : 'Vencido'}
                                        </span>
                                    </div>

                                    <div className="pl-4 flex items-center gap-6 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={16} className="text-diva-primary" />
                                            Vence em: <strong>{new Date(lic.expiryDate).toLocaleDateString()}</strong>
                                        </div>
                                        {days < 0 ? (
                                            <span className="text-xs font-bold text-red-600 flex items-center"><AlertCircle size={14} className="mr-1"/> Vencido há {Math.abs(days)} dias</span>
                                        ) : (
                                            <span className={`text-xs font-bold ${days < 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                Restam {days} dias
                                            </span>
                                        )}
                                    </div>

                                    <div className="pl-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                                        <button 
                                            onClick={() => handleRenewLicense(lic.id)}
                                            className="text-xs font-bold text-diva-primary border border-diva-primary px-3 py-1.5 rounded hover:bg-diva-light/10"
                                        >
                                            Renovar
                                        </button>
                                        <button className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 flex items-center">
                                            <Download size={14} className="mr-1" /> PDF
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'waste' && (
                <div className="flex h-full">
                    <div className="flex-1 p-6 overflow-y-auto bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-diva-dark">Manifestos de Resíduos (MTR)</h3>
                                <p className="text-xs text-gray-500">Histórico de coletas PGRSS</p>
                            </div>
                            <button 
                                onClick={() => setIsWasteModalOpen(true)}
                                className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark"
                            >
                                <Plus size={16} className="mr-2" /> Registrar Coleta
                            </button>
                        </div>

                        <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Data</th>
                                    <th className="px-6 py-3">Tipo</th>
                                    <th className="px-6 py-3">Peso (Kg)</th>
                                    <th className="px-6 py-3">Coletora</th>
                                    <th className="px-6 py-3">Manifesto ID</th>
                                    <th className="px-6 py-3 text-right">Resp.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {wasteLogs.map(w => (
                                    <tr key={w.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-gray-600">{new Date(w.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${w.type === 'infectious' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {w.type === 'infectious' ? 'Infectante' : 'Perfuro'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 font-mono font-bold text-diva-dark">{w.weight.toFixed(2)}</td>
                                        <td className="px-6 py-3 text-gray-600">{w.collectedBy}</td>
                                        <td className="px-6 py-3 font-mono text-xs text-gray-500">{w.manifestId}</td>
                                        <td className="px-6 py-3 text-right text-gray-600">{w.staffSignature}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-80 bg-gray-50 p-6 border-l border-gray-200 flex flex-col">
                        <h3 className="font-bold text-diva-dark text-sm mb-4">Geração de Resíduos (Kg)</h3>
                        <div className="h-48 bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={wasteChartData}>
                                    <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="weight" fill="#14808C" radius={[4,4,0,0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="bg-blue-100 border border-blue-200 p-4 rounded-xl text-xs text-blue-800">
                            <strong>Dica Ambiental:</strong> Sua geração de infectantes subiu 10% este mês. Verifique a segregação correta nos consultórios.
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'health' && (
                <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-diva-dark">Monitoramento de Saúde da Equipe (PCMSO)</h3>
                        <button 
                            onClick={() => setIsHealthModalOpen(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-green-700 shadow-md"
                        >
                            <Plus size={16} className="mr-2" /> Atualizar Status
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {healthRecords.map(staff => (
                            <div key={staff.staffId} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${staff.status === 'compliant' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {staff.staffName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-diva-dark">{staff.staffName}</h4>
                                        <p className="text-xs text-gray-500 flex items-center">
                                            ASO (Exame Periódico): 
                                            <span className={`ml-1 font-bold ${new Date(staff.asoExpiry) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
                                                Vence em {new Date(staff.asoExpiry).toLocaleDateString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {staff.vaccines.map((vac, idx) => (
                                        <div key={idx} className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border ${vac.valid ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                            {vac.valid ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                            {vac.name}
                                        </div>
                                    ))}
                                </div>

                                <button className="text-xs text-gray-500 underline hover:text-diva-primary">
                                    Ver Prontuário
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>

        <NewLicenseModal 
            isOpen={isLicenseModalOpen}
            onClose={() => setIsLicenseModalOpen(false)}
            onSave={handleAddLicense}
        />

        <NewWasteLogModal 
            isOpen={isWasteModalOpen}
            onClose={() => setIsWasteModalOpen(false)}
            onSave={handleAddWasteLog}
        />

        <NewHealthRecordModal 
            isOpen={isHealthModalOpen}
            onClose={() => setIsHealthModalOpen(false)}
            onSave={handleUpdateHealth}
        />
    </div>
  );
};

export default ComplianceModule;
