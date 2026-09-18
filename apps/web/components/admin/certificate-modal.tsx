"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin";
import { apiBaseUrl } from "@/lib/api";
import type { Certificate } from "@/lib/certificates";
import { getFileUrl } from "@/lib/files";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const FILE_EXT_RE = /\.(jpe?g|png)$/i;

export type CertificateModalState =
  | { mode: "create" }
  | { mode: "edit"; cert: Certificate };

export function CertificateModal({
  modal,
  placeholder,
  onClose,
  onSaved,
}: {
  modal: CertificateModalState;
  placeholder: boolean;
  onClose: () => void;
  onSaved: (cert: Certificate) => void;
}) {
  const editing = modal.mode === "edit" ? modal.cert : null;
  const [title, setTitle] = useState(editing?.title ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    editing ? getFileUrl(editing.fileUrl) : null,
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function pickFile(f: File | null) {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type) && !FILE_EXT_RE.test(f.name)) {
      setFormError("Hanya file .jpg, .jpeg, atau .png yang diperbolehkan");
      return;
    }
    setFormError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function save() {
    if (!title.trim()) {
      setFormError("Judul wajib diisi");
      return;
    }
    if (!editing && !file) {
      setFormError("Pilih file gambar terlebih dahulu");
      return;
    }
    setSaving(true);
    setFormError(null);

    // Placeholder mode: update local state only, no network.
    if (placeholder) {
      await new Promise((r) => setTimeout(r, 300));
      onSaved({
        id: editing?.id ?? `local-${Date.now()}`,
        title: title.trim(),
        fileName: file?.name ?? editing?.fileName ?? "placeholder.jpg",
        fileUrl: preview ?? editing?.fileUrl ?? "/certificate/sertif-2.png",
        updatedAt: new Date().toISOString(),
        isVisible: editing?.isVisible ?? true,
      });
      return;
    }

    const form = new FormData();
    form.append("title", title.trim());
    if (file) form.append("file", file);

    const res = editing
      ? await adminFetch(`${apiBaseUrl}/api/admin/certificates/${editing.id}`, {
          method: "PUT",
          body: form,
        })
      : await adminFetch(`${apiBaseUrl}/api/admin/certificates`, {
          method: "POST",
          body: form,
        });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setFormError(
        (data && typeof data.error === "string" ? data.error : "") ||
          `Gagal menyimpan (${res.status})`,
      );
      setSaving(false);
      return;
    }
    onSaved(await res.json());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Button
        type="button"
        variant="ghost"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 h-auto w-auto rounded-none bg-black/50 p-0 hover:bg-black/50"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">
            {editing ? "Edit Certificate" : "Tambah Certificate"}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Tutup"
            className="text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X aria-hidden />
          </Button>
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            Judul
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: ISO 9001"
            className="h-10 w-full rounded-lg border border-gray-300 px-3.5 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
          />
        </label>

        <div className="mt-4">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            File gambar (jpg/jpeg/png)
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="sr-only"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-auto min-h-28 w-full flex-col gap-2 rounded-lg border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm font-normal text-gray-500 hover:border-brand hover:bg-brand/5"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Pratinjau"
                className="max-h-48 object-contain"
              />
            ) : (
              <>
                <Upload className="size-5" aria-hidden />
                Klik untuk memilih gambar
              </>
            )}
          </Button>
          {preview ? (
            <p className="mt-1.5 text-xs text-gray-400">
              {file ? file.name : "Klik gambar untuk mengganti file"}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="h-10 rounded-lg bg-golden px-6 text-sm font-medium text-navy hover:bg-gold"
          >
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
