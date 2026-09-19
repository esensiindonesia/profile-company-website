import Image from "next/image";

import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ServicesCmsContent } from "@/components/services-cms-content";

const SERVICES = [
  {
    title: "Cleaning & Environmental Services",
    img: "/service-1.png",
    items: [
      "Commercial & Event Cleaning",
      "Gardening & Landscape",
      "Residential Home Cleaning",
      "Facade Cleaning",
      "Pest Control",
    ],
  },
  {
    title: "Office Support Services",
    img: "/service-2.png",
    items: [
      "Driver",
      "Front Office",
      "Receptionist",
      "Pantry & Linen",
      "Call Center, Merchandiser, SPG",
      "Labour Handling & Management Supply",
    ],
  },
  {
    title: "Auxiliary Services",
    img: "/service-3.png",
    items: [
      "Training & Service School",
      "Washroom",
      "Cleaning Supplies & Equipment",
    ],
  },
  {
    title: "Security Services",
    img: "/service-4.png",
    items: [
      "Alpha 1 Security",
      "Security services to secure your business area.",
    ],
    badge: "ALPHA 1 SECURITY",
  },
];

export default function ServicesPage() {
  return (
    <section className="bg-white pt-4 pb-32 md:pt-10 md:pb-24 min-[1920px]:pt-10 min-[1920px]:pb-32">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        <Reveal>
          <PageHeader
            title="Our Services"
            subtitle="Service terpercaya yang berdedikasi menjaga kualitas kebersihan, efesiensi dan keamanan kantor Anda dengan layanan yang transparan dan solutif."
          />
        </Reveal>

        <div className="mx-auto mt-10 grid w-full max-w-[1000px] gap-4 sm:grid-cols-2 lg:grid-cols-4 min-[1920px]:mt-16 min-[1920px]:gap-6">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 80} className="h-full">
              <div className="relative flex h-full flex-col">
                {/* Portrait photo: fixed size, cropped to fit */}
                <div className="relative aspect-3/4 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    sizes="(min-width: 768px) 25vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {/* Description: sharp top corners, stretches so every card
                  ends at the same bottom line */}
                <div className="relative z-10 -mt-14 flex flex-1 flex-col rounded-b-2xl rounded-t-none bg-esensi p-4 md:-mt-16 md:p-5">
                  <h3 className="font-display text-base font-semibold leading-[120%] text-white md:text-lg min-[1920px]:text-xl">
                    {service.title}
                  </h3>
                  <ul className="mt-1 flex flex-1 flex-col gap-0.5 md:mt-1.5">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="font-display text-[11px] leading-[140%] text-white/90 md:text-xs"
                      >
                        • {item}
                      </li>
                    ))}
                    {service.badge ? (
                      <li className="mt-auto flex justify-center pt-2 md:pt-3">
                        <span className="inline-flex whitespace-nowrap rounded-sm bg-gold px-6 py-0.5 font-display text-xs font-medium text-navy md:px-7 md:py-1 md:text-sm min-[1920px]:text-base">
                          {service.badge}
                        </span>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <ServicesCmsContent />
      </div>
    </section>
  );
}
