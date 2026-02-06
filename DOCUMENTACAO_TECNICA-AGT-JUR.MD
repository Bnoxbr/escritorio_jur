# Documentação Técnica: Agente Jurídico (Fase 1 - MVP Completo)

**Status:** Operacional (Database + Storage + AI Processing + Frontend)
**Versão:** 1.0.0 (Snake Case Migration)
**Última Atualização:** 06/02/2026

## 1. Visão Geral da Arquitetura

O sistema opera em uma arquitetura Event-Driven (Orientada a Eventos) para processamento de documentos.

- **Frontend (React):** Upload do PDF para o Storage.
- **Database (Supabase):** Gatilho (Webhook) detecta novo arquivo.
- **Edge Function (Deno):** Baixa o PDF, extrai texto e envia para LLM (Llama 3 via Groq).
- **Database:** Salva o insight JSON e notifica o Frontend (via Views).

## 2. Banco de Dados (Supabase PostgreSQL)

Todo o schema foi migrado para `snake_case` para seguir boas práticas de SQL.

### 2.1 Tabelas Principais

| Tabela | Função | Colunas Chave |
| :--- | :--- | :--- |
| `users` | Perfil do Usuário | `id` (PK, FK auth), `email`, `name` |
| `processos` | Casos Jurídicos | `id`, `user_id`, `numero_processo`, `status` |
| `documentos` | Arquivos PDF | `id`, `file_key`, `url`, `processo_id` |
| `processamentos_ia` | Resultados da IA | `insight_json` (JSONB), `urgencia`, `prazo_detectado` |

### 2.2 Views (Camada de Leitura do Dashboard)

- `vw_painel_urgencias`: Filtra processos com urgência 'Alta'/'Média'.
- `vw_notificacoes_pendentes`: Monitora prazos futuros baseados na análise da IA.

### 2.3 Segurança (RLS)

Row Level Security **ATIVO** em todas as tabelas.
- **Política:** `auth.uid() = user_id` (Usuário só vê seus próprios dados).

## 3. Inteligência Artificial (Edge Function)

- **Caminho:** `supabase/functions/analyze-document/index.ts`
- **Modelo:** Llama 3 70B (via Groq API).

**Pipeline:**
1. Trigger INSERT na tabela `documentos` chama Webhook.
2. Function baixa PDF do Storage.
3. Lib `pdf-parse` extrai texto cru.
4. Prompt de Sistema força saída estritamente JSON.
5. Resultado gravado em `processamentos_ia`.

**Exemplo de JSON de Saída da IA:**

```json
{
  "tipo_documento": "Intimação",
  "resumo": "Intimação para apresentar contrarrazões no prazo legal.",
  "tem_prazo": true,
  "dias_prazo": 15,
  "urgencia": "Alta",
  "recomendacao": "Protocolar resposta até dia 20."
}
```

## 4. Integração Frontend (React)

O Frontend foi adaptado para traduzir o banco (snake_case) para a aplicação (camelCase) em tempo real.

**Adaptador (ProcessosContext.tsx)**
Utilizamos funções de mapeamento para isolar a lógica do banco:
- `mapFromDb(dbItem)`: Converte `user_id` -> `userId`.
- `mapToDb(localItem)`: Converte `userId` -> `user_id`.

## 5. Credenciais e Variáveis (Ambiente)

- **Supabase:** Configurado e Linkado (`supabase link`).
- **Groq API:** Configurada via supabase secrets (`GROQ_API_KEY`).
- **Deno:** Configurado no VS Code (Extensão + Executável).

## ✅ Próximos Passos Sugeridos

- **Interface de Feedback:** Criar um componente no Frontend para mostrar o JSON da IA bonitinho (cards de "Urgência" e "Resumo").
- **Chat com Documento:** Implementar funcionalidade RAG (Retrieval-Augmented Generation) para o advogado fazer perguntas ao PDF ("Qual o valor da causa mencionado?").
- **Melhoria de Prompt:** Refinar o prompt do Llama 3 para casos específicos (Trabalhista vs Cível).
