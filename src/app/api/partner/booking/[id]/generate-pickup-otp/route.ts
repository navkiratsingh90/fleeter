import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/booking-model";
import { sendPickupOtp } from "@/lib/send-mail";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const booking = await Booking.findById(params.id)
      .populate("user", "name email");

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    const user = booking.user as {
      name?: string;
      email?: string;
    };

    if (!user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer email not found",
        },
        { status: 400 }
      );
    }

    const otp = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    booking.pickupOtp = otp;
    booking.pickupOtpVerified = false;

    booking.pickupOtpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await booking.save();

    await sendPickupOtp(
      user.email,
      otp
    );

    return NextResponse.json({
      success: true,
      message: "Pickup OTP sent successfully",
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to generate pickup OTP",
      },
      { status: 500 }
    );
  }
}