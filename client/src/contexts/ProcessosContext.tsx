
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
      // Simula delay de rede
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
            proximoPrazo: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 dias
            descricaoPrazo: "Réplica à Contestação",
            status: "urgente",
            tipoProcesso: "cível",
            valorCausa: "R$ 45.000,00",
            anotacoes: "Cliente aguarda feedback urgente.",
            aiSummary: "Processo com alta probabilidade de êxito.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 9992,
            userId: "demo-user",
            numeroProcesso: "0054321-99.2023.5.02.0001",
            titulo: "Reclamação Trabalhista",
            parteContraria: "Empresa de Transportes LTDA",
            juizo: "1ª Vara do Trabalho",
            dataAbertura: new Date().toISOString(),
            proximoPrazo: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 dias
            descricaoPrazo: "Audiência de Instrução",
            status: "ativo",
            tipoProcesso: "trabalhista",
            valorCausa: "R$ 120.000,00",
            anotacoes: null,
            aiSummary: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ] as unknown as Processo[]); // Type casting to match Supabase Processo type exactly if needed
        setIsLoading(false);
      }, 500);
      return;
    }

    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("processos")
        .select("*")
        .eq("userId", user.id)
        .order("updatedAt", { ascending: false });

      if (error) throw error;
      setProcessos(data || []);
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
      // Adiciona fake
      setProcessos(prev => [{
        ...novo,
        id: Math.floor(Math.random() * 10000),
        userId: 'demo-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dataAbertura: novo.dataAbertura || null,
        proximoPrazo: novo.proximoPrazo || null,
        descricaoPrazo: novo.descricaoPrazo || null,
        status: novo.status || "ativo",
        tipoProcesso: novo.tipoProcesso || "cível",
        valorCausa: novo.valorCausa || null,
        anotacoes: novo.anotacoes || null,
        aiSummary: null
      } as Processo, ...prev]);
      return;
    }
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("processos")
        .insert({ ...novo, userId: user.id })
        .select()
        .single();

      if (error) throw error;
      
      setProcessos((prev) => [data, ...prev]);
      toast.success("Processo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar processo:", error);
      toast.error("Erro ao salvar processo.");
    }
  };

  const atualizarProcesso = async (id: number, atualizacoes: Partial<Processo>) => {
    try {
      const { data, error } = await supabase
        .from("processos")
        .update(atualizacoes)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setProcessos((prev) =>
        prev.map((p) => (p.id === id ? data : p))
      );
      toast.success("Processo atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar processo:", error);
      toast.error("Erro ao atualizar processo.");
    }
  };

  const deletarProcesso = async (id: number) => {
    if (isDemoMode) {
      toast.info("Modo Demo: Processo removido localmente.");
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
