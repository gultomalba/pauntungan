"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah } from "@/lib/products";
import { waLink } from "@/lib/company";

type Order = {
  id: string;
  amount: number;
  unique_code: number;
  status: string;
  expires_at: string | null;
  groups: { products: { name: string } | null } | null;
};

export default function PaymentView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/masuk");
      return;
    }
    const { data } = await supabase
      .from("orders")
      .select("id, amount, unique_code, status, expires_at, groups(products(name))")
      .eq("id", orderId)
      .maybeSingle();
    if (!data) setMissing(true);
    else setOrder(data as unknown as Order);
  }, [orderId, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitProof() {
    if (!file || !order) return;
    if (file.size > 3 * 1024 * 1024) {
      setError("Ukuran foto maksimal 3 MB.");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/masuk");
      return;
    }
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${user.id}/${order.id}-${Date.now()}.${ext}`;
    const up = await supabase.storage.from("payment-proofs").upload(path, file, { contentType: file.type });
    if (up.error) {
      setError("Gagal mengunggah foto. Pastikan formatnya JPG, PNG, atau WEBP.");
      setBusy(false);
      return;
    }
    const { error } = await supabase.rpc("submit_payment_proof", { p_order_id: order.id, p_path: path });
    if (error) setError(error.message);
    else {
      setFile(null);
      await load();
    }
    setBusy(false);
  }

  if (missing) {
    return (
      <div className="text-center">
        <p className="text-slate-600">Pesanan tidak ditemukan.</p>
        <Link href="/pesanan" className="mt-3 inline-block font-semibold text-emerald-700 hover:underline">Ke pesanan saya</Link>
      </div>
    );
  }
  if (!order) return <p className="text-slate-500">Memuat...</p>;

  const total = order.amount + order.unique_code;
  const name = order.groups?.products?.name ?? "Layanan";

  if (order.status === "paid") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-bold text-emerald-800">Pembayaran dikonfirmasi</p>
        <p className="mt-1 text-sm text-emerald-700">{name} sebesar {formatRupiah(total)}. Akses dikirim setelah grup terisi dan diaktifkan.</p>
        <Link href="/pesanan" className="mt-4 inline-block font-semibold text-emerald-800 hover:underline">Ke pesanan saya</Link>
      </div>
    );
  }
  if (order.status === "cancelled" || order.status === "refunded") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <p className="font-semibold text-slate-800">Pesanan ini sudah tidak aktif (dibatalkan atau kedaluwarsa).</p>
        <Link href="/#katalog" className="mt-3 inline-block font-semibold text-emerald-700 hover:underline">Pesan lagi</Link>
      </div>
    );
  }

  const waitingVerification = order.status === "awaiting_verification";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/qris.png" alt="QRIS pa(un)tungan" className="mx-auto w-full max-w-xs" />
        <p className="mt-3 text-xs text-slate-500">Pindai dengan aplikasi bank atau e-wallet apa pun yang mendukung QRIS.</p>
      </div>

      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Bayar pesanan</h1>
        <p className="mt-1 text-sm text-slate-600">{name}</p>

        <div className="mt-4 rounded-xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-800">Nominal yang harus dibayar</p>
          <p className="text-3xl font-extrabold text-emerald-900">{formatRupiah(total)}</p>
          <p className="mt-1 text-xs text-emerald-800">
            Harga {formatRupiah(order.amount)} + kode unik {order.unique_code}. Bayar <b>tepat sesuai nominal</b>,
            termasuk kode unik, agar pembayaranmu bisa kami cocokkan.
          </p>
        </div>

        {order.expires_at && !waitingVerification && (
          <p className="mt-3 text-sm text-slate-600">
            Bayar sebelum{" "}
            <b>{new Date(order.expires_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</b>.
            Setelah itu pesanan dibatalkan dan kursi dilepas.
          </p>
        )}

        {waitingVerification ? (
          <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Bukti pembayaran sudah kami terima dan sedang diverifikasi. Kamu bisa mengirim ulang foto di bawah kalau salah unggah.
          </div>
        ) : null}

        <div className="mt-5">
          <label className="block text-sm font-medium text-slate-700">
            {waitingVerification ? "Kirim ulang bukti pembayaran" : "Unggah bukti pembayaran (JPG, PNG, WEBP, maks. 3 MB)"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-2 block w-full text-sm"
            />
          </label>
          <button
            onClick={submitProof}
            disabled={!file || busy}
            className="mt-3 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy ? "Mengunggah..." : "Kirim bukti pembayaran"}
          </button>
          {error && <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>

        <a
          href={waLink(`Halo pa(un)tungan, saya sudah bayar pesanan ${order.id.slice(0, 8)} sebesar ${formatRupiah(total)}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline"
        >
          Ada kendala? Hubungi kami via WhatsApp
        </a>
      </div>
    </div>
  );
}