"use client";

import LiveRideMap from "@/components/LiveRideMap";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { AlertCircle, Loader2, Phone, User, IndianRupee, Navigation, Clock, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RideChat } from "@/components/RideChat";

// Types (reuse or redefine)
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

interface IUser {
  name?: string;
  mobileNumber?: string;
}

interface IBooking {
  _id: string;
  user?: IUser;
  driver?: {
    name?: string;
    mobileNumber?: string;
  };
  vehicle?: {
    number?: string;
    vehicleModel?: string;
  };
  bookingStatus: BookingStatus;
  fare: number;
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
}

const MAP_STATUS: Record<string, "arriving" | "ongoing" | "completed"> = {
  idle: "arriving",
  requested: "arriving",
  awaiting_payment: "arriving",
  confirmed: "arriving",
  started: "ongoing",
  completed: "completed",
  cancelled: "completed",
  rejected: "completed",
  expired: "completed",
};

const STATUS_LABEL: Record<BookingStatus, { label: string; sublabel: string; dot: string; bgColor: string }> = {
  idle: { label: "Awaiting Confirmation", sublabel: "Your ride is being processed", dot: "bg-amber-400", bgColor: "bg-amber-50" },
  requested: { label: "Awaiting Confirmation", sublabel: "Your ride is being processed", dot: "bg-amber-400", bgColor: "bg-amber-50" },
  awaiting_payment: { label: "Payment Pending", sublabel: "Complete payment to confirm", dot: "bg-purple-400", bgColor: "bg-purple-50" },
  confirmed: { label: "Driver Assigned", sublabel: "Driver is heading to pickup", dot: "bg-emerald-400", bgColor: "bg-emerald-50" },
  started: { label: "Ride in Progress", sublabel: "You are on the way to destination", dot: "bg-blue-400", bgColor: "bg-blue-50" },
  completed: { label: "Ride Completed", sublabel: "Thank you for riding with us", dot: "bg-green-400", bgColor: "bg-green-50" },
  cancelled: { label: "Ride Cancelled", sublabel: "This ride was cancelled", dot: "bg-red-400", bgColor: "bg-red-50" },
  rejected: { label: "Ride Rejected", sublabel: "No driver available", dot: "bg-red-400", bgColor: "bg-red-50" },
  expired: { label: "Request Expired", sublabel: "Booking timed out", dot: "bg-orange-400", bgColor: "bg-orange-50" },
};

// Helper: estimate ETA from distance (km) – use same logic as driver panel
function estimateEtaMinutes(km: number) {
  const avgSpeedKmh = 25;
  return Math.max(1, Math.round((km / avgSpeedKmh) * 60));
}


// User Panel Content (without driver action buttons)
function UserPanelContent({ booking, driverLocation }: { booking: IBooking; driverLocation: [number, number] | null }) {
  const [eta, setEta] = useState<number | null>(null);
  const isActive = ["confirmed", "started"].includes(booking.bookingStatus);
  const isCancellable = ["idle", "requested", "awaiting_payment", "confirmed"].includes(booking.bookingStatus);

  // Calculate ETA when driver location and pickup location are available
  const handleCancelRide = async () => {
    if (!confirm("Are you sure you want to cancel this ride?")) return;
    try {
      await axios.patch(`/api/booking/${booking._id}/cancel`);
      window.location.reload();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to cancel ride");
    }
  };

  return (
    <div className="space-y-4 px-6 py-5">
      {/* ETA & FARE */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#bbf7d0] bg-[#f8fffb] p-3">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">ETA</p>
          <p className="text-2xl font-black text-gray-900">
            {isActive && eta !== null ? eta : "—"}{" "}
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

      {/* Driver Card */}
      <div className="flex items-center justify-between rounded-xl border border-[#bbf7d0] bg-[#f8fffb] p-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#22c55e]">
            <User size={14} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-900">
              {booking.driver?.name || "Driver assigned soon"}
            </p>
            <p className="truncate text-xs text-gray-600">
              {booking.driver?.mobileNumber || ""}
            </p>
          </div>
        </div>
        {booking.driver?.mobileNumber && (
          <button
            onClick={() => (window.location.href = `tel:${booking.driver?.mobileNumber}`)}
            className="ml-2 flex-shrink-0 rounded-full bg-white p-2 shadow-sm"
          >
            <Phone size={14} className="text-[#22c55e]" />
          </button>
        )}
      </div>

      {/* Vehicle Details */}
      {booking.vehicle && (
        <div className="rounded-xl border border-[#bbf7d0] bg-white p-3 shadow-sm">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Vehicle</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">{booking.vehicle.number || "Not assigned"}</p>
              <p className="text-xs text-gray-600">{booking.vehicle.vehicleModel || ""}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pickup */}
      <div className="rounded-xl border border-[#bbf7d0] bg-[#f8fffb] p-3">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Pickup</p>
        <p className="text-sm text-gray-800">{booking.pickUpAddress || "Address not available"}</p>
      </div>

      {/* Drop */}
      <div className="rounded-xl border border-[#bbf7d0] bg-[#f8fffb] p-3">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Drop</p>
        <p className="text-sm text-gray-800">{booking.dropAddress || "Address not available"}</p>
      </div>

      {/* Chat Component */}
      <RideChat bookingId={booking._id} currentRole="user" />

      {/* Cancel Button */}
      {isCancellable && (
        <button
          onClick={handleCancelRide}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-red-300 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition-all active:scale-95 hover:bg-red-50"
        >
          <XCircle size={16} />
          Cancel Ride
        </button>
      )}
    </div>
  );
}

// Main Page Component
export default function TrackRidePage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(null);
  const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null);
  const [dropPos, setDropPos] = useState<[number, number] | null>(null);

  // Fetch booking details
  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/user/track-ride/${bookingId}`);
      const ride = response.data.booking as IBooking;
      setBooking(ride);

      if (ride?.pickupLocation?.coordinates) {
        setPickUpPos([
          ride.pickupLocation.coordinates[1],
          ride.pickupLocation.coordinates[0],
        ]);
      }
      if (ride?.dropLocation?.coordinates) {
        setDropPos([
          ride.dropLocation.coordinates[1],
          ride.dropLocation.coordinates[0],
        ]);
      }
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load ride details");
    } finally {
      setLoading(false);
    }
  };

  // Poll driver location every 5 seconds if booking is active
  useEffect(() => {
    if (!bookingId || !booking) return;
    const isActive = ["confirmed", "started"].includes(booking.bookingStatus);
    if (!isActive) return;

    let interval: NodeJS.Timeout;
    const fetchDriverLocation = async () => {
      try {
        const res = await axios.get(`/api/booking/${bookingId}/driver-location`);
        const { lat, lng } = res.data;
        if (lat && lng) setDriverLocation([lat, lng]);
      } catch (err) {
        console.error("Failed to fetch driver location", err);
      }
    };

    fetchDriverLocation(); // immediate
    interval = setInterval(fetchDriverLocation, 5000);
    return () => clearInterval(interval);
  }, [bookingId, booking?.bookingStatus]);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4]">
        <Card className="rounded-3xl p-8 text-center">
          <Loader2 className="mx-auto animate-spin text-[#22c55e]" size={40} />
          <p className="mt-4 text-gray-600">Loading ride details...</p>
        </Card>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] p-4">
        <Card className="w-full max-w-md rounded-3xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-amber-500" />
          <h2 className="mb-2 text-lg font-bold text-gray-900">Ride Not Found</h2>
          <p className="mb-6 text-sm text-gray-500">{error || "Unable to load ride details."}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl bg-[#22c55e] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#16a34a]"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  const statusInfo = STATUS_LABEL[booking.bookingStatus] || STATUS_LABEL.idle;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* Map Section */}
      <div className="relative z-0 flex-1 overflow-hidden">
        <LiveRideMap
          driverLocation={driverLocation}
          pickUpLocation={pickUpPos}
          dropLocation={dropPos}
          mapStatus={MAP_STATUS[booking.bookingStatus]}
          // For user, we don't need onStats callback, but LiveRideMap might require it; we can pass empty handler
          onStats={() => {}}
        />

        {/* Status Badge */}
        <div className="pointer-events-auto absolute left-1/2 top-6 z-[9999] -translate-x-1/2">
          <div
            className={`flex items-center gap-3 ${statusInfo.bgColor} rounded-3xl border-2 border-current px-6 py-3 shadow-2xl backdrop-blur-lg`}
          >
            <span className={`h-3 w-3 rounded-full ${statusInfo.dot} animate-pulse`} />
            <div>
              <p className="text-sm font-bold text-gray-900">{statusInfo.label}</p>
              <p className="text-xs text-gray-600">{statusInfo.sublabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="z-40 max-h-[65vh] w-full overflow-y-auto rounded-t-3xl border-t-2 border-gray-200 bg-white shadow-2xl">
        <div className="flex justify-center pt-4 pb-2">
          <div className="h-1 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="border-b border-[#ecfdf5] bg-[#22c55e] px-6 py-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            Ride Tracker
          </p>
          <h1 className="text-2xl font-black text-white">Your Ride</h1>
        </div>

        <UserPanelContent booking={booking} driverLocation={driverLocation} />

        <div className="h-4" />
      </div>
    </div>
  );
}