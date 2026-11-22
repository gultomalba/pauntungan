import Header from "@/components/Header";
import ProductCatalog from "@/components/ProductCatalog";
import HowItWorks from "@/components/HowItWorks";
import Guarantee from "@/components/Guarantee";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <section className="bg-gradient-to-b from-emerald-50 to-slate-50">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Patungan langganan premium, bayar bagianmu saja
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Pilih layanan, pesan kursimu, dan bayar lewat QRIS atau Virtual Account.
              Akses dikirim setelah grup terisi dan diaktifkan.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#katalog" className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">
                Lihat semua layanan
              </a>
              <a href="#cara-kerja" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-emerald-600">
                Cara kerja
              </a>
            </div>
          </div>
        </section>

        <ProductCatalog />
        <HowItWorks />
        <Guarantee />
      </main>
      <Footer />
    </div>
  );
}