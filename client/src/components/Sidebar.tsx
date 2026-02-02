import { useLocation } from "wouter";
import { FileText, LayoutDashboard, Calendar, AlertCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location, navigate] = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Processos", path: "/processos" },
    { icon: Calendar, label: "Prazos", path: "/prazos" },
    { icon: Calendar, label: "Calendário", path: "/calendario" },
    { icon: AlertCircle, label: "Alertas", path: "/alertas" },
    { icon: FileText, label: "Documentos", path: "/documentos" },
    { icon: Settings, label: "Configurações", path: "/configuracoes" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-72 bg-white text-foreground border-r-2 border-border/50 shadow-2xl transform transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:w-72`}
    >
      {/* Header */}
      <div className="p-8 border-b-2 border-border/50 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-primary">Secretário</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Jurídico</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="p-6 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose?.();
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
                active
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? "text-white" : "group-hover:text-primary transition-colors"}`} />
              <span className="font-bold text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-border/50 bg-white space-y-4">
        <ThemeToggle />
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="w-full justify-start gap-3 py-6 px-5 text-red-600 border-2 border-red-100 hover:bg-red-50 hover:border-red-200 rounded-2xl font-bold"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema
        </Button>
      </div>
    </aside>
  );
}
