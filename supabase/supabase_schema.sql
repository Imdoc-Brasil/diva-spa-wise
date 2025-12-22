-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Implementation Projects Table
CREATE TABLE IF NOT EXISTS saas_implementation_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    stage TEXT NOT NULL, -- Enum: 'New Subscriber', 'Demo Scheduled', 'In Training', 'Finished'
    start_date TIMESTAMP WITH TIME ZONE,
    deadline_date TIMESTAMP WITH TIME ZONE,
    modules_checked JSONB DEFAULT '[]'::jsonb, -- Array of strings
    status TEXT NOT NULL, -- 'on_track', 'at_risk', 'delayed', 'completed'
    notes TEXT,
    tasks JSONB DEFAULT '[]'::jsonb, -- Array of task objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Support Tickets Table
CREATE TABLE IF NOT EXISTS saas_support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT NOT NULL,
    subscriber_id TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'bug', 'question', 'access', 'other'
    priority TEXT NOT NULL, -- 'Low', 'Medium', 'High', 'Critical'
    status TEXT NOT NULL, -- 'Open', 'In Progress', 'Waiting Client', 'Resolved', 'Closed'
    ai_summary TEXT,
    assigned_to TEXT,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Feature Requests Table
CREATE TABLE IF NOT EXISTS saas_feature_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    module TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    impact TEXT NOT NULL, -- 'Low', 'Medium', 'High', 'Critical'
    status TEXT NOT NULL, -- 'New', 'Planned', etc.
    votes INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Optional but recommended - simplifying for Allow All for Demo)
ALTER TABLE saas_implementation_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for now" ON saas_implementation_projects FOR ALL USING (true);

ALTER TABLE saas_support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for now" ON saas_support_tickets FOR ALL USING (true);

ALTER TABLE saas_feature_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for now" ON saas_feature_requests FOR ALL USING (true);
