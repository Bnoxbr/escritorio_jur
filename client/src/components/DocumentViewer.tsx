import { useState } from "react";
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DocumentViewerProps {
  url: string;
  fileName: string;
  onClose?: () => void;
}

export default function DocumentViewer({ url, fileName, onClose }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isPDF = fileName.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 50));
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-card border-2 border-border rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="w-5 h-5 text-primary flex-shrink-0" />
            <h3 className="font-bold text-foreground truncate">{fileName}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isImage && (
              <>
                <Button
                  onClick={handleZoomOut}
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                  title="Diminuir zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-semibold text-muted-foreground w-12 text-center">
                  {zoom}%
                </span>
                <Button
                  onClick={handleZoomIn}
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                  title="Aumentar zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button
              onClick={handleDownload}
              size="sm"
              variant="outline"
              className="rounded-lg"
              title="Baixar documento"
            >
              <Download className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button
                onClick={onClose}
                size="sm"
                variant="outline"
                className="rounded-lg text-red-500 hover:bg-red-50"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-auto bg-black/10 flex items-center justify-center p-4">
          {isImage ? (
            <img
              src={url}
              alt={fileName}
              style={{ maxWidth: "100%", maxHeight: "100%", width: `${zoom}%` }}
              className="object-contain"
            />
          ) : isPDF ? (
            <iframe
              src={`${url}#page=${currentPage}`}
              title={fileName}
              className="w-full h-full border-0 rounded-lg"
            />
          ) : (
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-semibold">
                Tipo de arquivo não suportado para visualização
              </p>
              <Button onClick={handleDownload} className="mt-4 bg-primary hover:bg-primary/90 text-white rounded-lg">
                <Download className="w-4 h-4 mr-2" />
                Baixar Arquivo
              </Button>
            </div>
          )}
        </div>

        {/* Footer - Navegação de Páginas (PDF) */}
        {isPDF && (
          <div className="flex items-center justify-center gap-4 p-4 border-t border-border bg-secondary">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
              className="rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
              className="rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
