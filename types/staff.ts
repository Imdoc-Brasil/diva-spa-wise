// ============================================
// STAFF & TEAM MANAGEMENT
// ============================================

export interface StaffGoal {
    id: string;
    title: string;
    current: number;
    target: number;
    unit: 'currency' | 'count' | 'percentage';
    deadline: string;
}

export interface StaffMember {
    id: string;
    organizationId: string;
    userId: string;
    name: string;
    email?: string;
    phone?: string;
    cpf?: string;
    address?: string;
    photoUrl?: string;
    signature?: string;
    role: string;
    specialties: string[];
    services?: string[];
    rooms?: string[];
    status: 'available' | 'busy' | 'break' | 'off';
    commissionRate: number;
    customCommissionRates?: { [serviceId: string]: number };
    bankingInfo?: {
        bank?: string;
        agency?: string;
        account?: string;
        accountType?: 'checking' | 'savings';
        pixKey?: string;
        pixKeyType?: 'cpf' | 'email' | 'phone' | 'random';
    };
    workSchedule?: {
        monday?: { start: string; end: string };
        tuesday?: { start: string; end: string };
        wednesday?: { start: string; end: string };
        thursday?: { start: string; end: string };
        friday?: { start: string; end: string };
        saturday?: { start: string; end: string };
        sunday?: { start: string; end: string };
    };
    performanceMetrics: {
        monthlyRevenue: number;
        appointmentsCount: number;
        averageTicket: number;
        npsScore: number;
    };
    activeGoals: StaffGoal[];
    unitId?: string;
    allowedUnits?: string[];
}

export interface WorkShift {
    id: string;
    staffId: string;
    date: string;
    type: 'work' | 'off' | 'vacation' | 'sick';
    startTime?: string;
    endTime?: string;
}

export interface Kudo {
    id: string;
    fromStaffId: string;
    fromStaffName: string;
    toStaffId: string;
    toStaffName: string;
    message: string;
    date: string;
    type: 'help' | 'excellence' | 'teamwork';
}

export interface StaffHealthRecord {
    staffId: string;
    staffName: string;
    asoExpiry: string;
    vaccines: { name: string; valid: boolean }[];
    status: 'compliant' | 'non_compliant';
}

// Talent & Recruitment
export type CandidateStage = 'new' | 'screening' | 'interview' | 'practical_test' | 'offer' | 'hired' | 'rejected';

export interface JobOpening {
    id: string;
    title: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    department: string;
    location: string;
    status: 'open' | 'closed';
    applicantsCount: number;
    createdAt: string;
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    roleApplied: string;
    jobId: string;
    stage: CandidateStage;
    resumeUrl: string;
    appliedDate: string;
    rating?: number;
    notes?: string;
}

// Training & Academy
export type CourseCategory = 'onboarding' | 'technical' | 'sales' | 'service';

export interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
    correctOptionIndex: number;
}

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'text' | 'quiz';
    completed: boolean;
    questions?: QuizQuestion[];
    minScore?: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    category: CourseCategory;
    thumbnail: string;
    instructor: string;
    totalLessons: number;
    completedLessons: number;
    duration: string;
    tags: string[];
    lessons: Lesson[];
}
