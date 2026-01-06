import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Warning instead of Error to prevent build crash if envs are missing during build time
    console.warn("Variáveis de ambiente do Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) não estão definidas.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');