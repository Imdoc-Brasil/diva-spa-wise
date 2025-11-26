
import React, { useState } from 'react';
import { Product, ProductCategory, Supplier, PurchaseOrder, StockAudit, StockAuditItem } from '../../types';
import { ShoppingBag, Search, Tag, Heart, Plus, Minus, CreditCard, Sparkles, Package, AlertTriangle, TrendingDown, ArrowUpRight, ArrowDownRight, Archive, Truck, ClipboardList, CheckCircle, User, ClipboardCheck, Save, BarChart2, TrendingUp, Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, LineChart, Line, Cell } from 'recharts';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Kit Pós-Laser Calmante',
    description: 'Loção hidratante e gel refrescante para cuidado imediato após sessões.',
    price: 189.90,
    costPrice: 85.00,
    category: 'homecare',
    stock: 15,
    minStockLevel: 20,
    batchNumber: 'L-2023-001',
    expirationDate: '2024-12-01',
    supplier: 'DermoTech Labs',
    isPromotion: true
  },
  {
    id: 'p2',
    name: 'Pacote 10 Sessões - Axila',
    description: 'Tratamento completo de depilação a laser para axilas. Validade de 12 meses.',
    price: 890.00,
    category: 'treatment_package'
  },
  {
    id: 'p3',
    name: 'Sérum Vitamina C 20%',
    description: 'Antioxidante potente para luminosidade e firmeza da pele.',
    price: 245.00,
    costPrice: 110.00,
    category: 'homecare',
    stock: 8,
    minStockLevel: 10,
    batchNumber: 'VC-8892',
    expirationDate: '2023-11-15', // Near expiry for demo
    supplier: 'VitaSkin Pro'
  },
  {
    id: 'p4',
    name: 'Gift Card - Dia de Spa',
    description: 'Presenteie quem você ama com uma experiência completa de relaxamento.',
    price: 500.00,
    category: 'giftcard'
  },
  {
    id: 'p5',
    name: 'Pacote Full Body',
    description: 'Perna inteira, virilha e axila. O combo mais vendido.',
    price: 2500.00,
    category: 'treatment_package',
    isPromotion: true
  },
  {
    id: 'p6',
    name: 'Gel Condutor Neutro 5L',
    description: 'Uso profissional. Alta condutividade para laser e ultrassom.',
    price: 0, // Not for sale
    costPrice: 45.90,
    category: 'professional_use',
    stock: 3,
    minStockLevel: 5,
    batchNumber: 'GL-999',
    expirationDate: '2025-01-01',
    supplier: 'MedHospitalar'
  }
];

const mockSuppliers: Supplier[] = [
    { id: 'sup1', name: 'DermoTech Labs', contact: '(11) 4444-5555', email: 'pedidos@dermotech.com', rating: 4.8, categories: ['Dermocosméticos'] },
    { id: 'sup2', name: 'MedHospitalar', contact: '(11) 3333-2222', email: 'vendas@med.com.br', rating: 4.2, categories: ['Descartáveis', 'Profissional'] },
    { id: 'sup3', name: 'VitaSkin Pro', contact: '(21) 9999-8888', email: 'comercial@vitaskin.com', rating: 5.0, categories: ['Home Care', 'Luxo'] },
];

const mockOrders: PurchaseOrder[] = [
    { 
        id: 'po1', supplierId: 'sup2', supplierName: 'MedHospitalar', status: 'received', date: '2023-10-15', totalCost: 1200.50, itemsCount: 15,
        items: [{ productId: 'p6', productName: 'Gel Condutor', quantity: 10, unitCost: 45.90 }]
    },
    { 
        id: 'po2', supplierId: 'sup1', supplierName: 'DermoTech Labs', status: 'ordered', date: '2023-10-26', totalCost: 2550.00, itemsCount: 30, expectedDelivery: '2023-10-30',
        items: [{ productId: 'p1', productName: 'Kit Pós-Laser', quantity: 30, unitCost: 85.00 }]
    },
    { 
        id: 'po3', supplierId: 'sup3', supplierName: 'VitaSkin Pro', status: 'draft', date: '2023-10-27', totalCost: 550.00, itemsCount: 5,
        items: [{ productId: 'p3', productName: 'Sérum Vitamina C', quantity: 5, unitCost: 110.00 }]
    },
];

// Forecast Data
const forecastData = [
    { day: 'Hoje', stock: 15, predicted: 15 },
    { day: '+3d', stock: 12, predicted: 11 },
    { day: '+6d', stock: 9, predicted: 8 },
    { day: '+9d', stock: 6, predicted: 5 },
    { day: '+12d', stock: 3, predicted: 2 }, // Warning zone
    { day: '+15d', stock: 0, predicted: 0 }, // Stockout
];

const abcData = [
    { name: 'Classe A', value: 70, color: '#14808C', tooltip: '70% da Receita (Vitamina C, Botox)' },
    { name: 'Classe B', value: 20, color: '#BF784E', tooltip: '20% da Receita (Kits, Hidratantes)' },
    { name: 'Classe C', value: 10, color: '#94a3b8', tooltip: '10% da Receita (Descartáveis)' },
];

const MarketplaceModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<'storefront' | 'inventory' | 'purchasing' | 'audit' | 'analytics'>('storefront');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [orders, setOrders] = useState(mockOrders);
  
  // Audit State
  const [activeAudit, setActiveAudit] = useState<StockAudit | null>(null);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const filteredProducts = mockProducts.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  }).filter(p => {
    // Hide professional use items from Storefront
    if (viewMode === 'storefront' && p.category === 'professional_use') return false;
    return true;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
            return prev.map(item => item.product.id === product.id ? {...item, qty: item.qty + 1} : item);
        }
        return [...prev, { product, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Inventory Logic
  const getStockStatus = (prod: Product) => {
    if (!prod.stock && prod.stock !== 0) return 'n/a';
    if (prod.stock === 0) return 'critical';
    if (prod.minStockLevel && prod.stock <= prod.minStockLevel) return 'low';
    return 'good';
  };

  const isNearExpiry = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 30; // 30 days threshold
  };

  // Purchasing Logic
  const handleGenerateReplenishment = () => {
      const lowStockItems = mockProducts.filter(p => getStockStatus(p) === 'low' || getStockStatus(p) === 'critical');
      if (lowStockItems.length === 0) {
          alert("Estoque saudável! Nenhum item precisa de reposição urgente.");
          return;
      }
      
      const newOrder: PurchaseOrder = {
          id: `po_${Date.now()}`,
          supplierId: 'sup1', // Mock default
          supplierName: 'Mix Fornecedores (Auto)',
          status: 'draft',
          date: new Date().toISOString().split('T')[0],
          itemsCount: lowStockItems.length * 10, // Mock qty
          totalCost: lowStockItems.reduce((acc, p) => acc + ((p.costPrice || 0) * 10), 0),
          items: lowStockItems.map(p => ({ productId: p.id, productName: p.name, quantity: 10, unitCost: p.costPrice || 0 }))
      };
      
      setOrders([newOrder, ...orders]);
      alert(`${lowStockItems.length} itens adicionados a um novo pedido de reposição!`);
  };

  const handleReceiveOrder = (id: string) => {
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'received' } : o));
      // In real app, this would loop through items and update product.stock
      alert("Estoque atualizado e despesa lançada no Financeiro.");
  };

  // Audit Logic
  const startAudit = () => {
      const auditItems: StockAuditItem[] = mockProducts.filter(p => p.stock !== undefined).map(p => ({
          productId: p.id,
          productName: p.name,
          systemQty: p.stock || 0,
          costPrice: p.costPrice || 0,
          discrepancy: 0,
          countedQty: undefined // Forces user to input
      }));

      const newAudit: StockAudit = {
          id: `audit_${Date.now()}`,
          date: new Date().toISOString(),
          status: 'in_progress',
          performedBy: 'Admin',
          items: auditItems,
          totalDiscrepancyValue: 0
      };
      setActiveAudit(newAudit);
  };

  const handleAuditCount = (productId: string, qty: number) => {
      if (!activeAudit) return;
      
      const updatedItems = activeAudit.items.map(item => {
          if (item.productId === productId) {
              const diff = qty - item.systemQty;
              return { ...item, countedQty: qty, discrepancy: diff };
          }
          return item;
      });

      const totalDiffValue = updatedItems.reduce((acc, item) => {
          if (item.countedQty === undefined) return acc;
          return acc + (item.discrepancy * item.costPrice);
      }, 0);

      setActiveAudit({ ...activeAudit, items: updatedItems, totalDiscrepancyValue: totalDiffValue });
  };

  const finishAudit = () => {
      if (!activeAudit) return;
      const uncounted = activeAudit.items.filter(i => i.countedQty === undefined).length;
      if (uncounted > 0) {
          if(!confirm(`Existem ${uncounted} itens não contados. Eles serão mantidos com a quantidade do sistema. Deseja continuar?`)) return;
      }
      
      alert(`Auditoria Finalizada!\nAjuste de Inventário Realizado.\nImpacto Financeiro: ${formatCurrency(activeAudit.totalDiscrepancyValue)}`);
      setActiveAudit(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      
      {/* Top Toggle Bar */}
      <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-diva-light/30 shadow-sm shrink-0">
          <div className="flex p-1 bg-gray-100 rounded-lg">
             <button 
                onClick={() => setViewMode('storefront')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${viewMode === 'storefront' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <ShoppingBag size={16} className="mr-2" /> Loja
             </button>
             <button 
                onClick={() => setViewMode('inventory')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${viewMode === 'inventory' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Package size={16} className="mr-2" /> Estoque
             </button>
             <button 
                onClick={() => setViewMode('purchasing')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${viewMode === 'purchasing' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Truck size={16} className="mr-2" /> Compras
             </button>
             <button 
                onClick={() => setViewMode('audit')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${viewMode === 'audit' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <ClipboardCheck size={16} className="mr-2" /> Auditoria
             </button>
             <button 
                onClick={() => setViewMode('analytics')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${viewMode === 'analytics' ? 'bg-white text-diva-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <BarChart2 size={16} className="mr-2" /> Inteligência
             </button>
          </div>
          {viewMode === 'storefront' && (
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Buscar produtos..." className="pl-9 pr-4 py-2 border border-diva-light/50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-diva-primary w-64" />
              </div>
          )}
      </div>

      {viewMode === 'storefront' && (
          <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
            {/* STOREFRONT VIEW */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="mb-4">
                     <div className="flex space-x-2 overflow-x-auto pb-2">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'homecare', label: 'Home Care' },
                            { id: 'treatment_package', label: 'Pacotes' },
                            { id: 'giftcard', label: 'Gift Cards' }
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as any)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                                    activeCategory === cat.id 
                                    ? 'bg-diva-primary text-white' 
                                    : 'bg-white text-gray-500 border border-diva-light/30 hover:bg-gray-50'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-xl border border-diva-light/30 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                                <div className="h-40 bg-diva-light/10 rounded-t-xl relative overflow-hidden flex items-center justify-center">
                                    <ShoppingBag size={48} className="text-diva-light opacity-50" />
                                    {product.isPromotion && (
                                        <span className="absolute top-3 left-3 bg-diva-accent text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center">
                                            <Sparkles size={10} className="mr-1" /> PROMO
                                        </span>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-diva-dark text-lg leading-tight mb-2">{product.name}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-diva-light/20">
                                        <span className="font-mono text-lg font-bold text-diva-primary">{formatCurrency(product.price)}</span>
                                        <button 
                                            onClick={() => addToCart(product)}
                                            className="bg-diva-dark text-white p-2 rounded-lg hover:bg-diva-primary transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Sidebar */}
            <div className="w-full lg:w-80 bg-white rounded-xl shadow-lg border border-diva-light/30 flex flex-col h-full">
                <div className="p-5 border-b border-diva-light/30 bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-diva-dark flex items-center">
                        <ShoppingBag size={20} className="mr-2 text-diva-primary" />
                        Sacola ({cartCount})
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-white p-3 rounded-lg border border-diva-light/20 shadow-sm">
                             <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-diva-dark truncate">{item.product.name}</p>
                                <p className="text-xs text-diva-primary font-bold">{formatCurrency(item.product.price)}</p>
                             </div>
                             <span className="text-xs font-bold text-gray-500">x{item.qty}</span>
                        </div>
                    ))}
                    {cart.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">Sua sacola está vazia.</p>}
                </div>
                <div className="p-5 border-t border-diva-light/30 bg-gray-50 rounded-b-xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 text-sm">Total</span>
                        <span className="font-bold text-lg text-diva-dark">{formatCurrency(cartTotal)}</span>
                    </div>
                    <button className="w-full bg-diva-primary text-white py-3 rounded-lg font-bold flex items-center justify-center hover:bg-diva-dark transition-colors">
                        <CreditCard size={18} className="mr-2" /> Checkout
                    </button>
                </div>
            </div>
          </div>
      )}

      {viewMode === 'inventory' && (
          <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-diva-light/30">
              {/* INVENTORY DASHBOARD HEADER */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-diva-light/20 bg-gray-50">
                   <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase">Valor em Estoque</p>
                      <p className="text-xl font-bold text-diva-dark mt-1">
                          {formatCurrency(mockProducts.reduce((acc, p) => acc + ((p.stock || 0) * (p.costPrice || 0)), 0))}
                      </p>
                   </div>
                   <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase">Itens Críticos</p>
                      <p className="text-xl font-bold text-diva-alert mt-1 flex items-center">
                          {mockProducts.filter(p => getStockStatus(p) === 'low' || getStockStatus(p) === 'critical').length}
                          <AlertTriangle size={16} className="ml-2" />
                      </p>
                   </div>
                   <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase">Vencimento Próximo</p>
                      <p className="text-xl font-bold text-orange-500 mt-1">
                           {mockProducts.filter(p => isNearExpiry(p.expirationDate)).length}
                      </p>
                   </div>
                   <div className="flex items-center justify-end">
                       <button className="bg-diva-dark text-white px-4 py-2.5 rounded-lg flex items-center text-sm font-bold shadow-md hover:bg-diva-primary transition-colors">
                          <Plus size={18} className="mr-2" /> Entrada de Nota
                       </button>
                   </div>
              </div>

              {/* INVENTORY TABLE */}
              <div className="flex-1 overflow-auto">
                  <table className="w-full text-left">
                      <thead className="bg-white sticky top-0 z-10 shadow-sm">
                          <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                              <th className="px-6 py-4">Produto / Lote</th>
                              <th className="px-6 py-4">Categoria</th>
                              <th className="px-6 py-4 text-center">Estoque</th>
                              <th className="px-6 py-4 text-center">Validade</th>
                              <th className="px-6 py-4 text-right">Custo Unit.</th>
                              <th className="px-6 py-4 text-right">Ações</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                          {mockProducts.filter(p => p.stock !== undefined).map(prod => {
                              const status = getStockStatus(prod);
                              const nearExpiry = isNearExpiry(prod.expirationDate);
                              return (
                                  <tr key={prod.id} className="hover:bg-gray-50 transition-colors group">
                                      <td className="px-6 py-4">
                                          <p className="font-bold text-diva-dark">{prod.name}</p>
                                          <p className="text-xs text-gray-500 mt-0.5">Lote: {prod.batchNumber || 'N/A'}</p>
                                      </td>
                                      <td className="px-6 py-4">
                                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${prod.category === 'professional_use' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                              {prod.category === 'professional_use' ? 'Uso Interno' : 'Venda'}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                          <div className="flex flex-col items-center">
                                              <span className={`font-bold ${status === 'low' ? 'text-diva-alert' : status === 'critical' ? 'text-red-600' : 'text-green-600'}`}>
                                                  {prod.stock}
                                              </span>
                                              <span className="text-[10px] text-gray-400">Min: {prod.minStockLevel}</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${nearExpiry ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                                              {nearExpiry && <AlertTriangle size={12} className="mr-1" />}
                                              {prod.expirationDate ? new Date(prod.expirationDate).toLocaleDateString() : '-'}
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 text-right font-mono text-gray-600">
                                          {formatCurrency(prod.costPrice || 0)}
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                          <div className="flex justify-end space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Ajuste Manual">
                                                  <Archive size={16} />
                                              </button>
                                              <button className="p-1.5 hover:bg-green-100 rounded text-green-600" title="Entrada">
                                                  <ArrowDownRight size={16} />
                                              </button>
                                              <button className="p-1.5 hover:bg-red-100 rounded text-red-600" title="Baixa/Perda">
                                                  <ArrowUpRight size={16} />
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {viewMode === 'purchasing' && (
          <div className="flex gap-6 h-full overflow-hidden">
              {/* SUPPLIERS LIST */}
              <div className="w-80 bg-white rounded-xl shadow-sm border border-diva-light/30 flex flex-col">
                  <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
                      <h3 className="font-bold text-diva-dark">Fornecedores</h3>
                      <button className="p-1 hover:bg-gray-200 rounded text-diva-primary"><Plus size={16} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {mockSuppliers.map(sup => (
                          <div key={sup.id} className="p-3 border border-gray-100 rounded-lg hover:border-diva-primary transition-colors cursor-pointer bg-white group shadow-sm">
                              <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-diva-dark text-sm">{sup.name}</h4>
                                  <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded flex items-center font-bold">
                                      ★ {sup.rating}
                                  </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{sup.contact}</p>
                              <div className="flex gap-1 flex-wrap">
                                  {sup.categories.map(cat => (
                                      <span key={cat} className="text-[9px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                                          {cat}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* PURCHASE ORDERS */}
              <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-diva-light/30 overflow-hidden">
                  <div className="p-6 border-b border-diva-light/20 flex justify-between items-center bg-gray-50">
                      <div>
                          <h3 className="text-lg font-bold text-diva-dark">Pedidos de Compra (PO)</h3>
                          <p className="text-xs text-gray-500">Gerencie reposições e entradas de nota.</p>
                      </div>
                      <button 
                        onClick={handleGenerateReplenishment}
                        className="bg-diva-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center shadow-md hover:bg-diva-dark transition-colors"
                      >
                          <Sparkles size={16} className="mr-2" /> Gerar Pedido de Reposição
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                      <div className="grid gap-4">
                          {orders.map(order => (
                              <div key={order.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all bg-white">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-sm
                                          ${order.status === 'received' ? 'bg-green-500' : order.status === 'ordered' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                                          {order.status === 'received' ? <CheckCircle size={24} /> : <Truck size={24} />}
                                      </div>
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <h4 className="font-bold text-diva-dark">Pedido #{order.id.split('_')[1] || order.id}</h4>
                                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border
                                                  ${order.status === 'received' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                    order.status === 'ordered' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                  {order.status === 'received' ? 'Recebido' : order.status === 'ordered' ? 'Enviado' : 'Rascunho'}
                                              </span>
                                          </div>
                                          <p className="text-sm text-gray-600 mt-0.5">
                                              Fornecedor: <span className="font-medium">{order.supplierName}</span> • {order.itemsCount} itens
                                          </p>
                                          <p className="text-xs text-gray-400 mt-1">Data: {new Date(order.date).toLocaleDateString()}</p>
                                      </div>
                                  </div>

                                  <div className="text-right">
                                      <p className="text-sm text-gray-500 uppercase font-bold">Total Estimado</p>
                                      <p className="text-xl font-mono font-bold text-diva-dark">{formatCurrency(order.totalCost)}</p>
                                      
                                      <div className="flex gap-2 mt-2 justify-end">
                                          <button className="text-xs border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center">
                                              <ClipboardList size={12} className="mr-1" /> Detalhes
                                          </button>
                                          {order.status === 'ordered' && (
                                              <button 
                                                onClick={() => handleReceiveOrder(order.id)}
                                                className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 font-bold flex items-center"
                                              >
                                                  <ArrowDownRight size={12} className="mr-1" /> Receber
                                              </button>
                                          )}
                                          {order.status === 'draft' && (
                                              <button className="text-xs bg-diva-primary text-white px-3 py-1.5 rounded hover:bg-diva-dark font-bold flex items-center">
                                                  <Truck size={12} className="mr-1" /> Enviar Pedido
                                              </button>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {viewMode === 'audit' && (
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-diva-light/30 flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div>
                      <h3 className="text-lg font-bold text-diva-dark flex items-center">
                          <ClipboardCheck size={20} className="mr-2 text-diva-primary" /> Auditoria de Estoque
                      </h3>
                      <p className="text-sm text-gray-500">Contagem física para ajuste de inventário e prevenção de perdas.</p>
                  </div>
                  
                  {!activeAudit ? (
                      <button 
                        onClick={startAudit}
                        className="bg-diva-dark text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-diva-primary transition-colors shadow-md"
                      >
                          <Plus size={16} className="mr-2" /> Iniciar Nova Contagem
                      </button>
                  ) : (
                      <button 
                        onClick={finishAudit}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center hover:bg-green-700 transition-colors shadow-md animate-pulse"
                      >
                          <Save size={18} className="mr-2" /> Finalizar Auditoria
                      </button>
                  )}
              </div>

              {/* Audit Interface */}
              <div className="flex-1 overflow-y-auto p-6">
                  {activeAudit ? (
                      <div className="space-y-6">
                          <div className="flex gap-6">
                              <div className="flex-1 bg-blue-50 border border-blue-100 p-4 rounded-xl">
                                  <p className="text-xs font-bold text-blue-700 uppercase mb-1">Status da Sessão</p>
                                  <p className="text-sm text-blue-900">Em andamento • Iniciada por {activeAudit.performedBy}</p>
                              </div>
                              <div className="flex-1 bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-right">
                                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Divergência Acumulada</p>
                                  <p className={`text-2xl font-bold ${activeAudit.totalDiscrepancyValue < 0 ? 'text-red-600' : activeAudit.totalDiscrepancyValue > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                      {formatCurrency(activeAudit.totalDiscrepancyValue)}
                                  </p>
                              </div>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                              <table className="w-full text-left">
                                  <thead className="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                                      <tr>
                                          <th className="px-6 py-4">Produto</th>
                                          <th className="px-6 py-4 text-center w-32">Sistema</th>
                                          <th className="px-6 py-4 text-center w-32">Físico</th>
                                          <th className="px-6 py-4 text-right w-32">Diferença</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 text-sm">
                                      {activeAudit.items.map(item => (
                                          <tr key={item.productId} className="hover:bg-gray-50 transition-colors">
                                              <td className="px-6 py-4 font-medium text-diva-dark">{item.productName}</td>
                                              <td className="px-6 py-4 text-center text-gray-500">{item.systemQty}</td>
                                              <td className="px-6 py-4 text-center">
                                                  <input 
                                                      type="number" 
                                                      placeholder="?"
                                                      value={item.countedQty !== undefined ? item.countedQty : ''}
                                                      onChange={(e) => handleAuditCount(item.productId, parseInt(e.target.value) || 0)}
                                                      className="w-20 p-2 border border-gray-300 rounded text-center font-bold text-diva-dark outline-none focus:border-diva-primary bg-white"
                                                  />
                                              </td>
                                              <td className="px-6 py-4 text-right">
                                                  {item.countedQty !== undefined && (
                                                      <span className={`font-bold ${item.discrepancy === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                          {item.discrepancy > 0 ? '+' : ''}{item.discrepancy}
                                                      </span>
                                                  )}
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                          <ClipboardCheck size={64} className="opacity-20" />
                          <div className="text-center">
                              <h3 className="text-lg font-bold text-gray-600">Nenhuma Auditoria Ativa</h3>
                              <p className="text-sm max-w-md mx-auto mt-1">Inicie uma nova contagem para verificar a precisão do seu estoque físico.</p>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* TAB: INTELLIGENCE (ANALYTICS) */}
      {viewMode === 'analytics' && (
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-diva-light/30 flex flex-col overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-diva-light/20 bg-gray-50">
                  <h3 className="text-lg font-bold text-diva-dark flex items-center">
                      <TrendingUp size={20} className="mr-2 text-diva-primary" /> Inteligência de Estoque
                  </h3>
                  <p className="text-sm text-gray-500">Previsão de demanda e análise de consumo.</p>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      
                      {/* Forecast Chart */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                              <h4 className="font-bold text-diva-dark text-sm flex items-center">
                                  <Calendar size={16} className="mr-2 text-diva-accent" /> Previsão de Esgotamento (Kit Pós-Laser)
                              </h4>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">Vence em 15 dias</span>
                          </div>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={forecastData}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="day" tick={{fontSize: 12}} />
                                      <YAxis />
                                      <Tooltip />
                                      <Line type="monotone" dataKey="predicted" stroke="#BF784E" strokeDasharray="5 5" strokeWidth={2} name="Previsão" />
                                      <Line type="monotone" dataKey="stock" stroke="#14808C" strokeWidth={3} name="Estoque Real" />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-800 flex gap-2 items-start">
                              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                              <p>Com base na saída média de 1.2 unidades/dia, este item deve acabar em 15 dias. Sugerimos reposição imediata para evitar ruptura.</p>
                          </div>
                      </div>

                      {/* ABC Curve */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <h4 className="font-bold text-diva-dark text-sm mb-6 flex items-center">
                              <BarChart2 size={16} className="mr-2 text-green-600" /> Curva ABC (Importância Financeira)
                          </h4>
                          <div className="h-48 mb-4">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={abcData} layout="vertical">
                                      <XAxis type="number" hide />
                                      <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                                      <Tooltip cursor={{fill: 'transparent'}} />
                                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                          {abcData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                          ))}
                                      </Bar>
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                          <div className="space-y-2">
                              {abcData.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                                          <span className="font-bold text-gray-700">{item.name}</span>
                                      </div>
                                      <span className="text-gray-500">{item.tooltip}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                          <p className="text-xs font-bold text-blue-700 uppercase">Giro de Estoque (Médio)</p>
                          <p className="text-2xl font-bold text-diva-dark mt-1">18 dias</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                          <p className="text-xs font-bold text-green-700 uppercase">Nível de Serviço</p>
                          <p className="text-2xl font-bold text-diva-dark mt-1">98.5%</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                          <p className="text-xs font-bold text-orange-700 uppercase">Capital Parado</p>
                          <p className="text-2xl font-bold text-diva-dark mt-1">{formatCurrency(12500)}</p>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default MarketplaceModule;