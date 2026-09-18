import Image from "next/image";

import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    value: "q1",
    question: "Apa keunggulan utama Esensi Group?",
    answer:
      "Kami berpengalaman 15 tahun sebagai mitra facility services lokal dengan standar tinggi yang menawarkan efisiensi biaya serta layanan profesional yang transparan.",
  },
  {
    value: "q2",
    question: "Apa saja layanan yang tersedia?",
    answer: (
      <>
        <p>
          Kami menyediakan berbagai solusi facility services untuk mendukung
          kebersihan, efisiensi, dan keamanan area bisnis Anda, meliputi:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Cleaning &amp; Environmental Services</strong> (Pembersihan
            komersial, rumah, fasad, taman, hingga pest control).
          </li>
          <li>
            <strong>Office Support Services</strong> (Tenaga kerja pendukung
            seperti driver, resepsionis, pantry, hingga management supply).
          </li>
          <li>
            <strong>Auxiliary Services</strong> (Pelatihan, perlengkapan
            sanitasi, serta cleaning supplies &amp; equipment).
          </li>
          <li>
            <strong>Security Services</strong> (Pengamanan area bisnis melalui
            Alpha 1 Security).
          </li>
        </ul>
        <p className="mt-2">
          Informasi selengkapnya mengenai detail seluruh layanan dapat Anda
          lihat pada halaman &quot;Our Services&quot;.
        </p>
      </>
    ),
  },
  {
    value: "q3",
    question:
      "Apa saja yang perlu disiapkan untuk memesan jasa Esensi Indonesia?",
    answer:
      "Proses pemesanan dimulai dengan penjadwalan survey lokasi oleh tim Esensi Indonesia. Setelah itu, kami akan menyusun proposal penawaran yang disesuaikan dengan kebutuhan Anda, mencakup estimasi jumlah manpower (tenaga kerja), cakupan pekerjaan (scope of work), serta peralatan yang dibutuhkan.",
  },
  {
    value: "q4",
    question:
      "Dimana saya bisa menemukan informasi seputar lowongan kerja di Esensi Indonesia?",
    answer:
      "Informasi resmi mengenai lowongan kerja terbaru dapat Anda pantau secara berkala melalui akun Instagram resmi Esensi Indonesia (@esensi.indonesia).",
  },
];

export function Faq() {
  return (
    <section className="bg-white pt-12 pb-28 md:pt-16 md:pb-24 min-[1920px]:pt-24 min-[1920px]:pb-32">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        <div className="grid items-stretch gap-16 md:grid-cols-[2fr_3fr] md:gap-24 min-[1920px]:gap-32">
          {/* Left: tall gray pill spanning the full FAQ block height, with the
              representative floating IN FRONT of it (not inside a box). */}
          <Reveal className="h-auto pb-8 md:h-full md:pb-0">
            <div className="relative mx-auto h-[390px] w-full max-w-[469px] overflow-visible sm:h-[440px] md:h-full md:min-h-0">
              <div className="absolute inset-x-[14%] top-0 bottom-0 rounded-[56px] bg-faq-frame md:inset-x-[15%] md:-top-16 md:-bottom-24 md:rounded-[80px] min-[1920px]:-top-24 min-[1920px]:rounded-[110px]" />
              {/* Person: bottom-anchored, fixed size, fully backed by the pill */}
              <Image
                src="/faq.png"
                alt="Customer service Esensi Indonesia"
                width={503}
                height={835}
                sizes="(min-width: 768px) 340px, 80vw"
                className="absolute -bottom-24 left-1/2 h-auto w-[80%] -translate-x-1/2 sm:w-[74%] md:w-[70%]"
              />
              <div className="absolute top-4 right-0 z-10 flex items-center gap-3 rounded-2xl border-6 border-white bg-esensi-light p-3 md:-right-8 min-[1920px]:-right-12">
                <Image
                  src="/icons/RTM_classic-phone.svg"
                  alt=""
                  width={38}
                  height={34}
                  unoptimized
                  className="size-8 shrink-0 md:size-10"
                />
                <div className="flex flex-col">
                  <span className="font-display text-[12px] font-medium text-white/80 md:text-[13px] min-[1920px]:text-sm">
                    Ada pertanyaan?
                  </span>
                  <a
                    href="tel:02287356254"
                    className="font-display text-[13px] font-bold text-white md:text-sm min-[1920px]:text-base"
                  >
                    02287356254
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: heading + accordion */}
          <Reveal className="min-w-0" delay={120}>
            <div className="flex min-w-0 flex-col gap-6 md:gap-8 min-[1920px]:gap-10">
              <h2 className="font-display text-2xl font-normal leading-[130%] text-navy md:text-3xl min-[1920px]:text-4xl">
                FAQ Esensi Indonesia
              </h2>

              <Accordion defaultValue={["q1"]} className="gap-3">
                {FAQ_ITEMS.map((item) => (
                  <AccordionItem
                    key={item.value}
                    value={item.value}
                    className="not-last:border-b-0"
                  >
                    <AccordionTrigger className="min-w-0 cursor-pointer rounded-[2px] border border-esensi/40 bg-white px-4 py-4 font-display text-base font-normal leading-[140%] text-graphite aria-expanded:text-[#006FB9] hover:no-underline md:px-5 md:text-lg min-[1920px]:text-xl">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-3 pb-2 text-[10px] font-normal leading-[150%] text-graphite md:px-5 md:text-xs">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
