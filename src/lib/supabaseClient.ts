// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;
let supabaseInitializationError: string | null = null;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  supabaseInitializationError = 'As variáveis de ambiente do Supabase (SUPABASE_URL, SUPABASE_SERVICE_KEY) não estão configuradas.';
  console.error('Erro ao inicializar Supabase Client:', supabaseInitializationError);
} else {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { supabase, supabaseInitializationError };
