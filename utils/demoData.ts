import { SupabaseClient } from '@supabase/supabase-js';

export const populateDemoData = async (supabase: SupabaseClient, organizationId: string) => {
    if (!organizationId) return { success: false, message: 'ID da organização não fornecido.' };

    const demoClients = [
        {
            name: 'Ana Silva',
            email: 'ana.silva@teste.com',
            phone: '(11) 99999-9999',
            birth_date: '1990-05-15',
            notes: 'Cliente interessada em tratamentos faciais.',
            cpf: '123.456.789-00'
        },
        {
            name: 'Beatriz Costa',
            email: 'bia.costa@teste.com',
            phone: '(21) 98888-8888',
            birth_date: '1985-10-20',
            notes: 'Pele sensível, requer cuidados especiais.',
            cpf: '234.567.890-11'
        },
        {
            name: 'Carlos Oliveira',
            email: 'carlos.oliveira@teste.com',
            phone: '(31) 97777-7777',
            birth_date: '1988-03-30',
            notes: 'Busca redução de medidas.',
            cpf: '345.678.901-22'
        },
        {
            name: 'Daniela Santos',
            email: 'dani.santos@teste.com',
            phone: '(41) 96666-6666',
            birth_date: '1995-12-05',
            notes: 'Cliente VIP, prefere horários noturnos.',
            cpf: '456.789.012-33'
        },
        {
            name: 'Eduardo Lima',
            email: 'edu.lima@teste.com',
            phone: '(51) 95555-5555',
            birth_date: '1982-07-25',
            notes: 'Histórico de alergia a látex.',
            cpf: '567.890.123-44'
        }
    ];

    try {
        console.log('🚀 Iniciando importação de dados demo para org:', organizationId);

        const clientsToInsert = demoClients.map(c => ({
            ...c,
            organization_id: organizationId
        }));

        const { data, error } = await supabase
            .from('clients')
            .insert(clientsToInsert)
            .select();

        if (error) {
            console.error('❌ Erro ao importar clientes:', error);
            return { success: false, message: 'Erro ao salvar no banco: ' + error.message };
        }

        console.log('✅ Clientes importados:', data?.length);
        return { success: true, message: `${data?.length} pacientes de exemplo importados com sucesso!`, count: data?.length };

    } catch (error: any) {
        console.error('❌ Erro inesperado na importação:', error);
        return { success: false, message: 'Erro inesperado: ' + error.message };
    }
};
