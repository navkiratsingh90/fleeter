"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Bike,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  MapPin,
  Navigation2,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSocket } from "@/lib/socket";

type BookingStatus =
  | "requested"
  | "confirmed"
  | "started"
  | "completed"
  | "awaiting_payment"
  | "cancelled"
  | "rejected"
  | "expired";

type PaymentStatus = "pending" | "paid" | "failed" | "cash";

type BookingItem = {
  _id: string;
  user?: {
    name?: string;
    mobileNumber?: string;
    email?: string;
  };
  vehicle?: {
    vehicleModel?: string;
    number?: string;
    type?: string;
  };
  pickUpAddress?: string;
  dropAddress?: string;
  fare?: number;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  createdAt?: string;
};

// const statusStyle: Record<BookingStatus, string> = {
//   requested: "bg-blue-50 text-blue-700 border-blue-100",
//   confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
//   started: "bg-purple-50 text-purple-700 border-purple-100",
//   completed: "bg-gray-50 text-gray-700 border-gray-100",
//   awaiting_payment: "bg-amber-50 text-amber-700 border-amber-100",
//   cancelled: "bg-red-50 text-red-700 border-red-100",
//   rejected: "bg-red-50 text-red-700 border-red-100",
//   expired: "bg-zinc-50 text-zinc-700 border-zinc-200",
// };

const paymentStyle: Record<PaymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  cash: "bg-blue-100 text-blue-700",
};

function BookingCard({
  booking,
  onDetails,
  onAccept,
  onReject,
}: {
  booking: BookingItem;
  onDetails: (b: BookingItem) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const status = booking.bookingStatus ?? "requested";
  const payment = booking.paymentStatus ?? "pending";

  return (
    <div className="rounded-[22px] border border-[#e5e7eb] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="h-1 bg-[#22c55e]" />

      <div className="p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center">
                <User size={22} className="text-[#16a34a]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {booking.user?.name || "Customer"}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Phone size={12} />
                  {booking.user?.mobileNumber || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
              <Bike size={16} className="text-gray-400" />
              <span className="font-semibold">
                {booking.vehicle?.vehicleModel || "Vehicle"} •{" "}
                {booking.vehicle?.number || "N/A"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="mt-1 flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                  <div className="w-px flex-1 min-h-6 bg-[#bbf7d0]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                    Pickup Location
                  </p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    {booking.pickUpAddress}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Drop Location
                  </p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    {booking.dropAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:min-w-[230px] flex flex-col items-start lg:items-end gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Estimated Fare
              </p>
              <div className="flex items-baseline gap-1 justify-end">
                <IndianRupee size={20} className="text-gray-900" />
                <span className="text-3xl font-extrabold text-gray-900">
                  {booking.fare ?? 0}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-end">
              <Badge
                className={`rounded-full border px-3 py-1 bg-[#22c55e] text-[11px]  text-white font-semibold uppercase tracking-wider `}
              >
                {status.replace(/_/g, " ")}
              </Badge>

              <Badge className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider bg-[#22c55e] text-white`}>
                {payment}
              </Badge>
            </div>

            <div className="flex gap-2">
              {status === "requested" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => onReject(booking._id)}
                    className="h-11 rounded-xl px-5 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => onAccept(booking._id)}
                    className="h-11 rounded-xl px-5 bg-[#111827] text-white hover:bg-[#0f172a]"
                  >
                    Accept Ride
                  </Button>
                </>
              )}

              <Button
                onClick={() => onDetails(booking)}
                className="h-11 rounded-xl px-5 bg-[#22c55e] text-white hover:bg-[#16a34a]"
              >
                Details
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnerBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"All" | BookingStatus>("All");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/partner/booking");
      if (data.success) setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRide = async (id: string) => {
    try {
      const { data } = await axios.patch(`/api/partner/booking/accept/${id}`);
      if (data.success) fetchBookings();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to accept ride");
    }
  };

  const rejectRide = async (id: string) => {
    try {
      const { data } = await axios.patch(`/api/partner/booking/reject/${id}`);
      if (data.success) fetchBookings();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to reject ride");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (filterStatus === "All") return bookings;
    return bookings.filter((b) => b.bookingStatus === filterStatus);
  }, [bookings, filterStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4]">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center">
              <Bike size={28} className="text-[#16a34a]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-1">
                Partner Bookings
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Manage incoming bookings and ride history
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600 font-semibold">
            Showing {filteredBookings.length} bookings
          </p>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
          >
            <option value="All">All</option>
            <option value="requested">Requested</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="confirmed">Confirmed</option>
            <option value="started">Started</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
            Loading bookings...
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onDetails={(b) => {
                  setSelectedBooking(b);
                  setModalOpen(true);
                }}
                onAccept={acceptRide}
                onReject={rejectRide}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-base text-gray-400 font-semibold">
              No bookings found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}