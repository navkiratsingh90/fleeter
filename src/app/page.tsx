// import { auth } from "@/auth";
"use client"

import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import HeroSection from "@/components/HeroSection";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import PartnerDashboard from "@/components/PartnerDashboard";
import VehicleSlider from "@/components/VehicleSlider";
import InitUser from "@/InitUser";
import { getSocket } from "@/lib/socket";
import { handleUserData } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function HomePage() {

  const {data : session} = useSession();
  const userData = useAppSelector((state : RootState) => state.User.userData)
  // // console.log(session);
  // useEffect(() => {
  //   dispatch(handleUserData(session))
  // })
  // useEffect(() => {
  //   InitUser()

  // },[]) 
  // 
  // useEffect(() => {
	// 	const socket = getSocket()
	// 	socket.emit("identity",  userId : userData?._id)
	// },[userData])
  return (
    <main className="bg-[#0a0a0a] min-h-screen font-dm">
      <Navbar/>
      <GeoUpdater userId={userData?._id}/>
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