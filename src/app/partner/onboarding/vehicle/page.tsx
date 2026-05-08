// app/vehicle-details/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Bike, Car, Truck, Package, Train } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Vehicle type definition
interface VehicleTypeOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const VEHICLE_TYPES: VehicleTypeOption[] = [
  { id: "bike", label: "Bike", description: "2 wheeler", icon: Bike },
  { id: "auto", label: "Auto", description: "3 wheeler ride", icon: Train },
  { id: "car", label: "Car", description: "4 wheeler ride", icon: Car },
  { id: "loading", label: "Loading", description: "Small goods", icon: Package },
  { id: "truck", label: "Truck", description: "Heavy transport", icon: Truck },
];

// Form data type
interface VehicleFormData {
  vehicleType: string;
  vehicleNumber: string;
  vehicleModel: string;
}

export default function VehicleDetailsPage(): React.ReactElement {
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleType: "",
    vehicleNumber: "",
    vehicleModel: "",
  });

  const isFormValid = formData.vehicleType && formData.vehicleNumber && formData.vehicleModel;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleTypeSelect = (typeId: string) => {
    setFormData((prev) => ({ ...prev, vehicleType: typeId }));
  };

  const handleContinue = () => {
    console.log("Vehicle details submitted:", formData);
    alert("Vehicle details submitted (demo).");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] flex items-center justify-center px-4 py-10 font-dm">
      <div className="w-full max-w-[560px]">
        {/* Step Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] font-semibold hover:bg-[#f0fdf4]">
            <span className="w-4 h-4 rounded-full bg-[#22c55e] text-white grid place-items-center text-[9px] mr-2">
              1
            </span>
            Step 1 of 3
          </Badge>
        </div>

        <Card className="rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
          <CardContent className="p-8">
            {/* Header with back button */}
            <div className="relative flex items-center justify-center mb-2">
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 rounded-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={16} />
              </Button>

              <div className="text-center">
                <h1 className="font-syne text-2xl font-extrabold tracking-tight text-gray-900">
                  Vehicle Details
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Add your vehicle information
                </p>
              </div>
            </div>

            {/* Vehicle Type Selection */}
            <div className="mt-8">
              <label className="block font-dm text-sm font-semibold text-gray-700 mb-3">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {VEHICLE_TYPES.map(({ id, label, description, icon: Icon }) => {
                  const isSelected = formData.vehicleType === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleVehicleTypeSelect(id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200",
                        isSelected
                          ? "border-[#22c55e] bg-[#f0fdf4] shadow-sm"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          isSelected ? "bg-[#22c55e]" : "bg-gray-100"
                        )}
                      >
                        <Icon
                          size={18}
                          className={isSelected ? "text-white" : "text-gray-500"}
                        />
                      </div>
                      <div className="text-center">
                        <p
                          className={cn(
                            "font-syne text-sm font-bold",
                            isSelected ? "text-[#22c55e]" : "text-gray-900"
                          )}
                        >
                          {label}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle Number */}
            <div className="mt-6">
              <label className="block font-dm text-sm font-semibold text-gray-700 mb-2">
                Vehicle Number
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                placeholder="MH12AB1234"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#f0fdf4] outline-none transition font-dm text-sm"
              />
            </div>

            {/* Vehicle Model */}
            <div className="mt-5">
              <label className="block font-dm text-sm font-semibold text-gray-700 mb-2">
                Vehicle Model
              </label>
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleInputChange}
                placeholder="Tata Ace"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#f0fdf4] outline-none transition font-dm text-sm"
              />
            </div>

            {/* Continue Button */}
            <Button
              disabled={!isFormValid}
              className={cn(
                "w-full mt-8 h-14 rounded-2xl font-syne text-[15px] font-bold tracking-tight",
                isFormValid
                  ? "bg-[#22c55e] hover:bg-[#16a34a]"
                  : "bg-gray-900 hover:bg-black"
              )}
              onClick={handleContinue}
            >
              Continue →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}