"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah, tileFor, type Product } from "@/lib/products";

const PAGE_SIZE = 8;

export default function ProductCatalog() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    createClient()
      .from("products")
      .select("id, slug, name, price_per_seat, period, badge")
      .eq("is_active", true)
      .order("name")
      .then(({ data, error }) => {
        if (error) setError("Gagal memuat daftar layanan.");
        else setItems((data ?? []) as Product[]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <section id="katalog" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-center text-2xl font-bold text-slate-900">Pilih langganan untuk dipatungin</h2>
      <p className="mt-1 text-center text-sm text-slate-500">Harga yang tampil adalah harga per orang.</p>

      <div className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 focus-within:border-emerald-600">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Cari Netflix, Spotify, ChatGPT..."
          className="w-full text-sm outline-none"
        />
        <Search size={18} className="text-slate-400" />
      </div>

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Memuat layanan...</p>
      ) : error ? (
        <p className="mt-10 text-center text-red-600">{error}</p>
      ) : visible.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">Layanan tidak ditemukan.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {visible.map((p) => (
            <Link
              key={p.id}
              href={`/patungan/${p.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-emerald-500 hover:shadow-md"
            >
              <div className="relative">
                {p.badge && (
                  <span className={`absolute left-1 top-1 z-10 rounded px-1.5 py-0.5 text-[10px] font-semibold ${p.badge === "Populer" ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-700"}`}>
                    {p.badge}
                  </span>
                )}
                <div className={`flex h-24 items-center justify-center rounded-lg text-3xl font-extrabold ${tileFor(p.name)}`}>
                  {p.name.charAt(0)}
                </div>
              </div>
              <p className="mt-3 truncate text-sm font-medium text-slate-800">{p.name}</p>
              <p className="text-sm font-bold text-slate-900">
                {formatRupiah(p.price_per_seat)}
                <span className="text-xs font-normal text-slate-500"> /{p.period === "tahun" ? "Tahun" : "Bulan"}</span>
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 text-sm">
        <button onClick={() => setPage(current - 1)} disabled={current === 1} aria-label="Sebelumnya"
          className="rounded border border-slate-300 p-1.5 disabled:opacity-40"><ChevronLeft size={16} /></button>
        <span className="text-slate-600">Halaman {current} dari {totalPages}</span>
        <button onClick={() => setPage(current + 1)} disabled={current === totalPages} aria-label="Berikutnya"
          className="rounded border border-slate-300 p-1.5 disabled:opacity-40"><ChevronRight size={16} /></button>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">{filtered.length} layanan</p>
    </section>
  );
}