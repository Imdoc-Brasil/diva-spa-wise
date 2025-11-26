
import React, { useState } from 'react';
import { X, Save, DollarSign, ArrowUpCircle, ArrowDownCircle, Calendar, FileText, Tag } from 'lucide-react';
import { Transaction, TransactionType, TransactionStatus } from '../../types';
import { useData } from '../context/DataContext';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useData();
  const [type, setType] = useState<TransactionType>('expense');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Outros',
    date: new Date().toISOString().split('T')[0],
    status: 'paid' as TransactionStatus
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransaction: Transaction = {
      id: `t_${Date.now()}`,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      type: type,
      category: formData.category,
      status: formData.status,
      date: formData.date
    };

    addTransaction(newTransaction);
    setFormData({ description: '', amount: '', category: 'Outros', date: new Date().toISOString().split('T')[0], status: 'paid' });
    onClose();
  };

  const expenseCategories = ['Material', 'Manutenção', 'Comissão', 'Impostos', 'Aluguel', 'Marketing', 'Outros'];
  const incomeCategories = ['Serviços', 'Produtos', 'Pacotes', 'Gift Card', 'Outros'];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-diva-dark text-lg flex items-center">
            <DollarSign size={20} className="mr-2 text-diva-primary" /> Nova Transação
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-diva-dark transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Type Switcher */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
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

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição *</label>
            <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                type="text"
                required
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all bg-white text-gray-900"
                placeholder="Ex: Compra de Luvas"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                    type="date"
                    required
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-diva-primary/20 focus:border-diva-primary transition-all text-sm bg-white text-gray-900"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, status: e.target.value as TransactionStatus})}
                >
                    <option value="paid">Pago / Recebido</option>
                    <option value="pending">Pendente</option>
                    <option value="overdue">Atrasado</option>
                </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
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
              <Save size={16} className="mr-2" /> {type === 'income' ? 'Receber' : 'Pagar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionModal;
