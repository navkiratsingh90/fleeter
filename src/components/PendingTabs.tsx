// components/admin/PendingTabs.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PartnerReviewList } from "./PartnerReviewList";
import { VideoKYCList } from "./VideoKycList";
import { VehicleReviewList } from "./VehicleReviewList";
import { PendingPartnerKyc, PendingPartnerType } from "./AdminDashboard";

type TabType = "partnerReviews" | "videoKyc" | "vehicleReviews";

interface TabItem {
  id: TabType;
  label: string;
  // partner : PendingPartnerType[],
}

const tabs: TabItem[] = [
  { id: "partnerReviews", label: "Pending Partner Reviews" },
  { id: "videoKyc", label: "Pending Video KYC" },
  { id: "vehicleReviews", label: "Pending Vehicle Reviews" },
];
interface pendingTabsProps {
  partner : PendingPartnerType[]
  pendingKyc : PendingPartnerKyc[]
}
export function PendingTabs({partner,pendingKyc} : pendingTabsProps): React.ReactElement {
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
              {tab.id == "partnerReviews" ? partner.length : tab.id == "videoKyc" ? pendingKyc.length : 0}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl  border border-gray-100 shadow-sm p-6">
        {activeTab === "partnerReviews" && <PartnerReviewList partners={partner} />}
        {activeTab === "videoKyc" && <VideoKYCList kycList = {pendingKyc} />}
        {activeTab === "vehicleReviews" && <VehicleReviewList />}
      </div>
    </div>
  );
}