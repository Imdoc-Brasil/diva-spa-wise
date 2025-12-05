
import { useMemo } from 'react';
import { useData } from '../context/DataContext';

export const useUnitData = () => {
    const context = useData();
    const {
        clients,
        appointments,
        updateAppointmentStatus,
        transactions,
        leads,
        staff,
        services,
        taskCategories,
        notificationConfig,
        businessConfig,
        products,
        updateProductStock,
        units,
        yieldRules,
        addYieldRule,
        updateYieldRule,
        deleteYieldRule,
        formTemplates,
        addFormTemplate,
        updateFormTemplate,
        deleteFormTemplate,
        formResponses,
        addFormResponse,
        getClientFormResponses,
        appointmentRecords,
        addAppointmentRecord,
        updateAppointmentRecord,
        getAppointmentRecord,
        selectedUnitId,
        setSelectedUnitId
    } = context;

    const filteredData = useMemo(() => {
        if (selectedUnitId === 'all') {
            return {
                clients,
                appointments,
                transactions,
                leads,
                staff
            };
        }

        return {
            // Se não tiver unitId, assume que é global ou legado (mostra em todos por enquanto, ou filtra? Vamos mostrar para evitar sumir dados)
            // Idealmente, tudo deveria ter unitId. Para dados legados, vamos mostrar.
            clients: clients.filter(c => !c.unitId || c.unitId === selectedUnitId),
            appointments: appointments.filter(a => !a.unitId || a.unitId === selectedUnitId),
            transactions: transactions.filter(t => !t.unitId || t.unitId === selectedUnitId),
            leads: leads.filter(l => !l.unitId || l.unitId === selectedUnitId),
            // Staff pode ter unitId principal ou lista de allowedUnits
            staff: staff.filter(s =>
                !s.unitId ||
                s.unitId === selectedUnitId ||
                (s.allowedUnits && s.allowedUnits.includes(selectedUnitId))
            )
        };
    }, [clients, appointments, transactions, leads, staff, selectedUnitId]);

    return {
        ...context,
        ...filteredData,
        yieldRules,
        addYieldRule,
        updateYieldRule,
        deleteYieldRule,
        selectedUnitId
    };
};
