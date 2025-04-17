import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication (if needed)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Figma Designs table to store information about imported designs
export const figmaDesigns = pgTable("figma_designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name"),
  accessToken: text("access_token"),
  dateImported: text("date_imported").notNull(),
});

// Components table to store detected Figma components and their Angular Material mappings
export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  designId: integer("design_id").references(() => figmaDesigns.id),
  figmaId: text("figma_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  angularComponent: text("angular_component"),
  supportStatus: text("support_status").notNull(),
  properties: jsonb("properties"),
  styles: jsonb("styles"),
  generatedHtml: text("generated_html"),
  generatedTs: text("generated_ts"),
  generatedScss: text("generated_scss"),
});

// Schemas for inserting data
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFigmaDesignSchema = createInsertSchema(figmaDesigns).pick({
  userId: true,
  fileKey: true,
  fileName: true,
  accessToken: true,
  dateImported: true,
});

export const insertComponentSchema = createInsertSchema(components).pick({
  designId: true,
  figmaId: true,
  name: true,
  type: true,
  angularComponent: true,
  supportStatus: true,
  properties: true,
  styles: true,
  generatedHtml: true,
  generatedTs: true,
  generatedScss: true,
});

// Types based on the schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFigmaDesign = z.infer<typeof insertFigmaDesignSchema>;
export type FigmaDesign = typeof figmaDesigns.$inferSelect;

export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type Component = typeof components.$inferSelect;

// Figma design response types
export const figmaFileResponseSchema = z.object({
  fileKey: z.string(),
  fileName: z.string().optional(),
  components: z.array(z.object({
    figmaId: z.string(),
    name: z.string(),
    type: z.string(),
    angularComponent: z.string().optional(),
    supportStatus: z.enum(['supported', 'partial', 'unsupported']),
    properties: z.record(z.any()).optional(),
    styles: z.record(z.any()).optional(),
  })),
  stats: z.object({
    totalComponents: z.number(),
    frames: z.number(),
    supported: z.number(),
    partial: z.number(),
    unsupported: z.number(),
  }),
});

export type FigmaFileResponse = z.infer<typeof figmaFileResponseSchema>;
