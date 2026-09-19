import Image from "next/image";

import { CareerQrCodes } from "@/components/career-qr-codes";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

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

export default function CareerPage() {

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
        <CareerQrCodes />

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
