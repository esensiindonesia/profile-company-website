import { asc, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { timingSafeEqual } from "hono/utils/buffer";
import type { R2Bucket } from "@cloudflare/workers-types";
import type { Bindings } from "./bindings";
import { createAuth } from "./auth";
import { createDb, schema } from "./db";

const app = new Hono<{ Bindings: Bindings }>();

const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];

app.use(
  "/*",
  cors({
    // Session cookies require an explicit origin (a wildcard origin is
    // rejected by browsers when credentials are enabled). Origins are
    // configured via CORS_ORIGIN.
    origin: (origin, c) => {
      const origins = (c.env.CORS_ORIGIN ?? "http://localhost:3000")
        .split(",")
        .map((o: string) => o.trim());
      return origin && origins.includes(origin) ? origin : origins[0];
    },
    credentials: true,
    allowHeaders: ["Content-Type"],
    allowMethods: ALLOWED_METHODS,
  }),
);

app.post("/api/auth/setup", async (c) => {
  const expectedToken = c.env.AUTH_SETUP_TOKEN;
  const providedToken = c.req.header("x-auth-setup-token");
  const validToken =
    Boolean(expectedToken) &&
    Boolean(providedToken) &&
    expectedToken!.length === providedToken!.length &&
    (await timingSafeEqual(expectedToken!, providedToken!));

  if (!validToken) return c.json({ error: "Not found" }, 404);

  const db = createDb(c.env.DB);
  const [existingUser] = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .limit(1);
  if (existingUser) {
    return c.json({ error: "Admin account already initialized" }, 409);
  }

  const body = await c.req.json<{
    name?: unknown;
    email?: unknown;
    password?: unknown;
  }>();
  if (
    typeof body.name !== "string" ||
    !body.name.trim() ||
    typeof body.email !== "string" ||
    !body.email.trim() ||
    typeof body.password !== "string" ||
    body.password.length < 8
  ) {
    return c.json(
      { error: "name, valid email, and a password of at least 8 characters are required" },
      400,
    );
  }

  const auth = createAuth(c.env, c.req.url, { allowSignUp: true });
  const result = await auth.api.signUpEmail({
    body: {
      name: body.name.trim(),
      email: body.email.trim(),
      password: body.password,
    },
  });

  return c.json({ user: result.user }, 201);
});

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  const auth = createAuth(c.env, c.req.url);
  return auth.handler(c.req.raw);
});

app.use("/api/admin/*", async (c, next) => {
  const auth = createAuth(c.env, c.req.url);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) return c.json({ error: "Unauthorized" }, 401);
  return next();
});

const CERT_FILE_RE = /\.(jpe?g|png)$/i;
const CMS_IMAGE_FILE_RE = /\.(jpe?g|png|webp)$/i;
const MAX_CMS_IMAGE_BYTES = 8 * 1024 * 1024;

function requiredText(form: FormData, field: string) {
  const value = String(form.get(field) ?? "").trim();
  return value || null;
}

function optionalText(form: FormData, field: string) {
  return String(form.get(field) ?? "").trim();
}

function parseSortOrder(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}


function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateCmsImage(file: string | File | null) {
  if (!(file instanceof File)) return "file is required";
  if (!CMS_IMAGE_FILE_RE.test(file.name)) {
    return "only .jpg/.jpeg/.png/.webp files are allowed";
  }
  if (file.size > MAX_CMS_IMAGE_BYTES) {
    return "file must be 8 MB or smaller";
  }
  return null;
}

async function putCmsImage(
  bucket: R2Bucket,
  folder: string,
  id: string,
  file: File,
) {
  const extension = file.name.match(CMS_IMAGE_FILE_RE)?.[1]?.toLowerCase();
  if (!extension) throw new Error("invalid image extension");
  const normalizedExtension = extension === "jpeg" ? "jpg" : extension;
  const key = `${folder}/${id}.${normalizedExtension}`;
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  return { key, fileName: file.name, fileUrl: `/api/files/${key}` };
}

/** Derives the R2 object key from a stored fileUrl like "/api/files/<key>". */
function fileUrlToKey(fileUrl: string) {
  return fileUrl.startsWith("/api/files/")
    ? fileUrl.slice("/api/files/".length)
    : null;
}

function fileKeyFromPath(path: string, prefix: string) {
  if (!path.startsWith(prefix)) return null;
  const key = path.slice(prefix.length);
  return key ? decodeURIComponent(key) : null;
}

/**
 * Routes are chained into a single `routes` const so `typeof routes` captures
 * the full schema for the web app's typed RPC client (see apps/web/lib/api.ts).
 */
const routes = app
  .get("/", (c) => c.json({ message: "Esensi Indonesia API" }))
  .get("/api/health", (c) =>
    c.json({ status: "ok", timestamp: new Date().toISOString() }),
  )

  // ----- Certificates: public (only visible ones) -----
  .get("/api/certificates", async (c) => {
    const db = createDb(c.env.DB);
    const certs = await db
      .select()
      .from(schema.certificates)
      .where(eq(schema.certificates.isVisible, true))
      .orderBy(schema.certificates.updatedAt);
    return c.json(certs);
  })

  // ----- CMS content: public -----
  // Blog, Best Event, and QR content is always published. The legacy
  // isVisible columns remain in D1 for compatibility but are not filters.
  .get("/api/blogs", async (c) => {
    const db = createDb(c.env.DB);
    const blogs = await db
      .select()
      .from(schema.blogs)
      .orderBy(asc(schema.blogs.sortOrder), desc(schema.blogs.updatedAt));
    return c.json(blogs);
  })
  .get("/api/youtube-links", async (c) => {
    const db = createDb(c.env.DB);
    const links = await db
      .select()
      .from(schema.youtubeLinks)
      .orderBy(asc(schema.youtubeLinks.sortOrder), desc(schema.youtubeLinks.updatedAt));
    return c.json(links);
  })
  .get("/api/career/qr-codes", async (c) => {
    const db = createDb(c.env.DB);
    const qrCodes = await db
      .select()
      .from(schema.careerQrCodes)
      .orderBy(asc(schema.careerQrCodes.sortOrder), desc(schema.careerQrCodes.updatedAt));
    return c.json(qrCodes);
  })

  // ----- CMS content: temporary admin CRUD -----
  .get("/api/admin/blogs", async (c) => {
    const db = createDb(c.env.DB);
    const blogs = await db
      .select()
      .from(schema.blogs)
      .orderBy(asc(schema.blogs.sortOrder), desc(schema.blogs.updatedAt));
    return c.json(blogs);
  })
  .post("/api/admin/blogs", async (c) => {
    const form = await c.req.formData();
    const title = requiredText(form, "title");
    const linkUrl = requiredText(form, "linkUrl");
    const file = form.get("file");
    const fileError = validateCmsImage(file);
    if (!title) return c.json({ error: "title is required" }, 400);
    if (!linkUrl || !isHttpUrl(linkUrl)) {
      return c.json({ error: "a valid linkUrl is required" }, 400);
    }
    if (fileError) return c.json({ error: fileError }, 400);
    if (!(file instanceof File)) return c.json({ error: "file is required" }, 400);

    const id = crypto.randomUUID();
    const uploaded = await putCmsImage(c.env.BUCKET, "blogs", id, file);
    const now = new Date().toISOString();
    const db = createDb(c.env.DB);
    try {
      const [blog] = await db
        .insert(schema.blogs)
        .values({
          id,
          title,
          description: optionalText(form, "description"),
          fileName: uploaded.fileName,
          fileUrl: uploaded.fileUrl,
          linkUrl,
          isVisible: true,
          sortOrder: parseSortOrder(optionalText(form, "sortOrder")),
          updatedAt: now,
        })
        .returning();
      if (!blog) return c.json({ error: "insert failed" }, 500);
      return c.json(blog, 201);
    } catch (error) {
      await c.env.BUCKET.delete(uploaded.key);
      throw error;
    }
  })
  .put("/api/admin/blogs/:id", async (c) => {
    const id = c.req.param("id");
    const form = await c.req.formData();
    const title = requiredText(form, "title");
    const linkUrl = requiredText(form, "linkUrl");
    const file = form.get("file");
    if (!title) return c.json({ error: "title is required" }, 400);
    if (!linkUrl || !isHttpUrl(linkUrl)) {
      return c.json({ error: "a valid linkUrl is required" }, 400);
    }
    if (file !== null && file instanceof File) {
      const fileError = validateCmsImage(file);
      if (fileError) return c.json({ error: fileError }, 400);
    }

    const db = createDb(c.env.DB);
    const [existing] = await db
      .select()
      .from(schema.blogs)
      .where(eq(schema.blogs.id, id))
      .limit(1);
    if (!existing) return c.json({ error: "not found" }, 404);

    let fileName = existing.fileName;
    let fileUrl = existing.fileUrl;
    let uploadedKey: string | null = null;
    if (file instanceof File) {
      const uploaded = await putCmsImage(c.env.BUCKET, "blogs", id, file);
      fileName = uploaded.fileName;
      fileUrl = uploaded.fileUrl;
      uploadedKey = uploaded.key;
    }

    try {
      const [updated] = await db
        .update(schema.blogs)
        .set({
          title,
          description: optionalText(form, "description"),
          fileName,
          fileUrl,
          linkUrl,
          isVisible: true,
          sortOrder: parseSortOrder(
            optionalText(form, "sortOrder"),
            existing.sortOrder,
          ),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.blogs.id, id))
        .returning();
      if (!updated) return c.json({ error: "update failed" }, 500);

      const oldKey = fileUrlToKey(existing.fileUrl);
      if (oldKey && uploadedKey && oldKey !== uploadedKey) {
        await c.env.BUCKET.delete(oldKey);
      }
      return c.json(updated);
    } catch (error) {
      if (uploadedKey) await c.env.BUCKET.delete(uploadedKey);
      throw error;
    }
  })
  .patch("/api/admin/blogs/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<{ sortOrder?: unknown }>();
    if (!Number.isInteger(body.sortOrder)) {
      return c.json({ error: "sortOrder is required" }, 400);
    }
    const db = createDb(c.env.DB);
    const [updated] = await db
      .update(schema.blogs)
      .set({
        isVisible: true,
        sortOrder: body.sortOrder as number,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.blogs.id, id))
      .returning();
    if (!updated) return c.json({ error: "not found" }, 404);
    return c.json(updated);
  })
  .delete("/api/admin/blogs/:id", async (c) => {
    const id = c.req.param("id");
    const db = createDb(c.env.DB);
    const [deleted] = await db
      .delete(schema.blogs)
      .where(eq(schema.blogs.id, id))
      .returning();
    if (!deleted) return c.json({ error: "not found" }, 404);
    const key = fileUrlToKey(deleted.fileUrl);
    if (key) await c.env.BUCKET.delete(key);
    return c.json({ deleted: deleted.id });
  })

  .get("/api/admin/youtube-links", async (c) => {
    const db = createDb(c.env.DB);
    const links = await db
      .select()
      .from(schema.youtubeLinks)
      .orderBy(asc(schema.youtubeLinks.sortOrder), desc(schema.youtubeLinks.updatedAt));
    return c.json(links);
  })
  .post("/api/admin/youtube-links", async (c) => {
    const body = await c.req.json<{
      url?: unknown;
      sortOrder?: unknown;
    }>();
    if (typeof body.url !== "string" || !isHttpUrl(body.url)) {
      return c.json({ error: "a valid url is required" }, 400);
    }
    const db = createDb(c.env.DB);
    const existingLinks = await db
      .select({ id: schema.youtubeLinks.id })
      .from(schema.youtubeLinks)
      .limit(2);
    if (existingLinks.length >= 2) {
      return c.json({ error: "a maximum of 2 YouTube links is allowed" }, 409);
    }
    const [link] = await db
      .insert(schema.youtubeLinks)
      .values({
        id: crypto.randomUUID(),
        url: body.url,
        isVisible: true,
        sortOrder: Number.isInteger(body.sortOrder) ? Number(body.sortOrder) : 0,
        updatedAt: new Date().toISOString(),
      })
      .returning();
    if (!link) return c.json({ error: "insert failed" }, 500);
    return c.json(link, 201);
  })
  .put("/api/admin/youtube-links/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<{
      url?: unknown;
      sortOrder?: unknown;
    }>();
    if (typeof body.url !== "string" || !isHttpUrl(body.url)) {
      return c.json({ error: "a valid url is required" }, 400);
    }
    const db = createDb(c.env.DB);
    const [updated] = await db
      .update(schema.youtubeLinks)
      .set({
        url: body.url,
        isVisible: true,
        sortOrder: Number.isInteger(body.sortOrder) ? Number(body.sortOrder) : 0,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.youtubeLinks.id, id))
      .returning();
    if (!updated) return c.json({ error: "not found" }, 404);
    return c.json(updated);
  })
  .patch("/api/admin/youtube-links/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<{ sortOrder?: unknown }>();
    if (!Number.isInteger(body.sortOrder)) {
      return c.json({ error: "sortOrder is required" }, 400);
    }
    const db = createDb(c.env.DB);
    const [updated] = await db
      .update(schema.youtubeLinks)
      .set({
        isVisible: true,
        sortOrder: body.sortOrder as number,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.youtubeLinks.id, id))
      .returning();
    if (!updated) return c.json({ error: "not found" }, 404);
    return c.json(updated);
  })
  .delete("/api/admin/youtube-links/:id", async (c) => {
    const id = c.req.param("id");
    const db = createDb(c.env.DB);
    const [deleted] = await db
      .delete(schema.youtubeLinks)
      .where(eq(schema.youtubeLinks.id, id))
      .returning();
    if (!deleted) return c.json({ error: "not found" }, 404);
    return c.json({ deleted: deleted.id });
  })

  .get("/api/admin/career/qr-codes", async (c) => {
    const db = createDb(c.env.DB);
    const qrCodes = await db
      .select()
      .from(schema.careerQrCodes)
      .orderBy(asc(schema.careerQrCodes.sortOrder), desc(schema.careerQrCodes.updatedAt));
    return c.json(qrCodes);
  })
  .post("/api/admin/career/qr-codes", async (c) => {
    const form = await c.req.formData();
    const area = requiredText(form, "area");
    const file = form.get("file");
    const fileError = validateCmsImage(file);
    if (!area) return c.json({ error: "area is required" }, 400);
    if (fileError) return c.json({ error: fileError }, 400);
    if (!(file instanceof File)) return c.json({ error: "file is required" }, 400);

    const id = crypto.randomUUID();
    const uploaded = await putCmsImage(c.env.BUCKET, "career", id, file);
    const db = createDb(c.env.DB);
    try {
      const [qrCode] = await db
        .insert(schema.careerQrCodes)
        .values({
          id,
          area,
          fileName: uploaded.fileName,
          fileUrl: uploaded.fileUrl,
          isVisible: true,
          sortOrder: parseSortOrder(optionalText(form, "sortOrder")),
          updatedAt: new Date().toISOString(),
        })
        .returning();
      if (!qrCode) return c.json({ error: "insert failed" }, 500);
      return c.json(qrCode, 201);
    } catch (error) {
      await c.env.BUCKET.delete(uploaded.key);
      throw error;
    }
  })
  .put("/api/admin/career/qr-codes/:id", async (c) => {
    const id = c.req.param("id");
    const form = await c.req.formData();
    const area = requiredText(form, "area");
    const file = form.get("file");
    if (!area) return c.json({ error: "area is required" }, 400);
    if (file !== null && file instanceof File) {
      const fileError = validateCmsImage(file);
      if (fileError) return c.json({ error: fileError }, 400);
    }

    const db = createDb(c.env.DB);
    const [existing] = await db
      .select()
      .from(schema.careerQrCodes)
      .where(eq(schema.careerQrCodes.id, id))
      .limit(1);
    if (!existing) return c.json({ error: "not found" }, 404);

    let fileName = existing.fileName;
    let fileUrl = existing.fileUrl;
    let uploadedKey: string | null = null;
    if (file instanceof File) {
      const uploaded = await putCmsImage(c.env.BUCKET, "career", id, file);
      fileName = uploaded.fileName;
      fileUrl = uploaded.fileUrl;
      uploadedKey = uploaded.key;
    }

    try {
      const [updated] = await db
        .update(schema.careerQrCodes)
        .set({
          area,
          fileName,
          fileUrl,
          isVisible: true,
          sortOrder: parseSortOrder(
            optionalText(form, "sortOrder"),
            existing.sortOrder,
          ),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.careerQrCodes.id, id))
        .returning();
      if (!updated) return c.json({ error: "update failed" }, 500);

      const oldKey = fileUrlToKey(existing.fileUrl);
      if (oldKey && uploadedKey && oldKey !== uploadedKey) {
        await c.env.BUCKET.delete(oldKey);
      }
      return c.json(updated);
    } catch (error) {
      if (uploadedKey) await c.env.BUCKET.delete(uploadedKey);
      throw error;
    }
  })
  .patch("/api/admin/career/qr-codes/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<{ sortOrder?: unknown }>();
    if (!Number.isInteger(body.sortOrder)) {
      return c.json({ error: "sortOrder is required" }, 400);
    }
    const db = createDb(c.env.DB);
    const [updated] = await db
      .update(schema.careerQrCodes)
      .set({
        isVisible: true,
        sortOrder: body.sortOrder as number,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.careerQrCodes.id, id))
      .returning();
    if (!updated) return c.json({ error: "not found" }, 404);
    return c.json(updated);
  })
  .delete("/api/admin/career/qr-codes/:id", async (c) => {
    const id = c.req.param("id");
    const db = createDb(c.env.DB);
    const [deleted] = await db
      .delete(schema.careerQrCodes)
      .where(eq(schema.careerQrCodes.id, id))
      .returning();
    if (!deleted) return c.json({ error: "not found" }, 404);
    const key = fileUrlToKey(deleted.fileUrl);
    if (key) await c.env.BUCKET.delete(key);
    return c.json({ deleted: deleted.id });
  })

  // ----- Certificates: admin CRUD -----
  .get("/api/admin/certificates", async (c) => {
    const db = createDb(c.env.DB);
    const certs = await db
      .select()
      .from(schema.certificates)
      .orderBy(schema.certificates.updatedAt);
    return c.json(certs);
  })
  .post("/api/admin/certificates", async (c) => {
    const form = await c.req.formData();
    const title = String(form.get("title") ?? "").trim();
    const file = form.get("file");
    if (!title) return c.json({ error: "title is required" }, 400);
    if (!(file instanceof File)) return c.json({ error: "file is required" }, 400);
    const extMatch = file.name.match(CERT_FILE_RE);
    if (!extMatch?.[1]) {
      return c.json({ error: "only .jpg/.jpeg/.png files are allowed" }, 400);
    }
    const ext = extMatch[1].toLowerCase().replace("jpeg", "jpg");

    const id = crypto.randomUUID();
    const key = `certificates/${id}.${ext}`;
    await c.env.BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "image/*" },
    });

    const db = createDb(c.env.DB);
    const [cert] = await db
      .insert(schema.certificates)
      .values({
        id,
        title,
        fileName: file.name,
        fileUrl: `/api/files/${key}`,
        updatedAt: new Date().toISOString(),
      })
      .returning();
    if (!cert) return c.json({ error: "insert failed" }, 500);
    return c.json(cert, 201);
  })
  .put("/api/admin/certificates/:id", async (c) => {
    const id = c.req.param("id");
    const form = await c.req.formData();
    const title = String(form.get("title") ?? "").trim();
    const file = form.get("file");
    if (!title) return c.json({ error: "title is required" }, 400);

    const db = createDb(c.env.DB);
    const [existing] = await db
      .select()
      .from(schema.certificates)
      .where(eq(schema.certificates.id, id))
      .limit(1);
    if (!existing) return c.json({ error: "not found" }, 404);

    let fileName = existing.fileName;
    let fileUrl = existing.fileUrl;
    if (file instanceof File) {
      const extMatch = file.name.match(CERT_FILE_RE);
      if (!extMatch?.[1]) {
        return c.json({ error: "only .jpg/.jpeg/.png files are allowed" }, 400);
      }
      const ext = extMatch[1].toLowerCase().replace("jpeg", "jpg");
      const key = `certificates/${id}.${ext}`;
      await c.env.BUCKET.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type || "image/*" },
      });
      fileName = file.name;
      fileUrl = `/api/files/${key}`;
    }

    const [updated] = await db
      .update(schema.certificates)
      .set({ title, fileName, fileUrl, updatedAt: new Date().toISOString() })
      .where(eq(schema.certificates.id, id))
      .returning();
    if (!updated) return c.json({ error: "update failed" }, 500);

    // Replace succeeded — drop the previous R2 object if it changed.
    const oldKey = fileUrlToKey(existing.fileUrl);
    if (oldKey && oldKey !== fileUrlToKey(fileUrl)) {
      await c.env.BUCKET.delete(oldKey);
    }
    return c.json(updated);
  })
  .patch("/api/admin/certificates/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<{ isVisible?: unknown }>();
    if (typeof body.isVisible !== "boolean") {
      return c.json({ error: "isVisible must be a boolean" }, 400);
    }
    const db = createDb(c.env.DB);
    const [updated] = await db
      .update(schema.certificates)
      .set({ isVisible: body.isVisible, updatedAt: new Date().toISOString() })
      .where(eq(schema.certificates.id, id))
      .returning();
    if (!updated) return c.json({ error: "not found" }, 404);
    return c.json(updated);
  })
  .delete("/api/admin/certificates/:id", async (c) => {
    const id = c.req.param("id");
    const db = createDb(c.env.DB);
    const [deleted] = await db
      .delete(schema.certificates)
      .where(eq(schema.certificates.id, id))
      .returning();
    if (!deleted) return c.json({ error: "not found" }, 404);
    const key = fileUrlToKey(deleted.fileUrl);
    if (key) await c.env.BUCKET.delete(key);
    return c.json({ deleted: deleted.id });
  })


  // ----- Files: R2 object storage -----
  .get("/api/admin/files", async (c) => {
    const list = await c.env.BUCKET.list();
    return c.json(
      list.objects.map((o) => ({
        key: o.key,
        size: o.size,
        uploaded: o.uploaded.toISOString(),
      })),
    );
  })
  .put("/api/admin/files/*", async (c) => {
    const key = fileKeyFromPath(c.req.path, "/api/admin/files/");
    if (!key) return c.json({ error: "file key is required" }, 400);
    const body = await c.req.arrayBuffer();
    const obj = await c.env.BUCKET.put(key, body, {
      httpMetadata: {
        contentType: c.req.header("content-type") ?? "application/octet-stream",
      },
    });
    return c.json({ key: obj.key, size: obj.size, etag: obj.httpEtag }, 201);
  })
  .get("/api/files/*", async (c) => {
    const key = fileKeyFromPath(c.req.path, "/api/files/");
    if (!key) return c.json({ error: "file key is required" }, 400);
    const obj = await c.env.BUCKET.get(key);
    if (!obj) return c.json({ error: "not found" }, 404);
    c.header(
      "content-type",
      obj.httpMetadata?.contentType ?? "application/octet-stream",
    );
    c.header("etag", obj.httpEtag);
    return c.body(await obj.arrayBuffer());
  })
  .delete("/api/admin/files/*", async (c) => {
    const key = fileKeyFromPath(c.req.path, "/api/admin/files/");
    if (!key) return c.json({ error: "file key is required" }, 400);
    await c.env.BUCKET.delete(key);
    return c.json({ deleted: key });
  });

export type AppType = typeof routes;

export default app;
