-- Add zip_code to saas_leads
ALTER TABLE saas_leads 
ADD COLUMN IF NOT EXISTS zip_code text;

-- Create tasks table for follow-up
CREATE TABLE IF NOT EXISTS saas_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES saas_leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'call', 'meeting', 'email', 'reminder', 'demo'
    due_date TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for saas_tasks
ALTER TABLE saas_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON saas_tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON saas_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON saas_tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON saas_tasks FOR DELETE USING (true);
