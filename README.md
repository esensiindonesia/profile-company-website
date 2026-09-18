# Esensi Indonesia

A [Turborepo](https://turbo.build/repo) monorepo: **Next.js** frontend + **Hono** API on **Cloudflare Workers**, wired together with a fully-typed [Hono RPC](https://hono.dev/docs/guides/rpc) client.

## Structure

```
esensi-indonesia/
├── apps/
│   ├── web/    # Next.js 15 (App Router) + React 19 + Tailwind CSS v4
│   └── api/    # Hono on Cloudflare Workers + D1 (Drizzle) + R2
└── packages/
    └── typescript-config/   # Shared tsconfig bases (base / nextjs / workers)
```

The web app calls the Hono Worker API for CMS content. The API stores CMS
metadata in **D1** (SQLite via Drizzle ORM) and uploaded images in **R2** object
storage. Existing public assets remain in `apps/web/public`; new CMS uploads are
served through the API's R2 file routes.

## Data: D1 + R2 in local dev

`wrangler dev` simulates both bindings **locally and offline** — no Cloudflare
account, network, or cost is involved for local development:

- **D1** is a real local SQLite file; **R2** is a local file-backed bucket.
- State lives under `apps/api/.wrangler/state/` (gitignored) and persists
  across restarts. Each developer gets isolated local data.
- Schema is managed by SQL **migrations** in `apps/api/migrations/`, generated
  from the Drizzle schema (`apps/api/src/db/schema.ts`). Migration files **are**
  committed — they're the source of truth.

Cloudflare credentials are only needed to create the cloud resources and to
deploy — never for local dev.

## Prerequisites

- Node.js >= 20
- [pnpm](https://pnpm.io) 11 (`corepack enable` or `npm i -g pnpm`)

## Getting started

```bash
pnpm install
pnpm dev
```

- Web → http://localhost:3000
- API → http://localhost:8787

`pnpm dev` runs both apps in parallel via Turborepo.

## Scripts (run from the repo root)

| Command             | Description                                         |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | Run web + API in dev (Turborepo)                    |
| `pnpm build`        | Build web (`next build`) + API (worker dry-run)     |
| `pnpm check-types`  | Type-check every workspace                          |
| `pnpm format`       | Prettier across the repo                            |
| `pnpm clean`        | Remove build artifacts + `node_modules`             |

### API-only (run inside `apps/api` or with `pnpm --filter @esensi-indonesia/api`)

```bash
pnpm dev                 # wrangler dev (local D1 + R2)
pnpm cf-typegen          # regenerate worker-configuration.d.ts after binding changes
pnpm db:generate         # generate a SQL migration from the Drizzle schema
pnpm db:migrate:local    # apply migrations to the local D1 database
pnpm db:migrate:remote   # apply migrations to the production D1 database
pnpm db:studio           # open Drizzle Studio
pnpm deploy              # deploy the Worker to Cloudflare
```

### Changing the database schema

1. Edit `apps/api/src/db/schema.ts`.
2. `pnpm --filter @esensi-indonesia/api db:generate` → writes a new file to `migrations/`.
3. `pnpm --filter @esensi-indonesia/api db:migrate:local` → apply it locally.
4. Commit the generated migration. It ships to production on deploy (or run
   `db:migrate:remote`).

## Deploying the API

One-time cloud setup (needs `wrangler login`):

1. `pnpm --filter @esensi-indonesia/api exec wrangler login`
2. The API is configured to use the D1 database `esensi-indonesia-new` and the
   R2 bucket `esensi-indonesia` in `apps/api/wrangler.jsonc`.
3. If provisioning from scratch, create the D1 database and R2 bucket first,
   then update their IDs/names in `apps/api/wrangler.jsonc`.
4. `pnpm --filter @esensi-indonesia/api db:migrate:remote` (create the tables in cloud D1).

Then deploy — either manually with `pnpm --filter @esensi-indonesia/api deploy`, or
automatically via the **Deploy API** GitHub Actions workflow
(`.github/workflows/deploy-api.yml`), which type-checks, applies remote
migrations, and deploys on every push to `main` that touches the API. It needs
two repo secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

Finally, point the web app at the deployed Worker by setting `NEXT_PUBLIC_API_URL`
(see `apps/web/.env.example`).
