import { User, UserRole, ServiceAppointment, Client, Transaction, Product, Invoice, ClinicEvent, EventGuest } from '../types';

/**
 * Hook personalizado para isolamento de dados baseado no perfil do usuário
 * 
 * Princípios:
 * - ADMIN/MANAGER: Acesso total a todos os dados
 * - STAFF: Acesso apenas aos seus próprios dados e clientes que atendeu
 * - CLIENT: Acesso apenas aos seus próprios dados
 * - FINANCE: Acesso a dados financeiros e comissões
 */

interface DataIsolationHook {
    filterAppointments: (appointments: ServiceAppointment[]) => ServiceAppointment[];
    filterClients: (clients: Client[], appointments: ServiceAppointment[]) => Client[];
    filterTransactions: (transactions: Transaction[]) => Transaction[];
    filterProducts: (products: Product[]) => Product[];
    filterInvoices: (invoices: Invoice[]) => Invoice[];
    filterEvents: (events: ClinicEvent[], guests: EventGuest[]) => ClinicEvent[];
    canViewAllData: boolean;
    canViewFinancialData: boolean;
    canEditData: (ownerId?: string) => boolean;
}

export const useDataIsolation = (user: User | null): DataIsolationHook => {

    // Verifica se o usuário tem acesso total aos dados
    const canViewAllData = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

    // Verifica se o usuário pode ver dados financeiros
    const canViewFinancialData =
        user?.role === UserRole.ADMIN ||
        user?.role === UserRole.MANAGER ||
        user?.role === UserRole.FINANCE;

    /**
     * Filtra agendamentos baseado no perfil do usuário
     */
    const filterAppointments = (appointments: ServiceAppointment[]): ServiceAppointment[] => {
        if (!user) return [];

        // Admin e Manager veem todos
        if (canViewAllData) {
            return appointments;
        }

        // Staff vê apenas seus próprios agendamentos
        if (user.role === UserRole.STAFF && user.staffId) {
            return appointments.filter(a => a.staffId === user.staffId);
        }

        // Client vê apenas seus próprios agendamentos
        if (user.role === UserRole.CLIENT && user.clientId) {
            return appointments.filter(a => a.clientId === user.clientId);
        }

        // Finance não tem acesso a agendamentos
        return [];
    };

    /**
     * Filtra clientes baseado no perfil do usuário
     * Staff vê apenas clientes que já atendeu ou tem agendado
     */
    const filterClients = (clients: Client[], appointments: ServiceAppointment[]): Client[] => {
        if (!user) return [];

        // Admin e Manager veem todos
        if (canViewAllData) {
            return clients;
        }

        // Staff vê apenas clientes que atendeu ou vai atender
        if (user.role === UserRole.STAFF && user.staffId) {
            const myAppointments = appointments.filter(a => a.staffId === user.staffId);
            const myClientIds = [...new Set(myAppointments.map(a => a.clientId))];
            return clients.filter(c => myClientIds.includes(c.clientId));
        }

        // Client vê apenas seus próprios dados
        if (user.role === UserRole.CLIENT && user.clientId) {
            return clients.filter(c => c.clientId === user.clientId);
        }

        // Finance não tem acesso direto a clientes
        return [];
    };

    /**
   * Filtra transações financeiras baseado no perfil do usuário
   * Nota: A estrutura atual de Transaction não possui staffId/clientId
   * Esta função retorna todas as transações para perfis autorizados
   */
    const filterTransactions = (transactions: Transaction[]): Transaction[] => {
        if (!user) return [];

        // Admin, Manager e Finance veem todas as transações
        if (canViewFinancialData) {
            return transactions;
        }

        // Staff e Client não têm acesso a transações gerais
        // (Comissões de staff devem ser gerenciadas em um tipo específico)
        return [];
    };

    /**
     * Filtra produtos baseado no perfil do usuário
     * Clientes veem apenas produtos disponíveis para venda
     */
    const filterProducts = (products: Product[]): Product[] => {
        if (!user) return [];

        // Admin, Manager e Staff veem todos os produtos
        if (canViewAllData || user.role === UserRole.STAFF) {
            return products;
        }

        // Client vê apenas produtos de homecare, packages e giftcards (não professional_use)
        if (user.role === UserRole.CLIENT) {
            return products.filter(p =>
                p.category !== 'professional_use' &&
                (p.stock === undefined || p.stock > 0)
            );
        }

        return [];
    };

    /**
     * Filtra faturas baseado no perfil do usuário
     */
    const filterInvoices = (invoices: Invoice[]): Invoice[] => {
        if (!user) return [];

        // Admin, Manager e Finance veem todas
        if (canViewFinancialData) {
            return invoices;
        }

        // Client vê apenas suas próprias faturas
        if (user.role === UserRole.CLIENT && user.clientId) {
            return invoices.filter(inv => inv.clientId === user.clientId);
        }

        return [];
    };

    /**
     * Filtra eventos baseado no perfil do usuário
     * Clientes veem todos os eventos públicos ou aqueles em que estão inscritos
     */
    const filterEvents = (events: ClinicEvent[], guests: EventGuest[]): ClinicEvent[] => {
        if (!user) return [];

        // Admin e Manager veem todos os eventos
        if (canViewAllData) {
            return events;
        }

        // Staff vê todos os eventos (podem ser organizadores)
        if (user.role === UserRole.STAFF) {
            return events;
        }

        // Client vê todos os eventos (podem se inscrever em qualquer um)
        // Eventos são públicos por natureza
        if (user.role === UserRole.CLIENT) {
            return events;
        }

        return [];
    };

    /**
     * Verifica se o usuário pode editar um dado específico
     * @param ownerId - ID do dono do dado (staffId, clientId, etc)
     */
    const canEditData = (ownerId?: string): boolean => {
        if (!user) return false;

        // Admin e Manager podem editar tudo
        if (canViewAllData) return true;

        // Outros perfis podem editar apenas seus próprios dados
        if (ownerId) {
            return ownerId === user.uid || ownerId === user.staffId || ownerId === user.clientId;
        }

        return false;
    };

    return {
        filterAppointments,
        filterClients,
        filterTransactions,
        filterProducts,
        filterInvoices,
        filterEvents,
        canViewAllData,
        canViewFinancialData,
        canEditData,
    };
};

/**
 * Função auxiliar para ocultar dados sensíveis de clientes
 * Remove informações financeiras para perfis que não devem vê-las
 */
export const sanitizeClientData = (client: Client, user: User | null): Partial<Client> => {
    if (!user) return {};

    const canViewFinancial =
        user.role === UserRole.ADMIN ||
        user.role === UserRole.MANAGER ||
        user.role === UserRole.FINANCE;

    if (canViewFinancial) {
        return client; // Retorna dados completos
    }

    // Remove dados financeiros para Staff
    const { lifetimeValue, rfmScore, ...sanitizedData } = client;
    return sanitizedData;
};

/**
 * Função auxiliar para verificar se um profissional pode acessar um prontuário
 * Durante o atendimento, o profissional tem acesso total
 * Fora do atendimento, apenas histórico limitado
 */
export const canAccessMedicalRecord = (
    user: User | null,
    clientId: string,
    appointments: ServiceAppointment[],
    isActiveAppointment: boolean = false
): boolean => {
    if (!user) return false;

    // Admin e Manager sempre podem acessar
    if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
        return true;
    }

    // Durante atendimento ativo, profissional tem acesso total
    if (isActiveAppointment && user.role === UserRole.STAFF) {
        return true;
    }

    // Fora do atendimento, profissional pode ver apenas histórico de quem já atendeu
    if (user.role === UserRole.STAFF) {
        const hasAttendedClient = appointments.some(
            a => a.staffId === user.uid && a.clientId === clientId
        );
        return hasAttendedClient;
    }

    return false;
};
