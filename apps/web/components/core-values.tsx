import Image from "next/image";

import { Reveal } from "@/components/reveal";

function ValueItem({
  iconSrc,
  title,
  description,
}: {
  iconSrc: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 md:gap-5 min-[1920px]:gap-6">
      <Image
        src={iconSrc}
        alt=""
        width={100}
        height={100}
        unoptimized
        className="size-10 shrink-0 md:size-12 min-[1920px]:size-14"
      />
      <div className="flex flex-col gap-1 md:gap-2">
        <h3 className="font-display text-xl font-bold leading-[130%] text-white md:text-2xl min-[1920px]:text-[28px]">
          {title}
        </h3>
        <p className="font-display text-sm font-normal leading-[140%] text-white/90 md:text-base min-[1920px]:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

export function CoreValues() {
  return (
    <section className="flex items-center bg-esensi py-16 md:py-20 min-[1920px]:min-h-[618px] min-[1920px]:py-0">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        <div className="grid gap-y-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12 lg:gap-x-16 min-[1920px]:gap-x-24 min-[1920px]:gap-y-16">
          {/* Mobile order: Entrepreneurship, Safety First, Enhance Value Added, Natural & Comfort, Solutive, Quality Improvement */}
          <Reveal className="order-1 md:order-0">
            <ValueItem
              iconSrc="/icons/RTM-_happy-students.svg"
              title="Entrepreneurship"
              description="Kami menanamkan jiwa kewirausahaan dan inisiatif tinggi dalam setiap anggota tim."
            />
          </Reveal>
          <Reveal delay={80} className="order-4 md:order-0">
            <ValueItem
              iconSrc="/icons/RTM_gloves.svg"
              title="Natural & Comfort"
              description="Menciptakan lingkungan yang higienis dan nyaman bagi kenyamanan pengguna."
            />
          </Reveal>
          <Reveal delay={160} className="order-2 md:order-0">
            <ValueItem
              iconSrc="/icons/RTM_shield-check.svg"
              title="Safety First"
              description="Keselamatan adalah prioritas mutlak di setiap operasional kami."
            />
          </Reveal>
          <Reveal delay={240} className="order-5 md:order-0">
            <ValueItem
              iconSrc="/icons/RTM_checkmark-circle.svg"
              title="Solutive"
              description="Hadir sebagai solusi tangkas untuk setiap tantangan operasional Anda."
            />
          </Reveal>
          <Reveal delay={320} className="order-3 md:order-0">
            <ValueItem
              iconSrc="/icons/RTM_awards.svg"
              title="Enhance Value Added"
              description="Kami berkomitmen memberikan nilai tambah nyata bagi bisnis Anda."
            />
          </Reveal>
          <Reveal delay={400} className="order-6 md:order-0">
            <ValueItem
              iconSrc="/icons/RTM_chart.svg"
              title="Quality Improvement"
              description="Inovasi berkelanjutan adalah napas dalam setiap proses kerja kami."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
