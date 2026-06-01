// import { auth } from "@/auth";
"use client"

import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import PartnerDashboard from "@/components/PartnerDashboard";
import VehicleSlider from "@/components/VehicleSlider";
import InitUser from "@/InitUser";
import { handleUserData } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function HomePage() {

  const {data : session} = useSession();
  // const dispatch = useAppDispatch()
  // // console.log(session);
  // useEffect(() => {
  //   dispatch(handleUserData(session))
  // })
  // useEffect(() => {
  //   InitUser()

  // },[]) 

  return (
    <main className="bg-[#0a0a0a] min-h-screen font-dm">
      <Navbar/>
      <InitUser />
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