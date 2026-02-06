import { useState, useEffect, useCallback } from "react";
import { useProcessos } from "@/contexts/ProcessosContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentViewer from "@/components/DocumentViewer";
import { FileText, Download, Trash2, Eye, Menu, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

// Definição local do tipo para garantir que bata com o banco (snake_case)
interface DocumentoLocal {
  id: number;
  user_id: string;
  nome: string;
  file_key: string;     // Caminho no bucket
  url: string | null;   // URL pública (se houver)
  tamanho: number;
  tipo: string;
  processo_id: number | null;
  numero_processo: string | null;
  created_at: string;
}

// Extensão para uso no frontend (display)
interface DocumentoDisplay extends DocumentoLocal {
  url_assinada: string;
  data_formatada: string;
}

// O NOME DO BUCKET QUE CRIAMOS
const BUCKET_NAME = "documentos_processos";

export default function Documentos() {
  const { processos } = useProcessos();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [documentos, setDocumentos] = useState<DocumentoDisplay[]>([]);
  const [processoSelecionado, setProcessoSelecionado] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<DocumentoDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- BUSCAR DOCUMENTOS ---
  const fetchDocumentos = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // 1. Query no Banco (usando nomes snake_case)
      let query = supabase
        .from("documentos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (processoSelecionado) {
        query = query.eq("processo_id", processoSelecionado);
      }

      const { data, error } = await query;

      if (error) throw error;

      // 2. Gerar URLs assinadas (para conseguir ver o arquivo privado)
      const docsWithUrls = await Promise.all(
        (data || []).map(async (doc: DocumentoLocal) => {
          let url_final = doc.url || "";
          
          // Se tiver file_key, pede permissão temporária ao Storage
          if (doc.file_key) {
            const { data: signedData } = await supabase.storage
              .from(BUCKET_NAME)
              .createSignedUrl(doc.file_key, 3600); // Link válido por 1 hora
            
            if (signedData) url_final = signedData.signedUrl;
          }

          return {
            ...doc,
            url_assinada: url_final,
            data_formatada: new Date(doc.created_at).toLocaleString("pt-BR"),
          };
        })
      );

      setDocumentos(docsWithUrls);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      toast.error("Erro ao carregar lista de documentos.");
    } finally {
      setIsLoading(false);
    }
  }, [user, processoSelecionado]);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  // --- UPLOAD DE ARQUIVOS ---
  const handleUpload = async (files: File[]) => {
    if (!user) return;
    
    try {
      const novosDocs = [];
      
      for (const file of files) {
        // Sanitiza o nome (remove acentos e espaços para evitar erro no servidor)
        const cleanName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "_");
        const fileName = `${Date.now()}_${cleanName}`;
        const filePath = `${user.id}/${fileName}`;

        // 1. Enviar arquivo para o Storage (BUCKET CORRETO)
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME) 
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Salvar referência no Banco (COLUNAS snake_case)
        const { data: docData, error: dbError } = await supabase
          .from("documentos")
          .insert({
            user_id: user.id,
            nome: file.name, // Nome original para exibição
            file_key: filePath,
            tamanho: file.size,
            tipo: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'imagem' : 'outro',
            processo_id: processoSelecionado || null,
            numero_processo: processoSelecionado ? processos.find(p => p.id === processoSelecionado)?.numeroProcesso : null
          })
          .select()
          .single();

        if (dbError) {
          // Rollback: se falhar no banco, deleta o arquivo para não ficar lixo
          await supabase.storage.from(BUCKET_NAME).remove([filePath]);
          throw dbError;
        }
        
        novosDocs.push(docData);
      }

      toast.success(`${novosDocs.length} documento(s) enviado(s) com sucesso!`);
      setShowUpload(false);
      fetchDocumentos(); // Atualiza a lista na tela
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast.error(error.message || "Erro ao enviar documentos. Verifique o console.");
    }
  };

  // --- DELETAR DOCUMENTOS ---
  const handleDelete = async (id: number, fileKey: string | null) => {
    if (!confirm("Tem certeza que deseja excluir este documento?")) return;

    try {
      // 1. Deletar do Storage primeiro
      if (fileKey) {
        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([fileKey]);
        
        if (storageError) console.warn("Arquivo não encontrado no storage, removendo do banco...");
      }

      // 2. Deletar do Banco
      const { error: dbError } = await supabase
        .from("documentos")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
      toast.success("Documento removido!");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao remover documento.");
    }
  };

  // --- DOWNLOAD ---
  const handleDownload = (doc: DocumentoDisplay) => {
    const link = document.createElement("a");
    link.href = doc.url_assinada;
    link.download = doc.nome;
    link.target = "_blank";
    link.click();
  };

  // --- ÍCONES ---
  const getFileIcon = (tipo: string | null) => {
    if (!tipo) return "📎";
    if (tipo.includes("pdf")) return "📄";
    if (tipo.includes("image") || tipo === "imagem") return "🖼️";
    if (tipo.includes("word") || tipo === "documento") return "📝";
    return "📎";
  };

  const formatarTamanho = (bytes: number | null) => {
    if (!bytes) return "0 Bytes";
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
              Todos os Arquivos
            </Button>
            {processos.slice(0, 5).map((processo) => (
              <Button
                key={processo.id}
                onClick={() => setProcessoSelecionado(processo.id)}
                className={`rounded-xl font-bold transition-all px-6 py-6 ${
                  processoSelecionado === processo.id
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "bg-white text-foreground border-2 border-border hover:border-primary/50"
                }`}
              >
                {processo.numeroProcesso}
              </Button>
            ))}
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

          {/* Área de Upload (Componente Filho) */}
          {showUpload && (
            <Card className="p-10 mb-12 border-2 border-primary/20 rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in duration-300">
              <DocumentUpload onUpload={handleUpload} />
            </Card>
          )}

          {/* Lista de Documentos */}
          {isLoading ? (
             <div className="p-20 flex flex-col items-center gap-4">
               <Loader2 className="w-12 h-12 text-primary animate-spin" />
               <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Carregando documentos...</p>
             </div>
          ) : documentos.length === 0 ? (
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
              {documentos.map((doc) => (
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
                        onClick={() => handleDelete(doc.id, doc.file_key)}
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
                      <span className="text-foreground">{doc.data_formatada}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Processo:{" "}
                        <span className="text-primary">
                          {doc.numero_processo || "Geral"}
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
          url={viewerDoc.url_assinada}
          fileName={viewerDoc.nome}
          onClose={() => setViewerDoc(null)}
        />
      )}
    </div>
  );
}