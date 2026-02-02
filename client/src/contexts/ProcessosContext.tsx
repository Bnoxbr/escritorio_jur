import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// 1. Tipagem do Processo (Mantenha igual para ser compatível com o BD futuro)
export interface Processo {
  id: string;
  numeroProcesso: string;
  titulo: string;
  parteContraria: string;
  juizo: string;
  dataAbertura: string;
  proximoPrazo: string;
  descricaoPrazo: string;
  status: "ativo" | "proximo_vencer" | "urgente" | "aguardando" | "veredicto";
  tipoProcesso: "cível" | "criminal" | "trabalhista" | "administrativo";
  documentos?: string[];
  anotacoes: string;
  valorCausa?: string;
  aiSummary?: string;
}

// 2. Dados Fictícios para o seu Mockup
const MOCK_DATA: Processo[] = [
  {
    id: "1",
    numeroProcesso: "0001234-56.2026.8.26.0000",
    titulo: "Ação de Cobrança - Empresa Alpha",
    parteContraria: "Empresa Beta LTDA",
    juizo: "1ª Vara Cível de São José dos Campos",
    dataAbertura: "2026-01-10",
    proximoPrazo: "2026-02-28",
    descricaoPrazo: "Contestação",
    status: "ativo",
    tipoProcesso: "cível",
    anotacoes: "Prioridade alta conforme solicitado pelo sócio."
  },
  {
    id: "2",
    numeroProcesso: "0009876-12.2026.5.15.0132",
    titulo: "Reclamação Trabalhista - João Silva",
    parteContraria: "Indústria de Peças S.A.",
    juizo: "2ª Vara do Trabalho",
    dataAbertura: "2026-01-20",
    proximoPrazo: "2026-02-05",
    descricaoPrazo: "Audiência Inicial",
    status: "urgente",
    tipoProcesso: "trabalhista",
    anotacoes: "Preparar preposto e documentos de ponto."
  }
];

interface ProcessosContextType {
  processos: Processo[];
  isLoading: boolean;
  adicionarProcesso: (processo: Omit<Processo, "id">) => void;
  atualizarProcesso: (id: string, processo: Partial<Processo>) => void;
  deletarProcesso: (id: string) => void;
  obterProcessosPorStatus: (status: Processo["status"]) => Processo[];
  obterProcessosProximosAVencer: (dias: number) => Processo[];
  onboardingCompleto: boolean;
  setOnboardingCompleto: (completo: boolean) => void;
}

const ProcessosContext = createContext<ProcessosContextType | undefined>(undefined);

export const ProcessosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- LÓGICA DE MOCK (PARA O DESIGN) ---
  const [processos, setProcessos] = useState<Processo[]>(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingCompleto, setOnboardingCompleto] = useState(false);

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

  // Mock das Funções (Simulando o backend)
  const adicionarProcesso = (novo: Omit<Processo, "id">) => {
    const processoComId = { ...novo, id: Math.random().toString(36).substr(2, 9) };
    setProcessos((prev) => [...prev, processoComId]);
    toast.success("Processo adicionado localmente!");
  };

  const atualizarProcesso = (id: string, atualizacoes: Partial<Processo>) => {
    setProcessos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...atualizacoes } : p))
    );
    toast.success("Processo atualizado!");
  };

  const deletarProcesso = (id: string) => {
    setProcessos((prev) => prev.filter((p) => p.id !== id));
    toast.success("Processo removido!");
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