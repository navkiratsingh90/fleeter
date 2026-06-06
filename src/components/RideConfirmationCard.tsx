"use client";

import {
  Clock,
  Shield,
  CreditCard,
  DollarSign,
  Wallet,
  CheckCircle2,
  X,
} from "lucide-react";
import { useState } from "react";

type RideStatus =
  | "idle"
  | "requested"
  | "awaiting_payment";

type PaymentMethod = "cash" | "online";

interface RideConfirmationCardProps {
  status?: RideStatus;
  onRequestRide?: () => void;
  onCancelRequest?: () => void;
  onConfirmPayment?: (method: PaymentMethod) => void;
  loading?: boolean;
}

export default function RideConfirmationCard({
  status,
  onRequestRide,
  onCancelRequest,
  onConfirmPayment,
  loading = false,
}: RideConfirmationCardProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cash");
	console.log(status);
	
  return (
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

              {/* Benefits List */}
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

            {/* Request Ride Button */}
            <button
              onClick={onRequestRide}
              disabled={loading}
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
              {/* Loading Spinner */}
              <div className="mb-8">
                <div className="w-28 h-28 rounded-full border-4 border-gray-200 border-t-[#22c55e] animate-spin" />
              </div>

              {/* Finding Driver Text */}
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
                Finding Your Driver
              </h2>
              <p className="text-base text-gray-400 font-medium text-center">
                Waiting for driver to accept...
              </p>
            </div>

            {/* Cancel Request Button */}
            <button
              onClick={onCancelRequest}
              disabled={loading}
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

              {/* Payment Options */}
              <div className="space-y-3">
                {/* Cash Option (Selected) */}
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
                    <CheckCircle2 size={22} className="text-white" />
                  )}
                </button>

                {/* Online Payment Option */}
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

            {/* Confirm Payment Button */}
            <button
              onClick={() => onConfirmPayment?.(selectedPayment)}
              disabled={loading}
              className="mt-8 w-full h-12 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <DollarSign size={16} />
              Confirm {selectedPayment === "cash" ? "Cash" : "Online"} Ride
            </button>
          </div>
        )}
      </div>
    </div>
  );
}