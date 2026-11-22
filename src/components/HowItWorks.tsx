import { ListChecks, Wallet, Users, KeyRound } from "lucide-react";

const steps = [
  { icon: ListChecks, title: "Pilih layanan & paket", desc: "Pilih layanan, lalu tentukan paket dan grup yang masih dibuka. Harga yang tampil adalah bagian per orang." },
  { icon: Wallet, title: "Pesan & bayar bagianmu", desc: "Bayar lewat QRIS atau Virtual Account. Pesananmu tercatat dan dana ditahan sampai grup siap diaktifkan." },
  { icon: Users, title: "Grup terisi, paket dibeli", desc: "Begitu kuota grup terpenuhi, kami membeli paket langganan dan mengaktifkan grupnya." },
  { icon: KeyRound, title: "Akses dikirim", desc: "Akses akun dikirim ke email dan dashboard kamu. Menjelang jatuh tempo, kamu menerima tagihan perpanjangan." },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-bold text-slate-900">Cara patungan di pa(un)tungan</h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Dari memilih layanan sampai akses aktif, tanpa perlu mencari teman patungan sendiri.
        </p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <s.icon size={22} className="text-emerald-700" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}