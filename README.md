# Secretário Jurídico - Automação Inteligente

Este é um assistente jurídico inteligente projetado para gerenciar processos, prazos e documentos com uma interface moderna e premium.

**Última Atualização:** 06/02/2026

## 🚀 Tecnologias

- **Frontend:** React, Vite, Tailwind CSS, Lucide React, Radix UI, Shadcn UI.
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime).
- **Serverless:** Supabase Edge Functions (Deno).
- **IA:** Integração com Llama 3 (via Groq) para análise e sumarização de documentos.

## 🛠️ Configuração Inicial

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com as chaves do Supabase e Groq API (veja o arquivo `.env.example` ou `Agente_jur.md`).

3. **Configure o Banco de Dados:**
   Siga as instruções em [SETUP_SUPABASE.md](file:///c:/Desenvolvimento/Agente_Jur/SETUP_SUPABASE.md) para configurar seu banco de dados no Supabase.

## 💻 Execução

Para iniciar o servidor de desenvolvimento do frontend:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5000` (ou porta definida pelo Vite).

## 🔑 Autenticação

O sistema utiliza **Supabase Auth**. Certifique-se de configurar os provedores de autenticação no painel do Supabase e as variáveis no `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📁 Estrutura do Projeto

- `client/`: Código fonte do frontend (React).
- `supabase/`: Configurações do Supabase (Edge Functions, Migrations).
- `server/`: (Legado) Código backend anterior, mantido para referência.
- `shared/`: Tipos e constantes compartilhados.

## 📄 Documentação Adicional

- [DOCUMENTACAO_TECNICA-AGT-JUR.MD](file:///c:/Desenvolvimento/Agente_Jur/DOCUMENTACAO_TECNICA-AGT-JUR.MD): Documentação técnica principal e atualizada.
- [Agente_jur.md](file:///c:/Desenvolvimento/Agente_Jur/Agente_jur.md): Visão geral das capacidades do agente e arquitetura.
- [DOCUMENTACAO_FRONTEND.md](file:///c:/Desenvolvimento/Agente_Jur/DOCUMENTACAO_FRONTEND.md): Detalhes do frontend e integração.
- [DOCUMENTACAO_SISTEMA.md](file:///c:/Desenvolvimento/Agente_Jur/DOCUMENTACAO_SISTEMA.md): Visão sistêmica e fluxos de dados.
- [SETUP_SUPABASE.md](file:///c:/Desenvolvimento/Agente_Jur/SETUP_SUPABASE.md): Guia de configuração do banco de dados.
