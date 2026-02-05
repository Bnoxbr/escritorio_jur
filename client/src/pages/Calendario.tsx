import { useState, useMemo } from "react";
import { useProcessos } from "@/contexts/ProcessosContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import CalendarPrazos from "@/components/CalendarPrazos";
import { Menu, Download, Filter, Calendar } from "lucide-react";

interface Prazo {
  id: string;
  numeroProcesso: string;
  descricao: string;
  dataPrazo: Date;
  status: "vencido" | "urgente" | "proximo" | "normal";
  processId: number;
}

export default function Calendario() {
  const { processos, isLoading } = useProcessos();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);

  // Gerar prazos a partir dos processos
  const prazos = useMemo(() => {
    const prazosList: Prazo[] = [];
    
    processos.forEach((processo) => {
      if (processo.proximoPrazo) {
        const dataPrazo = new Date(processo.proximoPrazo);
        const hoje = new Date();
        const diasRestantes = Math.floor(
          (dataPrazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
        );

        let status: "vencido" | "urgente" | "proximo" | "normal" = "normal";
        if (diasRestantes < 0) {
          status = "vencido";
        } else if (diasRestantes <= 3) {
          status = "urgente";
        } else if (diasRestantes <= 7) {
          status = "proximo";
        }

        prazosList.push({
          id: `${processo.id}-prazo`,
          numeroProcesso: processo.numeroProcesso,
          descricao: processo.descricaoPrazo || "",
          dataPrazo,
          status,
          processId: processo.id,
        });
      }
    });

    return prazosList;
  }, [processos]);

  // Filtrar prazos
  const prazosFiltrados = useMemo(() => {
    if (!filtroStatus) return prazos;
    return prazos.filter((prazo) => prazo.status === filtroStatus);
  }, [prazos, filtroStatus]);

  // Estatísticas
  const stats = useMemo(() => {
    return {
      total: prazos.length,
      vencidos: prazos.filter((p) => p.status === "vencido").length,
      urgentes: prazos.filter((p) => p.status === "urgente").length,
      proximos: prazos.filter((p) => p.status === "proximo").length,
      normais: prazos.filter((p) => p.status === "normal").length,
    };
  }, [prazos]);

  const handleExportarCalendario = () => {
    // Simular download de calendário
    const conteudo = prazos
      .map(
        (p) =>
          `${p.numeroProcesso} - ${p.descricao} - ${p.dataPrazo.toLocaleDateString("pt-BR")} (${p.status})`
      )
      .join("\n");

    const blob = new Blob([conteudo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "calendario-prazos.txt";
    link.click();
  };

  return (
    <div className="flex h-screen bg-secondary/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto">
        <div className="container py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Calendário Jurídico</h1>
              <p className="text-muted-foreground">
                Visualize e gerencie todos os prazos do escritório
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleExportarCalendario}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Novo Prazo
              </Button>
            </div>
          </div>

          {isLoading ? (
             <div className="flex items-center justify-center h-64">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
             </div>
          ) : (
            <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold mb-1">{stats.total}</div>
              <p className="text-xs text-muted-foreground font-bold uppercase">Total</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.vencidos}</div>
              <p className="text-xs text-muted-foreground font-bold uppercase">Vencidos</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.urgentes}</div>
              <p className="text-xs text-muted-foreground font-bold uppercase">Urgentes</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold text-amber-500 mb-1">{stats.proximos}</div>
              <p className="text-xs text-muted-foreground font-bold uppercase">Próximos</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">{stats.normais}</div>
              <p className="text-xs text-muted-foreground font-bold uppercase">Normais</p>
            </Card>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <CalendarPrazos prazos={prazosFiltrados} />
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filtros</h3>
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </div>
                {/* ... filtros ... */}
              </Card>
            </div>
          </div>
          </>
          )}
        </div>
      </main>
    </div>
  );
}
