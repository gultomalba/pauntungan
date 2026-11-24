"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah } from "@/lib/products";

type Row = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  groups: { products: { name: string; slug: string } | null } | null;
};

const statusInfo: Record<string, { text: string; cls: string }> = {
  pending: { text: "Menunggu pembayaran", cls: "bg-amber-100 text-amber-700" },
  paid: { text: "Dibayar", cls: "bg-emerald-100 text-emerald-700" },
  cancelled: { text: "Dibatalkan", cls: "bg-slate-200 text-slate-600" },
  refunded: { text: "Dikembalikan", cls: "bg-sky-100 text-sky-700" },
};

export default function OrdersList() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/masuk");
      return;
    }
    const { data, error } = await supabase
      .from("orders")
      .select("id, amount, status, created_at, groups(products(name, slug))")
      .order("created_at", { ascending: false });
    if (error) setError("Gagal memuat pesanan.");
    else setRows(data as unknown as Row[]);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(id: string) {
    if (!window.confirm("Batalkan pesanan ini?")) return;
    setBusyId(id);
    setError(null);
    const { error } = await createClient().rpc("cancel_order", { p_order_id: id });
    if (error) setError(error.message);
    await load();
    setBusyId(null);
  }

  if (rows === null && !error) return <p className="text-slate-500">Memuat pesanan...</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Pesanan saya</h1>
      {error && <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {rows && rows.length === 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Belum ada pesanan.</p>
          <Link href="/#katalog" className="mt-3 inline-block font-semibold text-emerald-700 hover:underline">
            Pilih layanan
          </Link>
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {rows?.map((o) => {
          const info = statusInfo[o.status] ?? { text: o.status, cls: "bg-slate-200 text-slate-600" };
          const product = o.groups?.products;
          return (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div>
                <p className="font-semibold text-slate-900">{product?.name ?? "Layanan"}</p>
                <p className="text-xs text-slate-500">
                  {new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <p className="font-bold text-slate-900">{formatRupiah(o.amount)}</p>
              <span className={`rounded px-2 py-1 text-xs font-semibold ${info.cls}`}>{info.text}</span>
              {o.status === "pending" && (
                <button
                  onClick={() => cancel(o.id)}
                  disabled={busyId === o.id}
                  className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                >
                  {busyId === o.id ? "Membatalkan..." : "Batalkan"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}