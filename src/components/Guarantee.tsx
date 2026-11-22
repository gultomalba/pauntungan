import { ShieldCheck, Undo2, Building2, Headphones } from "lucide-react";
import { company } from "@/lib/company";

const items = [
  { icon: ShieldCheck, title: "Dana ditahan sampai grup siap", desc: "Pembayaranmu baru dipakai untuk pengadaan paket setelah kuota grup terpenuhi." },
  { icon: Undo2, title: "Refund jika gagal", desc: "Jika kuota tidak terpenuhi atau aktivasi gagal dari pihak kami, pembayaranmu dikembalikan sesuai Syarat & Ketentuan." },
  { icon: Building2, title: "Dikelola badan usaha", desc: `Dioperasikan oleh ${company.legalName}, ${company.address}.` },
  { icon: Headphones, title: "Bantuan lewat WhatsApp", desc: "Ada kendala dengan akses atau pembayaran? Hubungi kami lewat WhatsApp." },
];

export default function Guarantee() {
  return (
    <section id="garansi" className="py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-bold text-slate-900">Garansi & bantuan</h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Kamu bertransaksi langsung dengan kami, bukan dengan orang asing.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.title} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5">
              <it.icon size={28} className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-slate-900">{it.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}