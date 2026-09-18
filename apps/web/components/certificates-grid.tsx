"use client";

import { useEffect, useState } from "react";
import { apiBaseUrl } from "@/lib/api";
import { CertificateCard } from "@/components/certificate-card";
import { Reveal } from "@/components/reveal";
import { getFileUrl } from "@/lib/files";

export type CertificateCardData = {
  title: string;
  img: string;
  orientation: "portrait" | "landscape";
};

type ApiCertificate = {
  title: string;
  fileUrl: string;
};

export function CertificatesGrid({
  fallback,
}: {
  fallback: CertificateCardData[];
}) {
  const [certificates, setCertificates] = useState(fallback);

  useEffect(() => {
    const controller = new AbortController();

    void fetch(`${apiBaseUrl}/api/certificates`, { signal: controller.signal })
      .then(async (res) =>
        res.ok ? ((await res.json()) as ApiCertificate[]) : [],
      )
      .then((certs) => {
        if (certs.length > 0) {
          setCertificates(
            certs.map((cert) => ({
              title: cert.title,
              img: getFileUrl(cert.fileUrl),
              orientation: "portrait" as const,
            })),
          );
        }
      })
      .catch(() => {
        // Keep the bundled fallback when the public API is unavailable.
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="mx-auto mt-10 flex w-full max-w-[1200px] flex-wrap justify-center gap-y-16 md:mt-16 min-[1920px]:mt-20">
      {certificates.map((cert, index) => (
        <Reveal
          key={cert.title}
          delay={index * 60}
          className="w-full sm:w-1/2 md:w-1/3"
        >
          <CertificateCard {...cert} />
        </Reveal>
      ))}
    </div>
  );
}
