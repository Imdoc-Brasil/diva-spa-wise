
// Use Vite Proxy in development to avoid CORS
const ASAAS_API_URL = import.meta.env.DEV
    ? '/api/asaas'
    : (import.meta.env.VITE_ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3');
// Em produção, chamadas Client-Side direto para Asaas falharão por CORS a menos que configurado Backend-for-Frontend (BFF).

const getHeaders = () => {
    // Fallback manual para teste (Sandbox) caso o .env não carregue
    const apiKey = import.meta.env.VITE_ASAAS_API_KEY || "$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmZmNzI5ZGYwLTg4NTMtNDdhNC1hYWE1LWZhNmY4NmMxYTU5NTo6JGFhY2hfMjM4NDIyZjEtY2ZjYy00ZjRmLWIwMDItZWE5ODYyMzYxYTU3";

    if (!apiKey) {
        console.error("VITE_ASAAS_API_KEY não configurada!");
        return {};
    }
    return {
        'Content-Type': 'application/json',
        'access_token': apiKey
    };
};

export interface CreateCustomerDTO {
    name: string;
    cpfCnpj: string;
    email?: string;
    mobilePhone?: string;
    externalReference?: string; // Nosso ID uuid

    // Address & Extra Info
    postalCode?: string;
    address?: string;
    addressNumber?: string;
    complement?: string;
    province?: string; // Bairro
    city?: string; // Nome da cidade (embora API peça ID, às vezes aceita nome ou ignora se postalCode for enviado)
    state?: string;
    country?: string;
    notificationDisabled?: boolean;
    observations?: string;
    groupName?: string;
}

export const asaasService = {
    /**
     * Cria um novo cliente no Asaas
     */
    createCustomer: async (data: CreateCustomerDTO) => {
        try {
            const response = await fetch(`${ASAAS_API_URL}/customers`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.[0]?.description || 'Erro ao criar cliente Asaas');
            }

            return await response.json();
        } catch (error) {
            console.error("Asaas Create Customer Error:", error);
            throw error;
        }
    },

    /**
     * Busca cliente por CPF/CNPJ para evitar duplicidade
     */
    findCustomer: async (cpfCnpj: string) => {
        try {
            const response = await fetch(`${ASAAS_API_URL}/customers?cpfCnpj=${cpfCnpj}`, {
                method: 'GET',
                headers: getHeaders()
            });
            const data = await response.json();
            return data.data?.[0] || null; // Retorna o primeiro se existir
        } catch (error) {
            console.error("Asaas Find Customer Error:", error);
            return null;
        }
    },

    /**
     * Listar Assinaturas (Subscriptions)
     */
    listSubscriptions: async (customerId?: string) => {
        try {
            const url = `${ASAAS_API_URL}/subscriptions?limit=20${customerId ? `&customer=${customerId}` : ''}`;
            const response = await fetch(url, {
                headers: getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error("Asaas List Subscription Error:", error);
            return { data: [] };
        }
    },

    /**
     * Listar Cobranças (Payments)
     */
    listPayments: async (customerId?: string) => {
        try {
            const url = `${ASAAS_API_URL}/payments?limit=20${customerId ? `&customer=${customerId}` : ''}`;
            const response = await fetch(url, {
                headers: getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error("Asaas List Payments Error:", error);
            return { data: [] };
        }
    },

    /**
     * Criar Cobrança Avulsa Direta (requer Customer ID)
     */
    createPayment: async (data: {
        customer: string;
        billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX';
        value: number;
        dueDate: string;
        description: string;
    }) => {
        try {
            const response = await fetch(`${ASAAS_API_URL}/payments`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.[0]?.description || 'Erro ao criar cobrança Asaas');
            }
            return await response.json(); // Retorna { id: "...", invoiceUrl: "..." }
        } catch (error) {
            console.error("Asaas Create Payment Error:", error);
            throw error;
        }
    },

    /**
     * Criar Assinatura
     */
    createSubscription: async (data: {
        customer: string; // cus_...
        billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX';
        value: number;
        nextDueDate: string; // YYYY-MM-DD
        cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
        description: string;
        externalReference?: string; // ID do assinante no nosso sistema
    }) => {
        try {
            const response = await fetch(`${ASAAS_API_URL}/subscriptions`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.[0]?.description || 'Erro ao criar assinatura Asaas');
            }
            return await response.json();
        } catch (error) {
            console.error("Asaas Create Subscription Error:", error);
            throw error;
        }
    },

    listSubscriptionPayments: async (subscriptionId: string) => {
        try {
            const response = await fetch(`${ASAAS_API_URL}/subscriptions/${subscriptionId}/payments`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error("Asaas List Subscription Payments Error:", error);
            return { data: [] };
        }
    },

    /**
     * Criar Checkout (Link de Pagamento)
     */
    createCheckout: async (data: {
        value: number;
        description: string;
        billingTypes: string[]; // ['PIX', 'CREDIT_CARD', 'BOLETO']
        chargeType: 'DETACHED' | 'RECURRENT' | 'INSTALLMENT';
        subscription?: {
            cycle: 'MONTHLY' | 'YEARLY',
            nextDueDate: string,
            endDate?: string
        };
        name?: string; // Nome do produto/serviço no checkout
    }) => {
        try {
            // Ajuste no payload conforme doc: "subscription" object for RECURRENT
            const payload: any = {
                billingTypes: data.billingTypes,
                chargeTypes: [data.chargeType],
                name: data.name || "Assinatura I'mdoc",
                description: data.description,
                // Ao usar items, o valor total é a soma. Mas vamos mandar ambos se possível ou focar nos items.
                // O erro diz 'items' é obrigatório.
                value: data.value,
                items: [
                    {
                        name: data.name || "Cobrança Avulsa",
                        description: data.description,
                        value: data.value,
                        quantity: 1
                    }
                ],

                // Configurações visuais/comportamentais básicas
                minutesToExpire: 120, // Link expira em 2h (scarcity trigger)
            };

            if (data.chargeType === 'RECURRENT' && data.subscription) {
                payload.subscription = data.subscription;
            }

            const response = await fetch(`${ASAAS_API_URL}/checkouts`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.[0]?.description || 'Erro ao criar checkout Asaas');
            }
            return await response.json(); // Retorna { id: "...", resourceUrl: "..." }
        } catch (error) {
            console.error("Asaas Create Checkout Error:", error);
            throw error;
        }
    }
};
