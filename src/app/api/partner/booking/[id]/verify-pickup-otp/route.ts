import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/booking-model";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { otp } = await req.json();

    const booking = await Booking.findById(params.id);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    if (
      booking.pickupOtp !== otp
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    if (
      booking.pickupOtpExpiresAt &&
      booking.pickupOtpExpiresAt < new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP expired",
        },
        { status: 400 }
      );
    }

    booking.pickupOtpVerified = true;
    booking.bookingStatus = "started";

    booking.pickupOtp = null;
    booking.pickupOtpExpiresAt = null;

    await booking.save();

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}