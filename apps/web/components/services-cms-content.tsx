"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/reveal";
import { apiBaseUrl } from "@/lib/api";
import { getFileUrl } from "@/lib/files";

type BlogCard = {
  title: string;
  desc: string;
  img: string;
  href: string;
};

type ApiBlog = {
  title: string;
  description: string;
  fileUrl: string;
  linkUrl: string;
};

type ApiYoutubeLink = {
  url: string;
};

function getYouTubeEmbedUrl(url: string) {
  const id =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)?.[1] ?? url;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

export function ServicesCmsContent() {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [bestEvents, setBestEvents] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContent() {
      try {
        const [blogsResponse, youtubeResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/api/blogs`, {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(`${apiBaseUrl}/api/youtube-links`, {
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);

        const apiBlogs: ApiBlog[] = blogsResponse.ok
          ? await blogsResponse.json()
          : [];
        const apiYoutubeLinks: ApiYoutubeLink[] = youtubeResponse.ok
          ? await youtubeResponse.json()
          : [];

        if (controller.signal.aborted) return;
        setBlogs(
          apiBlogs.map((blog) => ({
            title: blog.title,
            desc: blog.description,
            img: getFileUrl(blog.fileUrl),
            href: blog.linkUrl,
          })),
        );
        setBestEvents(apiYoutubeLinks.map((link) => link.url));
      } catch {
        if (controller.signal.aborted) return;
        setBlogs([]);
        setBestEvents([]);
      }
    }

    void loadContent();
    return () => controller.abort();
  }, []);

  return (
    <>
      <Reveal className="mx-auto mt-16 w-full max-w-[1200px] md:mt-24 min-[1920px]:mt-32">
        <h2 className="text-center font-display text-xl font-bold leading-[130%] text-navy md:text-3xl min-[1920px]:text-4xl">
          Read Our Latest Blog &amp; Article
        </h2>
        <p className="mx-auto mt-4 max-w-5xl text-center font-display text-sm font-medium leading-[140%] text-graphite md:mt-6 md:text-lg min-[1920px]:text-xl">
          Temukan berbagai artikel terbaru seputar standar kebersihan dan tips
          operasional kami sebagai panduan cerdas dalam menghadirkan solusi
          layanan yang efektif bagi kenyamanan ruang kerja Anda.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3 min-[1920px]:mt-16 min-[1920px]:gap-8">
          {blogs.map((blog) => (
            <article key={blog.title} className="flex flex-col">
              <div className="relative mx-auto aspect-4/5 w-[88%] bg-brand">
                <Image
                  src={blog.img}
                  alt={blog.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mx-auto flex w-[88%] flex-1 flex-col gap-1.5 pt-3 md:pt-4">
                <h3 className="font-display text-base font-medium text-navy md:text-lg min-[1920px]:text-xl">
                  {blog.title}
                </h3>
                <p className="font-sans text-xs font-normal leading-[150%] text-graphite md:text-sm">
                  {blog.desc}
                </p>
                <a
                  href={blog.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center gap-1 pt-2 font-sans text-xs font-medium text-info transition-opacity hover:opacity-80 md:text-sm"
                >
                  Baca selengkapnya
                  <ChevronRight
                    className="size-3 translate-y-0.5 md:size-3.5"
                    aria-hidden
                  />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal
        className="mx-auto mt-16 w-full max-w-[1200px] md:mt-24 min-[1920px]:mt-32"
        delay={120}
      >
        <h2 className="text-center font-display text-xl font-bold leading-[130%] text-navy md:text-3xl min-[1920px]:text-4xl">
          Best Event
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center font-display text-sm font-medium leading-[140%] text-graphite md:mt-6 md:text-lg min-[1920px]:text-xl">
          Kilas balik momen terbaik Esensi Indonesia dan komitmen kami dalam
          menghadirkan pelayanan prima.
        </p>

        <div className="mx-auto mt-10 grid w-full max-w-[1080px] gap-6 md:grid-cols-2 min-[1920px]:mt-16 min-[1920px]:gap-8">
          {bestEvents.map((url, i) => (
            <div
              key={url}
              className="relative aspect-video overflow-hidden rounded-xl bg-esensi-dark"
            >
              <iframe
                src={getYouTubeEmbedUrl(url)}
                title={`Best Event video ${i + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}
