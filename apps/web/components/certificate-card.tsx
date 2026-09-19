"use client";

import { useState } from "react";

export function CertificateCard({
  title,
  img,
  fallbackOrientation = "portrait",
}: {
  title: string;
  img: string;
  fallbackOrientation?: "portrait" | "landscape";
}) {
  const [orientation, setOrientation] = useState<
    "portrait" | "landscape"
  >(fallbackOrientation);
  const [imageReady, setImageReady] = useState(false);

  return (
    <div className="mx-auto flex h-full w-full max-w-[320px] flex-col">
      <div
        className={`relative z-10 mx-auto w-[85%] ${
          orientation === "portrait" ? "aspect-7/10" : "aspect-16/10"
        }`}
      >
        {/* Plain img: fileUrl is remote (R2 via API), outside next/image
            remotePatterns, and orientation needs onLoad measurement. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={title}
          onLoad={(e) => {
            const el = e.currentTarget;
            if (el.naturalWidth > 0 && el.naturalHeight > 0) {
              setOrientation(
                el.naturalHeight > el.naturalWidth ? "portrait" : "landscape",
              );
            }
            setImageReady(true);
          }}
          onError={() => setImageReady(true)}
          className="absolute inset-0 h-full w-full object-contain"
        />
        {imageReady ? (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center whitespace-nowrap font-display font-bold -rotate-45 text-[#010F34] opacity-30 ${
              orientation === "landscape"
                ? "text-xl md:text-2xl min-[1920px]:text-2xl"
                : "text-3xl md:text-4xl min-[1920px]:text-5xl"
            }`}
          >
            Esensi Indonesia
          </span>
        ) : null}
      </div>
      <div className="relative z-0 -mt-12 flex flex-1 flex-col justify-end rounded-2xl bg-esensi px-4 pt-14 pb-4 md:px-5 md:pt-16 md:pb-5">
        <div className="rounded-md bg-golden px-3 py-0.5 text-center md:py-1">
          <span className="font-display text-base font-medium leading-none text-navy md:text-lg">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
