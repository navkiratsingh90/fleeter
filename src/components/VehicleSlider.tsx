"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Data ───────────────────────────────────────────── */
const vehicles = [
  {
    id: 1,
    name: "MotoGo",
    category: "Motorbike",
    tagline: "Fastest in the city",
    description: "Beat traffic with our GPS-tracked bikes. Perfect for solo riders on a tight schedule.",
    capacity: 1,
    eta: "2–4 min",
    price: "₹49",
    color: "#f97316",
    bgLight: "#fff7ed",
    borderLight: "#fed7aa",
    badge: "Fastest",
    badgeBg: "#fff7ed",
    badgeText: "#ea580c",
    vendor: "SpeedLink",
    emoji: "🏍",
    features: ["Helmet included", "No surge pricing", "Solo ride"],
    icon: (
      <svg viewBox="0 0 110 70" width="110" height="70" fill="none">
        <ellipse cx="24" cy="52" rx="13" ry="13" stroke="#f97316" strokeWidth="2.5"/>
        <ellipse cx="24" cy="52" rx="5" ry="5" fill="#fed7aa"/>
        <ellipse cx="86" cy="52" rx="13" ry="13" stroke="#f97316" strokeWidth="2.5"/>
        <ellipse cx="86" cy="52" rx="5" ry="5" fill="#fed7aa"/>
        <path d="M24 40 L46 40 L62 24 L74 24 L86 40" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M46 40 L54 28 L66 28" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        <rect x="72" y="18" width="16" height="8" rx="2" stroke="#f97316" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: 2,
    name: "CabX",
    category: "Economy Sedan",
    tagline: "Comfortable & reliable",
    description: "AC sedans with trained drivers. Best choice for daily commutes and airport trips.",
    capacity: 4,
    eta: "5–8 min",
    price: "₹120",
    color: "#3b82f6",
    bgLight: "#eff6ff",
    borderLight: "#bfdbfe",
    badge: "Popular",
    badgeBg: "#eff6ff",
    badgeText: "#2563eb",
    vendor: "CabNetwork",
    emoji: "🚗",
    features: ["Air conditioned", "4 seats", "Rated drivers"],
    icon: (
      <svg viewBox="0 0 130 80" width="130" height="80" fill="none">
        <rect x="16" y="38" width="98" height="28" rx="6" stroke="#3b82f6" strokeWidth="2.5"/>
        <path d="M26 38 L40 18 L90 18 L104 38" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="43" y="22" width="44" height="16" rx="3" stroke="#3b82f6" strokeWidth="2" fill="#dbeafe"/>
        <ellipse cx="38" cy="66" rx="11" ry="11" stroke="#3b82f6" strokeWidth="2.5"/>
        <ellipse cx="38" cy="66" rx="4.5" ry="4.5" fill="#bfdbfe"/>
        <ellipse cx="92" cy="66" rx="11" ry="11" stroke="#3b82f6" strokeWidth="2.5"/>
        <ellipse cx="92" cy="66" rx="4.5" ry="4.5" fill="#bfdbfe"/>
        <line x1="65" y1="38" x2="65" y2="66" stroke="#3b82f6" strokeWidth="1.5" opacity="0.3"/>
        <rect x="104" y="44" width="6" height="10" rx="2" fill="#3b82f6" opacity="0.5"/>
        <rect x="22" y="44" width="6" height="10" rx="2" fill="#3b82f6" opacity="0.5"/>
      </svg>
    ),
  },
  {
    id: 3,
    name: "PremiumX",
    category: "Luxury SUV",
    tagline: "Business class comfort",
    description: "Premium SUVs with leather seats, WiFi and complimentary water. Arrive in style.",
    capacity: 6,
    eta: "8–12 min",
    price: "₹299",
    color: "#f59e0b",
    bgLight: "#fffbeb",
    borderLight: "#fde68a",
    badge: "Premium",
    badgeBg: "#fffbeb",
    badgeText: "#d97706",
    vendor: "EliteFleet",
    emoji: "🚙",
    features: ["WiFi & water", "Leather seats", "Meet & greet"],
    icon: (
      <svg viewBox="0 0 150 90" width="150" height="90" fill="none">
        <rect x="12" y="40" width="126" height="34" rx="8" stroke="#f59e0b" strokeWidth="2.5"/>
        <path d="M22 40 L40 16 L110 16 L128 40" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="46" y="20" width="58" height="20" rx="4" stroke="#f59e0b" strokeWidth="2" fill="#fde68a" fillOpacity="0.3"/>
        <line x1="75" y1="20" x2="75" y2="40" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4"/>
        <ellipse cx="38" cy="74" rx="13" ry="13" stroke="#f59e0b" strokeWidth="2.5"/>
        <ellipse cx="38" cy="74" rx="5" ry="5" fill="#fde68a"/>
        <ellipse cx="112" cy="74" rx="13" ry="13" stroke="#f59e0b" strokeWidth="2.5"/>
        <ellipse cx="112" cy="74" rx="5" ry="5" fill="#fde68a"/>
        <rect x="130" y="48" width="8" height="14" rx="3" fill="#f59e0b" opacity="0.6"/>
        <path d="M12 52 L6 52 L6 62 L12 62" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 4,
    name: "AutoRick",
    category: "Auto Rickshaw",
    tagline: "City classic, connected",
    description: "Iconic GPS-tracked autos with digital fare meters. CNG-powered, eco-friendly rides.",
    capacity: 3,
    eta: "3–6 min",
    price: "₹69",
    color: "#22c55e",
    bgLight: "#f0fdf4",
    borderLight: "#bbf7d0",
    badge: "Budget",
    badgeBg: "#f0fdf4",
    badgeText: "#16a34a",
    vendor: "AutoHub",
    emoji: "🛺",
    features: ["GPS metered", "CNG green", "Open air"],
    icon: (
      <svg viewBox="0 0 120 85" width="120" height="85" fill="none">
        <path d="M22 52 L22 30 L84 30 L98 52" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="22" y="52" width="76" height="18" rx="6" stroke="#22c55e" strokeWidth="2.5"/>
        <rect x="22" y="30" width="62" height="22" rx="4" stroke="#22c55e" strokeWidth="2" fill="#dcfce7"/>
        <path d="M84 30 L104 30 L104 52" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="88" y="34" width="14" height="12" rx="2" fill="#bbf7d0"/>
        <ellipse cx="38" cy="70" rx="11" ry="11" stroke="#22c55e" strokeWidth="2.5"/>
        <ellipse cx="38" cy="70" rx="4.5" ry="4.5" fill="#bbf7d0"/>
        <ellipse cx="88" cy="70" rx="11" ry="11" stroke="#22c55e" strokeWidth="2.5"/>
        <ellipse cx="88" cy="70" rx="4.5" ry="4.5" fill="#bbf7d0"/>
      </svg>
    ),
  },
  {
    id: 5,
    name: "ElectroBus",
    category: "Electric Minibus",
    tagline: "Zero emissions, max savings",
    description: "Scheduled electric buses on smart fixed routes. Share a ride, save the planet.",
    capacity: 14,
    eta: "10–15 min",
    price: "₹35",
    color: "#8b5cf6",
    bgLight: "#faf5ff",
    borderLight: "#ddd6fe",
    badge: "Eco ♻",
    badgeBg: "#faf5ff",
    badgeText: "#7c3aed",
    vendor: "GreenMove",
    emoji: "🚌",
    features: ["Zero emissions", "Smart routes", "Group savings"],
    icon: (
      <svg viewBox="0 0 170 85" width="170" height="85" fill="none">
        <rect x="8" y="18" width="148" height="48" rx="10" stroke="#8b5cf6" strokeWidth="2.5"/>
        <rect x="18" y="26" width="28" height="18" rx="3" stroke="#8b5cf6" strokeWidth="2" fill="#ede9fe"/>
        <rect x="54" y="26" width="28" height="18" rx="3" stroke="#8b5cf6" strokeWidth="2" fill="#ede9fe"/>
        <rect x="90" y="26" width="28" height="18" rx="3" stroke="#8b5cf6" strokeWidth="2" fill="#ede9fe"/>
        <rect x="126" y="26" width="22" height="18" rx="3" stroke="#8b5cf6" strokeWidth="2" fill="#ede9fe"/>
        <ellipse cx="34" cy="66" rx="10" ry="10" stroke="#8b5cf6" strokeWidth="2.5"/>
        <ellipse cx="34" cy="66" rx="4" ry="4" fill="#ddd6fe"/>
        <ellipse cx="136" cy="66" rx="10" ry="10" stroke="#8b5cf6" strokeWidth="2.5"/>
        <ellipse cx="136" cy="66" rx="4" ry="4" fill="#ddd6fe"/>
        <path d="M156 28 L164 28 L164 56 L156 56" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 36 L2 36 L2 48 L8 48" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M78 10 L74 18" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M85 8 L85 16" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M92 10 L96 18" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 6,
    name: "VanPool",
    category: "Shared Van",
    tagline: "Team up, cut costs",
    description: "Smart carpooling with route-matched commuters. Split the fare, keep the comfort.",
    capacity: 8,
    eta: "6–10 min",
    price: "₹80",
    color: "#ec4899",
    bgLight: "#fdf2f8",
    borderLight: "#fbcfe8",
    badge: "Best Value",
    badgeBg: "#fdf2f8",
    badgeText: "#db2777",
    vendor: "PoolPro",
    emoji: "🚐",
    features: ["Route matched", "Cost split AI", "Book a seat"],
    icon: (
      <svg viewBox="0 0 150 85" width="150" height="85" fill="none">
        <rect x="10" y="26" width="118" height="38" rx="8" stroke="#ec4899" strokeWidth="2.5"/>
        <rect x="18" y="32" width="34" height="20" rx="3" stroke="#ec4899" strokeWidth="2" fill="#fce7f3"/>
        <rect x="58" y="32" width="28" height="20" rx="3" stroke="#ec4899" strokeWidth="2" fill="#fce7f3"/>
        <path d="M128 26 L140 26 L150 46 L150 64 L128 64" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="132" y="32" width="14" height="18" rx="3" fill="#fce7f3"/>
        <ellipse cx="30" cy="64" rx="11" ry="11" stroke="#ec4899" strokeWidth="2.5"/>
        <ellipse cx="30" cy="64" rx="4.5" ry="4.5" fill="#fbcfe8"/>
        <ellipse cx="110" cy="64" rx="11" ry="11" stroke="#ec4899" strokeWidth="2.5"/>
        <ellipse cx="110" cy="64" rx="4.5" ry="4.5" fill="#fbcfe8"/>
        <rect x="150" y="38" width="7" height="15" rx="3" fill="#ec4899" opacity="0.5"/>
      </svg>
    ),
  },
] as const;

const VISIBLE = 3; // cards visible at once on desktop

export default function VehicleSlider() {
  const [activeId, setActiveId] = useState(1);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(vehicles.length / VISIBLE);
  const activeVehicle = vehicles.find((v) => v.id === activeId) ?? vehicles[0];

  const visibleVehicles = vehicles.slice(page * VISIBLE, page * VISIBLE + VISIBLE);

  return (
    <section className="bg-white py-16 px-8 md:px-16 font-dm">

      {/* ── Section header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="inline-block bg-[#f0fdf4] text-[#16a34a] text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#bbf7d0] mb-4">
            Commute Options
          </span>
          <h2
            className="font-syne font-extrabold text-gray-900 tracking-tight leading-tight"
            style={{ fontSize: "clamp(30px, 3.5vw, 48px)" }}
          >
            Every Way to{" "}
            <span className="text-[#22c55e]">Move</span>
          </h2>
          <p className="font-dm text-sm text-gray-400 mt-2 max-w-[440px]">
            From solo bikes to shared electric buses — all mobility modes on one platform.
          </p>
        </div>

        {/* Page controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed grid place-items-center transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <span className="font-dm text-xs text-gray-400 font-medium px-1">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed grid place-items-center transition-colors"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* ── Cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {visibleVehicles.map((vehicle) => {
          const isActive = vehicle.id === activeId;
          return (
            <button
              key={vehicle.id}
              onClick={() => setActiveId(vehicle.id)}
              className={cn(
                "text-left rounded-2xl border-2 p-6 transition-all duration-200 w-full",
                isActive
                  ? "shadow-md"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
              )}
              style={
                isActive
                  ? { borderColor: vehicle.color, background: vehicle.bgLight }
                  : {}
              }
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center text-2xl border"
                  style={{ background: vehicle.bgLight, borderColor: vehicle.borderLight }}
                >
                  {vehicle.emoji}
                </div>
                <span
                  className="font-dm text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: vehicle.badgeBg, color: vehicle.badgeText }}
                >
                  {vehicle.badge}
                </span>
              </div>

              {/* Name & category */}
              <p className="font-syne font-extrabold text-gray-900 text-lg tracking-tight mb-0.5">
                {vehicle.name}
              </p>
              <p className="font-dm text-xs text-gray-400 uppercase tracking-widest mb-2">
                {vehicle.category}
              </p>
              <p className="font-dm text-sm text-gray-500 leading-snug mb-4">
                {vehicle.tagline}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-gray-400" />
                  <span className="font-dm text-xs text-gray-500">{vehicle.eta}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-gray-400" />
                  <span className="font-dm text-xs text-gray-500">{vehicle.capacity} riders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-gray-400" />
                  <span className="font-dm text-xs text-gray-500">{vehicle.vendor}</span>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className="font-syne font-extrabold text-xl tracking-tight"
                    style={{ color: vehicle.color }}
                  >
                    {vehicle.price}
                  </span>
                  <span className="font-dm text-xs text-gray-400 ml-1">base</span>
                </div>
                <div
                  className={cn(
                    "text-xs font-dm font-semibold px-3 py-1.5 rounded-full transition-colors",
                    isActive ? "text-white" : "text-gray-600 bg-gray-100"
                  )}
                  style={isActive ? { background: vehicle.color } : {}}
                >
                  {isActive ? "Selected ✓" : "Select"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Active vehicle detail panel ── */}
      <div
        className="rounded-3xl border-2 p-8"
        style={{ borderColor: activeVehicle.borderLight, background: activeVehicle.bgLight }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">

          {/* Icon */}
          <div
            className="w-24 h-24 rounded-2xl grid place-items-center shrink-0 border-2 bg-white"
            style={{ borderColor: activeVehicle.borderLight }}
          >
            <span className="text-5xl">{activeVehicle.emoji}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-syne font-extrabold text-2xl text-gray-900">
                {activeVehicle.name}
              </span>
              <span
                className="font-dm text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: activeVehicle.badgeBg, color: activeVehicle.badgeText, border: `1px solid ${activeVehicle.borderLight}` }}
              >
                {activeVehicle.badge}
              </span>
            </div>

            <p className="font-dm text-xs text-gray-400 uppercase tracking-widest mb-2">
              {activeVehicle.category} · by {activeVehicle.vendor}
            </p>

            <p className="font-dm text-sm text-gray-600 mb-4 max-w-[460px]">
              {activeVehicle.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {activeVehicle.features.map((f) => (
                <span
                  key={f}
                  className="font-dm text-xs font-medium px-3 py-1.5 rounded-lg bg-white border"
                  style={{ borderColor: activeVehicle.borderLight, color: activeVehicle.badgeText }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Price & Book */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div>
              <span
                className="font-syne font-extrabold text-4xl tracking-tight"
                style={{ color: activeVehicle.color }}
              >
                {activeVehicle.price}
              </span>
              <span className="font-dm text-sm text-gray-400 ml-1">/ base fare</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-dm">
              <span className="flex items-center gap-1"><Clock size={13}/> {activeVehicle.eta}</span>
              <span className="flex items-center gap-1"><Users size={13}/> {activeVehicle.capacity} riders</span>
            </div>
            <Button
              className="text-white font-dm font-bold text-sm rounded-xl px-6 py-2.5 h-auto mt-1"
              style={{ background: activeVehicle.color }}
            >
              Book Now →
            </Button>
          </div>
        </div>
      </div>

      {/* ── Vendor CTA ── */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-7 py-5">
        <div>
          <p className="font-syne font-bold text-gray-900 text-lg">Are you a fleet operator?</p>
          <p className="font-dm text-sm text-gray-400 mt-0.5">
            List your vehicles on Veloce and reach thousands of daily riders.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-[#22c55e] text-[#16a34a] hover:bg-[#f0fdf4] font-dm font-semibold text-sm whitespace-nowrap shrink-0"
        >
          Register Your Fleet →
        </Button>
      </div>
    </section>
  );
}