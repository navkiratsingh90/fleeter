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
  DatabaseZap,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import RideConfirmationCard from "@/components/RideConfirmationCard";
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

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [booking,setBooking] = useState<IBooking | null>(null)
  // const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [selectedPayment, setSelectedPayment] = useState<"cash" | "online">("cash");

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

  const { Icon } = VEHICLE_META[vehicle] || VEHICLE_META.car;

  const fetchCurrentBooking = async () => {
    try {
      const { data } = await axios.get("/api/booking/active");
      console.log(data);
      if (data.success) {
        setBooking(data.booking)
        setStatus(data.booking.bookingStatus ?? "idle")

      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  const handleRequestRide = async () => {
    try {
      // setLoading(true);
      setStatus("requested");

      const { data } = await axios.post("/api/booking/create", {
        driverId,
        vehicleId,
        pickUpAddress: pickup,
        dropAddress: drop,
        pickUpLocation: {
          type: "Point",
          coordinates: [Number(pickUpLon), Number(pickUpLat)],
        },
        dropLocation: {
          type: "Point",
          coordinates: [Number(dropLon), Number(dropLat)],
        },
        fare: Math.round(Number(fare)),
        mobileNumber,
      });
      console.log(data);
      
      if (!data.success) {
        alert(data.message);
        setStatus("idle");
        // setLoading(false);
        return;
      }


    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to request ride");
      setStatus("idle");
      // setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    try {
      const { data } = await axios.patch(
        `/api/booking/${booking?._id}/cancel`
      );
      console.log(DatabaseZap);
      
      if (data.success) {
        alert("Booking Cancelled");
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
  
      const { data } = await axios.patch(
        `/api/booking/${booking._id}/cash-payment`
      );
      console.log(data);
      
      if (data.success) {
        setBooking(data.booking);
        setStatus(data.booking.bookingStatus);
  
        alert("Cash payment selected");
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to confirm payment"
      );
    }
  };
  // const handleConfirmPayment = async (method: "cash" | "online") => {
  //   try {
  //     setSelectedPayment(method);
  //     alert(`Booking confirmed with ${method} payment!`);
  //     setStatus("idle");
  //   } catch (error) {
  //     console.error("Error confirming payment:", error);
  //   }
  // };

  useEffect(() => {
    fetchCurrentBooking();
  }, []);
  useEffect(() => {
    const socket = getSocket()
    socket.on("accept-booking", (data) => {
      setStatus(data)
    })
    return () => {
     socket.off("accept-booking")
    }
   },[])
   useEffect(() => {
    const socket = getSocket()
    socket.on("reject-booking", (data) => {
      setStatus(data)
    })
    return () => {
     socket.off("reject-booking")
    }
   },[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10 bg-[#22c55e]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a]">
              Booking
            </span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Checkout
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Review your ride and confirm booking
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left Card — Ride Details */}
          <div className="bg-white rounded-3xl border border-[#bbf7d0] shadow-lg overflow-hidden">
            <div className="h-1 bg-[#22c55e]" />

            <div className="p-8 sm:p-10">

              {/* Vehicle Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a]">
                    Selected Vehicle
                  </p>

                  <h2 className="text-4xl font-extrabold text-gray-900 capitalize mt-2">
                    {vehicle}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#22c55e] grid place-items-center shadow-md">
                  <Icon size={24} className="text-white" />
                </div>
              </div>

              {/* Route Information */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl overflow-hidden mb-8">

                {/* Pickup */}
                <div className="flex gap-4 px-5 py-4 border-b border-[#dcfce7]">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                    <div className="w-px flex-1 bg-[#bbf7d0] my-1" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                      Pickup
                    </p>

                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {pickup}
                    </p>
                  </div>

                  <MapPin size={14} className="text-[#16a34a] mt-1" />
                </div>

                {/* Drop */}
                <div className="flex gap-4 px-5 py-4">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                      Drop
                    </p>

                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {drop}
                    </p>
                  </div>

                  <Navigation size={14} className="text-[#16a34a] mt-1" />
                </div>
              </div>

              {/* Total Fare */}
              <div className="flex items-end justify-between pt-6 border-t border-[#dcfce7]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
                    Total Fare
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Includes base + distance charges
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <IndianRupee size={22} className="text-gray-900" />
                  <span className="text-4xl font-extrabold text-gray-900">
                    {Math.round(Number(fare))}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Card — Dynamic Ride Confirmation States */}
 {/* Right Card — Dynamic Ride Confirmation States */}
<div className="bg-white rounded-3xl border border-[#bbf7d0] shadow-lg overflow-hidden flex flex-col">
  {/* Top border */}
  <div className="h-1 bg-[#22c55e]" />

  {/* Content */}
  <div className="p-8 sm:p-10 flex flex-col flex-1 justify-between min-h-[420px]">
    {/* ─────── STATE 1: IDLE ─────── */}
    {status === "idle" && (
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-3">
            Ready to go?
          </p>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
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
                className="flex items-center gap-3 bg-[#f8fffb] px-4 py-3 rounded-2xl border border-[#dcfce7]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#16a34a] flex-shrink-0">
                  {item.icon}
                </div>
                <p className="text-sm text-gray-800 font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleRequestRide}
          // disabled={loading}
          className="mt-8 w-full h-12 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          Request Ride
          <span className="text-base">→</span>
        </button>
      </div>
    )}

    {/* ─────── STATE 2: REQUESTED ─────── */}
    {status === "requested" && (
      <div className="flex flex-col flex-1 justify-between items-center">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-8">
            <div className="w-28 h-28 rounded-full border-4 border-gray-200 border-t-[#22c55e] animate-spin" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
            Finding Your Driver
          </h2>
          <p className="text-base text-gray-400 font-medium text-center">
            Waiting for driver to accept...
          </p>
        </div>

        <button
          onClick={handleCancelRequest}
          // disabled={loading}
          className="mt-8 px-8 h-11 rounded-2xl border-2 border-gray-400 hover:border-gray-500 text-gray-900 font-bold text-sm transition-all hover:bg-gray-50 active:bg-gray-100 flex items-center gap-2"
        >
          <X size={16} />
          Cancel Request
        </button>
      </div>
    )}

    {/* ─────── STATE 3: AWAITING_PAYMENT ─────── */}
    {status === "awaiting_payment" && (
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#16a34a] mb-4">
            Almost there
          </p>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Select Payment Method
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedPayment("cash")}
              className={`w-full px-6 py-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                selectedPayment === "cash"
                  ? "bg-gray-900 border-gray-900 shadow-lg"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedPayment === "cash" ? "bg-gray-700" : "bg-gray-100"
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
                <CheckCircle2 size={22} className="text-white" />
              )}
            </button>

            <button
              onClick={() => setSelectedPayment("online")}
              className={`w-full px-6 py-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                selectedPayment === "online"
                  ? "bg-gray-900 border-gray-900 shadow-lg"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
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
                <CheckCircle2 size={22} className="text-white" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleConfirmPayment}
          // disabled={loading}
          className="mt-8 w-full h-12 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <DollarSign size={16} />
          Confirm {selectedPayment === "cash" ? "Cash" : "Online"} Ride
        </button>
      </div>
    )}

    {/* ─────── STATE 4: CONFIRMED ─────── */}
    {status === "confirmed" && (
      <div className="flex flex-col items-center justify-center flex-1 text-center px-2">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-[#f8fffb] blur-2xl scale-150" />
          <div className="relative w-24 h-24 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center shadow-sm">
            <CheckCircle2 size={44} className="text-gray-900" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900">
          Ride Confirmed!
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
          Your driver is on the way. Track live from the ride screen.
        </p>

        <button
          onClick={() => router.push(`/user/track-ride/${booking?._id}`)}
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:bg-gray-800 active:scale-95"
        >
          Track Your Ride
          <Navigation size={16} />
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