import { useProcessos } from "@/contexts/ProcessosContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { AlertCircle, CheckCircle2, FileText, TrendingUp, Menu, Calendar, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/_core/hooks/useAuth";

// --- TIPAGEM MANUAL DAS VIEWS (Para garantir leitura correta do Snake_Case) ---
interface PainelUrgenciaRow {
  processo_id: number;
  numero_processo: string;
  titulo: string;
  nivel_urgencia: 'Alta' | 'Média' | 'Baixa';
  prazo_detectado: string | null;
  insight_json: any;
  data_analise: string;
}

interface NotificacaoPendenteRow {
  id: number;
  numero_processo: string;
  mensagem: string;
  prazo_detectado: string;
  nivel_urgencia: string;
  user_id: string;
}

export default function Dashboard() {
  const { processos, obterProcessosPorStatus, isLoading: isLoadingContext } = useProcessos();
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  
  // States para Views SQL
  const [urgencias, setUrgencias] = useState<PainelUrgenciaRow[]>([]);
  const [notificacoes, setNotificacoes] = useState<NotificacaoPendenteRow[]>([]);
  const [isLoadingViews, setIsLoadingViews] = useState(true);

  // Busca dados diretamente das Views SQL
  useEffect(() => {
    const fetchViews = async () => {
      if (!user) return;
      try {
        const [urgenciasRes, notificacoesRes] = await Promise.all([
          supabase.from('vw_painel_urgencias').select('*'),
          supabase.from('vw_notificacoes_pendentes').select('*')
        ]);

        if (urgenciasRes.error) {
            console.error("Erro View Urgencias:", urgenciasRes.error);
        }
        if (notificacoesRes.error) {
            console.error("Erro View Notificacoes:", notificacoesRes.error);
        }

        // Força a tipagem para garantir que o TS entenda o retorno snake_case
        setUrgencias((urgenciasRes.data as unknown as PainelUrgenciaRow[]) || []);
        setNotificacoes((notificacoesRes.data as unknown as NotificacaoPendenteRow[]) || []);
      } catch (error) {
        console.error("Erro Crítico ao carregar dashboard:", error);
      } finally {
        setIsLoadingViews(false);
      }
    };

    fetchViews();
  }, [user]);

  const processosAtivos = obterProcessosPorStatus("ativo");
  const processosVeredicto = obterProcessosPorStatus("veredicto");

  // Filtros locais (Baseado no Contexto)
  const processosFiltrados = filtroStatus
    ? processos.filter((p) => p.status === filtroStatus)
    : processos;

  const calcularDiasAteVencimento = (dataPrazo: string) => {
    if (!dataPrazo) return null;
    const agora = new Date();
    agora.setHours(0, 0, 0, 0);
    const prazo = new Date(dataPrazo);
    prazo.setHours(0, 0, 0, 0);
    const diferenca = prazo.getTime() - agora.getTime();
    const dias = Math.ceil(diferenca / (1000 * 3600 * 24));
    return dias;
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "urgente": return "bg-red-500/10 text-red-600 border-red-200";
      case "proximo_vencer": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "ativo": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "aguardando": return "bg-stone-500/10 text-stone-600 border-stone-200";
      case "veredicto": return "bg-blue-500/10 text-blue-600 border-blue-200";
      default: return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "urgente": return "Urgente";
      case "proximo_vencer": return "Próximo";
      case "ativo": return "Ativo";
      case "aguardando": return "Aguardando";
      case "veredicto": return "Veredicto";
      default: return status;
    }
  };

  const isLoading = isLoadingContext || isLoadingViews;

  return (
    <div className="flex h-screen bg-secondary/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto">
        <div className="container py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2 tracking-tight">Visão Geral</h1>
              <p className="text-muted-foreground text-lg font-medium">
                Seu centro de inteligência e controle processual.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
            {/* CARD TOTAL */}
            <Card className="p-8 border-2 border-border/50 bg-white hover:shadow-2xl transition-all hover:-translate-y-1 rounded-4xl group">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <FileText className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Total</p>
                  <p className="text-4xl font-bold text-foreground">{processos.length}</p>
                </div>
              </div>
            </Card>

            {/* CARD ATIVOS */}
            <Card className="p-8 border-2 border-border/50 bg-white hover:shadow-2xl transition-all hover:-translate-y-1 rounded-4xl group">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Ativos</p>
                  <p className="text-4xl font-bold text-emerald-600">{processosAtivos.length}</p>
                </div>
              </div>
            </Card>

            {/* CARD NOTIFICAÇÕES (IA) */}
            <Card className="p-8 border-2 border-border/50 bg-white hover:shadow-2xl transition-all hover:-translate-y-1 rounded-4xl group">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                  <Bell className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Notificações</p>
                  <p className="text-4xl font-bold text-amber-600">{notificacoes.length}</p>
                </div>
              </div>
            </Card>

            {/* CARD URGENTES (IA View) */}
            <Card className="p-8 border-2 border-border/50 bg-white hover:shadow-2xl transition-all hover:-translate-y-1 rounded-4xl group">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:bg-red-500 transition-colors">
                  <AlertCircle className="w-7 h-7 text-red-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Urgentes (IA)</p>
                  <p className="text-4xl font-bold text-red-600">{urgencias.length}</p>
                </div>
              </div>
            </Card>

            {/* CARD VEREDICTOS */}
            <Card className="p-8 border-2 border-border/50 bg-white hover:shadow-2xl transition-all hover:-translate-y-1 rounded-4xl group">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <TrendingUp className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Veredictos</p>
                  <p className="text-4xl font-bold text-blue-600">{processosVeredicto.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <div className="mb-12 flex gap-4 flex-wrap bg-card p-6 rounded-2xl border-2 border-border/50 shadow-sm items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Filtrar:</span>
            <Button
              onClick={() => setFiltroStatus(null)}
              className={`rounded-xl font-bold transition-all px-8 py-6 ${
                filtroStatus === null
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "bg-white text-foreground border-2 border-border hover:border-primary/50"
              }`}
            >
              Todos ({processos.length})
            </Button>
            <Button
              onClick={() => setFiltroStatus("ativo")}
              className={`rounded-xl font-bold transition-all px-8 py-6 ${
                filtroStatus === "ativo"
                  ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20"
                  : "bg-white text-foreground border-2 border-border hover:border-emerald-600/50"
              }`}
            >
              Ativos ({processosAtivos.length})
            </Button>
            <Button
              onClick={() => setFiltroStatus("urgente")}
              className={`rounded-xl font-bold transition-all px-8 py-6 ${
                filtroStatus === "urgente"
                  ? "bg-red-600 text-white shadow-xl shadow-red-600/20"
                  : "bg-white text-foreground border-2 border-border hover:border-red-600/50"
              }`}
            >
              Urgentes ({urgencias.length})
            </Button>
          </div>

          {/* Lista de Processos */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="p-20 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Carregando inteligência...</p>
              </div>
            ) : processosFiltrados.length === 0 ? (
              <Card className="p-20 border-2 border-border/50 bg-white text-center rounded-[2.5rem] shadow-xl">
                <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FileText className="w-12 h-12 text-muted-foreground opacity-30" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Nenhum processo</h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium">Você ainda não possui processos cadastrados com este filtro.</p>
              </Card>
            ) : (
              processosFiltrados.map((processo) => {
                const diasAteVencimento = processo.proximoPrazo ? calcularDiasAteVencimento(processo.proximoPrazo) : null;
                const statusStyles = getStatusStyles(processo.status);

                return (
                  <Card
                    key={processo.id}
                    className="p-8 border-2 border-border/50 bg-white hover:shadow-2xl transition-all rounded-4xl cursor-pointer group hover:-translate-y-1"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-center">
                      {/* Informações Principais */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Processo</p>
                        <p className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors">{processo.numeroProcesso}</p>
                        <p className="text-sm text-muted-foreground font-medium">{processo.titulo}</p>
                      </div>

                      {/* Partes */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Parte Contrária</p>
                        <p className="font-bold text-lg text-foreground">{processo.parteContraria}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{processo.juizo}</p>
                        </div>
                      </div>

                      {/* Prazos */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Próximo Prazo</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <p className="font-bold text-lg text-foreground">{processo.proximoPrazo || "-"}</p>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium italic">{processo.descricaoPrazo}</p>
                      </div>

                      {/* Status e Ações */}
                      <div className="flex flex-col items-end gap-4">
                        <div className={`px-6 py-2 rounded-full font-bold text-sm border-2 ${statusStyles} shadow-sm`}>
                          {getStatusLabel(processo.status)}
                        </div>
                        {diasAteVencimento !== null && (
                          <div className={`text-xs font-bold uppercase tracking-widest ${
                            diasAteVencimento <= 0 ? "text-red-600" : diasAteVencimento <= 3 ? "text-orange-600" : "text-emerald-600"
                          }`}>
                            {diasAteVencimento === 0
                              ? "🔴 Vence hoje"
                              : diasAteVencimento < 0
                              ? "⛔ Vencido"
                              : diasAteVencimento === 1
                              ? "⚠️ Amanhã"
                              : `${diasAteVencimento} dias restantes`}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}