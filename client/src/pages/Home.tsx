import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, FileText, Calendar, Database, ArrowRight, Zap } from "lucide-react";
import { useLocation } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-border/50">
        <div className="container py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary tracking-tight leading-none">Secretário Jurídico</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">Inteligência & Gestão</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 mr-4">
              <a href="#features" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Funcionalidades</a>
              <a href="#benefits" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Benefícios</a>
            </div>
            <ThemeToggle />
            <Button 
              onClick={() => navigate("/onboarding")}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold px-8 py-6 shadow-xl shadow-primary/20 transition-all hover:scale-105"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "url('/images/hero-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-8">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Lançamento 2026</span>
              </div>
              <h1 className="text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
                A Nova Era da <span className="text-primary italic">Advocacia</span>
              </h1>
              <p className="text-2xl text-muted-foreground mb-12 leading-relaxed font-medium">
                Automação inteligente para escritórios que buscam excelência. Organize processos, extraia dados e nunca mais perca um prazo.
              </p>
              <div className="flex gap-6 flex-wrap">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/onboarding")}
                  className="bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 text-white gap-3 rounded-2xl font-bold px-10 py-8 text-lg transition-all hover:scale-105"
                >
                  Iniciar Configuração <ArrowRight className="w-6 h-6" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl font-bold border-2 border-border px-10 py-8 text-lg hover:bg-secondary transition-all">
                  Ver Demonstração
                </Button>
              </div>
              <div className="mt-20 flex items-center gap-12">
                <div>
                  <div className="text-5xl font-bold text-primary mb-1">95%</div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tempo Reduzido</p>
                </div>
                <div className="w-px h-12 bg-border/50" />
                <div>
                  <div className="text-5xl font-bold text-primary mb-1">100%</div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Segurança Jurídica</p>
                </div>
                <div className="w-px h-12 bg-border/50" />
                <div>
                  <div className="text-5xl font-bold text-primary mb-1">24/7</div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Monitoramento</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[3rem] blur-3xl" />
              <img 
                src="/images/document-automation.png" 
                alt="Automação de Documentos" 
                className="relative w-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] rounded-[2rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">Excelência Operacional</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Tecnologia de ponta desenhada para as necessidades específicas do mercado jurídico brasileiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <Card className="p-10 border-2 border-border/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all rounded-[2rem] bg-white group hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                <FileText className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-6">Classificação Inteligente</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Nossa IA identifica instantaneamente o tipo de peça processual e organiza seu fluxo de trabalho.
              </p>
              <ul className="space-y-4">
                {["Petições", "Contestações", "Sentenças"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Feature 2 */}
            <Card className="p-10 border-2 border-border/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all rounded-[2rem] bg-white group hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                <Calendar className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-6">Gestão de Prazos</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Cálculo automático baseado no CPC e regimentos internos de todos os tribunais do país.
              </p>
              <ul className="space-y-4">
                {["Dias Úteis", "Feriados Locais", "Suspensões"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Feature 3 */}
            <Card className="p-10 border-2 border-border/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all rounded-[2rem] bg-white group hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                <Database className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-6">Extração de Dados</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Transforme documentos não estruturados em dados precisos para seu BI ou software de gestão.
              </p>
              <ul className="space-y-4">
                {["Partes", "Valores", "Juízos"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container text-center relative z-10">
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight">Evolua seu Escritório Hoje</h2>
          <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Junte-se a centenas de advogados que transformaram sua rotina com o Secretário Jurídico.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate("/onboarding")}
              className="bg-white text-primary hover:bg-white/90 shadow-2xl rounded-2xl font-bold px-12 py-8 text-xl transition-all hover:scale-105"
            >
              Começar Gratuitamente
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 rounded-2xl font-bold px-12 py-8 text-xl">
              Falar com Consultor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-border/50 py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">Secretário Jurídico</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Termos</a>
              <a href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Privacidade</a>
              <a href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Contato</a>
            </div>
            <p className="text-sm font-bold text-muted-foreground opacity-50">© 2026 Secretário Jurídico. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
