import {
  CertificatesGrid,
  type CertificateCardData,
} from "@/components/certificates-grid";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

// Fallback only — keeps the page alive when the API is unreachable. The real
// source of truth is GET /api/certificates (isVisible = true only).
const FALLBACK: CertificateCardData[] = [
  {
    title: "ISO 9001",
    img: "/certificate/sertif-10.jpg",
    orientation: "portrait",
  },
  {
    title: "ISO 14001",
    img: "/certificate/sertif-2.png",
    orientation: "portrait",
  },
  {
    title: "ISO 45001",
    img: "/certificate/sertif-3.png",
    orientation: "portrait",
  },
  {
    title: "BNSP 1",
    img: "/certificate/sertif-4.png",
    orientation: "portrait",
  },
  {
    title: "BNSP 2",
    img: "/certificate/sertif-5.png",
    orientation: "portrait",
  },
  {
    title: "BNSP 3",
    img: "/certificate/sertif-6.png",
    orientation: "portrait",
  },
  {
    title: "K3 BIDANG KONSTRUKSI",
    img: "/certificate/sertif-7.png",
    orientation: "landscape",
  },
  // {
  //   title: "K3 TKPK",
  //   img: "/certificate/sertif-8.png",
  //   fallbackOrientation: "landscape",
  // },
  {
    title: "ABUJAPI INDONESIA",
    img: "/certificate/sertif-9.png",
    orientation: "landscape",
  },
];

export default function CertificatesPage() {
  return (
    <section className="bg-white pt-4 pb-32 md:pt-10 md:pb-24 min-[1920px]:pt-10 min-[1920px]:pb-32">
      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-12 min-[1920px]:px-24">
        <Reveal>
          <PageHeader
            title="Our Certificates"
            subtitle="Memenuhi standar internasional yang diakui secara global dalam tata kelola, kualitas produk atau jasa, keselamatan kerja, atau pengelolaan lingkungan."
          />
        </Reveal>

        <CertificatesGrid fallback={FALLBACK} />
      </div>
    </section>
  );
}
