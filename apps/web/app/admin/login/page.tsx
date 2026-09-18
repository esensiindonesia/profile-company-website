"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) router.replace("/admin/certificates");
  }, [router, session]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await authClient.signIn.email({
      email: email.trim(),
      password,
      callbackURL: "/admin/certificates",
    });

    if (result.error) {
      setError(result.error.message ?? "Email atau password salah.");
      setSubmitting(false);
      return;
    }

    router.replace("/admin/certificates");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-7">
          <h1 className="mt-2 font-display text-3xl font-bold text-navy">
            Admin login
          </h1>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              placeholder="admin@example.com"
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              placeholder="Masukkan password"
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
            />
          </label>

          {error ? (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={submitting || sessionPending}
            className="mt-1 h-11 rounded-lg bg-golden px-4 text-sm font-semibold text-navy hover:bg-gold"
          >
            {submitting ? "Memproses…" : "Masuk"}
          </Button>
        </form>
      </section>
    </main>
  );
}
