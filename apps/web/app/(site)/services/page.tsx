import Image from "next/image";
import { ChevronRight } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { apiBaseUrl } from "@/lib/api";
import { getFileUrl } from "@/lib/files";

const SERVICES = [
  {
    title: "Cleaning & Environmental Services",
    img: "/service-1.png",
    items: [
      "Commercial & Event Cleaning",
      "Gardening & Landscape",
      "Residential Home Cleaning",
      "Facade Cleaning",
      "Pest Control",
    ],
  },
  {
    title: "Office Support Services",
    img: "/service-2.png",
    items: [
      "Driver",
      "Front Office",
      "Receptionist",
      "Pantry & Linen",
      "Call Center, Merchandiser, SPG",
      "Labour Handling & Management Supply",
    ],
  },
  {
    title: "Auxiliary Services",
    img: "/service-3.png",
    items: [
      "Training & Service School",
      "Washroom",
      "Cleaning Supplies & Equipment",
    ],
  },
  {
    title: "Security Services",
    img: "/service-4.png",
    items: [
      "Alpha 1 Security",
      "Security services to secure your business area.",
    ],
    badge: "ALPHA 1 SECURITY",
  },
];


// Best Event videos are embedded straight from YouTube, so no video files
// are stored on our server.
const BEST_EVENTS: string[] = [
  "https://youtu.be/8my9xB1rNj0?si=53Kp7yoxsYBWi6Au",
  "https://youtu.be/8OC1DBFTd6I?si=PdOsPOZPBRBsa9gD",
];

// Extracts the video ID from a YouTube URL and returns the embed URL.
function getYouTubeEmbedUrl(url: string) {
  const id =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)?.[1] ?? url;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

type ApiBlog = {
  title: string;
  description: string;
  fileUrl: string;
  linkUrl: string;
};

type ApiYoutubeLink = {
  url: string;
};

async function fetchServicesContent() {
  try {
    const [blogsResponse, youtubeResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/api/blogs`, { cache: "no-store" }),
      fetch(`${apiBaseUrl}/api/youtube-links`, { cache: "no-store" }),
    ]);

    const apiBlogs: ApiBlog[] = blogsResponse.ok
      ? await blogsResponse.json()
      : [];
    const apiYoutubeLinks: ApiYoutubeLink[] = youtubeResponse.ok
      ? await youtubeResponse.json()
      : [];

    return {
      blogs: apiBlogs.map((blog) => ({
        title: blog.title,
        desc: blog.description,
        img: getFileUrl(blog.fileUrl),
        href: blog.linkUrl,
      })),
      bestEvents: apiYoutubeLinks.length
        ? apiYoutubeLinks.map((link) => link.url)
        : BEST_EVENTS,
    };
  } catch {
    return { blogs: [], bestEvents: BEST_EVENTS };
  }
}

export default async function ServicesPage() {
  const { blogs, bestEvents } = await fetchServicesContent();

  return (
    <section className="bg-white pt-4 pb-32 md:pt-10 md:pb-24 min-[1920px]:pt-10 min-[1920px]:pb-32">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        <Reveal>
          <PageHeader
            title="Our Services"
            subtitle="Service terpercaya yang berdedikasi menjaga kualitas kebersihan, efesiensi dan keamanan kantor Anda dengan layanan yang transparan dan solutif."
          />
        </Reveal>

        <div className="mx-auto mt-10 grid w-full max-w-[1000px] gap-4 sm:grid-cols-2 lg:grid-cols-4 min-[1920px]:mt-16 min-[1920px]:gap-6">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 80} className="h-full">
              <div className="relative flex h-full flex-col">
                {/* Portrait photo: fixed size, cropped to fit */}
                <div className="relative aspect-3/4 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    sizes="(min-width: 768px) 25vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {/* Description: sharp top corners, stretches so every card
                  ends at the same bottom line */}
                <div className="relative z-10 -mt-14 flex flex-1 flex-col rounded-b-2xl rounded-t-none bg-esensi p-4 md:-mt-16 md:p-5">
                  <h3 className="font-display text-base font-semibold leading-[120%] text-white md:text-lg min-[1920px]:text-xl">
                    {service.title}
                  </h3>
                  <ul className="mt-1 flex flex-1 flex-col gap-0.5 md:mt-1.5">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="font-display text-[11px] leading-[140%] text-white/90 md:text-xs"
                      >
                        • {item}
                      </li>
                    ))}
                    {service.badge ? (
                      <li className="mt-auto flex justify-center pt-2 md:pt-3">
                        <span className="inline-flex whitespace-nowrap rounded-sm bg-gold px-6 py-0.5 font-display text-xs font-medium text-navy md:px-7 md:py-1 md:text-sm min-[1920px]:text-base">
                          {service.badge}
                        </span>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Blog section */}
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
                {/* Poster: no border, no rounding, slightly smaller */}
                <div className="relative mx-auto aspect-4/5 w-[88%] bg-brand">
                  <Image
                    src={blog.img}
                    alt={blog.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {/* Text sits outside the poster */}
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

        {/* Best Event section */}
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
      </div>
    </section>
  );
}
