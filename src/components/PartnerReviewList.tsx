// components/admin/PartnerReviewList.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  email: string;
  initials: string;
}

const mockPartners: Partner[] = [
  { id: "1", name: "Ankush Sahu", email: "ankush25102002@gmail.com", initials: "AS" },
];

export function PartnerReviewList(): React.ReactElement {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-syne font-bold text-gray-900">PARTNER REVIEWS QUEUE</h3>
        <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] rounded-full">
          {mockPartners.length} pending
        </Badge>
      </div>

      <div className="space-y-3">
        {mockPartners.map((partner) => (
          <div
            key={partner.id}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-white font-bold text-sm">
                {partner.initials}
              </div>
              <div>
                <p className="font-syne font-semibold text-gray-900">{partner.name}</p>
                <p className="font-dm text-xs text-gray-400">{partner.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-[#22c55e] hover:text-[#16a34a] hover:bg-[#f0fdf4] gap-1"
            >
              Review <ChevronRight size={14} />
            </Button>
          </div>
        ))}

        {mockPartners.length === 0 && (
          <div className="text-center py-8 text-gray-400 font-dm text-sm">
            No pending partner reviews
          </div>
        )}
      </div>
    </div>
  );
}