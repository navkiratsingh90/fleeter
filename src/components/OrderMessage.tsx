// components/admin/partner-review/OrderMessage.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function OrderMessage(): React.ReactElement {
  return (
    <Card className="rounded-3xl border border-green-100 bg-green-50/30 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <CheckCircle size={24} className="text-[#22c55e] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-syne font-bold text-gray-900">Order Placed!</h3>
            <p className="font-dm text-sm text-gray-600 mt-1">
              Thank you for your purchase. Your order is being prepared now. You can track your order status in the
              "My Orders" section.
            </p>
            <Button variant="link" className="px-0 mt-2 text-[#22c55e] gap-1" asChild>
              <Link href="/my-orders">
                <ArrowLeft size={14} /> Back to my orders
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}