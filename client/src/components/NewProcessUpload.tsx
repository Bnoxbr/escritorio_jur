import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function NewProcessUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  // Campos do formulário
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [titulo, setTitulo] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Por favor, envie apenas arquivos PDF.' });
        return;
      }
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !numeroProcesso) return;

    setLoading(true);
    setMessage(null);

    try {
      // 1. Pegar usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      // 2. Nome único para o arquivo (evita sobrescrever)
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // 3. Upload para o Storage
      const { error: uploadError } = await supabase.storage
        .from('documentos_processos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 4. Salvar referência no Banco de Dados
      // A tabela 'processos' que criamos no script SQL
      const { error: dbError } = await supabase
        .from('processos')
        .insert({
          user_id: user.id,
          numero_processo: numeroProcesso,
          titulo: titulo || file.name, // Usa o nome do arquivo se não tiver título
          status: 'pendente_ia', // Status inicial para nosso robô pegar depois
          // Podemos salvar o caminho do arquivo aqui se adicionarmos uma coluna 'file_path' na tabela processos depois.
          // Por enquanto, vamos assumir que o sistema sabe achar pelo user_id + data, 
          // mas para produção idealmente adicionamos a coluna 'caminho_arquivo' na tabela.
        });

      if (dbError) throw dbError;

      setMessage({ type: 'success', text: 'Processo enviado com sucesso! A IA analisará em breve.' });
      setFile(null);
      setNumeroProcesso('');
      setTitulo('');
      if (onUploadSuccess) onUploadSuccess(); // Atualiza a lista pai

    } catch (error: any) {
      console.error('Erro no upload:', error);
      setMessage({ type: 'error', text: error.message || 'Erro ao enviar processo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Upload className="w-5 h-5 text-indigo-600" />
        Novo Processo
      </h2>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Número do Processo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número do Processo</label>
          <input
            type="text"
            required
            value={numeroProcesso}
            onChange={(e) => setNumeroProcesso(e.target.value)}
            placeholder="Ex: 0001234-56.2026.8.26.0000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Título (Opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título / Cliente</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Ação de Cobrança - Silva vs Souza"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Input de Arquivo Customizado */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center pointer-events-none">
            {file ? (
              <>
                <FileText className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-sm font-medium text-indigo-600">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Clique ou arraste o PDF aqui</span>
                <span className="text-xs text-gray-400 mt-1">Apenas arquivos PDF</span>
              </>
            )}
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {message && (
          <div className={`p-3 rounded-md flex items-center gap-2 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Botão de Enviar */}
        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-white font-medium transition-colors ${
            loading || !file 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Processar Arquivo'
          )}
        </button>
      </form>
    </div>
  );
}