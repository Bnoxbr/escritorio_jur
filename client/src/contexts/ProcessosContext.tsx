import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Processo } from "@/types/supabase-types";
import { useAuth } from "@/_core/hooks/useAuth";

interface ProcessosContextType {
  processos: Processo[];
  isLoading: boolean;
  adicionarProcesso: (processo: Omit<Processo, "id" | "createdAt" | "updatedAt" | "userId">) => Promise<void>;
  atualizarProcesso: (id: number, processo: Partial<Processo>) => Promise<void>;
  deletarProcesso: (id: number) => Promise<void>;
  obterProcessosPorStatus: (status: Processo["status"]) => Processo[];
  obterProcessosProximosAVencer: (dias: number) => Processo[];
  onboardingCompleto: boolean;
  setOnboardingCompleto: (completo: boolean) => void;
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
}

const ProcessosContext = createContext<ProcessosContextType | undefined>(undefined);

// --- FUNÇÕES AUXILIARES DE MAPEAMENTO (Snake_case <-> CamelCase) ---
// Isso impede que o Frontend quebre com as mudanças do Banco
const mapFromDb = (dbItem: any): Processo => ({
  id: dbItem.id,
  userId: dbItem.user_id,
  numeroProcesso: dbItem.numero_processo,
  titulo: dbItem.titulo,
  parteContraria: dbItem.parte_contraria,
  juizo: dbItem.juizo,
  dataAbertura: dbItem.data_abertura,
  proximoPrazo: dbItem.proximo_prazo,
  descricaoPrazo: dbItem.descricao_prazo,
  status: dbItem.status,
  tipoProcesso: dbItem.tipo_processo,
  valorCausa: dbItem.valor_causa,
  anotacoes: dbItem.anotacoes,
  aiSummary: dbItem.insight_json ? (dbItem.insight_json.resumo || dbItem.ai_summary) : null,
  createdAt: dbItem.created_at,
  updatedAt: dbItem.updated_at
});

const mapToDb = (localItem: Partial<Processo>) => {
  const payload: any = {};
  if (localItem.userId) payload.user_id = localItem.userId;
  if (localItem.numeroProcesso) payload.numero_processo = localItem.numeroProcesso;
  if (localItem.titulo) payload.titulo = localItem.titulo;
  if (localItem.parteContraria) payload.parte_contraria = localItem.parteContraria;
  if (localItem.juizo) payload.juizo = localItem.juizo;
  if (localItem.dataAbertura) payload.data_abertura = localItem.dataAbertura;
  if (localItem.proximoPrazo) payload.proximo_prazo = localItem.proximoPrazo;
  if (localItem.descricaoPrazo) payload.descricao_prazo = localItem.descricaoPrazo;
  if (localItem.status) payload.status = localItem.status;
  if (localItem.tipoProcesso) payload.tipo_processo = localItem.tipoProcesso;
  if (localItem.valorCausa) payload.valor_causa = localItem.valorCausa;
  if (localItem.anotacoes) payload.anotacoes = localItem.anotacoes;
  return payload;
};

export const ProcessosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingCompleto, setOnboardingCompleto] = useState(false);
  const { user } = useAuth();
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Efeito para carregar isDemoMode do localStorage
  useEffect(() => {
    const demo = localStorage.getItem("isDemoMode") === "true";
    setIsDemoMode(demo);
  }, []);

  // Efeito para persistir o Onboarding localmente
  useEffect(() => {
    const onboardingArmazenado = localStorage.getItem("onboarding_completo");
    if (onboardingArmazenado) {
      setOnboardingCompleto(JSON.parse(onboardingArmazenado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("onboarding_completo", JSON.stringify(onboardingCompleto));
  }, [onboardingCompleto]);

  const fetchProcessos = useCallback(async () => {
    // Se estiver em modo Demo, carrega dados mockados
    if (localStorage.getItem("isDemoMode") === "true") {
      setIsLoading(true);
      setTimeout(() => {
        setProcessos([
          {
            id: 9991,
            userId: "demo-user",
            numeroProcesso: "0012345-67.2024.8.26.0100",
            titulo: "Ação de Cobrança Indevida",
            parteContraria: "Banco Nacional S.A.",
            juizo: "3ª Vara Cível",
            dataAbertura: new Date().toISOString(),
            proximoPrazo: new Date(Date.now() + 86400000 * 2).toISOString(),
            descricaoPrazo: "Réplica à Contestação",
            status: "urgente",
            tipoProcesso: "cível",
            valorCausa: "R$ 45.000,00",
            anotacoes: "Cliente aguarda feedback urgente.",
            aiSummary: "Processo com alta probabilidade de êxito.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
        ] as unknown as Processo[]);
        setIsLoading(false);
      }, 500);
      return;
    }

    if (!user) return;
    setIsLoading(true);
    try {
      // CORREÇÃO: Usando nomes snake_case do banco
      const { data, error } = await supabase
        .from("processos")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      
      // Mapeia de volta para o formato que o React espera
      const processosFormatados = (data || []).map(mapFromDb);
      setProcessos(processosFormatados);
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
      toast.error("Erro ao carregar processos.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProcessos();
  }, [fetchProcessos]);

  const adicionarProcesso = async (novo: Omit<Processo, "id" | "createdAt" | "updatedAt" | "userId">) => {
    if (isDemoMode) {
      toast.info("Modo Demo: Processo adicionado localmente.");
      setProcessos(prev => [{
        ...novo,
        id: Math.floor(Math.random() * 10000),
        userId: 'demo-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Processo, ...prev]);
      return;
    }
    if (!user) return;
    try {
      // Converte para snake_case antes de enviar
      const payload = mapToDb({ ...novo, userId: user.id });

      const { data, error } = await supabase
        .from("processos")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      
      setProcessos((prev) => [mapFromDb(data), ...prev]);
      toast.success("Processo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar processo:", error);
      toast.error("Erro ao salvar processo.");
    }
  };

  const atualizarProcesso = async (id: number, atualizacoes: Partial<Processo>) => {
    try {
      // Converte atualizações para snake_case
      const payload = mapToDb(atualizacoes);

      const { data, error } = await supabase
        .from("processos")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setProcessos((prev) =>
        prev.map((p) => (p.id === id ? mapFromDb(data) : p))
      );
      toast.success("Processo atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar processo:", error);
      toast.error("Erro ao atualizar processo.");
    }
  };

  const deletarProcesso = async (id: number) => {
    if (isDemoMode) {
      setProcessos((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from("processos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setProcessos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Processo removido!");
    } catch (error) {
      console.error("Erro ao deletar processo:", error);
      toast.error("Erro ao remover processo.");
    }
  };

  const obterProcessosPorStatus = (status: Processo["status"]) => {
    return processos.filter((p) => p.status === status);
  };

  const obterProcessosProximosAVencer = (dias: number) => {
    const agora = new Date();
    const limite = new Date(agora.getTime() + dias * 24 * 60 * 60 * 1000);

    return processos.filter((p) => {
      if (!p.proximoPrazo) return false;
      const dataPrazo = new Date(p.proximoPrazo);
      return dataPrazo >= agora && dataPrazo <= limite;
    });
  };

  return (
    <ProcessosContext.Provider
      value={{
        processos,
        isLoading,
        isDemoMode,
        setIsDemoMode,
        adicionarProcesso,
        atualizarProcesso,
        deletarProcesso,
        obterProcessosPorStatus,
        obterProcessosProximosAVencer,
        onboardingCompleto,
        setOnboardingCompleto,
      }}
    >
      {children}
    </ProcessosContext.Provider>
  );
};

export const useProcessos = () => {
  const context = useContext(ProcessosContext);
  if (!context) {
    throw new Error("useProcessos deve ser usado dentro de ProcessosProvider");
  }
  return context;
};