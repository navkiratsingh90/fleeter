// components/admin/StatsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Clock, XCircle } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps): React.ReactElement {
  const cards = [
    { label: "TOTAL PARTNERS", value: stats.total, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "APPROVED PARTNERS", value: stats.approved, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "PENDING PARTNERS", value: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "REJECTED PARTNERS", value: stats.rejected, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <Card key={card.label} className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">
                  {card.label}
                </p>
                <p className="font-syne text-3xl font-extrabold text-gray-900">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-full ${card.bg} flex items-center justify-center`}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}