import { drizzle } from "drizzle-orm/d1/driver";
import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "./schema";

/**
 * Build a Drizzle client bound to the request's D1 database. In local dev this
 * points at a local SQLite file (under .wrangler/state); in production it's the
 * real Cloudflare D1 instance — the code is identical either way.
 */
export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Db = ReturnType<typeof createDb>;
export { schema };
