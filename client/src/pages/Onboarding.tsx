import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useProcessos } from "@/contexts/ProcessosContext";
import { useLocation } from "wouter";
import { ChevronRight, CheckCircle2 } from "lucide-react";

interface ProcessoForm {
  numeroProcesso: string;
  titulo: string;
  parteContraria: string;
  juizo: string;
  dataAbertura: string;
  proximoPrazo: string;
  descricaoPrazo: string;
  tipoProcesso: "cível" | "criminal" | "trabalhista" | "administrativo";
  valorCausa: string;
  anotacoes: string;
}

const PASSOS = [
  { numero: 1, titulo: "Informações Básicas", descricao: "Dados principais do processo" },
  { numero: 2, titulo: "Prazos", descricao: "Próximos prazos importantes" },
  { numero: 3, titulo: "Detalhes Adicionais", descricao: "Informações complementares" },
  { numero: 4, titulo: "Revisão", descricao: "Confirmar dados" },
];

export default function Onboarding() {
  const { adicionarProcesso, setOnboardingCompleto } = useProcessos();
  const [, navigate] = useLocation();
  const [passoAtual, setPassoAtual] = useState(1);
  const [processosAdicionados, setProcessosAdicionados] = useState(0);
  const [form, setForm] = useState<ProcessoForm>({
    numeroProcesso: "",
    titulo: "",
    parteContraria: "",
    juizo: "",
    dataAbertura: "",
    proximoPrazo: "",
    descricaoPrazo: "",
    tipoProcesso: "cível",
    valorCausa: "",
    anotacoes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProximo = () => {
    if (passoAtual < 4) {
      setPassoAtual(passoAtual + 1);
    }
  };

  const handleAnterior = () => {
    if (passoAtual > 1) {
      setPassoAtual(passoAtual - 1);
    }
  };

  const handleAdicionar = () => {
    adicionarProcesso({
      ...form,
      status: "ativo",
    });
    setProcessosAdicionados(processosAdicionados + 1);
    setForm({
      numeroProcesso: "",
      titulo: "",
      parteContraria: "",
      juizo: "",
      dataAbertura: "",
      proximoPrazo: "",
      descricaoPrazo: "",
      tipoProcesso: "cível",
      valorCausa: "",
      anotacoes: "",
    });
    setPassoAtual(1);
  };

  const handleFinalizarOnboarding = () => {
    setOnboardingCompleto(true);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-secondary/30 py-20">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-foreground mb-6">Bem-vinda ao <span className="text-primary italic">Futuro</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Vamos configurar seus processos iniciais. Este passo é fundamental para que nossa IA comece a organizar sua rotina.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-16">
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-6 left-0 right-0 h-1 bg-border/50 -z-10" />
            <div 
              className="absolute top-6 left-0 h-1 bg-primary transition-all duration-500 -z-10" 
              style={{ width: `${((passoAtual - 1) / 3) * 100}%` }}
            />
            {PASSOS.map((passo) => (
              <div key={passo.numero} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold mb-4 transition-all duration-300 shadow-xl ${
                    passoAtual >= passo.numero
                      ? "bg-primary text-white scale-110 shadow-primary/20"
                      : "bg-white text-muted-foreground border-2 border-border"
                  }`}
                >
                  {passoAtual > passo.numero ? <CheckCircle2 className="w-6 h-6" /> : passo.numero}
                </div>
                <p className={`text-xs text-center font-bold uppercase tracking-wider ${
                  passoAtual >= passo.numero ? "text-primary" : "text-muted-foreground"
                }`}>{passo.titulo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-10 mb-10 border-2 border-border/50 rounded-[2.5rem] shadow-2xl bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          
          {/* Passo 1: Informações Básicas */}
          {passoAtual === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold text-foreground">Informações Básicas</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Número do Processo
                  </label>
                  <input
                    type="text"
                    name="numeroProcesso"
                    value={form.numeroProcesso}
                    onChange={handleInputChange}
                    placeholder="Ex: 0001234-56.2026.1.00.0000"
                    className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Assunto / Título
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleInputChange}
                    placeholder="Ex: Ação de Cobrança Indevida"
                    className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Parte Contrária
                    </label>
                    <input
                      type="text"
                      name="parteContraria"
                      value={form.parteContraria}
                      onChange={handleInputChange}
                      placeholder="Ex: Banco Central S/A"
                      className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Tipo de Processo
                    </label>
                    <select
                      name="tipoProcesso"
                      value={form.tipoProcesso}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg appearance-none cursor-pointer"
                    >
                      <option value="cível">Cível</option>
                      <option value="criminal">Criminal</option>
                      <option value="trabalhista">Trabalhista</option>
                      <option value="administrativo">Administrativo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Juízo / Tribunal
                  </label>
                  <input
                    type="text"
                    name="juizo"
                    value={form.juizo}
                    onChange={handleInputChange}
                    placeholder="Ex: 3ª Vara Cível da Comarca de São Paulo"
                    className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Passo 2: Prazos */}
          {passoAtual === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold text-foreground">Prazos & Datas</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Data de Abertura
                    </label>
                    <input
                      type="date"
                      name="dataAbertura"
                      value={form.dataAbertura}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Próximo Prazo
                    </label>
                    <input
                      type="date"
                      name="proximoPrazo"
                      value={form.proximoPrazo}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Descrição do Prazo
                  </label>
                  <input
                    type="text"
                    name="descricaoPrazo"
                    value={form.descricaoPrazo}
                    onChange={handleInputChange}
                    placeholder="Ex: Manifestação sobre a Contestação"
                    className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                  />
                </div>

                <div className="bg-primary/5 border-2 border-primary/10 rounded-[1.5rem] p-6 flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-primary font-bold mb-1">Cálculo Automático</p>
                    <p className="text-sm text-primary/80 font-medium leading-relaxed">
                      Nossa IA utiliza estas datas para monitorar automaticamente suspensões e feriados específicos do seu tribunal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Passo 3: Detalhes Adicionais */}
          {passoAtual === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold text-foreground">Informações Estratégicas</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Valor da Causa
                  </label>
                  <input
                    type="text"
                    name="valorCausa"
                    value={form.valorCausa}
                    onChange={handleInputChange}
                    placeholder="Ex: R$ 150.000,00"
                    className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Notas & Estratégia
                  </label>
                  <textarea
                    name="anotacoes"
                    value={form.anotacoes}
                    onChange={handleInputChange}
                    placeholder="Descreva pontos chaves ou estratégias para este caso..."
                    rows={4}
                    className="w-full px-6 py-4 bg-secondary/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Passo 4: Revisão */}
          {passoAtual === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold text-foreground">Conferência Final</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Número", value: form.numeroProcesso },
                  { label: "Tipo", value: form.tipoProcesso, capitalize: true },
                  { label: "Título", value: form.titulo },
                  { label: "Parte Contraria", value: form.parteContraria },
                  { label: "Próximo Prazo", value: form.proximoPrazo },
                  { label: "Descrição", value: form.descricaoPrazo },
                ].map((item, idx) => (
                  <div key={idx} className="bg-secondary/30 p-5 rounded-2xl border-2 border-border/20">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{item.label}</p>
                    <p className={`font-bold text-foreground ${item.capitalize ? "capitalize" : ""}`}>{item.value || "-"}</p>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[1.5rem] p-6 text-emerald-900 font-bold flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                Pronto para ser processado pela nossa inteligência!
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-6 justify-between items-center mb-12">
          <Button
            onClick={handleAnterior}
            disabled={passoAtual === 1}
            variant="ghost"
            className="px-8 py-8 rounded-2xl font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 disabled:opacity-30"
          >
            Voltar
          </Button>

          <div className="hidden md:block">
            {processosAdicionados > 0 && (
              <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold">
                {processosAdicionados} processo{processosAdicionados > 1 ? "s" : ""} na fila
              </Badge>
            )}
          </div>

          {passoAtual < 4 ? (
            <Button 
              onClick={handleProximo} 
              className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-white px-10 py-8 rounded-2xl font-bold gap-3 transition-all hover:scale-105"
            >
              Próximo Passo <ChevronRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleAdicionar}
              className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-white px-10 py-8 rounded-2xl font-bold gap-3 transition-all hover:scale-105"
            >
              Confirmar & Adicionar
            </Button>
          )}
        </div>

        {/* Finalize Button */}
        {processosAdicionados > 0 && (
          <div className="text-center animate-in zoom-in duration-500">
            <Button
              onClick={handleFinalizarOnboarding}
              size="lg"
              className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-2xl rounded-[2rem] font-bold text-xl px-12 py-10 transition-all hover:scale-105"
            >
              Finalizar e Ir para o Dashboard <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-6 font-bold uppercase tracking-widest opacity-60">
              Você poderá adicionar mais casos a qualquer momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
