# Secretário Jurídico - Documentação do Agente Inteligente

**Versão:** 1.1
**Data de Criação:** Janeiro de 2026
**Última Atualização:** 2026-02-06
**Autor:** Manus AI
**Status:** Produção

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Capacidades Principais](#capacidades-principais)
3. [Arquitetura do Agente](#arquitetura-do-agente)
4. [Fluxo de Trabalho](#fluxo-de-trabalho)
5. [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
6. [Integração com o App](#integração-com-o-app)
7. [Casos de Uso](#casos-de-uso)
8. [Limitações e Considerações](#limitações-e-considerações)
9. [Roadmap Futuro](#roadmap-futuro)
10. [FAQ](#faq)

---

## 🎯 Visão Geral

O **Secretário Jurídico** é um agente inteligente projetado especificamente para automatizar tarefas administrativas e de gestão de processos jurídicos. Ele funciona como um assistente virtual que organiza, acompanha e alerta sobre prazos, documentos e obrigações processuais, permitindo que advogados e escritórios jurídicos se concentrem em atividades de maior valor agregado.

### Objetivo Principal

Reduzir a carga administrativa de gestão de processos jurídicos através de automação inteligente, garantindo que nenhum prazo seja perdido e todos os documentos estejam organizados e acessíveis.

### Público-Alvo

- **Advogados Independentes:** Profissionais que precisam gerenciar múltiplos processos simultaneamente
- **Pequenos Escritórios Jurídicos:** Equipes de 2-5 advogados com volume moderado de processos
- **Secretárias Jurídicas:** Profissionais que precisam de ferramentas para organizar e acompanhar processos

### Diferencial Competitivo

Diferentemente de softwares jurídicos tradicionais que apenas armazenam dados, o Secretário Jurídico **atua proativamente**, alertando sobre prazos, sumarizando documentos e oferecendo recomendações baseadas em padrões processuais.

---

## 🚀 Capacidades Principais

### 1. **Gestão de Processos Ativos**

O agente mantém um registro centralizado de todos os processos jurídicos em andamento, incluindo:

- **Identificação do Processo:** Número único do processo, tribunal, vara
- **Partes Envolvidas:** Nomes de clientes, partes contrárias, advogados da outra parte
- **Status Processual:** Ativo, suspenso, arquivado, em recurso
- **Tipo de Ação:** Cível, trabalhista, criminal, administrativo, etc.
- **Valor da Causa:** Montante em disputa (quando aplicável)
- **Histórico de Movimentações:** Registro cronológico de todas as ações processuais

**Exemplo de Uso:**
```
Advogado: "Adicione um novo processo cível contra a empresa XYZ"
Agente: "Processo adicionado. Número: 0001234-56.2026.1.23.4567. 
Próximo prazo: 15 dias para contestação. Você será alertado em 5 dias."
```

### 2. **Acompanhamento Inteligente de Prazos**

O agente monitora automaticamente todos os prazos processuais e oferece alertas proativos:

- **Prazos Vencidos:** Alertas imediatos para prazos já expirados
- **Prazos Urgentes:** Notificações para prazos com menos de 3 dias
- **Prazos Próximos:** Lembretes para prazos com 5-10 dias
- **Prazos Normais:** Acompanhamento de prazos com mais de 10 dias
- **Cálculo Automático de Prazos:** Consideração de dias úteis, feriados e prorrogações

**Tipos de Prazos Monitorados:**
- Contestação (15 dias úteis)
- Tréplica (15 dias úteis)
- Recurso (15 dias úteis)
- Embargos (15 dias úteis)
- Cumprimento de sentença (15 dias)
- Prazos para apresentação de documentos
- Prazos para comparecimento em audiências

### 3. **Extração e Organização de Documentos**

O agente processa documentos jurídicos e extrai informações-chave automaticamente:

- **Análise de Petições:** Identifica tipo de petição, partes, prazos mencionados
- **Processamento de Decisões:** Extrai decisões, fundamentação legal, recursos cabíveis
- **Leitura de Intimações:** Identifica prazos, datas de audiência, obrigações
- **Classificação Automática:** Organiza documentos por tipo, data e relevância
- **Busca de Informações:** Localiza rapidamente informações específicas em documentos

**Exemplo de Uso:**
```
Advogado: "Processe este PDF de decisão do juiz"
Agente: "Decisão processada. Resultado: Procedência parcial. 
Recurso cabível: Apelação. Prazo: 15 dias úteis. 
Fundamentação legal: Arts. 186, 927 do CC. Valor condenado: R$ 50.000,00"
```

### 4. **Alertas e Notificações Personalizadas**

O agente envia notificações configuráveis sobre eventos importantes:

- **Notificações por Email:** Alertas diários, semanais ou por evento
- **Notificações Push:** Lembretes em tempo real no app
- **Resumos Executivos:** Relatórios semanais de status dos processos
- **Alertas de Risco:** Notificações sobre possíveis perdas ou ações urgentes
- **Personalizações:** Filtros por tipo de processo, urgência, tribunal

### 5. **Resumos Inteligentes de Processos**

O agente gera resumos executivos de cada processo:

- **Status Atual:** Situação processual resumida em 2-3 linhas
- **Próximos Passos:** Ações recomendadas para o advogado
- **Riscos Identificados:** Possíveis problemas ou prazos críticos
- **Histórico Resumido:** Timeline dos eventos mais importantes
- **Recomendações Legais:** Sugestões baseadas em jurisprudência

**Exemplo de Resumo:**
```
PROCESSO: 0001234-56.2026.1.23.4567
STATUS: Aguardando resposta da parte contrária
PRÓXIMOS PASSOS: Apresentar tréplica em 8 dias úteis
RISCOS: Nenhum prazo vencido. Situação sob controle.
RECOMENDAÇÃO: Preparar documentação adicional para fortalecer posição
```

### 6. **Gestão de Documentos com Upload**

O agente organiza e gerencia documentos jurídicos:

- **Upload de Arquivos:** Suporte para PDF, imagens, documentos Word
- **Armazenamento Seguro:** Criptografia de dados sensíveis
- **Versionamento:** Controle de versões de documentos
- **Busca Avançada:** Localização rápida de documentos por palavra-chave
- **Compartilhamento:** Permissões granulares para compartilhar com clientes ou colegas

### 7. **Calendário de Prazos Interativo**

O agente oferece visualização em calendário de todos os prazos:

- **Visualização Mensal:** Todos os prazos do mês em um calendário
- **Código de Cores:** Cores diferentes para urgência (vermelho = vencido, amarelo = urgente, verde = normal)
- **Detalhes ao Clicar:** Informações completas do prazo ao clicar na data
- **Exportação:** Possibilidade de exportar calendário para Google Calendar ou Outlook
- **Filtros:** Filtrar por tipo de processo, tribunal, urgência

### 8. **Relatórios e Estatísticas**

O agente gera relatórios detalhados sobre a carteira de processos:

- **Relatório de Carteira:** Quantidade de processos por status, tipo, tribunal
- **Análise de Prazos:** Prazos vencidos, próximos, em dia
- **Estatísticas de Ganho/Perda:** Taxa de sucesso em diferentes tipos de ações
- **Análise de Produtividade:** Tempo médio de resolução, número de recursos
- **Exportação em PDF:** Relatórios formatados para apresentação a clientes

---

## 🏗️ Arquitetura do Agente

### Componentes Principais

```
┌─────────────────────────────────────────────────────────┐
│                    SECRETÁRIO JURÍDICO                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   ENTRADA    │  │  PROCESSAMENTO│  │    SAÍDA     │   │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤   │
│  │ • Processos  │  │ • Análise    │  │ • Alertas    │   │
│  │ • Documentos │  │ • Extração   │  │ • Relatórios │   │
│  │ • Prazos     │  │ • Cálculo    │  │ • Resumos    │   │
│  │ • Eventos    │  │ • Predição   │  │ • Dashboard  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │           BASE DE DADOS JURÍDICA                 │   │
│  │  • Processos | Prazos | Documentos | Usuários   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         INTEGRAÇÕES EXTERNAS (Futuro)            │   │
│  │  • APIs de Tribunais | OCR | Email | SMS        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Entrada:** Usuário adiciona processo, upload de documento, ou evento ocorre
2. **Validação:** Agente valida dados de entrada
3. **Processamento:** Análise, extração, cálculo de prazos
4. **Armazenamento:** Dados salvos no banco de dados
5. **Notificação:** Alertas enviados se necessário
6. **Saída:** Informações disponibilizadas no dashboard

---

## 🔄 Fluxo de Trabalho

### Primeira Vez: Onboarding Guiado

```
1. Usuário acessa o app
   ↓
2. Sistema detecta primeira vez
   ↓
3. Onboarding guiado em 4 passos:
   - Informações do advogado (nome, especialidade)
   - Dados do cliente (se aplicável)
   - Primeiro processo (número, tipo, prazos)
   - Preferências de notificação
   ↓
4. Dashboard carregado com primeiro processo
   ↓
5. Agente começa a monitorar prazos
```

### Uso Contínuo: Ciclo Diário

```
MANHÃ (09:00):
- Agente verifica prazos vencidos
- Envia alertas de prazos urgentes (< 3 dias)
- Atualiza dashboard

DURANTE O DIA:
- Advogado adiciona novos processos
- Faz upload de documentos
- Consulta prazos e alertas
- Agente processa informações em tempo real

FINAL DO DIA (17:00):
- Agente gera resumo do dia
- Notifica sobre prazos do dia seguinte
- Prepara relatório semanal (sextas)

SEMANAL (Segunda-feira):
- Agente envia relatório completo da semana
- Análise de carteira
- Recomendações de ações
```

---

## 📊 Funcionalidades Detalhadas

### Funcionalidade 1: Adicionar Novo Processo

**Fluxo:**
1. Usuário clica em "Novo Processo"
2. Preenche formulário com informações básicas
3. Agente valida número do processo
4. Sistema calcula prazos automaticamente
5. Processo é adicionado ao dashboard

**Informações Necessárias:**
- Número do processo (obrigatório)
- Tipo de ação (cível, trabalhista, etc.)
- Tribunal e vara
- Partes envolvidas
- Data de distribuição
- Valor da causa
- Descrição breve

**Validações:**
- Número do processo deve ser válido (formato CNJ)
- Não pode haver duplicatas
- Data deve ser anterior à data atual

### Funcionalidade 2: Monitoramento de Prazos

**Algoritmo de Cálculo:**
```
Prazo Total = Data Limite - Data Atual
Dias Úteis = Prazo Total - Feriados - Fins de Semana
Status = 
  - VENCIDO: Se Dias Úteis < 0
  - URGENTE: Se Dias Úteis < 3
  - PRÓXIMO: Se Dias Úteis entre 3-10
  - NORMAL: Se Dias Úteis > 10
```

**Tipos de Prazos Suportados:**
- Prazos processuais (15 dias úteis padrão)
- Prazos para apresentação de documentos
- Prazos para pagamento
- Prazos para cumprimento de sentença
- Prazos customizados

**Alertas Automáticos:**
- Email quando prazo vence
- Push notification quando faltam 3 dias
- SMS para prazos críticos (opcional)

### Funcionalidade 3: Processamento de Documentos

**Tipos de Documentos Suportados:**
- PDF (até 50MB)
- Imagens (JPG, PNG, GIF até 10MB)
- Documentos Word (até 20MB)

**Processamento Automático:**
1. Upload do arquivo
2. Validação de formato e tamanho
3. Extração de texto (OCR se imagem)
4. Análise de conteúdo
5. Classificação automática
6. Armazenamento seguro

**Informações Extraídas:**
- Tipo de documento (petição, decisão, intimação, etc.)
- Data do documento
- Partes mencionadas
- Prazos mencionados
- Valores mencionados
- Palavras-chave importantes

### Funcionalidade 4: Dashboard Personalizado

**Widgets Disponíveis:**
- **KPI Cards:** Processos ativos, vencidos, urgentes, a receber
- **Timeline:** Próximos prazos em ordem cronológica
- **Calendário:** Visualização mensal de prazos
- **Gráficos:** Distribuição por tipo, status, tribunal
- **Alertas:** Notificações de eventos importantes
- **Atalhos:** Acesso rápido a ações frequentes

**Personalizações:**
- Reordenar widgets
- Filtrar por tipo de processo
- Filtrar por tribunal
- Filtrar por urgência
- Exportar dados

---

## 🔗 Integração com o App

### Arquitetura Técnica

O Secretário Jurídico é integrado ao app através de uma arquitetura orientada a eventos e serverless:

1. **Frontend (React):** Interface do usuário com componentes reutilizáveis e comunicação direta com Supabase.
2. **Backend (Supabase + Edge Functions):** Banco de dados, Autenticação e Lógica Serverless (Deno).
3. **Database (PostgreSQL):** Armazenamento de dados com schema otimizado (snake_case).
4. **Storage (Supabase Storage):** Armazenamento de documentos PDF e imagens.
5. **AI Processing:** Integração com Llama 3 via Groq API.

### Fluxo de Integração

```
┌─────────────────┐
│   React App     │
│  (Frontend)     │
└────────┬────────┘
         │
         ├─→ Supabase Client (ler/escrever dados)
         │
         ├─→ Real-time Subscriptions (atualizações)
         │
         └─→ Upload Documentos (Storage)
         │
┌────────▼────────┐
│   Supabase      │
│  (Backend/DB)   │
└────────┬────────┘
         │
         ├─→ Trigger (Ao inserir documento)
         │
         ▼
┌─────────────────┐
│  Edge Function  │
│ (Deno/Analyze)  │
└────────┬────────┘
         │
         ├─→ Baixa PDF
         │
         ├─→ Chama Llama 3 (Groq)
         │
         └─→ Salva Insight JSON
```

### Tabelas do Banco de Dados

**Tabela: processos**
```sql
- id (PK)
- user_id (FK)
- numero_processo (UNIQUE)
- tipo_acao
- tribunal
- vara
- data_distribuicao
- valor_causa
- status
- descricao
- created_at
- updated_at
```

**Tabela: prazos**
```sql
- id (PK)
- processo_id (FK)
- tipo_prazo
- data_limite
- dias_uteis
- status
- alerta_enviado
- created_at
- updated_at
```

**Tabela: documentos**
```sql
- id (PK)
- processo_id (FK)
- nome_arquivo
- tipo_documento
- url
- data_upload
- tamanho_bytes
- created_at
```

**Tabela: notification_preferences**
```sql
- id (PK)
- user_id (FK)
- email_enabled
- push_enabled
- sms_enabled
- dias_antecedencia
- horario_preferido
- created_at
- updated_at
```

---

## 💼 Casos de Uso

### Caso 1: Advogado Independente com 20 Processos

**Cenário:** Advogado especializado em direito cível com carteira de 20 processos em andamento

**Como o Agente Ajuda:**
1. **Organização:** Todos os 20 processos organizados em um único dashboard
2. **Alertas:** Recebe notificações diárias sobre prazos do dia
3. **Documentos:** Todos os documentos de cada processo organizados e acessíveis
4. **Relatórios:** Semanal recebe relatório de status de todos os processos
5. **Produtividade:** Economiza 3-4 horas por semana em tarefas administrativas

**Resultado:** Advogado se concentra em atividades de maior valor (análise jurídica, negociações) e não perde nenhum prazo

### Caso 2: Pequeno Escritório com 3 Advogados

**Cenário:** Escritório com 3 advogados, 1 secretária e 50 processos

**Como o Agente Ajuda:**
1. **Compartilhamento:** Secretária adiciona processos, advogados consultam
2. **Delegação:** Advogado 1 pode atribuir tarefas a Advogado 2
3. **Relatórios:** Sócio recebe relatório consolidado de todos os processos
4. **Conformidade:** Garante que nenhum prazo é perdido (risco legal reduzido)
5. **Eficiência:** Reduz necessidade de reuniões de sincronização

**Resultado:** Escritório aumenta produtividade em 20-30% e reduz riscos legais

### Caso 3: Secretária Jurídica em Escritório Grande

**Cenário:** Secretária responsável por organizar processos de 5 advogados (100+ processos)

**Como o Agente Ajuda:**
1. **Centralização:** Todos os processos em um único lugar
2. **Automação:** Prazos calculados automaticamente (sem erros manuais)
3. **Alertas:** Notificações automáticas evitam esquecimentos
4. **Relatórios:** Gera relatórios para apresentação aos advogados
5. **Eficiência:** Reduz tempo em tarefas administrativas repetitivas

**Resultado:** Secretária gerencia 100+ processos com confiança e sem estresse

---

## ⚠️ Limitações e Considerações

### Limitações Técnicas

1. **Processamento de Documentos:** OCR tem limitações com documentos de baixa qualidade ou manuscritos
2. **Cálculo de Prazos:** Baseado em calendário padrão; não considera prorrogações judiciais automáticas
3. **Integração com Tribunais:** Atualmente não integra com sistemas de tribunais (roadmap futuro)
4. **Análise Jurídica:** Não fornece parecer jurídico; apenas organiza informações

### Considerações Legais

1. **Responsabilidade:** O agente é ferramenta de suporte; advogado é responsável por prazos
2. **Confidencialidade:** Dados jurídicos são sensíveis; garantir conformidade com LGPD
3. **Segurança:** Criptografia de ponta a ponta e backups regulares.

---

## 🛠️ Stack Tecnológica e Desenvolvimento

Para desenvolvedores e administradores do sistema, aqui estão os detalhes técnicos:

### Frontend (Client)
- **Framework:** React + Vite
- **Estilização:** Tailwind CSS + Shadcn UI (Radix UI)
- **Comunicação:** tRPC Client com TanStack Query
- **Roteamento:** Wouter

### Backend (Server)
- **Runtime:** Deno (Edge Functions) / Node.js (Legado/Auth)
- **API:** Supabase Client (REST/Realtime)
- **Banco de Dados:** PostgreSQL (Supabase)
- **Autenticação:** Supabase Auth / Fluxo OAuth2
- **IA:** Llama 3 via Groq API

### Configuração de Ambiente (.env)

O projeto requer as seguintes variáveis configuradas:

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anônima do Supabase |
| `GROQ_API_KEY` | Chave da API para o modelo Llama 3 (Backend) |
| `DATABASE_URL` | String de conexão com o PostgreSQL |
| `VITE_OAUTH_PORTAL_URL` | URL do serviço de autenticação externa |
| `VITE_APP_ID` | ID da aplicação no sistema de autenticação |

### Comandos Úteis

- `npm run dev`: Inicia o ambiente de desenvolvimento.
- `npm run build`: Gera o build de produção (frontend e backend).
- `npm run db:push`: Sincroniza o schema do Drizzle com o banco de dados.
- `npm test`: Executa os testes unitários.

---

## 📄 Licença e Uso


