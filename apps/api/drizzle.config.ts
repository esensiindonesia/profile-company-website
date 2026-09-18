import { defineConfig } from "drizzle-kit";

// `drizzle-kit generate` reads the schema and emits SQL migration files into
// ./migrations. It needs no database connection — the generated SQL is then
// applied to the local or remote D1 database via `wrangler d1 migrations apply`.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./migrations",
});
