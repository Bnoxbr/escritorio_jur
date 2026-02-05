import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProcessosProvider, useProcessos } from "./contexts/ProcessosContext";
import { useAuth } from "./_core/hooks/useAuth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Processos from "./pages/Processos";
import Prazos from "./pages/Prazos";
import Alertas from "./pages/Alertas";
import Documentos from "./pages/Documentos";
import Calendario from "./pages/Calendario";
import Configuracoes from "./pages/Configuracoes";

function Router() {
  const { onboardingCompleto } = useProcessos();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <Switch>
      <Route path={"/"} component={isAuthenticated ? Dashboard : Login} />
      <Route path={"/demo"} component={LoginDemo} />
      <Route path={"/onboarding"} component={Onboarding} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/processos"} component={Processos} />
      <Route path={"/prazos"} component={Prazos} />
      <Route path={"/alertas"} component={Alertas} />
      <Route path={"/documentos"} component={Documentos} />
      <Route path={"/agenda"} component={Calendario} />
      <Route path={"/calendario"} component={Calendario} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
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
