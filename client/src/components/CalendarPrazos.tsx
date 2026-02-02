import { useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { pt } from "react-day-picker/locale";
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
  processId: string;
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
      const chave = prazo.dataPrazo.toISOString().split("T")[0];
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
    return Array.from(prazosPorData.keys()).map((chave) => new Date(chave));
  }, [prazosPorData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vencido":
        return "text-red-500 bg-red-50";
      case "urgente":
        return "text-orange-500 bg-orange-50";
      case "proximo":
        return "text-yellow-500 bg-yellow-50";
      default:
        return "text-green-500 bg-green-50";
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
      backgroundColor: "#ff006e",
      color: "#ffffff",
      fontWeight: "bold",
      borderRadius: "0.5rem",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendário */}
      <Card className="lg:col-span-2 p-6 border-2 border-border bg-card rounded-2xl">
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-4 mb-6">
          <h3 className="text-lg font-bold text-white">Calendário de Prazos</h3>
        </div>

        <div className="flex justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={pt}
            modifiers={customModifiers}
            modifiersStyles={customModifiersStyles}
            showOutsideDays={false}
            disabled={(date) => {
              const hoje = new Date();
              hoje.setHours(0, 0, 0, 0);
              return date < hoje && !datasComPrazos.some((d) => d.toDateString() === date.toDateString());
            }}
            footer={
              <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground text-center">
                {datasComPrazos.length} data{datasComPrazos.length !== 1 ? "s" : ""} com prazos
              </div>
            }
          />
        </div>

        {/* Legenda */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm font-semibold text-foreground mb-4">Legenda:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-sm text-muted-foreground">Vencido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded" />
              <span className="text-sm text-muted-foreground">Urgente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-sm text-muted-foreground">Próximo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm text-muted-foreground">Normal</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Detalhes do Dia Selecionado */}
      <Card className="p-6 border-2 border-border bg-card rounded-2xl h-fit">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-2">
            {selectedDate ? selectedDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }) : "Selecione uma data"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {prazosDodia.length} prazo{prazosDodia.length !== 1 ? "s" : ""} neste dia
          </p>
        </div>

        {prazosDodia.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground font-semibold">Nenhum prazo neste dia</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {prazosDodia.map((prazo) => (
              <div
                key={prazo.id}
                className={`p-4 rounded-lg border-2 border-border transition-all hover:shadow-md ${getStatusColor(
                  prazo.status
                )}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(prazo.status)}
                    <span className="text-xs font-bold uppercase">
                      {getStatusLabel(prazo.status)}
                    </span>
                  </div>
                </div>

                <p className="font-bold text-foreground mb-1">{prazo.numeroProcesso}</p>
                <p className="text-sm text-muted-foreground mb-3">{prazo.descricao}</p>

                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">
                    {prazo.dataPrazo.toLocaleDateString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Button size="sm" variant="outline" className="rounded-lg text-xs">
                    Ver Processo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumo de Prazos */}
        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total de prazos:</span>
            <span className="font-bold text-foreground">{prazos.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Vencidos:</span>
            <span className="font-bold text-red-500">
              {prazos.filter((p) => p.status === "vencido").length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Urgentes:</span>
            <span className="font-bold text-orange-500">
              {prazos.filter((p) => p.status === "urgente").length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Próximos:</span>
            <span className="font-bold text-yellow-500">
              {prazos.filter((p) => p.status === "proximo").length}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
