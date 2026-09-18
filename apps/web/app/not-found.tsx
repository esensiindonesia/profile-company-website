import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-start justify-center gap-4 bg-esensi py-20 pl-8 pr-6 text-left md:gap-6 md:pl-48 min-[1920px]:gap-8 min-[1920px]:pl-48">
      <h1 className="font-display text-[110px] font-bold leading-[130%] text-golden md:text-[160px] min-[1920px]:text-[200px]">
        404
      </h1>
      <h2 className="-mt-2 font-display text-2xl font-bold leading-[130%] text-white md:-mt-8 md:text-4xl min-[1920px]:-mt-10 min-[1920px]:text-5xl">
        Oops! Page Not Found
      </h2>
      <p className="max-w-md text-xs font-normal leading-[150%] text-offwhite md:text-sm">
        The link you followed may be broken, or the page has been removed.
        Please navigate back to discover more with Esensi Indonesia.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2.5 rounded-[14px] bg-golden px-6 py-3 text-xs font-medium text-offwhite transition hover:brightness-110 md:text-sm"
      >
        Back to Home
      </Link>
    </section>
  );
}
