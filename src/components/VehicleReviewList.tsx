// components/admin/VehicleReviewList.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Car } from "lucide-react";

const mockVehicleReviews: any[] = [];

export function VehicleReviewList(): React.ReactElement {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-syne font-bold text-gray-900">Vehicle Document Reviews</h3>
        <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] rounded-full">
          {mockVehicleReviews.length} pending
        </Badge>
      </div>

      {mockVehicleReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Car size={40} className="mb-3 opacity-50" />
          <p className="font-dm text-sm">No pending vehicle reviews</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* map items */}
        </div>
      )}
    </div>
  );
}