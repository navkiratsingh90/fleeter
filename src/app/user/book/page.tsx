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

const GEO_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

// ✅ GEOAPIFY AUTOCOMPLETE
const getCurrentAddress = async (q: string) => {
  try {
    const { data } = await axios.get(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(q.trim())}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`,

    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ GEOAPIFY REVERSE GEOCODING
const getReverseAddress = async (lat: number, lon: number) => {
  try {
    const { data } = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`,
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
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
          <h2 className="text-[13px] font-bold tracking-[0.2em] text-zinc-500">
            {title}
          </h2>
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
        <div className="truncate text-[15px] font-bold leading-tight">
          {vehicle.label}
        </div>
        <div
          className={cn(
            "mt-0.5 truncate text-[12px] leading-tight",
            active ? "text-white/70" : "text-zinc-400"
          )}
        >
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
        className="h-auto border-0 bg-transparent p-0 text-[15px] font-medium text-zinc-900 shadow-none outline-none placeholder:text-zinc-400 focus-visible:ring-0"
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
          className="h-12 flex-1 border-0 bg-emerald-50/50 px-4 text-[14px] font-medium text-zinc-900 shadow-none outline-none placeholder:text-zinc-400"
        />

        <button
          type="button"
          onClick={onClick}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        >
          {action}
        </button>
      </div>
    </div>
  );
}

function SuggestionList({
  suggestions,
  onSelect,
}: {
  suggestions: LocationSuggestion[];
  onSelect: (location: LocationSuggestion) => void;
}) {
  if (!suggestions.length) return null;

  return (
    <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      {suggestions.map((location, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(location)}
          className="flex w-full flex-col gap-1 border-b border-zinc-100 px-4 py-3 text-left hover:bg-emerald-50"
        >
          <div className="text-[14px] font-semibold text-zinc-900">
            {location.title}
          </div>
          <div className="text-[12px] text-zinc-500">
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
  const [drop, setDrop] = useState("");

  const [pickUpSuggestions, setPickUpSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<LocationSuggestion[]>([]);

  const [pickUpLatitude, setPickUpLatitude] = useState<number>();
  const [pickUpLongitude, setPickUpLongitude] = useState<number>();

  const [dropLatitude, setDropLatitude] = useState<number>();
  const [dropLongitude, setDropLongitude] = useState<number>();

  const formatLocation = (feature: any): LocationSuggestion => {
    const p = feature?.properties ?? {};
    return {
      title: p.address_line1 || p.name || "Unknown",
      subtitle: [p.address_line2, p.city, p.country].filter(Boolean).join(", "),
      country: p.country,
      lat: p.lat,
      lng: p.lon,
    };
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const data = await getReverseAddress(latitude, longitude);
      const place = data?.features?.[0]?.properties;

      const address = [
        place?.address_line1,
        place?.city,
        place?.country,
      ]
        .filter(Boolean)
        .join(", ");

      setPickup(address);
      setPickUpLatitude(latitude);
      setPickUpLongitude(longitude);
      setPickUpSuggestions([]);
    });
  };

  useEffect(() => {
    if (!pickup) return setPickUpSuggestions([]);

    const t = setTimeout(async () => {
      const data = await getCurrentAddress(pickup);

      const list =
        data?.features?.map(formatLocation) || [];

      setPickUpSuggestions(list);
    }, 400);

    return () => clearTimeout(t);
  }, [pickup]);

  useEffect(() => {
    if (!drop) return setDropSuggestions([]);

    const t = setTimeout(async () => {
      const data = await getCurrentAddress(drop);

      const list =
        data?.features?.map(formatLocation) || [];

      setDropSuggestions(list);
    }, 400);

    return () => clearTimeout(t);
  }, [drop]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-[560px] px-4 py-6 space-y-4">

        {/* Vehicle */}
        <SectionCard title="CHOOSE VEHICLE" step={1}>
          <div className="grid grid-cols-2 gap-3">
            {vehicles.map((v) => (
              <VehicleTile
                key={v.key}
                vehicle={v}
                active={selectedVehicle === v.key}
                onClick={() => setSelectedVehicle(v.key)}
              />
            ))}
          </div>
        </SectionCard>

        {/* Mobile */}
        <SectionCard title="MOBILE" step={2}>
          <GreenInput
            value={mobile}
            onChange={setMobile}
            placeholder="Enter mobile"
            icon={<PhoneCall className="h-4 w-4" />}
          />
        </SectionCard>

        {/* Route */}
        <SectionCard title="ROUTE" step={3}>
          <div className="space-y-3">

            <RouteField
              label="Pickup"
              value={pickup}
              onChange={setPickup}
              placeholder="Pickup location"
              action={<LocateFixed className="h-4 w-4" />}
              onClick={getCurrentLocation}
            />
            <SuggestionList
              suggestions={pickUpSuggestions}
              onSelect={(loc) => {
                setPickup(loc.subtitle);
                setPickUpLatitude(loc.lat);
                setPickUpLongitude(loc.lng);
                setPickUpSuggestions([]);
              }}
            />

            <RouteField
              label="Drop"
              value={drop}
              onChange={setDrop}
              placeholder="Drop location"
              action={<Send className="h-4 w-4 -rotate-45" />}
              onClick={() => {}}
            />
            <SuggestionList
              suggestions={dropSuggestions}
              onSelect={(loc) => {
                setDrop(loc.subtitle);
                setDropLatitude(loc.lat);
                setDropLongitude(loc.lng);
                setDropSuggestions([]);
              }}
            />

          </div>
        </SectionCard>

        {/* Continue */}
        <button
          onClick={() =>
            router.push(
              `/user/search?pickup=${pickup}&drop=${drop}&vehicle=${selectedVehicle}&mobile=${mobile}&pickuplat=${pickUpLatitude ?? ""}&pickuplon=${pickUpLongitude ?? ""}&droplat=${dropLatitude ?? ""}&droplon=${dropLongitude ?? ""}`
            )
          }
          className="w-full h-14 rounded-2xl bg-green-600 text-white font-bold shadow-lg hover:bg-green-700"
        >
          Continue
        </button>

      </div>
    </div>
  );
}