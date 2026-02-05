
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          openId: string
          name: string | null
          email: string | null
          loginMethod: string | null
          role: "user" | "admin"
          createdAt: string
          updatedAt: string
          lastSignedIn: string
        }
        Insert: {
          id?: string
          openId: string
          name?: string | null
          email?: string | null
          loginMethod?: string | null
          role?: "user" | "admin"
          createdAt?: string
          updatedAt?: string
          lastSignedIn?: string
        }
        Update: {
          id?: string
          openId?: string
          name?: string | null
          email?: string | null
          loginMethod?: string | null
          role?: "user" | "admin"
          createdAt?: string
          updatedAt?: string
          lastSignedIn?: string
        }
      }
      notification_preferences: {
        Row: {
          id: number
          userId: string
          emailNotificationsEnabled: "true" | "false"
          notifyVencidos: "true" | "false"
          notifyUrgentes: "true" | "false"
          notifyProximos: "true" | "false"
          diasAntecedencia: number
          horarioNotificacao: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          userId: string
          emailNotificationsEnabled?: "true" | "false"
          notifyVencidos?: "true" | "false"
          notifyUrgentes?: "true" | "false"
          notifyProximos?: "true" | "false"
          diasAntecedencia?: number
          horarioNotificacao?: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          userId?: string
          emailNotificationsEnabled?: "true" | "false"
          notifyVencidos?: "true" | "false"
          notifyUrgentes?: "true" | "false"
          notifyProximos?: "true" | "false"
          diasAntecedencia?: number
          horarioNotificacao?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      notification_history: {
        Row: {
          id: number
          userId: string
          processId: string | null
          numeroProcesso: string | null
          tipo: "vencido" | "urgente" | "proximo"
          assunto: string
          status: "enviado" | "falha" | "pendente"
          dataPrazo: string | null
          dataEnvio: string | null
          createdAt: string
        }
        Insert: {
          id?: number
          userId: string
          processId?: string | null
          numeroProcesso?: string | null
          tipo: "vencido" | "urgente" | "proximo"
          assunto: string
          status?: "enviado" | "falha" | "pendente"
          dataPrazo?: string | null
          dataEnvio?: string | null
          createdAt?: string
        }
        Update: {
          id?: number
          userId?: string
          processId?: string | null
          numeroProcesso?: string | null
          tipo: "vencido" | "urgente" | "proximo"
          assunto: string
          status?: "enviado" | "falha" | "pendente"
          dataPrazo?: string | null
          dataEnvio?: string | null
          createdAt?: string
        }
      }
      processos: {
        Row: {
          id: number
          userId: string
          numeroProcesso: string
          titulo: string
          parteContraria: string
          juizo: string
          dataAbertura: string | null
          proximoPrazo: string | null
          descricaoPrazo: string | null
          status: "ativo" | "proximo_vencer" | "urgente" | "aguardando" | "veredicto" | "concluido"
          tipoProcesso: "cível" | "criminal" | "trabalhista" | "administrativo"
          valorCausa: string | null
          anotacoes: string | null
          aiSummary: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          userId: string
          numeroProcesso: string
          titulo: string
          parteContraria: string
          juizo: string
          dataAbertura?: string | null
          proximoPrazo?: string | null
          descricaoPrazo?: string | null
          status?: "ativo" | "proximo_vencer" | "urgente" | "aguardando" | "veredicto" | "concluido"
          tipoProcesso?: "cível" | "criminal" | "trabalhista" | "administrativo"
          valorCausa?: string | null
          anotacoes?: string | null
          aiSummary?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          userId?: string
          numeroProcesso?: string
          titulo?: string
          parteContraria?: string
          juizo?: string
          dataAbertura?: string | null
          proximoPrazo?: string | null
          descricaoPrazo?: string | null
          status?: "ativo" | "proximo_vencer" | "urgente" | "aguardando" | "veredicto" | "concluido"
          tipoProcesso?: "cível" | "criminal" | "trabalhista" | "administrativo"
          valorCausa?: string | null
          anotacoes?: string | null
          aiSummary?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      documentos: {
        Row: {
          id: number
          userId: string
          processoId: number | null
          numeroProcesso: string | null
          nome: string
          url: string
          fileKey: string | null
          mimeType: string | null
          tamanho: number | null
          tipo: "pdf" | "imagem" | "documento" | "outro" | null
          descricao: string | null
          createdAt: string
        }
        Insert: {
          id?: number
          userId: string
          processoId?: number | null
          numeroProcesso?: string | null
          nome: string
          url: string
          fileKey?: string | null
          mimeType?: string | null
          tamanho?: number | null
          tipo?: "pdf" | "imagem" | "documento" | "outro" | null
          descricao?: string | null
          createdAt?: string
        }
        Update: {
          id?: number
          userId?: string
          processoId?: number | null
          numeroProcesso?: string | null
          nome?: string
          url?: string
          fileKey?: string | null
          mimeType?: string | null
          tamanho?: number | null
          tipo?: "pdf" | "imagem" | "documento" | "outro" | null
          descricao?: string | null
          createdAt?: string
        }
      }
    }
    Views: {
      vw_painel_urgencias: {
        Row: {
          id: number
          userId: string
          titulo: string
          numeroProcesso: string
          status: string
          proximoPrazo: string
          diasRestantes: number
        }
      }
      vw_notificacoes_pendentes: {
        Row: {
          id: number
          userId: string
          email: string
          numeroProcesso: string
          assunto: string
          tipo: string
          dataPrazo: string
          horarioNotificacao: string
        }
      }
      vw_processos_proximos_vencer: {
        Row: {
          id: number
          userId: string
          numeroProcesso: string
          titulo: string
          proximoPrazo: string
          status: string
          dias_restantes: number
        }
      }
    }
    Functions: {
      [_: string]: never
    }
    Enums: {
      [_: string]: never
    }
  }
}

export type Processo = Database['public']['Tables']['processos']['Row']
export type NotificationPreference = Database['public']['Tables']['notification_preferences']['Row']
export type NotificationHistory = Database['public']['Tables']['notification_history']['Row']
export type Documento = Database['public']['Tables']['documentos']['Row']
export type Insight = {
    id: string;
    content: string;
    type: 'alert' | 'info' | 'suggestion';
}
