"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CertificateModal,
  type CertificateModalState,
} from "@/components/admin/certificate-modal";
import { adminFetch } from "@/lib/admin";
import { apiBaseUrl } from "@/lib/api";
import type { Certificate } from "@/lib/certificates";

const PAGE_SIZE = 10;

/**
 * TEMPORARY: placeholder data so the page can be developed and reviewed
 * without a running API/DB. Set USE_PLACEHOLDER to false to switch back to
 * real API fetching.
 */
const USE_PLACEHOLDER = false;

const PLACEHOLDER_CERTS: Certificate[] = [
  {
    id: "1",
    title: "ISO 9001",
    fileName: "GambarISO90.jpg",
    fileUrl: "/certificate/sertif-10.jpg",
    updatedAt: "2026-09-08T08:45:00Z",
    isVisible: true,
  },
  {
    id: "2",
    title: "ISO 14001",
    fileName: "GambarISO140.jpg",
    fileUrl: "/certificate/sertif-2.png",
    updatedAt: "2026-09-05T10:12:00Z",
    isVisible: true,
  },
  {
    id: "3",
    title: "ISO 45001",
    fileName: "sertif-45001.png",
    fileUrl: "/certificate/sertif-3.png",
    updatedAt: "2026-08-30T14:30:00Z",
    isVisible: false,
  },
  {
    id: "4",
    title: "OHSAS 18001",
    fileName: "ohsas-18001.png",
    fileUrl: "/certificate/sertif-4.png",
    updatedAt: "2026-08-22T09:05:00Z",
    isVisible: true,
  },
  {
    id: "5",
    title: "SMK3",
    fileName: "smk3-2024.jpg",
    fileUrl: "/certificate/sertif-5.png",
    updatedAt: "2026-08-18T16:40:00Z",
    isVisible: true,
  },
  {
    id: "6",
    title: "ISO 27001",
    fileName: "iso-27001.png",
    fileUrl: "/certificate/sertif-6.png",
    updatedAt: "2026-08-12T11:20:00Z",
    isVisible: true,
  },
  {
    id: "7",
    title: "K3 Umum",
    fileName: "k3-umum.png",
    fileUrl: "/certificate/sertif-7.png",
    updatedAt: "2026-08-09T13:10:00Z",
    isVisible: false,
  },
  {
    id: "8",
    title: "SMK3 PP 50/2012",
    fileName: "smk3-pp50.png",
    fileUrl: "/certificate/sertif-8.png",
    updatedAt: "2026-07-28T09:45:00Z",
    isVisible: true,
  },
  {
    id: "9",
    title: "ISO 22000",
    fileName: "iso-22000.jpg",
    fileUrl: "/certificate/sertif-9.png",
    updatedAt: "2026-07-20T15:30:00Z",
    isVisible: true,
  },
  {
    id: "10",
    title: "ISO/IEC 17025",
    fileName: "iec-17025.jpg",
    fileUrl: "/certificate/sertif-10.jpg",
    updatedAt: "2026-07-14T10:00:00Z",
    isVisible: false,
  },
  {
    id: "11",
    title: "CSMS",
    fileName: "csms.png",
    fileUrl: "/certificate/sertif-2.png",
    updatedAt: "2026-07-03T08:25:00Z",
    isVisible: true,
  },
  {
    id: "12",
    title: "AK3U",
    fileName: "ak3u.jpg",
    fileUrl: "/certificate/sertif-3.png",
    updatedAt: "2026-06-25T12:50:00Z",
    isVisible: true,
  },
  {
    id: "13",
    title: "ISO 50001",
    fileName: "iso-50001.png",
    fileUrl: "/certificate/sertif-4.png",
    updatedAt: "2026-06-16T17:15:00Z",
    isVisible: false,
  },
  {
    id: "14",
    title: "Proper Hijau",
    fileName: "proper-hijau.png",
    fileUrl: "/certificate/sertif-5.png",
    updatedAt: "2026-06-05T09:35:00Z",
    isVisible: true,
  },
  {
    id: "15",
    title: "Halal MUI",
    fileName: "halal-mui.jpg",
    fileUrl: "/certificate/sertif-6.png",
    updatedAt: "2026-05-28T14:05:00Z",
    isVisible: true,
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** Compact page list: 1 … c-1 c c+1 … total */
function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  const wanted = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...wanted]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("ellipsis");
    out.push(p);
    prev = p;
  }
  return out;
}

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "semua" | "aktif" | "non-aktif"
  >("semua");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<CertificateModalState | null>(null);
  const [deleting, setDeleting] = useState<Certificate | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_PLACEHOLDER) {
        // Fake latency so the loading state stays visible.
        await new Promise((r) => setTimeout(r, 300));
        setCerts(PLACEHOLDER_CERTS);
        return;
      }
      const res = await adminFetch(`${apiBaseUrl}/api/admin/certificates`);
      if (!res.ok) throw new Error(`Request gagal (${res.status})`);
      setCerts(await res.json());
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message} — coba refresh setelah login`
          : "Gagal memuat data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeVisibility(cert: Certificate, isVisible: boolean) {
    setError(null);
    if (USE_PLACEHOLDER) {
      setCerts((cs) =>
        cs.map((c) =>
          c.id === cert.id
            ? { ...c, isVisible, updatedAt: new Date().toISOString() }
            : c,
        ),
      );
      return;
    }
    const res = await adminFetch(
      `${apiBaseUrl}/api/admin/certificates/${cert.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible }),
      },
    );
    if (!res.ok) {
      setError("Gagal mengubah visibilitas");
      return;
    }
    const updated: Certificate = await res.json();
    setCerts((cs) => cs.map((c) => (c.id === updated.id ? updated : c)));
  }

  async function confirmDelete() {
    if (!deleting) return;
    setError(null);
    if (USE_PLACEHOLDER) {
      setCerts((cs) => cs.filter((c) => c.id !== deleting.id));
      setDeleting(null);
      return;
    }
    const res = await adminFetch(
      `${apiBaseUrl}/api/admin/certificates/${deleting.id}`,
      { method: "DELETE" },
    );
    if (!res.ok) {
      setError("Gagal menghapus item");
      setDeleting(null);
      return;
    }
    setCerts((cs) => cs.filter((c) => c.id !== deleting.id));
    setDeleting(null);
  }

  const visible = certs.filter((cert) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      cert.title.toLowerCase().includes(q) ||
      cert.fileName.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "semua" ||
      (statusFilter === "aktif" ? cert.isVisible : !cert.isVisible);
    return matchesQuery && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = visible.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Filter/search changes shrink the list — jump back to page 1.
  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  return (
    <div className="px-6 pt-6 pb-16 md:px-15 md:pt-10">
      <h1 className="font-display text-[32px] font-bold leading-tight text-navy md:text-[40px]">
        Certificate
      </h1>

      {/* Search + filter */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari komponen"
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
          />
        </div>

        <div className="relative">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFilterOpen((o) => !o)}
            className="h-10 w-full justify-between gap-2 border-gray-300 bg-white px-4 text-sm text-gray-600 hover:bg-gray-50 md:w-[140px]"
          >
            <span className="flex items-center gap-2">
              <Filter className="size-4" aria-hidden />
              Filter by
            </span>
            <ChevronDown className="size-4" aria-hidden />
          </Button>
          {filterOpen ? (
            <>
              <Button
                type="button"
                variant="ghost"
                aria-label="Tutup filter"
                onClick={() => setFilterOpen(false)}
                className="fixed inset-0 z-10 h-auto w-auto cursor-default rounded-none bg-transparent p-0 hover:bg-transparent"
              />
              <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-md">
                {(
                  [
                    ["semua", "Semua"],
                    ["aktif", "Aktif"],
                    ["non-aktif", "Non-Aktif"],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setStatusFilter(value);
                      setFilterOpen(false);
                    }}
                    className={`h-auto block w-full rounded-none px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      statusFilter === value
                        ? "font-medium text-brand"
                        : "text-gray-600"
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Primary CTA */}
      <Button
        type="button"
        onClick={() => setModal({ mode: "create" })}
        size="lg"
        className="mt-6 h-10 w-[150px] gap-2 rounded-lg bg-golden text-sm font-medium text-navy hover:bg-gold"
      >
        Tambah Item
        <Plus data-icon="inline-end" />
      </Button>

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

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="text-white">
              <th className="w-[28%] rounded-tl-lg bg-[#3B5A8B] px-4 py-3.5 text-sm font-medium">
                Judul
              </th>
              <th className="w-[22%] bg-[#3B5A8B] px-4 py-3.5 text-sm font-medium">
                File (jpg/jpeg/png)
              </th>
              <th className="w-[22%] bg-[#3B5A8B] px-4 py-3.5 text-sm font-medium">
                Updated Date
              </th>
              <th className="w-[15%] bg-[#3B5A8B] px-4 py-3.5 text-sm font-medium">
                Visibility
              </th>
              <th className="w-[13%] rounded-tr-lg bg-[#3B5A8B] px-4 py-3.5 text-right text-sm font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="border-b border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
                >
                  Memuat data…
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border-b border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
                >
                  Belum ada data.
                </td>
              </tr>
            ) : (
              pageItems.map((cert) => (
                <tr
                  key={cert.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="border-b border-gray-200 px-4 py-4 font-medium text-gray-800">
                    {cert.title}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-4 text-sm text-gray-600">
                    {cert.fileName}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-4 text-sm text-gray-600">
                    {formatDate(cert.updatedAt)}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-4">
                    <div className="relative inline-block">
                      <select
                        value={cert.isVisible ? "aktif" : "non-aktif"}
                        onChange={(e) =>
                          void changeVisibility(
                            cert,
                            e.target.value === "aktif",
                          )
                        }
                        aria-label={`Visibilitas ${cert.title}`}
                        className={`h-8 cursor-pointer appearance-none rounded-md pl-3 pr-8 text-sm font-medium text-white outline-none transition-opacity ${
                          cert.isVisible
                            ? "bg-info hover:opacity-90"
                            : "bg-gray-400 hover:opacity-90"
                        }`}
                      >
                        <option value="aktif" className="text-navy">
                          Aktif
                        </option>
                        <option value="non-aktif" className="text-navy">
                          Non-Aktif
                        </option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white"
                        aria-hidden
                      />
                    </div>
                  </td>
                  <td className="border-b border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setModal({ mode: "edit", cert })}
                        aria-label={`Edit ${cert.title}`}
                        className="bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-navy"
                      >
                        <Pencil aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleting(cert)}
                        aria-label={`Hapus ${cert.title}`}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 aria-hidden />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-gray-500">
            Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, visible.length)} dari{" "}
            {visible.length} item
          </p>
          <nav aria-label="Pagination" className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <ChevronLeft aria-hidden />
            </Button>
            {getPageNumbers(currentPage, totalPages).map((p, i) =>
              p === "ellipsis" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1 text-sm text-gray-400"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  type="button"
                  variant={p === currentPage ? "default" : "outline"}
                  size="icon"
                  onClick={() => setPage(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={
                    p === currentPage
                      ? "bg-[#3B5A8B] text-sm font-medium text-white hover:bg-[#334e7b]"
                      : "border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                  }
                >
                  {p}
                </Button>
              ),
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Halaman berikutnya"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <ChevronRight aria-hidden />
            </Button>
          </nav>
        </div>
      ) : null}

      {modal ? (
        <CertificateModal
          modal={modal}
          placeholder={USE_PLACEHOLDER}
          onClose={() => setModal(null)}
          onSaved={(cert) => {
            setCerts((cs) =>
              modal.mode === "edit"
                ? cs.map((c) => (c.id === cert.id ? cert : c))
                : [cert, ...cs],
            );
            setModal(null);
          }}
        />
      ) : null}

      {deleting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Button
            type="button"
            variant="ghost"
            aria-label="Batal hapus"
            onClick={() => setDeleting(null)}
            className="absolute inset-0 h-auto w-auto rounded-none bg-black/50 p-0 hover:bg-black/50"
          />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-navy">Hapus item?</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              “{deleting.title}” akan dihapus permanen beserta file gambarnya.
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleting(null)}
                className="border-gray-300 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void confirmDelete()}
                className="px-4 text-sm font-medium text-white"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
