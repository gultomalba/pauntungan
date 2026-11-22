export type Product = {
  slug: string;
  name: string;
  price: number;
  period: "Bulan" | "Tahun";
  badge?: "Populer" | "Slot Terakhir";
  tile: string; // warna kotak inisial
};

// DATA CONTOH: ganti dengan produk yang benar-benar Anda sediakan.
export const products: Product[] = [
  { slug: "1min-ai-business", name: "1min.AI Business", price: 10176, period: "Bulan", badge: "Populer", tile: "bg-emerald-100 text-emerald-700" },
  { slug: "chatgpt-plus", name: "ChatGPT Plus", price: 91000, period: "Bulan", badge: "Populer", tile: "bg-teal-100 text-teal-700" },
  { slug: "canva-pro", name: "Canva Pro", price: 25000, period: "Bulan", tile: "bg-sky-100 text-sky-700" },
  { slug: "netflix-premium", name: "Netflix Premium", price: 52000, period: "Bulan", badge: "Slot Terakhir", tile: "bg-rose-100 text-rose-700" },
  { slug: "spotify-family", name: "Spotify Family", price: 30000, period: "Bulan", tile: "bg-green-100 text-green-700" },
  { slug: "youtube-premium", name: "YouTube Premium", price: 35000, period: "Bulan", tile: "bg-red-100 text-red-700" },
  { slug: "duolingo-super", name: "Duolingo Super", price: 243000, period: "Tahun", tile: "bg-lime-100 text-lime-700" },
  { slug: "microsoft-365", name: "Microsoft 365", price: 48000, period: "Bulan", badge: "Slot Terakhir", tile: "bg-orange-100 text-orange-700" },
  { slug: "capcut-pro", name: "CapCut Pro", price: 643000, period: "Tahun", tile: "bg-slate-200 text-slate-700" },
  { slug: "github-pro", name: "GitHub Pro", price: 114000, period: "Bulan", tile: "bg-zinc-200 text-zinc-700" },
  { slug: "notion-plus", name: "Notion Plus", price: 60000, period: "Bulan", tile: "bg-stone-200 text-stone-700" },
  { slug: "grammarly-premium", name: "Grammarly Premium", price: 45000, period: "Bulan", tile: "bg-emerald-100 text-emerald-700" },
];

export const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");