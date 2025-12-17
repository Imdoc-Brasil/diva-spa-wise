import React, { useState, useEffect } from 'react';
import {
    Settings, Users, Building2, Bell, Shield, Wallet,
    CheckCircle, AlertTriangle, ChevronRight, Plus, Search,
    Filter, X, Save, Clock, Trash2, Edit2, AlertCircle, Copy,
    FileText, Check, Activity, BarChart3, Database,
    Smartphone, Mail, Upload, Star, MoreVertical, LayoutGrid, Palette,
    Type, Image as ImageIcon, Globe, Phone, FileCode, Workflow,
    MessageSquare, Send, Calendar, Box, ClipboardList, PenTool
} from 'lucide-react';
import { ProtocolItem, Product, FormTemplate, FormField, FieldType, YieldRule, ServiceDefinition, BusinessConfig, NotificationConfig } from '../../types';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useUnitData } from '../hooks/useUnitData';
import NewServiceModal from '../modals/NewServiceModal';
import NewProductModal from '../modals/NewProductModal';
import StockEntryModal from '../modals/StockEntryModal';
import { useToast } from '../ui/ToastContext';
import { maskPhone } from '../../utils/masks';

// ... (imports)
import { populateDemoData } from '../../utils/demoData';
import { supabase } from '../../services/supabase';
import { useOrganization } from '../context/OrganizationContext';
import { DatabaseZap } from 'lucide-react'; // Icon for the button

// Mock Inventory for Protocol Builder (In real app, this comes from products context)
const mockInventory: Product[] = [
    { id: 'p6', organizationId: 'org_demo', name: 'Gel Condutor Neutro', price: 0, costPrice: 0.05, category: 'professional_use', description: 'Custo por ml' },
    { id: 'inv1', organizationId: 'org_demo', name: 'Luvas de Procedimento (Par)', price: 0, costPrice: 1.50, category: 'professional_use', description: 'Unidade' },
    { id: 'inv2', organizationId: 'org_demo', name: 'Máscara Descartável', price: 0, costPrice: 0.80, category: 'professional_use', description: 'Unidade' },
    { id: 'inv3', organizationId: 'org_demo', name: 'Emoliente Facial (g)', price: 0, costPrice: 0.40, category: 'professional_use', description: 'Custo por grama' },
    { id: 'inv4', organizationId: 'org_demo', name: 'Toxina Botulínica (Unidade)', price: 0, costPrice: 15.00, category: 'professional_use', description: 'Custo por UI' },
];

// Mock Forms and Yield Rules
const mockForms: FormTemplate[] = [
    {
        id: 'f1', organizationId: 'org_demo', title: 'Anamnese Facial Padrão', type: 'anamnesis', active: true, createdAt: '2023-09-01',
        fields: [
            { id: 'field1', type: 'section_header', label: 'Dados Pessoais', required: false, width: 'full' },
            { id: 'field2', type: 'text', label: 'Profissão', required: false, width: 'full' },
            { id: 'field3', type: 'select', label: 'Fototipo (Fitzpatrick)', required: true, options: ['I', 'II', 'III', 'IV', 'V', 'VI'], width: 'half' },
        ]
    }
];

const mockYieldRules: YieldRule[] = [
    { id: 'yr1', organizationId: 'org_demo', name: 'Horário Nobre (Prime Time)', type: 'surge_time', description: 'Aumento de preço em horários de alta procura.', adjustmentPercentage: 15, condition: 'Seg-Sex | 18:00 - 21:00', active: true },
];

const demandData = [
    { time: '08:00', demand: 30 }, { time: '10:00', demand: 50 }, { time: '12:00', demand: 70 },
    { time: '14:00', demand: 40 }, { time: '16:00', demand: 60 }, { time: '18:00', demand: 95 }, { time: '20:00', demand: 80 },
];

const SettingsModule: React.FC = () => {
    const { organization } = useOrganization();
    const {
        services, addService, toggleService, deleteService, updateService,
        taskCategories, addTaskCategory, removeTaskCategory,
        notificationConfig, updateNotificationConfig,
        yieldRules, addYieldRule, updateYieldRule, deleteYieldRule,
        formTemplates, addFormTemplate, updateFormTemplate, deleteFormTemplate,
        selectedUnitId, units, updateUnit, products
    } = useUnitData();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState<'services' | 'supplies' | 'business' | 'notifications' | 'protocols' | 'forms' | 'revenue' | 'operational'>('services');
    const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [isStockEntryModalOpen, setIsStockEntryModalOpen] = useState(false);

    // Filter Products (Professional Use & Home Care can be used in protocols)
    const professionalProducts = products.filter(p => p.category !== 'treatment_package' && p.category !== 'giftcard');

    // Unit Config State
    const currentUnit = units.find(u => u.id === selectedUnitId);

    const ImportDemoDataButton = () => {
        const [loading, setLoading] = useState(false);

        const handleImport = async () => {
            if (!organization) return;
            if (!confirm('Isso irá criar 5 pacientes de exemplo no banco de dados da sua clínica. Continuar?')) return;

            setLoading(true);
            const result = await populateDemoData(supabase, organization.id);
            setLoading(false);

            if (result.success) {
                addToast(result.message, 'success');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                addToast(result.message, 'error');
            }
        };

        if (organization?.slug === 'demo') return null;

        return (
            <button
                onClick={handleImport}
                disabled={loading}
                className="bg-purple-100 text-purple-700 border border-purple-200 px-4 py-3 rounded-lg font-bold flex items-center hover:bg-purple-200 transition-all"
            >
                <DatabaseZap size={18} className={`mr-2 ${loading ? 'animate-pulse' : ''}`} />
                {loading ? 'Importando...' : 'Importar Dados Exemplo'}
            </button>
        );
    };

    const [localUnitConfig, setLocalUnitConfig] = useState({
        name: '',
        phone: '',
        email: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: ''
    });

    useEffect(() => {
        if (currentUnit) {
            setLocalUnitConfig({
                name: currentUnit.name,
                phone: currentUnit.contact?.phone || '',
                email: currentUnit.contact?.email || '',
                street: currentUnit.address?.street || '',
                number: currentUnit.address?.number || '',
                neighborhood: currentUnit.address?.neighborhood || '',
                city: currentUnit.address?.city || '',
                state: currentUnit.address?.state || ''
            });
        }
    }, [currentUnit, selectedUnitId]);

    const [localNotificationConfig, setLocalNotificationConfig] = useState<NotificationConfig>(notificationConfig);

    // Protocol State
    const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
    const [protocolItems, setProtocolItems] = useState<{ productId: string, productName: string, quantity: number, unitCost: number, unit: string }[]>([]);

    useEffect(() => {
        if (selectedServiceId) {
            const service = services.find(s => s.id === selectedServiceId);
            if (service && service.protocol) {
                setProtocolItems(service.protocol);
            } else {
                setProtocolItems([]);
            }
        }
    }, [selectedServiceId, services]);

    const [laborCost, setLaborCost] = useState(30);
    const [taxRate, setTaxRate] = useState(6);
    const [otherCosts, setOtherCosts] = useState(15);

    // Form Builder State
    const [editingForm, setEditingForm] = useState<FormTemplate | null>(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

    // Operational Category State
    const [newCategoryName, setNewCategoryName] = useState('');

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // Update local state when global changes (e.g. initial load)
    // Removed businessConfig effect as we now use unit specific data

    useEffect(() => {
        setLocalNotificationConfig(notificationConfig);
    }, [notificationConfig]);

    // --- Business Logic ---
    const handleSaveBusiness = () => {
        if (selectedUnitId && selectedUnitId !== 'all' && currentUnit) {
            updateUnit(selectedUnitId, {
                name: localUnitConfig.name,
                contact: {
                    ...currentUnit.contact,
                    phone: localUnitConfig.phone,
                    email: localUnitConfig.email
                },
                address: {
                    ...currentUnit.address,
                    street: localUnitConfig.street,
                    number: localUnitConfig.number,
                    neighborhood: localUnitConfig.neighborhood,
                    city: localUnitConfig.city,
                    state: localUnitConfig.state,
                    zipCode: currentUnit.address?.zipCode || '',
                    country: currentUnit.address?.country || 'Brasil'
                }
            });
            addToast('Dados da unidade atualizados com sucesso!', 'success');
        }
    };

    const handleSaveNotifications = () => {
        updateNotificationConfig(localNotificationConfig);
    };

    // --- Protocol Logic ---
    const handleAddItem = (prod: Product) => {
        const newItem: ProtocolItem = {
            productId: prod.id,
            productName: prod.name,
            quantity: 1,
            unit: 'un',
            unitCost: prod.costPrice || 0
        };
        setProtocolItems([...protocolItems, newItem]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...protocolItems];
        newItems.splice(index, 1);
        setProtocolItems(newItems);
    };

    const handleUpdateQuantity = (idx: number, qty: number) => {
        setProtocolItems(protocolItems.map((item, i) => i === idx ? { ...item, quantity: qty } : item));
    };

    const handleSaveProtocol = () => {
        if (!selectedServiceId) return;
        updateService(selectedServiceId, { protocol: protocolItems });
        addToast('Ficha técnica salva com sucesso!', 'success');
    };

    // Calculations for Protocol
    const selectedService = services.find(s => s.id === selectedServiceId);
    const productCost = protocolItems.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
    const taxCost = selectedService ? selectedService.price * (taxRate / 100) : 0;
    const totalCost = productCost + laborCost + taxCost + otherCosts;
    const profit = selectedService ? selectedService.price - totalCost : 0;
    const margin = selectedService ? (profit / selectedService.price) * 100 : 0;

    const costDistribution = [
        { name: 'Produtos (CMV)', value: productCost, color: '#BF784E' },
        { name: 'Mão de Obra', value: laborCost, color: '#14808C' },
        { name: 'Impostos', value: taxCost, color: '#94a3b8' },
        { name: 'Operacional', value: otherCosts, color: '#64748B' },
    ];

    // --- Form Builder Logic ---
    const createNewForm = () => {
        const newForm: FormTemplate = {
            id: `form_${Date.now()}`,
            organizationId: organization?.id || 'org_demo',
            title: 'Novo Formulário',
            type: 'anamnesis',
            active: true,
            createdAt: new Date().toISOString(),
            fields: []
        };
        addFormTemplate(newForm);
        setEditingForm(newForm);
    };
    const addNewYieldRule = () => {
        const name = prompt('Nome da regra');
        if (!name) return;
        const type = prompt('Tipo (surge_time, last_minute, seasonality)') as any;
        const description = prompt('Descrição') || '';
        const adjustmentStr = prompt('Ajuste percentual (ex: 15 ou -20)') || '0';
        const adjustment = Number(adjustmentStr);
        const condition = prompt('Condição (ex: time_range:18:00-21:00)') || '';
        const newRule: YieldRule = {
            id: `yr${Date.now()}`,
            organizationId: organization?.id || 'org_demo',
            name,
            type,
            description,
            adjustmentPercentage: adjustment,
            condition,
            active: true
        };
        addYieldRule(newRule);
    };
    // ... (Field logic kept same as before for brevity, focused on core integration) ...
    const addField = (type: FieldType) => {
        if (!editingForm) return;
        const newField: FormField = {
            id: `field_${Date.now()}`,
            type,
            label: type === 'section_header' ? 'Nova Seção' : 'Novo Campo',
            required: false,
            width: 'full',
            options: type === 'select' ? ['Opção 1', 'Opção 2'] : undefined
        };
        setEditingForm({ ...editingForm, fields: [...editingForm.fields, newField] });
    };
    // ... (Other form methods removed to save space, logic is local anyway) ...

    const saveForm = () => {
        if (!editingForm) return;

        // Validação básica
        if (!editingForm.title.trim()) {
            addToast('O formulário precisa ter um título.', 'warning');
            return;
        }

        if (editingForm.fields.length === 0) {
            addToast('Adicione pelo menos um campo ao formulário.', 'warning');
            return;
        }

        updateFormTemplate(editingForm.id, editingForm);
        setEditingForm(null);
    };

    const duplicateForm = () => {
        if (!editingForm) return;
        const duplicated: FormTemplate = {
            ...editingForm,
            id: `form_${Date.now()}`,
            title: `${editingForm.title} (Cópia)`,
            createdAt: new Date().toISOString(),
            active: false
        };
        addFormTemplate(duplicated);
        setEditingForm(duplicated);
    };

    const getFieldIcon = (type: FieldType) => {
        switch (type) {
            case 'text': return <Type size={16} />;
            case 'section_header': return <Type size={16} className="font-bold" />;
            default: return <Type size={16} />;
        }
    };

    // Category Logic
    const handleAddCategory = () => {
        if (!newCategoryName) return;
        addTaskCategory(newCategoryName);
        setNewCategoryName('');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
                <h2 className="text-xl font-serif font-bold text-diva-dark mb-4 px-2">Configurações</h2>

                <button onClick={() => setActiveTab('services')} className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'services' ? 'bg-diva-primary text-white shadow-md' : 'text-gray-600 hover:bg-diva-light/20'}`}>
                    <Briefcase size={18} className="mr-3" /> Catálogo de Serviços
                </button>

                <button onClick={() => setActiveTab('protocols')} className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'protocols' ? 'bg-diva-primary text-white shadow-md' : 'text-gray-600 hover:bg-diva-light/20'}`}>
                    <Database size={18} className="mr-3" /> Fichas Técnicas
                </button>

                <button onClick={() => setActiveTab('supplies')} className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'supplies' ? 'bg-diva-primary text-white shadow-md' : 'text-gray-600 hover:bg-diva-light/20'}`}>
                    <Package size={18} className="mr-3" /> Insumos & Estoque
                </button>

                <button onClick={() => setActiveTab('revenue')} className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'revenue' ? 'bg-diva-primary text-white shadow-md' : 'text-gray-600 hover:bg-diva-light/20'}`}>
                    <TrendingUp size={18} className="mr-3" /> Smart Pricing (Yield)
                </button>

                <button onClick={() => setActiveTab('forms')} className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'forms' ? 'bg-diva-primary text-white shadow-md' : 'text-gray-600 hover:bg-diva-light/20'}`}>
                    <FilePlus size={18} className="mr-3" /> Formulários Clínicos
                </button>

                <button onClick={() => setActiveTab('operational')} className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'operational' ? 'bg-diva-primary text-white shadow-md' : 'text-gray-600 hover:bg-diva-light/20'}`}>
                    <ClipboardList size={18} className="mr-3" /> Categorias & Ops
                </button>

                <button onClick={() => setActiveTab('business')} className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'business' ? 'bg-diva-primary text-white shadow-md' : 'text-gray-600 hover:bg-diva-light/20'}`}>
                    <SettingsIcon size={18} className="mr-3" /> Dados da Unidade
                </button>

                <button onClick={() => setActiveTab('notifications')} className={`text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'notifications' ? 'bg-diva-primary text-white shadow-md' : 'text-gray-600 hover:bg-diva-light/20'}`}>
                    <MessageSquare size={18} className="mr-3" /> Notificações
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-diva-light/30 p-8 overflow-hidden flex flex-col">

                {/* TAB: SERVICES (Global Connected) */}
                {activeTab === 'services' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center border-b border-diva-light/20 pb-6">
                            <div>
                                <h3 className="text-lg font-bold text-diva-dark">Menu de Tratamentos</h3>
                                <p className="text-sm text-gray-500">Defina os serviços, preços e tempos de agenda.</p>
                            </div>
                            <button
                                onClick={() => setIsNewServiceModalOpen(true)}
                                className="bg-diva-dark text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-opacity-90"
                            >
                                <Plus size={16} className="mr-2" /> Novo Serviço
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {services.map(service => (
                                <div key={service.id} className={`p-4 rounded-lg border flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${service.active ? 'bg-white border-diva-light/30' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                        ${service.category === 'laser' ? 'bg-diva-primary' : service.category === 'esthetics' ? 'bg-pink-400' : 'bg-diva-accent'}`}>
                                            {service.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-diva-dark">{service.name}</h4>
                                            <div className="flex items-center text-xs text-gray-500 gap-3 mt-1">
                                                <span className="flex items-center"><Clock size={12} className="mr-1" /> {service.duration} min</span>
                                                <span className="uppercase bg-gray-100 px-1.5 py-0.5 rounded">{service.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {service.loyaltyPoints ? (
                                            <div className="text-right hidden md:block">
                                                <p className="text-xs text-gray-400 uppercase font-bold flex items-center justify-end"><Star size={10} className="mr-1" /> Pontos</p>
                                                <p className="font-bold text-diva-accent">{service.loyaltyPoints}</p>
                                            </div>
                                        ) : null}

                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase font-bold">Valor</p>
                                            <p className="font-mono font-bold text-diva-dark">{formatCurrency(service.price)}</p>
                                        </div>

                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={service.active} onChange={() => toggleService(service.id)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-diva-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-diva-primary"></div>
                                        </label>

                                        <button
                                            onClick={() => { if (confirm('Excluir serviço?')) deleteService(service.id) }}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {services.length === 0 && <p className="text-center text-gray-400 italic py-8">Nenhum serviço cadastrado.</p>}
                        </div>
                    </div>
                )}

                {/* TAB: SUPPLIES (Professional Use Products) */}
                {activeTab === 'supplies' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center border-b border-diva-light/20 pb-6">
                            <div>
                                <h3 className="text-lg font-bold text-diva-dark">Insumos e Estoque</h3>
                                <p className="text-sm text-gray-500">Gerencie o catálogo e faça entradas de nota fiscal.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsStockEntryModalOpen(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-green-700 shadow-sm"
                                >
                                    <ClipboardList size={16} className="mr-2" /> Entrada de Nota
                                </button>
                                <button
                                    onClick={() => {
                                        setProductToEdit(null); // Clear any previous product for editing
                                        setIsProductModalOpen(true);
                                    }}
                                    className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-opacity-90 shadow-sm"
                                >
                                    <Plus size={16} className="mr-2" /> Novo Produto
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-gray-50 rounded-lg border border-gray-200">
                            <table className="w-full text-left">
                                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                        <th className="px-6 py-4">Produto / Apresentação</th>
                                        <th className="px-6 py-4">Princípios Ativos</th>
                                        <th className="px-6 py-4">Estoque Atual</th>
                                        <th className="px-6 py-4 text-right">Custo Médio</th>
                                        <th className="px-6 py-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {professionalProducts.map(prod => (
                                        <tr key={prod.id} className="hover:bg-white transition-colors group">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-diva-dark">{prod.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{prod.presentation || 'Unidade'}</span>
                                                    {prod.contentQuantity && (
                                                        <span>
                                                            Contém {prod.contentQuantity} {prod.contentUnit}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {prod.activeIngredients ? (
                                                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium border border-purple-100">
                                                        {prod.activeIngredients}
                                                    </span>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${!prod.stock || prod.stock <= (prod.minStockLevel || 5) ? 'text-red-500' : 'text-green-600'}`}>
                                                    {prod.stock || 0} <span className="text-xs font-normal text-gray-400">{prod.contentUnit || 'un'}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-gray-600">
                                                {formatCurrency(prod.costPrice || 0)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setProductToEdit(prod);
                                                        setIsProductModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-diva-primary hover:bg-diva-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Editar Produto"
                                                >
                                                    <PenTool size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {professionalProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12 text-gray-400 italic">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Package size={32} className="opacity-20" />
                                                    <p>Nenhum produto no catálogo.</p>
                                                    <button onClick={() => setIsProductModalOpen(true)} className="text-diva-primary font-bold underline text-xs">Cadastrar Primeiro Produto</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
                }

                {/* TAB: BUSINESS CONFIG (Unit Specific) */}
                {
                    activeTab === 'business' && (
                        <div className="space-y-8 animate-in fade-in">
                            <div className="border-b border-diva-light/20 pb-6">
                                <h3 className="text-lg font-bold text-diva-dark">Dados da Unidade</h3>
                                <p className="text-sm text-gray-500">Informações visíveis no agendamento e rodapé de recibos.</p>
                            </div>

                            {selectedUnitId === 'all' ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <AlertCircle size={48} className="text-gray-400 mb-4" />
                                    <h4 className="text-lg font-bold text-gray-600">Selecione uma Unidade</h4>
                                    <p className="text-sm text-gray-500 max-w-md mt-2">
                                        Para editar os dados operacionais (endereço, telefone, etc.), selecione uma unidade específica no menu superior.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-diva-dark">Nome da Unidade</label>
                                            <input
                                                type="text"
                                                value={localUnitConfig.name}
                                                onChange={(e) => setLocalUnitConfig({ ...localUnitConfig, name: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-diva-primary bg-white text-gray-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-diva-dark">Telefone/WhatsApp</label>
                                            <input
                                                type="text"
                                                value={localUnitConfig.phone}
                                                onChange={(e) => setLocalUnitConfig({ ...localUnitConfig, phone: maskPhone(e.target.value) })}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-diva-primary bg-white text-gray-900"
                                                maxLength={15} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-diva-dark">Endereço (Rua)</label>
                                            <input
                                                type="text"
                                                value={localUnitConfig.street}
                                                onChange={(e) => setLocalUnitConfig({ ...localUnitConfig, street: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-diva-primary bg-white text-gray-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-diva-dark">Número</label>
                                            <input
                                                type="text"
                                                value={localUnitConfig.number}
                                                onChange={(e) => setLocalUnitConfig({ ...localUnitConfig, number: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-diva-primary bg-white text-gray-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-diva-dark">Bairro</label>
                                            <input
                                                type="text"
                                                value={localUnitConfig.neighborhood}
                                                onChange={(e) => setLocalUnitConfig({ ...localUnitConfig, neighborhood: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-diva-primary bg-white text-gray-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-diva-dark">Cidade</label>
                                            <input
                                                type="text"
                                                value={localUnitConfig.city}
                                                onChange={(e) => setLocalUnitConfig({ ...localUnitConfig, city: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-diva-primary bg-white text-gray-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-diva-dark">Estado</label>
                                            <input
                                                type="text"
                                                value={localUnitConfig.state}
                                                onChange={(e) => setLocalUnitConfig({ ...localUnitConfig, state: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-diva-primary bg-white text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 gap-4">
                                        <button
                                            onClick={async () => {
                                                if (confirm('Deseja importar 5 pacientes de exemplo para sua clínica?')) {
                                                    const { populateDemoData } = await import('../../utils/demoData');
                                                    const { supabase } = await import('../../services/supabase');
                                                    // We need the org ID. Since we are in a module, we can try to get it from context or pass it.
                                                    // Assuming we can access the current unit's orgId or just rely on the one in context.
                                                    // For now, let's grab it from the currentUnit if available, or fetch it.
                                                    // A safer way is to use the hook, but we can't use hooks inside callback.
                                                    // Let's use the unit's org id if plausible, or getting it from local storage as fallback/hack or strict context.
                                                    // Actually, let's add the hook at top level.
                                                }
                                                // See below for the real implementation inside the component body
                                            }}
                                            className="hidden"
                                        >
                                        </button>

                                        <ImportDemoDataButton />

                                        <button
                                            onClick={handleSaveBusiness}
                                            className="bg-diva-primary text-white px-6 py-3 rounded-lg font-bold flex items-center hover:bg-diva-dark shadow-md transition-all"
                                        >
                                            <Save size={18} className="mr-2" /> Salvar Alterações
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )
                }

                {/* TAB: NOTIFICATIONS (Global Connected) */}
                {
                    activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="border-b border-diva-light/20 pb-6">
                                <h3 className="text-lg font-bold text-diva-dark">Comunicação Automática</h3>
                                <p className="text-sm text-gray-500">Personalize as mensagens enviadas via WhatsApp para seus clientes.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-diva-dark text-sm">Confirmação de Agendamento</h4>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Ativo</span>
                                    </div>
                                    <textarea
                                        className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-1 focus:ring-diva-primary outline-none resize-none"
                                        value={localNotificationConfig.appointmentConfirmation}
                                        onChange={(e) => setLocalNotificationConfig({ ...localNotificationConfig, appointmentConfirmation: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-diva-dark text-sm">Lembrete (24h antes)</h4>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Ativo</span>
                                    </div>
                                    <textarea
                                        className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-1 focus:ring-diva-primary outline-none resize-none"
                                        value={localNotificationConfig.appointmentReminder}
                                        onChange={(e) => setLocalNotificationConfig({ ...localNotificationConfig, appointmentReminder: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleSaveNotifications}
                                    className="bg-diva-primary text-white px-6 py-3 rounded-lg font-bold flex items-center hover:bg-diva-dark shadow-md transition-all"
                                >
                                    <Save size={18} className="mr-2" /> Salvar Modelos
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* TAB: PROTOCOLS (Partially Connected) */}
                {
                    activeTab === 'protocols' && (
                        <div className="flex flex-col h-full animate-in fade-in">
                            <div className="border-b border-diva-light/20 pb-6 mb-6">
                                <h3 className="text-lg font-bold text-diva-dark">Fichas Técnicas (Engenharia de Menu)</h3>
                                <p className="text-sm text-gray-500">Defina a composição de custos e insumos para cada serviço.</p>
                            </div>

                            <div className="flex flex-col xl:flex-row gap-8 flex-1">
                                {/* LEFT: Selector & Builder */}
                                <div className="flex-1 flex flex-col gap-6">
                                    {/* Service Selector */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Selecione o Serviço</label>
                                        <select
                                            value={selectedServiceId}
                                            onChange={(e) => setSelectedServiceId(e.target.value)}
                                            className="w-full p-3 border border-diva-light/40 rounded-lg text-sm font-bold text-diva-dark outline-none focus:border-diva-primary bg-white"
                                        >
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} - {formatCurrency(s.price)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Consumables List */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-diva-dark text-sm">Insumos e Produtos (CMV)</h4>
                                            <div className="relative group">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setIsProductModalOpen(true)}
                                                        className="text-xs bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                                                        title="Cadastrar Novo Insumo"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                    <button className="text-xs bg-white border border-diva-primary text-diva-primary px-2 py-1 rounded hover:bg-diva-primary hover:text-white transition-colors">
                                                        + Adicionar Item
                                                    </button>
                                                </div>

                                                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 shadow-xl rounded-lg hidden group-hover:block z-10 max-h-48 overflow-y-auto">
                                                    {professionalProducts.length > 0 ? professionalProducts.map(item => (
                                                        <div
                                                            key={item.id}
                                                            onClick={() => handleAddItem(item)}
                                                            className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 text-xs"
                                                        >
                                                            <p className="font-bold text-gray-700">{item.name}</p>
                                                            <p className="text-gray-400">Custo: {formatCurrency(item.costPrice || 0)}</p>
                                                        </div>
                                                    )) : (
                                                        <div className="p-4 text-center">
                                                            <p className="text-xs text-gray-400 mb-2">Nenhum insumo cadastrado.</p>
                                                            <button
                                                                onClick={() => setIsProductModalOpen(true)}
                                                                className="text-xs text-diva-primary font-bold underline"
                                                            >
                                                                Cadastrar Insumo
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[200px] pr-2">
                                            {protocolItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-sm">
                                                    <span className="flex-1 truncate pr-2 text-gray-700 font-medium">{item.productName}</span>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleUpdateQuantity(idx, parseFloat(e.target.value))}
                                                            className="w-16 p-1 border border-gray-300 rounded text-center text-xs outline-none"
                                                        />
                                                        <span className="text-xs text-gray-400 w-6">{item.unit}</span>
                                                        <span className="text-xs font-mono w-16 text-right">{formatCurrency(item.quantity * item.unitCost)}</span>
                                                        <button onClick={() => handleRemoveItem(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                            {protocolItems.length === 0 && (
                                                <p className="text-xs text-gray-400 text-center py-4 italic">Nenhum insumo adicionado.</p>
                                            )}
                                        </div>
                                        <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                                            <button
                                                onClick={handleSaveProtocol}
                                                className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-diva-dark transition-colors flex items-center shadow-sm"
                                            >
                                                <Save size={16} className="mr-2" /> Salvar Protocolo
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Analysis Card */}
                                <div className="w-full xl:w-80 bg-diva-light/10 rounded-xl border border-diva-light/30 p-6 flex flex-col h-full">
                                    <h4 className="font-serif font-bold text-diva-dark text-lg mb-6 flex items-center">
                                        <PieChart size={18} className="mr-2 text-diva-primary" /> Análise de Margem
                                    </h4>

                                    <div className="flex-1 flex flex-col items-center justify-center mb-6 relative">
                                        <div className="w-48 h-48 relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RePieChart>
                                                    <Pie data={costDistribution} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                                                        {costDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                    </Pie>
                                                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                                                </RePieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-xs text-gray-500 font-bold uppercase">Custo Total</span>
                                                <span className="text-xl font-bold text-diva-dark">{formatCurrency(totalCost)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Preço de Venda</span>
                                            <span className="font-bold text-diva-dark">{formatCurrency(selectedService?.price || 0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>Produtos</span>
                                            <span>{formatCurrency(productCost)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-diva-light/20">
                                            <span className="font-bold text-diva-primary">Margem</span>
                                            <span className={`font-bold px-2 py-0.5 rounded ${margin < 30 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                {margin.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full mt-auto bg-diva-primary text-white py-3 rounded-xl font-bold shadow-md hover:bg-diva-dark transition-all flex items-center justify-center"
                                        onClick={() => addToast('Ficha técnica salva (Simulado)', 'success')}
                                    >
                                        <Save size={18} className="mr-2" /> Salvar Ficha
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* TAB: OPERATIONAL (Global Connected) */}
                {
                    activeTab === 'operational' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="border-b border-diva-light/20 pb-6">
                                <h3 className="text-lg font-bold text-diva-dark">Categorias de Tarefas</h3>
                                <p className="text-sm text-gray-500">Gerencie as categorias usadas no módulo de Operações e Tarefas.</p>
                            </div>

                            <div className="max-w-md">
                                <div className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Nova Categoria (ex: Marketing)"
                                        className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:border-diva-primary bg-white text-gray-900"
                                    />
                                    <button
                                        onClick={handleAddCategory}
                                        className="bg-diva-primary text-white px-4 rounded-lg font-bold hover:bg-diva-dark"
                                    >
                                        Adicionar
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {taskCategories.map(cat => (
                                        <div key={cat} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 group">
                                            <span className="text-diva-dark font-medium">{cat}</span>
                                            <button
                                                onClick={() => removeTaskCategory(cat)}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'forms' && (
                        <div className="flex flex-col h-full animate-in fade-in">
                            <div className="border-b border-diva-light/20 pb-6 mb-6 flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-diva-dark">Formulários Clínicos</h3>
                                    <p className="text-sm text-gray-500 mb-2">Crie modelos de anamnese e termos de consentimento.</p>
                                    <div className="flex gap-4 text-xs">
                                        <span className="text-gray-600">
                                            <strong className="text-diva-primary">{formTemplates.length}</strong> formulários
                                        </span>
                                        <span className="text-gray-600">
                                            <strong className="text-green-600">{formTemplates.filter(f => f.active).length}</strong> ativos
                                        </span>
                                        <span className="text-gray-600">
                                            <strong className="text-gray-400">{formTemplates.filter(f => f.fields.length === 0).length}</strong> sem campos
                                        </span>
                                    </div>
                                </div>
                                <button onClick={createNewForm} className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-diva-dark flex items-center">
                                    <Plus size={16} className="mr-2" /> Novo Modelo
                                </button>
                            </div>

                            <div className="flex gap-8 h-full">
                                {/* Templates List */}
                                <div className="w-64 shrink-0 space-y-3">
                                    {formTemplates.map(form => (
                                        <div
                                            key={form.id}
                                            className={`p-4 rounded-xl border transition-all ${editingForm?.id === form.id ? 'bg-diva-primary text-white shadow-md border-diva-primary' : 'bg-white border-gray-200 hover:border-diva-primary text-diva-dark'}`}
                                        >
                                            <div
                                                onClick={() => setEditingForm(form)}
                                                className="cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-sm">{form.title}</h4>
                                                    {form.active && <div className={`w-2 h-2 rounded-full ${editingForm?.id === form.id ? 'bg-white' : 'bg-green-500'}`}></div>}
                                                </div>
                                                <p className={`text-xs ${editingForm?.id === form.id ? 'text-white/80' : 'text-gray-400'}`}>
                                                    {form.type === 'anamnesis' ? 'Anamnese' : form.type === 'consent' ? 'Termo' : 'Evolução'} • {form.fields.length} campos
                                                </p>
                                            </div>
                                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200/20">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateFormTemplate(form.id, { active: !form.active });
                                                    }}
                                                    className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${form.active
                                                        ? (editingForm?.id === form.id ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-green-50 text-green-600 hover:bg-green-100')
                                                        : (editingForm?.id === form.id ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')
                                                        }`}
                                                >
                                                    {form.active ? 'Ativo' : 'Inativo'}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm(`Tem certeza que deseja excluir o formulário "${form.title}"?`)) {
                                                            deleteFormTemplate(form.id);
                                                            if (editingForm?.id === form.id) {
                                                                setEditingForm(null);
                                                            }
                                                        }
                                                    }}
                                                    className={`px-3 py-1.5 rounded text-xs transition-colors ${editingForm?.id === form.id
                                                        ? 'bg-white/20 text-white hover:bg-red-500'
                                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        }`}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Builder Area */}
                                <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col overflow-hidden">
                                    {editingForm ? (
                                        <>
                                            <div className="flex gap-4 mb-6">
                                                <input
                                                    type="text"
                                                    value={editingForm.title}
                                                    onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })}
                                                    className="flex-1 p-3 border border-gray-300 rounded-lg font-bold text-diva-dark outline-none focus:border-diva-primary"
                                                    placeholder="Título do Formulário"
                                                />
                                                <select
                                                    value={editingForm.type}
                                                    onChange={(e) => setEditingForm({ ...editingForm, type: e.target.value as any })}
                                                    className="p-3 border border-gray-300 rounded-lg text-sm outline-none bg-white"
                                                >
                                                    <option value="anamnesis">Anamnese</option>
                                                    <option value="consent">Termo de Consentimento</option>
                                                    <option value="evolution">Evolução</option>
                                                </select>
                                            </div>

                                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                                                {editingForm.fields.map((field, idx) => (
                                                    <div
                                                        key={field.id}
                                                        onClick={() => setSelectedFieldId(field.id)}
                                                        className={`p-4 rounded-lg border bg-white group relative transition-all ${selectedFieldId === field.id ? 'ring-2 ring-diva-primary border-transparent' : 'border-gray-200 hover:border-diva-light'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-gray-400 cursor-move"><AlignLeft size={16} /></div>
                                                            <div className="flex-1">
                                                                {field.type === 'section_header' ? (
                                                                    <input
                                                                        type="text"
                                                                        value={field.label}
                                                                        onChange={(e) => {
                                                                            const newFields = [...editingForm.fields];
                                                                            newFields[idx].label = e.target.value;
                                                                            setEditingForm({ ...editingForm, fields: newFields });
                                                                        }}
                                                                        className="w-full font-bold text-lg text-diva-dark border-none focus:ring-0 p-0 bg-transparent placeholder-gray-300"
                                                                        placeholder="Nome da Seção"
                                                                    />
                                                                ) : (
                                                                    <div className="flex flex-col gap-1">
                                                                        <input
                                                                            type="text"
                                                                            value={field.label}
                                                                            onChange={(e) => {
                                                                                const newFields = [...editingForm.fields];
                                                                                newFields[idx].label = e.target.value;
                                                                                setEditingForm({ ...editingForm, fields: newFields });
                                                                            }}
                                                                            className="w-full font-medium text-sm text-gray-700 border-none focus:ring-0 p-0 bg-transparent"
                                                                        />
                                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                            {getFieldIcon(field.type)} {field.type}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const newFields = editingForm.fields.filter((_, i) => i !== idx);
                                                                    setEditingForm({ ...editingForm, fields: newFields });
                                                                }}
                                                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {editingForm.fields.length === 0 && (
                                                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                                        <p>Arraste campos ou clique abaixo para adicionar</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-4 gap-2 mb-4">
                                                <button onClick={() => addField('text')} className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-xs font-medium text-gray-600 flex flex-col items-center gap-1">
                                                    <Type size={16} /> Texto Curto
                                                </button>
                                                <button onClick={() => addField('textarea')} className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-xs font-medium text-gray-600 flex flex-col items-center gap-1">
                                                    <AlignLeft size={16} /> Texto Longo
                                                </button>
                                                <button onClick={() => addField('select')} className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-xs font-medium text-gray-600 flex flex-col items-center gap-1">
                                                    <CheckSquare size={16} /> Seleção
                                                </button>
                                                <button onClick={() => addField('section_header')} className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-xs font-medium text-gray-600 flex flex-col items-center gap-1">
                                                    <Type size={16} className="font-bold" /> Seção
                                                </button>
                                            </div>

                                            <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
                                                <button
                                                    onClick={duplicateForm}
                                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 flex items-center text-sm"
                                                >
                                                    <Plus size={16} className="mr-2" /> Duplicar
                                                </button>
                                                <button onClick={saveForm} className="bg-diva-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-diva-dark flex items-center">
                                                    <Save size={16} className="mr-2" /> Salvar Modelo
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                            <FilePlus size={48} className="mb-4 opacity-50" />
                                            <p>Selecione um modelo ou crie um novo</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    activeTab === 'revenue' && (
                        <div className="flex flex-col h-full animate-in fade-in">
                            <div className="border-b border-diva-light/20 pb-6 mb-6">
                                <h3 className="text-lg font-bold text-diva-dark">Smart Pricing (Yield Management)</h3>
                                <p className="text-sm text-gray-500">Configure regras de preços dinâmicos baseados na demanda.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Rules List */}
                                <div className="lg:col-span-1 space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-diva-dark text-sm">Regras Ativas</h4>
                                        <button className="text-xs text-diva-primary font-bold hover:underline" onClick={addNewYieldRule}>+ Nova Regra</button>
                                    </div>
                                    {yieldRules.map(rule => (
                                        <div key={rule.id} className="bg-white p-4 rounded-xl border border-diva-light/30 shadow-sm hover:border-diva-primary transition-colors cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Zap size={16} className="text-yellow-500 fill-current" />
                                                    <h5 className="font-bold text-diva-dark text-sm">{rule.name}</h5>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={rule.active} onChange={() => updateYieldRule(rule.id, { active: !rule.active })} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-diva-primary"></div>
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-3">{rule.description}</p>
                                            <div className="flex gap-2 text-[10px] font-bold uppercase text-gray-400">
                                                <span className="bg-gray-100 px-2 py-1 rounded">{rule.condition}</span>
                                                <span className="bg-green-50 text-green-600 px-2 py-1 rounded">+{rule.adjustmentPercentage}% Valor</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Analytics Preview */}
                                <div className="lg:col-span-2 bg-gray-50 rounded-xl border border-gray-200 p-6">
                                    <h4 className="font-bold text-diva-dark mb-6 flex items-center">
                                        <TrendingUp size={18} className="mr-2 text-diva-primary" /> Previsão de Demanda (Hoje)
                                    </h4>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={demandData}>
                                                <defs>
                                                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#BF784E" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#BF784E" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(val: number) => [`${val}%`, 'Ocupação Prevista']}
                                                />
                                                <Area type="monotone" dataKey="demand" stroke="#BF784E" fillOpacity={1} fill="url(#colorDemand)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 p-4 bg-white rounded-lg border border-diva-light/20 flex items-start gap-3">
                                        <AlertCircle size={20} className="text-diva-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-diva-dark">Sugestão do Algoritmo</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Alta procura prevista entre 18:00 e 20:00. A regra <strong>Horário Nobre</strong> será ativada automaticamente, aplicando +15% nos valores de agendamento para este período.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

            </div >

            <NewServiceModal
                isOpen={isNewServiceModalOpen}
                onClose={() => setIsNewServiceModalOpen(false)}
                onSave={addService}
            />
            <NewProductModal
                isOpen={isProductModalOpen}
                onClose={() => {
                    setIsProductModalOpen(false);
                    setProductToEdit(null);
                }}
                productToEdit={productToEdit}
            />
            <StockEntryModal
                isOpen={isStockEntryModalOpen}
                onClose={() => setIsStockEntryModalOpen(false)}
            />
        </div >
    );
};

export default SettingsModule;
