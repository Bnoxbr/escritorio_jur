// src/services/agenteService.ts
import { supabase } from '@/lib/supabase'; // Using path alias

// Interface for Llama 3 response
interface LlamaResponse {
  nivel_risco: string;
  prazo_data: string | null;
  resumo: string;
}

// Mock function for Llama 3 call (replace with actual API call)
const chamarLlama3 = async (texto: string): Promise<LlamaResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    nivel_risco: "médio",
    prazo_data: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    resumo: `Resumo automático do texto: ${texto.substring(0, 50)}...`
  };
};

export const processarAndamento = async (textoBruto: string, userId: string) => {
  try {
    // 1. Enviar para o Llama 3 (Simulação da chamada de API)
    // Aqui você usará o Fetch para sua API local ou Provedor
    const insightIA = await chamarLlama3(textoBruto); 

    // 2. Persistir no Supabase sem intermediários (Drizzle)
    // Note: 'processamentos_ia' table needs to exist in Supabase
    const { data, error } = await supabase
      .from('processamentos_ia') // Ensure this table exists in your Supabase schema
      .insert({
        user_id: userId,
        texto_bruto: textoBruto,
        insight_json: insightIA,
        nivel_urgencia: insightIA.nivel_risco,
        prazo_detectado: insightIA.prazo_data,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Falha no Agente:", err);
    return null;
  }
};

export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  notify_vencidos: boolean;
  notify_urgentes: boolean;
  notify_proximos: boolean;
  dias_antecedencia: number;
  horario_notificacao: string;
}

export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Erro ao buscar preferências de notificação:', error);
      }
      return null;
    }

    return data as NotificationPreferences;
  } catch (err) {
    console.error('Falha ao buscar preferências:', err);
    return null;
  }
};

export const updateNotificationPreferences = async (
  userId: string, 
  preferences: Partial<Omit<NotificationPreferences, 'user_id'>>
) => {
  try {
    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Falha ao atualizar preferências:', err);
    return false;
  }
};
