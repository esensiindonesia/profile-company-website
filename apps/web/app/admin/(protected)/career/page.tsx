"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin";
import { apiBaseUrl } from "@/lib/api";
import { getFileUrl } from "@/lib/files";

type CareerQrCode = {
  id: string;
  area: string;
  fileName: string;
  fileUrl: string;
  sortOrder: number;
};

const inputClass =
  "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand";

async function getErrorMessage(response: Response) {
  const body = await response.json().catch(() => null);
  return body && typeof body.error === "string"
    ? body.error
    : `Request gagal (${response.status})`;
}

export default function CareerContentPage() {
  const [qrCodes, setQrCodes] = useState<CareerQrCode[]>([]);
  const [area, setArea] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingQrCode, setEditingQrCode] = useState<CareerQrCode | null>(null);
  const qrFormRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminFetch(
        `${apiBaseUrl}/api/admin/career/qr-codes`,
      );
      if (!response.ok) throw new Error(await getErrorMessage(response));
      setQrCodes(await response.json());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memuat QR code");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setEditingQrCode(null);
    setArea("");
    setFile(null);
  }

  function startEditingQrCode(qrCode: CareerQrCode) {
    setEditingQrCode(qrCode);
    setArea(qrCode.area);
    setFile(null);
    requestAnimationFrame(() => {
      qrFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  async function saveQrCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!area.trim() || (!editingQrCode && !file)) {
      setError(
        editingQrCode
          ? "Area QR code wajib diisi"
          : "QR code membutuhkan area dan file gambar",
      );
      return;
    }
    setSaving(true);
    setError(null);
    const form = new FormData();
    form.append("area", area.trim());
    if (file) form.append("file", file);
    if (editingQrCode) form.append("sortOrder", String(editingQrCode.sortOrder));

    try {
      const endpoint = editingQrCode
        ? `${apiBaseUrl}/api/admin/career/qr-codes/${editingQrCode.id}`
        : `${apiBaseUrl}/api/admin/career/qr-codes`;
      const response = await adminFetch(endpoint, {
        method: editingQrCode ? "PUT" : "POST",
        body: form,
      });
      if (!response.ok) throw new Error(await getErrorMessage(response));
      resetForm();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menyimpan QR code");
    } finally {
      setSaving(false);
    }
  }

  async function remove(qrCode: CareerQrCode) {
    setError(null);
    const response = await adminFetch(
      `${apiBaseUrl}/api/admin/career/qr-codes/${qrCode.id}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      setError(await getErrorMessage(response));
      return;
    }
    await load();
  }

  return (
    <div className="px-6 pt-6 pb-16 md:px-15 md:pt-10">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
        <h1 className="font-display text-[32px] font-bold leading-tight text-navy md:text-[40px]">
          Career QR Codes
        </h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => void load()}
          className="h-10 border-gray-300 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Refresh data
        </Button>
      </div>

      {error ? (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <Button
            type="button"
            variant="link"
            onClick={() => void load()}
            className="h-auto shrink-0 p-0 font-medium text-red-700 underline"
          >
            Coba lagi
          </Button>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <section className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-navy">
              {editingQrCode ? "Edit QR code" : "Tambah QR code"}
            </h2>
          </div>
          <form ref={qrFormRef} onSubmit={(event) => void saveQrCode(event)} className="mt-5 flex flex-col gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Area</span>
              <input value={area} onChange={(event) => setArea(event.target.value)} placeholder="Contoh: Jakarta Area" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">QR image</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp,image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-brand/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand" />
              {editingQrCode ? (
                <p className="mt-1 text-xs text-gray-400">Kosongkan file jika gambar tidak diganti.</p>
              ) : null}
            </label>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={saving}
                className="h-10 rounded-lg bg-golden px-4 text-sm font-medium text-navy hover:bg-gold"
              >
                {editingQrCode ? "Simpan perubahan" : "Tambah QR code"}
              </Button>
              {editingQrCode ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="h-10 border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </Button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-navy">Data existing</h2>
              <p className="mt-1 text-sm text-gray-500">{qrCodes.length} QR code</p>
            </div>
          </div>

          {loading ? <p className="mt-6 text-sm text-gray-400">Memuat…</p> : null}
          {!loading && qrCodes.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              Belum ada QR code di database.
            </p>
          ) : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {qrCodes.map((qrCode) => (
              <article
                key={qrCode.id}
                className={`overflow-hidden rounded-xl border ${
                  editingQrCode?.id === qrCode.id
                    ? "border-brand/40 ring-1 ring-brand/30"
                    : "border-gray-200"
                } bg-gray-50`}
              >
                <div className="flex aspect-square items-center justify-center bg-white p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getFileUrl(qrCode.fileUrl)} alt={`QR code ${qrCode.area}`} className="size-full object-contain" />
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-800">{qrCode.area}</p>
                  <p className="mt-1 truncate text-xs text-gray-500">{qrCode.fileName}</p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startEditingQrCode(qrCode)}
                      className="border-gray-300 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void remove(qrCode)}
                      className="px-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
