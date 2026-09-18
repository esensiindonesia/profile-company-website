import { About } from "@/components/about";
import { CoreValues } from "@/components/core-values";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Statistics } from "@/components/statistics";
import { WhyChooseUs } from "@/components/why-choose-us";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CoreValues />
      <WhyChooseUs />
      <Statistics />
      <Faq />
    </>
  );
}

/*

import { client } from "@/lib/api";

// Fetch fresh from the API on every request instead of prerendering at build
// time (the API isn't running during `next build`).
export const dynamic = "force-dynamic";

type Health = { status: string; timestamp: string };

async function getHealth(): Promise<Health | null> {
  try {
    const res = await client.api.health.$get();
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function DemoHome() {
  const health = await getHealth();
  const online = health?.status === "ok";

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Esensi Indonesia</h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Next.js + Hono + Turborepo monorepo, wired with a typed Hono RPC
          client.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              online ? "bg-green-500" : "bg-red-500"
            }`}
            aria-hidden
          />
          <span className="font-medium">
            API {online ? "online" : "unreachable"}
          </span>
        </div>
        {health ? (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-neutral-100 p-3 text-sm dark:bg-neutral-900">
            {JSON.stringify(health, null, 2)}
          </pre>
        ) : (
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Start the API with{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-900">
              pnpm dev
            </code>{" "}
            and refresh.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="font-medium">Web</div>
          <div className="text-neutral-500">localhost:3000</div>
        </div>
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="font-medium">API</div>
          <div className="text-neutral-500">localhost:8787</div>
        </div>
      </div>
    </main>
  );
}
*/
