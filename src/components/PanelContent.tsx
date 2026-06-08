"use client";

import {
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  Loader2,
  Navigation,
  Phone,
  User,
} from "lucide-react";
import React from "react";
// import { IBooking, BookingStatus, ChatRole } from "@/types/booking";
import { RideChat } from "./RideChat";
import { BookingStatus, PaymentStatus } from "@/models/booking-model";
import { IUser } from "@/models/user-model";


interface IBooking {
	_id: string;
	user?: IUser;
	driver?: string | IUser;
	vehicle?: {
	  _id?: string;
	  owner?: string;
	  type?: string;
	  vehicleModel?: string;
	  number?: string;
	};
	bookingStatus: BookingStatus;
	paymentStatus: PaymentStatus;
	fare: number;
	driverMobileNumber?: string;
	userMobileNumber?: string;
	pickUpAddress?: string;
	dropAddress?: string;
	pickupLocation?: {
	  type: "Point";
	  coordinates: [number, number];
	};
	dropLocation?: {
	  type: "Point";
	  coordinates: [number, number];
	};
	createdAt?: string;
	updatedAt?: string;
  }
  
  type ChatRole = "driver" | "user";


interface PanelContentProps {
  booking: IBooking;
  bookingId: string;
  currentRole: ChatRole;
  status: BookingStatus;
  distanceToPickUp: number;
  distanceToDrop: number;
  etaToPickUp: number;
  etaToDrop: number;
  onArrivePickup: () => void;
  onStartRide: () => void;
  actionLoading: boolean;
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
  onArrivePickup,
  onStartRide,
  actionLoading,
}: PanelContentProps) {
  const isActive = ["confirmed", "started"].includes(status);
  const displayEta = status === "confirmed" ? etaToPickUp : etaToDrop;
  const displayDistance = status === "confirmed" ? distanceToPickUp : distanceToDrop;
  const isConfirmed = status === "confirmed";
  const isStarted = status === "started";

  const formatAddress = (location: any) => {
    if (!location) return "Address not available";
    if (typeof location === "string") return location;
    return location.address || `${location.coordinates?.[1]}, ${location.coordinates?.[0]}`;
  };

  return (
    <div className="space-y-4 px-6 py-5">
      {/* ETA & FARE */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#bbf7d0] bg-[#f8fffb] p-3">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">ETA</p>
          <p className="text-2xl font-black text-gray-900">
            {isActive ? Math.round(displayEta) : 0}{" "}
            <span className="text-sm font-semibold text-gray-500">min</span>
          </p>
        </div>
        <div className="rounded-xl border border-[#bbf7d0] bg-white p-3 shadow-sm">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Fare</p>
          <div className="flex items-baseline gap-0.5">
            <IndianRupee size={14} className="text-[#16a34a]" strokeWidth={2.5} />
            <span className="text-2xl font-black text-gray-900">{booking.fare || 0}</span>
          </div>
        </div>
      </div>

      {/* CUSTOMER CARD */}
      <div className="flex items-center justify-between rounded-xl border border-[#bbf7d0] bg-[#f8fffb] p-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#22c55e]">
            <User size={14} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-900">
              {booking.user?.name || "Customer"}
            </p>
            <p className="truncate text-xs text-gray-600">
              {booking.user?.mobileNumber || booking.userMobileNumber || "N/A"}
            </p>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0 rounded-full border border-gray-200 bg-white px-2.5 py-1">
          <p className="text-[9px] font-bold text-gray-600">
            {booking.paymentStatus === "cash" ? "Cash" : booking.paymentStatus || "Pending"}
          </p>
        </div>
      </div>

      {/* VEHICLE DETAILS */}
      {booking.vehicle && (
        <div className="rounded-xl border border-[#bbf7d0] bg-white p-3 shadow-sm">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">
            Your Vehicle
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {booking.vehicle.number || "Not assigned"}
              </p>
              <p className="text-xs text-gray-600">{booking.vehicle.vehicleModel || ""}</p>
            </div>
            <div className="rounded-full bg-[#f0fdf4] p-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* PICKUP LOCATION */}
      <div className="rounded-xl border border-[#bbf7d0] bg-[#f8fffb] p-3">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Pickup</p>
        <p className="text-sm text-gray-800">{formatAddress(booking.pickUpAddress)}</p>
      </div>

      {/* DROP LOCATION */}
      <div className="rounded-xl border border-[#bbf7d0] bg-[#f8fffb] p-3">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Drop</p>
        <p className="text-sm text-gray-800">{formatAddress(booking.dropAddress)}</p>
      </div>

      {/* DISTANCE (only when active) */}
      {isActive && (
        <div className="rounded-xl border border-blue-100 bg-[#22c55e] p-3">
          <div className="mb-1 flex items-center gap-2">
            <Navigation size={12} className="text-blue-600" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Distance</p>
          </div>
          <p className="text-lg font-black text-blue-900">{(displayDistance / 1000).toFixed(1)} km</p>
        </div>
      )}

      {/* CHAT COMPONENT */}
      <RideChat bookingId={bookingId} currentRole={currentRole} />

      {/* ACTION BUTTONS */}
      <div className="space-y-2 pt-2">
        {isConfirmed && (
          <button
            onClick={onArrivePickup}
            disabled={actionLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all active:scale-95 hover:bg-[#16a34a] disabled:opacity-50"
          >
            {actionLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Arrived at Pickup
              </>
            )}
          </button>
        )}
        {isStarted && (
          <button
            onClick={onStartRide}
            disabled={actionLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all active:scale-95 hover:bg-[#16a34a] disabled:opacity-50"
          >
            {actionLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <ArrowRight size={14} />
                Start Ride
              </>
            )}
          </button>
        )}
        <button
          onClick={() =>
            (window.location.href = `tel:${
              booking.user?.mobileNumber || booking.userMobileNumber || ""
            }`)
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-900 transition-all active:scale-95 hover:bg-gray-100"
        >
          <Phone size={14} />
          Call Customer
        </button>
      </div>
    </div>
  );
}