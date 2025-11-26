
import React, { useState } from 'react';
import { LinenItem, LaundryTransaction } from '../../types';
import { Shirt, RotateCw, Truck, Archive, Plus, ArrowRight, ArrowLeft, Package, Scale, Trash2, Edit } from 'lucide-react';
import NewLinenModal from '../modals/NewLinenModal';
import LaundryActionModal from '../modals/LaundryActionModal';
import { useToast } from '../ui/ToastContext';

const mockLinen: LinenItem[] = [
    { id: 'l1', name: 'Toalha de Rosto (Branca)', totalQuantity: 100, statusCounts: { clean: 40, inUse: 10, dirty: 20, laundry: 30 }, costPerWash: 1.50, lifespanWashes: 100, currentWashes: 45 },
    { id: 'l2', name: 'Toalha de Banho (Gigante)', totalQuantity: 50, statusCounts: { clean: 15, inUse: 5, dirty: 10, laundry: 20 }, costPerWash: 2.50, lifespanWashes: 80, currentWashes: 30 },
    { id: 'l3', name: 'Roupão Piquet (Diva)', totalQuantity: 40, statusCounts: { clean: 20, inUse: 5, dirty: 5, laundry: 10 }, costPerWash: 3.50, lifespanWashes: 150, currentWashes: 60 },
    { id: 'l4', name: 'Lençol de Maca (Elástico)', totalQuantity: 60, statusCounts: { clean: 30, inUse: 10, dirty: 10, laundry: 10 }, costPerWash: 2.00, lifespanWashes: 120, currentWashes: 50 },
];

const mockTransactions: LaundryTransaction[] = [
    { id: 't1', date: '2023-10-27', type: 'send', laundryName: 'Lavanderia LimpaMais', items: [{ itemName: 'Toalha de Rosto', quantity: 30 }, { itemName: 'Roupão', quantity: 10 }], totalWeight: 12.5 },
    { id: 't2', date: '2023-10-25', type: 'receive', laundryName: 'Lavanderia LimpaMais', items: [{ itemName: 'Lençol', quantity: 20 }], cost: 45.00 },
];

const LaundryModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'transactions'>('inventory');
  const [linen, setLinen] = useState(mockLinen);
  const [transactions, setTransactions] = useState(mockTransactions);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'send' | 'receive'>('send');
  const [editingItem, setEditingItem] = useState<LinenItem | null>(null);
  
  const { addToast } = useToast();

  const getTotalInCirculation = (item: LinenItem) => 
      item.statusCounts.clean + item.statusCounts.inUse + item.statusCounts.dirty + item.statusCounts.laundry;

  const handleOpenNewModal = () => {
      setEditingItem(null);
      setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: LinenItem) => {
      setEditingItem(item);
      setIsModalOpen(true);
  };

  const handleOpenAction = (type: 'send' | 'receive') => {
      setActionType(type);
      setIsActionModalOpen(true);
  };

  const handleSaveLinen = (newItem: LinenItem) => {
      if (editingItem) {
          setLinen(linen.map(item => item.id === newItem.id ? newItem : item));
          addToast('Item de enxoval atualizado!', 'success');
      } else {
          setLinen([...linen, newItem]);
          addToast('Novo item de enxoval adicionado!', 'success');
      }
  };

  const handleDeleteLinen = (id: string) => {
      if (confirm('Tem certeza que deseja excluir este item do inventário?')) {
          setLinen(linen.filter(l => l.id !== id));
          addToast('Item removido.', 'info');
      }
  };

  const handleConfirmAction = (selectedItems: { itemId: string; quantity: number }[], laundryName: string) => {
      const newLinen = [...linen];
      let totalCost = 0;
      let totalWeight = 0;

      selectedItems.forEach(({ itemId, quantity }) => {
          const itemIndex = newLinen.findIndex(i => i.id === itemId);
          if (itemIndex === -1) return;
          const item = newLinen[itemIndex];

          if (actionType === 'send') {
              // Logic: Take from Dirty first, then Clean if needed
              let remaining = quantity;
              let newDirty = item.statusCounts.dirty;
              let newClean = item.statusCounts.clean;

              if (newDirty >= remaining) {
                  newDirty -= remaining;
                  remaining = 0;
              } else {
                  remaining -= newDirty;
                  newDirty = 0;
                  // Take rest from clean
                  newClean = Math.max(0, newClean - remaining);
              }

              newLinen[itemIndex] = {
                  ...item,
                  statusCounts: {
                      ...item.statusCounts,
                      dirty: newDirty,
                      clean: newClean,
                      laundry: item.statusCounts.laundry + quantity
                  }
              };
              totalWeight += quantity * 0.5; // Mock weight 0.5kg per item
          } else {
              // Receiving: Take from Laundry, Add to Clean, Increment Washes
              const newLaundry = Math.max(0, item.statusCounts.laundry - quantity);
              
              newLinen[itemIndex] = {
                  ...item,
                  currentWashes: item.currentWashes + 1,
                  statusCounts: {
                      ...item.statusCounts,
                      laundry: newLaundry,
                      clean: item.statusCounts.clean + quantity
                  }
              };
              totalCost += quantity * item.costPerWash;
          }
      });

      setLinen(newLinen);

      // Add Transaction Log
      const newTransaction: LaundryTransaction = {
          id: `t_${Date.now()}`,
          date: new Date().toISOString(),
          type: actionType,
          laundryName,
          items: selectedItems.map(s => ({ 
              itemName: linen.find(i => i.id === s.itemId)?.name || 'Item', 
              quantity: s.quantity 
          })),
          totalWeight: actionType === 'send' ? totalWeight : undefined,
          cost: actionType === 'receive' ? totalCost : undefined
      };

      setTransactions([newTransaction, ...transactions]);
      addToast(actionType === 'send' ? 'Itens enviados para lavanderia.' : 'Itens recebidos e estoque atualizado.', 'success');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                    <Shirt size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-bold text-diva-dark">Gestão de Enxoval</h2>
                    <p className="text-sm text-gray-500">Controle de rouparia, lavanderia e custos.</p>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Estoque & Ciclo
                    </button>
                    <button 
                        onClick={() => setActiveTab('transactions')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'transactions' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Remessas
                    </button>
                </div>
                <button 
                    onClick={handleOpenNewModal}
                    className="ml-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center hover:bg-indigo-700 transition-colors shadow-md"
                >
                    <Plus size={18} className="mr-2" /> Novo Item
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
            
            {activeTab === 'inventory' && (
                <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                        {linen.map(item => {
                            const total = getTotalInCirculation(item);
                            const loss = item.totalQuantity - total;
                            
                            return (
                                <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm group relative">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleOpenEditModal(item)}
                                            className="text-gray-300 hover:text-indigo-600"
                                            title="Editar Item"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteLinen(item.id)}
                                            className="text-gray-300 hover:text-red-500"
                                            title="Excluir Item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start mb-6 pr-16">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                <Archive size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-diva-dark text-lg">{item.name}</h4>
                                                <p className="text-xs text-gray-500">Vida Útil: {item.currentWashes}/{item.lifespanWashes} lavagens</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-diva-dark">{item.totalQuantity} <span className="text-xs text-gray-400 font-normal">un.</span></span>
                                    </div>

                                    {/* Visual Cycle */}
                                    <div className="relative pt-4 pb-8 px-2">
                                        {/* Connection Line */}
                                        <div className="absolute top-8 left-0 w-full h-1 bg-gray-100 z-0"></div>
                                        
                                        <div className="flex justify-between relative z-10 text-center">
                                            {/* Clean */}
                                            <div className="flex flex-col items-center group/step cursor-default">
                                                <div className="w-10 h-10 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center text-green-700 font-bold shadow-sm mb-2 transition-transform group-hover/step:scale-110">
                                                    {item.statusCounts.clean}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Limpo</span>
                                            </div>

                                            {/* In Use */}
                                            <div className="flex flex-col items-center group/step cursor-default">
                                                <div className="w-10 h-10 bg-blue-100 border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-700 font-bold shadow-sm mb-2 transition-transform group-hover/step:scale-110">
                                                    {item.statusCounts.inUse}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Em Uso</span>
                                            </div>

                                            {/* Dirty */}
                                            <div className="flex flex-col items-center group/step cursor-default">
                                                <div className="w-10 h-10 bg-yellow-100 border-2 border-yellow-500 rounded-full flex items-center justify-center text-yellow-700 font-bold shadow-sm mb-2 transition-transform group-hover/step:scale-110">
                                                    {item.statusCounts.dirty}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Sujo</span>
                                            </div>

                                            {/* Laundry */}
                                            <div className="flex flex-col items-center group/step cursor-default">
                                                <div className="w-10 h-10 bg-purple-100 border-2 border-purple-500 rounded-full flex items-center justify-center text-purple-700 font-bold shadow-sm mb-2 transition-transform group-hover/step:scale-110">
                                                    {item.statusCounts.laundry}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Lavanderia</span>
                                            </div>
                                        </div>
                                    </div>

                                    {loss > 0 && (
                                        <div className="mt-2 bg-red-50 border border-red-100 p-2 rounded flex items-center justify-between text-xs text-red-700">
                                            <span className="font-bold flex items-center"><RotateCw size={12} className="mr-1"/> Divergência de Estoque</span>
                                            <span>Faltam {loss} peças</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="flex h-full">
                    <div className="w-80 bg-white border-r border-gray-200 flex flex-col p-6">
                        <h3 className="font-bold text-diva-dark text-sm uppercase mb-4">Ações Rápidas</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={() => handleOpenAction('send')}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <ArrowRight size={18} className="mr-2" /> Enviar para Lavanderia
                            </button>
                            <button 
                                onClick={() => handleOpenAction('receive')}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 transition-colors flex items-center justify-center"
                            >
                                <ArrowLeft size={18} className="mr-2" /> Receber Limpo
                            </button>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Resumo Financeiro</h4>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Gasto Mensal Estimado</p>
                                <p className="text-xl font-bold text-diva-dark">R$ 1.250,00</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                        <h3 className="font-bold text-diva-dark mb-4">Histórico de Movimentação</h3>
                        <div className="space-y-4">
                            {transactions.map(t => (
                                <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${t.type === 'send' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                            {t.type === 'send' ? <Truck size={20} /> : <Package size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-diva-dark text-sm">{t.type === 'send' ? 'Envio para Lavanderia' : 'Recebimento de Limpos'}</h4>
                                            <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()} • {t.laundryName}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        {t.type === 'send' ? (
                                            <div className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                                                <Scale size={12} /> {t.totalWeight} kg
                                            </div>
                                        ) : (
                                            <div className="font-mono font-bold text-diva-dark text-sm">
                                                R$ {t.cost?.toFixed(2)}
                                            </div>
                                        )}
                                        <p className="text-[10px] text-gray-400 mt-1">{t.items.length} tipos de itens</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>

        <NewLinenModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveLinen}
            itemToEdit={editingItem}
        />

        <LaundryActionModal
            isOpen={isActionModalOpen}
            onClose={() => setIsActionModalOpen(false)}
            action={actionType}
            inventory={linen}
            onConfirm={handleConfirmAction}
        />
    </div>
  );
};

export default LaundryModule;
