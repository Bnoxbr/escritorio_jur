import { useLocation } from "wouter";
import { 
  FileText, 
  LayoutDashboard, 
  Calendar, 
  AlertCircle, 
  Settings, 
  LogOut,
  Gavel
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle"; 
import { cn } from "@/lib/utils";

// 👇 NOVOS IMPORTS NECESSÁRIOS
import { useAuth } from "@/_core/hooks/useAuth";
import { useProcessos } from "@/contexts/ProcessosContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location, navigate] = useLocation();
  
  // 👇 HOOKS PARA LÓGICA DE LOGOUT
  const { logout } = useAuth();
  const { setIsDemoMode } = useProcessos();

  // 👇 DEFINIÇÃO DA FUNÇÃO QUE ESTAVA FALTANDO
  const handleLogout = async () => {
    // 1. Limpa o estado do Modo Demo
    setIsDemoMode(false);
    localStorage.removeItem("isDemoMode");

    // 2. Realiza o Logout no Supabase
    await logout();

    // 3. Redireciona para a tela inicial (Login)
    navigate("/");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Gavel, label: "Processos", path: "/processos" },
    { icon: Calendar, label: "Prazos", path: "/prazos" },
    { icon: Calendar, label: "Calendário", path: "/calendario" },
    { icon: AlertCircle, label: "Alertas", path: "/alertas" },
    { icon: FileText, label: "Documentos", path: "/documentos" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-4 top-4 bottom-4 w-72 z-50 transition-all duration-300 ease-in-out",
        "bg-[#4A0404] text-white rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col",
        !isOpen ? "-translate-x-[110%] opacity-0" : "translate-x-0 opacity-100",
        "md:translate-x-0 md:relative md:ml-0"
      )}
    >
      {/* Branding - Dra. Caroline Vilas Boas */}
      <div className="p-8 border-b border-white/5">
        <div 
          className="flex flex-col gap-1 group cursor-pointer" 
          onClick={() => navigate("/dashboard")}
        >
          <h1 className="font-serif text-2xl italic text-[#D4AF37] tracking-tight leading-tight group-hover:text-[#F1E5AC] transition-colors">
            Dra. Caroline
          </h1>
          <p className="text-[10px] text-white/50 font-sans uppercase tracking-[0.4em] font-bold">
            Vilas Boas
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location === item.path;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose?.();
              }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group",
                active
                  ? "bg-[#D4AF37] text-[#4A0404] shadow-lg shadow-[#D4AF37]/20 scale-[1.02] font-bold"
                  : "text-white/60 hover:bg-white/5 hover:text-[#D4AF37]"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                active ? "text-[#4A0404]" : "text-[#D4AF37] group-hover:scale-110"
              )} />
              <span className="text-sm italic tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer - Preferências e Sessão */}
      <div className="p-6 border-t border-white/5 space-y-4 bg-black/10 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between px-2">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">Interface</span>
          <ThemeToggle />
        </div>
        
        <div className="space-y-1">
          <button
            onClick={() => navigate("/configuracoes")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 transition-colors text-[11px] uppercase tracking-tighter font-semibold",
              location === "/configuracoes" ? "text-[#D4AF37]" : "text-white/40 hover:text-white"
            )}
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 py-6 px-4 text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Sair do Sistema</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}