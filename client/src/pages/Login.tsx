import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useProcessos } from "@/contexts/ProcessosContext";

export default function Login() {
  const [, navigate] = useLocation();
  const { setOnboardingCompleto } = useProcessos();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de autenticação para o Mockup
    setTimeout(() => {
      // Define o onboarding como completo para liberar as rotas no Router
      setOnboardingCompleto(true);
      
      // Navegação direta para o Dashboard (pula a chamada de API que está dando erro 500)
      navigate("/dashboard");
      setLoading(false);
    }, 1200);
  };

  return (
    // Fundo Geral: Bege Rosado Suave (Extraído da referência visual)
    <div className="min-h-screen flex bg-[#F3EBEB] font-sans selection:bg-[#D4AF37]/30">
      
      {/* LADO ESQUERDO: Branding Artístico (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center p-12 overflow-hidden border-r border-stone-100">
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#FDFBFB,_transparent)]" />
        </div>
        
        <div className="relative z-10 max-w-2xl text-center animate-in fade-in duration-1000">
          <div className="mb-14 flex flex-col items-center leading-none">
            <span 
              className="text-6xl text-[#D4AF37] mb-2"
              style={{ 
                fontFamily: "'Alex Brush', cursive",
                textShadow: '0px 4px 8px rgba(74,4,4,0.12)', 
              }}
            >
              Bem-vinda,
            </span>
            <span 
              className="text-5xl text-[#D4AF37] py-2"
              style={{ 
                fontFamily: "'Alex Brush', cursive",
                textShadow: '0px 4px 8px rgba(74,4,4,0.12)',
              }}
            >
              Dra. Caroline Vilas Boas
            </span>
          </div>

          <h2 className="text-xl font-serif text-stone-600 mb-8 leading-relaxed italic px-12 opacity-80">
            "A justiça é a constância e perpétua vontade de dar a cada um o que é seu."
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/40 mx-auto mb-8" />
          <p className="text-stone-400 tracking-[0.5em] text-[9px] uppercase font-medium">
            Exclusividade • Ética • Resultados
          </p>
        </div>
        
        <div className="absolute bottom-10 left-12 text-stone-300 text-[8px] tracking-[0.3em] uppercase font-semibold">
          Secretário Jurídico v1.0
        </div>
      </div>

      {/* LADO DIREITO: Card Flutuante Bordô */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-[#F3EBEB]">
        
        {/* Mobile Welcome (Visível apenas em telas pequenas) */}
        <div className="lg:hidden mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-1000 flex flex-col items-center">
          <span 
            className="text-5xl text-[#D4AF37] mb-1"
            style={{ fontFamily: "'Alex Brush', cursive", textShadow: '0px 3px 6px rgba(74,4,4,0.15)' }}
          >
            Bem-vinda,
          </span>
          <span 
            className="text-4xl text-[#D4AF37]"
            style={{ fontFamily: "'Alex Brush', cursive", textShadow: '0px 3px 6px rgba(74,4,4,0.15)' }}
          >
            Dra. Caroline Vilas Boas
          </span>
        </div>

        {/* O CARD BORDÔ ARREDONDADO */}
        <div className="w-full max-w-[440px] bg-[#4A0404] p-10 sm:p-16 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-700 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="relative z-10">
            <div className="mb-12 text-center lg:text-left">
              <h1 className="text-sm font-sans text-[#D4AF37] tracking-[0.3em] mb-2 uppercase font-semibold italic">Escritório Digital</h1>
              <p className="text-white text-[10px] tracking-wide uppercase opacity-90">Acesso seguro ao painel administrativo</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="login" className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] ml-1">Usuário</Label>
                <Input
                  id="login"
                  placeholder="identificação"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  // Fundo Bege Acinzentado nas Caixas
                  className="h-14 bg-[#D6D2C4] border-none text-[#4A0404] placeholder:text-[#4A0404]/40 focus:ring-2 focus:ring-[#D4AF37] transition-all duration-500 rounded-2xl px-6 text-sm font-medium"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] ml-1">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Fundo Bege Acinzentado nas Caixas
                  className="h-14 bg-[#D6D2C4] border-none text-[#4A0404] focus:ring-2 focus:ring-[#D4AF37] transition-all duration-500 rounded-2xl px-6"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#D4AF37] hover:bg-[#C5A028] text-[#4A0404] font-bold uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all active:scale-[0.96] rounded-2xl flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Autenticando
                  </>
                ) : (
                  "Validar Acesso"
                )}
              </Button>
            </form>

            <div className="mt-14 pt-8 border-t border-white/10 flex justify-center items-center gap-6">
               <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40" />
               <p className="text-white text-[9px] uppercase tracking-[0.4em] font-medium opacity-90">Privacidade Garantida</p>
               <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}