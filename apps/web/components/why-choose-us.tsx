import Image from "next/image";

import { Reveal } from "@/components/reveal";

function Feature({
  iconSrc,
  title,
  description,
}: {
  iconSrc: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center md:gap-3 min-[1920px]:gap-4">
      <Image
        src={iconSrc}
        alt=""
        width={120}
        height={120}
        unoptimized
        className="size-16 md:size-20 min-[1920px]:size-24"
      />
      <h3 className="font-display text-lg font-bold leading-[130%] text-esensi md:text-xl min-[1920px]:text-2xl">
        {title}
      </h3>
      <p className="font-body text-[13px] font-normal leading-[125%] text-graphite md:text-sm min-[1920px]:text-base">
        {description}
      </p>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="bg-white pt-10 pb-16 md:pt-14 md:pb-20 min-[1920px]:pt-16 min-[1920px]:pb-24">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        <h2 className="text-center font-display text-2xl font-bold leading-[130%] text-esensi md:text-4xl min-[1920px]:text-5xl">
          Why Choose us?
        </h2>

        <div className="mx-auto mt-8 grid w-full max-w-[1100px] gap-10 sm:grid-cols-2 md:grid-cols-5 md:gap-4 min-[1920px]:mt-10 min-[1920px]:gap-4">
          <Reveal>
            <Feature
              iconSrc="/icons/RTM_awards(1).svg"
              title="Quality Oriented"
              description="Berorientasi pada hasil akhir yang sempurna dan standar kualitas yang ketat."
            />
          </Reveal>
          <Reveal delay={80}>
            <Feature
              iconSrc="/icons/RTM_saving.svg"
              title="Competitive Price"
              description="Efisiensi biaya yang strategis tanpa mengorbankan kualitas layanan."
            />
          </Reveal>
          <Reveal delay={160}>
            <Feature
              iconSrc="/icons/RTM_working-hours.svg"
              title="Fast Response"
              description="Kecepatan dalam berkomunikasi dan bertindak saat beroperasional."
            />
          </Reveal>
          <Reveal delay={240}>
            <Feature
              iconSrc="/icons/RTM-_Involved.svg"
              title="Transparent"
              description="Kami menjunjung tinggi integritas melalui keterbukaan informasi"
            />
          </Reveal>
          <Reveal delay={320}>
            <Feature
              iconSrc="/icons/RTM_architect.svg"
              title="Professional"
              description="Dikelola tenaga ahli yang kompeten, menjamin etika kerja dan profesionalisme"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
