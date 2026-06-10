"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/StatsCards";
import { PendingTabs } from "@/components/PendingTabs";
import { AdminEarning } from "./AdminEarning";
import { IVehicle } from "@/models/vehicle-model";

interface StatsType {
  totalPartners: number;
  totalApprovedPartners: number;
  totalPendingPartners: number;
  totalRejectedPartners: number;
}

export interface PendingPartnerType {
  _id: string;
  name: string;
  email: string;
  vehicleType: string;
}

export interface PendingPartnerKyc {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  videoKycStatus: string;
  videoKycRoomId: string;
}

export default function AdminPartnersPage() {
  const [statsData, setStatsData] = useState<StatsType>({
    totalPartners: 0,
    totalApprovedPartners: 0,
    totalPendingPartners: 0,
    totalRejectedPartners: 0,
  });
  const [partnersKyc, setPartnerKyc] = useState<PendingPartnerKyc[]>([]);
  const [pendingVehicleReviews, setPendingVehicleReviews] = useState<IVehicle[]>([]);
  const [pendingPartners, setPendingPartners] = useState<PendingPartnerType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      setStatsData(data.stats);
      setPendingPartners(data.pendingPartnersReviews);
      setPendingVehicleReviews(data.pendingVehicleReviews);
    } catch (error: any) {
      console.log(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPendingKyc = async () => {
    try {
      const { data } = await axios.get("/api/admin/video-kyc/pending");
      setPartnerKyc(data.partners);
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getPendingKyc();
    handleGetDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4]">
        <h1 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] font-dm">
      <main className="max-w-7xl mx-auto px-4 py-10 md:py-12 space-y-8">
        
        {/* Header */}
        <div className="mb-8">
          <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] font-semibold">
            Admin Overview
          </Badge>
          <h1 className="font-syne text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
            Admin Dashboard
          </h1>
        </div>

        {/* Daily Earnings Section */}
        <div>
          <AdminEarning />
        </div>

        {/* Stats Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Partner Management</h2>
          <StatsCards
            stats={{
              total: statsData.totalPartners,
              approved: statsData.totalApprovedPartners,
              pending: statsData.totalPendingPartners,
              rejected: statsData.totalRejectedPartners,
            }}
          />
        </div>

        {/* Pending Partners */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Reviews</h2>
          <PendingTabs
            pendingKyc={partnersKyc}
            partner={pendingPartners}
            pendingVehicles={pendingVehicleReviews}
          />
        </div>
      </main>
    </div>
  );
}