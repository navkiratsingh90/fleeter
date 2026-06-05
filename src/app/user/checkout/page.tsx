"use client";

import {
  Bike,
  Clock,
  Shield,
  CreditCard,
  Car,
  Truck,
  MapPin,
  Navigation,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

const VEHICLE_META: any = {
  bike: { label: "Bike", Icon: Bike },
  auto: { label: "Auto", Icon: Car },
  car: { label: "Car", Icon: Car },
  loading: { label: "Loading", Icon: Truck },
  truck: { label: "Truck", Icon: Truck },
};

export type status =
  | "Idle"
  | "requested"
  | "awaiting_payment"
  | "confirmed"
  | "started"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [status, setStatus] = useState<status>("Idle");

  const pickup = params.get("pickup") || "";
  const drop = params.get("drop") || "";
  const vehicle = params.get("vehicle") || "";
  const fare = params.get("fare") || "";

  const { Icon } = VEHICLE_META[vehicle] || VEHICLE_META.car;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] text-gray-900">

      <div className="mx-auto max-w-7xl px-4 py-12">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10 bg-[#22c55e]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a]">
              Booking
            </span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Checkout
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Review your ride and confirm booking
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEFT CARD */}
          <div className="bg-white rounded-3xl border border-[#bbf7d0] shadow-lg overflow-hidden">

            <div className="h-1 bg-[#22c55e]" />

            <div className="p-8 sm:p-10">

              {/* VEHICLE HEADER */}
              <div className="flex items-start justify-between mb-8">

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a]">
                    Selected Vehicle
                  </p>

                  <h2 className="text-4xl font-extrabold text-gray-900 capitalize mt-2">
                    {vehicle}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#22c55e] grid place-items-center shadow-md">
                  <Icon size={24} className="text-white" />
                </div>

              </div>

              {/* ROUTE */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl overflow-hidden mb-8">

                {/* PICKUP */}
                <div className="flex gap-4 px-5 py-4 border-b border-[#dcfce7]">

                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                    <div className="w-px flex-1 bg-[#bbf7d0] my-1" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                      Pickup
                    </p>

                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {pickup}
                    </p>
                  </div>

                  <MapPin size={14} className="text-[#16a34a] mt-1" />
                </div>

                {/* DROP */}
                <div className="flex gap-4 px-5 py-4">

                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                      Drop
                    </p>

                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {drop}
                    </p>
                  </div>

                  <Navigation size={14} className="text-[#16a34a] mt-1" />
                </div>

              </div>

              {/* FARE */}
              <div className="flex items-end justify-between pt-6 border-t border-[#dcfce7]">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                    Total Fare
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Includes base + distance charges
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <IndianRupee size={22} className="text-gray-900" />
                  <span className="text-4xl font-extrabold text-gray-900">
                    {Math.round(Number(fare))}
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white rounded-3xl border border-[#bbf7d0] shadow-lg overflow-hidden flex flex-col">

            <div className="h-1 bg-[#22c55e]" />

            <div className="p-8 sm:p-10 flex flex-col flex-1 justify-between">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a]">
                  Ready to go?
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-8">
                  Confirm Your Ride
                </h2>

                {/* BENEFITS */}
                <div className="space-y-4">

                  {[
                    {
                      icon: <Clock size={15} />,
                      text: "Driver will respond within 2 minutes",
                    },
                    {
                      icon: <Shield size={15} />,
                      text: "Verified & insured drivers only",
                    },
                    {
                      icon: <CreditCard size={15} />,
                      text: "Pay after driver accepts",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#16a34a]">
                        {item.icon}
                      </div>

                      <p className="text-sm text-gray-800 font-medium">
                        {item.text}
                      </p>

                    </div>
                  ))}

                </div>

              </div>

              {/* BUTTON */}
              <button className="mt-8 w-full h-12 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-[15px] flex items-center justify-center gap-2 transition shadow-md">

                Request Ride
                <span className="text-base">→</span>

              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}