import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mkmkhkuhzprlnjzcouei.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbWtoa3VoenBybG5qemNvdWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4OTk1NTEsImV4cCI6MjA5ODQ3NTU1MX0.lFC60895V5YplDhcHwmAEqN2LjRNttc8_AW_faWP-fY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const jobUrl = import.meta.env.VITE_SUPABASE_JOB_URL || supabaseUrl;
const jobKey = import.meta.env.VITE_SUPABASE_JOB_KEY || supabaseAnonKey;

// Export the second client with a different name
export const supabaseJob = createClient(jobUrl, jobKey);
