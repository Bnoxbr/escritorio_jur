import { useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale"; // <--- CORREÇÃO AQUI
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import "react-day-picker/dist/style.css";

interface Prazo {
  id: string;
  numeroProcesso: string;
  descricao: string;
  dataPrazo: Date;
  status: "vencido" | "urgente" | "proximo" | "normal";
  processId: number;
}

interface CalendarPrazosProps {
  prazos: Prazo[];
  onSelectDate?: (date: Date) => void;
}

export default function CalendarPrazos({ prazos, onSelectDate }: CalendarPrazosProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Agrupar prazos por data
  const prazosPorData = useMemo(() => {
    const mapa = new Map<string, Prazo[]>();
    prazos.forEach((prazo) => {
      // Garante que a data seja tratada corretamente ignorando hora
      const dataIso = new Date(prazo.dataPrazo);
      dataIso.setHours(0, 0, 0, 0);
      const chave = dataIso.toISOString().split("T")[0];
      
      if (!mapa.has(chave)) {
        mapa.set(chave, []);
      }
      mapa.get(chave)!.push(prazo);
    });
    return mapa;
  }, [prazos]);

  // Prazos do dia selecionado
  const prazosDodia = useMemo(() => {
    if (!selectedDate) return [];
    const chave = selectedDate.toISOString().split("T")[0];
    return prazosPorData.get(chave) || [];
  }, [selectedDate, prazosPorData]);

  // Datas com prazos
  const datasComPrazos = useMemo(() => {
    return Array.from(prazosPorData.keys()).map((chave) => {
        const [ano, mes, dia] = chave.split('-').map(Number);
        return new Date(ano, mes - 1, dia);
    });
  }, [prazosPorData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vencido":
        return "text-red-500 bg-red-50 border-red-200";
      case "urgente":
        return "text-orange-500 bg-orange-50 border-orange-200";
      case "proximo":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vencido":
        return <AlertCircle className="w-4 h-4" />;
      case "urgente":
        return <Clock className="w-4 h-4" />;
      case "proximo":
        return <Clock className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "vencido":
        return "Vencido";
      case "urgente":
        return "Urgente";
      case "proximo":
        return "Próximo";
      default:
        return "Normal";
    }
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onSelectDate) {
      onSelectDate(date);
    }
  };

  // Customizar dias com prazos
  const customModifiers = {
    comPrazo: datasComPrazos,
  };

  const customModifiersStyles = {
    comPrazo: {
      fontWeight: "bold",
      color: "var(--primary)",
      textDecoration: "underline"
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendário */}
      <Card className="lg:col-span-2 p-6 border-2 border-border bg-card rounded-2xl">
        <div className="bg-gradient-to-r from-primary to-[#4A0404] rounded-xl p-4 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5" /> 
            Calendário de Prazos
          </h3>
        </div>

        <div className="flex justify-center calendar-wrapper">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={ptBR} // <--- USANDO O LOCALE CORRETO
            modifiers={customModifiers}
            modifiersStyles={customModifiersStyles}
            showOutsideDays={false}
            disabled={(date) => {
               // Desabilita dias passados que não têm prazos registrados
               // Isso ajuda a focar no futuro ou no histórico relevante
               return false; 
            }}
            className="p-3"
            classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-bold",
            }}
            footer={
              <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground text-center">
                {datasComPrazos.length} dia{datasComPrazos.length !== 1 ? "s" : ""} com prazos registrados
              </div>
            }
          />
        </div>

        {/* Legenda */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm font-semibold text-foreground mb-4">Legenda:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-muted-foreground">Vencido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-sm text-muted-foreground">Urgente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-sm text-muted-foreground">Próximo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-muted-foreground">Normal</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Detalhes do Dia Selecionado */}
      <Card className="p-0 border-2 border-border bg-card rounded-2xl h-fit overflow-hidden flex flex-col">
        <div className="p-6 bg-muted/30 border-b border-border">
          <h3 className="text-lg font-bold text-foreground mb-1 capitalize">
            {selectedDate ? selectedDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }) : "Selecione uma data"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {prazosDodia.length} prazo{prazosDodia.length !== 1 ? "s" : ""} agendado{prazosDodia.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="p-6 flex-1">
            {prazosDodia.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground font-medium">Nenhum prazo para este dia</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Selecione dias marcados no calendário</p>
            </div>
            ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {prazosDodia.map((prazo) => (
                <div
                    key={prazo.id}
                    className={`p-4 rounded-xl border transition-all hover:shadow-sm ${getStatusColor(
                    prazo.status
                    )}`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(prazo.status)}
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                            {getStatusLabel(prazo.status)}
                            </span>
                        </div>
                        <span className="text-xs font-mono opacity-80 bg-white/50 px-2 py-0.5 rounded">
                            {prazo.dataPrazo.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <p className="font-bold text-foreground text-sm mb-1 line-clamp-1" title={prazo.numeroProcesso}>
                        {prazo.numeroProcesso}
                    </p>
                    <p className="text-xs text-foreground/80 mb-3 line-clamp-2" title={prazo.descricao}>
                        {prazo.descricao}
                    </p>

                    <Button size="sm" variant="ghost" className="w-full h-8 text-xs font-medium border border-current/20 hover:bg-white/20">
                        Ver Detalhes
                    </Button>
                </div>
                ))}
            </div>
            )}
        </div>
      </Card>
    </div>
  );
}