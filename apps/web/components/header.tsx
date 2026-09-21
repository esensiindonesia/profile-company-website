"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Certificates", href: "/certificates" },
  { label: "Our Portfolios", href: "/portfolios" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "#site-footer" },
] as const;

const PHONE_NUMBER = "02287356254";
const EMAIL_ADDRESS = "esensi.indonesia@yahoo.com";
const CONTACT_TEXT =
  "text-[11px] font-normal leading-normal text-white lg:text-xs min-[1920px]:text-sm";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-20 w-full bg-esensi/95 backdrop-blur-md md:h-24 min-[1920px]:h-28">
      {/* Top bar: logo | contact info | socials */}
      <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-4 pl-6 pr-4 md:pl-10 md:pr-6 min-[1920px]:pl-14 min-[1920px]:pr-10">
        <Image
          src="/logo-white.png"
          alt="Esensi Indonesia"
          width={194}
          height={37}
          className="h-auto w-[115px] max-w-none justify-self-start md:w-[165px] min-[1920px]:w-[200px]"
        />

        {/* Contact info (hidden on smaller screens) */}
        <div className="hidden items-center justify-self-center gap-4 lg:flex xl:gap-6 min-[1920px]:gap-10">
          <div className="flex items-center gap-2 xl:-translate-y-1 min-[1920px]:gap-2.5 min-[1920px]:-translate-y-1.5">
            <Image
              src="/icons/RTM_location.svg"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="size-5 shrink-0 md:size-6 min-[1920px]:size-7"
            />
            <span className={CONTACT_TEXT}>
              [HQ] Puteraco Gading Regency Blok B1 No. 7,
              <br />
              Cisaranten Endah, Arcamanik, Bandung City, West Java 40293
            </span>
          </div>

          <div className="flex items-center gap-2 min-[1920px]:gap-2.5">
            <Image
              src="/icons/RTM_classic-phone.svg"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="size-5 shrink-0 md:size-6 min-[1920px]:size-7"
            />
            <a
              href={`tel:${PHONE_NUMBER}`}
              className={`${CONTACT_TEXT} whitespace-nowrap transition-colors hover:text-gold`}
            >
              {PHONE_NUMBER}
            </a>
          </div>

          <div className="flex items-center gap-2 min-[1920px]:gap-2.5">
            <Image
              src="/icons/RTM_envelope.svg"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="size-5 shrink-0 md:size-6 min-[1920px]:size-7"
            />
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className={`${CONTACT_TEXT} whitespace-nowrap transition-colors hover:text-gold`}
            >
              {EMAIL_ADDRESS}
            </a>
          </div>
        </div>

        {/* Socials */}
        <div className="flex items-center justify-self-end gap-2 lg:gap-3 min-[1920px]:gap-4">
          <a
            href="https://www.facebook.com/share/1CswUfjzDk/"
            aria-label="Facebook"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/icons/fb.svg"
              alt=""
              width={23}
              height={23}
              unoptimized
              className="size-5 md:size-6 min-[1920px]:size-7"
            />
          </a>
          <a
            href="https://www.instagram.com/esensi.indonesia?igsi=MXE5ZzR5cThtbHVldg=="
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/icons/ig.svg"
              alt=""
              width={23}
              height={23}
              unoptimized
              className="size-5 md:size-6 min-[1920px]:size-7"
            />
          </a>
          <a
            href="https://youtube.com/@esensiindonesia8340?si=0NE_wxHw8tYIsrPX"
            aria-label="YouTube"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/icons/yt.svg"
              alt=""
              width={23}
              height={23}
              unoptimized
              className="size-5 md:size-6 min-[1920px]:size-7"
            />
          </a>
        </div>
      </div>

      {/* Nav pill: sits half inside the blue bar, half hanging below it */}
      <nav
        aria-label="Main navigation"
        className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center px-4"
      >
        <ul className="no-scrollbar flex h-7 max-w-full items-center gap-6 overflow-x-auto rounded-[10px] bg-gold px-4 shadow-md md:h-8 md:gap-10 md:px-8 min-[1920px]:h-9 min-[1920px]:gap-15 min-[1920px]:px-15 min-[1920px]:rounded-[14px]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-[11px] font-medium leading-[150%] transition-colors hover:text-brand md:text-[13px] min-[1920px]:text-sm ${
                    isActive ? "text-brand" : "text-navy"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
