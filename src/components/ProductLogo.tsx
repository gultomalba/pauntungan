"use client";

import { useState } from "react";
import { tileFor } from "@/lib/products";

export default function ProductLogo({
  name,
  logoUrl,
  size = "sm",
}: {
  name: string;
  logoUrl: string | null;
  size?: "sm" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const box = size === "lg" ? "h-56 rounded-2xl text-7xl" : "h-24 rounded-lg text-3xl";
  const valid = !!logoUrl && logoUrl.startsWith("https://") && !failed;

  if (valid) {
    return (
      <div className={`flex items-center justify-center bg-slate-50 p-4 ${box}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl!}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center font-extrabold ${box} ${tileFor(name)}`}>
      {name.charAt(0)}
    </div>
  );
}