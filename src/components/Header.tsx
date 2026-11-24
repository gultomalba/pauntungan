"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, User, Package, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const itemClass =
  "flex flex-col items-center gap-0.5 px-2 text-slate-600 hover:text-emerald-700";

export default function Header() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

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
          <Link href="#" className={itemClass}>
            <Bell size={20} />
            <span className="hidden text-[11px] sm:block">Notifikasi</span>
          </Link>
          <Link href="/pesanan" className={itemClass}>
            <Package size={20} />
            <span className="hidden text-[11px] sm:block">Pesanan</span>
          </Link>
          {loggedIn ? (
            <button onClick={logout} className={itemClass}>
              <LogOut size={20} />
              <span className="hidden text-[11px] sm:block">Keluar</span>
            </button>
          ) : (
            <Link href="/masuk" className={itemClass}>
              <User size={20} />
              <span className="hidden text-[11px] sm:block">Masuk</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}