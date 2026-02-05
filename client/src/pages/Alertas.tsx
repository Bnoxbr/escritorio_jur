import { useProcessos } from "@/contexts/ProcessosContext";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { AlertCircle, Bell, CheckCircle2, Trash2, Clock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Database } from "@/types/supabase-types";
import { useAuth } from "@/_core/hooks/useAuth";

type NotificationHistory = Database['public']['Tables']['notification_history']['Row'];

export default function Alertas() {
  const { obterProcessosProximosAVencer } = useProcessos();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alertas, setAlertas] = useState<NotificationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchAlertas = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notification_history")
        .select("*")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false });

      if (error) throw error;
      setAlertas(data || []);
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
      toast.error("Erro ao carregar alertas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, [user]);

  // Função auxiliar para gerar alertas baseados nos prazos (simulação de backend)
  const sincronizarAlertas = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const processosProximos = obterProcessosProximosAVencer(7);
      const novosAlertas = [];

      for (const processo of processosProximos) {
        // Verifica se já existe alerta recente para este processo (simples check local para demo)
        // Na prática, o backend faria isso melhor
        const jaExiste = alertas.some(a => a.processId === String(processo.id) && 
          new Date(a.createdAt).toDateString() === new Date().toDateString());
        
        if (jaExiste) continue;

        const dias = Math.ceil((new Date(processo.proximoPrazo!).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        
        let tipo: "urgente" | "proximo" | "vencido" = "proximo";
        if (dias <= 0) tipo = "vencido";
        else if (dias <= 3) tipo = "urgente";

        const { data, error } = await supabase.from("notification_history").insert({
          userId: user.id,
          processId: String(processo.id),
          numeroProcesso: processo.numeroProcesso,
          tipo: tipo,
          assunto: `Prazo ${tipo === 'vencido' ? 'Vencido' : tipo === 'urgente' ? 'Urgente' : 'Próximo'}: ${processo.descricaoPrazo}`,
          status: 'pendente',
          dataPrazo: processo.proximoPrazo,
          dataEnvio: new Date().toISOString()
        }).select().single();

        if (error) throw error;
        if (data) novosAlertas.push(data);
      }

      if (novosAlertas.length > 0) {
        toast.success(`${novosAlertas.length} novos alertas gerados.`);
        await fetchAlertas();
      } else {
        toast.info("Nenhum novo alerta encontrado nos processos atuais.");
      }
    } catch (error) {
      console.error("Erro ao sincronizar alertas:", error);
      toast.error("Erro ao sincronizar alertas.");
    } finally {
      setIsLoading(false);
    }
  };

  const deletarAlerta = async (id: number) => {
    try {
      const { error } = await supabase
        .from("notification_history")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setAlertas(alertas.filter((a) => a.id !== id));
      toast.success("Alerta removido!");
    } catch (error) {
      console.error("Erro ao deletar alerta:", error);
      toast.error("Erro ao remover alerta.");
    }
  };

  const getAlertaStyles = (tipo: string) => {
    switch (tipo) {
      case "urgente":
      case "vencido":
        return "bg-red-50 border-red-100 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200";
      case "proximo":
        return "bg-amber-50 border-amber-100 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200";
      default:
        return "bg-stone-50 border-stone-100 text-stone-900 dark:bg-stone-900/20 dark:border-stone-800 dark:text-stone-200";
    }
  };

  const getAlertaIcon = (tipo: string) => {
    switch (tipo) {
      case "urgente":
      case "vencido":
        return AlertCircle;
      case "proximo":
        return Bell;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="flex h-screen bg-secondary/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto">
        <div className="container py-12 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2 tracking-tight">Alertas</h1>
              <p className="text-muted-foreground text-lg font-medium">Histórico de notificações e avisos.</p>
            </div>
            <Button onClick={sincronizarAlertas} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105">
              {isLoading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
              Sincronizar
            </Button>
          </div>

          {alertas.length === 0 ? (
            <Card className="p-20 border-2 border-border/50 bg-white text-center rounded-[2.5rem] shadow-xl">
              <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Bell className="w-12 h-12 text-muted-foreground opacity-30" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Tudo em ordem</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium">Você não possui notificações no histórico.</p>
              <Button variant="outline" onClick={sincronizarAlertas} className="mt-8 rounded-xl font-bold border-2 border-border hover:bg-secondary">Verificar Agora</Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {alertas.map((alerta) => {
                const Icon = getAlertaIcon(alerta.tipo);
                const styles = getAlertaStyles(alerta.tipo);

                return (
                  <Card
                    key={alerta.id}
                    className={`p-8 border-2 ${styles} transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl bg-white`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-6 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${alerta.tipo === 'urgente' || alerta.tipo === 'vencido' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                          <Icon className={`w-6 h-6 ${alerta.tipo === 'urgente' || alerta.tipo === 'vencido' ? 'text-red-600' : 'text-amber-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2 text-foreground">{alerta.assunto}</h3>
                          <p className="text-muted-foreground text-lg leading-relaxed mb-4 font-medium">
                            Processo: {alerta.numeroProcesso}
                          </p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                              {new Date(alerta.createdAt).toLocaleString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-12 h-12 rounded-xl border-2 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
                          onClick={() => deletarAlerta(alerta.id)}
                          title="Remover alerta"
                        >
                          <Trash2 className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
