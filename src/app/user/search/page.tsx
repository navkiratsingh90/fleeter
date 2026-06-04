// app/user/search/page.tsx
"use client";

import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const SearchMap = dynamic(() => import("@/components/SearchMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-100" />,
});

export default function SearchPage() {
  const params = useSearchParams();

  const [pickUp, setPickUp] = useState(params.get("pickup") ?? "");
  const [drop, setDrop] = useState(params.get("drop") ?? "");
  const [km, setKm] = useState<string>("");

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 overflow-x-hidden">
      <div className="absolute top-5 left-5 z-50">
        <button className="w-11 h-11 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center hover:bg-zinc-900 transition-colors">
          <ArrowLeft size={13} className="text-zinc-700" />
        </button>
      </div>

      <div className="relative w-full h-[52vh] z-0">
        <SearchMap
          pickup={pickUp}
          drop={drop}
          onChange={(p, d) => {
            setPickUp(p);
            setDrop(d);
          }}
          onDistance={setKm}
        />
      </div>
    </div>
  );
}