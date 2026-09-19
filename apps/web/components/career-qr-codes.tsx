"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/reveal";
import { apiBaseUrl } from "@/lib/api";
import { getFileUrl } from "@/lib/files";

type CareerQrArea = {
  title: string;
  img: string;
};

type ApiCareerQrCode = {
  area: string;
  fileUrl: string;
};

async function fetchCareerQrAreas(): Promise<CareerQrArea[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/career/qr-codes`, {
      cache: "no-store",
    });
    if (!response.ok) return [];

    const qrCodes: ApiCareerQrCode[] = await response.json();
    return qrCodes.map((qrCode) => ({
      title: qrCode.area,
      img: getFileUrl(qrCode.fileUrl),
    }));
  } catch {
    return [];
  }
}

export function CareerQrCodes() {
  const [qrAreas, setQrAreas] = useState<CareerQrArea[]>([]);

  useEffect(() => {
    let active = true;
    void fetchCareerQrAreas().then((areas) => {
      if (active) setQrAreas(areas);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Reveal
      delay={100}
      className="relative mx-auto mt-10 w-full max-w-[780px] md:mt-14 min-[1920px]:mt-16"
    >
      <div className="absolute top-1/2 left-1/2 h-24 w-screen -translate-x-1/2 -translate-y-1/2 bg-golden md:h-28" />
      <div className="relative flex flex-wrap justify-center gap-2 md:gap-3">
        {qrAreas.map((area) => (
          <div
            key={area.title}
            className="mx-auto w-full max-w-[220px] rounded-2xl bg-esensi p-4 md:p-5"
          >
            <Image
              src={area.img}
              alt={`QR code ${area.title}`}
              width={352}
              height={352}
              sizes="(min-width: 768px) 200px, 90vw"
              className="mx-auto h-auto w-full max-w-[180px] rounded-lg"
            />
            <div className="mx-auto mt-3 max-w-[180px] rounded-md bg-golden px-3 py-0.5 text-center md:py-1">
              <span className="font-display text-sm font-medium leading-none text-navy md:text-base">
                {area.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
