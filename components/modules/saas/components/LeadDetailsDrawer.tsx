import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Phone, Mail, MapPin, Calendar, CheckCircle, Clock,
    MoreHorizontal, Plus, Star, Zap, Crown, Trash2,
    MessageSquare, History, Edit3, Save, ExternalLink, DollarSign
} from 'lucide-react';
import {
    SaaSLead, SaaSLeadStage, SaaSPlan, SaaSTask,
    SaaSTaskType, BRAZIL_STATES
} from '@/types';
import { maskPhone, maskCEP } from '../../../../utils/masks';
import { SAAS_PLANS_CONFIG } from '../saasPlans';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeadDetailsDrawerProps {
    lead: SaaSLead | null;
    onClose: () => void;
    onUpdate: (id: string, data: Partial<SaaSLead>) => void;
    onAddTask: (task: Omit<SaaSTask, 'id'>) => void;
    onToggleTask: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
    onStartClosing: (lead: SaaSLead) => void;
}

export function LeadDetailsDrawer({
    lead, onClose, onUpdate, onAddTask, onToggleTask, onDeleteTask, onStartClosing
}: LeadDetailsDrawerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<SaaSLead>>({});
    const [activeTab, setActiveTab] = useState('overview');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        type: 'reminder' as SaaSTaskType,
        date: new Date().toISOString().split('T')[0],
        time: '09:00'
    });

    if (!lead) return null;

    const handleSave = () => {
        onUpdate(lead.id, editData);
        setIsEditing(false);
    };

    const handleAddTask = () => {
        if (!newTask.title) return;
        const dueDateTime = new Date(`${newTask.date}T${newTask.time}:00`).toISOString();
        onAddTask({
            leadId: lead.id,
            title: newTask.title,
            type: newTask.type,
            dueDate: dueDateTime,
            isCompleted: false
        });
        setIsAddingTask(false);
        setNewTask({
            title: '',
            type: 'reminder',
            date: new Date().toISOString().split('T')[0],
            time: '09:00'
        });
    };

    const planConfig = SAAS_PLANS_CONFIG[lead.planInterest];
    const leadTasks = lead.tasks || [];

    return (
        <AnimatePresence>
            {lead && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-xl bg-card border-l border-border shadow-2xl z-[101] overflow-hidden flex flex-col"
                    >
                        {/* Header Overlay Gradient */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

                        {/* Top Navigation */}
                        <div className="p-6 flex justify-between items-center relative z-10">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                                <X size={20} />
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    className="font-semibold"
                                >
                                    {isEditing ? <><Save size={14} className="mr-2" /> Salvar</> : <><Edit3 size={14} className="mr-2" /> Editar</>}
                                </Button>
                                {lead.stage !== SaaSLeadStage.CLOSED_WON && (
                                    <Button
                                        size="sm"
                                        onClick={() => onStartClosing(lead)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                                    >
                                        <CheckCircle size={14} className="mr-2" /> Fechar Venda
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Profile Section */}
                        <div className="px-8 pb-6 relative z-10 text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-4xl font-black text-primary mb-4 shadow-xl"
                            >
                                {lead.clinicName.charAt(0)}
                            </motion.div>
                            <h2 className="text-3xl font-bold text-foreground tracking-tight">{lead.clinicName}</h2>
                            <p className="text-muted-foreground font-medium">{lead.name}</p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <Badge className="bg-primary/10 border-primary/20 text-primary py-1 px-3">
                                    {lead.stage === SaaSLeadStage.NEW ? 'Novo Lead' : lead.stage}
                                </Badge>
                                <Badge variant="outline" className="py-1 px-3">
                                    {lead.planInterest}
                                </Badge>
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                            <div className="px-8 border-b border-border">
                                <TabsList className="bg-transparent h-12 gap-6 w-full justify-start p-0">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full border-b-2 border-transparent px-0 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                                        Visão Geral
                                    </TabsTrigger>
                                    <TabsTrigger value="tasks" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full border-b-2 border-transparent px-0 font-semibold text-muted-foreground data-[state=active]:text-foreground flex gap-2">
                                        Tarefas {leadTasks.length > 0 && <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">{leadTasks.filter(t => !t.isCompleted).length}</span>}
                                    </TabsTrigger>
                                    <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full border-b-2 border-transparent px-0 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                                        Histórico
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <TabsContent value="overview" className="p-8 m-0 space-y-10">
                                    {/* Contact Information */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-6">
                                            <Phone size={14} className="text-primary" /> Canais de Contato
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="bg-muted/50 border border-border p-4 rounded-xl flex items-center justify-between group transition-colors hover:bg-muted">
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">E-mail Corporativo</p>
                                                    {isEditing ? (
                                                        <Input
                                                            defaultValue={lead.email}
                                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                            className="bg-transparent border-white/10 h-8"
                                                        />
                                                    ) : (
                                                        <p className="text-white font-medium">{lead.email}</p>
                                                    )}
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white" asChild>
                                                    <a href={`mailto:${lead.email}`}><ExternalLink size={16} /></a>
                                                </Button>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between group transition-colors hover:bg-white/[0.04]">
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">WhatsApp / Telefone</p>
                                                    {isEditing ? (
                                                        <Input
                                                            defaultValue={lead.phone}
                                                            onChange={(e) => setEditData({ ...editData, phone: maskPhone(e.target.value) })}
                                                            className="bg-transparent border-white/10 h-8"
                                                        />
                                                    ) : (
                                                        <p className="text-white font-medium">{lead.phone}</p>
                                                    )}
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white" asChild>
                                                    <a href={`tel:${lead.phone}`}><Phone size={16} /></a>
                                                </Button>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Business Information */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 italic">
                                            <DollarSign size={14} className="text-emerald-500" /> Potencial Comercial
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-3xl">
                                                <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">MRR Estimado</p>
                                                <p className="text-2xl font-black text-white font-mono">
                                                    R$ {(lead.estimatedValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-3xl">
                                                <p className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest mb-1">Origem do Lead</p>
                                                <p className="text-lg font-bold text-white capitalize">{lead.source.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Address */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 italic">
                                            <MapPin size={14} className="text-diva-accent" /> Localização
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5 text-xs text-slate-400">
                                                    <span className="font-bold opacity-60 uppercase tracking-widest block text-[9px]">CEP</span>
                                                    {isEditing ? (
                                                        <Input
                                                            defaultValue={lead.zipCode}
                                                            onChange={(e) => setEditData({ ...editData, zipCode: maskCEP(e.target.value) })}
                                                            className="bg-transparent border-white/10 h-8"
                                                        />
                                                    ) : (
                                                        <span className="text-white font-medium">{lead.zipCode || 'Não informado'}</span>
                                                    )}
                                                </div>
                                                <div className="space-y-1.5 text-xs text-slate-400">
                                                    <span className="font-bold opacity-60 uppercase tracking-widest block text-[9px]">Cidade/UF</span>
                                                    <span className="text-white font-medium">{lead.city || '—'} / {lead.state || '—'}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 text-xs text-slate-400">
                                                <span className="font-bold opacity-60 uppercase tracking-widest block text-[9px]">Endereço Completo</span>
                                                <span className="text-white font-medium">
                                                    {lead.address ? `${lead.address}, ${lead.number}${lead.complement ? ` - ${lead.complement}` : ''}` : 'Não informado'}
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Notes */}
                                    <section>
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 italic">
                                                <MessageSquare size={14} className="text-indigo-400" /> Notas Internas
                                            </h4>
                                            <Button
                                                variant="link"
                                                className="h-auto p-0 text-[10px] font-bold text-indigo-400 uppercase underline decoration-indigo-400/30"
                                                onClick={() => {
                                                    onUpdate(lead.id, { notes: lead.notes });
                                                    // addToast('Observação salva!', 'success');
                                                }}
                                            >
                                                Registrar Agora
                                            </Button>
                                        </div>
                                        <textarea
                                            className="w-full h-32 bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-slate-400 text-sm italic focus:border-diva-accent/30 outline-none transition-all resize-none"
                                            placeholder="Descreva detalhes específicos da clínica, dores e objeções..."
                                            value={lead.notes || ''}
                                            onChange={(e) => onUpdate(lead.id, { notes: e.target.value })}
                                        />
                                    </section>
                                </TabsContent>

                                <TabsContent value="tasks" className="p-8 m-0">
                                    <div className="flex justify-between items-center mb-8">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 italic flex items-center gap-2">
                                            <Clock size={14} className="text-purple-400" /> Próximos Passos
                                        </h4>
                                        <Button
                                            size="sm"
                                            className="bg-white/5 hover:bg-white/10 text-white rounded-full h-8 px-4"
                                            onClick={() => setIsAddingTask(true)}
                                        >
                                            <Plus size={14} className="mr-2" /> Tarefa
                                        </Button>
                                    </div>

                                    {isAddingTask && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-purple-500/5 border border-purple-500/20 rounded-3xl p-6 mb-8 space-y-4"
                                        >
                                            <Input
                                                placeholder="O que precisa ser feito?"
                                                className="bg-slate-900 border-white/5"
                                                value={newTask.title}
                                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <select
                                                    className="bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
                                                    value={newTask.type}
                                                    onChange={e => setNewTask({ ...newTask, type: e.target.value as SaaSTaskType })}
                                                >
                                                    <option value="call">📞 Ligação</option>
                                                    <option value="meeting">👥 Reunião</option>
                                                    <option value="email">📧 Email</option>
                                                    <option value="demo">💻 Demo</option>
                                                    <option value="reminder">🔔 Lembrete</option>
                                                </select>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="date"
                                                        className="bg-slate-900 border-white/5 text-[10px]"
                                                        value={newTask.date}
                                                        onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => setIsAddingTask(false)}>Cancelar</Button>
                                                <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white" onClick={handleAddTask}>Confirmar</Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="space-y-3">
                                        {leadTasks.length === 0 ? (
                                            <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                                                <Zap className="mx-auto text-slate-800 mb-4" size={40} />
                                                <p className="text-slate-500 text-sm italic">Nenhuma tarefa agendada.</p>
                                            </div>
                                        ) : (
                                            leadTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((task, idx) => (
                                                <motion.div
                                                    key={task.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`group p-4 rounded-2xl border transition-all flex items-center justify-between ${task.isCompleted ? 'bg-white/[0.01] border-white/5 opacity-50' : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => onToggleTask(task.id)}
                                                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-white/20 hover:border-emerald-500/50'}`}
                                                        >
                                                            {task.isCompleted && <CheckCircle size={14} />}
                                                        </button>
                                                        <div>
                                                            <p className={`text-sm font-bold ${task.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge className="bg-white/10 text-[9px] uppercase tracking-tighter py-0">{task.type}</Badge>
                                                                <span className="text-[10px] text-slate-500 font-mono italic">
                                                                    {new Date(task.dueDate).toLocaleDateString()} às {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                                                        onClick={() => onDeleteTask(task.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="history" className="p-8 m-0">
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 italic flex items-center gap-2 mb-8">
                                            <History size={14} className="text-blue-400" /> Jornada do Lead
                                        </h4>
                                        <div className="relative pl-6 space-y-8 border-l border-white/5">
                                            <div className="relative">
                                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-[0_0_0_1px_rgba(16,185,129,0.3)]"></div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Hoje, 14:20</p>
                                                <p className="text-sm text-white font-medium">Lead aberto para análise profunda.</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-800 border-4 border-slate-950"></div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Há 2 dias</p>
                                                <p className="text-sm text-slate-400">Capturado via <span className="text-diva-accent">Campanha Marketing Digital</span>.</p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>

                        {/* Footer / Summary Action */}
                        <div className="p-8 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status da Oportunidade</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${lead.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`}></div>
                                        <span className="text-sm font-black text-white uppercase italic">Active Prospect</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saúde do Deal</p>
                                    <p className="text-sm font-black text-diva-accent italic uppercase">Excelente</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
