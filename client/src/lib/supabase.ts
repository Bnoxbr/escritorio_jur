// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Essas variáveis devem estar no seu arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Variáveis de ambiente do Supabase não encontradas!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);