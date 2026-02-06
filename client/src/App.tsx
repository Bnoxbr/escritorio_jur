// src/App.tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter"; // Adicionei useLocation para redirects manuais se precisar
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProcessosProvider } from "./contexts/ProcessosContext";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react"; // Para o loading state

// Imports das Páginas
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Processos from "./pages/Processos";
import Prazos from "./pages/Prazos";
import Alertas from "./pages/Alertas";
import Documentos from "./pages/Documentos";
import Calendario from "./pages/Calendario";
import Configuracoes from "./pages/Configuracoes";

// 👇👇 A CORREÇÃO OBRIGATÓRIA ESTÁ AQUI 👇👇
import LoginDemo from "./pages/LoginDemo"; 
// 👆👆 SEM ISSO, O BUILD DE PRODUÇÃO QUEBRA 👆👆

function Router() {
  const { isAuthenticated, loading } = useAuth();

  // 1. Estado de Carregamento (Verificando sessão no Supabase)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-sm text-gray-500">Verificando credenciais...</span>
        </div>
      </div>
    );
  }

  // 2. Se NÃO estiver logado: Só permite acessar Login e Demo
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/demo" component={LoginDemo} />
        <Route path="/login" component={Login} />
        {/* Qualquer outra rota redireciona para Login */}
        <Route component={Login} />
      </Switch>
    );
  }

  // 3. Se ESTIVER logado: Libera o acesso ao sistema
  return (
    <Switch>
      {/* Rota raiz vai para Dashboard */}
      <Route path="/" component={Dashboard} />
      
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/processos" component={Processos} />
      <Route path="/prazos" component={Prazos} />
      <Route path="/alertas" component={Alertas} />
      <Route path="/documentos" component={Documentos} />
      <Route path="/agenda" component={Calendario} />
      <Route path="/calendario" component={Calendario} />
      <Route path="/configuracoes" component={Configuracoes} />
      
      {/* Onboarding pode ser acessado logado */}
      <Route path="/onboarding" component={Onboarding} />

      {/* Rota 404 para URLs inválidas dentro do sistema */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        {/* ProcessosProvider dentro do Auth logicamente faz sentido, 
            mas deixamos fora para evitar erros de contexto se o Auth falhar */}
        <ProcessosProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ProcessosProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;