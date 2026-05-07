"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bike, Car, Truck, Package } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Vehicle types ──────────────────────────────────── */
const VEHICLE_TYPES = [
  {
    id: "bike",
    label: "Bike",
    sub: "2 wheeler",
    icon: (
      <svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="19" r="5"/>
        <circle cx="21" cy="19" r="5"/>
        <circle cx="7"  cy="19" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="21" cy="19" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M7 14 L12 14 L16 8 L20 8 L21 14"/>
        <path d="M12 14 L14 10 L17 10"/>
        <rect x="19" y="5" width="5" height="4" rx="1"/>
      </svg>
    ),
  },
  {
    id: "auto",
    label: "Auto",
    sub: "3 wheeler ride",
    icon: (
      <svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18 L6 10 L18 10 L22 18"/>
        <rect x="6" y="18" width="16" height="5" rx="2"/>
        <rect x="6" y="10" width="12" height="8" rx="1"/>
        <path d="M18 10 L24 10 L24 18"/>
        <circle cx="10" cy="23" r="2.5"/>
        <circle cx="10" cy="23" r="1" fill="currentColor" stroke="none"/>
        <circle cx="20" cy="23" r="2.5"/>
        <circle cx="20" cy="23" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: "car",
    label: "Car",
    sub: "4 wheeler ride",
    icon: (
      <svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="13" width="22" height="9" rx="2"/>
        <path d="M5 13 L9 7 L19 7 L23 13"/>
        <rect x="10" y="9" width="8" height="4" rx="1"/>
        <circle cx="8"  cy="22" r="3"/>
        <circle cx="8"  cy="22" r="1.2" fill="currentColor" stroke="none"/>
        <circle cx="20" cy="22" r="3"/>
        <circle cx="20" cy="22" r="1.2" fill="currentColor" stroke="none"/>
        <rect x="23" y="16" width="2" height="4" rx="1"/>
      </svg>
    ),
  },
  {
    id: "loading",
    label: "Loading",
    sub: "Small goods",
    icon: (
      <svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="10" width="14" height="10" rx="2"/>
        <path d="M17 13 L23 13 L25 18 L17 18Z"/>
        <circle cx="8"  cy="22" r="2.5"/>
        <circle cx="8"  cy="22" r="1" fill="currentColor" stroke="none"/>
        <circle cx="21" cy="22" r="2.5"/>
        <circle cx="21" cy="22" r="1" fill="currentColor" stroke="none"/>
        <path d="M9 10 L9 6 L15 6 L15 10"/>
        <path d="M9 6 L12 4 L15 6"/>
      </svg>
    ),
  },
  {
    id: "truck",
    label: "Truck",
    sub: "Heavy transport",
    icon: (
      <svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="16" height="12" rx="2"/>
        <path d="M18 12 L24 12 L26 18 L18 18Z"/>
        <rect x="2" y="8" width="16" height="7" rx="1"/>
        <circle cx="7"  cy="22" r="2.8"/>
        <circle cx="7"  cy="22" r="1.1" fill="currentColor" stroke="none"/>
        <circle cx="22" cy="22" r="2.8"/>
        <circle cx="22" cy="22" r="1.1" fill="currentColor" stroke="none"/>
        <line x1="2" y1="15" x2="18" y2="15"/>
      </svg>
    ),
  },
] as const;

type VehicleId = (typeof VEHICLE_TYPES)[number]["id"];

export default function VehicleDetailsPage() {
  const [selected, setSelected] = useState<VehicleId>("loading");
  const [vehicleNumber, setVehicleNumber] = useState("MH12AB1234");
  const [vehicleModel, setVehicleModel] = useState("Tata Ace");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-dm">
      <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-8">

        {/* ── Step indicator ── */}
        <p className="text-center font-dm text-xs text-gray-400 tracking-widest uppercase mb-3">
          step 1 of 3
        </p>

        {/* ── Back + Title ── */}
        <div className="relative flex items-center justify-center mb-1">
          <button
            className="absolute left-0 w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 grid place-items-center transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={15} className="text-gray-600" />
          </button>
          <h1 className="font-syne font-extrabold text-[22px] text-gray-900 tracking-tight">
            Vehicle Details
          </h1>
        </div>

        <p className="text-center font-dm text-sm text-gray-400 mb-7">
          Add your vehicle information
        </p>

        {/* ── Progress bar ── */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full",
                s === 1 ? "bg-gray-900" : "bg-gray-200"
              )}
            />
          ))}
        </div>

        {/* ── Vehicle Type ── */}
        <p className="font-dm text-sm font-semibold text-gray-700 mb-3">
          Vehicle Type
        </p>

        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {VEHICLE_TYPES.map((v) => {
            const isActive = selected === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelected(v.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 py-5 px-3 transition-all duration-150",
                  isActive
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {/* Icon circle */}
                <div
                  className={cn(
                    "w-11 h-11 rounded-full grid place-items-center",
                    isActive ? "bg-white/15" : "bg-gray-100"
                  )}
                >
                  <span className={isActive ? "text-white" : "text-gray-700"}>
                    {v.icon}
                  </span>
                </div>

                <div className="text-center">
                  <p className={cn(
                    "font-syne font-bold text-[13px] leading-tight",
                    isActive ? "text-white" : "text-gray-900"
                  )}>
                    {v.label}
                  </p>
                  <p className={cn(
                    "font-dm text-[11px] mt-0.5",
                    isActive ? "text-white/70" : "text-gray-400"
                  )}>
                    {v.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Vehicle Number ── */}
        <div className="mb-5">
          <p className="font-dm text-sm font-semibold text-gray-700 mb-2">
            Vehicle Number
          </p>
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="MH12AB1234"
            className="w-full border-0 border-b-2 border-gray-200 focus:border-gray-900 outline-none bg-transparent font-dm text-sm text-gray-800 placeholder:text-gray-300 py-2.5 transition-colors"
          />
        </div>

        {/* ── Vehicle Model ── */}
        <div className="mb-8">
          <p className="font-dm text-sm font-semibold text-gray-700 mb-2">
            Vehicle Model
          </p>
          <input
            type="text"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            placeholder="Tata Ace"
            className="w-full border-0 border-b-2 border-gray-200 focus:border-gray-900 outline-none bg-transparent font-dm text-sm text-gray-800 placeholder:text-gray-300 py-2.5 transition-colors"
          />
        </div>

        {/* ── Continue ── */}
        <Button className="w-full bg-gray-900 hover:bg-gray-700 text-white font-syne font-bold text-[15px] rounded-2xl h-14 tracking-tight">
          Continue
        </Button>
      </div>
    </div>
  );
}