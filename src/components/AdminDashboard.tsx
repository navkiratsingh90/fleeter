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

import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/StatsCards";
import { PendingTabs } from "@/components/PendingTabs";

// Mock data
const statsData = {
  total: 1,
  approved: 0,
  pending: 1,
  rejected: 0,
};

export default function AdminPartnersPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] font-dm">
      <main className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className="mb-8">
          <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] font-semibold">
            Admin Overview
          </Badge>
          <h1 className="font-syne text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
            Admin DashBoard
          </h1>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={statsData} />

        {/* Tabs Section */}
        <div className="mt-10">
          <PendingTabs />
        </div>
      </main>
    </div>
  );
}