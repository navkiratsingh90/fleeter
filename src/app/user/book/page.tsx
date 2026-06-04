"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bike,
  CarFront,
  LocateFixed,
  PhoneCall,
  Send,
  Truck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";

export type VehicleKey = "Bike" | "Auto" | "Car" | "Loading" | "Truck";

type VehicleCard = {
  key: VehicleKey;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
};

type LocationSuggestion = {
  title: string;
  subtitle: string;
  country: string;
  lat?: number;
  lng?: number;
};

const vehicles: VehicleCard[] = [
  { key: "Bike", label: "Bike", subtitle: "Quick & affordable", icon: <Bike className="h-5 w-5" /> },
  { key: "Auto", label: "Auto", subtitle: "Everyday rides", icon: <CarFront className="h-5 w-5" /> },
  { key: "Car", label: "Car", subtitle: "Comfort rides", icon: <CarFront className="h-5 w-5" /> },
  { key: "Loading", label: "Loading", subtitle: "Small cargo", icon: <Truck className="h-5 w-5" /> },
  { key: "Truck", label: "Truck", subtitle: "Heavy transport", icon: <Truck className="h-5 w-5" /> },
];

function StepBadge({ step }: { step: number }) {
  return (
    <div className="grid h-7 w-7 place-items-center rounded-full bg-green-600 text-[12px] font-bold text-white shadow-sm">
      {step}
    </div>
  );
}

function SectionCard({
  title,
  step,
  children,
}: {
  title: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="border-b border-zinc-100 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <StepBadge step={step} />
          <h2 className="text-[13px] font-bold tracking-[0.2em] text-zinc-500">{title}</h2>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </div>
  );
}

function VehicleTile({
  active,
  vehicle,
  onClick,
}: {
  active: boolean;
  vehicle: VehicleCard;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-h-[78px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200",
        active
          ? "border-zinc-900 bg-green-600 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
          : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
      )}
    >
      <div
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-2xl p-3 transition-all",
          active ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-700"
        )}
      >
        {vehicle.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold leading-tight">{vehicle.label}</div>
        <div className={cn("mt-0.5 truncate text-[12px] leading-tight", active ? "text-white/70" : "text-zinc-400")}>
          {vehicle.subtitle}
        </div>
      </div>
    </button>
  );
}

function GreenInput({
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-zinc-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-auto border-0 bg-transparent p-0 text-[15px] font-medium text-zinc-900 shadow-none outline-none placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}

function RouteField({
  label,
  value,
  onChange,
  action,
  placeholder,
  onClick,
}: {
  label: "Pickup" | "Drop";
  value: string;
  onChange: (value: string) => void;
  action: React.ReactNode;
  placeholder: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-[22px] border border-zinc-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
          {label === "Pickup" ? "P" : "D"}
        </span>
        <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          {label}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 flex-1 border-0 bg-emerald-50/50 px-4 text-[14px] font-medium text-zinc-900 shadow-none outline-none placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <button
          type="button"
          onClick={onClick}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
        >
          {action}
        </button>
      </div>
    </div>
  );
}

// ✅ Scrollable suggestion list – disappears immediately on click
function SuggestionList({
  suggestions,
  onSelect,
}: {
  suggestions: LocationSuggestion[];
  onSelect: (location: LocationSuggestion) => void;
}) {
  if (!suggestions.length) return null;

  return (
    <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-sm [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300">
      {suggestions.map((location, i) => (
        <button
          key={`${location.title}-${i}`}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(location)}
          className="flex w-full flex-col gap-1 border-b border-zinc-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-emerald-50/70"
        >
          <div className="truncate text-[14px] font-semibold text-zinc-900">
            {location.title}
          </div>
          <div className="truncate text-[12px] text-zinc-500">
            {location.subtitle}
          </div>
        </button>
      ))}
    </div>
  );
}

export default function BookRidePage() {
  const router = useRouter();

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleKey>("Bike");
  const [mobile, setMobile] = useState("1213456789");

  const [pickup, setPickup] = useState("");
  const [pickUpSuggestions, setPickUpSuggestions] = useState<LocationSuggestion[]>([]);

  const [drop, setDrop] = useState("");
  const [dropSuggestions, setDropSuggestions] = useState<LocationSuggestion[]>([]);

  const [pickUpLatitude, setPickUpLatitude] = useState<number>();
  const [pickUpLongitude, setPickUpLongitude] = useState<number>();

  const [dropLatitude, setDropLatitude] = useState<number>();
  const [dropLongitude, setDropLongitude] = useState<number>();

  const getCurrentAddress = async (q: string) => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}&limit=10&lang=en`
      );
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const { data } = await axios.get(
          `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`
        );

        const place = data?.features?.[0]?.properties;

        const address = [place?.name, place?.street, place?.city, place?.state, place?.country]
          .filter(Boolean)
          .join(", ");

        setPickup(address);
        setPickUpLatitude(latitude);
        setPickUpLongitude(longitude);
        setPickUpSuggestions([]);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const formatLocation = (feature: any): LocationSuggestion => {
    const p = feature?.properties ?? {};
    const coords = feature?.geometry?.coordinates ?? [];

    return {
      title: p?.name || p?.city || p?.state || p?.country || "Unknown Place",
      subtitle: [p?.street, p?.city, p?.state, p?.country, p?.postcode].filter(Boolean).join(", "),
      country: p?.country || "",
      lat: typeof coords?.[1] === "number" ? coords[1] : undefined,
      lng: typeof coords?.[0] === "number" ? coords[0] : undefined,
    };
  };

  useEffect(() => {
    if (!pickup.trim()) {
      setPickUpSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const data = await getCurrentAddress(pickup);

      if (data?.features?.length) {
        const formatted = data.features
          .filter((f: any) => f?.geometry?.coordinates)
          .map(formatLocation);

        setPickUpSuggestions(formatted);
      } else {
        setPickUpSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pickup]);

  useEffect(() => {
    if (!drop.trim()) {
      setDropSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const data = await getCurrentAddress(drop);

      if (data?.features?.length) {
        const formatted = data.features
          .filter((f: any) => f?.geometry?.coordinates)
          .map(formatLocation);

        setDropSuggestions(formatted);
      } else {
        setDropSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [drop]);

  const handleSelectPickup = (location: LocationSuggestion) => {
    setPickUpSuggestions([]);     // ✅ immediately disappear
    setPickup(location.subtitle || location.title);
    setPickUpLatitude(location.lat);
    setPickUpLongitude(location.lng);
  };

  const handleSelectDrop = (location: LocationSuggestion) => {
    setDropSuggestions([]);       // ✅ immediately disappear
    setDrop(location.subtitle || location.title);
    setDropLatitude(location.lat);
    setDropLongitude(location.lng);
  };

  return (
    <div className="min-h-screen bg-white font-dm text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col px-4 pb-2 pt-6 sm:px-6">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.05)] transition hover:bg-zinc-50"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-700" />
            </button>

            <div>
              <h1 className="font-syne text-[23px] font-bold leading-tight text-zinc-950 sm:text-[25px]">
                Book a Ride
              </h1>
              <p className="mt-0.5 text-[13px] leading-tight text-zinc-400">
                Fill in the details below
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <span className="h-[8px] w-[20px] rounded-full bg-green-600" />
            <span className="h-[8px] w-[20px] rounded-full bg-green-600" />
            <span className="h-[8px] w-[20px] rounded-full bg-green-600" />
            <span className="h-[8px] w-[20px] rounded-full bg-green-600" />
          </div>
        </header>

        <main className="flex-1 space-y-2">
          <SectionCard title="CHOOSE VEHICLE" step={1}>
            <div className="grid grid-cols-2 gap-3">
              {vehicles.map((vehicle) => (
                <VehicleTile
                  key={vehicle.key}
                  vehicle={vehicle}
                  active={selectedVehicle === vehicle.key}
                  onClick={() => setSelectedVehicle(vehicle.key)}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="MOBILE" step={2}>
            <GreenInput
              value={mobile}
              onChange={setMobile}
              placeholder="Enter mobile number"
              icon={<PhoneCall className="h-4.5 w-4.5" />}
              type="tel"
            />
          </SectionCard>

          <SectionCard title="ROUTE" step={3}>
            <div className="space-y-3">
              <div className="space-y-2">
                <RouteField
                  label="Pickup"
                  value={pickup}
                  onClick={getCurrentLocation}
                  onChange={setPickup}
                  placeholder="Enter pickup location"
                  action={<LocateFixed className="h-4.5 w-4.5" />}
                />
                <SuggestionList suggestions={pickUpSuggestions} onSelect={handleSelectPickup} />
              </div>

              <div className="space-y-2">
                <RouteField
                  label="Drop"
                  value={drop}
                  onClick={() => {}}
                  onChange={setDrop}
                  placeholder="Enter destination"
                  action={<Send className="h-4.5 w-4.5 -rotate-45" />}
                />
                <SuggestionList suggestions={dropSuggestions} onSelect={handleSelectDrop} />
              </div>
            </div>
          </SectionCard>

          <div className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <button
              onClick={() => {
                router.push(
                  `/user/search?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&vehicle=${selectedVehicle}&mobile=${mobile}&pickuplat=${pickUpLatitude ?? ""}&pickuplon=${pickUpLongitude ?? ""}&droplat=${dropLatitude ?? ""}&droplon=${dropLongitude ?? ""}`
                );
              }}
              type="button"
              className="h-14 w-full rounded-[22px] bg-green-600 text-[16px] font-bold text-white shadow-[0_16px_30px_rgba(0,0,0,0.16)] transition hover:bg-green-600"
            >
              Continue
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}