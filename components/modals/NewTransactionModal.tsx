
import React, { useState } from 'react';
import { X, Save, DollarSign, ArrowUpCircle, ArrowDownCircle, Calendar, FileText, Tag, User, Repeat, Clock } from 'lucide-react';
import { Transaction, TransactionType, TransactionStatus, RevenueType } from '../../types';
import { useUnitData } from '../hooks/useUnitData';
import { useOrganization } from '../context/OrganizationContext';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, selectedUnitId, suppliers, accounts } = useUnitData();
  const { organization } = useOrganization();
  const [type, setType] = useState<TransactionType>('expense');
  const [uploading, setUploading] = useState(false);

  const getLocalDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Outros',
    date: getLocalDate(), // Competence Date
    status: 'paid' as TransactionStatus,
    revenueType: 'service' as RevenueType,
    // Expense Extras
    supplierId: '',
    sourceAccountId: '', // Bank Account
    dueDate: getLocalDate(), // Settlement/Due Date
    // Recurrence
    isRecurring: false,
    recurrenceRule: 'monthly',
    recurrenceCount: 2
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate OCR Processing
    setTimeout(() => {
      // Mock extracted data
      setFormData(prev => ({
        ...prev,
        amount: (Math.random() * 500).toFixed(2),
        date: new Date().toISOString().split('T')[0],
        description: `Compra (Upload): ${file.name.substring(0, 10)}...`,
        category: 'Material'
      }));
      setType('expense'); // Usually uploads are expenses
      setUploading(false);
      alert("Arquivo analisado com sucesso! Os dados foram preenchidos automáticamente.");
    }, 1500);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseTransaction = {
      organizationId: organization?.id || 'org_default',
      description: formData.description,
      type: type,
      category: formData.category,
      revenueType: type === 'income' ? formData.revenueType : undefined,
      amount: parseFloat(formData.amount) || 0,
      unitId: selectedUnitId === 'all' ? undefined : selectedUnitId,
      sourceAccountId: formData.sourceAccountId ? formData.sourceAccountId : undefined,
    };

    if (formData.isRecurring && formData.recurrenceCount > 1) {
      // Generating Recurrent Transactions
      const groupId = `grp_${Date.now()}`;
      const amountPerInstallment = (parseFloat(formData.amount) || 0) / formData.recurrenceCount;

      for (let i = 0; i < formData.recurrenceCount; i++) {
        const dueDate = new Date(formData.dueDate);
        if (formData.recurrenceRule === 'monthly') {
          dueDate.setMonth(dueDate.getMonth() + i);
        } else if (formData.recurrenceRule === 'weekly') {
          dueDate.setDate(dueDate.getDate() + (i * 7));
        } else if (formData.recurrenceRule === 'yearly') {
          dueDate.setFullYear(dueDate.getFullYear() + i);
        }

        const competenceDate = new Date(formData.date);
        // Competence usually is the same (accrual basis) or moves? For installments (purchase), competence is day of purchase. But due dates move.
        // Let's keep competence date as the purchase date for the first one, or all? 
        // In standard accounting, 1 purchase of 1200 in 12x:
        // Competence: 1200 on Day 0.
        // Cash Flow: 100 on Day 0, 100 on Day 30, etc.
        // BUT our system stores transactions as rows. 
        // If we store 12 rows, we split the amount.

        addTransaction({
          ...baseTransaction,
          id: `t_${Date.now()}_${i}`,
          amount: amountPerInstallment, // Split amount
          date: formData.date, // Competence Date remains the purchase date usually, but for simple cash flow visualization we often treat individual records.
          // Let's set 'date' = dueDate to simplifly "Competence View" matching "Cash View" unless we specifically handle it.
          // Actually, let's strictly follow:
          // Date = Competence (When the cost occurred)
          // DueDate = When it must be paid.
          // Status = Pending (for future ones)

          status: i === 0 && formData.status === 'paid' ? 'paid' : 'pending',

          // Expense Specifics
          supplierId: formData.supplierId || undefined,
          dueDate: dueDate.toISOString().split('T')[0],
          recurrence: {
            rule: formData.recurrenceRule as any,
            currentInstallment: i + 1,
            totalInstallments: formData.recurrenceCount,
            groupId
          }
        } as Transaction);
      }

    } else {
      // Single Transaction
      const newTransaction: Transaction = {
        id: `t_${Date.now()}`,
        ...baseTransaction,
        status: formData.status,
        date: formData.date,
        // Expense Specifics
        supplierId: formData.supplierId || undefined,
        dueDate: type === 'expense' && formData.status === 'pending' ? formData.dueDate : undefined,
      };
      addTransaction(newTransaction);
    }

    setFormData({
      description: '',
      amount: '',
      category: 'Outros',
      date: getLocalDate(),
      status: 'paid',
      revenueType: 'service',
      supplierId: '',
      sourceAccountId: '', // Reset
      dueDate: getLocalDate(),
      isRecurring: false,
      recurrenceRule: 'monthly',
      recurrenceCount: 2
    });
    onClose();
  };

  const expenseCategories = ['Material', 'Manutenção', 'Comissão', 'Impostos', 'Aluguel', 'Marketing', 'Água/Luz/Net', 'Folha de Pagamento', 'Outros'];
  const incomeCategories = ['Serviços', 'Produtos', 'Pacotes', 'Gift Card', 'Outros'];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 bg-gray-50 shrink-0">
          <h3 className="font-bold text-diva-dark text-lg flex items-center">
            <DollarSign size={20} className="mr-2 text-diva-primary" /> Nova Transação
          </h3>
          <div className="flex items-center gap-2">
            <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border border-dashed border-gray-300 hover:border-diva-primary hover:text-diva-primary transition-all flex items-center ${uploading ? 'animate-pulse bg-gray-100' : ''}`}>
              <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} disabled={uploading} />
              <FileText size={14} className="mr-1" /> {uploading ? 'Analisando...' : 'Upload Cupom/Nota'}
            </label>
            <button onClick={onClose} className="text-gray-400 hover:text-diva-dark transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">

          {/* Type Switcher */}
          <div className="flex p-1 bg-gray-100 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center transition-all ${type === 'income' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ArrowUpCircle size={16} className="mr-2" /> Receita
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center transition-all ${type === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ArrowDownCircle size={16} className="mr-2" /> Despesa
            </button>
          </div>

          {/* Revenue Type Selector (Only for Income) */}
          {type === 'income' && (
            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
              <label className="block text-xs font-bold text-blue-700 uppercase mb-2">Classificação Fiscal (Receita)</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, revenueType: 'service' })}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-bold border transition-colors ${formData.revenueType === 'service' ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'}`}
                >
                  Serviço (ISS)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, revenueType: 'product' })}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-bold border transition-colors ${formData.revenueType === 'product' ? 'bg-orange-500 text-white border-orange-600' : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300'}`}
                >
                  Produto (ICMS)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, revenueType: 'mixed' })}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-bold border transition-colors ${formData.revenueType === 'mixed' ? 'bg-gray-500 text-white border-gray-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                >
                  Misto
                </button>
              </div>
            </div>
          )}

          {/* Supplier Selector (Only for Expense) */}
          {type === 'expense' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fornecedor</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                >
                  <option value="">Sem fornecedor específico</option>
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                required
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900"
                placeholder={type === 'income' ? "Ex: Venda de Produtos" : "Ex: Conta de Luz"}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all font-mono bg-white text-gray-900"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data (Competência)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="date"
                  required
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all text-sm bg-white text-gray-900"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
              <select
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900 text-sm"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TransactionStatus })}
              >
                <option value="paid">{type === 'income' ? 'Recebido' : 'Pago'}</option>
                <option value="pending">Pendente (Agendado)</option>
                <option value="overdue">Atrasado</option>
              </select>
            </div>
          </div>

          {/* Due Date (Vencimento) - Visible if Pending or Expense */}
          {(formData.status === 'pending' || type === 'expense') && (
            <div className="animate-in fade-in">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                {formData.status === 'pending' ? 'Data de Vencimento' : 'Data de Pagamento Real/Previsto'}
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="date"
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all text-sm bg-white text-gray-900"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Recurrence (Installments/Repeat) */}
          {type === 'expense' && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="sched"
                  checked={formData.isRecurring}
                  onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="w-4 h-4 text-diva-primary border-gray-300 rounded focus:ring-diva-primary"
                />
                <label htmlFor="sched" className="text-sm font-bold text-gray-700 flex items-center">
                  <Repeat size={14} className="mr-1" /> Repetir / Parcelar Despesa
                </label>
              </div>

              {formData.isRecurring && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Frequência</label>
                    <select
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                      value={formData.recurrenceRule}
                      onChange={e => setFormData({ ...formData, recurrenceRule: e.target.value })}
                    >
                      <option value="monthly">Mensal</option>
                      <option value="weekly">Semanal</option>
                      <option value="yearly">Anual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nº de Parcelas</label>
                    <input
                      type="number"
                      min="2"
                      max="60"
                      value={formData.recurrenceCount}
                      onChange={e => setFormData({ ...formData, recurrenceCount: parseInt(e.target.value) || 2 })}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="col-span-2 text-xs text-gray-500 italic">
                    * O valor total será dividido em {formData.recurrenceCount} parcelas de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((parseFloat(formData.amount) || 0) / formData.recurrenceCount)}.
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              <Save size={16} className="mr-2" /> {type === 'income' ? 'Receber' : 'Salvar Despesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionModal;
