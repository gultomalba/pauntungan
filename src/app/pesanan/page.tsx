import Header from "@/components/Header";
import OrdersList from "@/components/OrdersList";

export const metadata = { title: "Pesanan Saya | pa(un)tungan" };

export default function PesananPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <OrdersList />
      </main>
    </div>
  );
}