"use client";

import { getSocket } from "@/lib/socket";
import { IBooking } from "@/models/booking-model";
import axios from "axios";
import { MapPin, Navigation, Clock, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";

type RideRequest = {
  id: string;
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  timestamp: string;
};

export default function DriverRequestsPage() {
	const [bookings, setBookings] = useState<IBooking[]>([]);
	const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchPendingBookings = async () => {
    try {
      const { data } = await axios.get(
        "/api/partner/booking/pending"
      );
      console.log(data);
      
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchPendingBookings();
}, []);
const handleReject = async (bookingId: string) => {
	try {
	  const { data } = await axios.delete(
		`/api/partner/booking/${bookingId}/reject`
	  );
	  console.log(data);
	  
	  if (data.success) {
		// alert("Ride Rejected");
  
		setBookings((prev: any) =>
		  prev.filter(
			(booking: any) =>
			  booking._id !== bookingId
		  )
		);
	  }
	} catch (error: any) {
	  alert(
		error?.response?.data?.message ||
		"Failed to reject ride"
	  );
	}
  };

  const handleAccept = async (bookingId: string) => {
	try {
	  const { data } = await axios.patch(
		`/api/partner/booking/${bookingId}/accept`
	  );
	  console.log(data);
	  
	  if (data.success) {
		// alert("Ride Accepted");
  
		setBookings((prev: any) =>
		  prev.filter(
			(booking: any) =>
			  booking._id !== bookingId
		  )
		);
	  }
	} catch (error: any) {
	  alert(
		error?.response?.data?.message ||
		"Failed to accept ride"
	  );
	}
  };
  useEffect(() => {
    const socket = getSocket()
    socket.on("new-booking", (data) => {
     setBookings((prev) => ([...prev,data]))
    })
    return () => {
     socket.off("new-booking")
    }
   },[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4]">
      {/* Header */}
      <div className="border-b border-[#dcfce7] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Ride Requests
          </h1>
          <p className="text-base text-gray-500 font-medium max-w-2xl">
            Manage incoming ride requests and respond in real time.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-[#dcfce7]">
            <p className="text-lg text-gray-400 font-medium">
              No ride requests at the moment
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((request) => (
              <div
                key={request._id.toString()}
                className="bg-white rounded-3xl border border-[#dcfce7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                    {/* Left Section — Route Information */}
                    <div className="flex-1">
                      
                      {/* Pickup Location */}
                      <div className="flex gap-4 mb-6">
                        <div className="flex-shrink-0 pt-1">
                          <MapPin size={20} className="text-[#16a34a]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-1.5">
                            Pickup Location
                          </p>
                          <p className="text-base font-semibold text-gray-900 line-clamp-2">
                            {request.pickUpAddress}
                          </p>
                        </div>
                      </div>

                      {/* Drop Location */}
                      <div className="flex gap-4 mb-6">
                        <div className="flex-shrink-0 pt-1">
                          <Navigation size={20} className="text-[#16a34a]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-1.5">
                            Drop Location
                          </p>
                          <p className="text-base font-semibold text-gray-900 line-clamp-2">
                            {request.dropAddress}
                          </p>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="flex gap-4 items-start">
                        <Clock size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600 font-medium">
                          {request.createdAt.toString().slice(0,10)}
                        </p>
                      </div>

                    </div>

                    {/* Right Section — Fare & Actions */}
                    <div className="lg:w-80 lg:text-right">
                      
                      {/* Estimated Fare */}
                      <div className="mb-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-2">
                          Estimated Fare
                        </p>
                        <div className="flex lg:justify-end items-baseline gap-1">
                          <IndianRupee size={24} className="text-gray-900 flex-shrink-0" />
                          <span className="text-4xl font-extrabold text-gray-900">
                            {request.fare}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                        <button
                          onClick={() => handleReject(request._id.toString())}
                          className="flex-1 px-6 h-11 rounded-2xl border-2 border-gray-200 text-gray-900 font-bold text-sm transition-all hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAccept(request._id.toString())}
                          className="flex-1 px-6 h-11 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm transition-all shadow-[0_4px_12px_rgba(34,197,94,0.2)] hover:shadow-[0_6px_16px_rgba(34,197,94,0.3)] active:scale-95"
                        >
                          Accept Ride
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}