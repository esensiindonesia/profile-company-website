import Image from "next/image";

import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { apiBaseUrl } from "@/lib/api";
import { getFileUrl } from "@/lib/files";

/*
 * Data-driven: later these image paths come from the CMS (S3 URLs) without
 * touching the markup below.
 */
type CareerQrArea = {
  title: string;
  img: string;
};

const QR_AREAS: CareerQrArea[] = [
  { title: "Jawa Barat Area", img: "/career/qr-1.png" },
  { title: "Jakarta Area", img: "/career/qr-2.png" },
  { title: "Jawa Tengah Area", img: "/career/qr-3.png" },
];

const STEPS = [
  { img: "/career-1.png", text: "Scan link yang sudah ditampilkan diatas" },
  {
    img: "/career-2.png",
    text: "Isi form sesuai dengan data diri dan pengalaman",
  },
  {
    img: "/career-3.png",
    text: "Jika sesuai kualifikasi, akan dihubungi oleh tim rekrutmen kami",
  },
];

type ApiCareerQrCode = {
  area: string;
  fileUrl: string;
};

async function fetchCareerQrAreas(): Promise<CareerQrArea[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/career/qr-codes`, {
      cache: "no-store",
    });
    if (!response.ok) return QR_AREAS;

    const qrCodes: ApiCareerQrCode[] = await response.json();
    return qrCodes.length
      ? qrCodes.map((qrCode) => ({
          title: qrCode.area,
          img: getFileUrl(qrCode.fileUrl),
        }))
      : QR_AREAS;
  } catch {
    return QR_AREAS;
  }
}

export default async function CareerPage() {
  const qrAreas = await fetchCareerQrAreas();

  return (
    <section className="bg-white pt-4 pb-32 md:pt-10 md:pb-24 min-[1920px]:pt-10 min-[1920px]:pb-32">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        <Reveal>
          <PageHeader
            title="Career"
            subtitle="Esensi Indonesia memberikan informasi seputar lowongan pekerjaan melalui media sosial. Upload CV dan Pengalaman terbaikmu disini!"
          />
        </Reveal>

        {/* Part 1: QR cards over a full-width yellow band */}
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

        {/* Part 2: bordered box with 3 logo circles + steps */}
        <Reveal
          delay={180}
          className="mx-auto mt-16 w-full max-w-[1000px] rounded-2xl border border-graphite bg-white px-6 py-10 md:mt-24 md:py-14 min-[1920px]:mt-32"
        >
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step) => (
              <div
                key={step.img}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="flex size-24 items-center justify-center rounded-full bg-golden md:size-28">
                  <div className="flex size-20 items-center justify-center rounded-full bg-esensi md:size-24">
                    <Image
                      src={step.img}
                      alt=""
                      width={128}
                      height={128}
                      className="size-14 md:size-16"
                    />
                  </div>
                </div>
                <p className="max-w-xs font-display text-sm font-medium leading-[140%] text-graphite md:text-base">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
