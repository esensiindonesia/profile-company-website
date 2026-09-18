import Image from "next/image";

export function SectorCard({ img, label }: { img: string; label: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col">
      {/* Portrait photo (width < height) */}
      <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-brand">
        {img ? (
          <Image
            src={img}
            alt={label}
            fill
            sizes="(min-width: 768px) 220px, 170px"
            className="scale-110 object-cover"
          />
        ) : null}
      </div>
      {/* Yellow label raised over the photo, blue layer tucked behind
          with rounded bottom corners */}
      <div className="relative z-10 -mt-6">
        <div className="absolute inset-x-0 top-2 h-full rounded-b-lg bg-esensi" />
        <div className="relative flex min-h-12 items-center justify-center rounded-b-md bg-gold-med px-2 py-1.5 text-center md:min-h-14 md:py-2 min-[1920px]:min-h-15">
          <span className="font-display text-xs font-medium leading-[130%] text-esensi-darker md:text-[13px] min-[1920px]:text-sm">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
