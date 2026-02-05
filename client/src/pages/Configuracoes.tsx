
import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { Menu, Bell, Save, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Configuracoes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  // Estado local das preferências
  const [prefs, setPrefs] = useState({
    email_enabled: true,
    notify_vencidos: true,
    notify_urgentes: true,
    notify_proximos: true,
    dias_antecedencia: 7,
    horario_notificacao: "09:00",
  });
  
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);

  // Carregar preferências
  const fetchPreferences = useCallback(async () => {
    if (!user) return;
    setIsLoadingPrefs(true);
    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") { // Ignore 'No rows found'
          console.error("Erro ao buscar preferências:", error);
      }

      if (data) {
        setPrefs({
          email_enabled: data.email_enabled ?? true,
          notify_vencidos: data.notify_vencidos ?? true,
          notify_urgentes: data.notify_urgentes ?? true,
          notify_proximos: data.notify_proximos ?? true,
          dias_antecedencia: data.dias_antecedencia || 7,
          horario_notificacao: data.horario_notificacao || "09:00",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar preferências:", error);
    } finally {
      setIsLoadingPrefs(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const handleSavePreferences = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const payload = {
        user_id: user.id,
        email_enabled: prefs.email_enabled,
        notify_vencidos: prefs.notify_vencidos,
        notify_urgentes: prefs.notify_urgentes,
        notify_proximos: prefs.notify_proximos,
        dias_antecedencia: prefs.dias_antecedencia,
        horario_notificacao: prefs.horario_notificacao,
        updated_at: new Date().toISOString(),
      };

      // Upsert based on user_id
      const { error } = await supabase
        .from("notification_preferences")
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Preferências salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast.error("Erro ao salvar preferências.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    // This functionality will be migrated to Edge Functions.
    toast.info("Funcionalidade de e-mail de teste será migrada para Edge Functions.");
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
                    checked={prefs.email_enabled}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        email_enabled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {prefs.email_enabled && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Preferências de Alerta</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Vencidos", key: "notify_vencidos", color: "bg-red-500" },
                      { label: "Urgentes", key: "notify_urgentes", color: "bg-orange-500" },
                      { label: "Próximos", key: "notify_proximos", color: "bg-amber-500" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-5 bg-secondary/30 rounded-2xl border-2 border-border/20">
                        <span className="font-bold text-foreground">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!prefs[item.key as keyof typeof prefs]}
                            onChange={(e) =>
                              setPrefs({
                                ...prefs,
                                [item.key]: e.target.checked,
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
                          value={prefs.dias_antecedencia}
                          onChange={(e) =>
                            setPrefs({
                              ...prefs,
                              dias_antecedencia: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-border/50 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs font-bold text-muted-foreground">1 DIA</span>
                          <span className="text-2xl font-bold text-primary">{prefs.dias_antecedencia} dias</span>
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
                          value={prefs.horario_notificacao}
                          onChange={(e) =>
                            setPrefs({
                              ...prefs,
                              horario_notificacao: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-white border-2 border-border/20 rounded-xl font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center justify-end gap-4 border-t border-border/10 pt-8">
              <Button
                variant="outline"
                onClick={handleSendTestEmail}
                className="gap-2 h-12 px-6 rounded-xl font-bold border-2"
              >
                <Send className="w-4 h-4" />
                Testar Envio
              </Button>
              
              <Button
                onClick={handleSavePreferences}
                disabled={loading || saved}
                className={`gap-2 h-12 px-8 rounded-xl font-bold transition-all duration-500 ${
                  saved ? "bg-green-500 hover:bg-green-600 w-40" : "w-32"
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Salvo!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {loading ? "..." : "Salvar"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
