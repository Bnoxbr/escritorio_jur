-- ============================================================================
-- SECRETÁRIO JURÍDICO - SCHEMA COMPLETO PARA SUPABASE
-- ============================================================================
-- Este arquivo contém todo o esquema de banco de dados necessário para
-- executar a aplicação Secretário Jurídico no Supabase.
--
-- Instruções de uso:
-- 1. Acesse https://app.supabase.com
-- 2. Crie um novo projeto ou abra um existente
-- 3. Vá para SQL Editor
-- 4. Cole o conteúdo deste arquivo
-- 5. Execute o script
-- ============================================================================

-- ============================================================================
-- TABELA: users (Usuários)
-- ============================================================================
-- Armazena informações dos usuários autenticados via OAuth
-- Relacionada com todas as outras tabelas através do campo userId
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_users_openid ON users("openId");
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- TABELA: notification_preferences (Preferências de Notificações)
-- ============================================================================
-- Armazena as preferências de notificação de cada usuário
-- Permite configurar quais tipos de alerta deseja receber e em qual horário
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL UNIQUE,
  "emailNotificationsEnabled" VARCHAR(5) NOT NULL DEFAULT 'true' CHECK ("emailNotificationsEnabled" IN ('true', 'false')),
  "notifyVencidos" VARCHAR(5) NOT NULL DEFAULT 'true' CHECK ("notifyVencidos" IN ('true', 'false')),
  "notifyUrgentes" VARCHAR(5) NOT NULL DEFAULT 'true' CHECK ("notifyUrgentes" IN ('true', 'false')),
  "notifyProximos" VARCHAR(5) NOT NULL DEFAULT 'true' CHECK ("notifyProximos" IN ('true', 'false')),
  "diasAntecedencia" INTEGER NOT NULL DEFAULT 7 CHECK ("diasAntecedencia" >= 1 AND "diasAntecedencia" <= 30),
  "horarioNotificacao" VARCHAR(5) NOT NULL DEFAULT '09:00',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_notif_prefs_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_notif_prefs_userid ON notification_preferences("userId");

-- ============================================================================
-- TABELA: notification_history (Histórico de Notificações)
-- ============================================================================
-- Registra todas as notificações enviadas para auditoria e análise
-- Permite rastrear quais alertas foram enviados, falharam ou estão pendentes
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_history (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "processId" VARCHAR(64),
  "numeroProcesso" VARCHAR(64),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('vencido', 'urgente', 'proximo')),
  assunto VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('enviado', 'falha', 'pendente')),
  "dataPrazo" TIMESTAMP,
  "dataEnvio" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_notif_hist_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_notif_hist_userid ON notification_history("userId");
CREATE INDEX idx_notif_hist_status ON notification_history(status);
CREATE INDEX idx_notif_hist_tipo ON notification_history(tipo);
CREATE INDEX idx_notif_hist_dataprazo ON notification_history("dataPrazo");

-- ============================================================================
-- TABELA: processos (Processos Jurídicos) - OPCIONAL
-- ============================================================================
-- Armazena informações dos processos jurídicos
-- Esta tabela é opcional e pode ser adicionada conforme necessário
-- ============================================================================

CREATE TABLE IF NOT EXISTS processos (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "numeroProcesso" VARCHAR(64) NOT NULL,
  titulo TEXT NOT NULL,
  "parteContraria" VARCHAR(255),
  juizo VARCHAR(255),
  "dataAbertura" DATE,
  "proximoPrazo" DATE,
  "descricaoPrazo" TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'proximo_vencer', 'urgente', 'aguardando', 'veredicto', 'concluido')),
  "tipoProcesso" VARCHAR(50) CHECK ("tipoProcesso" IN ('civel', 'criminal', 'trabalhista', 'administrativo')),
  "valorCausa" VARCHAR(50),
  anotacoes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_processos_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_processos_userid ON processos("userId");
CREATE INDEX idx_processos_status ON processos(status);
CREATE INDEX idx_processos_proximoprazo ON processos("proximoPrazo");
CREATE INDEX idx_processos_numero ON processos("numeroProcesso");

-- ============================================================================
-- TABELA: documentos (Documentos dos Processos) - OPCIONAL
-- ============================================================================
-- Armazena referências aos documentos anexados aos processos
-- Mantém metadados do arquivo (URL, tipo, tamanho, data de upload)
-- ============================================================================

CREATE TABLE IF NOT EXISTS documentos (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "processoId" INTEGER,
  "numeroProcesso" VARCHAR(64),
  nome VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  "fileKey" VARCHAR(255),
  "mimeType" VARCHAR(100),
  tamanho INTEGER,
  tipo VARCHAR(50) CHECK (tipo IN ('pdf', 'imagem', 'documento', 'outro')),
  descricao TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_documentos_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_documentos_processo FOREIGN KEY ("processoId") REFERENCES processos(id) ON DELETE SET NULL
);

-- Índices para melhor performance
CREATE INDEX idx_documentos_userid ON documentos("userId");
CREATE INDEX idx_documentos_processoid ON documentos("processoId");
CREATE INDEX idx_documentos_tipo ON documentos(tipo);

-- ============================================================================
-- VIEWS ÚTEIS
-- ============================================================================

-- View: Resumo de Notificações Pendentes
CREATE OR REPLACE VIEW vw_notificacoes_pendentes AS
SELECT 
  nh.id,
  nh."userId",
  u.email,
  nh."numeroProcesso",
  nh.assunto,
  nh.tipo,
  nh."dataPrazo",
  np."horarioNotificacao"
FROM notification_history nh
JOIN users u ON nh."userId" = u.id
JOIN notification_preferences np ON u.id = np."userId"
WHERE nh.status = 'pendente'
  AND np."emailNotificationsEnabled" = 'true'
ORDER BY nh."dataPrazo" ASC;

-- View: Processos Próximos a Vencer
CREATE OR REPLACE VIEW vw_processos_proximos_vencer AS
SELECT 
  p.id,
  p."userId",
  p."numeroProcesso",
  p.titulo,
  p."proximoPrazo",
  p.status,
  EXTRACT(DAY FROM p."proximoPrazo" - NOW()) as dias_restantes
FROM processos p
WHERE p."proximoPrazo" IS NOT NULL
  AND p."proximoPrazo" > NOW()
  AND p.status IN ('ativo', 'proximo_vencer', 'urgente')
ORDER BY p."proximoPrazo" ASC;

-- ============================================================================
-- POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
-- ============================================================================
-- Descomente as linhas abaixo se desejar usar RLS no Supabase

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE processos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só podem ver suas próprias preferências
-- CREATE POLICY "Users can view own notification preferences"
--   ON notification_preferences FOR SELECT
--   USING (auth.uid()::text = "userId"::text);

-- Política: Usuários só podem atualizar suas próprias preferências
-- CREATE POLICY "Users can update own notification preferences"
--   ON notification_preferences FOR UPDATE
--   USING (auth.uid()::text = "userId"::text);

-- ============================================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON TABLE users IS 'Tabela de usuários autenticados via OAuth. Cada usuário tem um identificador único (openId) fornecido pelo provedor OAuth.';

COMMENT ON TABLE notification_preferences IS 'Preferências de notificação por e-mail de cada usuário. Permite configurar quais tipos de alerta deseja receber (vencidos, urgentes, próximos) e em qual horário.';

COMMENT ON TABLE notification_history IS 'Histórico de todas as notificações enviadas. Útil para auditoria, análise de entregas e debugging de problemas de notificação.';

COMMENT ON TABLE processos IS 'Processos jurídicos ativos. Armazena informações sobre casos, prazos, partes envolvidas e status.';

COMMENT ON TABLE documentos IS 'Documentos anexados aos processos. Mantém referências aos arquivos armazenados em S3 ou similar.';

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================
-- Data de criação: 2026-01-27
-- Versão: 1.0
-- Compatível com: Supabase PostgreSQL 14+
-- ============================================================================
