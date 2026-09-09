"use client";

import {
  Bike,
  Car,
  Truck,
  MapPin,
  Navigation,
  IndianRupee,
  CheckCircle2,
  DollarSign,
  Wallet,
  X,
  CreditCard,
  Shield,
  Clock,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { IBooking, PaymentStatus } from "@/models/booking-model";
import { getSocket } from "@/lib/socket";

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

const VEHICLE_META: any = {
  bike: { label: "Bike", Icon: Bike },
  auto: { label: "Auto", Icon: Car },
  car: { label: "Car", Icon: Car },
  loading: { label: "Loading", Icon: Truck },
  truck: { label: "Truck", Icon: Truck },
};

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [selectedPayment, setSelectedPayment] =
    useState<"cash" | "online">("cash");

  const pickup = params.get("pickup") || "";
  const drop = params.get("drop") || "";
  const vehicle = params.get("vehicle") || "";
  const fare = params.get("fare") || "";
  const driverId = params.get("driverId") || "";
  const vehicleId = params.get("vehicleId") || "";
  const mobileNumber = params.get("mobile") || "";

  const pickUpLat = params.get("pickUpLat") || "";
  const pickUpLon = params.get("pickUpLon") || "";
  const dropLat = params.get("dropLat") || "";
  const dropLon = params.get("dropLon") || "";
  const distance = params.get("distance") || "";

  const { Icon } =
    VEHICLE_META[vehicle] || VEHICLE_META.car;

  const fetchCurrentBooking = async () => {
    try {
      const { data } = await axios.get(
        "/api/booking/active"
      );

      console.log(data);

      if (data.success && data.booking) {
        setBooking(data.booking);

        setStatus(
          data.booking.bookingStatus ?? "idle"
        );
      }
    } catch (error) {
      console.error(
        "Error fetching booking:",
        error
      );
    }
  };

  const handleRequestRide = async () => {
    try {
      setStatus("requested");

      const { data } = await axios.post(
        "/api/booking/create",
        {
          driverId,
          vehicleId,
          pickUpAddress: pickup,
          dropAddress: drop,
          distance: Number(distance),

          pickUpLocation: {
            type: "Point",
            coordinates: [
              Number(pickUpLon),
              Number(pickUpLat),
            ],
          },

          dropLocation: {
            type: "Point",
            coordinates: [
              Number(dropLon),
              Number(dropLat),
            ],
          },

          fare: Math.round(Number(fare)),
          mobileNumber,
        }
      );

      console.log(data);

      if (!data.success) {
        alert(data.message);
        setStatus("idle");
        return;
      }

      if (data.booking) {
        setBooking(data.booking);

        setStatus(
          data.booking.bookingStatus ?? "requested"
        );
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to request ride"
      );

      setStatus("idle");
    }
  };

  const handleCancelRequest = async () => {
    try {
      if (!booking?._id) {
        alert("Booking not found");
        return;
      }

      const { data } = await axios.patch(
        `/api/booking/${booking._id}/cancel`
      );

      console.log(data);

      if (data.success) {
        alert("Booking Cancelled");
        setStatus("cancelled");
        setBooking(null);
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to cancel booking"
      );
    }
  };

  const handleConfirmPayment = async () => {
    try {
      if (!booking?._id) {
        alert("Booking not found");
        return;
      }

      /*
       * Currently the API handles cash payment.
       * Keep online selection in UI for now.
       */
      if (selectedPayment === "online") {
        alert(
          "Online payment is currently not available."
        );
        return;
      }

      const { data } = await axios.patch(
        `/api/booking/${booking._id}/cash-payment`
      );

      console.log(data);

      if (data.success) {
        setBooking(data.booking);

        setStatus(
          data.booking.bookingStatus
        );

        alert("Cash payment selected");
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to confirm payment"
      );
    }
  };

  /*
   * Fetch current active booking
   */
  useEffect(() => {
    fetchCurrentBooking();
  }, []);

  /*
   * Listen for accepted booking
   */
  useEffect(() => {
    const socket = getSocket();

    const handleAcceptBooking = (
      data: BookingStatus
    ) => {
      setStatus(data);
      fetchCurrentBooking();
    };

    socket.on(
      "accept-booking",
      handleAcceptBooking
    );

    return () => {
      socket.off(
        "accept-booking",
        handleAcceptBooking
      );
    };
  }, []);

  /*
   * Listen for rejected booking
   */
  useEffect(() => {
    const socket = getSocket();

    const handleRejectBooking = (
      data: BookingStatus
    ) => {
      setStatus(data);
    };

    socket.on(
      "reject-booking",
      handleRejectBooking
    );

    return () => {
      socket.off(
        "reject-booking",
        handleRejectBooking
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#22c55e]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a]">
              Booking
            </span>

            <div className="h-px w-10 bg-[#22c55e]" />
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review your ride and confirm booking
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Left Card */}
          <div className="overflow-hidden rounded-3xl border border-[#bbf7d0] bg-white shadow-lg">
            <div className="h-1 bg-[#22c55e]" />

            <div className="p-8 sm:p-10">

              {/* Vehicle Header */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a]">
                    Selected Vehicle
                  </p>

                  <h2 className="mt-2 text-4xl font-extrabold capitalize text-gray-900">
                    {vehicle || "Vehicle"}
                  </h2>
                </div>

                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#22c55e] shadow-md">
                  <Icon
                    size={24}
                    className="text-white"
                  />
                </div>
              </div>

              {/* Route Information */}
              <div className="mb-8 overflow-hidden rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4]">

                {/* Pickup */}
                <div className="flex gap-4 border-b border-[#dcfce7] px-5 py-4">
                  <div className="flex flex-col items-center pt-1">
                    <div className="h-3 w-3 rounded-full bg-[#22c55e]" />

                    <div className="my-1 w-px flex-1 bg-[#bbf7d0]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                      Pickup
                    </p>

                    <p className="truncate text-sm font-semibold text-gray-900">
                      {pickup}
                    </p>
                  </div>

                  <MapPin
                    size={14}
                    className="mt-1 text-[#16a34a]"
                  />
                </div>

                {/* Drop */}
                <div className="flex gap-4 px-5 py-4">
                  <div className="flex flex-col items-center pt-1">
                    <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                      Drop
                    </p>

                    <p className="truncate text-sm font-semibold text-gray-900">
                      {drop}
                    </p>
                  </div>

                  <Navigation
                    size={14}
                    className="mt-1 text-[#16a34a]"
                  />
                </div>
              </div>

              {/* Total Fare */}
              <div className="flex items-end justify-between border-t border-[#dcfce7] pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                    Total Fare
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Includes base + distance charges
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <IndianRupee
                    size={22}
                    className="text-gray-900"
                  />

                  <span className="text-4xl font-extrabold text-gray-900">
                    {Math.round(Number(fare))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-[#bbf7d0] bg-white shadow-lg">

            <div className="h-1 bg-[#22c55e]" />

            <div className="flex min-h-[420px] flex-1 flex-col justify-between p-8 sm:p-10">

              {/* IDLE */}
              {status === "idle" && (
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a]">
                      Ready to go?
                    </p>

                    <h2 className="mb-8 text-3xl font-extrabold text-gray-900">
                      Confirm Your Ride
                    </h2>

                    <div className="space-y-4">
                      {[
                        {
                          icon: <Clock size={15} />,
                          text: "Driver will respond within 2 minutes",
                        },
                        {
                          icon: <Shield size={15} />,
                          text: "Verified & insured drivers only",
                        },
                        {
                          icon: <CreditCard size={15} />,
                          text: "Pay after driver accepts",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-2xl border border-[#dcfce7] bg-[#f8fffb] px-4 py-3"
                        >
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#dcfce7] text-[#16a34a]">
                            {item.icon}
                          </div>

                          <p className="text-sm font-medium text-gray-800">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleRequestRide}
                    className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 text-[15px] font-bold text-white transition-all hover:bg-gray-800 active:scale-95"
                  >
                    Request Ride
                    <span className="text-base">
                      →
                    </span>
                  </button>
                </div>
              )}

              {/* REQUESTED */}
              {status === "requested" && (
                <div className="flex flex-1 flex-col items-center justify-between">
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <div className="mb-8">
                      <div className="h-28 w-28 animate-spin rounded-full border-4 border-gray-200 border-t-[#22c55e]" />
                    </div>

                    <h2 className="mb-2 text-center text-3xl font-extrabold text-gray-900">
                      Finding Your Driver
                    </h2>

                    <p className="text-center text-base font-medium text-gray-400">
                      Waiting for driver to accept...
                    </p>
                  </div>

                  <button
                    onClick={handleCancelRequest}
                    className="mt-8 flex h-11 items-center gap-2 rounded-2xl border-2 border-gray-400 px-8 text-sm font-bold text-gray-900 transition-all hover:border-gray-500 hover:bg-gray-50 active:bg-gray-100"
                  >
                    <X size={16} />
                    Cancel Request
                  </button>
                </div>
              )}

              {/* AWAITING PAYMENT */}
              {status === "awaiting_payment" && (
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a]">
                      Almost there
                    </p>

                    <h2 className="mb-8 text-3xl font-extrabold text-gray-900">
                      Select Payment Method
                    </h2>

                    <div className="space-y-3">

                      {/* CASH */}
                      <button
                        onClick={() =>
                          setSelectedPayment("cash")
                        }
                        className={`flex w-full items-center justify-between rounded-2xl border-2 px-6 py-4 transition-all ${
                          selectedPayment === "cash"
                            ? "border-gray-900 bg-gray-900 shadow-lg"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              selectedPayment === "cash"
                                ? "bg-gray-700"
                                : "bg-gray-100"
                            }`}
                          >
                            <DollarSign
                              size={18}
                              className={
                                selectedPayment === "cash"
                                  ? "text-white"
                                  : "text-gray-600"
                              }
                            />
                          </div>

                          <div className="text-left">
                            <p
                              className={`font-bold ${
                                selectedPayment === "cash"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Cash
                            </p>

                            <p
                              className={`text-xs ${
                                selectedPayment === "cash"
                                  ? "text-gray-300"
                                  : "text-gray-500"
                              }`}
                            >
                              Pay driver after ride
                            </p>
                          </div>
                        </div>

                        {selectedPayment === "cash" && (
                          <CheckCircle2
                            size={22}
                            className="text-white"
                          />
                        )}
                      </button>

                      {/* ONLINE */}
                      <button
                        onClick={() =>
                          setSelectedPayment("online")
                        }
                        className={`flex w-full items-center justify-between rounded-2xl border-2 px-6 py-4 transition-all ${
                          selectedPayment === "online"
                            ? "border-gray-900 bg-gray-900 shadow-lg"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              selectedPayment === "online"
                                ? "bg-gray-700"
                                : "bg-gray-100"
                            }`}
                          >
                            <Wallet
                              size={18}
                              className={
                                selectedPayment === "online"
                                  ? "text-white"
                                  : "text-gray-600"
                              }
                            />
                          </div>

                          <div className="text-left">
                            <p
                              className={`font-bold ${
                                selectedPayment === "online"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Online Payment
                            </p>

                            <p
                              className={`text-xs ${
                                selectedPayment === "online"
                                  ? "text-gray-300"
                                  : "text-gray-500"
                              }`}
                            >
                              UPI · Card · Netbanking
                            </p>
                          </div>
                        </div>

                        {selectedPayment === "online" && (
                          <CheckCircle2
                            size={22}
                            className="text-white"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 text-[15px] font-bold text-white transition-all hover:bg-gray-800 active:scale-95"
                  >
                    <DollarSign size={16} />

                    Confirm{" "}
                    {selectedPayment === "cash"
                      ? "Cash"
                      : "Online"}{" "}
                    Ride
                  </button>
                </div>
              )}

              {/* CONFIRMED */}
              {status === "confirmed" && (
                <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 scale-150 rounded-full bg-[#f8fffb] blur-2xl" />

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#e5e7eb] bg-[#f3f4f6] shadow-sm">
                      <CheckCircle2
                        size={44}
                        className="text-gray-900"
                      />
                    </div>
                  </div>

                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Ride Confirmed!
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                    Your driver is on the way. Track
                    live from the ride screen.
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        `/user/track-ride/${booking?._id}`
                      )
                    }
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:bg-gray-800 active:scale-95"
                  >
                    Track Your Ride
                    <Navigation size={16} />
                  </button>
                </div>
              )}

              {/* STARTED */}
              {status === "started" && (
                <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
                  <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#bbf7d0] bg-[#f0fdf4]">
                    <Navigation
                      size={42}
                      className="text-[#16a34a]"
                    />
                  </div>

                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Ride in Progress
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                    Your ride has started. You can track
                    your ride in real time.
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        `/user/track-ride/${booking?._id}`
                      )
                    }
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-gray-800 active:scale-95"
                  >
                    Track Your Ride
                    <Navigation size={16} />
                  </button>
                </div>
              )}

              {/* CANCELLED */}
              {status === "cancelled" && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                    <X
                      size={40}
                      className="text-red-500"
                    />
                  </div>

                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Ride Cancelled
                  </h2>

                  <p className="mt-3 text-sm text-gray-500">
                    This booking has been cancelled.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/user/bookings")
                    }
                    className="mt-8 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    Book Another Ride
                  </button>
                </div>
              )}

              {/* REJECTED */}
              {status === "rejected" && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                    <X
                      size={40}
                      className="text-red-500"
                    />
                  </div>

                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Driver Rejected
                  </h2>

                  <p className="mt-3 text-sm text-gray-500">
                    The driver was unable to accept this
                    ride.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/user/bookings")
                    }
                    className="mt-8 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    Find Another Ride
                  </button>
                </div>
              )}

              {/* EXPIRED */}
              {status === "expired" && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                    <Clock
                      size={40}
                      className="text-orange-500"
                    />
                  </div>

                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Request Expired
                  </h2>

                  <p className="mt-3 text-sm text-gray-500">
                    The driver did not respond in time.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/user/bookings")
                    }
                    className="mt-8 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    Book Again
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * IMPORTANT:
 * useSearchParams() is inside CheckoutContent.
 * CheckoutContent is rendered inside Suspense.
 */
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4]">
          <div className="text-sm font-medium text-gray-500">
            Loading checkout...
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}