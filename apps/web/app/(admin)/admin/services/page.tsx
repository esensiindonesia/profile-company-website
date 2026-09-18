"use client";

import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin";
import { apiBaseUrl } from "@/lib/api";

type Blog = {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  linkUrl: string;
  sortOrder: number;
};

type YoutubeLink = {
  id: string;
  url: string;
  sortOrder: number;
};

const MAX_YOUTUBE_LINKS = 2;
const inputClass =
  "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand";
const textareaClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand";

async function getErrorMessage(response: Response) {
  const body = await response.json().catch(() => null);
  return body && typeof body.error === "string"
    ? body.error
    : `Request gagal (${response.status})`;
}

export default function ServicesContentPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<YoutubeLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogLink, setBlogLink] = useState("");
  const [blogFile, setBlogFile] = useState<File | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [editingYoutube, setEditingYoutube] = useState<YoutubeLink | null>(null);
  const blogFormRef = useRef<HTMLFormElement>(null);
  const youtubeFormRef = useRef<HTMLFormElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [blogsResponse, youtubeResponse] = await Promise.all([
        adminFetch(`${apiBaseUrl}/api/admin/blogs`),
        adminFetch(`${apiBaseUrl}/api/admin/youtube-links`),
      ]);
      if (!blogsResponse.ok) throw new Error(await getErrorMessage(blogsResponse));
      if (!youtubeResponse.ok) {
        throw new Error(await getErrorMessage(youtubeResponse));
      }
      setBlogs(await blogsResponse.json());
      setYoutubeLinks(await youtubeResponse.json());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memuat content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetBlogForm() {
    setEditingBlog(null);
    setBlogTitle("");
    setBlogDescription("");
    setBlogLink("");
    setBlogFile(null);
  }

  function resetYoutubeForm() {
    setEditingYoutube(null);
    setYoutubeUrl("");
  }

  function startEditingBlog(blog: Blog) {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogDescription(blog.description);
    setBlogLink(blog.linkUrl);
    setBlogFile(null);
    requestAnimationFrame(() => {
      blogFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  async function saveBlog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!blogTitle.trim() || !blogLink.trim() || (!editingBlog && !blogFile)) {
      setError(
        editingBlog
          ? "Blog membutuhkan title dan link"
          : "Blog membutuhkan title, link, dan file gambar",
      );
      return;
    }
    setSaving(true);
    setError(null);
    const form = new FormData();
    form.append("title", blogTitle.trim());
    form.append("description", blogDescription.trim());
    form.append("linkUrl", blogLink.trim());
    if (blogFile) form.append("file", blogFile);
    if (editingBlog) form.append("sortOrder", String(editingBlog.sortOrder));

    try {
      const endpoint = editingBlog
        ? `${apiBaseUrl}/api/admin/blogs/${editingBlog.id}`
        : `${apiBaseUrl}/api/admin/blogs`;
      const response = await adminFetch(endpoint, {
        method: editingBlog ? "PUT" : "POST",
        body: form,
      });
      if (!response.ok) throw new Error(await getErrorMessage(response));
      resetBlogForm();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menyimpan blog");
    } finally {
      setSaving(false);
    }
  }

  function startEditingYoutube(link: YoutubeLink) {
    setEditingYoutube(link);
    setYoutubeUrl(link.url);
    requestAnimationFrame(() => {
      youtubeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  async function saveYoutubeLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!youtubeUrl.trim()) {
      setError("Link YouTube wajib diisi");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const endpoint = editingYoutube
        ? `${apiBaseUrl}/api/admin/youtube-links/${editingYoutube.id}`
        : `${apiBaseUrl}/api/admin/youtube-links`;
      const response = await adminFetch(endpoint, {
        method: editingYoutube ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: youtubeUrl.trim(),
          sortOrder: editingYoutube?.sortOrder ?? youtubeLinks.length,
        }),
      });
      if (!response.ok) throw new Error(await getErrorMessage(response));
      resetYoutubeForm();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menyimpan link");
    } finally {
      setSaving(false);
    }
  }

  async function remove(resource: "blogs" | "youtube-links", id: string) {
    setError(null);
    const response = await adminFetch(
      `${apiBaseUrl}/api/admin/${resource}/${id}`,
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
          Blog &amp; Best Event
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

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-navy">
              {editingBlog ? "Edit Blog" : "Blog"}
            </h2>
            <span className="rounded-full bg-[#eaf0f8] px-3 py-1 text-xs font-semibold text-[#3B5A8B]">
              {blogs.length} item
            </span>
          </div>
          <form ref={blogFormRef} onSubmit={(event) => void saveBlog(event)} className="mt-5 flex flex-col gap-3">
            <input value={blogTitle} onChange={(event) => setBlogTitle(event.target.value)} placeholder="Judul blog" className={inputClass} />
            <textarea value={blogDescription} onChange={(event) => setBlogDescription(event.target.value)} placeholder="Deskripsi singkat" rows={3} className={textareaClass} />
            <input type="url" value={blogLink} onChange={(event) => setBlogLink(event.target.value)} placeholder="https://..." className={inputClass} />
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/*" onChange={(event) => setBlogFile(event.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-brand/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand" />
            {editingBlog ? (
              <p className="text-xs text-gray-400">Kosongkan file jika gambar tidak diganti.</p>
            ) : null}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={saving}
                className="h-10 rounded-lg bg-golden px-4 text-sm font-medium text-navy hover:bg-gold"
              >
                {editingBlog ? "Simpan perubahan" : "Tambah blog"}
              </Button>
              {editingBlog ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetBlogForm}
                  className="h-10 border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </Button>
              ) : null}
            </div>
          </form>

          <div className="mt-6 flex flex-col gap-2">
            {loading ? <p className="text-sm text-gray-400">Memuat…</p> : null}
            {!loading && blogs.length === 0 ? (
              <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                Belum ada blog di database.
              </p>
            ) : null}
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className={`rounded-lg border p-3 ${
                  editingBlog?.id === blog.id
                    ? "border-brand/30 bg-brand/10 ring-1 ring-brand/20"
                    : "border-transparent bg-gray-50"
                }`}
              >
                <p className="font-medium text-gray-800">{blog.title}</p>
                {blog.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">{blog.description}</p>
                ) : null}
                <p className="mt-1 truncate text-xs text-gray-500">{blog.fileName}</p>
                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => startEditingBlog(blog)}
                    className="border-gray-300 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void remove("blogs", blog.id)}
                    className="px-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-navy">
              {editingYoutube ? "Edit Best Event" : "Best Event"}
            </h2>
            <span className="rounded-full bg-[#eaf0f8] px-3 py-1 text-xs font-semibold text-[#3B5A8B]">
              {youtubeLinks.length}/{MAX_YOUTUBE_LINKS}
            </span>
          </div>
          {youtubeLinks.length < MAX_YOUTUBE_LINKS || editingYoutube ? (
            <form ref={youtubeFormRef} onSubmit={(event) => void saveYoutubeLink(event)} className="mt-5 flex flex-col gap-3">
              <input type="url" value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://youtu.be/..." className={inputClass} />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-10 rounded-lg bg-golden px-4 text-sm font-medium text-navy hover:bg-gold"
                >
                  {editingYoutube ? "Simpan perubahan" : "Tambah link"}
                </Button>
                {editingYoutube ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetYoutubeForm}
                    className="h-10 border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Batal
                  </Button>
                ) : null}
              </div>
            </form>
          ) : (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#e8d69a] bg-[#fff8e6] px-3 py-3 text-sm text-[#6a5500]">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#a68100]" />
              <div>
                <p className="font-semibold">Best Event sudah penuh</p>
                <p className="mt-0.5 text-xs leading-relaxed">
                  Maksimal {MAX_YOUTUBE_LINKS} video. Hapus salah satu video untuk menambahkan link baru.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            {loading ? <p className="text-sm text-gray-400">Memuat…</p> : null}
            {!loading && youtubeLinks.length === 0 ? (
              <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                Belum ada video Best Event.
              </p>
            ) : null}
            {youtubeLinks.map((link, index) => (
              <div
                key={link.id}
                className={`rounded-lg border p-3 ${
                  editingYoutube?.id === link.id
                    ? "border-brand/30 bg-brand/10 ring-1 ring-brand/20"
                    : "border-transparent bg-gray-50"
                }`}
              >
                <p className="break-all text-sm text-gray-700">
                  <span className="mr-2 font-semibold text-brand">{index + 1}.</span>
                  {link.url}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => startEditingYoutube(link)}
                    className="border-gray-300 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void remove("youtube-links", link.id)}
                    className="px-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
