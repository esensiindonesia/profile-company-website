import Image from "next/image";
import Link from "next/link";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

const FOOTER_PAGES = [
  { label: "Home", href: "/" },
  { label: "Our Service", href: "/services" },
  { label: "Certificate", href: "/certificates" },
  { label: "Career", href: "/career" },
];

const OFFICES = [
  {
    name: "Jakarta Office",
    address:
      "Jl. Jatiwaringin No.5 Kel. Cipinang Melayu, Kec. Makasar, Jakarta Timur, 13620",
    phone: "Phone: 021 - 22862592",
  },
  {
    name: "Bandung Office",
    address:
      "[HQ] Puteraco Gading Regency, Blok B1 No. 7, Jl. Soekarno Hatta, Bandung 40293",
    phone: "Phone: 022 - 87356254",
  },
  {
    name: "Semarang Office",
    address:
      "Perum Korpri Sambiroto Asri\nJl. Kencur III RT.08 / RW.08 Kel Sambiroto Kec. Tembalang, Kota Semarang 50276",
    phone: "",
  },
];

const SOCIALS = [
  {
    label: "Facebook",
    src: "/icons/gold-fb.svg",
    w: 23,
    h: 23,
    href: "https://www.facebook.com/share/1CswUfjzDk/",
  },
  {
    label: "Instagram",
    src: "/icons/gold-ig.svg",
    w: 23,
    h: 23,
    href: "https://www.instagram.com/esensi.indonesia?igsi=MXE5ZzR5cThtbHVldg==",
  },
  {
    label: "YouTube",
    src: "/icons/gold-yt.svg",
    w: 28,
    h: 22,
    href: "https://youtube.com/@esensiindonesia8340?si=0NE_wxHw8tYIsrPX",
  },
  {
    label: "LinkedIn",
    src: null,
    w: 0,
    h: 0,
    href: "https://id.linkedin.com/company/esensi-indonesia",
  },
];

function ContactItem({
  iconSrc,
  title,
  children,
}: {
  iconSrc: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 md:gap-4">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-esensi md:size-9 min-[1920px]:size-10">
        <Image
          src={iconSrc}
          alt=""
          width={38}
          height={34}
          unoptimized
          className="size-3 md:size-3.5 min-[1920px]:size-4"
        />
      </div>
      <div className="flex flex-col gap-0.5 md:gap-1">
        <h3 className="font-display text-sm font-medium leading-[140%] text-esensi md:text-base min-[1920px]:text-lg">
          {title}
        </h3>
        <div className="text-[11px] font-normal text-esensi md:text-xs">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative scroll-mt-20 flow-root bg-esensi pt-0 md:scroll-mt-24 md:pt-16 min-[1920px]:scroll-mt-28 min-[1920px]:pt-20"
    >
      {/* Part 1: yellow contact bar overlapping the body above */}
      <div className="relative z-10 -mt-24 px-4 md:absolute md:inset-x-0 md:top-0 md:mt-0 md:-translate-y-1/2 md:px-6">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-3 rounded-xl bg-golden p-4 shadow-md md:flex-row md:items-start md:justify-between md:gap-4 md:p-4 min-[1920px]:p-5">
          <ContactItem iconSrc="/icons/gold-phone.svg" title="Phone Number">
            02287356254
            <br />
            082118876689
          </ContactItem>
          <ContactItem iconSrc="/icons/gold-location.svg" title="Location">
            <span className="block max-w-[200px] md:max-w-[240px]">
              [HQ] Puteraco Gading Regency Blok B1 No. 7, Cisaranten Endah,
              Arcamanik, Bandung City, West Java 40293
            </span>
          </ContactItem>
          <ContactItem iconSrc="/icons/gold-envelope.svg" title="Email">
            esensi.indonesia@yahoo.com
          </ContactItem>
        </div>
      </div>

      {/* Part 2: main blue footer */}
      <div className="mx-auto mt-4 w-full max-w-[800px] px-4 pb-8 sm:px-6 md:mt-0">
        <div className="grid gap-y-8 pt-0 md:grid-cols-[1.3fr_0.7fr_1fr] md:gap-x-0 md:pt-2">
          {/* Left: description + socials */}
          <div className="flex flex-col gap-4 md:pr-8">
            <p className="max-w-[260px] text-[11px] leading-[160%] text-white/90 md:text-xs min-[1920px]:text-[13px]">
              PT. ESENSI INDONESIA adalah sebuah perusahaan Perseroan Terbatas
              yang terdaftar dan berkantor pusat di Bandung – Indonesia.
              Jangkauan operasional kami kini telah meluas melalui Head Quarter
              di Bandung serta Branch Office di Jakarta dan Semarang.
            </p>
            <div className="flex gap-2 md:gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex size-7 items-center justify-center rounded-full border border-golden transition-opacity hover:opacity-80 md:size-8 min-[1920px]:size-9"
                >
                  {social.src ? (
                    <Image
                      src={social.src}
                      alt=""
                      width={social.w}
                      height={social.h}
                      unoptimized
                      className="size-3 md:size-3.5 min-[1920px]:size-4"
                    />
                  ) : (
                    <LinkedinIcon className="size-3 text-golden md:size-3.5 min-[1920px]:size-4" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Middle: Pages (kept toward the right edge of its track) */}
          <div className="md:mr-32 md:flex md:justify-end">
            <div className="flex flex-col gap-2 md:gap-3">
              <h3 className="text-xs font-bold leading-[150%] text-golden md:text-[13px] min-[1920px]:text-sm">
                Pages
              </h3>
              <div className="h-[1px] w-16 bg-golden md:w-24" />
              <ul className="flex flex-col gap-1">
                {FOOTER_PAGES.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="text-xs text-white transition-colors hover:text-golden md:text-[13px] min-[1920px]:text-sm"
                    >
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: offices */}
          <div className="flex flex-col gap-3 md:gap-4 md:pl-0">
            {OFFICES.map((office) => (
              <div key={office.name} className="flex flex-col gap-0.5">
                <h3 className="text-xs font-bold leading-[150%] text-golden md:text-[13px] min-[1920px]:text-sm">
                  {office.name}
                </h3>
                <p className="break-words text-[11px] leading-[150%] whitespace-pre-line text-white/90 md:text-xs min-[1920px]:text-[13px]">
                  {office.address}
                </p>
                {office.phone ? (
                  <p className="break-words text-[11px] leading-[150%] text-white/90 md:text-xs min-[1920px]:text-[13px]">
                    {office.phone}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div className="mt-6 border-t border-white/90 pt-4 md:mt-10">
          <div className="flex flex-col justify-between gap-2 text-xs text-white/90 md:flex-row md:items-center md:text-[13px] min-[1920px]:text-sm">
            <p className="break-words">
              Copyright © 2026 Esensi Indonesia All Rights Reserved.
            </p>
            <a href="#" className="transition-colors hover:text-golden">
              Privacy &amp; Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
