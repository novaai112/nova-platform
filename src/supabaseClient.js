import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://oszozycwjqvsdnulmhrc.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zem96eWN3anF2c2RudWxtaHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzOTA1NjEsImV4cCI6MjEwNjk2NjU2MX0.b0p3qnqrHkvZe3L1rHTnK05YcUCiqGj2K3NMWo3_ToE';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || defaultUrl;
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)) || defaultKey;

let client = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (e) {
  console.warn("Supabase client init error:", e);
}

export const supabase = client;
export { supabaseUrl, supabaseAnonKey };
