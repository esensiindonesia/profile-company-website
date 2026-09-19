import { CertificatesGrid } from "@/components/certificates-grid";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";


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

        <CertificatesGrid />
      </div>
    </section>
  );
}
