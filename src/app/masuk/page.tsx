import Header from "@/components/Header";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Masuk | pa(un)tungan" };

export default function MasukPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-12">
        <AuthForm mode="masuk" />
      </main>
    </div>
  );
}