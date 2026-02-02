import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { Menu, Bell, Save, Send, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Configuracoes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Buscar preferências
  const { data: preferences, isLoading: isLoadingPrefs } = trpc.notifications.getPreferences.useQuery();
  
  // Mutation para atualizar preferências
  const updatePrefsMutation = trpc.notifications.updatePreferences.useMutation();
  const sendTestMutation = trpc.notifications.sendTestNotification.useMutation();

  // Estado local das preferências
  const [prefs, setPrefs] = useState({
    emailNotificationsEnabled: "true" as "true" | "false",
    notifyVencidos: "true" as "true" | "false",
    notifyUrgentes: "true" as "true" | "false",
    notifyProximos: "true" as "true" | "false",
    diasAntecedencia: 7,
    horarioNotificacao: "09:00",
  });

  // Carregar preferências quando disponíveis
  useEffect(() => {
    if (preferences) {
      setPrefs({
        emailNotificationsEnabled: (preferences.emailNotificationsEnabled as "true" | "false") || "true",
        notifyVencidos: (preferences.notifyVencidos as "true" | "false") || "true",
        notifyUrgentes: (preferences.notifyUrgentes as "true" | "false") || "true",
        notifyProximos: (preferences.notifyProximos as "true" | "false") || "true",
        diasAntecedencia: preferences.diasAntecedencia || 7,
        horarioNotificacao: preferences.horarioNotificacao || "09:00",
      });
    }
  }, [preferences]);

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await updatePrefsMutation.mutateAsync(prefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    try {
      await sendTestMutation.mutateAsync();
    } catch (error) {
      console.error("Erro ao enviar e-mail de teste:", error);
    }
  };

  if (isLoadingPrefs) {
    return (
      <div className="flex h-screen bg-secondary/30">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Carregando configurações...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-secondary/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto">
        <div className="container py-12 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2 tracking-tight">Configurações</h1>
              <p className="text-muted-foreground text-lg font-medium">Personalize sua experiência e canais de notificação.</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Notificações por E-mail */}
          <Card className="p-10 border-2 border-border/50 bg-white rounded-[2.5rem] mb-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Notificações</h2>
                <p className="text-muted-foreground font-medium">Controle como e quando você deseja ser alertada.</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Ativar/Desativar Notificações */}
              <div className="flex items-center justify-between p-6 bg-secondary/30 rounded-2xl border-2 border-border/20 transition-all hover:border-primary/20">
                <div>
                  <p className="font-bold text-xl text-foreground mb-1">Alertas por E-mail</p>
                  <p className="text-muted-foreground font-medium">Receba o resumo diário de prazos diretamente na sua caixa de entrada.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-125">
                  <input
                    type="checkbox"
                    checked={prefs.emailNotificationsEnabled === "true"}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        emailNotificationsEnabled: e.target.checked ? "true" : "false",
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {prefs.emailNotificationsEnabled === "true" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Preferências de Alerta</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Vencidos", key: "notifyVencidos", color: "bg-red-500" },
                      { label: "Urgentes", key: "notifyUrgentes", color: "bg-orange-500" },
                      { label: "Próximos", key: "notifyProximos", color: "bg-amber-500" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-5 bg-secondary/30 rounded-2xl border-2 border-border/20">
                        <span className="font-bold text-foreground">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prefs[item.key as keyof typeof prefs] === "true"}
                            onChange={(e) =>
                              setPrefs({
                                ...prefs,
                                [item.key]: e.target.checked ? "true" : "false",
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${item.color}`} />
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Dias de Antecedência */}
                    <div className="p-6 bg-secondary/30 rounded-2xl border-2 border-border/20">
                      <label className="block">
                        <p className="font-bold text-foreground mb-1">Antecedência</p>
                        <p className="text-sm text-muted-foreground mb-6 font-medium">Alertar com quantos dias antes?</p>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          value={prefs.diasAntecedencia}
                          onChange={(e) =>
                            setPrefs({
                              ...prefs,
                              diasAntecedencia: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-border/50 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs font-bold text-muted-foreground">1 DIA</span>
                          <span className="text-2xl font-bold text-primary">{prefs.diasAntecedencia} dias</span>
                          <span className="text-xs font-bold text-muted-foreground">30 DIAS</span>
                        </div>
                      </label>
                    </div>

                    {/* Horário de Notificação */}
                    <div className="p-6 bg-secondary/30 rounded-2xl border-2 border-border/20">
                      <label className="block">
                        <p className="font-bold text-foreground mb-1">Horário de Envio</p>
                        <p className="text-sm text-muted-foreground mb-6 font-medium">Momento preferencial do alerta.</p>
                        <input
                          type="time"
                          value={prefs.horarioNotificacao}
                          onChange={(e) =>
                            setPrefs({
                              ...prefs,
                              horarioNotificacao: e.target.value,
                            })
                          }
                          className="w-full px-6 py-4 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all bg-white text-foreground font-bold text-xl"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-4 pt-8 border-t-2 border-border/50">
                <Button
                  onClick={handleSavePreferences}
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold py-8 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105"
                >
                  <Save className="w-6 h-6 mr-2" />
                  {loading ? "Salvando..." : "Salvar Configurações"}
                </Button>
                {prefs.emailNotificationsEnabled === "true" && (
                  <Button
                    onClick={handleSendTestEmail}
                    variant="outline"
                    className="flex-1 rounded-2xl font-bold py-8 text-lg border-2 border-border hover:bg-secondary transition-all"
                  >
                    <Send className="w-6 h-6 mr-2" />
                    Enviar Teste
                  </Button>
                )}
              </div>

              {saved && (
                <div className="p-6 bg-emerald-50 border-2 border-emerald-100 rounded-2xl text-emerald-900 font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  Configurações atualizadas com sucesso!
                </div>
              )}
            </div>
          </Card>

          {/* Dicas de Uso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-border/50 bg-white rounded-[2rem] shadow-xl">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Resumo Diário
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Nosso sistema processa todos os seus processos ativos durante a madrugada e gera um resumo executivo que chega pontualmente no horário configurado.
              </p>
            </Card>
            <Card className="p-8 border-2 border-border/50 bg-white rounded-[2rem] shadow-xl">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Save className="w-5 h-5 text-primary" />
                Segurança de Dados
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Suas preferências são armazenadas de forma criptografada e nunca compartilhamos seus dados processuais com terceiros sem autorização expressa.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
