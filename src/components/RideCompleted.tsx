"use client";

import {
  Check,
  IndianRupee,
  User,
  Sparkles,
  MapPin,
  Star,
  Clock,
  Navigation,
  Heart,
  Share2,
  Home,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RideCompletedProps {
  fare: number;
  customerName: string;
  driverName?: string;
  paymentStatus?: string;
  distance?: number;
  duration?: number;
  pickupLocation?: string;
  dropLocation?: string;
  rating?: number;
}

export default function RideCompleted({
  fare,
  customerName,
  driverName = "Professional Driver",
  paymentStatus = "Cash",
  distance = 12.5,
  duration = 28,
  pickupLocation = "Loading...",
  dropLocation = "Loading...",
  rating = 4.8,
}: RideCompletedProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#22c55e]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#16a34a]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#22c55e]/5 blur-3xl" />
      </div>

      <div
        className={`relative flex min-h-screen flex-col items-center justify-center px-4 py-12 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="w-full max-w-md space-y-6">
          
          {/* ═══ SUCCESS ICON WITH ANIMATION ═══ */}
          <div className="flex flex-col items-center pt-8">
            <div className="relative mb-8">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full bg-[#22c55e]/30 animate-ping scale-[1.5]" />
              <div className="absolute inset-0 rounded-full bg-[#22c55e]/20 animate-pulse scale-[2]" />

              {/* Success checkmark */}
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#22c55e] bg-gradient-to-br from-[#22c55e]/20 to-[#16a34a]/20 shadow-2xl shadow-[#22c55e]/25">
                <Check
                  size={56}
                  strokeWidth={2}
                  className="text-[#22c55e] animate-bounce"
                />
              </div>
            </div>

            {/* Header text */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#22c55e]/10 px-4 py-2 border border-[#bbf7d0] backdrop-blur-sm">
                <Sparkles size={14} className="text-[#22c55e]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#16a34a]">
                  Ride Completed
                </span>
              </div>

              <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 to-[#16a34a] bg-clip-text text-transparent">
                Great Ride!
              </h1>

              <p className="text-gray-600 text-base">
                Thank you for riding with us
              </p>
            </div>
          </div>

          {/* ═══ FARE CARD ═══ */}
          <div className="group rounded-3xl border border-[#bbf7d0] bg-gradient-to-br from-[#f0fdf4] to-white backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-[#16a34a]">
              Total Fare
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <IndianRupee size={36} className="text-[#22c55e]" strokeWidth={2} />
              <span className="text-6xl font-black text-gray-900">
                {fare}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#dcfce7] pt-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
                <p className="text-xs text-gray-600 font-medium">Payment Method</p>
              </div>
              <span className="rounded-full bg-[#22c55e]/10 border border-[#bbf7d0] px-4 py-1.5 text-xs font-bold text-[#16a34a]">
                {paymentStatus}
              </span>
            </div>
          </div>

          {/* ═══ TRIP SUMMARY CARDS ═══ */}
          <div className="grid grid-cols-2 gap-3">
            {/* Distance */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Navigation size={16} className="text-[#22c55e]" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Distance</p>
              </div>
              <p className="text-2xl font-black text-gray-900">{distance} <span className="text-sm font-semibold text-gray-600">km</span></p>
            </div>

            {/* Duration */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-[#22c55e]" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Duration</p>
              </div>
              <p className="text-2xl font-black text-gray-900">{duration} <span className="text-sm font-semibold text-gray-600">min</span></p>
            </div>
          </div>

          {/* ═══ CUSTOMER CARD ═══ */}
          <div className="group rounded-2xl border border-[#bbf7d0] bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] p-5 shadow-md hover:shadow-lg transition-all">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a] mb-3">
              Passenger
            </p>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-[#22c55e]/20 blur-lg group-hover:blur-xl transition-all" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-lg">
                  <User size={24} className="text-white" />
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#16a34a] transition-colors">
                  {customerName}
                </p>
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  {rating} • Excellent passenger
                </p>
              </div>
            </div>
          </div>

          {/* ═══ ROUTE DETAILS ═══ */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Route</p>
            
            {/* Pickup */}
            <div className="flex gap-3 items-start">
              <div className="mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#16a34a] mb-0.5">Pickup</p>
                <p className="text-xs text-gray-700 line-clamp-1">{pickupLocation}</p>
              </div>
            </div>

            {/* Line */}
            <div className="ml-[5px] h-4 border-l-2 border-dashed border-[#dcfce7]" />

            {/* Drop */}
            <div className="flex gap-3 items-start">
              <div className="mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800 shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-0.5">Drop</p>
                <p className="text-xs text-gray-700 line-clamp-1">{dropLocation}</p>
              </div>
            </div>
          </div>

          {/* ═══ RATING SECTION ═══ */}
          {!showRating ? (
            <button
              onClick={() => setShowRating(true)}
              className="w-full rounded-2xl border-2 border-[#bbf7d0] bg-[#f0fdf4] hover:bg-[#dcfce7] px-6 py-4 text-sm font-bold text-[#16a34a] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Star size={18} className="fill-yellow-400 text-yellow-400" />
              Rate this ride
            </button>
          ) : (
            <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-5 space-y-4">
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 mb-3">How was your ride?</p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className={`transition-all transform hover:scale-110 ${
                        selectedRating >= star ? "scale-110" : "scale-100"
                      }`}
                    >
                      <Star
                        size={32}
                        className={`${
                          selectedRating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!selectedRating}
                className="w-full rounded-xl bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 text-white font-bold py-3 transition-all active:scale-95"
              >
                Submit Rating
              </button>
            </div>
          )}

          {/* ═══ ACTION BUTTONS ═══ */}
          <div className="space-y-2">
            <button
              onClick={() => router.push("/")}
              className="w-full rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-4 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Home size={18} />
              Back to Home
            </button>

            <button
              className="w-full rounded-2xl border-2 border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-4 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Share2 size={18} />
              Share Ride
            </button>
          </div>

          {/* ═══ DECORATIVE DOTS ═══ */}
          <div className="flex justify-center gap-1.5 pt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#22c55e]/40 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}