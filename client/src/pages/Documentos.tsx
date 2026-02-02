import { useState } from "react";
import { useProcessos } from "@/contexts/ProcessosContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentViewer from "@/components/DocumentViewer";
import { FileText, Download, Trash2, Eye, Menu, Plus } from "lucide-react";

interface Documento {
  id: string;
  nome: string;
  url: string;
  tamanho: number;
  tipo: string;
  dataUpload: string;
  processId: string;
}

export default function Documentos() {
  const { processos } = useProcessos();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [processoSelecionado, setProcessoSelecionado] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<Documento | null>(null);

  const handleUpload = (files: File[]) => {
    // Simular upload de documentos
    const novosDocumentos = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      nome: file.name,
      url: URL.createObjectURL(file), // Em produção, seria a URL do S3
      tamanho: file.size,
      tipo: file.type,
      dataUpload: new Date().toLocaleString("pt-BR"),
      processId: processoSelecionado || "geral",
    }));

    setDocumentos((prev) => [...prev, ...novosDocumentos]);
    setShowUpload(false);
  };

  const handleDelete = (id: string) => {
    setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleDownload = (doc: Documento) => {
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.nome;
    link.click();
  };

  const documentosFiltrados = processoSelecionado
    ? documentos.filter((doc) => doc.processId === processoSelecionado)
    : documentos;

  const getFileIcon = (tipo: string) => {
    if (tipo.includes("pdf")) return "📄";
    if (tipo.includes("image")) return "🖼️";
    if (tipo.includes("word")) return "📝";
    return "📎";
  };

  const formatarTamanho = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="flex h-screen bg-secondary/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto">
        <div className="container py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2 tracking-tight">Gestão de Documentos</h1>
              <p className="text-muted-foreground text-lg font-medium">Repositório centralizado e seguro para todos os seus arquivos jurídicos.</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Filtro por Processo */}
          <div className="mb-12 flex gap-4 flex-wrap bg-card p-6 rounded-2xl border-2 border-border/50 shadow-sm items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Filtrar por:</span>
            <Button
              onClick={() => setProcessoSelecionado(null)}
              className={`rounded-xl font-bold transition-all px-6 py-6 ${
                processoSelecionado === null
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "bg-white text-foreground border-2 border-border hover:border-primary/50"
              }`}
            >
              Todos os Arquivos ({documentos.length})
            </Button>
            {processos.slice(0, 5).map((processo) => {
              const count = documentos.filter((doc) => doc.processId === processo.id).length;
              return (
                <Button
                  key={processo.id}
                  onClick={() => setProcessoSelecionado(processo.id)}
                  className={`rounded-xl font-bold transition-all px-6 py-6 ${
                    processoSelecionado === processo.id
                      ? "bg-primary text-white shadow-xl shadow-primary/20"
                      : "bg-white text-foreground border-2 border-border hover:border-primary/50"
                  }`}
                >
                  {processo.numeroProcesso} ({count})
                </Button>
              );
            })}
          </div>

          {/* Botão Upload */}
          <div className="mb-12">
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold gap-3 px-8 py-8 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              Upload de Documentos
            </Button>
          </div>

          {/* Área de Upload */}
          {showUpload && (
            <Card className="p-10 mb-12 border-2 border-primary/20 rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in duration-300">
              <DocumentUpload onUpload={handleUpload} />
            </Card>
          )}

          {/* Lista de Documentos */}
          {documentosFiltrados.length === 0 ? (
            <Card className="p-20 border-2 border-border/50 bg-white text-center rounded-[2.5rem] shadow-xl">
              <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-8">
                <FileText className="w-12 h-12 text-muted-foreground opacity-30" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Nenhum documento</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium">Você ainda não enviou arquivos para este filtro.</p>
              <Button variant="outline" onClick={() => setShowUpload(true)} className="mt-8 rounded-xl font-bold border-2">Fazer meu primeiro upload</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {documentosFiltrados.map((doc) => (
                <Card
                  key={doc.id}
                  className="p-8 border-2 border-border/50 bg-white hover:shadow-2xl transition-all rounded-4xl flex flex-col group hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                      {getFileIcon(doc.tipo)}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => setViewerDoc(doc)}
                        size="icon"
                        variant="outline"
                        className="w-10 h-10 rounded-xl border-2 hover:bg-secondary"
                        title="Visualizar"
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => handleDownload(doc)}
                        size="icon"
                        variant="outline"
                        className="w-10 h-10 rounded-xl border-2 hover:bg-secondary"
                        title="Baixar"
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(doc.id)}
                        size="icon"
                        variant="outline"
                        className="w-10 h-10 rounded-xl border-2 text-red-600 hover:bg-red-50 hover:border-red-200"
                        title="Deletar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-bold text-xl text-foreground mb-3 truncate" title={doc.nome}>
                    {doc.nome}
                  </h3>

                  <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1 font-medium">
                    <div className="flex justify-between">
                      <span>Tamanho:</span>
                      <span className="text-foreground">{formatarTamanho(doc.tamanho)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upload em:</span>
                      <span className="text-foreground">{doc.dataUpload}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Processo:{" "}
                        <span className="text-primary">
                          {processos.find((p) => p.id === doc.processId)?.numeroProcesso || "Geral"}
                        </span>
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Visualizador de Documentos */}
      {viewerDoc && (
        <DocumentViewer
          url={viewerDoc.url}
          fileName={viewerDoc.nome}
          onClose={() => setViewerDoc(null)}
        />
      )}
    </div>
  );
}
