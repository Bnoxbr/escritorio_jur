# Documentação do Frontend - Agente Jur

## 1. Visão Geral

O frontend do **Agente Jur** é uma aplicação **Single Page Application (SPA)** construída com **React**, **TypeScript** e **Vite**. A interface é estilizada utilizando **TailwindCSS** e componentes baseados em **Shadcn UI**.

A arquitetura de comunicação com o backend segue um modelo híbrido **Semi-Autônomo**:
*   **Supabase SDK**: Utilizado para a maioria das operações de leitura e escrita de dados de domínio (Processos, Configurações, Insights), conectando-se diretamente ao banco de dados PostgreSQL com Row Level Security (RLS).
*   **tRPC**: Utilizado para gerenciamento de sessão (Autenticação) e operações de sistema, mantendo a tipagem segura entre cliente e servidor.

## 2. Estrutura de Diretórios (`client/src`)

A organização do código segue uma estrutura modular:

*   **`_core/`**: Hooks e utilitários essenciais do sistema (ex: `useAuth` para autenticação).
*   **`components/`**: Componentes visuais reutilizáveis.
    *   `ui/`: Componentes atômicos do Shadcn (Botões, Cards, Inputs).
    *   `AIChatBox.tsx`: Componente de interface para chat com IA.
    *   `Sidebar.tsx`: Navegação principal.
*   **`contexts/`**: Gerenciamento de estado global.
    *   `ProcessosContext.tsx`: Centraliza a lógica CRUD de processos.
    *   `ThemeContext.tsx`: Gerencia temas (claro/escuro).
*   **`lib/`**: Configurações de clientes externos.
    *   `supabase.ts`: Instância configurada do cliente Supabase.
    *   `trpc.ts`: Instância do cliente tRPC (React Query).
*   **`pages/`**: Componentes de página (rotas).
    *   `Dashboard.tsx`, `Processos.tsx`, `Configuracoes.tsx`, etc.
*   **`services/`**: Camada de lógica de negócios e integrações.
    *   `agenteService.ts`: Lógica de processamento de IA e persistência de insights.
*   **`types/`**: Definições de tipos TypeScript.
    *   `supabase-types.ts`: Tipagem gerada a partir do Schema do banco de dados.

## 3. Pipeline de Requisições

O frontend utiliza dois pipelines distintos dependendo do tipo de operação.

### 3.1. Pipeline de Dados de Domínio (Supabase SDK)
Este é o fluxo principal para manipulação de dados como Processos, Notificações e Configurações.

**Fluxo:**
1.  **Componente/Página**: Inicia a ação (ex: `Dashboard.tsx` ou `ProcessosContext`).
2.  **Supabase Client** (`src/lib/supabase.ts`): Intercepta a chamada.
3.  **Network**: Requisição HTTPS direta para a API do Supabase.
4.  **Database**: O PostgreSQL valida as regras de segurança (RLS) e executa a query.

**Exemplo de Código (`ProcessosContext.tsx`):**
```typescript
// Busca processos do usuário logado
const { data, error } = await supabase
  .from("processos")
  .select("*")
  .eq("userId", user.id);
```

### 3.2. Pipeline de Autenticação e Sistema (tRPC)
Utilizado para verificar a sessão do usuário e realizar logout.

**Fluxo:**
1.  **Hook** (`useAuth.ts`): Consome `trpc.auth.me.useQuery`.
2.  **tRPC Client**: Envolve a requisição com React Query.
3.  **Server**: O servidor Node.js processa a rota `auth.me` definida em `server/routers.ts`.
4.  **Validação**: Verifica o cookie de sessão.

**Exemplo de Código (`useAuth.ts`):**
```typescript
// Verifica sessão atual
const meQuery = trpc.auth.me.useQuery(undefined, {
  retry: false,
});
```

### 3.3. Pipeline de Inteligência Artificial (Service Layer)
Gerencia a interação com modelos de IA e o armazenamento dos resultados.

**Fluxo:**
1.  **Componente**: Chama `processarAndamento()` em `agenteService.ts`.
2.  **Service**:
    *   Simula/Chama API de LLM (ex: Llama 3).
    *   Recebe o JSON estruturado.
    *   Persiste o resultado na tabela `processamentos_ia` via Supabase SDK.

**Exemplo de Código (`agenteService.ts`):**
```typescript
// Processa texto e salva insight
const insightIA = await chamarLlama3(textoBruto);
await supabase.from('processamentos_ia').insert({ ... });
```

## 4. Diagrama de Arquitetura

```mermaid
graph TD
    User[Usuário] --> Frontend[Frontend React]
    
    subgraph Client Layer
        Frontend --> AuthHook[useAuth (tRPC)]
        Frontend --> ProcContext[ProcessosContext (Supabase)]
        Frontend --> AgentService[AgenteService]
    end
    
    subgraph Network
        AuthHook --HTTPS/JSON--> NodeServer[Node.js Server (tRPC)]
        ProcContext --HTTPS/REST--> SupabaseAPI[Supabase API]
        AgentService --HTTPS--> SupabaseAPI
    end
    
    subgraph Data Layer
        SupabaseAPI --> Postgres[(PostgreSQL DB)]
        NodeServer -.Validation.-> Postgres
    end
```

## 5. Próximos Passos e Manutenção

*   **Adicionar Novas Tabelas**:
    1.  Crie a tabela no Supabase/SQL.
    2.  Atualize `src/types/supabase-types.ts`.
    3.  Consuma via `supabase.from('nova_tabela')`.
*   **Adicionar Rotas de Servidor**:
    1.  Edite `server/routers.ts`.
    2.  O tRPC atualizará automaticamente os tipos no cliente.
