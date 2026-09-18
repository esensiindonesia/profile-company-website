import { hc } from "hono/client";
import type { AppType } from "@esensi-indonesia/api";

/**
 * Fully-typed RPC client for the Hono API. The `AppType` import is erased at
 * build time (type-only), so no API runtime code is bundled into the web app —
 * requests go over HTTP to the deployed Worker.
 */
export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export const client = hc<AppType>(apiBaseUrl);

/**
 * Client for admin routes. Better Auth uses an HttpOnly session cookie, so
 * every request must include credentials cross-origin.
 */
export const adminClient = hc<AppType>(apiBaseUrl, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, { ...init, credentials: "include" }),
});
