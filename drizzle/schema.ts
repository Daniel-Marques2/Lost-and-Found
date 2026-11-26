import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const lostItems = mysqlTable("lost_items", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 48 }).notNull(),
  kind: mysqlEnum("kind", ["lost", "found"]).notNull(),
  building: varchar("building", { length: 64 }).notNull(),
  floor: varchar("floor", { length: 32 }).notNull(),
  room: varchar("room", { length: 32 }).notNull(),
  occurredAt: timestamp("occurredAt").notNull(),
  status: mysqlEnum("status", ["open", "returned"]).default("open").notNull(),
  images: text("images"),
  contactNote: varchar("contactNote", { length: 240 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LostItem = typeof lostItems.$inferSelect;
export type InsertLostItem = typeof lostItems.$inferInsert;
