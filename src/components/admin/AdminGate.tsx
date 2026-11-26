"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "admin" | "denied">("loading");

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/masuk");
        return;
      }
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      setState(data?.role === "admin" ? "admin" : "denied");
    })();
  }, [router]);

  if (state === "loading") return <p className="text-slate-500">Memuat...</p>;
  if (state === "denied") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="font-semibold text-slate-800">Halaman ini khusus admin.</p>
      </div>
    );
  }
  return <>{children}</>;
}