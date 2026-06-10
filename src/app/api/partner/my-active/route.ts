import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking-model";
import User from "@/models/user-model";
import "@/models/vehicle-model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const partner = await User.findOne({
      email: session.user.email,
    });

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: "Partner not found",
        },
        { status: 404 }
      );
    }

    const activeRide = await Booking.findOne({
      driver: partner._id,
      bookingStatus: {
        $in: ["confirmed", "started","completed"],
      },
    })
      .populate("user", "name email mobileNumber")
      .populate({
        path: "vehicle",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      activeRide,
    });
  } catch (error: any) {
    console.error("ACTIVE RIDE ERROR:");
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