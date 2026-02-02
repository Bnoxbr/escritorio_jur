import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here
/**
 * Tabela de preferências de notificações do usuário
 */
export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  emailNotificationsEnabled: mysqlEnum("emailNotificationsEnabled", ["true", "false"]).default("true").notNull(),
  notifyVencidos: mysqlEnum("notifyVencidos", ["true", "false"]).default("true").notNull(),
  notifyUrgentes: mysqlEnum("notifyUrgentes", ["true", "false"]).default("true").notNull(),
  notifyProximos: mysqlEnum("notifyProximos", ["true", "false"]).default("true").notNull(),
  diasAntecedencia: int("diasAntecedencia").default(7).notNull(),
  horarioNotificacao: varchar("horarioNotificacao", { length: 5 }).default("09:00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;

/**
 * Tabela de histórico de notificações enviadas
 */
export const notificationHistory = mysqlTable("notification_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  processId: varchar("processId", { length: 64 }),
  numeroProcesso: varchar("numeroProcesso", { length: 64 }),
  tipo: mysqlEnum("tipo", ["vencido", "urgente", "proximo"]).notNull(),
  assunto: varchar("assunto", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["enviado", "falha", "pendente"]).default("pendente").notNull(),
  dataPrazo: timestamp("dataPrazo"),
  dataEnvio: timestamp("dataEnvio"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NotificationHistory = typeof notificationHistory.$inferSelect;
export type InsertNotificationHistory = typeof notificationHistory.$inferInsert;

/**
 * Tabela de processos jurídicos
 */
export const processos = mysqlTable("processos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  numeroProcesso: varchar("numeroProcesso", { length: 64 }).notNull(),
  titulo: text("titulo").notNull(),
  parteContraria: text("parteContraria").notNull(),
  juizo: text("juizo").notNull(),
  dataAbertura: timestamp("dataAbertura"),
  proximoPrazo: timestamp("proximoPrazo"),
  descricaoPrazo: text("descricaoPrazo"),
  status: mysqlEnum("status", ["ativo", "proximo_vencer", "urgente", "aguardando", "veredicto"]).default("ativo").notNull(),
  tipoProcesso: mysqlEnum("tipoProcesso", ["cível", "criminal", "trabalhista", "administrativo"]).default("cível").notNull(),
  valorCausa: varchar("valorCausa", { length: 64 }),
  anotacoes: text("anotacoes"),
  aiSummary: text("aiSummary"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Processo = typeof processos.$inferSelect;
export type InsertProcesso = typeof processos.$inferInsert;
