import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://opzfhsonosqqxometiou.supabase.co';
const defaultKey = 'sb_publishable_tZ-Wulo5bNADs-w9dca3Vw_3CL1RNuo';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || defaultUrl;
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || defaultKey;

let client = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.warn("Supabase client init error:", e);
}

export const supabase = client;

