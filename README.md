# Secretário Jurídico - Automação Inteligente

Este é um assistente jurídico inteligente projetado para gerenciar processos, prazos e documentos com uma interface moderna e premium.

## 🚀 Tecnologias

- **Frontend:** React, Vite, Tailwind CSS, Lucide React, Radix UI, Shadcn UI.
- **Backend:** Node.js, tRPC, Drizzle ORM, PostgreSQL (Supabase).
- **IA:** Integração com LLM para sumarização e análise de documentos.

## 🛠️ Configuração Inicial

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto (veja o arquivo `.env` de exemplo ou as instruções abaixo).

3. **Configure o Banco de Dados:**
   Siga as instruções em [SETUP_SUPABASE.md](file:///c:/Desenvolvimento/Agente_Jur/SETUP_SUPABASE.md) para configurar seu banco de dados no Supabase.

4. **Execute as migrações:**
   ```bash
   npm run db:push
   ```

## 💻 Execução

Para iniciar o servidor de desenvolvimento (frontend e backend):

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`.

## 🔑 Autenticação

O sistema utiliza um fluxo de OAuth. Certifique-se de configurar as seguintes variáveis no seu `.env`:

- `VITE_OAUTH_PORTAL_URL`: URL do portal de autenticação.
- `VITE_APP_ID`: ID do seu aplicativo no portal.
- `VITE_API_URL`: URL base da sua API.

**Nota:** Se você estiver em ambiente de desenvolvimento e não tiver um portal OAuth, o sistema redirecionará para um placeholder. Veja [const.ts](file:///c:/Desenvolvimento/Agente_Jur/client/src/const.ts) para detalhes.

## 📁 Estrutura do Projeto

- `client/`: Código fonte do frontend (React).
- `server/`: Código fonte do backend (Node.js + tRPC).
- `shared/`: Tipos e constantes compartilhados.
- `drizzle/`: Configurações e migrações do banco de dados.

## 📄 Documentação Adicional

- [Agente_jur.md](file:///c:/Desenvolvimento/Agente_Jur/Agente_jur.md): Visão geral das capacidades do agente.
- [SETUP_SUPABASE.md](file:///c:/Desenvolvimento/Agente_Jur/SETUP_SUPABASE.md): Guia de configuração do banco de dados.
- [ideas.md](file:///c:/Desenvolvimento/Agente_Jur/ideas.md): Roadmap e ideias futuras.
