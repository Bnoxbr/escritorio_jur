import { useProcessos } from "@/contexts/ProcessosContext";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { AlertCircle, Bell, CheckCircle2, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Alerta {
  id: string;
  tipo: "urgente" | "vencimento" | "informacao";
  titulo: string;
  descricao: string;
  processId: string;
  data: string;
  lido: boolean;
}

export default function Alertas() {
  const { processos, obterProcessosProximosAVencer } = useProcessos();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  // Gerar alertas baseado nos processos
  const gerarAlertas = () => {
    const novosAlertas: Alerta[] = [];
    const processosProximos = obterProcessosProximosAVencer(7);

    processosProximos.forEach((processo) => {
      const agora = new Date();
      const prazo = new Date(processo.proximoPrazo);
      const diferenca = prazo.getTime() - agora.getTime();
      const dias = Math.ceil(diferenca / (1000 * 3600 * 24));

      if (dias <= 0) {
        novosAlertas.push({
          id: `alerta-${processo.id}-vencido`,
          tipo: "urgente",
          titulo: "Prazo Vencido",
          descricao: `O prazo para "${processo.descricaoPrazo}" no processo ${processo.numeroProcesso} venceu.`,
          processId: processo.id,
          data: new Date().toISOString(),
          lido: false,
        });
      } else if (dias <= 3) {
        novosAlertas.push({
          id: `alerta-${processo.id}-urgente`,
          tipo: "urgente",
          titulo: "Prazo Urgente",
          descricao: `Faltam apenas ${dias} dias para o prazo de "${processo.descricaoPrazo}" no processo ${processo.numeroProcesso}.`,
          processId: processo.id,
          data: new Date().toISOString(),
          lido: false,
        });
      } else {
        novosAlertas.push({
          id: `alerta-${processo.id}-vencimento`,
          tipo: "vencimento",
          titulo: "Vencimento Próximo",
          descricao: `Faltam ${dias} dias para o prazo de "${processo.descricaoPrazo}" no processo ${processo.numeroProcesso}.`,
          processId: processo.id,
          data: new Date().toISOString(),
          lido: false,
        });
      }
    });

    setAlertas(novosAlertas);
  };

  const marcarComoLido = (id: string) => {
    setAlertas(alertas.map((a) => (a.id === id ? { ...a, lido: true } : a)));
  };

  const deletarAlerta = (id: string) => {
    setAlertas(alertas.filter((a) => a.id !== id));
  };

  const getAlertaStyles = (tipo: string) => {
    switch (tipo) {
      case "urgente":
        return "bg-red-50 border-red-100 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200";
      case "vencimento":
        return "bg-amber-50 border-amber-100 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200";
      case "informacao":
        return "bg-emerald-50 border-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-200";
      default:
        return "bg-stone-50 border-stone-100 text-stone-900 dark:bg-stone-900/20 dark:border-stone-800 dark:text-stone-200";
    }
  };

  const getAlertaIcon = (tipo: string) => {
    switch (tipo) {
      case "urgente":
        return AlertCircle;
      case "vencimento":
        return Bell;
      case "informacao":
        return CheckCircle2;
      default:
        return Bell;
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
              <p className="text-muted-foreground text-lg font-medium">Monitoramento em tempo real de seus prazos e compromissos.</p>
            </div>
            <Button onClick={gerarAlertas} className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105">
              Sincronizar Alertas
            </Button>
          </div>

          {alertas.length === 0 ? (
            <Card className="p-20 border-2 border-border/50 bg-white text-center rounded-[2.5rem] shadow-xl">
              <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Bell className="w-12 h-12 text-muted-foreground opacity-30" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Tudo em ordem</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium">Você não possui notificações pendentes no momento.</p>
              <Button variant="outline" onClick={gerarAlertas} className="mt-8 rounded-xl font-bold border-2 border-border hover:bg-secondary">Verificar novamente</Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {alertas.map((alerta) => {
                const Icon = getAlertaIcon(alerta.tipo);
                const styles = getAlertaStyles(alerta.tipo);

                return (
                  <Card
                    key={alerta.id}
                    className={`p-8 border-2 ${styles} transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl ${alerta.lido ? "opacity-50 grayscale" : "bg-white"}`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-6 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${alerta.tipo === 'urgente' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                          <Icon className={`w-6 h-6 ${alerta.tipo === 'urgente' ? 'text-red-600' : 'text-amber-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2 text-foreground">{alerta.titulo}</h3>
                          <p className="text-muted-foreground text-lg leading-relaxed mb-4 font-medium">{alerta.descricao}</p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                              {new Date(alerta.data).toLocaleString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {!alerta.lido && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="w-12 h-12 rounded-xl border-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                            onClick={() => marcarComoLido(alerta.id)}
                            title="Marcar como lido"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </Button>
                        )}
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
