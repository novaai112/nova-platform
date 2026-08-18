import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://opzfhsonosqqxometiou.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_tZ-Wulo5bNADs-w9dca3Vw_3CL1RNuo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const jobUrl = import.meta.env.VITE_SUPABASE_JOB_URL || supabaseUrl;
const jobKey = import.meta.env.VITE_SUPABASE_JOB_KEY || supabaseAnonKey;

// Export the second client with a different name
export const supabaseJob = createClient(jobUrl, jobKey);
