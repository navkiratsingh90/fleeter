"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, TrendingDown, IndianRupee, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EarningsData {
  date: string;
  day: string;
  earnings: number;
}

interface DailyEarningsResponse {
  success: boolean;
  totalEarnings: number;
  bestDay: number;
  bestDayDate: string;
  dailyAverage: number;
  todayEarnings: number;
  percentageChange: number;
  data: EarningsData[];
}

export function AdminEarning() {
  const [earnings, setEarnings] = useState<DailyEarningsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/admin/earning");
        setEarnings(data);
        setError(null);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <Card className="rounded-3xl border border-gray-200 p-8 text-center">
        <Loader2 className="mx-auto animate-spin text-[#22c55e]" size={40} />
        <p className="mt-4 text-gray-600 font-medium">Loading earnings...</p>
      </Card>
    );
  }

  if (error || !earnings) {
    return (
      <Card className="rounded-3xl border border-gray-200 p-8 text-center">
        <p className="text-red-600 font-medium">{error || "Failed to load earnings"}</p>
      </Card>
    );
  }

  const isPositive = earnings.percentageChange >= 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] font-semibold mb-3">
            Admin Dashboard
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Daily Earnings</h2>
          <p className="text-gray-600 text-sm mt-1">Last 7 days performance</p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-sm text-gray-600">Weekly Total</span>
          <div className="flex items-baseline gap-1">
            <IndianRupee size={24} className="text-[#22c55e]" strokeWidth={2} />
            <span className="text-4xl font-black text-gray-900">
              {Math.round(earnings.totalEarnings)}
            </span>
          </div>
          <div className={`flex items-center gap-1 ml-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span className="text-sm font-bold">
              {earnings.percentageChange > 0 ? "+" : ""}{earnings.percentageChange}% vs yesterday
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Best Day Card */}
        <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Best Day</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <IndianRupee size={18} className="text-[#22c55e]" strokeWidth={2} />
            <span className="text-3xl font-black text-gray-900">
              {Math.round(earnings.bestDay)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <Calendar size={12} className="inline mr-1" />
            {earnings.bestDayDate}
          </p>
        </Card>

        {/* Daily Average Card */}
        <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-blue-500" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Daily Avg</p>
          </div>
          <div className="flex items-baseline gap-1">
            <IndianRupee size={18} className="text-[#22c55e]" strokeWidth={2} />
            <span className="text-3xl font-black text-gray-900">
              {earnings.dailyAverage}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">per day</p>
        </Card>

        {/* Today Card */}
        <Card className="rounded-2xl border border-[#bbf7d0] bg-gradient-to-br from-[#f0fdf4] to-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={16} className="text-[#22c55e]" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a]">Today</p>
          </div>
          <div className="flex items-baseline gap-1">
            <IndianRupee size={18} className="text-[#22c55e]" strokeWidth={2} />
            <span className="text-3xl font-black text-gray-900">
              {Math.round(earnings.todayEarnings)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">today's earnings</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4">Earnings Chart</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={earnings.data}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
              }}
              formatter={(value) => `₹${value}`}
              labelFormatter={(label) => `Earnings: ${label}`}
            />
            <Bar
              dataKey="earnings"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Info Card */}
      <Card className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900 font-medium">
          📊 Based on <strong>paid bookings</strong> with admin commission included. Data refreshes daily.
        </p>
      </Card>
    </div>
  );
}

// Icon components
function Star({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function Sun({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function BarChart3({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M4 14h6v6H4zM14 10h6v10h-6z" fill="currentColor" opacity="0.1" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="10" width="6" height="10" />
    </svg>
  );
}