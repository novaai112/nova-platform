import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const jobUrl = import.meta.env.VITE_SUPABASE_JOB_URL
const jobKey = import.meta.env.VITE_SUPABASE_JOB_KEY

// Export the second client with a different name
export const supabaseJob = createClient(jobUrl, jobKey)
