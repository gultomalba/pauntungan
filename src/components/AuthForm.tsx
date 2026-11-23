"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({ mode }: { mode: "masuk" | "daftar" }) {
  const router = useRouter();
  const isRegister = mode === "daftar";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();

    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) setError(error.message);
      else if (data.session) {
        router.push("/");
        router.refresh();
      } else setInfo("Pendaftaran berhasil. Cek email kamu untuk konfirmasi, lalu masuk.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email atau kata sandi salah.");
      else {
        router.push("/");
        router.refresh();
      }
    }
    setLoading(false);
  }

  const input = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">{isRegister ? "Buat akun" : "Masuk"}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {isRegister ? "Daftar untuk mulai patungan." : "Masuk untuk melihat pesananmu."}
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {isRegister && (
          <label className="block text-sm font-medium text-slate-700">
            Nama lengkap
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={input} />
          </label>
        )}
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Kata sandi
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
          {isRegister && <span className="text-xs font-normal text-slate-400">Minimal 8 karakter.</span>}
        </label>

        {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {info && <p className="rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>}

        <button disabled={loading} className="w-full rounded-lg bg-emerald-600 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {loading ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
        <Link href={isRegister ? "/masuk" : "/daftar"} className="font-semibold text-emerald-700 hover:underline">
          {isRegister ? "Masuk" : "Daftar"}
        </Link>
      </p>
    </div>
  );
}