// components/admin/PendingTabs.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PartnerReviewList } from "./PartnerReviewList";
import { VideoKYCList } from "./VideoKycList";
import { VehicleReviewList } from "./VehicleReviewList";

type TabType = "partnerReviews" | "videoKyc" | "vehicleReviews";

interface TabItem {
  id: TabType;
  label: string;
  count: number;
}

const tabs: TabItem[] = [
  { id: "partnerReviews", label: "Pending Partner Reviews", count: 1 },
  { id: "videoKyc", label: "Pending Video KYC", count: 0 },
  { id: "vehicleReviews", label: "Pending Vehicle Reviews", count: 0 },
];
interface pendingTabsProps {
  // name : string
}
export function PendingTabs({} : pendingTabsProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>("partnerReviews");

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2.5 text-sm cursor-pointer font-dm font-medium rounded-t-xl transition-all",
              activeTab === tab.id
                ? "bg-white text-[#22c55e] border-b-2 border-[#22c55e] shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl  border border-gray-100 shadow-sm p-6">
        {activeTab === "partnerReviews" && <PartnerReviewList />}
        {activeTab === "videoKyc" && <VideoKYCList />}
        {activeTab === "vehicleReviews" && <VehicleReviewList />}
      </div>
    </div>
  );
}