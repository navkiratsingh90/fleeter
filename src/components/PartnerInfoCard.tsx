// components/admin/partner-review/PartnerInfoCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface PartnerInfoCardProps {
  name: string;
  email: string;
}

export function PartnerInfoCard({ name, email }: PartnerInfoCardProps): React.ReactElement {
  return (
    <Card className="rounded-3xl border border-gray-100 shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#22c55e] flex items-center justify-center text-white">
            <User size={32} />
          </div>
          <div>
            <h1 className="font-syne text-2xl font-extrabold text-gray-900">{name}</h1>
            <p className="font-dm text-sm text-gray-500">{email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}