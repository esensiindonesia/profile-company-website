import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { whatsappContactUrl } from "@/lib/contact";

export function Hero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-brand sm:min-h-[620px] lg:min-h-[700px] min-[1920px]:min-h-[832px]">
      <Image
        src="/homepage-mobile.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-white/15" />
      <Reveal className="absolute inset-0">
        <div className="flex h-full flex-col justify-center gap-5 px-6 py-20 sm:py-24 md:gap-8 md:px-24 lg:px-32 min-[1920px]:px-[178px]">
          <h1 className="max-w-4xl font-display text-3xl font-bold leading-[130%] text-balance text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] sm:text-4xl md:text-[40px] min-[1920px]:text-[60px]">
            Empowering Local Excellence,
            <br />
            Delivering World Class Facility Service
          </h1>
          <p className="max-w-4xl font-display text-base font-medium leading-[140%] text-offwhite sm:text-lg md:text-[20px] min-[1920px]:text-[30px]">
            Berpengalaman sejak 2010, Esensi Group adalah mitra Local Facility
            Services lokal berstandar internasional. Kami memadukan solusi
            operasional terbaik dengan efisiensi biaya untuk mendorong
            pertumbuhan bisnis Anda.
          </p>
          <div>
            <a
              href={whatsappContactUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-full max-w-64 items-center justify-center rounded-[10px] bg-brand px-5 font-display text-base leading-[130%] text-white transition-colors hover:bg-brand/90 sm:w-auto md:text-lg min-[1920px]:h-11 min-[1920px]:max-w-[332px] min-[1920px]:rounded-[14px] min-[1920px]:px-8 min-[1920px]:text-xl"
            >
              KONSULTASI SEKARANG
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
