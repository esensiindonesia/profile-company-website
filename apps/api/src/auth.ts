import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import type { Bindings } from "./bindings";
import { createDb, schema } from "./db";

function getOrigins(value: string | undefined, fallback: string) {
  return [fallback, ...(value ?? "").split(",")]
    .map((origin) => origin.trim())
    .filter(Boolean)
    .filter((origin, index, origins) => origins.indexOf(origin) === index);
}

export function createAuth(
  env: Bindings,
  requestUrl: string,
  options: { allowSignUp?: boolean } = {},
) {
  if (!env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is not configured");
  }

  const requestOrigin = new URL(requestUrl).origin;
  const baseURL = env.BETTER_AUTH_URL?.trim() || requestOrigin;
  const usesSecureCookies = baseURL.startsWith("https://");

  return betterAuth({
    database: drizzleAdapter(createDb(env.DB), {
      provider: "sqlite",
      schema,
    }),
    baseURL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: getOrigins(env.CORS_ORIGIN, requestOrigin),

    advanced: {
      useSecureCookies: usesSecureCookies,
      defaultCookieAttributes: {
        secure: usesSecureCookies,
        sameSite: usesSecureCookies ? "none" : "lax",
        ...(usesSecureCookies ? { partitioned: true } : {}),
      },
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: !options.allowSignUp,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  });
}
