import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, notificationPreferences, notificationHistory, InsertNotificationPreference, InsertNotificationHistory, processos, InsertProcesso } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Notification preferences queries
export async function getNotificationPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function upsertNotificationPreferences(
  userId: number,
  prefs: Partial<InsertNotificationPreference>
) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await getNotificationPreferences(userId);
  
  if (existing) {
    await db
      .update(notificationPreferences)
      .set(prefs)
      .where(eq(notificationPreferences.userId, userId));
  } else {
    await db.insert(notificationPreferences).values({
      userId,
      ...prefs,
    } as InsertNotificationPreference);
  }
  
  return getNotificationPreferences(userId);
}

// Notification history queries
export async function addNotificationHistory(data: InsertNotificationHistory) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(notificationHistory).values(data);
  return result;
}

export async function getNotificationHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(notificationHistory)
    .where(eq(notificationHistory.userId, userId))
    .limit(limit);
  
  return result;
}

// Processos queries
export async function getProcessos(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(processos)
    .where(eq(processos.userId, userId))
    .orderBy(desc(processos.createdAt));
}

export async function getProcessoById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(processos)
    .where(and(eq(processos.id, id), eq(processos.userId, userId)))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function createProcesso(data: InsertProcesso) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(processos).values(data);
  const insertId = (result[0] as any).insertId;
  return getProcessoById(insertId, data.userId);
}

export async function updateProcesso(id: number, userId: number, data: Partial<InsertProcesso>) {
  const db = await getDb();
  if (!db) return null;
  
  await db
    .update(processos)
    .set(data)
    .where(and(eq(processos.id, id), eq(processos.userId, userId)));
  
  return getProcessoById(id, userId);
}

export async function deleteProcesso(id: number, userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db
    .delete(processos)
    .where(and(eq(processos.id, id), eq(processos.userId, userId)));
  
  return true;
}
