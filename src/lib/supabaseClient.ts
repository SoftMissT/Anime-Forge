
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Helper seguro para obter variáveis de ambiente (suporta Vite e Next.js)
const getEnvVar = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return '';
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY');

let supabaseInstance: SupabaseClient | null = null;
let initializationError: string | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
    });
  } catch (error: any) {
    console.error('Erro ao inicializar Supabase:', error);
    initializationError = error.message;
  }
} else {
  initializationError = "Chaves do Supabase não configuradas.";
  console.warn(initializationError);
}

export const supabase = supabaseInstance;
export const supabaseInitializationError = initializationError;
