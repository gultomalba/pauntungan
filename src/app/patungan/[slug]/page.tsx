import { Suspense } from "react";
import Header from "@/components/Header";
import ProductDetail from "@/components/ProductDetail";

async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Suspense fallback={<p className="text-slate-500">Memuat...</p>}>
          <Detail params={params} />
        </Suspense>
      </main>
    </div>
  );
}