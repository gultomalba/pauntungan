export type Product = {
  id: string;
  slug: string;
  name: string;
  price_per_seat: number;
  period: "bulan" | "tahun";
  badge: string | null;
  logo_url: string | null;
};

export const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

const tiles = [
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
];

// warna kotak inisial, stabil untuk nama yang sama
export function tileFor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % tiles.length;
  return tiles[h];
}