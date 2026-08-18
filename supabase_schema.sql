-- ==============================================================================
-- NOVA Engineering Platform - Complete Supabase Schema
-- ==============================================================================

-- 1. Create ansys_jobs table
CREATE TABLE IF NOT EXISTS public.ansys_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id_display TEXT,
    name TEXT,
    type TEXT DEFAULT 'Nozzle Analysis',
    status TEXT DEFAULT 'Pending',
    price NUMERIC DEFAULT 0,
    geometry_data JSONB DEFAULT '{}'::jsonb,
    json_payload JSONB DEFAULT '[]'::jsonb,
    result_url TEXT,
    report_url TEXT,
    excel_file_url TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for fast query and polling
CREATE INDEX IF NOT EXISTS idx_ansys_jobs_user_id ON public.ansys_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ansys_jobs_status ON public.ansys_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ansys_jobs_created_at ON public.ansys_jobs(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.ansys_jobs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow users to view all jobs (or restrict to their own user_id)
DROP POLICY IF EXISTS "Allow all users to read jobs" ON public.ansys_jobs;
CREATE POLICY "Allow all users to read jobs" 
    ON public.ansys_jobs 
    FOR SELECT 
    USING (true);

-- Allow authenticated users to insert jobs
DROP POLICY IF EXISTS "Allow users to insert their own jobs" ON public.ansys_jobs;
CREATE POLICY "Allow users to insert their own jobs" 
    ON public.ansys_jobs 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL OR user_id IS NOT NULL);

-- Allow update of jobs
DROP POLICY IF EXISTS "Allow update of jobs" ON public.ansys_jobs;
CREATE POLICY "Allow update of jobs" 
    ON public.ansys_jobs 
    FOR UPDATE 
    USING (true);

-- 5. Enable Realtime on ansys_jobs for instant live updates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'ansys_jobs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.ansys_jobs;
    END IF;
END $$;
