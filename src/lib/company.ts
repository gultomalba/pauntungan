export const company = {
  brand: "pa(un)tungan",
  legalName: "PT Pauntungan Berbagi Bersama",
  address: "Jl. Sekargadung No. 100 RT 4 RW 2, Kec. Purworejo, Kota Pasuruan",
  email: "pauntunganberbagi@gmail.com",
  whatsapp: "6285648603105", // format internasional untuk link wa.me
  whatsappDisplay: "0856-4860-3105",
  nib: "", // isi NIB jika sudah ada; kalau kosong, tidak ditampilkan
};

export const waLink = (text: string) =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;