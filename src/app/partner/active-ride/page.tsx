"use client";

import LiveRideMap from "@/components/LiveRideMap";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { AlertCircle, Loader2, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
// import { IBooking, BookingStatus } from "@/models/booking-model";
// import { MAP_STATUS, STATUS_LABEL } from "@/constants/booking";
// import { haversineKm, estimateEtaMinutes } from "@/utils/geo";/
import { PanelContent } from "@/components/PanelContent";
import { IUser } from "@/models/user-model";
import { PaymentStatus } from "@/models/booking-model";
import { getSocket } from "@/lib/socket";

export type BookingStatus =
  | "idle"
  | "requested"
  | "awaiting_payment"
  | "confirmed"
  | "started"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";


// export interface IUser {
//   name?: string;
//   email?: string;
//   mobileNumber?: string;
// }

export interface IBooking {
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


export const MAP_STATUS: Record<string, "arriving" | "ongoing" | "completed"> = {
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

export const STATUS_LABEL: Record<
  BookingStatus,
  { label: string; sublabel: string; dot: string; bgColor: string }
> = {
  idle: {
    label: "Awaiting Confirmation",
    sublabel: "Booking is being processed",
    dot: "bg-amber-400",
    bgColor: "bg-amber-50",
  },
  requested: {
    label: "Awaiting Confirmation",
    sublabel: "Booking is being processed",
    dot: "bg-amber-400",
    bgColor: "bg-amber-50",
  },
  awaiting_payment: {
    label: "Payment Pending",
    sublabel: "Customer payment is pending",
    dot: "bg-purple-400",
    bgColor: "bg-purple-50",
  },
  confirmed: {
    label: "Heading to Pickup",
    sublabel: "Drive to the pickup location",
    dot: "bg-emerald-400",
    bgColor: "bg-emerald-50",
  },
  started: {
    label: "Ride in Progress",
    sublabel: "Heading to drop location",
    dot: "bg-blue-400",
    bgColor: "bg-blue-50",
  },
  completed: {
    label: "Ride Completed",
    sublabel: "Trip has ended successfully",
    dot: "bg-green-400",
    bgColor: "bg-green-50",
  },
  cancelled: {
    label: "Ride Cancelled",
    sublabel: "This ride was cancelled",
    dot: "bg-red-400",
    bgColor: "bg-red-50",
  },
  rejected: {
    label: "Ride Rejected",
    sublabel: "Ride was rejected",
    dot: "bg-red-400",
    bgColor: "bg-red-50",
  },
  expired: {
    label: "Request Expired",
    sublabel: "Booking timed out",
    dot: "bg-orange-400",
    bgColor: "bg-orange-50",
  },
};

const Page = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null);
  const [dropPos, setDropPos] = useState<[number, number] | null>(null);
  const [distanceToPickUp, setDistanceToPickUp] = useState(0);
  const [distanceToDrop, setDistanceToDrop] = useState(0);
  const [etaToPickUp, setEtaToPickUp] = useState(0);
  const [etaToDrop, setEtaToDrop] = useState(0);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchActiveBooking = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/partner/my-active");
      const ride = response.data.activeRide as IBooking | null;

      if (!ride) {
        setBooking(null);
        setStatus("idle");
        setDriverPos(null);
        setPickUpPos(null);
        setDropPos(null);
        setError("No active ride found");
        return;
      }

      setBooking(ride);
      setStatus(ride.bookingStatus || "idle");

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
      const message =
        err?.response?.data?.message || err?.message || "No active ride found";
      setError(message);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!booking) return;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    const socket = getSocket()
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDriverPos([latitude, longitude]);
        socket.emit("update-driver-location" , ({bookingId : booking._id, latitude : latitude, longitude : longitude, status : status} ))
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [booking]);
  useEffect(() => { 
    if (!booking?._id) return
    const socket = getSocket()
    socket.emit("join-ride" , booking?._id)
    socket.on("driver-location" ,({latitude,longitude}) => {
      setDriverPos([latitude,longitude])
    })
    return () => {
      socket.off("join-ride");
      socket.off("driver-location")
    }
  },[booking?._id])
  useEffect(() => {
    fetchActiveBooking();
  }, []);

  const handleArriveAtPickup = async () => {
    if (!booking) return;
    try {
      setActionLoading(true);
      await axios.patch(`/api/partner/booking/${booking._id}/arrive-pickup`);
      await fetchActiveBooking();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartRide = async () => {
    if (!booking) return;
    try {
      setActionLoading(true);
      await axios.patch(`/api/partner/booking/${booking._id}/start-ride`);
      await fetchActiveBooking();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to start ride");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4]">
        <Card className="rounded-3xl p-8 text-center">
          <Loader2 className="mx-auto animate-spin text-[#22c55e]" size={40} />
          <p className="mt-4 text-gray-600">Fetching active ride...</p>
        </Card>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] p-4">
        <Card className="w-full max-w-md rounded-3xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-amber-500" />
          <h2 className="mb-2 text-lg font-bold text-gray-900">No Active Ride</h2>
          <p className="mb-6 text-sm text-gray-500">
            {error || "You don't have an active ride right now."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl bg-[#22c55e] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#16a34a]"
          >
            Refresh
          </button>
        </Card>
      </div>
    );
  }

  const statusKey = booking.bookingStatus || "idle";
  const statusInfo = STATUS_LABEL[statusKey as BookingStatus] || STATUS_LABEL.idle;
  const displayEta = status === "confirmed" ? etaToPickUp : etaToDrop;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <div className="relative z-0 flex-1 overflow-hidden">
        <LiveRideMap
          driverLocation={driverPos}
          pickUpLocation={pickUpPos}
          dropLocation={dropPos}
          mapStatus={MAP_STATUS[booking.bookingStatus!]}
          onStats={({ distanceToPickUp, etaToPickUp, distanceToDrop, etaToDrop }) => {
            setDistanceToPickUp(distanceToPickUp);
            setEtaToPickUp(etaToPickUp);
            setDistanceToDrop(distanceToDrop);
            setEtaToDrop(etaToDrop);
          }}
        />

        <div className="pointer-events-auto absolute left-1/2 top-6 z-[9999] -translate-x-1/2">
          <div
            className={`flex items-center gap-3 ${statusInfo.bgColor} rounded-3xl border-2 border-current px-6 py-3 shadow-2xl backdrop-blur-lg`}
          >
            <span
              className={`h-3 w-3 rounded-full ${statusInfo.dot} animate-pulse`}
            />
            <div>
              <p className="text-sm font-bold text-gray-900">
                {statusInfo.label}
              </p>
              <p className="text-xs text-gray-600">{statusInfo.sublabel}</p>
            </div>
            {["confirmed", "started"].includes(status) && (
              <div className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1">
                <Zap size={12} className="text-[#16a34a]" />
                <span className="text-xs font-bold text-gray-900">
                  {Math.round(displayEta)} min
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="z-40 max-h-[65vh] w-full overflow-y-auto rounded-t-3xl border-t-2 border-gray-200 bg-white shadow-2xl">
        <div className="flex justify-center pt-4 pb-2">
          <div className="h-1 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="border-b border-[#ecfdf5] bg-[#22c55e] px-6 py-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            Driver Panel
          </p>
          <h1 className="text-2xl font-black text-white">Active Ride</h1>
        </div>

        <PanelContent
          booking={booking}
          bookingId={booking._id}
          currentRole="driver"
          status={status}
          distanceToPickUp={distanceToPickUp}
          distanceToDrop={distanceToDrop}
          etaToPickUp={etaToPickUp}
          etaToDrop={etaToDrop}
          // onArrivePickup={handleArriveAtPickup}
          // onStartRide={handleStartRide}
          actionLoading={actionLoading}
        />

        <div className="h-4" />
      </div>
    </div>
  );
};

export default Page;