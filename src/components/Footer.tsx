import { Mail, MapPin, MessageCircle } from "lucide-react";
import { company, waLink } from "@/lib/company";

export default function Footer() {
  return (
    <>
      <section className="bg-emerald-600 py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Mulai patungan hari ini</h2>
          <p className="mt-2 text-emerald-50">Pilih layanan, pesan kursimu, dan bayar bagianmu saja.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#katalog" className="rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50">
              Pilih layanan
            </a>
            <a
              href={waLink("Halo pa(un)tungan, saya mau tanya soal patungan.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white px-6 py-3 font-semibold hover:bg-emerald-700"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-10 text-sm text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <div>
            <p className="text-lg font-extrabold text-white">
              pa<span className="text-emerald-400">(un)</span>tungan
            </p>
            <p className="mt-2 max-w-sm">Patungan langganan digital, pesan dulu, bayar bagianmu saja.</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-white">{company.legalName}</p>
            {company.nib && <p>NIB {company.nib}</p>}
            <p className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" />{company.address}</p>
            <p className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" />{company.email}</p>
            <p className="flex gap-2">
              <MessageCircle size={16} className="mt-0.5 shrink-0" />
              <a href={waLink("Halo pa(un)tungan")} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp {company.whatsappDisplay}
              </a>
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {company.legalName}. Semua hak dilindungi.
        </p>
      </footer>
    </>
  );
}