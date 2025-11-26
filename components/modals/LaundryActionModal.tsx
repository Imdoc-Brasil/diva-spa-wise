
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Truck, CheckCircle } from 'lucide-react';
import { LinenItem } from '../../types';

interface LaundryActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'send' | 'receive';
  inventory: LinenItem[];
  onConfirm: (selectedItems: { itemId: string; quantity: number }[], laundryName: string) => void;
}

const LaundryActionModal: React.FC<LaundryActionModalProps> = ({ isOpen, onClose, action, inventory, onConfirm }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [laundryName, setLaundryName] = useState('Lavanderia LimpaMais');

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuantities({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuantityChange = (id: string, val: number) => {
    setQuantities(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = () => {
    const itemsToProcess = Object.entries(quantities)
      .filter(([_, qty]) => (qty as number) > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity: quantity as number }));

    if (itemsToProcess.length === 0) {
      alert("Selecione pelo menos um item.");
      return;
    }

    onConfirm(itemsToProcess, laundryName);
    onClose();
  };

  // Helper to get max available based on action
  const getMax = (item: LinenItem) => {
      if (action === 'send') {
          // Can send Dirty + Clean (Prioritize Dirty in logic, but here allow total avail locally)
          return item.statusCounts.dirty + item.statusCounts.clean;
      } else {
          // Can only receive what is in Laundry
          return item.statusCounts.laundry;
      }
  };

  const isReceive = action === 'receive';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className={`p-5 border-b border-gray-100 flex justify-between items-center text-white
            ${isReceive ? 'bg-green-600' : 'bg-blue-600'}`}>
          <h3 className="font-bold text-lg flex items-center">
            {isReceive ? <ArrowLeft size={20} className="mr-2" /> : <Truck size={20} className="mr-2" />}
            {isReceive ? 'Receber Enxoval Limpo' : 'Enviar para Lavanderia'}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
            
            <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lavanderia Parceira</label>
                <select 
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:border-diva-primary"
                    value={laundryName}
                    onChange={(e) => setLaundryName(e.target.value)}
                >
                    <option>Lavanderia LimpaMais</option>
                    <option>EcoWash Pro</option>
                    <option>LavaRapido Express</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Item</th>
                            <th className="px-4 py-3 text-center">Disponível</th>
                            <th className="px-4 py-3 text-center w-32">Quantidade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {inventory.map(item => {
                            const max = getMax(item);
                            return (
                                <tr key={item.id}>
                                    <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                                            ${max === 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {max} un.
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {isReceive ? 'Na Lavanderia' : 'Sujo + Limpo'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <input 
                                            type="number" 
                                            min="0"
                                            max={max}
                                            disabled={max === 0}
                                            className="w-full p-2 border border-gray-300 rounded text-center font-bold focus:border-diva-primary outline-none bg-white text-gray-900"
                                            value={quantities[item.id] || ''}
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
            <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button 
                onClick={handleSubmit}
                className={`px-6 py-2 text-white font-bold rounded-lg shadow-md flex items-center transition-all
                    ${isReceive ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isReceive ? <CheckCircle size={18} className="mr-2" /> : <ArrowRight size={18} className="mr-2" />}
                Confirmar {isReceive ? 'Recebimento' : 'Envio'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default LaundryActionModal;
