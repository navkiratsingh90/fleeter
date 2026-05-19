// components/admin/partner-review/VehicleDetailsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Car } from "lucide-react";

interface VehicleDetailsCardProps {
  type: string;
  registrationNumber: string;
  model: string;
}

export function VehicleDetailsCard({ type, registrationNumber, model }: VehicleDetailsCardProps): React.ReactElement {
  return (
    <Card className="rounded-3xl border border-gray-100 shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Car size={20} className="text-[#22c55e]" />
          <h2 className="font-syne text-lg font-bold text-gray-900">Vehicle Details</h2>
        </div>
        <div className="space-y-2 text-sm font-dm">
          <p><span className="font-semibold text-gray-700">Vehicle Type:</span> <span className="text-gray-600 capitalize">{type}</span></p>
          <p><span className="font-semibold text-gray-700">Registration Number:</span> <span className="text-gray-600">{registrationNumber}</span></p>
          <p><span className="font-semibold text-gray-700">Model:</span> <span className="text-gray-600">{model}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}