import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Certificate metadata for the CMS. The image itself lives in R2 (BUCKET);
 * `fileUrl` stores the public API path (`/api/files/certificates/<id>.<ext>`).
 */
export const certificates = sqliteTable("certificates", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  updatedAt: text("updated_at").notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});

export const blogs = sqliteTable("blogs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  linkUrl: text("link_url").notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const youtubeLinks = sqliteTable("youtube_links", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const careerQrCodes = sqliteTable("career_qr_codes", {
  id: text("id").primaryKey(),
  area: text("area").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});


export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

export type YoutubeLink = typeof youtubeLinks.$inferSelect;
export type NewYoutubeLink = typeof youtubeLinks.$inferInsert;

export type CareerQrCode = typeof careerQrCodes.$inferSelect;
export type NewCareerQrCode = typeof careerQrCodes.$inferInsert;

export * from "./auth-schema";
