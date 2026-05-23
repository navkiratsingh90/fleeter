// import { auth } from "@/auth";
"use client"

import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import PartnerDashboard from "@/components/PartnerDashboard";
import VehicleSlider from "@/components/VehicleSlider";
import { useSession } from "next-auth/react";

export default function HomePage() {

  const {data : session} = useSession();
  console.log(session);
  

  return (
    <main className="bg-[#0a0a0a] min-h-screen font-dm">
      <Navbar/>
      {
        session?.user?.role === "partner" ? (
          <PartnerDashboard />
        ) : session?.user?.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <Home />
        )
      }
      <Footer/>
    </main>
  );
}