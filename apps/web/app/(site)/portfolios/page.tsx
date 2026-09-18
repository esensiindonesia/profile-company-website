import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectorCard } from "@/components/sector-card";
import { CoverageMap } from "@/components/coverage-map";
import { whatsappContactUrl } from "@/lib/contact";

const SECTORS_ROW_1 = [
  { label: "Hospital & Healthcare", img: "/industry-1.png" },
  { label: "Manufacturing", img: "/industry-2.png" },
  { label: "Hospitality & Apartment", img: "/industry-3.png" },
  { label: "Retail", img: "/industry-4.png" },
];

const SECTORS_ROW_2 = [
  { label: "Education", img: "/industry-5.png" },
  { label: "Financial Institution", img: "/industry-6.png" },
  { label: "Building & Commercial Property", img: "/industry-7.png" },
  { label: "Home Cleaning", img: "/industry-8.png" },
  { label: "Security", img: "/industry-9.png" },
];

export default function PortfoliosPage() {
  return (
    <section className="bg-white pt-4 md:pt-10 min-[1920px]:pt-10">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        <Reveal>
          <PageHeader
            title="Our Industry Sectors"
            subtitle="Sektor yang bekerja sama dengan Esensi Indonesia"
          />
        </Reveal>

        <div className="mx-auto mt-10 w-full max-w-[1200px] md:mt-10 min-[1920px]:mt-16">
          {/* Top row: 4 cards */}
          <div className="flex flex-wrap justify-center gap-6 min-[1920px]:gap-8">
            {SECTORS_ROW_1.map((sector, index) => (
              <Reveal
                key={sector.label}
                delay={index * 70}
                className="w-[calc(50%-0.75rem)] min-w-0 sm:w-[170px] md:w-[205px] min-[1920px]:w-[220px]"
              >
                <SectorCard img={sector.img} label={sector.label} />
              </Reveal>
            ))}
          </div>
          {/* Bottom row: 5 cards */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 min-[1920px]:mt-8 min-[1920px]:gap-8">
            {SECTORS_ROW_2.map((sector, index) => (
              <Reveal
                key={sector.label}
                delay={(index + 4) * 70}
                className="w-[calc(50%-0.75rem)] min-w-0 sm:w-[170px] md:w-[205px] min-[1920px]:w-[220px]"
              >
                <SectorCard img={sector.img} label={sector.label} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* District Coverage section */}
        <div className="mx-auto mt-16 w-full max-w-[1200px] md:mt-24 min-[1920px]:mt-32">
          <h2 className="text-center font-display text-2xl font-bold leading-[130%] text-navy md:text-4xl min-[1920px]:text-5xl">
            District Coverage
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center font-display text-sm font-medium leading-[140%] text-graphite md:mt-6 md:text-lg min-[1920px]:text-xl">
            Esensi memiliki 3 cakupan utama area, arahkan kursor untuk melihat
            detail area setiap wilayah
          </p>
          <Reveal delay={180}>
            <CoverageMap />
          </Reveal>
        </div>
      </div>

      {/* CTA banner: full page width */}
      <div className="mt-16 flex w-full flex-col items-center gap-3 bg-[#93ADD4] px-6 pt-12 pb-16 text-center md:mt-24 md:gap-4 md:pt-16 md:pb-24 min-[1920px]:mt-32 min-[1920px]:gap-5 min-[1920px]:pt-20 min-[1920px]:pb-32">
        <h2 className="font-display text-xl font-bold leading-[130%] text-navy md:text-3xl min-[1920px]:text-4xl">
          Konsultasi dan Schedule sekarang!
        </h2>
        <p className="max-w-2xl font-display text-sm font-medium leading-[150%] text-white md:text-lg min-[1920px]:text-xl">
          Esensi Indonesia siap bekerja sama dengan bisnis anda untuk
          menciptakan lingkungan yang bersih dan nyaman.
        </p>
        <a
          href={whatsappContactUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex cursor-pointer rounded-[14px] bg-esensi px-8 py-2 text-center font-display text-sm font-medium text-white transition-colors hover:bg-esensi-light md:px-10 md:py-2.5 md:text-base min-[1920px]:px-12 min-[1920px]:py-3 min-[1920px]:text-lg"
        >
          KONSULTASI SEKARANG
        </a>
      </div>
    </section>
  );
}
