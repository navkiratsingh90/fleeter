import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/booking-model";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try{
  const { id } = await params;

  const booking = await Booking.findById(id)
    console.log(booking);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.bookingStatus !== "started") {
      return NextResponse.json(
        { success: false, message: "Ride must be started before completion" },
        { status: 400 }
      );
    }

    // Calculate duration in minutes from start (createdAt) to now
    const completedAt = new Date();
    const startTime = new Date(booking.createdAt);
    const durationMinutes = Math.floor(
      (completedAt.getTime() - startTime.getTime()) / (1000 * 60)
    );

    const fare = booking.fare || 0;
    const adminCommission = Number((fare * 0.1).toFixed(2));
    const partnerAmount = Number((fare - adminCommission).toFixed(2));

    booking.bookingStatus = "completed";
    booking.paymentStatus = "paid";
    booking.adminCommission = adminCommission;
    booking.partnerAmount = partnerAmount;
    booking.duration = durationMinutes;
    booking.completedAt = completedAt; // optional – add to your schema if needed

    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Ride completed successfully",
      fare,
      adminCommission,
      partnerAmount,
      duration: durationMinutes,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to complete ride" },
      { status: 500 }
    );
  }
}