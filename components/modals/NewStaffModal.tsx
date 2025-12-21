
import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, MapPin, CreditCard, Briefcase, Clock, DollarSign, Award } from 'lucide-react';
import { StaffMember } from '../../types';
import { useData } from '../context/DataContext';
import { useToast } from '../ui/ToastContext';

interface NewStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingStaff?: StaffMember | null;
}

const NewStaffModal: React.FC<NewStaffModalProps> = ({ isOpen, onClose, editingStaff }) => {
    const { addStaff, updateStaff, services, rooms, serviceCategories } = useData();
    const { addToast } = useToast();

    const initialFormState = {
        name: '',
        email: '',
        phone: '',
        cpf: '',
        address: '',
        signature: '',
        role: '',
        specialties: [] as string[],
        services: [] as string[],
        rooms: [] as string[],
        commissionRate: 10,
        customCommissionRates: {} as { [serviceId: string]: number },
        bankingInfo: {
            bank: '',
            agency: '',
            account: '',
            accountType: 'checking' as 'checking' | 'savings',
            pixKey: '',
            pixKeyType: 'cpf' as 'cpf' | 'email' | 'phone' | 'random'
        },
        workSchedule: {
            monday: { start: '09:00', end: '18:00' },
            tuesday: { start: '09:00', end: '18:00' },
            wednesday: { start: '09:00', end: '18:00' },
            thursday: { start: '09:00', end: '18:00' },
            friday: { start: '09:00', end: '18:00' },
            saturday: { start: '09:00', end: '14:00' },
        }
    };

    const [formData, setFormData] = useState(initialFormState);
    const [activeTab, setActiveTab] = useState<'basic' | 'schedule' | 'services'>('basic');

    useEffect(() => {
        if (isOpen && editingStaff) {
            setFormData({
                name: editingStaff.name,
                email: editingStaff.email || '',
                phone: editingStaff.phone || '',
                cpf: editingStaff.cpf || '',
                address: editingStaff.address || '',
                signature: editingStaff.signature || '',
                role: editingStaff.role,
                specialties: editingStaff.specialties,
                services: editingStaff.services || [],
                rooms: editingStaff.rooms || [],
                commissionRate: editingStaff.commissionRate * 100,
                customCommissionRates: editingStaff.customCommissionRates || {},
                bankingInfo: (editingStaff.bankingInfo || {
                    bank: '',
                    agency: '',
                    account: '',
                    accountType: 'checking' as 'checking' | 'savings',
                    pixKey: '',
                    pixKeyType: 'cpf' as 'cpf' | 'email' | 'phone' | 'random'
                }) as any,
                workSchedule: (editingStaff.workSchedule || initialFormState.workSchedule) as any
            });
        } else if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen, editingStaff]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.role) {
            addToast('Preencha os campos obrigatórios (Nome e Cargo)', 'error');
            return;
        }

        const staffData: Partial<StaffMember> = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            cpf: formData.cpf,
            address: formData.address,
            signature: formData.signature,
            role: formData.role,
            specialties: formData.specialties,
            services: formData.services,
            rooms: formData.rooms,
            commissionRate: formData.commissionRate / 100,
            customCommissionRates: formData.customCommissionRates,
            bankingInfo: formData.bankingInfo,
            workSchedule: formData.workSchedule,
            status: 'available',
            performanceMetrics: {
                monthlyRevenue: 0,
                appointmentsCount: 0,
                averageTicket: 0,
                npsScore: 0
            },
            activeGoals: []
        };

        if (editingStaff) {
            updateStaff(editingStaff.id, staffData);
            addToast(`${formData.name} atualizado com sucesso!`, 'success');
        } else {
            const newStaff: StaffMember = {
                id: `s${Date.now()}`,
                userId: `u_staff_${Date.now()}`,
                ...staffData
            } as StaffMember;
            addStaff(newStaff);
            addToast(`${formData.name} adicionado à equipe!`, 'success');
        }

        onClose();
    };

    const handleSpecialtyToggle = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }));
    };

    const handleServiceToggle = (serviceId: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(serviceId)
                ? prev.services.filter(s => s !== serviceId)
                : [...prev.services, serviceId]
        }));
    };

    const handleRoomToggle = (roomName: string) => {
        setFormData(prev => ({
            ...prev,
            rooms: prev.rooms.includes(roomName)
                ? prev.rooms.filter(r => r !== roomName)
                : [...prev.rooms, roomName]
        }));
    };

    const weekDays = [
        { key: 'monday', label: 'Segunda' },
        { key: 'tuesday', label: 'Terça' },
        { key: 'wednesday', label: 'Quarta' },
        { key: 'thursday', label: 'Quinta' },
        { key: 'friday', label: 'Sexta' },
        { key: 'saturday', label: 'Sábado' },
        { key: 'sunday', label: 'Domingo' }
    ];



    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-diva-primary to-diva-dark text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {editingStaff ? 'Editar Profissional' : 'Novo Profissional'}
                        </h2>
                        <p className="text-sm opacity-90 mt-1">
                            {editingStaff ? 'Atualize as informações do profissional' : 'Cadastre um novo membro da equipe'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50 px-6">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`px-4 py-3 text-sm font-bold transition-colors relative ${activeTab === 'basic' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <User size={16} className="inline mr-2" />
                        Dados Básicos
                        {activeTab === 'basic' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-diva-primary"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`px-4 py-3 text-sm font-bold transition-colors relative ${activeTab === 'schedule' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Clock size={16} className="inline mr-2" />
                        Horários
                        {activeTab === 'schedule' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-diva-primary"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`px-4 py-3 text-sm font-bold transition-colors relative ${activeTab === 'services' ? 'text-diva-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Award size={16} className="inline mr-2" />
                        Serviços & Comissão
                        {activeTab === 'services' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-diva-primary"></div>}
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">

                    {/* Tab: Basic Info */}
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Nome Completo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="Ex: Dra. Julia Martins"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Cargo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="Ex: Biomédica, Esteticista, Recepcionista"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        <Mail size={14} className="inline mr-1" />
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="email@exemplo.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        <Phone size={14} className="inline mr-1" />
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        <CreditCard size={14} className="inline mr-1" />
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cpf}
                                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="000.000.000-00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        <MapPin size={14} className="inline mr-1" />
                                        Endereço
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                        placeholder="Rua, Número, Bairro, Cidade"
                                    />
                                </div>
                            </div>

                            {/* Signature Field - Full Width */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    <Briefcase size={14} className="inline mr-1" />
                                    Carimbo Profissional
                                </label>
                                <input
                                    type="text"
                                    value={formData.signature}
                                    onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diva-primary focus:border-transparent"
                                    placeholder="Ex: Dra Carla Dias - CRM 21452-BA|RQE 15461"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Esta assinatura será usada em documentos, relatórios e receituários. Inclua registros profissionais (CRM, RQE, etc.)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Briefcase size={14} className="inline mr-1" />
                                    Categorias Habilitadas
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {serviceCategories.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => handleSpecialtyToggle(cat.id)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${formData.specialties.includes(cat.id)
                                                ? `${cat.color} text-white border-transparent shadow-sm`
                                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Vincule o profissional às categorias que ele pode realizar.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Tab: Schedule */}
                    {activeTab === 'schedule' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Configure o horário padrão de trabalho. Deixe em branco os dias de folga.
                            </p>
                            {weekDays.map(({ key, label }) => (
                                <div key={key} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-24 font-bold text-gray-700">{label}</div>
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            type="time"
                                            value={formData.workSchedule[key as keyof typeof formData.workSchedule]?.start || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                workSchedule: {
                                                    ...formData.workSchedule,
                                                    [key]: {
                                                        ...formData.workSchedule[key as keyof typeof formData.workSchedule],
                                                        start: e.target.value
                                                    }
                                                }
                                            })}
                                            className="p-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <span className="text-gray-500">até</span>
                                        <input
                                            type="time"
                                            value={formData.workSchedule[key as keyof typeof formData.workSchedule]?.end || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                workSchedule: {
                                                    ...formData.workSchedule,
                                                    [key]: {
                                                        ...formData.workSchedule[key as keyof typeof formData.workSchedule],
                                                        end: e.target.value
                                                    }
                                                }
                                            })}
                                            className="p-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newSchedule = { ...formData.workSchedule };
                                                delete newSchedule[key as keyof typeof formData.workSchedule];
                                                setFormData({ ...formData, workSchedule: newSchedule });
                                            }}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Folga
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tab: Services & Commission */}
                    {activeTab === 'services' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <DollarSign size={14} className="inline mr-1" />
                                    Taxa de Comissão Padrão (%)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        step="1"
                                        value={formData.commissionRate}
                                        onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                                        className="flex-1"
                                    />
                                    <div className="w-20 text-center">
                                        <span className="text-2xl font-bold text-diva-primary">{formData.commissionRate}%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Taxa padrão aplicada aos serviços que não possuem comissão personalizada
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Serviços que Realiza
                                </label>
                                <p className="text-xs text-gray-600 mb-3">
                                    Selecione os serviços e defina a comissão específica para cada um (deixe em branco para usar a taxa padrão)
                                </p>
                                <div className="space-y-2">
                                    {services.map(service => (
                                        <div
                                            key={service.id}
                                            className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-diva-primary transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.services.includes(service.id)}
                                                    onChange={() => handleServiceToggle(service.id)}
                                                    className="mt-1 w-4 h-4 text-diva-primary rounded focus:ring-diva-primary"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{service.name}</div>
                                                    <div className="text-xs text-gray-500">{service.duration}min • R$ {service.price.toFixed(2)}</div>

                                                    {formData.services.includes(service.id) && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <label className="text-xs font-bold text-gray-600 whitespace-nowrap">
                                                                Comissão:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                step="0.5"
                                                                value={formData.customCommissionRates[service.id] || ''}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setFormData({
                                                                        ...formData,
                                                                        customCommissionRates: {
                                                                            ...formData.customCommissionRates,
                                                                            [service.id]: value ? Number(value) : undefined as any
                                                                        }
                                                                    });
                                                                }}
                                                                className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
                                                                placeholder={`${formData.commissionRate}%`}
                                                            />
                                                            <span className="text-xs text-gray-500">
                                                                % {!formData.customCommissionRates[service.id] && `(padrão: ${formData.commissionRate}%)`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Salas de Atendimento
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {rooms.map(room => (
                                        <label
                                            key={room.id}
                                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.rooms.includes(room.name)}
                                                onChange={() => handleRoomToggle(room.name)}
                                                className="mr-3 w-4 h-4 text-diva-primary rounded focus:ring-diva-primary"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{room.name}</div>
                                                <div className="text-xs text-gray-500 capitalize">{room.type}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Selecione as salas onde este profissional pode atender
                                </p>
                            </div>

                            {/* Banking Information */}
                            <div className="border-t border-gray-200 pt-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                    💳 Dados Bancários para Pagamento de Comissões
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Banco</label>
                                        <input
                                            type="text"
                                            value={formData.bankingInfo.bank}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                bankingInfo: { ...formData.bankingInfo, bank: e.target.value }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Ex: Banco do Brasil, Nubank, Inter"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Agência</label>
                                        <input
                                            type="text"
                                            value={formData.bankingInfo.agency}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                bankingInfo: { ...formData.bankingInfo, agency: e.target.value }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Ex: 1234"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Conta</label>
                                        <input
                                            type="text"
                                            value={formData.bankingInfo.account}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                bankingInfo: { ...formData.bankingInfo, account: e.target.value }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Ex: 12345-6"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Tipo de Conta</label>
                                        <select
                                            value={formData.bankingInfo.accountType}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                bankingInfo: { ...formData.bankingInfo, accountType: e.target.value as 'checking' | 'savings' }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                                        >
                                            <option value="checking">Conta Corrente</option>
                                            <option value="savings">Conta Poupança</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Chave PIX</label>
                                        <input
                                            type="text"
                                            value={formData.bankingInfo.pixKey}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                bankingInfo: { ...formData.bankingInfo, pixKey: e.target.value }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="CPF, E-mail, Telefone ou Chave Aleatória"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Tipo de Chave PIX</label>
                                        <select
                                            value={formData.bankingInfo.pixKeyType}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                bankingInfo: { ...formData.bankingInfo, pixKeyType: e.target.value as 'cpf' | 'email' | 'phone' | 'random' }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                                        >
                                            <option value="cpf">CPF</option>
                                            <option value="email">E-mail</option>
                                            <option value="phone">Telefone</option>
                                            <option value="random">Chave Aleatória</option>
                                        </select>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 mt-3">
                                    Estas informações serão usadas para realizar o pagamento das comissões
                                </p>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-diva-primary text-white rounded-lg font-bold hover:bg-diva-dark transition-colors flex items-center"
                    >
                        <Save size={18} className="mr-2" />
                        {editingStaff ? 'Atualizar' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewStaffModal;
