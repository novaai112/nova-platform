-- ============================================================
-- NOVA AI PLATFORM — COMPLETE SUPABASE SQL SETUP
-- Fully tested & verified for production Supabase environments
-- ============================================================


-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";


-- ============================================================
-- HELPER FUNCTION: auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TABLE 1: user_profiles
-- Stores extended profile data for every authenticated user.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id                      UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                   TEXT         UNIQUE NOT NULL,
  full_name               TEXT         NOT NULL DEFAULT '',
  plan                    TEXT         NOT NULL DEFAULT 'Free'
                                       CHECK (plan IN ('Free','Basic','Pro','Max')),
  daily_credits_total     INTEGER      NOT NULL DEFAULT 100,
  daily_credits_remaining INTEGER      NOT NULL DEFAULT 100,
  is_approved             BOOLEAN      NOT NULL DEFAULT FALSE,
  is_lifetime_max         BOOLEAN      NOT NULL DEFAULT FALSE,
  last_credit_reset       TIMESTAMPTZ  DEFAULT NOW(),
  company                 TEXT         DEFAULT '',
  phone                   TEXT         DEFAULT '',
  avatar_url              TEXT         DEFAULT NULL,
  created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist on existing tables
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_lifetime_max BOOLEAN DEFAULT FALSE;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS daily_credits_total INTEGER DEFAULT 100;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS daily_credits_remaining INTEGER DEFAULT 100;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS company TEXT DEFAULT '';
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_credit_reset TIMESTAMPTZ DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_email_idx ON public.user_profiles (email);
CREATE INDEX        IF NOT EXISTS user_profiles_plan_idx  ON public.user_profiles (plan);

DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile"                 ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile"                 ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile"                   ON public.user_profiles;
DROP POLICY IF EXISTS "Users can upsert their own profile"                 ON public.user_profiles;
DROP POLICY IF EXISTS "Admin full access to user_profiles"                 ON public.user_profiles;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id OR email = auth.jwt() ->> 'email' OR auth.role() = 'service_role');

CREATE POLICY "Users can upsert their own profile"
  ON public.user_profiles FOR ALL
  USING (auth.uid() = id OR email = auth.jwt() ->> 'email' OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = id OR email = auth.jwt() ->> 'email' OR auth.role() = 'service_role');

CREATE POLICY "Admin full access to user_profiles"
  ON public.user_profiles FOR ALL
  USING (auth.jwt() ->> 'email' IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com'));


-- ============================================================
-- FUNCTION + TRIGGER: auto-create user_profile row on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, email, full_name, plan, daily_credits_total, daily_credits_remaining, is_approved
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 'Max' ELSE 'Free' END,
    CASE WHEN NEW.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 3000 ELSE 100 END,
    CASE WHEN NEW.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 3000 ELSE 100 END,
    CASE WHEN NEW.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN TRUE ELSE FALSE END
  )
  ON CONFLICT (id) DO UPDATE SET
    plan                    = CASE WHEN EXCLUDED.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 'Max' ELSE user_profiles.plan END,
    daily_credits_total     = CASE WHEN EXCLUDED.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 3000 ELSE user_profiles.daily_credits_total END,
    daily_credits_remaining = CASE WHEN EXCLUDED.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 3000 ELSE user_profiles.daily_credits_remaining END,
    is_approved             = CASE WHEN EXCLUDED.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN TRUE ELSE user_profiles.is_approved END,
    updated_at              = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- TABLE 2: ansys_jobs
-- Central jobs table: analysis jobs, purchases, license records.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ansys_jobs (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  job_id_display   TEXT          DEFAULT NULL,
  name             TEXT          NOT NULL DEFAULT '',
  type             TEXT          NOT NULL DEFAULT 'Nozzle Analysis',
  status           TEXT          NOT NULL DEFAULT 'Pending',
  price            NUMERIC(12,2) NOT NULL DEFAULT 0,
  geometry_data    JSONB         DEFAULT NULL,
  json_payload     JSONB         DEFAULT NULL,
  result_url       TEXT          DEFAULT NULL,
  report_url       TEXT          DEFAULT NULL,
  result_urls      TEXT          DEFAULT NULL,
  report_urls      TEXT          DEFAULT NULL,
  statuses         TEXT          DEFAULT NULL,
  excel_file_url   TEXT          DEFAULT NULL,
  json_url         TEXT          DEFAULT NULL,
  pdf_url          TEXT          DEFAULT NULL,
  error_message    TEXT          DEFAULT NULL,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist on existing tables
ALTER TABLE public.ansys_jobs ADD COLUMN IF NOT EXISTS result_urls TEXT DEFAULT NULL;
ALTER TABLE public.ansys_jobs ADD COLUMN IF NOT EXISTS report_urls TEXT DEFAULT NULL;
ALTER TABLE public.ansys_jobs ADD COLUMN IF NOT EXISTS statuses TEXT DEFAULT NULL;
ALTER TABLE public.ansys_jobs ADD COLUMN IF NOT EXISTS json_payload JSONB DEFAULT NULL;
ALTER TABLE public.ansys_jobs ADD COLUMN IF NOT EXISTS geometry_data JSONB DEFAULT NULL;
ALTER TABLE public.ansys_jobs ADD COLUMN IF NOT EXISTS job_id_display TEXT DEFAULT NULL;
ALTER TABLE public.ansys_jobs ADD COLUMN IF NOT EXISTS excel_file_url TEXT DEFAULT NULL;
ALTER TABLE public.ansys_jobs ADD COLUMN IF NOT EXISTS json_url TEXT DEFAULT NULL;
ALTER TABLE public.ansys_jobs ADD COLUMN IF NOT EXISTS pdf_url TEXT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS ansys_jobs_user_id_idx    ON public.ansys_jobs (user_id);
CREATE INDEX IF NOT EXISTS ansys_jobs_status_idx     ON public.ansys_jobs (status);
CREATE INDEX IF NOT EXISTS ansys_jobs_type_idx       ON public.ansys_jobs (type);
CREATE INDEX IF NOT EXISTS ansys_jobs_created_at_idx ON public.ansys_jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS ansys_jobs_job_id_idx     ON public.ansys_jobs (job_id_display);

DROP TRIGGER IF EXISTS trg_ansys_jobs_updated_at ON public.ansys_jobs;
CREATE TRIGGER trg_ansys_jobs_updated_at
  BEFORE UPDATE ON public.ansys_jobs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

ALTER TABLE public.ansys_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all users to read jobs"       ON public.ansys_jobs;
DROP POLICY IF EXISTS "Allow all users to insert jobs"     ON public.ansys_jobs;
DROP POLICY IF EXISTS "Allow update of jobs"               ON public.ansys_jobs;
DROP POLICY IF EXISTS "Allow delete of jobs"               ON public.ansys_jobs;
DROP POLICY IF EXISTS "Users can view their own jobs"      ON public.ansys_jobs;
DROP POLICY IF EXISTS "Users can insert their own jobs"    ON public.ansys_jobs;
DROP POLICY IF EXISTS "Users can update their own jobs"    ON public.ansys_jobs;
DROP POLICY IF EXISTS "Users can delete their own jobs"    ON public.ansys_jobs;
DROP POLICY IF EXISTS "Admin full access to ansys_jobs"    ON public.ansys_jobs;

CREATE POLICY "Users can view their own jobs"
  ON public.ansys_jobs FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL OR auth.role() = 'service_role' OR auth.jwt() ->> 'email' IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com'));

CREATE POLICY "Users can insert their own jobs"
  ON public.ansys_jobs FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can update their own jobs"
  ON public.ansys_jobs FOR UPDATE
  USING (user_id = auth.uid() OR user_id IS NULL OR auth.role() = 'service_role' OR auth.jwt() ->> 'email' IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com'));

CREATE POLICY "Users can delete their own jobs"
  ON public.ansys_jobs FOR DELETE
  USING (user_id = auth.uid() OR auth.role() = 'service_role' OR auth.jwt() ->> 'email' IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com'));


-- ============================================================
-- TABLE 3: nova_orders
-- Permanent payment and invoice records.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.nova_orders (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         TEXT          NOT NULL,
  invoice_no       TEXT          NOT NULL,
  user_id          UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email       TEXT          NOT NULL,
  user_name        TEXT          DEFAULT '',
  plan_name        TEXT          NOT NULL DEFAULT '',
  billing_cycle    TEXT          DEFAULT 'monthly',
  amount           NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency         TEXT          NOT NULL DEFAULT 'INR',
  payment_gateway  TEXT          DEFAULT 'Razorpay',
  payment_method   TEXT          DEFAULT '',
  transaction_id   TEXT          DEFAULT '',
  status           TEXT          NOT NULL DEFAULT 'PAID'
                                 CHECK (status IN ('PAID','PENDING','FAILED','REFUNDED')),
  receipt_data     JSONB         DEFAULT NULL,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS nova_orders_user_email_idx  ON public.nova_orders (user_email);
CREATE INDEX IF NOT EXISTS nova_orders_status_idx      ON public.nova_orders (status);
CREATE INDEX IF NOT EXISTS nova_orders_created_at_idx  ON public.nova_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS nova_orders_txn_idx         ON public.nova_orders (transaction_id);

DROP TRIGGER IF EXISTS trg_nova_orders_updated_at ON public.nova_orders;
CREATE TRIGGER trg_nova_orders_updated_at
  BEFORE UPDATE ON public.nova_orders
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

ALTER TABLE public.nova_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all users to read orders"     ON public.nova_orders;
DROP POLICY IF EXISTS "Allow all users to insert orders"   ON public.nova_orders;
DROP POLICY IF EXISTS "Users can view their own orders"    ON public.nova_orders;
DROP POLICY IF EXISTS "Anyone can insert orders"           ON public.nova_orders;
DROP POLICY IF EXISTS "Admin full access to nova_orders"   ON public.nova_orders;

CREATE POLICY "Users can view their own orders"
  ON public.nova_orders FOR SELECT
  USING (user_email = auth.jwt() ->> 'email' OR auth.role() = 'service_role' OR auth.jwt() ->> 'email' IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com'));

CREATE POLICY "Anyone can insert orders"
  ON public.nova_orders FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin full access to nova_orders"
  ON public.nova_orders FOR ALL
  USING (auth.jwt() ->> 'email' IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') OR auth.role() = 'service_role');


-- ============================================================
-- TABLE 4: nova_community_posts
-- Forum posts created by community members.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.nova_community_posts (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name        TEXT         NOT NULL DEFAULT 'Anonymous',
  user_initial     TEXT         NOT NULL DEFAULT 'A',
  title            TEXT         DEFAULT NULL,
  content          TEXT         NOT NULL,
  category         TEXT         DEFAULT 'General',
  image_url        TEXT         DEFAULT NULL,
  code_snippet     TEXT         DEFAULT NULL,
  likes_count      INTEGER      NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS nova_posts_created_at_idx ON public.nova_community_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS nova_posts_category_idx   ON public.nova_community_posts (category);

DROP TRIGGER IF EXISTS trg_nova_community_posts_updated_at ON public.nova_community_posts;
CREATE TRIGGER trg_nova_community_posts_updated_at
  BEFORE UPDATE ON public.nova_community_posts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

ALTER TABLE public.nova_community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all users to read community posts"   ON public.nova_community_posts;
DROP POLICY IF EXISTS "Allow all users to insert community posts" ON public.nova_community_posts;
DROP POLICY IF EXISTS "Allow update of community posts"           ON public.nova_community_posts;
DROP POLICY IF EXISTS "Community posts viewable by everyone"     ON public.nova_community_posts;
DROP POLICY IF EXISTS "Authenticated users create posts"          ON public.nova_community_posts;
DROP POLICY IF EXISTS "Users can update own posts"                ON public.nova_community_posts;

CREATE POLICY "Community posts viewable by everyone"
  ON public.nova_community_posts FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users create posts"
  ON public.nova_community_posts FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can update own posts"
  ON public.nova_community_posts FOR UPDATE
  USING (user_id = auth.uid() OR auth.jwt() ->> 'email' IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') OR auth.role() = 'service_role');


-- ============================================================
-- TABLE 5: nova_community_comments
-- Comments on community posts.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.nova_community_comments (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id          UUID         NOT NULL REFERENCES public.nova_community_posts(id) ON DELETE CASCADE,
  user_id          UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name        TEXT         NOT NULL DEFAULT 'Anonymous',
  user_initial     TEXT         NOT NULL DEFAULT 'A',
  comment          TEXT         NOT NULL,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS nova_comments_post_id_idx    ON public.nova_community_comments (post_id);
CREATE INDEX IF NOT EXISTS nova_comments_created_at_idx ON public.nova_community_comments (created_at ASC);

ALTER TABLE public.nova_community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all users to read community comments"   ON public.nova_community_comments;
DROP POLICY IF EXISTS "Allow all users to insert community comments" ON public.nova_community_comments;
DROP POLICY IF EXISTS "Comments viewable by everyone"               ON public.nova_community_comments;
DROP POLICY IF EXISTS "Authenticated users add comments"             ON public.nova_community_comments;
DROP POLICY IF EXISTS "Users can delete own comments"                ON public.nova_community_comments;

CREATE POLICY "Comments viewable by everyone"
  ON public.nova_community_comments FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users add comments"
  ON public.nova_community_comments FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can delete own comments"
  ON public.nova_community_comments FOR DELETE
  USING (user_id = auth.uid() OR auth.jwt() ->> 'email' IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') OR auth.role() = 'service_role');


-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

DROP POLICY IF EXISTS "Public can view avatars"             ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users upload avatars"  ON storage.objects;

CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'));


-- ============================================================
-- REALTIME — Enable for instant UI updates
-- ============================================================
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ansys_jobs;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.nova_community_posts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.nova_community_comments;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- FUNCTION: get_job_stats()
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_job_stats()
RETURNS TABLE (
  total         BIGINT,
  completed     BIGINT,
  pending       BIGINT,
  failed        BIGINT,
  processing    BIGINT,
  total_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total,
    COUNT(*) FILTER (WHERE status IN ('Completed','Success'))::BIGINT AS completed,
    COUNT(*) FILTER (WHERE status = 'Pending')::BIGINT                AS pending,
    COUNT(*) FILTER (WHERE status = 'Failed')::BIGINT                 AS failed,
    COUNT(*) FILTER (WHERE status NOT IN ('Completed','Success','Pending','Failed'))::BIGINT AS processing,
    COALESCE(SUM(price) FILTER (WHERE status IN ('Completed','Success')), 0) AS total_revenue
  FROM public.ansys_jobs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- FUNCTION: approve_user(email)
-- ============================================================
CREATE OR REPLACE FUNCTION public.approve_user(target_email TEXT)
RETURNS TEXT AS $$
DECLARE v INT;
BEGIN
  UPDATE public.user_profiles
  SET is_approved = TRUE, updated_at = NOW()
  WHERE email = target_email;
  GET DIAGNOSTICS v = ROW_COUNT;
  RETURN CASE WHEN v = 0 THEN 'Not found: ' ELSE 'Approved: ' END || target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- FUNCTION: upgrade_user_plan(email, plan, total, remaining)
-- ============================================================
CREATE OR REPLACE FUNCTION public.upgrade_user_plan(
  target_email  TEXT,
  new_plan      TEXT,
  new_total     INTEGER,
  new_remaining INTEGER
)
RETURNS TEXT AS $$
DECLARE v INT;
BEGIN
  UPDATE public.user_profiles
  SET plan = new_plan, daily_credits_total = new_total,
      daily_credits_remaining = new_remaining,
      is_approved = TRUE, updated_at = NOW()
  WHERE email = target_email;
  GET DIAGNOSTICS v = ROW_COUNT;
  RETURN CASE WHEN v = 0 THEN 'Not found: ' ELSE 'Upgraded to ' || new_plan || ': ' END || target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- FUNCTION: reset_daily_credits()
-- ============================================================
CREATE OR REPLACE FUNCTION public.reset_daily_credits()
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_profiles
  SET daily_credits_remaining = daily_credits_total, updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- ADMIN VIEW: nova_admin_dashboard
-- ============================================================
CREATE OR REPLACE VIEW public.nova_admin_dashboard AS
SELECT
  up.email,
  up.full_name,
  up.plan,
  up.daily_credits_total,
  up.daily_credits_remaining,
  up.is_approved,
  up.company,
  up.phone,
  up.created_at AS joined_at,
  COALESCE(j.total_jobs, 0) AS total_jobs,
  COALESCE(j.completed_jobs, 0) AS completed_jobs,
  COALESCE(j.revenue_generated, 0) AS revenue_generated,
  COALESCE(o.total_orders, 0) AS total_orders,
  COALESCE(o.total_paid, 0) AS total_paid
FROM public.user_profiles up
LEFT JOIN (
  SELECT
    user_id,
    COUNT(*) AS total_jobs,
    COUNT(*) FILTER (WHERE status IN ('Completed','Success')) AS completed_jobs,
    COALESCE(SUM(price) FILTER (WHERE status IN ('Completed','Success')), 0) AS revenue_generated
  FROM public.ansys_jobs
  GROUP BY user_id
) j ON j.user_id = up.id
LEFT JOIN (
  SELECT
    user_email,
    COUNT(*) AS total_orders,
    COALESCE(SUM(amount), 0) AS total_paid
  FROM public.nova_orders
  GROUP BY user_email
) o ON o.user_email = up.email
ORDER BY up.created_at DESC;


-- ============================================================
-- SEED / SYNC EXISTING USERS INTO user_profiles
-- ============================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT id, email, COALESCE(raw_user_meta_data ->> 'full_name', split_part(email, '@', 1)) as name
    FROM auth.users
  ) LOOP
    INSERT INTO public.user_profiles
      (id, email, full_name, plan, daily_credits_total, daily_credits_remaining, is_approved, updated_at)
    VALUES
      (
        r.id,
        r.email,
        r.name,
        CASE WHEN r.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 'Max' ELSE 'Free' END,
        CASE WHEN r.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 3000 ELSE 100 END,
        CASE WHEN r.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 3000 ELSE 100 END,
        CASE WHEN r.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN TRUE ELSE FALSE END,
        NOW()
      )
    ON CONFLICT (email) DO UPDATE SET
      id                      = EXCLUDED.id,
      plan                    = CASE WHEN EXCLUDED.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 'Max' ELSE user_profiles.plan END,
      daily_credits_total     = CASE WHEN EXCLUDED.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 3000 ELSE user_profiles.daily_credits_total END,
      daily_credits_remaining = CASE WHEN EXCLUDED.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN 3000 ELSE user_profiles.daily_credits_remaining END,
      is_approved             = CASE WHEN EXCLUDED.email IN ('dineshkumar2729304@gmail.com', 'analysis.ai.nova@gmail.com') THEN TRUE ELSE user_profiles.is_approved END,
      updated_at              = NOW();
  END LOOP;
END $$;


-- ============================================================
-- VERIFY: Row counts across all tables
-- ============================================================
SELECT 'user_profiles'           AS table_name, COUNT(*) AS rows FROM public.user_profiles
UNION ALL
SELECT 'ansys_jobs',                             COUNT(*)         FROM public.ansys_jobs
UNION ALL
SELECT 'nova_orders',                            COUNT(*)         FROM public.nova_orders
UNION ALL
SELECT 'nova_community_posts',                   COUNT(*)         FROM public.nova_community_posts
UNION ALL
SELECT 'nova_community_comments',                COUNT(*)         FROM public.nova_community_comments;
