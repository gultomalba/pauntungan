import { Suspense } from "react";
import Header from "@/components/Header";
import PaymentView from "@/components/PaymentView";

async function Pay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PaymentView orderId={id} />;
}

export default function BayarPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Suspense fallback={<p className="text-slate-500">Memuat...</p>}>
          <Pay params={params} />
        </Suspense>
      </main>
    </div>
  );
}