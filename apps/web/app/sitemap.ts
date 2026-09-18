import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const publicRoutes = [
  { path: "/", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/services", changeFrequency: "monthly" as const, priority: 0.9 },
  {
    path: "/certificates",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/portfolios",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  { path: "/career", changeFrequency: "monthly" as const, priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency,
    priority,
  }));
}
