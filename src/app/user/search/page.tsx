"use client";

import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Car,
  MapPin,
  Navigation,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import VehicleCard from "@/components/VehicleCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const SearchMap = dynamic(() => import("@/components/SearchMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#f0fdf4]" />
  ),
});

interface IVehicle {
  owner?: string;
  _id?: string;
  type: "bike" | "car" | "auto" | "truck" | "van";
  vehicleModel: string;
  number: string;
  imageUrl: string;
  baseFare: number;
  pricePerKm: number;
  waitingCharge: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();

  const vehicle = params.get("vehicle");

  const [pickUp, setPickUp] = useState(params.get("pickup") ?? "");
  const [drop, setDrop] = useState(params.get("drop") ?? "");
  const [km, setKm] = useState<number>(0);
  const mobile = params.get("mobile" ?? "")
  const [pickUpLat, setPickUpLat] = useState<number | null>(() => {
    const v = params.get("pickuplat");
    return v ? Number(v) : null;
  });

  const [pickUpLon, setPickUpLon] = useState<number | null>(() => {
    const v = params.get("pickuplon");
    return v ? Number(v) : null;
  });

  const [dropLat, setDropLat] = useState<number | null>(() => {
    const v = params.get("droplat");
    return v ? Number(v) : null;
  });

  const [dropLon, setDropLon] = useState<number | null>(() => {
    const v = params.get("droplon");
    return v ? Number(v) : null;
  });

  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const getNearByVehicle = async (
    latitude: number,
    longitude: number,
    vehicleType: string | null
  ) => {
    try {
      setLoadingVehicles(true);

      const { data } = await axios.get("/api/vehicles/near-by", {
        params: { latitude, longitude, vehicleType },
      });

      const list =
        data?.vehicles ??
        data?.data ??
        (Array.isArray(data) ? data : []);

      setVehicles(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    if (pickUpLat == null || pickUpLon == null) return;
    getNearByVehicle(pickUpLat, pickUpLon, vehicle);
  }, [pickUpLat, pickUpLon, vehicle]);

  if (loadingVehicles && vehicles.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] text-gray-900">

      {/* BACK BUTTON */}
      <div className="absolute top-5 left-5 z-50">
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#bbf7d0] bg-white shadow-md hover:bg-[#f0fdf4] transition">
          <ArrowLeft size={18} className="text-[#16a34a]" />
        </button>
      </div>

      {/* MAP */}
      <div className="relative h-[50vh] w-full">
        <SearchMap
          pickup={pickUp}
          drop={drop}
          onDistance={setKm}
          onChange={(
            pickupAddress,
            dropAddress,
            pickupLatitude,
            pickupLongitude,
            dropLatitude,
            dropLongitude
          ) => {
            setPickUp(pickupAddress);
            setDrop(dropAddress);

            if (pickupLatitude !== undefined) setPickUpLat(pickupLatitude);
            if (pickupLongitude !== undefined) setPickUpLon(pickupLongitude);
            if (dropLatitude !== undefined) setDropLat(dropLatitude);
            if (dropLongitude !== undefined) setDropLon(dropLongitude);
          }}
        />
      </div>

      {/* BOTTOM SHEET */}
      <div className="relative z-20 -mt-20 min-h-[52vh] rounded-t-[28px] border-t border-[#bbf7d0] bg-white pt-5 pb-20 shadow-[0_-8px_40px_rgba(34,197,94,0.08)]">

        <div className="mx-auto max-w-6xl px-5 lg:px-8">

          {/* PICKUP / DROP */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4]">

            {/* PICKUP */}
            <div className="flex gap-3 border-b border-[#dcfce7] px-4 py-3">

              <div className="flex flex-col items-center pt-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                <div className="w-px flex-1 bg-[#bbf7d0]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                  Pickup
                </p>
                <p className="truncate text-sm font-semibold text-gray-900">
                  {pickUp}
                </p>
              </div>

              <MapPin size={14} className="text-[#16a34a] mt-1.5" />
            </div>

            {/* DROP */}
            <div className="flex gap-3 px-4 py-3">

              <div className="flex flex-col items-center pt-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                  Drop
                </p>
                <p className="truncate text-sm font-semibold text-gray-900">
                  {drop}
                </p>
              </div>

              <Navigation size={14} className="text-[#16a34a] mt-1.5" />
            </div>

          </div>

          {/* HEADER */}
          <div className="mb-6 flex items-end justify-between">

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Available Rides
              </h2>
              <p className="text-sm text-gray-500">
                Vehicles near your pickup
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1.5 text-sm font-semibold text-[#16a34a]">
              <Sparkles size={14} />
              Live
            </span>

          </div>

          {/* VEHICLES */}
          <div className="mt-6">
          {loadingVehicles ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="h-[330px] w-full max-w-[320px] animate-pulse rounded-2xl border border-[#bbf7d0] bg-white shadow-sm"
      >
        <div className="h-[170px] bg-[#f0fdf4]" />
        <div className="p-4 space-y-3">
          <div className="h-4 w-3/4 bg-[#dcfce7] rounded" />
          <div className="h-3 w-1/2 bg-[#dcfce7] rounded" />
          <div className="h-3 w-2/3 bg-[#dcfce7] rounded" />
          <div className="h-10 w-full bg-[#dcfce7] rounded-xl mt-4" />
        </div>
      </div>
    ))}
  </div>
) : vehicles.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20 text-center">

    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdf4] border border-[#bbf7d0]">
      <Car className="h-8 w-8 text-[#22c55e]" />
    </div>

    <h3 className="mt-4 text-xl font-bold text-gray-900">
      No Vehicles Found
    </h3>

    <p className="mt-2 text-sm text-gray-500 max-w-md">
      No vehicles are available near your pickup location right now.
      Try changing location or vehicle type.
    </p>

    <button
      onClick={() => window.location.reload()}
      className="mt-6 rounded-2xl bg-[#22c55e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#16a34a] transition"
    >
      Retry Search
    </button>

  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    {vehicles.map((item) => (
      <VehicleCard
        key={item._id}
        vehicle={item}
        distance={km}
        onBook={() => {
          const url = new URLSearchParams({
            pickup: pickUp,
            drop,
            vehicle: item.type,
            driverId: item.owner ?? "",
            vehicleId: item._id ?? "",
            fare: String(item.baseFare + item.pricePerKm * km),
            mobile: mobile ?? "",
            pickUpLat: String(pickUpLat),
            pickUpLon: String(pickUpLon),
            dropLat: String(dropLat),
            distance : String(km),
            dropLon: String(dropLon),
          });
          
          router.push(`/user/checkout?${url.toString()}`);
        }}
      />
    ))}

  </div>
)}

          </div>

        </div>
      </div>
    </div>
  );
}