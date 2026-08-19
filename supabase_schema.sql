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

CREATE INDEX IF NOT EXISTS idx_ansys_jobs_user_id ON public.ansys_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ansys_jobs_status ON public.ansys_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ansys_jobs_created_at ON public.ansys_jobs(created_at DESC);

ALTER TABLE public.ansys_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all users to read jobs" ON public.ansys_jobs;
CREATE POLICY "Allow all users to read jobs" 
    ON public.ansys_jobs 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow users to insert their own jobs" ON public.ansys_jobs;
DROP POLICY IF EXISTS "Allow all users to insert jobs" ON public.ansys_jobs;
CREATE POLICY "Allow all users to insert jobs" 
    ON public.ansys_jobs 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update of jobs" ON public.ansys_jobs;
CREATE POLICY "Allow update of jobs" 
    ON public.ansys_jobs 
    FOR UPDATE 
    USING (true);

DROP POLICY IF EXISTS "Allow delete of jobs" ON public.ansys_jobs;
CREATE POLICY "Allow delete of jobs" 
    ON public.ansys_jobs 
    FOR DELETE 
    USING (true);

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

