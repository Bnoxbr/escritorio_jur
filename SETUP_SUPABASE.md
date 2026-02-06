# Guia de Setup - Secretário Jurídico no Supabase

**Última Atualização:** 2026-02-06

## Visão Geral

Este documento fornece instruções detalhadas para configurar o banco de dados PostgreSQL do **Secretário Jurídico** no Supabase. O Supabase oferece uma alternativa gerenciada ao MySQL/MariaDB, com recursos adicionais como autenticação integrada, realtime subscriptions e storage de arquivos.

## Pré-requisitos

Antes de começar, você precisará de:

- Uma conta no [Supabase](https://supabase.com) (gratuita ou paga)
- Acesso ao arquivo `SCHEMA_SUPABASE.sql` (incluído neste projeto)
- Conhecimento básico de SQL (opcional)

## Passo 1: Criar um Projeto no Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com) e faça login com sua conta
2. Clique em **"New Project"** (Novo Projeto)
3. Preencha os seguintes campos:
   - **Name**: `secretario-juridico` (ou o nome que preferir)
   - **Database Password**: Crie uma senha forte (você precisará dela depois)
   - **Region**: Selecione a região mais próxima de você
   - **Pricing Plan**: Escolha entre Free ou Pro conforme sua necessidade

4. Clique em **"Create new project"** e aguarde a criação (pode levar alguns minutos)

## Passo 2: Acessar o SQL Editor

1. Após o projeto ser criado, você será redirecionado para o dashboard
2. No menu lateral esquerdo, clique em **"SQL Editor"**
3. Você verá uma interface com um editor de SQL vazio

## Passo 3: Executar o Schema

1. Abra o arquivo `SCHEMA_SUPABASE.sql` em um editor de texto
2. Copie **todo o conteúdo** do arquivo
3. Cole o conteúdo no SQL Editor do Supabase
4. Clique no botão **"Run"** (ou pressione `Ctrl+Enter`)
5. Aguarde a execução - você verá mensagens de sucesso para cada tabela criada

## Passo 4: Verificar as Tabelas Criadas

1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver as seguintes tabelas listadas:
   - `users` - Usuários autenticados
   - `notification_preferences` - Preferências de notificação
   - `notification_history` - Histórico de notificações
   - `processos` - Processos jurídicos (opcional)
   - `documentos` - Documentos dos processos (opcional)

## Passo 5: Configurar Variáveis de Ambiente

Após o setup no Supabase, você precisará atualizar as variáveis de ambiente do seu projeto:

### Obter as Credenciais do Supabase

1. No dashboard do Supabase, clique em **"Settings"** (ícone de engrenagem)
2. Vá para **"Database"**
3. Você verá as seguintes informações:
   - **Host**: `[seu-projeto].supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: A senha que você criou no Passo 1

### Construir a Connection String

Crie uma URL de conexão no seguinte formato:

```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

Substitua `[PASSWORD]` e `[HOST]` pelos valores reais.

### Atualizar o Arquivo `.env`

No seu projeto local, atualize o arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

## Passo 6: Configurar Autenticação (Opcional)

Se deseja usar a autenticação do Supabase:

1. No dashboard, clique em **"Authentication"**
2. Vá para **"Providers"**
3. Habilite os provedores que deseja (Google, GitHub, etc.)
4. Configure as credenciais OAuth conforme necessário

## Passo 7: Configurar Storage (Opcional)

Para armazenar documentos e arquivos:

1. No dashboard, clique em **"Storage"**
2. Clique em **"Create a new bucket"**
3. Nomeie o bucket como `processos-documentos`
4. Configure as políticas de acesso conforme necessário

## Estrutura das Tabelas

### Tabela: `users`

Armazena informações dos usuários autenticados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL | Identificador único (chave primária) |
| `open_id` | VARCHAR(64) | ID único do provedor OAuth |
| `name` | TEXT | Nome do usuário |
| `email` | VARCHAR(320) | E-mail do usuário |
| `login_method` | VARCHAR(64) | Método de login (oauth, etc.) |
| `role` | VARCHAR(20) | Papel do usuário (user, admin) |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de última atualização |
| `last_signed_in` | TIMESTAMP | Data do último acesso |

### Tabela: `notification_preferences`

Armazena as preferências de notificação de cada usuário.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL | Identificador único |
| `user_id` | INTEGER | ID do usuário (chave estrangeira) |
| `email_enabled` | VARCHAR(5) | Notificações ativadas? (true/false) |
| `notify_vencidos` | VARCHAR(5) | Notificar sobre prazos vencidos? |
| `notify_urgentes` | VARCHAR(5) | Notificar sobre prazos urgentes? |
| `notify_proximos` | VARCHAR(5) | Notificar sobre prazos próximos? |
| `dias_antecedencia` | INTEGER | Dias de antecedência para alertas (1-30) |
| `horario_notificacao` | VARCHAR(5) | Horário preferido (HH:MM) |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de última atualização |

### Tabela: `notification_history`

Registra todas as notificações enviadas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL | Identificador único |
| `user_id` | INTEGER | ID do usuário |
| `processo_id` | VARCHAR(64) | ID do processo |
| `numero_processo` | VARCHAR(64) | Número do processo jurídico |
| `tipo` | VARCHAR(20) | Tipo de alerta (vencido, urgente, proximo) |
| `assunto` | VARCHAR(255) | Assunto do e-mail |
| `status` | VARCHAR(20) | Status (enviado, falha, pendente) |
| `data_prazo` | TIMESTAMP | Data do prazo |
| `data_envio` | TIMESTAMP | Data de envio do e-mail |
| `created_at` | TIMESTAMP | Data de criação |

### Tabela: `processos`

Armazena informações dos processos jurídicos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL | Identificador único |
| `user_id` | INTEGER | ID do usuário proprietário |
| `numero_processo` | VARCHAR(64) | Número do processo |
| `titulo` | TEXT | Título/descrição do processo |
| `parte_contraria` | VARCHAR(255) | Nome da parte contrária |
| `juizo` | VARCHAR(255) | Juízo responsável |
| `data_abertura` | DATE | Data de abertura |
| `proximo_prazo` | DATE | Data do próximo prazo |
| `descricao_prazo` | TEXT | Descrição do prazo |
| `status` | VARCHAR(50) | Status do processo |
| `tipo_processo` | VARCHAR(50) | Tipo (cível, criminal, etc.) |
| `valor_causa` | VARCHAR(50) | Valor da causa |
| `anotacoes` | TEXT | Anotações adicionais |
| `insight_json` | JSONB | Resultado da análise de IA |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de última atualização |

### Tabela: `documentos`

Armazena referências aos documentos anexados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL | Identificador único |
| `user_id` | INTEGER | ID do usuário proprietário |
| `processo_id` | INTEGER | ID do processo relacionado |
| `numero_processo` | VARCHAR(64) | Número do processo |
| `nome_arquivo` | VARCHAR(255) | Nome do arquivo |
| `url` | TEXT | URL do arquivo (Supabase Storage) |
| `file_key` | VARCHAR(255) | Chave do arquivo no storage |
| `mime_type` | VARCHAR(100) | Tipo MIME (application/pdf, etc.) |
| `tamanho` | INTEGER | Tamanho em bytes |
| `tipo` | VARCHAR(50) | Tipo de documento (pdf, imagem, etc.) |
| `descricao` | TEXT | Descrição do documento |
| `created_at` | TIMESTAMP | Data de criação |

## Queries Úteis

### Listar todos os usuários

```sql
SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC;
```

### Listar notificações pendentes

```sql
SELECT * FROM vw_notificacoes_pendentes;
```

### Listar processos próximos a vencer

```sql
SELECT * FROM vw_processos_proximos_vencer;
```

### Contar notificações por tipo

```sql
SELECT tipo, COUNT(*) as total FROM notification_history GROUP BY tipo;
```

### Listar documentos de um processo

```sql
SELECT * FROM documentos WHERE numero_processo = '0000001-00.2026.0.00.0000' ORDER BY created_at DESC;
```

## Troubleshooting

### Erro: "Permission denied"

Se receber um erro de permissão ao executar o schema, verifique se:
- Você está usando a conta correta no Supabase
- O projeto foi criado com sucesso
- Você tem permissão de administrador no projeto

### Erro: "Table already exists"

Se as tabelas já existem, você pode:
- Deletar o projeto e criar um novo
- Ou modificar o schema para usar `CREATE TABLE IF NOT EXISTS` (já incluído)

### Conexão recusada

Se não conseguir conectar ao banco de dados:
- Verifique a URL de conexão (DATABASE_URL)
- Confirme que o projeto está ativo no Supabase
- Verifique se o firewall permite conexões ao Supabase

## Próximos Passos

1. **Testar a Conexão**: Execute uma query simples para confirmar que tudo está funcionando
2. **Configurar Backups**: No Supabase, configure backups automáticos (Settings > Backups)
3. **Monitorar Performance**: Use o dashboard do Supabase para monitorar queries e performance
4. **Implementar RLS**: Descomente as políticas de segurança no schema se desejar usar Row Level Security

## Suporte e Documentação

- [Documentação do Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Community](https://github.com/supabase/supabase/discussions)

## Versão e Histórico

- **Versão**: 1.0
- **Data**: 2026-01-27
- **Compatível com**: Supabase PostgreSQL 14+
- **Autor**: Manus AI
