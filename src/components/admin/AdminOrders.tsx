"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah } from "@/lib/products";

type Row = {
  id: string;
  amount: number;
  unique_code: number;
  status: string;
  created_at: string;
  expires_at: string | null;
  proof_path: string | null;
  proof_uploaded_at: string | null;
  profiles: { full_name: string | null; whatsapp: string | null } | null;
  groups: { products: { name: string } | null } | null;
};

const tabs = [
  { key: "awaiting_verification", label: "Menunggu verifikasi" },
  { key: "pending", label: "Belum bayar" },
  { key: "paid", label: "Lunas" },
  { key: "cancelled", label: "Dibatalkan" },
];

const fmt = (s: string) => new Date(s).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

export default function AdminOrders() {
  const [tab, setTab] = useState("awaiting_verification");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [proofs, setProofs] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setRows(null);
    setError(null);
    const { data, error } = await createClient()
      .from("orders")
      .select(
        "id, amount, unique_code, status, created_at, expires_at, proof_path, proof_uploaded_at, profiles(full_name, whatsapp), groups(products(name))"
      )
      .eq("status", tab)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) setError("Gagal memuat pesanan.");
    else setRows(data as unknown as Row[]);
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  async function showProof(o: Row) {
    if (!o.proof_path) return;
    const { data, error } = await createClient()
      .storage.from("payment-proofs")
      .createSignedUrl(o.proof_path, 300);
    if (error || !data) setError("Gagal membuka bukti pembayaran.");
    else setProofs((p) => ({ ...p, [o.id]: data.signedUrl }));
  }

  async function act(o: Row, kind: "confirm" | "reject") {
    const total = formatRupiah(o.amount + o.unique_code);
    let reason = "";
    if (kind === "confirm") {
      if (!window.confirm(`Pastikan ${total} (tepat, termasuk kode unik) sudah masuk di mutasi rekening/aplikasi merchant. Konfirmasi pembayaran?`)) return;
    } else {
      const r = window.prompt("Alasan penolakan (akan dilihat pelanggan):");
      if (r === null) return;
      reason = r;
    }
    setBusyId(o.id);
    setError(null);
    const supabase = createClient();
    const { error } =
      kind === "confirm"
        ? await supabase.rpc("confirm_payment", { p_order_id: o.id })
        : await supabase.rpc("reject_payment", { p_order_id: o.id, p_reason: reason });
    if (error) setError(error.message);
    await load();
    setBusyId(null);
  }

  return (
    <div>
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Konfirmasi hanya setelah nominal yang <b>persis sama</b> (termasuk kode unik) terlihat di mutasi rekening atau
        aplikasi merchant. Foto bukti saja belum cukup.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              tab === t.key ? "bg-emerald-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:border-emerald-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {rows === null && !error && <p className="mt-6 text-slate-500">Memuat...</p>}
      {rows && rows.length === 0 && <p className="mt-6 text-slate-500">Tidak ada pesanan di tab ini.</p>}

      <ul className="mt-5 space-y-4">
        {rows?.map((o) => (
          <li key={o.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{o.groups?.products?.name ?? "Layanan"}</p>
                <p className="text-sm text-slate-600">
                  {o.profiles?.full_name || "Tanpa nama"}
                  {o.profiles?.whatsapp ? ` · ${o.profiles.whatsapp}` : ""}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  #{o.id.slice(0, 8)} · dibuat {fmt(o.created_at)}
                  {o.proof_uploaded_at ? ` · bukti ${fmt(o.proof_uploaded_at)}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Nominal yang harus masuk</p>
                <p className="text-xl font-extrabold text-slate-900">{formatRupiah(o.amount + o.unique_code)}</p>
                <p className="text-xs text-slate-500">kode unik {o.unique_code}</p>
              </div>
            </div>

            {o.proof_path && (
              <div className="mt-3">
                {proofs[o.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={proofs[o.id]} alt="Bukti pembayaran" className="max-h-96 rounded-lg border border-slate-200" />
                ) : (
                  <button onClick={() => showProof(o)} className="text-sm font-semibold text-emerald-700 hover:underline">
                    Lihat bukti pembayaran
                  </button>
                )}
              </div>
            )}

            {(o.status === "awaiting_verification" || o.status === "pending") && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => act(o, "confirm")}
                  disabled={busyId === o.id}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Konfirmasi lunas
                </button>
                {o.status === "awaiting_verification" && (
                  <button
                    onClick={() => act(o, "reject")}
                    disabled={busyId === o.id}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Tolak bukti
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}