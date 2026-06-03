// components/admin/VehicleReviewList.tsx

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Car } from "lucide-react";
import { Button } from "./ui/button";

interface VehicleOwner {
  _id: string;
  name: string;
  email: string;
}

interface VehicleType {
  _id: string;
  type: string;
  number: string;
  vehicleModel: string;
  status: string;
  owner: VehicleOwner;
}

interface VehicleReviewListProps {
  vehicleList: VehicleType[];
}

export function VehicleReviewList({
  vehicleList,
}: VehicleReviewListProps): React.ReactElement {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-syne font-bold text-gray-900">
          Vehicle Document Reviews
        </h3>

        <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] rounded-full">
          {vehicleList.length} pending
        </Badge>
      </div>

      {vehicleList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Car size={40} className="mb-3 opacity-50" />
          <p className="font-dm text-sm">
            No pending vehicle reviews
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicleList.map((vehicle) => (
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#22c55e] flex items-center justify-center text-white font-bold text-sm">
                    {/* {vehicle.owner?.name
                      ?.slice(0, 2)
                      .toUpperCase()} */}
                  </div>

                  <div>
                    <p className="font-syne font-semibold text-gray-900">
                      {vehicle.owner?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {vehicle.owner?.email}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {vehicle.type} • {vehicle.vehicleModel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link 
                  key={vehicle._id}
                   href={`/admin/review/vehicle/${vehicle._id}`}>
                <Button
                // onClick={() => handleStartVideoKyc(p._id)}
                variant="ghost"
                size="sm"
                className="rounded-full text-[#22c55e] hover:text-[#16a34a] hover:bg-[#f0fdf4] gap-1"
              >
                Review <ChevronRight size={14} />
              </Button>
              </Link>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}