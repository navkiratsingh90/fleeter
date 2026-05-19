// components/admin/partner-review/BankDetailsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";

interface BankDetailsCardProps {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  upi: string;
}

export function BankDetailsCard({ accountHolder, accountNumber, ifscCode, upi }: BankDetailsCardProps): React.ReactElement {
  return (
    <Card className="rounded-3xl border border-gray-100 shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building size={20} className="text-[#22c55e]" />
          <h2 className="font-syne text-lg font-bold text-gray-900">Bank Details</h2>
        </div>
        <div className="space-y-2 text-sm font-dm">
          <p><span className="font-semibold text-gray-700">Account Holder:</span> <span className="text-gray-600">{accountHolder}</span></p>
          <p><span className="font-semibold text-gray-700">Account Number:</span> <span className="text-gray-600">{accountNumber}</span></p>
          <p><span className="font-semibold text-gray-700">IFSC Code:</span> <span className="text-gray-600">{ifscCode}</span></p>
          <p><span className="font-semibold text-gray-700">UPI:</span> <span className="text-gray-600">{upi}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}