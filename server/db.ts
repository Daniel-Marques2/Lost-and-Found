import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertLostItem, InsertUser, lostItems, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
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
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listLostItems(filters: {
  search?: string;
  category?: string;
  building?: string;
  kind?: "lost" | "found";
  status?: "open" | "returned";
}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters.search) {
    const q = `%${filters.search}%`;
    conditions.push(or(like(lostItems.title, q), like(lostItems.description, q), like(lostItems.category, q)));
  }
  if (filters.category && filters.category !== "all") conditions.push(eq(lostItems.category, filters.category));
  if (filters.building && filters.building !== "all") conditions.push(eq(lostItems.building, filters.building));
  if (filters.kind && filters.kind !== undefined) conditions.push(eq(lostItems.kind, filters.kind));
  if (filters.status && filters.status !== undefined) conditions.push(eq(lostItems.status, filters.status));
  const rows = await db
    .select({ item: lostItems, authorName: users.name, authorEmail: users.email })
    .from(lostItems)
    .leftJoin(users, eq(lostItems.authorId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(lostItems.createdAt));
  return rows.map(row => ({ ...row.item, images: parseImages(row.item.images), authorName: row.authorName ?? "Comunidade da faculdade", authorEmail: row.authorEmail ?? "" }));
}

export async function getLostItemById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select({ item: lostItems, authorName: users.name, authorEmail: users.email })
    .from(lostItems)
    .leftJoin(users, eq(lostItems.authorId, users.id))
    .where(eq(lostItems.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return undefined;
  return { ...row.item, images: parseImages(row.item.images), authorName: row.authorName ?? "Comunidade da faculdade", authorEmail: row.authorEmail ?? "" };
}

export async function listItemsByAuthor(authorId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(lostItems).where(eq(lostItems.authorId, authorId)).orderBy(desc(lostItems.createdAt));
  return rows.map(row => ({ ...row, images: parseImages(row.images) }));
}

export async function createLostItem(item: InsertLostItem) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(lostItems).values(item);
  return Number(result[0].insertId);
}

export async function updateItemStatus(id: number, authorId: number, status: "open" | "returned") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(lostItems).set({ status }).where(and(eq(lostItems.id, id), eq(lostItems.authorId, authorId)));
}

export async function updateUserProfile(id: number, name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(users).set({ name }).where(eq(users.id, id));
}

export function parseImages(value: string | null) {
  if (!value) return [] as string[];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === "string") : [];
  } catch {
    return [] as string[];
  }
}
