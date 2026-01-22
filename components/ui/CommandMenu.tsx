"use client"

import * as React from "react"
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Users,
    Search,
    Plus,
    LayoutDashboard,
    ShieldCheck,
    MessageSquare,
    ClipboardList,
    Command as CommandIcon
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useData } from "@/components/context/DataContext"

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()
    const { saasLeads, saasSubscribers, clients, currentUser } = useData()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    const isSaaS = currentUser?.role === "master" || currentUser?.role === "saas_staff"

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Digite um comando ou pesquise..." />
            <CommandList className="scrollbar-hide">
                <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

                <CommandGroup heading="Ações & Atalhos">
                    <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/saas/crm"))}>
                        <LayoutDashboard className="mr-2 h-4 w-4 text-diva-accent" />
                        <span>Fluxo de Vendas (CRM)</span>
                        <CommandShortcut>⌘G</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/agenda"))}>
                        <Calendar className="mr-2 h-4 w-4 text-diva-accent" />
                        <span>Ver Agenda</span>
                        <CommandShortcut>⌘A</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/finance"))}>
                        <CreditCard className="mr-2 h-4 w-4 text-diva-accent" />
                        <span>Financeiro</span>
                        <CommandShortcut>⌘F</CommandShortcut>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Módulos Sistema">
                    <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/saas/subscribers"))}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Gestão de Assinantes</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/saas/implementation"))}>
                        <ClipboardList className="mr-2 h-4 w-4" />
                        <span>Implementação & Onboarding</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/saas/support"))}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Suporte Central</span>
                    </CommandItem>
                </CommandGroup>

                {isSaaS && saasLeads && saasLeads.length > 0 && (
                    <>
                        <CommandSeparator />
                        <CommandGroup heading="Leads Recentes (SaaS)">
                            {saasLeads.slice(0, 5).map((lead) => (
                                <CommandItem
                                    key={lead.id}
                                    onSelect={() => runCommand(() => navigate(`/dashboard/saas/crm?leadId=${lead.id}`))}
                                >
                                    <Search className="mr-2 h-4 w-4 text-diva-accent/60" />
                                    <div className="flex flex-col">
                                        <span>{lead.clinicName}</span>
                                        <span className="text-[10px] text-muted-foreground">{lead.name} • {lead.stage}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}

                {clients && clients.length > 0 && (
                    <>
                        <CommandSeparator />
                        <CommandGroup heading="Pacientes / Clientes">
                            {clients.slice(0, 5).map((client) => (
                                <CommandItem
                                    key={client.clientId}
                                    onSelect={() => runCommand(() => navigate(`/dashboard/clients?id=${client.clientId}`))}
                                >
                                    <User className="mr-2 h-4 w-4 text-diva-primary" />
                                    <div className="flex flex-col">
                                        <span>{client.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{client.phone}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}

                <CommandSeparator />

                <CommandGroup heading="Configurações">
                    <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/profile"))}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/settings"))}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
