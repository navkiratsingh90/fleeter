"use client";

import LiveRideMap from "@/components/LiveRideMap";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PanelContent } from "@/components/PanelContent";
import { getSocket } from "@/lib/socket";
import RideCompleted from "@/components/RideCompleted";
import { PaymentStatus } from "@/models/booking-model";

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
  paymentStatus : PaymentStatus,
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

export default function TrackRidePage() {
  const params = useParams();
  const bookingId = params?.id as string;

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
  const [actionLoading] = useState(false);

  const fetchActiveBooking = async () => {
    try {
      const {data} = await axios.get(`/api/user/track-ride/${bookingId}`);
      // const ride = response.data.activeRide as IBooking | null;
      console.log(data);

      setBooking(data.booking);
      setStatus(data.booking.bookingStatus || "idle");

      if (data.booking?.pickupLocation?.coordinates) {
        setPickUpPos([data.booking?.pickupLocation.coordinates[1], data.booking?.pickupLocation.coordinates[0]]);
      }
      if (data.booking?.dropLocation?.coordinates) {
        setDropPos([data.booking?.dropLocation.coordinates[1], data.booking?.dropLocation.coordinates[0]]);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "No active ride found");
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    if (bookingId) {
      fetchActiveBooking();
    }
  }, [bookingId]);

  useEffect(() => { 
    const socket = getSocket()
    socket.emit("join-ride" , bookingId)
    socket.on("driver-location" ,({latitude,longitude}) => {
      setDriverPos([latitude,longitude])
    })
    return () => {
      socket.off("join-ride");
      socket.off("driver-location")
    }
  },[])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4]">
        <Card className="rounded-3xl p-8 text-center shadow-xl">
          <Loader2 className="mx-auto animate-spin text-[#22c55e]" size={40} />
          <p className="mt-4 text-gray-600 font-medium">Loading ride details...</p>
        </Card>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] p-4">
        <Card className="w-full max-w-md rounded-3xl p-8 text-center shadow-xl">
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
  if (status === "completed") {
    return (
      <RideCompleted
        fare={booking?.fare || 0}
        customerName={booking?.user?.name || "Customer"}
        paymentStatus={booking?.paymentStatus}
      />
    );
  }
  const statusInfo = STATUS_LABEL[status] || STATUS_LABEL.idle;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* Map Section */}
      <div className="relative z-0 flex-1 overflow-hidden">
        <LiveRideMap
          driverLocation={driverPos}
          pickUpLocation={pickUpPos}
          dropLocation={dropPos}
          mapStatus={MAP_STATUS[status]}
          onStats={({ distanceToPickUp, etaToPickUp, distanceToDrop, etaToDrop }) => {
            setDistanceToPickUp(distanceToPickUp);
            setEtaToPickUp(etaToPickUp);
            setDistanceToDrop(distanceToDrop);
            setEtaToDrop(etaToDrop);
          }}
        />

        {/* Status Badge */}
        <div className="pointer-events-auto absolute left-1/2 top-6 z-[9999] -translate-x-1/2 w-[90%] max-w-xs">
          <div className={`flex items-center gap-3 ${statusInfo.bgColor} rounded-3xl border border-gray-200/50 px-5 py-3 shadow-2xl backdrop-blur-md`}>
            <span className={`h-3 w-3 flex-shrink-0 rounded-full ${statusInfo.dot} animate-pulse`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">{statusInfo.label}</p>
              <p className="text-xs text-gray-600 truncate">{statusInfo.sublabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="z-40 max-h-[65vh] w-full overflow-y-auto rounded-t-3xl border-t border-gray-200 bg-white shadow-2xl">
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="bg-[#22c55e] px-6 py-4">
          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
            Ride Tracker
          </p>
          <h1 className="text-xl font-black text-white">Your Ride</h1>
        </div>

        <PanelContent
          booking={booking}
          bookingId={booking._id}
          currentRole="user" // Correct role for ride consumer
          status={status}
          distanceToPickUp={distanceToPickUp}
          distanceToDrop={distanceToDrop}
          etaToPickUp={etaToPickUp}
          etaToDrop={etaToDrop}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
}