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
  processId: string;
}

export default function Calendario() {
  const { processos } = useProcessos();
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
          descricao: processo.descricaoPrazo,
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
              <h1 className="text-5xl font-bold text-foreground mb-2 tracking-tight">Calendário Jurídico</h1>
              <p className="text-muted-foreground text-lg font-medium">Gestão inteligente de todos os seus prazos processuais.</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <Card className="p-6 border-2 border-border/50 bg-white rounded-2xl text-center hover:shadow-xl transition-all group">
              <div className="text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">{stats.total}</div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total de Prazos</p>
            </Card>
            <Card className="p-6 border-2 border-border/50 bg-white rounded-2xl text-center hover:shadow-xl transition-all group">
              <div className="text-3xl font-bold text-red-600 mb-1 group-hover:scale-110 transition-transform">{stats.vencidos}</div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Vencidos</p>
            </Card>
            <Card className="p-6 border-2 border-border/50 bg-white rounded-2xl text-center hover:shadow-xl transition-all group">
              <div className="text-3xl font-bold text-orange-600 mb-1 group-hover:scale-110 transition-transform">{stats.urgentes}</div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Urgentes</p>
            </Card>
            <Card className="p-6 border-2 border-border/50 bg-white rounded-2xl text-center hover:shadow-xl transition-all group">
              <div className="text-3xl font-bold text-amber-500 mb-1 group-hover:scale-110 transition-transform">{stats.proximos}</div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Próximos</p>
            </Card>
            <Card className="p-6 border-2 border-border/50 bg-white rounded-2xl text-center hover:shadow-xl transition-all group">
              <div className="text-3xl font-bold text-emerald-600 mb-1 group-hover:scale-110 transition-transform">{stats.normais}</div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Normais</p>
            </Card>
          </div>

          {/* Filtros e Ações */}
          <div className="flex gap-4 mb-12 flex-wrap items-center bg-card p-6 rounded-2xl border-2 border-border/50 shadow-sm">
            <Button
              onClick={() => setFiltroStatus(null)}
              className={`rounded-xl font-bold transition-all px-6 py-6 ${
                filtroStatus === null
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "bg-white text-foreground border-2 border-border hover:border-primary/50"
              }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Todos
            </Button>
            <Button
              onClick={() => setFiltroStatus("vencido")}
              className={`rounded-xl font-bold transition-all px-6 py-6 ${
                filtroStatus === "vencido"
                  ? "bg-red-600 text-white shadow-xl shadow-red-600/20"
                  : "bg-white text-foreground border-2 border-border hover:border-red-600/50"
              }`}
            >
              Vencidos ({stats.vencidos})
            </Button>
            <Button
              onClick={() => setFiltroStatus("urgente")}
              className={`rounded-xl font-bold transition-all px-6 py-6 ${
                filtroStatus === "urgente"
                  ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20"
                  : "bg-white text-foreground border-2 border-border hover:border-orange-600/50"
              }`}
            >
              Urgentes ({stats.urgentes})
            </Button>
            <Button
              onClick={() => setFiltroStatus("proximo")}
              className={`rounded-xl font-bold transition-all px-6 py-6 ${
                filtroStatus === "proximo"
                  ? "bg-amber-500 text-white shadow-xl shadow-amber-500/20"
                  : "bg-white text-foreground border-2 border-border hover:border-amber-500/50"
              }`}
            >
              Próximos ({stats.proximos})
            </Button>

            <div className="flex-1" />

            <Button
              onClick={handleExportarCalendario}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl font-bold gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Exportar Calendário
            </Button>
          </div>

          {/* Calendário */}
          <div className="rounded-[2.5rem] overflow-hidden border-2 border-border/50 shadow-2xl bg-white p-8">
            {prazosFiltrados.length === 0 ? (
              <div className="p-20 text-center">
                <Calendar className="w-16 h-16 text-muted-foreground opacity-20 mx-auto mb-6" />
                <p className="text-muted-foreground text-xl font-medium">
                  Nenhum prazo encontrado com este filtro.
                </p>
                <Button variant="outline" onClick={() => setFiltroStatus(null)} className="mt-8 rounded-xl font-bold border-2">Ver todos os prazos</Button>
              </div>
            ) : (
              <CalendarPrazos prazos={prazosFiltrados} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
