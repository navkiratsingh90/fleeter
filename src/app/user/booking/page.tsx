"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Bike,
  ChevronRight,
  IndianRupee,
  Phone,
  User,
  Calendar,
  MapPin,
  Shield,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  driver?: {
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

function BookingCard({
  booking,
  onDetails,
  onCancel,
}: {
  booking: BookingItem;
  onDetails: (b: BookingItem) => void;
  onCancel: (id: string) => void;
}) {
  const status = booking.bookingStatus ?? "requested";
  const payment = booking.paymentStatus ?? "pending";

  return (
    <div className="overflow-hidden rounded-[22px] border border-[#e5e7eb] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
      <div className="h-1 bg-[#22c55e]" />

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#bbf7d0] bg-[#f0fdf4]">
                <User size={22} className="text-[#16a34a]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {booking.driver?.name || "Driver"}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                  <Phone size={12} />
                  {booking.driver?.mobileNumber || "N/A"}
                </p>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-2 text-sm text-gray-700">
              <Bike size={16} className="text-gray-400" />
              <span className="font-semibold">
                {booking.vehicle?.vehicleModel || "Vehicle"} •{" "}
                {booking.vehicle?.number || "N/A"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="mt-1 flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                  <div className="min-h-6 w-px flex-1 bg-[#bbf7d0]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                    Pickup Location
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                    {booking.pickUpAddress}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Drop Location
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                    {booking.dropAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 lg:min-w-[230px] lg:items-end">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Total Fare
              </p>
              <div className="flex items-baseline justify-end gap-1">
                <IndianRupee size={20} className="text-gray-900" />
                <span className="text-3xl font-extrabold text-gray-900">
                  {booking.fare ?? 0}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge className="rounded-full border border-[#bbf7d0] bg-[#22c55e] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                {status.replace(/_/g, " ")}
              </Badge>

              <Badge className="rounded-full bg-[#22c55e] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                {payment}
              </Badge>
            </div>

            <div className="flex gap-2">
              {(status === "requested" ||
                status === "confirmed" ||
                status === "awaiting_payment") && (
                <Button
                  variant="outline"
                  onClick={() => onCancel(booking._id)}
                  className="h-11 rounded-xl border-gray-200 bg-white px-5 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              )}

              <Button
                onClick={() => onDetails(booking)}
                className="h-11 rounded-xl bg-[#22c55e] px-5 text-white hover:bg-[#16a34a]"
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

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"All" | BookingStatus>("All");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/booking");
      if (data.success) setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const { data } = await axios.patch(`/api/booking/${id}/cancel`);
      if (data.success) {
        await fetchBookings();
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to cancel booking");
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
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#bbf7d0] bg-[#f0fdf4]">
              <Bike size={28} className="text-[#16a34a]" />
            </div>
            <div>
              <h1 className="mb-1 text-4xl font-black text-gray-900">
                My Bookings
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Manage your ride requests and booking history
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-gray-600">
            Showing {filteredBookings.length} bookings
          </p>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
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
                onCancel={cancelBooking}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-base font-semibold text-gray-400">
              No bookings found
            </p>
          </div>
        )}
      </div>

    </div>
  );
}