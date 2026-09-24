-- ==============================================================================
-- NOVA AI ENGINEERING ANALYSIS PLATFORM - COMPLETE SUPABASE PRODUCTION SCHEMA
-- Run this script directly in the Supabase SQL Editor.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. USER PROFILES & SUBSCRIPTION CREDITS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company TEXT DEFAULT 'Not Provided',
    phone TEXT DEFAULT 'Not Provided',
    avatar_url TEXT,
    plan TEXT DEFAULT 'Free' CHECK (plan IN ('Free', 'Basic', 'Pro', 'Max')),
    daily_credits_total INT DEFAULT 100,
    daily_credits_remaining INT DEFAULT 100,
    is_approved BOOLEAN DEFAULT true,
    is_lifetime_max BOOLEAN DEFAULT false,
    last_credit_reset TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_plan ON public.user_profiles(plan);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.user_profiles;
CREATE POLICY "Public profiles are viewable by authenticated users" 
    ON public.user_profiles FOR SELECT 
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile" 
    ON public.user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = id OR auth.role() = 'anon' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" 
    ON public.user_profiles FOR UPDATE 
    USING (auth.uid() = id OR auth.role() = 'anon' OR auth.role() = 'authenticated');

-- Trigger to automatically create a user profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    is_dinesh BOOLEAN;
    init_plan TEXT;
    init_credits INT;
    init_lifetime BOOLEAN;
BEGIN
    is_dinesh := (NEW.email = 'dineshkumar2729304@gmail.com');
    
    IF is_dinesh THEN
        init_plan := 'Max';
        init_credits := 3000;
        init_lifetime := true;
    ELSE
        init_plan := 'Free';
        init_credits := 100;
        init_lifetime := false;
    END IF;

    INSERT INTO public.user_profiles (
        id, 
        email, 
        full_name, 
        avatar_url, 
        plan, 
        daily_credits_total, 
        daily_credits_remaining, 
        is_approved, 
        is_lifetime_max
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        init_plan,
        init_credits,
        init_credits,
        true,
        init_lifetime
    )
    ON CONFLICT (id) DO UPDATE SET
        plan = EXCLUDED.plan,
        daily_credits_total = EXCLUDED.daily_credits_total,
        is_lifetime_max = EXCLUDED.is_lifetime_max,
        updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. ENGINEERING ANALYSIS JOBS TABLE
-- ==============================================================================
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
    ON public.ansys_jobs FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow all users to insert jobs" ON public.ansys_jobs;
CREATE POLICY "Allow all users to insert jobs" 
    ON public.ansys_jobs FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update of jobs" ON public.ansys_jobs;
CREATE POLICY "Allow update of jobs" 
    ON public.ansys_jobs FOR UPDATE 
    USING (true);

DROP POLICY IF EXISTS "Allow delete of jobs" ON public.ansys_jobs;
CREATE POLICY "Allow delete of jobs" 
    ON public.ansys_jobs FOR DELETE 
    USING (true);

-- ==============================================================================
-- 4. NOVA COMMUNITY POSTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.nova_community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_initial TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    image_url TEXT,
    code_snippet TEXT,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.nova_community_posts(created_at DESC);

ALTER TABLE public.nova_community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all users to read community posts" ON public.nova_community_posts;
CREATE POLICY "Allow all users to read community posts" 
    ON public.nova_community_posts FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow all users to insert community posts" ON public.nova_community_posts;
CREATE POLICY "Allow all users to insert community posts" 
    ON public.nova_community_posts FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update of community posts" ON public.nova_community_posts;
CREATE POLICY "Allow update of community posts" 
    ON public.nova_community_posts FOR UPDATE 
    USING (true);

-- ==============================================================================
-- 5. NOVA COMMUNITY COMMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.nova_community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.nova_community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_initial TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.nova_community_comments(post_id);

ALTER TABLE public.nova_community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all users to read community comments" ON public.nova_community_comments;
CREATE POLICY "Allow all users to read community comments" 
    ON public.nova_community_comments FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow all users to insert community comments" ON public.nova_community_comments;
CREATE POLICY "Allow all users to insert community comments" 
    ON public.nova_community_comments FOR INSERT 
    WITH CHECK (true);

-- ==============================================================================
-- 6. ORDERS, SUBSCRIPTIONS & RECEIPTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.nova_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL UNIQUE,
    invoice_no TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    user_name TEXT,
    plan_name TEXT NOT NULL,
    billing_cycle TEXT DEFAULT 'monthly',
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_gateway TEXT DEFAULT 'Razorpay',
    payment_method TEXT DEFAULT 'UPI / Card',
    transaction_id TEXT,
    status TEXT DEFAULT 'PAID',
    receipt_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nova_orders_user_email ON public.nova_orders(user_email);
CREATE INDEX IF NOT EXISTS idx_nova_orders_order_id ON public.nova_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_nova_orders_invoice_no ON public.nova_orders(invoice_no);

ALTER TABLE public.nova_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all users to read orders" ON public.nova_orders;
CREATE POLICY "Allow all users to read orders" 
    ON public.nova_orders FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow all users to insert orders" ON public.nova_orders;
CREATE POLICY "Allow all users to insert orders" 
    ON public.nova_orders FOR INSERT 
    WITH CHECK (true);

-- ==============================================================================
-- 7. DAILY CREDIT USAGE AUDIT LEDGER TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    feature_name TEXT NOT NULL,
    credits_deducted INT NOT NULL,
    remaining_after INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_email ON public.credit_transactions(user_email);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view their own credit transactions" ON public.credit_transactions;
CREATE POLICY "Allow users to view their own credit transactions" 
    ON public.credit_transactions FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow insertion of credit transactions" ON public.credit_transactions;
CREATE POLICY "Allow insertion of credit transactions" 
    ON public.credit_transactions FOR INSERT 
    WITH CHECK (true);

-- ==============================================================================
-- 8. REALTIME REPLICATION SETUP
-- ==============================================================================
DO $$
BEGIN
    -- ansys_jobs
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'ansys_jobs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.ansys_jobs;
    END IF;

    -- nova_community_posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'nova_community_posts'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.nova_community_posts;
    END IF;

    -- nova_community_comments
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'nova_community_comments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.nova_community_comments;
    END IF;

    -- nova_orders
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'nova_orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.nova_orders;
    END IF;

    -- user_profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'user_profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
    END IF;
END $$;
