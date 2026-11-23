import Link from "next/link";
import { Search, Bell, User, Package, ShoppingCart } from "lucide-react";

function IconLink({ label, href = "#", children }: { label: string; href?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-0.5 px-2 text-slate-600 hover:text-emerald-700">
      {children}
      <span className="hidden text-[11px] sm:block">{label}</span>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">
          pa<span className="text-emerald-600">(un)</span>tungan
        </Link>

        <div className="hidden flex-1 md:block">
          <div className="flex overflow-hidden rounded-lg border border-slate-300 focus-within:border-emerald-600">
            <input
              type="search"
              placeholder="Cari layanan patungan..."
              className="w-full px-3 py-2 text-sm outline-none"
            />
            <button type="button" aria-label="Cari" className="bg-emerald-600 px-4 text-white hover:bg-emerald-700">
              <Search size={18} />
            </button>
          </div>
        </div>

        <nav className="ml-auto flex items-center md:ml-0">
          <IconLink label="Notifikasi"><Bell size={20} /></IconLink>
          <IconLink label="Akun" href="/masuk"><User size={20} /></IconLink>
          <IconLink label="Pesanan"><Package size={20} /></IconLink>
          <IconLink label="Keranjang"><ShoppingCart size={20} /></IconLink>
        </nav>
      </div>
    </header>
  );
}