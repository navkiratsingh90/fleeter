// app/user/search/page.tsx
"use client";

import dynamic from "next/dynamic";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Vehicle from "@/models/vehicle-model";

const SearchMap = dynamic(() => import("@/components/SearchMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-100" />,
});

export default function SearchPage() {
  const params = useSearchParams();
  const vehicle = params.get("vehicle")
  const [pickUp, setPickUp] = useState(params.get("pickup") ?? "");
  const [drop, setDrop] = useState(params.get("drop") ?? "");
  const [km, setKm] = useState<number>(0);
  const pickUpLat = Number(params.get("pickuplat"))
  const pickUpLon = Number(params.get("pickuplon"))
  const getNearByVehicle = async (
    latitude: number,
    longitude: number,
    vehicleType: string | null
  ) => {
    try {
      const { data } = await axios.get('/api/vehicles/near-by', {
        params: {
          latitude,
          longitude,
          vehicleType,
        },
      });
  
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getNearByVehicle(pickUpLat,pickUpLon,vehicle)
  },[pickUpLat,pickUpLon])
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 overflow-x-hidden">
      <div className="absolute top-5 left-5 z-50">
        <button className="w-11 h-11 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center hover:bg-zinc-900 transition-colors">
          <ArrowLeft size={13} className="text-zinc-700" />
        </button>
      </div>

      <div className="relative w-full h-[50vh] z-0">
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
      <div className="relative z-20 -mt-20 bg-white rounded-t-[28px] border-t border-zinc-200 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] pt-5 pb-20 min-h-[52vh]">
        <div className="px-5 lg:px-8 max-w-6xl mx-auto">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden mb-5">
            <div className="flex gap-3 px-4 py-3 border-b border-zinc-100">
              <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                <div className="rounded-full bg-zinc-900 w-2.5 h-2.5"/>
                <div className="w-px flex-1 bg-zinc-300 my-1" style={{minHeight : 14}} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mn-0.5">pick up</p>
                <p className="text-sm text-zinc-900 font-semibold leading-snug truncate">{pickUp || ""}</p>
              </div>
              <MapPin size={14} className="text-zinc-400 flex-shrink-0 mt-1.5"/>
            </div>
            <div className="flex gap-3 px-4 py-3 border-b border-zinc-100">
              <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                <div className="rounded-full bg-zinc-900 w-2.5 h-2.5"/>
                <div className="w-px flex-1 bg-zinc-300 my-1" style={{minHeight : 14}} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mn-0.5">Drop</p>
                <p className="text-sm text-zinc-900 font-semibold leading-snug truncate">{drop || ""}</p>
              </div>
              <Navigation size={14} className="text-zinc-400 flex-shrink-0 mt-1.5"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}