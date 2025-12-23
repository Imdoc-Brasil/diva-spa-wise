-- Create Blog Posts Table
CREATE TABLE IF NOT EXISTS saas_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT, -- Markdown or HTML content
  cover_image TEXT,
  author_name TEXT DEFAULT 'Equipe I''mdoc',
  read_time_minutes INTEGER DEFAULT 5,
  tags TEXT[], -- Array of strings e.g. ['Gestão', 'Marketing']
  seo_title TEXT,
  seo_description TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE saas_posts ENABLE ROW LEVEL SECURITY;

-- Policies
-- Public can read published posts
CREATE POLICY "Public can read published posts" 
ON saas_posts FOR SELECT 
USING (published = true);

-- Admins can do everything (Using a simplified check for now, ideally strictly check role)
-- For now allowing public read for development ease if auth fails, but in prod restrict write
CREATE POLICY "Admins can manage posts" 
ON saas_posts FOR ALL 
USING (true) 
WITH CHECK (true); 

-- Create Tools Usage Log (to track calculator usage)
CREATE TABLE IF NOT EXISTS saas_tools_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_key TEXT NOT NULL, -- 'revenue_calculator', 'roi_calculator'
    lead_id TEXT REFERENCES saas_leads(id), -- Optional link to lead
    inputs JSONB, -- Stored inputs for analysis
    result JSONB, -- Stored result
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE saas_tools_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert usage" ON saas_tools_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read usage" ON saas_tools_usage FOR SELECT USING (true);
