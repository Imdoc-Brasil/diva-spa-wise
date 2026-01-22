import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SaaSLead, SaaSLeadStage, SaaSPlan, BRAZIL_STATES } from '@/types';
import { X, Building2, User, Mail, Phone, MapPin, CreditCard, ChevronRight, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { maskPhone, maskCEP, maskCpfCnpj } from '../../../../utils/masks';
import { SAAS_PLANS_CONFIG } from '../saasPlans';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const leadSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    clinicName: z.string().min(2, "Nome da clínica é obrigatório"),
    legalName: z.string().optional(),
    email: z.string().email("Email inválido"),
    phone: z.string().min(14, "Telefone inválido"),
    cnpj: z.string().optional(),
    zipCode: z.string().optional(),
    address: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    planInterest: z.nativeEnum(SaaSPlan),
    estimatedValue: z.number().min(0),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface CreateLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (lead: SaaSLead) => Promise<void>;
}

export function CreateLeadModal({ isOpen, onClose, onCreate }: CreateLeadModalProps) {
    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: '',
            clinicName: '',
            legalName: '',
            email: '',
            phone: '',
            cnpj: '',
            zipCode: '',
            address: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            planInterest: SaaSPlan.GROWTH,
            estimatedValue: 0,
        },
    });

    const watchPlan = form.watch('planInterest');

    // Update estimated value when plan changes
    React.useEffect(() => {
        const config = SAAS_PLANS_CONFIG[watchPlan];
        if (config) {
            form.setValue('estimatedValue', config.monthlyPrice);
        }
    }, [watchPlan, form]);

    const handleCEPChange = async (value: string) => {
        const cep = maskCEP(value);
        form.setValue('zipCode', cep);

        if (cep.length === 9) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    form.setValue('address', data.logradouro);
                    form.setValue('neighborhood', data.bairro);
                    form.setValue('city', data.localidade);
                    form.setValue('state', data.uf);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const onSubmit = async (values: LeadFormValues) => {
        const newLead: SaaSLead = {
            id: crypto.randomUUID(),
            ...values,
            stage: SaaSLeadStage.NEW,
            source: 'outbound',
            status: 'active',
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await onCreate(newLead);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-white/10 text-white custom-scrollbar p-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-diva-accent via-white to-diva-accent z-50"></div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white hover:bg-white/10 z-50 rounded-full"
                >
                    <X size={20} />
                </Button>

                <div className="p-8">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-diva-accent/10 border border-diva-accent/20">
                                <User className="text-diva-accent w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold tracking-tight text-white">Novo Lead de Vendas</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Cadastre uma nova oportunidade no funil estratégico da Diva Express.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form {...(form as any)}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* DADOS PRINCIPAIS */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
                            >
                                <motion.section
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-diva-accent/80">
                                        <User size={16} />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Informações de Contato</h4>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-slate-500 uppercase font-bold tracking-wider">Nome Completo</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Ex: Dra. Mariana Silva" className="bg-white/5 border-white/10 h-12 focus:border-diva-accent/50 transition-all text-base" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email Executivo</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="email" placeholder="contato@exemplo.com" className="bg-white/5 border-white/10 h-11 focus:border-diva-accent/50 transition-all" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs text-slate-500 uppercase font-bold tracking-wider">WhatsApp / Celular</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="(00) 00000-0000"
                                                            className="bg-white/5 border-white/10 h-11 focus:border-diva-accent/50 transition-all"
                                                            onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                                            maxLength={15}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </motion.section>

                                <motion.section
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-diva-accent/80">
                                        <Building2 size={16} />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Dados da Clínica</h4>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="clinicName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-slate-500 uppercase font-bold tracking-wider">Nome da Clínica / Unidade</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Ex: Clínica Diva Matriz" className="bg-white/5 border-white/10 h-12 focus:border-diva-accent/50 transition-all text-base" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cnpj"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-slate-500 uppercase font-bold tracking-wider">CPF / CNPJ (Empresarial)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="00.000.000/0000-00"
                                                        className="bg-white/5 border-white/10 h-11 focus:border-diva-accent/50 transition-all"
                                                        onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                                                        maxLength={18}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.section>
                            </motion.div>

                            {/* ENDEREÇO */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6"
                            >
                                <div className="flex items-center gap-2 mb-2 text-slate-500">
                                    <MapPin size={16} />
                                    <h4 className="text-xs font-bold uppercase tracking-widest italic">Localização Estratégica</h4>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="zipCode"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel className="text-[10px] text-slate-500 uppercase font-bold">CEP</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="00000-000"
                                                        className="bg-slate-900/50 border-white/5 h-10"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handleCEPChange(e.target.value);
                                                        }}
                                                        maxLength={9}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2 md:col-span-3">
                                                <FormLabel className="text-[10px] text-slate-500 uppercase font-bold">Logradouro / Rua</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-slate-900/50 border-white/5 h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="number"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2 md:col-span-1">
                                                <FormLabel className="text-[10px] text-slate-500 uppercase font-bold">Nº</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-slate-900/50 border-white/5 h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="neighborhood"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] text-slate-500 uppercase font-bold">Bairro</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-slate-900/50 border-white/5 h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className="text-[10px] text-slate-500 uppercase font-bold">Cidade</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-slate-900/50 border-white/5 h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] text-slate-500 uppercase font-bold">UF</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-slate-900/50 border-white/5 h-10">
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                        {BRAZIL_STATES.map(uf => (
                                                            <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </motion.section>

                            {/* DADOS COMERCIAIS */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end"
                            >
                                <FormField
                                    control={form.control}
                                    name="planInterest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-2 mb-2 text-diva-accent">
                                                <CreditCard size={16} />
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest">Plano de Interesse</FormLabel>
                                            </div>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/5 border-white/10 h-12 text-base">
                                                        <SelectValue placeholder="Selecione o plano" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    <SelectItem value={SaaSPlan.START}>Plano Start (Essencial)</SelectItem>
                                                    <SelectItem value={SaaSPlan.GROWTH}>Plano Growth (Crescimento)</SelectItem>
                                                    <SelectItem value={SaaSPlan.EMPIRE}>Plano Empire (Escala)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <div className="p-4 rounded-2xl bg-gradient-to-r from-diva-accent/10 to-transparent border border-diva-accent/20 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold text-diva-accent uppercase tracking-widest opacity-80 mb-1">Previsão de Receita (MRR)</p>
                                        <p className="text-2xl font-bold font-mono">R$ {form.watch('estimatedValue').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="text-diva-accent/30">
                                        <DollarSign size={32} />
                                    </div>
                                </div>
                            </motion.section>

                            <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="px-8 rounded-full text-slate-400 hover:text-white hover:bg-white/5"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="px-10 rounded-full bg-white text-slate-950 hover:bg-diva-accent hover:text-diva-dark font-bold shadow-xl shadow-white/5 group transition-all"
                                >
                                    Confirmar Oportunidade
                                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
