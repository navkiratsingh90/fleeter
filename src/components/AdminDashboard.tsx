// import axios from 'axios'
// import React from 'react'

// const AdminDashboard = () => {
//   // const handleGetData = async () => {
//   //   try {
//   //     const data = axios.get("/api/admin/dashboard")
//   //     console.log(data);
//   //   } catch (error) {
//   //       console.error(error);
//   //   }
//   // }
//   return (
// 	<div>AdminDashboard</div>
//   )
// }

// export default AdminDashboard

// app/admin/partners/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/StatsCards";
import { PendingTabs } from "@/components/PendingTabs";

interface StatsType {
  totalPartners: number;
  totalApprovedPartners: number;
  totalPendingPartners: number;
  totalRejectedPartners: number;
}

interface PendingPartnerType {
  _id: string;
  name: string;
  email: string;
  vehicleType: string;
}

export default function AdminPartnersPage() {
  const [statsData, setStatsData] = useState<StatsType>({
    totalPartners: 0,
    totalApprovedPartners: 0,
    totalPendingPartners: 0,
    totalRejectedPartners: 0,
  });

  const [pendingPartners, setPendingPartners] = useState<
    PendingPartnerType[]
  >([]);

  const [loading, setLoading] = useState(true);

  const handleGetDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");

      console.log(data);

      setStatsData(data.stats);

      setPendingPartners(data.pendingPartnersReviews);
    } catch (error: any) {
      console.log(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-700">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] font-dm">
      <main className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className="mb-8">
          <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] font-semibold">
            Admin Overview
          </Badge>

          <h1 className="font-syne text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <StatsCards
          stats={{
            total: statsData.totalPartners,
            approved: statsData.totalApprovedPartners,
            pending: statsData.totalPendingPartners,
            rejected: statsData.totalRejectedPartners,
          }}
        />

        {/* Pending Partners */}
        <div className="mt-10">
          <PendingTabs 
          // partners={pendingPartners} 
          />
        </div>
      </main>
    </div>
  );
}