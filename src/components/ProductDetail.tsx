"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah, tileFor } from "@/lib/products";

type Detail = { id: string; name: string; description: string | null; price_per_seat: number; period: "bulan" | "tahun" };
type Group = { id: string; seats_total: number; seats_taken: number };

export default function ProductDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Detail | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [state, setState] = useState<"loading" | "notfound" | "ready">("loading");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: p } = await supabase
        .from("products")
        .select("id, name, description, price_per_seat, period")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (!p) { setState("notfound"); return; }
      const { data: g } = await supabase
        .from("groups")
        .select("id, seats_total, seats_taken")
        .eq("product_id", p.id)
        .eq("status", "open")
        .order("created_at")
        .limit(1)
        .maybeSingle();
      setProduct(p as Detail);
      setGroup(g as Group | null);
      setState("ready");
    })();
  }, [slug]);

  async function handleOrder() {
    if (!group) return;
    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); router.push("/masuk"); return; }

        const { data: orderId, error } = await supabase.rpc("create_order", { p_group_id: group.id });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setBusy(false);
      return;
    }
    router.push(`/pesanan/${orderId}/bayar`);
  }

  if (state === "loading") return <p className="text-slate-500">Memuat...</p>;
  if (state === "notfound" || !product) {
    return (
      <div className="text-center">
        <p className="text-slate-600">Layanan tidak ditemukan.</p>
        <Link href="/#katalog" className="mt-3 inline-block font-semibold text-emerald-700 hover:underline">Kembali ke daftar layanan</Link>
      </div>
    );
  }

  const seatsLeft = group ? group.seats_total - group.seats_taken : 0;
  const canOrder = !!group && seatsLeft > 0;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className={`flex h-56 items-center justify-center rounded-2xl text-7xl font-extrabold ${tileFor(product.name)}`}>
        {product.name.charAt(0)}
      </div>

      <div>
        <Link href="/#katalog" className="text-sm text-slate-500 hover:text-emerald-700">&larr; Semua layanan</Link>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">{product.name}</h1>
        <p className="mt-2 text-3xl font-extrabold text-slate-900">
          {formatRupiah(product.price_per_seat)}
          <span className="text-base font-normal text-slate-500"> /{product.period === "tahun" ? "tahun" : "bulan"} per orang</span>
        </p>

        <p className="mt-4 text-sm text-slate-600">
          {product.description ?? "Patungan langganan. Pesan kursimu, bayar bagianmu, dan akses dikirim setelah grup terisi dan diaktifkan."}
        </p>

        <div className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {group
            ? <>Sisa kursi di grup ini: <b>{seatsLeft}</b> dari {group.seats_total}</>
            : "Belum ada grup yang dibuka untuk layanan ini."}
        </div>

        <button
          onClick={handleOrder}
          disabled={busy || !canOrder}
          className="mt-5 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy ? "Memproses..." : canOrder ? "Pesan 1 kursi" : "Kursi penuh"}
        </button>

        {message && (
          <p className={`mt-3 rounded px-3 py-2 text-sm ${message.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}