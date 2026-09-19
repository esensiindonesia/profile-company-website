"use client";

import { KeyRound, X } from "lucide-react";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type ChangePasswordDialogProps = {
  onCloseAction: () => void;
};

export function ChangePasswordDialog({ onCloseAction }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak sama.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        setError(result.error.message ?? "Gagal mengganti password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setError("Gagal mengganti password. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <button
        type="button"
        aria-label="Tutup dialog ganti password"
        onClick={onCloseAction}
        className="absolute inset-0 cursor-default"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-navy">
              <KeyRound className="size-5" aria-hidden />
              <h2 id="change-password-title" className="font-display text-xl font-bold">
                Ganti password
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Masukkan password saat ini dan password baru untuk akun admin.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCloseAction}
            aria-label="Tutup"
            className="shrink-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X aria-hidden />
          </Button>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Password saat ini</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Password baru</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Konfirmasi password baru</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition-colors focus:border-brand"
            />
          </label>

          {error ? (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {success ? (
            <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
              Password berhasil diganti.
            </p>
          ) : null}

          <div className="mt-1 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCloseAction}
              disabled={submitting}
              className="border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-golden text-sm font-medium text-navy hover:bg-gold"
            >
              {submitting ? "Menyimpan…" : "Simpan password"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
