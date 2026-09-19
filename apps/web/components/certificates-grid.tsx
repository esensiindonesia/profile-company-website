"use client";

import { useEffect, useState } from "react";
import { apiBaseUrl } from "@/lib/api";
import { CertificateCard } from "@/components/certificate-card";
import { Reveal } from "@/components/reveal";
import { getFileUrl } from "@/lib/files";

type CertificateCardData = {
  title: string;
  img: string;
  fallbackOrientation: "portrait" | "landscape";
};

type ApiCertificate = {
  title: string;
  fileUrl: string;
};

export function CertificatesGrid() {
  const [certificates, setCertificates] = useState<CertificateCardData[]>([]);

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
              fallbackOrientation: "portrait" as const,
            })),
          );
        }
      })
      .catch(() => {
        // The CMS is the only source for certificate content.
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
