import Header from "@/components/Header";
import AdminGate from "@/components/admin/AdminGate";
import AdminOrders from "@/components/admin/AdminOrders";

export const metadata = {
  title: "Admin | pa(un)tungan",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-slate-900">Admin: verifikasi pembayaran</h1>
        <div className="mt-6">
          <AdminGate>
            <AdminOrders />
          </AdminGate>
        </div>
      </main>
    </div>
  );
}