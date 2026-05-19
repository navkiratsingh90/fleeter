// components/admin/partner-review/AdminActionsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function AdminActionsCard(): React.ReactElement {
  const handleApprove = () => alert("Approved (demo)");
  const handleReject = () => alert("Rejected (demo)");

  return (
    <Card className="rounded-3xl border border-gray-100 shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={20} className="text-[#22c55e]" />
          <h2 className="font-syne text-lg font-bold text-gray-900">Admin Check</h2>
        </div>
        <p className="font-dm text-sm text-gray-600 mb-5">
          Verify documents carefully before approving.
        </p>
        <div className="flex gap-3">
          <Button className="bg-[#22c55e] hover:bg-[#16a34a] rounded-full px-8" onClick={handleApprove}>
            Approve
          </Button>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-full px-8" onClick={handleReject}>
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}