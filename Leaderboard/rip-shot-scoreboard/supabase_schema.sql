-- Create countries table
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    flag_url TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    position INTEGER DEFAULT 999,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create settings table
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSONB
);

-- Insert default config for last month winner
INSERT INTO settings (key, value) VALUES ('last_month_winner', '{"name": "UNITED STATES", "flag_url": "https://flagcdn.com/w80/us.png", "score": 25}'::jsonb);

-- Enable Realtime subscriptions for both tables
alter publication supabase_realtime add table countries;
alter publication supabase_realtime add table settings;

-- For this simple dashboard, disable Row Level Security (RLS) to allow the frontend to easily read/write.
-- (In a production app with sensitive data, you would enable this and add auth policies)
ALTER TABLE countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
