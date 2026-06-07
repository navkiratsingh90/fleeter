// // app/partner/my-active/page.tsx
// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import {
//   Bike,
//   MapPin,
//   Navigation,
//   Phone,
//   User,
//   IndianRupee,
//   Clock,
//   AlertCircle,
//   Loader2,
//   Crosshair,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// // Types
// interface IBooking {
//   _id: string;
//   user: {
//     name: string;
//     mobileNumber: string;
//     email?: string;
//   };
//   vehicle: {
//     vehicleModel: string;
//     number: string;
//     type: string;
//   };
//   pickUpAddress: string;
//   dropAddress: string;
//   fare: number;
//   bookingStatus: string;
//   paymentStatus: string;
//   createdAt: string;
//   pickUpPos?: { lat: number; lng: number };
//   dropPos?: { lat: number; lng: number };
// }

// // Helper to format date
// const formatDate = (dateString?: string) => {
//   if (!dateString) return "N/A";
//   return new Date(dateString).toLocaleString("en-IN", {
//     day: "numeric",
//     month: "short",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// // Dynamic Map component (avoids SSR issues with Leaflet)
// const DynamicMap = ({
//   driverPos,
//   pickUpPos,
//   dropPos,
// }: {
//   driverPos: [number, number] | null;
//   pickUpPos: [number, number] | null;
//   dropPos: [number, number] | null;
// }) => {
//   const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);

//   useEffect(() => {
//     // Dynamically import Leaflet only on client side
//     import("leaflet").then((L) => {
//       import("react-leaflet").then(({ MapContainer, TileLayer, Marker, Popup, Polyline }) => {
//         setMapComponent(() => (props: any) => (
//           <MapContainer
//             center={props.center}
//             zoom={13}
//             style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
//             className="z-0"
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//               url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
//             />
//             {props.driverPos && (
//               <Marker position={props.driverPos} icon={L.icon({
//                 iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
//                 iconSize: [32, 32],
//                 iconAnchor: [16, 32],
//                 popupAnchor: [0, -32],
//               })}>
//                 <Popup>Driver (You)</Popup>
//               </Marker>
//             )}
//             {props.pickUpPos && (
//               <Marker position={props.pickUpPos} icon={L.icon({
//                 iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//                 iconSize: [28, 28],
//                 iconAnchor: [14, 28],
//                 popupAnchor: [0, -28],
//               })}>
//                 <Popup>Pickup</Popup>
//               </Marker>
//             )}
//             {props.dropPos && (
//               <Marker position={props.dropPos} icon={L.icon({
//                 iconUrl: "https://cdn-icons-png.flaticon.com/512/3173/3173641.png",
//                 iconSize: [28, 28],
//                 iconAnchor: [14, 28],
//                 popupAnchor: [0, -28],
//               })}>
//                 <Popup>Drop</Popup>
//               </Marker>
//             )}
//             {props.driverPos && props.pickUpPos && (
//               <Polyline positions={[props.driverPos, props.pickUpPos]} color="#22c55e" weight={3} />
//             )}
//             {props.pickUpPos && props.dropPos && (
//               <Polyline positions={[props.pickUpPos, props.dropPos]} color="#f97316" weight={3} dashArray="5,10" />
//             )}
//           </MapContainer>
//         ));
//       });
//     });
//   }, []);

//   if (!MapComponent) {
//     return (
//       <div className="h-64 md:h-80 bg-gray-100 rounded-2xl flex items-center justify-center">
//         <Loader2 className="animate-spin text-[#22c55e]" size={32} />
//         <span className="ml-2 text-gray-500">Loading map...</span>
//       </div>
//     );
//   }

//   // Find center: driver if available, otherwise midpoint of pickup/drop, or default
//   let center: [number, number] = [20.5937, 78.9629]; // India default
//   if (driverPos) center = driverPos;
//   else if (pickUpPos) center = pickUpPos;
//   else if (dropPos) center = dropPos;

//   return <MapComponent center={center} driverPos={driverPos} pickUpPos={pickUpPos} dropPos={dropPos} />;
// };

// // Main Page
// export default function PartnerActiveRidePage() {
//   const [booking, setBooking] = useState<IBooking | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
//   const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null);
//   const [dropPos, setDropPos] = useState<[number, number] | null>(null);
//   const [locationUpdating, setLocationUpdating] = useState(false);
//   const watchIdRef = useRef<number | null>(null);

//   // Fetch active booking
//   const fetchActiveBooking = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("/api/partner/my-active");
//       setBooking(data);
//       // Extract coordinates from booking if available
//       if (data.pickUpPos) setPickUpPos([data.pickUpPos.lat, data.pickUpPos.lng]);
//       if (data.dropPos) setDropPos([data.dropPos.lat, data.dropPos.lng]);
//       setError(null);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.response?.data?.message || "No active ride found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send current location to backend periodically
//   const updateDriverLocation = async (lat: number, lng: number) => {
//     if (!booking) return;
//     try {
//       await axios.post("/api/partner/update-location", {
//         bookingId: booking._id,
//         lat,
//         lng,
//       });
//     } catch (err) {
//       console.error("Failed to update location", err);
//     }
//   };

//   // Start watching geolocation
//   useEffect(() => {
//     if (!booking) return;

//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser");
//       return;
//     }

//     // Get initial position
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         const newPos: [number, number] = [latitude, longitude];
//         setDriverPos(newPos);
//         updateDriverLocation(latitude, longitude);
//       },
//       (err) => {
//         console.error("Geolocation error:", err);
//         setError("Unable to access your location. Please enable location permissions.");
//       }
//     );

//     // Watch position continuously
//     watchIdRef.current = navigator.geolocation.watchPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         const newPos: [number, number] = [latitude, longitude];
//         setDriverPos(newPos);
//         // Throttle updates: every 5 seconds
//         if (!locationUpdating) {
//           setLocationUpdating(true);
//           updateDriverLocation(latitude, longitude);
//           setTimeout(() => setLocationUpdating(false), 5000);
//         }
//       },
//       (err) => {
//         console.error("Watch error:", err);
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 10000,
//         timeout: 5000,
//       }
//     );

//     return () => {
//       if (watchIdRef.current !== null) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//       }
//     };
//   }, [booking]); // Re-run when booking changes (new ride)

//   useEffect(() => {
//     fetchActiveBooking();
//   }, []);

//   // Manual refresh location button
//   const handleRefreshLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude } = pos.coords;
//           setDriverPos([latitude, longitude]);
//           updateDriverLocation(latitude, longitude);
//         },
//         (err) => console.error(err)
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] flex items-center justify-center">
//         <Card className="rounded-3xl p-8 text-center">
//           <Loader2 className="animate-spin mx-auto text-[#22c55e]" size={40} />
//           <p className="mt-4 text-gray-600">Fetching active ride...</p>
//         </Card>
//       </div>
//     );
//   }

//   if (error || !booking) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] flex items-center justify-center p-4">
//         <Card className="rounded-3xl max-w-md w-full p-8 text-center">
//           <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
//           <h2 className="text-xl font-bold text-gray-800">No Active Ride</h2>
//           <p className="text-gray-500 mt-2">{error || "You don't have an active ride right now."}</p>
//           <Button
//             onClick={() => window.location.reload()}
//             className="mt-6 rounded-xl bg-[#22c55e] hover:bg-[#16a34a]"
//           >
//             Refresh
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] font-dm">
//       <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
//         {/* Header */}
//         <div className="mb-8">
//           <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] font-semibold">
//             Active Ride
//           </Badge>
//           <h1 className="font-syne text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
//             On the way to pickup
//           </h1>
//           <p className="text-gray-500 mt-1">Keep this page open to share your live location</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//           {/* Left column: Ride details */}
//           <div className="lg:col-span-2 space-y-5">
//             {/* Booking Card */}
//             <Card className="rounded-3xl border border-gray-100 shadow-md overflow-hidden">
//               <div className="h-1.5 bg-[#22c55e]" />
//               <CardContent className="p-5 md:p-6 space-y-4">
//                 {/* Customer */}
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center">
//                     <User size={22} className="text-[#16a34a]" />
//                   </div>
//                   <div>
//                     <h3 className="font-syne font-extrabold text-gray-900">
//                       {booking.user?.name ?? ""}
//                     </h3>
//                     <div className="flex items-center gap-1 text-sm text-gray-500">
//                       <Phone size={14} />
//                       <span>{booking.user.mobileNumber}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Vehicle */}
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <Bike size={16} className="text-gray-400" />
//                   <span className="font-semibold">
//                     {booking.vehicle.vehicleModel} • {booking.vehicle.number}
//                   </span>
//                 </div>

//                 {/* Route */}
//                 <div className="space-y-3">
//                   <div className="flex gap-3">
//                     <div className="flex flex-col items-center">
//                       <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
//                       <div className="w-px h-6 bg-[#bbf7d0]" />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#16a34a]">
//                         Pickup
//                       </p>
//                       <p className="text-sm text-gray-700">{booking.pickUpAddress}</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
//                     <div>
//                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
//                         Drop
//                       </p>
//                       <p className="text-sm text-gray-700">{booking.dropAddress}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Fare & Time */}
//                 <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                   <div className="flex items-center gap-1 text-gray-500 text-sm">
//                     <Clock size={14} />
//                     {formatDate(booking.createdAt)}
//                   </div>
//                   <div className="flex items-center gap-0.5">
//                     <IndianRupee size={18} className="text-gray-700" />
//                     <span className="text-xl font-bold text-gray-900">{booking.fare}</span>
//                   </div>
//                 </div>

//                 {/* Status Badges */}
//                 <div className="flex flex-wrap gap-2">
//                   <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full">
//                     {booking.bookingStatus}
//                   </Badge>
//                   <Badge className="bg-blue-50 text-blue-700 rounded-full">
//                     {booking.paymentStatus}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Driver Location Card */}
//             <Card className="rounded-3xl border border-gray-100 shadow-md">
//               <CardContent className="p-5 md:p-6">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Crosshair size={18} className="text-[#22c55e]" />
//                     <h3 className="font-syne font-bold text-gray-900">Your Live Location</h3>
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={handleRefreshLocation}
//                     className="rounded-xl h-8"
//                   >
//                     Refresh
//                   </Button>
//                 </div>
//                 {driverPos ? (
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">
//                       Lat: {driverPos[0].toFixed(6)}<br />
//                       Lng: {driverPos[1].toFixed(6)}
//                     </p>
//                     <a
//                       href={`https://www.google.com/maps/dir/?api=1&destination=${driverPos[0]},${driverPos[1]}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1 text-sm text-[#16a34a] hover:underline"
//                     >
//                       <Navigation size={14} /> Open in Google Maps
//                     </a>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-amber-600 flex items-center gap-1">
//                     <Loader2 size={14} className="animate-spin" /> Waiting for GPS...
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right column: Map */}
//           <div className="lg:col-span-3">
//             <Card className="rounded-3xl border border-gray-100 shadow-md overflow-hidden h-full">
//               <div className="h-1.5 bg-[#22c55e]" />
//               <CardContent className="p-3 md:p-4 h-[500px] md:h-[600px]">
//                 <DynamicMap driverPos={driverPos} pickUpPos={pickUpPos} dropPos={dropPos} />
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Action buttons - update ride status (optional) */}
//         <div className="mt-8 flex justify-center gap-4 flex-wrap">
//           <Button
//             className="rounded-2xl bg-gray-900 text-white hover:bg-gray-800 px-8"
//             onClick={() => {
//               // Navigate to pickup confirmation or update status to "started"
//               console.log("Arrived at pickup");
//             }}
//           >
//             Arrived at Pickup
//           </Button>
//           <Button
//             variant="outline"
//             className="rounded-2xl border-gray-300"
//             onClick={() => {
//               // Contact customer
//               window.location.href = `tel:${booking.user.mobileNumber}`;
//             }}
//           >
//             <Phone size={16} className="mr-2" />
//             Call Customer
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// }
"use client"
import LiveRideMap from '@/components/LiveRideMap';
import { Card } from '@/components/ui/card';
import { IBooking } from '@/models/booking-model'
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const page = () => {
	const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null);
  const [dropPos, setDropPos] = useState<[number, number] | null>(null);
  const [locationUpdating, setLocationUpdating] = useState(false);

  // Fetch active booking
  const fetchActiveBooking = async () => {
    try {
		const response = await axios.get("/api/partner/my-active");
		console.log(response.data);
		
		const ride = response.data.activeRide;
		
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
    } catch (err: any) {
		console.error("Fetch Active Ride Error:", err.response?.data?.message);
	  
		const message =
		  err?.response?.data?.message ||
		  err?.message ||
		  "No active ride found";
	  
		setError(message);
	  }
  };
  
  // Send current location to backend periodically

  // Start watching geolocation
  useEffect(() => {
	if (!booking) return;
	if (!navigator.geolocation) {
	  setError("Geolocation is not supported by your browser");
	  return;
	}
	const watchId = navigator.geolocation.watchPosition(
	  (pos) => {
		const { latitude, longitude } = pos.coords;
		setDriverPos([latitude, longitude]);
	  },
	  (err) => {
		console.error("Geolocation error:", err);
		setError(
		  "Unable to access your location. Please enable location permissions."
		);
	  },
	  {enableHighAccuracy: true,maximumAge: 2000,timeout: 10000,}
	);
	return () => {
	  navigator.geolocation.clearWatch(watchId);
	};
  }, [booking]);
  useEffect(() => {
    fetchActiveBooking();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] flex items-center justify-center">
        <Card className="rounded-3xl p-8 text-center">
          <Loader2 className="animate-spin mx-auto text-[#22c55e]" size={40} />
          <p className="mt-4 text-gray-600">Fetching active ride...</p>
        </Card>
      </div>
    );
  }
  return (
	<div className='h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden'>
		<div className='relative flex-1 h-full z-0'>
			<LiveRideMap
			driverLocation = {driverPos}
			pickUpLocation = {pickUpPos}
			dropLocation = {dropPos}
			/>
		</div>
	</div>
  )
}

export default page