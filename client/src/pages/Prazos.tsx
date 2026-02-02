import { useProcessos } from "@/contexts/ProcessosContext";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { Calendar, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function Prazos() {
  const { processos, obterProcessosProximosAVencer } = useProcessos();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const processosProximos7 = obterProcessosProximosAVencer(7);
  const processosProximos30 = obterProcessosProximosAVencer(30);

  const calcularDiasAteVencimento = (dataPrazo: string) => {
    const agora = new Date();
    const prazo = new Date(dataPrazo);
    const diferenca = prazo.getTime() - agora.getTime();
    const dias = Math.ceil(diferenca / (1000 * 3600 * 24));
    return dias;
  };

  const getUrgencia = (dias: number) => {
    if (dias <= 0) return { label: "Vencido", color: "bg-red-50 border-red-200 text-red-900", icon: AlertCircle };
    if (dias <= 3) return { label: "Urgente", color: "bg-red-50 border-red-200 text-red-900", icon: AlertCircle };
    if (dias <= 7) return { label: "Próximo", color: "bg-yellow-50 border-yellow-200 text-yellow-900", icon: Clock };
    return { label: "Normal", color: "bg-blue-50 border-blue-200 text-blue-900", icon: Calendar };
  };

  return (
    <div className="flex h-screen bg-secondary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto">
        <div className="container py-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Prazos</h1>
            <p className="text-muted-foreground mb-8">Acompanhamento de todos os prazos processuais</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 border border-border bg-white">
              <p className="text-sm text-muted-foreground mb-1">Próximos 7 dias</p>
              <p className="text-3xl font-bold text-primary">{processosProximos7.length}</p>
            </Card>
            <Card className="p-6 border border-border bg-white">
              <p className="text-sm text-muted-foreground mb-1">Próximos 30 dias</p>
              <p className="text-3xl font-bold text-primary">{processosProximos30.length}</p>
            </Card>
            <Card className="p-6 border border-border bg-white">
              <p className="text-sm text-muted-foreground mb-1">Total de Processos</p>
              <p className="text-3xl font-bold text-primary">{processos.length}</p>
            </Card>
          </div>

          {/* Prazos Ordenados */}
          <div className="space-y-4">
            {processos
              .sort((a, b) => new Date(a.proximoPrazo).getTime() - new Date(b.proximoPrazo).getTime())
              .map((processo) => {
                const dias = calcularDiasAteVencimento(processo.proximoPrazo);
                const urgencia = getUrgencia(dias);
                const Icon = urgencia.icon;

                return (
                  <Card key={processo.id} className={`p-6 border-2 ${urgencia.color} bg-white`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5" />
                          <h3 className="font-bold text-lg">{processo.numeroProcesso}</h3>
                          <span className="px-2 py-1 bg-white rounded text-xs font-semibold">
                            {urgencia.label}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-3">{processo.titulo}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground">Prazo</p>
                            <p className="font-semibold">{processo.descricaoPrazo}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground">Data</p>
                            <p className="font-semibold">{processo.proximoPrazo}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground">Dias Restantes</p>
                            <p className="font-semibold">{dias > 0 ? `${dias} dias` : "Vencido"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground">Parte Contrária</p>
                            <p className="font-semibold">{processo.parteContraria}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}
