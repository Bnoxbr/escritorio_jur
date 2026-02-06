// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação robusta: se faltar algo, o app para aqui com uma mensagem clara
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltam as variáveis de ambiente do Supabase. " +
    "Verifique se o VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão no seu .env ou na Vercel."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);