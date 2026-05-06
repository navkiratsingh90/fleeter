
"use client"
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import VehicleSlider from "@/components/VehicleSlider";
import { usePathname } from "next/navigation";

// export const metadata: Metadata = {
//   title: "Veloce — Multi-Vendor Ride Sharing Platform",
//   description:
//     "The intelligent platform that unifies every commute option — motorbikes, sedans, SUVs, autos, electric buses — under one smart dispatch network.",
// };

/* ─── Feature strip data ─────────────────────────────── */
const FEATURES = [
  { icon: "⚡", text: "Sub-second dispatch routing" },
  { icon: "🔒", text: "End-to-end trip encryption" },
  { icon: "📊", text: "Real-time vendor analytics" },
  { icon: "🌐", text: "Multi-city scalable infra" },
  { icon: "🤖", text: "AI-powered demand forecasting" },
] as const;

/* ─── Footer columns ─────────────────────────────────── */
const FOOTER_COLS = [
  {
    title: "Platform",
    links: ["Dispatch Engine", "Vendor Portal", "Analytics", "API Docs"],
  },
  {
    title: "Vehicles",
    links: ["Motorbike", "Economy", "Premium SUV", "Electric Bus"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Contact"],
  },
] as const;

export default function HomePage() {
  const pathname = usePathname()
  return (
    <main className="bg-[#0a0a0a] min-h-screen font-dm">

      <Home/>
      
    </main>
  );
}