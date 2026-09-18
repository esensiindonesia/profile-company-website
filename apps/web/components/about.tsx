import Image from "next/image";

import { Reveal } from "@/components/reveal";

function InfoCard({
  iconSrc,
  title,
  description,
}: {
  iconSrc: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full items-center gap-4 rounded-2xl bg-card-soft p-6 md:gap-6 md:p-8 min-[1920px]:p-10">
      <Image
        src={iconSrc}
        alt=""
        width={105}
        height={105}
        unoptimized
        className="size-12 shrink-0 md:size-14 min-[1920px]:size-16"
      />
      <div className="flex flex-col gap-1 min-[1920px]:gap-2">
        <h3 className="font-display text-2xl font-bold leading-[130%] text-esensi md:text-3xl min-[1920px]:text-[40px]">
          {title}
        </h3>
        <p className="font-display text-base font-medium leading-[140%] text-graphite md:text-lg min-[1920px]:text-xl">
          {description}
        </p>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section className="bg-white py-16 md:py-24 min-[1920px]:py-32">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        {/* Top: photo + intro text */}
        <Reveal>
          <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-12 min-[1920px]:gap-16">
            <Image
              src="/homepage-2.png"
              alt="Esensi Indonesia team"
              width={624}
              height={371}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full rounded-2xl"
            />
            <div className="flex flex-col gap-4 md:gap-6 min-[1920px]:gap-8">
              <h2 className="font-display text-2xl font-bold leading-[130%] text-esensi md:text-4xl min-[1920px]:text-5xl">
                About Esensi Indonesia
              </h2>
              <p className="font-display text-base font-medium leading-[140%] text-graphite md:text-xl min-[1920px]:text-2xl">
              	Sejak Oktober 2010, Esensi Indonesia telah membuktikan konsistensinya sebagai mitra strategis Facility Services selama 16 tahun. Kepercayaan para mitra kami kini digerakkan oleh lebih dari 1.000 tenaga profesional yang berdedikasi demi menghadirkan layanan yang sigap dan responsif. Jangkauan operasional kami kini telah meluas melalui Head Quarter di Bandung serta Branch Office di Jakarta dan Semarang.	
              </p>
            </div>
          </div>
        </Reveal>

        {/* Vision & Mission cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8 min-[1920px]:mt-20 min-[1920px]:gap-12">
          <Reveal delay={100}>
            <InfoCard
              iconSrc="/icons/vision.svg"
              title="Our Vision"
              description="Ingin dikenal dan diperhitungkan sebagai perusahaan jasa facility services lokal yang kredibel"
            />
          </Reveal>
          <Reveal delay={180}>
            <InfoCard
              iconSrc="/icons/mission.svg"
              title="Our Mission"
              description="Memberikan pelayanan yang luar biasa melalui karyawan (orang-orang) yang baik yang senantiasa menggunakan cara-cara yang benar dan SOP yang benar"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
