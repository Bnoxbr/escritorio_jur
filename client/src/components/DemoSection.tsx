import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface DemoData {
  title: string;
  description: string;
  input: string;
  output: {
    label: string;
    value: string;
  }[];
}

const demoExamples: DemoData[] = [
  {
    title: "Classificação de Documento",
    description: "Identifica automaticamente o tipo de documento jurídico",
    input: "Petição inicial contendo fundamentação legal...",
    output: [
      { label: "Tipo", value: "Petição Inicial" },
      { label: "Confiança", value: "98.5%" },
      { label: "Partes", value: "Autor vs. Réu" },
      { label: "Juízo", value: "1ª Vara Cível" },
    ],
  },
  {
    title: "Cálculo de Prazo",
    description: "Calcula automaticamente prazos processuais com precisão",
    input: "Prazo: 15 dias úteis | Data inicial: 27/01/2026",
    output: [
      { label: "Data Inicial", value: "27/01/2026" },
      { label: "Dias Úteis", value: "15" },
      { label: "Data Final", value: "17/02/2026" },
      { label: "Status", value: "✓ Válido" },
    ],
  },
  {
    title: "Extração de Metadados",
    description: "Extrai informações críticas do documento",
    input: "Documento jurídico com múltiplas informações...",
    output: [
      { label: "Número do Processo", value: "0001234-56.2026.1.00.0000" },
      { label: "Autor", value: "João da Silva" },
      { label: "Réu", value: "Empresa XYZ Ltda" },
      { label: "Data de Protocolo", value: "27/01/2026" },
    ],
  },
];

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState("0");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  const demo = demoExamples[parseInt(activeTab)];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Veja em Ação</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore exemplos práticos de como o Secretário Jurídico processa documentos reais
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {demoExamples.map((example, idx) => (
                <TabsTrigger key={idx} value={idx.toString()} className="text-sm">
                  {example.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {demoExamples.map((example, idx) => (
              <TabsContent key={idx} value={idx.toString()} className="space-y-6">
                <Card className="p-8 border border-border">
                  <h3 className="text-2xl font-bold text-primary mb-2">{example.title}</h3>
                  <p className="text-muted-foreground mb-6">{example.description}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        Entrada
                      </label>
                      <div className="bg-secondary p-4 rounded-lg border border-border min-h-32 flex items-center">
                        <p className="text-sm text-muted-foreground italic">{example.input}</p>
                      </div>
                    </div>

                    {/* Output */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        Resultado
                      </label>
                      <div className="bg-secondary p-4 rounded-lg border border-border min-h-32">
                        {isProcessing ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="animate-spin">
                              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {example.output.map((item, i) => (
                              <div key={i} className="flex justify-between items-start">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {item.label}
                                </span>
                                <span className="text-sm font-semibold text-foreground text-right">
                                  {item.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="mt-6 w-full bg-primary hover:bg-primary/90"
                  >
                    {isProcessing ? "Processando..." : "Processar Exemplo"}
                  </Button>
                </Card>

                {/* Features Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Processamento Automático</p>
                      <p className="text-xs text-green-700">Sem intervenção manual necessária</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 text-sm">Precisão Garantida</p>
                      <p className="text-xs text-blue-700">Conformidade legal 100%</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
