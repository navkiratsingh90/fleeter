"use client";

import axios from "axios";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  IndianRupee,
  Loader2,
  Navigation,
  Phone,
  User,
  MapPin,
  AlertCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { RideChat } from "./RideChat";

type BookingStatus =
  | "idle"
  | "requested"
  | "awaiting_payment"
  | "confirmed"
  | "started"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

type ChatRole = "driver" | "user";

interface PanelBooking {
  _id: string;
  fare: number;
  paymentStatus?: string;
  user?: {
    name?: string;
    mobileNumber?: string;
  };
  userMobileNumber?: string;
  vehicle?: {
    number?: string;
    vehicleModel?: string;
  };
  pickUpAddress?: string;
  dropAddress?: string;
}

interface PanelContentProps {
  booking: PanelBooking;
  bookingId: string;
  currentRole: ChatRole;
  status: BookingStatus;
  distanceToPickUp: number;
  distanceToDrop: number;
  etaToPickUp: number;
  etaToDrop: number;
  actionLoading: boolean;
  onRefresh?: () => void;
}

export function PanelContent({
  booking,
  bookingId,
  currentRole,
  status,
  distanceToPickUp,
  distanceToDrop,
  etaToPickUp,
  etaToDrop,
  actionLoading,
  onRefresh,
}: PanelContentProps) {
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);

  const isActive = ["confirmed", "started"].includes(status);
  const displayEta = status === "confirmed" ? etaToPickUp : etaToDrop;
  const displayDistance = status === "confirmed" ? distanceToPickUp : distanceToDrop;
  const isConfirmed = status === "confirmed";
  const isStarted = status === "started";

  const customerName = booking.user?.name || "Customer";
  const customerMobile = booking.user?.mobileNumber || booking.userMobileNumber || "N/A";

  const paymentLabel = useMemo(() => {
    const p = booking.paymentStatus || "pending";
    if (p === "cash") return "🪙 Cash";
    if (p === "paid") return "✓ Paid";
    if (p === "failed") return "✗ Failed";
    return "⏳ Pending";
  }, [booking.paymentStatus]);

  const formatAddress = (location: any) => {
    if (!location) return "Address not available";
    if (typeof location === "string") return location;
    return location.address || `${location.coordinates?.[1]}, ${location.coordinates?.[0]}`;
  };

  const handleArrived = async () => {
    try {
      setOtpError(null);
      setOtpSuccess(null);
      setOtpSending(true);

      const { data } = await axios.patch(
        `/api/partner/booking/${bookingId}/generate-pickup-otp`
      );

      if (!data?.success) {
        setOtpError(data?.message || "Failed to send OTP");
        return;
      }

      setOtpSent(true);
      setOtpSuccess("OTP sent to customer's email");
    } catch (error: any) {
      setOtpError(
        error?.response?.data?.message || error?.message || "Failed to send OTP"
      );
    } finally {
      setOtpSending(false);
    }
  };
  const handleCompleteRide = async () => {
    try {
      const { data } = await axios.patch(`/api/partner/booking/${bookingId}/completed`);
      if (!data?.success) {
        setOtpError(data?.message || "Failed to complete ride");
        return;
      }
      // handle success (redirect to ride completed page, etc.)
    } catch (error: any) {
      setOtpError(error?.response?.data?.message || error?.message);
    }
  };
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Enter the OTP");
      return;
    }

    try {
      setOtpError(null);
      setOtpSuccess(null);
      setOtpVerifying(true);

      const { data } = await axios.patch(
        `/api/partner/booking/${bookingId}/verify-pickup-otp`,
        { otp: otp.trim() }
      );

      if (!data?.success) {
        setOtpError(data?.message || "OTP verification failed");
        return;
      }

      setOtpSuccess("✓ OTP verified. Ride started!");
      setOtp("");
      setOtpSent(false);

      setTimeout(() => {
        if (onRefresh) {
          onRefresh();
        } else {
          window.location.reload();
        }
      }, 1500);
    } catch (error: any) {
      setOtpError(error?.response?.data?.message || error?.message || "OTP verification failed");
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div className="space-y-4 px-6 py-5">
      
      {/* ═══ TOP METRICS ═══ */}
      <div className="grid grid-cols-2 gap-3">
        {/* ETA */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-[#bbf7d0] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-[#16a34a]" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a]">ETA</p>
          </div>
          <p className="text-3xl font-black text-gray-900">
            {isActive ? Math.round(displayEta) : 0}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">minutes away</p>
        </div>

        {/* FARE */}
        <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-4 shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Fare</p>
          <div className="flex items-baseline gap-1">
            <IndianRupee size={16} className="text-white" strokeWidth={2.5} />
            <span className="text-3xl font-black text-gray-700">{booking.fare || 0}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">total amount</p>
        </div>
      </div>

      {/* ═══ CUSTOMER CARD ═══ */}
      <div className="rounded-2xl bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] border border-[#bbf7d0] p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a] mb-3">Customer</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center flex-shrink-0 shadow-sm">
              <User size={18} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">{customerName}</p>
              <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                <Phone size={12} className="flex-shrink-0" />
                <span className="truncate">{customerMobile}</span>
              </p>
            </div>
          </div>

          {/* Payment Badge */}
          <div className="ml-3 flex-shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
            <p className="text-[10px] font-bold text-gray-700">{paymentLabel}</p>
          </div>
        </div>
      </div>

      {/* ═══ VEHICLE CARD ═══ */}
      {booking.vehicle && (
        <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Your Vehicle</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">{booking.vehicle.number || "Not assigned"}</p>
              <p className="text-xs text-gray-600 mt-0.5">{booking.vehicle.vehicleModel || "Unknown model"}</p>
            </div>
            <div className="bg-[#f0fdf4] p-3 rounded-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C7 18.5304 6.78929 19.0391 6.41421 19.4142C6.03914 19.7893 5.53043 20 5 20C4.46957 20 3.96086 19.7893 3.58579 19.4142C3.21071 19.0391 3 18.5304 3 18M7 18C7 17.4696 7.21071 16.9609 7.58579 16.5858C7.96086 16.2107 8.46957 16 9 16H15C15.5304 16 16.0391 16.2107 16.4142 16.5858C16.7893 16.9609 17 17.4696 17 18M7 18H17M17 18C17 18.5304 17.2107 19.0391 17.5858 19.4142C17.9609 19.7893 18.4696 20 19 20C19.5304 20 20.0391 19.7893 20.4142 19.4142C20.7893 19.0391 21 18.5304 21 18M3 13H21V8C21 7.46957 20.7893 6.96086 20.4142 6.58579C20.0391 6.21071 19.5304 6 19 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V13Z" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ═══ LOCATIONS ═══ */}
      <div className="space-y-3">
        {/* Pickup */}
        <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a] mb-1">Pickup Location</p>
              <p className="text-sm text-gray-700 leading-snug line-clamp-2">{formatAddress(booking.pickUpAddress)}</p>
            </div>
          </div>
        </div>

        {/* Drop */}
        <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-800 shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">Drop Location</p>
              <p className="text-sm text-gray-700 leading-snug line-clamp-2">{formatAddress(booking.dropAddress)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DISTANCE (Active Only) ═══ */}
      {isActive && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Navigation size={14} className="text-blue-600" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Distance to {status === "confirmed" ? "Pickup" : "Destination"}</p>
          </div>
          <p className="text-2xl font-black text-gray-700">{displayDistance.toFixed(2)} <span className="text-sm font-semibold text-gray-700">km</span></p>
        </div>
      )}

      {/* ═══ CHAT COMPONENT ═══ */}
      {!isStarted && <RideChat bookingId={bookingId} currentRole={currentRole} />}

      {/* ═══ OTP SECTION (Driver Only) ═══ */}
      {isConfirmed && currentRole === "driver" && (
        <div className="rounded-2xl border border-[#bbf7d0] bg-[#f8fffb] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#22c55e]" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a]">Pickup Verification</p>
          </div>

          {!otpSent ? (
            <button
              onClick={handleArrived}
              disabled={otpSending || actionLoading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold disabled:opacity-50 transition-all active:scale-95 shadow-md text-sm"
            >
              {otpSending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>I have Arrived</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-700 font-medium">Enter the OTP sent to customer</p>
              <input
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setOtpError(null);
                }}
                placeholder="0000"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-center text-2xl font-bold tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={otpVerifying || otp.length < 4}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold disabled:opacity-50 transition-all active:scale-95 shadow-md text-sm"
              >
                {otpVerifying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight size={16} />
                    <span>Verify OTP</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ ERROR & SUCCESS MESSAGES ═══ */}
      {otpError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-3">
          <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-900 font-medium">{otpError}</p>
        </div>
      )}

      {otpSuccess && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-3 flex items-start gap-3">
          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 font-medium">{otpSuccess}</p>
        </div>
      )}

      {/* ═══ ACTION BUTTONS ═══ */}
      <div className="space-y-2 pt-2">
        {isStarted && currentRole === "driver" && (
          <button
            disabled={actionLoading}
            onClick={handleCompleteRide}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold disabled:opacity-50 transition-all active:scale-95 shadow-md text-sm"
          >
            {actionLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Starting...</span>
              </>
            ) : (
              <>
                <ArrowRight size={16} />
                <span>Complete Ride</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={() =>
            (window.location.href = `tel:${booking.user?.mobileNumber || booking.userMobileNumber || ""}`)
          }
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 text-gray-900 font-bold transition-all active:scale-95 text-sm"
        >
          <Phone size={16} />
          <span>Call Customer</span>
        </button>
      </div>
    </div>
  );
}