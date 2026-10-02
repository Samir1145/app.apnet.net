// admin-panel/src/lib/db/schema.ts
import { pgTable, serial, text, varchar, timestamp, boolean, integer, numeric, jsonb } from "drizzle-orm/pg-core";

// 1. Users Directory Table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).default("ADVOCATE").notNull(), // SUPER_ADMIN, ADMIN, ADVOCATE, CLIENT
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(), // ACTIVE, SUSPENDED, DEACTIVATED
  plan: varchar("plan", { length: 50 }).default("STARTER").notNull(), // STARTER, PROFESSIONAL, ENTERPRISE
  org: varchar("org", { length: 255 }),
  avatarUrl: text("avatar_url"),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at"),
  deletedBy: text("deleted_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. System & API Logs Table
export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  method: varchar("method", { length: 10 }).notNull(), // GET, POST, PUT, DELETE
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  statusCode: integer("status_code").notNull(), // 200, 400, 401, 500
  responseTimeMs: integer("response_time_ms").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Central Invoices & Billing Table
export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(), // INV-2026-XXXX
  userId: text("user_id").notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  amountInr: numeric("amount_inr", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("PAID").notNull(), // PAID, PENDING, OVERDUE, REFUNDED
  planTier: varchar("plan_tier", { length: 50 }).notNull(),
  pdfUrl: text("pdf_url"),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
});

// 4. Download Telemetry Table
export const downloadTelemetry = pgTable("download_telemetry", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(), // MACOS_ARM64, MACOS_X64, WINDOWS_X64, LINUX_X64
  appVersion: varchar("app_version", { length: 50 }).notNull(), // 1.2.0, 1.2.1
  countryCode: varchar("country_code", { length: 10 }).default("IN").notNull(),
  city: varchar("city", { length: 100 }),
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

// 5. Support Tickets Table
export const supportTickets = pgTable("support_tickets", {
  id: text("id").primaryKey(), // TCK-XXXX
  userId: text("user_id").notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priority: varchar("priority", { length: 50 }).default("MEDIUM").notNull(), // LOW, MEDIUM, HIGH, URGENT
  status: varchar("status", { length: 50 }).default("OPEN").notNull(), // OPEN, IN_PROGRESS, RESOLVED, CLOSED
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Immutable Super Admin Audit Logs
export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: serial("id").primaryKey(),
  adminId: text("admin_id").notNull(),
  adminEmail: varchar("admin_email", { length: 255 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // USER_SUSPENDED, USER_SOFT_DELETED, PASSWORD_RESET_GENERATED, STATUS_CHANGED
  targetUserId: text("target_user_id"),
  previousState: jsonb("previous_state"),
  newState: jsonb("new_state"),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. Software Licenses Table
export const licenses = pgTable("licenses", {
  id: text("id").primaryKey(), // lic_pro_xxxx
  userId: text("user_id").notNull(),
  licenseKey: varchar("license_key", { length: 64 }).notNull().unique(),
  planTier: varchar("plan_tier", { length: 50 }).default("PROFESSIONAL").notNull(), // STARTER, PROFESSIONAL, ENTERPRISE
  maxDevices: integer("max_devices").default(3).notNull(),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(), // ACTIVE, SUSPENDED, EXPIRED
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Hardware Device Activations Table
export const activations = pgTable("activations", {
  id: text("id").primaryKey(), // act_xxxx
  licenseId: text("license_id").notNull(),
  userId: text("user_id").notNull(),
  hardwareFingerprint: varchar("hardware_fingerprint", { length: 64 }).notNull(),
  deviceName: varchar("device_name", { length: 100 }).notNull(),
  osInfo: varchar("os_info", { length: 100 }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  lastPingAt: timestamp("last_ping_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  activatedAt: timestamp("activated_at").defaultNow().notNull(),
  deactivatedAt: timestamp("deactivated_at"),
});

// 9. Programmatic API Keys & MCP Cloud Tokens
export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(), // key_mcp_xxxx
  userId: text("user_id").notNull(),
  activationId: text("activation_id"),
  name: varchar("name", { length: 100 }).notNull(),
  keyPrefix: varchar("key_prefix", { length: 25 }).notNull(), // mcp_live_9f2a...
  keyHash: text("key_hash").notNull(),
  scopes: jsonb("scopes").notNull(), // ['mcp:agent:read', 'mcp:agent:exec']
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SystemLog = typeof systemLogs.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type DownloadRecord = typeof downloadTelemetry.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
export type License = typeof licenses.$inferSelect;
export type Activation = typeof activations.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;

