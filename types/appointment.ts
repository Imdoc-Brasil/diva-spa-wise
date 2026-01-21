// ============================================
// APPOINTMENTS & SERVICES
// ============================================

export enum AppointmentStatus {
    CONFIRMED = 'Confirmed',
    SCHEDULED = 'Scheduled',
    COMPLETED = 'Completed',
    IN_PROGRESS = 'In Progress',
    CANCELLED = 'Cancelled'
}

export interface ServiceAppointment {
    appointmentId: string;
    organizationId: string;
    clientId: string;
    clientName: string;
    staffId: string;
    staffName: string;
    roomId: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    serviceId?: string;
    serviceName: string;
    price: number;
    referralSource?: string;
    unitId?: string;
}

export interface ServiceCategory {
    id: string;
    name: string;
    color: string;
}

export interface ProtocolItem {
    productId: string;
    productName: string;
    quantity: number;
    unit?: string;
    unitCost: number;
    optional?: boolean;
}

export interface ServiceDefinition {
    id: string;
    organizationId: string;
    name: string;
    category: string;
    duration: number;
    price: number;
    active: boolean;
    description?: string;
    loyaltyPoints?: number;
    protocol?: ProtocolItem[];
    allowedStaffIds?: string[];
    allowedRoomIds?: string[];
}

export interface ServiceRoom {
    id: string;
    organizationId: string;
    name: string;
    type: 'treatment' | 'spa' | 'consultation' | 'virtual';
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    currentAppointment?: ServiceAppointment;
    nextAppointmentTime?: string;
    equipments: {
        id: string;
        name: string;
        status: 'operational' | 'maintenance';
        lastMaintenance?: string;
        nextMaintenance?: string;
    }[];
    ambience: { temperature: number; lighting: number; music?: string };
    meetingUrl?: string;
    unitId?: string;
}

export interface AppointmentRecord {
    id: string;
    organizationId: string;
    appointmentId: string;
    clientId: string;
    clientName: string;
    serviceId: string;
    serviceName: string;
    professionalId: string;
    professionalName: string;
    date: string;
    duration: number;
    status: AppointmentStatus;
    clinicalNotes?: string;
    observations?: string;
    reactions?: string;
    parameters?: Record<string, string>;
    transcription?: string;
    skincarePlan?: string;
    formResponseIds?: string[];
    beforePhotos?: string[];
    afterPhotos?: string[];
    productsUsed?: { productId: string; productName: string; quantity: number }[];
    nextSessionDate?: string;
    nextSessionNotes?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface SessionRecord {
    appointmentId: string;
    safetyCheck: any;
    laserParams: any;
    bodyMarkers: any[];
    evolution: string;
}

export type BookingStep = 'service' | 'professional' | 'time' | 'confirm';

export interface TimeSlot {
    time: string;
    available: boolean;
}

export type PatientFlowStage = 'reception' | 'prep' | 'procedure' | 'recovery' | 'checkout';

export interface PatientFlowEntry {
    id: string;
    clientId: string;
    clientName: string;
    stage: PatientFlowStage;
    enteredStageAt: string;
    serviceName: string;
    staffName: string;
    tags?: string[];
    notes?: string;
}
