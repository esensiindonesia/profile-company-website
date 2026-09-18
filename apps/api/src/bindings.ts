import type {
  D1Database,
  R2Bucket,
} from "@cloudflare/workers-types";

/**
 * The Worker's runtime bindings (mirrors wrangler.jsonc). These are referenced
 * via module imports — not the ambient `Env` global — so that `AppType` stays
 * resolvable when the web app imports it for the typed RPC client (the web
 * tsconfig has no access to Cloudflare's global types).
 *
 * BETTER_AUTH_SECRET is set via `wrangler secret put BETTER_AUTH_SECRET` (or
 * `.dev.vars` locally). BETTER_AUTH_URL is the API origin used by Better Auth.
 * CORS_ORIGIN is a comma-separated list of allowed web origins.
 */
export type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  AUTH_SETUP_TOKEN?: string;
  CORS_ORIGIN?: string;
};
