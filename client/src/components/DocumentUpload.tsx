import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DocumentUploadProps {
  onUpload?: (files: File[]) => void;
  maxSize?: number; // em MB
  acceptedTypes?: string[];
}

export default function DocumentUpload({
  onUpload,
  maxSize = 50,
  acceptedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".gif", ".doc", ".docx"],
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    // Verificar tamanho
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `${file.name} excede o tamanho máximo de ${maxSize}MB`;
    }

    // Verificar tipo
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `${file.name} não é um tipo de arquivo aceito`;
    }

    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      console.error("Erros de validação:", errors);
      // Aqui você pode mostrar um toast com os erros
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Chamar callback com os arquivos
      if (onUpload) {
        onUpload(files);
      }
      // Limpar após upload
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    return <FileText className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Área de Drag and Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/10 scale-105"
            : "border-border bg-secondary/30 hover:border-primary hover:bg-primary/5"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Arraste seus documentos aqui
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              ou clique para selecionar arquivos
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo {maxSize}MB por arquivo • PDF, Imagens, Documentos
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
          >
            Selecionar Arquivos
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          accept={acceptedTypes.join(",")}
          className="hidden"
        />
      </div>

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <Card className="p-6 border-2 border-border bg-card rounded-2xl">
          <h4 className="font-bold text-foreground mb-4">
            {files.length} arquivo{files.length !== 1 ? "s" : ""} selecionado{files.length !== 1 ? "s" : ""}
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border hover:bg-secondary/80 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => removeFile(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setFiles([])}
              variant="outline"
              className="flex-1 rounded-lg border-2"
            >
              Limpar Tudo
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Enviar Documentos
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
