// components/admin/VideoKYCList.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Video } from "lucide-react";

// Mock data – empty for now
const mockVideoKYC: any[] = [];

export function VideoKYCList(): React.ReactElement {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-syne font-bold text-gray-900">Video KYC Requests</h3>
        <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] rounded-full">
          {mockVideoKYC.length} pending
        </Badge>
      </div>

      {mockVideoKYC.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Video size={40} className="mb-3 opacity-50" />
          <p className="font-dm text-sm">No pending video KYC requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockVideoKYC.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100">
              {/* similar structure */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}